/**************************************************************
 * UI & TERMINAL SFX PRESETS (click, terminal, coin, stars)
 **************************************************************/

export const UI_SFX_PRESETS = {
    click: {
        waveType: 'square',
        startFrequency: 660,
        gainVolume: 0.05,
        duration: 0.05
    },
    terminal: {
        waveType: 'square',
        startFrequency: 440,
        stepFrequency: 880,
        stepTimeOffset: 0.05,
        gainVolume: 0.06,
        duration: 0.14
    },
    coin: {
        waveType: 'square',
        startFrequency: 587.33,
        stepFrequency: 880,
        stepTimeOffset: 0.06,
        gainVolume: 0.08,
        duration: 0.18
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
    }
};
