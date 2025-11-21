// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCK5P7aVewTaQcL6IlVwKay-hkLILRBTTk",
    authDomain: "psusertrack.firebaseapp.com",
    projectId: "psusertrack",
    storageBucket: "psusertrack.firebasestorage.app",
    messagingSenderId: "149189121952",
    appId: "1:149189121952:web:9c745880f621019d24f6c5",
    measurementId: "G-WF46TDSR6M"
};

// Initialize Firebase
// Check if window is defined (client-side) before initializing analytics
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
