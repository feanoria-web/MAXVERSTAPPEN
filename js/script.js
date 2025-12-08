/* ========================================
   7th Grade Biographies - Max Verstappen
   Interactive JavaScript Functions
   ======================================== */

// ========================================
// TIMER FUNCTIONALITY
// ========================================

let mainTimerInterval = null;
let mainTimerSeconds = 40 * 60; // 40 minutes
let mainTimerRunning = false;

let practiceTimerInterval = null;
let practiceTimerSeconds = 5 * 60; // 5 minutes
let practiceTimerRunning = false;

// Main lesson timer
document.getElementById('timerBtn').addEventListener('click', function() {
    if (mainTimerRunning) {
        pauseMainTimer();
        this.textContent = 'Resume';
    } else {
        startMainTimer();
        this.textContent = 'Pause';
    }
});

function startMainTimer() {
    mainTimerRunning = true;
    mainTimerInterval = setInterval(function() {
        if (mainTimerSeconds <= 0) {
            clearInterval(mainTimerInterval);
            document.getElementById('timer').textContent = "00:00";
            alert('Ders süresi doldu! (Time is up!)');
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

// Practice timer for speaking activity
function startPracticeTimer() {
    if (practiceTimerRunning) return;

    practiceTimerRunning = true;
    practiceTimerInterval = setInterval(function() {
        if (practiceTimerSeconds <= 0) {
            clearInterval(practiceTimerInterval);
            document.getElementById('practiceTimer').textContent = "00:00";
            playSound('finish');
            alert('Practice time is over! Return to your seats.');
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

function resetPracticeTimer() {
    practiceTimerRunning = false;
    clearInterval(practiceTimerInterval);
    practiceTimerSeconds = 5 * 60;
    document.getElementById('practiceTimer').textContent = "05:00";
}

// ========================================
// PHASE 1: MYSTERY GAME FUNCTIONS
// ========================================

let cluesShown = 0;

function showClue(clueNumber) {
    const clue = document.getElementById('clue' + clueNumber);
    if (clue) {
        clue.classList.remove('hidden');
        clue.classList.add('visible');
        cluesShown++;
    }
}

function revealPerson() {
    // Show all clues first
    for (let i = 1; i <= 3; i++) {
        showClue(i);
    }

    // Remove blur from image
    const image = document.getElementById('mysteryImage');
    if (image) {
        image.classList.remove('blurred');
    }

    // Hide overlay
    const overlay = document.getElementById('mysteryOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }

    // Play reveal sound if available
    playSound('reveal');

    // Show celebration
    showCelebration('It\'s Max Verstappen! 🏎️');
}

// ========================================
// VOCABULARY AUDIO FUNCTIONS
// ========================================

function playWord(word) {
    const audio = document.getElementById('audio-' + word);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log('Audio not available for:', word);
            // Visual feedback when audio not available
            showToast('Audio file not available. Add: media/audio/vocab/' + word + '.mp3');
        });
    } else {
        showToast('Audio file not available. Add: media/audio/vocab/' + word + '.mp3');
    }
}

// ========================================
// DRILL CHECK FUNCTIONS
// ========================================

function checkDrill(button, isCorrect) {
    const parent = button.closest('.drill-answers');
    const buttons = parent.querySelectorAll('.btn-answer');

    // Reset all buttons in this drill
    buttons.forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
    });

    // Mark the clicked button
    if (button.classList.contains('correct')) {
        button.classList.add('selected-correct');
        playSound('correct');
    } else {
        button.classList.add('selected-wrong');
        playSound('wrong');
        // Show the correct answer
        setTimeout(() => {
            parent.querySelector('.correct').classList.add('selected-correct');
        }, 500);
    }
}

// ========================================
// AUDIO PLAYER FUNCTIONS
// ========================================

function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.play().catch(e => {
            showToast('Audio file not found. Please add the audio file.');
        });
    }
}

function pauseAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.pause();
    }
}

function restartAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => {
            showToast('Audio file not found.');
        });
    }
}

function slowAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        // Toggle between normal and slow speed
        if (audio.playbackRate === 1) {
            audio.playbackRate = 0.75;
            showToast('Playback speed: 0.75x (Slow)');
        } else {
            audio.playbackRate = 1;
            showToast('Playback speed: 1x (Normal)');
        }
    }
}

