/**
 * MULTIPLY MODULE
 * Generates questions for: multiplication tables (1, 2, 5, 10), equal groups, basic division
 */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const TABLES = [1, 2, 5, 10];
const ITEMS = ['🌸 flowers', '⭐ stars', '🍬 candies', '💎 gems', '🎈 balloons'];

export function generateQuestion(difficulty = 'easy') {
    const type = rand(0, 2);

    switch (type) {
        case 0: return generateMultiply(difficulty);
        case 1: return generateEqualGroups(difficulty);
        case 2: return generateDivide(difficulty);
        default: return generateMultiply(difficulty);
    }
}

function generateMultiply(difficulty) {
    const table = difficulty === 'easy'
        ? TABLES[rand(0, 1)] // 1 or 2
        : difficulty === 'medium'
            ? TABLES[rand(1, 2)] // 2 or 5
            : TABLES[rand(2, 3)]; // 5 or 10

    const multiplier = rand(1, 10);
    const answer = table * multiplier;

    return {
        question: `${table} × ${multiplier} = ?`,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard'
            ? shuffle([answer, answer + table, answer - table, answer + 1])
            : undefined,
        answer: answer,
        hint: `${table} times ${multiplier} means ${table} added ${multiplier} times`,
        visual: '✖️',
        check: (input) => parseInt(input) === answer
    };
}

function generateEqualGroups(difficulty) {
    const groups = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 6) : rand(5, 10);
    const perGroup = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const answer = groups * perGroup;
    const item = ITEMS[rand(0, ITEMS.length - 1)];

    return {
        question: `There are ${groups} bags. Each bag has ${perGroup} ${item}. How many total?`,
        type: 'multiple_choice',
        options: shuffle([answer, answer + perGroup, answer - perGroup, groups + perGroup]),
        answer: answer,
        hint: `${groups} groups of ${perGroup} = ${groups} × ${perGroup}`,
        visual: '🛍️',
        check: (input) => parseInt(input) === answer
    };
}

function generateDivide(difficulty) {
    const divisor = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const quotient = rand(1, 10);
    const dividend = divisor * quotient;

    const useWordProblem = rand(0, 1) === 0 && difficulty !== 'hard';
    const item = ITEMS[rand(0, ITEMS.length - 1)];

    const question = useWordProblem
        ? `Share ${dividend} ${item} equally among ${divisor} friends. How many each?`
        : `${dividend} ÷ ${divisor} = ?`;

    return {
        question: question,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard'
            ? shuffle([quotient, quotient + 1, quotient - 1, divisor])
            : undefined,
        answer: quotient,
        hint: `How many ${divisor}s fit into ${dividend}?`,
        visual: useWordProblem ? '🤝' : '➗',
        check: (input) => parseInt(input) === quotient
    };
}
