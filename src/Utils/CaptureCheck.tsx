import { Piece } from "./Piece";
// capture an enemy piece
export const captureCheck = (selected: Piece, enemy: Piece) => {
  return selected.x === enemy.x && selected.y === enemy.y;
};
