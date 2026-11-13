import { ICONS } from '../icons.js';
import { getTrackById } from '../tracks.js';

// Scanning inside the app (instead of with the phone's camera app) keeps the
// game in one tab, and the tap on the scan button counts as permission for
// the scanned card's music to start on its own.

// Phones without the built-in BarcodeDetector (iPhone/iPad, Firefox) use
// jsQR, loaded only when it is needed.
const JSQR_URL = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
let jsQRPromise = null;

function loadJsQR() {
  if (window.jsQR) return Promise.resolve(window.jsQR);
  jsQRPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = JSQR_URL;
    script.async = true;
    script.onload = () => window.jsQR
      ? resolve(window.jsQR)
      : reject(new Error('The QR reader could not start.'));
    script.onerror = () => {
      jsQRPromise = null;
      script.remove();
      reject(new Error('Could not load the QR reader. Check your connection and try again.'));
    };
    document.head.appendChild(script);
  });
  return jsQRPromise;
}

async function createDetector() {
  if ('BarcodeDetector' in window) {
    try {
      const formats = await window.BarcodeDetector.getSupportedFormats();
      if (formats.includes('qr_code')) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        return async video => (await detector.detect(video))[0]?.rawValue ?? null;
      }
    } catch {}
  }

  const jsQR = await loadJsQR();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  return async video => {
    // Smaller frames are much faster to search and still read card codes.
    const scale = Math.min(1, 640 / Math.max(video.videoWidth, video.videoHeight));
    const width = Math.round(video.videoWidth * scale);
    const height = Math.round(video.videoHeight * scale);
    if (!width || !height) return null;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    const image = context.getImageData(0, 0, width, height);
    return jsQR(image.data, width, height)?.data ?? null;
  };
}

// Cards encode ".../rocking-around/?song=<id>"; a bare card id works too.
export function cardIdFromCode(text) {
  let id = String(text).trim();
  try {
    const url = new URL(id);
    id = url.searchParams.get('song') || url.searchParams.get('card') || '';
  } catch {}
  id = id.trim();
  if (getTrackById(id)) return id;
  if (getTrackById(id.toLowerCase())) return id.toLowerCase();
  return null;
}

function cameraErrorMessage(error) {
  if (!window.isSecureContext) return 'The camera only works when the site is opened over https.';
  if (error?.name === 'NotAllowedError') return 'Camera access is blocked. Allow the camera for this site in your browser settings, then try again.';
  if (error?.name === 'NotFoundError' || error?.name === 'OverconstrainedError') return 'No camera was found on this device.';
  if (error?.name === 'NotReadableError') return 'The camera is busy in another app. Close it and try again.';
  return error?.message || 'Could not start the camera.';
}

export function renderScanButton({ onCard }) {
  const mount = document.getElementById('scan-controls');
  if (!mount) return () => {};

  mount.innerHTML = `
    <button id="scan-btn" class="scan-control" type="button"
            aria-haspopup="dialog" aria-controls="scan-dialog"
            aria-label="Scan a card" title="Scan a card">${ICONS.scan}</button>
    <dialog id="scan-dialog" class="provider-dialog scan-dialog" aria-labelledby="scan-title">
      <div class="provider-dialog-heading">
        <h2 id="scan-title">Scan a card</h2>
        <button id="scan-close" class="provider-close" type="button" aria-label="Close the scanner">×</button>
      </div>
      <div class="scan-viewport">
        <video id="scan-video" muted playsinline></video>
        <div class="scan-frame" aria-hidden="true"></div>
      </div>
      <p id="scan-status" class="scan-status" role="status"></p>
    </dialog>
  `;

  const trigger = mount.querySelector('#scan-btn');
  const dialog = mount.querySelector('#scan-dialog');
  const video = mount.querySelector('#scan-video');
  const status = mount.querySelector('#scan-status');
  let stream = null;
  let session = 0;

  function stopCamera() {
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
  }

  const close = () => dialog.close();

  async function scanLoop(detect, current) {
    let lastMiss = '';
    while (current === session) {
      if (video.readyState >= 2) {
        let text = null;
        try { text = await detect(video); } catch {}
        if (current !== session) return;
        if (text) {
          const id = cardIdFromCode(text);
          if (id) {
            close();
            onCard(id);
            return;
          }
          if (text !== lastMiss) {
            lastMiss = text;
            status.textContent = 'That QR code isn\u2019t one of the game cards.';
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }

  async function open() {
    if (dialog.open) return;
    const current = ++session;
    dialog.showModal();
    status.textContent = 'Starting the camera\u2026';

    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = cameraErrorMessage();
      return;
    }

    const detector = createDetector();
    detector.catch(() => {});
    try {
      const camera = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      if (current !== session) {
        camera.getTracks().forEach(track => track.stop());
        return;
      }
      stream = camera;
      video.srcObject = stream;
      await video.play();
      const detect = await detector;
      if (current !== session) return;
      status.textContent = 'Point the camera at the QR code on a card.';
      scanLoop(detect, current);
    } catch (error) {
      if (current !== session) return;
      stopCamera();
      status.textContent = cameraErrorMessage(error);
    }
  }

  trigger.addEventListener('click', open);
  mount.querySelector('#scan-close').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    )) close();
  });
  dialog.addEventListener('close', () => {
    session++;
    stopCamera();
    trigger.focus();
  });
  // Don't keep the camera on while the app is in the background.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && dialog.open) close();
  });

  return open;
}
