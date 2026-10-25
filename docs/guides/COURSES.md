# Subjects, classes, and incremental material

Use the **Class** dropdown; **All classes…** opens the subject filter and module previews. Included examples are Accounting → Tax midterm (nine modules) and Mathematics → Everyday math (two starter modules). Each class keeps its own mastery, history, unfinished session, results, and dated restore points. Switching saves the current workspace before loading the next. The original tax ID remains `tax-midterm-v1`.

Fresh users start at **Create my review**, with example classes collapsed. Build from your own exam scope, assigned sources and expected tasks. The prompt builder's **What to upload** section recommends an exam guide/objectives, substantive notes or textbook sections, solutions/rubrics, representative questions, and optional attempts/feedback. **Source policy** defaults to supplied materials only; supplementary authoritative research is an explicit choice. See [SOURCE_GUIDE.md](../methodology/SOURCE_GUIDE.md).

The last class is remembered when browser preferences are available; `?course=ID` selects a class that exists on the device. A URL alone does not transfer private course content.

## Create with AI

Open **Options → Create with AI**, or use that action from All classes. The generator produces text locally and makes no AI/API request.

| Task | AI output | Import destination |
| --- | --- | --- |
| Create a new class | Complete source-linked `bank.json` | All classes → Add a class |
| Add material to a class | Additions-only `patch.json` for the target bank ID | Create with AI → Add material |

Specify topics/material and a question-family count. Optional context can identify exam format, source files, timing, and constraints. Copy/download the prompt and use it with your preferred AI and source material. For additions, also download the class-context JSON: it supplies modules, source/objective IDs, existing question IDs, and saved course JSON when available. Context may contain private questions; it is not uploaded automatically.

The prompt asks for source inspection, consequential missing-context questions, objective mapping, independent solution checks, corrective feedback, and three distinct distractors. Its schema example is not verified course content. AI output still needs subject review; MCQs do not reproduce every written/oral/practical exam.

The prompt also requests `QUESTION_AUDIT.md` with exact source/version evidence and actual answer/variant/distractor checks. Keep it with the authored review; importing a JSON file does not constitute content approval. **Library → Sources & review** displays references and coverage supplied by the author, not a verification certificate.

## Course import and storage

Import a `bank.json` using the [authoring schema](../../skills/exam-review-designer/references/authoring.md). Set its subject/class name before adding it. The browser validates IDs, references, variants and explanations. Files are limited to 5 MB; JSON is data and never evaluated as code.

Course records live in IndexedDB `sos-course-library`, object store `courses`, separate from learning workspaces. localStorage is the fallback. When persistent storage is unavailable, import reports an error. IndexedDB revisions reject stale catalog writes; other tabs should reload to discover catalog changes. There is no device-history merge or cloud sync.

The **Course file** action downloads imported/extended course data. To move a custom class and its progress, transfer both its course file and its separate progress backup. Import the course first, then load progress inside it. Browser data can be cleared; keep independent copies. See [STORAGE.md](STORAGE.md).

## Add material without rewriting the app

```json
{
  "kind": "sos-course-patch",
  "version": 1,
  "bankId": "the-existing-course-id",
  "topics": [],
  "objectives": [],
  "sources": [],
  "glossary": {},
  "questions": []
}
```

Supply at least one new MCQ family using the same question schema as a full bank. Add definitions for new modules/objectives/sources; references may reuse existing IDs. New questions need new IDs. Identical entries are ignored; an existing ID with different content is rejected. Patches cannot remove, overwrite, or move old questions or replace glossary definitions. Full-course updates also cannot remove existing module/question IDs or move old questions. A substantially different curriculum needs a separate bank ID.

Imported classes merge additions into their saved JSON. Bundled classes store only new material in a version-one `sos-course-additions` file referencing their original ID. Original generator functions remain intact; old questions are not flattened into sampled variants. Exported additions therefore require the matching original class on the destination installation.

Use **Open updated class** after importing. An existing session retains its original pool, exact question, and deadline; added material becomes available to new sessions. Learning history is unchanged. Imported course files and progress are not included in public ZIPs.

## Agent file map

- [courses.js](../../courses.js): validation/compilation, subject grouping, compatibility and append-only merging.
- [prompts.js](../../prompts.js): local prompt/context generation.
- [storage.js](../../storage.js): catalog persistence and independent workspaces.
- [app.js](../../app.js): selector, import and prompt UI.

Update agent routes and the portable template when these contracts change. Edit canonical root runtime files and rebuild; do not hand-edit generated snapshots.
