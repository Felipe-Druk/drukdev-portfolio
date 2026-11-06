/**************************************************************
 * DRUKSYSTEM OS — LOCALIZED PDF CV COMMAND (cv, resume)
 **************************************************************/

import { getLocalizedCvPath } from '../../config/links.js';
import { getCurrentLanguage } from '../../config/i18n.js';
import { playSound } from '../../audio/index.js';
import {
    getActiveTerminalTexts,
    getOutputContainer,
    appendLine,
    scrollToBottom
} from '../terminalDom.js';

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

export function runCvCommand() {
    const output = getOutputContainer();
    if (!output) return;

    const terminalTexts = getActiveTerminalTexts();
    const cvPath = getLocalizedCvPath(getCurrentLanguage());

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
