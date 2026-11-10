export function renderUnauthenticatedView(container, onLogin) {
  container.innerHTML = `
    <div id="login-view" class="view-state">
      <h1>Rockin' Around</h1>
      <p>Play a song. Guess the year.</p>
      <button id="login-spotify-btn" class="action-btn">Connect Spotify</button>
    </div>
  `;

  document.getElementById('login-spotify-btn')?.addEventListener('click', onLogin);
}