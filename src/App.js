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
  render() {
    return (
        <Board />
    );
  }
}

class Board extends Component {
  constructor(props) {
    super(props);
    
    this.handleShuffle = this.handleShuffle.bind(this);

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

    this.state = {
      spaces: spaces,
      blankIndex: 24,
      activeIndices: [19, 23],
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

    this.setState({
      spaces: newSpaces,
      blankIndex: clickIndex,
      activeIndices: newActiveIndices,
    })

  }

  handleShuffle() {
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

      return newState;

    });
  }

  shuffle(spaces) {
    for (let i=spaces.length-2; i>0; i--) {
      let tmp = spaces[i];
      let j = Math.floor(Math.random() * (i + 1));
      spaces[i] = spaces[j];
      spaces[j] = tmp;
    }
    return spaces;
  }

  render() {
    const nums = [...Array(5).keys()];

    return (
      <div>
        <h2>Board</h2>
        {nums.map((n) => (
          <div className="board-row" key={n}>
            {nums.map((m) => (
              <Space
                color={this.state.spaces[n*5+m]}
                key={n*5+m}
                isActive={this.state.activeIndices.includes(n*5+m)}
                onClick={() => this.handleSpaceClick(n*5+m)} />
            ))}
          </div>
        ))}
        <button onClick={this.handleShuffle}>Shuffle</button>
      </div>
    )
  }
}


function Space(props) {
  let spaceClass = 'space ' + props.color;

  if (props.isActive) {
    spaceClass += ' active-space';
  }

  return (
    <button
      className={spaceClass}
      onClick={props.isActive ? props.onClick : false}></button>
  );
}

export default App;
