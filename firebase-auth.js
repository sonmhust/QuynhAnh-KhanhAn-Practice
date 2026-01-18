/**
 * FIREBASE AUTHENTICATION MODULE
 * Handles user authentication for Math Kingdom
 */

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { app } from './firebase-config.js';

// Initialize Auth
const auth = getAuth(app);

// Set persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence);

// Student credentials mapping
const STUDENT_CREDENTIALS = {
    'quynhanh': {
        email: 'quynhanh@math.com',
        password: 'quynhanh',
        displayName: 'Quỳnh Anh'
    },
    'khanhan': {
        email: 'khanhan@math.com',
        password: 'khanhan',
        displayName: 'Khánh An'
    }
};

/**
 * Firebase Authentication Manager
 */
export const FirebaseAuth = {
    /**
     * Sign in with username (maps to email/password)
     * @param {string} username - Student username ('quynhanh' or 'khanhan')
     * @returns {Promise<User>} Firebase user object
     */
    async signIn(username) {
        const usernameLower = username.toLowerCase().trim();
        const credentials = STUDENT_CREDENTIALS[usernameLower];

        if (!credentials) {
            throw new Error(`Invalid username. Only 'quynhanh' and 'khanhan' are allowed.`);
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            console.log('✅ Signed in successfully:', credentials.displayName);
            return {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                username: usernameLower,
                displayName: credentials.displayName
            };
        } catch (error) {
            console.error('❌ Sign in error:', error);

            // User account doesn't exist - provide helpful message
            if (error.code === 'auth/user-not-found') {
                throw new Error('Account not created yet. Please contact admin to set up your account.');
            } else if (error.code === 'auth/wrong-password') {
                throw new Error('Authentication error. Please contact admin.');
            } else if (error.code === 'auth/network-request-failed') {
                throw new Error('Network error. Please check your internet connection.');
            }

            throw error;
        }
    },

    /**
     * Get currently signed-in user
     * @returns {User|null} Current user or null
     */
    getCurrentUser() {
        const user = auth.currentUser;
        if (!user) return null;

        // Find username from email
        const username = Object.keys(STUDENT_CREDENTIALS).find(
            key => STUDENT_CREDENTIALS[key].email === user.email
        );

        return {
            uid: user.uid,
            email: user.email,
            username: username || 'unknown',
            displayName: username ? STUDENT_CREDENTIALS[username].displayName : 'Student'
        };
    },

    /**
     * Listen for auth state changes
     * @param {Function} callback - Called with user object when auth state changes
     * @returns {Function} Unsubscribe function
     */
    onAuthChange(callback) {
        return onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const username = Object.keys(STUDENT_CREDENTIALS).find(
                    key => STUDENT_CREDENTIALS[key].email === firebaseUser.email
                );

                callback({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: username || 'unknown',
                    displayName: username ? STUDENT_CREDENTIALS[username].displayName : 'Student'
                });
            } else {
                // User is signed out
                callback(null);
            }
        });
    },

    /**
     * Check if username is valid
     * @param {string} username
     * @returns {boolean}
     */
    isValidUsername(username) {
        return username.toLowerCase().trim() in STUDENT_CREDENTIALS;
    },

    /**
     * Get display name for username
     * @param {string} username
     * @returns {string}
     */
    getDisplayName(username) {
        const credentials = STUDENT_CREDENTIALS[username.toLowerCase().trim()];
        return credentials ? credentials.displayName : username;
    }
};

// Export auth instance for advanced use
export { auth };
