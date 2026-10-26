# Setup for learners and agents

Choose the task before installing anything. These are the actual project requirements, not a generic web-development stack.

Run repository commands from the folder containing `index.html`, not from `docs/guides/`. For an installed skill, use the explicitly shown paths relative to that skill's folder instead.

| Task | Required | Not required |
| --- | --- | --- |
| Study, import JSON, generate/copy an AI prompt | A modern browser and the extracted app, or the hosted page | Node.js, Python, npm/pip packages, SQL, API keys |
| Have an AI return a course or additions JSON | The learner's chosen AI environment plus course sources | A local builder or runtime, unless that environment requires one |
| Build a standalone review folder with `create_review.py` | Python 3.10+ standard library | Node.js, pip packages, a database server |
| Optional stable localhost preview | Existing Node.js 20+ **or** Python 3.10+ | Both runtimes, npm install, global web servers |
| Run the full repository tests/rebuild ZIPs | Node.js 20+ compatible runtime and Python 3.10+ | npm/pip dependency installation |

For a new Node installation, choose a supported LTS release from the official site; 20 is the compatibility floor, not the recommended new installation. Use an existing compatible Python rather than replacing a working environment. A PDF/textbook source is attached to the learner's AI, not installed into the app.

## Tested command blocks

[First-run commands](first-run-commands.md) supplies the exact read-only preflight, missing-tool installation, verified builder and delivered-review preview blocks for agents. Reuse them instead of generating a new setup procedure. Windows preflight checks full repository/portable skill/generated review files and returns `package`, `tools`, `missing`, ordered `instructions` paths and executable/argument `commands`. Readiness requires the package and required runtimes; no commands are offered while either is incomplete. The check confirms file presence and executable versions, not model comprehension or source correctness.

For a Windows standalone build, `tools/build_review.ps1` (or `scripts/build_review.ps1` in the skill) checks setup and invokes the existing builder with bank/context/plan/output arguments. It installs nothing and refuses missing requirements. Use the command block linked above; it does not rely on a previous shell’s variables or reconstructed builder code.

## Agent sequence

1. **Identify the requested route.** Infer it from the request; do not make the learner answer a setup questionnaire when their goal is clear. For studying or prompt/import use, open the app and stop dependency work.
2. **Locate usable tools.** Inspect versions and paths. Prefer the agent host's bundled runtimes or existing virtual environment. Pass real executable paths when tools are not on PATH. A Windows Store alias or Python manager is not proof that an interpreter is installed.
3. **Run the matching check.** On Windows, use the PowerShell helper below when local policy permits. On other platforms, inspect `node --version` and/or `python3 --version` only for the chosen route. Resolve a Python manager's installed interpreter rather than assuming its own version is Python's version.
4. **Install only a missing requirement.** Use the user's existing setup authorization. The helper is read-only by default; `-Install` explicitly opts into the named missing runtime(s). Recheck before executing a builder or preview. If policy/permissions block installation, report the actual failure and use the browser/JSON route when it still achieves the goal; do not silently widen permissions or replace shared environments.
5. **Build/open and verify.** For a standalone review, run the skill builder, open its `index.html`, and check the chosen material, answer feedback, source/audit files, and saved-session recovery. Do not install development/test tools into the learner's output folder.
6. **Hand off one clear next action.** Give the actual output path or browser URL, checks performed, and limits. Document any real install/version; do not claim an installer ran just because a runtime was already available.

## Windows check and opt-in installation

The full app/repository has `tools/setup.ps1`; the installed skill has `scripts/setup.ps1`. From the appropriate folder:

```powershell
# Read-only. Choose Study, Build, Preview, or Develop.
powershell -NoProfile -File tools/setup.ps1 -Task Build

# Host-provided executables can be reused without adding them to PATH.
powershell -NoProfile -File tools/setup.ps1 -Task Develop -NodePath "C:\path\node.exe" -PythonPath "C:\path\python.exe" -Json

# Show a plan without invoking an installer.
powershell -NoProfile -File tools/setup.ps1 -Task Build -Install -WhatIf

# Explicitly install only missing requirements for this task, then recheck.
powershell -NoProfile -File tools/setup.ps1 -Task Build -Install
```

