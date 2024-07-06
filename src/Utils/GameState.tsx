import { Board, Piece } from "./Structs";
import { initChessBoard } from "./InitBoard";

// game state class
export class GameState {
  board: Board;
  history: History;
  selectedPiece: Piece | null;
  isWhiteTurn: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isPromotion: boolean;
  notMoved: Array<Array<boolean>>; // isWhite? { isLeft? }

  constructor() {
    this.board = initChessBoard();
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
}

// game state singleton
export let gs: GameState = new GameState();
