// The play button on the card, in either style (see PLAYER_STYLE in config.js).
// main.js only talks to it through setPlayerIcon() and setPlayerProgress(),
// so switching styles never touches the playback code.
import { ICONS } from '../icons.js';
import { PLAYER_STYLE } from '../config.js';

const isCassette = PLAYER_STYLE === 'cassette';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// --- Ring ---
const RING_LENGTH = 295.3;

const ringMarkup = () => `
  <div class="player-wrapper">
    <svg class="progress-ring" width="110" height="110" viewBox="0 0 110 110">
      <circle stroke="rgba(0, 0, 0, 0.08)" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
      <circle id="progress-fill" class="progress-ring__fill" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
      <circle id="progress-dot" class="progress-ring__dot" r="4" cx="55" cy="8"/>
    </svg>

    <button id="play-pause-btn" class="play-btn" aria-label="Play" disabled>${ICONS.play}</button>
  </div>`;

function drawRing(progress) {
  const fill = document.getElementById('progress-fill');
  const dot = document.getElementById('progress-dot');
  if (!fill || !dot) return;

  fill.style.strokeDashoffset = RING_LENGTH - progress * RING_LENGTH;
  const angle = progress * 2 * Math.PI;
  dot.setAttribute('cx', (55 + 47 * Math.sin(angle)).toFixed(2));
  dot.setAttribute('cy', (55 - 47 * Math.cos(angle)).toFixed(2));
}

// --- Cassette ---
// Drawn on a 160×100 grid. The tape winds from the left reel onto the right
// one over the length of the track, both reels turning counter-clockwise.
// Like a real cassette, it leaves each reel on the outside, runs down to the
// corner rollers and across the opening at the bottom.
const REEL_L = 54, REEL_R = 106, REEL_Y = 46;    // reel centres
const PACK_FULL = 17, PACK_EMPTY = 8;            // tape pack radius, full and empty
const BAR_X = 36, BAR_W = 100;                   // progress bar on the label
const ICON_X = 24, ICON_Y = 19;                  // centre of the green play/pause dot
const GUIDE_L = [30, 92], GUIDE_R = [130, 92];  // where the tape heads for, below the window
const SPIN = 900;                                // reel speed: degrees per second at radius 1
const TAPE_W = 1.4;                              // tape stroke width

const STRIPES = ['#2d6a4f', '#3a8362', '#eec04c', '#c98a4b', '#6b4423'];

const CASSETTE_ICON = {
  play: `<path d="M${ICON_X - 2.4} ${ICON_Y - 4.2} L${ICON_X + 4.4} ${ICON_Y} L${ICON_X - 2.4} ${ICON_Y + 4.2}Z"/>`,
  pause: `<rect x="${ICON_X - 3.8}" y="${ICON_Y - 4}" width="2.8" height="8" rx=".9"/>` +
         `<rect x="${ICON_X + 1}" y="${ICON_Y - 4}" width="2.8" height="8" rx=".9"/>`
};

const hub = cx => `
  <g class="cassette-hub" data-cx="${cx}">
    <circle cx="${cx}" cy="${REEL_Y}" r="7" fill="#e4e1d8"/>
    <circle cx="${cx}" cy="${REEL_Y}" r="4.6" fill="#3f4448"/>
    ${[0, 60, 120, 180, 240, 300].map(a =>
      `<rect x="${cx - 0.9}" y="${REEL_Y - 6}" width="1.8" height="3" fill="#3f4448" transform="rotate(${a} ${cx} ${REEL_Y})"/>`).join('')}
  </g>`;

const cassetteMarkup = () => {
  const stripeH = 32 / STRIPES.length;
  const stripes = STRIPES.map((c, i) =>
    `<rect x="12" y="${(30 + i * stripeH).toFixed(2)}" width="136" height="${(stripeH + 0.3).toFixed(2)}" fill="${c}"/>`).join('');

  return `
  <div class="cassette-wrapper">
    <button id="play-pause-btn" class="cassette-btn" aria-label="Play" disabled>
      <svg viewBox="0 0 160 100" aria-hidden="true" focusable="false">
        <defs><clipPath id="cassette-window"><rect x="38" y="34" width="84" height="24" rx="12"/></clipPath></defs>
        <rect x="2" y="2" width="156" height="96" rx="7" fill="#3f4448"/>
        <circle cx="8" cy="8" r="2.3" fill="#2a2e31"/><circle cx="152" cy="8" r="2.3" fill="#2a2e31"/>
        <circle cx="8" cy="92" r="2.3" fill="#2a2e31"/><circle cx="152" cy="92" r="2.3" fill="#2a2e31"/>
        <rect x="12" y="8" width="136" height="70" rx="4" fill="#f3e6c4"/>
        ${stripes}
        <rect x="38" y="34" width="84" height="24" rx="12" fill="#2a2e31"/>
        <g clip-path="url(#cassette-window)">
          <line class="cassette-tape-l" stroke="#5a4636" stroke-width="${TAPE_W}" stroke-linecap="round"/>
          <line class="cassette-tape-r" stroke="#5a4636" stroke-width="${TAPE_W}" stroke-linecap="round"/>
          <circle class="cassette-pack-l" cx="${REEL_L}" cy="${REEL_Y}" r="${PACK_FULL}" fill="#5a4636"/>
          <circle class="cassette-pack-r" cx="${REEL_R}" cy="${REEL_Y}" r="${PACK_EMPTY}" fill="#5a4636"/>
        </g>
        ${hub(REEL_L)}${hub(REEL_R)}
        <rect x="${BAR_X}" y="17" width="${BAR_W}" height="4" rx="2" fill="#e2d3a8"/>
        <rect class="cassette-bar" x="${BAR_X}" y="17" width="0" height="4" rx="2" fill="#2d6a4f"/>
        <circle class="cassette-bar-dot" cx="${BAR_X}" cy="19" r="3" fill="#3a8362"/>
        <g class="cassette-key">
          <circle cx="${ICON_X}" cy="${ICON_Y}" r="8" fill="#2d6a4f"/>
          <g class="cassette-icon" fill="#f4f8f5">${CASSETTE_ICON.play}</g>
        </g>
        <path d="M38 98 L46 81 L114 81 L122 98Z" fill="#34393c"/>
        <circle cx="80" cy="88" r="2.3" fill="#2a2e31"/>
        <circle cx="56" cy="92" r="2.4" fill="#1e2124"/><circle cx="68" cy="93" r="1.8" fill="#1e2124"/>
        <circle cx="92" cy="93" r="1.8" fill="#1e2124"/><circle cx="104" cy="92" r="2.4" fill="#1e2124"/>
        <line x1="45" y1="96.6" x2="115" y2="96.6" stroke="#7a5f48" stroke-width="1.4"/>
        <circle cx="45" cy="94.6" r="2" fill="#e4e1d8"/><circle cx="115" cy="94.6" r="2" fill="#e4e1d8"/>
      </svg>
    </button>
  </div>`;
};

