import { gs } from "./GameState";
import { GridPos, Piece } from "./Structs";
// graphical constants
const PIECEWIDTH = 56;
const PIECEHIGHT = 60;
const XOFFSET = 28;
const MARGIN_LEFT = 20;
const MARGIN_TOP = 50;

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
export const pixToPiece = (coordX: number, coordY: number): Piece | null => {
  let gridPos = pixToGrid(coordX, coordY);
  if (gridPos === null) return null;
  return gs.board[gridPos.x][gridPos.y];
};


// make the pieces glow
const highLightGrid = (grid, color, curRef) => {
  curRef.strokeStyle = color;
  curRef.shadowColor = "#d53";
  curRef.shadowBlur = 20;
  curRef.lineJoin = "bevel";
  curRef.lineWidth = 5;
  const x = grid.x * PIECEWIDTH + XOFFSET;
  const y = grid.y * PIECEWIDTH + XOFFSET;
  curRef.strokeRect(x, y, PIECEWIDTH, PIECEHIGHT);
};

// draw a single piece
const drawPiece = (piece, curRef) => {
  const figureX = piece.figurePosition * PIECEWIDTH;
  let color = 1;
  if (piece.name === piece.name.toLowerCase()) color = 0;
  const figureY = color * PIECEHIGHT;
  const x = piece.x * PIECEWIDTH + XOFFSET;
  const y = piece.y * PIECEWIDTH + XOFFSET;
  if (!piece.selected) {
    curRef.drawImage(
      image,
      figureX,
      figureY,
      PIECEWIDTH,
      PIECEHIGHT,
      x,
      y,
      PIECEWIDTH,
      PIECEHIGHT
    );
  } else {
    curRef.drawImage(
      image,
      figureX,
      figureY,
      PIECEWIDTH,
      PIECEHIGHT,
      piece.draggingX - MARGIN_LEFT,
      piece.draggingY - MARGIN_TOP,
      PIECEWIDTH,
      PIECEHIGHT
    );
    curRef.shadowColor = "#d53";
    curRef.shadowBlur = 20;
    curRef.lineJoin = "bevel";
    curRef.lineWidth = 5;
    curRef.strokeStyle = "#38f";
    curRef.strokeRect(x, y, PIECEWIDTH, PIECEHIGHT);
  }
};