`STUDY_NODE` and `STUDY_PYTHON` can supply the same executable paths. Exit codes: **0** ready, **2** missing/incompatible tools, **1** an installation/path error. `-Json` returns one machine-readable report, including `installLog` when installation is requested. `-Root` explicitly selects the extracted repository, portable skill or generated review; its default is the helper’s parent folder. `-PathOnly` restricts discovery to explicit paths and PATH, useful for isolated tests.

A successful installer exit is followed by another real version check; failure to discover a compatible executable remains a failure and tells the learner to restart their terminal or provide its actual path. The installer uses exact WinGet IDs from the community source: `OpenJS.NodeJS.LTS` for Node and `Python.Python.3.14` for a compatible Python. Python is installed alone for Build; Preview reuses either existing runtime and proposes Node LTS only if neither exists. Study never installs anything, even with `-Install`. Existing compatible runtimes are not upgraded. Node selects the package's ZIP/portable installer for user scope; it does not default to the machine-wide MSI. WinGet shows package information and can request its normal agreements; this script does not auto-accept them or request elevation. If the selected installer cannot use user scope, stop and use the official installer/organization-approved process instead of silently broadening scope.

If script policy blocks this unsigned helper, **do not change execution policy to use the app**. Open `index.html` for studying. An authorized agent can use the official install/version commands interactively or the normal installer UI for an actually needed runtime. Restart the terminal/agent after an installation if its PATH has not refreshed. Inspect the real Python path if Windows opens the Store instead of printing an interpreter version.

## Optional preview

From the full app/repository, choose just one:

```sh
node tools/serve.cjs
python tools/serve.py
```

Open the printed `http://127.0.0.1:4173` address. Keep that address/port consistent for progress. Stop the server with Ctrl+C. If the port is busy, first check whether the existing SoS preview is already the one you need; otherwise use `--port 4175` with either server. `npm run serve` is a convenience, but calling Node directly avoids Windows `npm.ps1` policy issues.

Newly generated review folders include their own preview. Open a terminal in that review folder and run:

```sh
python tools/serve.py --port 4173
```

Press Ctrl+C to stop. Later, run the same command in the same folder and reopen the same address in the same browser profile. Progress lives in the browser, so stopping the server does not delete it. The human README in each generated folder explains this sequence. Python may be named `python3` on your system.

For an older generated review without that helper, the installed skill's Python preview can still serve the output:

```sh
python /path/to/exam-review-designer/scripts/serve.py --root "/path/to/generated review" --port 4173
```

Both previews bind only to loopback, need no extra packages, block hidden/private traversal paths, and do not list directories. They are local preview tools, not production servers. Changing between local-file, localhost, and hosted origins can separate browser history; transfer a backup deliberately.

## Official installation sources

Checked October 26, 2026. Prefer current official installers and supported versions; verify package availability again when an actual installation is needed.

- [Node.js download and LTS choices](https://nodejs.org/en/download).
- [Python Windows installation and existing-environment guidance](https://docs.python.org/3/using/windows.html). Python's manager/aliases can behave differently from a direct interpreter.
- [Microsoft's Python setup instructions](https://learn.microsoft.com/en-us/windows/dev-environment/python), including the Python 3.14 WinGet command.
- [WinGet exact package selection, source, scope and agreements](https://learn.microsoft.com/en-us/windows/package-manager/winget/install).

macOS/Linux users can use their existing compatible interpreter/runtime or the official platform-specific distribution. The Windows helper is not a cross-platform installer. There are no application `npm install`, `pip install`, SQL, Docker, or framework setup steps to add.
