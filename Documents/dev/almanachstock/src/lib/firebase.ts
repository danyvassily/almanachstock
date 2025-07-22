// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// 🔥 REMPLACE PAR TA CONFIGURATION FIREBASE RÉELLE 🔥
const firebaseConfig = {
  apiKey: "AIzaSyBUW7t089PEYdrvkvhLrQnFKZqrooZoYHg",
  authDomain: "l-almanach-stock.firebaseapp.com",
  projectId: "l-almanach-stock",
  storageBucket: "l-almanach-stock.firebasestorage.app",
  messagingSenderId: "471255748821",
  appId: "1:471255748821:web:fab8832adb0e016604125c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
