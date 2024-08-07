// white => top
// black => bottom

import { GameState } from "./GameState";
import type { GridPos, Piece } from "./Structs";

const axDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];  // 4 directions
const diDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];  // 4 diagonals

export class ValidMoves {
  gs: GameState;

  constructor(gs: GameState) {
    console.log("ValidMoves constructor");
    console.log(gs);
    this.gs = gs;
  }

  canGo = (piece: Piece, toPos: GridPos): boolean => {
    if (toPos.x < 0 || toPos.x >= 8 || toPos.y < 0 || toPos.y >= 8) return false;
    if (this.gs.board[toPos.y][toPos.x] === null) return true;
    return this.gs.board[toPos.y][toPos.x]?.isWhite !== piece.isWhite;
  }

  willCapture = (piece: Piece, toPos: GridPos): boolean => {
    if (toPos.x < 0 || toPos.x >= 8 || toPos.y < 0 || toPos.y >= 8) return false;
    if (this.gs.board[toPos.y][toPos.x] === null) return false;
    return this.gs.board[toPos.y][toPos.x]?.isWhite !== piece.isWhite;
  }

  // valid move checker (only pawns for now)
  getMoves = (piece: Piece): Array<GridPos> | null => {
    switch (piece.typeChar) {
      case "p": return this.validPawnMoves(piece);
      case "r": return this.validRookMoves(piece);
      case "n": return this.validKnightMoves(piece);
      case "b": return this.validBishopMoves(piece);
      case "q": return this.validQueenMoves(piece);
      case "k": return this.validKingMoves(piece);
      default: return this.validPawnMoves(piece); // can't return null
    };
  };

  validPawnMoves = (piece: Piece): Array<GridPos> => {
    let validPositions: Array<GridPos> = [];
    let forward = piece.isWhite ? -1 : 1; // white pawns move up, black pawns move down
    // first move can be 2 squares
    if ((piece.isWhite && piece.y === 6) || (!piece.isWhite && piece.y === 1)) {
      let f2 = { x: piece.x, y: piece.y + forward * 2 };
      if (this.canGo(piece, f2) && !this.willCapture(piece, f2)) // cannot capture by moving forward
        validPositions.push({ x: piece.x, y: piece.y + forward * 2 });
    }

    let f1: GridPos = { x: piece.x, y: piece.y + forward }; // one square forward
    if (this.canGo(piece, f1) && !this.willCapture(piece, f1)) validPositions.push(f1); // forward valid if empty

    // capture diagonally
    if (this.willCapture(piece, { x: f1.x - 1, y: f1.y })) {
      validPositions.push({ x: f1.x - 1, y: f1.y });
    }
    if (this.willCapture(piece, { x: f1.x + 1, y: f1.y })) {
      validPositions.push({ x: f1.x + 1, y: f1.y });
    }
    return validPositions;
  };

  validRookMoves = (piece: Piece): Array<GridPos> => {
    let validPositions: Array<GridPos> = [];
    // moving in 4 directions
    for (let dir of axDirs) {
      for (let i = 1; i < 8; i++) {
        let toPos: GridPos = { x: piece.x + dir[0] * i, y: piece.y + dir[1] * i };
        if (this.canGo(piece, toPos)) validPositions.push(toPos);
        else break;
        if (this.gs.board[toPos.y][toPos.x] !== null) break;
      }
    }
    console.log(validPositions);
    console.log(this.gs);
    return validPositions;
  }

  validKnightMoves = (piece: Piece): Array<GridPos> => {
    let validPositions: Array<GridPos> = [];
    let moveShape = [[2, 1], [1, 2]];
    for (let i = 0; i < moveShape.length; i++) {
      for (let j = 0; j < axDirs.length; j++) {
        let LShape: GridPos = { y: piece.y + moveShape[i][1] * diDirs[j][1], x: piece.x + moveShape[i][0] * diDirs[j][0] };
        if (this.canGo(piece, LShape)) validPositions.push(LShape);
      }
    }
    return validPositions;
  }

  validBishopMoves = (piece: Piece): Array<GridPos> => {
    let validPositions: Array<GridPos> = [];
    for (let dir of diDirs) {
      for (let i = 1; i < 8; i++) {
        let toPos: GridPos = { x: piece.x + dir[0] * i, y: piece.y + dir[1] * i };
        if (this.canGo(piece, toPos)) validPositions.push(toPos);
        else break;
        if (this.gs.board[toPos.y][toPos.x] !== null) break;
      }
    }
    return validPositions;
  }

  validQueenMoves = (piece: Piece): Array<GridPos> => {
    let validPositions: Array<GridPos> = [];
    validPositions.push(...this.validRookMoves(piece));
    validPositions.push(...this.validBishopMoves(piece));
    return validPositions;
  }

  validKingMoves = (piece: Piece): Array<GridPos> => {
    let validPositions: Array<GridPos> = [];
    for (let dir of axDirs) {
      let pos: GridPos = { x: piece.x + dir[0], y: piece.y + dir[1] };
      if (this.canGo(piece, pos)) validPositions.push(pos);
    }
    for (let dir of diDirs) {
      let pos: GridPos = { x: piece.x + dir[0], y: piece.y + dir[1] };
      if (this.canGo(piece, pos)) validPositions.push(pos);
    }
    return validPositions;
  }
}