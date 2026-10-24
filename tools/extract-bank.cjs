// One-time adapter: preserve the supplied question generators without its UI or tracking code.
const fs = require('node:fs');
const source = fs.readFileSync('midterm_trainer.html', 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
const topics = script.slice(script.indexOf('const TOPICS'), script.indexOf('const GLOSSARY_KEYS'));
const helpers = script.slice(script.indexOf('const randInt'), script.indexOf('const STORAGE_KEY'));
const generators = script.slice(script.indexOf('const GENERATORS'), script.indexOf('const UI ='));
fs.mkdirSync('banks', { recursive: true });
fs.writeFileSync('banks/tax.js', `/* Supplied Gemini tax content; retained as an unverified example bank. */\n(function () {\n'use strict';\n${topics}\n${helpers}\n${generators}\nglobalThis.STUDY_BANK = { id: 'tax-midterm-v1', title: 'Tax midterm', description: 'Nine modules. Multiple ways to think.', reviewStatus: 'Example content · not independently reviewed', topics: TOPICS.map(t => ({ ...t, name: t.name.replace(/^\\d+\\. /, '') })), glossary: GLOSSARY, questions: GENERATORS };\n})();\n`);
