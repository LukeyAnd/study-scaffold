# Optional WordPress / Elementor handoff

Use this route only when the requested destination is the Elementor WordPress builder. For a handoff to another AI agent, start at [AGENTS.md](AGENTS.md) and [AGENT_GUIDE.md](AGENT_GUIDE.md). This is an integration runbook; no WordPress site was connected or modified to create it.

## 1. Establish the destination

Reuse the user's existing context. Resolve only missing site/staging URL, app-host URL, available access, and whether they want an embedded standalone app or a native WordPress feature. A native shortcode/plugin, WordPress accounts, server-side grades, or cloud sync is a separate implementation; this project currently supplies static HTML, CSS, and JavaScript. Its ZIP is not an Elementor template kit or WordPress plugin.

## 2. Read the right files first

Read [STORAGE.md](STORAGE.md) for origin-specific progress and backup behavior, then [index.html](index.html) for the app's runtime assets and relative paths. Keep the bank and runtime files together. Read [DESIGN.md](DESIGN.md) if changing the surrounding presentation. Inspect `app.js`/`storage.js` only if the integration requires actual behavior changes.

## 3. Prepare a reviewable integration

For the current standalone app, the preferred starting design is a separately hosted app embedded in an HTML widget, with a direct **Open SoS!** link. This is a project recommendation: an iframe keeps the app's page styles, hash navigation, and script scope separate from WordPress. Do not paste the full document from `index.html` inside an existing WordPress document or inline all runtime files without a reason.

Elementor's HTML widget accepts markup and scripts; access and site configuration still matter. Add a widget on the agreed staging page, embed the agreed HTTPS app URL using a titled iframe with responsive width and enough height for readable content, and keep the direct link available. Use the supplied public app only when that is the intended bank; a private generated review needs an appropriate authorized host. [Elementor HTML widget](https://elementor.com/help/HTML-widget/), [iframe reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).

## 4. Test the published-page preview

- Confirm the correct bank and all assets load; exercise navigation, a question, results, and keyboard focus.
- Check narrow screens, scrolling, light/dark presentation, and the direct app link. The editor preview alone is not acceptance evidence.
- Reload an unfinished session; test a backup download and import. Browser policies can restrict or partition storage in embedded contexts. Do not promise the embedded and top-level app share progress; verify the actual target browser. Keep the direct-link and JSON-transfer fallback. [Browser storage boundaries](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- If framing, scripts, downloads, or storage are blocked, inspect the site's relevant headers, permission policies, and editor sanitization. Report the concrete restriction; do not disable protections indiscriminately.

## 5. Deliver and maintain

Use the user's existing authorization and the target site's normal staging/publication process. Record the app URL/origin, source version, page/widget location, tested browsers, storage result, and any unresolved limits. Back up progress before moving to another origin. Revisit this runbook when Elementor, WordPress, hosting policies, or the app's routing/storage changes. Official platform references were checked October 24, 2026; verify them again during an actual integration.
