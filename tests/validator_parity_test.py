"""The same JSON cases must be accepted by the browser and portable builder."""
import copy
import json
import os
from pathlib import Path
import runpy
import shutil
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
BUILDER = runpy.run_path(str(ROOT / "skills/exam-review-designer/scripts/create_review.py"))


class ValidatorParityTests(unittest.TestCase):
    def test_shared_unicode_metadata_and_size_cases(self):
        base = json.loads((ROOT / "skills/exam-review-designer/assets/example-bank.json").read_text(encoding="utf-8"))
        cases = [("baseline", base, True)]
        for value, accepted in ((None, False), ("", False), ("\ufeff", False), ("\u001c", True), ("Reviewed", True)):
            item = copy.deepcopy(base);item["reviewStatus"] = value
            cases.append((f"status {value!r}", item, accepted))
        for key, wrong, accepted in (("Answer", "\ufeffanswer\ufeff", False), ("Straße", "STRASSE", True), ("\u001c", "a", True), ("\ufeff", "a", False)):
            item = copy.deepcopy(base);v = item["questions"][0]["variants"][0]
            v["correct"] = key;v["distractors"] = [wrong, "second", "third"]
            cases.append((f"choices {key!r}/{wrong!r}", item, accepted))
        for field in ("topics", "objectives", "sources", "questions"):
            for count in (5000, 5001):
                item = copy.deepcopy(base);row = item[field][0]
                item[field] = [{**row, "id": row["id"] if i == 0 else f"entry-{i}"} for i in range(count)]
                cases.append((f"{field} {count}", item, count == 5000))
        actual = []
        for label, item, expected in cases:
            try:
                BUILDER["validate_bank"](item);accepted = True
            except (ValueError, KeyError, TypeError):
                accepted = False
            self.assertEqual(accepted, expected, label);actual.append(accepted)
        node = os.environ.get("STUDY_NODE") or shutil.which("node")
        if not node:
            self.skipTest("Python cases passed; set STUDY_NODE for cross-language checks")
        script = "const fs=require('node:fs'),C=require('./courses.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(x=>{try{C.validate(x);return true;}catch(e){return false;}})));"
        result = subprocess.run([node, "-e", script], cwd=ROOT, input=json.dumps([item for _, item, _ in cases]), capture_output=True, text=True, check=True)
        self.assertEqual(json.loads(result.stdout), actual)
