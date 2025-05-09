// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2esHCkZJIANNwnJ83JjPNire7KF5T0gQ",
  authDomain: "sfera-f959f.firebaseapp.com",
  projectId: "sfera-f959f",
  storageBucket: "sfera-f959f.firebasestorage.app",
  messagingSenderId: "891111107395",
  appId: "1:891111107395:web:90b67b8e5f8267c26f5df6",
  measurementId: "G-C031X8K0CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
