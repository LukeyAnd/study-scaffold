"""Public QA packaging must fail closed, even without Git metadata."""
import json
import os
from pathlib import Path
import runpy
import tempfile
import uuid
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
API = runpy.run_path(str(ROOT / "tools/package_release.py"))


class PackagePrivacyTests(unittest.TestCase):
    def test_extracted_source_manifest_excludes_unlisted_private_files(self):
        with tempfile.TemporaryDirectory(dir=os.environ.get("STUDY_TEST_TMP")) as folder:
            target = Path(folder)
            with zipfile.ZipFile(ROOT / "dist/study-scaffold.zip") as archive:
                archive.extractall(target)
            project = target / "study-scaffold"
            # Include ordinary permitted extensions, nested hidden paths, and a
            # fake .git: membership, not Git availability, governs packaging.
            sentinel = uuid.uuid4().hex.encode()
            private = ("banks/course.js", "docs/guides/my-course-notes.md", "tests/.local-credentials.json", "skills/exam-review-designer/assets/sos-progress-backup.json", ".github/.private/token.json")
            for name in private:
                path = project / name;path.parent.mkdir(parents=True, exist_ok=True);path.write_bytes(sentinel)
            for git_present in (False, True):
                if git_present:
                    (project / ".git").mkdir()
                api = runpy.run_path(str(project / "tools/package_release.py"));output = target / f"qa-{git_present}";api["build"](output)
                for zipname in ("study-scaffold.zip", "exam-review-designer.zip"):
                    with zipfile.ZipFile(output / zipname) as archive:
                        self.assertFalse(any(sentinel in archive.read(name) for name in archive.namelist()))

    def test_manifest_rejects_unsafe_duplicate_hidden_missing_and_linked_entries(self):
        # Use an isolated miniature source tree and the real manifest reader.
        with tempfile.TemporaryDirectory(dir=os.environ.get("STUDY_TEST_TMP")) as folder:
            root = Path(folder);(root / "tools").mkdir()
            function = API["public_files"];scope = function.__globals__;previous = scope["ROOT"]
            try:
                scope["ROOT"] = root
                for name in API["TOP_FILES"]:
                    (root / name).write_text("public", encoding="utf-8")
                required = [*API["TOP_FILES"], "tools/public-files.json"]
                manifest = root / "tools/public-files.json"
                for extra in ("../outside.md", "C:/private.md", "a\\b.md", ".github/.private.md", "missing.md", "README.md", "readme.MD"):
                    manifest.write_text(json.dumps(required + [extra]), encoding="utf-8")
                    with self.assertRaises(ValueError, msg=extra):
                        function()
                manifest.write_text(json.dumps(required), encoding="utf-8");self.assertEqual(len(function()), len(required))
                linked = root / "linked.md"
                try:
                    linked.symlink_to(root / "README.md")
                except OSError:
                    return  # Windows may withhold symlink privileges.
                manifest.write_text(json.dumps(required + ["linked.md"]), encoding="utf-8")
                with self.assertRaises(ValueError):
                    function()
            finally:
                scope["ROOT"] = previous
