#!/usr/bin/env python3
"""Create a new offline MCQ review from vetted JSON, resolved context, and a plan.

Uses only Python's standard library. It never downloads files or overwrites a folder.
"""
import argparse
import json
import re
import shutil
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_FILES = ("index.html", "app.js", "core.js", "styles.css", "favicon.svg")
ID_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9._-]{0,79}\Z")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def text(value):
    return isinstance(value, str) and bool(value.strip())


def identifier(value):
    return isinstance(value, str) and bool(ID_RE.fullmatch(value)) and value not in {"constructor", "prototype", "__proto__"}


def read_json(path):
    path = Path(path)
    require(path.stat().st_size <= 5 * 1024 * 1024, f"Input is larger than 5 MB: {path.name}")
    return json.loads(path.read_text(encoding="utf-8-sig"))


def validate_bank(bank):
    require(isinstance(bank, dict) and identifier(bank.get("id")) and text(bank.get("title")), "Bank needs a stable id and title.")
    sets = {}
    for field in ("topics", "objectives", "sources", "questions"):
        entries = bank.get(field)
        require(isinstance(entries, list) and bool(entries), f"Bank needs a nonempty {field} list.")
        ids = []
        for entry in entries:
            require(isinstance(entry, dict) and identifier(entry.get("id")), f"Every {field} entry needs a safe, stable id.")
            ids.append(entry["id"])
        require(len(set(ids)) == len(ids), f"Duplicate ids in {field}.")
        sets[field] = set(ids)
    for topic in bank["topics"]:
        require(text(topic.get("name")), "Each topic needs a name.")
    for objective in bank["objectives"]:
        require(text(objective.get("description")), "Each objective needs a description.")
    for source in bank["sources"]:
        require(text(source.get("title")) and text(source.get("locator")), "Each source needs a title and locator.")
    glossary = bank.get("glossary", {})
    require(isinstance(glossary, dict) and all(text(k) and text(v) for k, v in glossary.items()), "Glossary must map terms to definitions.")
    for question in bank["questions"]:
        label = question["id"]
        require(question.get("format") == "mcq", f"{label}: this app supports mcq format only; provide companion tasks for other formats.")
        require(question.get("topic") in sets["topics"] and text(question.get("angle")) and text(question.get("skill")), f"{label}: unknown topic or missing angle/skill.")
        objectives = question.get("objectiveIds")
        require(isinstance(objectives, list) and bool(objectives) and all(x in sets["objectives"] for x in objectives), f"{label}: every question needs known objectiveIds.")
        refs = question.get("sourceRefs")
        require(isinstance(refs, list) and bool(refs), f"{label}: sourceRefs are required.")
        for ref in refs:
            require(isinstance(ref, dict) and ref.get("sourceId") in sets["sources"] and text(ref.get("locator")), f"{label}: unknown source or missing question-level locator.")
        variants = question.get("variants")
        require(isinstance(variants, list) and bool(variants), f"{label}: provide one or more variants.")
        for variant in variants:
            require(isinstance(variant, dict) and all(text(variant.get(k)) for k in ("prompt", "correct", "concept")), f"{label}: each variant needs prompt, correct, and concept.")
            wrong, why = variant.get("distractors"), variant.get("whyWrong")
            require(isinstance(wrong, list) and len(wrong) == 3 and all(text(x) for x in wrong), f"{label}: exactly three distractors are required.")
            require(isinstance(why, list) and len(why) == 3 and all(text(x) for x in why), f"{label}: explain all three distractors.")
            require(len({x.strip().casefold() for x in [variant["correct"], *wrong]}) == 4, f"{label}: duplicate answer choices.")
            require("math" not in variant or isinstance(variant["math"], str), f"{label}: math must be text.")
    return bank


