/**************************************************************
 * DRUKSYSTEM OS — CRT TERMINAL & COMMAND INTERPRETER
 **************************************************************/

import { CONTACT_LINKS } from '../config/links.js';
import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { playSound } from '../audio/soundEngine.js';
import {
    startSnakeGame,
    stopSnakeGame,
    drawSnakeFrame,
    initSnakeControls
} from '../game/snakeGame.js';
import {
    startFlappyDragonGame,
    stopFlappyDragonGame,
    drawFlappyFrame,
    initFlappyDragonControls
} from '../game/flappyDragon.js';
import { startGame as startBugSlasherGame } from '../game/bugSlasher.js';

const COLOR_MODES = ['matrix', 'amber', 'druk', 'cyan'];
const FONT_MODES = ['ibm', 'vt323', 'gothic'];
const TERM_COLOR_STORAGE_KEY = 'druk_term_color';
const TERM_FONT_STORAGE_KEY = 'druk_term_font';

let currentColorMode = localStorage.getItem(TERM_COLOR_STORAGE_KEY) || 'matrix';
let currentFontMode = localStorage.getItem(TERM_FONT_STORAGE_KEY) || 'ibm';
let commandHistory = [];
let historyIndex = -1;
let copyEmailCallback = null;

function getModalElement() {
    return document.getElementById('drukSystemModal');
}

function getOutputContainer() {
    return document.getElementById('terminalOutput');
}

function getTerminalInput() {
    return document.getElementById('terminalInput');
}

function scrollToBottom() {
    const output = getOutputContainer();
    if (output) {
        output.scrollTop = output.scrollHeight;
    }
}

function appendLine(text, className = '') {
    const output = getOutputContainer();
    if (!output) return;

    const line = document.createElement('div');
    line.className = `leading-relaxed whitespace-pre-wrap ${className}`.trim();
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
}

function appendBlockLines(lines, className = '') {
    lines.forEach((lineText) => appendLine(lineText, className));
}

export function setTerminalColor(mode) {
    const normalized = COLOR_MODES.includes(mode) ? mode : 'matrix';
    currentColorMode = normalized;
    localStorage.setItem(TERM_COLOR_STORAGE_KEY, normalized);

    const modalEl = getModalElement();
    if (modalEl) {
        modalEl.setAttribute('data-terminal-color', normalized);
    }
    drawSnakeFrame();
    drawFlappyFrame();
    return normalized;
}

export function setTerminalFont(font) {
    const normalized = FONT_MODES.includes(font) ? font : 'ibm';
    currentFontMode = normalized;
    localStorage.setItem(TERM_FONT_STORAGE_KEY, normalized);

    const modalEl = getModalElement();
    if (modalEl) {
        modalEl.setAttribute('data-terminal-font', normalized);
    }
    return normalized;
}

function switchTerminalSubView(viewName) {
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
        const inputEl = getTerminalInput();
        if (inputEl) inputEl.focus();
    }
}

export function returnToTerminalPrompt() {
    switchTerminalSubView('cli');
}

export function openDrukSystem() {
    const modalEl = getModalElement();
    if (!modalEl) return;

    modalEl.classList.remove('hidden');
    switchTerminalSubView('cli');
    playSound('terminal');

    const inputEl = getTerminalInput();
    if (inputEl) {
        setTimeout(() => inputEl.focus(), 40);
    }
}

export function closeDrukSystem() {
    stopSnakeGame();
    stopFlappyDragonGame();
    const modalEl = getModalElement();
    if (modalEl) {
        modalEl.classList.add('hidden');
    }
    playSound('click');
}

function renderContactBlock() {
    const output = getOutputContainer();
    if (!output) return;

    const termTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendLine(termTexts.contactTitle, 'font-bold mt-1');

    Object.entries(CONTACT_LINKS.socials || {}).forEach(([network, url]) => {
        if (!url || url.trim() === '') return;

        const row = document.createElement('div');
        row.className = 'leading-relaxed flex flex-wrap items-center gap-2 pl-2';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = `• ${network.toUpperCase().padEnd(10, ' ')} ->`;

        const anchor = document.createElement('a');
        anchor.href = url.trim();
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.className = 'term-link';
        anchor.textContent = url.trim();
        anchor.addEventListener('click', () => playSound('click'));

        row.appendChild(labelSpan);
        row.appendChild(anchor);
        output.appendChild(row);
    });

    if (CONTACT_LINKS.email && CONTACT_LINKS.email.trim() !== '') {
        const emailRow = document.createElement('div');
        emailRow.className = 'leading-relaxed flex flex-wrap items-center gap-2 pl-2 mt-1';

        const emailSpan = document.createElement('span');
        emailSpan.textContent = `• EMAIL      -> ${CONTACT_LINKS.email}`;

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'term-cmd-chip';
        copyBtn.textContent = termTexts.copyEmailAction;
        copyBtn.addEventListener('click', () => {
            if (typeof copyEmailCallback === 'function') {
                copyEmailCallback();
            }
            copyBtn.textContent = TRANSLATIONS[getCurrentLanguage()].terminal.copiedEmailAction;
            setTimeout(() => {
                copyBtn.textContent = TRANSLATIONS[getCurrentLanguage()].terminal.copyEmailAction;
            }, 2000);
        });

        emailRow.appendChild(emailSpan);
        emailRow.appendChild(copyBtn);
        output.appendChild(emailRow);
    }

    scrollToBottom();
}

