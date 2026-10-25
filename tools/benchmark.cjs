/* Maintainer-only deterministic sampler comparison; no subject/learning claims. */
const {performance}=require('node:perf_hooks'),assert=require('node:assert/strict');
const E=require('../core.js'),{random,referencePlan}=require('../tests/helpers/reference-plan.cjs');
const pool=Array.from({length:5000},(_,i)=>({id:`q-${i}`,topic:'benchmark'}));
const state=E.empty('benchmark'),now=Date.UTC(2026,9,24),count=1000;
pool.forEach((q,i)=>{if(i%3===0)E.record(state,q,i%2===0,'auto',1000,'quiz',now-E.DAY);});
function measure(fn){const times=[];for(let seed=1;seed<=3;seed++){const start=performance.now();const result=fn(pool,state,count,'recommended',random(seed),now);times.push(performance.now()-start);assert.equal(new Set(result.map(q=>q.id)).size,count);}return times.sort((a,b)=>a-b)[1];}
for(let seed=1;seed<=3;seed++)assert.deepEqual(E.plan(pool,state,count,'recommended',random(seed),now).map(q=>q.id),referencePlan(pool,state,count,'recommended',random(seed),now).map(q=>q.id));
const previousMs=measure(referencePlan),currentMs=measure(E.plan);
console.log(JSON.stringify({families:pool.length,questions:count,repeats:3,node:process.version,previousMedianMs:Math.round(previousMs*100)/100,currentMedianMs:Math.round(currentMs*100)/100,speedup:Math.round(previousMs/currentMs*10)/10,replayMatched:true},null,2));
