// Game.js
// Game class: main controller for the 2048 game logic and UI
// Author: giks
// Date: 2025-05-15

/**
 * Main game controller for 2048. Handles game state, score, and rendering.
 * @class Game
 */
class Game {
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
        this.init();
    }

    /**
     * Initializes or resets the game state and board.
     */
    init() {
        this.score = 0;
        this.board.reset(this.TileClass);
        this.updateView();
    }

    /**
     * Handles a move in the given direction and updates the game state.
     * @param {string} direction - 'up', 'down', 'left', or 'right'.
     */
    move(direction) {
        let moveResult = this.board.moveWithScore(direction, this.TileClass);
        if (moveResult.moved) {
            this.score += moveResult.score;
            this.board.addRandomTile(this.TileClass);
            this.updateView();
            if (!this.board.hasMoves()) {
                setTimeout(() => alert('Game Over!'), 100);
            }
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
     * Renders the board and score in the UI.
     */
    updateView() {
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
        this.scoreElement.textContent = `Score: ${this.score}`;
    }
}