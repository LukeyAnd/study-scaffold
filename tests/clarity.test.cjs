const test=require('node:test'),assert=require('node:assert/strict'),N=require('../clarity.js');
const bank={id:'biology',title:'Biology',topics:[{id:'cells',name:'Cells'}],objectives:[{id:'transport',description:'Explain transport'}],sources:[{id:'notes',title:'My notes',version:2}]};
const q={id:'osmosis',topic:'cells',angle:'Osmosis',skill:'Concepts',objectiveIds:['transport'],sourceRefs:[{sourceId:'notes',locator:'p. 4'}]};
const raw={prompt:'What drives transport?',options:[{text:'A',correct:true},{text:'B',correct:false},{text:'C',correct:false},{text:'D',correct:false}],concept:'SECRET FEEDBACK',correct:'A'};
const note=()=>({...N.draft(N.capture(bank,q,raw)),text:'Dictation: why is this different from diffusion?'});
const png=()=>new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64')],{type:'image/png'});
test('note context preserves question/objective/source links without revealing the answer key',()=>{
 const n=note();assert.equal(n.context.questionId,q.id);assert.equal(n.context.objectives[0].description,'Explain transport');assert.equal(n.context.sources[0].version,'2');assert.deepEqual(n.context.options,['A','B','C','D']);assert.ok(!JSON.stringify(n.context).includes('SECRET FEEDBACK'));assert.ok(!JSON.stringify(n.context).includes('correct'));
});
test('notes retain literal transcript/explanation text and reject invalid scope, dates and size',()=>{
 const n=note();n.text='<img src=x onerror=alert(1)>';n.explanation='A saved explanation';assert.equal(N.normalize(n,bank.id).text,n.text);
 for(const change of [x=>x.context.bankId='other',x=>x.text='x'.repeat(N.LIMITS.text+1),x=>x.createdAt=-1,x=>x.revision=-1,x=>x.images=[{}]]){const bad=note();change(bad);assert.throws(()=>N.normalize(bad,bank.id));}
});
test('image content must match an allowed raster MIME type and stay within the size limit',async()=>{
 await N.checkImage(png());await assert.rejects(()=>N.checkImage(new Blob(['<svg onload="alert(1)"/>'],{type:'image/png'})),/not a supported/);await assert.rejects(()=>N.checkImage(new Blob(['svg'],{type:'image/svg+xml'})),/PNG/);await assert.rejects(()=>N.checkImage(new Blob([new Uint8Array(N.LIMITS.imageBytes+1)],{type:'image/png'})),/4 MB/);
});
test('a notes backup round trip preserves image bytes and context, with no runtime Blob in JSON',async()=>{
 const n=note();n.images=[await N.image(png())];const data=await N.archive([n],bank.id),portable=JSON.parse(JSON.stringify(data)),restored=await N.readArchive(portable,bank.id);
 assert.match(portable.notes[0].images[0].data,/^data:image\/png;base64,/);assert.equal(portable.notes[0].images[0].blob,undefined);assert.equal(restored[0].context.questionId,q.id);assert.deepEqual(Buffer.from(await restored[0].images[0].blob.arrayBuffer()),Buffer.from(await png().arrayBuffer()));
 await assert.rejects(()=>N.readArchive(portable,'another-class'),/this class/);portable.notes.push(portable.notes[0]);await assert.rejects(()=>N.readArchive(portable,bank.id),/duplicate/);
});
test('help prompts retain the learner question, cite available source locations and require explicit image handoff',async()=>{
 const n=note();n.images=[await N.image(png())];const prompt=N.helpPrompt(n);assert.ok(prompt.includes(n.text));assert.ok(prompt.includes('p. 4'));assert.ok(prompt.includes('Images are stored locally'));assert.ok(prompt.includes('Offer a hint before revealing'));assert.ok(!prompt.includes('SECRET FEEDBACK'));assert.ok(!prompt.includes('data:image/'));
});
test('text-only fallback saves separately by class and rejects stale edits instead of overwriting',async()=>{
 const values=new Map(),previous=global.localStorage;global.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 try{
  const a=await N.open(bank.id),b=await N.open(bank.id),other=await N.open('chemistry');assert.equal(a.mode,'Browser storage');const original=note(),saved=await a.save(original);assert.equal(saved.revision,1);assert.equal(other.list().length,0);
  await assert.rejects(()=>b.save(original),/another tab/);const reopened=await N.open(bank.id);assert.equal(reopened.list()[0].text,original.text);
  const stale=reopened.list()[0];await a.save({...saved,text:'Updated'});await assert.rejects(()=>reopened.remove(stale),/another tab/);assert.equal((await N.open(bank.id)).list()[0].text,'Updated');
  const withImage={...a.list()[0],images:[await N.image(png())]};await assert.rejects(()=>a.save(withImage),/Images need/);
 }finally{if(previous===undefined)delete global.localStorage;else global.localStorage=previous;}
});
