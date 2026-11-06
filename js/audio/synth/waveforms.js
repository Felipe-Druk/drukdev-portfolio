/**************************************************************
 * SYNTH WAVEFORMS — CONFIGURABLE 8-BIT OSCILLATOR ENGINE
 **************************************************************/

import { ensureAudioContextReady } from '../core/audioContext.js';
import { getSfxOutputNode, isMuted } from '../core/audioBus.js';
import { applyGainEnvelope } from './envelope.js';

function scheduleFrequencyProfile(oscillator, preset, startTime) {
    oscillator.frequency.setValueAtTime(preset.startFrequency, startTime);

    if (Array.isArray(preset.steps)) {
        preset.steps.forEach((step) => {
            oscillator.frequency.setValueAtTime(step.frequency, startTime + step.timeOffset);
        });
        return;
    }

    if (preset.stepFrequency && preset.stepTimeOffset) {
        oscillator.frequency.setValueAtTime(preset.stepFrequency, startTime + preset.stepTimeOffset);
        return;
    }

    if (preset.endFrequency) {
        if (preset.rampType === 'linear') {
            oscillator.frequency.linearRampToValueAtTime(preset.endFrequency, startTime + preset.duration);
        } else {
            oscillator.frequency.exponentialRampToValueAtTime(preset.endFrequency, startTime + preset.duration);
        }
    }
}

function scheduleChordVoices(context, outputNode, preset, startTime) {
    if (!Array.isArray(preset.chordFrequencies)) return;

    const voiceGain = preset.gainVolume * 0.45;
    preset.chordFrequencies.forEach((chordFreq) => {
        const chordOscillator = context.createOscillator();
        const chordGainNode = context.createGain();

        chordOscillator.connect(chordGainNode);
        chordGainNode.connect(outputNode);

        chordOscillator.type = 'sine';
        chordOscillator.frequency.setValueAtTime(chordFreq, startTime);
        applyGainEnvelope(chordGainNode, startTime, preset.duration, voiceGain, 0.005, 'linear');

        chordOscillator.start(startTime);
        chordOscillator.stop(startTime + preset.duration);
    });
}

export function playTonePreset(preset) {
    if (!preset || isMuted()) return;

    try {
        const context = ensureAudioContextReady();
        const outputNode = getSfxOutputNode();
        if (!context || !outputNode) return;

        const startTime = context.currentTime;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(outputNode);

        oscillator.type = preset.waveType || 'square';
        scheduleFrequencyProfile(oscillator, preset, startTime);
        applyGainEnvelope(
            gainNode,
            startTime,
            preset.duration,
            preset.gainVolume,
            0.01,
            preset.gainRampType || 'linear'
        );

        oscillator.start(startTime);
        oscillator.stop(startTime + preset.duration);

        scheduleChordVoices(context, outputNode, preset, startTime);
    } catch {
        // Ignore browser audio autoplay lock errors
    }
}
