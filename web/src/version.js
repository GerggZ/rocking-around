// Which version of the app is running, and whether a newer one has been
// published (see version-file in vite.config.js).
/* global __APP_VERSION__ */
export const APP_VERSION = __APP_VERSION__;

let bannerShown = false;

function showUpdateBanner() {
  if (bannerShown) return;
  bannerShown = true;
  const banner = document.createElement('div');
  banner.className = 'update-banner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = '<span>A new version is out.</span><button type="button" class="update-reload">Reload</button>';
  banner.querySelector('button').addEventListener('click', () => window.location.reload());
  document.body.append(banner);
}

async function checkForUpdate() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}version.json`, { cache: 'no-store' });
    if (!response.ok) return;
    const { version } = await response.json();
    if (version && version !== APP_VERSION) showUpdateBanner();
  } catch {
    // Offline: nothing to compare against
  }
}

// Checks when the app opens and every time you come back to it.
export function watchForUpdates() {
  if (APP_VERSION === 'dev') return;
  console.info(`RockingAround version: ${APP_VERSION}`);
  setTimeout(checkForUpdate, 3000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate();
  });
}
