/**
 * FIREBASE CONFIGURATION
 * Initialize Firebase app and export for use in other modules
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_iXEzBTKuUHqjAGzwoJuwTvkMwTu9_pE",
    authDomain: "qa-ka-practice.firebaseapp.com",
    projectId: "qa-ka-practice",
    storageBucket: "qa-ka-practice.firebasestorage.app",
    messagingSenderId: "938299743998",
    appId: "1:938299743998:web:04145444c60dba30018faf",
    measurementId: "G-2768WYSE68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('✅ Firebase initialized');

// Export app for use in other modules
export { app };
