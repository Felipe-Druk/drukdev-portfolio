/**************************************************************
 * MAIN APPLICATION ENTRY POINT
 **************************************************************/

import { THEME_UI, setCurrentTheme } from './config/themes.js';
import { CONTACT_LINKS } from './config/links.js';
import { playSound, toggleSound } from './audio/soundEngine.js';
import { renderStaticPreviews } from './graphics/sprites.js';
import {
    initDiorama,
    resizeDiorama,
    spawnCenterDioramaBurst,
    updateAndDrawDiorama,
    initBgCanvas,
    updateAndDrawBg
} from './graphics/diorama.js';
import {
    initGame,
    startGame,
    triggerJump,
    triggerAttack,
    updateAndDrawGame
} from './game/bugSlasher.js';

let crtEnabled = true;
let toastTimeout = null;
let emailBtnResetTimeout = null;

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

export function setTheme(theme) {
    const activeTheme = setCurrentTheme(theme);
    const uiConfig = THEME_UI[activeTheme];
    if (!uiConfig) return;

    playSound('coin');
    document.body.classList.toggle('theme-cyber', uiConfig.isCyber);

    setElementClass('btnFantasy', uiConfig.btnFantasyClass);
    setElementClass('btnCyber', uiConfig.btnCyberClass);
    setElementClass('brandSuffix', uiConfig.brandSuffixClass);
    setElementClass('statusBadge', uiConfig.statusBadgeClass);

    setElementText('themeSubtitle', uiConfig.themeSubtitle);
    setElementText('heroTitle', uiConfig.heroTitle);
    setElementText('progressTask', uiConfig.progressTask);
    setElementText('gameTitle', uiConfig.gameTitle);
    setElementText('attackBtnLabel', uiConfig.attackBtnLabel);
    setElementText('featIcon1', uiConfig.featIcons[0]);
    setElementText('featIcon2', uiConfig.featIcons[1]);
    setElementText('featIcon3', uiConfig.featIcons[2]);

    renderStaticPreviews(activeTheme);
    spawnCenterDioramaBurst(24);
}

export function handleToggleSound() {
    const enabled = toggleSound();
    if (enabled) {
        setElementClass('soundIcon', 'fa-solid fa-volume-high text-bronze');
        setElementText('soundLabel', 'SFX ON');
    } else {
        setElementClass('soundIcon', 'fa-solid fa-volume-xmark text-gray-400');
        setElementText('soundLabel', 'MUTE');
    }
}

export function toggleCRT() {
    crtEnabled = !crtEnabled;
    const crtOverlayElement = document.getElementById('crtOverlay');
    if (crtOverlayElement) {
        crtOverlayElement.style.display = crtEnabled ? 'block' : 'none';
    }
    playSound('click');
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

function fallbackCopyTextToClipboard(text) {
    const clipboardTextarea = document.createElement('textarea');
    clipboardTextarea.value = text;
    document.body.appendChild(clipboardTextarea);
    clipboardTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(clipboardTextarea);
}

export function copyEmail() {
    const emailAddress = CONTACT_LINKS.email;
    if (!emailAddress) return;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(emailAddress).catch(() => {
            fallbackCopyTextToClipboard(emailAddress);
        });
    } else {
        fallbackCopyTextToClipboard(emailAddress);
    }

    playSound('coin');
    showToast('📜', '¡EMAIL COPIADO!', `${emailAddress} listo para pegar.`);

    setElementText('emailBtnText', `¡Copiado! (${emailAddress})`);
    clearTimeout(emailBtnResetTimeout);
    emailBtnResetTimeout = setTimeout(() => {
        setElementText('emailBtnText', `Copiar Email (${emailAddress})`);
    }, 2200);
}

function configureExternalLinkElement(linkElement, rawUrl) {
    const normalizedUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
    if (normalizedUrl !== '') {
        linkElement.setAttribute('href', normalizedUrl);
        linkElement.setAttribute('target', '_blank');
        linkElement.setAttribute('rel', 'noopener noreferrer');
        linkElement.style.display = '';
    } else {
        linkElement.style.display = 'none';
    }
}

export function initContactLinks() {
    const socialElements = document.querySelectorAll('[data-social]');
    socialElements.forEach((socialElement) => {
        const networkKey = socialElement.getAttribute('data-social');
        const socialUrl = CONTACT_LINKS.socials?.[networkKey];
        configureExternalLinkElement(socialElement, socialUrl);
    });

    const cvElements = document.querySelectorAll('[data-contact="cv"]');
    cvElements.forEach((cvElement) => {
        configureExternalLinkElement(cvElement, CONTACT_LINKS.cv);
    });

    const copyEmailBtn = document.getElementById('copy-email-btn') || document.querySelector('[data-contact="email"]');
    if (copyEmailBtn) {
        const emailAddress = typeof CONTACT_LINKS.email === 'string' ? CONTACT_LINKS.email.trim() : '';
        if (emailAddress !== '') {
            setElementText('emailBtnText', `Copiar Email (${emailAddress})`);
            copyEmailBtn.addEventListener('click', copyEmail);
        } else {
            copyEmailBtn.style.display = 'none';
        }
    }
}

function bindUIEvents() {
    const btnFantasy = document.getElementById('btnFantasy');
    const btnCyber = document.getElementById('btnCyber');
    const btnSound = document.getElementById('btnSound');
    const btnCrt = document.getElementById('btnCrt');
    const sfxLinks = document.querySelectorAll('[data-sfx="click"]');

    if (btnFantasy) btnFantasy.addEventListener('click', () => setTheme('fantasy'));
    if (btnCyber) btnCyber.addEventListener('click', () => setTheme('cyber'));
    if (btnSound) btnSound.addEventListener('click', handleToggleSound);
    if (btnCrt) btnCrt.addEventListener('click', toggleCRT);

    sfxLinks.forEach((linkElement) => {
        linkElement.addEventListener('click', () => playSound('click'));
    });

    window.addEventListener('resize', () => {
        initBgCanvas();
        resizeDiorama();
    });
}

function mainLoop() {
    updateAndDrawBg();
    updateAndDrawDiorama();
    updateAndDrawGame();
    requestAnimationFrame(mainLoop);
}

function initApp() {
    initContactLinks();
    bindUIEvents();
    initBgCanvas();
    initDiorama();
    initGame();
    renderStaticPreviews();
    mainLoop();
}

// Expose helpers on window for backwards compatibility or debugging
Object.assign(window, {
    setTheme,
    toggleSound: handleToggleSound,
    toggleCRT,
    copyEmail,
    playSound,
    startGame,
    triggerJump,
    triggerAttack
});

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
