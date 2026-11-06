/**************************************************************
 * DRUKSYSTEM OS — ARCADE CARTRIDGE LAUNCHER COMMAND (play)
 **************************************************************/

import { playSound } from '../../audio/index.js';
import { startSnakeGame } from '../../game/snakeGame.js';
import { startFlappyDragonGame } from '../../game/flappyDragon.js';
import { startGame as startBugSlasherGame } from '../../game/bugSlasher.js';
import {
    getActiveTerminalTexts,
    getOutputContainer,
    appendBlockLines,
    scrollToBottom,
    switchTerminalSubView,
    returnToTerminalPrompt
} from '../terminalDom.js';

function createPlayActionChip(label, command, onExecuteCommand) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'term-cmd-chip';
    button.textContent = label;
    button.addEventListener('click', () => onExecuteCommand(command));
    return button;
}

function renderPlayMenuBlock(onExecuteCommand) {
    const output = getOutputContainer();
    if (!output) return;

    appendBlockLines(getActiveTerminalTexts().playListLines);

    const actionsRow = document.createElement('div');
    actionsRow.className = 'flex flex-wrap gap-2 pl-2 my-1';
    actionsRow.appendChild(createPlayActionChip('▶ [play snake]', 'play snake', onExecuteCommand));
    actionsRow.appendChild(createPlayActionChip('▶ [play flappy]', 'play flappy', onExecuteCommand));
    actionsRow.appendChild(createPlayActionChip('▶ [play slasher]', 'play slasher', onExecuteCommand));

    output.appendChild(actionsRow);
    scrollToBottom();
}

export function runPlayCommand(commandArgument, context) {
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
    renderPlayMenuBlock(context.executeCommand);
}
