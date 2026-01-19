/**
 * CALCULATIONS MODULE - RESTRUCTURED WITH CHAPTERS
 * 
 * Chapter 10.1: Column Calculations + Inverse Equations & Fact Families
 * Chapter 10.2: Multiplication (connection to addition, double/half, perform multiplication)
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

// ============================================================================
// MAIN QUESTION GENERATOR
// ============================================================================

export function generateQuestion(difficulty = 'easy', chapter = null) {
    if (chapter === 1) {
        return generateChapter1Question(difficulty);
    } else if (chapter === 2) {
        return generateChapter2Question(difficulty);
    } else {
        // Random selection for backward compatibility
        const chapterChoice = rand(1, 2);
        return chapterChoice === 1 ? generateChapter1Question(difficulty) : generateChapter2Question(difficulty);
    }
}

// ============================================================================
// CHAPTER 10.1: COLUMN CALCULATIONS + INVERSE & FACT FAMILIES
// ============================================================================

function generateChapter1Question(difficulty) {
    const type = rand(0, 5);

    switch (type) {
        case 0: return generateColumnAddition(difficulty);
        case 1: return generateColumnSubtraction(difficulty);
        case 2: return generateAddSubFactFamily(difficulty);
        case 3: return generateAddSubInverse(difficulty);
        case 4: return generateMultDivFactFamily(difficulty);
        case 5: return generateMissingNumberAddSub(difficulty);
        default: return generateColumnAddition(difficulty);
    }
}

/**
 * Column Addition - Vertical format with/without carrying
 */
function generateColumnAddition(difficulty) {
    const lang = getLang();
    let a, b, hasCarrying;

    if (difficulty === 'easy') {
        // No carrying: ones sum < 10
        a = rand(10, 50);
        const onesA = a % 10;
        const maxOnesB = 9 - onesA;
        b = rand(10, 30);
        // Ensure no carrying
        b = Math.floor(b / 10) * 10 + rand(0, Math.min(maxOnesB, 9));
        hasCarrying = false;
    } else if (difficulty === 'medium') {
        // With carrying
        a = rand(15, 50);
        b = rand(15, 49);
        hasCarrying = (a % 10) + (b % 10) >= 10;
    } else {
        // Definitely with carrying
        a = rand(25, 50);
        const onesA = a % 10;
        const tensB = rand(1, 4);
        const onesB = rand(10 - onesA, 9); // Ensure carrying
        b = tensB * 10 + onesB;
        hasCarrying = true;
    }

    const answer = a + b;
    const carryText = hasCarrying ? t('calc', 'with_carrying', lang) : t('calc', 'no_carrying', lang);

    // Create vertical column display
    const aStr = a.toString().padStart(2, ' ');
    const bStr = b.toString().padStart(2, ' ');

    return {
        question: `${t('calc', 'calculate', lang)} ${carryText}`,
        questionHTML: `
            <div class="column-calculation">
                <div class="column-row top-number">
                    ${aStr.split('').map(d => `<span class="digit">${d}</span>`).join('')}
                </div>
                <div class="column-row bottom-number">
                    <span class="operator">+</span>${bStr.split('').map(d => `<span class="digit">${d}</span>`).join('')}
                </div>
                <div class="column-line"></div>
                <div class="column-row answer-row">
                    <span class="answer-placeholder">? ?</span>
                </div>
            </div>
        `,
        type: 'input',
        answer: answer,
        hint: hasCarrying ? t('calc', 'hint_carry_ten', lang) : t('calc', 'hint_add_ones_first', lang),
        visual: '📐',
        check: (input) => parseInt(input) === answer
    };
}

/**
 * Column Subtraction - Vertical format with/without borrowing
 */
