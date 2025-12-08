/* ========================================
   F1 RACING THEME - MAX VERSTAPPEN
   Slide Navigation & Interactivity
   ======================================== */

// ========================================
// SLIDE NAVIGATION
// ========================================

let currentSlide = 0;
const totalSlides = 11;

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    // Remove active from current slide
    document.querySelector('.slide.active')?.classList.remove('active');
    document.querySelector('.indicator.active')?.classList.remove('active');

    // Set new active slide
    currentSlide = index;
    const newSlide = document.querySelector(`[data-slide="${index}"]`);
    const newIndicator = document.querySelector(`.indicator[data-slide="${index}"]`);

    if (newSlide) newSlide.classList.add('active');
    if (newIndicator) newIndicator.classList.add('active');

    // Update progress bar
    updateProgress();

    // Play sound
    playSound('slide');
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function updateProgress() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// Indicator clicks
document.querySelectorAll('.indicator').forEach(indicator => {
    indicator.addEventListener('click', () => {
        const slideIndex = parseInt(indicator.dataset.slide);
        goToSlide(slideIndex);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
    }

    // Number keys for quick navigation
    if (e.key >= '0' && e.key <= '9') {
        const num = parseInt(e.key);
        if (num < totalSlides) {
            goToSlide(num);
        }
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide(); // Swipe left = next
        } else {
            prevSlide(); // Swipe right = prev
        }
    }
}

// Click navigation (click right side = next, left side = prev)
document.querySelector('.slides-container').addEventListener('click', (e) => {
    if (e.target.closest('button, input, video, audio, .video-overlay')) return;

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    if (clickX > screenWidth * 0.7) {
        nextSlide();
    } else if (clickX < screenWidth * 0.3) {
        prevSlide();
    }
});

// ========================================
// MAIN TIMER
// ========================================

let mainTimerInterval = null;
let mainTimerSeconds = 40 * 60;
let mainTimerRunning = false;

document.getElementById('timerBtn').addEventListener('click', function () {
    if (mainTimerRunning) {
        pauseMainTimer();
        this.textContent = 'RESUME';
    } else {
        startMainTimer();
        this.textContent = 'PAUSE';
    }
});

function startMainTimer() {
    mainTimerRunning = true;
    mainTimerInterval = setInterval(() => {
        if (mainTimerSeconds <= 0) {
            clearInterval(mainTimerInterval);
            document.getElementById('timer').textContent = "00:00";
            playSound('finish');
            return;
        }
        mainTimerSeconds--;
        updateTimerDisplay('timer', mainTimerSeconds);
    }, 1000);
}

function pauseMainTimer() {
    mainTimerRunning = false;
    clearInterval(mainTimerInterval);
}

function updateTimerDisplay(elementId, seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById(elementId).textContent =
        String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

// ========================================
// MYSTERY GAME (Phase 1)
// ========================================

function showClue(num) {
    const clue = document.getElementById('clue' + num);
    if (clue) {
        clue.classList.add('visible');
        playSound('reveal');
    }
}

function revealPerson() {
    // Show all clues
    for (let i = 1; i <= 3; i++) {
        showClue(i);
    }

    // Remove blur overlay
    document.getElementById('blurOverlay').classList.add('revealed');

    // Hide question mark
    document.getElementById('questionMark').classList.add('hidden');

    // Show name
    document.getElementById('revealName').classList.remove('hidden');
    document.getElementById('revealName').classList.add('visible');

    playSound('victory');
}

// ========================================
// VOCABULARY (Phase 1)
// ========================================

function speakWord(word) {
    // Use Web Speech API
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
    playSound('click');
}

// ========================================
// AUDIO PLAYER (Phase 2)
// ========================================

const listeningAudio = document.getElementById('listeningAudio');

function playAudio() {
    if (listeningAudio) {
        listeningAudio.play().catch(() => {
            showToast('Audio file not found. Add: media/audio/verstappen-story.mp3');
        });
    }
}

function pauseAudio() {
    if (listeningAudio) {
        listeningAudio.pause();
    }
}

function restartAudio() {
    if (listeningAudio) {
        listeningAudio.currentTime = 0;
        listeningAudio.play().catch(() => {
            showToast('Audio file not found');
        });
    }
}

function slowAudio() {
    if (listeningAudio) {
        listeningAudio.playbackRate = listeningAudio.playbackRate === 1 ? 0.7 : 1;
        showToast(listeningAudio.playbackRate === 1 ? 'Normal speed' : 'Slow speed (0.7x)');
    }
}

function toggleTranscript() {
    const transcript = document.getElementById('transcript');
    transcript.classList.toggle('hidden');
}

// ========================================
// TIMELINE ACTIVITY (Phase 2)
// ========================================

function checkAnswer(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const userAnswer = input.value.toLowerCase().trim();
    const correctAnswer = input.dataset.answer.toLowerCase();

    // Check for partial match
    const isCorrect = correctAnswer.includes(userAnswer) ||
        userAnswer.includes(correctAnswer) ||
        levenshtein(userAnswer, correctAnswer) <= 2;

    if (isCorrect && userAnswer.length > 2) {
        input.classList.remove('wrong');
        input.classList.add('correct');
        input.value = capitalize(correctAnswer);
        playSound('correct');
    } else {
        input.classList.remove('correct');
        input.classList.add('wrong');
        playSound('wrong');
    }
}

function revealAllTimeline() {
    document.querySelectorAll('.timeline-input').forEach(input => {
        input.value = capitalize(input.dataset.answer);
        input.classList.remove('wrong');
        input.classList.add('correct');
    });
    playSound('reveal');
}

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function capitalize(str) {
    return str.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// ========================================
// QUIZ (Phase 3)
// ========================================

function selectQuiz(button, isCorrect) {
    const parent = button.closest('.quiz-options');
    const buttons = parent.querySelectorAll('.quiz-opt');

    // Reset all
    buttons.forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
    });

    // Mark clicked
    if (button.classList.contains('correct')) {
        button.classList.add('selected-correct');
        playSound('correct');
    } else {
        button.classList.add('selected-wrong');
        playSound('wrong');
        // Show correct after delay
        setTimeout(() => {
            parent.querySelector('.correct').classList.add('selected-correct');
        }, 500);
    }
}

function checkTF(button, isCorrect) {
    const parent = button.closest('.tf-row');
    const buttons = parent.querySelectorAll('.tf-btn');

    buttons.forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
    });

    if (button.classList.contains('correct')) {
        button.classList.add('selected-correct');
        playSound('correct');
    } else {
        button.classList.add('selected-wrong');
        playSound('wrong');
        setTimeout(() => {
            parent.querySelector('.correct').classList.add('selected-correct');
        }, 500);
    }
}

