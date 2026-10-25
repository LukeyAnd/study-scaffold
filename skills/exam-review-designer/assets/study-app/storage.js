/* Local workspace database and portable, validated snapshots. No network access. */
(function (root) {
  'use strict';
  const E = root.StudyEngine || (typeof require === 'function' ? require('./core.js') : null);
  const clone = value => JSON.parse(JSON.stringify(value));
  const finite = n => Number.isFinite(n) && n >= 0;
  const dateKey = at => { const d = new Date(at); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  function packAnswer(c) { return c ? {...c, q:c.q.id} : null; }
  function snapshot(bank, state, session, current, recent, results, now=Date.now()) {
    return clone({format:'sos-workspace', version:2, bankId:bank.id, savedAt:now, state,
      session:session && {...session, pool:session.pool.map(q=>q.id), queue:session.queue?.map(q=>q.id)||null, answers:session.answers.map(packAnswer)},
      current:packAnswer(current), recent,
      results:results && {...results, answers:results.answers.map(packAnswer)}});
  }
  function validate(data, bank) {
    // Version-one progress files remain importable; no session was stored in them.
    if (data?.version===1 && !data.format) data={format:'sos-workspace',version:2,bankId:bank.id,savedAt:Date.now(),state:data,session:null,current:null,recent:[],results:null};
    if (!data || data.format!=='sos-workspace' || data.version!==2 || data.bankId!==bank.id || !finite(data.savedAt)) throw Error('This workspace does not match the active bank.');
    E.validateState(data.state,bank);
    const ids=new Set(bank.questions.map(q=>q.id));
    const idList = (xs,max=bank.questions.length) => Array.isArray(xs)&&xs.length<=max&&xs.every(id=>ids.has(id));
    const answer = c => c && ids.has(c.q) && typeof c.answered==='boolean' && finite(c.elapsedMs) && Number.isInteger(c.changes) && c.changes>=0 && Number.isInteger(c.pauses) && c.pauses>=0 && (c.firstChoiceMs===null||finite(c.firstChoiceMs)&&c.firstChoiceMs<=c.elapsedMs) && (c.selected===null&&!c.answered||Number.isInteger(c.selected)&&c.selected>=0&&c.selected<4) && c.raw && typeof c.raw.prompt==='string' && typeof c.raw.correct==='string' && (c.raw.concept===undefined||typeof c.raw.concept==='string') && (c.raw.math===undefined||typeof c.raw.math==='string') && Array.isArray(c.raw.options) && c.raw.options.length===4 && c.raw.options.every(o=>o&&typeof o.text==='string'&&typeof o.correct==='boolean'&&(o.why===undefined||typeof o.why==='string')) && c.raw.options.filter(o=>o.correct).length===1;
    const answerList = (xs,max) => Array.isArray(xs)&&xs.length<=max&&xs.every(c=>answer(c)&&c.answered);
    if (!idList(data.recent,15)) throw Error('Invalid recent-question history.');
    const s=data.session;
    if(s && (!['adaptive','quiz','exam'].includes(s.mode)||!idList(s.pool)||!s.pool.length||new Set(s.pool).size!==s.pool.length||s.queue!==null&&(!idList(s.queue)||s.queue.length!==s.pool.length||s.queue.some((id,i)=>id!==s.pool[i]))||!Number.isInteger(s.total)||s.total<1||s.total>s.pool.length||!Number.isInteger(s.position)||s.position<0||s.position>s.total||!finite(s.deadline)||typeof s.ended!=='boolean'||!finite(s.startedAt)||!answerList(s.answers,s.total)||s.answers.some(c=>!s.pool.includes(c.q)))) throw Error('Invalid saved session.');
    if (data.current&&!answer(data.current)) throw Error('Invalid saved question.');
    if (s&&!s.ended) {
      if (!data.current||!s.pool.includes(data.current.q)||s.position>=s.total||s.answers.length!==s.position+Number(data.current.answered)||s.queue&&s.queue[s.position]!==data.current.q) throw Error('Saved session and question do not agree.');
      if(data.current.answered&&JSON.stringify(s.answers.at(-1))!==JSON.stringify(data.current)) throw Error('Saved feedback does not match the submitted answer.');
    }
    const r=data.results;
    if(r&&(!['adaptive','quiz','exam'].includes(r.mode)||!Number.isInteger(r.total)||r.total<1||r.total>bank.questions.length||!answerList(r.answers,r.total)||r.correct!==r.answers.filter(a=>a.raw.options[a.selected].correct).length||r.unanswered!==r.total-r.answers.length)) throw Error('Invalid saved results.');
    return clone(data);
  }
  function unpack(data,bank) {
    const d=validate(data,bank), map=new Map(bank.questions.map(q=>[q.id,q]));
    const answer=c=>c&&({...c,q:map.get(c.q)});
    return {state:d.state,session:d.session&&{...d.session,pool:d.session.pool.map(id=>map.get(id)),queue:d.session.queue?.map(id=>map.get(id))||null,answers:d.session.answers.map(answer)},current:answer(d.current),recent:d.recent,results:d.results&&{...d.results,answers:d.results.answers.map(answer)}};
  }
  function openDB() {
    return new Promise((resolve,reject)=>{
      if (!root.indexedDB) {reject(Error('Database unavailable'));return;}
      const request=root.indexedDB.open('sos-study',1);
      request.onupgradeneeded=()=>{request.result.createObjectStore('workspaces');request.result.createObjectStore('snapshots');};
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db);};
      request.onerror=()=>reject(request.error);
      request.onblocked=()=>reject(Error('Close older SoS tabs to open the database.'));
    });
  }
  async function open(bankId, onConflict=()=>{}) {
    let db=null, local=null, mode='Memory only', revision=0, savedAt=0, conflict=false, chain=Promise.resolve();
    const key=`study-scaffold:${bankId}:v2`, legacyKey=`study-scaffold:${bankId}:v1`;
    function useLocal() {
      try {local=root.localStorage;local.setItem('sos-storage-test','1');local.removeItem('sos-storage-test');mode='Browser storage';}catch(_){local=null;}
    }
    try {db=await openDB();mode='Local database';} catch (_) {useLocal();}
    let channel;
    try {channel=new root.BroadcastChannel(`sos-study:${bankId}`);channel.onmessage=e=>{if(e.data?.revision>revision){conflict=true;onConflict();}};}catch(_){}
    const get = (store,key) => new Promise((resolve,reject)=>{const req=db.transaction(store).objectStore(store).get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    let initial=null,rawBackup=null;
    if(db){try{initial=await get('workspaces',bankId);}catch(_){db.close();db=null;mode='Memory only';useLocal();}}
    if(!db&&local){try{rawBackup=local.getItem(key);try{initial=JSON.parse(rawBackup||'null');}catch(_){initial={data:{invalidBackup:rawBackup},revision:0};}}catch(_){local=null;mode='Memory only';}}
    if(initial){revision=Number.isInteger(initial.revision)?initial.revision:0;savedAt=initial.data?.savedAt||0;}
    let legacy=null;try{legacy=root.localStorage?.getItem(legacyKey);}catch(_){}
    function save(data,daily=false,{clearCheckpoints=false}={}) {
      // Snapshot before queueing so later UI changes cannot mutate an earlier write.
      const copy=clone(data);
      const operation=chain.then(async()=>{
        if(conflict)throw Error('Progress changed in another tab. Reload this tab before continuing.');
        if(!db&&!local)throw Error('Storage is unavailable. Export a backup before closing.');
        const next=revision+1, row={revision:next,data:copy}, day=dateKey(copy.savedAt);
        if(db)await new Promise((resolve,reject)=>{
          let failure;
          const tx=db.transaction(['workspaces','snapshots'],'readwrite');
          const work=tx.objectStore('workspaces'), snaps=tx.objectStore('snapshots');
          const req=work.get(bankId);
          req.onsuccess=()=>{
            try {
            if((req.result?.revision||0)!==revision){conflict=true;tx.abort();onConflict();return;}
            work.put(row,bankId);
            if(clearCheckpoints)snaps.delete(IDBKeyRange.bound([bankId,''],[bankId,'\uffff']));
            if(daily) {
              snaps.put(copy,[bankId,day]);
              const days=snaps.getAllKeys(IDBKeyRange.bound([bankId,''],[bankId,'\uffff']));
              days.onsuccess=()=>days.result.slice(0,-7).forEach(key=>snaps.delete(key));
            }
            } catch(error) {failure=error;tx.abort();}
          };
          tx.oncomplete=resolve;
          tx.onabort=()=>reject(Error(conflict?'Progress changed in another tab. Reload before continuing.':failure?'Could not update saved progress. Your previous workspace was kept.':'Could not save local progress. Export a backup before closing.'));
          tx.onerror=()=>{};
        });
        else {
          let existing;try{existing=JSON.parse(local.getItem(key)||'null');}catch(_){existing=null;}
          if((existing?.revision||0)!==revision){conflict=true;onConflict();throw Error('Progress changed in another tab. Reload before continuing.');}
          local.setItem(key,JSON.stringify(row));
        }
        revision=next;savedAt=copy.savedAt;channel?.postMessage({revision});return true;
      });
      chain=operation.catch(()=>{});return operation;
    }
    return {mode,initial:initial?(initial.data||{invalidBackup:initial}):null,legacy,rawBackup,get savedAt(){return savedAt;},get conflict(){return conflict;},save,
      async checkpoints(){if(!db)return [];const all=await new Promise((resolve,reject)=>{const req=db.transaction('snapshots').objectStore('snapshots').getAll(IDBKeyRange.bound([bankId,''],[bankId,'\uffff']));req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return all.sort((a,b)=>b.savedAt-a.savedAt);},
      async flush(){await chain;},
      async clearCheckpoints(){await chain;if(db)await new Promise((resolve,reject)=>{const tx=db.transaction('snapshots','readwrite');tx.objectStore('snapshots').delete(IDBKeyRange.bound([bankId,''],[bankId,'\uffff']));tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});},
      async removeLegacy(){try{root.localStorage?.removeItem(legacyKey);}catch(_){}},
      close(){db?.close();channel?.close();}
    };
  }
  async function openLibrary(){
    let db=null,local=null,entries=[],warning='';
    const key='sos-course-library:v1';
    try{db=await new Promise((resolve,reject)=>{if(!root.indexedDB){reject(Error('Unavailable'));return;}const req=root.indexedDB.open('sos-course-library',1);req.onupgradeneeded=()=>req.result.createObjectStore('courses');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Close older SoS tabs.'));});db.onversionchange=()=>db.close();}catch(_){try{local=root.localStorage;local.setItem('sos-library-test','1');local.removeItem('sos-library-test');}catch(_){local=null;}}
    try{
      if(db)entries=await new Promise((resolve,reject)=>{const req=db.transaction('courses').objectStore('courses').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
      else if(local)entries=JSON.parse(local.getItem(key)||'[]');
      if(!Array.isArray(entries))throw Error('Invalid library');
    }catch(_){entries=[];warning='Saved classes could not be read. Reload before adding or updating classes.';}
    return {entries,warning,mode:db?'Local database':local?'Browser storage':'Memory only',
      async put(bank,expectedRevision=0){
        if(warning)throw Error(warning);
        if(!db&&!local)throw Error('Course storage is unavailable. Keep the course file and enable browser storage before adding it.');
        const row={id:bank.id,bank:JSON.parse(JSON.stringify(bank)),revision:expectedRevision+1};
        if(db)await new Promise((resolve,reject)=>{let stale=false;const tx=db.transaction('courses','readwrite'),store=tx.objectStore('courses'),req=store.get(bank.id);req.onsuccess=()=>{if((req.result?.revision||0)!==expectedRevision){stale=true;tx.abort();}else store.put(row,bank.id);};tx.oncomplete=resolve;tx.onabort=()=>reject(Error(stale?'This class changed in another tab. Reload before updating it.':'Could not save the class.'));tx.onerror=()=>{};});
        else{const all=JSON.parse(local.getItem(key)||'[]');if((all.find(e=>e.id===bank.id)?.revision||0)!==expectedRevision)throw Error('This class changed in another tab. Reload before updating it.');local.setItem(key,JSON.stringify([...all.filter(e=>e.id!==bank.id),row]));}
        entries=[...entries.filter(e=>e.id!==bank.id),row];return row;
      },close(){db?.close();}
    };
  }
  const api={snapshot,validate,unpack,open,openLibrary,dateKey};root.StudyStorage=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
