/**************************************************************
 * CATACLYSM PROTOCOL — FULLSCREEN GLITCH, MATRIX & BIOS REBOOT
 * (js/graphics/cataclysmEffect.js)
 **************************************************************/

import {
    playCataclysmAlarm,
    playCrtPowerOff,
    playBiosBeep
} from '../audio/index.js';

const MATRIX_START_MS = 1800;
const CRT_COLLAPSE_START_MS = 4800;
const BIOS_BOOT_TEXT_START_MS = 6200;
const BIOS_OPEN_LINE_START_MS = 8500;
const CURTAIN_FADE_START_MS = 9800;
const CATACLYSM_COMPLETE_MS = 11300;
const CURTAIN_FADE_DURATION_SEC = 1.5;

const TYPEWRITER_CHAR_INTERVAL_MS = 75;
const BOOT_LOADING_TEXT = 'LOADING sanctuary.....';
const BOOT_OPEN_TEXT = 'OPEN....';

const MATRIX_OVERLAY_ID = 'matrix-overlay';
const CRT_BLACKOUT_OVERLAY_ID = 'crt-blackout-overlay';
const BIOS_BOOT_CONTAINER_ID = 'cataclysm-boot-log';
const SYSTEM_GLITCH_CLASS = 'system-glitch';

const MATRIX_FONT_SIZE = 16;
const MATRIX_RUNE_GLYPHS = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ0123456789ABCDEF<>/{}[]*$#@!';
const MATRIX_CORRUPTION_FRAGMENTS = ['druk.ar', 'drukernel', 'segfault'];

let cataclysmInProgress = false;
let activeMatrixFrameId = null;
let activeResizeListener = null;
let activeTypewriterIntervalId = null;
let activeTimeouts = [];

export function isCataclysmRunning() {
    return cataclysmInProgress;
}

function scheduleCataclysmStep(callback, delayMs) {
    const timeoutId = window.setTimeout(callback, delayMs);
    activeTimeouts.push(timeoutId);
    return timeoutId;
}

function clearScheduledTimers() {
    activeTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    activeTimeouts = [];

    if (activeTypewriterIntervalId !== null) {
        window.clearInterval(activeTypewriterIntervalId);
        activeTypewriterIntervalId = null;
    }
}

function removeDomElementById(elementId) {
    const existingElement = document.getElementById(elementId);
    if (existingElement) {
        existingElement.remove();
    }
}

function stopMatrixLoopAndListeners() {
    if (activeMatrixFrameId !== null) {
        window.cancelAnimationFrame(activeMatrixFrameId);
        activeMatrixFrameId = null;
    }
    if (activeResizeListener !== null) {
        window.removeEventListener('resize', activeResizeListener);
        activeResizeListener = null;
    }
}

export function cleanupCataclysmElements() {
    clearScheduledTimers();
    stopMatrixLoopAndListeners();
    document.body.classList.remove(SYSTEM_GLITCH_CLASS, 'cataclysm-rumble');
    removeDomElementById(MATRIX_OVERLAY_ID);
    removeDomElementById(BIOS_BOOT_CONTAINER_ID);
    removeDomElementById(CRT_BLACKOUT_OVERLAY_ID);
    cataclysmInProgress = false;
}

function createMatrixOverlayCanvas() {
    removeDomElementById(MATRIX_OVERLAY_ID);

    const canvasElement = document.createElement('canvas');
    canvasElement.id = MATRIX_OVERLAY_ID;
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    canvasElement.style.cssText =
        'position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 99998; pointer-events: none;';

    document.body.appendChild(canvasElement);
    return canvasElement;
}

function createColumnStreamState(columnCount) {
    return Array.from({ length: columnCount }, (_, columnIndex) => ({
        rowPosition: Math.floor(Math.random() * -18),
        speed: 0.55 + Math.random() * 0.65,
        activeFragment: columnIndex % 4 === 0
            ? MATRIX_CORRUPTION_FRAGMENTS[columnIndex % MATRIX_CORRUPTION_FRAGMENTS.length]
            : null,
        fragmentCharIndex: 0
    }));
}

