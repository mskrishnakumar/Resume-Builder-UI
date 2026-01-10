// Firebase configuration for Mission Possible app
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDpYEPgAK8QbWymWU1ubqonEFrADzn5cJQ",
    authDomain: "resume-coach-auth.firebaseapp.com",
    projectId: "resume-coach-auth",
    storageBucket: "resume-coach-auth.firebasestorage.app",
    messagingSenderId: "918448249340",
    appId: "1:918448249340:web:51ce61a4e9f83c9bc17a79",
    measurementId: "G-G5LS5CY23H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
