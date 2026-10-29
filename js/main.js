/**************************************************************
 * MAIN APPLICATION ENTRY POINT
 **************************************************************/

import { THEME_UI, getCurrentTheme, setCurrentTheme } from './config/themes.js';
import { CONTACT_LINKS } from './config/links.js';
import {
    TRANSLATIONS,
    getCurrentLanguage,
    setCurrentLanguage,
    getTranslationByKey
} from './config/i18n.js';
import { playSound, toggleSound, isSoundEnabled } from './audio/soundEngine.js';
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
    refreshGameOverlayLanguage,
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

function applyThemeTexts(theme = getCurrentTheme(), language = getCurrentLanguage()) {
    const themeTexts = TRANSLATIONS[language]?.themes?.[theme];
    if (!themeTexts) return;

    setElementText('themeSubtitle', themeTexts.themeSubtitle);
    setElementText('heroTitle', themeTexts.heroTitle);
    setElementText('progressTask', themeTexts.progressTask);
    setElementText('gameTitle', themeTexts.gameTitle);
    setElementText('attackBtnLabel', themeTexts.attackBtnLabel);
}

function updateEmailButtonLabel(language = getCurrentLanguage()) {
    const emailAddress = typeof CONTACT_LINKS.email === 'string' ? CONTACT_LINKS.email.trim() : '';
    if (!emailAddress) return;
    const copyLabel = TRANSLATIONS[language].hero.copyEmailBtn;
    setElementText('emailBtnText', `${copyLabel} (${emailAddress})`);
}

function updateSoundButtonLabel(language = getCurrentLanguage()) {
    const navTexts = TRANSLATIONS[language].nav;
    setElementText('soundLabel', isSoundEnabled() ? navTexts.sfxOn : navTexts.sfxMute);
}

export function setLanguage(language) {
    const activeLanguage = setCurrentLanguage(language);
    document.documentElement.lang = activeLanguage;

    // 1. Update all [data-i18n] text elements
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        const translatedValue = getTranslationByKey(key, activeLanguage);
        if (typeof translatedValue === 'string') {
            element.textContent = translatedValue;
        }
    });

    // 2. Update all [data-i18n-html] rich-text elements
    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
        const key = element.getAttribute('data-i18n-html');
        const translatedHtml = getTranslationByKey(key, activeLanguage);
        if (typeof translatedHtml === 'string') {
            element.innerHTML = translatedHtml;
        }
    });

    // 3. Update all [data-i18n-title] tooltip attributes
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
        const key = element.getAttribute('data-i18n-title');
        const translatedTitle = getTranslationByKey(key, activeLanguage);
        if (typeof translatedTitle === 'string') {
            element.setAttribute('title', translatedTitle);
        }
    });

    // 4. Update dynamic theme-dependent texts, game overlay, and control labels
    applyThemeTexts(getCurrentTheme(), activeLanguage);
    updateEmailButtonLabel(activeLanguage);
    updateSoundButtonLabel(activeLanguage);
    refreshGameOverlayLanguage();

    // 5. Update #lang-toggle visual state (ES | EN)
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

    setElementText('featIcon1', uiConfig.featIcons[0]);
    setElementText('featIcon2', uiConfig.featIcons[1]);
    setElementText('featIcon3', uiConfig.featIcons[2]);

    applyThemeTexts(activeTheme, getCurrentLanguage());
    renderStaticPreviews(activeTheme);
    spawnCenterDioramaBurst(24);
}

export function handleToggleSound() {
    const enabled = toggleSound();
    const navTexts = TRANSLATIONS[getCurrentLanguage()].nav;
    if (enabled) {
        setElementClass('soundIcon', 'fa-solid fa-volume-high text-bronze');
        setElementText('soundLabel', navTexts.sfxOn);
    } else {
        setElementClass('soundIcon', 'fa-solid fa-volume-xmark text-gray-400');
        setElementText('soundLabel', navTexts.sfxMute);
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

    const activeLangTexts = TRANSLATIONS[getCurrentLanguage()];
    playSound('coin');
    showToast('📜', activeLangTexts.toast.copiedTitle, activeLangTexts.toast.copiedMsg(emailAddress));

    setElementText('emailBtnText', `${activeLangTexts.hero.copiedEmailBtn} (${emailAddress})`);
    clearTimeout(emailBtnResetTimeout);
    emailBtnResetTimeout = setTimeout(() => {
        updateEmailButtonLabel();
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
            updateEmailButtonLabel();
            copyEmailBtn.addEventListener('click', copyEmail);
        } else {
            copyEmailBtn.style.display = 'none';
        }
    }
}

function bindUIEvents() {
    const btnFantasy = document.getElementById('btnFantasy');
    const btnCyber = document.getElementById('btnCyber');
    const langToggleBtn = document.getElementById('lang-toggle');
    const btnSound = document.getElementById('btnSound');
    const btnCrt = document.getElementById('btnCrt');
    const sfxLinks = document.querySelectorAll('[data-sfx="click"]');

    if (btnFantasy) btnFantasy.addEventListener('click', () => setTheme('fantasy'));
    if (btnCyber) btnCyber.addEventListener('click', () => setTheme('cyber'));
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
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
    setLanguage(getCurrentLanguage());
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
    setLanguage,
    toggleLanguage,
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
