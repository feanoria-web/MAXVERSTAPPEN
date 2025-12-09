/* ========================================
   F1 RACING - HAMILTON VS VERSTAPPEN LESSON
   Complete JavaScript - All Features Fixed
   ======================================== */

// ===== SLIDE NAVIGATION =====
let currentSlide = 0;
const totalSlides = 13;

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    document.querySelector('.slide.active')?.classList.remove('active');
    document.querySelector('.indicator.active')?.classList.remove('active');

    currentSlide = index;

    const newSlide = document.querySelector(`.slide[data-slide="${index}"]`);
    const newIndicator = document.querySelector(`.indicator[data-slide="${index}"]`);

    if (newSlide) newSlide.classList.add('active');
    if (newIndicator) newIndicator.classList.add('active');

    updateProgress();
    playSound('slide');
}

function nextSlide() { if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1); }
function prevSlide() { if (currentSlide > 0) goToSlide(currentSlide - 1); }
function updateProgress() {
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
}

// Indicator clicks
document.querySelectorAll('.indicator').forEach(ind => {
    ind.addEventListener('click', () => goToSlide(parseInt(ind.dataset.slide)));
});

// Keyboard navigation - ONLY arrow keys
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
});

// NO click navigation - removed to prevent accidental navigation

// ===== F1 START LIGHTS =====
let lightsStarted = false;

function startLights() {
    if (lightsStarted) return;
    lightsStarted = true;

    const lights = document.querySelectorAll('.start-light');
    const overlay = document.getElementById('startOverlay');
    let lightIndex = 0;

    const lightInterval = setInterval(() => {
        if (lightIndex < lights.length) {
            lights[lightIndex].classList.add('on');
            playSound('light');
            lightIndex++;
        } else {
            clearInterval(lightInterval);
            setTimeout(() => {
                lights.forEach(l => l.classList.remove('on'));
                playSound('start');
                setTimeout(() => {
                    if (overlay) overlay.classList.add('hidden');
                }, 500);
            }, 1000);
        }
    }, 800);
}

// ===== MAIN TIMER =====
let mainTimer = null, mainSeconds = 40 * 60, mainRunning = false;

document.getElementById('timerBtn')?.addEventListener('click', function() {
    if (mainRunning) {
        clearInterval(mainTimer);
        mainRunning = false;
        this.textContent = 'RESUME';
    } else {
        mainRunning = true;
        this.textContent = 'PAUSE';
        mainTimer = setInterval(() => {
            if (--mainSeconds <= 0) {
                clearInterval(mainTimer);
                playSound('finish');
            }
            updateTimer('timer', mainSeconds);
        }, 1000);
    }
});

function updateTimer(id, sec) {
    const el = document.getElementById(id);
    if (!el) return;
    const m = Math.floor(sec / 60), s = sec % 60;
    el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ===== VOCABULARY =====
function speakWord(word) {
    if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(word);
        u.lang = 'en-US'; u.rate = 0.8;
        speechSynthesis.speak(u);
    }
    playSound('click');
}

// ===== AUDIO PLAYER =====
function playListening() {
    const audio = document.getElementById('listeningAudio');
    audio?.play().catch(() => alert('Audio file not found. Teacher reads the transcript aloud.'));
}
function pauseListening() {
    const audio = document.getElementById('listeningAudio');
    audio?.pause();
}
function restartListening() {
    const audio = document.getElementById('listeningAudio');
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
}

// ===== TRANSCRIPT TOGGLE =====
function toggleTranscript() {
    const box = document.getElementById('transcriptBox');
    const btn = document.querySelector('.transcript-toggle');
    if (box) {
        box.classList.toggle('hidden');
        if (btn) {
            btn.textContent = box.classList.contains('hidden') ? '📜 SHOW TRANSCRIPT' : '📜 HIDE TRANSCRIPT';
        }
    }
}

// ===== TRUE/FALSE WORKSHEET =====
function checkTF(btn, isCorrect) {
    const parent = btn.closest('.tf-buttons');
    const item = btn.closest('.tf-item');
    parent.querySelectorAll('button').forEach(b => b.classList.remove('selected-correct', 'selected-wrong'));

    if (btn.classList.contains('correct')) {
        btn.classList.add('selected-correct');
        playSound('correct');
    } else {
        btn.classList.add('selected-wrong');
        playSound('wrong');
        setTimeout(() => parent.querySelector('.correct')?.classList.add('selected-correct'), 500);
    }

    const feedback = item?.querySelector('.tf-feedback');
    if (feedback) feedback.classList.remove('hidden');
}

