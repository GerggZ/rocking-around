import { decks, getTrackById } from '../tracks.js';
import { getPlayableCardIds, openRandomCard } from '../random-cards.js';

export function renderDashboardView(container, providerName) {
  // Render Card Content
  container.innerHTML = `
    <div id="dashboard-view" class="view-state">
      <h2>Rockin' Around</h2>
      <div class="status-badge authenticated">CONNECTED (${providerName.toUpperCase()})</div>
      <p class="dashboard-hint">Choose a deck and draw a random card.</p>
    </div>
  `;

  // Render Deck Controls Below Mountain Card
  const trackSection = document.getElementById('external-content');
  if (!trackSection) return;

  trackSection.innerHTML = `
    <div class="external-section">
      <h3 id="deck-picker-title" class="section-title">Select Deck</h3>
      <details class="deck-picker">
        <summary aria-labelledby="deck-picker-title deck-selection">
          <span id="deck-selection"></span>
        </summary>
        <ul class="deck-options" aria-labelledby="deck-picker-title">
          ${decks.map(deck => `<li><button type="button" data-deck-id="${deck.id}">${deck.name}</button></li>`).join('')}
        </ul>
      </details>
      <button id="random-card" class="action-btn" type="button">Play Random Card</button>
      <p id="deck-status" role="status"></p>
      <form class="card-lookup" id="card-lookup">
        <label class="section-title" for="card-lookup-id">Find Card by ID</label>
        <div class="card-lookup-controls">
          <input id="card-lookup-id" type="text" placeholder="Paste a UniqueID"
                 autocomplete="off" autocapitalize="none" spellcheck="false"
                 aria-describedby="card-lookup-status">
          <button class="action-btn" type="submit">Open Card</button>
        </div>
        <p id="card-lookup-status" role="status"></p>
      </form>
    </div>
  `;

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
      lookupStatus.textContent = id ? 'No card found for that ID.' : 'Enter a card ID.';
      lookupInput.setAttribute('aria-invalid', 'true');
      lookupInput.focus();
      return;
    }

    window.location.href = '?' + new URLSearchParams({ song: track.UniqueID });
  });

  const picker = trackSection.querySelector('.deck-picker');
  const summary = picker.querySelector('summary');
  const selection = picker.querySelector('#deck-selection');
  const options = picker.querySelectorAll('[data-deck-id]');
  const playButton = trackSection.querySelector('#random-card');
  const status = trackSection.querySelector('#deck-status');
  const savedDeck = sessionStorage.getItem('selected_deck');
  let selectedDeck;
  let playableIds = [];

  function updateDeck(deck) {
    selectedDeck = deck;
    selection.textContent = deck.name;
    for (const option of options) {
      option.setAttribute('aria-pressed', String(option.dataset.deckId === deck.id));
    }

    playableIds = getPlayableCardIds(deck, providerName);
    playButton.disabled = playableIds.length === 0;
    status.textContent = playButton.disabled ? 'This deck has no playable cards.' : '';
  }

  playButton.addEventListener('click', () => {
    if (playButton.disabled) return;
    openRandomCard(selectedDeck, playableIds);
  });

  function closePicker() {
    picker.open = false;
    summary.focus();
  }

  for (const option of options) {
    option.addEventListener('click', () => {
      const deck = decks.find(deck => deck.id === option.dataset.deckId);
      sessionStorage.setItem('selected_deck', deck.id);
      updateDeck(deck);
      closePicker();
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

  updateDeck(decks.find(deck => deck.id === savedDeck) ?? decks[0]);
}