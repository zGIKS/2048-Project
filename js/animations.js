// Animations for tile movement, appearance, and merging in 2048.
// Use the classes: .move, .new, .merge on cell elements.

/**
 * Applies movement animation to a cell.
 * @param {HTMLElement} cell - Cell element.
 * @param {number} fromX - X difference in px.
 * @param {number} fromY - Y difference in px.
 */
export function animateMove(cell, fromX, fromY) {
  // Safety bounds check
  const safeFromX = Math.max(-222, Math.min(222, fromX));
  const safeFromY = Math.max(-222, Math.min(222, fromY));
  
  cell.style.setProperty('--from-x', `${safeFromX}px`);
  cell.style.setProperty('--from-y', `${safeFromY}px`);
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
 * Applies merge animation to a cell with boom effect.
 * @param {HTMLElement} cell - Cell element.
 */
export function animateMerge(cell) {
  cell.classList.add('merge');
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('merge');
    cell.removeEventListener('animationend', handler);
  });
}

/**
 * Applies stuck animation when cells cannot move.
 * @param {HTMLElement} cell - Cell element.
 */
export function animateStuck(cell) {
  cell.classList.add('stuck');
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('stuck');
    cell.removeEventListener('animationend', handler);
  });
}

/**
 * Shows the "You Win!" message when reaching 2048.
 */
export function showYouWinMessage() {
  // Remove existing messages
  const existingWinMessage = document.querySelector('.you-win-message');
  const existingGameOverMessage = document.querySelector('.game-over-message');
  if (existingWinMessage) existingWinMessage.remove();
  if (existingGameOverMessage) existingGameOverMessage.remove();

  // Create and show new message
  const message = document.createElement('div');
  message.className = 'you-win-message';
  message.innerHTML = '<div>You Win!</div>';
  
  // Append to game container (not body)
  const gameContainer = document.querySelector('.game-container');
  gameContainer.appendChild(message);

  // Auto-remove after animation
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 6000); // Increased time for longer animation
}

/**
 * Shows the "Game Over!" message when no moves are possible.
 */
export function showGameOverMessage() {
  // Remove existing messages
  const existingWinMessage = document.querySelector('.you-win-message');
  const existingGameOverMessage = document.querySelector('.game-over-message');
  if (existingWinMessage) existingWinMessage.remove();
  if (existingGameOverMessage) existingGameOverMessage.remove();

  // Create and show new message
  const message = document.createElement('div');
  message.className = 'game-over-message';
  message.innerHTML = '<div>Game Over!</div>';
  
  // Append to game container (not body)
  const gameContainer = document.querySelector('.game-container');
  gameContainer.appendChild(message);

  // Auto-remove after animation
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 6000); // Increased time for longer animation
}
