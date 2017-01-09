import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.handleSpaceClick = this.handleSpaceClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleReset = this.handleReset.bind(this);

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
      initialSpaces: spaces,
      spaces: spaces,
      blankIndex: 24,
      activeIndices: [19, 23],
      goal: goal,
      clickCount: 0,
      hasWon: false,
    };
  }

  handleSpaceClick(clickIndex) {
    const corners = {
      0: [1, 5],
      4: [3, 9],
      20: [15, 21],
      24: [19, 23],
    };

    let newSpaces = this.state.spaces.slice();
    let newActiveIndices;

    newSpaces[this.state.blankIndex] = newSpaces[clickIndex];
    newSpaces[clickIndex] = 'blank-space';

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

    this.setState((prevState) => ({
      spaces: newSpaces,
      blankIndex: clickIndex,
      activeIndices: newActiveIndices,
      clickCount: prevState.clickCount + 1,
      hasWon: this.winCondition(newSpaces),
    }));

  }

  handleNewGame() {
    this.setState((prevState) => {
      let oldSpaces = prevState.spaces.slice();
      
      if (oldSpaces[24] !== 'blank-space') {
        oldSpaces[prevState.blankIndex] = oldSpaces[24];
        oldSpaces[24] = 'blank-space';
      }

      let newSpaces = this.shuffle(oldSpaces);
      let newGoal = this.shuffle(prevState.goal.slice());

      return {
        initialSpaces: newSpaces,
        spaces: newSpaces,
        goal: newGoal,
        clickCount: 0,
        hasWon: false,
        blankIndex: 24,
        activeIndices: [19, 23],
      };

    });
  }

  handleReset() {
    this.setState((prevState) => ({
      spaces: prevState.initialSpaces,
      clickCount: 0,
      blankIndex: 24,
      activeIndices: [19, 23],
      hasWon: false,
    }));
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
      <div className="container">
        <h1>Rubik's Race</h1>
        <Status
          clickCount={this.state.clickCount}
          hasWon={this.state.hasWon} />
        <div className="left">
          <Goal goal={this.state.goal} />
        </div>
        <div className="right">
          <Board 
            spaces={this.state.spaces}
            hasWon={this.state.hasWon}
            activeIndices={this.state.activeIndices}
            handleSpaceClick={this.handleSpaceClick} />
        </div>
        <Console
          handleReset={this.handleReset}
          handleNewGame={this.handleNewGame} />
      </div>
    )
  }
}

function Board(props) {
  const numsBoard = [...Array(5).keys()];

  return (
    <div>
      <h2>Board</h2>
      <div className="board-container">
        {numsBoard.map((n) => (
          <div className="board-row" key={n}>
            {numsBoard.map((m) => (
              <Space
                color={props.spaces[n*5+m]}
                key={n*5+m}
                onClick={
                  (props.activeIndices.includes(n*5+m) && !props.hasWon) ?
                  (() => props.handleSpaceClick(n*5+m)) : false} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
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
      <p>Click Count: {props.clickCount}</p>
      {props.hasWon && <p id="win">YOU WIN!!</p>}
    </div>
  )
}

class Console extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);

    this.state = {isVisible: false};
  }

  handleToggle() {
    this.setState((prevState) => ({isVisible: !prevState.isVisible}));
  }

  render() {
    return (
      <div className="instructions">
        <button
          className={"toggle-btn " + (this.state.isVisible ? "toggle-selected" : "")}
          onClick={this.handleToggle}>Instructions</button>
        <button
          className="toggle-btn btn-right"
          onClick={this.props.handleReset}>Reset</button>
        <button
          className="toggle-btn btn-right"
          onClick={this.props.handleNewGame}>New Game</button>

        {this.state.isVisible &&
          (
            <ul>
              <li>Move blocks on the board until the center 9 pieces match the goal</li>
              <li>The black space on the board represents an empty space</li>
              <li>Click a block adjacent to the empty space to move it into the empty space</li>
            </ul>
          )
        }
      </div>
    );
  }
}

export default App;
