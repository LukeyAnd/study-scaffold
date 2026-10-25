# Research and methodology for exam review

Evidence checked: **October 23, 2026**, with the response-timing policy and student-improvement recommendations revisited **October 24, 2026**. This is a focused research synthesis and an implementation guide, not a systematic review of every study or a validation study of this app. The cited sources include original experiments, original research syntheses, author manuscripts, and publisher abstracts. Full text was not available for every source; access levels are recorded below. No copyrighted paper PDFs are redistributed.

The methodology has two parts: evidence-informed learning decisions, and practical design choices for gathering context and creating a usable review. Exact session lengths, question counts, selection weights, and readiness thresholds below are **product defaults, not findings established by the cited research**.

Source intake and factual checking are specified separately in `SOURCE_GUIDE.md` (the skill copy is `references/source-quality.md`). That workflow starts from each learner's own scope and assigned materials, recommends targeted uploads, defaults to supplied-only research, records governing versions/conflicts, and requires an inspectable question audit. These are quality-control policies, not a claim that the app automatically certifies answers. Optional example banks do not determine another course's content or categories.

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

1. **Attempt:** answer from memory or with the resources permitted by the exam. The app requires no confidence rating; active response time is recorded automatically as descriptive context.
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
| Per-scenario history, mistake weighting, due reviews, and automatic active timing | Current review intervals and selection weights are hand-tuned, not a replication of ARTS, FSRS, or the cited experiments; timing does not change the schedule |
| Category and thinking-skill drill-downs, coverage counts, session summaries | Categories and heuristic skill labels do not replace a course-specific objective blueprint |
| “Secure” requires repeated evidence and can fall after mistakes | Three attempts may occur in one sitting; secure status is not evidence of multi-day retention or an 80% chance of passing |
| Fixed, unique-scenario quiz plans and feedback deferred in exam mode | A mock exam built from previously practiced items is not held out unless the author deliberately reserves items |
| Bank replacement and source-linked explanations from the packaged authoring script | The agent or instructor must verify course correctness, source currency, scoring, and assessment alignment |

The skill uses this research to guide intake, bank authoring, and a companion review plan. Adding this document does **not** silently change the existing engine or claim its current scores have been experimentally validated.

### Response timing without extra confidence clicks

ARTS used response time together with accuracy to adapt practice and outperformed fixed comparison schedules in the studied tasks [R9]. This supports considering latency in an appropriately designed system; it does not establish a universal seconds-to-confidence conversion for this app's variable-length questions. Removing the rating is a usability decision, not a claim that confidence has been measured automatically.

The current policy records active time to first choice and submission, revisions, and view interruptions. Timing pauses when the question leaves the active view. Correct, uninterrupted answers contribute to descriptive median-time charts. The learning policy continues to use observed correctness, recent errors, spacing, and coverage. It does not label a rapid error as a confident misconception or a slow correct answer as weak recall. Legacy self-reported ratings are retained when importing older history, but new answers use an explicit `auto` value meaning no rating was collected.

This conservative policy remains an implementation choice: task complexity, reading, input method, accessibility needs, and unobserved interruptions confound timing. Before using timing to modify scheduling, evaluate a within-learner, comparable-task baseline and delayed retention, inspect effects on learners with different access needs, and compare against the existing accuracy-based policy. A small response-time sample is not a confidence instrument or pass prediction.

## Evaluation and maintenance

For a small pilot, compare a mixed, source-aligned delayed assessment with a baseline or alternative study approach, accounting for prior knowledge and time on task. Where possible, use equivalent but unpracticed items. Inspect objective coverage, retention after a meaningful delay, transfer, recurring misconceptions, completion burden, and accessibility. Usability or satisfaction alone does not establish learning effectiveness.

Do not experiment on other people's grades without appropriate authorization. For ordinary personal use, track results and adjust the plan without overstating causality. Recheck this synthesis when changing the algorithm or supported response formats, when substantial contradictory evidence appears, or periodically during maintenance. Record the date, changed decision, source, and uncertainty.

## Suggested next steps for students

These are **proposals, not implemented features**. Priorities and effort estimates are product judgments based on the current code and the research below; no study evaluated this proposed SoS! interface. Preserve its source-first workflow, local storage, minimal pages, spacious text, native dropdowns and concise circled information help.

