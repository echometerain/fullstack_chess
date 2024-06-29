import { GridPos } from "./GridCalc";
import { Board } from "./InitBoard";
import { Piece } from "./Piece";
// valid move checker (only pawns for now)
export const validMove = (piece: Piece, board: Board): Array<GridPos> | null => {
  switch (piece.typeChar) {
    case "p": return validPawnMove(piece, board);
  };
  return null;
};

// check if a pawn move is valid
const validPawnMove = (piece: Piece, board: Board): Array<GridPos> => {
  let validPositions: Array<GridPos> = [];
  let p1: GridPos = { x: piece.x, y: piece.y - 1 };


  if (board[p1.y][p1.x] === null) validPositions.push({ ...p1 });
  if (piece.x > 0) {
    p1.x = piece.x - 1;
    if (board[p1.y][p1.x]?.isWhite !== piece.isWhite)
      // capture the  black
      validPositions.push({ ...p1 });
  }
  if (piece.x < 7) {
    p1.x = piece.x + 1;
    if (
      board[p1.y][p1.x] !== null &&
      board[p1.y][p1.x]?.typeChar === board[p1.y][p1.x].name.toLowerCase()
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
