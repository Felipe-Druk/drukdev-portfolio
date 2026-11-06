/**************************************************************
 * UNIFIED WEB AUDIO SUBSYSTEM FACADE (js/audio/index.js)
 **************************************************************/

import { ensureAudioContextReady, bindUserGestureUnlock } from './core/audioContext.js';
import { isMuted, setMuted, toggleMute } from './core/audioBus.js';
import { playTonePreset } from './synth/waveforms.js';
import { UI_SFX_PRESETS } from './sfx/uiSfx.js';
import { SANCTUARY_SFX_PRESETS } from './sfx/sanctuarySfx.js';
import { ARCADE_SFX_PRESETS } from './sfx/arcadeSfx.js';
import {
    CATACLYSM_SFX_HANDLERS,
    playCataclysmAlarm,
    playCrtPowerOff,
    playBiosBeep
} from './sfx/cataclysmSfx.js';

bindUserGestureUnlock();

const SOUND_PRESET_REGISTRY = {
    ...UI_SFX_PRESETS,
    ...SANCTUARY_SFX_PRESETS,
    ...ARCADE_SFX_PRESETS
};

export function initAudio() {
    ensureAudioContextReady();
}

export function playSound(soundId) {
    const customHandler = CATACLYSM_SFX_HANDLERS[soundId];
    if (typeof customHandler === 'function') {
        customHandler();
        return;
    }

    const preset = SOUND_PRESET_REGISTRY[soundId];
    if (preset) {
        playTonePreset(preset);
    }
}

export function isSoundEnabled() {
    return !isMuted();
}

export function toggleSound() {
    const nowMuted = toggleMute();
    if (!nowMuted) {
        playSound('coin');
    }
    return !nowMuted;
}

export function floraSpell() {
    playSound('floraSpell');
}

export function windSpell() {
    playSound('windSpell');
}

export function celestialShift() {
    playSound('celestialShift');
}

export {
    isMuted,
    setMuted,
    toggleMute,
    playCataclysmAlarm,
    playCrtPowerOff,
    playBiosBeep
};

export const audio = {
    init: initAudio,
    play: playSound,
    toggleMute: () => {
        const nowMuted = toggleMute();
        if (!nowMuted) {
            playSound('coin');
        }
        return nowMuted;
    },
    setMuted,
    isMuted
};

export const SoundEngine = {
    initAudio,
    playSound,
    floraSpell,
    windSpell,
    celestialShift,
    toggleSound,
    isSoundEnabled
};
