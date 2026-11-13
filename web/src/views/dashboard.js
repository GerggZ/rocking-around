import { decks, getTrackById, getDeck, getPlaylistDecks, addPlaylistDeck, removePlaylistDeck } from '../tracks.js';
import { getPlayableCardIds, pickRandomCard } from '../random-cards.js';
import { ICONS } from '../icons.js';
import { showDialogFrom, closeDialog } from './dialog-motion.js';
import * as spotify from '../providers/spotify.js';

const PROVIDER_NAMES = { spotify: 'Spotify', tidal: 'TIDAL', itunes: 'iTunes' };

const escapeHtml = text => String(text ?? '').replace(/[&<>"']/g, char => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
));

const songCount = count => `${count} song${count === 1 ? '' : 's'}`;

export function renderDashboardView(container, providerName, options, notice = '') {
  const { onOpenCard, onChooseProvider } = options;
  const rerender = message => renderDashboardView(container, providerName, options, message);

  // Render Card Content
  container.innerHTML = `
    <div id="dashboard-view" class="view-state">
      <h2>Rockin' Around</h2>
    </div>
  `;

  // Render Deck Controls Below Mountain Card
  const trackSection = document.getElementById('external-content');
  if (!trackSection) return;

  const playlists = getPlaylistDecks();
  const deckChoices = [...playlists, ...decks];

  trackSection.innerHTML = `
    <div class="external-section dashboard-controls">
      <form class="card-lookup" id="card-lookup">
        <label class="section-title" for="card-lookup-id">Card Code</label>
        <div class="card-lookup-controls">
          <input id="card-lookup-id" type="text"
                 autocomplete="off" autocapitalize="none" spellcheck="false"
                 aria-describedby="card-lookup-status">
          <button class="action-btn" type="submit">Open Card</button>
        </div>
        <p id="card-lookup-status" role="status"></p>
      </form>
      <h3 id="deck-picker-title" class="section-title">Select Decks</h3>
      <div class="deck-row">
        <details class="deck-picker">
          <summary aria-labelledby="deck-picker-title deck-selection">
            <span id="deck-selection"></span>
          </summary>
          <ul class="deck-options" aria-labelledby="deck-picker-title">
            ${deckChoices.map(deck => `
              <li><button type="button" data-deck-id="${deck.id}"${deck === playlists.at(-1) ? ' class="deck-option--playlist"' : ''}>
                <span class="deck-option-name">${escapeHtml(deck.name)}</span>
                ${deck.playlist ? `<span class="deck-option-meta">Playlist · ${songCount(deck.tracks.length)}</span>` : ''}
              </button></li>`).join('')}
          </ul>
        </details>
        <button id="playlist-add-btn" class="playlist-add-btn${playlists.length ? ' has-playlist' : ''}" type="button"
                aria-haspopup="dialog" aria-controls="playlist-dialog"
                aria-label="${playlists.length ? 'Your playlists' : 'Add a Spotify playlist'}"
                title="${playlists.length ? 'Your playlists' : 'Add a Spotify playlist'}">${ICONS.playlistAdd}</button>
      </div>
      <button id="random-card" class="action-btn" type="button">Random Card</button>
      <p id="deck-status" role="status"></p>
    </div>
    ${playlistDialogMarkup(playlists)}
  `;

  setupCardLookup(trackSection, onOpenCard);

  // --- DECK PICKER (pick one or more decks to play together) ---
  const picker = trackSection.querySelector('.deck-picker');
  const summary = picker.querySelector('summary');
  const selection = picker.querySelector('#deck-selection');
  const optionButtons = picker.querySelectorAll('[data-deck-id]');
  const playButton = trackSection.querySelector('#random-card');
  const status = trackSection.querySelector('#deck-status');

  const saved = getDeck(sessionStorage.getItem('selected_deck'));
  let selectedIds = saved ? (saved.parts ?? [saved]).map(deck => deck.id) : [decks[0].id];
  let selectedDeck;
  let playableIds = [];

  function updateDeck(message = '') {
    const ordered = deckChoices.filter(deck => selectedIds.includes(deck.id));
    selectedIds = ordered.map(deck => deck.id);
    selectedDeck = getDeck(selectedIds.join('+'));
    sessionStorage.setItem('selected_deck', selectedDeck.id);

    selection.textContent = ordered.length <= 2
      ? ordered.map(deck => deck.name).join(' + ')
      : `${ordered[0].name} + ${ordered.length - 1} more`;
    for (const option of optionButtons) {
      option.setAttribute('aria-pressed', String(selectedIds.includes(option.dataset.deckId)));
    }

    playableIds = getPlayableCardIds(selectedDeck, providerName);
    playButton.disabled = playableIds.length === 0;
    if (playButton.disabled) {
      const onlyPlaylists = selectedDeck && (selectedDeck.parts ?? [selectedDeck]).every(deck => deck.playlist);
      status.textContent = onlyPlaylists && providerName !== 'spotify'
        ? 'Playlist songs play with Spotify. Switch to Spotify to play them.'
        : `${selectedIds.length > 1 ? 'These decks have' : 'This deck has'} no ${PROVIDER_NAMES[providerName] ? `${PROVIDER_NAMES[providerName]} ` : ''}track IDs yet.`;
    } else {
      status.textContent = message;
    }
  }

  playButton.addEventListener('click', () => {
    if (playButton.disabled) return;
    onOpenCard(pickRandomCard(playableIds), selectedDeck);
  });

  function closePicker() {
    picker.open = false;
    summary.focus();
  }

  // Tapping a deck adds it to or removes it from the mix. The list stays open
  // so several can be picked; at least one deck always stays selected.
  for (const option of optionButtons) {
    option.addEventListener('click', () => {
      const id = option.dataset.deckId;
      if (selectedIds.includes(id)) {
        if (selectedIds.length === 1) return;
        selectedIds = selectedIds.filter(selected => selected !== id);
      } else {
        selectedIds = [...selectedIds, id];
      }
      updateDeck();
    });
  }

  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape' && picker.open) {
      event.preventDefault();
      closePicker();
    }
  });
  picker.addEventListener('focusout', event => {
    if (!picker.contains(event.relatedTarget)) picker.open = false;
  });
  document.addEventListener('pointerdown', function closeOutside(event) {
    if (!picker.isConnected) {
      document.removeEventListener('pointerdown', closeOutside);
      return;
    }
    if (picker.open && !picker.contains(event.target)) picker.open = false;
  });

  updateDeck(notice);

  // --- ADD PLAYLIST DIALOG ---
  setupPlaylistDialog(trackSection, {
    onAdded(deck, skipped) {
      // Start out playing just the new playlist; other decks can be added to the mix.
      sessionStorage.setItem('selected_deck', deck.id);
      const extra = skipped ? ` (${skipped} podcast${skipped === 1 ? '' : 's'} or local file${skipped === 1 ? '' : 's'} skipped)` : '';
      rerender(`Added “${deck.name}” · ${songCount(deck.tracks.length)}${extra}. Add more decks above to mix them in.`);
    },
    onRemoved(deckId, name) {
      const remaining = selectedIds.filter(id => id !== deckId);
      sessionStorage.setItem('selected_deck', (remaining.length ? remaining : [decks[0].id]).join('+'));
      rerender(`Removed “${name}”.`);
    },
    onChooseProvider
  });
}

