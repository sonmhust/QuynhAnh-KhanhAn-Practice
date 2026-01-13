/**
 * ARITHMETIC MODULE
 * Generates questions for: addition and subtraction within 100
 */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const CONTEXTS = [
    { emoji: '🍎', name: 'apples', action: 'picked', remove: 'ate' },
    { emoji: '⭐', name: 'stars', action: 'collected', remove: 'gave away' },
    { emoji: '🌸', name: 'flowers', action: 'found', remove: 'wilted' },
    { emoji: '🧁', name: 'cupcakes', action: 'baked', remove: 'shared' },
    { emoji: '💎', name: 'gems', action: 'found', remove: 'lost' },
    { emoji: '🎈', name: 'balloons', action: 'got', remove: 'popped' }
];

export function generateQuestion(difficulty = 'easy') {
    const isAddition = rand(0, 1) === 0;
    return isAddition ? generateAddition(difficulty) : generateSubtraction(difficulty);
}

function generateAddition(difficulty) {
    let a, b;
    const ctx = CONTEXTS[rand(0, CONTEXTS.length - 1)];

    if (difficulty === 'easy') {
        // 1-digit + 1-digit
        a = rand(2, 9);
        b = rand(2, 9);
    } else if (difficulty === 'medium') {
        // 2-digit + 1-digit
        a = rand(10, 50);
        b = rand(3, 9);
    } else {
        // 2-digit + 2-digit (sum < 100)
        a = rand(20, 60);
        b = rand(10, 100 - a);
    }

    const answer = a + b;
    const useWordProblem = rand(0, 1) === 0;

    const question = useWordProblem
        ? `Princess has ${a} ${ctx.name} ${ctx.emoji}. She ${ctx.action} ${b} more. How many total?`
        : `${a} + ${b} = ?`;

    return {
        question: question,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle([answer, answer + 1, answer - 1, answer + 10]) : undefined,
        answer: answer,
        hint: `Add ones first, then tens: ${a} + ${b}`,
        visual: useWordProblem ? ctx.emoji : '➕',
        check: (input) => parseInt(input) === answer
    };
}

function generateSubtraction(difficulty) {
    let a, b;
    const ctx = CONTEXTS[rand(0, CONTEXTS.length - 1)];

    if (difficulty === 'easy') {
        a = rand(10, 15);
        b = rand(1, 5);
    } else if (difficulty === 'medium') {
        a = rand(20, 50);
        b = rand(5, 15);
    } else {
        a = rand(50, 99);
        b = rand(10, 30);
    }

    const answer = a - b;
    const useWordProblem = rand(0, 1) === 0;

    const question = useWordProblem
        ? `You have ${a} ${ctx.name} ${ctx.emoji}. You ${ctx.remove} ${b}. How many left?`
        : `${a} - ${b} = ?`;

    return {
        question: question,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle([answer, answer + 1, answer - 1, a]) : undefined,
        answer: answer,
        hint: `Start at ${a}, count back ${b}`,
        visual: useWordProblem ? ctx.emoji : '➖',
        check: (input) => parseInt(input) === answer
    };
}
