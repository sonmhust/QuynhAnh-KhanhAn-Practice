/**
 * MULTIPLY MODULE
 * Generates questions for: multiplication tables (1, 2, 5, 10), equal groups, basic division
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

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
    const lang = getLang();
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
            ? generateOptionsWithPreferred(answer, [answer + table, answer - table, answer + 1])
            : undefined,
        answer: answer,
        hint: `${table} ${t('multiply', 'hint_times', lang)} ${multiplier} ${t('multiply', 'hint_means', lang)} ${table} ${t('multiply', 'hint_added', lang)} ${multiplier} ${t('multiply', 'hint_times_count', lang)}`,
        visual: '✖️',
        check: (input) => parseInt(input) === answer
    };
}

function generateEqualGroups(difficulty) {
    const lang = getLang();
    const groups = difficulty === 'easy' ? rand(2, 4) : difficulty === 'medium' ? rand(3, 6) : rand(5, 10);
    const perGroup = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const answer = groups * perGroup;
    const item = ITEMS[rand(0, ITEMS.length - 1)];

    return {
        question: `${groups} ${t('multiply', 'bags', lang)}. ${t('multiply', 'each', lang)} ${perGroup} ${item}. ${t('multiply', 'total', lang)}`,
        type: 'multiple_choice',
        options: generateOptionsWithPreferred(answer, [answer + perGroup, answer - perGroup, groups]),
        answer: answer,
        hint: `${groups} ${t('multiply', 'hint_groups', lang)} ${perGroup} = ${groups} × ${perGroup}`,
        visual: '🛍️',
        check: (input) => parseInt(input) === answer
    };
}

function generateDivide(difficulty) {
    const lang = getLang();
    const divisor = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const quotient = rand(1, 10);
    const dividend = divisor * quotient;

    const useWordProblem = rand(0, 1) === 0 && difficulty !== 'hard';
    const item = ITEMS[rand(0, ITEMS.length - 1)];

    const question = useWordProblem
        ? `${t('multiply', 'share', lang)} ${dividend} ${item} ${t('multiply', 'equally', lang)} ${divisor} ${t('multiply', 'friends', lang)}. ${t('multiply', 'howMany', lang)}`
        : `${dividend} ÷ ${divisor} = ?`;

    return {
        question: question,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard'
            ? generateOptionsWithPreferred(quotient, [quotient + 1, quotient - 1, divisor])
            : undefined,
        answer: quotient,
        hint: `${t('multiply', 'hint_howMany', lang)} ${divisor}${t('multiply', 'hint_fit', lang)} ${dividend}?`,
        visual: useWordProblem ? '🤝' : '➗',
        check: (input) => parseInt(input) === quotient
    };
}
