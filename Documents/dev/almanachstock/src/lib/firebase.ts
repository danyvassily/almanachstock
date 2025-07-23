// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase sécurisée avec variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBUW7t089PEYdrvkvhLrQnFKZqrooZoYHg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "l-almanach-stock.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "l-almanach-stock",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "l-almanach-stock.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "471255748821",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:471255748821:web:fab8832adb0e016604125c",
};

// Validation de la configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Configuration Firebase manquante. Vérifiez vos variables d'environnement.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