function createPlayActionChip(label, command) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'term-cmd-chip';
    button.textContent = label;
    button.addEventListener('click', () => executeTerminalCommand(command));
    return button;
}

function renderPlayMenuBlock() {
    const output = getOutputContainer();
    if (!output) return;

    const termTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendBlockLines(termTexts.playListLines);

    const actionsRow = document.createElement('div');
    actionsRow.className = 'flex flex-wrap gap-2 pl-2 my-1';
    actionsRow.appendChild(createPlayActionChip('▶ [play snake]', 'play snake'));
    actionsRow.appendChild(createPlayActionChip('▶ [play flappy]', 'play flappy'));
    actionsRow.appendChild(createPlayActionChip('▶ [play slasher]', 'play slasher'));

    output.appendChild(actionsRow);
    scrollToBottom();
}

export function renderBootBanner() {
    const output = getOutputContainer();
    if (!output) return;
    output.innerHTML = '';
    const termTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendBlockLines(termTexts.bootBanner);
    appendLine('');
}

export function executeTerminalCommand(rawCommand) {
    const trimmed = (rawCommand || '').trim();
    if (!trimmed) return;

    switchTerminalSubView('cli');
    appendLine(`druk@sanctuary:~$ ${trimmed}`, 'opacity-80 mt-1');

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const arg = parts[1] || '';
    const termTexts = TRANSLATIONS[getCurrentLanguage()].terminal;

    if (cmd === 'help' || cmd === '?') {
        playSound('click');
        appendBlockLines(termTexts.helpLines);
        return;
    }

    if (cmd === 'ls' || cmd === 'dir') {
        playSound('click');
        appendBlockLines(termTexts.lsLines);
        return;
    }

    if (cmd === 'contacto' || cmd === 'contact' || cmd === 'links') {
        playSound('coin');
        renderContactBlock();
        return;
    }

    if (cmd === 'color') {
        const nextColor = COLOR_MODES.includes(arg)
            ? arg
            : COLOR_MODES[(COLOR_MODES.indexOf(currentColorMode) + 1) % COLOR_MODES.length];
        setTerminalColor(nextColor);
        playSound('coin');
        appendLine(termTexts.colorUpdated(nextColor));
        return;
    }

    if (cmd === 'font') {
        const nextFont = FONT_MODES.includes(arg)
            ? arg
            : FONT_MODES[(FONT_MODES.indexOf(currentFontMode) + 1) % FONT_MODES.length];
        setTerminalFont(nextFont);
        playSound('coin');
        appendLine(termTexts.fontUpdated(nextFont));
        return;
    }

    if (cmd === 'play') {
        if (arg === 'snake') {
            playSound('coin');
            switchTerminalSubView('snake');
            startSnakeGame(returnToTerminalPrompt);
            return;
        }
        if (arg === 'flappy' || arg === 'dragon') {
            playSound('coin');
            switchTerminalSubView('flappy');
            startFlappyDragonGame(returnToTerminalPrompt);
            return;
        }
        if (arg === 'slasher') {
            playSound('coin');
            switchTerminalSubView('slasher');
            startBugSlasherGame();
            return;
        }
        playSound('click');
        renderPlayMenuBlock();
        return;
    }

    if (cmd === 'snake') {
        executeTerminalCommand('play snake');
        return;
    }

    if (cmd === 'flappy' || cmd === 'dragon') {
        executeTerminalCommand('play flappy');
        return;
    }

    if (cmd === 'slasher') {
        executeTerminalCommand('play slasher');
        return;
    }

    if (cmd === 'clear' || cmd === 'cls') {
        playSound('click');
        renderBootBanner();
        return;
    }

    if (cmd === 'exit' || cmd === 'cerrar' || cmd === 'close' || cmd === 'quit') {
        closeDrukSystem();
        return;
    }

    playSound('hit');
    appendLine(termTexts.unknownCommand(trimmed));
}

export function initDrukSystem(onCopyEmail) {
    copyEmailCallback = onCopyEmail;
    setTerminalColor(currentColorMode);
    setTerminalFont(currentFontMode);
    renderBootBanner();
    initSnakeControls();
    initFlappyDragonControls();

    const formEl = document.getElementById('terminalCommandForm');
    const inputEl = getTerminalInput();

    if (formEl && inputEl) {
        formEl.addEventListener('submit', (event) => {
            event.preventDefault();
            const val = inputEl.value;
            inputEl.value = '';
            executeTerminalCommand(val);
        });

        inputEl.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                if (commandHistory.length > 0 && historyIndex > 0) {
                    event.preventDefault();
                    historyIndex--;
                    inputEl.value = commandHistory[historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    event.preventDefault();
                    historyIndex++;
                    inputEl.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    inputEl.value = '';
                }
            } else if (event.key === 'Escape') {
                closeDrukSystem();
            }
        });
    }

    document.querySelectorAll('[data-term-cmd]').forEach((button) => {
        button.addEventListener('click', () => {
            const cmd = button.getAttribute('data-term-cmd');
            executeTerminalCommand(cmd);
        });
    });

    const closeSlasherBtn = document.getElementById('slasherExitBtn');
    if (closeSlasherBtn) {
        closeSlasherBtn.addEventListener('click', () => {
            playSound('click');
            returnToTerminalPrompt();
        });
    }
}
