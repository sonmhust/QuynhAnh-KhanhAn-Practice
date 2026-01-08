/**
 * MATH KINGDOM - CORE GAME ENGINE
 * Handles state management, DOM manipulation, and module coordination
 */

// ============== IMPORTS ==============
import { generateQuestion as generateCounting } from './modules/counting.js';
import { generateQuestion as generateNumbers } from './modules/numbers.js';
import { generateQuestion as generateShapes } from './modules/shapes.js';
import { generateQuestion as generateArithmetic } from './modules/arithmetic.js';
import { generateQuestion as generateMultiply } from './modules/multiply.js';
import { generateQuestion as generateMoney } from './modules/money.js';

// ============== CONSTANTS ==============
const RANKS = [
    { name: 'Little Seedling', icon: '🌱', min: 0 },
    { name: 'Pretty Blossom', icon: '🌷', min: 21 },
    { name: 'Flower Princess', icon: '🌸', min: 51 },
    { name: 'Magic Fairy', icon: '✨', min: 101 },
    { name: 'Math Queen', icon: '👑', min: 201 }
];

const TOPICS = [
    { id: 'counting', icon: '🔢', title: 'Counting', desc: 'Count on, back & skip counting', generator: generateCounting },
    { id: 'numbers', icon: '🔟', title: 'Number Sense', desc: 'Place value & 2-digit numbers', generator: generateNumbers },
    { id: 'shapes', icon: '📦', title: '3D Shapes', desc: 'Cube, Sphere, Cylinder & more', generator: generateShapes },
    { id: 'arithmetic', icon: '➕', title: 'Add & Subtract', desc: 'Addition & subtraction to 100', generator: generateArithmetic },
    { id: 'multiply', icon: '✖️', title: 'Multiply & Divide', desc: 'Tables for 1, 2, 5, 10', generator: generateMultiply },
    { id: 'money', icon: '💰', title: 'Money', desc: 'US Dollars & Cents', generator: generateMoney }
];

const QUESTIONS_PER_QUIZ = 10;
const STORAGE_KEY = 'mathKingdom_progress';

// ============== STATE ==============
const State = {
    playerName: '',
    totalScore: 0,
    currentRank: 0,
    currentTopic: null,
    questions: [],
    questionIndex: 0,
    correctCount: 0,
    answered: false
};

// ============== DOM HELPERS ==============
const $ = (id) => document.getElementById(id);
const showScreen = (id) => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $(id).classList.add('active');
};

// ============== STORAGE ==============
const Storage = {
    save() {
        const data = { name: State.playerName, score: State.totalScore };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    load() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }
};

// ============== RANK SYSTEM ==============
const Rank = {
    get(score) {
        for (let i = RANKS.length - 1; i >= 0; i--) {
            if (score >= RANKS[i].min) return i;
        }
        return 0;
    },
    
    update() {
        const rankIdx = this.get(State.totalScore);
        $('rankIcon').textContent = RANKS[rankIdx].icon;
        $('rankName').textContent = RANKS[rankIdx].name;
        $('totalScore').textContent = State.totalScore;
        
        // Check for rank up
        if (rankIdx > State.currentRank) {
            State.currentRank = rankIdx;
            Modal.showRankUp(RANKS[rankIdx]);
            Effects.confetti();
        }
    }
};

// ============== MODAL ==============
const Modal = {
    show(icon, title, message) {
        $('modalIcon').textContent = icon;
        $('modalTitle').textContent = title;
        $('modalMessage').textContent = message;
        $('celebrationModal').classList.add('show');
    },
    
    showRankUp(rank) {
        this.show(rank.icon, '🎉 Rank Up! 🎉', `You are now a "${rank.name}"! Amazing!`);
    },
    
    close() {
        $('celebrationModal').classList.remove('show');
    }
};

// ============== EFFECTS ==============
const Effects = {
    confetti() {
        const container = $('confettiContainer');
        container.innerHTML = '';
        const colors = ['#FFB6C1', '#E6E6FA', '#98FB98', '#FFD700', '#FF69B4'];
        
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = `${Math.random() * 0.5}s`;
            container.appendChild(piece);
        }
        
        setTimeout(() => container.innerHTML = '', 3500);
    }
};

// ============== SHUFFLE UTILITY ==============
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ============== GAME CONTROLLER ==============
const Game = {
    start() {
        const name = $('playerName').value.trim();
        if (!name) {
            $('playerName').style.borderColor = 'var(--error)';
            return;
        }
        
        State.playerName = name;
        
        // Load saved progress
        const saved = Storage.load();
        if (saved && saved.name === name) {
            State.totalScore = saved.score || 0;
        }
        
        State.currentRank = Rank.get(State.totalScore);
        Rank.update();
        this.renderTopics();
        showScreen('menuScreen');
    },
    
    renderTopics() {
        const grid = $('topicsGrid');
        grid.innerHTML = '';
        
        TOPICS.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'topic-card';
            card.innerHTML = `
                <span class="topic-icon">${topic.icon}</span>
                <div class="topic-title">${topic.title}</div>
                <div class="topic-desc">${topic.desc}</div>
            `;
            card.onclick = () => Quiz.start(topic);
            grid.appendChild(card);
        });
    },
    
    backToMenu() {
        Storage.save();
        showScreen('menuScreen');
    }
};

