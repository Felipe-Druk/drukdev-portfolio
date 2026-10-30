/**************************************************************
 * DRUKSYSTEM OS — CRT TERMINAL & COMMAND INTERPRETER
 **************************************************************/

import { CONTACT_LINKS, getLocalizedCvPath } from '../config/links.js';
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
        const inputElement = getTerminalInput();
        if (inputElement) inputElement.focus();
    }
}

export function returnToTerminalPrompt() {
    switchTerminalSubView('cli');
}

export function openDrukSystem() {
    const modalElement = getModalElement();
    if (!modalElement) return;

    modalElement.classList.remove('hidden');
    switchTerminalSubView('cli');
    playSound('terminal');

    const inputElement = getTerminalInput();
    if (inputElement) {
        setTimeout(() => inputElement.focus(), 40);
    }
}

export function closeDrukSystem() {
    stopSnakeGame();
    stopFlappyDragonGame();
    const modalElement = getModalElement();
    if (modalElement) {
        modalElement.classList.add('hidden');
    }
    playSound('click');
}

function createCvDownloadRow(cvPath, terminalTexts) {
    const fileName = cvPath.split('/').pop() || 'CV-Felipe-Druk.pdf';
    const row = document.createElement('div');
    row.className = 'leading-relaxed flex flex-wrap items-center gap-2 pl-2 my-1';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = terminalTexts.cvDownloadLabel;

    const downloadLink = document.createElement('a');
    downloadLink.href = cvPath;
    downloadLink.setAttribute('download', fileName);
    downloadLink.className = 'term-link font-bold';
    downloadLink.textContent = `${terminalTexts.cvDownloadAction} (${fileName})`;
    downloadLink.addEventListener('click', () => playSound('click'));

    row.appendChild(labelSpan);
    row.appendChild(downloadLink);
    return row;
}

function renderCvBlock() {
    const output = getOutputContainer();
    if (!output) return;

    const activeLanguage = getCurrentLanguage();
    const terminalTexts = TRANSLATIONS[activeLanguage].terminal;
    const cvPath = getLocalizedCvPath(activeLanguage);

    if (!cvPath) {
        playSound('hit');
        appendLine(terminalTexts.cvUnavailable);
        return;
    }

    playSound('coin');
    appendLine(terminalTexts.cvOpening, 'font-bold mt-1');
    output.appendChild(createCvDownloadRow(cvPath, terminalTexts));
    scrollToBottom();

    window.open(cvPath, '_blank', 'noopener,noreferrer');
}

