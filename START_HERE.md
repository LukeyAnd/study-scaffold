# Start here

## Start with your AI

Attach the repository ZIP and your course material, then say **Start my SoS! review** using the installed skill or [copyable start prompt](START_WITH_AI.md). The agent will inspect what is available, guide you through missing context, and do the work it can. When it needs you, it should ask the next essential question or give one exact action. Begin with `SKILL.md` alone if necessary; add the full folder when its resources are needed. [INSTALL.md](docs/guides/INSTALL.md) explains host activation and its limits.

## Study or create an AI prompt

1. Download the ZIP from the GitHub repository (**Code → Download ZIP**, or the versioned ZIP linked in the README). Extract it completely and open the extracted `study-scaffold-...` folder.
2. Open `index.html` in your browser. On Windows, `Start SoS.cmd` opens the same page and installs nothing. The hosted app also works without a download.
3. Choose **Create my review**. Follow **What to upload**, copy the prompt to your preferred AI, and attach your course sources there. Import its reviewed course JSON through **Add a class**.

**No Node.js, Python, SQL, npm install, API key, or terminal is required for this route.** Keep the app files together. The browser stores progress; use its backup controls before moving devices or URLs. An optional local preview gives a stable localhost address, but is not required to start.

## Have an agent build a standalone review

The same GitHub ZIP includes `skills/exam-review-designer/`. Give the agent that folder, or install it following [INSTALL.md](docs/guides/INSTALL.md). Copy this block into your AI chat using GitHub's upper-right copy icon:

```text
Use the Exam Review Designer skill to start my review now. Inspect my course files,
reuse known answers and do the work you can. Ask only the next essential question
or give me one exact action when you need me. Consult setup instructions only when
a builder or preview is needed, reuse available tools and verify the result. Deliver
the review with source checks and the actual file/import/launch steps for my device.
```

The builder needs **Python 3.10+ with its standard library**. The generated review needs only a browser. The skill can also return an importable course JSON without using the builder. Skill installation instructions are in [INSTALL.md](docs/guides/INSTALL.md).

## Agent setup or developer work

Use [the tested first-run command blocks](docs/guides/first-run-commands.md) and read [SETUP.md](docs/guides/SETUP.md) for the task-based dependency check, explicit installation option, preview alternatives, and troubleshooting. Start at [AGENTS.md](AGENTS.md) for repository changes. Setup should not replace source review or silently add databases, global npm packages, Docker, or another framework.

For upload and correctness guidance, use [SOURCE_GUIDE.md](docs/methodology/SOURCE_GUIDE.md). For the tested first-run paths and their limits, use [FIRST_RUN_TEST.md](docs/maintenance/FIRST_RUN_TEST.md).
