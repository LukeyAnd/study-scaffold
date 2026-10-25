/* Synthetic recovery cases; never uses an existing browser profile. */
const assert=require('node:assert/strict'),fs=require('node:fs');
module.exports=async function(browser,appURL){
 const context=await browser.newContext({acceptDownloads:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>{Object.defineProperty(window,'showSaveFilePicker',{value:undefined});const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){if(this.name==='workspaces'&&window.failRecoveryWrite)throw new DOMException('Synthetic quota failure','QuotaExceededError');return put.apply(this,args);};});
 const dataView=async()=>{await page.getByRole('link',{name:'Library',exact:true}).click();await page.getByLabel('Library view').selectOption('data');};
 const stored=()=>page.evaluate(async()=>{const store=await StudyStorage.open('example-math-v1');try{return JSON.parse(await store.readStored());}finally{store.close();}});
 const downloaded=async click=>{const [file]=await Promise.all([page.waitForEvent('download'),click()]);return JSON.parse(fs.readFileSync(await file.path(),'utf8'));};
 try{
  await page.goto(appURL+'/?course=example-math-v1');await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();
  const original=await page.evaluate(async()=>{
   const bank=STUDY_COURSES.find(b=>b.id==='example-math-v1'),state=StudyEngine.empty(bank.id),removed={id:'retired',topic:bank.topics[0].id};
   for(const q of[bank.questions[0],removed])StudyEngine.record(state,q,true,'auto',1000,'quiz');
   const data=StudyStorage.snapshot(bank,state,null,null,[],null),store=await StudyStorage.open(bank.id);await store.save(data);store.close();
   const note=StudyClarity.draft(StudyClarity.capture(bank,bank.questions[0],StudyEngine.materialize(bank.questions[0])));note.text=42;
   note.images=[{id:'raw-image',name:'preserve.png',type:'image/png',blob:new Blob([new Uint8Array([137,80,78,71,13,10,26,10])],{type:'image/png'})}];
   const db=await new Promise(resolve=>{const r=indexedDB.open('sos-clarity');r.onsuccess=()=>resolve(r.result);});await new Promise((resolve,reject)=>{const tx=db.transaction('notes','readwrite');tx.objectStore('notes').put(note,[bank.id,note.id]);tx.oncomplete=resolve;tx.onabort=reject;});db.close();return data;
  });
  await page.reload();await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();await dataView();
  assert.equal(await page.getByRole('button',{name:'Continue with matching history',exact:true}).isDisabled(),true);
  await page.locator('summary[aria-label="More data options"]').click();await page.getByRole('button',{name:'Reset progress',exact:true}).click();assert.equal((await stored()).state.events.length,2);
  const copy=await downloaded(()=>page.getByRole('button',{name:'Save stored recovery copy',exact:true}).click());assert.deepEqual(copy,original);
  await page.evaluate(()=>window.failRecoveryWrite=true);page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Continue with matching history',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#data-status').textContent.includes('previous workspace was kept'));assert.equal((await stored()).state.events.length,2);
  await page.evaluate(()=>window.failRecoveryWrite=false);page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Continue with matching history',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#notice').textContent.startsWith('Matching history restored'));assert.equal((await stored()).state.events.length,1);
  page.once('dialog',d=>d.accept());await page.locator('#import-file').setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(original))});await page.waitForFunction(()=>document.querySelector('#notice').textContent==='Backup loaded.');assert.equal((await stored()).state.events.length,1);
  await page.getByLabel('Library view').selectOption('clarity');await page.locator('summary[aria-label="Clarity note options"]').click();
  const raw=await downloaded(()=>page.getByRole('button',{name:'Export stored recovery copy',exact:true}).click());assert.equal(raw.format,'sos-clarity-recovery');assert.equal(raw.rows[0].text,42);assert.match(raw.rows[0].images[0].blob.$sosBlob.data,/^data:image\/png;base64,/);
  // Multipart UI using a deliberately smaller test-only threshold.
  await page.evaluate(async()=>{const bank=STUDY_COURSES.find(b=>b.id==='example-math-v1'),db=await new Promise(resolve=>{const r=indexedDB.open('sos-clarity');r.onsuccess=()=>resolve(r.result);});await new Promise(resolve=>{const tx=db.transaction('notes','readwrite');tx.objectStore('notes').clear();tx.oncomplete=resolve;});db.close();const store=await StudyClarity.open(bank.id);for(let i=0;i<10;i++){const note=StudyClarity.draft(StudyClarity.capture(bank,bank.questions[0],StudyEngine.materialize(bank.questions[0])));note.id='part-note-'+i;note.text='Q'.repeat(500);await store.save(note);}store.close();});
  await page.reload();await page.getByLabel('Library view').selectOption('clarity');await page.evaluate(()=>StudyClarity.LIMITS.importBytes=5000);await page.locator('summary[aria-label="Clarity note options"]').click();await page.getByRole('button',{name:'Export notes with images',exact:true}).click();await page.locator('#clarity-backup-parts a').first().waitFor();
  const parts=[];for(const link of await page.locator('#clarity-backup-parts a').all())parts.push(await downloaded(()=>link.click()));assert.ok(parts.length>1);assert.equal(parts.reduce((n,p)=>n+p.notes.length,0),10);
  await page.evaluate(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('sos-clarity');r.onsuccess=()=>resolve(r.result);});await new Promise(resolve=>{const tx=db.transaction('notes','readwrite');tx.objectStore('notes').clear();tx.oncomplete=resolve;});db.close();});await page.reload();await page.getByLabel('Library view').selectOption('clarity');
  for(const part of parts.reverse()){await page.locator('summary[aria-label="Clarity note options"]').click();page.once('dialog',d=>d.accept());await page.locator('#clarity-import').setInputFiles({name:'part.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(part))});await page.waitForFunction(()=>document.querySelector('#clarity-library-status').textContent.includes('loaded.'));}
  assert.equal(await page.locator('.clarity-row').count(),10);assert.deepEqual(errors,[]);
  console.log('Audit recovery browser checks passed: original progress export; reset guard; failed/retried retirement; removed-ID import; raw malformed notes with image bytes; numbered note exports and reverse-order imports.');
 }finally{await context.close();}
 const fallback=await browser.newContext();await fallback.addInitScript(()=>Object.defineProperty(window,'indexedDB',{value:undefined}));const first=await fallback.newPage(),other=await fallback.newPage();
 try{
  await first.goto(appURL+'/?course=example-math-v1');await first.getByRole('heading',{name:'Overview',exact:true}).waitFor();await other.goto(appURL+'/?course=example-math-v1');await other.evaluate(()=>localStorage.setItem('study-scaffold:example-math-v1:v2',JSON.stringify({revision:99,data:{marker:'latest stored row'}})));
  await first.getByRole('link',{name:'Library',exact:true}).click();await first.getByLabel('Library view').selectOption('data');await first.locator('summary[aria-label="More data options"]').click();const [file]=await Promise.all([first.waitForEvent('download'),first.getByRole('button',{name:'Export stored backup',exact:true}).click()]);assert.equal(JSON.parse(fs.readFileSync(await file.path(),'utf8')).marker,'latest stored row');
  console.log('Fresh localStorage export check passed after another tab changed the saved row.');
 }finally{await fallback.close();}
};
