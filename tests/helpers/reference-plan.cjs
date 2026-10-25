/* Frozen pre-1.2 sampler for replay/benchmark comparisons, never app runtime. */
const E=require('../../core.js');
function random(seed){return ()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);}
function referencePlan(pool,state,count,target='recommended',rng=Math.random,now=Date.now()){
 let candidates=[...pool];
 if(target==='missed')candidates=candidates.filter(q=>E.recordFor(state,q.id)?.recent.at(-1)===false);
 if(target==='due')candidates=candidates.filter(q=>E.recordFor(state,q.id)?.attempts&&E.recordFor(state,q.id).due<=now);
 const chosen=[];
 while(candidates.length&&chosen.length<count){
  const q=target==='balanced'?candidates[Math.floor(rng()*candidates.length)]:E.choose(candidates,state,[],rng,now);
  chosen.push(q);candidates=candidates.filter(x=>x.id!==q.id);
 }
 return chosen;
}
module.exports={random,referencePlan};