function generateColumnSubtraction(difficulty) {
    const lang = getLang();
    let a, b, hasBorrowing;

    if (difficulty === 'easy') {
        // No borrowing: ones of a >= ones of b
        a = rand(20, 50);
        const onesA = a % 10;
        const tensB = rand(0, Math.floor(a / 10) - 1);
        const onesB = rand(0, onesA);
        b = tensB * 10 + onesB;
        hasBorrowing = false;
    } else if (difficulty === 'medium') {
        // Mix of with/without borrowing
        a = rand(30, 70);
        b = rand(10, a - 5);
        hasBorrowing = (a % 10) < (b % 10);
    } else {
        // Definitely with borrowing
        a = rand(40, 99);
        const onesA = a % 10;
        const tensB = rand(1, Math.floor(a / 10) - 1);
        const onesB = rand(onesA + 1, 9); // Ensure borrowing
        b = tensB * 10 + onesB;
        hasBorrowing = true;
    }

    const answer = a - b;
    const borrowText = hasBorrowing ? t('calc', 'with_borrowing', lang) : t('calc', 'no_borrowing', lang);

    const aStr = a.toString().padStart(2, ' ');
    const bStr = b.toString().padStart(2, ' ');

    return {
        question: `${t('calc', 'calculate', lang)} ${borrowText}`,
        questionHTML: `
            <div class="column-calculation">
                <div class="column-row top-number">
                    ${aStr.split('').map(d => `<span class="digit">${d}</span>`).join('')}
                </div>
                <div class="column-row bottom-number">
                    <span class="operator">−</span>${bStr.split('').map(d => `<span class="digit">${d}</span>`).join('')}
                </div>
                <div class="column-line"></div>
                <div class="column-row answer-row">
                    <span class="answer-placeholder">? ?</span>
                </div>
            </div>
        `,
        type: 'input',
        answer: answer,
        hint: hasBorrowing ? t('calc', 'hint_borrow', lang) : t('calc', 'hint_sub_ones_first', lang),
        visual: '📐',
        check: (input) => parseInt(input) === answer
    };
}

/**
 * Addition/Subtraction Fact Family
 */
function generateAddSubFactFamily(difficulty) {
    const lang = getLang();

    const a = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 50);
    const b = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 50);
    const c = a + b;

    const correctEquations = [
        `${a} + ${b} = ${c}`,
        `${b} + ${a} = ${c}`,
        `${c} − ${a} = ${b}`,
        `${c} − ${b} = ${a}`
    ];

    const wrongEquations = [
        `${a} − ${b} = ${c}`,
        `${c} + ${a} = ${b}`,
        `${a} × ${b} = ${c}`,
        `${c} ÷ ${a} = ${b}`
    ];

    const correctAnswer = correctEquations[rand(0, 3)];
    const wrongOptions = shuffle(wrongEquations).slice(0, 3);

    return {
        question: `${t('calc', 'fact_family_addsub_q', lang)} ${a}, ${b}, ${c}`,
        type: 'multiple_choice',
        options: shuffle([correctAnswer, ...wrongOptions]),
        answer: correctAnswer,
        hint: t('calc', 'hint_fact_family_addsub', lang),
        visual: '👨\u200d👩\u200d👧\u200d👦',
        check: (input) => input === correctAnswer
    };
}

/**
 * Addition/Subtraction Inverse - True or False
 */
function generateAddSubInverse(difficulty) {
    const lang = getLang();

    const a = difficulty === 'easy' ? rand(5, 15) : difficulty === 'medium' ? rand(10, 30) : rand(20, 50);
    const b = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 30);
    const c = a + b;

    const isTrue = rand(0, 1) === 0;
    let statement, answer;

    if (isTrue) {
        const templates = [
            `${t('calc', 'if', lang)} ${a} + ${b} = ${c}, ${t('calc', 'then', lang)} ${c} − ${b} = ${a}`,
            `${t('calc', 'if', lang)} ${c} − ${a} = ${b}, ${t('calc', 'then', lang)} ${b} + ${a} = ${c}`
        ];
        statement = templates[rand(0, 1)];
        answer = t('calc', 'true', lang);
    } else {
        const wrongC = c + rand(1, 5);
        const templates = [
            `${t('calc', 'if', lang)} ${a} + ${b} = ${c}, ${t('calc', 'then', lang)} ${c} − ${b} = ${a + 1}`,
            `${t('calc', 'if', lang)} ${a} + ${b} = ${wrongC}, ${t('calc', 'then', lang)} ${wrongC} − ${b} = ${a}`
        ];
        statement = templates[rand(0, 1)];
        answer = t('calc', 'false', lang);
    }

    return {
        question: `${t('calc', 'inverse_true_false', lang)} ${statement}`,
        type: 'multiple_choice',
        options: [t('calc', 'true', lang), t('calc', 'false', lang)],
        answer: answer,
        hint: t('calc', 'hint_inverse_addsub', lang),
        visual: '🔄',
        check: (input) => input === answer
    };
}

