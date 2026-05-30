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
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);  
  const [history, updateHistory] = useState([Array(3).fill(Array(3).fill(''))]);
  const currentBoard = history[history.length - 1];
  
  function handlePlay (nextSquares) {
    updateHistory([...history, nextSquares]);
    setWinner(calculateWinner(nextSquares));
    setIsX(!isX);    
  }

  function jumpTo (move) {
    updateHistory(history.slice(0, move + 1));
    setWinner(calculateWinner(history[move]));
    setIsX(moves % 2 == 1);
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

  return <>
    <div className="board">
      <Row rowNum={0} row={squares[0]} onSquareClick={onSquareClick}/>
      <Row rowNum={1} row={squares[1]} onSquareClick={onSquareClick}/>
      <Row rowNum={2} row={squares[2]} onSquareClick={onSquareClick}/>
    </div>
    <Winner value={winner} />      
  </>;
}

export function Row ({ rowNum, row, onSquareClick }) {
  return <>
    <div className="board-row">
      <Square value={row[0]} onSquareClick={() => onSquareClick(rowNum, 0)}></Square>
      <Square value={row[1]} onSquareClick={() => onSquareClick(rowNum, 1)}></Square>
      <Square value={row[2]} onSquareClick={() => onSquareClick(rowNum, 2)}></Square>
    </div>
  </>;
}


export function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

export function Winner({ value }) {
  return <div className="winner">{ value ? value + " Wins!" : '' }</div>
}

