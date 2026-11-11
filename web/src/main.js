import * as providers from './providers/index.js';
import { getTrackById } from './tracks.js';
import { getPlayableCardIds, openRandomCard, restoreRandomDeck } from './random-cards.js';

import { renderProviderMenu } from './views/provider-menu.js';
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
    const state = await providers.getCurrentState();
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
async function initApp() {
  const authState = await providers.checkAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const songId = urlParams.get('song') || urlParams.get('card');

  // Clear External Mount Zone
  if (externalMount) externalMount.innerHTML = '';

  const provider = authState.authenticated ? authState.provider : null;
  const openProviderMenu = renderProviderMenu({
    provider,
    accounts: providers.providerAccounts(),
    onSelect: providers.login,
    onDisconnect: providers.logout
  });

  const randomDeck = restoreRandomDeck(songId);

  // STATE 2: Active Card Player
  if (songId) {
    const trackData = getTrackById(songId);
    if (!trackData) {
      cardMount.innerHTML = `<p>Card not found.</p><a href="${import.meta.env.BASE_URL}">Back to Menu</a>`;
      return;
    }

    currentTrackId = trackData[provider];
    const nextCards = randomDeck
      ? getPlayableCardIds(randomDeck, provider).filter(id => id !== songId)
      : [];
    renderPlayerView(cardMount, trackData, nextCards.length ? async () => {
      if (trackStarted) {
        try {
          await providers.pauseTrack();
        } catch (error) {
          console.error('Could not pause the current card:', error);
        }
      }
      openRandomCard(randomDeck, nextCards);
    } : null);

    // Bind Player Controls
    const playBtn = document.getElementById('play-pause-btn');
    const revealBtn = document.getElementById('reveal-btn');
    const answerBox = document.getElementById('answer-box');

    playBtn?.addEventListener('click', async () => {
      if (!provider) {
        openProviderMenu();
        return;
      }
      const status = document.getElementById('status-msg');
      playBtn.disabled = true;
      status.textContent = '';
      try {
        if (!trackStarted) {
          await providers.playTrack(currentTrackId);
          trackStarted = true;
        } else {
          await providers.togglePlay();
        }
      } catch (error) {
        status.textContent = error.message || 'Could not play this card. Please try again.';
      } finally {
        playBtn.disabled = false;
      }
    });

    revealBtn?.addEventListener('click', () => {
      const isHidden = answerBox.classList.toggle('hidden');
      revealBtn.textContent = isHidden ? 'Reveal Track Info' : 'Hide Track Info';
    });

    if (!provider) {
      playBtn.disabled = false;
      document.getElementById('status-msg').textContent = 'Choose a music provider to play.';
      openProviderMenu();
      return;
    }

    if (!currentTrackId) {
      document.getElementById('status-msg').textContent = `This card has no ${{ spotify: 'Spotify', tidal: 'TIDAL', itunes: 'iTunes' }[provider]} track ID yet.`;
      return;
    }

    // Clean SDK Initialization — Play button enables when player is ready!
    await providers.initPlayer(
      () => { 
        if (playBtn) playBtn.disabled = false; 
      },
      (err) => {
        trackStarted = false;
        document.getElementById('status-msg').textContent = String(err);
      },
      handlePlayerStateChange
    );
  } 
  // STATE 3: Authenticated Dashboard (Opened homepage or no card active)
  else {
    renderDashboardView(cardMount, provider);
  }
}

// Start the Application
initApp();