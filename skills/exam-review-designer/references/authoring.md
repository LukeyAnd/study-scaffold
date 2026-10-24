# Author a source-aligned browser review

The skill ZIP contains an offline app template. The script assembles a new review from a validated bank, resolved intake context, and a plan. It does not generate or verify subject knowledge on its own.

## Inputs and command

Create `bank.json`, `review-context.json`, and `REVIEW_PLAN.md` in the learner's workspace. Then run:

```sh
python /path/to/exam-review-designer/scripts/create_review.py \
  --bank /path/to/bank.json \
  --context /path/to/review-context.json \
  --plan /path/to/REVIEW_PLAN.md \
  --output /path/to/new-review-folder
```

On Windows, use one line or the shell's own continuation syntax and quote paths with spaces. Use the Python executable available in the host. The script uses Python 3.10+ and standard-library modules only. Output must be a new directory outside the installed skill; it does not replace an existing review.

## Bank JSON

Use this structure; a runnable minimal demonstration is in `assets/example-bank.json`:

```json
{
  "id": "course-objectives-v1",
  "title": "Course review",
  "reviewStatus": "Draft — verify against course sources",
  "topics": [{"id": "unit-a", "name": "Unit A"}],
  "objectives": [{"id": "obj-a", "description": "Apply the governing rule to a new case"}],
  "sources": [{"id": "source-a", "title": "Course notes", "locator": "notes.pdf", "version": "Supplied course version"}],
  "glossary": {},
  "questions": [{
    "id": "rule-application-family",
    "format": "mcq",
    "topic": "unit-a",
    "objectiveIds": ["obj-a"],
    "angle": "Rule application",
    "skill": "Application",
    "sourceRefs": [{"sourceId": "source-a", "locator": "Page 7, worked case 2"}],
    "variants": [{
      "prompt": "A fully specified question about the rule.",
      "correct": "The independently verified best answer.",
      "distractors": ["A plausible misconception.", "A wrong method.", "A relevant exception that does not apply."],
      "concept": "The governing rule, reasoning, and the assumptions that matter.",
      "math": "Optional calculation or worked steps.",
      "whyWrong": ["Why the misconception fails.", "Why this method fails.", "Why the exception does not apply."]
    }]
  }]
}
```

The specimen demonstrates structure, not real course content. Replace its prose and source locations with inspected material. The demo arithmetic bank is also illustrative; do not deliver it as the learner's course review.

Requirements checked by the script:

- Stable safe IDs; unique topics, objectives, sources, and question families.
- Known topic/objective/source references on every question, with precise question-level locators.
- `format: "mcq"`, a thinking-skill label, and one or more variants.
- Exactly one correct answer, three textually distinct distractors, and three rationales per variant.
- A course title, nonempty scope, and `alignmentStatus` of `course-aligned` or `general-provisional` in the context record.

These are structural checks, not proof of content validity. Check semantic duplicate answers, equivalent numeric options, ambiguity, rounding, and source interpretation yourself. The script preserves objective and source metadata; source locations are also appended to the rendered explanation. The current dashboard aggregates question families/topics/skills, not objective-specific psychometric estimates.

## Stable families and variants

Variants under one question ID share learning history. Use a family when variants test the same objective and comparable reasoning. If the skill or governing rule changes materially, use a different ID or bank revision. Do not multiply near-identical questions to inflate coverage or represent three variants as three independent skills.

Reserve held-out items separately when a later assessment is intended to be novel. Do not include those items in the training bank and call them held out merely because they have not been randomly selected yet. For multi-format assessments, create companion `WRITTEN_PRACTICE.md`, oral prompts, or coding tasks with source-linked rubrics and identify the limits of automated scoring.

## Delivery checks

1. Confirm that the context and plan reflect the learner's actual answers and accessible sources.
2. Independently solve every variant; compare against the source and rubric; check the objective coverage map.
3. Open the generated `index.html` or use a local preview when the environment allows it. Verify answer selection, feedback, small-screen layout, and bank counts. If unavailable, state which checks remain unperformed.
4. Verify that `bank.json`, `SOURCES.md`, `REVIEW_PLAN.md`, and the context record travel with the local output. The app needs the HTML, CSS, scripts, and banks folder together.
5. Before sharing a ZIP, review included context, questions, and source excerpts for private/restricted material. The script does not upload or publish anything.

For a chat/document review, use the same source/objective/feedback design without requiring this app or script.
