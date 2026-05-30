import { useState } from 'react';

function calculateWinner (squares) {
  const winningStrings = ['X'.repeat(squares.length), 'O'.repeat(squares.length)];
  let d1 = '', d2 = '';  
  for (var i = 0; i < squares.length; i++) {
    let s = squares[i].join('');
    if (winningStrings.includes(s)) {
      return s[0];
    }

    s = '';
    for (var j = 0; j < squares[i].length; j++) {
      s += squares[j][i];
    }
    if (winningStrings.includes(s)) {
      return s[0];
    } 

    d1 += squares[i][i];
    d2 += squares[squares.length - i - 1][i];    
  }

  if (winningStrings.includes(d1)) {
    return d1[0];  
  } else if (winningStrings.includes(d2)) {
    return d2[0];
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
      <h1>React-tac-toe</h1>
      <div className="game-container">
        <div className="status">
          <h2>
            Next Player: {isX ? 'X' : 'O'}
          </h2>
        </div>  
        <div className="game">
          <div className="game-board">
            <Board squares={currentBoard} onPlay={handlePlay} isX={isX} winner={winner} />
          </div>
        </div>
        <div className="game-info">
          <ul>{ moves }</ul>
        </div>
        <Winner value={winner} />
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
  
  return <>
    <div className="board">
      { squares.map( (row, rowNum) => <Row key={rowNum} rowNum={rowNum} row={row} onSquareClick={onSquareClick} />) }
    </div>
    
  </>;
}

export function Row ({ rowNum, row, onSquareClick }) {
  return <>
    <div className="board-row">
      { row.map( (value, col) => <Square key={col} value={value} onSquareClick={() => onSquareClick(rowNum, col)} />) }
    </div>
  </>;
}


export function Square({ value, onSquareClick }) {
  return <div className="square" onClick={onSquareClick}>{value}</div>;
}

export function Winner({ value }) {
  return <h2 className="winner">{ value ? value + " Wins!" : '' }</h2>
}

