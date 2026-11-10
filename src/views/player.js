export function renderPlayerView(container, trackData, onNextRandomCard, providerName, onChangeProvider) {
  container.innerHTML = `
    <div id="game-view" class="view-state">
      <div class="status-badge authenticated">${providerName === 'tidal' ? 'TIDAL · 30-second preview' : 'Spotify · Full track'}</div>
      <p id="status-msg"  class="status-msg"></p>

      <div class="player-wrapper">
        <svg class="progress-ring" width="110" height="110" viewBox="0 0 110 110">
          <circle stroke="rgba(0, 0, 0, 0.08)" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
          <circle id="progress-fill" class="progress-ring__fill" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
          <circle id="progress-dot" class="progress-ring__dot" r="4" cx="55" cy="8"/>
        </svg>

        <button id="play-pause-btn" class="play-btn" disabled>▶</button>
      </div>

      <button id="reveal-btn" class="action-btn">Reveal Track Info</button>

      <div class="answer-slot">
        <div id="answer-box" class="answer-card hidden">
          <h4 id="track-title"></h4>
          <p id="track-artist"></p>
          <p id="track-album" style="color: var(--text-subtle); font-size: 0.78rem;"></p>
          <div id="track-year" class="year-badge"></div>
        </div>
      </div>
    </div>
  `;

  for (const field of ['title', 'artist', 'album', 'year']) {
    container.querySelector(`#track-${field}`).textContent = trackData[field];
  }

  // Render Outer Back Button Below
  const externalSection = document.getElementById('external-content');
  if (externalSection) {
    externalSection.innerHTML = `
      ${onNextRandomCard ? '<button id="next-random-card" class="action-btn" type="button">Next Random Card</button>' : ''}
      <button id="change-provider-btn" class="provider-switch" type="button">Change provider</button>
      <button id="back-home-btn" class="outer-back-btn">← Back to Menu</button>
    `;
    externalSection.querySelector('#change-provider-btn').addEventListener('click', onChangeProvider);
    const nextButton = externalSection.querySelector('#next-random-card');
    nextButton?.addEventListener('click', async () => {
      nextButton.disabled = true;
      try {
        await onNextRandomCard();
      } finally {
        nextButton.disabled = false;
      }
    });
    document.getElementById('back-home-btn')?.addEventListener('click', () => {
      window.location.href = import.meta.env.BASE_URL;
    });
  }
}