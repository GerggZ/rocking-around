export function renderUnauthenticatedView(container, onLogin) {
  container.innerHTML = `
    <div id="login-view" class="view-state">
      <h2>Rockin' Around</h2>
      <div class="status-badge unauthenticated">Not Authenticated</div>
      <p>Log in with a streaming provider to start playing:</p>
      <button id="login-spotify-btn" class="action-btn">Log in with Spotify</button>
    </div>
  `;

  document.getElementById('login-spotify-btn')?.addEventListener('click', onLogin);
}