function pickNextMatrixCharacter(columnState) {
    if (columnState.activeFragment) {
        const character = columnState.activeFragment[columnState.fragmentCharIndex];
        columnState.fragmentCharIndex = (columnState.fragmentCharIndex + 1) % columnState.activeFragment.length;
        if (columnState.fragmentCharIndex === 0 && Math.random() < 0.45) {
            columnState.activeFragment = null;
        }
        return character;
    }

    if (Math.random() < 0.14) {
        const randomFragmentIndex = Math.floor(Math.random() * MATRIX_CORRUPTION_FRAGMENTS.length);
        columnState.activeFragment = MATRIX_CORRUPTION_FRAGMENTS[randomFragmentIndex];
        columnState.fragmentCharIndex = 0;
    }

    const randomGlyphIndex = Math.floor(Math.random() * MATRIX_RUNE_GLYPHS.length);
    return MATRIX_RUNE_GLYPHS[randomGlyphIndex];
}

function startMatrixRainCascade(canvasElement) {
    const context = canvasElement.getContext('2d');
    if (!context) return;

    let columnCount = Math.ceil(canvasElement.width / MATRIX_FONT_SIZE);
    let columnStreams = createColumnStreamState(columnCount);

    activeResizeListener = () => {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        columnCount = Math.ceil(canvasElement.width / MATRIX_FONT_SIZE);
        columnStreams = createColumnStreamState(columnCount);
    };
    window.addEventListener('resize', activeResizeListener);

    const renderMatrixFrame = () => {
        context.fillStyle = 'rgba(3, 8, 3, 0.14)';
        context.fillRect(0, 0, canvasElement.width, canvasElement.height);
        context.font = `bold ${MATRIX_FONT_SIZE}px "IBM Plex Mono", monospace`;

        for (let i = 0; i < columnStreams.length; i++) {
            const stream = columnStreams[i];
            const xCoordinate = i * MATRIX_FONT_SIZE;
            const yCoordinate = Math.floor(stream.rowPosition) * MATRIX_FONT_SIZE;

            if (yCoordinate >= 0) {
                const glyph = pickNextMatrixCharacter(stream);
                const isFragmentToken = Boolean(stream.activeFragment);

                context.fillStyle = isFragmentToken ? '#D8FFE2' : '#00FF41';
                context.fillText(glyph, xCoordinate, yCoordinate);

                if (yCoordinate > MATRIX_FONT_SIZE) {
                    const trailGlyph = MATRIX_RUNE_GLYPHS[Math.floor(Math.random() * MATRIX_RUNE_GLYPHS.length)];
                    context.fillStyle = '#008F11';
                    context.fillText(trailGlyph, xCoordinate, yCoordinate - MATRIX_FONT_SIZE);
                }
            }

            if (Math.random() < 0.015 && yCoordinate > MATRIX_FONT_SIZE * 3) {
                const token = MATRIX_CORRUPTION_FRAGMENTS[i % MATRIX_CORRUPTION_FRAGMENTS.length];
                context.fillStyle = '#00FF41';
                context.fillText(token, xCoordinate, yCoordinate);
            }

            stream.rowPosition += stream.speed;

            if (yCoordinate > canvasElement.height && Math.random() > 0.96) {
                stream.rowPosition = Math.floor(Math.random() * -10);
            }
        }

        activeMatrixFrameId = window.requestAnimationFrame(renderMatrixFrame);
    };

    activeMatrixFrameId = window.requestAnimationFrame(renderMatrixFrame);
}

function createCrtBlackoutOverlay() {
    removeDomElementById(CRT_BLACKOUT_OVERLAY_ID);

    const blackoutOverlay = document.createElement('div');
    blackoutOverlay.id = CRT_BLACKOUT_OVERLAY_ID;
    blackoutOverlay.className = 'crt-blackout-overlay';
    blackoutOverlay.style.cssText =
        'position: fixed; inset: 0; z-index: 99999; background-color: #000000; opacity: 1; pointer-events: none;';

    const powerOffBeam = document.createElement('div');
    powerOffBeam.className = 'crt-power-off-beam';
    blackoutOverlay.appendChild(powerOffBeam);

    document.body.appendChild(blackoutOverlay);
    return blackoutOverlay;
}

function createBiosBootTypographyContainer(parentOverlay) {
    removeDomElementById(BIOS_BOOT_CONTAINER_ID);

    const bootContainer = document.createElement('div');
    bootContainer.id = BIOS_BOOT_CONTAINER_ID;
    bootContainer.style.cssText =
        'position: fixed; bottom: 24px; left: 24px; color: #00ff66; font-family: monospace; font-size: 15px; line-height: 1.6; white-space: pre; text-shadow: 2px 2px 0px #000000; z-index: 100000; pointer-events: none;';

    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cataclysm-boot-cursor';
    cursorSpan.textContent = '█';

    bootContainer.appendChild(textSpan);
    bootContainer.appendChild(cursorSpan);

    (parentOverlay || document.body).appendChild(bootContainer);
    return textSpan;
}

