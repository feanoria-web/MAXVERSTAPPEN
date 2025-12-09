/* ========================================
   F1 RACING - HAMILTON VS VERSTAPPEN LESSON
   Complete JavaScript - Rivalry Edition
   ======================================== */

// ===== SLIDE NAVIGATION =====
let currentSlide = 0;
const totalSlides = 13;

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    document.querySelector('.slide.active')?.classList.remove('active');
    document.querySelector('.indicator.active')?.classList.remove('active');
    currentSlide = index;
    document.querySelector(`[data-slide="${index}"]`)?.classList.add('active');
    document.querySelector(`.indicator[data-slide="${index}"]`)?.classList.add('active');
    updateProgress();
    playSound('slide');
}

function nextSlide() { if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1); }
function prevSlide() { if (currentSlide > 0) goToSlide(currentSlide - 1); }
function updateProgress() { document.getElementById('progressFill').style.width = `${((currentSlide + 1) / totalSlides) * 100}%`; }

// Indicator clicks
document.querySelectorAll('.indicator').forEach(ind => {
    ind.addEventListener('click', () => goToSlide(parseInt(ind.dataset.slide)));
});

// Keyboard
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (['ArrowRight', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    if (e.key >= '0' && e.key <= '9') { const n = parseInt(e.key); if (n < totalSlides) goToSlide(n); }
});

// Touch swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
});

// Click navigation
document.querySelector('.slides-container')?.addEventListener('click', e => {
    if (e.target.closest('button, input, video, audio, .sentence-card, .student-response, .ttt-cell, .hidden-answer')) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.7) nextSlide();
    else if (x < 0.3) prevSlide();
});

// ===== MAIN TIMER =====
let mainTimer = null, mainSeconds = 40 * 60, mainRunning = false;

document.getElementById('timerBtn')?.addEventListener('click', function() {
    if (mainRunning) { clearInterval(mainTimer); mainRunning = false; this.textContent = 'RESUME'; }
    else { mainRunning = true; this.textContent = 'PAUSE'; mainTimer = setInterval(() => {
        if (--mainSeconds <= 0) { clearInterval(mainTimer); playSound('finish'); }
        updateTimer('timer', mainSeconds);
    }, 1000); }
});

function updateTimer(id, sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    document.getElementById(id).textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
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
const audio = document.getElementById('listeningAudio');
function playListening() {
    audio?.play().catch(() => alert('Audio file not found. Teacher reads the transcript aloud.'));
}
function pauseListening() { audio?.pause(); }
function restartListening() { if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); } }

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

    // Show feedback
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

// ===== SCANNING QUESTIONS (Reading) =====
function checkScan(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const user = input.value.toLowerCase().trim();
    const correct = input.dataset.answer.toLowerCase();

    // Check if answer matches (partial match ok)
    const isMatch = user.length > 1 && (
        correct.includes(user) ||
        user.includes(correct) ||
        user.includes(correct.split(' ')[0]) // First word match
    );

    if (isMatch) {
        input.classList.remove('wrong');
        input.classList.add('correct');
        // Format the correct answer nicely
        input.value = correct.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        playSound('correct');
    } else {
        input.classList.remove('correct');
        input.classList.add('wrong');
        playSound('wrong');
    }
}

// ===== SENTENCE CARDS (Past Simple) =====
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

// ===== TIMELINE RESPONSES (Wrap-Up) =====
function revealResponse(element) {
    const hint = element.querySelector('.click-hint');
    const responses = element.querySelectorAll('.response-text');

    if (hint) hint.classList.add('hidden');
    responses.forEach(r => r.classList.remove('hidden'));
    playSound('reveal');
}

// ===== TIC-TAC-TOE GAME =====
let currentPlayer = 'x';
let tttMoves = 0;

function selectTTTCell(cell) {
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;

    // Add current player mark
    cell.classList.add(currentPlayer);
    cell.textContent = currentPlayer === 'x' ? '✖' : '⭕';
    tttMoves++;

    // Check for winner
    if (checkTTTWinner()) {
        playSound('victory');
        setTimeout(() => alert(`Team ${currentPlayer.toUpperCase()} wins!`), 100);
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    playSound('click');
}

function checkTTTWinner() {
    const cells = document.querySelectorAll('.ttt-cell');
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
        if (cells[a].classList.contains(currentPlayer) &&
            cells[b].classList.contains(currentPlayer) &&
            cells[c].classList.contains(currentPlayer)) {
            return true;
        }
    }
    return false;
}

function resetTTT() {
    const verbs = ['WIN', 'LOSE', 'CRY', 'PASS', 'START', 'FINISH', 'BE', 'CRASH', 'STOP'];
    document.querySelectorAll('.ttt-cell').forEach((cell, i) => {
        cell.classList.remove('x', 'o');
        cell.textContent = verbs[i];
    });
    currentPlayer = 'x';
    tttMoves = 0;
    playSound('slide');
}

// ===== SOUNDS =====
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        gain.gain.value = 0.12;

        const sounds = {
            slide: [600, 'sine', 0.08],
            correct: [880, 'sine', 0.15],
            wrong: [200, 'sawtooth', 0.25],
            reveal: [523, 'sine', 0.35],
            victory: [784, 'sine', 0.5],
            click: [1000, 'sine', 0.05],
            warning: [440, 'square', 0.5],
            finish: [880, 'sine', 1]
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
    console.log('🏎️ Hamilton vs Verstappen Lesson Ready!');
});
