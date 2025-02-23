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

const transactionInput = document.getElementById("incomeInput"); // Renamed for clarity
const addTransactionBtn = document.getElementById("addTransactionBtn"); // Renamed for clarity
const transactionList = document.getElementById("expenseList");
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

async function addTransaction() {
  const transactionAmount = parseFloat(transactionInput.value.trim());
  const transactionType = document.getElementById("transactionType").value; // Get selected type (Income or Expense)

  if (!isNaN(transactionAmount) && transactionAmount > 0) {
    let transactionId = await addTransactionToFirestore(
      transactionAmount,
      transactionType
    );
    transactionInput.value = "";
    updateBalance();
    createTransactionItem(transactionId, transactionAmount, transactionType);
  } else {
    alert("Please enter a valid amount!");
  }
}

async function addTransactionToFirestore(amount, type) {
  let transaction = await addDoc(collection(db, "transactions"), {
    amount: amount,
    type: type, // Save type of transaction (income or expense)
    email: email,
  });
  return transaction.id;
}

async function getTransactionsFromFirestore() {
  let q = query(collection(db, "transactions"), where("email", "==", email));
  return await getDocs(q);
}

async function updateBalance() {
  let transactions = await getTransactionsFromFirestore();
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.data().type === "income") {
      totalIncome += transaction.data().amount;
    } else if (transaction.data().type === "expense") {
      totalExpense += transaction.data().amount;
    }
  });

  const balance = totalIncome - totalExpense;
  balanceDisplay.textContent = `$${balance.toFixed(2)}`;
}

function createTransactionItem(id, amount, type) {
  let transactionItem = document.createElement("li");
  transactionItem.id = id;
  transactionItem.textContent = `${
    type.charAt(0).toUpperCase() + type.slice(1)
  }: $${amount.toFixed(2)}`;
  transactionList.appendChild(transactionItem);
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

addTransactionBtn.addEventListener("click", async () => {
  await addTransaction();
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
