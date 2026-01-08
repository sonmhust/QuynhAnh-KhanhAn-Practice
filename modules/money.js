/**
 * MONEY MODULE
 * Generates questions for: US coin recognition, price reading, change calculation
 */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

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
    const coin = COINS[rand(0, COINS.length - 1)];

    if (difficulty === 'easy') {
        // Name to value
        return {
            question: `How many cents is one ${coin.name} worth?`,
            type: 'multiple_choice',
            options: shuffle([coin.value, ...COINS.filter(c => c.name !== coin.name).map(c => c.value)]),
            answer: coin.value,
            hint: `Remember: 1 ${coin.name} = ${coin.value}¢`,
            visual: '🪙',
            check: (input) => parseInt(input) === coin.value
        };
    } else {
        // Multiple coins
        const count = difficulty === 'medium' ? rand(2, 4) : rand(3, 6);
        const total = coin.value * count;

        return {
            question: `You have ${count} ${coin.plural}. How many cents total?`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard'
                ? shuffle([total, total + coin.value, total - coin.value, count])
                : undefined,
            answer: total,
            hint: `${count} × ${coin.value}¢ = ?`,
            visual: '🪙',
            check: (input) => parseInt(input) === total
        };
    }
}

function generatePriceReading(difficulty) {
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

    const answer = `${dollars} dollars and ${cents} cents`;
    const wrongAnswers = [
        `${dollars + 1} dollars and ${cents} cents`,
        `${cents} dollars and ${dollars} cents`,
        `${dollars} dollars only`
    ];

    return {
        question: `The ${item.name} ${item.emoji} costs ${price}. How do you read this?`,
        type: 'multiple_choice',
        options: shuffle([answer, ...wrongAnswers]),
        answer: answer,
        hint: 'Before the dot is dollars, after is cents',
        visual: item.emoji,
        check: (input) => input === answer
    };
}

function generateChangeCalculation(difficulty) {
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
        question: `A ${item.name} ${item.emoji} costs $${cost}. You pay $${paid}. What's your change?`,
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
