/**************************************************************
 * ATMOSPHERIC GRIMOIRE FLOATING PANEL UI CONTROLLER (cloudPanelUI.js)
 **************************************************************/

import { windSpell } from '../../audio/soundEngine.js';
import { clamp } from '../../utils/mathUtils.js';
import { getCloudConfig, updateCloudConfig } from './cloudSystem.js';
import {
    createGrimoirePanel,
    updateSliderAndBadge
} from './grimoirePanelUtils.js';

export function positionCloudPanelNearBlueMage(blueMageZone, viewportWidth, viewportHeight) {
    const panelElement = document.getElementById('cloudPanel');
    if (!panelElement || !isCloudPanelOpen() || !blueMageZone) return;

    const panelWidth = panelElement.offsetWidth || 256;
    const panelHeight = panelElement.offsetHeight || 296;
    const screenMargin = 12;

    const rightCandidateLeft = blueMageZone.centerX + 46;
    const leftCandidateLeft = blueMageZone.centerX - 46 - panelWidth;
    let idealLeft = rightCandidateLeft;

    if (rightCandidateLeft + panelWidth + screenMargin > viewportWidth) {
        idealLeft = leftCandidateLeft >= screenMargin
            ? leftCandidateLeft
            : Math.round(blueMageZone.centerX - panelWidth / 2);
    }

    const clampedLeft = clamp(idealLeft, screenMargin, viewportWidth - panelWidth - screenMargin);

    const idealTop = Math.round(blueMageZone.baseY - panelHeight / 2 - 18);
    const minTop = 76;
    const maxTop = Math.max(minTop, viewportHeight - panelHeight - 48);
    const clampedTop = clamp(idealTop, minTop, maxTop);

    panelElement.style.left = `${clampedLeft}px`;
    panelElement.style.top = `${clampedTop}px`;
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

const grimoire = createGrimoirePanel({
    panelId: 'cloudPanel',
    closeBtnId: 'cloudCloseBtn',
    reseedBtnId: 'cloudReseedBtn',
    syncUI: syncCloudPanelUI,
    onReseed: (nextSeed) => updateCloudConfig({ seed: nextSeed }),
    positionPanel: positionCloudPanelNearBlueMage
});

export const isCloudPanelOpen = grimoire.isOpen;
export const toggleCloudPanel = grimoire.toggle;

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

    grimoire.init(onBlueMageSpellCast, windSpell);
}
