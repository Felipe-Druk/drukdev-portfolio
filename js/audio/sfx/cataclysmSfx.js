/**************************************************************
 * CATACLYSM PROTOCOL SFX — BITONAL ALARM, CRT COLLAPSE & BIOS
 **************************************************************/

import { ensureAudioContextReady } from '../core/audioContext.js';
import { getSfxOutputNode, isMuted } from '../core/audioBus.js';
import { applyGainEnvelope, applyHoldAndReleaseEnvelope } from '../synth/envelope.js';
import { playNoiseBurst } from '../synth/noise.js';

const ALARM_HIGH_FREQ_HZ = 880;
const ALARM_LOW_FREQ_HZ = 440;
const ALARM_DURATION_SEC = 1.3;
const ALARM_STEP_COUNT = 6;

const CRT_START_FREQ_HZ = 1200;
const CRT_END_FREQ_HZ = 30;
const CRT_DISCHARGE_DURATION_SEC = 0.65;

const BIOS_BEEP_FREQ_HZ = 1046.5;
const BIOS_BEEP_DURATION_SEC = 0.14;

export function playCataclysmAlarm() {
    if (isMuted()) return;

    try {
        const context = ensureAudioContextReady();
        const outputNode = getSfxOutputNode();
        if (!context || !outputNode) return;

        const startTime = context.currentTime;
        const stepDuration = ALARM_DURATION_SEC / ALARM_STEP_COUNT;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'square';
        for (let stepIndex = 0; stepIndex < ALARM_STEP_COUNT; stepIndex++) {
            const frequency = stepIndex % 2 === 0 ? ALARM_HIGH_FREQ_HZ : ALARM_LOW_FREQ_HZ;
            oscillator.frequency.setValueAtTime(frequency, startTime + stepIndex * stepDuration);
        }

        applyHoldAndReleaseEnvelope(gainNode, startTime, ALARM_DURATION_SEC, 0.09, 0.08);

        oscillator.connect(gainNode);
        gainNode.connect(outputNode);

        oscillator.start(startTime);
        oscillator.stop(startTime + ALARM_DURATION_SEC);
    } catch {
        // Ignore browser autoplay restrictions
    }
}

export function playCrtPowerOff() {
    if (isMuted()) return;

    try {
        const context = ensureAudioContextReady();
        const outputNode = getSfxOutputNode();
        if (!context || !outputNode) return;

        const startTime = context.currentTime;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(CRT_START_FREQ_HZ, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            CRT_END_FREQ_HZ,
            startTime + CRT_DISCHARGE_DURATION_SEC
        );

        applyGainEnvelope(gainNode, startTime, CRT_DISCHARGE_DURATION_SEC, 0.11, 0.001, 'exponential');

        oscillator.connect(gainNode);
        gainNode.connect(outputNode);

        oscillator.start(startTime);
        oscillator.stop(startTime + CRT_DISCHARGE_DURATION_SEC);

        playNoiseBurst({ duration: 0.18, gainVolume: 0.035, color: 'pink' });
    } catch {
        // Ignore browser autoplay restrictions
    }
}

export function playBiosBeep() {
    if (isMuted()) return;

    try {
        const context = ensureAudioContextReady();
        const outputNode = getSfxOutputNode();
        if (!context || !outputNode) return;

        const startTime = context.currentTime;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(BIOS_BEEP_FREQ_HZ, startTime);
        applyGainEnvelope(gainNode, startTime, BIOS_BEEP_DURATION_SEC, 0.07, 0.001, 'exponential');

        oscillator.connect(gainNode);
        gainNode.connect(outputNode);

        oscillator.start(startTime);
        oscillator.stop(startTime + BIOS_BEEP_DURATION_SEC);
    } catch {
        // Ignore browser autoplay restrictions
    }
}

export const CATACLYSM_SFX_HANDLERS = {
    cataclysmAlarm: playCataclysmAlarm,
    crtPowerOff: playCrtPowerOff,
    biosBeep: playBiosBeep
};
