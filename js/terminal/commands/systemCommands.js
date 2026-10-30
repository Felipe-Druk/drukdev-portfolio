/**************************************************************
 * DRUKSYSTEM OS — SYSTEM & DIRECTORY COMMANDS (help, ls, clear)
 **************************************************************/

import { playSound } from '../../audio/soundEngine.js';
import {
    getActiveTerminalTexts,
    appendLine,
    appendBlockLines,
    clearOutputContainer
} from '../terminalDom.js';

export function renderBootBanner() {
    clearOutputContainer();
    appendBlockLines(getActiveTerminalTexts().bootBanner);
    appendLine('');
}

export function runHelpCommand() {
    playSound('click');
    appendBlockLines(getActiveTerminalTexts().helpLines);
}

export function runLsCommand() {
    playSound('click');
    appendBlockLines(getActiveTerminalTexts().lsLines);
}

export function runClearCommand() {
    playSound('click');
    renderBootBanner();
}
