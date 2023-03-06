/* Always make sure these const match with the html button value */
const exponent = "^";
const multiplication = " x ";
const division = " / ";
const substraction = " - ";
const addition = " + ";
const openParenthesis = "(";
const closedParenthesis = ")";
const point = "."
const plusMinus = "-"
const equal = " = "
const backspace = "backspace"
const errorMessage = "ERROR"

/* 
INPUT FUNCTIONS 
*/
let activeArray = [];
let activeString = "";
let numCounter = 0;
const maxNumCounter = 15;
let lastOperatorLength = 0;
let parenthesisCount = 0;
let ans = {
    value: undefined
}
let history = {}

    /* 
    CHECK FUNCTIONS 
    */
function checkPlusMinusState() {
    return activeString.charAt(activeString.length - numCounter - 1) === plusMinus;
}

function checkOpenParenthesis() {
   return activeString.slice(-1) === openParenthesis;
}

function checkClosedParenthesis() {
   return activeString.slice(-1) === closedParenthesis;
}

function checkAnsLast() {
    return (typeof activeArray[activeArray.length - 1] === "object");
}

    /* 
    APPEND FUNCTIONS 
    */
function pushString() {
    if (numCounter !== 0 && !checkAnsLast()) {
        if (checkPlusMinusState()) {
            numCounter += 1;
        }
        activeArray.push(activeString.slice(-numCounter));
    }
    numCounter = 0;
}

function appendNumber(value) {
    if (checkClosedParenthesis() || checkAnsLast()) {
        appendOperator(multiplication);        
    }
    if (numCounter === 1 && activeString.slice(-1) == "0") {
        activeString = activeString.slice(0, -1);
        --numCounter;
    }
    if (numCounter < maxNumCounter){
        lastOperatorLength = 0;
        activeString += value;
        ++numCounter;
    }
}

function appendPoint(value) {
    if (numCounter === 0) {
        appendNumber("0")
    }
    if (!activeString.slice(-numCounter).includes(point) && numCounter < maxNumCounter) {
        lastOperatorLength = 0;
        activeString += value;
        ++numCounter;
    }
}

function togglePlusMinus(value) {
    if (numCounter === 0 && !checkPlusMinusState()) {
        appendNumber("0");
    }
    if (!checkPlusMinusState() && !checkAnsLast()) {
        activeString = activeString.slice(0, -numCounter) + value + activeString.slice(-numCounter);
    }
    else if(checkPlusMinusState()) {
        activeString = activeString.slice(0, activeString.length - numCounter - 1) + activeString.slice(activeString.length - numCounter);
    }
}

function appendOperator(value) {
    if (activeString.length === 0 && ans.value !== undefined) {
        activeArray.push(ans, value);
        activeString += "Ans" + value;
        lastOperatorLength = value.length;
    }
    if (!checkOpenParenthesis() && activeString.length !== 0 && (activeString.charAt(activeString.length - 1) !== plusMinus)) {    
        if (lastOperatorLength > 0) {
            activeArray.splice(-1, 1, value);
            activeString = activeString.slice(0, -lastOperatorLength) + value;
            lastOperatorLength = value.length;
        }
        else {
            pushString();
            activeArray.push(value);
            activeString += value;
            lastOperatorLength = value.length;
        }
    }  
}

