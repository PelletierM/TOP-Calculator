let userInput = [];

// CALCULATE FUNCTIONS
function calculateSubTotal(a, b, operator) {
    if (operator === "+") {return +a + +b}
    else if (operator === "-") {return +a - +b}
    else if (operator === "*") {return +a * +b}
    else if (operator === "/") {return +a / +b}
    else if (operator === "^") {return Math.pow(+a, +b)}
}

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

//  Order of operation (PEMDAS) -> First clear parenthesis, then calculate in order of priority look for parenthesis and calculate their content */
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
    input = calculateOperator(calculateOperator(calculateOperator(calculateOperator(calculateOperator((combineParenthesis(input)), "^"), "*"), "/"), "+"), "-");
    return input
    }
