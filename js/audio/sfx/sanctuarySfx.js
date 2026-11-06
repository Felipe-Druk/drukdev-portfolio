/**************************************************************
 * SANCTUARY & ELEMENTAL SPELL SFX PRESETS
 **************************************************************/

export const SANCTUARY_SFX_PRESETS = {
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
        chordFrequencies: [261.63, 392.0, 493.88],
        steps: [
            { frequency: 392.0, timeOffset: 0.07 },
            { frequency: 493.88, timeOffset: 0.14 },
            { frequency: 659.25, timeOffset: 0.22 },
            { frequency: 783.99, timeOffset: 0.3 }
        ],
        gainVolume: 0.07,
        duration: 0.42
    },
    windSpell: {
        waveType: 'sine',
        startFrequency: 280,
        endFrequency: 920,
        rampType: 'exponential',
        chordFrequencies: [440, 587.33, 880],
        gainVolume: 0.08,
        duration: 0.28
    }
};
