/**************************************************************
 * CATACLYSM PROTOCOL — FULLSCREEN GLITCH, MATRIX & CRT COLLAPSE
 **************************************************************/

import { playSound } from '../audio/soundEngine.js';

const RUMBLE_DURATION_MS = 1200;
const MATRIX_DURATION_MS = 2500;
const CRT_BLACKOUT_DURATION_MS = 1200;

const MATRIX_OVERLAY_ID = 'matrix-overlay';
const CRT_BLACKOUT_OVERLAY_ID = 'crt-blackout-overlay';
const RUMBLE_BODY_CLASS = 'cataclysm-rumble';

const MATRIX_FONT_SIZE = 16;
const MATRIX_RUNE_GLYPHS = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ0123456789ABCDEF<>/{}[]*$#@!';
const MATRIX_CORRUPTION_FRAGMENTS = ['druk.ar', 'drukernel', 'segfault'];

let cataclysmInProgress = false;
let activeMatrixFrameId = null;
let activeResizeListener = null;
let activeTimeouts = [];

export function isCataclysmRunning() {
    return cataclysmInProgress;
}

function registerTimeout(callback, delayMs) {
    const timeoutId = window.setTimeout(callback, delayMs);
    activeTimeouts.push(timeoutId);
    return timeoutId;
}

function clearAllCataclysmTimeouts() {
    activeTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    activeTimeouts = [];
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
    clearAllCataclysmTimeouts();
    stopMatrixLoopAndListeners();
    document.body.classList.remove(RUMBLE_BODY_CLASS);
    removeDomElementById(MATRIX_OVERLAY_ID);
    removeDomElementById(CRT_BLACKOUT_OVERLAY_ID);
    cataclysmInProgress = false;
}

function createMatrixOverlayCanvas() {
    removeDomElementById(MATRIX_OVERLAY_ID);

    const canvasElement = document.createElement('canvas');
    canvasElement.id = MATRIX_OVERLAY_ID;
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    canvasElement.style.cssText = 'position: fixed; inset: 0; z-index: 99998; pointer-events: none;';

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
    blackoutOverlay.style.cssText = 'position: fixed; inset: 0; z-index: 99999; background-color: #000000; pointer-events: none;';

    const powerOffBeam = document.createElement('div');
    powerOffBeam.className = 'crt-power-off-beam';
    blackoutOverlay.appendChild(powerOffBeam);

    document.body.appendChild(blackoutOverlay);
    return blackoutOverlay;
}

export function triggerSystemCataclysm(onComplete) {
    if (cataclysmInProgress) return;
    cleanupCataclysmElements();
    cataclysmInProgress = true;

    playSound('seal');
    document.body.classList.add(RUMBLE_BODY_CLASS);

    registerTimeout(() => {
        document.body.classList.remove(RUMBLE_BODY_CLASS);
        playSound('hit');

        const matrixCanvas = createMatrixOverlayCanvas();
        startMatrixRainCascade(matrixCanvas);

        registerTimeout(() => {
            stopMatrixLoopAndListeners();
            removeDomElementById(MATRIX_OVERLAY_ID);

            playSound('gameover');
            createCrtBlackoutOverlay();

            registerTimeout(() => {
                cleanupCataclysmElements();
                playSound('terminal');

                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }, CRT_BLACKOUT_DURATION_MS);
        }, MATRIX_DURATION_MS);
    }, RUMBLE_DURATION_MS);
}
