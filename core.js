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
import { generateQuestion as generateCalculations } from './modules/calculations.js';
import { FirebaseAuth } from './firebase-auth.js';
import { FirebaseDB } from './firebase-db.js';

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
    { id: 'money', icon: '💰', title: 'Money', desc: 'US Dollars & Cents', generator: generateMoney },
    { id: 'calculations', icon: '📊', title: 'Calculations', desc: 'Column addition & subtraction', generator: generateCalculations }
];

const QUESTIONS_PER_QUIZ = 10;

// ============== STATE ==============
const State = {
    currentUser: null,  // Firebase user object { uid, email, username, displayName }
    playerName: '',
    language: 'en',  // Current language: 'en' or 'vi'
    totalScore: 0,
    currentRank: 0,
    topicScores: {},
    currentTopic: null,
    currentChapter: null,  // NEW: tracks selected chapter for multi-chapter topics
    questions: [],
    questionIndex: 0,
    correctCount: 0,
    answered: false,
    profileUnsubscribe: null  // Firestore listener unsubscribe function
};

// ============== DOM HELPERS ==============
const $ = (id) => document.getElementById(id);
const showScreen = (id) => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $(id).classList.add('active');
};

// ============== FIREBASE INTEGRATION ==============
// No Storage object needed - using Firebase directly

// ============== RANK SYSTEM ==============
const Rank = {
    get(score) {
        for (let i = RANKS.length - 1; i >= 0; i--) {
            if (score >= RANKS[i].min) return i;
        }
        return 0;
    },

    async update() {
        const rankIdx = this.get(State.totalScore);
        $('rankIcon').textContent = RANKS[rankIdx].icon;
        $('rankName').textContent = RANKS[rankIdx].name;
        $('totalScore').textContent = State.totalScore;

        // Check for rank up and save to Firebase
        if (rankIdx > State.currentRank) {
            State.currentRank = rankIdx;
            Modal.showRankUp(RANKS[rankIdx]);
            Effects.confetti();

            // Update rank in Firestore
            if (State.currentUser) {
                await FirebaseDB.updateUserRank(
                    State.currentUser.uid,
                    RANKS[rankIdx].name,
                    RANKS[rankIdx].icon
                );
            }
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
    async start() {
        const name = $('playerName').value.trim();
        if (!name) {
            alert('⚠️ Please enter your name!');
            return;
        }

        // Validate username
        if (!FirebaseAuth.isValidUsername(name)) {
            alert('⚠️ Invalid username! Only "quynhanh" and "khanhan" are allowed.');
            return;
        }

        try {
            // Sign in with Firebase
            const user = await FirebaseAuth.signIn(name);
            State.currentUser = user;
            State.playerName = user.username;

            // Create or get user profile from Firestore
            await FirebaseDB.createUserProfile(user.uid, user);
            const profile = await FirebaseDB.getUserProfile(user.uid);

            if (profile) {
                State.totalScore = profile.totalScore || 0;
                State.topicScores = profile.topicScores || {};
            }

            // Set up real-time listener for profile changes
            State.profileUnsubscribe = FirebaseDB.listenToUserProfile(user.uid, (data) => {
                if (data) {
                    State.totalScore = data.totalScore || 0;
                    State.topicScores = data.topicScores || {};
                    State.currentRank = Rank.get(State.totalScore);
                    Rank.update();
                }
            });

            State.currentRank = Rank.get(State.totalScore);
            Rank.update();
            this.renderTopics();
            showScreen('menuScreen');
        } catch (error) {
            console.error('Login error:', error);
            alert(`😣 ${error.message}`);
        }
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
            // Check if calculations topic - show chapter selection
            if (topic.id === 'calculations') {
                card.onclick = () => Quiz.showChapterSelect(topic);
            } else {
                card.onclick = () => Quiz.start(topic);
            }
            grid.appendChild(card);
        });
    },

    backToMenu() {
        // No need to explicitly save - Firestore auto-syncs
        showScreen('menuScreen');
    }
};

// ============== QUIZ CONTROLLER ==============
const Quiz = {
    showChapterSelect(topic) {
        State.currentTopic = topic;
        const grid = $('chaptersGrid');
        grid.innerHTML = '';

        // Define chapters for calculations
        const chapters = [
            { number: 1, icon: '📐', titleKey: 'chapter_1_title', descKey: 'chapter_1_desc' },
            { number: 2, icon: '✖️', titleKey: 'chapter_2_title', descKey: 'chapter_2_desc' }
        ];

        import('./translations.js').then(({ t }) => {
            chapters.forEach(chapter => {
                const card = document.createElement('div');
                card.className = 'chapter-card';
                const title = t('calc', chapter.titleKey, State.language);
                const desc = t('calc', chapter.descKey, State.language);
                card.innerHTML = `
                    <div class="chapter-number">${chapter.icon}</div>
                    <div class="chapter-title">${title}</div>
                    <div class="chapter-desc">${desc}</div>
                `;
                card.onclick = () => this.start(topic, chapter.number);
                grid.appendChild(card);
            });
        });

        showScreen('chapterScreen');
    },

    start(topic, chapter = null) {
        State.currentTopic = topic;
        State.currentChapter = chapter;
        State.questions = [];
        State.questionIndex = 0;
        State.correctCount = 0;

        // Generate questions using topic's generator
        for (let i = 0; i < QUESTIONS_PER_QUIZ; i++) {
            const difficulty = i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard';
            // Pass chapter to generator if topic supports it
            State.questions.push(topic.generator(difficulty, chapter));
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

        // Handle column-formatted questions (HTML content)
        const questionBox = $('questionBox');
        const existingColumnCalc = questionBox.querySelector('.column-calculation');
        if (existingColumnCalc) {
            existingColumnCalc.remove();
        }
        if (q.questionHTML) {
            questionBox.insertAdjacentHTML('beforeend', q.questionHTML);
        }

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

            // Save to Firebase (atomic increment)
            if (State.currentUser && State.currentTopic) {
                FirebaseDB.incrementStars(State.currentUser.uid, 1, State.currentTopic.id);
            }

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

            // Save to Firebase (atomic increment)
            if (State.currentUser && State.currentTopic) {
                FirebaseDB.incrementStars(State.currentUser.uid, 1, State.currentTopic.id);
            }

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
        // Update topic scores locally
        const topicId = State.currentTopic.id;
        if (!State.topicScores[topicId]) {
            State.topicScores[topicId] = 0;
        }
        State.topicScores[topicId] += State.correctCount;

        // Auto-saved to Firebase during quiz
        // (each correct answer triggered incrementStars)

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

// ============== LANGUAGE SELECTION ==============
function selectLanguage(lang) {
    State.language = lang;

    // Update button states
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    $(`langBtn${lang.charAt(0).toUpperCase() + lang.slice(1)}`).classList.add('active');

    console.log(`Language changed to: ${lang === 'en' ? 'English' : 'Tiếng Việt'}`);
}

// ============== EXPOSE TO GLOBAL (for onclick handlers) ==============
window.Game = Game;
window.Quiz = Quiz;
window.Modal = Modal;
window.selectLanguage = selectLanguage;
window.State = State;

