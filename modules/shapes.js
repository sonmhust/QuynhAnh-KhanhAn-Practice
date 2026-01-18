/**
 * SHAPES MODULE
 * Generates questions for: 3D shape identification, properties, real-world objects
 */

import { rand, shuffle, generateOptionsWithPreferred, getLang } from './utils.js';
import { t } from '../translations.js';

const SHAPES = [
    { name: 'Cube', faces: 6, edges: 12, vertices: 8, canRoll: false, icon: '🧊', examples: ['dice', 'ice cube', 'Rubik\'s cube'] },
    { name: 'Cuboid', faces: 6, edges: 12, vertices: 8, canRoll: false, icon: '📦', examples: ['box', 'brick', 'book'] },
    { name: 'Sphere', faces: 0, edges: 0, vertices: 0, canRoll: true, icon: '⚽', examples: ['ball', 'globe', 'marble'] },
    { name: 'Cylinder', faces: 3, edges: 2, vertices: 0, canRoll: true, icon: '🥫', examples: ['can', 'pipe', 'log'] },
    { name: 'Pyramid', faces: 5, edges: 8, vertices: 5, canRoll: false, icon: '🔺', examples: ['Egyptian pyramid', 'tent'] }
];

export function generateQuestion(difficulty = 'easy') {
    const type = rand(0, 2);

    switch (type) {
        case 0: return generateIdentify(difficulty);
        case 1: return generateRealWorld(difficulty);
        case 2: return generateProperties(difficulty);
        default: return generateIdentify(difficulty);
    }
}

function generateIdentify(difficulty) {
    const lang = getLang();
    const shape = SHAPES[rand(0, SHAPES.length - 1)];
    const otherShapes = SHAPES.filter(s => s.name !== shape.name);

    const descriptions = {
        easy: `${t('shapes', 'what_is', lang)} ${shape.icon}`,
        medium: `${t('shapes', 'has_faces', lang)} ${shape.faces} ${t('shapes', 'faces', lang)}. ${t('shapes', 'what_is_it', lang)}`,
        hard: shape.canRoll
            ? t('shapes', 'can_roll_no_corners', lang)
            : `${t('shapes', 'has_vertices', lang)} ${shape.vertices} ${t('shapes', 'vertices', lang)}`
    };

    return {
        question: descriptions[difficulty],
        type: 'multiple_choice',
        options: shuffle([shape.name, ...otherShapes.slice(0, 3).map(s => s.name)]),
        answer: shape.name,
        hint: `${t('shapes', 'hint_think', lang)} ${shape.examples[0]} ${t('shapes', 'hint_looks_like', lang)}`,
        visual: shape.icon,
        check: (input) => input === shape.name
    };
}

function generateRealWorld(difficulty) {
    const lang = getLang();
    const shape = SHAPES[rand(0, SHAPES.length - 1)];
    const example = shape.examples[rand(0, shape.examples.length - 1)];
    const otherShapes = SHAPES.filter(s => s.name !== shape.name);

    const articles = { 'a': true, 'A': true };
    const article = 'aeiou'.includes(example[0].toLowerCase()) ? 'an' : 'a';

    return {
        question: `${t('shapes', 'what_3d', lang)} ${article} ${example}?`,
        type: 'multiple_choice',
        options: shuffle([shape.name, ...otherShapes.slice(0, 3).map(s => s.name)]),
        answer: shape.name,
        hint: `${t('shapes', 'hint_overall', lang)} ${article} ${example}`,
        visual: shape.icon,
        check: (input) => input === shape.name
    };
}

function generateProperties(difficulty) {
    const lang = getLang();

    if (difficulty === 'easy') {
        // Can it roll?
        const shape = SHAPES[rand(0, SHAPES.length - 1)];
        return {
            question: `${t('shapes', 'can_roll', lang)} ${shape.name} ${shape.icon} ${t('shapes', 'roll_q', lang)}`,
            type: 'multiple_choice',
            options: [t('shapes', 'yes', lang), t('shapes', 'no', lang)],
            answer: shape.canRoll ? t('shapes', 'yes', lang) : t('shapes', 'no', lang),
            hint: shape.canRoll ? t('shapes', 'hint_curved', lang) : t('shapes', 'hint_flat', lang),
            visual: shape.icon,
            check: (input) => input === (shape.canRoll ? t('shapes', 'yes', lang) : t('shapes', 'no', lang))
        };
    } else {
        // How many faces?
        const shape = SHAPES[rand(0, SHAPES.length - 1)];
        return {
            question: difficulty === 'hard'
                ? `${t('shapes', 'how_many_faces', lang)} ${shape.name} ${t('shapes', 'have', lang)}`
                : `${t('shapes', 'a_has', lang)} ${shape.name} ${shape.icon} ${t('shapes', 'has_how_many', lang)}`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? generateOptionsWithPreferred(shape.faces, [shape.faces + 1, shape.faces - 1, 4]) : undefined,
            answer: shape.faces,
            hint: t('shapes', 'hint_count', lang),
            visual: shape.icon,
            check: (input) => parseInt(input) === shape.faces
        };
    }
}

