# Design decisions

The current identity is **SoS!**, rendered as a spare italic serif wordmark with no tagline. Interface typography uses a line height of 2, with generous card and control spacing. Essential interface explanations live behind keyboard- and touch-accessible circled information buttons, presented as short bullet lists. Descriptive subtitles beneath headings are removed; questions, substantive answer feedback, labels, and actionable errors remain visible.

The visual direction is a calm reading workspace: warm off-white canvas, white cards, deep forest-green actions, soft borders, and generous space between tasks. Serif page headings distinguish orientation from the system-sans body text. Fonts are local system fonts, avoiding remote dependencies and loading shifts.

## Implemented

- A predictable five-part navigation: Overview, Practice, Insights, Quiz builder, Library & data.
- Restrained use of color. Green marks the main action and positive results; amber and red appear with written status labels.
- Progressive detail: overview → category or thinking skill → scenario → practice variation. Daily activity bars expose the answers behind each day.
- Four key metrics with explicit denominators. Accuracy is separated from estimated mastery and curriculum coverage.
- Questions and answers use a line height of 2, preserved paragraph breaks, and comfortable reading widths. Dense data labels are separated from reading text.
- Responsive reflow: desktop sidebar, compact horizontal navigation on smaller screens, and a single-column reading experience on phones.
- Focus mode hides navigation without changing the active question. Theme preference persists locally.
- Real form controls, visible focus rings, labels, a skip link, text alternatives for chart bars, and reduced-motion support.
- No decorative imagery, autoplay, gamification badges, external font requests, or charting libraries. All charts use native HTML/CSS.

## Suggested next improvements

1. **Bank switcher and structured content editor.** Let instructors manage courses and review questions without editing JavaScript. Use a validated JSON schema and a preview step; keep executable generators as an advanced option.
2. **Explicit learning objectives and sources.** Add objectives, difficulty, authoritative references, author review status, and a content revision date. This would make drill-downs more meaningful than inferring thinking skills from titles.
3. **Longer-term learning trends.** When enough attempts exist, show rolling accuracy and review adherence with sample counts. Avoid an impressive-looking readiness percentage before evidence supports it.
4. **Accessible chart comparisons.** Add a data-table view and filters for time window or category when the history grows. The current chart bars are keyboard-operable and expose values through accessible labels.
5. **Optional account-free device sync.** A deliberate export/link or encrypted sync model could help learners move between devices. Keep the current offline mode available and make data transmission opt-in.
6. **More exam controls.** Flag questions, revisit unanswered items before submission, pause untimed sessions, and export a printable results report.

These are future options rather than hidden dependencies of the delivered app. The present framework stays small enough to read, modify, and share.
