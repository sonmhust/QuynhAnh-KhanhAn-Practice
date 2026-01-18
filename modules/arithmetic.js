/**
 * ARITHMETIC MODULE
 * Generates questions for: addition and subtraction within 100
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

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
    const lang = getLang();
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
    const actionKey = ctx.action;

    const question = useWordProblem
        ? `${t('arithmetic', 'princess_has', lang)} ${a} ${ctx.name} ${ctx.emoji}. ${t('arithmetic', actionKey, lang)} ${b}. ${t('arithmetic', 'total_q', lang)}`
        : `${a} + ${b} = ?`;

    return {
        question: question,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? generateOptionsWithPreferred(answer, [answer + 1, answer - 1, answer + 10]) : undefined,
        answer: answer,
        hint: `${t('arithmetic', 'hint_add_ones', lang)} ${a} + ${b}`,
        visual: useWordProblem ? ctx.emoji : '➕',
        check: (input) => parseInt(input) === answer
    };
}

function generateSubtraction(difficulty) {
    let a, b;
    const lang = getLang();
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
    const removeKey = ctx.remove.replace(' ', '_');

    const question = useWordProblem
        ? `${t('arithmetic', 'princess_has', lang)} ${a} ${ctx.name} ${ctx.emoji}. ${t('arithmetic', removeKey, lang)} ${b}. ${t('arithmetic', 'left_q', lang)}`
        : `${a} - ${b} = ?`;

    return {
        question: question,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? generateOptionsWithPreferred(answer, [answer + 1, answer - 1, a]) : undefined,
        answer: answer,
        hint: `${t('arithmetic', 'hint_count_back', lang)} ${a}, ${t('arithmetic', 'hint_count_back2', lang)} ${b}`,
        visual: useWordProblem ? ctx.emoji : '➖',
        check: (input) => parseInt(input) === answer
    };
}

