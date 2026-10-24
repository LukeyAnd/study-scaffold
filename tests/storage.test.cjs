const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../core.js'),S=require('../storage.js');
const q={id:'one',topic:'unit',skill:'Concepts',generate:()=>({prompt:'Choose one',correct:'Yes',distractors:['No','Maybe','Never'],concept:'Explanation'})};
const bank={id:'storage-test',topics:[{id:'unit',name:'Unit'}],questions:[q]};
function fixture(answered=false){
  const state=E.empty(bank.id),c={q,raw:E.materialize(q),selected:answered?0:null,answered,confidence:'auto',elapsedMs:2500,firstChoiceMs:answered?1200:null,changes:0,pauses:0,start:100,reason:'New'};
  const session={mode:'quiz',pool:[q],queue:[q],total:1,position:0,answers:answered?[{...c}]:[],startedAt:100,deadline:0,ended:false};
  return {state,c,session,data:S.snapshot(bank,state,session,c,['one'],null,1000)};
}
test('workspace preserves the exact generated question, choice order and selected answer',()=>{
  const {data}=fixture();data.current.selected=2;data.current.firstChoiceMs=1200;
  const restored=S.unpack(JSON.parse(JSON.stringify(data)),bank);
  assert.equal(restored.current.q,q);assert.equal(restored.session.pool[0],q);
  assert.deepEqual(restored.current.raw.options,data.current.raw.options);assert.equal(restored.current.selected,2);
  assert.equal(restored.current.elapsedMs,2500);
});
test('saved feedback remains submitted and cannot count as a fresh answer',()=>{
  const {data}=fixture(true);const restored=S.unpack(data,bank);
  assert.equal(restored.current.answered,true);assert.equal(restored.session.answers.length,1);
  data.current.selected=(data.current.selected+1)%4;assert.throws(()=>S.validate(data,bank),/does not match/);
});
test('legacy progress imports without inventing a saved session',()=>{
  const old=E.empty(bank.id);E.record(old,q,true,'sure',1234,'quiz',100);
  const restored=S.unpack(old,bank);assert.deepEqual(restored.state,old);assert.equal(restored.session,null);
});
test('invalid workspace references, timing and session positions are rejected',()=>{
  for(const mutate of [d=>d.bankId='wrong',d=>d.current.q='missing',d=>d.current.elapsedMs=-1,d=>d.current.firstChoiceMs=9000,d=>d.session.position=1,d=>d.session.queue=['missing'],d=>d.current.raw.options[0].correct=!d.current.raw.options[0].correct]){
    const {data}=fixture();mutate(data);assert.throws(()=>S.validate(data,bank));
  }
});
test('snapshot is detached from mutable UI state and contains no bank functions',()=>{
  const {data,c,session}=fixture();c.raw.prompt='Changed';session.pool.length=0;
  assert.equal(data.current.raw.prompt,'Choose one');assert.deepEqual(data.session.pool,['one']);
  assert.equal(typeof data.current.q,'string');
});
test('active response time never changes mastery or review scheduling',()=>{
  const a=E.empty(bank.id),b=E.empty(bank.id);
  for(let i=0;i<4;i++){
    E.record(a,q,true,'auto',500,'quiz',100+i,{selectionMs:300,changes:0,interrupted:false});
    E.record(b,q,true,'auto',500000,'quiz',100+i,{selectionMs:300000,changes:2,interrupted:true});
  }
  assert.equal(a.records.one.due,b.records.one.due);assert.equal(E.mastery(a.records.one,104),E.mastery(b.records.one,104));
  assert.doesNotThrow(()=>E.validateState(a,bank));assert.doesNotThrow(()=>E.validateState(b,bank));
  a.events[0].selectionMs=501;assert.throws(()=>E.validateState(a,bank),/invalid activity/);
});
