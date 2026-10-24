# Changelog

## Unreleased — documentation

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

The release is a study scaffold, with content verification, browser-storage, learning-measurement, and platform-testing limits described in [RELEASE_REVIEW.md](RELEASE_REVIEW.md).
