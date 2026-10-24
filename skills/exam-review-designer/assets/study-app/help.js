/* Shared, keyboard-accessible help for the app and the download page. */
(function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 10.5v6"/><circle class="info-dot" cx="12" cy="7.5" r=".8"/></svg>';
  const bullets = value => (Array.isArray(value) ? value : String(value).split(/\n+|(?<=[.!?])\s+(?=[A-Z])|;\s+/)).map(x => String(x).trim()).filter(Boolean);
  function button(label, items) {
    return `<button type="button" class="info-button" aria-label="About ${escape(label)}" aria-haspopup="dialog" data-help-title="${escape(label)}" data-help-items="${escape(JSON.stringify(bullets(items)))}">${icon}</button>`;
  }
  function attach(heading, items) {
    if (!heading) return;
    let row = heading.parentElement;
    if (!row.classList.contains('heading-line')) {
      row = document.createElement('div'); row.className = 'heading-line';
      heading.before(row); row.append(heading);
    }
    const trigger = row.querySelector(':scope > .info-button');
    if (trigger) {
      const existing = JSON.parse(trigger.dataset.helpItems);
      trigger.dataset.helpItems = JSON.stringify([...new Set([...existing, ...bullets(items)])]);
    } else row.insertAdjacentHTML('beforeend', button(heading.textContent.trim(), items));
  }
  function enhance(root) {
    // Only interface hints: question content, answer feedback, and live errors stay visible.
    const selectors = '.page-heading > div > p, .card-heading p, .recommendation > p, .card > p.muted, .note, [data-help]';
    [...root.querySelectorAll(selectors)].forEach(node => {
      if (!root.contains(node) || node.getAttribute('role') === 'alert' || node.closest('#plan-summary, .feedback, #data-status')) return;
      const container = node.closest('.page-heading, .card, section, article, aside') || node.parentElement;
      const heading = container.querySelector('h1, h2, h3');
      if (!heading) return;
      attach(heading, node.dataset.helpItems ? JSON.parse(node.dataset.helpItems) : node.textContent);
      node.remove();
    });
  }
  let dialog;
  function open(trigger) {
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.className = 'help-dialog';
      dialog.setAttribute('aria-labelledby', 'help-title');
      dialog.innerHTML = '<div class="help-dialog-heading"><h2 id="help-title"></h2><button type="button" class="help-close" aria-label="Close explanation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><ul class="help-bullets"></ul>';
      document.body.append(dialog);
      dialog.querySelector('.help-close').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      });
    }
    dialog.querySelector('h2').textContent = trigger.dataset.helpTitle;
    const list = dialog.querySelector('ul'); list.replaceChildren();
    bullets(JSON.parse(trigger.dataset.helpItems)).forEach(text => { const item = document.createElement('li'); item.textContent = text; list.append(item); });
    dialog.showModal();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('button[data-help-items]');
    if (trigger) { event.preventDefault(); open(trigger); }
  });
  globalThis.SoSHelp = {button, enhance};
  document.querySelectorAll('[data-help-auto]').forEach(enhance);
})();
