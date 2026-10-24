# SoS!

A quiet, dependency-free study framework built around your own course materials. Turn your sources and exam requirements into a tailored review, verify the questions, and practice adaptively in a browser.

The interface uses a minimal SoS! wordmark, double-spaced typography, consistent line icons, and circled information buttons for short bullet-point guidance. Each page centers on one task; dropdowns and expandable sections reveal detail when needed.

**[Open the app](https://lukeyand.github.io/study-scaffold/)** · **[Download the project](https://github.com/LukeyAnd/study-scaffold/archive/refs/heads/main.zip)** · **[Source](https://github.com/LukeyAnd/study-scaffold)**

**[Download app ZIP](https://lukeyand.github.io/study-scaffold/downloads/study-scaffold.zip)** · **[Download agent skill ZIP](https://lukeyand.github.io/study-scaffold/downloads/exam-review-designer.zip)** · **[Install the skill](INSTALL.md)** · **[Research & methodology](RESEARCH.md)**

The `exam-review-designer` skill helps an agent inspect course material, gather missing context through question widgets or chat, map objectives, and build a source-linked review. Its self-contained ZIP includes the research, intake/plan templates, a Python builder, and the offline app template. The methodology distinguishes research findings from this app's adjustable heuristics. See the [download page](https://lukeyand.github.io/study-scaffold/downloads/) for both packages.

See [suggested student improvements](RESEARCH.md#suggested-next-steps-for-students) for the researched next-step priorities and their evidence limits. These are proposals, not implemented features.

**For AI agents:** start with [AGENTS.md](AGENTS.md), then use the task-specific reading order in [AGENT_GUIDE.md](AGENT_GUIDE.md). The skill has its own numbered workflow, and every generated course review includes an `AGENTS.md` with a local file map. Keep these routes current when the program or workflow changes.

## Get started

**New here? Read [START_HERE.md](START_HERE.md).** Studying needs only a browser. [SETUP.md](SETUP.md) gives agents a minimal dependency check and opt-in installation for optional building/development tasks. The ZIP includes `Start SoS.cmd` for Windows; opening `index.html` also works.

Start with **Create my review**, then use **What to upload** in the prompt builder. An exam guide/objectives, relevant assigned notes/textbook excerpts, and the exam format are a useful starting point; worked solutions, rubrics and representative questions improve the fit. See [SOURCE_GUIDE.md](SOURCE_GUIDE.md) for source authority, research policy and question-level accuracy checks. The tax and math banks are optional examples, not the framework's curriculum.

Choose a subject/class from the **Class** dropdown; **All classes…** shows its modules and imports. **Options → Create with AI** generates a prompt for a new course or additions-only file, so material can be added without rewriting the app. See [COURSES.md](COURSES.md).

1. Download the ZIP and extract it.
2. Open **index.html** in a modern browser. No installation, API key, account, or internet connection is needed for the downloaded app.
3. Build/import your own review, or expand **Explore example classes** to try the interface. Then start adaptive practice or open **Quizzes**.

Keep the files together. Moving between local files, browsers, and a hosted website can create separate browser-storage locations. Open **Library**, choose **Data & backups**, and use **Save backup file / Load backup** to transfer progress. Your progress does not sync automatically.

For a consistent local web address, optionally reuse Node.js 20+ or Python 3.10+ and run one of:

```sh
node tools/serve.cjs
# or
python tools/serve.py
```

Open the printed `http://127.0.0.1:4173` address. There are no npm/pip packages to install. If the port is busy, first check for an existing preview or choose `--port 4175`. `npm run serve` remains an optional convenience.

## What is included

- A consolidated overview with a recommended session, compact mastery/accuracy/coverage metrics, and an expandable category map.
- Subject/class selection with independent sessions and a local course library; validated course import and append-only additions.
- A local prompt generator with source/ID context export for the learner's preferred AI tool.
- Modules drawn from your supplied scope; optional examples demonstrate nine tax modules and two math modules. Thinking-skill labels include calculation, reverse reasoning, error spotting, comparison, application, and concepts.
- Adaptive practice that re-evaluates the next question after each answer.
- Per-scenario review scheduling and an anti-repeat window that shrinks to fit the available pool.
- Selectable Insights views with clickable mastery bars, skill breakdowns, daily activity charts, and answer history.
- Quizzes from recommended material, recent mistakes, due reviews, or a random selection.
- Exam mode with an optional time limit and explanations withheld until the end.
- Results with question-by-question review and a shortcut to retry missed scenarios.
- Double-spaced questions, answers, and explanations; responsive layout; focus mode; light and dark themes; keyboard support.
- Automatic active response timing with no confidence-rating step; timing charts do not penalize learning scores.
- A local browser database that resumes the exact unfinished session, seven dated restore points, and readable JSON backup files. No analytics or external network requests.
- A subject-independent engine, a small replacement-bank example, and automated engine tests.

## How adaptation works

This is a transparent heuristic, not a trained AI model or a validated prediction of exam readiness.

Each scenario records attempts, correct answers, the last eight outcomes, active response duration, review interval, and next review date. No confidence rating is required. Time to first choice, time to submission, answer revisions, and interruptions are recorded automatically, but do **not** penalize learning scores or change review intervals. The more recent an outcome, the more weight it receives.

Estimated mastery combines recent weighted accuracy, an evidence factor that reaches full weight after three attempts, and a modest reduction for overdue review. A single correct answer yields at most 33% scenario mastery. Secure status needs three or more attempts and at least 80% estimated mastery. New scenarios contribute zero to category mastery, making coverage visible.

Correct answers extend review intervals: roughly 12 hours, then two days, then an increasing interval up to 90 days. Mistakes bring the next review forward to about ten minutes. Legacy self-reported confidence remains readable in older backups; new answers do not infer it from speed. Intervals are study prompts rather than scientific estimates of memory decay.

Adaptive selection assigns more weight to recent mistakes, due reviews, lower mastery, and unexplored scenarios. In broad pools it avoids the last 15 scenarios; smaller pools use a smaller window. A one-question pool necessarily repeats. The same scenario can generate fresh numeric variations; the algorithm tracks the scenario's underlying skill rather than treating each variation as new curriculum.

Quiz and exam plans are fixed, contain no repeated scenario IDs, and respect the selected categories and thinking skill. Recommended selection weights weak scenarios but can include other material. Use **Recent mistakes only** or **Reviews due now** for strict targeting. Empty filters show an empty state instead of silently substituting unrelated content.

Only submitted answers update learning records. Unanswered questions reduce the session score but do not become artificial learning failures. Exam feedback is deferred, and an expired timer finishes the session. Navigating, closing, or reloading preserves the unfinished session, exact generated question, and selected answer when the save completes. Timed exams keep their original deadline on reopening. Hidden-tab browser timer throttling can delay the displayed countdown, but the deadline is checked again before any answer is accepted.

Open **Library → Data & backups** to save a dated JSON file in your preferred location, load an earlier backup, or restore one of the latest seven study dates. JSON is readable text; no SQL setup is needed. IndexedDB is the default local database, with localStorage as a fallback. See [STORAGE.md](STORAGE.md) for storage behavior, recovery, timing fields, and limitations.

## Replace the content

For normal use, import a complete course JSON through **All classes → Add a class**, or use **Create with AI → Add material** for additions-only patches. These paths preserve runtime code and existing course history. The JavaScript example below is an advanced bank-authoring option.

The tax bank is an example, not a dependency of the engine. **The supplied Gemini tax explanations have not been independently verified for legal accuracy, current law, or a specific tax year.** Validate them against your course materials before relying on them. The software tests check generation and learning behavior, not the truth of the tax content.

For a minimal starting point, edit the bank script in `index.html`:

```html
<script defer src="banks/example.js"></script>
```

Create a bank JavaScript file that defines `globalThis.STUDY_BANK`:

```js
globalThis.STUDY_BANK = {
  id: 'my-course-v1',
  title: 'My course',
  reviewStatus: 'Reviewed for Fall 2026',
  topics: [{ id: 'unit-one', name: 'Unit one' }],
  glossary: { 'A term': 'A clear definition.' },
  questions: [{
    id: 'stable-scenario-id',
    topic: 'unit-one',
    angle: 'Understanding the core idea',
    skill: 'Concepts',
    generate() {
      return {
        prompt: 'Your question.\n\nA second paragraph, if needed.',
        correct: 'The correct answer.',
        distractors: ['Plausible alternative A.', 'Plausible alternative B.', 'Plausible alternative C.'],
        concept: 'Explain the rule, not just the answer.',
        math: 'Optional steps or a worked solution.',
        whyWrong: ['Why A falls short.', 'Why B falls short.', 'Why C falls short.']
      };
    }
  }]
};
```

Use unique topic IDs and scenario IDs, with exactly three distinct distractors. Scenario IDs should stay stable while the learning objective stays the same. Give materially different material a new bank ID to isolate its progress. Text is rendered as text rather than trusted HTML. For customized skill categories, set `skill` explicitly; otherwise the adapter infers a skill from `angle` and `isMath`.

Only load bank scripts from authors you trust: JavaScript banks are executable code. Browser UI does not execute code from progress JSON. Backups must match the active bank and pass schema checks.

## Project structure

```text
index.html                 App shell; choose your active bank here
styles.css                 Shared design tokens and responsive layouts
app.js                     UI, routing, storage, sessions, and chart interactions
core.js                    Subject-independent, testable adaptive engine
storage.js                 Local database, session snapshots, backup validation
courses.js                 Course JSON, subjects, and append-only updates
prompts.js                 Local AI authoring prompts and class context
banks/tax.js               Supplied 54-scenario example bank
banks/example.js           Tiny replacement-bank template
tests/engine.test.cjs      Learning, scheduling, filtering, and generator tests
tools/serve.cjs            Optional loopback-only static server
tools/extract-bank.cjs     One-time adapter for the supplied original
midterm_trainer.html       Unchanged supplied original, kept for reference
DESIGN.md                  Design decisions and suggested next improvements
REVIEW.md                  Code-review findings and implementation notes
RESEARCH.md                Cited learning methodology and research limits
STORAGE.md                 Session recovery, dated backups, and timing data
INSTALL.md                 Skill installation and download guide
skills/exam-review-designer/ Portable intake, authoring workflow, and app template
downloads/                 App/skill ZIPs, checksums, and download page
```

## Verify changes

```sh
npm test
python -m unittest discover -s tests -p "*test.py"
```

The suite exercises all 54 supplied generators across 100 random variations each, cooldowns, mastery regressions, legacy confidence-sensitive scheduling, unique exam plans, strict review filters, workspace recovery validation, backup compatibility, bank replacement, and response-time independence from mastery/scheduling. No dependencies are required.

The Python suite checks portable skill generation, source/objective validation, no-overwrite behavior, ZIP completeness, and synchronization of app/research snapshots. Python 3.10+ is needed for those checks. `python tools/package_release.py` rebuilds both ZIPs and synchronizes the skill's generated resources after source edits.

## Share it

Send the repository link or a ZIP of the project. Each learner gets their own progress in their own browser. Progress files and screenshots are ignored by Git.

This repository is configured for **GitHub Pages** at **https://lukeyand.github.io/study-scaffold/**. For your own fork, open **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/(root)**. A static host can serve the same files. Hosting does not add progress syncing or accounts. The app's own code sends no study data to a server; the hosting provider will still receive normal page requests.

## Storage limits and known tradeoffs

- Records retain all-time per-scenario totals; detailed charts retain the latest 5,000 answer events and the latest 100 completed sessions.
- Browser data can be cleared or disabled. Save independent backup files periodically; storage errors are shown instead of silently ignored. Dated restore points require IndexedDB.
- Progress is designed for one active study tab. Database revisions reject stale writes, and a warning asks the other tab to reload. Simultaneous editing is not merged.
- Static question banks and answer keys are inspectable in the browser. Exam mode is for self-assessment, not proctored or high-stakes testing.
- No automatic AI calls, automatic source ingestion, cloud syncing, or authentication is included. The prompt generator prepares instructions for the learner's preferred AI.

## License

MIT. See [LICENSE](LICENSE). The supplied example content retains its provenance as Gemini-generated study material provided for this project.
