// Game.js
// Game class: main controller for the 2048 game logic and UI
// Author: giks
// Date: 2025-05-15

import { animateMove, animateMerge, animateStuck, showYouWinMessage, showGameOverMessage } from './animations.js';

/**
 * Main game controller for 2048. Handles game state, score, and rendering.
 * @class Game
 */
export class Game {
    /**
     * Creates a new Game instance.
     * @param {typeof Board} BoardClass - The Board class.
     * @param {typeof Tile} TileClass - The Tile class.
     * @param {HTMLElement} boardElement - The DOM element for the board.
     * @param {HTMLElement} scoreElement - The DOM element for the score display.
     */
    constructor(BoardClass, TileClass, boardElement, scoreElement) {
        this.BoardClass = BoardClass;
        this.TileClass = TileClass;
        this.boardElement = boardElement;
        this.scoreElement = scoreElement;
        this.score = 0;
        this.board = new BoardClass();
        this.hasWon = false; // Track if player has reached 2048
        this.lastMoveTime = 0; // Track timing for rapid inputs
        this.isAnimating = false; // Simple animation state
        this.init();
    }

    /**
     * Initializes or resets the game state and board.
     */
    init() {
        this.score = 0;
        this.hasWon = false;
        this.lastMoveTime = 0;
        this.isAnimating = false;
        this.board.reset(this.TileClass);
        this.updateView();
    }

    /**
     * Handles a move in the given direction - INSTANT RESPONSE
     * @param {string} direction - 'up', 'down', 'left', or 'right'.
     */
    move(direction) {
        const currentTime = Date.now();
        const timeSinceLastMove = currentTime - this.lastMoveTime;
        
        // Store current board state for animation comparison
        const previousState = this.captureCurrentState();
        
        // Execute move immediately - no waiting!
        let moveResult = this.board.moveWithScore(direction, this.TileClass);
        
        if (moveResult.moved) {
            this.lastMoveTime = currentTime;
            this.score += moveResult.score;
            
            // Determine animation type based on input speed
            const isRapidInput = timeSinceLastMove < 150; // Less than 150ms = rapid
            
            if (isRapidInput) {
                // Rapid input: immediate update with minimal visual feedback
                this.board.addRandomTile(this.TileClass);
                this.updateView();
                // Ultra-subtle board feedback
                this.boardElement.style.transform = 'scale(0.999)';
                setTimeout(() => {
                    this.boardElement.style.transform = '';
                }, 25);
            } else {
                // Normal input: smooth animation experience
                this.animateMovements(previousState, direction);
                setTimeout(() => {
                    this.board.addRandomTile(this.TileClass);
                    this.updateView();
                }, 80); // Match 0.08s animation time
            }
            
            // Check game state
            this.checkWinCondition();
            if (!this.board.hasMoves()) {
                setTimeout(() => this.showGameOverMessage(), 100);
            }
        } else {
            // No movement possible - quick stuck animation
            this.showStuckAnimationQuick();
        }
    }

    /**
     * Updates the score based on the current board state.
     */
    updateScore() {
        let score = 0;
        for (let r = 0; r < this.board.size; r++) {
            for (let c = 0; c < this.board.size; c++) {
                const tile = this.board.grid[r][c];
                if (tile) score += tile.value;
            }
        }
        this.score = score;
    }

    /**
     * Checks if the player has reached 2048 and shows win message.
     */
    checkWinCondition() {
        if (this.hasWon) return; // Already won, don't show message again
        
        for (let r = 0; r < this.board.size; r++) {
            for (let c = 0; c < this.board.size; c++) {
                const tile = this.board.grid[r][c];
                if (tile && tile.value >= 2048) {
                    this.hasWon = true;
                    setTimeout(() => showYouWinMessage(), 500);
                    return;
                }
            }
        }
    }

    /**
     * Shows stuck animation on all tiles when no movement is possible.
     */
    showStuckAnimation() {
        this.showStuckAnimationQuick(); // Use the quick version for consistency
    }

    /**
     * Shows the Game Over message.
     */
    showGameOverMessage() {
        showGameOverMessage();
    }

    /**
     * Captures the current state of the board for animation comparison.
     */
    captureCurrentState() {
        const state = [];
        for (let r = 0; r < this.board.size; r++) {
            state[r] = [];
            for (let c = 0; c < this.board.size; c++) {
                const tile = this.board.grid[r][c];
                state[r][c] = tile ? { value: tile.value } : null;
            }
        }
        return state;
    }

