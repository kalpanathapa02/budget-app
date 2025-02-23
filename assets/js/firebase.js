import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCuWLYWUJ2R4v6ptAKcL2jmXJPDSGl7uW0",
    authDomain: "info5146.firebaseapp.com",
    projectId: "info5146",
    storageBucket: "info5146.firebasestorage.app",
    messagingSenderId: "711911517967",
    appId: "1:711911517967:web:cadd485436fb294a85987a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();