function setupCardLookup(trackSection, onOpenCard) {
  const lookup = trackSection.querySelector('#card-lookup');
  const lookupInput = lookup.querySelector('#card-lookup-id');
  const lookupStatus = lookup.querySelector('#card-lookup-status');

  lookupInput.addEventListener('input', () => {
    lookupStatus.textContent = '';
    lookupInput.removeAttribute('aria-invalid');
  });

  lookup.addEventListener('submit', event => {
    event.preventDefault();
    const id = lookupInput.value.trim();
    const track = getTrackById(id) ?? getTrackById(id.toLowerCase());
    if (!track) {
      lookupStatus.textContent = id ? 'No card found for that code.' : 'Enter a card code.';
      lookupInput.setAttribute('aria-invalid', 'true');
      lookupInput.focus();
      return;
    }

    onOpenCard(track.UniqueID);
  });
}

function playlistDialogMarkup(playlists) {
  const connected = spotify.hasSession();
  return `
    <dialog id="playlist-dialog" class="provider-dialog playlist-dialog" aria-labelledby="playlist-title">
      <div class="provider-dialog-heading">
        <h2 id="playlist-title">${playlists.length ? 'Your playlists' : 'Add a playlist'}</h2>
        <button id="playlist-close" class="provider-close" type="button" aria-label="Close playlist options" autofocus>×</button>
      </div>
      ${playlists.length ? `
      <ul class="playlist-list">
        ${playlists.map(deck => `
        <li class="playlist-current">
          <span class="playlist-current-icon">${ICONS.playlistAdd}</span>
          <div>
            <strong>${escapeHtml(deck.name)}</strong>
            <span>${songCount(deck.tracks.length)}</span>
          </div>
          <button class="provider-switch" type="button" data-remove-playlist="${deck.id}"
                  aria-label="Remove ${escapeHtml(deck.name)}">Remove</button>
        </li>`).join('')}
      </ul>` : ''}
      <p class="playlist-intro">${playlists.length
        ? 'Paste another Spotify playlist link to add it as a deck.'
        : 'Paste a Spotify playlist link to turn it into a deck. It stays on this device until you remove it.'}</p>
      ${connected ? `
      <form id="playlist-form" class="card-lookup playlist-form" novalidate>
        <div class="card-lookup-controls">
          <input id="playlist-link" type="url" inputmode="url"
                 placeholder="open.spotify.com/playlist/…" aria-label="Spotify playlist link"
                 autocomplete="off" autocapitalize="none" spellcheck="false"
                 aria-describedby="playlist-status">
          <button class="action-btn" type="submit">Add</button>
        </div>
      </form>` : `
      <button id="playlist-connect" class="action-btn playlist-connect" type="button">Connect Spotify</button>`}
      <p id="playlist-status" class="playlist-status" role="status"></p>
      <p class="playlist-hint">${connected
        ? 'Your own playlists always work. If Spotify won’t share someone else’s, save a copy in Spotify first (••• → Add to other playlist → New playlist) and paste that link.'
        : 'Reading a playlist needs a Spotify sign-in, and its songs play with Spotify.'}</p>
    </dialog>`;
}

