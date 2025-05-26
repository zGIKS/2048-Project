// Board.js
// Board class: handles the logic and state of the 2048 game board
// Author: giks
// Date: 2025-05-15

/**
 * Class representing the board and its logic for the 2048 game.
 * @class Board
 */
export class Board {
    /**
     * Creates a Board instance.
     * @param {number} size - Board size (default is 4).
     */
    constructor(size = 4) {
        this.size = size;
        this.grid = this.createEmptyBoard();
    }

    /**
     * Creates an empty board.
     * @returns {Array<Array<Tile|null>>} Empty board.
     */
    createEmptyBoard() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(null));
    }

    /**
     * Gets the empty cells of the board.
     * @returns {Array<{r: number, c: number}>} List of empty positions.
     */
    getEmptyCells() {
        const empty = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (!this.grid[r][c]) empty.push({ r, c });
            }
        }
        return empty;
    }

    /**
     * Adds a new random tile (2 or 4) in an empty cell.
     * @param {typeof Tile} TileClass - Tile class.
     * @returns {boolean} True if a tile was added, false if no space.
     */
    addRandomTile(TileClass) {
        const empty = this.getEmptyCells();
        if (empty.length === 0) return false;
        const { r, c } = empty[Math.floor(Math.random() * empty.length)];
        this.grid[r][c] = new TileClass(Math.random() < 0.9 ? 2 : 4);
        return true;
    }

    /**
     * Resets the board and places two random tiles (always 2 at start, as in original 2048).
     * @param {typeof Tile} TileClass - Tile class.
     */
    reset(TileClass) {
        this.grid = this.createEmptyBoard();
        // Always start with two tiles of value 2
        const empty = this.getEmptyCells();
        if (empty.length < 2) return;
        // Place two 2's in random empty positions
        let idx1 = Math.floor(Math.random() * empty.length);
        let pos1 = empty[idx1];
        this.grid[pos1.r][pos1.c] = new TileClass(2);
        empty.splice(idx1, 1);
        let idx2 = Math.floor(Math.random() * empty.length);
        let pos2 = empty[idx2];
        this.grid[pos2.r][pos2.c] = new TileClass(2);
    }

    /**
     * Performs a move in the given direction and merges tiles.
     * @param {string} direction - 'up', 'down', 'left', 'right'.
     * @param {typeof Tile} TileClass - Tile class.
     * @returns {boolean} True if there was a move, false otherwise.
     */
    move(direction, TileClass) {
        let moved = false;
        // Reset merged state for all tiles
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c]) this.grid[r][c].merged = false;
            }
        }
        if (direction === 'up') {
            for (let c = 0; c < this.size; c++) {
                let line = [];
                for (let r = 0; r < this.size; r++) {
                    line.push(this.grid[r][c]);
                }
                let { newLine } = this.slideAndMerge(line, TileClass);
                for (let r = 0; r < this.size; r++) {
                    if (this.grid[r][c] !== newLine[r]) moved = true;
                    this.grid[r][c] = newLine[r];
                }
            }
        } else if (direction === 'down') {
            for (let c = 0; c < this.size; c++) {
                let line = [];
                for (let r = 0; r < this.size; r++) {
                    line.push(this.grid[r][c]);
                }
                line.reverse();
                let { newLine } = this.slideAndMerge(line, TileClass);
                newLine.reverse();
                for (let r = 0; r < this.size; r++) {
                    if (this.grid[r][c] !== newLine[r]) moved = true;
                    this.grid[r][c] = newLine[r];
                }
            }
        } else if (direction === 'left') {
            for (let r = 0; r < this.size; r++) {
                let line = [];
                for (let c = 0; c < this.size; c++) {
                    line.push(this.grid[r][c]);
                }
                let { newLine } = this.slideAndMerge(line, TileClass);
                for (let c = 0; c < this.size; c++) {
                    if (this.grid[r][c] !== newLine[c]) moved = true;
                    this.grid[r][c] = newLine[c];
                }
            }
        } else if (direction === 'right') {
            for (let r = 0; r < this.size; r++) {
                let line = [];
                for (let c = 0; c < this.size; c++) {
                    line.push(this.grid[r][c]);
                }
                line.reverse();
                let { newLine } = this.slideAndMerge(line, TileClass);
                newLine.reverse();
                for (let c = 0; c < this.size; c++) {
                    if (this.grid[r][c] !== newLine[c]) moved = true;
                    this.grid[r][c] = newLine[c];
                }
            }
        }
        return moved;
    }

    /**
     * Performs a move in the given direction and merges tiles. Returns if there was a move and the score gained.
     * @param {string} direction - 'up', 'down', 'left', 'right'.
     * @param {typeof Tile} TileClass - Tile class.
     * @returns {{moved: boolean, score: number}} Move result and score gained.
     */
    moveWithScore(direction, TileClass) {
        let moved = false;
        let totalScore = 0;
        // Reset merged state for all tiles
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c]) this.grid[r][c].merged = false;
            }
        }
        if (direction === 'up') {
            for (let c = 0; c < this.size; c++) {
                let line = [];
                for (let r = 0; r < this.size; r++) {
                    line.push(this.grid[r][c]);
                }
                let { newLine, mergedScore } = this.slideAndMerge(line, TileClass);
                totalScore += mergedScore;
                for (let r = 0; r < this.size; r++) {
                    if (this.grid[r][c] !== newLine[r]) moved = true;
                    this.grid[r][c] = newLine[r];
                }
            }
        } else if (direction === 'down') {
            for (let c = 0; c < this.size; c++) {
                let line = [];
                for (let r = 0; r < this.size; r++) {
                    line.push(this.grid[r][c]);
                }
                line.reverse();
                let { newLine, mergedScore } = this.slideAndMerge(line, TileClass);
                newLine.reverse();
                totalScore += mergedScore;
                for (let r = 0; r < this.size; r++) {
                    if (this.grid[r][c] !== newLine[r]) moved = true;
                    this.grid[r][c] = newLine[r];
                }
            }
        } else if (direction === 'left') {
            for (let r = 0; r < this.size; r++) {
                let line = [];
                for (let c = 0; c < this.size; c++) {
                    line.push(this.grid[r][c]);
                }
                let { newLine, mergedScore } = this.slideAndMerge(line, TileClass);
                totalScore += mergedScore;
                for (let c = 0; c < this.size; c++) {
                    if (this.grid[r][c] !== newLine[c]) moved = true;
                    this.grid[r][c] = newLine[c];
                }
            }
        } else if (direction === 'right') {
            for (let r = 0; r < this.size; r++) {
                let line = [];
                for (let c = 0; c < this.size; c++) {
                    line.push(this.grid[r][c]);
                }
                line.reverse();
                let { newLine, mergedScore } = this.slideAndMerge(line, TileClass);
                newLine.reverse();
                totalScore += mergedScore;
                for (let c = 0; c < this.size; c++) {
                    if (this.grid[r][c] !== newLine[c]) moved = true;
                    this.grid[r][c] = newLine[c];
                }
            }
        }
        return { moved, score: totalScore };
    }

    /**
     * Slides and merges a line of tiles according to 2048 rules.
     * @param {Array<Tile|null>} line - Line of tiles.
     * @param {typeof Tile} TileClass - Tile class.
     * @returns {{newLine: Array<Tile|null>, mergedScore: number}} Resulting line and the score gained from merges.
     */
    slideAndMerge(line, TileClass) {
        let arr = line.filter(tile => tile !== null);
        let mergedScore = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] && arr[i + 1] && arr[i].canMergeWith(arr[i + 1])) {
                arr[i].value *= 2;
                mergedScore += arr[i].value; // Add only the value of the new merged tile
                arr[i].merged = true;
                arr.splice(i + 1, 1);
                arr.push(null);
            }
        }
        while (arr.length < line.length) arr.push(null);
        return { newLine: arr, mergedScore };
    }

    /**
     * Checks if there are possible moves on the board.
     * @returns {boolean} True if there are possible moves, false otherwise.
     */
    hasMoves() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = this.grid[r][c];
                if (!tile) return true;
                for (const [dr, dc] of [[0,1],[1,0],[-1,0],[0,-1]]) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
                        const neighbor = this.grid[nr][nc];
                        if (neighbor && tile.value === neighbor.value) return true;
                    }
                }
            }
        }
        return false;
    }
}