import "./ChessBoard.css";
import { useEffect, useRef, useState } from "react";
import figures from "../images/figures.png";
import { getPiece, getGrid } from "./ChessPiece.js";
import { validMove } from "../Utils/ValidMove.js";
import { initMoveHistory, addMove } from "./ChessMove.js";
import { initChessBoard } from "../Utils/InitBoard.js";

var image = new Image();
image.src = figures;

const WHITEPIECE = 1;
const BLACKPIECE = 0;
const PIECEWIDTH = 56;
const PIECEHIGHT = 60;
const XOFFSET = 28;
const MARGIN_LEFT = 20;
const MARGIN_TOP = 50;
var selectedPiece = null;

const ChessBoard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [moveHistory, setMoveHistory] = useState(initMoveHistory());

  let board = initChessBoard();
  console.log(board);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    if (board === undefined) board = initChessBoard();
    drawBoard(board);
  }, []);

  const drawBoard = (board) => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    board.forEach((row) => {
      row.forEach((piece) => {
        if (piece !== null) {
          drawPiece(piece);
        }
      });
    });
  };

  const highLightGrid = (grid, color) => {
    contextRef.current.strokeStyle = color;
    contextRef.current.shadowColor = "#d53";
    contextRef.current.shadowBlur = 20;
    contextRef.current.lineJoin = "bevel";
    contextRef.current.lineWidth = 5;
    const x = grid.x * PIECEWIDTH + XOFFSET;
    const y = grid.y * PIECEWIDTH + XOFFSET;
    contextRef.current.strokeRect(x, y, PIECEWIDTH, PIECEHIGHT);
  };

  const drawPiece = (piece) => {
    const figureX = piece.figurePosition * PIECEWIDTH;
    let color = 1;
    if (piece.name === piece.name.toLowerCase()) color = 0;
    const figureY = color * PIECEHIGHT;
    const x = piece.x * PIECEWIDTH + XOFFSET;
    const y = piece.y * PIECEWIDTH + XOFFSET;
    if (!piece.selected) {
      contextRef.current.drawImage(
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
      contextRef.current.drawImage(
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
      contextRef.current.shadowColor = "#d53";
      contextRef.current.shadowBlur = 20;
      contextRef.current.lineJoin = "bevel";
      contextRef.current.lineWidth = 5;
      contextRef.current.strokeStyle = "#38f";
      contextRef.current.strokeRect(x, y, PIECEWIDTH, PIECEHIGHT);
    }
  };

  const movePiece = (x, y) => {
    if (selectedPiece !== null && selectedPiece !== undefined) {
      selectedPiece.draggingX = x - PIECEWIDTH / 2;
      selectedPiece.draggingY = y - PIECEWIDTH / 2;
      drawBoard(board);
      if (selectedPiece.validMoveGrids && selectedPiece.selected) {
        selectedPiece.validMoveGrids.forEach((grid) => {
          highLightGrid(grid, "green");
        });
      }
      const grid = getGrid(x, y);
      if (
        grid !== null &&
        selectedPiece !== null &&
        selectedPiece.selected &&
        !(grid.x === selectedPiece.x && grid.y === selectedPiece.y)
      ) {
        highLightGrid(grid, "yellow");
      }
    }
  };

  const onMouseDown = ({ nativeEvent }) => {
    let { x, y } = nativeEvent;
    selectedPiece = getPiece(x, y, board);
    if (selectedPiece !== null && selectedPiece !== undefined) {
      selectedPiece.selected = true;
      movePiece(x, y);
      if (!selectedPiece.validMoveGrids) {
        selectedPiece.validMoveGrids = validMove(selectedPiece, board);
      }
    }
    nativeEvent.preventDefault();
  };

  const onMouseMove = ({ nativeEvent }) => {
    var { x, y } = nativeEvent;
    movePiece(x, y);
    nativeEvent.preventDefault();
  };

  const onMouseUp = ({ nativeEvent }) => {
    const { x, y } = nativeEvent;
    if (selectedPiece !== null && selectedPiece !== undefined) {
      selectedPiece.selected = false;
      const grid = getGrid(x, y);
      if (
        grid !== null &&
        selectedPiece !== null &&
        !(grid.x === selectedPiece.x && grid.y === selectedPiece.y)
      ) {
        if (
          selectedPiece.validMoveGrids.find(
            (v) => v.x === grid.x && v.y === grid.y
          )
        ) {
          const source = { x: selectedPiece.x, y: selectedPiece.y };
          addMove(moveHistory, source, grid);
          console.log(moveHistory);
          board[selectedPiece.y][selectedPiece.x] = null;
          selectedPiece.x = grid.x;
          selectedPiece.y = grid.y;
          board[selectedPiece.y][selectedPiece.x] = selectedPiece;
        } else {
          console.log("Invalid move to ", grid);
        }
      }
      selectedPiece.validMoveGrids = null;
      movePiece(x, y);
      selectedPiece = null;
    }
    nativeEvent.preventDefault();
  };
  const onMouseLeave = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    nativeEvent.preventDefault();
  };

  return (
    <div>
      <canvas
        className="canvas-container"
        width={504}
        height={504}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      ></canvas>
    </div>
  );
};

export default ChessBoard;
