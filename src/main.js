import * as auth from './login/authenticate.js';
import { getTrackByNumber } from './tracks.js';

import { renderUnauthenticatedView } from './views/unauthenticated.js';
import { renderDashboardView } from './views/dashboard.js';
import { renderPlayerView } from './views/player.js';

const cardMount = document.getElementById('card-mount');
const externalMount = document.getElementById('external-content');

let currentTrackId = null;
let isPlaying = false;
let trackStarted = false;
let animFrameId = null;

// --- PROGRESS RING LOOP ---
function updateProgressRing(positionMs, durationMs) {
  const fill = document.getElementById('progress-fill');
  const dot = document.getElementById('progress-dot');
  if (!durationMs || durationMs === 0 || !fill || !dot) return;

  const progress = Math.min(positionMs / durationMs, 1);
  const offset = 295.3 - (progress * 295.3);
  fill.style.strokeDashoffset = offset;

  const angle = progress * 2 * Math.PI;
  dot.setAttribute('cx', (55 + 47 * Math.sin(angle)).toFixed(2));
  dot.setAttribute('cy', (55 - 47 * Math.cos(angle)).toFixed(2));
}

function startProgressLoop() {
  stopProgressLoop();
  async function loop() {
    const state = await auth.getCurrentState();
    if (state && !state.paused) {
      updateProgressRing(state.position, state.duration);
      animFrameId = requestAnimationFrame(loop);
    } else {
      stopProgressLoop();
    }
  }
  animFrameId = requestAnimationFrame(loop);
}

function stopProgressLoop() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

function handlePlayerStateChange(state) {
  if (!state) return;
  isPlaying = !state.paused;
  const playBtn = document.getElementById('play-pause-btn');

  if (playBtn) {
    if (isPlaying) {
      playBtn.textContent = '❚❚';
      playBtn.style.paddingLeft = '0px';
      startProgressLoop();
    } else {
      playBtn.textContent = '▶';
      playBtn.style.paddingLeft = '3px';
      stopProgressLoop();
      updateProgressRing(state.position, state.duration);
    }
  }
}

// --- MAIN APPLICATION ROUTER ---
async function main() {
  const authState = await auth.checkAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const songNumber = urlParams.get('song');

  // Clear External Mount Zone
  if (externalMount) externalMount.innerHTML = '';

  // STATE 1: Unauthenticated
  if (!authState.authenticated) {
    renderUnauthenticatedView(cardMount, () => auth.login('spotify'));
    return;
  }

  // STATE 3: Active Card Player
  if (songNumber) {
    const trackData = getTrackByNumber(songNumber);
    if (!trackData) return;

    currentTrackId = trackData[authState.provider];
    renderPlayerView(cardMount, trackData);

    // Bind Player Controls
    const playBtn = document.getElementById('play-pause-btn');
    const revealBtn = document.getElementById('reveal-btn');
    const answerBox = document.getElementById('answer-box');

    playBtn?.addEventListener('click', async () => {
      if (!trackStarted) {
        await auth.playTrack(currentTrackId);
        trackStarted = true;
      } else {
        await auth.togglePlay();
      }
    });

    revealBtn?.addEventListener('click', () => {
      const isHidden = answerBox.classList.toggle('hidden');
      revealBtn.textContent = isHidden ? 'Reveal Track Info' : 'Hide Track Info';
    });

    await auth.initPlayer(
      () => { if (playBtn) playBtn.disabled = false; },
      (err) => { console.error(err); },
      handlePlayerStateChange
    );
  } 
  // STATE 2: Authenticated Dashboard (Card Selection)
  else {
    renderDashboardView(cardMount, authState.provider);
  }
}

main();