function setupPlaylistDialog(trackSection, { onAdded, onRemoved, onChooseProvider }) {
  const trigger = trackSection.querySelector('#playlist-add-btn');
  const dialog = trackSection.querySelector('#playlist-dialog');
  const status = dialog.querySelector('#playlist-status');
  const close = () => dialog.close();

  trigger.addEventListener('click', () => {
    if (!dialog.open) showDialogFrom(dialog, trigger);
  });
  dialog.querySelector('#playlist-close').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    )) close();
  });
  dialog.addEventListener('close', () => { if (trigger.isConnected) trigger.focus(); });

  dialog.querySelector('#playlist-connect')?.addEventListener('click', async () => {
    await closeDialog(dialog);
    onChooseProvider?.();
  });

  for (const button of dialog.querySelectorAll('[data-remove-playlist]')) {
    button.addEventListener('click', async () => {
      const deckId = button.dataset.removePlaylist;
      const name = getDeck(deckId)?.name ?? 'playlist';
      removePlaylistDeck(deckId);
      await closeDialog(dialog);
      onRemoved(deckId, name);
    });
  }

  const form = dialog.querySelector('#playlist-form');
  if (!form) return;
  const input = form.querySelector('#playlist-link');
  const submit = form.querySelector('button[type="submit"]');

  input.addEventListener('input', () => {
    status.textContent = '';
    input.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!input.value.trim()) {
      status.textContent = 'Paste a Spotify playlist link.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    submit.disabled = true;
    input.disabled = true;
    status.textContent = 'Loading playlist…';
    try {
      const result = await spotify.fetchPlaylist(input.value);
      let deck;
      try {
        deck = addPlaylistDeck({ id: result.id, name: result.name, tracks: result.tracks });
      } catch {
        throw new Error('This device is out of space for more playlists. Remove one and try again.');
      }
      await closeDialog(dialog);
      onAdded(deck, result.skipped);
    } catch (error) {
      status.textContent = error?.message || 'Could not load that playlist. Please try again.';
      input.setAttribute('aria-invalid', 'true');
      if (error?.code === 'signin') {
        form.replaceWith(Object.assign(document.createElement('button'), {
          type: 'button', className: 'action-btn playlist-connect', textContent: 'Connect Spotify',
          onclick: async () => { await closeDialog(dialog); onChooseProvider?.(); }
        }));
      }
    } finally {
      submit.disabled = false;
      input.disabled = false;
    }
  });
}
