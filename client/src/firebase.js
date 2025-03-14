// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-agrisync.firebaseapp.com",
  projectId: "mern-agrisync",
  storageBucket: "mern-agrisync.firebasestorage.app",
  messagingSenderId: "795705796081",
  appId: "1:795705796081:web:5d40063ae4ec52204dd050"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);