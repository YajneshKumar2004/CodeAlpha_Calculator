const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;
let resultDisplayed = false;

function updateDisplay(value) {
  display.textContent = value;
}

function clearCalculator() {
  currentInput = '';
  operator = null;
  firstOperand = null;
  waitingForSecondOperand = false;
  resultDisplayed = false;
  updateDisplay('0');
  document.querySelectorAll('[data-action]').forEach(btn => btn.classList.remove('active-operator'));
}

function inputDigit(digit) {
  if (resultDisplayed) {
    currentInput = digit === '.' ? '0.' : digit;
    resultDisplayed = false;
  } else if (digit === '.' && currentInput.includes('.')) {
    return;
  } else {
    currentInput = currentInput === '0' && digit !== '.' ? digit : currentInput + digit;
  }
  updateDisplay(currentInput);
}

function handleOperator(nextOperator) {
  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }
  if (firstOperand === null && currentInput !== '') {
    firstOperand = parseFloat(currentInput);
  } else if (operator) {
    const result = performCalculation(operator, firstOperand, parseFloat(currentInput));
    firstOperand = result;
    updateDisplay(result);
  }
  operator = nextOperator;
  waitingForSecondOperand = true;
  currentInput = '';
  const actionMap = { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide' };
  const action = actionMap[nextOperator];
  if (action) {
    document.querySelector(`[data-action="${action}"]`).classList.add('active-operator');
  }
}

function performCalculation(operator, first, second) {
  if (operator === '+') return first + second;
  if (operator === '-') return first - second;
  if (operator === '*') return first * second;
  if (operator === '/') {
    if (second === 0) return 'Error';
    return first / second;
  }
  return second;
}

function handleEquals() {
  if (operator && currentInput !== '') {
    const secondOperand = parseFloat(currentInput);
    const result = performCalculation(operator, firstOperand, secondOperand);
    updateDisplay(result);
    currentInput = result === 'Error' ? '' : String(result);
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    resultDisplayed = true;
    document.querySelectorAll('[data-action]').forEach(btn => btn.classList.remove('active-operator'));
  }
}

function handleBackspace() {
  if (resultDisplayed) return;
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput || '0');
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.hasAttribute('data-digit')) {
      inputDigit(btn.getAttribute('data-digit'));
    } else if (btn.hasAttribute('data-action')) {
      const action = btn.getAttribute('data-action');
      if (action === 'clear') clearCalculator();
      else if (action === 'add') handleOperator('+');
      else if (action === 'subtract') handleOperator('-');
      else if (action === 'multiply') handleOperator('*');
      else if (action === 'divide') handleOperator('/');
      else if (action === 'equals') handleEquals();
      else if (action === 'backspace') handleBackspace();
    }
  });
});

clearCalculator(); 