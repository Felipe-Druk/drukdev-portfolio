/**************************************************************
 * GRIMOIRE FLOATING PANEL UTILITIES & MUTUAL EXCLUSION REGISTRY
 * (js/graphics/sanctuary/grimoirePanelUtils.js)
 **************************************************************/

import { playSound } from '../../audio/soundEngine.js';

const registeredPanels = new Map();

export function registerGrimoirePanel(panelId, closeCallback) {
    registeredPanels.set(panelId, closeCallback);
}

export function unregisterGrimoirePanel(panelId) {
    registeredPanels.delete(panelId);
}

export function closeOtherGrimoires(activePanelId) {
    for (const [id, closeFn] of registeredPanels.entries()) {
        if (id !== activePanelId && typeof closeFn === 'function') {
            closeFn();
        }
    }
}

export function updateSliderAndBadge(sliderId, badgeId, rawValue, formattedText) {
    const sliderElement = document.getElementById(sliderId);
    const badgeElement = document.getElementById(badgeId);
    if (sliderElement) {
        sliderElement.value = String(rawValue);
    }
    if (badgeElement) {
        badgeElement.textContent = formattedText;
    }
}

export function projectZoneToViewport(zone, viewportWidth, viewportHeight) {
    if (!zone) return null;
    const canvas = document.getElementById('sanctuaryCanvas');
    const scaleX = canvas && canvas.width > 0 ? viewportWidth / canvas.width : 1;
    const scaleY = canvas && canvas.height > 0 ? viewportHeight / canvas.height : 1;

    return {
        ...zone,
        centerX: Math.round(zone.centerX * scaleX),
        baseY: Math.round(zone.baseY * scaleY)
    };
}

export function createGrimoirePanel(config) {
    const {
        panelId,
        closeBtnId,
        reseedBtnId,
        syncUI,
        onReseed,
        positionPanel
    } = config;

    let isOpen = false;

    function getPanelElement() {
        return document.getElementById(panelId);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        const element = getPanelElement();
        if (element) {
            element.classList.add('hidden');
        }
    }

    registerGrimoirePanel(panelId, close);

    function toggle(forceOpen = null, zone = null) {
        const element = getPanelElement();
        if (!element) return false;

        const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;
        if (shouldOpen) {
            closeOtherGrimoires(panelId);
        }

        isOpen = shouldOpen;
        element.classList.toggle('hidden', !shouldOpen);

        if (shouldOpen) {
            if (typeof syncUI === 'function') syncUI();
            if (zone && typeof positionPanel === 'function') {
                positionPanel(zone, window.innerWidth, window.innerHeight);
            }
        }
        return shouldOpen;
    }

    function init(onSpellCast, playSpellFn) {
        const element = getPanelElement();
        isOpen = Boolean(element && !element.classList.contains('hidden'));

        const reseedBtn = document.getElementById(reseedBtnId);
        if (reseedBtn) {
            reseedBtn.addEventListener('click', () => {
                const nextSeed = Math.floor(100000 + Math.random() * 900000);
                if (typeof onReseed === 'function') {
                    onReseed(nextSeed);
                }
                if (typeof syncUI === 'function') syncUI();
                if (typeof playSpellFn === 'function') playSpellFn();
                if (typeof onSpellCast === 'function') {
                    onSpellCast(true);
                }
            });
        }

        const closeBtn = document.getElementById(closeBtnId);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                playSound('click');
                toggle(false);
            });
        }

        if (typeof syncUI === 'function') syncUI();
    }

    return {
        isOpen: () => isOpen,
        toggle,
        init
    };
}
