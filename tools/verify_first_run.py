#!/usr/bin/env python3
"""Exercise release ZIPs in isolated folders. Never installs tools or changes profiles."""
import argparse
import json
import os
import queue
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import zipfile
from contextlib import contextmanager
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


@contextmanager
def preview(command):
    # Request logs must not fill an unread pipe and stall the server during QA.
    log = tempfile.TemporaryFile(mode='w+t', encoding='utf-8')
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=log, text=True)
    lines = queue.Queue()
    threading.Thread(target=lambda: lines.put(process.stdout.readline()), daemon=True).start()
    try:
        line = lines.get(timeout=10)
        match = re.search(r'http://127\.0\.0\.1:\d+', line)
        if not match:
            log.seek(0)
            raise RuntimeError('Preview did not start: ' + line + log.read()[-2000:])
        yield match.group()
    finally:
        process.terminate()
        process.communicate(timeout=10)
        log.close()


def extract(archive_path, target):
    with zipfile.ZipFile(archive_path) as archive:
        for name in archive.namelist():
            if not (target / name).resolve().is_relative_to(target.resolve()):
                raise ValueError('Unsafe ZIP entry')
        archive.extractall(target)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--browser', action='store_true', help='Use the host-provided optional Playwright runtime')
    args = parser.parse_args()
    validation = ROOT / '.validation'
    validation.mkdir(exist_ok=True)
    results = {'freshZipExtraction': False, 'standaloneSkillGeneration': False, 'browserChecked': False, 'softwareInstalled': False, 'osInstallerTested': False, 'directFileBrowserTested': False}
    with tempfile.TemporaryDirectory(prefix='first run with spaces ', dir=validation) as folder:
        stage = Path(folder).resolve()
        if not stage.is_relative_to(validation.resolve()):
            raise ValueError('Temporary target is outside the verification workspace')
        extract(ROOT / 'downloads' / 'study-scaffold.zip', stage / 'app')
        extract(ROOT / 'downloads' / 'exam-review-designer.zip', stage / 'skill')
        app = stage / 'app' / 'study-scaffold'
        skill = stage / 'skill' / 'exam-review-designer'
        assert not (app / 'node_modules').exists()
        assert (app / 'START_HERE.md').is_file() and (app / 'Start SoS.cmd').is_file()
        assert (skill / 'scripts' / 'setup.ps1').is_file()
        results['freshZipExtraction'] = True
        context = stage / 'review-context.json'
        context.write_text(json.dumps({'course': {'title': 'First-run demonstration', 'scope': ['Percentage of a quantity']}, 'alignmentStatus': 'general-provisional'}), encoding='utf-8')
        plan = stage / 'plan.md'
        plan.write_text('# Software test only\n\nAttempt, inspect feedback, and return later. This is not a subject-validation claim.\n', encoding='utf-8')
        output = stage / 'generated review with spaces'
        subprocess.run([sys.executable, str(skill / 'scripts' / 'create_review.py'), '--bank', str(skill / 'assets' / 'example-bank.json'), '--context', str(context), '--plan', str(plan), '--output', str(output)], check=True, capture_output=True, text=True)
        assert (output / 'Start SoS.cmd').is_file()
        assert (output / 'QUESTION_AUDIT.md').read_text(encoding='utf-8').startswith('# Question audit')
        results['standaloneSkillGeneration'] = True
        if os.name == 'nt' and shutil.which('powershell.exe'):
            env = dict(os.environ)
            env['PATH'] = ''
            env.pop('STUDY_NODE', None)
            env.pop('STUDY_PYTHON', None)
            check = subprocess.run([shutil.which('powershell.exe'), '-NoProfile', '-File', str(app / 'tools' / 'setup.ps1'), '-Task', 'Study', '-PathOnly', '-Json'], env=env, capture_output=True, text=True, check=True)
            assert json.loads(check.stdout)['ready']
            check = subprocess.run([shutil.which('powershell.exe'), '-NoProfile', '-File', str(skill / 'scripts' / 'setup.ps1'), '-Task', 'Build', '-PathOnly', '-PythonPath', sys.executable, '-Json'], env=env, capture_output=True, text=True, check=True)
            assert json.loads(check.stdout)['ready']
            results['extractedSetupHelpersChecked'] = True
        if args.browser:
            node = os.environ.get('STUDY_NODE') or shutil.which('node')
            if not node:
                raise RuntimeError('Browser QA needs host Node; set STUDY_NODE. The study app does not require it.')
            with preview([sys.executable, str(app / 'tools' / 'serve.py'), '--port', '0']) as app_url, preview([sys.executable, str(skill / 'scripts' / 'serve.py'), '--root', str(output), '--port', '0']) as review_url:
                checked = subprocess.run([node, str(ROOT / 'tools' / 'first_run_browser.cjs'), app_url, review_url, str(skill / 'assets' / 'example-bank.json')], capture_output=True, text=True, timeout=150)
                if checked.returncode:
                    raise RuntimeError('First-run browser check failed:\n' + (checked.stdout + checked.stderr)[-6000:])
                print(checked.stdout.strip())
                results['browserChecked'] = True
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
