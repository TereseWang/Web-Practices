import React from 'react';

//generate random 4 digit number, that first number is not 0 
//and all 4 number is unique 
export function generateSecret() {
	let result = ""
	result +=Math.floor(Math.random() * (10 - 1) + 1);
	while (result.length !== 4) {
		let a = Math.floor(Math.random() * (10 - 0) + 0);
		if(result.indexOf(a) === -1) {
			result += a
		}
	}
	return result
}

//check if the guess is unique with 4 different number 
function isUnique(guess) {
	let result = true;
	for (let i = 0; i < guess.length; i++) {
		let guess1 = guess.substring(0, i);
		guess1+=guess.substring(i+1, guess.length)
		if (guess1.includes(guess.substring(i, i+1))) {
			result = false;
			break;
		}
	}
	return result;
}

//check if the guess is a valid guess, by checking if the guess is unique 
//and it is composed of all numbers
export function validateGuesses(guess) {
	let result = true;
	if(isUnique(guess)) {
		if(isNaN(guess)) {
			result = false;
		}
		else {
			result = true;
		}
	}
	else{
		result = false;
	}
	return result
}

//compare the guess with the answer, bulls are number of digits that are correct 
//in position, cows are digits that are included in the answer but in wrong position
export function checkGuesses(guess, answer) {
	let bulls = 0
	let cows = 0
	for(let i = 0; i < guess.length; i++) {
		if (guess[i] === answer[i]) {
			bulls+=1
		}
		else if (answer.includes(guess[i]) && guess[i] !== answer[i]) {
			cows+=1
		}
	}
	return `${bulls}A${cows}B`
}

//render the guesses attemp along with the result showing how many bulls and cows 
export function renderGuessResultRow(guesses, result) {
	let rows = [];
	for (let i = 0; i < guesses.length; i++) {
		let guess1 = <td>{guesses[i]}</td>;
		let result1 = <td>{result[i]}</td>;
		rows.push(<tr>{[guess1, result1]} </tr>);
	}
	return rows;
}

//display the answer when user is either lose or win the game 
export function displaySecret(state, answer){
	let result = ""
	if (state === "end") {
		result = `The Answer is: ${answer}`
	}
	return result
}
