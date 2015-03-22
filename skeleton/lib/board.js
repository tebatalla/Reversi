var Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  var arr = new Array(8);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(8);
  }
  arr[3][4] = new Piece("black");
  arr[4][3] = new Piece("black");
  arr[3][3] = new Piece("white");
  arr[4][4] = new Piece("white");
  return arr;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!!this.grid[pos[0]][pos[1]]) {
    return this.grid[pos[0]][pos[1]];
  }
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  var piece = this.grid[pos[0]][pos[1]];
  if (!piece) {
    return false;
  }
  return piece.color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return !!this.grid[pos[0]][pos[1]];
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return this.validMoves("black").length === 0 && this.validMoves("white").length === 0;
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  return !(pos[0] < 0 || pos[1] < 0 ||
    pos[0] > this.grid.length || pos[1] > this.grid[0].length);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  if (!board.isValidPos(pos)) {
    return null;
  } else if (!board.isOccupied(pos)) {
    return null;
  } else if (board.isMine(pos, color)) {
    return (piecesToFlip.length === 0) ? null : piecesToFlip;
  } else {
    piecesToFlip.push(board.getPiece(pos));
  }
  pos[0] += dir[0];
  pos[1] += dir[1];

  return _positionsToFlip(board, pos, color, dir, piecesToFlip);
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error("Invalid Move");
  } else {
    for(var dir in this.DIRS) {
      for(var piece in _positionsToFlip(this, pos, color, dir, [])) {
        piece.flip();
      }
    }
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }
  var positions = [];
  for(var dir in Board.DIRS) {
    positions.push(_positionsToFlip(this, pos, color, dir, []));
  }
  return !!positions.length;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  var positions = [];
  var validMoves = [];
  for (var i = 0; i < this.grid.length; i++) {
    for (var j = 0; j < this.grid[i].length; j++) {
      if(!this.isOccupied([i, j])) {
        positions.push([i, j]);
      }
    }
  }
  for (var k = 0; k < positions.length; k++) {
    if(this.validMove(positions[k], color)){
      validMoves.push(positions[k]);
    }
  }
  return validMoves;
};

module.exports = Board;