// ===== ANSWER KEY =====
function showAnswerKey(id) {
    const answerBox = document.getElementById(id);
    if (answerBox) {
        answerBox.classList.toggle('hidden');
        playSound('reveal');
    }
}

// ===== SCANNING QUESTIONS =====
function checkScan(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const user = input.value.toLowerCase().trim();
    const correct = input.dataset.answer.toLowerCase();

    const isMatch = user.length > 1 && (
        correct.includes(user) ||
        user.includes(correct) ||
        user.includes(correct.split(' ')[0])
    );

    if (isMatch) {
        input.classList.remove('wrong');
        input.classList.add('correct');
        input.value = correct.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        playSound('correct');
    } else {
        input.classList.remove('correct');
        input.classList.add('wrong');
        playSound('wrong');
    }
}

// ===== SENTENCE CARDS =====
function revealSentence(card) {
    const front = card.querySelector('.sentence-front');
    const back = card.querySelector('.sentence-back');
    if (front && back) {
        front.classList.toggle('hidden');
        back.classList.toggle('hidden');
        playSound('reveal');
    }
}

function revealAllSentences() {
    document.querySelectorAll('.sentence-card').forEach(card => {
        const front = card.querySelector('.sentence-front');
        const back = card.querySelector('.sentence-back');
        if (front) front.classList.add('hidden');
        if (back) back.classList.remove('hidden');
    });
    playSound('victory');
}

// ===== TIMELINE RESPONSES =====
function revealResponse(element) {
    const hint = element.querySelector('.click-hint');
    const responses = element.querySelectorAll('.response-text');
    if (hint) hint.classList.add('hidden');
    responses.forEach(r => r.classList.remove('hidden'));
    playSound('reveal');
}

// ===== 35 VERBS - Mix of Regular and Irregular =====
const verbList = [
    // IRREGULAR VERBS (20)
    { base: 'WIN', past: 'WON' },
    { base: 'LOSE', past: 'LOST' },
    { base: 'GO', past: 'WENT' },
    { base: 'DRIVE', past: 'DROVE' },
    { base: 'SEE', past: 'SAW' },
    { base: 'MAKE', past: 'MADE' },
    { base: 'HAVE', past: 'HAD' },
    { base: 'BE', past: 'WAS/WERE' },
    { base: 'GET', past: 'GOT' },
    { base: 'TAKE', past: 'TOOK' },
    { base: 'COME', past: 'CAME' },
    { base: 'GIVE', past: 'GAVE' },
    { base: 'FIND', past: 'FOUND' },
    { base: 'THINK', past: 'THOUGHT' },
    { base: 'SAY', past: 'SAID' },
    { base: 'KNOW', past: 'KNEW' },
    { base: 'PUT', past: 'PUT' },
    { base: 'RUN', past: 'RAN' },
    { base: 'EAT', past: 'ATE' },
    { base: 'DRINK', past: 'DRANK' },
    { base: 'WRITE', past: 'WROTE' },
    { base: 'READ', past: 'READ' },
    { base: 'SPEAK', past: 'SPOKE' },
    { base: 'BREAK', past: 'BROKE' },
    { base: 'BUY', past: 'BOUGHT' },
    { base: 'BRING', past: 'BROUGHT' },
    { base: 'CATCH', past: 'CAUGHT' },
    { base: 'TEACH', past: 'TAUGHT' },
    { base: 'FEEL', past: 'FELT' },
    { base: 'LEAVE', past: 'LEFT' },
    // REGULAR VERBS (15)
    { base: 'PLAY', past: 'PLAYED' },
    { base: 'WATCH', past: 'WATCHED' },
    { base: 'WALK', past: 'WALKED' },
    { base: 'TALK', past: 'TALKED' },
    { base: 'WORK', past: 'WORKED' },
    { base: 'START', past: 'STARTED' },
    { base: 'FINISH', past: 'FINISHED' },
    { base: 'STOP', past: 'STOPPED' },
    { base: 'CRY', past: 'CRIED' },
    { base: 'TRY', past: 'TRIED' },
    { base: 'STUDY', past: 'STUDIED' },
    { base: 'LOVE', past: 'LOVED' },
    { base: 'LIKE', past: 'LIKED' },
    { base: 'HELP', past: 'HELPED' },
    { base: 'LOOK', past: 'LOOKED' }
];

