// Firebase initialization module
// This module initializes Firebase services for the application

// Import Firebase modules (using compat version for simplicity with vanilla JS)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPFCPvD_MSWPJo8sFmTiwzjt5DmDudyUE",
  authDomain: "pasteyemmanueliren.firebaseapp.com",
  projectId: "pasteyemmanueliren",
  storageBucket: "pasteyemmanueliren.firebasestorage.app",
  messagingSenderId: "676192699356",
  appId: "1:676192699356:web:848662f249a8a0da8f8519",
  measurementId: "G-Q76P0GNKJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let analytics = null;

// Initialize analytics only in production (not localhost)
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  analytics = getAnalytics(app);
}

// Export initialized services
export { app, auth, db, storage, analytics };
