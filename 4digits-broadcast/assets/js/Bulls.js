import '../css/bulls.css';
import "milligram";
import "phoenix_html";
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { ch_pass,ch_leave,ch_observer, ch_player,ch_ready, ch_login, ch_join, ch_push, ch_reset, store_input} from './socket';

function Lobby({state}, setState) {

  let playerList = [];
  for (const [key, value] of Object.entries(state.players)) {
      let player1 = <td>{key}</td>;
      let ready = <td>{value.toString()}</td>;
      playerList.push(<tr>{[player1, ready]}</tr>);
  }

  let obserList = [];
  for (let i = 0; i < state.observers.length; i++) {
      let player1 = <li key={i}>{state.observers[i]}</li>;
      obserList.push(player1);
  }

  let leaderboard = [];
  for (const [key, value] of Object.entries(state.wins)) {
      let player1 = <td>{key}</td>
      let wins = <td>{value[1]}</td>
      let loses = <td>{value[0]}</td>
      leaderboard.push(<tr>{[player1, wins, loses]}</tr>);
  }
  console.log(leaderboard)

  return (<div>
            <h1>Game Lobby: {state.game_name}</h1>
            <h3>Players</h3>
            <table>
              <thead>
      					<tr>
      						<td>Player</td>
      						<td>Ready</td>
      					</tr>
      				</thead>
      				<tbody>
      					{playerList}
      				</tbody>
      			</table>
            <h3>Observers</h3>
            <ul>
              {obserList}
            </ul>
            <hr></hr>
            <h2>Player: {state.user_name}</h2>
            <p>
      			<button onClick={() => ch_player(state.user_name)}>Make Player</button>
            <button onClick={() => ch_observer(state.user_name,state.game_name)}>Make Observer</button>
            <button onClick={() => ch_ready(state.user_name)}>Ready</button>
            <button onClick={() => ch_leave(state.user_name)}>Leave</button>
      			</p>
            <hr></hr>
            <h1>LeaderBoard</h1>
            <h3>Last Winner: {state.last_winner}</h3>
            <table>
              <thead>
                <tr>
                  <td>Player</td>
                  <td>Wins</td>
                  <td>Lose</td>
                </tr>
              </thead>
              <tbody>
                {leaderboard}
              </tbody>
            </table>
          </div>
        );

}

function Play({state}) {
    let {game_name, user_name, guesses, result, userinput, message} = state;
    const [userInput, setInput] = useState("");

    const makeGuess = () => {
        ch_push(userInput, user_name);
    }

    const passGuess = () => {
        ch_pass(user_name);
    }

	  const updateGuess = ({ target }) => {
        store_input(target.value);
        setInput(target.value);
    }

    const resetGame = () => {
        ch_reset();
    }


  	const keypress = (ev) => {
  		if (ev.key === "Enter") {
  			makeGuess();
  		}
  	}

    let rows = [];
    for (let i = 0; i < state.result.length; i+=3) {
        //let guess1 = <td>{state.guesses[i]}</td>;
        let result1 = <><td>{state.result[i]}</td>
                      <td>{state.result[i+1]}</td>
                      <td>{state.result[i+2]}</td></>;
        rows.push(<tr>{result1}</tr>);
    }

    return (
		<div className = "App">
			<h1>4 Digits</h1>
      <h2>Player: {state.user_name}</h2>
      <h2>{state.game_name}</h2>
			<h2> {state.message}</h2>
      <h2>Timer: {state.timer}</h2>
			<input type="text" id="userinput"  value={userInput} maxLength="4"
					onChange={updateGuess} onKeyPress={keypress}/>
			<p>
			<button onClick={makeGuess}>Guess</button>
      <button onClick={() => ch_leave(state.user_name)}>Leave</button>
			</p>
			<table>
				<thead>
					<tr>
            <td>Player</td>
						<td>Guess</td>
						<td>Result</td>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
			<h4>Note: User has to input 4 unique digits, where the first digit can't be zero. NA means user entered N number of digits correct in correct position, while NB means user entered N number of digits correct but in wrong position.</h4>
		</div>
	);

}

function Observer({state}) {
    let {game_name, user_name, guesses, result, userinput, message} = state;

    let rows = [];
    for (let i = 0; i < state.result.length; i+=3) {
        //let guess1 = <td>{state.guesses[i]}</td>;
        let result1 = <><td>{state.result[i]}</td>
                      <td>{state.result[i+1]}</td>
                      <td>{state.result[i+2]}</td></>;
        rows.push(<tr>{result1}</tr>);
    }

    return (
		<div className = "App">
			<h1>4 Digits</h1>
      <h2>Player: {state.user_name}</h2>
      <h2>{state.game_name}</h2>
      <p>
      <button onClick={() => ch_leave(state.user_name)}>Leave</button>
			</p>
			<table>
				<thead>
					<tr>
            <td>Player</td>
						<td>Guess</td>
						<td>Result</td>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		</div>
	);

}

function Login() {
    const [name, setName] = useState({
        game_name: "",
        user_name: ""
    })
    return (
        <div className="row">
            <div className="column">
                <h3>Game Name</h3>
                <input type="text"
                    value={name.game_name}
                    onChange={(ev => setName({...name, game_name: ev.target.value}))} />
            </div>

            <div className="column">
                <h3>User Name</h3>
                <input type="text"
                    value={name.user_name}
                    onChange={(ev => setName({...name, user_name: ev.target.value}))} />
            </div>

            <div className="column">
                <button onClick={() => ch_login(name.user_name,name.game_name)}>Join</button>
            </div>
        </div>
    );
}

function Bulls() {
    const [state, setState] = useState({
        user_name: "",
        game_name: "",
        guesses: {},
        result: {},
        message: "",
        players: {},
        observers: [],
        last_winner: "",
        wins: {},
        timer: 0,
    });


    useEffect(() => {
        ch_join(setState);
    });

    console.log(state)
    let body = null;
    if (state.user_name === "") {
        body = <Login />;
    } else if (!state.game){
        body = <Lobby state={state}/>;
    } else if (state.game && state.observers.indexOf(state.user_name) > -1){
        body = <Observer state={state}/>;
    } else {
        body = <Play state={state} />;
    }

    return(
        <div className="container">
            {body}
        </div>
    );
}
export default Bulls