| Priority | Proposed change | Smallest useful version and evidence boundary |
| --- | --- | --- |
| First | A single **Today** study action | Replace the current recommendation card with a session based on the selected class's exam date, available time, due material and uncovered objectives. Use a small duration dropdown and show the plan breakdown only on expansion. Replan after missed days; do not accumulate a punitive backlog. Spacing supports returns over time [R4, R10]; the particular interface and duration choices are hypotheses to test. |
| First | Show **practiced today** separately from **remembered later** | Track first unassisted answers on later study dates, sample size and elapsed time since learning. Repeated correct answers in one sitting should not establish durable retention. Preserve the existing history and display unknown evidence honestly when old data cannot establish it. Classroom successive-relearning experiments support returns across days [R10], not a universal threshold for every subject. |
| Next | A brief **Help me learn this** route after a mistake | Offer a source-checked correct worked example, then a partially completed problem, then a fresh independent question. Save whether hints/examples were used and keep supported practice separate from independent performance. Fading evidence supports this transition in studied tasks [R11]. Mathematics synthesis supports correct worked examples, but found that adding self-explanation prompts did not consistently help [R12]; do not require extra explanations after every item. |
| Next | Response formats that fit the real exam | Add numeric answers with author-defined units/tolerances first, then short written answers with a visible rubric after submission. Keep an honest distinction between objective scoring, learner self-assessment and any optional AI feedback. MCQs can remain the simplest default. Varied questions showed some transfer benefit in a college study, with important learner differences [R13]; this is not proof that typing always beats selecting. |
| Next | A **Fresh check** with genuinely reserved questions | Reserve question families outside the practice pool, then use unseen applications after a delay. New numbers or shuffled choices alone are not an independent exam. Record when a reserved item is exposed and retire it from the unseen pool; report insufficient reserve coverage rather than reusing it silently. Transfer findings are conditional [R8, R13]. This is a better test of the proposed changes than improvement on repeated practice items. |
| Alongside each change | An accessible study preference menu and chart alternatives | Preserve double spacing by default; allow larger text and comfortable line width, verify keyboard/screen-reader operation, and provide text/table equivalents for charts. Configure untimed or adjusted-duration practice before a session starts; retain the saved deadline after it starts. W3C guidance supports adjustable presentation and timing [R15]; this is a conformance/usability goal, not evidence of higher exam scores. |

Two useful content improvements can accompany that sequence without adding another dashboard:

- **Coverage and source gaps:** extend the current Library with an expandable objective list showing source locator/version, question coverage, audit status and untested objectives. Let the learner flag an ambiguous or outdated question and locally exclude it pending review. A source link alone is not verification. This is a quality-control proposal derived from `SOURCE_GUIDE.md`, not a research-proven intervention.
- **A mistake notebook without repeated data entry:** build it from existing submitted feedback, with optional author-defined error tags and short learner notes. A wrong option can suggest an error pattern but cannot prove the learner's reasoning. Revisit a related independent question later instead of making students repeatedly label their confidence or explain every error.

For optional AI tutoring, offer a relevant hint or source excerpt and then ask for another independent attempt; keep full worked solutions available deliberately. A high-school mathematics field experiment found that an unrestricted GPT interface improved assisted practice but reduced later unaided performance; a tutor designed with learning safeguards largely removed the harm without demonstrating a positive unaided-exam effect [R14]. This supports distinguishing assisted completion from learning, not claiming that every AI tutor harms learning or that a hint button guarantees gains. SoS! need not add an AI API or cloud dependency to offer authored hints and worked examples.

### How to evaluate the next version

Start with Today and delayed-retention evidence, while checking accessibility in the same work. Then pilot the repair route; add new response formats only for an actual course need. Compare completion burden and performance on source-reviewed, equivalent unseen tasks after a delay. Record prior knowledge, support used and actual study time; prefer a controlled/counterbalanced comparison when making causal claims. Also test whether a new user can choose a class, start an appropriate session, recover after a missed day and find a backup without help. Feature usage, more clicks, streaks and satisfaction are not substitutes for retained learning. Do not convert these pilot results into pass probabilities.

## Implementation updates

### Planner implementation review — October 24, 2026

