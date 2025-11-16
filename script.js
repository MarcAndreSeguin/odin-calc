let firstNumber = null;
let secondNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let justCalculated = false;

function operate(op, num1, num2) {
  switch (op) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "x":
      return multiply(num1, num2);
    case "÷":
      return divide(num1, num2);
  }
}

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 === 0) {
    return "Nice try!";
  }
  return num1 / num2;
}

function roundResult(num) {
  const str = num.toString();
  if (str.length > 16) {
    return parseFloat(num.toPrecision(10));
  }
  return num;
}

function handlePercent() {
  const currentValue = parseFloat(display.textContent);
  const result = currentValue / 100;
  const rounded = roundResult(result);
  display.textContent = rounded.toString();
}

function handleSquareRoot() {
  const currentValue = parseFloat(display.textContent);

  if (currentValue < 0) {
    display.textContent = "Error!";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    return;
  }

  const result = Math.sqrt(currentValue);
  const rounded = roundResult(result);
  display.textContent = rounded.toString();
}

function clearAll() {
  firstNumber = null;
  secondNumber = null;
  operator = null;
  waitingForSecondNumber = false;
  justCalculated = false;
  display.textContent = "0";
}

function deleteLastChar() {
  if (display.textContent.length === 1 || display.textContent === "0") {
    display.textContent = "0";
  } else if (display.textContent === "-0") {
    display.textContent = "0";
  } else {
    display.textContent = display.textContent.slice(0, -1);
  }
}

function handleOperator(op) {
  const currentValue = parseFloat(display.textContent);

  if (waitingForSecondNumber) {
    operator = op;
    return;
  }

  if (firstNumber !== null && operator !== null) {
    secondNumber = currentValue;
    const result = operate(operator, firstNumber, secondNumber);

    if (typeof result === "string") {
      display.textContent = result;
      firstNumber = null;
      operator = null;
      return;
    }

    const rounded = roundResult(result);
    display.textContent = rounded.toString();
    firstNumber = rounded;
  } else {
    firstNumber = currentValue;
  }

  operator = op;
  waitingForSecondNumber = true;
  justCalculated = false;
}

function handleEquals() {
  if (firstNumber === null || operator === null) {
    return;
  }

  if (waitingForSecondNumber) {
    return;
  }

  secondNumber = parseFloat(display.textContent);
  const result = operate(operator, firstNumber, secondNumber);

  if (typeof result === "string") {
    display.textContent = result;
  } else {
    const rounded = roundResult(result);
    display.textContent = rounded.toString();
  }

  firstNumber = null;
  secondNumber = null;
  operator = null;
  waitingForSecondNumber = false;
  justCalculated = true;
}

// DOM elements
const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number-pad button");
const operatorButtons = document.querySelectorAll(".right-column button");
const equalsButton = document.querySelector(".equals");
const percentButton = document.querySelector(
  ".left-column button:nth-child(1)"
); // %
const sqrtButton = document.querySelector(".left-column button:nth-child(2)"); // √
const delButton = document.querySelector(".left-column button:nth-child(3)"); // DEL
const clearButton = document.querySelector(".left-column button:nth-child(4)"); // CLR

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "+/-") {
      if (display.textContent === "0") {
        return;
      }
      if (display.textContent.startsWith("-")) {
        display.textContent = display.textContent.slice(1);
      } else {
        display.textContent = "-" + display.textContent;
      }
      return;
    }

    if ((value >= "0" && value <= "9") || value === ".") {
      if (justCalculated) {
        display.textContent = "0";
        justCalculated = false;
      }

      if (waitingForSecondNumber) {
        display.textContent = "0";
        waitingForSecondNumber = false;
      }

      if (value === ".") {
        if (display.textContent.includes(".")) {
          return;
        }
        if (display.textContent.length >= 16) {
          return;
        }
        if (display.textContent === "0") {
          display.textContent = "0.";
          return;
        }
      }

      if (display.textContent.length >= 16) {
        return;
      }

      if (display.textContent === "0" && value !== ".") {
        display.textContent = value;
      } else {
        display.textContent += value;
      }
    }
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleOperator(button.textContent);
  });
});

equalsButton.addEventListener("click", handleEquals);
percentButton.addEventListener("click", handlePercent);
sqrtButton.addEventListener("click", handleSquareRoot);
delButton.addEventListener("click", deleteLastChar);
clearButton.addEventListener("click", clearAll);

// Keyboard support (experimental)

document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Handle digit keys (0-9)
  if (key >= "0" && key <= "9") {
    if (justCalculated) {
      display.textContent = "0";
      justCalculated = false;
    }

    if (waitingForSecondNumber) {
      display.textContent = "0";
      waitingForSecondNumber = false;
    }

    if (display.textContent.length >= 16) {
      return;
    }

    if (display.textContent === "0") {
      display.textContent = key;
    } else {
      display.textContent += key;
    }
  }

  // Handle decimal point
  if (key === ".") {
    if (justCalculated) {
      display.textContent = "0";
      justCalculated = false;
    }

    if (waitingForSecondNumber) {
      display.textContent = "0";
      waitingForSecondNumber = false;
    }

    if (display.textContent.includes(".")) {
      return;
    }
    if (display.textContent.length >= 16) {
      return;
    }
    if (display.textContent === "0") {
      display.textContent = "0.";
    } else {
      display.textContent += ".";
    }
  }

  // Handle operators
  if (key === "+") {
    handleOperator("+");
  }
  if (key === "-") {
    handleOperator("-");
  }
  if (key === "*") {
    handleOperator("x");
  }
  if (key === "/") {
    e.preventDefault(); // Prevent browser's quick find feature
    handleOperator("÷");
  }

  // Handle Enter for equals
  if (key === "Enter") {
    handleEquals();
  }

  // Handle Escape for clear all
  if (key === "Escape") {
    clearAll();
  }

  // Handle Backspace for delete
  if (key === "Backspace") {
    deleteLastChar();
  }
});
