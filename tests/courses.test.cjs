const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../core.js'),C=require('../courses.js'),P=require('../prompts.js');
const sample=()=>JSON.parse(fs.readFileSync('skills/exam-review-designer/assets/example-bank.json','utf8'));
const patch=id=>{const raw=sample();return {kind:'sos-course-patch',version:1,bankId:id,topics:raw.topics,objectives:raw.objectives,sources:raw.sources,questions:raw.questions};};
test('multiple bundled classes coexist without changing the original bank identity',()=>{
 const ctx=vm.createContext({});for(const name of ['tax','example'])vm.runInContext(fs.readFileSync(`banks/${name}.js`,'utf8'),ctx);
 assert.equal(ctx.STUDY_BANK.id,'tax-midterm-v1');assert.equal(ctx.STUDY_COURSES.length,2);assert.equal(C.groups(ctx.STUDY_COURSES.map(bank=>({bank}))).length,2);
});
test('JSON courses compile with preserved IDs, source feedback and independent workspaces',()=>{
 const raw=sample(),bank=C.compile(raw);E.validateBank(bank);const question=E.materialize(bank.questions[0]);assert.match(question.concept,/Sources:/);
 const a=E.empty(bank.id),other=E.empty('another-class');E.record(a,bank.questions[0],true,'auto',1200,'quiz');assert.equal(other.events.length,0);assert.equal(bank.questions[0].id,raw.questions[0].id);
});
test('import rejects unsafe IDs, unresolved source references and ambiguous choices',()=>{
 for(const change of [b=>b.id='__proto__',b=>b.questions[0].sourceRefs[0].sourceId='missing',b=>b.questions[0].variants[0].distractors[0]=b.questions[0].variants[0].correct,b=>b.questions[0].topic='missing']){const raw=sample();change(raw);assert.throws(()=>C.compile(raw));}
});
test('additions preserve original generated questions and are idempotent',()=>{
 const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('banks/example.js','utf8'),ctx);const base=ctx.STUDY_BANK,bases=new Map([[base.id,base]]),entry={bank:base,builtIn:true};
 const added=C.addMaterial(entry,patch(base.id),bases);assert.equal(added.bank.questions.length,3);assert.equal(added.bank.questions[0],base.questions[0]);assert.equal(added.bank.questions[1],base.questions[1]);
 const again=C.addMaterial({...entry,...added},patch(base.id),bases);assert.equal(again.bank.questions.length,3);assert.deepEqual(again.raw,added.raw);
 assert.equal(C.compileEntry(JSON.parse(JSON.stringify(added.raw)),bases).questions.length,3);
});
test('existing data cannot be overwritten or reassigned by an additions file',()=>{
 const raw=sample(),entry={bank:C.compile(raw),raw,builtIn:false},bases=new Map();const p=patch(raw.id);p.questions[0].variants[0].prompt='Overwritten';assert.throws(()=>C.addMaterial(entry,p,bases),/already exists/);
 const wrong=patch('other-id');assert.throws(()=>C.addMaterial(entry,wrong,bases),/for this class/);
 const next=sample();next.questions[0].topic='new-topic';assert.equal(C.compatible(raw,next),false);
});
test('new question families can reuse an existing module and source without copying old items',()=>{
 const raw=sample(),entry={bank:C.compile(raw),raw};const p=patch(raw.id);p.questions[0].id='new-family';p.topics=[];p.objectives=[];p.sources=[];
 const added=C.addMaterial(entry,p,new Map());assert.equal(added.raw.questions.length,2);assert.deepEqual(added.raw.questions[0],raw.questions[0]);assert.equal(added.raw.topics.length,1);
});
test('prompt outputs distinguish a full new bank from an append-only patch',()=>{
 const raw=sample(),entry={bank:C.compile(raw),raw};const add=P.build({mode:'add',scope:'New material',count:5},entry);assert.match(add,/sos-course-patch/);assert.match(add,/additions only/);assert.ok(add.includes(raw.id));assert.ok(add.includes(raw.questions[0].id));assert.match(add,/Do not rewrite/);
 const fresh=P.build({mode:'new',subject:'Science',title:'Biology',scope:'Cells',count:6});assert.match(fresh,/bank.json/);assert.match(fresh,/Class: Biology/);assert.throws(()=>P.build({mode:'new',count:0}));
 const context=P.context(entry);assert.deepEqual(context.existingQuestionIds,raw.questions.map(q=>q.id));assert.equal(context.courseFile,raw);
});
test('source-first prompts default to supplied evidence and require an honest item audit',()=>{
 const config={mode:'new',subject:'History',title:'World history',scope:'Assigned unit',count:5,sourceInventory:'Unit guide.pdf; Chapter 3 notes.pdf'};
 const prompt=P.build(config);
 assert.ok(prompt.includes(config.sourceInventory));assert.match(prompt,/SOURCE POLICY: Supplied materials only/);assert.match(prompt,/Do not browse/);assert.match(prompt,/QUESTION_AUDIT\.md/);assert.match(prompt,/Do not invent an expert sign-off|do not invent an expert sign-off/);assert.match(prompt,/out of the scored bank/);
 const supplement=P.build({...config,sourcePolicy:'supplement'});assert.match(supplement,/supplemental research is permitted/);assert.doesNotMatch(supplement,/Do not browse for or silently substitute/);
 assert.throws(()=>P.build({...config,sourcePolicy:'anything'}),/source policy/);
 assert.equal(P.uploads.length,5);assert.ok(P.uploads.every(item=>item.name&&item.purpose));
});
