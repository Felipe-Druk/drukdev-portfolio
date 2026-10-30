/**************************************************************
 * DRUKSYSTEM OS — COMMAND REGISTRY & DISPATCHER
 **************************************************************/

import { playSound } from '../../audio/soundEngine.js';
import { getActiveTerminalTexts, appendLine } from '../terminalDom.js';
import {
    runHelpCommand,
    runLsCommand,
    runClearCommand,
    runDungeonCommand
} from './systemCommands.js';
import { runCvCommand } from './cvCommand.js';
import { runContactCommand } from './contactCommand.js';
import { runColorCommand, runFontCommand } from './appearanceCommands.js';
import { runPlayCommand } from './playCommand.js';

const COMMAND_HANDLERS = {
    help: runHelpCommand,
    '?': runHelpCommand,
    ls: runLsCommand,
    dir: runLsCommand,
    dungeon: runDungeonCommand,
    cv: runCvCommand,
    resume: runCvCommand,
    contacto: runContactCommand,
    contact: runContactCommand,
    links: runContactCommand,
    color: runColorCommand,
    font: runFontCommand,
    play: runPlayCommand,
    snake: (_, context) => runPlayCommand('snake', context),
    flappy: (_, context) => runPlayCommand('flappy', context),
    dragon: (_, context) => runPlayCommand('flappy', context),
    slasher: (_, context) => runPlayCommand('slasher', context),
    clear: runClearCommand,
    cls: runClearCommand,
    exit: (_, context) => context.closeTerminal(),
    cerrar: (_, context) => context.closeTerminal(),
    close: (_, context) => context.closeTerminal(),
    quit: (_, context) => context.closeTerminal()
};

export function dispatchTerminalCommand(rawCommand, context) {
    const commandTokens = rawCommand.toLowerCase().split(/\s+/);
    const commandName = commandTokens[0];
    const commandArgument = commandTokens[1] || '';

    const handler = COMMAND_HANDLERS[commandName];
    if (handler) {
        handler(commandArgument, context);
        return;
    }

    playSound('hit');
    appendLine(getActiveTerminalTexts().unknownCommand(rawCommand));
}
