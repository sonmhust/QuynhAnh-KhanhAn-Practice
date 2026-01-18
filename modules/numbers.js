/**
 * NUMBERS MODULE
 * Generates questions for: place value, 2-digit numbers, expanded form
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

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
    const lang = getLang();
    const num = difficulty === 'easy' ? rand(10, 50) : difficulty === 'medium' ? rand(50, 80) : rand(80, 99);
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const askTens = rand(0, 1) === 0;

    const answer = askTens ? tens : ones;
    const other = askTens ? ones : tens;

    return {
        question: askTens
            ? `${t('numbers', 'in_number', lang)} ${num}, ${t('numbers', 'how_many_tens', lang)}`
            : `${t('numbers', 'in_number', lang)} ${num}, ${t('numbers', 'how_many_ones', lang)}`,
        type: 'multiple_choice',
        options: generateOptionsWithPreferred(answer, [other, answer + 1, rand(0, 9)]),
        answer: answer,
        hint: `${num} = ${tens} ${t('numbers', 'hint_tens_ones', lang)} ${ones} ${t('numbers', 'hint_ones', lang)}`,
        visual: '🔟',
        check: (input) => parseInt(input) === answer
    };
}

function generateExpandedForm(difficulty) {
    const lang = getLang();
    const num = difficulty === 'easy' ? rand(11, 39) : difficulty === 'medium' ? rand(40, 69) : rand(70, 99);
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;

    const template = rand(0, 1);

    if (template === 0) {
        // Ask for tens part
        return {
            question: `${num} = ___ + ${ones}. ${t('numbers', 'blank', lang)}`,
            type: 'multiple_choice',
            options: shuffle([tens, tens + 10, tens - 10, num]),
            answer: tens,
            hint: `${t('numbers', 'hint_think', lang)} ${ones} ${t('numbers', 'hint_gives', lang)} ${num}?`,
            visual: '➕',
            check: (input) => parseInt(input) === tens
        };
    } else {
        // Ask for ones part
        return {
            question: `${num} = ${tens} + ___. ${t('numbers', 'blank', lang)}`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? shuffle([ones, ones + 1, tens, rand(0, 9)]) : undefined,
            answer: ones,
            hint: `${t('numbers', 'hint_minus', lang)} ${num} ${t('numbers', 'hint_minus2', lang)} ${tens} ${t('numbers', 'hint_equals', lang)}`,
            visual: '➕',
            check: (input) => parseInt(input) === ones
        };
    }
}

function generateWordToNumber(difficulty) {
    const lang = getLang();
    const wordNums = {
        easy: [
            { word: 'eleven', num: 11, vi: 'mười một' },
            { word: 'twelve', num: 12, vi: 'mười hai' },
            { word: 'fifteen', num: 15, vi: 'mười lăm' },
            { word: 'twenty', num: 20, vi: 'hai mươi' },
            { word: 'thirty', num: 30, vi: 'ba mươi' }
        ],
        medium: [
            { word: 'twenty-five', num: 25, vi: 'hai mươi lăm' },
            { word: 'thirty-seven', num: 37, vi: 'ba mươi bảy' },
            { word: 'forty-two', num: 42, vi: 'bốn mươi hai' },
            { word: 'fifty-eight', num: 58, vi: 'năm mươi tám' },
            { word: 'sixty-four', num: 64, vi: 'sáu mươi bốn' }
        ],
        hard: [
            { word: 'seventy-three', num: 73, vi: 'bảy mươi ba' },
            { word: 'eighty-one', num: 81, vi: 'tám mươi một' },
            { word: 'ninety-nine', num: 99, vi: 'chín mươi chín' },
            { word: 'forty-four', num: 44, vi: 'bốn mươi bốn' },
            { word: 'sixty-six', num: 66, vi: 'sáu mươi sáu' }
        ]
    };

    const allOptions = wordNums[difficulty];
    const selected = allOptions[rand(0, allOptions.length - 1)];
    const displayWord = lang === 'vi' ? selected.vi : selected.word;

    // Build options: correct answer + 3 wrong answers from the same difficulty
    const wrongAnswers = allOptions
        .filter(o => o.num !== selected.num)
        .map(o => o.num);
    const chosenWrongAnswers = shuffle(wrongAnswers).slice(0, 3);
    const finalOptions = shuffle([selected.num, ...chosenWrongAnswers]);

    return {
        question: `${t('numbers', 'write_as_number', lang)} "${displayWord}" ${t('numbers', 'as_number', lang)}`,
        type: difficulty === 'hard' ? 'input' : 'multiple_choice',
        options: difficulty !== 'hard' ? finalOptions : undefined,
        answer: selected.num,
        hint: t('numbers', 'hint_sound', lang),
        visual: '📝',
        check: (input) => parseInt(input) === selected.num
    };
}

