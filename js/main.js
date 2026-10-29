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

export function setTheme(theme) {
    const activeTheme = setCurrentTheme(theme);
    const uiConfig = THEME_UI[activeTheme];
    if (!uiConfig) return;

    playSound('coin');

    document.body.classList.toggle('theme-cyber', uiConfig.isCyber);

    const btnFantasy = document.getElementById('btnFantasy');
    const btnCyber = document.getElementById('btnCyber');
    if (btnFantasy) btnFantasy.className = uiConfig.btnFantasyClass;
    if (btnCyber) btnCyber.className = uiConfig.btnCyberClass;

    const brandSuffix = document.getElementById('brandSuffix');
    const statusBadge = document.getElementById('statusBadge');
    const themeSubtitle = document.getElementById('themeSubtitle');
    const heroTitle = document.getElementById('heroTitle');
    const progressTask = document.getElementById('progressTask');
    const gameTitle = document.getElementById('gameTitle');
    const attackBtnLabel = document.getElementById('attackBtnLabel');
    const featIcon1 = document.getElementById('featIcon1');
    const featIcon2 = document.getElementById('featIcon2');
    const featIcon3 = document.getElementById('featIcon3');

    if (brandSuffix) brandSuffix.className = uiConfig.brandSuffixClass;
    if (statusBadge) statusBadge.className = uiConfig.statusBadgeClass;
    if (themeSubtitle) themeSubtitle.textContent = uiConfig.themeSubtitle;
    if (heroTitle) heroTitle.textContent = uiConfig.heroTitle;
    if (progressTask) progressTask.textContent = uiConfig.progressTask;
    if (gameTitle) gameTitle.textContent = uiConfig.gameTitle;
    if (attackBtnLabel) attackBtnLabel.textContent = uiConfig.attackBtnLabel;
    if (featIcon1) featIcon1.textContent = uiConfig.featIcons[0];
    if (featIcon2) featIcon2.textContent = uiConfig.featIcons[1];
    if (featIcon3) featIcon3.textContent = uiConfig.featIcons[2];

    renderStaticPreviews(activeTheme);
    spawnCenterDioramaBurst(24);
}

export function handleToggleSound() {
    const enabled = toggleSound();
    const icon = document.getElementById('soundIcon');
    const label = document.getElementById('soundLabel');

    if (enabled) {
        if (icon) icon.className = 'fa-solid fa-volume-high text-bronze';
        if (label) label.textContent = 'SFX ON';
    } else {
        if (icon) icon.className = 'fa-solid fa-volume-xmark text-gray-400';
        if (label) label.textContent = 'MUTE';
    }
}

export function toggleCRT() {
    crtEnabled = !crtEnabled;
    const overlay = document.getElementById('crtOverlay');
    if (overlay) {
        overlay.style.display = crtEnabled ? 'block' : 'none';
    }
    playSound('click');
}

export function showToast(icon, title, msg) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMsg');

    if (toastIcon) toastIcon.textContent = icon;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = msg;

    if (toast) {
        toast.classList.remove('translate-y-24', 'opacity-0');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 3200);
    }
}

export function copyEmail() {
    const email = CONTACT_LINKS.email;
    if (!email) return;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).catch(() => {
            fallbackCopyText(email);
        });
    } else {
        fallbackCopyText(email);
    }

    playSound('coin');
    showToast('📜', '¡EMAIL COPIADO!', `${email} listo para pegar.`);

    const emailBtnText = document.getElementById('emailBtnText');
    if (emailBtnText) {
        emailBtnText.textContent = `¡Copiado! (${email})`;
        clearTimeout(emailBtnResetTimeout);
        emailBtnResetTimeout = setTimeout(() => {
            emailBtnText.textContent = `Copiar Email (${email})`;
        }, 2200);
    }
}

function fallbackCopyText(text) {
    const clipboardTextarea = document.createElement('textarea');
    clipboardTextarea.value = text;
    document.body.appendChild(clipboardTextarea);
    clipboardTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(clipboardTextarea);
}

export function initContactLinks() {
    // 1. Bind all [data-social] buttons dynamically from CONTACT_LINKS.socials
    const socialElements = document.querySelectorAll('[data-social]');
    socialElements.forEach((el) => {
        const networkKey = el.getAttribute('data-social');
        const url = CONTACT_LINKS.socials?.[networkKey];

        if (url && url.trim() !== '') {
            el.setAttribute('href', url.trim());
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });

    // 2. Bind CV link if present ([data-contact="cv"])
    const cvElements = document.querySelectorAll('[data-contact="cv"]');
    cvElements.forEach((el) => {
        const cvUrl = CONTACT_LINKS.cv;
        if (cvUrl && cvUrl.trim() !== '') {
            el.setAttribute('href', cvUrl.trim());
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });

    // 3. Connect Copy Email button (#copy-email-btn / [data-contact="email"])
    const copyEmailBtn = document.getElementById('copy-email-btn') || document.querySelector('[data-contact="email"]');
    const emailBtnText = document.getElementById('emailBtnText');

    if (copyEmailBtn) {
        if (CONTACT_LINKS.email && CONTACT_LINKS.email.trim() !== '') {
            if (emailBtnText) {
                emailBtnText.textContent = `Copiar Email (${CONTACT_LINKS.email})`;
            }
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

    sfxLinks.forEach((link) => {
        link.addEventListener('click', () => playSound('click'));
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
