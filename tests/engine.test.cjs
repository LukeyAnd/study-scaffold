const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const E = require('../core.js');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('banks/tax.js','utf8'), context);
const bank = context.STUDY_BANK;
const now = 1700000000000;

test('all supplied generators produce complete, distinct choices across randomized runs', () => {
  E.validateBank(bank);
  assert.equal(bank.questions.length,54);
  assert.equal(bank.topics.length,9);
  for(const q of bank.questions) for(let i=0;i<100;i++) {
    const raw = E.materialize(q);
    assert.equal(raw.options.filter(o=>o.correct).length,1,q.id);
    assert.equal(new Set(raw.options.map(o=>o.text)).size,4,q.id);
    assert.ok(raw.concept && raw.math,q.id);
  }
});
test('one correct answer cannot produce secure mastery; mistakes lower it', () => {
  const state=E.empty(bank.id), q=bank.questions[0];
  E.record(state,q,true,'sure',10000,'adaptive',now);
  assert.ok(E.mastery(state.records[q.id],now)<80);
  E.record(state,q,true,'sure',10000,'adaptive',now+1);
  E.record(state,q,true,'sure',10000,'adaptive',now+2);
  assert.equal(E.mastery(state.records[q.id],now+2),100);
  const oldDue=state.records[q.id].due;
  E.record(state,q,false,'sure',10000,'adaptive',now+3);
  assert.ok(E.mastery(state.records[q.id],now+3)<80);
  assert.ok(state.records[q.id].due<oldDue);
  assert.equal(state.records[q.id].streak,0);
});
test('uncertain correct answers shorten the review interval', () => {
  const a=E.empty(bank.id),b=E.empty(bank.id),q=bank.questions[0];
  E.record(a,q,true,'unsure',10000,'quiz',now);E.record(b,q,true,'sure',10000,'quiz',now);
  assert.ok(a.records[q.id].due<b.records[q.id].due);
});
test('cooldown excludes the previous fifteen questions in a broad pool and rotates all six in a module',()=>{
  const state=E.empty(bank.id), recent=bank.questions.slice(0,15).map(q=>q.id);
  for(let i=0;i<100;i++)assert.ok(!recent.includes(E.choose(bank.questions,state,recent).id));
  const pool=bank.questions.slice(0,6);let seen=[];
  for(let i=0;i<6;i++)seen.push(E.choose(pool,state,seen,()=>0).id);
  assert.equal(new Set(seen).size,6);
  assert.ok(E.choose([pool[0]],state,[pool[0].id]));
  assert.equal(E.choose([],state),null);
});
test('exam plans are unique, respect filters, and do not silently fill an empty review pool',()=>{
  const state=E.empty(bank.id), q=bank.questions[0];
  assert.equal(E.plan(bank.questions,state,10,'due').length,0);
  assert.equal(E.plan(bank.questions,state,10,'missed').length,0);
  E.record(state,q,false,'okay',100,'quiz',now);
  assert.deepEqual(E.plan(bank.questions,state,10,'missed',Math.random,now).map(q=>q.id),[q.id]);
  const planned=E.plan(bank.questions.slice(0,6),state,100);
  assert.equal(planned.length,6);assert.equal(new Set(planned.map(q=>q.id)).size,6);
});
test('weak and due questions get a higher selection weight than secure questions',()=>{
  const state=E.empty(bank.id),[weak,strong]=bank.questions;
  E.record(state,weak,false,'sure',1000,'quiz',now);
  for(let i=0;i<4;i++)E.record(state,strong,true,'sure',1000,'quiz',now+i);
  assert.ok(E.priority(weak,state,now)>E.priority(strong,state,now));
});
test('coverage includes unseen questions; corrupted and foreign backups are rejected',()=>{
  const state=E.empty(bank.id),q=bank.questions[0];E.record(state,q,true,'okay',1000,'quiz',now);
  assert.equal(E.summary(bank.questions,state,now).seen,1);
  assert.ok(E.summary(bank.questions,state,now).mastery<5);
  assert.doesNotThrow(()=>E.validateState(JSON.parse(JSON.stringify(state)),bank));
  assert.throws(()=>E.validateState({...state,bankId:'other'},bank));
  const bad=JSON.parse(JSON.stringify(state));bad.records[q.id].recent=['yes'];
  assert.throws(()=>E.validateState(bad,bank));
  assert.throws(()=>E.validateState({...state,events:[null]},bank));
});
test('duplicate answer generators fail explicitly instead of inventing a label',()=>{
  assert.throws(()=>E.materialize({id:'bad',generate:()=>({prompt:'x',correct:'1',distractors:['1','2','3']})}),/Duplicate choices/);
});
test('example replacement bank works without tax-specific dependencies',()=>{
  const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('banks/example.js','utf8'),ctx);
  E.validateBank(ctx.STUDY_BANK);for(const q of ctx.STUDY_BANK.questions)assert.equal(E.materialize(q).options.length,4);
});
