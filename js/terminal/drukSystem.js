/**************************************************************
 * DRUKSYSTEM OS — CRT TERMINAL CONTROLLER & LIFECYCLE
 **************************************************************/

import { playSound } from '../audio/soundEngine.js';
import { isCataclysmRunning } from '../effects/cataclysmEffect.js';
import { stopSnakeGame, initSnakeControls } from '../game/snakeGame.js';
import { stopFlappyDragonGame, initFlappyDragonControls } from '../game/flappyDragon.js';
import {
    getModalElement,
    getTerminalInput,
    appendLine,
    switchTerminalSubView,
    returnToTerminalPrompt,
    isTerminalModalOpen,
    setTerminalModalOpenState,
    isSlasherViewActive
} from './terminalDom.js';
import { renderBootBanner } from './commands/systemCommands.js';
import { setCopyEmailHandler } from './commands/contactCommand.js';
import {
    initTerminalAppearance,
    setTerminalColor,
    setTerminalFont
} from './commands/appearanceCommands.js';
import { dispatchTerminalCommand } from './commands/index.js';

export {
    renderBootBanner,
    returnToTerminalPrompt,
    setTerminalColor,
    setTerminalFont,
    isTerminalModalOpen,
    isSlasherViewActive
};

let commandHistory = [];
let historyIndex = -1;
let openDungeonHandler = null;

export function openDrukSystem() {
    const modalElement = getModalElement();
    if (!modalElement) return;

    setTerminalModalOpenState(true);
    modalElement.classList.remove('hidden');
    switchTerminalSubView('cli');
    playSound('terminal');

    const inputElement = getTerminalInput();
    if (inputElement) {
        setTimeout(() => inputElement.focus(), 40);
    }
}

export function closeDrukSystem() {
    if (isCataclysmRunning()) return;
    const wasOpen = isTerminalModalOpen();
    stopSnakeGame();
    stopFlappyDragonGame();
    setTerminalModalOpenState(false);

    const modalElement = getModalElement();
    if (modalElement) {
        modalElement.classList.add('hidden');
    }
    if (wasOpen) {
        playSound('click');
    }
}

function clearCommandHistory() {
    commandHistory = [];
    historyIndex = -1;
}

export function executeTerminalCommand(rawCommand) {
    if (isCataclysmRunning()) return;
    const trimmedCommand = (rawCommand || '').trim();
    if (!trimmedCommand) return;

    switchTerminalSubView('cli');
    appendLine(`druk@sanctuary:~$ ${trimmedCommand}`, 'opacity-80 mt-1');

    commandHistory.push(trimmedCommand);
    historyIndex = commandHistory.length;

    dispatchTerminalCommand(trimmedCommand, {
        executeCommand: executeTerminalCommand,
        closeTerminal: closeDrukSystem,
        openDungeon: openDungeonHandler,
        clearHistory: clearCommandHistory
    });
}

function handleTerminalInputKeydown(event, inputElement) {
    if (event.key === 'ArrowUp') {
        if (commandHistory.length > 0 && historyIndex > 0) {
            event.preventDefault();
            historyIndex--;
            inputElement.value = commandHistory[historyIndex];
        }
        return;
    }

    if (event.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            event.preventDefault();
            historyIndex++;
            inputElement.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            inputElement.value = '';
        }
        return;
    }

    if (event.key === 'Escape') {
        closeDrukSystem();
    }
}

export function initDrukSystem(onCopyEmail, onOpenDungeon) {
    setCopyEmailHandler(onCopyEmail);
    openDungeonHandler = onOpenDungeon;
    initTerminalAppearance();
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
            handleTerminalInputKeydown(event, inputElement);
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

    const modalElement = getModalElement();
    if (modalElement) {
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) {
                closeDrukSystem();
            }
        });
    }
}
