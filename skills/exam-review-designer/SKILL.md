---
name: exam-review-designer
description: Build a source-aligned exam review from course materials, exam constraints, and learner needs. Use for creating adaptive study banks, targeted quizzes, mock exams, and spaced review plans; includes a short context intake and an optional offline browser scaffold.
---

# Exam Review Designer

Build a review that matches what the learner needs to do on the exam. Use supplied material before asking questions, separate evidence from assumptions, and keep practice results distinct from claims of readiness.

This is a subject-independent framework. Bundled question banks are software examples, not a default curriculum or authority. Read [references/source-quality.md](references/source-quality.md) for upload recommendations, source authority/version decisions, and the content-checking workflow before authoring or revising scored material.

## 1. Choose the route and read in order

Before installing anything, identify the deliverable. Browser study, prompt generation, and an importable JSON output need no local runtime. The standalone builder needs Python 3.10+ standard library; Node.js is optional for preview and unnecessary for building a review. Reuse the host's available executables. Read [references/setup.md](references/setup.md) when a builder/preview is needed or tools are missing; `scripts/setup.ps1 -Task Build` is a read-only Windows check. Install only a missing required runtime using existing authorization, verify it, and never add npm/pip/SQL dependencies for this template. If scripts are blocked, use the documented manual/JSON route rather than changing execution policy.

For a course review: inspect supplied material and context → [references/intake.md](references/intake.md) for unresolved questions → [references/research-methodology.md](references/research-methodology.md) for practice design → [references/authoring.md](references/authoring.md) when creating/importing course JSON or adding material → `scripts/create_review.py` to assemble a standalone review if requested. The script can be executed without loading its implementation unless it needs diagnosis or modification.

Read [references/intake-examples.md](references/intake-examples.md) only when an intake edge case applies. Use `assets/review-context.json` and `assets/review-plan-template.md` as working templates, not instructions to load every asset. `assets/study-app/` is the runnable template; inspect individual runtime files only when customizing or debugging them. For framework maintenance in the full repository, start with its root `AGENTS.md` and task-specific file map instead.

## 2. Gather only missing context

Read [references/intake.md](references/intake.md). Inspect supplied sources and existing context first. Ask only questions whose answers would change the review: subject/scope, exam task and rules, source material/version, time horizon and availability, or a consequential learner constraint.

Use a real question widget if the host provides one and its input type fits; otherwise use concise ordinary chat. Batch a few related questions, generally no more than three at once. Request files in normal chat when widgets accept only text. Do not fabricate tool calls or treat a preselected option as an answer. Continue useful source inspection while waiting; do not invent unresolved facts.

Use `assets/review-context.json` to record resolved context, source locations, missing information, and explicit assumptions. Do not collect unrelated personal details. If the learner has no sources, ask for material or offer a clearly labeled general/provisional review. Do not claim course alignment from a course title alone. If the user already supplied enough context, begin without a questionnaire.

Default to supplied sources only. Record whether authoritative supplemental research is permitted; distinguish it from the governing course material. Inspect the actual source passage and version, resolve consequential conflicts, and withhold disputed or unsupported items. Model memory or agreement between AI answers is not source evidence.

## 3. Build the source-linked review plan

Read [references/research-methodology.md](references/research-methodology.md) before choosing the practice sequence. Build a compact blueprint of source-linked objectives, prerequisites, expected exam tasks, coverage/weights, and observed versus self-reported gaps. Choose categories from the course, not a fixed module count.

Use a short diagnostic when ability is uncertain. Treat a small sample as provisional. Separate an unattempted or supported answer from an independent incorrect answer. Use retrieval with corrective explanations, later returns, and deliberate contrasts between confusable problem types. When repeated failure exposes a prerequisite gap, teach or show an example before another independent attempt. Keep cumulative coverage; do not drill only yesterday's mistakes.

Match the actual response format. An essay, oral, coding, proof, or practical exam needs practice in that format and an explicit rubric. The bundled browser app scores four-option MCQs only; provide companion tasks or extend it deliberately rather than claiming MCQs reproduce every exam. Keep any intended held-out assessment separate from training items.

Write a review plan using `assets/review-plan-template.md`. Adapt scheduling to the exam horizon and real availability. Exact intervals and selection ratios are adjustable heuristics. Three immediate correct answers are not proof of delayed retention, and the app's mastery score is not a probability of passing.

