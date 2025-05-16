// Animations for tile movement, appearance, and merging in 2048.
// Use the classes: .move, .new, .merge on cell elements.

/**
 * Applies movement animation to a cell.
 * @param {HTMLElement} cell - Cell element.
 * @param {number} fromX - X difference in px.
 * @param {number} fromY - Y difference in px.
 */
export function animateMove(cell, fromX, fromY) {
  cell.style.setProperty('--from-x', `${fromX}px`);
  cell.style.setProperty('--from-y', `${fromY}px`);
  cell.classList.add('move');
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('move');
    cell.style.removeProperty('--from-x');
    cell.style.removeProperty('--from-y');
    cell.removeEventListener('animationend', handler);
  });
}

/**
 * Applies appearance animation to a new cell.
 * @param {HTMLElement} cell - Cell element.
 */
export function animateAppear(cell) {
  cell.classList.add('new');
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('new');
    cell.removeEventListener('animationend', handler);
  });
}

/**
 * Applies merge animation to a cell.
 * @param {HTMLElement} cell - Cell element.
 */
export function animateMerge(cell) {
  cell.classList.add('merge');
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('merge');
    cell.removeEventListener('animationend', handler);
  });
}
