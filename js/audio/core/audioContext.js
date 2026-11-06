/**************************************************************
 * WEB AUDIO CORE — SINGLETON CONTEXT & DEFERRED GESTURE UNLOCK
 **************************************************************/

let audioContextInstance = null;
let gestureListenersAttached = false;
const onContextCreatedCallbacks = [];

export function onAudioContextCreated(callback) {
    if (typeof callback === 'function') {
        onContextCreatedCallbacks.push(callback);
        if (audioContextInstance) {
            callback(audioContextInstance);
        }
    }
}

export function getAudioContext() {
    if (!audioContextInstance && typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioContextInstance = new AudioContextClass();
            onContextCreatedCallbacks.forEach((cb) => cb(audioContextInstance));
        }
    }
    return audioContextInstance;
}

export function ensureAudioContextReady() {
    const context = getAudioContext();
    if (context && context.state === 'suspended') {
        context.resume().catch(() => {});
    }
    return context;
}

export function bindUserGestureUnlock() {
    if (gestureListenersAttached || typeof window === 'undefined') return;
    gestureListenersAttached = true;

    const unlockOnGesture = () => {
        const context = ensureAudioContextReady();
        if (context && context.state === 'running') {
            window.removeEventListener('pointerdown', unlockOnGesture);
            window.removeEventListener('keydown', unlockOnGesture);
        }
    };

    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('keydown', unlockOnGesture, { passive: true });
}
