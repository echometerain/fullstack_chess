// single chess piece
export type Piece = {
  typeChar: string;
  isWhite: boolean;
  x: number;
  y: number;
  isSelected: boolean;
  spritePos: number; // position of sprite in spritesheet
}

// grid position
export type GridPos = {
  x: number;
  y: number;
}

export type ChessMove = {
  from: GridPos;
  to: GridPos;
  promotion: boolean;
}

// game board
export type Board = Array<Array<Piece | null>>;
