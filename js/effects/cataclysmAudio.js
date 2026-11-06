/**************************************************************
 * CATACLYSM PROTOCOL — REAL-TIME WEB AUDIO SYNTHESIZER
 **************************************************************/

const ALARM_HIGH_FREQ_HZ = 880;
const ALARM_LOW_FREQ_HZ = 440;
const ALARM_DURATION_SEC = 1.3;
const ALARM_STEP_COUNT = 6;

const CRT_START_FREQ_HZ = 1200;
const CRT_END_FREQ_HZ = 30;
const CRT_DISCHARGE_DURATION_SEC = 0.65;

const BIOS_BEEP_FREQ_HZ = 1046.5;
const BIOS_BEEP_DURATION_SEC = 0.14;

let cataclysmAudioContext = null;
let unlockListenersBound = false;

function getOrCreateAudioContext() {
    if (!cataclysmAudioContext) {
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (AudioContextConstructor) {
            cataclysmAudioContext = new AudioContextConstructor();
        }
    }
    if (cataclysmAudioContext && cataclysmAudioContext.state === 'suspended') {
        cataclysmAudioContext.resume().catch(() => {});
    }
    return cataclysmAudioContext;
}

function bindAudioUnlockListeners() {
    if (unlockListenersBound || typeof window === 'undefined') return;
    unlockListenersBound = true;

    const unlockHandler = () => {
        const context = getOrCreateAudioContext();
        if (context && context.state === 'running') {
            window.removeEventListener('pointerdown', unlockHandler);
            window.removeEventListener('keydown', unlockHandler);
        }
    };

    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
}

bindAudioUnlockListeners();

export function playCataclysmAlarm() {
    try {
        const context = getOrCreateAudioContext();
        if (!context) return;

        const startTime = context.currentTime;
        const stepDuration = ALARM_DURATION_SEC / ALARM_STEP_COUNT;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'square';

        for (let stepIndex = 0; stepIndex < ALARM_STEP_COUNT; stepIndex++) {
            const frequency = stepIndex % 2 === 0 ? ALARM_HIGH_FREQ_HZ : ALARM_LOW_FREQ_HZ;
            oscillator.frequency.setValueAtTime(frequency, startTime + stepIndex * stepDuration);
        }

        gainNode.gain.setValueAtTime(0.09, startTime);
        gainNode.gain.setValueAtTime(0.09, startTime + ALARM_DURATION_SEC - 0.08);
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + ALARM_DURATION_SEC);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + ALARM_DURATION_SEC);
    } catch {
        // Ignore browser autoplay restrictions
    }
}

export function playCrtPowerOff() {
    try {
        const context = getOrCreateAudioContext();
        if (!context) return;

        const startTime = context.currentTime;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(CRT_START_FREQ_HZ, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            CRT_END_FREQ_HZ,
            startTime + CRT_DISCHARGE_DURATION_SEC
        );

        gainNode.gain.setValueAtTime(0.11, startTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + CRT_DISCHARGE_DURATION_SEC
        );

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + CRT_DISCHARGE_DURATION_SEC);
    } catch {
        // Ignore browser autoplay restrictions
    }
}

export function playBiosBeep() {
    try {
        const context = getOrCreateAudioContext();
        if (!context) return;

        const startTime = context.currentTime;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(BIOS_BEEP_FREQ_HZ, startTime);

        gainNode.gain.setValueAtTime(0.07, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + BIOS_BEEP_DURATION_SEC);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + BIOS_BEEP_DURATION_SEC);
    } catch {
        // Ignore browser autoplay restrictions
    }
}
