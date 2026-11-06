/**************************************************************
 * DRUKSYSTEM OS — DOM HELPERS & CRT VIEW CONTROLLER
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { stopSnakeGame } from '../game/snakeGame.js';
import { stopFlappyDragonGame } from '../game/flappyDragon.js';

const TERMINAL_VIEW_IDS = {
    cli: 'terminalCliView',
    snake: 'terminalSnakeView',
    flappy: 'terminalFlappyView',
    slasher: 'terminalSlasherView'
};

let terminalModalOpen = false;
let activeTerminalSubView = 'cli';

export function isTerminalModalOpen() {
    return terminalModalOpen;
}

export function setTerminalModalOpenState(isOpen) {
    terminalModalOpen = Boolean(isOpen);
}

export function getActiveTerminalSubView() {
    return activeTerminalSubView;
}

export function isSlasherViewActive() {
    return terminalModalOpen && activeTerminalSubView === 'slasher';
}

export function getActiveTerminalTexts() {
    return TRANSLATIONS[getCurrentLanguage()].terminal;
}

export function getModalElement() {
    return document.getElementById('drukSystemModal');
}

export function getOutputContainer() {
    return document.getElementById('terminalOutput');
}

export function getTerminalInput() {
    return document.getElementById('terminalInput');
}

export function setTerminalInputDisabled(isDisabled) {
    const inputElement = getTerminalInput();
    if (!inputElement) return;

    inputElement.disabled = Boolean(isDisabled);
    if (isDisabled) {
        inputElement.blur();
    } else if (terminalModalOpen) {
        inputElement.focus();
    }
}

export function scrollToBottom() {
    const output = getOutputContainer();
    if (output) {
        output.scrollTop = output.scrollHeight;
    }
}

export function clearOutputContainer() {
    const output = getOutputContainer();
    if (output) {
        output.innerHTML = '';
    }
}

export function appendLine(text, className = '') {
    const output = getOutputContainer();
    if (!output) return;

    const line = document.createElement('div');
    line.className = `leading-relaxed whitespace-pre-wrap ${className}`.trim();
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
}

export function appendBlockLines(lines, className = '') {
    lines.forEach((lineText) => appendLine(lineText, className));
}

export function switchTerminalSubView(viewName) {
    activeTerminalSubView = TERMINAL_VIEW_IDS[viewName] ? viewName : 'cli';

    Object.entries(TERMINAL_VIEW_IDS).forEach(([key, elementId]) => {
        const viewElement = document.getElementById(elementId);
        if (viewElement) {
            viewElement.classList.toggle('hidden', key !== activeTerminalSubView);
        }
    });

    if (activeTerminalSubView !== 'snake') {
        stopSnakeGame();
    }
    if (activeTerminalSubView !== 'flappy') {
        stopFlappyDragonGame();
    }
    if (activeTerminalSubView === 'cli') {
        const inputElement = getTerminalInput();
        if (inputElement) inputElement.focus();
    }
}

export function returnToTerminalPrompt() {
    switchTerminalSubView('cli');
}
