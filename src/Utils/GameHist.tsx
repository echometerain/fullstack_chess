import type { ChessMove, GridPos } from "./Structs";

export class GameHist {
  uci: string;
  moves: Array<ChessMove>;

  constructor() {
    this.uci = "";
    this.moves = [];
  }

  // coordinate to UCI converter
  static toUCI(source: GridPos) {
    // x to ALPHA, y to int
    return String.fromCharCode(65 + source.x, 49 + (7 - source.y));
  }

  // add move to history and uci string
  addMove(source: GridPos, dest: GridPos, promotion: boolean) {
    let move: ChessMove = {
      from: source,
      to: dest,
      promotion: promotion,
    };
    this.moves.push(move);
    this.uci += " " + GameHist.toUCI(source) + GameHist.toUCI(dest) + (promotion ? "q" : "");
  }
}