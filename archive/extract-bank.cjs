// One-time adapter: preserve the supplied question generators without its UI or tracking code.
const fs = require('node:fs');
const path = require('node:path');
const outputIndex = process.argv.indexOf('--output');
if(outputIndex<0||!process.argv[outputIndex+1]){console.error('Usage: node archive/extract-bank.cjs --output NEW_FILE.js');process.exit(2);}
const output = path.resolve(process.argv[outputIndex+1]);
if(fs.existsSync(output)){console.error('Output already exists. Choose a new file; the current bank was not changed.');process.exit(2);}
const source = fs.readFileSync(path.join(__dirname,'midterm_trainer.html'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
const topics = script.slice(script.indexOf('const TOPICS'), script.indexOf('const GLOSSARY_KEYS'));
const helpers = script.slice(script.indexOf('const randInt'), script.indexOf('const STORAGE_KEY'));
const generators = script.slice(script.indexOf('const GENERATORS'), script.indexOf('const UI ='));
fs.writeFileSync(output, `/* Supplied Gemini tax content; retained as an unverified example bank. */\n(function () {\n'use strict';\n${topics}\n${helpers}\n${generators}\nglobalThis.STUDY_BANK = { id: 'tax-midterm-v1', title: 'Tax midterm', description: 'Nine modules. Multiple ways to think.', reviewStatus: 'Example content · not independently reviewed', topics: TOPICS.map(t => ({ ...t, name: t.name.replace(/^\\d+\\. /, '') })), glossary: GLOSSARY, questions: GENERATORS };\n})();\n`, {flag:'wx'});
