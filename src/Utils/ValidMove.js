export const validMove = (piece, board) => {
  if (piece.name === "P") {
    return validPawnMove(piece, board);
  }
};

const validPawnMove = (piece, board) => {
  let validPositions = [];
  if (piece.y === 0) {
    // return queens move
  }
  let p1 = {
    x: piece.x,
    y: piece.y - 1,
  };
  if (board[p1.y][p1.x] === null) validPositions.push({ ...p1 });
  if (piece.x > 0) {
    p1.x = piece.x - 1;
    if (
      board[p1.y][p1.x] !== null &&
      board[p1.y][p1.x].name === board[p1.y][p1.x].name.toLowerCase()
    )
      // capture the  black
      validPositions.push({ ...p1 });
  }
  if (piece.x < 7) {
    p1.x = piece.x + 1;
    if (
      board[p1.y][p1.x] !== null &&
      board[p1.y][p1.x].name === board[p1.y][p1.x].name.toLowerCase()
    )
      // capture the  black
      validPositions.push({ ...p1 });
  }
  if (piece.y === 6) {
    p1.x = piece.x;
    p1.y = piece.y - 2;
    if (board[p1.y][p1.x] === null) validPositions.push({ ...p1 });
  }
  return validPositions;
};
