import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className={props.classN} onClick={props.onClick} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let classN = "square";
    if (this.props.winningLine) {
      this.props.winningLine[1].map((sqrNmbr) => {
        if (sqrNmbr === i) {
          classN = "square winner"
        }
        return;
      })
    }

    return (
      <Square
        key={'key:' + i}
        value={this.props.squares[i]}
        classN={classN}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let grid = [];
    let squareNumber = 0;
    for (let i = 0; i < 3; i++) {
      let rows = [];
      for (let x = 0; x < 3; x++) {
        rows = rows.concat(this.renderSquare(squareNumber))
        squareNumber += 1
      }
      grid = grid.concat(<div key={'row:' + i} className='board-row'>{rows}</div>)
    }

    return (
      <div>
        {grid}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        choice: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      sorting: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    let choice = choiceLocation(i);
    squares[i] = this.state.xIsNext ? 'x' : 'o';
    this.setState({
      history: history.concat([{
        squares: squares,
        choice: choice,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 === 0),
    })
  }

  changeOrder() {
    this.setState({
      sorting: !this.state.sorting,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move} located at col/row:${step.choice}` : `Go to game start`;
      const boldOrNot = this.state.stepNumber === move ? "button-moves" : null;
      return (
        <li className='li-numberless' key={move}>
          <button className={boldOrNot} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let movesTwo = moves;
    if (this.state.sorting === false) {
      movesTwo = movesTwo.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner is: ' + winner[0];
    } else if (this.state.stepNumber === 9) {
      status = 'Game ended in draw ';
    }
    else {
      status = `Next player: ${this.state.xIsNext ? 'x' : 'o'}`;
    }

    const ascOrDesc = this.state.sorting ? 'Ascending' : 'Descending'
    let toggle = <button onClick={() => this.changeOrder()}>Change order to {ascOrDesc}</button>

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningLine={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{toggle}</div>
          <ol >{movesTwo}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// Check if there is a winning line
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}

// Show the location of last move in move history list
function choiceLocation(choice) {
  const choices = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [1, 3],
    [2, 3],
    [3, 3],
  ];
  let location = choices[choice];
  return location;
}

/* Extras:
1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.
*/