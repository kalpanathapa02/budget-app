import { db } from "./firebase.js";
import {
  doc,
  getDocs,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const incomeInput = document.getElementById("incomeInput");
const expenseInput = document.getElementById("expenseInput");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseList = document.getElementById("expenseList");
const balanceDisplay = document.getElementById("balance");

const aiButton = document.getElementById("send-btn");
const aiInput = document.getElementById("chat-input");
const chatHistory = document.getElementById("chat-history");

const signOutBttn = document.getElementById("signOutBttn");
const email = JSON.parse(localStorage.getItem("email"));

var apiKey;
var genAI;
var model;

if (!email) {
  window.location.href = "index.html";
}

async function getApiKey() {
  apiKey = "AIzaSyBGU3f-_SmCYjGmhLOydtF28FnKLe01fHs";
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

function appendMessage(message) {
  let history = document.createElement("div");
  history.textContent = message;
  history.className = "history";
  chatHistory.appendChild(history);
  aiInput.value = "";
}

async function askChatBot(request) {
  let result = await model.generateContent(request);
  appendMessage(result.response.text());
}

async function addExpense() {
  const expenseAmount = parseFloat(expenseInput.value.trim());
  if (!isNaN(expenseAmount) && expenseAmount > 0) {
    let expenseId = await addExpenseToFirestore(expenseAmount);
    expenseInput.value = "";
    updateBalance();
    createExpenseItem(expenseId, expenseAmount);
  } else {
    alert("Please enter a valid expense amount!");
  }
}

async function addExpenseToFirestore(amount) {
  let expense = await addDoc(collection(db, "expenses"), {
    amount: amount,
    email: email,
  });
  return expense.id;
}

async function getExpensesFromFirestore() {
  let q = query(collection(db, "expenses"), where("email", "==", email));
  return await getDocs(q);
}

async function updateBalance() {
  let expenses = await getExpensesFromFirestore();
  let totalExpense = 0;
  expenses.forEach((expense) => {
    totalExpense += expense.data().amount;
  });
  balanceDisplay.textContent = `$${totalExpense.toFixed(2)}`;
}

function createExpenseItem(id, amount) {
  let expenseItem = document.createElement("li");
  expenseItem.id = id;
  expenseItem.textContent = `$${amount.toFixed(2)}`;
  expenseList.appendChild(expenseItem);
}

window.addEventListener("load", async () => {
  getApiKey();
  updateBalance();
});

aiButton.addEventListener("click", async () => {
  let prompt = aiInput.value.trim();
  if (prompt) {
    askChatBot(prompt);
  } else {
    appendMessage("Please enter a prompt");
  }
});

addExpenseBtn.addEventListener("click", async () => {
  await addExpense();
});

signOutBttn.addEventListener("click", function () {
  localStorage.removeItem("email");
  window.location.href = "index.html";
});

document
  .getElementById("chatbot-toggle")
  .addEventListener("click", function () {
    document.getElementById("chatbot-container").style.display = "block";
  });

document.getElementById("close-chat").addEventListener("click", function () {
  document.getElementById("chatbot-container").style.display = "none";
});
