# Intake scenarios for manual behavior checks

These are realistic checks for the skill, not claims of an automated agent evaluation.

## Minimal request

User: “Make me a review for my biology final.”

Expected behavior: first ask about scope/material, then gather exam response format and horizon only where consequential. Prefer one useful question over a mandatory three-part form. Do not invent units or silently build a tax-themed app. If no widget exists, ask in chat. A general/provisional review needs an agreed basis.

## Context already supplied

User provides: a syllabus covering Units 2–5, 20 sample MCQs with rationales, an exam guide stating 60 minutes and no calculator, exam date, and 30 minutes of study time each day.

Expected behavior: inspect these sources and record their locations, then build the objective map. Ask only about material uncertainty, missing topic weights, or an important learner constraint. Do not request the exam date again or delay all work for theme preferences.

## Essay exam with a browser request

User: “Build a browser review for my history essay exam. Here is the rubric.”

Expected behavior: include thesis/evidence/argument practice with rubric-based review and explain the bundled MCQ app's limitation. It may be used for factual prerequisites, but the deliverable must also practice writing. Do not claim MCQ accuracy predicts essay quality.

## No time for a broad diagnostic

User: “Exam tomorrow. These four objectives are covered; I can study for 45 minutes.”

Expected behavior: use the supplied objectives and feasible short checks, focus repair on major gaps, and reserve a small mixed check. Do not schedule sessions after the exam or demand a 50-question baseline.

## Inaccessible or conflicting sources

User supplies a broken link, or two policy sheets with different effective dates.

Expected behavior: report which content was actually read, request a usable excerpt or governing version, and keep disputed questions out of scored practice until resolved. No invented page citations.

## Unsupported widgets and asynchronous questions

The host offers no ask tool, or an asynchronous question has been displayed without a reply.

Expected behavior: use ordinary chat in the first case. In the second, continue source organization that does not depend on the answer and do not treat the tool's “accepted” status as consent or an answer.

## Public distribution

User: “Build a review from my private class notes.”

Expected behavior: create local outputs. Do not upload the notes, grades, or a generated bank to a public repository unless publishing those materials is authorized.

## Package attached without course context

User: “Start my SoS! review,” with the repository ZIP or skill-only package.

Expected first handoff: load the skill and ask which class/exam this is for, recommending one relevant exam guide or note excerpt. Do not end with “The ZIP contains an adaptive study app” or ask the user to choose which agent instruction file to read. Do not install runtimes during intake.

If the host responds to an attachment-only message with no task, ask the same course question. If the user instead requests a code/package review, carry out that request rather than beginning study intake. The package cannot cause a host to respond to an upload event that the host does not expose.

## Only SKILL.md is accessible

User attaches the single file and says: “Help me prepare for my chemistry exam.”

Expected behavior: begin scope/source intake using the core instructions. Do not demand the entire repository before the first useful question. Request the full folder, or one specific missing reference, when its schema/template becomes necessary; do not fabricate a browser build or promise tool access.

## All essential facts are supplied

User attaches readable scope, substantive notes, exam format and constraints and says: “Create the review now.”

Expected behavior: inspect sources, map objectives, author and check supported material, and deliver the requested result without asking “Should I proceed?” At delivery, give the precise import/open action if the learner must perform it. Do not invent a missing topic preference to force a closing question.

## Resume after the learner answers

The learner answers the previous format question and attaches the requested notes page. A context record already includes class, scope and exam date.

Expected behavior: incorporate the answer, inspect that page and continue at the next unresolved step. Do not repeat the class/date questions or restart the welcome message. Ask about a source conflict only if it affects scoring.

## Text-only or cloud host delivery

The host cannot save files, or can only build in a remote sandbox.

Expected behavior: provide complete JSON with exact save/import steps when text-only, or an actual downloadable complete folder when supported. Do not claim that a local file was saved, that the learner's browser opened, or that the learner can access the sandbox's localhost URL. End with the one concrete learner action needed next.

## Completed review

The verified bank file is attached and ready to import.

Expected final action: “Import the attached bank.json through All classes → Add a class, then select Start practice.” If the agent can actually import and verify using its authorized tools, do so and give the next study action instead. Avoid an unrelated follow-up question or a generic offer to help.
