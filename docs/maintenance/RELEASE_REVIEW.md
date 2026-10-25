# First release review

Target: **SoS! v1.0.0**, October 24, 2026. The release is a reusable, local-first MCQ study framework with an optional agent authoring workflow. Proposed future features remain listed separately in [RESEARCH.md](../methodology/RESEARCH.md).

## Scope and disposition

- Ready for the disclosed study-scaffold scope after the checks below. This is a software release, not certification of course content or learning outcomes.
- Distribution uses GitHub's repository/release source ZIP. The app, self-contained skill folder, research, README, and setup guides are all inside it. Website ZIPs and the separate download page have been removed.
- `README.md` is at the repository root and opens with download and quick-start steps. GitHub controls its position relative to the file list.
- Future ideas remain proposals; this release does not add Today planning, constructed-response grading, cloud sync, or a live AI tutor.

## Findings addressed

- A valid imported question ID such as `toString` could collide with an inherited object property and break learning summaries. Engine and UI now read only owned learning records, with a regression test covering practice and JSON recovery.
- The previous beginner verification depended on two website archives. It now accepts a single source ZIP, detects GitHub's versioned folder name, and builds from the included skill.
- The local QA archive omitted the skill's license file. It now preserves extensionless license files and verifies the included skill's required resources.
- Removed obsolete website-download routes, links and tracked archives; local package/test artifacts remain ignored in `dist/`.
- Consolidated theme-button state and exposed its pressed state; reload, keyboard help and responsive views are exercised in browser QA.
- A selected incorrect answer could inherit the green pre-submission selection styling. Feedback now keeps incorrect and correct choices visually distinct, with text labels retained and a browser regression check.

## Verification

Checked locally on Windows with Chrome, PowerShell 5.1, and existing host Node/Python executables. No runtime installation or execution-policy change was performed.

