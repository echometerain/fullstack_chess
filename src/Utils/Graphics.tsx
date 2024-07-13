import type { GridPos, Piece } from "./Structs";

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

// make the pieces glow
export const glowGridPos = (grid: GridPos, color: string, curRef: CanvasRenderingContext2D) => {
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
export const drawPiece = (spriteSheet: string, piece: Piece, curRef: CanvasRenderingContext2D) => {
  const figureX = piece.spritePos * PIECEWIDTH;
  let color = 1;
  if (!piece.isWhite) color = 0;
  const figureY = color * PIECEHIGHT;
  const x = piece.x * PIECEWIDTH + XOFFSET;
  const y = piece.y * PIECEWIDTH + XOFFSET;
  let img = new Image();
  img.src = spriteSheet;
  if (!piece.isSelected || piece.draggingX === undefined || piece.draggingY === undefined) {
    curRef.drawImage(
      img,
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
      img,
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

export const setDragging = (piece: Piece, x: number, y: number) => {
  piece.draggingX = x - PIECEWIDTH / 2;
  piece.draggingY = y - PIECEHIGHT / 2;
}