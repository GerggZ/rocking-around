// Shared icons on a 24×24 grid. Every icon draws in currentColor,
// so the surrounding button decides the color.

const svg = (body, attrs = '') => `
  <svg viewBox="0 0 24 24" ${attrs} aria-hidden="true" focusable="false">${body}</svg>`;

const STROKE = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

export const ICONS = {
  play: svg(
    '<path d="M8.5 5.6v12.8a1.1 1.1 0 0 0 1.7.92l9.6-6.4a1.1 1.1 0 0 0 0-1.84l-9.6-6.4a1.1 1.1 0 0 0-1.7.92Z"/>',
    'fill="currentColor"'
  ),
  pause: svg(
    '<rect x="6" y="5" width="4.2" height="14" rx="1.4"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.4"/>',
    'fill="currentColor"'
  ),
  // Brand logos, kept true to the originals. The badge shape uses
  // currentColor and the cut-out uses --provider-icon-paper, so a button
  // can flip them (cream logo on green, or green logo on cream).
  spotify: svg(
    '<circle cx="12" cy="12" r="11" fill="currentColor"/>' +
    '<g fill="none" stroke="var(--provider-icon-paper)" stroke-linecap="round">' +
    '<path d="M5.5 9c4.4-1.4 8.7-1 13 1" stroke-width="1.9"/>' +
    '<path d="M6.4 12.4c3.7-1.1 7.2-.7 10.8.9" stroke-width="1.7"/>' +
    '<path d="M7.3 15.6c3-.8 5.8-.5 8.7.8" stroke-width="1.5"/></g>'
  ),
  tidal: svg(
    '<path d="m4.5 4 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4ZM12 12l4 4-4 4-4-4Z"/>',
    'fill="currentColor"'
  ),
  itunes: svg(
    '<circle cx="12" cy="12" r="11" fill="currentColor"/>' +
    '<path d="M10 16.2a2 2 0 1 1-1.3-1.87V7.6l7-1.4v8.1a2 2 0 1 1-1.3-1.87V8.3L10 9.2Z" fill="var(--provider-icon-paper)"/>'
  ),
  note: svg(
    '<path d="M9 18.5a3 3 0 1 1-2-2.83V5l12-2v12.5a3 3 0 1 1-2-2.83V6.4L9 7.9Z"/>',
    'fill="currentColor"'
  )
};

export const providerIcon = name => ICONS[name] ?? ICONS.note;
