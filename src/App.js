import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Rune Warz</h1>
        <Game />
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    
    this.handleSpaceClick = this.handleSpaceClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);

    const colors = [
      'red-space',
      'green-space',
      'blue-space',
      'yellow-space',
      'white-space',
      'orange-space'
    ];
    let spaces = Array(25).fill('blank-space', 24);

    for (let i=0; i<colors.length; i++) {
      spaces.fill(colors[i], i*4, (i+1)*4);
    }

    spaces = this.shuffle(spaces);

    let goal = this.shuffle(spaces);

    this.state = {
      spaces: spaces,
      blankIndex: 24,
      activeIndices: [19, 23],
      goal: goal,
      clickCount: 0,
      hasWon: false,
    };
  }

  handleSpaceClick(clickIndex) {

    let newSpaces = this.state.spaces.slice();

    newSpaces[this.state.blankIndex] = newSpaces[clickIndex];
    newSpaces[clickIndex] = 'blank-space';

    this.setState((prevState) => ({
      spaces: newSpaces,
      blankIndex: clickIndex,
      clickCount: prevState.clickCount + 1,
      hasWon: this.winCondition(newSpaces),
    }));

  }

  handleNewGame() {
    this.setState((prevState) => {
      let newSpaces = prevState.spaces.slice();
      let newState = {};
      
      if (newSpaces[24] !== 'blank-space') {
        newSpaces[prevState.blankIndex] = newSpaces[24];
        newSpaces[24] = 'blank-space';
        newState['blankIndex'] = 24;
        newState['activeIndices'] = [19, 23];
      }

      newState['spaces'] = this.shuffle(newSpaces);

      let newGoal = prevState.goal.slice();
      newGoal = this.shuffle(newGoal);

      newState['goal'] = newGoal;

      newState['clickCount'] = 0;
      newState['hasWon'] = false;

      return newState;

    });
  }

  shuffle(spaces) {
    let newSpaces = spaces.slice();
    for (let i=newSpaces.length-2; i>0; i--) {
      let tmp = newSpaces[i];
      let j = Math.floor(Math.random() * (i + 1));
      newSpaces[i] = newSpaces[j];
      newSpaces[j] = tmp;
    }
    return newSpaces;
  }

  winCondition(spaces) {
    for (let i=1; i<4; i++) {
      for (let j=1; j<4; j++) {
        if (spaces[i*5+j] !== this.state.goal[i*5+j]) {
          return false;
        }
      }
    }
    return true;
  }

  render() {
    return (
      <div>
        <Status
          handleNewGame={this.handleNewGame}
          clickCount={this.state.clickCount}
          hasWon={this.state.hasWon} />
        <div className="left">
          <Goal goal={this.state.goal} />
        </div>
        <div className="right">
          <Board 
            spaces={this.state.spaces}
            hasWon={this.state.hasWon}
            handleSpaceClick={this.handleSpaceClick} />
        </div>
      </div>
    )
  }
}

class Board extends Component {
  constructor(props) {
    super(props);

    this.handleSpaceClick = this.handleSpaceClick.bind(this);

    this.state = {
      activeIndices: [19, 23],
    }

  }

  handleSpaceClick(clickIndex) {
    const corners = {
      0: [1, 5],
      4: [3, 9],
      20: [15, 21],
      24: [19, 23],
    };

    let newActiveIndices;

    if (clickIndex in corners) {
      newActiveIndices = corners[clickIndex];
    } else if (clickIndex % 5 === 0) {
      newActiveIndices = [clickIndex-5, clickIndex+1, clickIndex+5];
    } else if ((clickIndex+1) % 5 === 0) {
      newActiveIndices = [clickIndex-5, clickIndex-1, clickIndex+5];
    } else if (clickIndex < 4) {
      newActiveIndices = [clickIndex-1, clickIndex+1, clickIndex+5];
    } else if (clickIndex > 20) {
      newActiveIndices = [clickIndex-5, clickIndex-1, clickIndex+1];
    } else {
      newActiveIndices = [clickIndex-5, clickIndex-1, clickIndex+1, clickIndex+5];
    }

    this.setState({activeIndices: newActiveIndices});

    this.props.handleSpaceClick(clickIndex);

  }

  render() {
    const numsBoard = [...Array(5).keys()];

    return (
      <div>
        <h2>Board</h2>
        <div className="board-container">
          {numsBoard.map((n) => (
            <div className="board-row" key={n}>
              {numsBoard.map((m) => (
                <Space
                  color={this.props.spaces[n*5+m]}
                  key={n*5+m}
                  onClick={
                    (this.state.activeIndices.includes(n*5+m) && !this.props.hasWon) ?
                    (() => this.handleSpaceClick(n*5+m)) : false} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function Goal(props) {
  const numsGoal = [...Array(3).keys()];

  return (
    <div>
      <h2>Goal</h2>
      <div className="goal-container">
        {numsGoal.map((n) => (
          <div className="board-row" key={n+100}>
            {numsGoal.map((m) => (
              <Space
                color={props.goal[n*5+m+6]}
                key={n*5+m+106} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Space(props) {
  let spaceClass = 'space ' + props.color;

  if (props.isActive) {
    spaceClass += ' active-space';
  }

  return (
    <button
      className={spaceClass}
      onClick={props.onClick}></button>
  );
}

function Status(props) {
  return (
    <div className="status">
      <p>Click count: {props.clickCount}</p>
      {props.hasWon && 
        (
          <div>
            <p>YOU WIN!!</p>
            <button onClick={props.handleNewGame}>New Game</button>
          </div>
        )
      }
    </div>
  )
}

export default App;
