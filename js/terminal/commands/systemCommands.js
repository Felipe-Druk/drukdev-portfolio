/**************************************************************
 * DRUKSYSTEM OS — SYSTEM & DIRECTORY COMMANDS (help, ls, clear)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import { playSound } from '../../audio/soundEngine.js';
import { appendLine, appendBlockLines, clearOutputContainer } from '../terminalDom.js';

export function renderBootBanner() {
    clearOutputContainer();
    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendBlockLines(terminalTexts.bootBanner);
    appendLine('');
}

export function runHelpCommand() {
    playSound('click');
    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendBlockLines(terminalTexts.helpLines);
}

export function runLsCommand() {
    playSound('click');
    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendBlockLines(terminalTexts.lsLines);
}

export function runClearCommand() {
    playSound('click');
    renderBootBanner();
}
