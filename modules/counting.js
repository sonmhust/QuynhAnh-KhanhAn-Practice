/**
 * COUNTING MODULE
 * Generates questions for: count on/back, skip counting (2s, 5s, 10s)
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

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
    const lang = getLang();
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
        question: `${t('counting', 'there_are', lang)} ${start} ${ctx.name} ${ctx.emoji}. ${t('counting', 'you_get', lang)} ${step} ${t('counting', 'more', lang)}. ${t('counting', 'now', lang)}`,
        type: 'multiple_choice',
        options: generateOptionsWithPreferred(answer, [answer + 1, answer - 1, start]),
        answer: answer,
        hint: `${t('counting', 'hint_start', lang)} ${start}, ${t('counting', 'hint_forward', lang)} ${step} ${t('counting', 'hint_more', lang)}`,
        visual: ctx.emoji,
        check: (input) => parseInt(input) === answer
    };
}

function generateCountBack(difficulty) {
    const ctx = CONTEXTS[rand(0, CONTEXTS.length - 1)];
    const lang = getLang();
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
        `${t('counting', 'you_have', lang)} ${start} ${ctx.name} ${ctx.emoji}. ${step} ${t('counting', 'fly_away', lang)}. ${t('counting', 'left', lang)}`,
        `${t('counting', 'gives', lang)} ${start} ${ctx.name} ${ctx.emoji}. ${t('counting', 'to_friend', lang)} ${step}. ${t('counting', 'remain', lang)}`,
        `${t('counting', 'there_are', lang)} ${start} ${ctx.name} ${ctx.emoji}. ${step} ${t('counting', 'disappear', lang)}. ${t('counting', 'whats_left', lang)}`
    ];

    return {
        question: templates[rand(0, templates.length - 1)],
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? generateOptionsWithPreferred(answer, [answer + 1, answer - 1, start]) : undefined,
        answer: answer,
        hint: `${t('counting', 'hint_start', lang)} ${start}, ${t('counting', 'hint_back', lang)} ${step}`,
        visual: '➖',
        check: (input) => parseInt(input) === answer
    };
}

function generateSkipCount(difficulty) {
    const lang = getLang();
    const skipBy = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
    const startMult = rand(1, 5);
    const start = skipBy * startMult;
    const sequence = [start, start + skipBy, start + skipBy * 2];
    const answer = start + skipBy * 3;

    return {
        question: `${t('counting', 'skip_by', lang)} ${skipBy}: ${sequence.join(', ')}, ___. ${t('counting', 'whats_next', lang)}`,
        type: 'multiple_choice',
        options: generateOptionsWithPreferred(answer, [answer + skipBy, answer - skipBy, answer + 1]),
        answer: answer,
        hint: `${t('counting', 'hint_add', lang)} ${skipBy} ${t('counting', 'hint_to_last', lang)}`,
        visual: '🔢',
        check: (input) => parseInt(input) === answer
    };
}
