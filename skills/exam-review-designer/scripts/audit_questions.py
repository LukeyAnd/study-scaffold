#!/usr/bin/env python3
"""Flag answer-length clues in bank JSON. Standard library; never changes questions.

This is an editorial screen, not factual verification or difficulty calibration.
Run: python audit_questions.py --bank bank.json --output ITEM_DESIGN_REPORT.md
"""
import argparse
import json
import re
import statistics
import unicodedata
from pathlib import Path


def normalized(text):
    return " ".join(unicodedata.normalize("NFKC", text).casefold().split()).rstrip(".!?。")


def inspect_variant(variant):
    options = [variant["correct"], *variant["distractors"]]
    if len(options) != 4 or not all(isinstance(x, str) and x.strip() for x in options):
        raise ValueError("Each variant needs a correct answer and three nonempty distractors.")
    words = [len(re.findall(r"\w+(?:[-’']\w+)*", x, re.UNICODE)) for x in options]
    chars = [len(re.sub(r"\s", "", x)) for x in options]
    # Single-word/numeric and unsegmented scripts use characters. Neither metric
    # measures linguistic complexity, plausibility, grammar, or subject truth.
    metric, gap = (words, 4) if max(words) >= 5 and min(words) >= 2 else (chars, 18)
    unit = "words" if metric is words else "characters"
    others = statistics.median(metric[1:])
    warnings = []
    longest = [i for i, n in enumerate(metric) if n == max(metric)]
    shortest = [i for i, n in enumerate(metric) if n == min(metric)]
    if longest == [0] and metric[0] - others >= gap and metric[0] >= 1.35 * max(others, 1):
        warnings.append("Key conspicuously longer than alternatives")
    if shortest == [0] and others - metric[0] >= gap and others >= 1.35 * max(metric[0], 1):
        warnings.append("Key conspicuously shorter than alternatives")
    if max(metric) - min(metric) >= gap and max(metric) > 1.6 * max(min(metric), 1):
        warnings.append("Uneven option lengths: inspect parallel wording")
    if len({normalized(x) for x in options}) != 4:
        warnings.append("Near-duplicate options after case/spacing/punctuation normalization")
    # A tied longest-choice strategy chooses uniformly among ties; all equal
    # lengths therefore give 1/4, rather than falsely counting every key a win.
    return {"words": words, "characters": chars, "metric": unit,
            "longestStrategy": 1 / len(longest) if 0 in longest else 0,
            "warnings": warnings}


def audit(bank):
    families, warnings = [], []
    questions = bank.get("questions")
    if not isinstance(questions, list) or not questions:
        raise ValueError("Provide bank JSON with a nonempty questions list, not a compiled JS bank.")
    seen = set()
    for question in questions:
        qid = question.get("id")
        if not isinstance(qid, str) or not qid or qid in seen:
            raise ValueError("Each family needs a unique nonempty ID.")
        seen.add(qid)
        variants = question.get("variants")
        if not isinstance(variants, list) or not variants:
            raise ValueError(f"{qid}: variants required.")
        rows = []
        for index, variant in enumerate(variants, 1):
            result = inspect_variant(variant)
            rows.append({"variant": index, **result})
        families.append({"id": qid, "variants": rows,
                         "longestStrategy": statistics.mean(r["longestStrategy"] for r in rows)})
    rate = statistics.mean(f["longestStrategy"] for f in families)
    # Each family has equal weight so many near-identical variants cannot
    # camouflage another family's cue. This is NOT a significance test.
    if len(families) >= 12 and rate > .40:
        warnings.append("Bank-level length cue: choosing a longest option succeeds over 40% in this authored set.")
    return {"families": families, "longestStrategy": rate, "warnings": warnings}


def markdown(report):
    lines = ["# Item design screen", "",
             "Editorial warnings only. No subject, source, ambiguity or difficulty approval is implied.", "",
             f"Families: {len(report['families'])}. Longest-choice strategy: {report['longestStrategy']:.1%} (four-choice chance reference: 25%).",
             "Families have equal weight; variants and ties have equal weight within each family. This is descriptive, not a statistical test.", "",
             "Thresholds are project heuristics: key/alternative median ratio ≥1.35 plus ≥4 words (or ≥18 characters); overall spread >1.6 with the same minimum gap. Bank warning: >40% across ≥12 families.", "",
             "Do not pad answers, reverse the clue, auto-change keys, or remove valid content just to pass. Move shared qualifications into the stem and rewrite alternatives in parallel; re-solve afterwards.", ""]
    lines.extend(f"- {warning}" for warning in report["warnings"])
    for family in report["families"]:
        safe_id = family["id"].replace("\n", " ").replace("\r", " ").replace("|", "\\|")
        lines.extend(["", f"## {safe_id}", ""])
        for row in family["variants"]:
            detail = "; ".join(row["warnings"]) or "No length/normalized-duplicate warning; semantic review still required"
            lines.append(f"- Variant {row['variant']}: word counts {row['words']}; character counts {row['characters']}; screen uses {row['metric']}. {detail}.")
    lines.extend(["", "## Required human/agent review", "",
                  "- Check the source, solve independently, and justify why each distractor fails under the stated assumptions.",
                  "- For best-answer items, name the criterion in the stem and the decisive evidence in feedback. Withhold two equally defensible answers.",
                  "- Check grammatical fit, stem/key word overlap, qualifiers, units, numerical equivalence, visual length and plausible misconceptions.",
                  "- Record intended reasoning demand and length profile in QUESTION_AUDIT.md. Hard wording and length parity do not establish difficulty.",
                  "- Keep deliberate cue-spotting exercises in an unscored TEST_STRATEGY.md companion. Do not include them in mastery/scheduling.", ""])
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bank", required=True, type=Path)
    parser.add_argument("--output", type=Path, help="New report path; existing files are refused")
    parser.add_argument("--strict", action="store_true", help="Exit 1 if any editorial warning is found")
    args = parser.parse_args()
    try:
        if args.bank.stat().st_size > 5 * 1024 * 1024:
            raise ValueError("Bank exceeds 5 MB.")
        report = audit(json.loads(args.bank.read_text(encoding="utf-8-sig")))
        result = markdown(report)
        if args.output:
            with args.output.open("x", encoding="utf-8") as output:
                output.write(result)
            print(f"Design screen written: {args.output}")
        else:
            print(result)
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        parser.exit(2, f"Cannot audit questions: {error}\n")
    flagged = report["warnings"] or any(r["warnings"] for f in report["families"] for r in f["variants"])
    if args.strict and flagged:
        parser.exit(1)


if __name__ == "__main__":
    main()
