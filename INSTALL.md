# Download and use the review framework

For the shortest first-run path, use [START_HERE.md](START_HERE.md). No runtimes need installing to study or generate a prompt in the browser. [SETUP.md](SETUP.md) covers only the tools required for an optional builder/preview/development task and includes a read-only check plus explicit installation mode.

There are two downloads. Choose the **app ZIP** to practice now or inspect the project. Choose the **skill ZIP** to teach your agent how to gather context and build a new course review.

| Download | Use |
| --- | --- |
| [Study Scaffold app + source + research](https://lukeyand.github.io/study-scaffold/downloads/study-scaffold.zip) | Extract the ZIP, open `study-scaffold/index.html`, and keep the files together. |
| [Exam Review Designer skill](https://lukeyand.github.io/study-scaffold/downloads/exam-review-designer.zip) | A single `exam-review-designer` folder containing instructions, research, intake templates, a builder script, and the offline app template. |
| [Checksums](https://lukeyand.github.io/study-scaffold/downloads/SHA256SUMS.txt) | Compare the SHA-256 of a ZIP with the published value if you want to verify the download. |

The ZIPs are built from public project files; they contain no student progress, private course material, or local Git credentials. Nothing installs automatically when a ZIP is downloaded.

## Install the skill in Codex

1. Download and extract **exam-review-designer.zip**.
2. Copy the extracted **exam-review-designer** folder into your personal skills folder:
   - Windows: `%USERPROFILE%\.agents\skills\exam-review-designer`
   - macOS/Linux: `~/.agents/skills/exam-review-designer`
3. Open a new agent conversation and invoke `$exam-review-designer`. If it is not discovered, restart Codex. Keep only one active copy with that name.

The resulting file should be `~/.agents/skills/exam-review-designer/SKILL.md`, with `references`, `scripts`, and `assets` beside it. Avoid an extra nesting level such as `exam-review-designer/exam-review-designer/SKILL.md`. These are the user-level locations documented by [official OpenAI skill guidance](https://learn.chatgpt.com/docs/build-skills). A repository-scoped install can instead use `.agents/skills/exam-review-designer` in the target repository.

An agent with the built-in skill installer can also be asked:

> Use `$skill-installer` to install `https://github.com/LukeyAnd/study-scaffold/tree/main/skills/exam-review-designer`.

## Use another agent

If the host supports importing a standard Agent Skills ZIP, import the skill ZIP through its documented interface. Otherwise place the extracted folder in that host's documented skill directory, or give it `SKILL.md` and the accompanying resources explicitly. Installation paths and ZIP-import support vary; this package does not claim every host has the same UI. A plugin-directory listing is not included.

The skill's intake works with a real ask widget when available and ordinary chat otherwise. No connector, API key, or proprietary question widget is required. The optional local review-building script needs Python 3.10+; the resulting browser app has no Python or network requirement.

## Start a review

> Use `$exam-review-designer` to create a review for my upcoming exam. Inspect the material I attach first. Ask only for missing information about scope, exam format, timing, and my needs. Then build a source-linked review plan and an offline browser review where appropriate. Tell me what is provisional.

Attach your syllabus, objectives, exam guide, representative tasks, or relevant notes in normal chat. The agent will ask follow-ups only where needed; it should not require you to complete a long form when those facts are already supplied.

The skill creates local outputs. It does not automatically publish private notes or generated questions. Public sharing requires authorization for the material being shared.

## Hand the project to an agent

For the full project, give the agent this starting instruction:

> Read AGENTS.md first, then choose the relevant route in AGENT_GUIDE.md. Complete my requested change using the existing contracts and targeted checks. Keep the affected instructions current, rebuild downloads if they are part of delivery, and report actual verification and remaining limits.

The installed skill's `SKILL.md` gives its own six-step reading and execution order. Generated reviews include a local `AGENTS.md` pointing to course context, sources, bank data, and runtime files; the framework's test/packaging tools are not claimed to exist in those smaller folders. Some hosts discover these files automatically; otherwise explicitly ask the agent to read them.


## Research and reproducible builds

Read [RESEARCH.md](RESEARCH.md) for the evidence, methodology, source register, and limits of the existing algorithm. The repository is the maintained source; skill-template snapshots are regenerated from the app and research file.

Maintainers can rebuild both ZIPs using Python's standard library:

```sh
python tools/package_release.py
```

Then run the engine and package tests, commit the regenerated snapshots/archives/checksums, and push. The download links keep the same names while their checksums change with the release.
