import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBADhGx4BWzYYrneU8k2nb4FugXORnv4PU",
  authDomain: "kalpana-web-trends.firebaseapp.com",
  projectId: "kalpana-web-trends",
  storageBucket: "kalpana-web-trends.firebasestorage.app",
  messagingSenderId: "467225967111",
  appId: "1:467225967111:web:eb5ba3388a97d2e8e0c8a2",
  measurementId: "G-L67SB6MMDL",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
