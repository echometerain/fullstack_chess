import "./ChessBoard.css";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { GameState } from "../Utils/GameState";
import type { Piece } from "../Utils/Structs";
import { ValidMoves } from "../Utils/ValidMoves";
import { drawPiece, glowGridPos, pixToGrid, setDragging } from "../Utils/Graphics";
const spriteSheet = new Image();
spriteSheet.src = "../images/pieces.png";

// make chessboard component
const ChessBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  let context = (canvasRef.current?.getContext("2d") as CanvasRenderingContext2D);
  const [game, setGame] = useState(new GameState());
  const validEngine = new ValidMoves(game);
  console.log(game.board)

  const setup = () => {
    // add event listeners
    canvasRef.current?.addEventListener("mousedown", onMouseDown);
    canvasRef.current?.addEventListener("mousemove", onMouseMove);
    canvasRef.current?.addEventListener("mouseup", onMouseUp);
    canvasRef.current?.addEventListener("mouseleave", onMouseLeave);
    printBoard();
  };

  const printBoard = () => {
    context.clearRect(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
    game.board.forEach((row) => {
      row.forEach((piece) => {
        if (piece !== null) {
          drawPiece(spriteSheet, piece, context);
        }
      });
    });
  };

  // print board at beginning
  spriteSheet.onload = setup;

  // move the selected piece to the new position
  const movePiece = (x: number, y: number) => {
    if (game.selectedPiece === null || game.selectedPiece === undefined) {
      return;
    }
    setDragging(game.selectedPiece, x, y);
    if (game.selectedPiece.validMoves && game.selectedPiece.isSelected) {
      game.selectedPiece.validMoves.forEach((grid) => {
        glowGridPos(grid, "green", context);
      });
    }
    const grid = pixToGrid(x, y);
    if (
      grid !== null &&
      game.selectedPiece !== null &&
      game.selectedPiece.isSelected &&
      !(grid.x === game.selectedPiece.x && grid.y === game.selectedPiece.y)
    ) {
      glowGridPos(grid, "yellow", context);
    }

  };


  // get piece at location
  const pixToPiece = (coordX: number, coordY: number): Piece | null => {
    let gridPos = pixToGrid(coordX, coordY);
    if (gridPos === null) return null;
    return game.board[gridPos.x][gridPos.y];
  };


  const onMouseDown = (nativeEvent: MouseEvent) => {
    nativeEvent.preventDefault();
    let { x, y } = nativeEvent;
    let clone = game.clone();
    clone.selectedPiece = pixToPiece(x, y);
    if (clone.selectedPiece === null || clone.selectedPiece === undefined) {
      return;
    }
    clone.selectedPiece.isSelected = true;
    movePiece(x, y);
    if (!clone.selectedPiece.validMoves) {
      let validMoves = validEngine.getMoves(clone.selectedPiece);
      if (!validMoves) {
        return;
      }
      clone.selectedPiece.validMoves = validMoves;
    }
    setGame(clone);
  };

  const onMouseMove = (nativeEvent: MouseEvent) => {
    var { x, y } = nativeEvent;
    movePiece(x, y);
    nativeEvent.preventDefault();
  };
  // handles when the mouse releases
  const onMouseUp = (nativeEvent: MouseEvent) => {
    let clone = game.clone();
    const { x, y } = nativeEvent;
    if (clone.selectedPiece === null || clone.selectedPiece === undefined) {
      return;
    }
    clone.selectedPiece.isSelected = false;
    const grid = pixToGrid(x, y);
    // if mouse moved to a valid position that's not the initial position
    if (
      grid !== null &&
      clone.selectedPiece !== null &&
      !(grid.x === clone.selectedPiece.x && grid.y === clone.selectedPiece.y)
    ) {
      if (clone.selectedPiece.validMoves === undefined) {
        return;
      }
      if (
        clone.selectedPiece.validMoves.find(
          (v) => v.x === grid.x && v.y === grid.y
        )
      ) {
        const source = { x: clone.selectedPiece.x, y: clone.selectedPiece.y };
        clone.gameHist.addMove(source, grid, false);
        console.log(clone.gameHist);
        clone.board[clone.selectedPiece.y][clone.selectedPiece.x] = null;
        clone.selectedPiece.x = grid.x;
        clone.selectedPiece.y = grid.y;
        clone.board[clone.selectedPiece.y][clone.selectedPiece.x] = clone.selectedPiece;
      } else {
        console.log("Invalid move to ", grid);
      }
    }
    clone.selectedPiece.validMoves = undefined;
    movePiece(x, y);
    clone.selectedPiece = null;
    setGame(clone);
    nativeEvent.preventDefault();
  };

  // when the mouse leaves the canvas
  const onMouseLeave = (nativeEvent: MouseEvent) => {
    nativeEvent.preventDefault();
  };

  return (
    <div>
      <canvas
        className="canvas-container"
        width={504}
        height={504}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default ChessBoard;
