/**************************************************************
 * WEB AUDIO BUS — MASTER/SFX GAIN GRAPH & PERSISTENT MUTE
 **************************************************************/

import { loadItem, saveItem } from '../../utils/safeStorage.js';
import { getAudioContext, ensureAudioContextReady, onAudioContextCreated } from './audioContext.js';

export const SFX_MUTED_STORAGE_KEY = 'druk_sfx_muted';

let mutedState = loadItem(SFX_MUTED_STORAGE_KEY, 'false') === 'true';
let masterGainNode = null;
let sfxGainNode = null;

function buildGainGraph(context) {
    if (!context || masterGainNode) return;

    masterGainNode = context.createGain();
    sfxGainNode = context.createGain();

    masterGainNode.gain.setValueAtTime(mutedState ? 0 : 1, context.currentTime);
    sfxGainNode.gain.setValueAtTime(1, context.currentTime);

    sfxGainNode.connect(masterGainNode);
    masterGainNode.connect(context.destination);
}

onAudioContextCreated((context) => {
    buildGainGraph(context);
});

export function getSfxOutputNode() {
    const context = ensureAudioContextReady();
    if (!context) return null;
    if (!sfxGainNode) {
        buildGainGraph(context);
    }
    return sfxGainNode;
}

export function isMuted() {
    return mutedState;
}

export function setMuted(shouldMute) {
    mutedState = Boolean(shouldMute);
    saveItem(SFX_MUTED_STORAGE_KEY, String(mutedState));

    const context = getAudioContext();
    if (context && masterGainNode) {
        masterGainNode.gain.cancelScheduledValues(context.currentTime);
        masterGainNode.gain.setValueAtTime(mutedState ? 0 : 1, context.currentTime);
    }

    return mutedState;
}

export function toggleMute() {
    ensureAudioContextReady();
    return setMuted(!mutedState);
}
