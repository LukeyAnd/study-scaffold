/* Failure-injection checks for commit-before-apply import/restore/reset. */
const assert=require('node:assert/strict'),fs=require('node:fs');
module.exports=async function(browser,reviewURL){
 const context=await browser.newContext({acceptDownloads:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const stored=()=>page.evaluate(async()=>{
  const db=await new Promise(resolve=>{const r=indexedDB.open('sos-study');r.onsuccess=()=>resolve(r.result);});
  const read=store=>new Promise(resolve=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);});
  const [rows,points]=await Promise.all([read('workspaces'),read('snapshots')]);db.close();return {data:rows[0].data,points:points.length};
 });
 const dataView=async()=>{await page.getByRole('link',{name:'Library',exact:true}).click();await page.getByLabel('Library view').selectOption('data');};
 const options=async()=>{const summary=page.locator('summary[aria-label="More data options"]');if(!await summary.evaluate(e=>e.parentElement.open))await summary.click();};
 const exported=async()=>{await options();const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download backup',exact:true}).click()]);return JSON.parse(fs.readFileSync(await file.path(),'utf8'));};
 const load=async data=>{page.once('dialog',d=>d.accept());await page.locator('#import-file').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});};
 const failure=()=>page.waitForFunction(()=>document.querySelector('#data-status')?.textContent.includes('previous workspace was kept'));
 try{
  await context.addInitScript(()=>{
   const put=IDBObjectStore.prototype.put,remove=IDBObjectStore.prototype.delete;
   IDBObjectStore.prototype.put=function(...args){if(this.name==='workspaces'&&window.failWorkspaceWrite)throw new DOMException('Simulated quota failure','QuotaExceededError');return put.apply(this,args);};
   IDBObjectStore.prototype.delete=function(...args){if(this.name==='snapshots'&&window.failSnapshotClear)throw new DOMException('Simulated checkpoint failure','QuotaExceededError');return remove.apply(this,args);};
  });
  await page.goto(reviewURL);await page.getByRole('button',{name:'Start practice',exact:true}).click();
  const original=await page.locator('#question-heading').innerText();await page.locator('input[name=answer]').first().check();await page.getByRole('button',{name:'Check answer',exact:true}).click();await page.locator('.feedback').waitFor();
  await dataView();await page.waitForFunction(()=>document.querySelector('#restore-date')?.options.length>1);
  const baseline=await stored(),incoming=structuredClone(baseline.data);incoming.current.raw.prompt='Imported workspace marker';incoming.session.answers.at(-1).raw.prompt=incoming.current.raw.prompt;
  await page.evaluate(()=>window.failWorkspaceWrite=true);
  await load(incoming);await failure();assert.equal((await stored()).data.current.raw.prompt,original);assert.equal((await exported()).current.raw.prompt,original);
  await page.evaluate(()=>window.failWorkspaceWrite=false);await load(incoming);await page.waitForFunction(()=>document.querySelector('#notice')?.textContent==='Backup loaded.');assert.equal((await stored()).data.current.raw.prompt,incoming.current.raw.prompt);
  await page.getByRole('link',{name:'Practice',exact:true}).click();assert.equal(await page.locator('#question-heading').innerText(),incoming.current.raw.prompt);await page.reload();await page.locator('#question-heading').waitFor();assert.equal(await page.locator('#question-heading').innerText(),incoming.current.raw.prompt);
  await dataView();await page.getByText('Restore a date',{exact:true}).click();await page.waitForFunction(()=>document.querySelector('#restore-date')?.options.length>1);await page.locator('#restore-date').selectOption('0');
  await page.evaluate(()=>window.failWorkspaceWrite=true);page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Restore selected date',exact:true}).click();await failure();assert.equal((await exported()).current.raw.prompt,incoming.current.raw.prompt);
  await page.evaluate(()=>window.failWorkspaceWrite=false);page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Restore selected date',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#notice')?.textContent==='Saved date restored.');assert.equal((await stored()).data.current.raw.prompt,original);
  const beforeReset=await stored();await page.evaluate(()=>window.failSnapshotClear=true);await options();page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Reset progress',exact:true}).click();await failure();
  const kept=await stored();assert.equal(kept.points,beforeReset.points);assert.deepEqual(kept.data.state,beforeReset.data.state);assert.equal((await exported()).state.events.length,1);
  await page.evaluate(()=>window.failSnapshotClear=false);await options();page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Reset progress',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#notice')?.textContent==='This bank’s progress has been reset.');
  const empty=await stored();assert.equal(empty.data.state.events.length,0);assert.equal(empty.data.current,null);assert.equal(empty.points,0);assert.equal(await page.locator('#main').evaluate(e=>e.inert),false);assert.deepEqual(errors,[]);
  console.log('Workspace checks passed: failed import/restore retain live and saved sessions; retry/reload succeeds; reset failure rolls back workspace and restore points atomically; successful reset clears both.');
 }finally{await context.close();}
};
