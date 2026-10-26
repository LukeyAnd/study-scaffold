<# Read-only by default. Install only missing tools for the selected task. #>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [ValidateSet('Study', 'Preview', 'Build', 'Develop')][string]$Task = 'Study',
    [string]$NodePath = $env:STUDY_NODE,
    [string]$PythonPath = $env:STUDY_PYTHON,
    [string]$Root,
    [switch]$PathOnly,
    [switch]$Install,
    [switch]$Json
)

function Get-VersionNumber([string]$Name, [string]$Output) {
    $pattern = if ($Name -eq 'Node') { '^v?(\d+\.\d+\.\d+)' } else { '^Python\s+(\d+\.\d+\.\d+)' }
    if ($Output.Trim() -match $pattern) { return [version]$Matches[1] }
    return $null
}

function Get-Tool([string]$Name, [string]$ExplicitPath, [bool]$OnlyPath) {
    $minimum = if ($Name -eq 'Node') { [version]'20.0.0' } else { [version]'3.10.0' }
    $candidates = @()
    if ($ExplicitPath) { $candidates += $ExplicitPath }
    else {
        $names = if ($Name -eq 'Node') { @('node') } else { @('python', 'python3') }
        foreach ($command in $names) {
            $found = Get-Command $command -CommandType Application -ErrorAction SilentlyContinue
            if ($found) { $candidates += @($found | ForEach-Object { $_.Source }) }
        }
        if (-not $OnlyPath) {
            if ($Name -eq 'Node') {
                foreach ($base in @($env:ProgramFiles, $env:LOCALAPPDATA)) {
                    if ($base) { $candidates += (Join-Path $base 'nodejs\node.exe') }
                }
                if ($env:LOCALAPPDATA) { $candidates += (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\node.exe') }
            } else {
                foreach ($registry in @('HKCU:\Software\Python\PythonCore', 'HKLM:\Software\Python\PythonCore', 'HKLM:\Software\WOW6432Node\Python\PythonCore')) {
                    if (-not (Test-Path -LiteralPath $registry)) { continue }
                    foreach ($entry in Get-ChildItem -LiteralPath $registry -ErrorAction SilentlyContinue) {
                        $installKey = Get-Item -LiteralPath ($entry.PSPath + '\InstallPath') -ErrorAction SilentlyContinue
                        if ($installKey) {
                            $exe = $installKey.GetValue('ExecutablePath')
                            if ($exe) { $candidates += $exe }
                            $folder = $installKey.GetValue('')
                            if ($folder) { $candidates += (Join-Path $folder 'python.exe') }
                        }
                    }
                }
            }
        }
    }
    $reason = 'No compatible executable found.'
    foreach ($candidate in @($candidates | Select-Object -Unique)) {
        # Do not invoke Store/install-manager aliases during a read-only check.
        if ($Name -eq 'Python' -and $candidate -match '\\Microsoft\\WindowsApps\\') {
            $reason = 'WindowsApps alias found; pass a real interpreter path or inspect installed runtimes with your Python manager.'
            continue
        }
        if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) { continue }
        $process = $null
        try {
            $start = New-Object System.Diagnostics.ProcessStartInfo
            $start.FileName = $candidate
            $start.Arguments = '--version'
            $start.UseShellExecute = $false
            $start.CreateNoWindow = $true
            $start.RedirectStandardOutput = $true
            $start.RedirectStandardError = $true
            $process = New-Object System.Diagnostics.Process
            $process.StartInfo = $start
            if (-not $process.Start()) { continue }
            if (-not $process.WaitForExit(5000)) { $process.Kill(); $reason = 'Version check timed out.'; continue }
            $output = ($process.StandardOutput.ReadToEnd() + $process.StandardError.ReadToEnd()).Trim()
            $version = Get-VersionNumber $Name $output
            if ($process.ExitCode -eq 0 -and $null -ne $version -and $version -ge $minimum) {
                return [pscustomobject]@{ name=$Name; available=$true; version=$version.ToString(); minimum=$minimum.ToString(); path=$candidate; reason='Compatible executable verified.'; explicitPath=[bool]$ExplicitPath }
            }
            $reason = 'Executable did not report a compatible ' + $Name + ' version.'
        } catch { $reason = 'Executable could not be checked.' }
        finally { if ($null -ne $process) { $process.Dispose() } }
    }
    return [pscustomobject]@{ name=$Name; available=$false; version=$null; minimum=$minimum.ToString(); path=$null; reason=$reason; explicitPath=[bool]$ExplicitPath }
}

function Get-SetupPlan([string]$ForTask, $Node, $Python) {
    $missing = @()
    switch ($ForTask) {
        'Build' { if (-not $Python.available) { $missing += 'Python' } }
        'Develop' {
            if (-not $Node.available) { $missing += 'Node' }
            if (-not $Python.available) { $missing += 'Python' }
        }
        'Preview' { if (-not $Node.available -and -not $Python.available) { $missing += 'Node' } }
    }
    return @($missing)
}

function Get-PackageCheck([string]$Folder, [string]$ForTask) {
    $folderPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Folder)
    $appFiles = @('index.html','app.js','core.js','storage.js','courses.js','prompts.js','clarity.js','clarity-ui.js','help.js','styles.css','favicon.svg','Start SoS.cmd')
    $skillFiles = @('SKILL.md','LICENSE','agents/openai.yaml','scripts/create_review.py','scripts/build_review.ps1','scripts/audit_questions.py','scripts/setup.ps1','scripts/serve.py','scripts/serve.cjs','references/intake.md','references/authoring.md','references/source-quality.md','references/research-methodology.md','references/QUESTION_DESIGN.md','references/setup.md','references/first-run-commands.md','assets/review-context.json','assets/review-plan-template.md','assets/review-agent-guide.md','assets/review-readme.md','assets/question-audit-template.md')
    $kind = 'unknown'; $required = @(); $instructions = @(); $appRoot = $folderPath; $skillRoot = $null
    if ((Test-Path -LiteralPath (Join-Path $folderPath 'skills/exam-review-designer')) -or (Test-Path -LiteralPath (Join-Path $folderPath 'tools/public-files.json'))) {
        $kind = 'repository'; $skillRoot = Join-Path $folderPath 'skills/exam-review-designer'
        $required = @($appFiles) + @('README.md','START_HERE.md','START_WITH_AI.md','AGENTS.md','AGENT_GUIDE.md','docs/guides/SETUP.md','docs/guides/first-run-commands.md','tools/setup.ps1','tools/build_review.ps1','tools/serve.py','tools/serve.cjs','banks/tax.js','banks/example.js') + @($skillFiles | ForEach-Object { 'skills/exam-review-designer/' + $_ }) + @($appFiles | ForEach-Object { 'skills/exam-review-designer/assets/study-app/' + $_ })
        $instructions = @('START_WITH_AI.md','skills/exam-review-designer/SKILL.md','docs/guides/first-run-commands.md')
        if ($ForTask -eq 'Develop') { $required += @('tools/package_release.py','tools/public-files.json','tests/engine.test.cjs','tests/setup_test.py') }
    } elseif ((Test-Path -LiteralPath (Join-Path $folderPath 'SKILL.md')) -or (Test-Path -LiteralPath (Join-Path $folderPath 'assets/study-app'))) {
        $kind = 'skill'; $skillRoot = $folderPath; $appRoot = Join-Path $folderPath 'assets/study-app'
        $required = @($skillFiles) + @($appFiles | ForEach-Object { 'assets/study-app/' + $_ })
        $instructions = @('SKILL.md','references/first-run-commands.md')
    } elseif (Test-Path -LiteralPath (Join-Path $folderPath 'bank.json')) {
        $kind = 'review'; $required = @($appFiles) + @('README.md','AGENTS.md','bank.json','banks/course.js','review-context.json','REVIEW_PLAN.md','SOURCES.md','QUESTION_AUDIT.md','ITEM_DESIGN_REPORT.md','tools/setup.ps1','tools/serve.py','tools/serve.cjs')
        $instructions = @('README.md','AGENTS.md','review-context.json')
    } else { $required = @('A complete extracted SoS repository, skill folder, or generated review') }
    $missingFiles = @($required | Where-Object { -not (Test-Path -LiteralPath (Join-Path $folderPath $_) -PathType Leaf) })
    $routeError = $null
    if ($kind -eq 'unknown') { $routeError = 'Extract the entire ZIP and select its repository/skill/review folder with -Root.' }
    elseif ($kind -eq 'skill' -and $ForTask -in @('Study','Preview')) { $routeError = 'This is a builder template, not a course review. Start intake with SKILL.md, then use Build to create a review or import course JSON into the app.' }
    elseif ($kind -ne 'repository' -and $ForTask -eq 'Develop') { $routeError = 'Full framework tests need the repository ZIP. Use Build or Preview for this package.' }
    elseif ($kind -eq 'review' -and $ForTask -eq 'Build') { $routeError = 'This is an already built review. Use Study/Preview, or the original skill to build a new sibling output.' }
    return [pscustomobject]@{kind=$kind;root=$folderPath;appRoot=$appRoot;skillRoot=$skillRoot;checkedFiles=$required.Count;missingFiles=@($missingFiles);instructions=@($instructions | ForEach-Object { Join-Path $folderPath $_ });error=$routeError;ready=($missingFiles.Count -eq 0 -and -not $routeError)}
}

