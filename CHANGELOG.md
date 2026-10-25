# Changelog

## 1.2.1 — 2026-10-24

- Preserve unreadable progress exports; require a recovery copy before replacement, and explicitly reconcile unavailable question families. Read stored exports afresh after other-tab changes.
- Prevent early correct repetition from inflating review intervals. Require observed delayed success for Secure status and exclude overdue items consistently.
- Prevent duplicate scenarios at floating-point sampling boundaries. Remove redundant autosave cloning while preserving queued snapshot ownership.
- Align builder/browser Unicode, metadata and count validation; screen both shortest and longest answer cues in smaller banks.
- Split oversized clarity backups into numbered parts; provide raw malformed-note recovery including image bytes.
- Package only explicit public manifest entries, including outside Git; clarify learner-workspace templates and pin app methodology to this release.
- Add regression, privacy, validator parity and browser recovery checks.


## 1.2.0 — October 24, 2026

- Grouped longer guides under `docs/guides`, `docs/methodology` and `docs/maintenance`; moved the historical prototype/adapter into `archive`. Kept the app, launchers, README and short agent entry points at the root, with updated routes and package tests.
- Replaced repeated quiz-planning scans with cached weighted sampling through a sum tree. Added 600 seeded replays against the prior sampler and a reproducible large-bank benchmark.
- Indexed classes in one pass and paged scenario details in sets of 50 with a labeled native dropdown, filter reset and retained keyboard focus.
- Made import/date restoration commit before replacing the live workspace. Progress reset now updates the workspace and clears restore points atomically; failures keep the previous session recoverable.
- Added browser failure injection and a 5,000-family/1,000-question scale workflow. The historical adapter now requires an explicit new output and refuses overwrites.
- Hardened both optional previews against directory aliases that resolve to hidden or outside files, with cross-platform regression fixtures.

## 1.1.1 — October 24, 2026

- Made learner startup and handoffs explicit: begin the requested review immediately, complete authorized work autonomously, and ask the next essential question or give one exact learner action when needed.
- Added a copyable ZIP/attachment start prompt, a single-file intake fallback, resume guidance, and host-aware file/localhost delivery instructions.
- Updated the installed skill's default prompt, generated-review agent guide and browser-generated AI prompts to preserve guided continuation.
- Shortened skill metadata for portability and documented current ChatGPT/Codex and Claude activation paths without claiming universal auto-installation or live host verification.

## 1.1.0 — October 24, 2026

- Added a question-side clarity drawer for text, pasted device-dictation transcripts and raster images, with exact question/concept/source context.
- Added a module/status-filtered notes queue, end-session access, linked-family practice, manual AI prompt/image handoff and a saved explanation/resolution field.
- Added separate local notes/image storage and backup, transactional stale-write protection, text-only fallback and recoverable save errors. Notes do not change learning scores.
- Added a default reasoning/length mix to AI authoring prompts, explicit best-answer criteria, a standalone cue-audit command and a generated item-design report. Thresholds are editorial heuristics; deliberate cue-spotting exercises remain unscored.

- Converted copyable AI prompts to fenced text blocks so GitHub provides its native copy icon; terminal commands remain separate from AI prompts.
- Added an accessible Mermaid workflow showing selected local sources, agent authoring and review, browser study, and local progress/backup storage.

## 1.0.1 — October 24, 2026

- Added clearly separated human terminal instructions and AI-agent routes in the repository README.
- Documented starting, stopping and restarting a local session, keeping a stable address, and where browser progress is saved.
- Every generated review now includes a human README and its own dependency-free Python preview in `tools/serve.py`, so it can be served after the original skill/project is moved or unavailable.
- Added a generated-review server restart check; app runtime and learning behavior are unchanged.

## 1.0.0 — October 24, 2026

First public release of SoS!, a source-first browser study framework and optional review-authoring agent skill. Earlier package versions described development iterations; there were no earlier GitHub releases.

- Subject/class/module organization, safe course JSON import, and additions-only material updates.
- Adaptive MCQ practice, explanatory feedback, targeted quizzes, and optional timed exam sessions.
- Clickable progress views, response-time summaries, exact-session recovery, dated restore points, and portable backups.
- Minimal, spacious reading interface with circled help, dropdowns, themes, focus mode, and keyboard support.
- AI prompt generation, source-quality guidance, research methodology, an inspectable question-audit workflow, and a self-contained standalone-review builder.
- Beginner setup instructions, task-specific runtime checks, optional preview servers, agent file maps, and a features guide.
- One GitHub source ZIP for distribution. Removed website ZIP files, the download page, and tracked generated archives; local QA artifacts stay in ignored `dist/`.
- Fixed learning-record lookup for question IDs that match inherited JavaScript property names.
- Corrected selected-incorrect answer colors so selection styling cannot override answer feedback.

The release is a study scaffold, with content verification, browser-storage, learning-measurement, and platform-testing limits described in [RELEASE_REVIEW.md](docs/maintenance/RELEASE_REVIEW.md).
