// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

// Allowed usernames
const ALLOWED_USERS = ['quynhanh', 'khanhan'];

// Firebase Database Manager
export const FirebaseDB = {
  // Check if username is allowed
  isValidUsername(username) {
    return ALLOWED_USERS.includes(username.toLowerCase().trim());
  },

  // Save user progress
  async saveProgress(username, progressData) {
    try {
      const userRef = doc(db, 'users', username.toLowerCase());
      await setDoc(userRef, {
        username: username,
        rank: progressData.rank || 'Little Seedling',
        rankIcon: progressData.rankIcon || '🌱',
        totalScore: progressData.totalScore || 0,
        topicScores: progressData.topicScores || {},
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      console.log('✅ Progress saved successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error saving progress:', error);
      return false;
    }
  },

  // Load user progress
  async loadProgress(username) {
    try {
      const userRef = doc(db, 'users', username.toLowerCase());
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        console.log('✅ Progress loaded successfully!');
        return userDoc.data();
      } else {
        // Create new user with default data
        console.log('📝 Creating new user profile...');
        const defaultData = {
          username: username,
          rank: 'Little Seedling',
          rankIcon: '🌱',
          totalScore: 0,
          topicScores: {},
          lastUpdated: new Date().toISOString()
        };
        await this.saveProgress(username, defaultData);
        return defaultData;
      }
    } catch (error) {
      console.error('❌ Error loading progress:', error);
      return null;
    }
  }
};
