"""Behavioral checks for the portable builder and distributable archives."""
import copy
import importlib.util
import json
import os
import re
import shutil
import subprocess
import tempfile
import unittest
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "exam-review-designer"
DIST = ROOT / "dist"
spec = importlib.util.spec_from_file_location("create_review", SKILL / "scripts" / "create_review.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class SkillPackageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="study-scaffold-test-", dir=os.environ.get("STUDY_TEST_TMP"))
        self.folder = Path(self.temp.name)
        self.bank = json.loads((SKILL / "assets" / "example-bank.json").read_text(encoding="utf-8"))
        self.context = {
            "course": {"title": "Arithmetic demonstration", "scope": ["Percent of a quantity"]},
            "alignmentStatus": "general-provisional",
            "assumptions": ["Demonstration; not course-specific"]
        }
        self.bank_path = self.folder / "bank.json"
        self.context_path = self.folder / "context.json"
        self.plan_path = self.folder / "plan.md"
        self.bank_path.write_text(json.dumps(self.bank), encoding="utf-8")
        self.context_path.write_text(json.dumps(self.context), encoding="utf-8")
        self.plan_path.write_text("# Demonstration plan\n\nAttempt, inspect feedback, then return to a variation later.\n", encoding="utf-8")

    def tearDown(self):
        self.temp.cleanup()

    def test_creates_runnable_bank_with_provenance_and_companion_files(self):
        output = builder.create_review(self.bank_path, self.context_path, self.plan_path, self.folder / "review")
        self.assertTrue((output / "index.html").is_file())
        report = (output / "ITEM_DESIGN_REPORT.md").read_text(encoding="utf-8")
        self.assertIn("Editorial warnings only", report)
        self.assertIn(self.bank["questions"][0]["id"], report)
        self.assertRegex((output / "index.html").read_text(encoding="utf-8"), r'src="banks/course\.js(?:\?[^\"]*)?"')
        self.assertNotIn("banks/tax.js", (output / "index.html").read_text(encoding="utf-8"))
        # A copied template must include every local runtime asset referenced by its shell.
        for resource in re.findall(r'(?:src|href)="([^"]+)"', (output / "index.html").read_text(encoding="utf-8")):
            if not resource.startswith(("#", "http:", "https:")):
                self.assertTrue((output / resource.split('?', 1)[0]).is_file(), f"Missing runtime asset: {resource}")
        for name in ("AGENTS.md", "QUESTION_AUDIT.md", "SOURCES.md", "REVIEW_PLAN.md", "bank.json", "review-context.json", "LICENSE", "tools/serve.py"):
            self.assertTrue((output / name).is_file(), name)
        self.assertEqual((output / "AGENTS.md").read_bytes(), (SKILL / "assets" / "review-agent-guide.md").read_bytes())
        self.assertEqual((output / "QUESTION_AUDIT.md").read_bytes(), (SKILL / "assets" / "question-audit-template.md").read_bytes())
        for name in ("AGENTS.md", "README.md"):
            for link in re.findall(r"\]\(([^)]+)\)", (output / name).read_text(encoding="utf-8")):
                if "://" not in link and not link.startswith("#"):
                    self.assertTrue((output / link.split("#")[0]).exists(), f"Broken generated route in {name}: {link}")
        node = os.environ.get("STUDY_NODE") or shutil.which("node")
        if not node:
            self.skipTest("Generated files checked; set STUDY_NODE to execute the generated bank through the engine.")
        js = """const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const E=require(process.argv[1]);const ctx=vm.createContext({});vm.runInContext(fs.readFileSync(process.argv[2],'utf8'),ctx);
const bank=E.validateBank(ctx.STUDY_BANK);assert.equal(bank.questions.length,1);
const seen=new Set();for(let i=0;i<200;i++){const raw=E.materialize(bank.questions[0]);seen.add(raw.prompt);assert.match(raw.concept,/Authored arithmetic demonstration/);assert.equal(raw.options.filter(x=>x.correct).length,1);}
assert.equal(seen.size,2);"""
        subprocess.run([node, "-e", js, str(output / "core.js"), str(output / "banks" / "course.js")], check=True, capture_output=True, text=True)

    def test_existing_output_is_never_overwritten(self):
        output = self.folder / "existing"
        output.mkdir()
        marker = output / "keep.txt"
        marker.write_text("user content", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "already exists"):
            builder.create_review(self.bank_path, self.context_path, self.plan_path, output)
        self.assertEqual(marker.read_text(encoding="utf-8"), "user content")
        self.assertEqual(len(list(output.iterdir())), 1)

    def test_generated_preview_can_move_and_restart_on_the_same_address(self):
        from tools.verify_first_run import preview
        output = builder.create_review(self.bank_path, self.context_path, self.plan_path, self.folder / "review")
        moved = self.folder / "moved review with spaces"
        shutil.move(str(output), moved)
        command = [os.sys.executable, str(moved / "tools" / "serve.py"), "--port"]
        with preview([*command, "0"]) as address:
            with urllib.request.urlopen(address, timeout=5) as response:
                self.assertEqual(response.read(), (moved / "index.html").read_bytes())
            port = address.rsplit(":", 1)[1]
        with preview([*command, port]) as restarted:
            self.assertEqual(restarted, address)
            with urllib.request.urlopen(restarted + "/banks/course.js", timeout=5) as response:
                self.assertEqual(response.read(), (moved / "banks" / "course.js").read_bytes())

    def test_unknown_sources_objectives_and_duplicate_choices_are_rejected(self):
        for field, value in (("sourceRefs", [{"sourceId": "missing", "locator": "page 1"}]), ("objectiveIds", ["missing"])):
            bank = copy.deepcopy(self.bank)
            bank["questions"][0][field] = value
            with self.assertRaises(ValueError):
                builder.validate_bank(bank)
        bank = copy.deepcopy(self.bank)
        bank["questions"][0]["variants"][0]["distractors"][0] = " 10 "
        with self.assertRaisesRegex(ValueError, "duplicate"):
            builder.validate_bank(bank)

    def test_unsupported_formats_and_unresolved_context_do_not_create_outputs(self):
        bank = copy.deepcopy(self.bank)
        bank["questions"][0]["format"] = "essay"
        with self.assertRaisesRegex(ValueError, "mcq"):
            builder.validate_bank(bank)
        self.context["alignmentStatus"] = "pending-source-review"
        self.context_path.write_text(json.dumps(self.context), encoding="utf-8")
        output = self.folder / "not-created"
        with self.assertRaises(ValueError):
            builder.create_review(self.bank_path, self.context_path, self.plan_path, output)
        self.assertFalse(output.exists())

    def test_template_and_research_snapshots_match_canonical_sources(self):
        self.assertEqual((SKILL / "references" / "research-methodology.md").read_bytes(), (ROOT / "RESEARCH.md").read_bytes())
        self.assertEqual((SKILL / "references" / "source-quality.md").read_bytes(), (ROOT / "SOURCE_GUIDE.md").read_bytes())
        self.assertEqual((SKILL / "references" / "setup.md").read_bytes(), (ROOT / "SETUP.md").read_bytes())
        for name in ("setup.ps1", "serve.py"):
            self.assertEqual((SKILL / "scripts" / name).read_bytes(), (ROOT / "tools" / name).read_bytes())
        for name in builder.TEMPLATE_FILES:
            expected = (ROOT / name).read_bytes()
            if name == "index.html":
                expected = expected.replace(b"banks/tax.js", b"banks/course.js")
                expected = re.sub(rb'\s*<script defer src="banks/example\.js(?:\?[^\"]*)?"></script>', b'', expected)
            self.assertEqual((SKILL / "assets" / "study-app" / name).read_bytes(), expected, name)

    def test_skill_zip_is_self_contained_with_one_top_level_folder(self):
        with zipfile.ZipFile(DIST / "exam-review-designer.zip") as archive:
            names = archive.namelist()
            self.assertEqual({Path(n).parts[0] for n in names}, {"exam-review-designer"})
            for name in ("SKILL.md", "LICENSE", "scripts/create_review.py", "scripts/serve.py", "assets/review-readme.md", "assets/review-agent-guide.md", "assets/question-audit-template.md", "assets/study-app/index.html", "assets/study-app/core.js", "references/research-methodology.md", "references/source-quality.md", "references/intake.md"):
                self.assertIn("exam-review-designer/" + name, names)
            for name in names:
                self.assertNotIn("..", Path(name).parts)
                self.assertNotIn(".git", Path(name).parts)
            archive.extractall(self.folder / "unpacked")
        script = self.folder / "unpacked" / "exam-review-designer" / "scripts" / "create_review.py"
        subprocess.run([os.sys.executable, str(script), "--bank", str(self.bank_path), "--context", str(self.context_path), "--plan", str(self.plan_path), "--output", str(self.folder / "from-zip")], check=True, capture_output=True, text=True)
        self.assertTrue((self.folder / "from-zip" / "banks" / "course.js").is_file())
        self.assertTrue((self.folder / "from-zip" / "AGENTS.md").is_file())

    def test_local_skill_references_resolve(self):
        for doc in [SKILL / "SKILL.md", *(SKILL / "references").glob("*.md")]:
            for link in re.findall(r"\]\(([^)]+)\)", doc.read_text(encoding="utf-8")):
                if "://" not in link and not link.startswith("#"):
                    self.assertTrue((doc.parent / link.split("#")[0]).exists(), f"Broken reference in {doc.name}: {link}")

    def test_skill_metadata_fits_the_documented_cross_host_description_limit(self):
        # Claude documents a 200-character description limit; retain portable
        # discovery metadata even though other hosts permit longer descriptions.
        frontmatter = (SKILL / "SKILL.md").read_text(encoding="utf-8").split("---", 2)[1]
        fields = dict(line.split(":", 1) for line in frontmatter.splitlines() if ":" in line)
        self.assertEqual(fields["name"].strip(), SKILL.name)
        self.assertGreater(len(fields["description"].strip()), 0)
        self.assertLessEqual(len(fields["description"].strip()), 200)

    def test_repository_agent_routes_resolve(self):
        for doc in ROOT.glob("*.md"):
            for link in re.findall(r"\]\(([^)]+)\)", doc.read_text(encoding="utf-8")):
                if "://" not in link and not link.startswith("#"):
                    self.assertTrue((doc.parent / link.split("#")[0]).exists(), f"Broken agent route in {doc.name}: {link}")

    def test_app_zip_contains_methodology_and_no_learning_data_or_nested_archives(self):
        with zipfile.ZipFile(DIST / "study-scaffold.zip") as archive:
            names = archive.namelist()
            for name in ("index.html", "FEATURES.md", "START_WITH_AI.md", "AGENTS.md", "AGENT_GUIDE.md", "SOURCE_GUIDE.md", "RESEARCH.md", "INSTALL.md", "skills/exam-review-designer/SKILL.md", "skills/exam-review-designer/agents/openai.yaml", "skills/exam-review-designer/LICENSE"):
                self.assertIn("study-scaffold/" + name, names)
            self.assertFalse(any(n.endswith(".zip") or "/.git/" in n or "/__pycache__/" in n for n in names))
            self.assertFalse(any("/downloads/" in n or "/dist/" in n for n in names))
            self.assertFalse(any(Path(n).name.startswith(("study-progress-", "study-stored-")) for n in names))
            # The null-valued authoring template is expected, but no learner's context is packaged.
            context_files = [n for n in names if Path(n).name == "review-context.json"]
            self.assertEqual(context_files, ["study-scaffold/skills/exam-review-designer/assets/review-context.json"])


if __name__ == "__main__":
    unittest.main()
