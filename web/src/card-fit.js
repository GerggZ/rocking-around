// Phone in landscape (see "PHONE LANDSCAPE" in style.css): the card keeps its
// normal size if it fits, and otherwise shrinks just enough to stay within
// CARD_MAX_SHARE of the screen height. It never grows past its normal size.
const CARD_HEIGHT = 404;      // visible card height, with the artwork's empty space trimmed
const CARD_MAX_SHARE = 0.9;   // most of the screen height the card may take up
const landscapePhone = window.matchMedia('(orientation: landscape) and (max-height: 540px)');

function fitCardToScreen() {
  const fit = landscapePhone.matches
    ? Math.min(1, (window.innerHeight * CARD_MAX_SHARE) / CARD_HEIGHT)
    : 1;
  document.documentElement.style.setProperty('--card-fit', fit.toFixed(3));
}
window.addEventListener('resize', fitCardToScreen);
landscapePhone.addEventListener('change', fitCardToScreen);
fitCardToScreen();
