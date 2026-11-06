/**************************************************************
 * DRUKSYSTEM OS — CRT APPEARANCE COMMANDS (color, font)
 **************************************************************/

import {
    TERMINAL_PALETTES,
    setActiveTerminalColorMode
} from '../../config/palettes.js';
import { playSound } from '../../audio/index.js';
import { loadItem, saveItem } from '../../utils/safeStorage.js';
import { drawSnakeFrame } from '../../game/snakeGame.js';
import { drawFlappyFrame } from '../../game/flappyDragon.js';
import { getActiveTerminalTexts, getModalElement, appendLine } from '../terminalDom.js';

const COLOR_MODES = Object.keys(TERMINAL_PALETTES);
const FONT_MODES = ['ibm', 'vt323', 'gothic'];
const TERM_COLOR_STORAGE_KEY = 'druk_term_color';
const TERM_FONT_STORAGE_KEY = 'druk_term_font';

let currentColorMode = loadItem(TERM_COLOR_STORAGE_KEY, 'matrix') || 'matrix';
let currentFontMode = loadItem(TERM_FONT_STORAGE_KEY, 'ibm') || 'ibm';

function resolveNextCycleOption(optionsList, currentOption, requestedOption) {
    if (optionsList.includes(requestedOption)) {
        return requestedOption;
    }
    const nextIndex = (optionsList.indexOf(currentOption) + 1) % optionsList.length;
    return optionsList[nextIndex];
}

export function setTerminalColor(mode) {
    const normalizedMode = COLOR_MODES.includes(mode) ? mode : 'matrix';
    currentColorMode = setActiveTerminalColorMode(normalizedMode);
    saveItem(TERM_COLOR_STORAGE_KEY, currentColorMode);

    const modalElement = getModalElement();
    if (modalElement) {
        modalElement.setAttribute('data-terminal-color', currentColorMode);
    }
    drawSnakeFrame();
    drawFlappyFrame();
    return currentColorMode;
}

export function setTerminalFont(font) {
    const normalizedFont = FONT_MODES.includes(font) ? font : 'ibm';
    currentFontMode = normalizedFont;
    saveItem(TERM_FONT_STORAGE_KEY, normalizedFont);

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
    const nextColor = resolveNextCycleOption(COLOR_MODES, currentColorMode, commandArgument);
    setTerminalColor(nextColor);
    playSound('coin');
    appendLine(getActiveTerminalTexts().colorUpdated(nextColor));
}

export function runFontCommand(commandArgument) {
    const nextFont = resolveNextCycleOption(FONT_MODES, currentFontMode, commandArgument);
    setTerminalFont(nextFont);
    playSound('coin');
    appendLine(getActiveTerminalTexts().fontUpdated(nextFont));
}
