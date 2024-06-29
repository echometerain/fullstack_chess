const getRow = (color) => {
  // color 0 black, 1 white
  let fen = "rnbqkbnr";
  if (color === 1) fen = "RNBQKBNR";
  let row = [];
  for (let i = 0; i < fen.length; i++) {
    let piece = {
      name: fen[i],
      x: i,
      y: color * 7,
      selected: false,
    };
    if (i < 5) piece["figurePosition"] = i;
    else piece["figurePosition"] = 7 - i;
    row.push(piece);
  }
  return row;
};

const getPawnRow = (color) => {
  // color 0 black, 1 white
  let row = [];
  for (let i = 0; i < 8; i++) {
    let piece = {
      name: color ? "P" : "p",
      x: i,
      y: color ? 6 : 1,
      figurePosition: 5,
      selected: false,
    };
    row.push(piece);
  }
  return row;
};

export const initChessBoard = () => {
  let board = [];
  board.push(getRow(0));
  board.push(getPawnRow(0));
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(null);
    }
    board.push(row);
  }
  board.push(getPawnRow(1));
  board.push(getRow(1));
  return board;
};
