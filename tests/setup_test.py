"""Setup selection and real preview behavior; no OS installation is performed."""
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import unittest
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PS = shutil.which('powershell.exe') or shutil.which('pwsh')
NODE = os.environ.get('STUDY_NODE') or shutil.which('node')


@unittest.skipUnless(PS and os.name == 'nt', 'Windows setup helper needs PowerShell on Windows')
class SetupTests(unittest.TestCase):
    def run_check(self, task, *args):
        env = dict(os.environ)
        env['PATH'] = ''
        env.pop('STUDY_NODE', None)
        env.pop('STUDY_PYTHON', None)
        result = subprocess.run([PS, '-NoProfile', '-File', str(ROOT / 'tools' / 'setup.ps1'), '-Task', task, '-PathOnly', '-Json', *args], env=env, capture_output=True, text=True, timeout=25)
        self.assertIn(result.returncode, (0, 2), result.stdout + result.stderr)
        return result.returncode, json.loads(result.stdout)

    def test_study_needs_no_tools_even_when_install_is_requested(self):
        code, report = self.run_check('Study', '-Install')
        self.assertEqual(code, 0)
        self.assertTrue(report['ready'])
        self.assertEqual(report['missing'], [])
        self.assertEqual(report['installPackages'], [])

    def test_missing_build_preview_and_develop_tools_have_targeted_plans(self):
        for task, missing in [('Build', ['Python']), ('Preview', ['Node']), ('Develop', ['Node', 'Python'])]:
            code, report = self.run_check(task)
            self.assertEqual(code, 2)
            self.assertEqual(report['missing'], missing)
            self.assertFalse(report['installRequested'])

    def test_build_and_preview_reuse_python_without_requiring_node(self):
        for task in ['Build', 'Preview']:
            code, report = self.run_check(task, '-PythonPath', sys.executable)
            self.assertEqual(code, 0)
            self.assertEqual(report['missing'], [])
            self.assertEqual(report['tools'][1]['path'], sys.executable)

    @unittest.skipUnless(NODE, 'Set STUDY_NODE to test existing Node reuse')
    def test_development_reuses_verified_executables_with_spaces(self):
        code, report = self.run_check('Develop', '-NodePath', NODE, '-PythonPath', sys.executable)
        self.assertEqual(code, 0)
        self.assertTrue(all(tool['available'] for tool in report['tools']))

    def test_install_dry_run_plans_packages_without_running_an_installer(self):
        code, report = self.run_check('Develop', '-Install', '-WhatIf')
        self.assertEqual(code, 2)
        self.assertTrue(report['dryRun'])
        self.assertEqual(report['installPackages'], ['OpenJS.NodeJS.LTS', 'Python.Python.3.14'])
        self.assertIsNone(report['installError'])


class PreviewTests(unittest.TestCase):
    def run_preview(self, command):
        process = subprocess.Popen(command, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            line = process.stdout.readline().strip()
            match = re.search(r'http://127\.0\.0\.1:\d+', line)
            self.assertIsNotNone(match, line)
            url = match.group()
            with urllib.request.urlopen(url + '/index.html?v=test', timeout=5) as response:
                self.assertIn(b'<!doctype html>', response.read().lower())
            with urllib.request.urlopen(url + '/app.js?v=test', timeout=5) as response:
                self.assertIn('javascript', response.headers['Content-Type'])
            # URL parsers may normalize encoded '..' before the file guard sees it.
            for path, codes in [('/.git/config', (403,)), ('/%2e%2e/private', (403, 404)), ('/missing-file', (404,))]:
                with self.assertRaises(urllib.error.HTTPError) as caught:
                    urllib.request.urlopen(url + path, timeout=5)
                self.assertIn(caught.exception.code, codes)
        finally:
            process.terminate()
            process.communicate(timeout=10)

    def test_python_preview_serves_app_assets_and_rejects_private_paths(self):
        self.run_preview([sys.executable, str(ROOT / 'tools' / 'serve.py'), '--port', '0'])

    @unittest.skipUnless(NODE, 'Set STUDY_NODE to test Node preview')
    def test_node_preview_serves_app_assets_and_rejects_private_paths(self):
        self.run_preview([NODE, str(ROOT / 'tools' / 'serve.cjs'), '--port', '0'])

    def test_busy_python_port_returns_an_actionable_failure(self):
        with socket.socket() as held:
            held.bind(('127.0.0.1', 0))
            held.listen()
            port = held.getsockname()[1]
            result = subprocess.run([sys.executable, str(ROOT / 'tools' / 'serve.py'), '--port', str(port)], capture_output=True, text=True, timeout=10)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('choose --port NUMBER', result.stderr)


if __name__ == '__main__':
    unittest.main()
