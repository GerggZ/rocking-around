// Opens a modal dialog so it grows out of the button that opened it, and later
// squishes back down into a ball on that button. The motion itself lives in style.css; this only
// tells it where the button is, relative to the dialog.
export function showDialogFrom(dialog, button) {
  dialog.showModal();
  if (!button) return;
  const rect = button.getBoundingClientRect();
  // offsetLeft/offsetTop ignore the opening scale, so this is the dialog's
  // real resting position.
  dialog.style.setProperty('--origin-x', `${rect.left + rect.width / 2 - dialog.offsetLeft}px`);
  dialog.style.setProperty('--origin-y', `${rect.top + rect.height / 2 - dialog.offsetTop}px`);
  // Shrunk to exactly the button's size, so the window becomes a ball that
  // lands on (or springs out of) the button.
  dialog.style.setProperty('--ball-x', String(rect.width / dialog.offsetWidth));
  dialog.style.setProperty('--ball-y', String(rect.height / dialog.offsetHeight));
}

// Closes the dialog and resolves once its closing animation has finished (or
// right away when there is none), so whatever comes next isn't hidden behind it.
export function closeDialog(dialog) {
  dialog.close();
  const running = dialog.getAnimations?.() ?? [];
  if (!running.length) return Promise.resolve();
  const done = Promise.all(running.map(animation => animation.finished.catch(() => {})));
  const limit = new Promise(resolve => setTimeout(resolve, 700));
  return Promise.race([done, limit]);
}