// ========================================
// PRACTICE TIMER (Phase 4)
// ========================================

let practiceTimerInterval = null;
let practiceTimerSeconds = 5 * 60;
let practiceTimerRunning = false;

function startPractice() {
    if (practiceTimerRunning) return;

    practiceTimerRunning = true;
    practiceTimerInterval = setInterval(() => {
        if (practiceTimerSeconds <= 0) {
            clearInterval(practiceTimerInterval);
            document.getElementById('practiceTimer').textContent = "00:00";
            playSound('finish');
            practiceTimerRunning = false;
            return;
        }

        practiceTimerSeconds--;
        updateTimerDisplay('practiceTimer', practiceTimerSeconds);

        // Warning at 1 minute
        if (practiceTimerSeconds === 60) {
            playSound('warning');
        }
    }, 1000);
}

function resetPractice() {
    practiceTimerRunning = false;
    clearInterval(practiceTimerInterval);
    practiceTimerSeconds = 5 * 60;
    document.getElementById('practiceTimer').textContent = "05:00";
}

// ========================================
// VIDEO OVERLAYS
// ========================================

document.querySelectorAll('.video-overlay').forEach(overlay => {
    overlay.addEventListener('click', function () {
        const videoFrame = this.closest('.video-frame');
        const video = videoFrame.querySelector('video');

        this.classList.add('hidden');

        if (video) {
            video.play().catch(() => {
                showToast('Video file not found');
                this.classList.remove('hidden');
            });
        }
    });
});

// ========================================
// SOUND EFFECTS
// ========================================

function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.15;

        switch (type) {
            case 'slide':
                oscillator.frequency.value = 600;
                oscillator.type = 'sine';
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.08);
                break;
            case 'correct':
                oscillator.frequency.value = 880;
                oscillator.type = 'sine';
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
                break;
            case 'wrong':
                oscillator.frequency.value = 200;
                oscillator.type = 'sawtooth';
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.25);
                break;
            case 'reveal':
                oscillator.frequency.value = 523;
                oscillator.type = 'sine';
                oscillator.start();
                setTimeout(() => oscillator.frequency.value = 659, 100);
                setTimeout(() => oscillator.frequency.value = 784, 200);
                oscillator.stop(audioContext.currentTime + 0.35);
                break;
            case 'victory':
                oscillator.frequency.value = 523;
                oscillator.type = 'sine';
                oscillator.start();
                setTimeout(() => oscillator.frequency.value = 659, 150);
                setTimeout(() => oscillator.frequency.value = 784, 300);
                setTimeout(() => oscillator.frequency.value = 1047, 450);
                oscillator.stop(audioContext.currentTime + 0.6);
                break;
            case 'click':
                oscillator.frequency.value = 1000;
                oscillator.type = 'sine';
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
            case 'warning':
                oscillator.frequency.value = 440;
                oscillator.type = 'square';
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
            case 'finish':
                oscillator.frequency.value = 880;
                oscillator.type = 'sine';
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 1);
                break;
        }
    } catch (e) {
        // Audio not supported
    }
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-size: 1rem;
        z-index: 9999;
        border: 2px solid #ff8000;
        animation: fadeIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========================================
// FULLSCREEN MODE
// ========================================

document.addEventListener('dblclick', (e) => {
    if (e.target.closest('.top-bar')) {
        toggleFullscreen();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
    } else {
        document.exitFullscreen();
    }
}

// F key for fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        if (e.target.tagName !== 'INPUT') {
            toggleFullscreen();
        }
    }
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    console.log('🏎️ Max Verstappen Lesson - Ready!');
    console.log('Navigation: Arrow keys, Space, Click, Swipe');
    console.log('Fullscreen: Press F or double-click top bar');
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
`;
document.head.appendChild(style);
