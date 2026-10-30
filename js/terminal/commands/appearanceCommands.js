/**************************************************************
 * DRUKSYSTEM OS — CRT APPEARANCE COMMANDS (color, font)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import { playSound } from '../../audio/soundEngine.js';
import { drawSnakeFrame } from '../../game/snakeGame.js';
import { drawFlappyFrame } from '../../game/flappyDragon.js';
import { getModalElement, appendLine } from '../terminalDom.js';

const COLOR_MODES = ['matrix', 'amber', 'druk', 'cyan'];
const FONT_MODES = ['ibm', 'vt323', 'gothic'];
const TERM_COLOR_STORAGE_KEY = 'druk_term_color';
const TERM_FONT_STORAGE_KEY = 'druk_term_font';

let currentColorMode = localStorage.getItem(TERM_COLOR_STORAGE_KEY) || 'matrix';
let currentFontMode = localStorage.getItem(TERM_FONT_STORAGE_KEY) || 'ibm';

export function setTerminalColor(mode) {
    const normalizedMode = COLOR_MODES.includes(mode) ? mode : 'matrix';
    currentColorMode = normalizedMode;
    localStorage.setItem(TERM_COLOR_STORAGE_KEY, normalizedMode);

    const modalElement = getModalElement();
    if (modalElement) {
        modalElement.setAttribute('data-terminal-color', normalizedMode);
    }
    drawSnakeFrame();
    drawFlappyFrame();
    return normalizedMode;
}

export function setTerminalFont(font) {
    const normalizedFont = FONT_MODES.includes(font) ? font : 'ibm';
    currentFontMode = normalizedFont;
    localStorage.setItem(TERM_FONT_STORAGE_KEY, normalizedFont);

    const modalElement = getModalElement();
    if (modalElement) {
        modalElement.setAttribute('data-terminal-font', normalizedFont);
    }
    return normalizedFont;
}

export function initTerminalAppearance() {
    setTerminalColor(currentColorMode);
    setTerminalFont(currentFontMode);
}

export function runColorCommand(commandArgument) {
    const nextColor = COLOR_MODES.includes(commandArgument)
        ? commandArgument
        : COLOR_MODES[(COLOR_MODES.indexOf(currentColorMode) + 1) % COLOR_MODES.length];

    setTerminalColor(nextColor);
    playSound('coin');
    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendLine(terminalTexts.colorUpdated(nextColor));
}

export function runFontCommand(commandArgument) {
    const nextFont = FONT_MODES.includes(commandArgument)
        ? commandArgument
        : FONT_MODES[(FONT_MODES.indexOf(currentFontMode) + 1) % FONT_MODES.length];

    setTerminalFont(nextFont);
    playSound('coin');
    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendLine(terminalTexts.fontUpdated(nextFont));
}
