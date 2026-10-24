# Context intake

The goal is sufficient information for a useful review, not a long onboarding form. Begin by extracting what the user has already given you. The course's objectives, representative assessment, and available time usually determine more than cosmetic preferences do.

## A small adaptive conversation

Read [source-quality.md](source-quality.md) for source-pack suggestions and authority checks. Start with scope plus relevant substantive material and exam format; do not require every suggested upload for a small task. Recommend worked solutions/rubrics and representative questions when they would change the review. Ask for actual readable source excerpts, not merely a title. Keep source policy (supplied-only by default), governing version, access gaps, and conflicts in the context record.

Ask only unresolved high-value questions. Example first batch when almost nothing is known:

1. **Scope and material:** “What course and topics are on this exam? Please attach the exam guide, objectives, or representative material you want me to use.” Ask for attachments in ordinary chat, not a text-only widget.
2. **Exam task:** “Which response format is closest: multiple choice, worked problems, written/oral answers, or a mixture?” Use host-supported options or a free-text answer. Follow up on rubric/allowed resources only if needed.
3. **Time horizon:** “When is the exam, and how much time can you realistically study before it?” If a date/time is ambiguous, ask for the relevant time zone; do not convert a vague date into an invented deadline.

Once these are known, inspect sources and ask at most the remaining consequential follow-up: “Which topics or past errors should get special attention?” or “Are there weighting, calculator, open-book, or access constraints I should account for?” Skip anything the source material already answers.

Do not always send these exact three questions. If the user supplies a detailed syllabus, exam date, and sample questions, summarize your extraction and ask only what remains missing. If they request one quick quiz, do not require a complete multi-week study profile.

## Widget contract

- Use an available ask/request-input widget for discrete choices if the host supports it in the active mode. Ordinary chat is an equally valid fallback.
- Keep prompts self-contained. Choose mutually understandable options, let the host supply free text, and do not invent unsupported UI controls.
- For asynchronous tools, an accepted request means the question was shown, not answered. Continue independent work and keep dependent assumptions explicit until a reply arrives.
- A file attachment, screenshot, equation, or long rubric may need ordinary chat rather than a widget.
- Never install an extra plugin solely to display a questionnaire.

## Decision gates

| Situation | Next action |
| --- | --- |
| Source material is accessible and scope is clear | Inspect it, build an objective map, ask only for consequential missing exam constraints. |
| Materials are absent or inaccessible | Ask for a usable excerpt/file or offer a labeled general review; do not fabricate access or source locations. |
| Sources disagree | Identify the conflict and ask which version/course authority governs before grading the disputed item. |
| Exam is tomorrow | Prioritize major objectives, misconceptions, and a brief mixed check; use feasible short returns rather than a long schedule. |
| Date unknown but a quiz is requested | Build the quiz; provide relative review sessions only if helpful. |
| Exam format unknown | Offer provisional mixed practice. Do not claim a faithful simulation. |
| No topic weights supplied | Declare provisional equal weights or another reasoned allocation; distinguish this from instructor weighting. |
| No performance history | Treat stated weaknesses as hypotheses and sample major objectives. |
| User dislikes quizzes or cannot use timed input | Adapt the format and timing. Ask about functional needs without requiring a diagnosis. |
| User already answered the key questions | Start. Do not repeat a generic intake. |

## Context record

Use `assets/review-context.json` as a starting shape, leaving unknown values null. Add only relevant fields. Each assumption should include the decision it affects and whether it was confirmed. Every inspected source needs an accessible locator: file + page/slide/section or a fetched URL + section. A source is not inspected merely because it was mentioned.

Minimum useful blueprint: objective, source locator, target exam task, weight if known, diagnostic evidence, and planned practice. Add jurisdiction/date for topics where answers vary with them. The evidence of learning should distinguish assisted practice, independent practice, and delayed assessment.