- **24 Node tests passed:** generators, adaptive selection, filtering, the imported-ID regression, course additions, timing independence, and workspace validation.
- **17 Python tests passed:** builder outputs, source/objective checks, no-overwrite behavior, resource synchronization, archive completeness/privacy, documentation links, setup-task selection and preview servers.
- **Fresh source-ZIP browser workflow passed:** source-first onboarding, prompt generation, course import, exact answer recovery, source feedback, and backup transfer into a second empty profile.
- **Additional browser checks passed:** chart/category drill-downs; all main views at 375, 768 and 1360 px without horizontal overflow; saved dark theme; help-dialog Escape and focus return; standalone generated assets; original exam deadline on reload; expired exam without fabricated answer events; localStorage recovery; memory-only warning; stale-tab write protection.
- **Cross-platform CI passed** on Windows/Python 3.14 and Linux/Python 3.10, with Node 24, for implementation commit `9a52a30`: [recorded run](https://github.com/LukeyAnd/study-scaffold/actions/runs/40119718997). Both jobs verified packages, tests and first-run generation. Windows ran the setup checks; Windows-specific checks are skipped on Linux.
- **Actual GitHub ZIP checked:** all 73 files in the downloaded implementation-commit archive matched Git's committed bytes, with no nested ZIPs, website downloads, Git credentials or private workspace artifacts. The full isolated browser workflow passed against that downloaded archive and its included skill, not a working-tree runtime fallback. Later report-only edits do not change those runtime files; check the final release's Actions run for its own commit.
- Maintainer reproduction commands and browser-QA prerequisites are in [FIRST_RUN_TEST.md](FIRST_RUN_TEST.md). Use `--archive PATH` against the actual downloaded GitHub source ZIP before tagging/publishing; do not rely only on working-tree assets.

## Known limits accepted for this scope

- Direct `file://` browser launch and double-clicking `Start SoS.cmd` were not browser-verified here. Browser checks used localhost; that and the hosted app are documented alternatives.
- Missing-tool scenarios and installation plans were tested without an actual OS installation. WinGet package availability, agreements and PATH refresh still require a real installation check. Normal studying needs no runtimes.
- Full screen-reader/assistive-technology and accessibility conformance audits remain outstanding. Keyboard and responsive smoke checks do not establish WCAG conformance.
- Local Chrome testing does not establish Safari/Firefox/mobile-device compatibility. macOS installation/first-run flows were not exercised here; Linux CI is software/package coverage, not a desktop-browser test.
- Question correctness and source/version alignment require review of each learner's course. Optional examples are demonstrations; tax content is unverified. Structural checks cannot certify answers.
- Progress is browser-local and may be cleared. Export backups; custom course files travel separately. There is no device sync or simultaneous-history merge. Detailed history is bounded as documented in [STORAGE.md](../guides/STORAGE.md).
- Mastery and spacing are heuristic. Success in one session is not proof of delayed retention or an exam pass probability. Static answers are visible to a determined reader.

## Owner and student review

No additional permission is needed for the already authorized public framework release. A useful final personal review is a five-minute trial: download/extract the GitHub ZIP, create/import a small course, answer a question, reload, and export a backup. Before relying on a real course, review its question audit and important answers against the governing sources. Before sharing that course, confirm permission to share its content; permission to publish this framework does not cover private student material.

Report reproducible software issues through the repository's Issues page using nonprivate examples. Keep this report and [CHANGELOG.md](../../CHANGELOG.md) consistent with any later changes; test results are evidence for the checked version, not a promise about future edits.

## Version 1.1.0 follow-up

Checked October 24, 2026. Added local question-linked clarity notes with raster image/transcript capture, a deferred queue, independent backup and manual AI handoff; added a source-aware question-design plan and editorial cue audit. No automatic AI service, microphone recording, new runtime dependency, multi-select scoring or psychometric difficulty calibration was introduced.

- **31 Node tests passed**, including note validation, raster signature/size limits, image backup round trips, class isolation and stale text saves, plus exact question-design quota allocation and AI prompt inclusion.
- **24 Python tests passed**, including builder reports, package references/synchronization, length cues in both directions, tie handling, equal family weights, numeric/unsegmented text, strict warning exits and report no-overwrite behavior.
- **Extracted QA ZIP browser checks passed** with isolated Chrome profiles: pasted transcript/image, actual image decoding and Blob recovery, exact-session preservation, end-session queue, manual AI prompt, saved explanation/resolution, image backup transfer, stale-tab rejection, class isolation, responsive drawer, text-only fallback and failed-save draft preservation. Existing first-run, chart, theme, exam and recovery checks passed too.
- The portable skill passed the host's skill validator. Desktop/mobile drawer screenshots were inspected. Checks used localhost; the original direct-file, other-browser and actual OS-installer limits remain.
- Source correctness still needs course-specific review. Question-design proportions and thresholds are documented project heuristics; passing the screen is not factual or difficulty approval.

Public CI, hosted assets and the actual final GitHub ZIP must be verified against the release commit after publication; local evidence alone does not establish those outcomes.

The new screen was also exercised against the optional tax generator: 54 families, 10 variants each, deterministic LCG seed 20261024. A longest-option strategy succeeded 86.1% under the screen's tie/family weighting; 49 families had at least one warning. This confirms the reported wording problem in that example. It is not a factual audit or exhaustive generator check. The optional unverified tax bank was not automatically rewritten; newly authored reviews need the source/design checks above.

## Version 1.1.1 guided startup

Checked October 24, 2026. The skill now begins the requested workflow, completes available authorized work and ends learner handoffs with an essential question or exact next action. The same contract travels in default prompts, browser-generated AI prompts and generated-review agent instructions. The single-file route can begin intake before requesting missing resources. A root start guide supplies a short activation fallback.

- **31 Node tests and 25 Python tests passed**, covering existing runtime behavior, prompt generation, builder/package synchronization, required archive entry files and the documented 200-character description limit. The portable skill passed the host's validator.
- Extracted-package first-run checks passed, including standalone generation and setup helpers. Live cross-host installation/activation was not evaluated. Intake examples are manual acceptance scenarios, not independent model-test results.
- Official OpenAI and Claude documentation was inspected for activation and package structure. Enabling/importing a skill differs from attaching its source; no universal silent-upload trigger is promised. Private course files are not published and no extra runtime dependency was added.

## Version 1.2.0 repository and shipping review

Checked October 24, 2026. Longer documents now live in guides/methodology/maintenance folders; the original prototype and explicit one-time adapter are archived. The root README, launchers, short agent entry points and runtime stay at stable locations. Agent routes, generated templates, setup messages, methodology links, packaging and documentation checks use the new layout. A repeated README startup section and outdated roadmap claims were removed.

Findings repaired:

- Quiz planning rebuilt candidate weights and arrays for each selection. A cached sum tree now samples without replacement in O(n + k log n), preserving the existing selection policy. Course topic/skill indexes are also built in one pass.
- Scenario drill-downs rendered every row. They now render 50 at a time with a native Page selector, visible range, retained focus and page reset on category/filter changes.
- Import/date restoration applied memory state before a successful save, and reset cleared restore points separately. Replacements now commit first; reset writes the empty workspace and clears restore points in one transaction. Failed writes retain the previous live/saved session and report an error.
- Preview aliases could reach outside/hidden files despite the lexical URL guard. Both preview implementations now check the resolved target; Windows directory-junction tests exercise the boundary.
- The historical adapter could overwrite the example bank by default. It now needs an explicit new output and refuses existing files; it is not part of the build route.

Verification performed:

- **35 Node and 27 Python tests passed**, including 600 seeded planner replays against the previous sampler, boundary cases, a unique 5,000-question plan, historical no-overwrite behavior, folder/reference/package checks and preview alias protection.
- **Extracted QA ZIP browser checks passed:** 5,000-family import, 50-row paging and keyboard/mobile behavior, unique 1,000-question quiz persistence; injected import/restore/reset failures and retries; prior onboarding, exact resume, source feedback, charts, notes/image backup, class isolation, stale saves, timing/expiry and unavailable-storage paths.
- **Synthetic benchmark:** Node v24.22.1 on this Windows host, 5,000 families, 1,000 questions, median of three runs: previous sampler 333.68 ms, optimized sampler 1.08 ms. Selections matched. This is one warmed host benchmark, not a promise about every workload or evidence of better learning.

The existing limitations remain: learner-specific content needs source review; the legacy tax example is unverified; live ChatGPT/Claude skill activation, other browser engines, direct-file launch, actual OS installation and full accessibility conformance are not established by these checks. Before calling a published build verified, check its CI, hosted assets and downloaded source ZIP at that exact commit.
