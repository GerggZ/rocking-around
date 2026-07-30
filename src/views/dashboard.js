import { TRACK_DATABASE } from '../tracks.js';

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
      <h3 class="section-title">Select Card</h3>
      <div class="track-grid">
        ${Object.keys(TRACK_DATABASE).map(songNum => {
          const formattedNum = String(songNum).padStart(2, '0');
          return `<a href="/?song=${songNum}" class="track-link">Card #${formattedNum}</a>`;
        }).join('')}
      </div>
    </div>
  `;
}