const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../core.js'),S=require('../storage.js'),N=require('../clarity.js');
const now=Date.UTC(2026,9,24),q={id:'kept',topic:'unit'},oldQ={id:'retired',topic:'unit'},bank={id:'audit',questions:[q]};
test('early correct practice does not inflate intervals; Secure requires a due return and expires',()=>{
 const state=E.empty(bank.id);
 for(let i=0;i<7;i++)E.record(state,q,true,'auto',100,'quiz',now+i*60000);
 const r=state.records.kept;assert.equal(r.interval,.5);assert.equal(r.due,now+E.DAY/2);assert.equal(r.attempts,7);assert.equal(r.streak,1);assert.equal(E.secure(r,now+360000),false);
 E.record(state,q,true,'auto',100,'quiz',r.due);assert.equal(r.interval,2);assert.equal(r.delayedCorrects,1);assert.equal(E.secure(r,r.lastAt),true);assert.equal(E.summary([q],state,r.due).secure,0);
 E.record(state,q,false,'auto',100,'quiz',r.lastAt+1);assert.equal(r.delayedCorrects,0);assert.equal(E.secure(r,r.lastAt),false);
 const legacy={...r,attempts:7,correct:7,recent:[true,true,true],due:now+64*E.DAY,interval:64};delete legacy.delayedCorrects;
 assert.equal(E.secure(legacy,now),false);state.records.kept=legacy;E.record(state,q,true,'auto',100,'quiz',now);assert.equal(legacy.due,now+64*E.DAY);
});
test('retirement recovery preserves matching history, refuses malformed removed rows and keeps unaffected deadlines',()=>{
 const state=E.empty(bank.id);for(const item of[q,oldQ])E.record(state,item,true,'auto',1,'quiz',now);
 const original=S.snapshot(bank,state,null,null,['retired','kept'],null,now),before=JSON.stringify(original);
 const result=S.reconcile(original,bank);assert.deepEqual(result.removed,['retired']);assert.deepEqual(result.data.state.events.map(e=>e.id),['kept']);assert.equal(JSON.stringify(original),before);
 const invalid=structuredClone(original);invalid.state.records.retired.attempts=-1;assert.throws(()=>S.reconcile(invalid,bank));
 const c={q,raw:{prompt:'P',correct:'A',options:['A','B','C','D'].map((text,i)=>({text,correct:i===0}))},selected:null,answered:false,elapsedMs:0,firstChoiceMs:null,changes:0,pauses:0};
 const session={mode:'exam',pool:[q],queue:[q],total:1,position:0,answers:[],startedAt:now,deadline:now+60000,ended:false};
 const saved=S.snapshot(bank,state,session,c,[],null,now);assert.equal(S.reconcile(saved,bank).data.session.deadline,session.deadline);
 saved.session.pool=['retired'];saved.session.queue=['retired'];saved.current.q='retired';assert.equal(S.reconcile(saved,bank).sessionClosed,true);assert.equal(S.reconcile(saved,bank).data.current,null);
 assert.doesNotThrow(()=>S.validate(result.data,bank));
});
test('planner stays unique across floating boundaries and agrees with an independent probability oracle',()=>{
 // Frozen synthetic legacy records reproduce the original 14/21 collision.
 const fixture=require('./fixtures/planner-floating.json'),edgePool=Array.from({length:63},(_,i)=>({id:'q'+i,topic:'t'}));
 const edge=E.plan(edgePool,{...E.empty('floating'),records:fixture.records},21,'recommended',()=>.5,fixture.now);assert.equal(new Set(edge.map(q=>q.id)).size,21);
 for(const size of[3,19,63,127]){
  const pool=Array.from({length:size},(_,i)=>({id:'q'+i,topic:'t'})),state=E.empty('p');
  pool.forEach((p,i)=>{E.record(state,p,i%3!==0,'auto',1,'quiz',now-i*E.DAY);});
  for(const value of[0,Number.EPSILON,.25,.5,.75,1-Number.EPSILON,1])for(const target of['balanced','recommended']){
   const plan=E.plan(pool,state,size,target,()=>value,now);assert.equal(plan.length,size);assert.equal(new Set(plan).size,size);assert.ok(plan.every(Boolean));
  }
 }
 const pool=[q,oldQ,{id:'new',topic:'unit'}],state=E.empty(bank.id);E.record(state,q,false,'auto',1,'quiz',now);
 // A dense uniform grid approximates the categorical distribution directly,
 // independently of either sampler's implementation.
 const weights=pool.map(p=>E.priority(p,state,now)),total=weights.reduce((a,b)=>a+b),counts=new Map(pool.map(p=>[p.id,0]));
 for(let i=0;i<12000;i++){const [pick]=E.plan(pool,state,1,'recommended',()=>(i+.5)/12000,now);counts.set(pick.id,counts.get(pick.id)+1);}
 pool.forEach((p,i)=>assert.ok(Math.abs(counts.get(p.id)/12000-weights[i]/total)<1/12000));
});
function note(i=0){return {id:`n-${i}`,context:{bankId:'audit',classTitle:'Test',questionId:'kept',topicId:'unit',topicName:'Unit',concept:'Concept',skill:'Concepts',prompt:'P',options:['A','B','C','D'],objectives:[],sources:[]},text:'Question',explanation:'',resolved:false,createdAt:now,updatedAt:now,revision:0,images:[]};}
test('large multilingual notes and images export into importable lossless parts',async()=>{
 const blob=new Blob([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.alloc(N.LIMITS.imageBytes-8)],{type:'image/png'});
 const notes=Array.from({length:200},(_,i)=>({...note(i),text:'漢'.repeat(12000),explanation:'字'.repeat(12000),context:{...note(i).context,prompt:'語'.repeat(10000)},images:i<2?Array.from({length:3},(_,j)=>({id:`image-${i}-${j}`,name:'test.png',type:'image/png',blob})):[]}));
 const parts=await N.archiveParts(notes,'audit');assert.ok(parts.length>1);let restored=[];
 for(const part of parts){const json=JSON.stringify(part,null,2);assert.ok(Buffer.byteLength(json)<=N.LIMITS.importBytes);restored.push(...await N.readArchive(JSON.parse(json),'audit'));}
 assert.equal(restored.length,200);assert.equal(restored[199].text,notes[199].text);assert.deepEqual(Buffer.from(await restored[0].images[0].blob.arrayBuffer()),Buffer.from(await blob.arrayBuffer()));
});
test('fresh stored reads, queued snapshot ownership, multipart merges and raw corrupt-note recovery',async()=>{
 const values=new Map(),previous=global.localStorage;global.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const store=await S.open('audit');
 try{
  const state=E.empty('audit'),data=S.snapshot(bank,state,null,null,[],null,now,false),pending=store.save(data);state.sessions.push({private:'later mutation'});await pending;
  assert.deepEqual(JSON.parse(await store.readStored()).state.sessions,[]);
  values.set('study-scaffold:audit:v2',JSON.stringify({revision:2,data:{marker:'newer tab'}}));assert.equal(JSON.parse(await store.readStored()).marker,'newer tab');
  values.set('sos-clarity:audit:v1','not-json');const broken=await N.open('audit');assert.equal(broken.readable,false);assert.equal((await broken.readStored()).rawText,'not-json');await assert.rejects(()=>broken.save(note()),/could not be read/);broken.close();
  values.delete('sos-clarity:audit:v1');const notes=await N.open('audit');await notes.merge([note(1)]);await notes.merge([note(0)]);assert.equal(notes.list().length,2);await assert.rejects(()=>notes.merge([note(1)]),/already loaded/);assert.equal(notes.list().length,2);notes.close();
 }finally{store.close();if(previous===undefined)delete global.localStorage;else global.localStorage=previous;}
});
