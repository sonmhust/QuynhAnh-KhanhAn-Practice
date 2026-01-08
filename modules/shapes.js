/**
 * SHAPES MODULE
 * Generates questions for: 3D shape identification, properties, real-world objects
 */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

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
    const shape = SHAPES[rand(0, SHAPES.length - 1)];
    const otherShapes = SHAPES.filter(s => s.name !== shape.name);

    const descriptions = {
        easy: `What is this shape? ${shape.icon}`,
        medium: `This shape has ${shape.faces} faces. What is it?`,
        hard: shape.canRoll
            ? `This shape can roll and has no corners. What is it?`
            : `This shape has ${shape.vertices} vertices and cannot roll. What is it?`
    };

    return {
        question: descriptions[difficulty],
        type: 'multiple_choice',
        options: shuffle([shape.name, ...otherShapes.slice(0, 3).map(s => s.name)]),
        answer: shape.name,
        hint: `Think about what ${shape.examples[0]} looks like`,
        visual: shape.icon,
        check: (input) => input === shape.name
    };
}

function generateRealWorld(difficulty) {
    const shape = SHAPES[rand(0, SHAPES.length - 1)];
    const example = shape.examples[rand(0, shape.examples.length - 1)];
    const otherShapes = SHAPES.filter(s => s.name !== shape.name);

    const articles = { 'a': true, 'A': true };
    const article = 'aeiou'.includes(example[0].toLowerCase()) ? 'an' : 'a';

    return {
        question: `What 3D shape is ${article} ${example}?`,
        type: 'multiple_choice',
        options: shuffle([shape.name, ...otherShapes.slice(0, 3).map(s => s.name)]),
        answer: shape.name,
        hint: `Think about the overall shape of ${article} ${example}`,
        visual: shape.icon,
        check: (input) => input === shape.name
    };
}

function generateProperties(difficulty) {
    if (difficulty === 'easy') {
        // Can it roll?
        const shape = SHAPES[rand(0, SHAPES.length - 1)];
        return {
            question: `Can a ${shape.name} ${shape.icon} roll?`,
            type: 'multiple_choice',
            options: ['Yes', 'No'],
            answer: shape.canRoll ? 'Yes' : 'No',
            hint: shape.canRoll ? 'It has curved surfaces' : 'It has flat faces only',
            visual: shape.icon,
            check: (input) => input === (shape.canRoll ? 'Yes' : 'No')
        };
    } else {
        // How many faces?
        const shape = SHAPES[rand(0, SHAPES.length - 1)];
        return {
            question: difficulty === 'hard'
                ? `How many faces does a ${shape.name} have?`
                : `A ${shape.name} ${shape.icon} has how many faces?`,
            type: difficulty === 'hard' ? 'input' : 'multiple_choice',
            options: difficulty !== 'hard' ? shuffle([shape.faces, shape.faces + 1, shape.faces - 1, 4]) : undefined,
            answer: shape.faces,
            hint: 'Count each flat surface',
            visual: shape.icon,
            check: (input) => parseInt(input) === shape.faces
        };
    }
}
