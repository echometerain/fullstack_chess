import { Board } from "./InitBoard";
import { Piece } from "./Piece";
// graphical constants
const PIECEWIDTH = 56;
const PIECEHIGHT = 60;
const XOFFSET = 28;
const MARGIN_LEFT = 20;
const MARGIN_TOP = 50;

export type GridPos = {
  x: number;
  y: number;
}

// calculate grid position based on pixel coordinate
export const pixToGrid = (coordX: number, coordY: number): GridPos | null => {
  var gridPos: GridPos = {
    x: Math.floor((coordX - MARGIN_LEFT - XOFFSET) / PIECEWIDTH), // board x position
    y: Math.floor((coordY - MARGIN_TOP - XOFFSET) / PIECEHIGHT), // board y position
  };
  if (gridPos.x >= 0 && gridPos.x < 8 && gridPos.y >= 0 && gridPos.y < 8) return gridPos;
  return null;
};

// get piece at location
export const pixToPiece = (coordX: number, coordY: number, board: Board): Piece | null => {
  let gridPos = pixToGrid(coordX, coordY);
  if (gridPos === null) return null;
  return board[gridPos.x][gridPos.y];
};