// ========================================
// TRANSCRIPT TOGGLE
// ========================================

function toggleTranscript() {
    const transcript = document.getElementById('transcript');
    if (transcript) {
        transcript.classList.toggle('hidden');
    }
}

// ========================================
// TIMELINE ANSWER CHECKING
// ========================================

function checkTimelineAnswer(inputId) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById('feedback' + inputId.replace('answer', ''));

    if (!input) return;

    const userAnswer = input.value.toLowerCase().trim();
    const correctAnswer = input.dataset.answer.toLowerCase();

    // Check for partial matches
    const isCorrect = correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer) ||
                      levenshteinDistance(userAnswer, correctAnswer) <= 2;

    if (isCorrect && userAnswer.length > 0) {
        input.classList.remove('incorrect');
        input.classList.add('correct');
        input.value = correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1);
        if (feedback) {
            feedback.textContent = '✓';
            feedback.style.color = '#22c55e';
        }
        playSound('correct');
    } else {
        input.classList.remove('correct');
        input.classList.add('incorrect');
        if (feedback) {
            feedback.textContent = '✗';
            feedback.style.color = '#ef4444';
        }
        playSound('wrong');
    }
}

function revealAllAnswers() {
    const inputs = document.querySelectorAll('.timeline-input');
    inputs.forEach(input => {
        const correctAnswer = input.dataset.answer;
        input.value = correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1);
        input.classList.remove('incorrect');
        input.classList.add('correct');
    });

    const feedbacks = document.querySelectorAll('.answer-feedback');
    feedbacks.forEach(feedback => {
        feedback.textContent = '✓';
        feedback.style.color = '#22c55e';
    });
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
            }
        }
    }

    return dp[m][n];
}

// ========================================
// Q&A SHOW ANSWER
// ========================================

function showAnswer(answerId) {
    const answer = document.getElementById(answerId);
    if (answer) {
        answer.classList.toggle('hidden');
    }
}

// ========================================
// READING TASK FUNCTIONS
// ========================================

function selectOption(button, questionId, isCorrect) {
    const parent = button.closest('.answer-options');
    const buttons = parent.querySelectorAll('.btn-option');
    const structure = document.getElementById(questionId + '-structure');

    // Reset all buttons
    buttons.forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
    });

    // Mark the clicked button
    if (button.classList.contains('correct')) {
        button.classList.add('selected-correct');
        playSound('correct');
        // Show target structure
        if (structure) {
            structure.classList.remove('hidden');
        }
    } else {
        button.classList.add('selected-wrong');
        playSound('wrong');
        // Show correct answer after delay
        setTimeout(() => {
            parent.querySelector('.correct').classList.add('selected-correct');
            if (structure) {
                structure.classList.remove('hidden');
            }
        }, 500);
    }
}

// ========================================
// TRUE/FALSE FUNCTIONS
// ========================================

function checkTF(button, isCorrect) {
    const parent = button.closest('.tf-buttons');
    const buttons = parent.querySelectorAll('.btn-tf');
    const feedbackSpan = button.closest('.tf-item').querySelector('.tf-feedback');

    // Reset all buttons
    buttons.forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
    });

    // Mark the clicked button
    if (button.classList.contains('correct')) {
        button.classList.add('selected-correct');
        playSound('correct');
        if (feedbackSpan) {
            feedbackSpan.style.color = '#22c55e';
        }
    } else {
        button.classList.add('selected-wrong');
        playSound('wrong');
        // Show correct answer
        setTimeout(() => {
            parent.querySelector('.correct').classList.add('selected-correct');
        }, 500);
        if (feedbackSpan) {
            feedbackSpan.style.color = '#ef4444';
        }
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Toast notification
function showToast(message, duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        font-size: 1rem;
        animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Celebration effect
function showCelebration(message) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-overlay';
    celebration.innerHTML = `
        <div class="celebration-content">
            <div class="celebration-emoji">🎉</div>
            <h2>${message}</h2>
        </div>
    `;
    celebration.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    const content = celebration.querySelector('.celebration-content');
    content.style.cssText = `
        text-align: center;
        color: white;
    `;

    const emoji = celebration.querySelector('.celebration-emoji');
    emoji.style.cssText = `
        font-size: 8rem;
        animation: bounce 0.5s ease infinite;
    `;

    const h2 = celebration.querySelector('h2');
    h2.style.cssText = `
        font-size: 3rem;
        margin-top: 1rem;
    `;

    document.body.appendChild(celebration);

    // Click to dismiss
    celebration.addEventListener('click', () => {
        celebration.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => celebration.remove(), 300);
    });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        if (document.body.contains(celebration)) {
            celebration.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => celebration.remove(), 300);
        }
    }, 3000);
}

