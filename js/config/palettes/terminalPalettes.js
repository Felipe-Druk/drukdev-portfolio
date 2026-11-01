/**************************************************************
 * TERMINAL PHOSPHOR PALETTES & ACTIVE STATE (js/config/palettes/terminalPalettes.js)
 **************************************************************/

export const TERMINAL_PALETTES = Object.freeze({
    matrix: Object.freeze({
        bg: '#030803',
        fg: '#00FF41',
        dim: '#008F11',
        glow: 'rgba(0, 255, 65, 0.32)'
    }),
    amber: Object.freeze({
        bg: '#0A0602',
        fg: '#FFB000',
        dim: '#996900',
        glow: 'rgba(255, 176, 0, 0.32)'
    }),
    druk: Object.freeze({
        bg: '#0D070C',
        fg: '#D4957A',
        dim: '#B92B92',
        glow: 'rgba(185, 43, 146, 0.38)'
    }),
    cyan: Object.freeze({
        bg: '#02080A',
        fg: '#00F5D4',
        dim: '#008B76',
        glow: 'rgba(0, 245, 212, 0.32)'
    })
});

let activeTerminalColorMode = 'matrix';

export function getActiveTerminalColorMode() {
    return activeTerminalColorMode;
}

export function setActiveTerminalColorMode(mode) {
    if (TERMINAL_PALETTES[mode]) {
        activeTerminalColorMode = mode;
    }
    return activeTerminalColorMode;
}

export function getActiveTerminalPalette() {
    return TERMINAL_PALETTES[activeTerminalColorMode] || TERMINAL_PALETTES.matrix;
}