function startLoadingTypewriterEffect(textSpan) {
    let charIndex = 0;

    activeTypewriterIntervalId = window.setInterval(() => {
        if (charIndex < BOOT_LOADING_TEXT.length) {
            charIndex++;
            textSpan.textContent = BOOT_LOADING_TEXT.slice(0, charIndex);
        } else {
            window.clearInterval(activeTypewriterIntervalId);
            activeTypewriterIntervalId = null;
        }
    }, TYPEWRITER_CHAR_INTERVAL_MS);
}

function normalizeCataclysmCallbacks(optionsOrCallback) {
    if (typeof optionsOrCallback === 'function') {
        return {
            onMuteAudio: null,
            onRevealSanctuary: null,
            onComplete: optionsOrCallback
        };
    }

    const options = optionsOrCallback || {};
    return {
        onMuteAudio: typeof options.onMuteAudio === 'function' ? options.onMuteAudio : null,
        onRevealSanctuary: typeof options.onRevealSanctuary === 'function' ? options.onRevealSanctuary : null,
        onComplete: typeof options.onComplete === 'function' ? options.onComplete : null
    };
}

export function triggerSystemCataclysm(optionsOrCallback = {}) {
    if (cataclysmInProgress) return;
    cleanupCataclysmElements();
    cataclysmInProgress = true;

    const { onMuteAudio, onRevealSanctuary, onComplete } = normalizeCataclysmCallbacks(optionsOrCallback);
    let blackoutOverlay = null;
    let bootTextSpan = null;

    // 1. T = 0.0s: Alarm + system glitch on body
    playCataclysmAlarm();
    document.body.classList.add(SYSTEM_GLITCH_CLASS);

    // 2. T = 1.8s: Mount fullscreen Matrix code rain for 3.0s
    scheduleCataclysmStep(() => {
        document.body.classList.remove(SYSTEM_GLITCH_CLASS);
        const matrixCanvas = createMatrixOverlayCanvas();
        startMatrixRainCascade(matrixCanvas);
    }, MATRIX_START_MS);

    // 3. T = 4.8s: CRT power-off sound + collapse animation + total black curtain
    scheduleCataclysmStep(() => {
        stopMatrixLoopAndListeners();
        removeDomElementById(MATRIX_OVERLAY_ID);

        if (onMuteAudio) {
            onMuteAudio();
        }
        playCrtPowerOff();
        blackoutOverlay = createCrtBlackoutOverlay();
    }, CRT_COLLAPSE_START_MS);

    // 4. T = 6.2s: Bottom-left BIOS typography + beep + typewriter "LOADING sanctuary....."
    scheduleCataclysmStep(() => {
        playBiosBeep();
        bootTextSpan = createBiosBootTypographyContainer(blackoutOverlay);
        startLoadingTypewriterEffect(bootTextSpan);
    }, BIOS_BOOT_TEXT_START_MS);

    // 5. T = 8.5s: Line break + "OPEN...." with blinking cursor for 1.2s
    scheduleCataclysmStep(() => {
        if (activeTypewriterIntervalId !== null) {
            window.clearInterval(activeTypewriterIntervalId);
            activeTypewriterIntervalId = null;
        }
        if (bootTextSpan) {
            bootTextSpan.textContent = `${BOOT_LOADING_TEXT}\n${BOOT_OPEN_TEXT}`;
        }
    }, BIOS_OPEN_LINE_START_MS);

    // 6. T = 9.8s: Fade black curtain opacity 1 -> 0 over 1.5s to reveal active Sanctuary
    scheduleCataclysmStep(() => {
        if (onRevealSanctuary) {
            onRevealSanctuary();
        }
        if (blackoutOverlay) {
            blackoutOverlay.style.transition = `opacity ${CURTAIN_FADE_DURATION_SEC}s steps(4, end)`;
            blackoutOverlay.style.opacity = '0';
        }
    }, CURTAIN_FADE_START_MS);

    // 7. T = 11.3s: Destroy temporary DOM nodes and invoke onComplete()
    scheduleCataclysmStep(() => {
        cleanupCataclysmElements();
        if (onComplete) {
            onComplete();
        }
    }, CATACLYSM_COMPLETE_MS);
}
