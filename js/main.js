let userInput = [];

// CALCULATE FUNCTIONS
function calculateSubTotal(a, b, operator) {
    if (operator === "+") {return +a + +b}
    else if (operator === "-") {return +a - +b}
    else if (operator === "*") {return +a * +b}
    else if (operator === "/") {return +a / +b} // Find a way to return error when dividing by 0
    else if (operator === "^") {return Math.pow(+a, +b)}
}
/*  
    I have made 2 different functions to calculate the result of a given array.
    The first one loops over the whole array for every pair of parenthesis,
    then loops over the whole array 5 more times, one for each operator and in order of priority
    The second one uses a recursive function to parse the array. It's much more complex to understand
    than the first one, but has the advantage of going over the whole array only once.
    Both solutions have a time complexity of O(n), but after some testing the second one seems
    to be twice as fast as the first one. It also allows me to add more operators in the future,
    without having to change the function's code.
*/

// THIS IS THE FIRST CALCULATE OPTION - Loop complete array once for each operator
function calculateOperator(input, operator) {
    let indexStartOp = 0;
    let indexEndOp = 0;
    while (input.some(item => item === operator)) {
        for (let i = 0; i < input.length; i++) {
            if(input[i] === operator) {indexStartOp = (i-1); indexEndOp = (i+1); break}
        }
        let subTotalOp = calculateSubTotal(+input[indexStartOp], +input[indexEndOp], operator);
        let tempArrayOp1 = input.slice(0, indexStartOp);
        let tempArrayOp2 = subTotalOp
        let tempArrayOp3 = input.slice((indexEndOp + 1))
        input = tempArrayOp1.concat(tempArrayOp2).concat(tempArrayOp3)
    }
    return input
}

function combineParenthesis(input) {
    while (input.some(item => item === "(")) {   
        let indexStartParenthesis = 0;
        let indexEndParenthesis = 0;
        for (let i = 0; i < input.length; i++) {
            if(input[i] === "("){indexStartParenthesis = i}
            else if (input[i] === ")") {indexEndParenthesis = i; break};
        }
        if (indexStartParenthesis > 0 && !isNaN(+input[(indexStartParenthesis - 1)])){
            input.splice(indexStartParenthesis, 0, "*");
            indexStartParenthesis += 1;
            indexEndParenthesis += 1;
        }
        let subTotalParenthesis = input.slice((indexStartParenthesis + 1), indexEndParenthesis);
        subTotalParenthesis = calculate(subTotalParenthesis)
        let tempArrayParenthesis = []
        input = tempArrayParenthesis.concat(input.slice(0, indexStartParenthesis), subTotalParenthesis, input.slice((indexEndParenthesis+1)));
    }
    return input
}

function calculate(input) {
    input = calculateOperator(calculateOperator(calculateOperator(calculateOperator(calculateOperator((combineParenthesis(input)), "^"), "/"), "*"), "-"), "+");
    return input
    }

// THIS IS THE SECOND CALCULATE OPTION - Parser with recursive function
let operatorPrecedence = {
    "^": 3, 
    "/": 2,
    "*": 2,
    "-": 1,
    "+": 1,
}

function calculationTest(input, insideParenthesis = false, previousStackPrecedence = 5) {
    let parsedInput = [];
    let currentPrecedence = 0;
    let unparsedInput = [];
    for (let i = 0; i < input.length; i++) {
        if (!isNaN(+input[i])) {
            if (input[(i+1)] in operatorPrecedence) {
                if (currentPrecedence === 0 || operatorPrecedence[input[(i + 1)]] <= currentPrecedence) {
                    if (currentPrecedence >= previousStackPrecedence && !insideParenthesis) {
                        parsedInput.push(input[i]);
                        unparsedInput = input.slice((i+1));
                        break;
                    }
                    else {
                        currentPrecedence = operatorPrecedence[input[(i + 1)]];
                        parsedInput.push(input[i], input[(i + 1)]);
                        ++i;
                    }
                }
                else {
                    tempArray = input.slice(i);
                    input = parsedInput.concat(calculationTest(tempArray, false, currentPrecedence));
                    --i;
                }
            }
            else if (input[(i+1)] === ")") {
                if (!insideParenthesis) {
                    parsedInput.push(input[i]);
                    unparsedInput = input.slice((i + 1));
                    break;
                }
                else {
                    parsedInput.push(input[i]);
                    unparsedInput = input.slice((i + 2));
                    break;
                }
            }
            else {
                parsedInput.push(input[i]);
            }
        }
        else if (input[i] === "(") {
            input.splice(i, 1);
            tempArray = input.slice(i);
            input = parsedInput.concat(calculationTest(tempArray, true, currentPrecedence));
            --i;
        }
        // Fin a way to return error here
    }
    while (parsedInput.length > 1) {
        parsedInput.splice(0, 3, (calculateSubTotal(parsedInput[0], parsedInput[2], parsedInput[1])));
    }
    return parsedInput.concat(unparsedInput)
}

// BUTTON EVENT LISTENERS
const currentOperationText = document.querySelector(".currentOperationText")
const resultText = document.querySelector(".resultText")

const allButtons = document.querySelector(".allButtons")
allButtons.addEventListener("click", function(e){
    if(e.target.nodeName === "BUTTON") {
    userInput.push(e.target.innerText)
    }
    currentOperationText.innerText = userInput.join("")
    equalButton(e);
})

function equalButton(e) {
    if(e.target.innerText === "=") {
    resultText.innerText = calculate(userInput).join("");
    }
}