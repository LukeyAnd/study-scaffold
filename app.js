(function () {
  'use strict';
  const E = StudyEngine;
  const $ = (s, root = document) => root.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const main = $('#main');
  const info = (label, items) => SoSHelp.button(label, items);
  const icon = name => SoSHelp.icon(name);
  const view = { set html(markup) { main.innerHTML = markup; SoSHelp.enhance(main); } };
  const decodeSegment = value => { try { return decodeURIComponent(value || ''); } catch (_) { return ''; } };
  let bank;
  try { bank = E.validateBank(globalThis.STUDY_BANK); } catch (error) { main.textContent = `Cannot load study bank: ${error.message}`; return; }
  const key = `study-scaffold:${bank.id}:v1`;
  const byTopic = new Map(bank.topics.map(t => [t.id, bank.questions.filter(q => q.topic === t.id)]));
  const bySkill = new Map([...new Set(bank.questions.map(E.skill))].map(s => [s, bank.questions.filter(q => E.skill(q) === s)]));
  const qMap = new Map(bank.questions.map(q => [q.id, q]));
  const topicName = id => bank.topics.find(t => t.id === id)?.name || id;
  let state = E.empty(bank.id), session = null, current = null, recent = [], results = null, clock = null, activeDay = null;
  let planPreview = [], builderTopic = null, practiceTopic = 'all', practiceSkill = 'all';
  let overviewCategory='all', insightsMode='categories', libraryMode='topics', scenarioFilter='all', resultFilter='all', builderSkill=null;
  let noticeTimer, storageWarning = '';
  try { const raw = localStorage.getItem(key); if (raw) state = E.validateState(JSON.parse(raw), bank); }
  catch (error) { storageWarning = 'Saved data could not be loaded. Export the stored backup below before replacing it.'; }
  try { document.body.classList.toggle('dark', localStorage.getItem('study-scaffold:theme') === 'dark'); } catch (_) {}
  $('#bank-title').textContent = bank.title;
  $('#bank-title').title = bank.title;
  $('#content-status').textContent = bank.reviewStatus || 'Personal study workspace';
  function notify(message) { clearTimeout(noticeTimer); $('#notice').textContent = message; noticeTimer = setTimeout(() => $('#notice').textContent = '', 5000); }
  function save() { try { localStorage.setItem(key, JSON.stringify(state)); storageWarning = ''; } catch (_) { storageWarning = 'Progress is in memory only. Storage is unavailable or full; export a backup before closing.'; notify(storageWarning); } }
  function btn(label, action, extra = '', primary = false) {
    const names={'start-adaptive':'play','start-focused':'play','start-detail':'play','start-one':'play',builder:'sliders','build-detail':'sliders','next-question':'right',export:'download','export-stored':'history',reset:'reset','retry-missed':'reset'};
    const clean=label.replace(/<span aria-hidden="true">→<\/span>/g,'');
    return `<button class="btn${primary?' primary':''}" data-action="${action}" ${extra}>${names[action]?icon(names[action]):''}<span>${clean}</span></button>`;
  }
  function disclosure(title, content, name='sliders', detail='') {
    return `<details class="panel-disclosure"><summary><span class="summary-label">${icon(name)}<span>${title}</span></span>${detail}<span class="disclosure-chevron">${icon('down')}</span></summary><div class="disclosure-body">${content}</div></details>`;
  }
  function menu(label, content) { return `<details class="utility-menu"><summary aria-label="${esc(label)}">${icon('more')}<span>${esc(label)}</span>${icon('down')}</summary><div class="menu-panel">${content}</div></details>`; }
  function metric(label, value, action, name) { return `<button class="compact-metric" data-action="${action}"><span class="metric-label">${icon(name)}${esc(label)}</span><strong>${value}</strong></button>`; }
  function topicOptions(allLabel='All categories') { return `<option value="all">${allLabel}</option>${bank.topics.map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('')}`; }
  function skillOptions() { return `<option value="all">All skills</option>${[...bySkill.keys()].map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('')}`; }
  function heading(kicker, title, description, actions = '') { return `<div class="page-heading"><div><div class="heading-line"><h1>${esc(title)}</h1>${description ? info(title, description) : ''}</div></div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</div>`; }
  function route(path) { if (location.hash === `#${path}`) render(); else location.hash = path; }
  const quantity = (n, word, plural = word + 's') => `${n} ${n === 1 ? word : plural}`;
  function ratio(value) { return value === null ? '—' : `${value}%`; }
  function status(q) { const r = state.records[q.id]; if (!r?.attempts) return ['New', '']; if (r.recent.at(-1) === false) return ['Needs review', 'red']; if (r.due <= Date.now()) return ['Review due', 'amber']; if (E.mastery(r) >= 80 && r.attempts >= 3) return ['Secure', 'green']; return ['Developing', 'amber']; }
  function tag(q) { const [text, color] = status(q); return `<span class="tag ${color}">${text}</span>`; }
  function moduleRows(groups = bank.topics.map(t => ({ ...t, questions: byTopic.get(t.id) })), type = 'topic') {
    return groups.map((t, i) => { const s = E.summary(t.questions, state); return `<button class="module-row" data-action="detail" data-kind="${type}" data-id="${esc(t.id)}" aria-label="${esc(t.name)}: ${s.mastery}% estimated mastery, ${s.seen} of ${s.total} scenarios attempted. View details."><span class="row-icon">${icon(type==='skill'?'sliders':'book')}</span><span><span class="module-name">${esc(t.name)} <span class="module-meta">${s.seen}/${s.total} explored</span></span><span class="track" style="display:block"><span class="fill" style="display:block;width:${s.mastery}%"></span></span></span><span class="module-value">${s.seen ? s.mastery + '%' : 'New'} ${icon('right')}</span></button>`; }).join('');
  }
  function dayKey(date) { const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function activity() {
    const days = Array.from({length:14}, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return { key: dayKey(d), label: d.toLocaleDateString(undefined,{month:'short',day:'numeric'}), short: d.getDate(), correct:0, wrong:0 }; });
    const map = new Map(days.map(d => [d.key,d]));
    state.events.forEach(e => { const d = map.get(dayKey(e.at)); if (d) d[e.correct ? 'correct' : 'wrong']++; });
    const max = Math.max(1, ...days.map(d => d.correct + d.wrong));
    return `<div class="week-chart" aria-label="Daily practice over the last fourteen days. Select a day to inspect its answers.">${days.map(d => { const n = d.correct+d.wrong; return `<button class="day-bar" data-action="day" data-id="${d.key}" aria-label="${d.label}: ${d.correct} correct, ${d.wrong} incorrect"><span class="day-stack" style="height:${Math.max(3,n/max*120)}px"><span class="day-wrong" style="height:${n ? d.wrong/n*100 : 0}%"></span><span class="day-correct" style="height:${n ? d.correct/n*100 : 0}%"></span></span><span>${d.short}</span></button>`; }).join('')}</div><div class="legend"><span><i></i>Correct</span><span><i style="background:#b18448"></i>Incorrect</span></div>`;
  }
  function sessionList(limit=100) {
    return state.sessions.length ? state.sessions.slice(-limit).reverse().map(s=>`<div class="session-row"><span>${esc(s.mode)}<small>${new Date(s.at).toLocaleDateString(undefined,{month:'short',day:'numeric'})} · ${quantity(s.total,'question')}</small></span><strong>${Math.round(s.correct/s.total*100)}%</strong></div>`).join('') : '<div class="empty">No sessions yet.</div>';
  }
  function overviewMap() {
    if(overviewCategory!=='all') {
      const qs=byTopic.get(overviewCategory);if(!qs)return '';
      const summary=E.summary(qs,state);
      return `<div class="category-preview"><div class="category-preview-title"><h3>${esc(topicName(overviewCategory))}</h3><span class="tag">${summary.mastery}%</span></div><div class="track"><div class="fill" style="width:${summary.mastery}%"></div></div><div class="preview-footer"><span>${summary.seen}/${summary.total} explored</span>${btn('Open category','detail',`data-kind="topic" data-id="${esc(overviewCategory)}"`)}</div></div>`;
    }
    const topics=bank.topics.map(t=>({...t,questions:byTopic.get(t.id)})).sort((a,b)=>{
      const score=t=>{const m=E.summary(t.questions,state);return m.attempts?100-m.mastery+m.due*5:50;};return score(b)-score(a);
    });
    return moduleRows(topics.slice(0,3))+(topics.length>3?disclosure('More categories',moduleRows(topics.slice(3)),'book',`<span class="tag">${topics.length-3}</span>`):'');
  }
  function overview() {
    const summary=E.summary(bank.questions,state);
    const practiced=bank.topics.map(t=>({...t,m:E.summary(byTopic.get(t.id),state)})).filter(t=>t.m.attempts).sort((a,b)=>a.m.mastery-b.m.mastery);
    const focus=practiced[0]?.name||'All categories';
    view.html=heading('','Overview','Start a recommended session. Select a category to look closer.')+
      `<section class="card overview-hub"><div class="hub-lead"><div class="heading-line"><span class="section-icon">${icon('play')}</span><h2>Next session</h2>${info('Recommended session',['Practice prioritizes recent mistakes, due reviews and new scenarios.','Progress scores are study heuristics, not exam predictions.'])}</div><div class="hub-focus">${esc(focus)}</div><div class="hub-meta"><span>${quantity(Math.min(10,bank.questions.length),'question')}</span><span class="tag">Adaptive</span>${summary.due?`<button class="text-button" data-action="review">${summary.due} due</button>`:''}</div><div class="actions">${btn('Start practice','start-adaptive','',true)}${menu('Session options',btn('Build a quiz','builder')+btn('Due reviews','review'))}</div></div><div class="hub-metrics" aria-label="Learning summary">${metric('Mastery',summary.mastery+'%','insights','chart')}${metric('Accuracy',ratio(summary.accuracy),'all-answers','check')}${metric('Explored',`${summary.seen}<span> / ${summary.total}</span>`,'library','book')}</div></section>`+
      `<section class="card overview-map"><div class="workbench-toolbar"><div class="heading-line"><h2>Learning map</h2>${info('Learning map',['The first categories need attention or have not been explored.','Choose a category or expand the rest.'])}</div><label class="inline-select"><span class="visually-hidden">Overview category</span><select id="overview-category">${topicOptions()}</select></label></div><div id="overview-map-content">${overviewMap()}</div></section>`;
    $('#overview-category').value=overviewCategory;
    if(storageWarning)main.insertAdjacentHTML('afterbegin',`<p class="note" role="alert">${esc(storageWarning)}</p>`);
  }
  function answerRows(filter=()=>true) {
    const events=state.events.filter(filter);
    return events.length?events.slice(-100).reverse().map(e=>`<div class="session-row answer-row"><span>${esc(qMap.get(e.id)?.angle||e.id)}<small>${new Date(e.at).toLocaleString()} · ${esc(topicName(qMap.get(e.id)?.topic))}</small></span><div class="actions"><span class="tag ${e.correct?'green':'red'}">${e.correct?'Correct':'Incorrect'}</span>${btn('Practice','start-one',`data-id="${esc(e.id)}"`)}</div></div>`).join(''):'<div class="empty">No matching answers yet.</div>';
  }
  function insightContent() {
    if(insightsMode==='skills')return moduleRows([...bySkill].map(([name,questions])=>({id:name,name,questions})),'skill');
    if(insightsMode==='activity')return activity()+`<div id="day-detail">${activeDay?dayDetail(activeDay):''}</div>`;
    if(insightsMode==='sessions')return sessionList();
    if(insightsMode==='answers')return answerRows();
    if(insightsMode==='confident')return answerRows(e=>e.confidence==='sure'&&!e.correct);
    if(insightsMode==='secure') {
      const qs=bank.questions.filter(q=>E.mastery(state.records[q.id])>=80&&(state.records[q.id]?.attempts||0)>=3);
      return qs.length?qs.map(q=>`<div class="session-row"><span>${esc(q.angle)}<small>${esc(topicName(q.topic))}</small></span>${btn('Practice','start-one',`data-id="${esc(q.id)}"`)}</div>`).join(''):'<div class="empty">No secure scenarios yet.</div>';
    }
    return moduleRows();
  }
  function insights() {
    const summary=E.summary(bank.questions,state);
    view.html=heading('','Insights','Choose one view to explore your results. Select a row or chart bar for details. Secure status needs repeated practice and 80% estimated mastery. Activity retains 5,000 answers and 100 sessions. These measures do not predict an exam grade.')+
      `<div class="insight-summary">${metric('Accuracy',ratio(summary.accuracy),'all-answers','check')}${metric('Review due',summary.due,'review','clock')}${metric('Secure',summary.secure,'secure','check')}</div>`+
      `<section class="card workbench"><div class="workbench-toolbar"><label class="view-picker" for="insight-view">${icon('chart')}<select id="insight-view" aria-label="Insight view"><option value="categories">Categories</option><option value="skills">Thinking skills</option><option value="activity">Practice activity</option><option value="sessions">Session history</option><option value="answers">Answer history</option><option value="confident">Confident mistakes</option><option value="secure">Secure scenarios</option></select></label><button class="text-button icon-link" data-action="builder">${icon('sliders')}Build a quiz</button></div><div id="insight-content">${insightContent()}</div></section>`;
    $('#insight-view').value=insightsMode;
  }
  function dayDetail(day) { const events = state.events.filter(e => dayKey(e.at)===day); return `<div class="day-summary"><strong>${esc(day)}</strong><p>${events.length} answers · ${events.filter(e=>e.correct).length} correct</p></div>${events.slice(-30).reverse().map(e=>`<div class="session-row"><span>${esc(qMap.get(e.id)?.angle || e.id)}<small>${esc(topicName(qMap.get(e.id)?.topic))}</small></span><span>${e.correct?'Correct':'Incorrect'}</span></div>`).join('')}${events.length>30?'<p class="small muted">Showing the latest 30 answers for this day.</p>':''}`; }
  function scenarioRows(questions) {
    const filtered=questions.filter(q=>{const [label]=status(q);return scenarioFilter==='all'||(scenarioFilter==='review'&&(label==='Needs review'||label==='Review due'))||(scenarioFilter==='new'&&label==='New')||(scenarioFilter==='secure'&&label==='Secure');});
    return filtered.map(q=>{const r=state.records[q.id];return disclosure(esc(q.angle||q.id),`<div class="scenario-facts"><span>${esc(E.skill(q))}</span><span>${quantity(r?.attempts||0,'attempt')} · ${r?.correct||0} correct</span></div><div class="track"><div class="fill" style="width:${E.mastery(r)}%"></div></div><div class="preview-footer"><span>${E.mastery(r)}% mastery</span>${btn('Practice variation','start-one',`data-id="${esc(q.id)}"`)}</div>`,'book',tag(q));}).join('')||'<div class="empty">No scenarios match this view.</div>';
  }
  function detail(kind,id) {
    const qs=kind==='skill'?bySkill.get(id):byTopic.get(id);if(!qs){route('overview');return;}
    const name=kind==='skill'?id:topicName(id),summary=E.summary(qs,state);
    view.html=heading('',name,'Expand a scenario for its results and practice options.')+
      `<section class="card detail-workbench"><div class="detail-toolbar"><div class="detail-overview"><span>${summary.mastery}% mastery</span><span>${summary.seen}/${summary.total} explored</span><span>${ratio(summary.accuracy)} accuracy</span></div><div class="actions">${btn('Practice','start-detail',`data-kind="${kind}" data-id="${esc(id)}"`,true)}${menu('Category options',btn('Build a quiz','build-detail',`data-kind="${kind}" data-id="${esc(id)}"`))}</div></div><div class="workbench-toolbar"><h2>Scenarios</h2><label class="inline-select"><span class="visually-hidden">Scenario view</span><select id="scenario-filter"><option value="all">All scenarios</option><option value="review">Needs review</option><option value="new">New scenarios</option><option value="secure">Secure scenarios</option></select></label></div><div id="scenario-content">${scenarioRows(qs)}</div></section>`;
    $('#scenario-filter').value=scenarioFilter;
  }
  function builder() {
    const categories=`<div class="actions category-shortcuts"><button type="button" class="text-button" data-action="select-topics">Select all</button><button type="button" class="text-button" data-action="clear-topics">Clear all</button></div><div class="check-grid">${bank.topics.map(t=>`<label class="check-item"><input type="checkbox" name="topic" value="${esc(t.id)}" ${!builderTopic||builderTopic===t.id?'checked':''}>${esc(t.name)}</label>`).join('')}</div>`;
    const advanced=`<div class="form-grid"><div class="field"><label for="skill-filter">Thinking skill</label><select id="skill-filter" name="skill">${skillOptions()}</select></div><div class="field"><label for="time-limit">Time limit</label><select id="time-limit" name="minutes"><option value="0">Untimed</option>${[10,20,30,60].map(n=>`<option value="${n}">${n} minutes</option>`).join('')}</select></div></div>`;
    view.html=heading('','Quiz builder','Choose a session type, length and selection strategy. Categories and additional settings are optional.')+
      `<form id="builder-form" class="card setup-workbench"><div class="form-grid session-basics"><div class="field"><label for="session-mode">Session type</label><select id="session-mode" name="mode"><option value="quiz">Practice quiz</option><option value="exam">Exam</option></select></div><div class="field"><label for="question-count">Questions</label><input id="question-count" name="count" type="number" min="1" max="${bank.questions.length}" value="${Math.min(10,bank.questions.length)}" required></div><div class="field"><label for="target">Selection</label><select id="target" name="target"><option value="recommended">Recommended</option><option value="missed">Recent mistakes</option><option value="due">Due reviews</option><option value="balanced">Random mix</option></select></div></div>${disclosure('Categories',categories,'book','<span id="selected-topic-count" class="tag"></span>')}${disclosure('More settings',advanced,'sliders','<span id="advanced-summary" class="tag"></span>')}<div class="session-preview"><div class="heading-line"><h2>Your session</h2>${info('Session plan',['Each scenario appears once.','Filters may produce a smaller set.','Practice gives immediate feedback; exams reveal it at the end.'])}</div><div id="plan-summary"></div><button class="btn primary" type="submit" id="start-plan">${icon('play')}<span>Start session</span></button></div></form>`;
    if(builderSkill)$('#skill-filter').value=builderSkill;
    builderTopic=null;builderSkill=null;updatePlan();
  }
  function builderPool() { const form=$('#builder-form');const topics=[...form.querySelectorAll('[name=topic]:checked')].map(x=>x.value);const skill=form.elements.skill.value;return bank.questions.filter(q=>topics.includes(q.topic)&&(skill==='all'||E.skill(q)===skill)); }
  function updatePlan() {
    const form=$('#builder-form');if(!form)return;
    const count=Math.max(1,Math.min(bank.questions.length,parseInt(form.elements.count.value,10)||1));
    planPreview=E.plan(builderPool(),state,count,form.elements.target.value);
    const groups=new Map();planPreview.forEach(q=>groups.set(q.topic,(groups.get(q.topic)||0)+1));
    const selected=form.querySelectorAll('[name=topic]:checked').length;
    $('#advanced-summary').textContent=[form.elements.skill.value!=='all'?form.elements.skill.value:'',form.elements.minutes.value!=='0'?form.elements.minutes.value+' min':''].filter(Boolean).join(' · ');
    $('#selected-topic-count').textContent=selected===bank.topics.length?'All selected':`${selected} selected`;
    $('#plan-summary').innerHTML=planPreview.length?`<div class="plan-total"><strong>${quantity(planPreview.length,'question')}</strong><span>${form.elements.mode.value==='exam'?'Exam':'Practice quiz'}${form.elements.minutes.value!=='0'?` · ${form.elements.minutes.value} min`:''}</span></div>${disclosure('View breakdown',[...groups].map(([id,n])=>`<div class="session-row"><span>${esc(topicName(id))}</span><strong>${n}</strong></div>`).join(''),'chart')}`:'<div class="empty" role="status">No matching scenarios. Adjust the categories or selection.</div>';
    $('#start-plan').disabled=!planPreview.length;
  }
  function practiceLanding() {
    view.html=heading('','Practice','Choose a focus or start with all categories. Answers guide the next question.')+
      `<section class="card setup-workbench practice-setup"><div class="field"><label for="practice-topic">Category</label><select id="practice-topic">${topicOptions()}</select></div>${disclosure('More settings',`<div class="field"><label for="practice-skill">Thinking skill</label><select id="practice-skill">${skillOptions()}</select></div>`,'sliders')}<div class="setup-footer"><span class="tag">Adaptive · up to ${Math.min(10,bank.questions.length)} questions</span>${btn('Start practice','start-focused','',true)}</div><button class="text-button icon-link" data-action="builder">${icon('sliders')}Build a custom quiz</button></section>`;
    $('#practice-topic').value=practiceTopic;$('#practice-skill').value=practiceSkill;
  }
  function start(pool, mode='adaptive', minutes=0, count=10, adaptive=true) {
    if (!pool.length) { notify('No questions match those filters. Choose another focus.');return; }
    session={mode, pool:[...pool], queue:adaptive?null:[...pool], total:adaptive?Math.min(count,pool.length):pool.length, answers:[], position:0, deadline:minutes?Date.now()+minutes*60000:0, ended:false};results=null;recent=[]; nextQuestion();route('practice');
    clearInterval(clock); if (session.deadline) clock=setInterval(tick,1000);
  }
  function nextQuestion() {
    if (!session||session.ended)return;
    if (session.position>=session.total) {finish();return;}
    const q=session.queue?session.queue[session.position]:E.choose(session.pool,state,recent);
    try { current={q,raw:E.materialize(q),selected:null,confidence:'okay',answered:false,start:Date.now(),reason:E.reason(q,state)};recent.push(q.id);recent=recent.slice(-15); }
    catch(error){notify(error.message);finish();return;}
    if(location.hash==='#practice') {renderPractice(); main.focus();window.scrollTo({top:0});}
  }
  function remaining() {if(!session?.deadline)return 'Untimed';const seconds=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} left`;}
  function tick() { if(!session||session.ended)return;const el=$('#timer');if(el)el.textContent=remaining();if(session.deadline&&Date.now()>=session.deadline){finish();notify('Time is up. Your session has been submitted.');} }
  function renderPractice() {
    if(results){renderResults();return;} if(!session||!current){practiceLanding();return;}
    const c=current; const isExam=session.mode==='exam'; const feedback=c.answered&&!isExam;
    view.html=`<div class="study-layout"><div class="study-toolbar"><span class="muted small">${isExam?'EXAM':session.mode==='adaptive'?'ADAPTIVE PRACTICE':'PRACTICE QUIZ'} <span aria-hidden="true"> / </span> Question ${session.position+1} of ${session.total}</span><div class="actions"><span class="tag" id="timer">${remaining()}</span>${menu('Session options',btn('Finish session','finish-session'))}</div></div><div class="study-progress" role="progressbar" aria-label="Session progress" aria-valuenow="${session.position}" aria-valuemin="0" aria-valuemax="${session.total}"><div class="fill" style="width:${session.position/session.total*100}%"></div></div><article class="card question-card"><div class="question-top"><div class="eyebrow">${esc(topicName(c.q.topic))}</div><span class="muted small">${String(session.position+1).padStart(2,'0')}</span></div><div class="question-labels"><span class="tag">${esc(E.skill(c.q))}</span>${info('This question',[c.q.angle||'Practice',session.mode==='adaptive'?c.reason:''])}</div><h1 class="question-text" id="question-heading">${esc(c.raw.prompt)}</h1><form id="answer-form"><fieldset style="border:0;padding:0;margin:0" ${c.answered?'disabled':''}><legend class="visually-hidden">Choose one answer</legend><div class="answers">${c.raw.options.map((o,i)=>`<label class="answer ${feedback&&o.correct?'correct':feedback&&c.selected===i?'wrong':''}"><input type="radio" name="answer" value="${i}" ${c.selected===i?'checked':''}><span class="answer-letter" aria-hidden="true">${'ABCD'[i]}</span><span class="answer-text">${esc(o.text)}${feedback&&o.correct?'<span class="choice-state">Correct answer</span>':feedback&&c.selected===i?'<span class="choice-state">Your answer · incorrect</span>':''}</span></label>`).join('')}</div></fieldset>${!c.answered?`<div class="question-actions"><div class="field confidence-field"><label for="confidence-select">Confidence</label><select id="confidence-select" name="confidence">${[['unsure','Unsure'],['okay','Somewhat'],['sure','Confident']].map(([v,l])=>`<option value="${v}" ${c.confidence===v?'selected':''}>${l}</option>`).join('')}</select></div><button class="btn primary" type="submit" id="check-answer" ${c.selected===null?'disabled':''}>${isExam?'Save & continue':'Check answer'} <span aria-hidden="true">→</span></button></div>`:''}</form>${feedback?explanation(c):''}${feedback?`<div class="actions" style="margin-top:25px">${btn(session.position+1===session.total?'See session results':'Next question <span aria-hidden="true">→</span>','next-question','',true)}</div>`:''}<div class="question-helpers">${info('Study controls',['Use 1–4 to select an answer.','Press Enter to check or continue.','Progress saves after each submitted answer.'])}</div></article></div>`;
  }
  function explanation(c) {
    const correct=c.raw.options[c.selected]?.correct;
    const timing=[c.confidence==='sure'&&!correct?'Confident mistakes receive follow-up practice.':'',session?.mode==='exam'?'':`Next review: ${new Date(state.records[c.q.id]?.due||Date.now()).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}.`].filter(Boolean);
    const worked=`${c.raw.math?`<pre class="steps">${esc(c.raw.math)}</pre>`:''}<ul class="choice-analysis">${c.raw.options.map((o,i)=>`<li><strong>${'ABCD'[i]} · ${o.correct?'Correct':i===c.selected?'Your answer':'Other choice'}</strong><br>${esc(o.why)}</li>`).join('')}</ul>`;
    return `<section class="feedback ${correct?'':'incorrect'}" aria-label="Answer explanation"><div class="heading-line"><h2>${correct?'Correct':'Incorrect'}</h2>${timing.length?info('Review timing',timing):''}</div><p class="explanation">${esc(c.raw.concept||'Review the correct answer.')}</p>${disclosure('Worked solution & choices',worked,'book')}</section>`;
  }
  function submitAnswer() {
    if(!current||current.answered||!session||session.ended)return;if(session.deadline&&Date.now()>=session.deadline){finish();return;}
    const form=$('#answer-form');const selection=form.elements.answer.value;if(selection==='')return;
    current.selected=Number(selection);current.confidence=form.elements.confidence.value||'okay';current.answered=true;
    E.record(state,current.q,current.raw.options[current.selected].correct,current.confidence,Date.now()-current.start,session.mode);save();
    session.answers.push({...current});
    if(session.mode==='exam'){session.position++;nextQuestion();}else{renderPractice();$('.feedback h2')?.setAttribute('tabindex','-1');$('.feedback h2')?.focus();}
  }
  function finish() {if(!session||session.ended)return;session.ended=true;clearInterval(clock); const correct=session.answers.filter(a=>a.raw.options[a.selected].correct).length;
    resultFilter='all';results={answers:[...session.answers],correct,total:session.total,mode:session.mode,unanswered:session.total-session.answers.length};
    if(session.answers.length){state.sessions.push({at:Date.now(),correct,total:session.total,mode:session.mode==='exam'?'Exam':session.mode==='adaptive'?'Adaptive practice':'Practice quiz'});state.sessions=state.sessions.slice(-100);save();}
    route('practice');if(location.hash==='#practice')renderResults(); }
  function resultRows() {
    const answers=results.answers.filter(a=>resultFilter==='all'||(resultFilter==='missed'&&!a.raw.options[a.selected].correct)||(resultFilter==='correct'&&a.raw.options[a.selected].correct));
    return answers.map((a,i)=>`<details class="panel-disclosure result-answer"><summary><span class="summary-label">${icon(a.raw.options[a.selected].correct?'check':'book')}<span>${esc(a.q.angle||topicName(a.q.topic))}</span></span><span class="tag ${a.raw.options[a.selected].correct?'green':'red'}">${a.raw.options[a.selected].correct?'Correct':'Incorrect'}</span><span class="disclosure-chevron">${icon('down')}</span></summary><div class="disclosure-body"><div class="question-text">${esc(a.raw.prompt)}</div><p class="explanation"><strong>Your answer:</strong> ${esc(a.raw.options[a.selected].text)}</p><p class="explanation"><strong>Correct answer:</strong> ${esc(a.raw.correct)}</p>${explanation(a)}</div></details>`).join('')||'<div class="empty">No answers in this view.</div>';
  }
  function renderResults() {
    const r=results,missed=r.answers.length-r.correct;
    view.html=heading('','Session results','Unanswered questions count against the session score. Only submitted answers update learning records.')+
      `<section class="card results-workbench"><div class="result-summary"><div class="result-score">${Math.round(r.correct/r.total*100)}<span>%</span></div><div class="result-totals"><span>${icon('check')}${r.correct} correct</span><span>${icon('book')}${missed} incorrect</span><span>${icon('clock')}${r.unanswered} unanswered</span></div><span class="tag">${r.mode==='exam'?'Exam':'Practice'} · ${r.total} planned</span></div><div class="workbench-toolbar"><h2>Review answers</h2><label class="inline-select"><span class="visually-hidden">Result view</span><select id="result-view"><option value="all">All answers</option><option value="missed">Missed answers</option><option value="correct">Correct answers</option></select></label></div><div id="result-content">${resultRows()}</div><div class="setup-footer"><button class="text-button icon-link" data-action="overview">${icon('overview')}Overview</button>${btn('Practice missed answers','retry-missed',missed?'':'disabled',true)}</div></section>`;
    $('#result-view').value=resultFilter;
  }
  function libraryContent() {
    if(libraryMode==='reference')return `<div class="field reference-search"><label for="glossary-search">Find a term</label><input type="search" id="glossary-search" placeholder="Search definitions"></div><div class="glossary" id="glossary-list">${glossaryRows('')}</div>`;
    if(libraryMode==='data')return `<div class="data-panel"><div class="heading-line"><h2>Progress backups</h2>${info('Progress backups',['Progress stays in this browser and does not sync automatically.','Export a backup before changing devices or resetting progress.','Import replaces progress for the active bank.'])}</div><div class="data-toolbar">${btn('Export progress','export','',true)}<label class="btn file-label">${icon('upload')}Import progress<input class="visually-hidden" id="import-file" type="file" accept="application/json,.json"></label>${menu('More data options',btn('Export stored backup','export-stored')+btn('Reset progress','reset'))}</div><p class="status-message" id="data-status" role="status" aria-live="polite">${esc(storageWarning)}</p></div>`;
    return moduleRows();
  }
  function library() {
    view.html=heading('','Library','Choose topics, definitions or progress backups from the view menu.')+
      `<section class="card workbench"><div class="workbench-toolbar"><label class="view-picker" for="library-view">${icon('book')}<select id="library-view" aria-label="Library view"><option value="topics">Topics</option><option value="reference">Quick reference</option><option value="data">Data & backups</option></select></label><span class="tag">${quantity(bank.questions.length,'scenario')}</span></div><div id="library-content">${libraryContent()}</div></section>`;
    $('#library-view').value=libraryMode;
  }
  function glossaryRows(term) {
    const entries=Object.entries(bank.glossary||{}).filter(([k,v])=>(k+' '+v).toLowerCase().includes(term.toLowerCase()));
    return entries.map(([k,v])=>`<div class="glossary-entry"><span>${esc(k)}</span>${info(k,v)}</div>`).join('')||'<p class="empty">No matching terms.</p>';
  }
  function download(content,name,type='application/json') {const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function eventList(filter,title) {const events=state.events.filter(filter);view.html=heading('ANSWER HISTORY',title,`${events.length} matching answers in the retained history. Select a scenario to practice it.`)+`<section class="card">${events.length?events.slice(-100).reverse().map(e=>`<div class="session-row"><span>${esc(qMap.get(e.id)?.angle||e.id)}<small>${new Date(e.at).toLocaleString()} · ${esc(topicName(qMap.get(e.id)?.topic))} · ${esc(e.confidence)}</small></span><div class="actions"><span class="tag ${e.correct?'green':'red'}">${e.correct?'Correct':'Incorrect'}</span>${btn('Practice','start-one',`data-id="${esc(e.id)}"`)}</div></div>`).join(''):'<p class="empty">No matching answers yet.</p>'}${events.length>100?'<p class="note">Showing the latest 100 matching answers.</p>':''}</section>`; }
  function render(){const path=location.hash.slice(1)||'overview';const [page,kind,id]=path.split('/'); document.querySelectorAll('[data-route]').forEach(a=>{const active=a.dataset.route===page||(page==='detail'&&a.dataset.route==='insights');if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});$('#breadcrumb').textContent=({overview:'Overview',practice:'Practice',insights:'Insights',builder:'Quiz builder',library:'Library',detail:'Category detail'})[page]||'Your workspace';
    if(page==='overview')overview();else if(page==='practice')renderPractice();else if(page==='insights')insights();else if(page==='builder')builder();else if(page==='library')library();else if(page==='detail')detail(kind,decodeSegment(id));else if(page==='answers')eventList(()=>true,'Answer history');else if(page==='confident')eventList(e=>e.confidence==='sure'&&!e.correct,'Confident mistakes');else{route('overview');return;} document.title=`${page==='detail'?(kind==='topic'?topicName(decodeSegment(id)):decodeSegment(id)||'Detail'):page.charAt(0).toUpperCase()+page.slice(1)} · SoS!`;
  }
  const actions={overview:()=>route('overview'),insights:()=>route('insights'),library:()=>route('library'),builder:()=>route('builder'),
    'start-adaptive':()=>start(bank.questions),
    'start-focused':()=>{practiceTopic=$('#practice-topic').value;practiceSkill=$('#practice-skill').value;start(bank.questions.filter(q=>(practiceTopic==='all'||q.topic===practiceTopic)&&(practiceSkill==='all'||E.skill(q)===practiceSkill)));},
    'start-detail':b=>start(b.dataset.kind==='skill'?bySkill.get(b.dataset.id):byTopic.get(b.dataset.id)),
    'start-one':b=>start([qMap.get(b.dataset.id)],'quiz',0,1,false),
    'build-detail':b=>{builderTopic=b.dataset.kind==='topic'?b.dataset.id:null;builderSkill=b.dataset.kind==='skill'?b.dataset.id:null;route('builder');},
    detail:b=>route(`detail/${b.dataset.kind}/${encodeURIComponent(b.dataset.id)}`),
    day:b=>{activeDay=b.dataset.id;insightsMode='activity';if(location.hash==='#insights'&&$('#day-detail'))$('#day-detail').innerHTML=dayDetail(activeDay);else route('insights');},
    review:()=>{route('builder');setTimeout(()=>{if($('#target')){$('#target').value='due';updatePlan();}},0);},
    missed:()=>{route('builder');setTimeout(()=>{if($('#target')){$('#target').value='missed';updatePlan();}},0);},
    secure:()=>{insightsMode='secure';route('insights');},
    'all-answers':()=>{insightsMode='answers';route('insights');},'confident-mistakes':()=>{insightsMode='confident';route('insights');},
    'next-question':()=>{if(current?.answered){session.position++;nextQuestion();}},
    'finish-session':()=>{if(confirm('Finish this session now? Unanswered questions count against the session score. Submitted answers are already saved.'))finish();},
    'retry-missed':()=>{const qs=[...new Set(results.answers.filter(a=>!a.raw.options[a.selected].correct).map(a=>a.q.id))].map(id=>qMap.get(id));if(!qs.length){notify('No missed answers in this session. Try adaptive practice for a fresh challenge.');return;}start(qs,'quiz',0,qs.length,false);},
    'select-topics':()=>{$$('#builder-form [name=topic]').forEach(x=>x.checked=true);updatePlan();},
    'clear-topics':()=>{$$('#builder-form [name=topic]').forEach(x=>x.checked=false);updatePlan();},
    export:()=>download(JSON.stringify(state,null,2),`study-progress-${bank.id}-${dayKey(Date.now())}.json`),
    'export-stored':()=>{try{download(localStorage.getItem(key)||JSON.stringify(state),`study-stored-${bank.id}.json`);}catch(_){notify('Browser storage is unavailable. Export current progress instead.');}},
    reset:()=>{if(confirm('Delete learning progress for this question bank in this browser? Export a backup first if you want to keep it.')){state=E.empty(bank.id);session=null;current=null;results=null;recent=[];clearInterval(clock);save();render();notify('This bank’s progress has been reset.');}}
  };
  const $$=s=>[...document.querySelectorAll(s)];
  document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)actions[b.dataset.action]?.(b);});
  document.addEventListener('submit',e=>{if(e.target.id==='answer-form'){e.preventDefault();submitAnswer();}if(e.target.id==='builder-form'){e.preventDefault();if(!e.target.reportValidity()||!planPreview.length)return;start(planPreview,e.target.elements.mode.value,Number(e.target.elements.minutes.value),planPreview.length,false);}});
  document.addEventListener('change',async e=>{
    if(e.target.id==='result-view'){resultFilter=e.target.value;$('#result-content').innerHTML=resultRows();}
    if(e.target.id==='overview-category'){overviewCategory=e.target.value;$('#overview-map-content').innerHTML=overviewMap();}
    if(e.target.id==='insight-view'){insightsMode=e.target.value;$('#insight-content').innerHTML=insightContent();}
    if(e.target.id==='library-view'){libraryMode=e.target.value;$('#library-content').innerHTML=libraryContent();}
    if(e.target.id==='scenario-filter'){scenarioFilter=e.target.value;const [,kind,id]=location.hash.slice(1).split('/');const qs=kind==='skill'?bySkill.get(decodeSegment(id)):byTopic.get(decodeSegment(id));$('#scenario-content').innerHTML=scenarioRows(qs||[]);}
if(e.target.closest('#builder-form'))updatePlan();if(e.target.name==='answer'&&current&&!current.answered){current.selected=Number(e.target.value);$('#check-answer').disabled=false;}if(e.target.name==='confidence'&&current)current.confidence=e.target.value;
    if(e.target.id==='import-file'){const file=e.target.files[0];if(!file)return;try{if(file.size>5*1024*1024)throw Error('Choose a backup smaller than 5 MB.');const imported=E.validateState(JSON.parse(await file.text()),bank);if(!confirm('Replace progress for this bank with the imported backup?'))return;state=imported;session=null;current=null;results=null;clearInterval(clock);save();render();notify('Progress imported successfully.');}catch(error){$('#data-status').textContent=`Import failed: ${error.message}`;}finally{if($('#import-file'))$('#import-file').value='';}}
  });
  document.addEventListener('input',e=>{if(e.target.id==='glossary-search')$('#glossary-list').innerHTML=glossaryRows(e.target.value);if(e.target.id==='question-count')updatePlan();});
  document.addEventListener('keydown',e=>{if(document.querySelector('.help-dialog[open]')||location.hash!=='#practice'||!session||session.ended||!current||e.ctrlKey||e.altKey||e.metaKey||e.repeat)return;const target=e.target;if(target.matches('input,select,textarea,button,a,summary')||target.isContentEditable)return;if(/^[1-4]$/.test(e.key)&&!current.answered){e.preventDefault();const input=$(`#answer-form [name=answer][value="${Number(e.key)-1}"]`);input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));}else if(e.key==='Enter'){e.preventDefault();if(current.answered){session.position++;nextQuestion();}else if(current.selected!==null)submitAnswer();}});
  $('#theme-button').addEventListener('click',()=>{document.body.classList.toggle('dark');const dark=document.body.classList.contains('dark');try{localStorage.setItem('study-scaffold:theme',dark?'dark':'light');}catch(_){}$('#theme-button [data-label]').textContent=`Switch to ${dark?'light':'dark'} theme`;});
  $('#theme-button [data-label]').textContent=`Switch to ${document.body.classList.contains('dark')?'light':'dark'} theme`;
  $('#focus-button').addEventListener('click',()=>{document.body.classList.toggle('focus');const focus=document.body.classList.contains('focus');$('#focus-button [data-label]').textContent=focus?'Exit focus mode':'Focus mode';$('#focus-button').setAttribute('aria-pressed',String(focus));});
  window.addEventListener('hashchange',()=>{render();main.focus();window.scrollTo({top:0});});
  $('.skip-link').addEventListener('click',e=>{e.preventDefault();main.focus();});
  window.addEventListener('beforeunload',e=>{if(session&&!session.ended){e.preventDefault();e.returnValue='';}});
  window.addEventListener('storage',e=>{if(e.key===key)notify('Progress changed in another tab. Export this tab’s data or reload before continuing.');});
  render();
})();
