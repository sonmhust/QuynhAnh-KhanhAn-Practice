/**
 * NUMBERS MODULE
 * Generates questions for: place value, 2-digit numbers, expanded form
 */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export function generateQuestion(difficulty = 'easy') {
    const type = rand(0, 2);

    switch (type) {
        case 0: return generatePlaceValue(difficulty);
        case 1: return generateExpandedForm(difficulty);
        case 2: return generateWordToNumber(difficulty);
        default: return generatePlaceValue(difficulty);
    }
}

function generatePlaceValue(difficulty) {
    const num = difficulty === 'easy' ? rand(10, 50) : difficulty === 'medium' ? rand(50, 80) : rand(80, 99);
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const askTens = rand(0, 1) === 0;

    const answer = askTens ? tens : ones;
    const other = askTens ? ones : tens;

    return {
        question: askTens
            ? `In the number ${num}, how many TENS are there?`
            : `In the number ${num}, how many ONES are there?`,
        type: 'multiple_choice',
        options: shuffle([answer, other, answer + 1, rand(0, 9)]),
        answer: answer,
        hint: `${num} = ${tens} tens and ${ones} ones`,
        visual: '🔟',
        check: (input) => parseInt(input) === answer
    };
}

function generateExpandedForm(difficulty) {
    const num = difficulty === 'easy' ? rand(11, 39) : difficulty === 'medium' ? rand(40, 69) : rand(70, 99);
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;

    const template = rand(0, 1);

    if (template === 0) {
        // Ask for tens part
        return {
            question: `${num} = ___ + ${ones}. What goes in the blank?`,
            type: 'multiple_choice',
            options: shuffle([tens, tens + 10, tens - 10, num]),
            answer: tens,
            hint: `Think: what number added to ${ones} gives ${num}?`,
            visual: '➕',
            check: (input) => parseInt(input) === tens
        };
    } else {
        // Ask for ones part
        return {
            question: `${num} = ${tens} + ___. What goes in the blank?`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? shuffle([ones, ones + 1, tens, rand(0, 9)]) : undefined,
            answer: ones,
            hint: `Think: ${num} minus ${tens} equals what?`,
            visual: '➕',
            check: (input) => parseInt(input) === ones
        };
    }
}

function generateWordToNumber(difficulty) {
    const wordNums = {
        easy: [
            { word: 'eleven', num: 11 },
            { word: 'twelve', num: 12 },
            { word: 'fifteen', num: 15 },
            { word: 'twenty', num: 20 },
            { word: 'thirty', num: 30 }
        ],
        medium: [
            { word: 'twenty-five', num: 25 },
            { word: 'thirty-seven', num: 37 },
            { word: 'forty-two', num: 42 },
            { word: 'fifty-eight', num: 58 },
            { word: 'sixty-four', num: 64 }
        ],
        hard: [
            { word: 'seventy-three', num: 73 },
            { word: 'eighty-one', num: 81 },
            { word: 'ninety-nine', num: 99 },
            { word: 'forty-four', num: 44 },
            { word: 'sixty-six', num: 66 }
        ]
    };

    const options = wordNums[difficulty];
    const selected = options[rand(0, options.length - 1)];

    return {
        question: `Write "${selected.word}" as a number:`,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? shuffle(options.map(o => o.num).slice(0, 4)) : undefined,
        answer: selected.num,
        hint: 'Sound it out: tens first, then ones',
        visual: '📝',
        check: (input) => parseInt(input) === selected.num
    };
}