// ===== PIT STOP RACE GAME =====
let hamiltonScore = 0;
let verstappenScore = 0;
let currentVerbIndex = 0;

function newPitStopVerb() {
    currentVerbIndex = Math.floor(Math.random() * verbList.length);
    const verb = verbList[currentVerbIndex];

    document.getElementById('currentVerb').textContent = verb.base;
    document.getElementById('verbAnswer').textContent = verb.past;
    document.getElementById('verbAnswer').classList.add('hidden');
    playSound('click');
}

function showPitStopAnswer() {
    document.getElementById('verbAnswer').classList.remove('hidden');
    playSound('reveal');
}

function addScore(team) {
    if (team === 'hamilton') {
        hamiltonScore++;
        document.getElementById('hamiltonScore').textContent = hamiltonScore;
    } else {
        verstappenScore++;
        document.getElementById('verstappenScore').textContent = verstappenScore;
    }
    playSound('correct');
}

function resetPitStop() {
    hamiltonScore = 0;
    verstappenScore = 0;
    document.getElementById('hamiltonScore').textContent = '0';
    document.getElementById('verstappenScore').textContent = '0';
    document.getElementById('currentVerb').textContent = 'WIN';
    document.getElementById('verbAnswer').textContent = 'WON';
    document.getElementById('verbAnswer').classList.add('hidden');
    playSound('slide');
}

// ===== TIC-TAC-TOE GAME =====
let currentPlayer = 'x';
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let currentTTTVerbs = [];

function getRandomVerbs(count) {
    const shuffled = [...verbList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function initTTT() {
    currentTTTVerbs = getRandomVerbs(9);
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'x';

    const board = document.getElementById('tttBoard');
    if (!board) return;

    board.innerHTML = '';
    currentTTTVerbs.forEach((verb, i) => {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.textContent = verb.base;
        cell.dataset.index = i;
        cell.dataset.verb = verb.base;
        cell.dataset.past = verb.past;
        cell.onclick = () => selectTTTCell(cell);
        board.appendChild(cell);
    });

    updateTurnDisplay();
}

function selectTTTCell(cell) {
    const index = parseInt(cell.dataset.index);
    if (tttBoard[index] !== '') return;

    tttBoard[index] = currentPlayer;
    cell.classList.add(currentPlayer);
    cell.textContent = currentPlayer === 'x' ? '✖' : '⭕';

    if (checkTTTWinner()) {
        playSound('victory');
        setTimeout(() => {
            alert(`Team ${currentPlayer.toUpperCase()} wins! 🏆\n\nThe verb was: ${cell.dataset.verb} → ${cell.dataset.past}`);
        }, 100);
        return;
    }

    if (tttBoard.every(c => c !== '')) {
        playSound('finish');
        setTimeout(() => alert("It's a draw!"), 100);
        return;
    }

    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    updateTurnDisplay();
    playSound('click');
}

function checkTTTWinner() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            return true;
        }
    }
    return false;
}

function updateTurnDisplay() {
    const turn = document.getElementById('currentTurn');
    if (turn) {
        turn.textContent = `Team ${currentPlayer.toUpperCase()}'s turn`;
        turn.style.color = currentPlayer === 'x' ? '#ef4444' : '#3b82f6';
    }
}

function resetTTT() {
    initTTT();
    playSound('slide');
}

// ===== SOUNDS =====
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.15;

        const sounds = {
            slide: [600, 'sine', 0.08],
            correct: [880, 'sine', 0.15],
            wrong: [200, 'sawtooth', 0.25],
            reveal: [523, 'sine', 0.35],
            victory: [784, 'sine', 0.5],
            click: [1000, 'sine', 0.05],
            warning: [440, 'square', 0.5],
            finish: [880, 'sine', 1],
            light: [300, 'sine', 0.15],
            start: [700, 'sawtooth', 0.3]
        };

        const [freq, waveType, dur] = sounds[type] || [500, 'sine', 0.1];
        osc.frequency.value = freq;
        osc.type = waveType;
        osc.start();
        osc.stop(ctx.currentTime + dur);
    } catch (e) {}
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();

    const firstSlide = document.querySelector('.slide[data-slide="0"]');
    if (firstSlide && !firstSlide.classList.contains('active')) {
        firstSlide.classList.add('active');
    }

    // Initialize Tic-Tac-Toe with random verbs
    initTTT();

    console.log('🏎️ Hamilton vs Verstappen Lesson Ready!');
});
