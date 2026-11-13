// What the phone shows in its media controls (Android notification, lock
// screen, Bluetooth car displays). It is a guessing game, so the real title
// and artist are never handed over: just the cassette and "Mystery track".
const supported = 'mediaSession' in navigator;
const icon = size => new URL(`${import.meta.env.BASE_URL}icons/icon-${size}.png`, window.location.href).href;

const metadata = supported && 'MediaMetadata' in window ? new MediaMetadata({
  title: 'Mystery track',
  artist: 'RockingAround',
  album: 'Guess the year',
  artwork: [
    { src: icon(192), sizes: '192x192', type: 'image/png' },
    { src: icon(512), sizes: '512x512', type: 'image/png' }
  ]
}) : null;

// onPlay/onPause run when the play/pause buttons in the phone's controls are used.
export function setupMediaSession({ onPlay, onPause }) {
  if (!supported) return;
  for (const [action, handler] of [['play', onPlay], ['pause', onPause]]) {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
  }
  // No seeking or skipping from the lock screen: that would give hints away.
  for (const action of ['seekbackward', 'seekforward', 'seekto', 'previoustrack', 'nexttrack']) {
    try { navigator.mediaSession.setActionHandler(action, null); } catch {}
  }
}

export function updateMediaSession(playing) {
  if (!supported) return;
  if (metadata) navigator.mediaSession.metadata = metadata;
  navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
}
