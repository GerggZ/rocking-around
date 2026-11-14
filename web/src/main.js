import * as providers from './providers/index.js';
import { getTrackById } from './tracks.js';
import { getPlayableCardIds, pickRandomCard, findDeckForCard } from './random-cards.js';

import { renderProviderMenu } from './views/provider-menu.js';
import { renderDashboardView } from './views/dashboard.js';
import { renderPlayerView } from './views/player.js';
import { setPlayerIcon, setPlayerProgress } from './views/player-visual.js';
import { renderScanButton } from './views/scanner.js';
import { setupMediaSession, updateMediaSession } from './media-session.js';
import { watchForUpdates } from './version.js';
import './card-fit.js';

const cardMount = document.getElementById('card-mount');
const externalMount = document.getElementById('external-content');
const cardBoard = document.querySelector('.card-board');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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

// Installable app (see public/sw.js). Only in the built site: during
// development a cached page would hide your latest changes.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}

watchForUpdates();

// Play/pause in the phone's media controls work like the cassette button.
setupMediaSession({
  onPlay: () => { if (!isPlaying) document.getElementById('play-pause-btn')?.click(); },
  onPause: () => { if (isPlaying) document.getElementById('play-pause-btn')?.click(); }
});

function setStatus(message) {
  const status = document.getElementById('status-msg');
  if (status) status.textContent = message;
}

// Browsers only let audio start from a real tap, click or key press. Any of
// these on the page unlocks the player, so later cards can start on their own.
for (const type of ['pointerdown', 'pointerup', 'touchend', 'keydown']) {
  document.addEventListener(type, () => providers.unlockAudio(), { capture: true });
}

// Focus rings are for keyboard users: Tab turns them on, a tap or click turns
// them off again (see .keyboard-nav in style.css).
document.addEventListener('keydown', event => {
  if (event.key === 'Tab') document.documentElement.classList.add('keyboard-nav');
});
document.addEventListener('pointerdown', () => {
  document.documentElement.classList.remove('keyboard-nav');
});

