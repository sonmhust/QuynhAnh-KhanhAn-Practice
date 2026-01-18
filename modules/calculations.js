/**
 * CALCULATIONS MODULE
 * Organized into 3 sections for Cambridge Primary Math Units 9-10:
 * 
 * SECTION 1: Relationship Between Addition and Subtraction
 * SECTION 2: Relationship Between Multiplication and Division (Fact Families & Inverse)
 * SECTION 3: Doubling and Halving (Lesson 10.3 Prep)
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

// ============================================================================
// MAIN QUESTION GENERATOR
// ============================================================================

export function generateQuestion(difficulty = 'easy') {
    // Section weights: adjust based on curriculum focus
    const section = rand(1, 3);

    switch (section) {
        case 1: return generateAddSubRelationship(difficulty);
        case 2: return generateMultDivRelationship(difficulty);
        case 3: return generateDoublingHalving(difficulty);
        default: return generateAddSubRelationship(difficulty);
    }
}

// ============================================================================
// SECTION 1: RELATIONSHIP BETWEEN ADDITION AND SUBTRACTION
// ============================================================================

function generateAddSubRelationship(difficulty) {
    const type = rand(0, 2);

    switch (type) {
        case 0: return generateAddSubFactFamily(difficulty);
        case 1: return generateAddSubInverse(difficulty);
        case 2: return generateMissingNumberAddSub(difficulty);
        default: return generateAddSubFactFamily(difficulty);
    }
}

/**
 * Addition/Subtraction Fact Family
 * Given 3 numbers, identify which equation belongs to the fact family
 */
function generateAddSubFactFamily(difficulty) {
    const lang = getLang();

    // Generate fact family numbers
    const a = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 50);
    const b = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 50);
    const c = a + b;

    // All 4 correct equations
    const correctEquations = [
        `${a} + ${b} = ${c}`,
        `${b} + ${a} = ${c}`,
        `${c} − ${a} = ${b}`,
        `${c} − ${b} = ${a}`
    ];

    // Wrong equations
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
        visual: '👨‍👩‍👧‍👦',
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
 * Find the missing number using inverse relationship
 */
function generateMissingNumberAddSub(difficulty) {
    const lang = getLang();

    const a = difficulty === 'easy' ? rand(5, 15) : difficulty === 'medium' ? rand(10, 30) : rand(20, 50);
    const b = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 30);
    const c = a + b;

    const template = rand(0, 2);
    let question, answer, hint;

    if (template === 0) {
        // a + ? = c
        question = `${a} + ☐ = ${c}. ${t('calc', 'find_missing', lang)}`;
        answer = b;
        hint = `${t('calc', 'hint_use_inverse', lang)} ${c} − ${a} = ?`;
    } else if (template === 1) {
        // ? + b = c
        question = `☐ + ${b} = ${c}. ${t('calc', 'find_missing', lang)}`;
        answer = a;
        hint = `${t('calc', 'hint_use_inverse', lang)} ${c} − ${b} = ?`;
    } else {
        // c - ? = a
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
// SECTION 2: RELATIONSHIP BETWEEN MULTIPLICATION AND DIVISION
// (Fact Families & Inverse Equations)
// ============================================================================

function generateMultDivRelationship(difficulty) {
    const type = rand(0, 2);

    switch (type) {
        case 0: return generateMultDivFactFamily(difficulty);
        case 1: return generateMultDivInverse(difficulty);
        case 2: return generateRepeatedAdditionToMult(difficulty);
        default: return generateMultDivFactFamily(difficulty);
    }
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
        visual: '👨‍👩‍👧‍👦',
        check: (input) => input === correctAnswer
    };
}

/**
 * Multiplication/Division Inverse - True or False
 */
function generateMultDivInverse(difficulty) {
    const lang = getLang();

    const table = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const multiplier = rand(1, 10);
    const product = table * multiplier;

    const isTrue = rand(0, 1) === 0;
    let statement, answer;

    if (isTrue) {
        const templates = [
            `${t('calc', 'if', lang)} ${table} × ${multiplier} = ${product}, ${t('calc', 'then', lang)} ${product} ÷ ${table} = ${multiplier}`,
            `${t('calc', 'if', lang)} ${product} ÷ ${multiplier} = ${table}, ${t('calc', 'then', lang)} ${table} × ${multiplier} = ${product}`
        ];
        statement = templates[rand(0, 1)];
        answer = t('calc', 'true', lang);
    } else {
        const templates = [
            `${t('calc', 'if', lang)} ${table} × ${multiplier} = ${product}, ${t('calc', 'then', lang)} ${product} ÷ ${table} = ${multiplier + 1}`,
            `${t('calc', 'if', lang)} ${table} × ${multiplier} = ${product + table}, ${t('calc', 'then', lang)} ${product + table} ÷ ${table} = ${multiplier}`
        ];
        statement = templates[rand(0, 1)];
        answer = t('calc', 'false', lang);
    }

    return {
        question: `${t('calc', 'inverse_true_false', lang)} ${statement}`,
        type: 'multiple_choice',
        options: [t('calc', 'true', lang), t('calc', 'false', lang)],
        answer: answer,
        hint: t('calc', 'hint_inverse_multdiv', lang),
        visual: '🔄',
        check: (input) => input === answer
    };
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

// ============================================================================
// SECTION 3: DOUBLING AND HALVING (Lesson 10.3 Prep)
// ============================================================================

function generateDoublingHalving(difficulty) {
    const type = rand(0, 2);

    switch (type) {
        case 0: return generateDoubling(difficulty);
        case 1: return generateHalving(difficulty);
        case 2: return generateDoubleHalveConnection(difficulty);
        default: return generateDoubling(difficulty);
    }
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

    // Use even numbers for clean halving
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
 * Double and Halve Connection - Inverse relationship
 */
function generateDoubleHalveConnection(difficulty) {
    const lang = getLang();

    const number = difficulty === 'easy' ? rand(2, 10) : difficulty === 'medium' ? rand(5, 20) : rand(10, 40);
    const doubled = number * 2;

    const isTrue = rand(0, 1) === 0;
    let statement, answer;

    if (isTrue) {
        const templates = [
            `${t('calc', 'if', lang)} ${t('calc', 'double_of', lang).toLowerCase()} ${number} = ${doubled}, ${t('calc', 'then', lang)} ${t('calc', 'half_of', lang).toLowerCase()} ${doubled} = ${number}`,
            `${t('calc', 'double_then_half', lang)} ${number} ${t('calc', 'gives_back', lang)} ${number}`
        ];
        statement = templates[rand(0, 1)];
        answer = t('calc', 'true', lang);
    } else {
        const templates = [
            `${t('calc', 'if', lang)} ${t('calc', 'double_of', lang).toLowerCase()} ${number} = ${doubled}, ${t('calc', 'then', lang)} ${t('calc', 'half_of', lang).toLowerCase()} ${doubled} = ${number + 1}`,
            `${t('calc', 'double_then_half', lang)} ${number} ${t('calc', 'gives_back', lang)} ${number + 2}`
        ];
        statement = templates[rand(0, 1)];
        answer = t('calc', 'false', lang);
    }

    return {
        question: `${t('calc', 'inverse_true_false', lang)} ${statement}`,
        type: 'multiple_choice',
        options: [t('calc', 'true', lang), t('calc', 'false', lang)],
        answer: answer,
        hint: t('calc', 'hint_double_halve_inverse', lang),
        visual: '🔄',
        check: (input) => input === answer
    };
}
