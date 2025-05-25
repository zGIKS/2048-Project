// Animations for tile movement, appearance, and merging in 2048.
// Use the classes: .move, .new, .merge on cell elements.

/**
 * Applies movement animation to a cell with smooth, consistent motion.
 * @param {HTMLElement} cell - Cell element.
 * @param {number} fromX - X difference in px.
 * @param {number} fromY - Y difference in px.
 */
export function animateMove(cell, fromX, fromY) {
  // Determine if it's a new tile or an existing tile
  const isNewTile = cell.classList.contains('new');
  
  // Calculate distance for animation duration adjustment
  const distance = Math.sqrt(fromX * fromX + fromY * fromY);
  
  // Set position properties without random variations
  cell.style.setProperty('--from-x', `${fromX}px`);
  cell.style.setProperty('--from-y', `${fromY}px`);
  
  // Adjust animation duration based on distance for natural movement
  const additionalDuration = Math.min(0.15, distance / 1200);
  const baseDuration = isNewTile ? 0.85 : 0.8;
  cell.style.animationDuration = `${baseDuration + additionalDuration}s`;
  
  // Ensure tile visibility during movement
  cell.style.zIndex = isNewTile ? "4" : "2";
  
  cell.classList.add('move');
  
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('move');
    cell.style.removeProperty('--from-x');
    cell.style.removeProperty('--from-y');
    cell.style.removeProperty('animation-duration');
    cell.style.removeProperty('z-index');
    
    // Add subtle settling effect for longer movements
    if (distance > 100) {
      setTimeout(() => {
        cell.style.transition = "transform 0.15s ease-out";
        cell.style.transform = "translateY(1px)";
        
        setTimeout(() => {
          cell.style.transform = "";
          setTimeout(() => {
            cell.style.removeProperty('transition');
          }, 100);
        }, 100);
      }, 30);
    }
    
    cell.removeEventListener('animationend', handler);
  });
}

/**
 * Applies appearance animation to a new cell with smooth motion.
 * @param {HTMLElement} cell - Cell element.
 */
export function animateAppear(cell) {
  // Ensure new tiles are visible above others
  cell.style.zIndex = "3";
  
  // Apply bounce effect animation
  cell.classList.add('new');
  
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('new');
    cell.style.removeProperty('z-index');
    
    // Add subtle settling effect after appearing
    setTimeout(() => {
      cell.style.transition = "transform 0.15s ease-out";
      cell.style.transform = "translateY(1px)";
      
      setTimeout(() => {
        cell.style.transform = "";
        setTimeout(() => {
          cell.style.removeProperty('transition');
        }, 150);
      }, 150);
    }, 50);
    
    cell.removeEventListener('animationend', handler);
  });
}

/**
 * Applies merge animation to a cell with enhanced visual feedback.
 * @param {HTMLElement} cell - Cell element.
 */
export function animateMerge(cell) {
  // Ensure the animation is visible above other cells
  cell.style.zIndex = "5";
  
  cell.classList.add('merge');
  
  // Optional: Add audio feedback for merge animation
  // Implementation would go here if game supports audio
  
  cell.addEventListener('animationend', function handler() {
    cell.classList.remove('merge');
    cell.style.removeProperty('z-index');
    
    // Add subtle settling effect after merging
    setTimeout(() => {
      cell.style.transition = "transform 0.1s ease-in-out";
      cell.style.transform = "translateY(2px)";
      
      setTimeout(() => {
        cell.style.transform = "translateY(0)";
        
        setTimeout(() => {
          cell.style.removeProperty('transition');
          cell.style.removeProperty('transform');
        }, 100);
      }, 100);
    }, 50);
    
    cell.removeEventListener('animationend', handler);
  });
}
