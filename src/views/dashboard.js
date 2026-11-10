import { decks, getTrackById } from '../tracks.js';

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
      <label class="section-title" for="deck-select">Select Deck</label>
      <select id="deck-select">
        ${decks.map(deck => `<option value="${deck.id}">${deck.name}</option>`).join('')}
      </select>
      <button id="random-card" class="action-btn" type="button">Play Random Card</button>
      <p id="deck-status" role="status"></p>
    </div>
  `;

  const select = trackSection.querySelector('#deck-select');
  const playButton = trackSection.querySelector('#random-card');
  const status = trackSection.querySelector('#deck-status');
  const savedDeck = sessionStorage.getItem('selected_deck');
  select.value = decks.find(deck => deck.id === savedDeck)?.id ?? decks[0].id;

  let playableIds = [];
  function updateDeck() {
    const { tracks } = decks.find(deck => deck.id === select.value);
    const recordingIds = new Set(tracks.map(track => track.UniqueID));
    playableIds = [...recordingIds].filter(id => getTrackById(id)?.[providerName]);
    playButton.disabled = playableIds.length === 0;
    status.textContent = playButton.disabled ? 'This deck has no playable cards.' : '';
  }

  playButton.addEventListener('click', () => {
    if (playButton.disabled) return;
    const id = playableIds[Math.floor(Math.random() * playableIds.length)];
    window.location.href = `?song=${encodeURIComponent(id)}`;
  });

  select.addEventListener('change', () => {
    sessionStorage.setItem('selected_deck', select.value);
    updateDeck();
  });
  updateDeck();
}