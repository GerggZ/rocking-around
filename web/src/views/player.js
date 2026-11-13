import { playerMarkup, resetPlayerProgress } from './player-visual.js';
import { REVEAL_STYLE } from '../config.js';

// The track info, in either style (see REVEAL_STYLE in config.js). Both keep
// the same ids, so main.js fills them in and opens them the same way.
const answerMarkup = () => REVEAL_STYLE === 'insert' ? `
      <div id="answer-slot" class="answer-slot answer-slot--insert">
        <div id="answer-reveal" class="answer-reveal" inert>
          <div class="insert-clip">
            <div id="answer-box" class="insert-card">
              <span id="track-title" class="insert-title"></span>
              <div class="insert-row">
                <span id="track-artist"></span>
                <span id="track-year" class="insert-year"></span>
              </div>
              <span id="track-album"></span>
            </div>
          </div>
        </div>
      </div>` : `
      <div id="answer-slot" class="answer-slot">
        <div id="answer-reveal" class="answer-reveal" inert>
          <div id="answer-box" class="answer-card">
            <h4 id="track-title"></h4>
            <p id="track-artist"></p>
            <p id="track-album"></p>
            <div id="track-year" class="year-badge"></div>
          </div>
        </div>
      </div>`;

export function renderPlayerView(container, trackData, { onNext, onBack }) {
  container.innerHTML = `
    <div id="game-view" class="view-state">
      ${playerMarkup()}

      <button id="reveal-btn" class="action-btn" aria-expanded="false" aria-controls="answer-reveal">Reveal Track Info</button>

      <p id="status-msg" class="status-msg" role="status"></p>

      ${answerMarkup()}
    </div>
  `;

  resetPlayerProgress();

  for (const field of ['title', 'artist', 'album', 'year']) {
    container.querySelector(`#track-${field}`).textContent = trackData[field];
  }

  // Render Outer Back Button Below
  const externalSection = document.getElementById('external-content');
  if (externalSection) {
    externalSection.innerHTML = `
      <button id="next-random-card" class="action-btn" type="button" ${onNext ? '' : 'disabled'}>Random Card</button>
      <button id="back-home-btn" class="outer-back-btn">← Back to Menu</button>
    `;
    const nextButton = externalSection.querySelector('#next-random-card');
    nextButton.addEventListener('click', async () => {
      if (!onNext) return;
      nextButton.disabled = true;
      try {
        await onNext();
      } finally {
        nextButton.disabled = false;
      }
    });
    document.getElementById('back-home-btn')?.addEventListener('click', () => onBack());
  }
}