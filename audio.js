// Audio Manager
class AudioManager {
    constructor() {
        this.audioElements = {};
        this.currentAudio = null;
        this.isEnabled = false;
        this.volume = 0.5;
        this.loadSettings();
        this.initAudioElements();
    }

    initAudioElements() {
        this.audioElements = {
            lofi: new Audio('assets/audio/lofi.mp3'),
            rain: new Audio('assets/audio/rain.mp3'),
            forest: new Audio('assets/audio/forest.mp3')
        };

        // Set common audio properties
        Object.values(this.audioElements).forEach(audio => {
            audio.loop = true;
            audio.volume = this.volume;
        });
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('studySphereSettings')) || {};
        this.isEnabled = settings.soundEnabled || false;
        this.volume = settings.volumeLevel !== undefined ? settings.volumeLevel / 100 : 0.5;
    }

    play(soundType) {
        if (!this.isEnabled) return;

        this.stop(); // Stop any currently playing audio

        if (soundType === 'none' || !this.audioElements[soundType]) {
            return;
        }

        this.currentAudio = this.audioElements[soundType];
        this.currentAudio.volume = this.volume;
        this.currentAudio.play().catch(e => console.error('Audio play failed:', e));
    }

    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    }

    toggleEnabled() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled) {
            this.stop();
        }
        return this.isEnabled;
    }
}

// Initialize audio manager
const audioManager = new AudioManager();