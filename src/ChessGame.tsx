import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {initialBoard} from "@/utils/initialBoard.ts";
import {pieces} from "@/utils/pieces.ts";


const ChessGame = () => {
    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('white');

    useEffect(() => {
        if (currentPlayer === 'white') {
            setTimeout(makeAIMove, 500);
        }
    }, [currentPlayer]);

    const isValidMove = (startRow, startCol, endRow, endCol) => {
        const piece = board[startRow][startCol];
        const pieceType = piece.toLowerCase();
        const isWhitePiece = piece === piece.toUpperCase();
        const targetPiece = board[endRow][endCol];

        // Check if the target square is occupied by a piece of the same color
        if (targetPiece !== '' && (isWhitePiece === (targetPiece === targetPiece.toUpperCase()))) {
            return false;
        }

        // Basic move validation (this is a simplified version and doesn't cover all chess rules)
        switch (pieceType) {
            case 'p': // Pawn
                if (isWhitePiece) {
                    if (startCol === endCol && board[endRow][endCol] === '') {
                        return endRow === startRow - 1 || (startRow === 6 && endRow === 4);
                    } else {
                        return endRow === startRow - 1 && Math.abs(endCol - startCol) === 1 && board[endRow][endCol] !== '';
                    }
                } else {
                    if (startCol === endCol && board[endRow][endCol] === '') {
                        return endRow === startRow + 1 || (startRow === 1 && endRow === 3);
                    } else {
                        return endRow === startRow + 1 && Math.abs(endCol - startCol) === 1 && board[endRow][endCol] !== '';
                    }
                }
            case 'r': // Rook
                return startRow === endRow || startCol === endCol;
            case 'n': // Knight
                return (Math.abs(startRow - endRow) === 2 && Math.abs(startCol - endCol) === 1) ||
                    (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 2);
            case 'b': // Bishop
                return Math.abs(startRow - endRow) === Math.abs(startCol - endCol);
            case 'q': // Queen
                return startRow === endRow || startCol === endCol ||
                    Math.abs(startRow - endRow) === Math.abs(startCol - endCol);
            case 'k': // King
                return Math.abs(startRow - endRow) <= 1 && Math.abs(startCol - endCol) <= 1;
            default:
                return false;
        }
    };

    const handleCellClick = (row, col) => {
        if (currentPlayer === 'black') {
            if (selectedPiece) {
                const [selectedRow, selectedCol] = selectedPiece;
                if (isValidMove(selectedRow, selectedCol, row, col)) {
                    const newBoard = board.map(row => [...row]);
                    newBoard[row][col] = newBoard[selectedRow][selectedCol];
                    newBoard[selectedRow][selectedCol] = '';
                    setBoard(newBoard);
                    setSelectedPiece(null);
                    setCurrentPlayer('white');
                } else {
                    setSelectedPiece(null);
                }
            } else if (board[row][col] !== '' && board[row][col] === board[row][col].toLowerCase()) {
                setSelectedPiece([row, col]);
            }
        }
    };

    const makeAIMove = () => {
        const possibleMoves = [];
        for (let startRow = 0; startRow < 8; startRow++) {
            for (let startCol = 0; startCol < 8; startCol++) {
                if (board[startRow][startCol] === board[startRow][startCol].toUpperCase()) {
                    for (let endRow = 0; endRow < 8; endRow++) {
                        for (let endCol = 0; endCol < 8; endCol++) {
                            if (isValidMove(startRow, startCol, endRow, endCol)) {
                                possibleMoves.push({ startRow, startCol, endRow, endCol });
                            }
                        }
                    }
                }
            }
        }

        if (possibleMoves.length > 0) {
            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            const newBoard = board.map(row => [...row]);
            newBoard[move.endRow][move.endCol] = newBoard[move.startRow][move.startCol];
            newBoard[move.startRow][move.startCol] = '';
            setBoard(newBoard);
            setCurrentPlayer('black');
        }
    };

    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Chess Game vs AI</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-8 gap-0 w-80 h-80 mx-auto">
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-10 h-10 flex items-center justify-center text-2xl cursor-pointer
                           ${(rowIndex + colIndex) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-400'}
                           ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex ? 'bg-yellow-200' : ''}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {pieces[cell] || ''}
                            </div>
                        ))
                    )}
                </div>
                <p className="mt-4 text-center">Current player: {currentPlayer}</p>
            </CardContent>
        </Card>
    );
};

export default ChessGame;