function appendOpenParenthesis() {
    if (numCounter > 0 || checkClosedParenthesis() || checkAnsLast()) {
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

function appendClosedParenthesis(){
    if (lastOperatorLength === 0 && parenthesisCount > 0 && !checkOpenParenthesis()) {
        pushString();
        activeArray.push(closedParenthesis);
        activeString += closedParenthesis;
        --parenthesisCount;
    }
}

function appendAns(){
    if(ans.value !== undefined && !checkAnsLast()) {
        if (checkClosedParenthesis() || numCounter > 0) {
            appendOperator(multiplication);       
        }
        activeArray.push(ans);
        activeString += "Ans";
        lastOperatorLength = 0;
        numCounter = 0;
    }
}

    /* 
    REMOVE FUNCTIONS 
    */
function executeBackspace() {
    if(activeString.length > 0) {
        pushString();
        if (checkOpenParenthesis()) removeOpenParenthesis();
        else if (checkClosedParenthesis()) removeClosedParenthesis();
        else if (!isNaN(+activeArray[activeArray.length - 1])) removeNumber()
        else if (Object.keys(operatorPrecedence).includes(activeArray[activeArray.length - 1])) removeOperator();
        else if (checkAnsLast()) removeAns();
    }
}

function removeLastNaN() {
    activeString = activeString.slice(0, (activeString.length - activeArray[activeArray.length - 1].length))
    activeArray.pop();
}

function popActiveArrayNum() {
    numCounter = activeArray[activeArray.length - 1].length;
    numCounter -= 1;
    if (checkPlusMinusState()) {
        numCounter -= 1;
    }
    numCounter +=1;
    activeArray.pop();
}

function removeOpenParenthesis() {
    removeLastNaN();
    --parenthesisCount;
    if (activeArray.length > 0) {
    lastOperatorLength = activeArray[activeArray.length - 1].length;}  
}

function removeClosedParenthesis() {
    removeLastNaN();
    ++parenthesisCount;
    lastOperatorLength = 0
    popActiveArrayNum();   
}

function removeOperator() {
    removeLastNaN()
    lastOperatorLength = 0;
    numCounter = 0;
    if (!checkClosedParenthesis() && !checkAnsLast()) {
        popActiveArrayNum(); 
    }
}

function removeAns() {
    activeString = activeString.slice(0, activeString.length - 3)
    activeArray.pop();
    if(activeArray.length > 0) {
        lastOperatorLength = activeArray[activeArray.length - 1].length;
    }
    numCounter = 0;
}

function removeNumber() {
    popActiveArrayNum();
    if(checkPlusMinusState() && numCounter <= 1) {
        togglePlusMinus();
    }
    activeString = activeString.slice(0, activeString.length - 1)
    --numCounter
    if(numCounter === 0 && activeArray.length > 0) {
        lastOperatorLength = activeArray[activeArray.length - 1].length;
    }
}

    /* 
    EQUAL FUNCTIONS 
    */
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
        activeString = history[Object.keys(history).length][0];
        executeCalculate();
    }
}

function executeCalculate() {
    let tempArray = activeArray.slice(0);
    ans.value = calculate(tempArray)
    resultText.innerText = `${activeString} =`;
    if (isNaN(ans.value)) {
        activeText.innerText = errorMessage;
        ans.value = undefined;
    }
    else {
        activeText.innerText = Math.round(1000000 * ans.value)/1000000;
    }
    addToHistory()
    resetVariables()
}

function addToHistory() {
    /* CSS is column-reverse, order elements accordingly */
    history[`${Object.keys(history).length+1}`] = [activeString, ans.value, activeArray]
    let formulaPara = document.createElement("p");
    let formulaParaText = document.createTextNode(`${activeString} =`);
    formulaPara.appendChild(formulaParaText);
    let ansPara = document.createElement("p");
    let ansParaText = document.createTextNode(`${activeText.innerText}`);
    ansPara.appendChild(ansParaText);
    if (historyText.firstChild) {
        formulaPara.classList.add("para-margin");
    }
    historyText.prepend(ansPara, formulaPara);
}

function resetVariables() {
    activeArray = [];
    activeString = "";
    numCounter = 0;
    lastOperatorLength = 0;
    parenthesisCount = 0;
}

function clearAll() {
    resetVariables()
    ans.value = undefined;
    activeText.innerText = "";
    resultText.innerText = "";
}

/* 
CALCULATE FUNCTIONS 
*/
let operatorPrecedence = {
    [exponent]: 3, 
    [division]: 2,
    [multiplication]: 2,
    [substraction]: 1,
    [addition]: 1,
}

function calculateSubTotal(a, b, operator) {
    if (operator == addition) {return +a + +b}
    else if (operator == substraction) {return +a - +b}
    else if (operator == multiplication) {return +a * +b}
    else if (operator == division) {if(+b !== 0) {return +a / +b} else{return NaN}}// Find a way to return error when dividing by 0
    else if (operator == exponent) {return Math.pow(+a, +b)}
}

