// Entry point for the 2048 game. Initializes the game, sets up event listeners for user input, and handles game restarts.

import { Game } from './Game.js';
import { Board } from './Board.js';
import { Tile } from './Tile.js';

window.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const scoreElement = document.getElementById('score');
    const newGameBtn = document.getElementById('new-game');

    let game = new Game(Board, Tile, boardElement, scoreElement);

    // Starts a new game instance
    function startGame() {
        game = new Game(Board, Tile, boardElement, scoreElement);
    }

    newGameBtn.addEventListener('click', startGame);

    // Listen for keyboard input to move tiles
    document.addEventListener('keydown', (event) => {
        // Prevent default behavior for game keys
        const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'];
        if (gameKeys.includes(event.key)) {
            event.preventDefault();
        }
        
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                game.move('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                game.move('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                game.move('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                game.move('right');
                break;
            default:
                break;
        }
        
        // Test messages (temporary)
        if (event.key === 'v' || event.key === 'V') {
            // Test You Win message
            import('./animations.js').then(module => {
                module.showYouWinMessage();
            });
            return;
        }
        
        if (event.key === 'b' || event.key === 'B') {
            // Test Game Over message  
            import('./animations.js').then(module => {
                module.showGameOverMessage();
            });
            return;
        }
    });
});