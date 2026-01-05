// ===== MUSIC PLAYER =====
const musicPlayerOverlay = document.getElementById('music-player-overlay');
const closePlayerBtn = document.getElementById('close-player');
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const progressBar = document.getElementById('progress-bar');
const volumeSlider = document.getElementById('volume-slider');
const timeCurrent = document.querySelector('.time-current');
const timeTotal = document.querySelector('.time-total');
const albumArt = document.querySelector('.album-art');

// Open music player
function openMusicPlayer() {
    musicPlayerOverlay.classList.remove('hidden');
    audioPlayer.volume = volumeSlider.value / 100;
    audioPlayer.play();
    updatePlayPauseIcon();
}

// Close music player
if (closePlayerBtn) {
    closePlayerBtn.addEventListener('click', () => {
        musicPlayerOverlay.classList.add('hidden');
        audioPlayer.pause();
    });
}

// Play/Pause toggle
if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
        updatePlayPauseIcon();
    });
}

// Stop button
if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        updatePlayPauseIcon();
    });
}

// Update play/pause icon
function updatePlayPauseIcon() {
    const icon = playPauseBtn.querySelector('i');
    if (audioPlayer.paused) {
        icon.className = 'fas fa-play';
        albumArt.classList.add('paused');
    } else {
        icon.className = 'fas fa-pause';
        albumArt.classList.remove('paused');
    }
}

// Update progress bar
if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress || 0;

        // Update time displays
        timeCurrent.textContent = formatTime(audioPlayer.currentTime);
        timeTotal.textContent = formatTime(audioPlayer.duration);
    });

    // Seek functionality
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Volume control
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value / 100;
    });
}

// Format time helper
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Add to existing terminal logic - APPEND TO END OF SCRIPT.JS
