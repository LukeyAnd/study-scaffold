<# Check this package and an existing Python, then call the supplied builder. #>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Bank,
    [Parameter(Mandatory=$true)][string]$Context,
    [Parameter(Mandatory=$true)][string]$Plan,
    [Parameter(Mandatory=$true)][string]$Output,
    [string]$PythonPath = $env:STUDY_PYTHON
)
$powerShellExecutable = (Get-Process -Id $PID).Path
$checkArgs = @('-NoProfile','-File',(Join-Path $PSScriptRoot 'setup.ps1'),'-Task','Build','-Json')
if ($PythonPath) { $checkArgs += @('-PythonPath',$PythonPath) }
$checked = & $powerShellExecutable @checkArgs
$code = $LASTEXITCODE
if ($code -ne 0) { $checked | Write-Output; exit $code }
$report = $checked | ConvertFrom-Json
$command = @($report.commands | Where-Object id -eq 'builder')
if (-not $report.ready -or $command.Count -ne 1) { throw 'No verified builder command is available. Run the setup check first.' }
$paths = @($Bank,$Context,$Plan,$Output | ForEach-Object { $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($_) })
$buildArgs = @($command[0].arguments) + @('--bank',$paths[0],'--context',$paths[1],'--plan',$paths[2],'--output',$paths[3])
& $command[0].executable @buildArgs
exit $LASTEXITCODE