// ============== QUIZ CONTROLLER ==============
const Quiz = {
    start(topic) {
        State.currentTopic = topic;
        State.questions = [];
        State.questionIndex = 0;
        State.correctCount = 0;
        
        // Generate questions using topic's generator
        for (let i = 0; i < QUESTIONS_PER_QUIZ; i++) {
            const difficulty = i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard';
            State.questions.push(topic.generator(difficulty));
        }
        
        $('totalQ').textContent = QUESTIONS_PER_QUIZ;
        showScreen('quizScreen');
        this.loadQuestion();
    },
    
    loadQuestion() {
        if (State.questionIndex >= State.questions.length) {
            this.endQuiz();
            return;
        }
        
        const q = State.questions[State.questionIndex];
        State.answered = false;
        
        // Update UI
        $('currentQ').textContent = State.questionIndex + 1;
        $('correctCount').textContent = State.correctCount;
        $('qVisual').textContent = q.visual || '🌸';
        $('qText').textContent = q.question;
        
        // Clear feedback
        const feedback = $('feedback');
        feedback.className = 'feedback-box';
        feedback.innerHTML = '';
        $('nextBtn').classList.remove('show');
        
        // Render options or input
        const optContainer = $('optionsContainer');
        const inputContainer = $('inputContainer');
        
        if (q.type === 'multiple_choice') {
            optContainer.style.display = 'grid';
            inputContainer.style.display = 'none';
            optContainer.innerHTML = '';
            
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.onclick = () => this.checkAnswer(opt, q);
                optContainer.appendChild(btn);
            });
        } else {
            optContainer.style.display = 'none';
            inputContainer.style.display = 'flex';
            $('answerInput').value = '';
            $('answerInput').focus();
        }
    },
    
    checkAnswer(selected, q) {
        if (State.answered) return;
        State.answered = true;
        
        const isCorrect = q.check ? q.check(selected) : selected.toString() === q.answer.toString();
        const feedback = $('feedback');
        const buttons = document.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === q.answer.toString()) {
                btn.classList.add('correct');
            } else if (btn.textContent === selected.toString() && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
        
        if (isCorrect) {
            State.correctCount++;
            State.totalScore++;
            feedback.innerHTML = '✨ Correct! Great job! ✨';
            feedback.className = 'feedback-box correct show';
            Rank.update();
        } else {
            feedback.innerHTML = `❌ Not quite!<div class="hint-box">💡 Hint: ${q.hint}</div>`;
            feedback.className = 'feedback-box wrong show';
        }
        
        $('correctCount').textContent = State.correctCount;
        $('nextBtn').classList.add('show');
    },
    
    checkInputAnswer() {
        if (State.answered) return;
        
        const input = $('answerInput').value.trim();
        const q = State.questions[State.questionIndex];
        
        if (!input) return;
        
        State.answered = true;
        const isCorrect = q.check ? q.check(input) : input === q.answer.toString();
        const feedback = $('feedback');
        
        if (isCorrect) {
            State.correctCount++;
            State.totalScore++;
            feedback.innerHTML = '✨ Correct! Great job! ✨';
            feedback.className = 'feedback-box correct show';
            Rank.update();
        } else {
            feedback.innerHTML = `❌ The answer was: ${q.answer}<div class="hint-box">💡 Hint: ${q.hint}</div>`;
            feedback.className = 'feedback-box wrong show';
        }
        
        $('correctCount').textContent = State.correctCount;
        $('nextBtn').classList.add('show');
    },
    
    next() {
        State.questionIndex++;
        this.loadQuestion();
    },
    
    endQuiz() {
        Storage.save();
        
        const percent = Math.round((State.correctCount / QUESTIONS_PER_QUIZ) * 100);
        let icon, message;
        
        if (percent >= 80) {
            icon = '👑';
            message = "Outstanding! You're a math star!";
            Effects.confetti();
        } else if (percent >= 60) {
            icon = '⭐';
            message = 'Great work! Keep practicing!';
        } else {
            icon = '🌸';
            message = 'Good effort! Try again to improve!';
        }
        
        Modal.show(icon, `${State.correctCount}/${QUESTIONS_PER_QUIZ} Correct!`, message);
    }
};

// ============== EVENT LISTENERS ==============
document.addEventListener('DOMContentLoaded', () => {
    // Enter key for name input
    $('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') Game.start();
    });
    
    // Enter key for answer input
    $('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') Quiz.checkInputAnswer();
    });
});

// ============== EXPOSE TO GLOBAL (for onclick handlers) ==============
window.Game = Game;
window.Quiz = Quiz;
window.Modal = Modal;
