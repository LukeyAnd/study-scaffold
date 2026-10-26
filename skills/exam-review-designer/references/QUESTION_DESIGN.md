# Question mix and answer-cue checks

## What the algorithm does

SoS! combines a source-grounded authoring plan with a repeatable editorial screen. It varies reasoning tasks and answer presentation independently. It never changes an answer key, pads a distractor, or claims to measure difficulty from word counts.

The distinction follows NBME's guidance on one-best-answer questions, homogeneous plausible options and technical clues. Some alternatives can be partly true while one is best under the scenario's stated criterion. Ambiguity and irrelevant wording difficulty should be removed. This guidance originated in health-sciences assessment; it is adapted here as an editorial policy across subjects. [NBME guide, chapters 2–5](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf).

## 1. Plan a varied set

- Use the learner's exam blueprint, prerequisites and source support first.
- As a starting default, allocate **30% foundations, 45% application and 25% best-answer comparison** by question family. These are intended reasoning demands, not measured easy/medium/hard ratings.
- Independently allocate **70% comparable-length options and 30% natural-length options** across the same families. A natural-length item still needs a cue check; it is not permission to make its key conspicuous.
- Allocate integer counts by largest remainder: floor each quota, then distribute remaining slots to the largest fractional remainders, resolving ties in listed order. For 20 families this gives 6/9/5 reasoning tasks and 14/6 length profiles. Small sets need not contain every category.
- Cross the two plans: both foundational and demanding questions should have comparable-length examples. Do not equate equal lengths with difficulty.
- These ratios are configurable project defaults, not research-established optima. Document changes, unavailable objectives and smaller supported sets in the review plan. Never fill a quota with unsupported items.

The browser's generated AI prompt includes these counts automatically through `StudyPrompts.designPlan`. An agent can adjust them to the actual exam in its plan without editing runtime code.

## 2. Write a defensible best answer

- State the goal, constraints, timeframe, jurisdiction/version or ranking criterion that determines the answer.
- Derive the key from inspected course sources; solve it again without relying on the draft key.
- Build distractors from realistic misconceptions, omitted conditions, wrong sequencing or an approach appropriate to a different situation.
- A runner-up can be generally true, but feedback must identify the exact criterion or scenario detail that makes it inferior here. “Less correct” without that explanation is insufficient.
- If two choices remain equally defensible, revise the scenario or withhold it. This app scores one of four options; it does not provide multi-select or partial-credit grading.
- Keep option grammar, specificity, units and detail comparable. Move shared qualifications into the stem. Never add filler solely to equalize word counts.

## 3. Run the editorial screen

From the repository root, using an existing Python 3.10+ interpreter:

```sh
python skills/exam-review-designer/scripts/audit_questions.py --bank bank.json --output ITEM_DESIGN_REPORT.md
```

The same command accepts a patch's `questions` list. An installed skill uses its actual scripts path. Reports refuse to overwrite an existing file; choose a new report name after revisions. Omit `--output` to print the screen. `--strict` returns exit code 1 when warnings exist; normal mode reports warnings without rejecting valid content. Malformed input returns 2. The standalone builder writes `ITEM_DESIGN_REPORT.md` automatically, alongside the unfilled question audit.

The screen inspects **every authored variant**:

- Count Unicode word tokens and non-whitespace characters for all four options. For short/numeric or unsegmented text use character length; otherwise use word counts. This remains a rough proxy, not a language or rendered-width model.
- Flag a uniquely longest or shortest key when its length differs from the other options' median by at least **35% and four words** (or **18 characters**).
- Flag overall max/min length spread above **1.6** with that minimum absolute gap, and normalized case/spacing/punctuation duplicates.
- Compute the success of choosing a longest and a shortest option, selecting uniformly among ties. Average variants within each family, then families equally; extra variants cannot drown out another family. Four equal lengths yield a 25% reference, rather than four supposed wins.
- Flag either bank-wide length strategy above **40% across at least 12 families**, or at **80% or more across at least five families**. These are descriptive editorial triggers, not significance tests or proof of bias. Smaller sets still get individual warnings; passing a screen does not approve the items.

Thresholds are explicit project heuristics. A warning asks for inspection; passing does not establish fair choices. Numerical answers can be equivalent despite different text; grammar, repeated wording, plausibility and visual salience still need manual review. The audit does not inspect compiled generator JavaScript. For such banks, author a reviewable JSON set of representative/edge-case variants and clearly record what was not sampled.

## 4. Review, revise, then check again

- Inspect grammar, conspicuous qualifiers, key/stem word overlap, units, numeric equivalence, factual support and the closest distractor.
- Rewrite all alternatives as needed; do not just shorten the correct one or ensure a distractor is always longest. Recompute and re-solve after any change.
- Record intended demand, length profile, best-answer criterion, runner-up rationale, actual cue checks and unresolved warnings in `QUESTION_AUDIT.md`.
- Withhold unsupported or ambiguous items. The screen never approves source correctness and never edits a bank.

## 5. Practice test-taking deliberately

Use substantive elimination in ordinary scored practice: identify relevant evidence, reject incompatible assumptions, prioritize under a stated goal, and explain the closest alternative. To practice recognizing flawed exam wording, author a separate **unscored `TEST_STRATEGY.md`** with a cueful example, explanation, corrected version and warning that guessing rules are unreliable. Do not put deliberately cueful examples into the scored bank or call their results mastery.

## 6. Adapt to actual performance cautiously

The current app targets missed, due and less-practiced families. It does not infer confidence or change scheduling from latency, answer length or these authoring labels. Repeated local attempts are practice history, not a calibrated item difficulty sample. Genuine item calibration would require an appropriate learner sample, first-exposure conditions, option analysis and reviewed validity evidence; it is outside this screen. Review unexpected errors for miskeys or ambiguity before blaming the student. [NBME guide, chapter 4](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf).

Checked October 24, 2026. The source supports construction/analysis principles; all numerical mix and screening thresholds above are SoS! design decisions. No source PDF or private course material is redistributed.
