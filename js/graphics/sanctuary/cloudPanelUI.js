/**************************************************************
 * ATMOSPHERIC GRIMOIRE FLOATING PANEL UI CONTROLLER (cloudPanelUI.js)
 **************************************************************/

import { windSpell, playSound } from '../../audio/soundEngine.js';
import {
    clampCloudValue,
    getCloudConfig,
    updateCloudConfig
} from './cloudSystem.js';
import { toggleFloraPanel } from './floraPanelUI.js';

let cloudPanelOpen = false;

export function isCloudPanelOpen() {
    return cloudPanelOpen;
}

export function positionCloudPanelNearBlueMage(blueMageZone, viewportWidth, viewportHeight) {
    const panelElement = document.getElementById('cloudPanel');
    if (!panelElement || !cloudPanelOpen || !blueMageZone) return;

    const panelWidth = panelElement.offsetWidth || 256;
    const panelHeight = panelElement.offsetHeight || 296;
    const screenMargin = 12;

    // Place beside the Blue Mage on wide viewports, or centered horizontally on narrow viewports
    const rightCandidateLeft = blueMageZone.centerX + 46;
    const leftCandidateLeft = blueMageZone.centerX - 46 - panelWidth;
    let idealLeft = rightCandidateLeft;

    if (rightCandidateLeft + panelWidth + screenMargin > viewportWidth) {
        idealLeft = leftCandidateLeft >= screenMargin
            ? leftCandidateLeft
            : Math.round(blueMageZone.centerX - panelWidth / 2);
    }

    const clampedLeft = clampCloudValue(idealLeft, screenMargin, viewportWidth - panelWidth - screenMargin);

    const idealTop = Math.round(blueMageZone.baseY - panelHeight / 2 - 18);
    const minTop = 76;
    const maxTop = Math.max(minTop, viewportHeight - panelHeight - 48);
    const clampedTop = clampCloudValue(idealTop, minTop, maxTop);

    panelElement.style.left = `${clampedLeft}px`;
    panelElement.style.top = `${clampedTop}px`;
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

export function syncCloudPanelUI() {
    const cloudConfig = getCloudConfig();
    const panelElement = document.getElementById('cloudPanel');
    if (panelElement) {
        panelElement.setAttribute('data-cloud-weather', cloudConfig.weather);
    }

    const densityPercent = Math.round(cloudConfig.density * 100);
    const windSliderVal = Math.round(cloudConfig.windSpeed * 100);
    const scaleSliderVal = Math.round(cloudConfig.cloudScale * 100);
    const windPrefix = cloudConfig.windSpeed > 0 ? '+' : '';

    updateSliderAndBadge('cloudDensitySlider', 'cloudDensityVal', densityPercent, `${densityPercent}%`);
    updateSliderAndBadge(
        'cloudWindSlider',
        'cloudWindVal',
        windSliderVal,
        `${windPrefix}${cloudConfig.windSpeed.toFixed(1)}x`
    );
    updateSliderAndBadge(
        'cloudScaleSlider',
        'cloudScaleVal',
        scaleSliderVal,
        `${cloudConfig.cloudScale.toFixed(1)}x`
    );

    document.querySelectorAll('.cloud-weather-btn[data-cloud-weather]').forEach((button) => {
        const weatherKey = button.getAttribute('data-cloud-weather');
        button.classList.toggle('active', weatherKey === cloudConfig.weather);
    });
}

export function toggleCloudPanel(forceOpen = null, blueMageZone = null) {
    const panelElement = document.getElementById('cloudPanel');
    if (!panelElement) return false;

    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !cloudPanelOpen;
    if (shouldOpen) {
        toggleFloraPanel(false);
    }

    cloudPanelOpen = shouldOpen;
    panelElement.classList.toggle('hidden', !shouldOpen);
    if (shouldOpen) {
        syncCloudPanelUI();
        if (blueMageZone) {
            positionCloudPanelNearBlueMage(blueMageZone, window.innerWidth, window.innerHeight);
        }
    }
    return shouldOpen;
}

function bindNormalizedSlider(sliderId, configProperty) {
    const sliderElement = document.getElementById(sliderId);
    if (!sliderElement) return;

    sliderElement.addEventListener('input', (event) => {
        const normalizedValue = parseFloat(event.target.value) / 100;
        updateCloudConfig({ [configProperty]: normalizedValue });
        syncCloudPanelUI();
    });
}

export function initCloudPanelUI(onBlueMageSpellCast) {
    const panelElement = document.getElementById('cloudPanel');
    cloudPanelOpen = Boolean(panelElement && !panelElement.classList.contains('hidden'));

    bindNormalizedSlider('cloudDensitySlider', 'density');
    bindNormalizedSlider('cloudWindSlider', 'windSpeed');
    bindNormalizedSlider('cloudScaleSlider', 'cloudScale');

    document.querySelectorAll('.cloud-weather-btn[data-cloud-weather]').forEach((button) => {
        button.addEventListener('click', () => {
            const selectedWeather = button.getAttribute('data-cloud-weather');
            updateCloudConfig({ weather: selectedWeather });
            syncCloudPanelUI();
            windSpell();
            if (typeof onBlueMageSpellCast === 'function') {
                onBlueMageSpellCast(false);
            }
        });
    });

    const reseedButton = document.getElementById('cloudReseedBtn');
    if (reseedButton) {
        reseedButton.addEventListener('click', () => {
            const nextSeed = Math.floor(100000 + Math.random() * 900000);
            updateCloudConfig({ seed: nextSeed });
            syncCloudPanelUI();
            windSpell();
            if (typeof onBlueMageSpellCast === 'function') {
                onBlueMageSpellCast(true);
            }
        });
    }

    const closeButton = document.getElementById('cloudCloseBtn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            playSound('click');
            toggleCloudPanel(false);
        });
    }

    syncCloudPanelUI();
}
