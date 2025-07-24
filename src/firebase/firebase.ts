// src/firebase/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaMBS1KuEWI0ORiZQYeL1fpcdt0QA26bA",
  authDomain: "dentaapp-7d60f.firebaseapp.com",
  projectId: "dentaapp-7d60f",
  storageBucket: "dentaapp-7d60f.firebasestorage.app",
  messagingSenderId: "376515691456",
  appId: "1:376515691456:web:831208e0c668bef8da7e25",
  measurementId: "G-W84JM7KPKX",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
