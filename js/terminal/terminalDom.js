/**************************************************************
 * DRUKSYSTEM OS — DOM HELPERS & CRT VIEW CONTROLLER
 **************************************************************/

import { stopSnakeGame } from '../game/snakeGame.js';
import { stopFlappyDragonGame } from '../game/flappyDragon.js';

export function getModalElement() {
    return document.getElementById('drukSystemModal');
}

export function getOutputContainer() {
    return document.getElementById('terminalOutput');
}

export function getTerminalInput() {
    return document.getElementById('terminalInput');
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
    const cliView = document.getElementById('terminalCliView');
    const snakeView = document.getElementById('terminalSnakeView');
    const flappyView = document.getElementById('terminalFlappyView');
    const slasherView = document.getElementById('terminalSlasherView');

    if (cliView) cliView.classList.toggle('hidden', viewName !== 'cli');
    if (snakeView) snakeView.classList.toggle('hidden', viewName !== 'snake');
    if (flappyView) flappyView.classList.toggle('hidden', viewName !== 'flappy');
    if (slasherView) slasherView.classList.toggle('hidden', viewName !== 'slasher');

    if (viewName !== 'snake') {
        stopSnakeGame();
    }
    if (viewName !== 'flappy') {
        stopFlappyDragonGame();
    }
    if (viewName === 'cli') {
        const inputElement = getTerminalInput();
        if (inputElement) inputElement.focus();
    }
}

export function returnToTerminalPrompt() {
    switchTerminalSubView('cli');
}
