import "./ChessBoard.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { GameState } from "../Utils/GameState";
import type { GridPos, Piece } from "../Utils/Structs";
import { ValidMoves } from "../Utils/ValidMoves";
import { drawPiece, glowGridPos, pixToGrid, setDragging } from "../Utils/Graphics";
const spriteSheet = require("../images/pieces.png");

// make chessboard component
const ChessBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  let context = (canvasRef.current?.getContext("2d") as CanvasRenderingContext2D);
  const [game, setGame] = useState(new GameState());
  let validEngine: ValidMoves = useMemo(() => new ValidMoves(game), [game]);

  const drawBoard = useCallback(() => {
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
  }, [context, game]);

  // show dragging graphics for piece
  const dragPiece = useCallback((x: number, y: number) => {
    let piece = game.selectedPiece;
    if (piece === null || piece === undefined) {
      return;
    }
    setDragging(piece, x, y);
    if (piece.validMoves && piece.isSelected) {
      piece.validMoves.forEach((grid) => {
        glowGridPos(grid, "green", context);
      });
    }
    const pos = pixToGrid(x, y);
    if (pos !== null && !(pos.x === piece.x && pos.y === piece.y)) {
      glowGridPos(pos, "yellow", context);
    }
  }, [context, game.selectedPiece]);

  // get piece at location
  const pixToPiece = useCallback((coordX: number, coordY: number): Piece | null => {
    let gridPos = pixToGrid(coordX, coordY);
    if (gridPos === null) return null;
    return game.board[gridPos.y][gridPos.x];
  }, [game]);

  // grab the piece when mouse is down
  const onMouseDown = useCallback((nativeEvent: MouseEvent) => {
    nativeEvent.preventDefault();
    let { x, y } = nativeEvent;
    let clone: GameState = game.clone();
    let piece = pixToPiece(x, y);
    // if no piece is selected
    if (piece === null || piece === undefined || piece.isWhite !== clone.isWhiteTurn) {
      return;
    }
    piece.isSelected = true;
    if (piece.validMoves === undefined) {
      let validMoves = validEngine.getMoves(piece);
      if (!validMoves) return;
      piece.validMoves = validMoves;
    }
    clone.selectedPiece = piece;
    dragPiece(x, y);
    setGame(clone);
  }, [dragPiece, game, pixToPiece, validEngine]);

  const onMouseMove = useCallback((nativeEvent: MouseEvent) => {
    nativeEvent.preventDefault();
    var { x, y } = nativeEvent;
    drawBoard();
    dragPiece(x, y);
  }, [dragPiece, drawBoard]);

  // handles when the mouse releases
  const onMouseUp = useCallback((nativeEvent: MouseEvent) => {
    nativeEvent.preventDefault();
    const toPos = pixToGrid(nativeEvent.x, nativeEvent.y);
    let clone = game.clone();
    let piece = clone.selectedPiece;
    if (piece === null || piece === undefined) {
      return;
    }
    piece.isSelected = false;
    clone.selectedPiece = null;

    // if mouse moved to a valid position that's not the initial position
    if (toPos === null || (toPos.x === piece.x && toPos.y === piece.y) || piece.validMoves === undefined) {
      return;
    }
    if (!piece.validMoves.find((v) => v.x === toPos.x && v.y === toPos.y)) {
      console.log("Invalid move to ", toPos);
      return;
    }
    handleMove(piece, toPos, clone);
  }, [game]);

  const handleMove = (piece: Piece, toPos: GridPos, clone: GameState) => {
    // handle history
    clone.gameHist.addMove({ x: piece.x, y: piece.y }, toPos, false);
    console.log(clone.gameHist);
    clone.board[piece.y][piece.x] = null; // remove piece from old position

    // put piece to new position
    piece.x = toPos.x;
    piece.y = toPos.y;
    piece.validMoves = undefined;
    clone.board[toPos.y][toPos.x] = piece;

    // clean up
    clone.isWhiteTurn = !clone.isWhiteTurn;
    setGame(clone);
  }

  // when the mouse leaves the canvas
  const onMouseLeave = (nativeEvent: MouseEvent) => {
    nativeEvent.preventDefault();
  };

  const bindListeners = () => {
    // add event listeners
    canvasRef.current?.addEventListener("mousedown", onMouseDown);
    canvasRef.current?.addEventListener("mousemove", onMouseMove);
    canvasRef.current?.addEventListener("mouseup", onMouseUp);
    canvasRef.current?.addEventListener("mouseleave", onMouseLeave);
    return rmListeners;
  };

  const rmListeners = useCallback(() => {
    // remove event listeners
    canvasRef.current?.removeEventListener("mousedown", onMouseDown);
    canvasRef.current?.removeEventListener("mousemove", onMouseMove);
    canvasRef.current?.removeEventListener("mouseup", onMouseUp);
    canvasRef.current?.removeEventListener("mouseleave", onMouseLeave);
  }, [onMouseDown, onMouseMove, onMouseUp]);

  // print board at beginning
  useEffect(drawBoard, [drawBoard]);
  useEffect(bindListeners, [game, onMouseDown, onMouseMove, onMouseUp, rmListeners]);
  // useEffect(() => console.log(game));  

  return (
    <>
      <canvas
        className="canvas-container"
        width={504}
        height={504}
        ref={canvasRef}
      ></canvas>
    </>
  );
};

export default ChessBoard;
