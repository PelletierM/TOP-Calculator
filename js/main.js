// CALCULATE FUNCTIONS
function calculateSubTotal(a, b, operator) {
    if (operator === "+") {return +a + +b}
    else if (operator === "-") {return +a - +b}
    else if (operator === "x") {return +a * +b}
    else if (operator === "/") {return +a / +b} // Find a way to return error when dividing by 0
    else if (operator === "^") {return Math.pow(+a, +b)}
}

let operatorPrecedence = {
    "^": 3, 
    "/": 2,
    "x": 2,
    "-": 1,
    "+": 1,
}

function calculate(input, insideParenthesis = false, previousStackPrecedence = 5) {
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
                    input = parsedInput.concat(calculate(tempArray, false, currentPrecedence));
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
            input = parsedInput.concat(calculate(tempArray, true, currentPrecedence));
            --i;
        }
        // Fin a way to return error here
    }
    while (parsedInput.length > 1) {
        parsedInput.splice(0, 3, (calculateSubTotal(parsedInput[0], parsedInput[2], parsedInput[1])));
    }
    return parsedInput.concat(unparsedInput)
}

let activeArray = [];
let activeString = "";
let numCounter = 0;
let operatorMode = false;
let parenthesisCount = 0;
let ans = "";
let history = {}

// BUTTON EVENT LISTENERS
const calculationText = document.querySelector(".calculation-text")
const activeText = document.querySelector(".active-text")

const allButtons = document.querySelector(".all-buttons")
allButtons.addEventListener("click", function(e){
    if(e.target.nodeName === "BUTTON") {
        if(e.target.classList.contains("number")) appendNumber(e);
        else if(e.target.classList.contains("point")) appendPoint(e);
        else if(e.target.classList.contains("operator")) appendOperator(e);
        else if(e.target.classList.contains("open-parenthesis")) appendOpenParenthesis(e);
        else if(e.target.classList.contains("closed-parenthesis")) appendClosedParenthesis(e);
        activeText.innerText = activeString;
        if(e.target.classList.contains("equal")) triggerEqual();
    }
})

function appendNumber(e) {
    if (checkClosedParenthesis()) {
        activeArray.push("x") ;
        activeString += "x" ;        
    }
    operatorMode = false;
    activeString += e.target.innerText;
    ++numCounter;
}

function appendPoint(e) {
    if (!activeString.includes(".")) {
        activeString += e.target.innerText;
        ++numCounter;
    }
}

function appendOperator(e) {
    if (!checkOpenParenthesis() && activeString.length > 0) {    
        if (operatorMode) {
            activeArray.splice(-1, 1, e.target.innerText)
            activeString = activeString.slice(0, -1) + e.target.innerText;
        }
        else {
            pushString();
            activeArray.push(e.target.innerText);
            activeString += e.target.innerText;
            operatorMode = true;
        }
    }
    
}

    function pushString() {
        if (numCounter > 0) {
            activeArray.push(activeString.slice(-numCounter));
        }
        numCounter = 0;
    }

function appendOpenParenthesis(e) {
    if (numCounter > 0 || checkClosedParenthesis()) {
        pushString();
        activeArray.push("x", "(") ;
        activeString += "x(" ;
    }
    else {
        activeArray.push("(");
        activeString += "(";
    }
    ++parenthesisCount;
}

function appendClosedParenthesis(e){
    if (!operatorMode && parenthesisCount > 0 && !checkOpenParenthesis()) {
        pushString();
        activeArray.push(")");
        activeString += ")";
        --parenthesisCount;
    }
}

function checkOpenParenthesis() {
   return activeString.slice(-1) === "(";
}

function checkClosedParenthesis() {
   return activeString.slice(-1) === ")";
}

function triggerEqual() {
    pushString();
    while (parenthesisCount > 0) {
        activeArray.push(")");
        activeString += ")";
        --parenthesisCount;       
    }
    ans = calculate(activeArray).join("");
    history[`${Object.keys(history).length+1}`] = [activeString, ans]
    calculationText.innerText = activeString;
    activeText.innerText = ans;
    activeString = "";
    activeArray = [];
}
