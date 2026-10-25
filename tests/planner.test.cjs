const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../core.js'),{random,referencePlan}=require('./helpers/reference-plan.cjs');
const now=Date.UTC(2026,9,24),pool=Array.from({length:64},(_,i)=>({id:`q-${i}`,topic:`unit-${i%4}`,skill:'Concepts'}));
function history(){
 const state=E.empty('simulation');
 pool.forEach((q,i)=>{if(i%4===0)return;for(let attempt=0;attempt<(i%4===1?1:4);attempt++)E.record(state,q,i%4!==1,'auto',1000,'quiz',now-(i%4===3?12:1)*E.DAY+attempt);});
 return state;
}
test('seeded replay preserves previous weighted/uniform plans across mixed learning histories',()=>{
 const state=history(),before=JSON.stringify(state);
 for(const target of ['recommended','missed','due','balanced'])for(let seed=1;seed<=50;seed++)for(const count of [1,10,64]){
  const actual=E.plan(pool,state,count,target,random(seed),now),expected=referencePlan(pool,state,count,target,random(seed),now);
  assert.deepEqual(actual.map(q=>q.id),expected.map(q=>q.id),`${target}, seed ${seed}, count ${count}`);
 }
 assert.equal(JSON.stringify(state),before);
});
test('planner removes selected weights even at RNG boundaries and partial tree sizes',()=>{
 const state=history(),subset=pool.slice(0,19);
 for(const rng of [()=>0,()=>1,()=>.5])for(const target of ['recommended','balanced']){
  const result=E.plan(subset,state,100,target,rng,now);
  assert.equal(result.length,19);assert.ok(result.every(Boolean));assert.equal(new Set(result.map(q=>q.id)).size,19);
 }
 assert.deepEqual(E.plan(pool,state,NaN),[]);assert.deepEqual(E.plan(pool,state,-1),[]);assert.equal(E.plan(pool,state,2.9).length,2);
 assert.equal(E.plan([pool[0],pool[0],pool[1]],state,3).length,2);
 const empty=E.empty('boundary');
 for(const target of ['recommended','balanced'])for(const value of [0,.25,.5,.75]){
  const four=pool.slice(0,4),actual=E.plan(four,empty,4,target,()=>value,now),expected=referencePlan(four,empty,4,target,()=>value,now);
  assert.deepEqual(actual.map(q=>q.id),expected.map(q=>q.id));
 }
});
test('large plans remain unique and respect a smaller filtered pool',()=>{
 const large=Array.from({length:5000},(_,i)=>({id:`large-${i}`,topic:'large'})),state=E.empty('large');
 const result=E.plan(large,state,5000,'recommended',random(42),now);
 assert.equal(new Set(result.map(q=>q.id)).size,5000);
 assert.deepEqual(E.plan(large,state,50,'due'),[]);
});
