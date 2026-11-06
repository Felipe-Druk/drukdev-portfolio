/**************************************************************
 * DRUKSYSTEM OS — SYSTEM & DIRECTORY COMMANDS (help, ls, clear)
 **************************************************************/

import { playSound } from '../../audio/index.js';
import { triggerSystemCataclysm } from '../../graphics/cataclysmEffect.js';
import { resetConstellationAttentionBlink } from '../../graphics/sanctuary/constellations.js';
import {
    getActiveTerminalTexts,
    getModalElement,
    appendLine,
    appendBlockLines,
    clearOutputContainer,
    setTerminalInputDisabled,
    setTerminalModalOpenState
} from '../terminalDom.js';

export function renderBootBanner() {
    clearOutputContainer();
    appendBlockLines(getActiveTerminalTexts().bootBanner);
    appendLine('');
}

export function renderSafeModeBanner() {
    clearOutputContainer();
    appendBlockLines(getActiveTerminalTexts().safeModeBanner);
    appendLine('');
}

export function runCataclysmCommand(context) {
    setTerminalInputDisabled(true);

    const cataclysmLines = getActiveTerminalTexts().cataclysmLines;
    cataclysmLines.forEach((lineText) => {
        appendLine(lineText, 'font-bold');
    });

    triggerSystemCataclysm({
        onRevealSanctuary: () => {
            resetConstellationAttentionBlink();
            setTerminalModalOpenState(false);
            const modalElement = getModalElement();
            if (modalElement) {
                modalElement.classList.add('hidden');
            }
        },
        onComplete: () => {
            if (context && typeof context.clearHistory === 'function') {
                context.clearHistory();
            }
            renderSafeModeBanner();
            setTerminalInputDisabled(false);
            resetConstellationAttentionBlink();
            if (context && typeof context.closeTerminal === 'function') {
                context.closeTerminal();
            }
        }
    });
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
