# First-run commands for agents

Use these tested blocks instead of inventing a setup script. Run only the block needed for the learner's route. These commands inspect local files and executables; they cannot prove that a model has read instructions or that a course is factually correct. An ordinary ZIP attachment does not install a skill or force the chat host to open it.

## 1. Find the extracted package

Use the host's archive/file tools to extract the entire attached ZIP into a new private workspace. Keep the archive's folder structure; choose the folder containing `START_WITH_AI.md` and `index.html`, or the installed skill folder containing `SKILL.md`. Do not guess the GitHub folder suffix or assume files in an agent's sandbox are on the learner's computer. Read the package's start instructions and skill; inspect supplied course files before asking for context.

On Windows, with the package folder as the current directory, run this **read-only** check. This needs Windows PowerShell, not Node or Python:

```powershell
$powerShellExecutable = (Get-Process -Id $PID).Path
$setup = if (Test-Path -LiteralPath '.\tools\setup.ps1') {
    (Resolve-Path -LiteralPath '.\tools\setup.ps1').Path
} elseif (Test-Path -LiteralPath '.\scripts\setup.ps1') {
    (Resolve-Path -LiteralPath '.\scripts\setup.ps1').Path
} else {
    throw 'The extracted package is incomplete. Restore the entire ZIP first.'
}
# Study = open an existing course; Build = create a standalone review.
# Preview = serve an existing course; Develop = maintain the full repository.
$report = & $powerShellExecutable -NoProfile -File $setup -Task Build -Json |
    ConvertFrom-Json
$report | ConvertTo-Json -Depth 6
```

Select `Study` for a learner opening the full app or an already generated review. Source intake and returning course JSON need no runtime: do that work immediately even if a standalone Build check reports missing Python. Use `Build` only when a standalone review is needed. `Preview` reuses Node **or** Python. `Develop` requires both and the complete repository.

The report identifies the package, checks required scripts/instructions/templates, reports missing files separately from missing runtimes, lists instruction paths in order, and supplies verified `commands` as executable/argument arrays. It refuses to treat an unfinished skill template as a runnable course. Restore missing files before installing anything. Exit 0 means ready, 2 means incomplete/unsupported/missing tools, and 1 means an installation error.

## 2. Handle a missing runtime

Use the existing host runtime first. Pass its actual absolute executable path; never put credentials in these arguments:

```powershell
$report = & $powerShellExecutable -NoProfile -File $setup -Task Build `
    -PythonPath $pythonExecutable -Json | ConvertFrom-Json
$report | ConvertTo-Json -Depth 6
```

`$pythonExecutable` is the path the host actually provides. Do not fabricate one or use a Store alias as an interpreter. If no required runtime exists, preview the installation plan:

```powershell
& $powerShellExecutable -NoProfile -File $setup -Task Build -Install -WhatIf -Json
```

With authorization for that local installation, run the bundled installer and require a successful **post-install version check**:

```powershell
$report = & $powerShellExecutable -NoProfile -File $setup -Task Build -Install -Json |
    ConvertFrom-Json
if (-not $report.ready) {
    $report | ConvertTo-Json -Depth 6
    throw 'Setup is not ready. Follow the reported error before building.'
}
```

The helper uses exact WinGet packages and user scope, does not upgrade compatible runtimes, and does not auto-accept agreements or change execution policy. Installer output is retained in `installLog` while JSON remains machine-readable. No WinGet, a denied installation, or an installer that returns success without a usable executable produces a failure, not a ready claim. If blocked, give the exact user action and continue source review/JSON authoring where possible. Do not install npm/pip packages, SQL, Docker or a framework for this app.

## 3. Use the verified builder

After intake, source verification and authoring, place `bank.json`, `review-context.json` and `REVIEW_PLAN.md` in a **learner workspace outside the installed skill**. Set `$learnerWorkspace` to that actual folder, `$outputFolder` to a new sibling folder, and `$pythonExecutable` to the host's real interpreter path (or omit `-PythonPath` if ordinary discovery suffices). These are input paths, not instructions to invent a runtime.

This bundled wrapper checks setup afresh on every invocation. It does not need `$report` from an earlier tool call, install software, or overwrite an existing output:

```powershell
$buildScript = if (Test-Path -LiteralPath '.\tools\build_review.ps1') {
    (Resolve-Path -LiteralPath '.\tools\build_review.ps1').Path
} elseif (Test-Path -LiteralPath '.\scripts\build_review.ps1') {
    (Resolve-Path -LiteralPath '.\scripts\build_review.ps1').Path
} else { throw 'Restore the complete package before building.' }
& (Get-Process -Id $PID).Path -NoProfile -File $buildScript `
    -PythonPath $pythonExecutable `
    -Bank (Join-Path $learnerWorkspace 'bank.json') `
    -Context (Join-Path $learnerWorkspace 'review-context.json') `
    -Plan (Join-Path $learnerWorkspace 'REVIEW_PLAN.md') `
    -Output $outputFolder
if ($LASTEXITCODE -ne 0) { throw 'The review was not built. Read the setup/builder error.' }
```

Never concatenate these paths into `Invoke-Expression` or another shell command. The authored bank and context remain data. Review the emitted item-design report and complete the question audit from actual checks. If an agent's tool calls use fresh shells, pass the real input paths each time or execute the relevant blocks in one script; do not assume prior shell variables survived. The standalone helper and wrapper are the reusable implementation.

## 4. Check and open the delivered review

The generated folder includes its own setup helper and both optional preview servers. On Windows, check it even when the learner has no runtimes:

```powershell
& (Get-Process -Id $PID).Path -NoProfile -File (Join-Path $outputFolder 'tools\setup.ps1') `
    -Root $outputFolder -Task Study -Json
```

The Study route should pass with no Node/Python. Open that folder's `index.html` or `Start SoS.cmd`. If an optional server is wanted, run a Preview check in the delivered folder, then execute its verified command:

```powershell
$preview = & (Get-Process -Id $PID).Path -NoProfile -File '.\tools\setup.ps1' `
    -Task Preview -Json | ConvertFrom-Json
if (-not $preview.ready) { throw 'Resolve the Preview check first.' }
$command = @($preview.commands | Where-Object id -eq 'preview')[0]
$previewArgs = @($command.arguments)
& $command.executable @previewArgs
```

The server runs in the foreground until Ctrl+C. Give humans the actual folder and printed localhost address. A cloud sandbox URL is not a locally hosted study session on their computer. Deliver the complete review folder to them and give the command for their own device. Verify saved-session recovery when browser tools are available; otherwise disclose that limit. At a learner handoff, ask the next essential question or give one exact action.

## macOS/Linux or a host without PowerShell

Do not install PowerShell to use this project. For browser-only study, open the complete app's `index.html`. For standalone generation or optional preview, use the available shell's built-in discovery and the supplied scripts:

```sh
command -v python3
python3 --version
command -v node
node --version
```

Only check the runtime needed for the route. Python 3.10+ builds reviews; Node 20+ or Python 3.10+ previews them. Follow the exact builder arguments above with the verified interpreter and real paths. Use the platform's official installer if a required runtime is absent and installation is authorized; the Windows helper is not a cross-platform installer. The automated missing-tool/installer harness exercises Windows; do not claim a clean macOS/Linux OS installation was tested.
