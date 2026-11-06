/**************************************************************
 * SYNTH ENVELOPE — ANTI-POP ADSR & GAIN RAMPS
 **************************************************************/

export function applyGainEnvelope(gainNode, startTime, duration, peakGain, endGain = 0.001, rampType = 'linear') {
    gainNode.gain.setValueAtTime(peakGain, startTime);

    if (rampType === 'exponential') {
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, endGain), startTime + duration);
    } else {
        gainNode.gain.linearRampToValueAtTime(endGain, startTime + duration);
    }
}

export function applyHoldAndReleaseEnvelope(gainNode, startTime, duration, peakGain, releaseDuration = 0.06) {
    const releaseStart = Math.max(startTime, startTime + duration - releaseDuration);
    gainNode.gain.setValueAtTime(peakGain, startTime);
    gainNode.gain.setValueAtTime(peakGain, releaseStart);
    gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
}
