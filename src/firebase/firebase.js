// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCaMBS1KuEWI0ORiZQYeL1fpcdt0QA26bA",
    authDomain: "dentaapp-7d60f.firebaseapp.com",
    projectId: "dentaapp-7d60f",
    storageBucket: "dentaapp-7d60f.firebasestorage.app",
    messagingSenderId: "376515691456",
    appId: "1:376515691456:web:831208e0c668bef8da7e25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
