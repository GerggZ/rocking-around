export function renderPlayerView(container, trackData) {
  container.innerHTML = `
    <div id="game-view" class="view-state">
      <p id="status-msg" class="status-msg"></p>

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
          <h4>${trackData.title}</h4>
          <p>${trackData.artist}</p>
          <p style="color: var(--text-subtle); font-size: 0.78rem;">${trackData.album}</p>
          <div class="year-badge">${trackData.year}</div>
        </div>
      </div>
    </div>
  `;

  // Render Outer Back Button Below
  const externalSection = document.getElementById('external-content');
  if (externalSection) {
    externalSection.innerHTML = `
      <button id="back-home-btn" class="outer-back-btn">← Back to Menu</button>
    `;
    document.getElementById('back-home-btn')?.addEventListener('click', () => {
      window.location.href = '/';
    });
  }
}