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

// --- Keeping the phone's media controls on RockingAround while Spotify plays ---
// Spotify's web player makes its sound inside its own hidden frame. Chrome takes
// the notification's title, artwork and buttons from the frame that is playing,
// so without help it shows the page title on a black square. A silent loop
// playing here, in the page itself, makes Chrome use the info above instead.
// (Over 5 seconds long: Chrome shows no controls for shorter sounds.)
let silence = null;
let shouldPlay = false;

function silentLoop() {
  if (silence) return silence;
  const rate = 8000, seconds = 6, samples = rate * seconds;
  const wav = new DataView(new ArrayBuffer(44 + samples));
  const text = (offset, value) => [...value].forEach((ch, i) => wav.setUint8(offset + i, ch.charCodeAt(0)));
  text(0, 'RIFF'); wav.setUint32(4, 36 + samples, true); text(8, 'WAVE');
  text(12, 'fmt '); wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true);
  wav.setUint32(24, rate, true); wav.setUint32(28, rate, true); wav.setUint16(32, 1, true); wav.setUint16(34, 8, true);
  text(36, 'data'); wav.setUint32(40, samples, true);
  for (let i = 0; i < samples; i++) wav.setUint8(44 + i, 128); // 8-bit silence
  silence = new Audio(URL.createObjectURL(new Blob([wav], { type: 'audio/wav' })));
  silence.loop = true;
  return silence;
}

// Call from a tap/click (browsers only allow sound to start after one).
export function unlockSilentLoop() {
  if (!supported) return;
  const audio = silentLoop();
  if (!audio.paused) return;
  audio.play().then(() => { if (!shouldPlay) audio.pause(); }).catch(() => {});
}

// Call whenever Spotify starts or stops playing.
export function followPlayback(playing) {
  if (!supported) return;
  shouldPlay = playing;
  const audio = silentLoop();
  if (playing) audio.play().catch(() => {});
  else audio.pause();
}

export function updateMediaSession(playing) {
  if (!supported) return;
  if (metadata) navigator.mediaSession.metadata = metadata;
  navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
}