// Sound effects (placeholder - will play if files exist)
function playSound(type) {
    // Create audio context for simple sounds
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch(type) {
            case 'correct':
                oscillator.frequency.value = 880; // A5
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
                break;
            case 'wrong':
                oscillator.frequency.value = 220; // A3
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'reveal':
                oscillator.frequency.value = 523; // C5
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;
                oscillator.start();
                setTimeout(() => {
                    oscillator.frequency.value = 659; // E5
                }, 100);
                setTimeout(() => {
                    oscillator.frequency.value = 784; // G5
                }, 200);
                oscillator.stop(audioContext.currentTime + 0.4);
                break;
            case 'warning':
                oscillator.frequency.value = 440; // A4
                oscillator.type = 'square';
                gainNode.gain.value = 0.2;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
            case 'finish':
                oscillator.frequency.value = 880;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 1);
                break;
        }
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ========================================
// SMOOTH SCROLLING FOR NAVIGATION
// ========================================

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Highlight the section briefly
            targetSection.style.animation = 'highlight 1s ease';
            setTimeout(() => {
                targetSection.style.animation = '';
            }, 1000);
        }
    });
});

// ========================================
// VIDEO PLACEHOLDER HANDLING
// ========================================

// Check if video files exist and hide placeholders if they do
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        const placeholder = video.nextElementSibling;

        video.addEventListener('loadeddata', function() {
            if (placeholder && placeholder.classList.contains('video-placeholder')) {
                placeholder.style.display = 'none';
            }
        });

        video.addEventListener('error', function() {
            // Video failed to load, keep placeholder visible
            video.style.display = 'none';
        });
    });

    // Same for audio
    const audios = document.querySelectorAll('audio');

    audios.forEach(audio => {
        const placeholder = audio.nextElementSibling;

        audio.addEventListener('loadeddata', function() {
            if (placeholder && placeholder.classList.contains('audio-placeholder')) {
                placeholder.style.display = 'none';
            }
        });
    });
});

// ========================================
// KEYBOARD SHORTCUTS FOR TEACHER
// ========================================

document.addEventListener('keydown', function(e) {
    // Space to pause/play main timer
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('timerBtn').click();
    }

    // Number keys 1-5 for phase navigation
    if (e.key >= '1' && e.key <= '5' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'homework'];
        const phaseIndex = parseInt(e.key) - 1;
        const targetSection = document.getElementById(phases[phaseIndex]);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // R to reveal mystery person
    if (e.code === 'KeyR' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        revealPerson();
    }
});

// ========================================
// ADD ANIMATION KEYFRAMES
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translate(-50%, 100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }

    @keyframes slideDown {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, 100%); opacity: 0; }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }

    @keyframes highlight {
        0% { box-shadow: 0 0 0 0 rgba(6, 0, 239, 0.5); }
        50% { box-shadow: 0 0 0 20px rgba(6, 0, 239, 0); }
        100% { box-shadow: 0 0 0 0 rgba(6, 0, 239, 0); }
    }
`;
document.head.appendChild(style);

// ========================================
// FULLSCREEN MODE FOR SMARTBOARD
// ========================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => {
            console.log('Fullscreen not supported');
        });
    } else {
        document.exitFullscreen();
    }
}

// Double-click on header to toggle fullscreen
document.querySelector('.hero').addEventListener('dblclick', toggleFullscreen);

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏎️ Max Verstappen Biography Lesson - Ready!');
    console.log('Keyboard shortcuts:');
    console.log('  Space - Start/Pause timer');
    console.log('  1-5   - Jump to phases');
    console.log('  R     - Reveal mystery person');

    // Show welcome toast
    setTimeout(() => {
        showToast('Welcome! Press Space to start the timer.', 4000);
    }, 1000);
});