The quiz/exam planner caches the existing priorities once and samples without replacement through a sum tree, reducing planning work from repeated full scans to O(n + k log n) for n candidates and k selections. It preserves the prior weighting and selection policy; 600 deterministic replays against the previous sampler cover recommended, missed, due and uniform selection over mixed synthetic histories. In the full framework repository, `node tools/benchmark.cjs` compares the two samplers on the current host. These are software regression/scale checks, not a backtest against student outcomes, evidence of improved retention, or a calibrated pass prediction.

### Question construction update — October 24, 2026

The [question-design algorithm](QUESTION_DESIGN.md) adds independent reasoning/length plans and an editorial cue screen. NBME distinguishes one-best-answer items from multi-true formats, describes clues that reward testwise guessing, and recommends plausible homogeneous alternatives and content review. Its item-analysis guidance also distinguishes observed difficulty from intended task demands. [Original guide, chapters 2–5](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf).

SoS! adapts those principles; the 30/45/25 task mix, 70/30 length mix and all numeric warning thresholds are project heuristics, not tested optima. Alternatives can be partly true when an explicit scenario criterion establishes one best key. Deliberate wording-cue drills belong outside scored practice. Length screening cannot determine subject correctness, eliminate every cue or calibrate difficulty; record the actual semantic review in the question audit.

The new clarity-note workflow supports saving a question-linked doubt for later source-checked explanation. Its benefit has not been evaluated experimentally; it does not replace delayed independent retrieval or change mastery when a note is marked resolved. AI handoff is manual and should request hints before direct answers.

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

**R10.** Rawson, K. A., Dunlosky, J., & Sciartelli, S. M. (2013). *The power of successive relearning: Improving performance on course exams and long-term retention*. Educational Psychology Review, 25, 523–548. [Original publisher abstract](https://link.springer.com/article/10.1007/s10648-013-9240-4). DOI: 10.1007/s10648-013-9240-4. Access: publisher abstract, cross-checked with the author-provided ERIC abstract. Two educational experiments; does not establish a universal secure-status rule.

**R11.** Atkinson, R. K., Renkl, A., & Merrill, M. M. (2003). *Transitioning from studying examples to solving problems: Effects of self-explanation prompts and fading worked-out steps*. Journal of Educational Psychology, 95, 774–783. [Authors' university publication record and abstract](https://asu.elsevierpure.com/en/publications/transitioning-from-studying-examples-to-solving-problems-effects-/). DOI: 10.1037/0022-0663.95.4.774. Access: original abstract. Two experiments; findings do not require universal self-explanation prompts, particularly in light of R12.

**R12.** Barbieri, C. A., Miller-Cotto, D., Clerjuste, S. N., & Chawla, K. (2023). *A meta-analysis of the worked examples effect on mathematics performance*. Educational Psychology Review, 35, article 11. [Original publisher abstract](https://doi.org/10.1007/s10648-023-09745-1). Access: publisher abstract and study-summary information. Fifty-five studies from 43 articles; positive average mathematics effect, with less favorable effects in conditions adding self-explanation prompts. Moderator associations are not a universal causal rule for every prompt or subject.

**R13.** Foss, D. J., & Pirozzolo, J. W. (2023). *Retrieving and transferring knowledge: Effects of test item variation on transfer in an authentic learning environment*. Learning and Instruction, 88, article 101807. [Original publisher abstract](https://www.sciencedirect.com/science/article/abs/pii/S0959475223000762). DOI: 10.1016/j.learninstruc.2023.101807. Access: publisher abstract/highlights through indexed page content; direct full-page access was blocked. College psychology-methods course, 287 students; transfer effects were weaker than predicted and differed by aptitude. Do not generalize question variation as uniformly beneficial or as evidence that one response format is always better.

**R14.** Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). *Generative AI without guardrails can harm learning: Evidence from high school mathematics*. PNAS, 122, e2422633122. [Original open-access article](https://www.pnas.org/doi/10.1073/pnas.2422633122). Access: original abstract, intervention description and results. A field experiment involving nearly 1,000 high-school students; the particular GPT-4 interfaces and context do not represent all AI uses or subjects. No study materials or student data are redistributed here.

**R15.** W3C. *WCAG 2.2* and supporting Understanding documents. [Normative standard](https://www.w3.org/TR/WCAG22/), [text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [adjustable timing](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html). Access: official standard and guidance, checked October 24, 2026. Spacing guidance requires supporting user overrides without loss; it does not prescribe one mandatory default line spacing. An accessibility recommendation is not a claim that the current app has passed a complete conformance audit.