function calculate(input, insideParenthesis = false, previousStackPrecedence = 5) {
    let parsedInput = [];
    let currentPrecedence = 0;
    let unparsedInput = [];
    for (let i = 0; i < input.length; i++) {
        if (typeof input[i] === "object") {
            input[i] = input[i].value.join("");
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
    }
    while (parsedInput.length > 1) {
        parsedInput.splice(0, 3, (calculateSubTotal(parsedInput[0], parsedInput[2], parsedInput[1])));
    }
    return parsedInput.concat(unparsedInput)
}

/* 
CLICK AND KEYBOARD EVENT LISTENERS 
*/
const historyText = document.querySelector(".history-text")
const resultText = document.querySelector(".result-text")
const activeText = document.querySelector(".active-text")
const calculatorContainer = document.querySelector(".calculator")
calculatorContainer.addEventListener("click", function(e){
    if(e.target.nodeName === "BUTTON") {
        if(activeString.length === 0 && ans.value !== undefined) {resultText.innerText = `Ans = ${Math.round(100000000 * ans.value)/100000000}`}
        else if(activeText.innerText == errorMessage) {resultText.innerText = `Ans = ${errorMessage}`};
        if(e.target.classList.contains("number")) appendNumber(e.target.value)
        else if(e.target.classList.contains("point")) appendPoint(e.target.value)
        else if(e.target.classList.contains("plus-minus")) togglePlusMinus(e.target.value)
        else if(e.target.classList.contains("operator")) appendOperator(e.target.value)
        else if(e.target.classList.contains("open-parenthesis")) appendOpenParenthesis()
        else if(e.target.classList.contains("closed-parenthesis")) appendClosedParenthesis()
        else if(e.target.classList.contains("ans")) appendAns()
        else if(e.target.classList.contains("backspace")) executeBackspace();
        activeText.innerText = activeString;
        if(e.target.classList.contains("equal")) triggerEqual();
        if(e.target.classList.contains("clear-all")) clearAll();
        if(e.target.classList.contains("clear-history")) clearHistory();
        if(e.target.classList.contains("toggle-history")) toggleHistory();
    }
})

const allButtons = document.querySelectorAll("button")
const keyboardInputs = {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    ".": point,
    ",": point,
    "(": openParenthesis,
    ")": closedParenthesis,
    "*": multiplication,
    "x": multiplication,
    "/": division,
    "+": addition,
    "-": substraction,
    "±": plusMinus,
    "^": exponent,
    "Enter": equal,
    "Escape": "clear-all",
    "Delete": "clear-all",
    "Backspace": backspace,
    "a": "ans",
    "h": "toggle-history"
}

function checkKeyboardInput(e) {
    if (e.key in keyboardInputs) {
    return keyboardInputs[e.key]
    }
}

document.addEventListener("keydown", function(e){
    let currentKeyValue = checkKeyboardInput(e);
    for (let button of allButtons) {
        if (button.value === currentKeyValue) {
            button.click();
            button.classList.add("active")
        }
    }
})
document.addEventListener("keyup", function(e){
    let currentKeyValue = checkKeyboardInput(e);
    for (let button of allButtons) {
        if (button.value === currentKeyValue) {
            button.classList.remove("active")
        }
    }
})

    /* 
    HISTORY BUTTONS AND HANDLERS 
    */
function clearHistory() {
    history = {}
    while (historyText.firstChild) {
        historyText.removeChild(historyText.lastChild)
    }
}

const historyMenu = document.querySelector(".history-menu")
const historyBgCont = document.querySelector(".history-bg-cont")
const historyBg = document.querySelector(".history-bg")

function toggleHistory() {
    if (!historyMenu.classList.contains("active")) {
        historyMenu.classList.add("active");
        historyBgCont.classList.add("active");
        historyBg.classList.add("active");
    }
    else {
        historyMenu.classList.remove("active");
        historyBgCont.classList.remove("active");
        historyBg.classList.remove("active");
    }
}