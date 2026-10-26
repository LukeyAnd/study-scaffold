"""Setup selection and real preview behavior; no OS installation is performed."""
import json
import os
import re
import shutil
import socket
import subprocess
import tempfile
import sys
import unittest
import urllib.error
import urllib.request
import zipfile
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

    def test_package_check_stops_on_missing_instructions_before_installation(self):
        with tempfile.TemporaryDirectory(dir=os.environ.get('STUDY_TEST_TMP')) as folder:
            with zipfile.ZipFile(ROOT / 'dist/study-scaffold.zip') as archive:
                archive.extractall(folder)
            package = Path(folder) / 'study-scaffold'
            (package / 'skills/exam-review-designer/SKILL.md').unlink()
            code, report = self.run_check('Build', '-Root', str(package), '-Install')
            self.assertEqual(code, 2)
            self.assertIn('skills/exam-review-designer/SKILL.md', report['package']['missingFiles'])
            self.assertEqual(report['commands'], [])
            self.assertEqual(report['installLog'], [])

    def test_verified_command_arrays_execute_builder_and_generated_preview(self):
        with tempfile.TemporaryDirectory(prefix='new learner ', dir=os.environ.get('STUDY_TEST_TMP')) as folder:
            work = Path(folder)
            with zipfile.ZipFile(ROOT / 'dist/study-scaffold.zip') as archive:
                archive.extractall(work)
            package = work / 'study-scaffold'
            inputs = work / 'learner inputs';inputs.mkdir()
            shutil.copyfile(package / 'skills/exam-review-designer/assets/example-bank.json', inputs / 'bank.json')
            (inputs / 'review-context.json').write_text(json.dumps({'course': {'title': 'Fixture', 'scope': ['Percent']}, 'alignmentStatus': 'general-provisional'}), encoding='utf-8')
            (inputs / 'REVIEW_PLAN.md').write_text('# Synthetic software test\n\nAttempt and return later.', encoding='utf-8')
            output = work / 'delivered review'
            # Execute the actual documentation blocks, including PowerShell's
            # array invocation, rather than a separately reconstructed command.
            blocks = re.findall(r'```powershell\n(.*?)```', (ROOT / 'docs/guides/first-run-commands.md').read_text(encoding='utf-8'), re.S)
            driver = work / 'run-book.ps1'
            driver.write_text('param($PackageRoot,$PythonExe,$InputFolder,$OutputFolder)\nSet-Location -LiteralPath $PackageRoot\n' +
                '$null = . {\n' + blocks[0] + '\n}\n$pythonExecutable=$PythonExe\n$null = . {\n' + blocks[1] +
                '\n}\n$learnerWorkspace=$InputFolder\n' + blocks[4] + '\n' + blocks[5], encoding='utf-8')
            env = dict(os.environ);env['PATH']='';env.pop('STUDY_PYTHON',None);env.pop('STUDY_NODE',None)
            result = subprocess.run([PS,'-NoProfile','-File',str(driver),str(package),sys.executable,str(inputs),str(output)], env=env, capture_output=True, text=True, timeout=30)
            self.assertEqual(result.returncode,0,result.stdout+result.stderr)
            self.assertTrue((output / 'banks/course.js').is_file())
            refused=subprocess.run([PS,'-NoProfile','-File',str(package/'tools/build_review.ps1'),'-Bank',str(inputs/'bank.json'),'-Context',str(inputs/'review-context.json'),'-Plan',str(inputs/'REVIEW_PLAN.md'),'-Output',str(work/'must not exist'),'-PythonPath',str(work/'missing-python.exe')],env=env,capture_output=True,text=True)
            self.assertEqual(refused.returncode,2,refused.stdout+refused.stderr)
            self.assertFalse((work/'must not exist').exists())
            self.assertEqual(json.loads(refused.stdout)['commands'],[])
            code, report = self.run_check('Study','-Root',str(output))
            self.assertEqual(code,0);self.assertEqual(report['missing'],[]);self.assertEqual(report['package']['kind'],'review')
            # Resolve -Root relative to PowerShell's location, not the parent
            # process's unchanged .NET working directory.
            relative = work / 'relative.ps1'
            relative.write_text('param($Setup,$Review)\nSet-Location -LiteralPath $Review\n& $Setup -Root . -Task Study -PathOnly -Json\nexit $LASTEXITCODE\n',encoding='utf-8')
            checked=subprocess.run([PS,'-NoProfile','-File',str(relative),str(ROOT/'tools/setup.ps1'),str(output)],capture_output=True,text=True,check=True)
            self.assertEqual(json.loads(checked.stdout)['package']['kind'],'review')
            code, report = self.run_check('Preview','-Root',str(output),'-PythonPath',sys.executable)
            self.assertEqual(code,0)
            command=report['commands'][0]
            from tools.verify_first_run import preview
            with preview([command['executable'],*command['arguments'][:-1],'0']) as url:
                with urllib.request.urlopen(url+'/banks/course.js',timeout=5) as response:
                    self.assertIn(b'STUDY_BANK',response.read())
            if NODE:
                code, report=self.run_check('Preview','-Root',str(output),'-NodePath',NODE,'-PythonPath',str(work/'missing-python.exe'))
                self.assertEqual(code,0);command=report['commands'][0]
                with preview([command['executable'],*command['arguments'][:-1],'0']) as url:
                    with urllib.request.urlopen(url+'/banks/course.js',timeout=5) as response:
                        self.assertIn(b'STUDY_BANK',response.read())
            # An installed skill is a builder template, never a finished course.
            code, report = self.run_check('Preview','-Root',str(package/'skills/exam-review-designer'),'-PythonPath',sys.executable)
            self.assertEqual(code,2);self.assertEqual(report['commands'],[])

    def test_simulated_installer_success_cancellation_lookup_and_false_success(self):
        # Exercise the real -Install branch with an isolated fake WinGet. It
        # logs arguments and changes discovery only; no software is installed.
        with tempfile.TemporaryDirectory(prefix='installer fixture ',dir=os.environ.get('STUDY_TEST_TMP')) as folder:
            work=Path(folder);marker=work/'discovered';log=work/'calls.jsonl'
            installer=work/'installer.py'
            installer.write_text('''import json,sys
from pathlib import Path
marker,log,mode=map(str,sys.argv[1:4]);args=sys.argv[4:]
with Path(log).open('a') as out:out.write(json.dumps(args)+'\\n')
print('Synthetic installer output')
if mode=='lookup-failure' and args[0]=='show':sys.exit(5)
if mode=='cancelled' and args[0]=='install':sys.exit(9)
if mode=='success' and args[0]=='install':Path(marker).touch()
''',encoding='utf-8')
            shim=work/'winget.cmd';driver=work/'driver.ps1'
            driver.write_text('''param($Setup,$RootFolder,$Shim,$Marker,$PythonExe)
$env:PATH=''
Remove-Item Env:STUDY_NODE -ErrorAction SilentlyContinue
Remove-Item Env:STUDY_PYTHON -ErrorAction SilentlyContinue
function Get-Command {
    param($Name,$CommandType,$ErrorAction)
    if($Name -eq 'winget'){return [pscustomobject]@{Source=$Shim}}
    if($Name -in @('python','python3') -and (Test-Path -LiteralPath $Marker)){return [pscustomobject]@{Source=$PythonExe}}
    return $null
}
& $Setup -Root $RootFolder -Task Build -PathOnly -Install -Json
exit $LASTEXITCODE
''',encoding='utf-8')
            for mode, expected in [('success',0),('cancelled',1),('lookup-failure',1),('false-success',1)]:
                marker.unlink(missing_ok=True);log.unlink(missing_ok=True)
                shim.write_text(f'@"{sys.executable}" "{installer}" "{marker}" "{log}" "{mode}" %*\n',encoding='utf-8')
                result=subprocess.run([PS,'-NoProfile','-File',str(driver),str(ROOT/'tools/setup.ps1'),str(ROOT),str(shim),str(marker),sys.executable],capture_output=True,text=True,timeout=30)
                self.assertEqual(result.returncode,expected,result.stdout+result.stderr)
                report=json.loads(result.stdout);self.assertEqual(report['ready'],mode=='success')
                calls=[json.loads(line) for line in log.read_text().splitlines()]
                self.assertEqual(calls[0],['show','--exact','--id','Python.Python.3.14','--source','winget'])
                if mode!='lookup-failure':
                    self.assertEqual(calls[1],['install','--exact','--id','Python.Python.3.14','--source','winget','--scope','user'])
                self.assertEqual(len(report['installLog']),len(calls))
                if mode!='success':self.assertEqual(report['commands'],[])


