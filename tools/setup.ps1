<# Read-only by default. Install only missing tools for the selected task. #>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [ValidateSet('Study', 'Preview', 'Build', 'Develop')][string]$Task = 'Study',
    [string]$NodePath = $env:STUDY_NODE,
    [string]$PythonPath = $env:STUDY_PYTHON,
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

# Dot-sourcing exposes only the pure/checking helpers for tests; it does no setup.
if ($MyInvocation.InvocationName -eq '.') { return }

$node = [pscustomobject]@{name='Node';available=$false;reason='Not required for this task.';explicitPath=$false}
$python = [pscustomobject]@{name='Python';available=$false;reason='Not required for this task.';explicitPath=$false}
if ($Task -ne 'Study') {
    if ($Task -ne 'Build') { $node = Get-Tool 'Node' $NodePath ([bool]$PathOnly) }
    $python = Get-Tool 'Python' $PythonPath ([bool]$PathOnly)
}
$missing = @(Get-SetupPlan $Task $node $python)
$packages = @($missing | ForEach-Object { if ($_ -eq 'Node') { 'OpenJS.NodeJS.LTS' } else { 'Python.Python.3.14' } })
$installError = $null
if ($Install -and $missing.Count -gt 0 -and -not $WhatIfPreference) {
    if (($missing -contains 'Node' -and $node.explicitPath) -or ($missing -contains 'Python' -and $python.explicitPath)) {
        $installError = 'The supplied executable path is invalid or incompatible. Correct that path before installing another runtime.'
    } else {
        $winget = Get-Command winget -CommandType Application -ErrorAction SilentlyContinue
        if (-not $winget) { $installError = 'WinGet is unavailable. Use the official installer links in SETUP.md; no installation was attempted.' }
        else {
            foreach ($package in $packages) {
                if ($PSCmdlet.ShouldProcess($package, 'Install missing runtime from the WinGet community source for this user')) {
                    & $winget.Source show --exact --id $package --source winget | Out-Host
                    if ($LASTEXITCODE -ne 0) { $installError = 'Package lookup failed: ' + $package; break }
                    $installArgs = @('install', '--exact', '--id', $package, '--source', 'winget', '--scope', 'user')
                    if ($package -eq 'OpenJS.NodeJS.LTS') { $installArgs += @('--installer-type', 'zip') }
                    & $winget.Source @installArgs | Out-Host
                    if ($LASTEXITCODE -ne 0) { $installError = 'Installation was not completed: ' + $package + '. Do not retry with wider permissions automatically.'; break }
                }
            }
            if (-not $installError) {
                $node = Get-Tool 'Node' $NodePath $false
                $python = Get-Tool 'Python' $PythonPath $false
                $missing = @(Get-SetupPlan $Task $node $python)
            }
        }
    }
}
$next = switch ($Task) {
    'Study' { 'Extract the app ZIP and open index.html (or Start SoS.cmd on Windows). No runtimes or packages are required.' }
    'Build' { 'Use the verified Python executable with scripts/create_review.py in the skill. No pip or npm packages are required.' }
    'Preview' { 'Use verified Node with tools/serve.cjs or verified Python with tools/serve.py in the app project. Keep the printed localhost address stable.' }
    'Develop' { 'Run Node tests and Python package tests from the repository. No npm install or pip install is required.' }
}
$report = [pscustomobject]@{
    task=$Task; ready=($missing.Count -eq 0 -and -not $installError); tools=@($node,$python)
    missing=@($missing); installPackages=@($packages); installRequested=[bool]$Install
    dryRun=[bool]$WhatIfPreference; installError=$installError; next=$next
}
if ($Json) { $report | ConvertTo-Json -Depth 5 }
else {
    Write-Output ('SoS setup: ' + $Task)
    if ($report.ready) { Write-Output 'Ready.' } else { Write-Output ('Missing or incompatible: ' + ($missing -join ', ')) }
    foreach ($tool in $report.tools) { Write-Output ($tool.name + ': ' + $tool.reason); if ($tool.path) { Write-Output ('  ' + $tool.path + ' [' + $tool.version + ']') } }
    if ($installError) { Write-Output $installError }
    Write-Output $next
    if (-not $report.ready) { Write-Output 'Read SETUP.md (or references/setup.md in the skill). Installation is opt-in with -Install; -Install -WhatIf only shows the plan.' }
}
if ($installError) { exit 1 }
if ($report.ready) { exit 0 }
exit 2
