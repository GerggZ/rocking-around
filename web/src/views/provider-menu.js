import { providerIcon } from '../icons.js';
import { showDialogFrom } from './dialog-motion.js';
import { APP_VERSION } from '../version.js';

// These logos are already a circle, so they become the button themselves
// instead of sitting inside a second green circle.
const CIRCLE_LOGOS = new Set(['spotify', 'itunes']);

const providerInfo = {
  spotify: { name: 'Spotify', label: 'Spotify · Full tracks', detail: 'Full tracks · Spotify Premium required' },
  tidal: { name: 'TIDAL', label: 'TIDAL · 30s previews', detail: '30-second previews · TIDAL account required' },
  itunes: { name: 'iTunes', label: 'iTunes · 30s previews', detail: '30-second previews courtesy of iTunes · No account needed' }
};

function providerSection(name, provider, { connected, requiresLogin }) {
  const info = providerInfo[name];
  const selected = provider === name;
  return `
      <section class="provider-option" aria-labelledby="${name}-option-title">
        <h3 id="${name}-option-title"><span class="provider-brand-icon">${providerIcon(name)}</span>${info.name}</h3>
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
    <button id="provider-menu-btn" class="provider-control${CIRCLE_LOGOS.has(provider) ? ' provider-control--logo' : ''}" type="button"
            aria-haspopup="dialog" aria-controls="provider-dialog"
            aria-label="Music provider · ${label}" title="${label}">
      ${providerIcon(provider)}
    </button>
    <dialog id="provider-dialog" class="provider-dialog" aria-labelledby="provider-title">
      <div class="provider-dialog-heading">
        <h2 id="provider-title">Play with…</h2>
        <button id="provider-close" class="provider-close" type="button" aria-label="Close music provider options" autofocus>×</button>
      </div>
      ${Object.keys(providerInfo).filter(name => accounts[name]).map(name => providerSection(name, provider, accounts[name])).join('')}
      <p id="provider-error" role="status"></p>
      <p class="app-version">Version: ${APP_VERSION}</p>
    </dialog>
  `;

  const trigger = mount.querySelector('#provider-menu-btn');
  const dialog = mount.querySelector('#provider-dialog');
  const close = () => dialog.close();
  const open = () => {
    if (!dialog.open) showDialogFrom(dialog, trigger);
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
