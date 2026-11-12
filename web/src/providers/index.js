import * as spotify from './spotify.js';
import * as tidal from './tidal.js';
import * as itunes from './itunes.js';

// Every provider module exports the same interface: requiresLogin, login,
// logout, isCallback, handleCallback, hasSession, initPlayer, playTrack,
// pauseTrack, togglePlay and getCurrentState (unlockAudio is optional). This router treats them all the
// same way.
// TIDAL is hidden until TIDAL allows this website to stream previews: its
// audio servers currently refuse (403) audio requests from other websites.
// Set to true to bring TIDAL back into the provider menu.
const TIDAL_ENABLED = false;
const providers = { spotify, ...(TIDAL_ENABLED ? { tidal } : {}), itunes };
let activeProvider = null;

function active() {
  return providers[activeProvider];
}

function openPendingCard() {
  const pendingSong = sessionStorage.getItem('pending_song');
  sessionStorage.removeItem('pending_song');
  if (pendingSong) {
    window.location.href = `${window.location.pathname}?song=${encodeURIComponent(pendingSong)}`;
    return true;
  }
  return false;
}

export function providerAccounts() {
  return Object.fromEntries(Object.entries(providers).map(([name, provider]) => [name, {
    connected: provider.hasSession(),
    requiresLogin: provider.requiresLogin
  }]));
}

export async function login(name) {
  const provider = providers[name];
  if (!provider) return;
  const params = new URLSearchParams(window.location.search);
  const song = params.get('song') || params.get('card');
  if (song) sessionStorage.setItem('pending_song', song);
  else sessionStorage.removeItem('pending_song');
  await pauseTrack();
  sessionStorage.setItem('selected_provider', name);
  if (provider.hasSession()) {
    if (!openPendingCard()) window.location.reload();
    return;
  }
  await provider.login();
}

export function logout(name) {
  const provider = providers[name];
  if (!provider) return;
  provider.logout();
  if (sessionStorage.getItem('selected_provider') === name) sessionStorage.removeItem('selected_provider');
  window.location.reload();
}

export async function checkAuth() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    const name = Object.keys(providers).find(key => providers[key].isCallback(params));
    if (name) {
      await providers[name].handleCallback(code);
      activeProvider = name;
      sessionStorage.setItem('selected_provider', name);
      openPendingCard();
      return { authenticated: true, provider: name };
    }
    // A login response nobody asked for (or an expired one): drop it.
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const selected = sessionStorage.getItem('selected_provider');
  if (providers[selected]) {
    activeProvider = selected;
  } else {
    activeProvider = Object.keys(providers).find(key => providers[key].hasSession()) ?? null;
  }
  return activeProvider
    ? { authenticated: true, provider: activeProvider }
    : { authenticated: false, provider: null };
}

export async function initPlayer(onReady, onError, onStateChange, onAutoplayBlocked) {
  if (!active()) return;
  // Without a login there is nothing to connect yet; pressing Play signs in.
  if (!active().hasSession()) {
    onReady();
    return;
  }
  await active().initPlayer(onReady, onError, onStateChange, onAutoplayBlocked);
}

// Call from inside a tap/click/key handler. Lets later tracks start without
// another tap, which browsers otherwise require for every new page.
export function unlockAudio() {
  active()?.unlockAudio?.();
}

export async function playTrack(trackId) {
  if (!active()) return;
  if (!active().hasSession()) {
    await login(activeProvider);
    return;
  }
  await active().playTrack(trackId);
}

export async function pauseTrack() {
  await active()?.pauseTrack();
}

export async function togglePlay() {
  await active()?.togglePlay();
}

export async function getCurrentState() {
  return active() ? await active().getCurrentState() : null;
}
