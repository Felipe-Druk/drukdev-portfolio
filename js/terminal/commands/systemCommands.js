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

export function runDungeonCommand(_, context) {
    playSound('constellation');
    appendLine(getActiveTerminalTexts().dungeonOpening, 'font-bold mt-1');
    if (context && typeof context.closeTerminal === 'function') {
        context.closeTerminal();
    }
    if (context && typeof context.openDungeon === 'function') {
        context.openDungeon();
    }
}
