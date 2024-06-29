export const initMoveHistory = () => {
  var moveHistory = {
    uci: "",
    moves: [],
  };
  return moveHistory;
};
const toUCI = (source) => {
  return String.fromCharCode(65 + source.x, 49 + (7 - source.y));
};

export const addMove = (moveHistory, source, dest) => {
  var move = {
    source,
    dest,
  };
  moveHistory.moves.push(move);
  moveHistory.uci = moveHistory.uci + " " + toUCI(source) + toUCI(dest);
};
