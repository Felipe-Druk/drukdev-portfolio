/**************************************************************
 * ARCADE CARTRIDGE SFX PRESETS (jump, flap, attack, hit, gameover)
 **************************************************************/

export const ARCADE_SFX_PRESETS = {
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
    }
};
