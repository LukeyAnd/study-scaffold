/* Optional QA driver. Playwright belongs to the test host, never the study app. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.SOS_PLAYWRIGHT||'playwright');
const [appURL,reviewURL,bankPath]=process.argv.slice(2);
if(!appURL||!reviewURL||!bankPath)throw Error('Use through tools/verify_first_run.py --browser.');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.SOS_BROWSER?{executablePath:process.env.SOS_BROWSER}:{})});
 let activePage;
 try{
  const context=await browser.newContext({viewport:{width:1360,height:1000},acceptDownloads:true});
  const page=await context.newPage(),errors=[];activePage=page;page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.url().startsWith(appURL)&&response.status()>=400)errors.push(`Asset ${response.status()}: ${new URL(response.url()).pathname}`);});
  await page.goto(appURL);await page.getByRole('heading',{name:'All classes',exact:true}).waitFor();
  assert.equal(await page.locator('.course-card:visible').count(),0);
  await page.getByRole('button',{name:'Create my review',exact:true}).click();
  await page.getByLabel('Subject',{exact:true}).fill('Mathematics');await page.getByLabel('Class name',{exact:true}).fill('First-run demonstration');
  await page.getByLabel('Material or topics to cover').fill('Percentage of a quantity using the attached worked arithmetic.');
  await page.getByRole('button',{name:'Generate prompt',exact:true}).click();
  assert.ok((await page.locator('#prompt-output').inputValue()).includes('QUESTION_AUDIT.md'));
  await page.getByLabel('Class',{exact:true}).selectOption('__browse__');
  await page.getByText('Add a class',{exact:true}).click();await page.locator('#course-file').setInputFiles(bankPath);
  await page.getByRole('button',{name:'Add class',exact:true}).click();
  const bank=JSON.parse(fs.readFileSync(bankPath,'utf8'));
  await page.getByRole('heading',{name:bank.title,exact:true}).waitFor();await page.getByLabel('Class',{exact:true}).selectOption(bank.id);
  await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();await page.getByRole('button',{name:'Start practice',exact:true}).click();
  const prompt=await page.locator('#question-heading').innerText();await page.locator('input[name=answer]').first().check();
  await page.waitForFunction(async id=>{const db=await new Promise(resolve=>{const r=indexedDB.open('sos-study');r.onsuccess=()=>resolve(r.result);});const row=await new Promise(resolve=>{const r=db.transaction('workspaces').objectStore('workspaces').get(id);r.onsuccess=()=>resolve(r.result);});db.close();return row?.data?.current?.selected===0;},bank.id);
  await page.reload();await page.locator('#question-heading').waitFor();assert.equal(await page.locator('#question-heading').innerText(),prompt);assert.equal(await page.locator('input[name=answer]').first().isChecked(),true);
  await page.getByRole('button',{name:'Check answer',exact:true}).click();await page.locator('.feedback').waitFor();
  await page.getByRole('link',{name:'Library',exact:true}).click();await page.getByLabel('Library view').selectOption('sources');assert.ok(await page.locator('.source-record').count());
  await page.getByLabel('Library view').selectOption('data');await page.locator('summary[aria-label="More data options"]').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download backup',exact:true}).click()]);
  const progress=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(progress.bankId,bank.id);assert.equal(progress.state.events.length,1);
  // Restore in a genuinely empty second profile, after importing the course.
  const second=await browser.newContext({viewport:{width:375,height:1000}}),restore=await second.newPage();activePage=restore;restore.on('pageerror',error=>errors.push(error.message));
  await restore.goto(appURL);await restore.getByRole('heading',{name:'All classes',exact:true}).waitFor();await restore.getByText('Add a class',{exact:true}).click();await restore.locator('#course-file').setInputFiles(bankPath);await restore.getByRole('button',{name:'Add class',exact:true}).click();await restore.getByRole('heading',{name:bank.title,exact:true}).waitFor();await restore.getByLabel('Class',{exact:true}).selectOption(bank.id);await restore.getByRole('heading',{name:'Overview',exact:true}).waitFor();await restore.getByRole('link',{name:'Library',exact:true}).click();await restore.getByLabel('Library view').selectOption('data');
  restore.once('dialog',dialog=>dialog.accept());await restore.locator('#import-file').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(progress))});
  await restore.waitForFunction(()=>document.querySelector('#notice').textContent==='Backup loaded.');await restore.getByRole('link',{name:'Practice',exact:true}).click();await restore.locator('.feedback').waitFor();assert.ok(await restore.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  // Generated output is served independently; it cannot rely on source-tree assets.
  const generated=await browser.newContext(),review=await generated.newPage();review.on('pageerror',error=>errors.push(error.message));review.on('response',response=>{if(response.url().startsWith(reviewURL)&&response.status()>=400)errors.push(`Generated asset ${response.status()}: ${new URL(response.url()).pathname}`);});
  await review.goto(reviewURL);await review.getByRole('heading',{name:'Overview',exact:true}).waitFor();assert.equal(await review.locator('#course-select option').count(),2);await review.getByRole('button',{name:'Start practice',exact:true}).click();await review.locator('input[name=answer]').first().check();await review.getByRole('button',{name:'Check answer',exact:true}).click();await review.locator('.feedback').waitFor();assert.ok((await review.locator('.feedback').innerText()).includes('Sources:'));
  assert.deepEqual(errors,[]);await context.close();await second.close();await generated.close();
  console.log('Passed: empty-profile onboarding, prompt creation, course import, exact resume, feedback, source view, progress export/restore in another profile, mobile layout, standalone generated output, and no missing runtime assets.');
 }catch(error){if(activePage){console.error('Active page:',activePage.url());console.error((await activePage.locator('body').innerText()).slice(0,5000));}throw error;}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
