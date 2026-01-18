/**
 * FIREBASE FIRESTORE DATABASE MODULE
 * Handles all database operations for Math Kingdom
 */

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    increment,
    onSnapshot,
    collection,
    query,
    orderBy,
    serverTimestamp,
    enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from './firebase-config.js';

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence
try {
    await enableIndexedDbPersistence(db);
    console.log('✅ Offline persistence enabled');
} catch (err) {
    if (err.code === 'failed-precondition') {
        console.warn('⚠️ Offline persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Offline persistence not available in this browser');
    }
}

/**
 * Firebase Database Manager
 */
export const FirebaseDB = {
    /**
     * Create or initialize user profile in Firestore
     * @param {string} uid - User ID
     * @param {object} userData - User data (username, displayName, etc.)
     * @returns {Promise<void>}
     */
    async createUserProfile(uid, userData) {
        try {
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                // Create new user profile
                await setDoc(userRef, {
                    username: userData.username,
                    email: userData.email,
                    displayName: userData.displayName,
                    totalScore: 0,
                    rank: 'Little Seedling',
                    rankIcon: '🌱',
                    topicScores: {},
                    createdAt: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
                console.log('✅ User profile created');
            } else {
                console.log('✅ User profile already exists');
            }
        } catch (error) {
            console.error('❌ Error creating user profile:', error);
            throw error;
        }
    },

    /**
     * Get user profile (one-time fetch)
     * @param {string} uid - User ID
     * @returns {Promise<object|null>}
     */
    async getUserProfile(uid) {
        try {
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                console.log('✅ User profile loaded');
                return userDoc.data();
            } else {
                console.log('⚠️ User profile not found');
                return null;
            }
        } catch (error) {
            console.error('❌ Error loading user profile:', error);
            throw error;
        }
    },

    /**
     * Listen to user profile changes in real-time
     * @param {string} uid - User ID
     * @param {Function} callback - Called when data changes
     * @returns {Function} Unsubscribe function
     */
    listenToUserProfile(uid, callback) {
        const userRef = doc(db, 'users', uid);

        return onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                console.log('🔄 User profile updated');
                callback(doc.data());
            } else {
                callback(null);
            }
        }, (error) => {
            console.error('❌ Error listening to profile:', error);
            callback(null);
        });
    },

    /**
     * Increment user stars (atomic operation - prevents race conditions)
     * @param {string} uid - User ID
     * @param {number} stars - Number of stars to add
     * @param {string} topicId - Topic ID (e.g., 'counting', 'shapes')
     * @returns {Promise<void>}
     */
    async incrementStars(uid, stars, topicId) {
        try {
            const userRef = doc(db, 'users', uid);

            const updates = {
                totalScore: increment(stars),
                lastUpdated: serverTimestamp()
            };

            // Also increment topic-specific score
            if (topicId) {
                updates[`topicScores.${topicId}`] = increment(stars);
            }

            await updateDoc(userRef, updates);
            console.log(`✅ Added ${stars} stars to ${topicId || 'total'}`);
        } catch (error) {
            console.error('❌ Error incrementing stars:', error);
            // Don't throw - Firestore will retry when back online
        }
    },

    /**
     * Update user rank
     * @param {string} uid - User ID
     * @param {string} rank - New rank name
     * @param {string} rankIcon - New rank icon
     * @returns {Promise<void>}
     */
    async updateUserRank(uid, rank, rankIcon) {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                rank: rank,
                rankIcon: rankIcon,
                lastUpdated: serverTimestamp()
            });
            console.log(`✅ Rank updated to ${rank}`);
        } catch (error) {
            console.error('❌ Error updating rank:', error);
        }
    },

    /**
     * Listen to leaderboard (all users, sorted by score)
     * @param {Function} callback - Called with sorted array of users
     * @returns {Function} Unsubscribe function
     */
    listenToLeaderboard(callback) {
        const usersRef = collection(db, 'users');
        const leaderboardQuery = query(usersRef, orderBy('totalScore', 'desc'));

        return onSnapshot(leaderboardQuery, (snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push({
                    uid: doc.id,
                    ...doc.data()
                });
            });
            console.log('🏆 Leaderboard updated:', users.length, 'users');
            callback(users);
        }, (error) => {
            console.error('❌ Error listening to leaderboard:', error);
            callback([]);
        });
    }
};

// Export db instance for advanced use
export { db };
