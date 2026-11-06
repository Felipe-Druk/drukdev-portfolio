/**************************************************************
 * DRUKSYSTEM OS — CONTACT & SOCIAL LINKS COMMAND (contacto, links)
 **************************************************************/

import { CONTACT_LINKS } from '../../config/links.js';
import { playSound } from '../../audio/index.js';
import {
    getActiveTerminalTexts,
    getOutputContainer,
    appendLine,
    scrollToBottom
} from '../terminalDom.js';

let copyEmailCallback = null;

export function setCopyEmailHandler(onCopyEmail) {
    copyEmailCallback = onCopyEmail;
}

function createSocialLinkRow(networkName, socialUrl) {
    const row = document.createElement('div');
    row.className = 'leading-relaxed flex flex-wrap items-center gap-2 pl-2';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = `• ${networkName.toUpperCase().padEnd(10, ' ')} ->`;

    const anchor = document.createElement('a');
    anchor.href = socialUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'term-link';
    anchor.textContent = socialUrl;
    anchor.addEventListener('click', () => playSound('click'));

    row.appendChild(labelSpan);
    row.appendChild(anchor);
    return row;
}

function createEmailRow(emailAddress, terminalTexts) {
    const emailRow = document.createElement('div');
    emailRow.className = 'leading-relaxed flex flex-wrap items-center gap-2 pl-2 mt-1';

    const emailSpan = document.createElement('span');
    emailSpan.textContent = `• EMAIL      -> ${emailAddress}`;

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'term-cmd-chip';
    copyButton.textContent = terminalTexts.copyEmailAction;
    copyButton.addEventListener('click', () => {
        if (typeof copyEmailCallback === 'function') {
            copyEmailCallback();
        }
        copyButton.textContent = getActiveTerminalTexts().copiedEmailAction;
        setTimeout(() => {
            copyButton.textContent = getActiveTerminalTexts().copyEmailAction;
        }, 2000);
    });

    emailRow.appendChild(emailSpan);
    emailRow.appendChild(copyButton);
    return emailRow;
}

export function runContactCommand() {
    const output = getOutputContainer();
    if (!output) return;

    playSound('coin');
    const terminalTexts = getActiveTerminalTexts();
    appendLine(terminalTexts.contactTitle, 'font-bold mt-1');

    Object.entries(CONTACT_LINKS.socials || {}).forEach(([networkName, socialUrl]) => {
        if (!socialUrl || socialUrl.trim() === '') return;
        output.appendChild(createSocialLinkRow(networkName, socialUrl.trim()));
    });

    if (CONTACT_LINKS.email && CONTACT_LINKS.email.trim() !== '') {
        output.appendChild(createEmailRow(CONTACT_LINKS.email.trim(), terminalTexts));
    }

    scrollToBottom();
}
