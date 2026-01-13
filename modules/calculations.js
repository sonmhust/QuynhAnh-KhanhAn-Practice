/**
 * CALCULATIONS MODULE
 * Generates questions for: column addition, column subtraction, 
 * column subtraction with exchange, 2-digit subtraction with exchange
 */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export function generateQuestion(difficulty = 'easy') {
    const type = rand(0, 3);

    switch (type) {
        case 0: return generateColumnAddition(difficulty);
        case 1: return generateColumnSubtraction(difficulty);
        case 2: return generateColumnSubtractionWithExchange(difficulty);
        case 3: return generateTwoDigitSubtractionWithExchange(difficulty);
        default: return generateColumnAddition(difficulty);
    }
}

/**
 * Creates HTML for column format display
 */
function createColumnHTML(num1, num2, operator) {
    const num1Str = num1.toString().padStart(2, ' ');
    const num2Str = num2.toString().padStart(2, ' ');
    const maxLen = Math.max(num1Str.length, num2Str.length);

    return `
        <div class="column-calculation">
            <div class="column-row top-number">${num1Str.split('').map(d => `<span class="digit">${d}</span>`).join('')}</div>
            <div class="column-row bottom-number">
                <span class="operator">${operator}</span>
                ${num2Str.split('').map(d => `<span class="digit">${d}</span>`).join('')}
            </div>
            <div class="column-line"></div>
            <div class="column-row answer-row">
                <span class="digit answer-placeholder">?</span>
            </div>
        </div>
    `;
}

/**
 * COLUMN ADDITION
 * Simple column addition without carrying (easy) to with carrying (hard)
 */
function generateColumnAddition(difficulty) {
    let a, b;

    if (difficulty === 'easy') {
        // No carrying needed: ones digits sum < 10
        const tensA = rand(1, 4);
        const onesA = rand(1, 4);
        const tensB = rand(1, 4);
        const onesB = rand(1, 9 - onesA); // Ensure no carry
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    } else if (difficulty === 'medium') {
        // May need carrying
        a = rand(20, 50);
        b = rand(15, 40);
        // Ensure sum < 100
        if (a + b >= 100) b = 99 - a;
    } else {
        // Definitely carrying needed, larger numbers
        const tensA = rand(3, 6);
        const onesA = rand(5, 9);
        const tensB = rand(2, Math.floor((99 - tensA * 10 - onesA) / 10));
        const onesB = rand(10 - onesA, 9); // Force carrying
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
        // Ensure sum < 100
        if (a + b >= 100) b = 99 - a;
    }

    const answer = a + b;
    const columnHTML = createColumnHTML(a, b, '+');

    return {
        question: `Solve this column addition:`,
        questionHTML: columnHTML,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle([answer, answer + 1, answer - 1, answer + 10]) : undefined,
        answer: answer,
        hint: `Add the ones first, then add the tens. ${a} + ${b} = ?`,
        visual: '📊',
        check: (input) => parseInt(input) === answer
    };
}

/**
 * COLUMN SUBTRACTION (no exchange/borrowing)
 */
function generateColumnSubtraction(difficulty) {
    let a, b;

    if (difficulty === 'easy') {
        // No borrowing needed: ones of a >= ones of b
        const tensA = rand(3, 5);
        const onesA = rand(5, 9);
        const tensB = rand(1, tensA - 1);
        const onesB = rand(1, onesA); // No borrow needed
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    } else if (difficulty === 'medium') {
        // Still no borrowing, larger numbers
        const tensA = rand(5, 8);
        const onesA = rand(5, 9);
        const tensB = rand(2, tensA - 1);
        const onesB = rand(0, onesA);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    } else {
        // No borrowing, full 2-digit range
        const tensA = rand(6, 9);
        const onesA = rand(5, 9);
        const tensB = rand(3, tensA - 1);
        const onesB = rand(0, onesA);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    }

    const answer = a - b;
    const columnHTML = createColumnHTML(a, b, '−');

    return {
        question: `Solve this column subtraction:`,
        questionHTML: columnHTML,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle([answer, answer + 1, answer - 1, answer + 10]) : undefined,
        answer: answer,
        hint: `Subtract the ones first, then subtract the tens. ${a} − ${b} = ?`,
        visual: '📊',
        check: (input) => parseInt(input) === answer
    };
}

/**
 * COLUMN SUBTRACTION WITH EXCHANGE (borrowing)
 * The ones digit of top number < ones digit of bottom number
 */
function generateColumnSubtractionWithExchange(difficulty) {
    let a, b;

    if (difficulty === 'easy') {
        // Simple exchange needed
        const tensA = rand(3, 5);
        const onesA = rand(0, 4);
        const tensB = rand(1, tensA - 2); // Leave room after borrowing
        const onesB = rand(onesA + 1, 9); // Force borrow
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    } else if (difficulty === 'medium') {
        // Exchange with medium numbers
        const tensA = rand(5, 7);
        const onesA = rand(0, 5);
        const tensB = rand(2, tensA - 2);
        const onesB = rand(onesA + 1, 9);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    } else {
        // Exchange with larger numbers
        const tensA = rand(6, 9);
        const onesA = rand(0, 4);
        const tensB = rand(3, tensA - 2);
        const onesB = rand(onesA + 2, 9);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    }

    const answer = a - b;
    const columnHTML = createColumnHTML(a, b, '−');

    return {
        question: `Solve with exchange (borrowing):`,
        questionHTML: columnHTML,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle([answer, answer + 1, answer - 1, answer + 10]) : undefined,
        answer: answer,
        hint: `You need to borrow! Take 1 ten from ${Math.floor(a / 10)} tens, add 10 to ${a % 10} ones.`,
        visual: '🔄',
        check: (input) => parseInt(input) === answer
    };
}

/**
 * SUBTRACTING 2-DIGIT NUMBERS WITH EXCHANGING
 * Both numbers are 2-digit, requires borrowing
 */
function generateTwoDigitSubtractionWithExchange(difficulty) {
    let a, b;

    if (difficulty === 'easy') {
        // 2-digit minus 2-digit with simple exchange
        const tensA = rand(4, 6);
        const onesA = rand(1, 4);
        const tensB = rand(1, tensA - 2);
        const onesB = rand(onesA + 1, 9);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    } else if (difficulty === 'medium') {
        // Larger 2-digit numbers
        const tensA = rand(5, 7);
        const onesA = rand(0, 4);
        const tensB = rand(2, tensA - 2);
        const onesB = rand(onesA + 2, 9);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    } else {
        // Full range 2-digit with exchange
        const tensA = rand(7, 9);
        const onesA = rand(0, 3);
        const tensB = rand(3, tensA - 2);
        const onesB = rand(onesA + 3, 9);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
    }

    const answer = a - b;
    const columnHTML = createColumnHTML(a, b, '−');

    // Create step-by-step hint
    const borrowedOnes = (a % 10) + 10;
    const remainingTens = Math.floor(a / 10) - 1;

    return {
        question: `Subtract these 2-digit numbers (use exchange):`,
        questionHTML: columnHTML,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle([answer, answer + 1, answer - 1, answer + 10]) : undefined,
        answer: answer,
        hint: `Step 1: Borrow → ${borrowedOnes} − ${b % 10} = ${borrowedOnes - (b % 10)}. Step 2: ${remainingTens} − ${Math.floor(b / 10)} = ${remainingTens - Math.floor(b / 10)}`,
        visual: '🧮',
        check: (input) => parseInt(input) === answer
    };
}
