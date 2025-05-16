// This file serves as the entry point for the game. It initializes the game by creating instances of Game and Board, and sets up event listeners for user input.

// Inicialización del juego y conexión con la interfaz
window.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const scoreElement = document.getElementById('score');
    const newGameBtn = document.getElementById('new-game');

    let game = new Game(Board, Tile, boardElement, scoreElement);

    function startGame() {
        game = new Game(Board, Tile, boardElement, scoreElement);
    }

    newGameBtn.addEventListener('click', startGame);

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