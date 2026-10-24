# Start here

## Study or create an AI prompt

1. Download the ZIP from the GitHub repository (**Code → Download ZIP**, or the versioned ZIP linked in the README). Extract it completely and open the extracted `study-scaffold-...` folder.
2. Open `index.html` in your browser. On Windows, `Start SoS.cmd` opens the same page and installs nothing. The hosted app also works without a download.
3. Choose **Create my review**. Follow **What to upload**, copy the prompt to your preferred AI, and attach your course sources there. Import its reviewed course JSON through **Add a class**.

**No Node.js, Python, SQL, npm install, API key, or terminal is required for this route.** Keep the app files together. The browser stores progress; use its backup controls before moving devices or URLs. An optional local preview gives a stable localhost address, but is not required to start.

## Have an agent build a standalone review

The same GitHub ZIP includes `skills/exam-review-designer/`. Give the agent that folder, or install it following [INSTALL.md](INSTALL.md). Copy this block into your AI chat using GitHub's upper-right copy icon:

```text
Use the Exam Review Designer skill to build a review from my sources. Read its setup
instructions first. Reuse tools you already have, install only a missing tool needed
for this task, and verify it before continuing. Ask only for consequential missing
course information. Build a source-linked review, check the questions and audit, open
the result in my browser, and report what you actually verified.
```

The builder needs **Python 3.10+ with its standard library**. The generated review needs only a browser. The skill can also return an importable course JSON without using the builder. Skill installation instructions are in [INSTALL.md](INSTALL.md).

## Agent setup or developer work

Read [SETUP.md](SETUP.md) for the task-based dependency check, explicit installation option, preview alternatives, and troubleshooting. Start at [AGENTS.md](AGENTS.md) for repository changes. Setup should not replace source review or silently add databases, global npm packages, Docker, or another framework.

For upload and correctness guidance, use [SOURCE_GUIDE.md](SOURCE_GUIDE.md). For the tested first-run paths and their limits, use [FIRST_RUN_TEST.md](FIRST_RUN_TEST.md).