function renderContactBlock() {
    const output = getOutputContainer();
    if (!output) return;

    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendLine(terminalTexts.contactTitle, 'font-bold mt-1');

    Object.entries(CONTACT_LINKS.socials || {}).forEach(([networkName, socialUrl]) => {
        if (!socialUrl || socialUrl.trim() === '') return;

        const row = document.createElement('div');
        row.className = 'leading-relaxed flex flex-wrap items-center gap-2 pl-2';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = `• ${networkName.toUpperCase().padEnd(10, ' ')} ->`;

        const anchor = document.createElement('a');
        anchor.href = socialUrl.trim();
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.className = 'term-link';
        anchor.textContent = socialUrl.trim();
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

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'term-cmd-chip';
        copyButton.textContent = terminalTexts.copyEmailAction;
        copyButton.addEventListener('click', () => {
            if (typeof copyEmailCallback === 'function') {
                copyEmailCallback();
            }
            copyButton.textContent = TRANSLATIONS[getCurrentLanguage()].terminal.copiedEmailAction;
            setTimeout(() => {
                copyButton.textContent = TRANSLATIONS[getCurrentLanguage()].terminal.copyEmailAction;
            }, 2000);
        });

        emailRow.appendChild(emailSpan);
        emailRow.appendChild(copyButton);
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

    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendBlockLines(terminalTexts.playListLines);

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
    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;
    appendBlockLines(terminalTexts.bootBanner);
    appendLine('');
}

export function executeTerminalCommand(rawCommand) {
    const trimmedCommand = (rawCommand || '').trim();
    if (!trimmedCommand) return;

    switchTerminalSubView('cli');
    appendLine(`druk@sanctuary:~$ ${trimmedCommand}`, 'opacity-80 mt-1');

    commandHistory.push(trimmedCommand);
    historyIndex = commandHistory.length;

    const commandTokens = trimmedCommand.toLowerCase().split(/\s+/);
    const commandName = commandTokens[0];
    const commandArgument = commandTokens[1] || '';
    const terminalTexts = TRANSLATIONS[getCurrentLanguage()].terminal;

    if (commandName === 'help' || commandName === '?') {
        playSound('click');
        appendBlockLines(terminalTexts.helpLines);
        return;
    }

    if (commandName === 'ls' || commandName === 'dir') {
        playSound('click');
        appendBlockLines(terminalTexts.lsLines);
        return;
    }

    if (commandName === 'cv' || commandName === 'resume') {
        renderCvBlock();
        return;
    }

    if (commandName === 'contacto' || commandName === 'contact' || commandName === 'links') {
        playSound('coin');
        renderContactBlock();
        return;
    }

    if (commandName === 'color') {
        const nextColor = COLOR_MODES.includes(commandArgument)
            ? commandArgument
            : COLOR_MODES[(COLOR_MODES.indexOf(currentColorMode) + 1) % COLOR_MODES.length];
        setTerminalColor(nextColor);
        playSound('coin');
        appendLine(terminalTexts.colorUpdated(nextColor));
        return;
    }

    if (commandName === 'font') {
        const nextFont = FONT_MODES.includes(commandArgument)
            ? commandArgument
            : FONT_MODES[(FONT_MODES.indexOf(currentFontMode) + 1) % FONT_MODES.length];
        setTerminalFont(nextFont);
        playSound('coin');
        appendLine(terminalTexts.fontUpdated(nextFont));
        return;
    }

    if (commandName === 'play') {
        if (commandArgument === 'snake') {
            playSound('coin');
            switchTerminalSubView('snake');
            startSnakeGame(returnToTerminalPrompt);
            return;
        }
        if (commandArgument === 'flappy' || commandArgument === 'dragon') {
            playSound('coin');
            switchTerminalSubView('flappy');
            startFlappyDragonGame(returnToTerminalPrompt);
            return;
        }
        if (commandArgument === 'slasher') {
            playSound('coin');
            switchTerminalSubView('slasher');
            startBugSlasherGame();
            return;
        }
        playSound('click');
        renderPlayMenuBlock();
        return;
    }

    if (commandName === 'snake') {
        executeTerminalCommand('play snake');
        return;
    }

    if (commandName === 'flappy' || commandName === 'dragon') {
        executeTerminalCommand('play flappy');
        return;
    }

    if (commandName === 'slasher') {
        executeTerminalCommand('play slasher');
        return;
    }

    if (commandName === 'clear' || commandName === 'cls') {
        playSound('click');
        renderBootBanner();
        return;
    }

    if (commandName === 'exit' || commandName === 'cerrar' || commandName === 'close' || commandName === 'quit') {
        closeDrukSystem();
        return;
    }

    playSound('hit');
    appendLine(terminalTexts.unknownCommand(trimmedCommand));
}

export function initDrukSystem(onCopyEmail) {
    copyEmailCallback = onCopyEmail;
    setTerminalColor(currentColorMode);
    setTerminalFont(currentFontMode);
    renderBootBanner();
    initSnakeControls();
    initFlappyDragonControls();

    const formElement = document.getElementById('terminalCommandForm');
    const inputElement = getTerminalInput();

    if (formElement && inputElement) {
        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const inputValue = inputElement.value;
            inputElement.value = '';
            executeTerminalCommand(inputValue);
        });

        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                if (commandHistory.length > 0 && historyIndex > 0) {
                    event.preventDefault();
                    historyIndex--;
                    inputElement.value = commandHistory[historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    event.preventDefault();
                    historyIndex++;
                    inputElement.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    inputElement.value = '';
                }
            } else if (event.key === 'Escape') {
                closeDrukSystem();
            }
        });
    }

    document.querySelectorAll('[data-term-cmd]').forEach((button) => {
        button.addEventListener('click', () => {
            const commandString = button.getAttribute('data-term-cmd');
            executeTerminalCommand(commandString);
        });
    });

    const closeSlasherButton = document.getElementById('slasherExitBtn');
    if (closeSlasherButton) {
        closeSlasherButton.addEventListener('click', () => {
            playSound('click');
            returnToTerminalPrompt();
        });
    }
}
