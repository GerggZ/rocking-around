const providerIcons = {
  spotify: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="currentColor"/>
      <g fill="none" stroke="var(--provider-icon-paper)" stroke-linecap="round">
        <path d="M5.5 9c4.4-1.4 8.7-1 13 1" stroke-width="1.9"/>
        <path d="M6.4 12.4c3.7-1.1 7.2-.7 10.8.9" stroke-width="1.7"/>
        <path d="M7.3 15.6c3-.8 5.8-.5 8.7.8" stroke-width="1.5"/>
      </g>
    </svg>`,
  tidal: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="m4.5 4 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4ZM12 12l4 4-4 4-4-4Z"/>
    </svg>`,
  apple: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="currentColor"/>
      <path d="M10 16.2a2 2 0 1 1-1.3-1.87V7.6l7-1.4v8.1a2 2 0 1 1-1.3-1.87V8.3L10 9.2Z" fill="var(--provider-icon-paper)"/>
    </svg>`,
  none: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M9 18.5a3 3 0 1 1-2-2.83V5l12-2v12.5a3 3 0 1 1-2-2.83V6.4L9 7.9Z"/>
    </svg>`
};

const providerInfo = {
  spotify: { name: 'Spotify', label: 'Spotify · Full tracks', detail: 'Full tracks · Spotify Premium required' },
  tidal: { name: 'TIDAL', label: 'TIDAL · 30s previews', detail: '30-second previews · TIDAL account required' },
  apple: { name: 'Apple Music', label: 'Apple Music · 30s previews', detail: '30-second previews courtesy of iTunes · No account needed' }
};

function providerSection(name, provider, { connected, requiresLogin }) {
  const info = providerInfo[name];
  const selected = provider === name;
  return `
      <section class="provider-option" aria-labelledby="${name}-option-title">
        <h3 id="${name}-option-title"><span class="provider-brand-icon">${providerIcons[name]}</span>${info.name}</h3>
        <p>${info.detail}</p>
        <button data-select="${name}" class="action-btn" type="button"
                aria-pressed="${selected}">${selected ? 'Selected' : connected ? `Use ${info.name}` : `Connect ${info.name}`}</button>
        ${connected && requiresLogin ? `<button data-disconnect="${name}" class="provider-switch" type="button">Disconnect ${info.name}</button>` : ''}
      </section>`;
}

export function renderProviderMenu({ provider, accounts, onSelect, onDisconnect }) {
  const mount = document.getElementById('provider-controls');
  const label = providerInfo[provider]?.label ?? 'Choose a music provider';

  mount.innerHTML = `
    <button id="provider-menu-btn" class="provider-control" type="button"
            aria-haspopup="dialog" aria-controls="provider-dialog"
            aria-label="Music provider · ${label}" title="${label}">
      ${providerIcons[provider] ?? providerIcons.none}
    </button>
    <dialog id="provider-dialog" class="provider-dialog" aria-labelledby="provider-title">
      <div class="provider-dialog-heading">
        <h2 id="provider-title">Music provider</h2>
        <button id="provider-close" class="provider-close" type="button" aria-label="Close music provider options" autofocus>×</button>
      </div>
      ${Object.keys(providerInfo).map(name => providerSection(name, provider, accounts[name])).join('')}
      <p id="provider-error" role="status"></p>
    </dialog>
  `;

  const trigger = mount.querySelector('#provider-menu-btn');
  const dialog = mount.querySelector('#provider-dialog');
  const close = () => dialog.close();
  const open = () => {
    if (!dialog.open) dialog.showModal();
  };
  trigger.addEventListener('click', open);
  mount.querySelector('#provider-close').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    )) close();
  });
  dialog.addEventListener('close', () => trigger.focus());

  async function select(nextProvider) {
    if (nextProvider === provider) {
      close();
      return;
    }
    const buttons = dialog.querySelectorAll('button');
    buttons.forEach(button => { button.disabled = true; });
    const error = mount.querySelector('#provider-error');
    error.textContent = '';
    try {
      await onSelect(nextProvider);
    } catch {
      error.textContent = 'Could not connect. Please try again.';
    } finally {
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  for (const button of mount.querySelectorAll('[data-select]')) {
    button.addEventListener('click', () => select(button.dataset.select));
  }
  for (const button of mount.querySelectorAll('[data-disconnect]')) {
    button.addEventListener('click', () => onDisconnect(button.dataset.disconnect));
  }
  return open;
}