## 4. Create the agreed deliverable

Use [references/QUESTION_DESIGN.md](references/QUESTION_DESIGN.md) to plan intended reasoning demand and option-length profiles independently. Follow the actual exam blueprint before default ratios. Best-answer comparisons require a stated criterion and a source-supported reason the runner-up loses; withhold equally defensible keys. Run `scripts/audit_questions.py` when available and record actual cue checks; the builder writes `ITEM_DESIGN_REPORT.md` automatically. Do not pad options or treat intended demand as measured difficulty. Keep deliberate wording-cue strategy exercises in a separate unscored companion.

For an existing SoS! class, inspect its exported authoring context/course file and return an additions-only patch when the user asks to add material. Preserve old IDs and questions; do not rewrite the app or regenerate the entire bank unnecessarily. The browser's Create with AI screen supplies the prompt and context, then validates imported additions. Read the incremental-update contract in [references/authoring.md](references/authoring.md).

Honor the requested medium. For an offline browser tool, read [references/authoring.md](references/authoring.md), author a source-linked bank JSON, and use `scripts/create_review.py` with the bundled `assets/study-app` template. No network download or runtime account is required. This script needs Python 3.10+; without Python, copy the template and adapt the bank using the documented schema, or provide a chat/document review if that is the user's preferred medium.

Preserve the browser template's minimal SoS! wordmark, double-spaced typography, and consistent icons with visible labels. Keep each page centered on one task, using labeled dropdowns and expandable sections for secondary views and settings. Put interface guidance in circled information buttons with brief bullet lists; avoid explanatory subtitles beneath headings. Keep questions, answer feedback, form labels, important errors, and summaries of active filters visible.

Preserve automatic local workspace saves, dated backup import/export, and exact session recovery. The template requires no confidence rating. Active response timing is descriptive context; do not convert speed into assumed confidence or penalize slower readers. Explain that browser-local data is separate across origins/profiles and that downloaded JSON backups are needed to move progress or keep an independent copy.

Keep `review-context.json`, a source register, and `REVIEW_PLAN.md` with the generated review. Do not include private course files, student grades, or progress backups in a public ZIP without the user's authorization. Creating a local review is not permission to publish it or contact an instructor.

The builder also writes a short `AGENTS.md` into the generated review, from `assets/review-agent-guide.md`. Keep that guide with the shared folder so the next agent can locate course context, sources, bank data, runtime files, and recovery guidance. If assembling manually without Python, adapt the same guide to the files actually delivered and remove links to absent files.

The generated human `README.md` comes from `assets/review-readme.md` and explains starting, stopping and restarting the included `tools/serve.py`. Give the learner the actual review folder and launch command; distinguish terminal commands for humans from prompts for their AI chat. Keep the preview with the complete folder so later sessions do not depend on the installed skill's location. For manual assembly, copy `assets/review-readme.md` to `README.md` and `scripts/serve.py` to `tools/serve.py`, and verify that the delivered instructions match the actual files.

## 5. Verify observable results

Independently solve each item, check the source and version, examine ambiguity and distractors, and verify blueprint coverage. Run available bank/engine checks and inspect the generated interface if possible. A schema check does not verify subject correctness. If browser inspection is unavailable, state that limit rather than claiming visual verification.

Fill `QUESTION_AUDIT.md` using `assets/question-audit-template.md`: question/variant ID, objective, exact source locator/version, solution and distractor checks, checker/method, and unresolved issues. The builder emits an unreviewed template, not approval. Distinguish model self-check from human/independent review; never fabricate sign-off. Keep unresolved items out of the scored bank and report coverage gaps.

## 6. Hand off and keep instructions current

Deliver the runnable review or requested format, the plan and assumptions, checks actually performed, and any material gaps. Point the next agent to the generated `AGENTS.md`. Preserve the learner's selected medium and time constraints. Reuse existing authorization for routine local work; seek additional authorization only when an actual scope or permission boundary requires it.

When changing inputs, output files, runtime capabilities, supported tool behavior, or verification commands, update this route and the affected reference/guide in the same change. Verify current official host documentation when discovery or tool behavior matters; do not assume every agent automatically reads the same filenames. This is a maintenance step when work occurs, not an instruction to schedule or perform future changes automatically.
