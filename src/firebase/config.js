// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// Your web app's Firebase configuration


const firebaseConfig = {
  apiKey: "AIzaSyC3k_23RepelD628EZUKN9u3Tj3ICVAKtM",
  authDomain: "sfera-b3822.firebaseapp.com",
  projectId: "sfera-b3822",
  storageBucket: "sfera-b3822.firebasestorage.app",
  messagingSenderId: "939634643423",
  appId: "1:939634643423:web:c7b8559bc214193117f46a",
  measurementId: "G-EE0JKWPFFC"
};












// const firebaseConfig = {
//   apiKey: "AIzaSyA2esHCkZJIANNwnJ83JjPNire7KF5T0gQ",
//   authDomain: "sfera-f959f.firebaseapp.com",
//   projectId: "sfera-f959f",
//   storageBucket: "sfera-f959f.firebasestorage.app",
//   messagingSenderId: "891111107395",
//   appId: "1:891111107395:web:90b67b8e5f8267c26f5df6",
//   measurementId: "G-C031X8K0CH"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Import the functions you need from the SDKs you need


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
