/**************************************************************
 * RETRO 8-BIT WEB AUDIO SYNTHESIZER (NO EXTERNAL MP3s)
 **************************************************************/

let audioContext = null;
let soundEnabled = true;

const SOUND_PRESETS = {
    jump: {
        waveType: 'square',
        startFrequency: 180,
        endFrequency: 520,
        rampType: 'exponential',
        gainVolume: 0.08,
        duration: 0.14
    },
    flap: {
        waveType: 'triangle',
        startFrequency: 240,
        endFrequency: 460,
        rampType: 'exponential',
        gainVolume: 0.08,
        duration: 0.09
    },
    attack: {
        waveType: 'sawtooth',
        startFrequency: 480,
        endFrequency: 110,
        rampType: 'exponential',
        gainVolume: 0.09,
        duration: 0.12
    },
    coin: {
        waveType: 'square',
        startFrequency: 587.33,
        stepFrequency: 880,
        stepTimeOffset: 0.06,
        gainVolume: 0.08,
        duration: 0.18
    },
    hit: {
        waveType: 'triangle',
        startFrequency: 260,
        endFrequency: 70,
        rampType: 'exponential',
        gainVolume: 0.11,
        duration: 0.15
    },
    gameover: {
        waveType: 'sawtooth',
        startFrequency: 300,
        endFrequency: 120,
        rampType: 'linear',
        gainVolume: 0.1,
        duration: 0.35
    },
    click: {
        waveType: 'square',
        startFrequency: 660,
        gainVolume: 0.05,
        duration: 0.05
    },
    tree: {
        waveType: 'triangle',
        startFrequency: 420,
        endFrequency: 680,
        rampType: 'exponential',
        gainVolume: 0.07,
        duration: 0.22
    },
    water: {
        waveType: 'sine',
        startFrequency: 520,
        endFrequency: 980,
        rampType: 'exponential',
        gainVolume: 0.1,
        duration: 0.16
    },
    seal: {
        waveType: 'sawtooth',
        startFrequency: 140,
        endFrequency: 58,
        rampType: 'linear',
        gainVolume: 0.11,
        duration: 0.28
    },
    terminal: {
        waveType: 'square',
        startFrequency: 440,
        stepFrequency: 880,
        stepTimeOffset: 0.05,
        gainVolume: 0.06,
        duration: 0.14
    },
    starHover: {
        waveType: 'triangle',
        startFrequency: 783.99,
        steps: [
            { frequency: 1174.66, timeOffset: 0.03 },
            { frequency: 1567.98, timeOffset: 0.06 }
        ],
        gainVolume: 0.05,
        duration: 0.11
    },
    constellation: {
        waveType: 'triangle',
        startFrequency: 587.33,
        steps: [
            { frequency: 880, timeOffset: 0.045 },
            { frequency: 1174.66, timeOffset: 0.09 },
            { frequency: 1760, timeOffset: 0.14 }
        ],
        gainVolume: 0.08,
        duration: 0.24
    },
    floraSpell: {
        waveType: 'triangle',
        startFrequency: 523.25,
        steps: [
            { frequency: 659.25, timeOffset: 0.04 },
            { frequency: 783.99, timeOffset: 0.08 },
            { frequency: 1046.5, timeOffset: 0.13 },
            { frequency: 1318.51, timeOffset: 0.18 }
        ],
        gainVolume: 0.08,
        duration: 0.26
    },
    celestialShift: {
        waveType: 'triangle',
        startFrequency: 329.63,
        chordFrequencies: [261.63, 392.00, 493.88],
        steps: [
            { frequency: 392.00, timeOffset: 0.07 },
            { frequency: 493.88, timeOffset: 0.14 },
            { frequency: 659.25, timeOffset: 0.22 },
            { frequency: 783.99, timeOffset: 0.30 }
        ],
        gainVolume: 0.07,
        duration: 0.42
    }
};

export function initAudio() {
    if (!audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioContext = new AudioContextClass();
        }
    }
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

export function isSoundEnabled() {
    return soundEnabled;
}

function synthesizeTone(preset) {
    const currentTime = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = preset.waveType;
    oscillator.frequency.setValueAtTime(preset.startFrequency, currentTime);

    if (Array.isArray(preset.steps)) {
        preset.steps.forEach((step) => {
            oscillator.frequency.setValueAtTime(step.frequency, currentTime + step.timeOffset);
        });
    } else if (preset.stepFrequency && preset.stepTimeOffset) {
        oscillator.frequency.setValueAtTime(preset.stepFrequency, currentTime + preset.stepTimeOffset);
    } else if (preset.endFrequency) {
        if (preset.rampType === 'linear') {
            oscillator.frequency.linearRampToValueAtTime(preset.endFrequency, currentTime + preset.duration);
        } else {
            oscillator.frequency.exponentialRampToValueAtTime(preset.endFrequency, currentTime + preset.duration);
        }
    }

    gainNode.gain.setValueAtTime(preset.gainVolume, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, currentTime + preset.duration);

    oscillator.start(currentTime);
    oscillator.stop(currentTime + preset.duration);

    if (Array.isArray(preset.chordFrequencies)) {
        const voiceGain = preset.gainVolume * 0.45;
        preset.chordFrequencies.forEach((chordFreq) => {
            const chordOscillator = audioContext.createOscillator();
            const chordGainNode = audioContext.createGain();
            chordOscillator.connect(chordGainNode);
            chordGainNode.connect(audioContext.destination);

            chordOscillator.type = 'sine';
            chordOscillator.frequency.setValueAtTime(chordFreq, currentTime);
            chordGainNode.gain.setValueAtTime(voiceGain, currentTime);
            chordGainNode.gain.linearRampToValueAtTime(0.005, currentTime + preset.duration);

            chordOscillator.start(currentTime);
            chordOscillator.stop(currentTime + preset.duration);
        });
    }
}

export function playSound(soundType) {
    const preset = SOUND_PRESETS[soundType];
    if (!soundEnabled || !preset) return;

    try {
        initAudio();
        if (!audioContext) return;
        synthesizeTone(preset);
    } catch {
        // Ignore browser audio context autoplay lock errors
    }
}

export function floraSpell() {
    playSound('floraSpell');
}

export function celestialShift() {
    playSound('celestialShift');
}

export function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        playSound('coin');
    }
    return soundEnabled;
}

export const SoundEngine = {
    initAudio,
    playSound,
    floraSpell,
    celestialShift,
    toggleSound,
    isSoundEnabled
};
