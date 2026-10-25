# Building a review from the learner's sources

SoS! is a subject-independent framework. The included tax and math banks demonstrate the software; they do not determine another learner's curriculum, module count, authority, or assessment format. This guide governs source intake and question review. Its workflow is a practical quality-control policy, not a guarantee that AI-generated content is correct.

## What to provide

| Material | Why it helps | What is sufficient |
| --- | --- | --- |
| Exam guide, syllabus, learning objectives or instructor blueprint | Establishes scope, exclusions, tasks and weights | The relevant exam/unit section; include a version/date if available |
| Assigned notes, lecture slides and textbook sections | Supplies the actual facts, methods and examples | Relevant readable excerpts with page/slide/section and edition |
| Worked solutions, official answer keys and rubrics | Shows expected reasoning, notation and grading | A few representative worked tasks and the marking criteria |
| Representative practice questions or permitted past papers | Reveals format, depth and pacing | A small varied sample; avoid assuming its topics exhaust the exam |
| Learner attempts and instructor feedback, optionally | Identifies observed errors | A few anonymized attempts and comments, not unrelated personal records |

A useful starting pack is **exam scope + one substantive source + expected response format**. If a small task is fully supported by one file, do not require the whole pack. Ask only for missing material that affects the requested output. Prefer focused excerpts over uploading an entire unrelated library. For scans, inspect OCR, equations, tables, diagrams and labels; ask for a clearer excerpt when they affect an answer.

Attach these materials to the AI that receives the generated prompt. The SoS! prompt page sends nothing to an AI service and does not parse or upload course PDFs itself. A bank/progress JSON upload has a different purpose: it imports questions or learning history already prepared for the app.

## Establish authority before writing questions

1. **Inspect what is actually accessible.** Register file/URL, author or issuing body, role, exact location, edition/version, effective date where relevant, and any reading/access limitation. A filename, citation or search snippet is not evidence that its content was read.
2. **Separate scope from factual authority.** The instructor or exam blueprint defines what is assessed. The agreed course material/version supplies the grading basis. Worked keys can contain errors; independently check their reasoning. Learner notes and model output are hypotheses to verify, not automatic authorities.
3. **Record the governing version.** Different editions, jurisdictions, dates, software versions or disciplinary conventions may change an answer. Identify those that matter to this course. Do not silently replace an instructor's stated assumptions with newer information.
4. **Choose a source policy.** Default to supplied materials only. If supplemental research is permitted, search a specific unresolved objective, prefer the original/official source appropriate to the subject, inspect the relevant passage and errata, and label the supplement. Do not expand the exam scope because a topic ranks highly in search results. If research is unavailable, say so.
5. **Resolve conflicts or exclude the item.** Show the competing sources and explain which decision is affected. Ask which course/version governs when needed. Put unsupported or disputed material on a gap list rather than in the scored bank. A general/provisional review needs the learner's explicit agreement when supplied material cannot support the requested alignment.

## Build and check the questions

Map **source location → objective → expected exam task → question family → feedback**. Set coverage from the supplied blueprint; label provisional weighting. Adapt the response format: the browser scores four-option MCQs, while essays, proofs, code, oral and practical work need companion tasks/rubrics or an explicit app extension.

Research the task design separately from the subject facts. Use the instructor's representative tasks/rubric to establish depth and format, and credible assessment guidance to improve item construction. Write new source-grounded scenarios; do not assume a popular online question bank has correct keys or fits this course. Question-writing guidance is not an authority on the subject being tested.

Use two passes. Draft a supported question and solution, then solve/check it again without relying on the draft answer key. Verify the governing claim, assumptions, computations, units, rounding, diagrams, edge cases, and the range of generated variants. Check that the citation supports the actual conclusion and explanation. A source mentioning the topic is insufficient.

For each MCQ, check one best answer under the stated assumptions, a focused question, plausible comparable alternatives, and a reason each distractor is wrong or inferior in that scenario. Remove overlapping/equivalent answers, accidental clues and irrelevant difficulty. Across a bank, inspect conceptual duplication, prerequisite demands and coverage gaps; variants should test the same family rather than inflate the objective count.

The clarity, alignment and technical-flaw checks adapt principles from NBME's health-sciences item-writing guidance; they are not evidence that every subject should use clinical vignettes or that MCQs replace every exam task. [NBME Item-Writing Guide, sixth edition, chapters 1–3 and 5](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf).

## Make the checks inspectable

Use the [question-design algorithm](QUESTION_DESIGN.md) to plan reasoning/length profiles and screen accidental answer cues. Comparable lengths and plausible partly true alternatives need semantic review. For a best-answer item, state the ranking criterion and explain why the runner-up loses; withhold two equally defensible answers. The screen does not verify sources or calibrate difficulty. Keep deliberate cue-spotting exercises in an unscored companion.

Keep `QUESTION_AUDIT.md` with the review. For each question/family record: ID, objective, source + exact locator/version, solution/variant checks performed, distractor check, checker/method, status and unresolved issue. Use explicit statuses such as **not reviewed**, **checked against cited source**, and **withheld pending clarification**. An AI's self-check is not independent expert sign-off; record human or separate review only if it happened. A second model agreeing is not a substitute for primary evidence.

The builder creates an unfilled audit template; it does not perform these content checks. The agent fills it from actual work. If a review lacks an audit, say what was and was not checked. Do not invent reviewer names, dates, evidence or validation results.

SoS! validates JSON structure, IDs and reference links. It cannot establish the truth of a source, the correctness of an answer, full course alignment or a probability of passing. Assessing the validity of score interpretations requires appropriate evidence beyond a citation field or working interface. [AERA/APA/NCME Standards, 2014, chapter 1](https://www.testingstandards.net/uploads/7/6/6/4/76643089/standards_2014edition.pdf).

When material changes, trace affected families and recheck their conclusions/variants. Additive imports preserve old items and IDs; they do not repair existing errors. Withhold a known incorrect item and make a deliberate reviewed correction through the authoring workflow. Use a new family ID when the objective or governing rule materially changes. Software success is not content approval.

References checked October 24, 2026. Only the relevant original guidance was consulted; this is not a systematic item-writing review, and no source PDF is redistributed. Revisit source authority and checks when the course/version or question contract changes.