function Get-Commands($Package, [string]$ForTask, $Node, $Python) {
    # Only fixed project scripts become executable commands; course content never does.
    $commands = @()
    if (-not $Package.ready) { return $commands }
    if ($ForTask -eq 'Study') { $commands += [pscustomobject]@{id='open-app';executable=(Join-Path $env:WINDIR 'explorer.exe');arguments=@((Join-Path $Package.appRoot 'index.html'));workingDirectory=$Package.root} }
    if ($ForTask -eq 'Build' -and $Python.available) { $commands += [pscustomobject]@{id='builder';executable=$Python.path;arguments=@((Join-Path $Package.skillRoot 'scripts/create_review.py'));workingDirectory=$Package.root} }
    if ($ForTask -eq 'Preview') {
        $prefix = if ($Package.kind -eq 'skill') { 'scripts' } else { 'tools' }
        if ($Node.available) { $commands += [pscustomobject]@{id='preview';executable=$Node.path;arguments=@((Join-Path $Package.root ($prefix + '/serve.cjs')),'--root',$Package.appRoot,'--port','4173');workingDirectory=$Package.root} }
        elseif ($Python.available) { $commands += [pscustomobject]@{id='preview';executable=$Python.path;arguments=@((Join-Path $Package.root ($prefix + '/serve.py')),'--root',$Package.appRoot,'--port','4173');workingDirectory=$Package.root} }
    }
    if ($ForTask -eq 'Develop' -and $Node.available -and $Python.available) {
        $commands += [pscustomobject]@{id='package';executable=$Python.path;arguments=@((Join-Path $Package.root 'tools/package_release.py'));workingDirectory=$Package.root}
        $commands += [pscustomobject]@{id='node-tests';executable=$Node.path;arguments=@('--test') + @(Get-ChildItem -LiteralPath (Join-Path $Package.root 'tests') -Filter '*.test.cjs' | ForEach-Object { $_.FullName });workingDirectory=$Package.root}
        $commands += [pscustomobject]@{id='python-tests';executable=$Python.path;arguments=@('-m','unittest','discover','-s','tests','-p','*test.py');workingDirectory=$Package.root}
    }
    return $commands
}

