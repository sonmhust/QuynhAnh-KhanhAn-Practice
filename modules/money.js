/**
 * MONEY MODULE
 * Generates questions for: US coin recognition, price reading, change calculation
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

const COINS = [
    { name: 'penny', value: 1, plural: 'pennies' },
    { name: 'nickel', value: 5, plural: 'nickels' },
    { name: 'dime', value: 10, plural: 'dimes' },
    { name: 'quarter', value: 25, plural: 'quarters' }
];

const ITEMS = [
    { emoji: '🍎', name: 'apple' },
    { emoji: '📚', name: 'book' },
    { emoji: '🧸', name: 'teddy bear' },
    { emoji: '🍕', name: 'pizza slice' },
    { emoji: '🎈', name: 'balloon' },
    { emoji: '🍬', name: 'candy bar' }
];

export function generateQuestion(difficulty = 'easy') {
    const type = rand(0, 2);

    switch (type) {
        case 0: return generateCoinValue(difficulty);
        case 1: return generatePriceReading(difficulty);
        case 2: return generateChangeCalculation(difficulty);
        default: return generateCoinValue(difficulty);
    }
}

function generateCoinValue(difficulty) {
    const lang = getLang();
    const coin = COINS[rand(0, COINS.length - 1)];
    const coinName = t('money', coin.name, lang);

    if (difficulty === 'easy') {
        // Name to value
        return {
            question: `${t('money', 'how_many_cents', lang)} ${coinName} ${t('money', 'worth', lang)}`,
            type: 'multiple_choice',
            options: shuffle([coin.value, ...COINS.filter(c => c.name !== coin.name).map(c => c.value)]),
            answer: coin.value,
            hint: `${t('money', 'hint_remember', lang)} ${coinName} = ${coin.value}¢`,
            visual: '🪙',
            check: (input) => parseInt(input) === coin.value
        };
    } else {
        // Multiple coins
        const count = difficulty === 'medium' ? rand(2, 4) : rand(3, 6);
        const total = coin.value * count;

        return {
            question: `${t('money', 'you_have', lang)} ${count} ${coin.plural}. ${t('money', 'total_cents', lang)}`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard'
                ? generateOptionsWithPreferred(total, [total + coin.value, total - coin.value, count])
                : undefined,
            answer: total,
            hint: `${count} ${t('money', 'hint_times', lang)} ${coin.value}¢ = ?`,
            visual: '🪙',
            check: (input) => parseInt(input) === total
        };
    }
}

function generatePriceReading(difficulty) {
    const lang = getLang();
    let dollars, cents;

    if (difficulty === 'easy') {
        dollars = rand(1, 5);
        cents = 0;
    } else if (difficulty === 'medium') {
        dollars = rand(1, 9);
        cents = [25, 50, 75][rand(0, 2)];
    } else {
        dollars = rand(5, 15);
        cents = rand(1, 99);
    }

    const price = cents === 0 ? `$${dollars}` : `$${dollars}.${cents.toString().padStart(2, '0')}`;
    const item = ITEMS[rand(0, ITEMS.length - 1)];

    const answer = `${dollars} ${t('money', 'dollars_and', lang)} ${cents} ${t('money', 'cents', lang)}`;
    const wrongAnswers = [
        `${dollars + 1} ${t('money', 'dollars_and', lang)} ${cents} ${t('money', 'cents', lang)}`,
        `${cents} ${t('money', 'dollars_and', lang)} ${dollars} ${t('money', 'cents', lang)}`,
        `${dollars} ${t('money', 'dollars_only', lang)}`
    ];

    return {
        question: `${item.name} ${item.emoji} ${t('money', 'costs', lang)} ${price}. ${t('money', 'how_read', lang)}`,
        type: 'multiple_choice',
        options: shuffle([answer, ...wrongAnswers]),
        answer: answer,
        hint: t('money', 'hint_before_dot', lang),
        visual: item.emoji,
        check: (input) => input === answer
    };
}

function generateChangeCalculation(difficulty) {
    const lang = getLang();
    let paid, cost, change;
    const item = ITEMS[rand(0, ITEMS.length - 1)];

    if (difficulty === 'easy') {
        paid = 5;
        cost = rand(1, 4);
    } else if (difficulty === 'medium') {
        paid = 10;
        cost = rand(3, 8);
    } else {
        paid = 20;
        cost = rand(5, 18);
    }

    change = paid - cost;

    return {
        question: `${item.name} ${item.emoji} ${t('money', 'cost_you_pay', lang)} $${cost}. ${t('money', 'you_pay', lang)} $${paid}. ${t('money', 'whats_change', lang)}`,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard'
            ? shuffle([`$${change}`, `$${change + 1}`, `$${change - 1}`, `$${paid}`])
            : undefined,
        answer: difficulty === 'hard' ? change : `$${change}`,
        hint: `$${paid} - $${cost} = ?`,
        visual: '💵',
        check: (input) => {
            const parsed = parseInt(input.replace('$', ''));
            return parsed === change;
        }
    };
}

