# Your exam review

## For humans — study

- Open `index.html` in your browser, or double-click `Start SoS.cmd` on Windows. Keep this folder's files together.
- Direct browser study needs no installation, Node.js, Python, SQL, npm packages, or internet connection.
- Read [REVIEW_PLAN.md](REVIEW_PLAN.md) for scope, schedule and assumptions. Source locations appear in explanations and [SOURCES.md](SOURCES.md).

## For humans — start or restart local study

Use **Need clarity?** beside a question to save a note, pasted device-dictation transcript or image for later. Find it in **Library → Clarity notes** or after the session. Copy its context to your preferred AI; paste a checked explanation into **What helped**. SoS! does not record voice or call an AI automatically. Export notes separately from progress before moving or clearing browser data.

These are commands **you run in a terminal after the review is built**. A local server gives the browser a consistent address for the review. The included preview needs Python 3.10+ and no additional packages.

### Start

1. Open a terminal in **this review folder**, containing `index.html` and `tools/`. On Windows, open the folder in File Explorer, type `powershell` in its address bar, and press Enter. On macOS/Linux, open Terminal and use `cd` to enter this folder.
2. Run:

```sh
python tools/serve.py --port 4173
```

If your computer uses `python3` instead, substitute `python3` for `python`. If neither command is available, open `index.html` directly or ask your agent to help locate/install Python using the framework's setup guide. Do not install npm or pip packages for this preview.

3. Open **http://127.0.0.1:4173** in your browser and keep the terminal open while studying.

### Stop and restart

- **Stop:** press **Ctrl+C** in that terminal. This stops the server without deleting saved browser progress.
- **Restart later:** open a terminal in this same review folder and run the same command. In an existing terminal, **Up Arrow**, then **Enter**, can repeat it from history.
- **Return to studying:** open **http://127.0.0.1:4173** in the same browser profile and choose **Resume session** if one is unfinished. Timed exams retain their original deadline while the server is stopped.
- **Cannot connect?** Check that the command is running. If the port is already in use, check whether this review is already running there. If another program owns it, use `--port 4175` and open the printed address; that address has separate browser storage, so transfer a backup deliberately.

### How it works

- The server delivers files locally on your computer. It does not publish the review or run an AI.
- Your browser runs the questions and saves progress in its own local database. The server is not where your learning history lives, so restarting it does not reset that history.
- Use the same folder, browser profile, and address/port each time. `localhost`, `127.0.0.1`, another port, and a directly opened file can have separate saves.
- Open **Library → Data & backups** to export a dated JSON backup before moving devices or clearing browser data. Browser storage can be cleared or unavailable. Custom classes need their course file transferred separately before loading progress.
- The preview in `tools/serve.py` is included with this review. You can move the complete folder without the original framework or installed agent skill.

## Review material and limits

- This app scores four-option MCQs. Use companion tasks for written/oral assessment. Learning scores are heuristics, not pass probabilities.
- [QUESTION_AUDIT.md](QUESTION_AUDIT.md) starts unreviewed. Actual source, solution and distractor checks are needed before claiming question accuracy.
- Response timing is recorded automatically; no confidence rating is needed.
- This folder includes course context and a question bank. Check permission and private/restricted content before sharing it.

## For AI agents

Read [AGENTS.md](AGENTS.md) for the ordered file map and modification contracts. The human instructions above are launch/restart guidance, not a replacement for course context, source review or question audits. Keep this README and the included preview command current when changing the delivered files.
