# Design decisions

The current identity is **SoS!**, rendered as a spare italic serif wordmark with no tagline. Interface typography uses a line height of 2, with generous card and control spacing. Essential interface explanations live behind keyboard- and touch-accessible circled information buttons, presented as short bullet lists. Descriptive subtitles beneath headings are removed; questions, substantive answer feedback, labels, and actionable errors remain visible.

The visual direction is a calm reading workspace: warm off-white canvas, white cards, deep forest-green actions, soft borders, and generous space between tasks. Serif page headings distinguish orientation from the system-sans body text. Fonts are local system fonts, avoiding remote dependencies and loading shifts.

## Implemented

- A predictable five-part navigation: Overview, Practice, Insights, Quizzes, Library. Matching line icons accompany the written labels.
- A top-level Class dropdown groups courses by subject. All classes exposes a subject filter, module previews and course import without another permanent navigation item. Create with AI keeps optional context/import details collapsed.
- Fresh users start by building from their own materials. Example classes are collapsed and do not become the implicit review. Returning users retain their selected class and saved session. The prompt builder exposes a concise upload guide and explicit source policy; Library can show the author-supplied source register without claiming its facts were checked.
- One main task per page. Overview combines the recommended session and three compact metrics, followed by a category map. Insights and Library show one selected view at a time through labeled native dropdowns.
- Secondary actions live in clearly named menus. Category selection, advanced quiz settings, scenario details, and worked solutions expand on demand; active quiz filters remain visible in their collapsed summaries.
- Restrained use of color. Green marks the main action and positive results; amber and red appear with written status labels.
- Progressive detail: overview → category or thinking skill → scenario → practice variation. Daily activity bars expose the answers behind each day.
- Three compact metrics with explicit denominators where applicable. Accuracy is separated from estimated mastery and curriculum coverage.
- Questions and answers use a line height of 2, preserved paragraph breaks, and comfortable reading widths. Dense data labels are separated from reading text.
- Responsive reflow: desktop sidebar, compact horizontal navigation on smaller screens, and a single-column reading experience on phones.
- Focus mode hides navigation without changing the active question. Theme preference persists locally.
- No confidence-rating step. Selecting and submitting remain separate to allow correction; active time is captured in the background and explored only in the optional Response time view.
- One Data & backups view for saved status, a location-aware backup action, file import, and dated restoration. An unfinished session becomes the primary Overview action, making resumption visible without another setup flow.
- Real form controls, visible focus rings, labels, a skip link, text alternatives for chart bars, and reduced-motion support.
- No decorative imagery, autoplay, gamification badges, external font requests, or charting libraries. All charts use native HTML/CSS.

## Suggested next improvements

1. **Structured content editor.** Course switching, validated JSON import, AI prompts and additions-only updates now exist. A future form editor could support deliberate per-question revisions with content review.
2. **Explicit learning objectives and sources.** Add objectives, difficulty, authoritative references, author review status, and a content revision date. This would make drill-downs more meaningful than inferring thinking skills from titles.
3. **Longer-term learning trends.** When enough attempts exist, show rolling accuracy and review adherence with sample counts. Avoid an impressive-looking readiness percentage before evidence supports it.
4. **Accessible chart comparisons.** Add a data-table view and filters for time window or category when the history grows. The current chart bars are keyboard-operable and expose values through accessible labels.
5. **Optional account-free device sync.** A deliberate export/link or encrypted sync model could help learners move between devices. Keep the current offline mode available and make data transmission opt-in.
6. **More exam controls.** Flag questions, revisit unanswered items before submission, pause untimed sessions, and export a printable results report.

These are future options rather than hidden dependencies of the delivered app. The present framework stays small enough to read, modify, and share.
