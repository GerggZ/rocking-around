import * as providers from './providers/index.js';
import { getTrackById } from './tracks.js';
import { getPlayableCardIds, pickRandomCard, findDeckForCard, restoreRandomDeck } from './random-cards.js';

import { renderProviderMenu } from './views/provider-menu.js';
import { renderDashboardView } from './views/dashboard.js';
import { renderPlayerView } from './views/player.js';
import { ICONS } from './icons.js';

const cardMount = document.getElementById('card-mount');
const externalMount = document.getElementById('external-content');

// Remembered across cards (and QR-scan reloads) until the player presses play.
const pausedKey = 'playback_paused';

let provider = null;
let openProviderMenu = () => {};
let playerReady = null;
let currentTrackId = null;
let isPlaying = false;
let trackStarted = false;
let animFrameId = null;
let cardToken = 0;

function userPaused() {
  try { return sessionStorage.getItem(pausedKey) === '1'; } catch { return false; }
}

function setUserPaused(paused) {
  try {
    if (paused) sessionStorage.setItem(pausedKey, '1');
    else sessionStorage.removeItem(pausedKey);
  } catch {}
}

function setStatus(message) {
  const status = document.getElementById('status-msg');
  if (status) status.textContent = message;
}

// Browsers only let audio start from a real tap, click or key press. Any of
// these on the page unlocks the player, so later cards can start on their own.
for (const type of ['pointerdown', 'pointerup', 'touchend', 'keydown']) {
  document.addEventListener(type, () => providers.unlockAudio(), { capture: true });
}

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
      playBtn.innerHTML = ICONS.pause;
      playBtn.setAttribute('aria-label', 'Pause');
      setStatus('');
      startProgressLoop();
    } else {
      playBtn.innerHTML = ICONS.play;
      playBtn.setAttribute('aria-label', 'Play');
      stopProgressLoop();
      updateProgressRing(state.position, state.duration);
    }
  }
}

function handleAutoplayBlocked() {
  // The track is loaded but the browser wants a tap first; Play resumes it.
  trackStarted = true;
  setStatus('Tap play to start the music.');
}

// Connect the music provider once and keep it for every card in this visit.
function startPlayer() {
  if (playerReady) return playerReady;
  playerReady = new Promise(resolve => {
    providers.initPlayer(
      () => resolve(true),
      (err) => {
        trackStarted = false;
        setStatus(String(err));
        resolve(false);
      },
      handlePlayerStateChange,
      handleAutoplayBlocked
    ).catch(error => {
      setStatus(error?.message || String(error));
      resolve(false);
    });
  });
  return playerReady;
}

async function startTrack(token) {
  const playBtn = document.getElementById('play-pause-btn');
  if (playBtn) playBtn.disabled = true;
  setStatus('');
  try {
    await providers.playTrack(currentTrackId);
    if (token === cardToken) trackStarted = true;
  } catch (error) {
    if (token !== cardToken) return;
    if (error?.name === 'NotAllowedError') handleAutoplayBlocked();
    else setStatus(error?.message || 'Could not play this card. Please try again.');
  } finally {
    if (token === cardToken && playBtn) playBtn.disabled = false;
  }
}

// --- VIEWS ---
function showCard(songId, deck, { autoplay = true } = {}) {
  const token = ++cardToken;
  stopProgressLoop();
  trackStarted = false;
  isPlaying = false;

  const trackData = getTrackById(songId);
  if (!trackData) {
    providers.pauseTrack().catch(() => {});
    cardMount.innerHTML = `<p>Card not found.</p><a href="${import.meta.env.BASE_URL}">Back to Menu</a>`;
    if (externalMount) externalMount.innerHTML = '';
    return;
  }

  currentTrackId = provider ? trackData[provider] : null;
  const nextCards = deck
    ? getPlayableCardIds(deck, provider).filter(id => id !== songId)
    : [];

  renderPlayerView(cardMount, trackData, {
    onNext: nextCards.length ? () => goToCard(pickRandomCard(nextCards), deck) : null,
    onBack: goHome
  });

  const playBtn = document.getElementById('play-pause-btn');
  const revealBtn = document.getElementById('reveal-btn');
  const answerBox = document.getElementById('answer-box');

  playBtn?.addEventListener('click', async () => {
    if (!provider) {
      openProviderMenu();
      return;
    }
    providers.unlockAudio();
    // Pausing here is remembered, so the next cards stay quiet until Play.
    setUserPaused(isPlaying);
    if (!trackStarted) {
      await startTrack(token);
      return;
    }
    playBtn.disabled = true;
    setStatus('');
    try {
      await providers.togglePlay();
    } catch (error) {
      setStatus(error?.message || 'Could not play this card. Please try again.');
    } finally {
      playBtn.disabled = false;
    }
  });

  revealBtn?.addEventListener('click', () => {
    const isHidden = answerBox.classList.toggle('hidden');
    revealBtn.textContent = isHidden ? 'Reveal Track Info' : 'Hide Track Info';
  });

  const willPlay = Boolean(provider && currentTrackId && autoplay && !userPaused());
  // Stop the previous card unless the new one is about to replace it.
  if (!willPlay) providers.pauseTrack().catch(() => {});

  if (!provider) {
    playBtn.disabled = false;
    setStatus('Choose a music provider to play.');
    openProviderMenu();
    return;
  }

  if (!currentTrackId) {
    setStatus(`This card has no ${{ spotify: 'Spotify', tidal: 'TIDAL', itunes: 'iTunes' }[provider]} track ID yet.`);
    return;
  }

  startPlayer().then(ready => {
    if (token !== cardToken || !ready) return;
    if (playBtn) playBtn.disabled = false;
    if (willPlay) startTrack(token);
  });
}

function showDashboard() {
  cardToken++;
  stopProgressLoop();
  trackStarted = false;
  providers.pauseTrack().catch(() => {});
  renderDashboardView(cardMount, provider, { onOpenCard: goToCard });
}

// Card changes happen in place (no page reload), so the tap that opened the
// card still counts as permission to start its music.
function goToCard(songId, deck = null) {
  window.history.pushState({ randomDeckId: deck?.id ?? null }, '', '?' + new URLSearchParams({ song: songId }));
  window.scrollTo({ top: 0 });
  showCard(songId, deck);
}

function goHome() {
  window.history.pushState({}, '', import.meta.env.BASE_URL);
  showDashboard();
}

function currentSongParam() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('song') || urlParams.get('card');
}

window.addEventListener('popstate', () => {
  const songId = currentSongParam();
  if (songId) showCard(songId, findDeckForCard(window.history.state?.randomDeckId, songId));
  else showDashboard();
});

// --- MAIN APPLICATION ROUTER ---
async function initApp() {
  const authState = await providers.checkAuth();
  const songId = currentSongParam();

  // Clear External Mount Zone
  if (externalMount) externalMount.innerHTML = '';

  provider = authState.authenticated ? authState.provider : null;
  openProviderMenu = renderProviderMenu({
    provider,
    accounts: providers.providerAccounts(),
    onSelect: providers.login,
    onDisconnect: providers.logout
  });

  // Connect early, so the first card can start as soon as someone taps.
  if (provider) startPlayer();

  if (songId) showCard(songId, restoreRandomDeck(songId));
  else showDashboard();
}

// Start the Application
initApp();
