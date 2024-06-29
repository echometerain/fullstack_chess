const PIECEWIDTH = 56;
const PIECEHIGHT = 60;
const XOFFSET = 28;
const MARGIN_LEFT = 20;
const MARGIN_TOP = 50;

export const getPiece = (px, py, board) => {
  const x = Math.floor((px - XOFFSET - MARGIN_LEFT) / PIECEWIDTH);
  const y = Math.floor((py - XOFFSET - MARGIN_TOP) / PIECEWIDTH);
  if (x >= 0 && x < 8 && y >= 0 && y < 8) return board[y][x];
  return null;
};

export const getGrid = (canvasX, canvasY) => {
  var grid = {
    color: 0, // black
    x: Math.floor((canvasX - MARGIN_LEFT - XOFFSET) / PIECEWIDTH), // board x position
    y: Math.floor((canvasY - MARGIN_TOP - XOFFSET) / PIECEHIGHT), // board y position
  };
  if (grid.x >= 0 && grid.x < 8 && grid.y >= 0 && grid.y < 8) return grid;
  return null;
};
