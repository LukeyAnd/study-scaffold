# Agent workflow and file map

Read [AGENTS.md](AGENTS.md) first. Then choose the route matching the user's outcome. This file is a map, not a requirement to read the whole repository. For another AI tool that does not automatically discover repository instructions, explicitly provide `AGENTS.md` and this file with the task.

## 1. Choose the smallest useful context

| Requested outcome | Read first | Then inspect only what is relevant |
| --- | --- | --- |
| First run, missing tools, or setup trouble | [START_HERE.md](START_HERE.md) | [SETUP.md](SETUP.md), [setup helper](tools/setup.ps1), [first-run evidence](FIRST_RUN_TEST.md); install only a missing tool needed for the selected route |
| Create a course review, quiz, or exam | [Review skill](skills/exam-review-designer/SKILL.md) | [SOURCE_GUIDE.md](SOURCE_GUIDE.md), then the numbered workflow; use supplied materials before intake |
| Change appearance or interaction | [DESIGN.md](DESIGN.md) | [index.html](index.html), [app.js](app.js), [help.js](help.js), [styles.css](styles.css) |
| Change adaptive selection or scheduling | [RESEARCH.md](RESEARCH.md) | [core.js](core.js), [engine tests](tests/engine.test.cjs); [app.js](app.js) only for the affected flow |
| Change saves, resume, timing, or backups | [STORAGE.md](STORAGE.md) | [storage.js](storage.js), [core.js](core.js), affected parts of [app.js](app.js), [storage tests](tests/storage.test.cjs) |
| Change classes, JSON imports or AI prompts | [COURSES.md](COURSES.md) | [courses.js](courses.js), [prompts.js](prompts.js), [course tests](tests/courses.test.cjs), relevant storage/UI calls |
| Change bank shape or review generation | [Authoring contract](skills/exam-review-designer/references/authoring.md) | [Builder](skills/exam-review-designer/scripts/create_review.py), [example bank](skills/exam-review-designer/assets/example-bank.json), [package tests](tests/skill_package_test.py) |
| Change installation or download packaging | [INSTALL.md](INSTALL.md) | [Packager](tools/package_release.py), [package tests](tests/skill_package_test.py), [download page](downloads/index.html) |
| Understand a prior implementation decision | Relevant route above | [REVIEW.md](REVIEW.md) provides background; inspect current code before relying on historical descriptions |

Use targeted symbol/file searches for large sources. `banks/tax.js` and `midterm_trainer.html` are examples/history; read them only when the task involves that content. Generated app copies are output artifacts, not a second source of truth.

## 2. Establish a concrete outcome

Extract the user's requested behavior, supplied facts, constraints, and prior authorization. Inspect existing files before asking questions. Ask only about unresolved information that changes the result. For learning-context intake, use the skill's supported ask-widget/chat contract rather than inventing a tool or repeating a questionnaire.

Define a small observable completion check. For example: “Reload question two and retain its exact numbers, choice order, and selected answer without adding a second learning event.” For course generation, the comparable check is source-linked objective coverage and a runnable review in the agreed format. State consequential assumptions; do not substitute a different medium or silently add cloud storage, accounts, or a site deployment.

## 3. Make the change in its owning files

Keep the dependency boundaries intact: bank → pure engine; workspace snapshots/database in `storage.js`; UI/session orchestration in `app.js`; shared information dialogs/icons in `help.js`. Read the existing call sites before changing an exported function or snapshot field.

For course creation, the skill owns the authoring procedure; do not rewrite the framework's example bank as an unintended side effect. For app changes, edit canonical root files. Add migration/compatibility handling when changing persisted data and use meaningful behavioral tests for consequential changes. A visual wording or spacing adjustment does not need a test that merely repeats the implementation.

## 4. Verify the affected behavior

| Change | Evidence to collect |
| --- | --- |
| Engine, scheduling, or runtime behavior | `node --test tests/*.test.cjs` (or `npm test`); inspect the relevant UI path when it changes |
| Storage or timing | Unit checks plus browser reload, saved feedback without duplicate submission, selected-answer recovery, expired exam, export/import, stale second tab, and unavailable-storage behavior as applicable |
| Interface | Exercise affected menus/keyboard behavior and a narrow/mobile layout; verify no overflow, readable questions, and usable light/dark states |
| Skill, builder, packaging, or local documentation links | `python -m unittest discover -s tests -p "*test.py"`; generate a small review when generation changes |
| Authored course questions | Independently solve and inspect source/version, ambiguity, distractors, and objective coverage; software validation cannot establish subject correctness |

For local browser inspection, run `node tools/serve.cjs` or `python tools/serve.py` and open the printed localhost address. Use the configured host's actual browser/tool capabilities. If a port is busy, choose another with `--port 4175` and keep it stable when testing persistence. No npm install or browser automation package is a runtime requirement. State unavailable checks explicitly.

## 5. Package and deliver when included in scope

1. Update affected design, storage, methodology, installation, and agent instructions. Keep concrete facts in their owning document; route to them instead of copying them into every guide.
2. Run `python tools/package_release.py`. It copies canonical runtime files to the skill template, synchronizes research/license resources, and rebuilds the app ZIP, skill ZIP, and checksums.
3. Run the Python package tests **after** packaging. Run `npm test` too when runtime behavior changed. If the host supplies a skill validator, run it when skill instructions change; that optional host tool is not bundled with this project.
4. Review the diff and archive contents. Private inputs and progress do not belong in the public ZIP. Respect the user's existing publication authorization; preparing a private review does not authorize publishing its materials.
5. If publishing is authorized and part of the task, push the reviewed source/artifacts, verify the deployed version and downloaded ZIP checksums, and report the result. If the task is local only, hand off local paths instead.

## 6. Keep the handoff current

Review this map and `AGENTS.md` when runtime files/entry points, storage contracts, design requirements, builder inputs/outputs, test commands, packaging, or supported hosting paths change. Review the skill when intake or learning methodology changes. Verify platform-specific instructions against current official documentation when that integration is requested. Do not silently execute future work or create a recurring automation from this maintenance guidance.

At a context handoff, record only the requested outcome, resolved constraints, relevant files, completed changes, actual checks, and the next unresolved step. Do not paste the whole conversation or private course data into a public guide. This can be a brief message or the host's normal task record; it does not require a new planning-file hierarchy.

Keep [FEATURES.md](FEATURES.md) and the README summary aligned with current capabilities. Clearly separate implemented behavior from research proposals when features change.

## Why the instructions are arranged this way

Checked October 24, 2026. OpenAI documents staged skill loading and repository-level instructions. This project's short entry point, task routes, and on-demand references apply that guidance; they do not guarantee identical discovery or execution in every AI host. [Skills](https://learn.chatgpt.com/docs/build-skills), [AGENTS.md discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [development workflow guidance](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex).
