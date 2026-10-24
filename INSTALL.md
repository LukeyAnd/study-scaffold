# Download and use the review framework

For the shortest first-run path, use [START_HERE.md](START_HERE.md). No runtimes need installing to study or generate a prompt in the browser. [SETUP.md](SETUP.md) covers only the tools required for an optional builder/preview/development task and includes a read-only check plus explicit installation mode.

Download the [current release ZIP from GitHub](https://github.com/LukeyAnd/study-scaffold/archive/refs/tags/v1.1.1.zip), or use **Code → Download ZIP** on the repository for the latest source. Extract the entire `study-scaffold-...` folder.

- **Study:** open the extracted folder's `index.html` or `Start SoS.cmd` on Windows.
- **Use an agent:** give it `skills/exam-review-designer/SKILL.md` and its accompanying folder, or install that folder below.
- **Develop:** start with the root `AGENTS.md` and use the verification commands in the README.

One repository ZIP includes the app, self-contained skill, research, and setup instructions. It contains no learner progress or local Git credentials. Downloading it installs nothing. GitHub supplies the archive; the website serves the app and has no ZIP download page.

## Install the skill in Codex

1. Download and extract the GitHub repository ZIP.
2. Copy its **skills/exam-review-designer** folder into your personal skills folder:
   - Windows: `%USERPROFILE%\.agents\skills\exam-review-designer`
   - macOS/Linux: `~/.agents/skills/exam-review-designer`
3. Open a new agent conversation and invoke `$exam-review-designer`. If it is not discovered, restart Codex. Keep only one active copy with that name.

The resulting file should be `~/.agents/skills/exam-review-designer/SKILL.md`, with `references`, `scripts`, and `assets` beside it. Avoid an extra nesting level such as `exam-review-designer/exam-review-designer/SKILL.md`. These are the user-level locations documented by [official OpenAI skill guidance](https://learn.chatgpt.com/docs/build-skills). A repository-scoped install can instead use `.agents/skills/exam-review-designer` in the target repository.

An agent with the built-in skill installer can also be asked (copy into AI chat):

```text
Use $skill-installer to install
https://github.com/LukeyAnd/study-scaffold/tree/main/skills/exam-review-designer.
```

## Use ChatGPT, Claude or another agent

For an ordinary chat attachment, use the short [start prompt](START_WITH_AI.md). The agent is instructed to begin immediately, carry out available work, and end learner handoffs with the next important question or exact action. Uploading a ZIP alone is not a universal activation event.

**ChatGPT/Codex:** enabled skills can be selected explicitly or matched to a request. Standalone skill availability varies by surface; OpenAI recommends plugins for broader distribution. Use your host's skill selector or the attached-file start prompt rather than assuming a repository ZIP is an installed plugin. [Official OpenAI guidance](https://learn.chatgpt.com/docs/build-skills).

**Claude:** for persistent use, upload a skill-only ZIP through **Customize → Skills → + Create skill → Upload a skill**, then enable it; required capabilities and workspace policy may affect access. Compress the included `exam-review-designer` folder itself, not the whole repository, for this importer. Its ZIP should have that one top-level skill folder. A normal chat attachment can instead use the start prompt. [Claude skill use](https://support.claude.com/en/articles/12512180-use-skills-in-claude), [package structure](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills).

Host guidance checked October 24, 2026. These are documented paths, not a claim that importing into each host was tested here.

Place the included `skills/exam-review-designer` folder in the host's documented skill directory, or give it `SKILL.md` and the accompanying resources explicitly. If a host requires a skill-only ZIP, compress that folder with one `exam-review-designer` top-level folder and use its documented import interface. Installation paths and ZIP-import support vary; this project does not claim every host has the same UI. A plugin-directory listing is not included.

The skill's intake works with a real ask widget when available and ordinary chat otherwise. No connector, API key, or proprietary question widget is required. The optional local review-building script needs Python 3.10+; the resulting browser app has no Python or network requirement.

## Start a review

Copy this prompt into your AI chat. GitHub adds a copy icon in the upper-right corner of the block.

```text
Use the Exam Review Designer skill to start my SoS! review now. Inspect the
material I attach, do the work you can, and ask only the next essential question
when you need me. Keep guiding me through sources, review creation and launch;
end each handoff with a clear question or specific action. State what is provisional.
```

Attach your syllabus, objectives, exam guide, representative tasks, or relevant notes in normal chat. The agent will ask follow-ups only where needed; it should not require you to complete a long form when those facts are already supplied.

The skill creates local outputs. It does not automatically publish private notes or generated questions. Public sharing requires authorization for the material being shared.

## Hand the project to an agent

For the full project, give the agent this starting instruction:

```text
Read AGENTS.md first, then choose the relevant route in AGENT_GUIDE.md. Complete my
requested change using the existing contracts and targeted checks. Keep affected
instructions and portable snapshots current, and report actual verification and
remaining limits.
```

The installed skill's `SKILL.md` gives its own six-step reading and execution order. Generated reviews include a local `AGENTS.md` pointing to course context, sources, bank data, and runtime files; the framework's test/packaging tools are not claimed to exist in those smaller folders. Some hosts discover these files automatically; otherwise explicitly ask the agent to read them.


## Research and reproducible builds

Read [RESEARCH.md](RESEARCH.md) for the evidence, methodology, source register, and limits of the existing algorithm. The repository is the maintained source; skill-template snapshots are regenerated from the app and research file.

Maintainers can refresh portable snapshots and build ignored local QA archives using Python's standard library:

```sh
python tools/package_release.py
```

Then run the engine and package tests and commit the source and refreshed skill snapshots. Archives/checksums stay in ignored `dist/`; do not commit or host them. Use `--sync-only` when refreshing snapshots without archives. GitHub's **Source code (zip)** for a release/tag and **Code → Download ZIP** supply the complete source. Verify the downloaded contents and run `python tools/verify_first_run.py --archive PATH` against that ZIP; do not assume GitHub archive bytes have a permanently fixed checksum.
