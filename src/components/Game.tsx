import { Repeat } from 'typescript-tuple'
import { useState } from 'react';
import '../styles.css';

type SquareValue = 'O' | 'X' | null

type SquareProps = {
  value: SquareValue
  onSquareClick: () => void
}

function Square(props: SquareProps) {
  const { value, onSquareClick } = props
  return <button className="square" onClick={onSquareClick}>{ value }</button>;
}

function calculateWinner(squares: BoardState) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2 , 5 , 8],
    [0, 4, 8],
    [2 , 4 , 6]
  ];

  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

type BoardState = Repeat<SquareValue, 9>

type BoardProps = {
  xIsNext: boolean
  squares: BoardState
  onPlay: (nextSquares: BoardState) => void
}

function Board(props: BoardProps) {
  const { xIsNext, squares, onPlay } = props
  function handleClick(i: number) {
    if(squares[i] || calculateWinner(squares)) {
      return
    }

    const nextSquares = squares.slice();

    if(xIsNext) {
      nextSquares[i] = "X"
    } else {
      nextSquares[i] = "O"
    }
    onPlay(nextSquares as BoardState)
  }

  const winner = calculateWinner(squares)
  let status
  if(winner) {
    status = "Winner: " + winner
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  const boardView = []
  for(let i = 0; i < 3; i++) {
    const row = []
    for(let j = 0; j < 3; j++) {
      row.push(<Square key={i * 3 + j} value={squares[i * 3 + j]} onSquareClick={() => handleClick(i * 3 + j)} />)
    }
    boardView.push(<div key={i} className="board-row">{row}</div>)
  }

  return (
    <>
      <div className="status">{status}</div>
      { boardView }
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState<BoardState[]>([[null, null, null, null, null, null, null, null, null]])
  const [currentMove, setCurrentMove] = useState<number>(0)
  const xIsNext: boolean = currentMove % 2 === 0
  const currentSquares: BoardState = history[currentMove]

  function handlePlay(nextSquares: BoardState) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description: string;
    if(move > 0) {
      description = 'Go to move #' + move
    } else {
      description = 'Go to game start'
    }

    return (
      <li key={move}>
        {move === currentMove
          ? `You are at move #${currentMove}`
          : <button onClick={() => jumpTo(move)}>{ description }</button>
        }
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{ moves }</ol>
      </div>
    </div>
  )
}