/**************************************************************
 * SYNTH NOISE — PROCEDURAL WHITE & PINK NOISE BUFFER GENERATOR
 **************************************************************/

import { ensureAudioContextReady } from '../core/audioContext.js';
import { getSfxOutputNode, isMuted } from '../core/audioBus.js';
import { applyGainEnvelope } from './envelope.js';

function createNoiseBuffer(context, duration, color = 'white') {
    const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const channelData = buffer.getChannelData(0);

    let b0 = 0;
    let b1 = 0;
    let b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (color === 'pink') {
            b0 = 0.99765 * b0 + white * 0.099046;
            b1 = 0.96300 * b1 + white * 0.2965164;
            b2 = 0.57000 * b2 + white * 1.0526913;
            channelData[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2;
        } else {
            channelData[i] = white;
        }
    }

    return buffer;
}

export function playNoiseBurst({ duration = 0.2, gainVolume = 0.04, color = 'white' } = {}) {
    if (isMuted()) return;

    try {
        const context = ensureAudioContextReady();
        const outputNode = getSfxOutputNode();
        if (!context || !outputNode) return;

        const startTime = context.currentTime;
        const source = context.createBufferSource();
        const gainNode = context.createGain();

        source.buffer = createNoiseBuffer(context, duration, color);
        source.connect(gainNode);
        gainNode.connect(outputNode);

        applyGainEnvelope(gainNode, startTime, duration, gainVolume, 0.001, 'exponential');

        source.start(startTime);
        source.stop(startTime + duration);
    } catch {
        // Ignore browser audio autoplay lock errors
    }
}
