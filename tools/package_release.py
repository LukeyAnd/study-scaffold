#!/usr/bin/env python3
"""Build portable app and skill ZIPs from explicit, public source files.

Run after editing runtime, documentation, setup or distribution sources. Generated skill snapshots are synchronized
from those canonical files. No progress, private intake files, or Git data is included.
"""
import argparse
import hashlib
import json
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "exam-review-designer"
TEMPLATE = ("index.html", "app.js", "core.js", "storage.js", "courses.js", "prompts.js", "clarity.js", "clarity-ui.js", "help.js", "styles.css", "favicon.svg", "Start SoS.cmd")
TOP_FILES = (*TEMPLATE, ".gitignore", ".nojekyll", "package.json", "README.md", "FEATURES.md", "START_HERE.md", "START_WITH_AI.md", "CHANGELOG.md", "AGENTS.md", "AGENT_GUIDE.md", "LICENSE")
EXTENSIONS = {".js", ".cjs", ".css", ".html", ".svg", ".md", ".json", ".py", ".ps1", ".cmd", ".yaml", ".yml"}


def sync_skill():
    target = SKILL / "assets" / "study-app"
    target.mkdir(parents=True, exist_ok=True)
    for name in TEMPLATE:
        data = (ROOT / name).read_bytes()
        if name == "index.html":
            data = data.replace(b"banks/tax.js", b"banks/course.js")
            data = re.sub(rb'\s*<script defer src="banks/example\.js(?:\?[^\"]*)?"></script>', b'', data)
        if not (target / name).exists() or (target / name).read_bytes() != data:
            (target / name).write_bytes(data)
    for source, dest in ((ROOT / "docs" / "methodology" / "RESEARCH.md", SKILL / "references" / "research-methodology.md"), (ROOT / "docs" / "methodology" / "SOURCE_GUIDE.md", SKILL / "references" / "source-quality.md"), (ROOT / "docs" / "guides" / "SETUP.md", SKILL / "references" / "setup.md"), (ROOT / "LICENSE", SKILL / "LICENSE")):
        if not dest.exists() or source.read_bytes() != dest.read_bytes():
            shutil.copyfile(source, dest)
    for name in ("setup.ps1", "serve.py"):
        source, dest = ROOT / "tools" / name, SKILL / "scripts" / name
        if not dest.exists() or source.read_bytes() != dest.read_bytes():
            shutil.copyfile(source, dest)
    shutil.copyfile(ROOT / "docs" / "methodology" / "QUESTION_DESIGN.md", SKILL / "references" / "QUESTION_DESIGN.md")


def eligible(path):
    return path.is_file() and (path.suffix in EXTENSIONS or path.name == "LICENSE") and not any(p in {"__pycache__", "node_modules", ".git"} for p in path.parts)


def archive(path, files, prefix, base):
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as output:
        for file in sorted(set(files)):
            name = prefix + "/" + file.relative_to(base).as_posix()
            entry = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            output.writestr(entry, file.read_bytes())


def build(output):
    project_files = public_files()
    sync_skill()
    output.mkdir(parents=True, exist_ok=True)
    skill_files = [p for p in project_files if p.is_relative_to(SKILL)]
    archive(output / "exam-review-designer.zip", skill_files, "exam-review-designer", SKILL)
    archive(output / "study-scaffold.zip", project_files, "study-scaffold", ROOT)
    hashes = []
    for name in ("exam-review-designer.zip", "study-scaffold.zip"):
        path = output / name
        hashes.append(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {name}")
        print(f"{name}: {path.stat().st_size:,} bytes")
    (output / "SHA256SUMS.txt").write_text("\n".join(hashes) + "\n", encoding="utf-8")


def public_files():
    """Explicit allowlist also works in an extracted source ZIP without Git."""
    names = json.loads((ROOT / "tools/public-files.json").read_text(encoding="utf-8"))
    if not isinstance(names, list) or not names:
        raise ValueError("Public-file manifest must be a nonempty list.")
    files, seen = [], set()
    for name in names:
        if not isinstance(name, str) or not name or "\\" in name or name.startswith("/") or ":" in name:
            raise ValueError(f"Unsafe public-file path: {name!r}")
        parts = name.split("/")
        if any(p in {"", ".", ".."} for p in parts) or name.casefold() in seen:
            raise ValueError(f"Duplicate or unsafe public-file path: {name}")
        if any(p.startswith(".") and not (i == 0 and p in {".gitignore", ".nojekyll", ".github"}) for i, p in enumerate(parts)):
            raise ValueError(f"Hidden public-file path: {name}")
        path = ROOT / name
        if any(p.is_symlink() or getattr(p.lstat(), "st_file_attributes", 0) & 0x400 for p in (ROOT.joinpath(*parts[:i+1]) for i in range(len(parts))) if p.exists()) or not path.resolve().is_relative_to(ROOT.resolve()) or not path.is_file():
            raise ValueError(f"Missing, linked, or external public file: {name}")
        if name not in TOP_FILES and not eligible(path):
            raise ValueError(f"Unsupported public file: {name}")
        seen.add(name.casefold());files.append(path)
    required = set(TOP_FILES) | {"tools/public-files.json"}
    if not required.issubset(names):
        raise ValueError("Public-file manifest omits a required app file.")
    return files


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "dist", help="Local, ignored QA artifacts; never publish under the website")
    parser.add_argument("--sync-only", action="store_true", help="Refresh portable skill snapshots without creating archives")
    args = parser.parse_args()
    if args.sync_only:
        public_files()
        sync_skill()
    else:
        build(args.output_dir.resolve())