def validate_context(context):
    require(isinstance(context, dict), "Context must be an object.")
    course = context.get("course", {})
    require(isinstance(course, dict) and text(course.get("title")), "Resolve the course title before creating the review.")
    scope = course.get("scope")
    require(isinstance(scope, list) and bool(scope) and all(text(x) for x in scope), "Resolve the review scope before creating the review.")
    require(context.get("alignmentStatus") in {"course-aligned", "general-provisional"}, "Set alignmentStatus to course-aligned or general-provisional after intake.")
    return context


def compile_bank(bank):
    # JSON becomes data in an external script, never eval or an HTML interpolation.
    payload = json.dumps(bank, ensure_ascii=False, allow_nan=False)
    return """/* Generated from bank.json. Review the source material before relying on answers. */
globalThis.STUDY_BANK = (() => {
  const data = PAYLOAD;
  const sources = new Map(data.sources.map(s => [s.id, s]));
  return {...data, questions: data.questions.map(q => ({...q, generate() {
    const variant = q.variants[Math.floor(Math.random() * q.variants.length)];
    const provenance = q.sourceRefs.map(ref => sources.get(ref.sourceId).title + ' — ' + ref.locator).join('; ');
    return {...variant, concept: variant.concept + '\\n\\nSources: ' + provenance};
  }}))};
})();
""".replace("PAYLOAD", payload, 1)


def create_review(bank_path, context_path, plan_path, output):
    bank = validate_bank(read_json(bank_path))
    context = validate_context(read_json(context_path))
    plan = Path(plan_path).read_text(encoding="utf-8-sig")
    require(bool(plan.strip()), "A nonempty review plan is required.")
    target = Path(output).expanduser().resolve()
    require(not target.exists(), f"Output already exists; choose a new folder: {target}")
    require(not target.is_relative_to(SKILL_ROOT), "Write the review outside the installed skill folder.")
    template = SKILL_ROOT / "assets" / "study-app"
    require(all((template / f).is_file() for f in TEMPLATE_FILES), "Bundled app template is incomplete. Download the complete skill ZIP.")
    compiled = compile_bank(bank)
    target.mkdir(parents=True)
    for filename in TEMPLATE_FILES:
        shutil.copyfile(template / filename, target / filename)
    (target / "banks").mkdir()
    (target / "banks" / "course.js").write_text(compiled, encoding="utf-8")
    (target / "bank.json").write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (target / "review-context.json").write_text(json.dumps(context, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (target / "REVIEW_PLAN.md").write_text(plan, encoding="utf-8")
    (target / "SOURCES.md").write_text("# Source register\n\n" + "\n\n".join(f"## {s['id']}: {s['title']}\n\n{s['locator']}\n\nVersion: {s.get('version', 'not specified')}" for s in bank["sources"]) + "\n", encoding="utf-8")
    (target / "README.md").write_text(
        "# Your exam review\n\nOpen index.html in a browser with the files kept together. No installation or internet connection is needed.\n\n"
        "Read REVIEW_PLAN.md for the scope, assumptions, schedule, and assessment limits. Source locations appear in explanations and SOURCES.md.\n\n"
        "This app scores four-option MCQs. Use companion tasks for written/oral assessment. Learning scores are heuristics, not pass probabilities.\n\n"
        "Progress stays in the browser; export it from Library & data before changing devices or locations.\n\n"
        "This folder includes course context and a source-linked question bank. Check it for private or restricted material before sharing.\n",
        encoding="utf-8")
    shutil.copyfile(SKILL_ROOT / "LICENSE", target / "LICENSE")
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bank", required=True, help="Source-linked bank JSON")
    parser.add_argument("--context", required=True, help="Resolved review-context.json")
    parser.add_argument("--plan", required=True, help="Completed review plan Markdown")
    parser.add_argument("--output", required=True, help="A new output directory; existing directories are refused")
    args = parser.parse_args()
    try:
        result = create_review(args.bank, args.context, args.plan, args.output)
    except (ValueError, OSError, TypeError, KeyError) as error:
        parser.exit(1, f"Cannot create review: {error}\n")
    print(f"Review created: {result}\nOpen {result / 'index.html'}")


if __name__ == "__main__":
    main()
