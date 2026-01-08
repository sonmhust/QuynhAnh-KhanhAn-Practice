/**
 * COUNTING MODULE
 * Generates questions for: count on/back, skip counting (2s, 5s, 10s)
 */

// Random number helper
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Shuffle utility
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Context templates for variety
const CONTEXTS = [
    { emoji: '🍎', name: 'apples' },
    { emoji: '⭐', name: 'stars' },
    { emoji: '🌸', name: 'flowers' },
    { emoji: '🦋', name: 'butterflies' },
    { emoji: '🎈', name: 'balloons' },
    { emoji: '🍬', name: 'candies' },
    { emoji: '💎', name: 'gems' },
    { emoji: '🐰', name: 'bunnies' }
];

export function generateQuestion(difficulty = 'easy') {
    const questionType = rand(0, 2);

    switch (questionType) {
        case 0: return generateCountOn(difficulty);
        case 1: return generateCountBack(difficulty);
        case 2: return generateSkipCount(difficulty);
        default: return generateCountOn(difficulty);
    }
}

function generateCountOn(difficulty) {
    const ctx = CONTEXTS[rand(0, CONTEXTS.length - 1)];
    let start, step;

    if (difficulty === 'easy') {
        start = rand(5, 15);
        step = rand(1, 3);
    } else if (difficulty === 'medium') {
        start = rand(20, 50);
        step = rand(3, 7);
    } else {
        start = rand(50, 90);
        step = rand(5, 10);
    }

    const answer = start + step;

    return {
        question: `There are ${start} ${ctx.name} ${ctx.emoji}. You get ${step} more. How many now?`,
        type: 'multiple_choice',
        options: shuffle([answer, answer + 1, answer - 1, start]),
        answer: answer,
        hint: `Start at ${start}, then count forward ${step} more`,
        visual: ctx.emoji,
        check: (input) => parseInt(input) === answer
    };
}

function generateCountBack(difficulty) {
    const ctx = CONTEXTS[rand(0, CONTEXTS.length - 1)];
    let start, step;

    if (difficulty === 'easy') {
        start = rand(10, 20);
        step = rand(1, 4);
    } else if (difficulty === 'medium') {
        start = rand(30, 60);
        step = rand(4, 10);
    } else {
        start = rand(60, 99);
        step = rand(8, 15);
    }

    const answer = start - step;

    const templates = [
        `You have ${start} ${ctx.name} ${ctx.emoji}. ${step} fly away. How many left?`,
        `Princess has ${start} ${ctx.name} ${ctx.emoji}. She gives ${step} to her friend. How many remain?`,
        `There are ${start} ${ctx.name} ${ctx.emoji}. ${step} disappear. What's left?`
    ];

    return {
        question: templates[rand(0, templates.length - 1)],
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle([answer, answer + 1, answer - 1, start]) : undefined,
        answer: answer,
        hint: `Start at ${start}, count back ${step}`,
        visual: '➖',
        check: (input) => parseInt(input) === answer
    };
}

function generateSkipCount(difficulty) {
    const skipBy = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const startMult = rand(1, 5);
    const start = skipBy * startMult;
    const sequence = [start, start + skipBy, start + skipBy * 2];
    const answer = start + skipBy * 3;

    return {
        question: `Skip counting by ${skipBy}s: ${sequence.join(', ')}, ___. What's next?`,
        type: 'multiple_choice',
        options: shuffle([answer, answer + skipBy, answer - skipBy, answer + 1]),
        answer: answer,
        hint: `Add ${skipBy} to the last number`,
        visual: '🔢',
        check: (input) => parseInt(input) === answer
    };
}
