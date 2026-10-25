"""Behavioral checks for advisory item screening; no subject approval is implied."""
import copy
import json
import os
from pathlib import Path
import runpy
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "skills/exam-review-designer/scripts/audit_questions.py"
api = runpy.run_path(str(SCRIPT))


def variant(correct="alpha beta gamma delta epsilon zeta", wrong=None):
    return {"correct": correct, "distractors": wrong or ["iota beta gamma delta epsilon zeta", "kappa beta gamma delta epsilon zeta", "theta beta gamma delta epsilon zeta"]}


def bank(rows):
    return {"questions": [{"id": f"q-{i}", "variants": row} for i, row in enumerate(rows)]}


class QuestionDesignTests(unittest.TestCase):
    def test_flags_key_lengths_in_both_directions_without_changing_options(self):
        long = variant("alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu", ["alpha beta gamma delta", "epsilon zeta eta theta", "iota kappa lambda mu"])
        original = copy.deepcopy(long)
        self.assertTrue(any("longer" in x for x in api["inspect_variant"](long)["warnings"]))
        self.assertEqual(long, original)
        short = variant(long["distractors"][0], [long["correct"], long["correct"] + " nu", long["correct"] + " xi"])
        self.assertTrue(any("shorter" in x for x in api["inspect_variant"](short)["warnings"]))

    def test_ties_and_extra_variants_cannot_manufacture_a_bank_pass(self):
        tied = api["inspect_variant"](variant())
        self.assertEqual(tied["longestStrategy"], .25)
        self.assertEqual(tied["warnings"], [])
        long = variant("alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu", ["alpha beta gamma delta", "epsilon zeta eta theta", "iota kappa lambda mu"])
        report = api["audit"](bank([[long], [variant()] * 100]))
        self.assertEqual(report["longestStrategy"], .625)
        self.assertFalse(report["warnings"])
        report = api["audit"](bank([[long]] * 12))
        self.assertTrue(report["warnings"])

    def test_numeric_short_and_unsegmented_options_use_character_screen(self):
        row = api["inspect_variant"](variant("100", ["200", "300", "400"]))
        self.assertEqual(row["metric"], "characters")
        self.assertEqual(row["longestStrategy"], .25)
        self.assertFalse(row["warnings"])
        row = api["inspect_variant"](variant("这是完整说明" * 7, ["第一个选项", "第二个选项", "第三个选项"]))
        self.assertTrue(any("longer" in x for x in row["warnings"]))

    def test_small_and_large_banks_screen_both_length_directions(self):
        # One-word gaps avoid item-level warnings but can still leak the key.
        long = variant("a b c d e f g", ["a b c d e f", "b c d e f g", "c d e f g h"])
        short = variant("a b c d e f", ["a b c d e f g", "b c d e f g h", "c d e f g h i"])
        for count in (5, 10, 12):
            for row, label in ((long, "longest"), (short, "shortest")):
                report = api["audit"](bank([[row]] * count))
                self.assertTrue(any(label in warning for warning in report["warnings"]))
            self.assertFalse(api["audit"](bank([[variant()]] * count))["warnings"])
        self.assertFalse(api["audit"](bank([[long]] * 4))["warnings"])
        mixed = api["audit"](bank([[long], [short], [variant()], [variant()]] * 3))
        self.assertFalse(mixed["warnings"])

    def test_normalized_duplicates_are_flagged_but_not_rewritten(self):
        row = api["inspect_variant"](variant("Same answer.", ["  SAME   answer  ", "Different choice", "Another choice"]))
        self.assertTrue(any("duplicate" in x for x in row["warnings"]))

    def test_cli_reports_strict_failures_and_refuses_overwrite(self):
        with tempfile.TemporaryDirectory(dir=os.environ.get("STUDY_TEST_TMP")) as folder:
            source, output = Path(folder) / "bank.json", Path(folder) / "report.md"
            source.write_text(json.dumps(bank([[variant("alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu", ["alpha beta gamma delta", "epsilon zeta eta theta", "iota kappa lambda mu"])]])), encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT), "--bank", str(source), "--output", str(output), "--strict"], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1, result.stderr)
            before = output.read_bytes()
            self.assertIn(b"Editorial warnings only", before)
            result = subprocess.run([sys.executable, str(SCRIPT), "--bank", str(source), "--output", str(output)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(output.read_bytes(), before)

    def test_empty_or_unstructured_banks_are_rejected(self):
        for bad in ({}, {"questions": []}, bank([[]]), bank([[{"correct": "yes", "distractors": ["no"]}]])):
            with self.assertRaises((ValueError, KeyError, TypeError)):
                api["audit"](bad)
