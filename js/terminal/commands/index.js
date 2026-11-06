/**************************************************************
 * DRUKSYSTEM OS — COMMAND REGISTRY & DISPATCHER
 **************************************************************/

import { playSound } from '../../audio/soundEngine.js';
import { getActiveTerminalTexts, appendLine } from '../terminalDom.js';
import {
    runHelpCommand,
    runLsCommand,
    runClearCommand,
    runDungeonCommand,
    runCataclysmCommand
} from './systemCommands.js';
import { runCvCommand } from './cvCommand.js';
import { runContactCommand } from './contactCommand.js';
import { runColorCommand, runFontCommand } from './appearanceCommands.js';
import { runPlayCommand } from './playCommand.js';

const DESTRUCTIVE_COMMAND_PREFIXES = ['rm -rf', 'sudo rm', 'format c:'];
const FORK_BOMB_SIGNATURES = [':(){ :|:& };:', ':(){:|:&};:'];

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

export function isDestructiveCommand(rawCommand) {
    const normalizedCommand = (rawCommand || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!normalizedCommand) return false;

    const matchesPrefix = DESTRUCTIVE_COMMAND_PREFIXES.some(
        (prefix) =>
            normalizedCommand === prefix ||
            normalizedCommand.startsWith(`${prefix} `) ||
            normalizedCommand.startsWith(`${prefix}/`)
    );
    if (matchesPrefix) return true;

    return FORK_BOMB_SIGNATURES.some((signature) => normalizedCommand.includes(signature));
}

export function dispatchTerminalCommand(rawCommand, context) {
    if (isDestructiveCommand(rawCommand)) {
        runCataclysmCommand(context);
        return;
    }

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
