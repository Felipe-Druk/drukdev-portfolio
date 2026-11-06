/**************************************************************
 * MAIN APPLICATION ENTRY POINT — SANCTUARY & DRUKSYSTEM OS
 **************************************************************/

import { CONTACT_LINKS } from './config/links.js';
import {
    TRANSLATIONS,
    getCurrentLanguage,
    setCurrentLanguage,
    getTranslationByKey
} from './config/i18n.js';
import { audio, playSound } from './audio/index.js';
import { copyTextToClipboard } from './utils/clipboard.js';
import { renderStaticPreviews } from './graphics/sprites/index.js';
import { closeAllGrimoires } from './graphics/sanctuary/grimoirePanelUtils.js';
import {
    initSanctuary,
    resizeSanctuary,
    updateAndDrawSanctuary
} from './graphics/sanctuary.js';
import {
    initDrukSystem,
    openDrukSystem,
    closeDrukSystem,
    executeTerminalCommand,
    renderBootBanner,
    isTerminalModalOpen,
    isSlasherViewActive
} from './terminal/drukSystem.js';
import {
    initDungeonUI,
    openDungeonModal,
    closeDungeonModal,
    refreshDungeonLanguage,
    isDungeonModalOpen
} from './dungeon/dungeonUI.js';
import {
    initGame,
    refreshGameOverlayLanguage,
    updateAndDrawGame
} from './game/bugSlasher.js';

const TARGET_FRAME_DURATION_MS = 1000 / 60;
let toastTimeout = null;
let lastMainFrameTimestamp = 0;

function setElementText(elementId, textValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = textValue;
    }
}

function setElementClass(elementId, classNameValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.className = classNameValue;
    }
}

function getNormalizedContactEmail() {
    return typeof CONTACT_LINKS.email === 'string' ? CONTACT_LINKS.email.trim() : '';
}

function updateSoundButtonLabel(language = getCurrentLanguage()) {
    const navTexts = TRANSLATIONS[language].nav;
    const enabled = !audio.isMuted();
    setElementText('soundIcon', enabled ? '[+]' : '[x]');
    setElementClass('soundIcon', enabled ? 'text-bronze' : 'text-gray-400');
    setElementText('soundLabel', enabled ? navTexts.sfxOn : navTexts.sfxMute);
}

function applyTranslationsByAttribute(attributeName, activeLanguage, applyValueCallback) {
    document.querySelectorAll(`[${attributeName}]`).forEach((element) => {
        const translationKey = element.getAttribute(attributeName);
        const translatedValue = getTranslationByKey(translationKey, activeLanguage);
        if (typeof translatedValue === 'string') {
            applyValueCallback(element, translatedValue);
        }
    });
}

export function setLanguage(language) {
    const activeLanguage = setCurrentLanguage(language);
    document.documentElement.lang = activeLanguage;

    applyTranslationsByAttribute('data-i18n', activeLanguage, (element, value) => {
        element.textContent = value;
    });
    applyTranslationsByAttribute('data-i18n-html', activeLanguage, (element, value) => {
        element.innerHTML = value;
    });
    applyTranslationsByAttribute('data-i18n-title', activeLanguage, (element, value) => {
        element.setAttribute('title', value);
    });
    applyTranslationsByAttribute('data-i18n-placeholder', activeLanguage, (element, value) => {
        element.setAttribute('placeholder', value);
    });

    updateSoundButtonLabel(activeLanguage);
    refreshGameOverlayLanguage();
    refreshDungeonLanguage();
    renderBootBanner();

    const langEsOption = document.getElementById('langEsOption');
    const langEnOption = document.getElementById('langEnOption');
    if (langEsOption) langEsOption.classList.toggle('active', activeLanguage === 'es');
    if (langEnOption) langEnOption.classList.toggle('active', activeLanguage === 'en');
}

export function toggleLanguage() {
    const nextLanguage = getCurrentLanguage() === 'es' ? 'en' : 'es';
    playSound('click');
    setLanguage(nextLanguage);
}

export function handleToggleSound() {
    audio.toggleMute();
    updateSoundButtonLabel();
}

export function showToast(icon, title, message) {
    setElementText('toastIcon', icon);
    setElementText('toastTitle', title);
    setElementText('toastMsg', message);

    const toastElement = document.getElementById('toast');
    if (toastElement) {
        toastElement.classList.remove('translate-y-24', 'opacity-0');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastElement.classList.add('translate-y-24', 'opacity-0');
        }, 3200);
    }
}

export function copyEmail() {
    const emailAddress = getNormalizedContactEmail();
    if (!emailAddress) return;

    copyTextToClipboard(emailAddress);

    const activeLangTexts = TRANSLATIONS[getCurrentLanguage()];
    playSound('coin');
    showToast('[OK]', activeLangTexts.toast.copiedTitle, activeLangTexts.toast.copiedMsg(emailAddress));
}

function bindUIEvents() {
    const btnOpenTerminal = document.getElementById('btnOpenTerminal');
    const langToggleBtn = document.getElementById('lang-toggle');
    const btnSound = document.getElementById('btnSound');

    if (btnOpenTerminal) {
        btnOpenTerminal.addEventListener('click', () => {
            closeAllGrimoires();
            openDrukSystem();
        });
    }
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (btnSound) btnSound.addEventListener('click', handleToggleSound);

    window.addEventListener('resize', () => {
        resizeSanctuary();
    });
}

function mainLoop(currentTimestamp = performance.now()) {
    if (currentTimestamp - lastMainFrameTimestamp >= TARGET_FRAME_DURATION_MS - 1) {
        lastMainFrameTimestamp = currentTimestamp;
        if (!isDungeonModalOpen() && !isTerminalModalOpen()) {
            updateAndDrawSanctuary();
        }
        if (isSlasherViewActive()) {
            updateAndDrawGame();
        }
    }
    requestAnimationFrame(mainLoop);
}

function initApp() {
    const handleOpenTerminal = () => {
        closeAllGrimoires();
        openDrukSystem();
    };
    const openDefaultDungeon = () => {
        closeAllGrimoires();
        openDungeonModal('select');
    };
    initSanctuary(handleOpenTerminal, openDefaultDungeon, copyEmail);
    initDrukSystem(copyEmail, openDefaultDungeon);
    initDungeonUI();
    initGame();
    updateAndDrawGame();
    renderStaticPreviews();
    setLanguage(getCurrentLanguage());
    bindUIEvents();
    mainLoop();
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
