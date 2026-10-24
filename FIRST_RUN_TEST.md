# First-run verification

Checked October 24, 2026 on Windows with Chrome, PowerShell 5.1, and existing host-provided Node/Python executables. The first-run verifier extracts one source ZIP into a new folder with spaces in its name and uses the skill included at `skills/exam-review-designer`. Browser checks use empty, isolated profiles and loopback preview servers. No software is installed and no user browser profile or execution policy is changed. Current release evidence is in [RELEASE_REVIEW.md](RELEASE_REVIEW.md).

## Checks performed

| Starting point | Result |
| --- | --- |
| Source ZIP extracted with no `node_modules` | Contains the app, included skill, `Start SoS.cmd`, first-run instructions, and optional setup/preview tools |
| Study check with an empty PATH, including `-Install` | Ready; no runtime or installer requested |
| Build/Preview/Develop checks with missing tools | Reports only the task's missing requirements; Build proposes Python alone, Preview proposes one runtime |
| Existing Python or Node outside PATH | Explicit executable paths are verified and reused; Python alone satisfies Build and Preview |
| `-Install -WhatIf` with missing tools | Returns exact WinGet package plans without invoking an installer |
| App opened in an empty browser profile | Starts at All classes with example classes collapsed; Create my review generates a source/audit-aware prompt |
| Import a course and begin practice | Imported modules load; the exact question and selected answer survive reload |
| Submit and inspect sources | Feedback and source records are accessible; the saved learning history contains one event |
| Move a progress backup into a second empty profile | Reimported course and restored backup recover submitted feedback; tested at 375 px without horizontal overflow |
| Build with only the extracted skill and its example inputs | Generates a standalone review in a fresh folder, with source/context/plan files, an explicitly unreviewed question-audit template, and the Windows launcher |
| Generated review opened independently | Loads its own assets, presents the authored course, and shows question feedback with sources |
| Both optional preview servers | Serve HTML/JavaScript, reject private paths, and need no additional packages; a busy Python port produces an actionable error |

The arithmetic example is a software fixture. These checks do not establish the correctness or exam coverage of a learner's course. Follow the source and question-audit workflow for that review.

## Reproduce

From the repository with an existing Python interpreter:

```sh
python tools/package_release.py
python -m unittest discover -s tests -p "*test.py"
node --test tests/*.test.cjs
python tools/verify_first_run.py
```

The last command extracts the ignored local QA archive from `dist/`, checks the extracted setup helpers on Windows, and builds a review using its included skill. To exercise an actual GitHub download instead, use `python tools/verify_first_run.py --archive "/path/to/study-scaffold.zip"`. The extracted folder name is detected automatically, including versioned GitHub names. It reports exactly which checks ran. It does not perform browser checks by default.

For browser QA only, a test host may supply Playwright and Chrome/Chromium, set `STUDY_NODE` to its Node executable, `SOS_PLAYWRIGHT` to the host's Playwright module, and optionally `SOS_BROWSER` to a browser executable; then run `python tools/verify_first_run.py --browser`. Browser automation is a maintainer tool, never a dependency of the app or a generated review. This verification writes only temporary files under `.validation` and removes its extracted folders afterward.

## Limits

- This was an isolated-folder/profile test on the existing computer, not a fresh Windows VM or an actual OS installation test. Missing tools were simulated using an empty PATH and restricted discovery.
- The opt-in installation route was checked with `-WhatIf`; WinGet downloads, agreements, PATH refresh, and successful installation still need a real clean-machine check. Recheck current official package availability before installing.
- Direct `file://` browser launch and double-clicking `Start SoS.cmd` were not browser-verified in this environment. The extracted apps were verified through localhost. Keep a stable origin and export progress before moving it.
- macOS/Linux first-run and installation flows were not exercised here. Their documented paths reuse existing compatible tools or official platform installers.
- Installing a skill into an AI host does not prove that host automatically discovers it. Provide `SKILL.md` explicitly when needed; the agent must use capabilities actually available in its environment.
