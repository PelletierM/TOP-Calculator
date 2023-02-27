// CALCULATE FUNCTIONS
function calculateSubTotal(a, b, operator) {
    if (operator == addition) {return +a + +b}
    else if (operator == substraction) {return +a - +b}
    else if (operator == multiplication) {return +a * +b}
    else if (operator == division) {return +a / +b} // Find a way to return error when dividing by 0
    else if (operator == exponent) {return Math.pow(+a, +b)}
}

/* Always make sure these constants match with the html button value */
const exponent = "^";
const multiplication = " x ";
const division = " / ";
const substraction = " - ";
const addition = " + ";
const openParenthesis = "(";
const closedParenthesis = ")";
const point = "."
const equal = " = "
const backspace = "backspace"

let operatorPrecedence = {
    [exponent]: 3, 
    [division]: 2,
    [multiplication]: 2,
    [substraction]: 1,
    [addition]: 1,
}

function calculate(input, insideParenthesis = false, previousStackPrecedence = 5) {
    let parsedInput = [];
    let currentPrecedence = 0;
    let unparsedInput = [];
    for (let i = 0; i < input.length; i++) {
        if (typeof input[i] === "object") {
            input[i] = input[i].value.join("");
            console.log(input[i])
            --i;
        }
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
            else if (input[(i+1)] === closedParenthesis) {
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
        else if (input[i] === openParenthesis) {
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
let lastOperatorLength = 0;
let parenthesisCount = 0;
let ans = {
    value: undefined
}
console.log(typeof ans === "object")
let history = {}

// BUTTON EVENT LISTENERS
const calculationText = document.querySelector(".calculation-text")
const activeText = document.querySelector(".active-text")

const buttonsContainer = document.querySelector(".all-buttons")
buttonsContainer.addEventListener("click", function(e){
    if(e.target.nodeName === "BUTTON") {
        if(e.target.classList.contains("number")) appendNumber(e);
        else if(e.target.classList.contains("point")) appendPoint(e);
        else if(e.target.classList.contains("operator")) appendOperator(e);
        else if(e.target.classList.contains("open-parenthesis")) appendOpenParenthesis(e);
        else if(e.target.classList.contains("closed-parenthesis")) appendClosedParenthesis(e);
        else if(e.target.classList.contains("backspace")) executeBackspace(e);
        if(e.target.classList.contains("equal")) {
            triggerEqual();
            return
        }
        activeText.innerText = activeString;
    }
})

const allButtons = document.querySelectorAll("button")
document.addEventListener("keydown", function(e){
    for (let button of allButtons) {
        let keyValue = e.key.slice(0);
        if (keyValue === "*") {keyValue = multiplication}
        if (keyValue === "Enter") {keyValue = equal}
        if (keyValue === "Backspace") {keyValue = backspace}
        if (keyValue === ",") {keyValue = point}
        if (button.value.includes(keyValue)) {
            button.click();
        }
    }
})

function appendNumber(e) {
    if (checkClosedParenthesis()) {
        activeArray.push(multiplication) ;
        activeString += multiplication ;        
    }
    lastOperatorLength = 0;
    activeString += e.target.value;
    ++numCounter;
}

// MAKE IT ADD 0 TO STRING IF STRING LENGTH = 0
function appendPoint(e) {
    if (!activeString.slice(-numCounter).includes(point)) {
        lastOperatorLength = 0;
        activeString += e.target.value;
        ++numCounter;
    }
}

function appendOperator(e) {
    if (activeString.length === 0 && ans.value !== undefined) {
        activeArray.push(ans, e.target.value);
        activeString += "Ans" + e.target.value;
        lastOperatorLength = e.target.value.length;
    }
    if (!checkOpenParenthesis() && activeString.length > 0) {    
        if (lastOperatorLength > 0) {
            activeArray.splice(-1, 1, e.target.value);
            activeString = activeString.slice(0, -lastOperatorLength) + e.target.value;
            lastOperatorLength = e.target.value.length;
        }
        else {
            pushString();
            activeArray.push(e.target.value);
            activeString += e.target.value;
            lastOperatorLength = e.target.value.length;
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
        activeArray.push(multiplication, openParenthesis) ;
        activeString += multiplication + openParenthesis ;
    }
    else {
        activeArray.push(openParenthesis);
        activeString += openParenthesis;
    }
    ++parenthesisCount;
}

function appendClosedParenthesis(e){
    if (lastOperatorLength === 0 && parenthesisCount > 0 && !checkOpenParenthesis()) {
        pushString();
        activeArray.push(closedParenthesis);
        activeString += closedParenthesis;
        --parenthesisCount;
    }
}

function checkOpenParenthesis() {
   return activeString.slice(-1) === openParenthesis;
}

function checkClosedParenthesis() {
   return activeString.slice(-1) === closedParenthesis;
}

function executeBackspace() {
    pushString()
    if (checkOpenParenthesis()) removeOpenParenthesis()
    else if (checkClosedParenthesis()) removeClosedParenthesis()
    else if (Object.keys(operatorPrecedence).includes(activeArray[activeArray.length - 1])) removeOperator();
    // YOU ARE HERE - NEXT IS REMOVE NUMBER AND ANS.
}

function removeLastNaN() {
    activeString = activeString.slice(0, (activeString.length - activeArray[activeArray.length - 1].length))
    activeArray.pop();
}

function removeOpenParenthesis() {
    removeLastNaN();
    --parenthesisCount;
    lastOperatorLength = activeArray[activeArray.length - 1].length;      
}

function removeClosedParenthesis() {
    removeLastNaN();
    ++parenthesisCount;
    lastOperatorLength = 0
    numCounter = activeArray[activeArray.length - 1].length;
    activeArray.pop();     
}

function removeOperator() {
    removeLastNaN()
    lastOperatorLength = 0;
    numCounter = activeArray[activeArray.length - 1].length;
    activeArray.pop();  
}

function triggerEqual() {
    if(activeString !== "" && lastOperatorLength === 0 && !checkOpenParenthesis()){
        pushString();
        while (parenthesisCount > 0) {
            activeArray.push(closedParenthesis);
            activeString += closedParenthesis;
            --parenthesisCount;       
        }
        executeCalculate();
    }
    else if(activeString === "" && Object.keys(history).length > 0) {
        activeArray = history[Object.keys(history).length][2];
        activeString = history[Object.keys(history).length] [0];
        executeCalculate();
    }
}

function executeCalculate() {
    let tempArray = activeArray.slice(0);
    ans.value = calculate(tempArray)
    addToHistory()
    calculationText.innerText = activeString;
    activeText.innerText = ans.value;
    resetVariables()
}

function addToHistory() {
    history[`${Object.keys(history).length+1}`] = [activeString, ans, activeArray]
}

function resetVariables() {
    activeString = "";
    activeArray = [];
    numCounter = 0;
    lastOperatorLength = 0;
    parenthesisCount = 0;
}