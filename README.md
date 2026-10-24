# SoS!

A minimal study framework built around **your own course sources**. Create a review with your preferred AI, check its questions, and practice adaptively in a browser.

**[Download ZIP from GitHub](https://github.com/LukeyAnd/study-scaffold/archive/refs/tags/v1.0.0.zip)** · **[Try the app](https://lukeyand.github.io/study-scaffold/)** · **[Features & scope](FEATURES.md)**

## Download and start

1. Download the ZIP above, or use **Code → Download ZIP** for the latest repository version.
2. Extract the **entire folder**. Open `index.html` in a modern browser; Windows users can also double-click `Start SoS.cmd`.
3. Choose **Create my review**. Copy the generated prompt to your preferred AI and attach your course sources there.
4. Review the returned questions, then import the course JSON through **All classes → Add a class** and start studying.

**Studying needs only a browser.** No account, API key, Node.js, Python, SQL, or package installation is required. Keep the extracted files together. If local-file browser behavior causes trouble, use the [optional localhost preview](SETUP.md#optional-preview) or hosted app.

Start with an exam guide/objectives, relevant assigned notes or textbook excerpts, and the exam format. Worked solutions and rubrics improve the fit. The browser does not read PDFs or call an AI itself. See [what to upload and verify](SOURCE_GUIDE.md).

## What it does

- **Organizes your material:** subjects, classes, modules, source-linked course imports, and additions that preserve existing questions.
- **Guides AI authoring:** a prompt generator and optional agent skill with context intake, research methodology, question audits, and standalone review generation.
- **Adapts practice:** four-option MCQs, explanatory feedback, due reviews, and extra attention to recent mistakes and unexplored scenarios.
- **Builds quizzes and exams:** category/skill filters, targeted question sets, optional time limits, deferred exam feedback, and answer review.
- **Shows progress:** clickable category/skill breakdowns, activity charts, mistakes, session history, and descriptive response timing.
- **Saves locally:** independent class workspaces, exact-session recovery, dated restore points, and portable JSON backups.
- **Keeps reading simple:** spacious, double-spaced questions, circled information help, dropdowns, focus mode, and light/dark themes.

[FEATURES.md](FEATURES.md) breaks down current capabilities, boundaries, and proposed improvements.

## Use the included agent skill

The same ZIP contains `skills/exam-review-designer/`. Give your agent this instruction:

> Read skills/exam-review-designer/SKILL.md and follow its workflow. Build a review from my sources, ask only for consequential missing context, verify the questions and sources, and report what you actually checked. Reuse existing tools and install only a missing requirement needed for this task.

For repeated use, copy that folder into your agent's supported skills directory; see [INSTALL.md](INSTALL.md). A standalone review build uses Python 3.10+ standard library; the resulting review needs only a browser. Importable course JSON can be authored without running the builder.

## Saves and privacy

- Progress stays in the current browser profile and origin. It does not automatically sync across devices, URLs, or browsers.
- Use **Library → Data & backups** to export progress before moving or clearing browser data. For custom classes, transfer the course file separately and import it first.
- The app's own code sends no study data to a server. Hosted use still makes normal page requests. Anything pasted into another AI follows that service's policies.
- Keep private notes, learner history, and backups out of public commits and issue reports.

[STORAGE.md](STORAGE.md) explains recovery, storage fallback, dated snapshots, and retained-history limits.

## First release and limits

**v1.0.0 is the first public release.** Earlier package version numbers were development bookkeeping. See [CHANGELOG.md](CHANGELOG.md), [release review](RELEASE_REVIEW.md), and [first-run checks](FIRST_RUN_TEST.md).

- Adaptation uses transparent heuristics. Mastery scores and response speed do not predict passing or certify durable retention.
- The app scores MCQs; other exam formats need companion practice. Static answer keys are inspectable, so exam mode is for personal study.
- Imported course structure is checked; factual correctness needs source review. The optional tax/math banks are examples, and tax content is unverified.
- Local data can be cleared; keep backups. Cloud sync, live tutoring, automatic textbook ingestion, and automatic reminders are outside this release.
- Direct-file launch, actual runtime installation, and full accessibility conformance have testing limits recorded in the release review.

## Guides

| Need | Start here |
| --- | --- |
| First run or setup help | [START_HERE.md](START_HERE.md), [SETUP.md](SETUP.md) |
| Sources, uploads, and question checking | [SOURCE_GUIDE.md](SOURCE_GUIDE.md) |
| Classes and adding material | [COURSES.md](COURSES.md) |
| Learning evidence and proposed next steps | [RESEARCH.md](RESEARCH.md) |
| An agent changing this repository | [AGENTS.md](AGENTS.md), [AGENT_GUIDE.md](AGENT_GUIDE.md) |

## Develop and verify

The app uses plain HTML, CSS, and JavaScript with no third-party runtime dependencies. Optional preview needs either Node.js 20+ or Python 3.10+:

```sh
node tools/serve.cjs
# or
python tools/serve.py
```

Open the printed localhost address and keep its port stable for saved progress. No `npm install` or `pip install` is needed.

For maintainers with both runtimes:

```sh
python tools/package_release.py
node --test tests/*.test.cjs
python -m unittest discover -s tests -p "*test.py"
python tools/verify_first_run.py
```

The packaging command refreshes portable skill snapshots and writes ignored QA archives to `dist/`. Those archives are not committed or hosted. Distribution uses GitHub's source ZIP, which includes the complete app, skill, research, and instructions. GitHub Actions runs checks on Windows and Linux.

## Share and report issues

Share the [repository](https://github.com/LukeyAnd/study-scaffold) or its GitHub ZIP. Each student gets their own local progress. For a bug, [open an issue](https://github.com/LukeyAnd/study-scaffold/issues) with the browser/OS, steps, expected result, and actual result; use a small nonprivate example.

MIT source-code license; see [LICENSE](LICENSE). Check permission before sharing your own course materials or generated reviews. The original Gemini-generated example is retained for provenance in `midterm_trainer.html`.
