// Tile.js
// Tile class: represents a single cell in the 2048 board
// Author: giks
// Date: 2025-05-15

/**
 * Represents a single tile in the 2048 game board.
 * @class Tile
 */
class Tile {
    /**
     * Creates a new Tile instance.
     * @param {number} value - The value of the tile (default is 2).
     */
    constructor(value = 2) {
        this.value = value;
        this.merged = false; // Indicates if the tile has already merged this turn
    }

    /**
     * Checks if this tile can merge with another tile.
     * @param {Tile} otherTile - The other tile to check against.
     * @returns {boolean} True if the tiles can merge, false otherwise.
     */
    canMergeWith(otherTile) {
        return otherTile && this.value === otherTile.value && !this.merged && !otherTile.merged;
    }
}