export function renderUnauthenticatedView(container, onLogin) {
  container.innerHTML = `
    <div id="login-view" class="view-state">
      <h2>Rockin' Around</h2>
      <div class="status-badge unauthenticated">Choose your music</div>
      <p>Spotify full tracks or TIDAL previews:</p>
      <button id="login-spotify-btn" class="action-btn">Log in with Spotify</button>
      <button id="tidal-preview-btn" class="action-btn">Use TIDAL previews · 30s</button>
    </div>
  `;

  document.getElementById('login-spotify-btn')?.addEventListener('click', () => onLogin('spotify'));
  document.getElementById('tidal-preview-btn')?.addEventListener('click', () => onLogin('tidal'));
}