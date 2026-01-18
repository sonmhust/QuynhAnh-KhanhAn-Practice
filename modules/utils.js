/**
 * UTILITY FUNCTIONS
 * Shared helper functions for all modules
 */

// Random number generator
export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Shuffle array
export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/**
 * Generate unique wrong answers for multiple choice
 * Ensures no duplicates in the options array
 * @param {number} correctAnswer - The correct answer
 * @param {number} count - Number of wrong answers needed (default 3)
 * @param {number} range - Range for generating wrong answers (default 10)
 * @returns {Array} Array of options with no duplicates
 */
export function generateUniqueOptions(correctAnswer, count = 3, range = 10) {
    const options = new Set([correctAnswer]);

    while (options.size < count + 1) {
        // Generate wrong answers within range
        const offset = rand(1, range);
        const useNegative = rand(0, 1) === 0;
        const wrongAnswer = useNegative
            ? Math.max(0, correctAnswer - offset)
            : correctAnswer + offset;

        // Only add if positive and different from correct answer
        if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
            options.add(wrongAnswer);
        }
    }

    return shuffle([...options]);
}

/**
 * Generate options with specific wrong answers
 * Ensures uniqueness while allowing customization
 * @param {number} correctAnswer - The correct answer
 * @param {Array} preferredWrong - Preferred wrong answers
 * @returns {Array} Array of 4 unique options
 */
export function generateOptionsWithPreferred(correctAnswer, preferredWrong = []) {
    const options = new Set([correctAnswer]);

    // Add preferred wrong answers (if unique)
    for (const wrong of preferredWrong) {
        if (wrong > 0 && wrong !== correctAnswer && options.size < 4) {
            options.add(wrong);
        }
    }

    // Fill remaining slots with random values
    while (options.size < 4) {
        const offset = rand(1, 10);
        const wrongAnswer = rand(0, 1) === 0
            ? Math.max(1, correctAnswer - offset)
            : correctAnswer + offset;

        if (wrongAnswer !== correctAnswer) {
            options.add(wrongAnswer);
        }
    }

    return shuffle([...options]);
}

/**
 * Get current language from global State
 * @returns {string} Current language code ('en' or 'vi')
 */
export function getLang() {
    // Access State from window (set by core.js)
    return window.State?.language || 'en';
}