// --- PROGRESS RING LOOP ---
function updateProgressRing(positionMs, durationMs) {
  setPlayerProgress(positionMs, durationMs);
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
  updateMediaSession(isPlaying);
  const playBtn = document.getElementById('play-pause-btn');

  if (playBtn) {
    if (isPlaying) {
      setPlayerIcon(playBtn, true);
      setStatus('');
      startProgressLoop();
    } else {
      setPlayerIcon(playBtn, false);
      stopProgressLoop();
      updateProgressRing(state.ended ? 0 : state.position, state.duration);
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
  const nextDeck = deck ?? findDeckForCard(songId, window.history.state?.randomDeckId ?? sessionStorage.getItem('selected_deck'));
  const nextCards = getPlayableCardIds(nextDeck, provider).filter(id => id !== songId);

  renderPlayerView(cardMount, trackData, {
    onNext: nextCards.length ? () => goToCard(pickRandomCard(nextCards), nextDeck) : null,
    onBack: goHome
  });

  const playBtn = document.getElementById('play-pause-btn');
  const revealBtn = document.getElementById('reveal-btn');
  const answerSlot = document.getElementById('answer-slot');
  const answerReveal = document.getElementById('answer-reveal');

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

  // The track info grows out of the Reveal button and folds back into it
  // (see .answer-slot in style.css). The motion needs to know where the button
  // is relative to the info card, and how big it is.
  function aimAnswerAtButton() {
    const card = answerReveal.firstElementChild;
    const button = revealBtn.getBoundingClientRect();
    const box = answerReveal.getBoundingClientRect();
    // Screen positions include any page scaling; the motion works in the
    // card's own unscaled pixels.
    const scale = box.width / answerReveal.offsetWidth || 1;
    // Shrinks to exactly the button's pill shape, rounded like the button.
    const width = revealBtn.offsetWidth;
    const height = revealBtn.offsetHeight;
    const scaleX = width / (card.offsetWidth || width);
    const scaleY = height / (card.offsetHeight || height);
    const radius = Math.min(parseFloat(getComputedStyle(revealBtn).borderTopLeftRadius) || 0, height / 2);
    card.style.setProperty('--origin-x', `${(button.left + button.width / 2 - box.left) / scale}px`);
    card.style.setProperty('--origin-y', `${(button.top + button.height / 2 - box.top) / scale}px`);
    card.style.setProperty('--ball-x', String(scaleX));
    card.style.setProperty('--ball-y', String(scaleY));
    // Undo the squash on the corners, so they match the button once shrunk.
    card.style.setProperty('--pill-radius', `${radius / scaleX}px / ${radius / scaleY}px`);
    // Apply the new aim before toggling, so the motion starts from it.
    void getComputedStyle(card).transform;
  }

  revealBtn?.addEventListener('click', () => {
    aimAnswerAtButton();
    const isOpen = answerSlot.classList.toggle('is-open');
    answerReveal.inert = !isOpen;
    revealBtn.setAttribute('aria-expanded', String(isOpen));
    revealBtn.textContent = isOpen ? 'Hide Track Info' : 'Reveal Track Info';
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
  renderDashboardView(cardMount, provider, {
    onOpenCard: goToCard,
    onChooseProvider: () => openProviderMenu()
  });
}

// --- CARD TRANSITIONS ---
// Everything done inside the app turns the card over with a flip, in a random
// direction. Arriving from outside (a phone's camera app or a shared link)
// drops the card onto the table instead.
//
// A flip takes the old card away, the new card is drawn while it is edge-on,
// then it turns face up. Tapping again mid-flip skips to the newest card.
let transitionToken = 0;
let lastFlip = null;

// Left/right turn around the vertical axis, up/down around the horizontal one.
const FLIPS = {
  left: { axis: 'Y', sign: -1 },
  right: { axis: 'Y', sign: 1 },
  up: { axis: 'X', sign: 1 },
  down: { axis: 'X', sign: -1 }
};

function pickFlip() {
  const options = Object.keys(FLIPS).filter(name => name !== lastFlip);
  lastFlip = options[Math.floor(Math.random() * options.length)];
  return FLIPS[lastFlip];
}

function flipFrame(axis, degrees, scale = 1) {
  return { transform: `perspective(1400px) rotate${axis}(${degrees}deg)${scale === 1 ? '' : ` scale(${scale})`}` };
}

const MOTIONS = {
  // Turns over like a card, in a random direction.
  flip() {
    const { axis, sign } = pickFlip();
    return {
      out: [[flipFrame(axis, 0), flipFrame(axis, sign * 90, 0.96)],
        { duration: 220, easing: 'cubic-bezier(0.55, 0, 0.9, 0.5)' }],
      in: [[
        flipFrame(axis, -sign * 90, 0.96),
        { ...flipFrame(axis, sign * 6), offset: 0.75 },
        flipFrame(axis, 0)
      ], { duration: 380, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' }]
    };
  },

  // A card arriving from outside drops onto the table (entrance only).
  drop() {
    return {
      in: [[
        { transform: 'translateY(-70px) scale(1.14)', opacity: 0 },
        { transform: 'translateY(0) scale(0.97)', opacity: 1, offset: 0.62 },
        { transform: 'translateY(-4px) scale(1.01)', offset: 0.82 },
        { transform: 'none', opacity: 1 }
      ], { duration: 440, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' }]
    };
  }
};

// Plays only the second half of a motion on what is already showing.
function playEntrance(kind) {
  // The card was kept hidden while the app started; the entrance reveals it.
  document.documentElement.classList.remove('arriving');
  if (!cardBoard?.animate) return;
  if (reducedMotion.matches) {
    cardBoard.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
    return;
  }
  const [frames, timing] = MOTIONS[kind]().in;
  cardBoard.animate(frames, { ...timing, fill: 'backwards' });
  externalMount?.animate(
    [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
    { duration: 320, delay: 200, easing: 'ease-out', fill: 'backwards' }
  );
}

async function transitionCard(render, kind = 'flip') {
  const token = ++transitionToken;
  if (!cardBoard || !cardBoard.animate) {
    render();
    return;
  }

  if (reducedMotion.matches) {
    render();
    cardMount.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
    externalMount?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
    return;
  }

  const motion = (MOTIONS[kind] ?? MOTIONS.flip)();
  const [outFrames, outTiming] = motion.out;
  const [inFrames, inTiming] = motion.in;

  const fadeOut = externalMount?.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    { duration: 180, easing: 'ease-in', fill: 'forwards' }
  );
  const leave = cardBoard.animate(outFrames, { ...outTiming, fill: 'forwards' });
  await leave.finished.catch(() => {});
  if (token !== transitionToken) return;

  render();
  leave.cancel();
  fadeOut?.cancel();

  cardBoard.animate(inFrames, inTiming);
  externalMount?.animate(
    [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
    { duration: 320, delay: 120, easing: 'ease-out', fill: 'backwards' }
  );
}

// Card changes happen in place (no page reload), so the tap that opened the
// card still counts as permission to start its music.
function goToCard(songId, deck = null) {
  window.history.pushState({ randomDeckId: deck?.id ?? null }, '', '?' + new URLSearchParams({ song: songId }));
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  transitionCard(() => showCard(songId, deck));
}

function goHome() {
  window.history.pushState({}, '', import.meta.env.BASE_URL);
  transitionCard(showDashboard);
}

function currentSongParam() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('song') || urlParams.get('card');
}

window.addEventListener('popstate', () => {
  const songId = currentSongParam();
  transitionCard(songId ? () => showCard(songId) : showDashboard);
});

// --- MAIN APPLICATION ROUTER ---
async function initApp() {
  let authState;
  try {
    authState = await providers.checkAuth();
  } catch (error) {
    // Never leave the card hidden if signing in fails.
    document.documentElement.classList.remove('arriving');
    throw error;
  }
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

  // In-app scanning: the scan tap unlocks audio, so the scanned card plays.
  renderScanButton({ onCard: songId => goToCard(songId) });

  // Connect early, so the first card can start as soon as someone taps.
  if (provider) startPlayer();

  if (songId) {
    // Arrived straight on a card (camera-app scan or a shared link). Wait for
    // the card artwork (briefly) so it doesn't land half-drawn.
    showCard(songId);
    const artwork = cardBoard?.querySelector('.frame-bg');
    await Promise.race([
      artwork?.decode?.().catch(() => {}),
      new Promise(resolve => setTimeout(resolve, 1200))
    ]);
    playEntrance('drop');
  } else {
    showDashboard();
  }
}

// Start the Application
initApp();
