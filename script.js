let firstNumber;
let secondNumber;
let operator;

function operate(op, num1, num2) {
  switch (op) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
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
  return num1 - num2;
}

const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number-pad button");

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "+/-") {
      if (display.textContent === "0") {
        return;
      } // Don't toggle zero

      if (display.textContent.startsWith("-")) {
        display.textContent = display.textContent.slice(1); // Remove negative
      } else {
        display.textContent = "-" + display.textContent; // Add negative
      }
      return;
    }

    if ((value >= "0" && value <= "9") || value === ".") {
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
