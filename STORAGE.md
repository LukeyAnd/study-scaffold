# Local saves, timing, and portable backups

## Learner workflow

Start a session and answer normally. There is no confidence control. The selected answer, exact generated question and choice order, fixed quiz plan, submitted answers, and elapsed active time save automatically. Open **Practice** to continue, or use **Resume session** on Overview. Reopening submitted feedback does not submit it again. The last results screen is saved too.

Open **Library → Data & backups** for saved status and backup controls:

- **Save backup file** writes a dated JSON file. Supporting browsers offer a location picker; others download the file. Save it in any folder, removable drive, or locally synced cloud-drive folder you choose. **More data options → Download backup** always uses the browser download flow.
- **Load backup** validates and replaces the active bank's workspace after confirmation. It also accepts legacy version-one progress JSON and JSON content saved with a `.txt` extension. Other question banks are left alone. It does not merge competing device histories.
- **Restore a date** loads one of the latest seven study dates stored in the local database. The entry for a date is updated after a submitted answer or completed session. Restoring replaces current progress after confirmation. It does not erase the other restore points.
- **Keep browser storage** asks the browser for persistent storage. The browser may refuse. This cannot prevent deliberate clearing of site data; keep independent file backups.
- **Reset progress** clears the active workspace and its dated restore points after confirmation. Downloaded files and other banks remain untouched.

Timed exams retain their absolute deadline, even while the app is closed. A past deadline finishes the session on reopening; only previously submitted answers enter the learning history. Untimed sessions can resume later without a deadline.

## Storage model

The default is **IndexedDB**, an asynchronous, transactional database built into the browser. It needs no SQL server, Python, installation, account, or network service. Database `sos-study` has two object stores:

| Store | Key | Value |
| --- | --- | --- |
| `workspaces` | Bank ID | Revision number and version-two workspace |
| `snapshots` | Bank ID + local calendar date | Latest submitted workspace for that date; seven dates retained per bank |

A workspace contains the version-one learning state plus session IDs, materialized question text/options, selected answer, active timing, recent-question list, and last results. Question generator functions are never serialized. On loading, validated scenario IDs reconnect to the active bank. All text remains escaped in the UI.

The learning state keeps all-time scenario totals, the most recent 5,000 answer events, and 100 completed sessions. Restore points are bounded at seven; no browser database is placed in the repository or public ZIP. Each write captures a detached snapshot and uses a queued transaction. A revision check prevents a stale IndexedDB tab from overwriting another tab. A browser message prompts the stale tab to reload. Simultaneous device histories are not merged.

Writes occur on answer selection, question/session transitions, visibility changes, and at ten-second intervals while viewing an unanswered question. The UI does not write on every animation frame or timer tick. An abrupt process kill may lose an unfinished transaction or the latest seconds of active timing. If a write fails, the app shows an error and keeps its in-memory copy available for export.

When IndexedDB is unavailable, the app falls back to bank-scoped version-two localStorage. This fallback preserves the workspace but has no dated restore points and cannot provide IndexedDB's atomic concurrency check across simultaneous tabs. If both storage mechanisms are unavailable, the app explicitly reports memory-only operation. Legacy version-one localStorage is migrated only after validation; it is removed only after a successful new save. Invalid stored data is preserved for export and requires an explicit reset or valid import before further editing.

Browser storage belongs to a browser profile and origin. A downloaded file, localhost port, and public HTTPS site can have separate data. Clearing site data or using private browsing can remove it. JSON backups are independent readable text; they include learning history and question text, so share them deliberately. They do not upload themselves or provide automatic cloud sync.

SQLite would be appropriate for a future desktop/server edition or very large queryable history. Adding a SQL runtime here would not make browser data immune to eviction or provide cross-device sync. IndexedDB plus portable JSON fits the present install-free static app.

## Automatic timing

New answers use `confidence: "auto"` to explicitly mean **no self-report collected**. The app never converts seconds into an assumed confidence rating. Legacy `sure`, `okay`, and `unsure` entries remain readable; their earlier scheduling history is retained.

Time is accumulated with the browser's monotonic performance clock while an unanswered question is visible, the window is focused, and the question is the current app view. Switching app pages or tabs, losing window focus, and opening an information dialog pause accumulation. Reloading resumes the stored duration instead of adding time while the app was closed. Idle time while the question remains visible cannot be distinguished from reading or thinking.

Each new answer event records:

| Field | Meaning |
| --- | --- |
| `at` | Submission timestamp in Unix milliseconds |
| `ms` | Active viewing time to submission |
| `selectionMs` | Active viewing time to the first answer choice |
| `changes` | Number of revisions after the first choice |
| `interrupted` | Whether the question had a recorded view interruption or was resumed |
| `timingVersion` | `1`, distinguishing active timing from older wall-clock durations |

**Insights → Response time** displays median active submission time by thinking skill, using correct answers without recorded interruptions. Bars expose the underlying timed answers; the history also includes interrupted and incorrect answers. Results depend on task length, complexity, reading, input method, and access needs. Small samples are descriptive only. Timing and revisions do not penalize mastery, change review intervals, infer confidence, or predict exam grades. The study policy still uses observed accuracy, recent mistakes, due dates, coverage, and repeated evidence. See [RESEARCH.md](RESEARCH.md).

## Browser documentation

Implementation checked October 24, 2026 against [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [persistent storage](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist), and [file-system access](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) documentation. Optional file picking and storage protection depend on browser support and secure-context policies; normal download/import remains available.
