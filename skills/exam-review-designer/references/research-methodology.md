# Research and methodology for exam review

Evidence checked: **October 23, 2026**. This is a focused research synthesis and an implementation guide, not a systematic review of every study or a validation study of this app. The cited sources include original experiments, original research syntheses, author manuscripts, and publisher abstracts. Full text was not available for every source; access levels are recorded below. No copyrighted paper PDFs are redistributed.

The methodology has two parts: evidence-informed learning decisions, and practical design choices for gathering context and creating a usable review. Exact session lengths, question counts, selection weights, and readiness thresholds below are **product defaults, not findings established by the cited research**.

## Evidence that changes the design

| Finding and boundary | Decision for a review tool | Evidence |
| --- | --- | --- |
| Retrieving information can improve later retention beyond restudying; immediate fluency can favor rereading even when delayed retention favors testing. | Ask the learner to attempt an answer before exposing the explanation. Do not use familiarity or a pleasant practice session as proof of retention. | [Roediger & Karpicke, 2006](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/) [R1] |
| A broad review rated practice testing and distributed practice highly; rereading and highlighting had limited general utility. Self-explanation had promising but less general evidence. | Make retrieval and spaced return the backbone. Use reading and worked explanations to repair a gap, followed by another attempt, rather than treating reading as the entire review. | [Dunlosky et al., 2013](https://www.psychologicalscience.org/journals/pspi/1529100612453266/) [R2] |
| Applied classroom research supports retrieval practice across varied settings, with important limits in populations represented. | Use low-stakes quizzes in realistic course settings, but measure whether they help this learner and do not promise a universal grade improvement. | [Agarwal, Nunes, & Blunt, 2021](https://pdf.poojaagarwal.com/Agarwal_etal_2021_EDPR.pdf) [R3] |
| Useful spacing depends on the eventual retention interval. A longer gap is not always better. | Ask when the exam is and how much study time is available. Spread returns across available days instead of declaring one universal optimal interval. | [Cepeda et al., 2008](https://digitalcommons.usf.edu/psy_facpub/1766/) [R4] |
| Relearning conceptual material in later sessions produced durable gains with modest additional practice in the studied tasks. | Return to previously successful objectives on later occasions. Several immediate correct clicks are not equivalent to successful recall after a delay. | [Rawson & Dunlosky, 2011](https://pubmed.ncbi.nlm.nih.gov/21707204/) [R5] |
| Multiple-choice distractors can introduce misinformation; both immediate and delayed feedback reduced that problem relative to no feedback. | Explain the correct rule and why plausible alternatives fail. Default to prompt feedback during practice, with explanations at submission for exam simulation. Do not claim immediate feedback always wins. | [Butler & Roediger, 2008](https://link.springer.com/article/10.3758/MC.36.3.604) [R6] |
| Interleaving effects depend on the kind and similarity of learning material; the meta-analysis did not find a universal advantage. | Mix confusable problem types when discrimination matters. Permit a short focused repair block when a learner lacks a prerequisite, and then return to mixed practice. | [Brunmair & Richter, 2019](https://pubmed.ncbi.nlm.nih.gov/31556629/) [R7] |
| Retrieval can transfer to different tasks, but transfer depends on practice and target characteristics and is not guaranteed. | Include explanation, application, comparison, and novel cases where the exam demands them. Vary the underlying reasoning demands, not only numbers or names. | [Pan & Rickard, 2018](https://pubmed.ncbi.nlm.nih.gov/29733621/) [R8] |
| A specific adaptive scheduling approach outperformed comparison schedules in its experiments. That does not validate every adaptive algorithm. | Adapt at the scenario/learner level, retain an explainable baseline, and evaluate delayed learning before asserting that this app's weights improve outcomes. | [Mettler, Massey, & Kellman, 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC6028005/) [R9] |

## 1. Gather enough context, with little friction

Inspect supplied files and existing conversation context first. Do not ask the learner to retype facts already present. Read the syllabus, learning objectives, exam guide, representative questions, lecture materials, and allowed references that the learner provides. Record the exact source locations used. A title or inaccessible link alone is not inspected content.

Ask only about missing information that would change what is built:

| Context | Why it matters | If unknown |
| --- | --- | --- |
| Course/topic and learner level | Sets vocabulary, prerequisite assumptions, and scope. | Ask before writing subject-specific questions. |
| Authoritative sources, versions, and exclusions | Prevents invented course coverage and outdated answers. | Request material in normal chat. Offer a labeled general review if the learner wants to proceed without it. |
| Exam format, duration, allowed resources, marking/rubric | Determines the response task and simulation conditions. | Use a provisional mixed practice set; do not call it a faithful exam simulation. |
| Exam date/time zone and realistic study availability | Makes review timing feasible. | Use relative sessions; do not invent a date or claim a deadline-specific schedule. |
| Topic weights or an exam blueprint | Aligns coverage with the assessment. | Use declared provisional equal weights; do not present these as instructor priorities. |
| Prior attempts, feedback, and perceived difficulties | Helps select a diagnostic and error categories. | Begin with a broad, short diagnostic; self-report is a hypothesis, not measured ability. |
| Preferred output and functional access needs | Chooses browser, chat, document, timing, spacing, and input method. | Offer a simple default. Ask about functional needs, not medical diagnoses or demographic details. |

Prefer a small question widget batch for discrete choices, typically at most three concise questions. Use asynchronous widgets only when available and suitable. Otherwise ask the same questions in ordinary chat. A checkbox, chat reply, or tool selection is not consent until submitted. Do not ask for file uploads through a text-only widget; request them in normal chat. Do not simulate a tool that is not available.

Sufficient context is a usable learning goal and scope, accessible source material **or an explicit agreement to a general/provisional review**, plus the constraints needed for the requested output. A schedule additionally needs a time horizon and available study time; a faithful simulation needs format and grading information. Optional preferences should not hold up useful work. Save the resolved context, open questions, and assumptions in `review-context.json`.

## 2. Build a blueprint before writing a large bank

Map **source → learning objective → question family → response format → feedback → revisit**. Categories should follow the course's conceptual structure. Do not force every subject into nine modules or six thinking skills.

For each objective, record its source and locator, prerequisite, exam weight if known, intended task, initial evidence, and priority. Example task types include recalling a definition, choosing an applicable rule, completing a calculation, finding an error, explaining a mechanism, or defending an interpretation. Use the real exam's rubric where available.

A compact diagnostic can sample major objectives before allocating a large practice set. A starting sample of one or two tasks per objective is a **convenience default**, not reliable measurement of mastery. Keep it brief enough to fit the learner's time. Unknown, skipped, hinted, and incorrect are different observations. Repeated failure should prompt a prerequisite explanation or a simpler task, rather than an endless loop of harder questions.

## 3. Write questions that reveal reasoning

Each question family should have a stable ID, objective, topic, intended thinking skill, difficulty rationale, source location, and an independently checked solution. For MCQs, provide one best answer, three plausible and unambiguously incorrect alternatives, and a reason each alternative fails. Avoid answer-length clues, duplicated values, missing assumptions, arbitrary trick wording, and ambiguous rounding.

Create variants that test the same objective in a different context. Include transfer or contrast questions when the target assessment requires them. Keep some suitable items out of the initial training set for later assessment; do not call a reshuffled training bank an unseen mock exam.

For written, oral, proof, coding, or performance exams, practice the actual response format with a rubric and worked exemplar. The current browser app scores four-option MCQs. It cannot establish essay quality or oral fluency. Provide companion written/oral tasks or extend the app explicitly instead of disguising all exam demands as MCQs.

For an unfamiliar concept, a worked explanation and a closely related attempt can be a practical repair sequence. Mark that attempt as supported. Then use an independent later attempt to see what remains without help. This sequence is a design choice, not a claim that the cited retrieval studies establish a universal tutoring script.

## 4. Run the review loop

1. **Attempt:** answer from memory or with the resources permitted by the exam. An optional confidence rating is collected before correctness is revealed.
2. **Compare:** explain the applicable rule, reasoning or steps, and the specific misconception. For uncertain but correct answers, reinforce the reasoning rather than dismissing the uncertainty.
3. **Repair:** classify the gap as a knowledge/prerequisite, method-selection, execution, interpretation, or pacing issue. Show a concise source-linked explanation and, when useful, a supported example.
4. **Return:** revisit the objective after intervening work and on another day when feasible. Use a different question or reasoning context. Early correction and delayed recall serve different purposes.
5. **Mix and check:** retain cumulative coverage of other objectives, including stronger ones. Later test an independent sample under relevant exam conditions and inspect errors again.

For an exam weeks away, plan several separated retrieval sessions plus an assessment window before the deadline. For an exam tomorrow, use short repair/retest cycles and a realistic mixed check; do not pretend that one evening provides weeks of spacing. If a learner wants continuing reminders, obtain scheduling authorization through the host's normal automation workflow; the skill itself does not create reminders automatically.

## 5. Adapt without hiding uncertainty

Prioritize a combination of weak observed performance, recent errors, due review, exam relevance, and uncovered objectives. Keep enough coverage to detect neglected topics. Any fixed allocation such as “60% weak / 20% due / 20% new” is a tunable starting policy, not a research-backed optimum.

Separate **accuracy**, **coverage**, **practice support**, **delay since practice**, **sample count**, and **performance on held-out tasks**. Confidence can help choose follow-up questions, but it is not ability. Reading speed and response time also reflect task difficulty, access needs, interruptions, and input method; do not treat slow responses as wrong answers.

Do not report a probability of passing, an intelligence score, or psychometric ability from a handful of uncalibrated generated items. A learner can improve on practiced items without being ready for an exam. State the evidence behind any qualitative readiness statement and the important objectives still untested.

## 6. Map the evidence to this repository honestly

| Already in the browser scaffold | Still a limitation or future improvement |
| --- | --- |
| Submitted-answer retrieval, explanatory feedback, randomized choice order, repeated scenario practice | Recognition-based MCQs only; no automatic grading of constructed responses |
| Per-scenario history, mistake weighting, due reviews, confidence-sensitive intervals | Current review intervals and selection weights are hand-tuned, not a replication of ARTS, FSRS, or the cited experiments |
| Category and thinking-skill drill-downs, coverage counts, session summaries | Categories and heuristic skill labels do not replace a course-specific objective blueprint |
| “Secure” requires repeated evidence and can fall after mistakes | Three attempts may occur in one sitting; secure status is not evidence of multi-day retention or an 80% chance of passing |
| Fixed, unique-scenario quiz plans and feedback deferred in exam mode | A mock exam built from previously practiced items is not held out unless the author deliberately reserves items |
| Bank replacement and source-linked explanations from the packaged authoring script | The agent or instructor must verify course correctness, source currency, scoring, and assessment alignment |

The skill uses this research to guide intake, bank authoring, and a companion review plan. Adding this document does **not** silently change the existing engine or claim its current scores have been experimentally validated.

## Evaluation and maintenance

For a small pilot, compare a mixed, source-aligned delayed assessment with a baseline or alternative study approach, accounting for prior knowledge and time on task. Where possible, use equivalent but unpracticed items. Inspect objective coverage, retention after a meaningful delay, transfer, recurring misconceptions, completion burden, and accessibility. Usability or satisfaction alone does not establish learning effectiveness.

Do not experiment on other people's grades without appropriate authorization. For ordinary personal use, track results and adjust the plan without overstating causality. Recheck this synthesis when changing the algorithm or supported response formats, when substantial contradictory evidence appears, or periodically during maintenance. Record the date, changed decision, source, and uncertainty.

## Source register

**R1.** Roediger, H. L., & Karpicke, J. D. (2006). *Test-enhanced learning: Taking memory tests improves long-term retention*. Psychological Science, 17, 249–255. [Publisher abstract](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/). DOI: 10.1111/j.1467-9280.2006.01693.x. Access: original article abstract. Laboratory prose-learning experiments; immediate and delayed outcomes differ.

**R2.** Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). *Improving students’ learning with effective learning techniques*. Psychological Science in the Public Interest, 14, 4–58. [Publisher summary and abstract](https://www.psychologicalscience.org/journals/pspi/1529100612453266/). DOI: 10.1177/1529100612453266. Access: original review abstract and recommendations. Broad synthesis, not validation of this app.

**R3.** Agarwal, P. K., Nunes, L. D., & Blunt, J. R. (2021). *Retrieval practice consistently benefits student learning: A systematic review of applied research in schools and classrooms*. Educational Psychology Review, 33, 1409–1453. [Author-hosted paper](https://pdf.poojaagarwal.com/Agarwal_etal_2021_EDPR.pdf). DOI: 10.1007/s10648-021-09595-9. Access: original review, including abstract and methodological discussion. Fifty classroom experiments; the authors note limited representation outside WEIRD countries and heterogeneous settings.

**R4.** Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). *Spacing effects in learning: A temporal ridgeline of optimal retention*. Psychological Science, 19, 1095–1102. [University repository abstract](https://digitalcommons.usf.edu/psy_facpub/1766/). DOI: 10.1111/j.1467-9280.2008.02209.x. Access: original abstract and author manuscript excerpts. Fact learning; its optimum is not an all-subject scheduling formula.

**R5.** Rawson, K. A., & Dunlosky, J. (2011). *Optimizing schedules of retrieval practice for durable and efficient learning: How much is enough?* Journal of Experimental Psychology: General, 140, 283–302. [Original abstract](https://pubmed.ncbi.nlm.nih.gov/21707204/). DOI: 10.1037/a0023956. Access: original abstract. Conceptual short-answer learning with repeated sessions; exact criteria should not be generalized to every exam task.

**R6.** Butler, A. C., & Roediger, H. L. (2008). *Feedback enhances the positive effects and reduces the negative effects of multiple-choice testing*. Memory & Cognition, 36, 604–616. [Publisher abstract](https://link.springer.com/article/10.3758/MC.36.3.604). DOI: 10.3758/MC.36.3.604. Access: original abstract. Feedback versus no feedback; not a universal ranking of immediate and delayed feedback.

**R7.** Brunmair, M., & Richter, T. (2019). *Similarity matters: A meta-analysis of interleaved learning and its moderators*. Psychological Bulletin, 145, 1029–1052. [Original abstract](https://pubmed.ncbi.nlm.nih.gov/31556629/). DOI: 10.1037/bul0000209. Access: indexed original abstract. Effects vary by material and category similarity; interleaving is not uniformly better.

**R8.** Pan, S. C., & Rickard, T. C. (2018). *Transfer of test-enhanced learning: Meta-analytic review and synthesis*. Psychological Bulletin, 144, 710–756. [Original abstract](https://pubmed.ncbi.nlm.nih.gov/29733621/). DOI: 10.1037/bul0000151. Access: indexed original abstract. Transfer depends on several moderators; novel questions are not automatically evidence of broad transfer.

**R9.** Mettler, E., Massey, C. M., & Kellman, P. J. (2016). *A comparison of adaptive and fixed schedules of practice*. Journal of Experimental Psychology: General, 145, 897–917. [Author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC6028005/). DOI: 10.1037/xge0000170. Access: original manuscript, abstract and scheduling discussion. ARTS is a specific studied system; this repository does not implement or reproduce it.
