// DOM Elements
const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('moneyPlus');
const moneyMinus = document.getElementById('moneyMinus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Retrieve transactions from localStorage or default to []
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add submission handler
form.addEventListener('submit', addTransaction);

// Initialize app
init();

// Generate unique ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please enter both a description and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value // convert to number
  };

  transactions.push(transaction);
  updateLocalStorage();
  addTransactionDOM(transaction);
  updateValues();

  text.value = '';
  amount.value = '';
}

// Render transaction in list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? 'minus' : 'plus';
  const item = document.createElement('li');
  item.classList.add(sign);
  item.innerHTML = `
    ${transaction.text} <span>₹${Math.abs(transaction.amount).toFixed(2)}</span>
  `;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete');
  deleteBtn.textContent = 'X';
  deleteBtn.addEventListener('click', () => removeTransaction(transaction.id));

  item.appendChild(deleteBtn);
  list.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const income = amounts
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(val => val < 0)
           .reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.textContent = `₹${total}`;
  moneyPlus.textContent = `+₹${income}`;
  moneyMinus.textContent = `-₹${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Populate UI and values
function init() {
  list.innerHTML = '';
  if (transactions.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No transactions yet.';
    list.appendChild(emptyItem);
  } else {
    transactions.forEach(addTransactionDOM);
  }
  updateValues();
}

// Save to localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}