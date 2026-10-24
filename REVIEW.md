# Review of the supplied trainer

The original HTML is preserved in `midterm_trainer.html`. The new app is a separate implementation using its 54 example scenario generators.

## Findings addressed

| Original issue | Change |
| --- | --- |
| One correct answer permanently sets a scenario's mastered flag; later mistakes never revoke it. | Per-scenario recent outcomes, evidence requirements, review intervals, and reversible secure status. |
| Reset creates an empty object, then reloads the old localStorage value. | Reset replaces only the active bank's stored state and clears the running session. |
| Category-level accuracy obscures which specific scenarios need review. | Scenario records, skill labels, category drill-downs, and recent-mistake targeting. |
| Anti-repeat claims are stronger than a finite question pool can guarantee. | Explicit pool-sized cooldown; the one-item case is documented. |
| A hardcoded math count and repeated fixed labels drift from the actual bank. | Counts, categories, skills, and plan sizes derive from active-bank data. |
| No fixed-length quizzes, exam mode, deadline, or results review. | Unique quiz plans, strict filters, deferred exam feedback, deadlines, scoring, and missed-scenario retries. |
| Global keyboard shortcuts can interfere with ordinary controls. | Shortcuts ignore modifier keys and interactive form controls. Answer selection and checking are separate. |
| Storage failures are silently ignored, and saved data is weakly validated. | Bank-scoped versioned storage, schema checks, surfaced storage failures, and backup import/export. |
| Question text, tracking, content, and UI are entangled in one document. | A pure learning engine, replaceable bank scripts, and separate UI and CSS. |
| A duplicate answer is patched by appending an artificial alternative label. | Retry generation; reject a persistently duplicate generator instead of inventing a distractor. |
| Dense dark layout competes with long questions and answers. | Light default, double-spaced reading text, responsive layout, focused reading mode, and optional dark theme. |
| Statistics are limited to counters and small topic bars. | Clickable category and skill bars, daily practice charts, answer history, and session summaries. |

## Efficiency choices

No framework runtime, build pipeline, npm dependencies, charting library, external fonts, or network-based adaptive service. Topic and skill pools are indexed once. The question bank is loaded once; only the selected scenario is materialized. Detailed answer history is bounded to 5,000 events and recent session history to 100. Small views re-render using a single delegated set of event handlers. The timer updates its own text rather than re-rendering the question. Queued IndexedDB writes save the workspace at meaningful transitions and ten-second active checkpoints; daily restore history is bounded to seven dates. See [STORAGE.md](STORAGE.md).

The current full-view rendering is appropriate for a small curriculum. If thousands of scenarios are introduced, paginate scenario and answer histories and move large-bank loading behind a subject picker.

## Content and measurement limits

The review covers app behavior and generator structure. It does not certify tax conclusions, distractor math in every possible variation, legal currency, or course alignment. The supplied content remains clearly labeled as an unverified example. Estimated mastery is a heuristic for choosing practice, not a psychometrically calibrated score. The confidence control has been removed. Active response time and answer revisions are recorded descriptively and do not penalize mastery or alter scheduling. Earlier confidence ratings remain compatible with imported histories.