// Where a line from `guide` touches the pack (side: 1 = left/outer edge of the
// left reel, -1 = right/outer edge of the right reel).
function tangentPoint(cx, r, [gx, gy], side) {
  const dx = gx - cx, dy = gy - REEL_Y;
  const angle = Math.atan2(dy, dx) + side * Math.acos(r / Math.hypot(dx, dy));
  return [cx + r * Math.cos(angle), REEL_Y + r * Math.sin(angle)];
}

function setLine(line, [x1, y1], [x2, y2]) {
  line.setAttribute('x1', x1.toFixed(2));
  line.setAttribute('y1', y1.toFixed(2));
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
}

function drawCassette(progress, totalSeconds) {
  const btn = document.getElementById('play-pause-btn');
  if (!btn?.classList.contains('cassette-btn')) return;
  const q = selector => btn.querySelector(selector);

  const span = PACK_FULL - PACK_EMPTY;
  const left = PACK_FULL - span * progress;
  const right = PACK_EMPTY + span * progress;
  q('.cassette-pack-l').setAttribute('r', left);
  q('.cassette-pack-r').setAttribute('r', right);

  // The tape leaves each pack on its outer side, heading down to the rollers.
  // The line runs tangent to the pack's outer edge (radius + half the stroke),
  // so it lies flush against the pack instead of cutting into it; the round
  // cap fills the joint.
  const edge = TAPE_W / 2;
  setLine(q('.cassette-tape-l'), tangentPoint(REEL_L, left + edge, GUIDE_L, 1), GUIDE_L);
  setLine(q('.cassette-tape-r'), tangentPoint(REEL_R, right + edge, GUIDE_R, -1), GUIDE_R);

  q('.cassette-bar').setAttribute('width', BAR_W * progress);
  q('.cassette-bar-dot').setAttribute('cx', BAR_X + BAR_W * progress);

  // Tape moves at a steady speed, so the smaller pack spins faster. The angle
  // follows from the position alone, so pausing and seeking stay in step.
  const [hubL, hubR] = btn.querySelectorAll('.cassette-hub');
  if (reducedMotion.matches || !totalSeconds) {
    hubL.removeAttribute('transform');
    hubR.removeAttribute('transform');
    return;
  }
  const turn = SPIN * totalSeconds / span;
  const angleL = -turn * Math.log(PACK_FULL / left);
  const angleR = -turn * Math.log(right / PACK_EMPTY);
  hubL.setAttribute('transform', `rotate(${angleL.toFixed(2)} ${REEL_L} ${REEL_Y})`);
  hubR.setAttribute('transform', `rotate(${angleR.toFixed(2)} ${REEL_R} ${REEL_Y})`);
}

// --- Shared ---
export function playerMarkup() {
  return isCassette ? cassetteMarkup() : ringMarkup();
}

export function setPlayerIcon(button, playing) {
  if (!button) return;
  button.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  if (isCassette) {
    const icon = button.querySelector('.cassette-icon');
    if (icon && icon.dataset.state !== String(playing)) {
      const changed = icon.dataset.state !== undefined;
      icon.dataset.state = String(playing);
      icon.innerHTML = playing ? CASSETTE_ICON.pause : CASSETTE_ICON.play;
      // A little pop on the green key whenever play/pause actually flips.
      const key = button.querySelector('.cassette-key');
      if (changed && key) {
        key.classList.remove('is-popping');
        void key.getBoundingClientRect();   // restart the animation
        key.classList.add('is-popping');
      }
    }
  } else {
    button.innerHTML = playing ? ICONS.pause : ICONS.play;
  }
}

export function setPlayerProgress(positionMs, durationMs) {
  if (!durationMs) return;
  const progress = Math.min(Math.max(positionMs / durationMs, 0), 1);
  if (isCassette) drawCassette(progress, durationMs / 1000);
  else drawRing(progress);
}

export function resetPlayerProgress() {
  if (isCassette) drawCassette(0, 0);
  else drawRing(0);
}
