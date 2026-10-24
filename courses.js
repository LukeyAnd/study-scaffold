/* Course metadata and safe JSON-bank compilation. No eval, scripts, or network. */
(function(root){
  'use strict';
  const E=root.StudyEngine||(typeof require==='function'?require('./core.js'):null);
  const text=v=>typeof v==='string'&&!!v.trim();
  const id=v=>text(v)&&/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(v)&&!['constructor','prototype','__proto__'].includes(v);
  const requireValue=(value,message)=>{if(!value)throw Error(message);};
  function validate(data){
    requireValue(data&&id(data.id)&&text(data.title),'A course needs a stable ID and class name.');
    requireValue(data.subject===undefined||text(data.subject),'Subject must be nonempty text.');
    requireValue(data.reviewStatus===undefined||text(data.reviewStatus),'Review status must be text.');
    const sets={};
    for(const field of ['topics','objectives','sources','questions']){
      const entries=data[field];requireValue(Array.isArray(entries)&&entries.length&&entries.length<=5000,`A course needs 1–5,000 ${field}.`);
      requireValue(entries.every(e=>e&&id(e.id)),`Each ${field} entry needs a safe ID.`);
      sets[field]=new Set(entries.map(e=>e.id));requireValue(sets[field].size===entries.length,`Duplicate IDs in ${field}.`);
    }
    requireValue(data.topics.every(t=>text(t.name)),'Every module needs a name.');
    requireValue(data.objectives.every(o=>text(o.description)),'Every objective needs a description.');
    requireValue(data.sources.every(s=>text(s.title)&&text(s.locator)),'Every source needs a title and locator.');
    requireValue(data.glossary===undefined||data.glossary&&typeof data.glossary==='object'&&!Array.isArray(data.glossary)&&Object.entries(data.glossary).every(([k,v])=>text(k)&&text(v)),'Glossary entries must be text.');
    for(const q of data.questions){
      requireValue(q.format==='mcq'&&sets.topics.has(q.topic)&&text(q.angle)&&text(q.skill),`${q.id}: use MCQ format, a known module, an angle, and a skill.`);
      requireValue(Array.isArray(q.objectiveIds)&&q.objectiveIds.length&&q.objectiveIds.every(x=>sets.objectives.has(x)),`${q.id}: link known objectives.`);
      requireValue(Array.isArray(q.sourceRefs)&&q.sourceRefs.length&&q.sourceRefs.every(r=>r&&sets.sources.has(r.sourceId)&&text(r.locator)),`${q.id}: link sources and locations.`);
      requireValue(Array.isArray(q.variants)&&q.variants.length,`${q.id}: add question variants.`);
      for(const v of q.variants){
        requireValue(v&&['prompt','correct','concept'].every(k=>text(v[k]))&&Array.isArray(v.distractors)&&v.distractors.length===3&&v.distractors.every(text)&&Array.isArray(v.whyWrong)&&v.whyWrong.length===3&&v.whyWrong.every(text),`${q.id}: each variant needs a prompt, four choices, and explanations.`);
        requireValue(new Set([v.correct,...v.distractors].map(t=>t.trim().toLowerCase())).size===4,`${q.id}: answer choices must be distinct.`);
        requireValue(v.math===undefined||typeof v.math==='string',`${q.id}: worked solution must be text.`);
      }
    }
    return data;
  }
  function compile(input){
    const data=validate(JSON.parse(JSON.stringify(input)));
    const sources=new Map(data.sources.map(s=>[s.id,s]));
    return E.validateBank({...data,subject:data.subject?.trim()||'General',questions:data.questions.map(q=>({...q,generate(){
      const v=q.variants[Math.floor(Math.random()*q.variants.length)];
      const refs=q.sourceRefs.map(r=>`${sources.get(r.sourceId).title} — ${r.locator}`).join('; ');
      return {...v,distractors:[...v.distractors],whyWrong:[...v.whyWrong],concept:`${v.concept}\n\nSources: ${refs}`};
    }}))});
  }
  function subject(bank){return text(bank.subject)?bank.subject.trim():'General';}
  function groups(entries){
    const map=new Map();for(const entry of entries){const name=subject(entry.bank);if(!map.has(name))map.set(name,[]);map.get(name).push(entry);}
    return [...map].sort(([a],[b])=>a.localeCompare(b)).map(([name,items])=>({name,items:items.sort((a,b)=>a.bank.title.localeCompare(b.bank.title))}));
  }
  function compatible(previous,next){
    if(previous.id!==next.id)return false;
    const topics=new Set(next.topics.map(t=>t.id)),qs=new Map(next.questions.map(q=>[q.id,q.topic]));
    return previous.topics.every(t=>topics.has(t.id))&&previous.questions.every(q=>qs.get(q.id)===q.topic);
  }
  const stable=value=>Array.isArray(value)?'['+value.map(stable).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stable(value[k])).join(',')+'}':JSON.stringify(value);
  function append(previous,added,field){
    requireValue(added===undefined||Array.isArray(added),`${field} must be a list.`);
    const result=[...previous],map=new Map(result.map(e=>[e.id,e]));
    for(const entry of added||[]){requireValue(entry&&id(entry.id),`${field} entries need safe IDs.`);if(map.has(entry.id)){requireValue(stable(map.get(entry.id))===stable(entry),`${field}: ${entry.id} already exists with different content. Use a new ID for a new objective.`);}else{result.push(entry);map.set(entry.id,entry);}}
    return result;
  }
  function compileEntry(raw,bases){
    if(raw.kind!=='sos-course-additions')return compile(raw);
    const base=bases.get(raw.id);
    requireValue(raw.version===1&&raw.baseBankId===raw.id&&base,'This additions file needs the original bundled class.');
    const data={...raw,topics:[...base.topics,...raw.topics],objectives:[...(base.objectives||[]),...raw.objectives],sources:[...(base.sources||[]),...raw.sources]};
    const extra=compile(data);
    return E.validateBank({...base,title:extra.title,subject:extra.subject,topics:extra.topics,objectives:extra.objectives,sources:extra.sources,glossary:{...base.glossary,...raw.glossary},questions:[...base.questions,...extra.questions]});
  }
  function addMaterial(entry,patch,bases){
    requireValue(patch&&patch.kind==='sos-course-patch'&&patch.version===1&&patch.bankId===entry.bank.id,'Choose an additions file for this class (sos-course-patch, version 1).');
    requireValue(Array.isArray(patch.questions)&&patch.questions.length,'An additions file needs at least one question.');
    requireValue(patch.glossary===undefined||patch.glossary&&typeof patch.glossary==='object'&&!Array.isArray(patch.glossary),'Glossary additions must be an object.');
    let raw=entry.raw?JSON.parse(JSON.stringify(entry.raw)):{kind:'sos-course-additions',version:1,id:entry.bank.id,baseBankId:entry.bank.id,title:entry.bank.title,subject:subject(entry.bank),topics:[],objectives:[],sources:[],questions:[],glossary:{}};
    const base=raw.kind==='sos-course-additions'?bases.get(raw.id):null;
    for(const field of ['topics','objectives','sources','questions']){
      requireValue(patch[field]===undefined||Array.isArray(patch[field]),`${field} must be a list.`);
      const original=base?.[field]||[];
      const additions=(patch[field]||[]).filter(e=>{
        const existing=original.find(x=>x.id===e?.id);if(!existing)return true;
        const same=field==='topics'?existing.name===e.name:stable(existing)===stable(e);
        requireValue(same,`${field}: ${e.id} is part of the original course. Existing content cannot be overwritten.`);return false;
      });
      raw[field]=append(raw[field]||[],additions,field);
    }
    const glossary={...entry.bank.glossary};
    for(const [term,definition] of Object.entries(patch.glossary||{})){requireValue(text(term)&&text(definition),'Glossary additions must contain text.');requireValue(glossary[term]===undefined||glossary[term]===definition,`The glossary term ${term} already has a different definition.`);glossary[term]=definition;}
    raw.glossary={...raw.glossary,...patch.glossary};
    const bank=compileEntry(raw,bases);requireValue(compatible(entry.bank,bank),'This addition would change existing course IDs.');return {raw,bank};
  }
  const api={validate,compile,compileEntry,addMaterial,subject,groups,compatible};root.StudyCourses=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
