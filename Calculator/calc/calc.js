(function(){
	"use strict";
	/* store the current function
	 */
	var func = "";
	/*store the most recent operator, if the function is "1 + ", 
	 * op will be "+",if function is completed the operator will be "", 
	 * for example a function end with a number will be 
	 * considered as complete, like "1+2+3" is completed 
	 */
	var op = "";
	/* The most recent number, for example "23+100" the most
	 * recent number will be 100*/
	var num = "";
	/* check if the function is complete and evaluted, for example, 
	 * if entered function "1 + 2", this is considered complete, 
	 * and if the user entered "+=", it will evaluate the function 
	 * and considered as finished. After finished, if user enter 
	 * another number, it will automatically cleared up and change to the 
	 * newly entered number. For thsi program, it will store the entered 
	 * function and evaluate at very last when the function is considered 
	 * as complete and user had entered "+=" after completing the function
	 */
	var finished = false;
	var complete = false;
	/*Display the number and do operations if the input is number button*/
	function numInput(x){
		/*display of the calculator, displaying entered value*/
		let display = document.getElementById("value");
		/*if the display value 0 and does not contain any dot value
		 * change the display value to the entered valued and add to 
		 * current number, current function and list finished and 
		 * complete as false
		 */
		if (display.value == 0 && !num.includes(".")) {
			display.value = x;
			func = x;
			num = x;
			finished = false;
			complete = false;
		}
		/*if the display value is not zero or does contain the dot value*/
		else {
			/*if the function is complete and evaluated, clear things 
			 * up and change to entered value and add to current
			 * number and function
			 */
			if(finished) {
				display.value = x;
				func = x;
				num = x;
				finished = false;
				complete = false;
			}
			/*if the function is not complete, append the value*/
			else {
				display.value += x;
				func += x;
				/*if the function ends with an operator, adding 
				 * number will complete the function
				 */
				if(op != "") {
					op = "";
					finished = false;
					complete = true;
					num = x;
				}
				/*else just append the number*/
				else {
					num+= x;
				}
			}
		}
	}
	/* do operations if the input is an operator */ 
	function opInput(x) {
		let display = document.getElementById("value");
		switch(x) {
			/*do plus and enter evaluation*/
			case "+/=":
				evalPlus();
				break;
			case "-":
				/* check if the op is empty, if op is not empty 
				 * meaning the function is not complete and user 
				 * should not enter the new operator
				 */
				if (op === "") {
					/*apend the display value to the operator*/
					display.value += "-";
					/*append the current function to the operator*/
					func += "-";
					/*declare the most recent operator to be "-"*/
					op = "-";
					complete = false;
					/*declare the function as not complete and finished*/
					finished = false;
					num = "";
				}
				break;
			case "x":
				if (op == "") {
					/* for multiply and division, do the evaluation 
					 * before and multiple and division at last, 
					 * for example, if user add multiply operator it 
					 * will displayed and evaluated as (func) * x.
					 */
					display.value = "(" + display.value + ")" + "x";
					func += "*";
					op = "*";
					complete = false;
					finished = false;
					num = "";
				}
				break;
			case "/":
				if (op == "") {
					/*if the operator is added successfully 
					 * the function is not considered as not 
					 * complete and it will set the current 
					 * number to empty
					 */
					display.value = "(" + display.value + ")" + "/";
					func += "/";
					op = "/";
					complete = false;
					finished = false;
					num = "";
				}
				break;
			case ".":
				evalDot();
				break;
			default:
		}

	}
	/*evaluate the plus and enter function*/
	function evalPlus() {
		let display = document.getElementById("value");
		/* if the function is considered as complete, 
		 * when user enter the "+=" sign it will considered 
		 * as using enter key and evaluate the function and clear 
		 * things up.
		 */
		if (op == "" && complete) {
			let result = evalExp();
			display.value = result;
			op = "";
			num = result;
			func = result;
			finished = true;
			complete = false;
		}
		/* if the function is not complete, and the function now has 
		 * only one number, it will add the plus operator and do 
		 * the plus evaluation later.
		 */
		else if (op == "" && !complete){
			display.value += "+";
			op = "+";
			func += "+";
			num = "";
			complete = false;
			finished = false;
		}
	}

	/*add dot according to conditions*/
	function evalDot() {
		let display = document.getElementById("value");
		/* if the function is evaluated already and marked as complete
		 * entering a dot will start a new function and set the value as "0."
		 */
		if (finished) {
			display.value = "0.";
			num = "0.";
			func = "0.";
			finished = false;
			complete = false;
		}
		/*if the function is not finished and does not include dot with 
		 * the current number append the dot to the function.
		 */
		else if (!num.includes(".") && !finished) {
			/*if current operator is empty meaning the function 
			 * has number at end, append the dot directly to the 
			 * end of the number.
			 */
			if (op == "" && num != "" && func != "") {
				display.value += ".";
				num += ".";
				func += ".";
			}
			/*  if the operator is not empty and current number 
			 *  is empty and function is not empty meaning the 
			 *  function is at the state like "1 + ", 
			 *  appending the dot and set to 0.
			 */
			else if (op != "" && num == "" && func != "") {
				display.value += "0.";
				num = "0.";
				func += "0.";
			}
			/*if function is completely empty,meaning nothing 
			 * is entered,set the value to 0.
			 */
			else if (op == "" && num == "" && func == ""){
				display.value += ".";
				func = "0.";
				num = "0.";
			}
		}

	}
	/* this function will split the stored function into numbers and opertors 
	 * and do the evaluation by order, for example if the input function 
	 * is "1+2*2" this will evaluate 1+2, and then time 2 and such. 
	 */
	function evalExp() {
		var lm = func.match(/[^\d()]+|[\d.]+/g);
		var num = 0;
		var op = "";
		for (let i = 0; i < lm.length; i++) {
			if(isNaN(lm[i])) {
				op = lm[i];
			}
			else {
				if(num == 0 && op == "") {
					num = parseFloat(lm[i]);
				}
				else {
					switch(op) {
						case "+" :
							num = num + parseFloat(lm[i]);
							break;
						case "-" :
							num = num - parseFloat(lm[i]);
							break;
						case "*" :
							num = num * parseFloat(lm[i]);
							break;
						case "/" :
							num = num / parseFloat(lm[i]);
							break;
						default:
					}
				}
			}
		}
		return num;
	}

	//clear the display value and restore everything else to default 
	function clearInput() {
		let display = document.getElementById("value");
		display.value = 0;
		complete = false;
		finished = false;
		num = "";
		func = "";
		op = "";
	}

	/*set all the buttons with event listener and direct to funtctions depending on 
	 * if the input is clear, or number button or operator button.
	 */
	function init(){
		let calcbuttons = document.querySelectorAll("input[type=button]");
		for (let i = 0; i < calcbuttons.length; i++) {
			let cbutton = calcbuttons[i];
			let cvalue = cbutton.value;
			if(isNaN(cvalue)) {
				if (cvalue === "c") {
					cbutton.addEventListener("click", clearInput);
				}
				else {
					cbutton.addEventListener("click", function(){opInput(cvalue);});
				}
			}
			else {
				cbutton.addEventListener("click", function(){numInput(cvalue);});
			}
		}

	}
	window.addEventListener("load", init, false);
})();
