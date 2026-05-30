import { useState } from 'react';

function calculateWinner (squares) {
  const winningStrings = ['XXX', 'OOO'];
  for (var i = 0; i < squares.length; i++) {
    let s = squares[i].reduce((acc, element) => acc + element, '');
    if (winningStrings.includes(s)) {
      return s[0];
    }
    s = '';
    let d1 = '', d2 = '';
    for (var j = 0; j < squares[i].length; j++) {
      s += squares[j][i];
      d1 += squares[j][j];
      d2 += squares[squares.length - j - 1][j];
    }
    if (winningStrings.includes(s)) {
      return s[0];
    }else if (winningStrings.includes(d1)) {
      return d1[0];  
    } else if (winningStrings.includes(d2)) {
      return d2[0];
    }
  }
}

export default function Game () {
  const [winner, setWinner] = useState(null);  
  const [history, updateHistory] = useState([Array(3).fill(Array(3).fill(''))]);
  const currentBoard = history[history.length - 1];
  const isX = history.length % 2 === 1;
  
  function handlePlay (nextSquares) {
    updateHistory([...history, nextSquares]);
    setWinner(calculateWinner(nextSquares));
  }

  function jumpTo (move) {
    updateHistory(history.slice(0, move + 1));
    setWinner(calculateWinner(history[move]));
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>  
      <div className="status">
      Next Player: {isX ? 'X' : 'O'}
    </div>  
      <div className="game">
        <div className="game-board">
          <Board squares={currentBoard} onPlay={handlePlay} isX={isX} winner={winner} />
        </div>
        <div className="game-info">
          <ol>{ moves }</ol>
        </div>
      </div>
    </>
  );  
}

export function Board({ squares, onPlay, isX, winner }) {
  function onSquareClick (row, col) {
    if(winner || squares[row][col] !== '') return;

    const nextSquares = squares.map((row, key) => row.slice()).slice();
  
    nextSquares[row][col] = (isX ? 'X' : 'O');
 
    onPlay(nextSquares);      
  }

  let rows = [];
  for (var i = 0; i < 3; i++) {
    rows.push(<Row rowNum={i} row={squares[i]} onSquareClick={onSquareClick} />);
  }
  
  return <>
    <div className="board">
      { rows }
    </div>
    <Winner value={winner} />      
  </>;
}

export function Row ({ rowNum, row, onSquareClick }) {
  let squares = [];

  for (var i = 0; i < 3; i++) {
    squares.push(<Square value={row[i]} onSquareClick={() => onSquareClick(rowNum, i)} />);
  }
  return <>
    <div className="board-row">
      { squares }
    </div>
  </>;
}


export function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

export function Winner({ value }) {
  return <div className="winner">{ value ? value + " Wins!" : '' }</div>
}

