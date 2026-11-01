/**************************************************************
 * BOTANICAL GRIMOIRE FLOATING PANEL UI CONTROLLER (floraPanelUI.js)
 **************************************************************/

import { floraSpell, playSound } from '../../audio/soundEngine.js';
import {
    clampFloraValue,
    getFloraConfig,
    updateFloraConfig
} from './floraSystem.js';
import { toggleCloudPanel } from './cloudPanelUI.js';

let floraPanelOpen = false;

export function isFloraPanelOpen() {
    return floraPanelOpen;
}

export function positionFloraPanelAboveMage(mageZone, viewportWidth, viewportHeight) {
    const panelElement = document.getElementById('floraPanel');
    if (!panelElement || !floraPanelOpen || !mageZone) return;

    const panelWidth = panelElement.offsetWidth || 256;
    const panelHeight = panelElement.offsetHeight || 290;
    const screenMargin = 12;

    const idealLeft = Math.round(mageZone.centerX - panelWidth / 2);
    const clampedLeft = clampFloraValue(idealLeft, screenMargin, viewportWidth - panelWidth - screenMargin);

    const idealTop = Math.round(mageZone.baseY - 68 - panelHeight);
    const minTop = 76;
    const maxTop = Math.max(minTop, viewportHeight - panelHeight - 48);
    const clampedTop = clampFloraValue(idealTop, minTop, maxTop);

    panelElement.style.left = `${clampedLeft}px`;
    panelElement.style.top = `${clampedTop}px`;

    const arrowElement = document.getElementById('floraPanelArrow');
    if (arrowElement) {
        const arrowLocalX = clampFloraValue(mageZone.centerX - clampedLeft, 18, panelWidth - 18);
        arrowElement.style.left = `${arrowLocalX}px`;
    }
}

function updateSliderAndBadge(sliderId, badgeId, rawValue, formattedText) {
    const sliderElement = document.getElementById(sliderId);
    const badgeElement = document.getElementById(badgeId);
    if (sliderElement) {
        sliderElement.value = String(rawValue);
    }
    if (badgeElement) {
        badgeElement.textContent = formattedText;
    }
}

export function syncFloraPanelUI() {
    const floraConfig = getFloraConfig();
    const panelElement = document.getElementById('floraPanel');
    if (panelElement) {
        panelElement.setAttribute('data-flora-biome', floraConfig.biome);
    }

    const densityPercent = Math.round(floraConfig.density * 100);
    const clumpingPercent = Math.round(floraConfig.clumping * 100);
    const lengthPercent = Math.round(floraConfig.grassLength * 100);

    updateSliderAndBadge('floraDensitySlider', 'floraDensityVal', densityPercent, `${densityPercent}%`);
    updateSliderAndBadge('floraClumpingSlider', 'floraClumpingVal', clumpingPercent, `${clumpingPercent}%`);
    updateSliderAndBadge('floraLengthSlider', 'floraLengthVal', lengthPercent, `${floraConfig.grassLength.toFixed(1)}x`);

    document.querySelectorAll('.flora-biome-btn[data-flora-biome]').forEach((button) => {
        const biomeKey = button.getAttribute('data-flora-biome');
        button.classList.toggle('active', biomeKey === floraConfig.biome);
    });
}

export function toggleFloraPanel(forceOpen = null, mageZone = null) {
    const panelElement = document.getElementById('floraPanel');
    if (!panelElement) return false;

    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !floraPanelOpen;
    if (shouldOpen) {
        toggleCloudPanel(false);
    }

    floraPanelOpen = shouldOpen;
    panelElement.classList.toggle('hidden', !shouldOpen);
    if (shouldOpen) {
        syncFloraPanelUI();
        if (mageZone) {
            positionFloraPanelAboveMage(mageZone, window.innerWidth, window.innerHeight);
        }
    }
    return shouldOpen;
}

function bindPercentageSlider(sliderId, configProperty) {
    const sliderElement = document.getElementById(sliderId);
    if (!sliderElement) return;

    sliderElement.addEventListener('input', (event) => {
        const normalizedValue = parseInt(event.target.value, 10) / 100;
        updateFloraConfig({ [configProperty]: normalizedValue });
        syncFloraPanelUI();
    });
}

export function initFloraPanelUI(onMageSpellCast) {
    const panelElement = document.getElementById('floraPanel');
    floraPanelOpen = Boolean(panelElement && !panelElement.classList.contains('hidden'));

    bindPercentageSlider('floraDensitySlider', 'density');
    bindPercentageSlider('floraClumpingSlider', 'clumping');
    bindPercentageSlider('floraLengthSlider', 'grassLength');

    document.querySelectorAll('.flora-biome-btn[data-flora-biome]').forEach((button) => {
        button.addEventListener('click', () => {
            const selectedBiome = button.getAttribute('data-flora-biome');
            updateFloraConfig({ biome: selectedBiome });
            syncFloraPanelUI();
            floraSpell();
            if (typeof onMageSpellCast === 'function') {
                onMageSpellCast(false);
            }
        });
    });

    const reseedButton = document.getElementById('floraReseedBtn');
    if (reseedButton) {
        reseedButton.addEventListener('click', () => {
            const nextSeed = Math.floor(100000 + Math.random() * 900000);
            updateFloraConfig({ seed: nextSeed });
            syncFloraPanelUI();
            floraSpell();
            if (typeof onMageSpellCast === 'function') {
                onMageSpellCast(true);
            }
        });
    }

    const closeButton = document.getElementById('floraCloseBtn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            playSound('click');
            toggleFloraPanel(false);
        });
    }

    syncFloraPanelUI();
}