/**
 * Multiplication/Division Fact Family
 */
function generateMultDivFactFamily(difficulty) {
    const lang = getLang();

    const table = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const multiplier = difficulty === 'easy' ? rand(1, 5) : rand(2, 10);
    const product = table * multiplier;

    const a = table;
    const b = multiplier;
    const c = product;

    const correctEquations = [
        `${a} × ${b} = ${c}`,
        `${b} × ${a} = ${c}`,
        `${c} ÷ ${a} = ${b}`,
        `${c} ÷ ${b} = ${a}`
    ];

    const wrongEquations = [
        `${a} × ${b} = ${c + a}`,
        `${c} ÷ ${a} = ${b + 1}`,
        `${a} + ${b} = ${c}`,
        `${c} − ${a} = ${b}`
    ];

    const correctAnswer = correctEquations[rand(0, 3)];
    const wrongOptions = shuffle(wrongEquations).slice(0, 3);

    return {
        question: `${t('calc', 'fact_family_multdiv_q', lang)} ${a}, ${b}, ${c}`,
        type: 'multiple_choice',
        options: shuffle([correctAnswer, ...wrongOptions]),
        answer: correctAnswer,
        hint: t('calc', 'hint_fact_family_multdiv', lang),
        visual: '👨\u200d👩\u200d👧\u200d👦',
        check: (input) => input === correctAnswer
    };
}

/**
 * Find missing number using inverse relationship
 */
function generateMissingNumberAddSub(difficulty) {
    const lang = getLang();

    const a = difficulty === 'easy' ? rand(5, 15) : difficulty === 'medium' ? rand(10, 30) : rand(20, 50);
    const b = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 30);
    const c = a + b;

    const template = rand(0, 2);
    let question, answer, hint;

    if (template === 0) {
        question = `${a} + ☐ = ${c}. ${t('calc', 'find_missing', lang)}`;
        answer = b;
        hint = `${t('calc', 'hint_use_inverse', lang)} ${c} − ${a} = ?`;
    } else if (template === 1) {
        question = `☐ + ${b} = ${c}. ${t('calc', 'find_missing', lang)}`;
        answer = a;
        hint = `${t('calc', 'hint_use_inverse', lang)} ${c} − ${b} = ?`;
    } else {
        question = `${c} − ☐ = ${a}. ${t('calc', 'find_missing', lang)}`;
        answer = b;
        hint = `${t('calc', 'hint_use_inverse', lang)} ${c} − ${a} = ?`;
    }

    return {
        question: question,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? generateOptionsWithPreferred(answer, [answer + 1, answer - 1, answer + 5]) : undefined,
        answer: answer,
        hint: hint,
        visual: '❓',
        check: (input) => parseInt(input) === answer
    };
}

// ============================================================================
// CHAPTER 10.2: MULTIPLICATION (CONNECTION TO ADDITION, DOUBLE/HALF)
// ============================================================================

function generateChapter2Question(difficulty) {
    const type = rand(0, 3);

    switch (type) {
        case 0: return generateRepeatedAdditionToMult(difficulty);
        case 1: return generateDoubling(difficulty);
        case 2: return generateHalving(difficulty);
        case 3: return generateMultiplication(difficulty);
        default: return generateRepeatedAdditionToMult(difficulty);
    }
}

/**
 * Convert Repeated Addition to Multiplication
 */
