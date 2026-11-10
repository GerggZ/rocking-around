import { decks } from '../tracks.js';

export function renderDashboardView(container, providerName) {
  // Render Card Content
  container.innerHTML = `
    <div id="dashboard-view" class="view-state">
      <h2>Rockin' Around</h2>
      <div class="status-badge authenticated">CONNECTED (${providerName.toUpperCase()})</div>
      <p class="dashboard-hint">Pick a card below to launch a track!</p>
    </div>
  `;

  // Render Card Grid Below Mountain Card
  const trackSection = document.getElementById('external-content');
  if (!trackSection) return;

  trackSection.innerHTML = `
    <div class="external-section">
      <label class="section-title" for="deck-select">Select Deck</label>
      <select id="deck-select">
        ${decks.map(deck => `<option value="${deck.id}">${deck.name}</option>`).join('')}
      </select>
      <h3 class="section-title">Select Card</h3>
      <div class="track-grid"></div>
    </div>
  `;

  const select = trackSection.querySelector('#deck-select');
  const grid = trackSection.querySelector('.track-grid');
  const savedDeck = sessionStorage.getItem('selected_deck');
  select.value = decks.find(deck => deck.id === savedDeck)?.id ?? decks[0].id;

  function renderCards() {
    const { tracks } = decks.find(deck => deck.id === select.value);
    grid.replaceChildren(...tracks.map(track => {
      const link = document.createElement('a');
      link.href = `?song=${encodeURIComponent(track.UniqueID)}`;
      link.className = 'track-link';
      link.textContent = `Card #${track.id.padStart(2, '0')}`;
      return link;
    }));
  }

  select.addEventListener('change', () => {
    sessionStorage.setItem('selected_deck', select.value);
    renderCards();
  });
  renderCards();
}