import { Piece } from "./Piece";

export type Board = Array<Array<Piece | null>>;

// create back row
const getRow = (isWhite: boolean): Array<Piece> => {
  let fen: String = "rnbqkbnr";
  let row: Array<Piece> = [];
  for (let i = 0; i < fen.length; i++) {
    let piece: Piece = {
      typeChar: fen[i],
      isWhite: isWhite,
      x: i,
      y: isWhite ? 7 : 0,
      isSelected: false,
      spritePos: i < 5 ? i : 7 - i
    };
    row.push(piece);
  }
  return row;
};

// create front (pawn) row
const getPawnRow = (isWhite: boolean): Array<Piece> => {
  // color 0 black, 1 white
  let row: Array<Piece> = [];
  for (let i = 0; i < 8; i++) {
    let piece: Piece = {
      typeChar: 'p',
      isWhite: isWhite,
      x: i,
      y: isWhite ? 6 : 1,
      spritePos: 5,
      isSelected: false,
    };
    row.push(piece);
  }
  return row;
};

// initialize board
export const initChessBoard = (): Board => {
  let board: Array<Array<Piece | null>> = [];
  board.push(getRow(false));
  board.push(getPawnRow(false));
  for (let i = 0; i < 4; i++) {
    let row: Array<Piece | null> = [];
    for (let j = 0; j < 8; j++) {
      row.push(null);
    }
    board.push(row);
  }
  board.push(getPawnRow(true));
  board.push(getRow(true));
  return board;
};
