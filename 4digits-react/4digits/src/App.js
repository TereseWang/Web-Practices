import React from 'react';
import { useState } from 'react';
import { generateSecret, renderGuessResultRow, validateGuesses, checkGuesses, displaySecret} from './game'
import './App.css';

function App() {
	//the answer to be guessed by the user 
	const [secret, setSecrect] = useState(generateSecret());
	//the sequence of guesses attempted 
	const [guesses, setGuesses] = useState([]);
	//the sequence of result associated with guesses
	const [result, setResult] = useState([]);
	//the current user input 
	const [userInput, setUserInput] = useState("");
	//number of lives had left for user
	const [lives, setLives] = useState(8);
	//some message to help user play the game
	const [message, setMessage] = useState("Enter 4 Digits To Start")
	//check if the game is end or not, if ended, no further input can be entered
	const [gamestate, setGameState] = useState("progress")  //"end"
	//render the guesses attempted and hints 
	let renderGRRow = renderGuessResultRow(guesses, result) 
	//display the answer when the game is end
	let displaySec = displaySecret(gamestate, secret)

	//allows user to enter input that has length less than 4 and when the game is in progress
	function updateGuess(ev) {
		let text = ev.target.value;
		if (text.length <= 4 && gamestate === "progress") {
			setUserInput(text);
		}
	}
	//check the current userInput, and check if the game is in progress, and check if the input 
	//length is equal to 4, if user had make a guess that had been entered before, ignore
	//else, further validate the guess and print hints 
	function makeGuess() {
		if (gamestate === "progress" && userInput.length === 4) {
			if (guesses.includes(userInput)) {
				setMessage("You have guessed this number, enter another")
			}
			else {
				compareGuess()
			}
		}
	}
	
	//compare the answer with current guess had been made, if guess == answer, then end the game
	//else send hints with NANB format to the user, and set lives minus one and clear user input
	//if the lives is already 1 left, end the game and notify the user lossing the game 
	function compareGuess() {
		if (validateGuesses(userInput) && userInput[0] !== "0") {
			if (userInput  === secret) {
				setMessage("You Win!")
				setGameState("end")
			}
			else {
				setGuesses(guesses.concat(userInput))
				let userResult = checkGuesses(userInput, secret)
				setResult(result.concat(userResult))
				if(lives === 1) {
					setMessage("You Lose!")
					setLives(lives - 1);
					setGameState("end")
				}
				else {
					setMessage("Guess Processed")
					setUserInput("");
					setLives(lives - 1);
				}
			}
		}
		else if(userInput[0] === "0") {
			setMessage("First Digit Cannot be 0")
		}
		else {
			setMessage("Please Enter 4 Unique Digits In Range 0-9")
		}
	}

	//reset the game by clearing all the inputs and regenerate an answer 
	function resetGame() {
		setSecrect(generateSecret());
		setGuesses([]);
		setUserInput("");
		setResult([]);
		setLives(8);
		setMessage("Enter 4 Digits To Start")
		setGameState("progress")
	}

	//when enter key is pressed, call makeGuess, same functionality as pressing the guess button 
	function keypress(ev) {
		if (ev.key === "Enter") {
			makeGuess();
		}
	}
	
	//html part 
	return (
		<div className = "App">
			<h1>4 Digits</h1>
			<hr/>
			<h2> {message}</h2>
			<h3> Lives Remain: {lives} </h3>
			<input type="text" value={userInput} size="4" 
					onChange={updateGuess} onKeyPress={keypress}/>
			<p>	
			<button onClick={makeGuess}>Guess</button>
			<button onClick={resetGame}>Reset</button>
			</p>
			<table>
				<thead>
					<tr>
						<th>Guess</th>
						<th>Result</th>
					</tr>
				</thead>
				<tbody>
					{renderGRRow}
				</tbody>
			</table>
			<h2 id="secret">{displaySec}</h2>
			<hr/>
			<h4>Note: User has to input 4 unique digit numbers, with first letter to not be zero. NA means user had entered N number of digits correct in correct position , while NB means user had entered N number of digits correct but in wrong position</h4>
		</div>
	);
}
export default App;
	
