export const captureCheck = (selectedPiece, opponentPieces) => {
  var captured = false;
  opponentPieces.forEach(function (piece, index) {
    if (piece.x === selectedPiece.x && piece.y === selectedPiece.y) {
      opponentPieces.splice(index, 1);
      captured = true;
    }
  });
  return captured;
};
