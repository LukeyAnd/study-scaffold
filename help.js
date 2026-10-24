/* Shared, keyboard-accessible help for the app and the download page. */
(function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 10.5v6"/><circle class="info-dot" cx="12" cy="7.5" r=".8"/></svg>';
  const paths = {
    overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    play:'<path d="m8 5 11 7-11 7Z"/>',
    chart:'<path d="M4 3v17h17M8 15v-4m5 4V6m5 9v-7"/>',
    sliders:'<path d="M4 7h5m5 0h6M4 17h10m5 0h1"/><circle cx="11.5" cy="7" r="2.5"/><circle cx="16.5" cy="17" r="2.5"/>',
    book:'<path d="M12 5v15M3 4c4-1 6-1 9 1 3-2 5-2 9-1v15c-4-1-6-1-9 1-3-2-5-2-9-1Z"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    right:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
    focus:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    moon:'<path d="M20 14.5A9 9 0 0 1 9.5 4 9 9 0 1 0 20 14.5Z"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
    history:'<path d="M3 11a9 9 0 1 1 2 7M3 5v6h6m3-4v5l3 2"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    reset:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>'
  };
  function symbol(name) { return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.book}</svg>`; }
  const bullets = value => (Array.isArray(value) ? value : String(value).replace(/\b(?:[A-Z]\.){2,}/g, abbreviation => abbreviation.replace(/\./g,'\uE000')).split(/\n+|(?<=[.!?])\s+(?=[A-Z])|;\s+/)).map(x => String(x).replace(/\uE000/g,'.').trim()).filter(Boolean);
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
    document.querySelectorAll('.utility-menu[open]').forEach(menu => {
      if (!menu.contains(event.target) || event.target.closest('.menu-panel button, .menu-panel a')) menu.open = false;
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || document.querySelector('.help-dialog[open]')) return;
    document.querySelectorAll('.utility-menu[open]').forEach(menu => { menu.open = false; menu.querySelector('summary').focus(); event.preventDefault(); });
  });
  globalThis.SoSHelp = {button, enhance, icon:symbol};
  document.querySelectorAll('[data-icon]').forEach(node => { node.innerHTML = symbol(node.dataset.icon); });
  document.querySelectorAll('[data-help-auto]').forEach(enhance);
})();
