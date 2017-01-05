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
    let rows = [];
    for (let i=0; i<5; i++) {
      rows.push(<Row key={i} value={i} spaces={this.state.spaces} />);
    }

    return (
      <div>
        <h2>Board</h2>
        {rows}
        <button onClick={this.handleShuffle}>Shuffle</button>
      </div>
    )
  }
}

function Row(props) {
  let spaces = [];
  for (let i=0; i<5; i++) {
    let value = 5 * props.value + i;
    spaces.push(<Space key={i} value={value} color={props.spaces[value]} />);
  }

  return (
    <div className="board-row">
      {spaces}
    </div>
  )
}

function Space(props) {
  let spaceClass = "space " + props.color;

  return (
    <button className={spaceClass}></button>
  );
}

export default App;
