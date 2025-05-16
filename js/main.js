// Entry point for the 2048 game. Initializes the game, sets up event listeners for user input, and handles game restarts.
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
    });
});