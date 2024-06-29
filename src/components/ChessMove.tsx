// create move history array and uci string
export const initMoveHistory = () => {
  var moveHistory = {
    uci: "",
    moves: [],
  };
  return moveHistory;
};

// coordinate to UCI converter
const toUCI = (source) => {
  // x to ALPHA, y to int
  return String.fromCharCode(65 + source.x, 49 + (7 - source.y));
};

// add move to history and uci string
export const addMove = (moveHistory, source, dest) => {
  var move = {
    source,
    dest,
  };
  moveHistory.moves.push(move);
  moveHistory.uci = moveHistory.uci + " " + toUCI(source) + toUCI(dest);
};
