#!/usr/bin/env python3
"""Build portable app and skill ZIPs from explicit, public source files.

Run after editing the app or RESEARCH.md. Generated skill snapshots are synchronized
from those canonical files. No progress, private intake files, or Git data is included.
"""
import argparse
import hashlib
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "exam-review-designer"
TEMPLATE = ("index.html", "app.js", "core.js", "styles.css", "favicon.svg")
TOP_FILES = (*TEMPLATE, ".gitignore", ".nojekyll", "package.json", "README.md", "RESEARCH.md", "INSTALL.md", "DESIGN.md", "REVIEW.md", "LICENSE", "midterm_trainer.html")
SOURCE_DIRS = ("banks", "tests", "tools", ".github", "skills", "downloads")
EXTENSIONS = {".js", ".cjs", ".css", ".html", ".svg", ".md", ".json", ".py", ".yaml", ".yml"}


def sync_skill():
    target = SKILL / "assets" / "study-app"
    target.mkdir(parents=True, exist_ok=True)
    for name in TEMPLATE:
        data = (ROOT / name).read_bytes()
        if name == "index.html":
            data = data.replace(b"banks/tax.js", b"banks/course.js")
        if not (target / name).exists() or (target / name).read_bytes() != data:
            (target / name).write_bytes(data)
    for source, dest in ((ROOT / "RESEARCH.md", SKILL / "references" / "research-methodology.md"), (ROOT / "LICENSE", SKILL / "LICENSE")):
        if not dest.exists() or source.read_bytes() != dest.read_bytes():
            shutil.copyfile(source, dest)


def eligible(path):
    return path.is_file() and path.suffix in EXTENSIONS and not any(p in {"__pycache__", "node_modules", ".git"} for p in path.parts)


def archive(path, files, prefix, base):
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as output:
        for file in sorted(set(files)):
            name = prefix + "/" + file.relative_to(base).as_posix()
            entry = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            output.writestr(entry, file.read_bytes())


def build(output):
    sync_skill()
    output.mkdir(parents=True, exist_ok=True)
    skill_files = [p for p in SKILL.rglob("*") if eligible(p) or p == SKILL / "LICENSE"]
    archive(output / "exam-review-designer.zip", skill_files, "exam-review-designer", SKILL)
    project_files = [ROOT / f for f in TOP_FILES]
    for directory in SOURCE_DIRS:
        project_files.extend(p for p in (ROOT / directory).rglob("*") if eligible(p))
    archive(output / "study-scaffold.zip", project_files, "study-scaffold", ROOT)
    hashes = []
    for name in ("exam-review-designer.zip", "study-scaffold.zip"):
        path = output / name
        hashes.append(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {name}")
        print(f"{name}: {path.stat().st_size:,} bytes")
    (output / "SHA256SUMS.txt").write_text("\n".join(hashes) + "\n", encoding="utf-8")
    if output == ROOT / "downloads":
        shutil.copyfile(output / "study-scaffold.zip", ROOT / "study-scaffold.zip")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "downloads")
    build(parser.parse_args().output_dir.resolve())