class PreviewTests(unittest.TestCase):
    def run_preview(self, command, extra_private_paths=()):
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
            for path, codes in [('/.git/config', (403,)), ('/%2e%2e/private', (403, 404)), ('/missing-file', (404,)), *((p, (403,)) for p in extra_private_paths)]:
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

    def check_aliases(self, runtime):
        validation = ROOT / '.validation'
        validation.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(prefix='preview-aliases-', dir=validation) as folder:
            base = Path(folder).resolve()
            self.assertTrue(base.is_relative_to(validation.resolve()))
            app = base / 'app'
            (app / 'tools').mkdir(parents=True)
            (app / '.private').mkdir()
            (base / 'outside').mkdir()
            (app / 'index.html').write_text('<!doctype html><title>Fixture</title>', encoding='utf-8')
            (app / 'app.js').write_text('/* fixture */', encoding='utf-8')
            for target in [app / '.private', base / 'outside']:
                (target / 'data.txt').write_text('Private software fixture', encoding='utf-8')
            aliases = [(app / 'alias-private', app / '.private'), (app / 'alias-outside', base / 'outside')]
            try:
                for alias, target in aliases:
                    if os.name == 'nt' and PS:
                        script = base / 'junction.ps1'
                        script.write_text('param([string]$AliasPath,[string]$TargetPath)\nNew-Item -ItemType Junction -Path $AliasPath -Target $TargetPath -ErrorAction Stop | Out-Null\n', encoding='utf-8')
                        subprocess.run([PS, '-NoProfile', '-File', str(script), '-AliasPath', str(alias), '-TargetPath', str(target)], check=True, capture_output=True, text=True)
                    else:
                        alias.symlink_to(target, target_is_directory=True)
                suffix = 'cjs' if runtime == 'node' else 'py'
                preview = app / 'tools' / f'serve.{suffix}'
                shutil.copyfile(ROOT / 'tools' / preview.name, preview)
                self.run_preview([NODE if runtime == 'node' else sys.executable, str(preview), '--port', '0'], ['/alias-private/data.txt', '/alias-outside/data.txt'])
            finally:
                for alias, _ in aliases:
                    if alias.is_symlink():
                        alias.unlink()
                    elif os.name == 'nt' and alias.exists():
                        os.rmdir(alias)

    def test_python_preview_rejects_directory_aliases_to_private_or_external_files(self):
        self.check_aliases('python')

    @unittest.skipUnless(NODE, 'Set STUDY_NODE to test Node preview')
    def test_node_preview_rejects_directory_aliases_to_private_or_external_files(self):
        self.check_aliases('node')


if __name__ == '__main__':
    unittest.main()
