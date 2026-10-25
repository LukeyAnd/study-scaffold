const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
test('historical adapter requires a new explicit output and never overwrites existing files',()=>{
 const root=path.resolve(__dirname,'..'),folder=path.join(root,'.validation');fs.mkdirSync(folder,{recursive:true});
 const target=path.join(folder,`archive-${process.pid}.js`),script=path.join(root,'archive','extract-bank.cjs');
 try{
  let run=spawnSync(process.execPath,[script],{encoding:'utf8'});assert.equal(run.status,2);assert.match(run.stderr,/--output/);
  fs.writeFileSync(target,'keep this');run=spawnSync(process.execPath,[script,'--output',target],{encoding:'utf8'});assert.equal(run.status,2);assert.equal(fs.readFileSync(target,'utf8'),'keep this');fs.unlinkSync(target);
  run=spawnSync(process.execPath,[script,'--output',target],{encoding:'utf8',cwd:folder});assert.equal(run.status,0,run.stderr);
  const ctx=vm.createContext({});vm.runInContext(fs.readFileSync(target,'utf8'),ctx);assert.ok(ctx.STUDY_BANK.questions.length>0);assert.equal(ctx.STUDY_BANK.id,'tax-midterm-v1');
 }finally{if(fs.existsSync(target))fs.unlinkSync(target);}
});