# Dot-sourcing exposes only the pure/checking helpers for tests; it does no setup.
if ($MyInvocation.InvocationName -eq '.') { return }

if (-not $Root) { $Root = Split-Path -Parent $PSScriptRoot }
$packageCheck = Get-PackageCheck $Root $Task

$node = [pscustomobject]@{name='Node';available=$false;reason='Not required for this task.';explicitPath=$false}
$python = [pscustomobject]@{name='Python';available=$false;reason='Not required for this task.';explicitPath=$false}
if ($Task -ne 'Study') {
    if ($Task -ne 'Build') { $node = Get-Tool 'Node' $NodePath ([bool]$PathOnly) }
    $python = Get-Tool 'Python' $PythonPath ([bool]$PathOnly)
}
$missing = @(Get-SetupPlan $Task $node $python)
$packages = @($missing | ForEach-Object { if ($_ -eq 'Node') { 'OpenJS.NodeJS.LTS' } else { 'Python.Python.3.14' } })
$installError = $null
$installLog = @()
if ($Install -and $packageCheck.ready -and $missing.Count -gt 0 -and -not $WhatIfPreference) {
    if (($missing -contains 'Node' -and $node.explicitPath) -or ($missing -contains 'Python' -and $python.explicitPath)) {
        $installError = 'The supplied executable path is invalid or incompatible. Correct that path before installing another runtime.'
    } else {
        $winget = Get-Command winget -CommandType Application -ErrorAction SilentlyContinue
        if (-not $winget) { $installError = 'WinGet is unavailable. Use the official installer links in docs/guides/SETUP.md (or references/setup.md in the skill); no installation was attempted.' }
        else {
            foreach ($package in $packages) {
                if ($PSCmdlet.ShouldProcess($package, 'Install missing runtime from the WinGet community source for this user')) {
                    $output = & $winget.Source show --exact --id $package --source winget 2>&1
                    $code = $LASTEXITCODE
                    $installLog += [pscustomobject]@{package=$package;action='show';exitCode=$code;output=(($output -join "`n") | Select-Object -First 1)}
                    if (-not $Json) { $output | Out-Host }
                    if ($code -ne 0) { $installError = 'Package lookup failed: ' + $package; break }
                    $installArgs = @('install', '--exact', '--id', $package, '--source', 'winget', '--scope', 'user')
                    if ($package -eq 'OpenJS.NodeJS.LTS') { $installArgs += @('--installer-type', 'zip') }
                    $output = & $winget.Source @installArgs 2>&1
                    $code = $LASTEXITCODE
                    $installLog += [pscustomobject]@{package=$package;action='install';exitCode=$code;output=($output -join "`n")}
                    if (-not $Json) { $output | Out-Host }
                    if ($code -ne 0) { $installError = 'Installation was not completed: ' + $package + '. Do not retry with wider permissions automatically.'; break }
                }
            }
            if (-not $installError) {
                # New per-user executables can be absent from this process's PATH.
                # PathOnly remains strict for isolated first-machine tests.
                if ($Task -ne 'Build') { $node = Get-Tool 'Node' $NodePath ([bool]$PathOnly) }
                $python = Get-Tool 'Python' $PythonPath ([bool]$PathOnly)
                $missing = @(Get-SetupPlan $Task $node $python)
                if ($missing.Count -gt 0) { $installError = 'The installer returned success but a compatible runtime was not verified. Restart the terminal or pass its actual executable path, then rerun this check.' }
            }
        }
    }
}
$next = switch ($Task) {
    'Study' { 'Extract the GitHub source ZIP and open index.html (or Start SoS.cmd on Windows). No runtimes or packages are required.' }
    'Build' { 'Use the verified Python executable with scripts/create_review.py in the skill. No pip or npm packages are required.' }
    'Preview' { 'Use verified Node with tools/serve.cjs or verified Python with tools/serve.py in the app project. Keep the printed localhost address stable.' }
    'Develop' { 'Run Node tests and Python package tests from the repository. No npm install or pip install is required.' }
}
$report = [pscustomobject]@{
    task=$Task; ready=($packageCheck.ready -and $missing.Count -eq 0 -and -not $installError); tools=@($node,$python)
    package=$packageCheck; commands=@(Get-Commands $packageCheck $Task $node $python)
    missing=@($missing); installPackages=@($packages); installRequested=[bool]$Install
    dryRun=[bool]$WhatIfPreference; installError=$installError; next=$next
    installLog=@($installLog)
}
if (-not $report.ready) { $report.commands = @() }
if ($Json) { $report | ConvertTo-Json -Depth 6 }
else {
    Write-Output ('SoS setup: ' + $Task)
    if ($report.ready) { Write-Output 'Ready.' } else { Write-Output ('Missing or incompatible: ' + ($missing -join ', ')) }
    foreach ($tool in $report.tools) { Write-Output ($tool.name + ': ' + $tool.reason); if ($tool.path) { Write-Output ('  ' + $tool.path + ' [' + $tool.version + ']') } }
    if ($installError) { Write-Output $installError }
    if ($packageCheck.error) { Write-Output $packageCheck.error }
    foreach ($file in $packageCheck.missingFiles) { Write-Output ('Missing package file: ' + $file) }
    Write-Output $next
    if (-not $report.ready) { Write-Output 'Read docs/guides/SETUP.md in the repository (or references/setup.md in the skill). Installation is opt-in with -Install; -Install -WhatIf only shows the plan.' }
}
if ($installError) { exit 1 }
if ($report.ready) { exit 0 }
exit 2
