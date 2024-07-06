import { gs } from "./GameState";
import { GridPos, Piece } from "./Structs";

const axDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];  // 4 directions
const diDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];  // 4 diagonals

export const canGo = (piece: Piece, toPos: GridPos): boolean => {
  if (piece.x < 0 || piece.x >= 8 || piece.y < 0 || piece.y >= 8) return false;
  if (gs.board[toPos.y][toPos.x]?.isWhite === piece.isWhite) return false;
  return true;
}

export const willCapture = (piece: Piece, toPos: GridPos): boolean => {
  if (piece.x < 0 || piece.x >= 8 || piece.y < 0 || piece.y >= 8) return false;
  if (gs.board[toPos.y][toPos.x] === null) return false;
  return gs.board[toPos.y][toPos.x]?.isWhite !== piece.isWhite;
}

// valid move checker (only pawns for now)
export const validMoves = (piece: Piece): Array<GridPos> | null => {
  switch (piece.typeChar) {
    case "p": return validPawnMoves(piece);
    case "r": return validRookMoves(piece);
    case "n": return validKnightMoves(piece);
    case "b": return validBishopMoves(piece);
    case "q": return validQueenMoves(piece);
    case "k": return validKingMoves(piece);
    default: return validPawnMoves(piece); // can't return null
  };
};

const validPawnMoves = (piece: Piece): Array<GridPos> => {
  let validPositions: Array<GridPos> = [];
  let forward = piece.isWhite ? -1 : 1; // white pawns move up, black pawns move down
  // first move can be 2 squares
  if ((piece.isWhite && piece.y === 6) || (!piece.isWhite && piece.y === 1)) {
    let f2 = { x: piece.x, y: piece.y + forward * 2 };
    if (canGo(piece, f2) && !willCapture(piece, f2)) // cannot capture by moving forward
      validPositions.push({ x: piece.x, y: piece.y + forward * 2 });
  }

  let f1: GridPos = { x: piece.x, y: piece.y + forward }; // one square forward
  if (canGo(piece, f1) && !willCapture(piece, f1)) validPositions.push(f1); // forward valid if empty

  // capture diagonally
  if (canGo(piece, { x: f1.x - 1, y: f1.y })) validPositions.push({ x: f1.x - 1, y: f1.y });
  if (canGo(piece, { x: f1.x + 1, y: f1.y })) validPositions.push({ x: f1.x + 1, y: f1.y });
  return validPositions;
};

const validRookMoves = (piece: Piece): Array<GridPos> => {
  let validPositions: Array<GridPos> = [];
  // moving in 4 directions
  for (let dir of axDirs) {
    for (let i = 1; i < 8; i++) {
      let toPos: GridPos = { x: piece.x + dir[0] * i, y: piece.y + dir[1] * i };
      if (canGo(piece, toPos)) validPositions.push(toPos);
      else break;
      if (gs.board[toPos.y][toPos.x] !== null) break;
    }
  }

  // castling shouldn't be implemented here
  // // castling (NOT DONE)
  // let right = piece.isWhite ? 1 : -1;
  // if (gs.getNotMovedCanCastle(piece.isWhite, true))
  //   validPositions.push({ x: piece.x + right * 3, y: piece.y });
  // if (gs.getNotMovedCanCastle(piece.isWhite, false)) validPositions.push({ x: piece.x - right * 2, y: piece.y });
  return validPositions;
}

const validKnightMoves = (piece: Piece): Array<GridPos> => {
  let validPositions: Array<GridPos> = [];
  let moveShape = [[2, 1], [1, 2]];
  for (let i = 0; i < moveShape.length; i++) {
    for (let j = 0; j < axDirs.length; j++) {
      let LShape: GridPos = { x: moveShape[i][0] * axDirs[j][0], y: moveShape[i][1] * axDirs[j][1] };
      if (canGo(piece, LShape)) validPositions.push(LShape);
    }
  }
  return validPositions;
}

const validBishopMoves = (piece: Piece): Array<GridPos> => {
  let validPositions: Array<GridPos> = [];
  for (let dir of diDirs) {
    for (let i = 1; i < 8; i++) {
      let toPos: GridPos = { x: piece.x + dir[0] * i, y: piece.y + dir[1] * i };
      if (canGo(piece, toPos)) validPositions.push(toPos);
      else break;
      if (gs.board[toPos.y][toPos.x] !== null) break;
    }
  }
  return validPositions;
}

const validQueenMoves = (piece: Piece): Array<GridPos> => {
  let validPositions: Array<GridPos> = [];
  validPositions.push(...validRookMoves(piece));
  validPositions.push(...validBishopMoves(piece));
  return validPositions;
}

const validKingMoves = (piece: Piece): Array<GridPos> => {
  let validPositions: Array<GridPos> = [];
  for (let dir of axDirs) {
    let pos: GridPos = { x: piece.x + dir[0], y: piece.y + dir[1] };
    if (canGo(piece, pos)) validPositions.push(pos);
  }
  for (let dir of diDirs) {
    let pos: GridPos = { x: piece.x + dir[0], y: piece.y + dir[1] };
    if (canGo(piece, pos)) validPositions.push(pos);
  }
  return validPositions;
}