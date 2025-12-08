/* ========================================
   F1 RACING - VERSTAPPEN LESSON
   Complete JavaScript
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
    if (e.target.closest('button, input, video, audio')) return;
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

// ===== MYSTERY GAME =====
function showClue(n) {
    const clue = document.querySelector(`[data-clue="${n}"]`);
    if (clue) { clue.classList.remove('hidden'); clue.classList.add('visible'); playSound('reveal'); }
}

function revealMystery() {
    for (let i = 1; i <= 3; i++) showClue(i);
    document.getElementById('mysteryBlur')?.classList.add('revealed');
    const reveal = document.getElementById('revealText');
    if (reveal) { reveal.classList.remove('hidden'); reveal.classList.add('visible'); }
    playSound('victory');
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
function playListening() { audio?.play().catch(() => alert('Audio file not found: media/audio/verstappen-story.mp3')); }
function pauseListening() { audio?.pause(); }
function restartListening() { if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); } }
function slowListening() { if (audio) { audio.playbackRate = audio.playbackRate === 1 ? 0.7 : 1; } }

function toggleTranscript() { document.getElementById('transcriptBox')?.classList.toggle('hidden'); }

// ===== TIMELINE ACTIVITY =====
function checkInput(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const user = input.value.toLowerCase().trim();
    const correct = input.dataset.answer.toLowerCase();
    if (user.length > 2 && (correct.includes(user) || user.includes(correct))) {
        input.classList.remove('wrong'); input.classList.add('correct');
        input.value = correct.charAt(0).toUpperCase() + correct.slice(1);
        playSound('correct');
    } else {
        input.classList.remove('correct'); input.classList.add('wrong');
        playSound('wrong');
    }
}

function showAllAnswers() {
    document.querySelectorAll('.answer-input').forEach(input => {
        const ans = input.dataset.answer;
        input.value = ans.charAt(0).toUpperCase() + ans.slice(1);
        input.classList.remove('wrong'); input.classList.add('correct');
    });
    playSound('reveal');
}

// ===== QUIZ =====
function checkQuiz(btn, isCorrect) {
    const parent = btn.closest('.quiz-options');
    parent.querySelectorAll('button').forEach(b => b.classList.remove('selected-correct', 'selected-wrong'));
    if (btn.classList.contains('correct')) {
        btn.classList.add('selected-correct');
        playSound('correct');
    } else {
        btn.classList.add('selected-wrong');
        playSound('wrong');
        setTimeout(() => parent.querySelector('.correct')?.classList.add('selected-correct'), 500);
    }
    // Show answer
    const answer = btn.closest('.quiz-box')?.querySelector('.quiz-answer');
    if (answer) answer.classList.remove('hidden');
}

// ===== TRUE/FALSE =====
function checkTF(btn, isCorrect) {
    const parent = btn.closest('.tf-buttons');
    parent.querySelectorAll('button').forEach(b => b.classList.remove('selected-correct', 'selected-wrong'));
    if (btn.classList.contains('correct')) {
        btn.classList.add('selected-correct');
        playSound('correct');
    } else {
        btn.classList.add('selected-wrong');
        playSound('wrong');
        setTimeout(() => parent.querySelector('.correct')?.classList.add('selected-correct'), 500);
    }
}

// ===== PRACTICE TIMER =====
let practiceTimer = null, practiceSeconds = 5 * 60, practiceRunning = false;

function startPractice() {
    if (practiceRunning) return;
    practiceRunning = true;
    practiceTimer = setInterval(() => {
        if (--practiceSeconds <= 0) { clearInterval(practiceTimer); practiceRunning = false; playSound('finish'); }
        if (practiceSeconds === 60) playSound('warning');
        updateTimer('practiceTimer', practiceSeconds);
    }, 1000);
}

function resetPractice() {
    clearInterval(practiceTimer);
    practiceRunning = false;
    practiceSeconds = 5 * 60;
    document.getElementById('practiceTimer').textContent = '05:00';
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
    console.log('🏎️ Verstappen Lesson Ready!');
});
