# SoS! features and scope

SoS! helps students turn their own course material into a review, practice it in a browser, and return to areas that need attention. It includes a browser app and an optional AI-agent skill for creating reviews.

## Start and study

- Use the hosted app or download and extract the app ZIP for offline study.
- Open `index.html`; Windows users also have `Start SoS.cmd`.
- Studying requires a browser, with no account, API key, Node.js, Python, SQL, or package installation.
- Start with your own review or expand the optional tax/math examples.

## Subjects, classes, and modules

- Filter classes by subject and switch classes from a dropdown.
- Organize each class into modules/categories, objectives, and thinking skills appropriate to its material.
- Keep separate learning history and saved sessions for each class.
- Import a course JSON file; add new material through additions-only files that preserve existing questions and IDs.

## Create with AI

- Generate a prompt for a new class or additions to an existing class.
- Include scope, exam constraints, a source inventory, and supplied-only or supplemental-research instructions.
- See suggested uploads and export existing class context to help an agent preserve the structure.
- Copy the prompt to your chosen AI, attach sources there, then import its reviewed JSON output. The app itself does not contact an AI or read uploaded textbooks/PDFs.

## Agent-assisted review creation

- The optional **Exam Review Designer** skill walks an agent through intake, source inspection, objective mapping, question writing, and verification.
- Agents use available question widgets or chat to gather consequential missing context.
- Source guidance covers editions/dates, exact locators, conflicting information, and an inspectable question audit. Correctness still requires actual review.
- The Python builder creates a standalone browser review with course data, context, a review plan, a source register, an initially unreviewed audit template, and agent handoff instructions.
- The agent workflow can prepare companion tasks for other exam formats; the browser app currently scores multiple-choice questions only.

## Adaptive practice and feedback

- Answer four-option multiple-choice questions, with randomized answer order and authored/generated variations where available.
- Practice across the class or focus on a category and thinking skill.
- The next adaptive question favors recent mistakes, due reviews, lower estimated mastery, and unexplored scenarios; a pool-sized cooldown reduces immediate repetition.
- See the correct answer, explanations, worked steps, distractor feedback, and source references when supplied by the author.
- Submitted answers update the learning record and suggested review interval. No confidence-rating click is required.

## Quizzes, exams, and results

- Choose a question count, categories, thinking skill, and recommended, recent-mistake, due-review, or random selection.
- Preview the session breakdown before starting. A quiz/exam contains no repeated scenario IDs and may be smaller when filters limit the pool.
- Practice quizzes show feedback after submission; exams defer feedback until the session ends.
- Choose untimed study or a preset exam duration. Timed sessions keep their original deadline across reopening.
- Review session scores and individual answers, filter results, and retry missed scenarios.

## Progress and insights

- See estimated mastery, answer accuracy, explored scenarios, and due reviews in the overview.
- Open category and thinking-skill breakdowns, activity charts, session history, answer history, mistakes, and secure-scenario views.
- Click relevant bars/rows to inspect the underlying category, scenarios, day, or answers.
- Inspect descriptive response-time summaries. Active viewing time, first-choice time, revisions, and interruptions are recorded automatically; speed does not become a confidence score or change learning scores/scheduling.
- Use the Library for modules, authored glossary/reference material, sources, and data controls.

## Local saves and backups

- Automatically save progress and the exact unfinished question, answer order, and selected answer when the save completes.
- Use the browser's IndexedDB database, with localStorage fallback and visible storage-error reporting.
- Restore from the latest seven saved study dates when IndexedDB is available, or export/import readable JSON backups.
- Export imported/extended course data separately. To move a custom class and progress, import the course on the destination first, then load its progress backup.
- Progress belongs to the browser profile and origin. Devices, browsers, local files, and different URLs do not automatically share it; simultaneous histories are not merged.

## Reading and navigation

- Minimal SoS! wordmark, spacious layout, and double-spaced questions, answers, and explanations.
- Labeled icons, native dropdowns, and expandable sections keep secondary controls out of the main task.
- Circled information buttons provide short bullet-point guidance.
- Responsive layout, light/dark themes, focus mode, and keyboard shortcuts support different study settings. A complete accessibility conformance audit is still pending.

## Setup, sharing, and customization

- Download separate app and agent-skill ZIPs, with published checksums and an MIT source-code license.
- Follow the beginner guide and task-specific agent file map. The Windows setup helper checks existing tools and offers explicit installation of missing requirements.
- Building a standalone review needs Python 3.10+; optional localhost preview can use Node.js 20+ or Python. Neither route requires npm/pip packages.
- Keep question data separate from the app; replace content or add classes without rebuilding the interface.
- Use the research methodology and source-quality workflow when creating or checking material. See [START_HERE.md](START_HERE.md), [SETUP.md](SETUP.md), and [SOURCE_GUIDE.md](SOURCE_GUIDE.md).

## Current boundaries

- Adaptation is an explainable heuristic, not a trained AI model, validated memory estimate, or prediction of passing an exam. Repeated success in one sitting can raise its current mastery score.
- Browser imports validate structure and compatibility; they do not establish factual correctness. Example banks are demonstrations, and the tax content is unverified.
- Browser storage can be cleared or unavailable. Detailed history retains up to 5,000 answer events and 100 completed sessions; independent backup files remain useful.
- Cloud sync, accounts, live AI tutoring, automatic source ingestion, reminders, proctoring, and written-answer grading are outside the current app's scope. Static answer keys can be inspected.
- The app's own code sends no study data to a server. Hosted use still makes normal page requests; sharing a course or progress file is a deliberate user action.

## Proposed improvements

- A time-budgeted **Today** plan and clearer evidence of recall across different days.
- A worked-example repair route, numeric/written response formats, and genuinely reserved assessment questions.
- Question flagging, richer objective/source coverage views, a mistake notebook, and additional reading preferences.

These are recommendations, not implemented features. See the [researched priorities and evidence limits](RESEARCH.md#suggested-next-steps-for-students).

Keep this overview current when capabilities change; implementation contracts remain in [COURSES.md](COURSES.md) and [STORAGE.md](STORAGE.md).
