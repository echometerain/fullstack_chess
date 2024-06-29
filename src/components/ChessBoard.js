import "./ChessBoard.css";
import { useEffect, useRef, useState } from "react";
import figures from "../images/figures.png";
import { pixToPiece, getCoord } from "../Utils/GridCalc.js";
import { validMove } from "../Utils/ValidMove.js";
import { initMoveHistory, addMove } from "./ChessMove.js";
import { initChessBoard } from "../Utils/InitBoard.js";

var image = new Image();
image.src = figures;

// graphical constants
const PIECEWIDTH = 56;
const PIECEHIGHT = 60;
const XOFFSET = 28;
const MARGIN_LEFT = 20;
const MARGIN_TOP = 50;

var selectedPiece = null;

// make chessboard component
const ChessBoard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [moveHistory, setMoveHistory] = useState(initMoveHistory());

  // create and log chess board
  let board = initChessBoard();
  console.log(board);

  // hook to draw board upon loading
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    if (board === undefined) board = initChessBoard();
    drawBoard(board);
  }, []);

  // draw every piece on the board
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

  // make the pieces glow
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

  // draw a single piece
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

  // move the selected piece to the new position
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
      const grid = getCoord(x, y);
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
    selectedPiece = pixToPiece(x, y, board);
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

  // handles when the mouse releases
  const onMouseUp = ({ nativeEvent }) => {
    const { x, y } = nativeEvent;
    if (selectedPiece !== null && selectedPiece !== undefined) {
      selectedPiece.selected = false;
      const grid = getCoord(x, y);
      // if mouse moved to a valid position that's not the initial position
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

  // when the mouse leaves the canvas
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
