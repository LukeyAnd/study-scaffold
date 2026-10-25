/* Scale check with synthetic repeated math content, not a learner review. */
const fs=require('node:fs'),assert=require('node:assert/strict');
module.exports=async function(browser,appURL,bankPath){
 const raw=JSON.parse(fs.readFileSync(bankPath,'utf8')),base=raw.questions[0];
 const bank={...raw,id:'large-software-fixture',title:'Large software fixture',reviewStatus:'Software fixture only',questions:Array.from({length:5000},(_,i)=>({...base,id:`scale-${i}`,angle:`Fixture ${i+1}`,variants:[base.variants[0]]}))};
 const payload=Buffer.from(JSON.stringify(bank));assert.ok(payload.length<5*1024*1024);
 const context=await browser.newContext({viewport:{width:1360,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(appURL);await page.getByText('Add a class',{exact:true}).click();await page.locator('#course-file').setInputFiles({name:'scale.json',mimeType:'application/json',buffer:payload});await page.getByRole('button',{name:'Add class',exact:true}).click();await page.getByRole('heading',{name:bank.title,exact:true}).waitFor();await page.getByLabel('Class',{exact:true}).selectOption(bank.id);await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();
  await page.getByRole('link',{name:'Insights',exact:true}).click();await page.locator('#insight-content [data-action=detail]').first().click();await page.getByLabel('Scenario page').waitFor();
  assert.equal(await page.locator('#scenario-content > details').count(),50);assert.equal(await page.getByLabel('Scenario page').locator('option').count(),100);assert.match(await page.locator('#scenario-content').innerText(),/1–50 of 5000/);
  await page.getByLabel('Scenario page').selectOption('1');assert.equal(await page.locator('#scenario-content > details').count(),50);assert.match(await page.locator('#scenario-content').innerText(),/51–100 of 5000/);assert.equal(await page.getByLabel('Scenario page').evaluate(e=>document.activeElement===e),true);
  await page.getByLabel('Scenario view').selectOption('secure');assert.equal(await page.getByLabel('Scenario page').count(),0);assert.match(await page.locator('#scenario-content').innerText(),/No scenarios/);await page.getByLabel('Scenario view').selectOption('new');assert.equal(await page.getByLabel('Scenario page').inputValue(),'0');
  await page.setViewportSize({width:375,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('link',{name:'Quizzes',exact:true}).click();await page.getByLabel('Questions',{exact:true}).fill('1000');assert.match(await page.locator('#plan-summary').innerText(),/1000 questions/);await page.getByRole('button',{name:'Start session',exact:true}).click();await page.locator('#question-heading').waitFor();
  const saved=await page.waitForFunction(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('sos-study');r.onsuccess=()=>resolve(r.result);});const row=await new Promise(resolve=>{const r=db.transaction('workspaces').objectStore('workspaces').get('large-software-fixture');r.onsuccess=()=>resolve(r.result);});db.close();return row?.data?.session?.queue?.length===1000&&new Set(row.data.session.queue).size===1000;});assert.ok(await saved.jsonValue());assert.deepEqual(errors,[]);
  console.log('Scale checks passed: 5,000-family import; 50-row scenario pages; page/filter/focus/mobile behavior; 1,000-question unique quiz saved.');
 }finally{await context.close();}
};
