import type { Board, Piece } from "./Structs";
import { initChessBoard } from "./InitBoard";
import { GameHist } from "./GameHist";

// game state class
export class GameState {
  board: Board;
  gameHist: GameHist;
  selectedPiece: Piece | null;
  isWhiteTurn: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isPromotion: boolean;
  notMoved: Array<Array<boolean>>; // isWhite? { isLeft? }

  constructor() {
    this.board = initChessBoard();
    this.gameHist = new GameHist();
    this.selectedPiece = null;
    this.isWhiteTurn = true;
    this.isCheck = false;
    this.isCheckmate = false;
    this.isStalemate = false;
    this.isPromotion = false;
    this.notMoved = [[true, true], [true, true]]; // whether the king or rook has moved (castling)
  }

  getNotMovedCanCastle(isWhite: boolean, isLeft: boolean): boolean {
    return this.notMoved[isWhite ? 1 : 0][isLeft ? 1 : 0];
  }

  setNotMovedCanCastle(isWhite: boolean, isLeft: boolean, value: boolean) {
    this.notMoved[isWhite ? 1 : 0][isLeft ? 1 : 0] = value;
  }

  clone(): GameState {
    let clone: GameState = new GameState();
    clone.board = this.board;
    clone.gameHist = this.gameHist;
    clone.selectedPiece = this.selectedPiece;
    clone.isWhiteTurn = this.isWhiteTurn;
    clone.isCheck = this.isCheck;
    clone.isCheckmate = this.isCheckmate;
    clone.isStalemate = this.isStalemate;
    clone.isPromotion = this.isPromotion;
    clone.notMoved = this.notMoved;
    return clone;
  }
}