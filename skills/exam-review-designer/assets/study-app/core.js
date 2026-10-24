/* Pure adaptive engine. No UI, network requests, or subject-specific rules. */
(function (root) {
  'use strict';
  const DAY = 86400000;
  const SKILLS = ['Calculation', 'Reverse reasoning', 'Error spotting', 'Comparison', 'Application', 'Concepts'];
  function skill(q) {
    if (q.skill) return q.skill;
    const a = q.angle || '';
    if (/reverse/i.test(a)) return 'Reverse reasoning';
    if (/flaw|audit|spot the|defect/i.test(a)) return 'Error spotting';
    if (/compar|trade.off|vs\.|contrast|side.by.side|distinguish/i.test(a)) return 'Comparison';
    if (/advisory|strategy|policy|restructur/i.test(a)) return 'Application';
    return q.isMath ? 'Calculation' : 'Concepts';
  }
  const empty = bankId => ({ version: 1, bankId, records: {}, events: [], sessions: [] });
  const freshRecord = () => ({ attempts: 0, correct: 0, recent: [], streak: 0, lastAt: 0, due: 0, interval: 0, ease: 2, totalMs: 0 });
  const recordFor = (state, id) => Object.hasOwn(state.records, id) ? state.records[id] : null;
  function mastery(r, now = Date.now()) {
    if (!r || !r.attempts) return 0;
    const total = r.recent.reduce((n, x, i) => n + (i + 1) * Number(x), 0);
    const weight = r.recent.length * (r.recent.length + 1) / 2;
    const evidence = Math.min(1, r.attempts / 3);
    const retention = Math.max(0.65, Math.exp(-Math.max(0, now - r.due) / Math.max(DAY, r.interval * DAY * 8)));
    return Math.round(100 * total / (weight || 1) * evidence * retention);
  }
  function summary(questions, state, now = Date.now()) {
    const rs = questions.map(q => recordFor(state, q.id) || freshRecord());
    const attempts = rs.reduce((n, r) => n + r.attempts, 0);
    const correct = rs.reduce((n, r) => n + r.correct, 0);
    return { attempts, correct, accuracy: attempts ? Math.round(correct / attempts * 100) : null,
      mastery: questions.length ? Math.round(rs.reduce((n, r) => n + mastery(r, now), 0) / questions.length) : 0,
      seen: rs.filter(r => r.attempts).length, due: rs.filter(r => r.attempts && r.due <= now).length,
      secure: rs.filter(r => r.attempts >= 3 && mastery(r, now) >= 80).length, total: questions.length };
  }
  function priority(q, state, now = Date.now()) {
    const r = recordFor(state, q.id);
    if (!r || !r.attempts) return 3.5;
    const due = r.due <= now;
    const wrong = r.recent.at(-1) === false;
    return 0.25 + (100 - mastery(r, now)) / 35 + (wrong ? 5 : 0) + (due ? 3 : 0);
  }
  function reason(q, state, now = Date.now()) {
    const r = recordFor(state, q.id);
    if (!r?.attempts) return 'New scenario · establish a baseline';
    if (r.recent.at(-1) === false) return 'Recent mistake · try a fresh variation';
    if (r.due <= now) return 'Review due · strengthen recall';
    if (mastery(r, now) < 80) return 'Developing recall · more evidence needed';
    return 'Retention check · keep this skill fresh';
  }
  function choose(pool, state, recent = [], rng = Math.random, now = Date.now()) {
    if (!pool.length) return null;
    const cooldown = Math.min(15, pool.length - 1);
    const blocked = new Set(cooldown ? recent.slice(-cooldown) : []);
    let eligible = pool.filter(q => !blocked.has(q.id));
    if (!eligible.length) eligible = pool;
    const weights = eligible.map(q => priority(q, state, now));
    let draw = rng() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < eligible.length; i++) { draw -= weights[i]; if (draw <= 0) return eligible[i]; }
    return eligible.at(-1);
  }
  function plan(pool, state, count, target = 'recommended', rng = Math.random, now = Date.now()) {
    let candidates = [...pool];
    if (target === 'missed') candidates = candidates.filter(q => recordFor(state, q.id)?.recent.at(-1) === false);
    if (target === 'due') candidates = candidates.filter(q => recordFor(state, q.id)?.attempts && recordFor(state, q.id).due <= now);
    const chosen = [];
    while (candidates.length && chosen.length < count) {
      const q = target === 'balanced' ? candidates[Math.floor(rng() * candidates.length)] : choose(candidates, state, [], rng, now);
      chosen.push(q); candidates = candidates.filter(x => x.id !== q.id);
    }
    return chosen;
  }
  function record(state, q, correct, confidence, ms, mode, now = Date.now(), timing = null) {
    const r = recordFor(state, q.id) || freshRecord();
    r.attempts++; r.correct += Number(correct); r.recent = [...r.recent, !!correct].slice(-8);
    r.streak = correct ? r.streak + 1 : 0;
    if (correct) {
      r.interval = r.streak === 1 ? 0.5 : r.streak === 2 ? 2 : Math.min(90, r.interval * r.ease);
      if (confidence === 'unsure') r.interval = Math.max(0.125, r.interval * 0.5);
      r.ease = Math.min(2.8, r.ease + (confidence === 'sure' ? 0.1 : 0));
    } else { r.interval = 10 / 1440; r.ease = Math.max(1.3, r.ease - 0.2); }
    r.lastAt = now; r.due = now + r.interval * DAY; r.totalMs += Math.max(0, ms);
    Object.defineProperty(state.records, q.id, {value:r, writable:true, enumerable:true, configurable:true});
    state.events.push({ id: q.id, topic: q.topic, skill: skill(q), correct: !!correct, confidence, ms: Math.max(0, ms), at: now, mode,
      ...(timing ? {timingVersion:1, selectionMs:timing.selectionMs, changes:timing.changes, interrupted:timing.interrupted} : {}) });
    state.events = state.events.slice(-5000);
    return r;
  }
  function validateBank(bank) {
    if (!bank || typeof bank.id !== 'string' || !bank.id || !Array.isArray(bank.topics) || !bank.topics.length || !Array.isArray(bank.questions) || !bank.questions.length) throw Error('A bank needs an id, topics, and questions.');
    const topics = new Set(); const ids = new Set();
    bank.topics.forEach(t => { if (!t.id || typeof t.name !== 'string' || topics.has(t.id)) throw Error('Topic ids must be unique, with a name.'); topics.add(t.id); });
    bank.questions.forEach(q => { if (!q.id || ids.has(q.id) || !topics.has(q.topic) || typeof q.generate !== 'function') throw Error('Questions need unique ids, a known topic, and generate().'); ids.add(q.id); });
    return bank;
  }
  function materialize(q, rng = Math.random) {
    for (let i = 0; i < 20; i++) {
      const raw = q.generate();
      if (typeof raw.prompt !== 'string' || typeof raw.correct !== 'string' || !Array.isArray(raw.distractors) || raw.distractors.length !== 3 || raw.distractors.some(x => typeof x !== 'string')) throw Error(`Invalid question shape: ${q.id}`);
      const texts = [raw.correct, ...raw.distractors];
      if (new Set(texts.map(s => s.trim().toLowerCase())).size !== 4) continue;
      const options = texts.map((text, index) => ({ text, correct: index === 0, why: index === 0 ? raw.concept : raw.whyWrong?.[index - 1] || 'Review the rule above.' }));
      for (let j = 3; j > 0; j--) { const k = Math.floor(rng() * (j + 1)); [options[j], options[k]] = [options[k], options[j]]; }
      return { ...raw, options };
    }
    throw Error(`Duplicate choices in ${q.id}; review this generator.`);
  }
  function validateState(data, bank) {
    if (!data || data.version !== 1 || data.bankId !== bank.id || !data.records || typeof data.records !== 'object' || Array.isArray(data.records) || !Array.isArray(data.events) || !Array.isArray(data.sessions)) throw Error('This backup does not match the active question bank.');
    const ids = new Set(bank.questions.map(q => q.id));
    for (const [id, r] of Object.entries(data.records)) {
      if (!ids.has(id) || !r || !['attempts','correct','streak','lastAt','due','interval','ease','totalMs'].every(k => Number.isFinite(r[k]) && r[k] >= 0) || !Number.isInteger(r.attempts) || r.correct > r.attempts || !Array.isArray(r.recent) || r.recent.length > 8 || r.recent.some(v => typeof v !== 'boolean') || (r.attempts > 0 && !r.recent.length)) throw Error('Backup contains invalid learning records.');
    }
    if (data.events.length > 5000 || data.sessions.length > 100 || data.events.some(e => !e || !ids.has(e.id) || !Number.isFinite(e.at) || !Number.isFinite(e.ms) || e.ms < 0 || typeof e.correct !== 'boolean' || !['auto','unsure','okay','sure'].includes(e.confidence) || e.timingVersion!==undefined && (e.timingVersion!==1 || !Number.isFinite(e.selectionMs) || e.selectionMs<0 || e.selectionMs>e.ms || !Number.isInteger(e.changes) || e.changes<0 || typeof e.interrupted!=='boolean'))) throw Error('Backup contains invalid activity history.');
    if (data.sessions.some(s => !s || !Number.isFinite(s.at) || !Number.isInteger(s.correct) || !Number.isInteger(s.total) || s.correct < 0 || s.total < 1 || s.total < s.correct || typeof s.mode !== 'string')) throw Error('Backup contains invalid sessions.');
    return data;
  }
  const api = { DAY, SKILLS, skill, empty, recordFor, mastery, summary, priority, reason, choose, plan, record, validateBank, materialize, validateState };
  root.StudyEngine = api;
  if (typeof module !== 'undefined') module.exports = api;
})(globalThis);