function generateRepeatedAdditionToMult(difficulty) {
    const lang = getLang();

    const base = difficulty === 'easy' ? rand(2, 5) : difficulty === 'medium' ? rand(2, 10) : 10;
    const times = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(2, 6) : rand(3, 10);

    const additionParts = Array(times).fill(base);
    const additionStr = additionParts.join(' + ');
    const sum = base * times;

    const correctAnswer = `${times} × ${base}`;
    const wrongAnswers = [
        `${base} + ${times}`,
        `${times + 1} × ${base}`,
        `${times} × ${base + 1}`
    ];

    return {
        question: `${t('calc', 'repeated_addition', lang)} ${additionStr} = ${sum}`,
        type: 'multiple_choice',
        options: shuffle([correctAnswer, ...wrongAnswers]),
        answer: correctAnswer,
        hint: `${t('calc', 'hint_repeated', lang)} ${base} ${t('calc', 'hint_appears', lang)} ${times} ${t('calc', 'hint_times_word', lang)}`,
        visual: '➕➡️✖️',
        check: (input) => input === correctAnswer
    };
}

/**
 * Doubling - Connect to 2× table
 */
function generateDoubling(difficulty) {
    const lang = getLang();

    const number = difficulty === 'easy' ? rand(1, 10) : difficulty === 'medium' ? rand(5, 25) : rand(10, 50);
    const doubled = number * 2;

    const template = rand(0, 1);

    if (template === 0) {
        return {
            question: `${t('calc', 'double_of', lang)} ${number}?`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? generateOptionsWithPreferred(doubled, [doubled + 2, doubled - 2, number]) : undefined,
            answer: doubled,
            hint: `${t('calc', 'hint_double', lang)}: ${number} + ${number} = ?`,
            visual: '✕2️⃣',
            check: (input) => parseInt(input) === doubled
        };
    } else {
        return {
            question: `2 × ${number} = ? (${t('calc', 'same_as_double', lang)})`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? generateOptionsWithPreferred(doubled, [doubled + 1, doubled - 1, number + 2]) : undefined,
            answer: doubled,
            hint: `${t('calc', 'hint_double_means', lang)} ${number} + ${number}`,
            visual: '2️⃣',
            check: (input) => parseInt(input) === doubled
        };
    }
}

/**
 * Halving - Connect to ÷2
 */
function generateHalving(difficulty) {
    const lang = getLang();

    const half = difficulty === 'easy' ? rand(1, 10) : difficulty === 'medium' ? rand(5, 25) : rand(10, 50);
    const number = half * 2;

    const template = rand(0, 1);

    if (template === 0) {
        return {
            question: `${t('calc', 'half_of', lang)} ${number}?`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? generateOptionsWithPreferred(half, [half + 1, half - 1, number]) : undefined,
            answer: half,
            hint: `${t('calc', 'hint_half', lang)}: ${number} ÷ 2 = ?`,
            visual: '➗2️⃣',
            check: (input) => parseInt(input) === half
        };
    } else {
        return {
            question: `${number} ÷ 2 = ? (${t('calc', 'same_as_half', lang)})`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? generateOptionsWithPreferred(half, [half + 2, half - 2, half * 2]) : undefined,
            answer: half,
            hint: `${t('calc', 'hint_half_means', lang)} ${number} ${t('calc', 'hint_into_two', lang)}`,
            visual: '½',
            check: (input) => parseInt(input) === half
        };
    }
}

/**
 * Perform Multiplication - Times tables (2, 5, 10)
 */
function generateMultiplication(difficulty) {
    const lang = getLang();

    let table, multiplier;

    if (difficulty === 'easy') {
        table = [2, 5, 10][rand(0, 2)];
        multiplier = rand(1, 5);
    } else if (difficulty === 'medium') {
        table = [2, 5, 10][rand(0, 2)];
        multiplier = rand(2, 10);
    } else {
        table = [2, 5, 10][rand(0, 2)];
        multiplier = rand(5, 12);
    }

    const answer = table * multiplier;

    return {
        question: `${table} × ${multiplier} = ?`,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? generateOptionsWithPreferred(answer, [answer + table, answer - table, answer + 1]) : undefined,
        answer: answer,
        hint: `${t('multiply', 'hint_groups', getLang())} ${multiplier} ${t('multiply', 'hint_groups', getLang())} ${table}`,
        visual: '✖️',
        check: (input) => parseInt(input) === answer
    };
}