    /**
     * Animates tile movements from previous state to current state.
     */
    animateMovements(previousState, direction) {
        // Update view first to get new DOM structure
        this.updateViewWithoutAnimation();
        
        const cells = this.boardElement.querySelectorAll('.cell');
        const cellSize = 74; // Cell size in pixels (64px + 10px gap)
        
        for (let r = 0; r < this.board.size; r++) {
            for (let c = 0; c < this.board.size; c++) {
                const currentTile = this.board.grid[r][c];
                const cell = cells[r * this.board.size + c];
                
                if (currentTile) {
                    // Find where this tile came from
                    const origin = this.findTileOrigin(previousState, currentTile, r, c, direction);
                    if (origin && (origin.r !== r || origin.c !== c)) {
                        // Calculate movement distance
                        const deltaX = (origin.c - c) * cellSize;
                        const deltaY = (origin.r - r) * cellSize;
                        
                        // Strict bounds checking - only allow movement within the 4x4 grid
                        const maxDistance = cellSize * 3; // Maximum 3 cells movement
                        const clampedDeltaX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
                        const clampedDeltaY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));
                        
                        // Additional safety: ensure movement doesn't exceed board boundaries
                        const safeX = Math.abs(clampedDeltaX) <= 222 ? clampedDeltaX : 0;
                        const safeY = Math.abs(clampedDeltaY) <= 222 ? clampedDeltaY : 0;
                        
                        // Apply movement animation only if safe
                        if (safeX !== 0 || safeY !== 0) {
                            animateMove(cell, safeX, safeY);
                        }
                    }
                }
            }
        }
    }

    /**
     * Finds the original position of a tile before movement.
     */
    findTileOrigin(previousState, currentTile, currentR, currentC, direction) {
        // For merged tiles, find the closest matching tile in the movement direction
        if (direction === 'up') {
            for (let r = currentR; r < this.board.size; r++) {
                if (previousState[r][currentC] && previousState[r][currentC].value === currentTile.value) {
                    return { r, c: currentC };
                }
            }
        } else if (direction === 'down') {
            for (let r = currentR; r >= 0; r--) {
                if (previousState[r][currentC] && previousState[r][currentC].value === currentTile.value) {
                    return { r, c: currentC };
                }
            }
        } else if (direction === 'left') {
            for (let c = currentC; c < this.board.size; c++) {
                if (previousState[currentR][c] && previousState[currentR][c].value === currentTile.value) {
                    return { r: currentR, c };
                }
            }
        } else if (direction === 'right') {
            for (let c = currentC; c >= 0; c--) {
                if (previousState[currentR][c] && previousState[currentR][c].value === currentTile.value) {
                    return { r: currentR, c };
                }
            }
        }
        return null;
    }

    /**
     * Updates the view without triggering appearance animations.
     */
    updateViewWithoutAnimation() {
        this.boardElement.innerHTML = '';
        for (let r = 0; r < this.board.size; r++) {
            for (let c = 0; c < this.board.size; c++) {
                const tile = this.board.grid[r][c];
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (tile) {
                    cell.textContent = tile.value;
                    cell.setAttribute('data-value', tile.value);
                } else {
                    cell.textContent = '';
                }
                this.boardElement.appendChild(cell);
            }
        }
        this.scoreElement.textContent = this.score;
        const bestScoreElement = document.getElementById('best-score');
        if (bestScoreElement) {
            const currentBest = parseInt(localStorage.getItem('bestScore') || 0);
            if (this.score > currentBest) {
                localStorage.setItem('bestScore', this.score);
            }
            bestScoreElement.textContent = localStorage.getItem('bestScore') || 0;
        }
    }

    /**
     * Renders the board and score in the UI.
     */
    updateView() {
        const previousCells = Array.from(this.boardElement.querySelectorAll('.cell'));
        const previousGrid = [];
        
        // Store previous state for animation comparison
        for (let i = 0; i < previousCells.length; i++) {
            const r = Math.floor(i / this.board.size);
            const c = i % this.board.size;
            if (!previousGrid[r]) previousGrid[r] = [];
            previousGrid[r][c] = previousCells[i].textContent || null;
        }
        
        this.boardElement.innerHTML = '';
        for (let r = 0; r < this.board.size; r++) {
            for (let c = 0; c < this.board.size; c++) {
                const tile = this.board.grid[r][c];
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (tile) {
                    cell.textContent = tile.value;
                    cell.setAttribute('data-value', tile.value);
                    
                    // No animation for new tiles - they appear instantly
                    
                    // Animate merged tiles (value increased)
                    if (previousGrid[r] && previousGrid[r][c] && 
                        parseInt(previousGrid[r][c]) < tile.value) {
                        setTimeout(() => animateMerge(cell), 50);
                    }
                } else {
                    cell.textContent = '';
                }
                this.boardElement.appendChild(cell);
            }
        }
        this.scoreElement.textContent = this.score; // Only the number, no label
        const bestScoreElement = document.getElementById('best-score');
        if (bestScoreElement) {
            const currentBest = parseInt(localStorage.getItem('bestScore') || 0);
            if (this.score > currentBest) {
                localStorage.setItem('bestScore', this.score);
            }
            bestScoreElement.textContent = localStorage.getItem('bestScore') || 0;
        }
    }

    /**
     * Shows quick stuck animation for rapid inputs.
     */
    showStuckAnimationQuick() {
        // Very subtle feedback for invalid moves
        this.boardElement.style.filter = 'brightness(0.95)';
        setTimeout(() => {
            this.boardElement.style.filter = '';
        }, 50);
    }
}