/**************************************************************
 * ATMOSPHERIC GRIMOIRE FLOATING PANEL UI CONTROLLER (cloudPanelUI.js)
 **************************************************************/

import { windSpell } from '../../audio/soundEngine.js';
import { clamp } from '../../utils/mathUtils.js';
import { getCloudConfig, updateCloudConfig } from './cloudSystem.js';
import {
    GRIMOIRE_SCREEN_MARGIN,
    createGrimoirePanel,
    updateSliderAndBadge,
    projectZoneToViewport,
    clampGrimoireVerticalPosition,
    bindNormalizedRangeSlider,
    bindGrimoireOptionButtons
} from './grimoirePanelUtils.js';

export function positionCloudPanelNearBlueMage(blueMageZone, viewportWidth, viewportHeight) {
    const panelElement = document.getElementById('cloudPanel');
    if (!panelElement || !isCloudPanelOpen() || !blueMageZone) return;

    const projectedBlueMageZone = projectZoneToViewport(blueMageZone, viewportWidth, viewportHeight);
    const panelWidth = panelElement.offsetWidth || 256;
    const panelHeight = panelElement.offsetHeight || 296;

    const rightCandidateLeft = projectedBlueMageZone.centerX + 46;
    const leftCandidateLeft = projectedBlueMageZone.centerX - 46 - panelWidth;
    let idealLeft = rightCandidateLeft;

    if (rightCandidateLeft + panelWidth + GRIMOIRE_SCREEN_MARGIN > viewportWidth) {
        idealLeft = leftCandidateLeft >= GRIMOIRE_SCREEN_MARGIN
            ? leftCandidateLeft
            : Math.round(projectedBlueMageZone.centerX - panelWidth / 2);
    }

    const clampedLeft = clamp(
        idealLeft,
        GRIMOIRE_SCREEN_MARGIN,
        viewportWidth - panelWidth - GRIMOIRE_SCREEN_MARGIN
    );

    const idealTop = Math.round(projectedBlueMageZone.baseY - panelHeight / 2 - 18);
    const clampedTop = clampGrimoireVerticalPosition(idealTop, panelHeight, viewportHeight);

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

export function initCloudPanelUI(onBlueMageSpellCast) {
    bindNormalizedRangeSlider('cloudDensitySlider', 'density', updateCloudConfig, syncCloudPanelUI);
    bindNormalizedRangeSlider('cloudWindSlider', 'windSpeed', updateCloudConfig, syncCloudPanelUI);
    bindNormalizedRangeSlider('cloudScaleSlider', 'cloudScale', updateCloudConfig, syncCloudPanelUI);

    bindGrimoireOptionButtons({
        selector: '.cloud-weather-btn[data-cloud-weather]',
        dataAttribute: 'data-cloud-weather',
        configProperty: 'weather',
        updateConfigFn: updateCloudConfig,
        syncUIFn: syncCloudPanelUI,
        playSpellFn: windSpell,
        onSpellCast: onBlueMageSpellCast
    });

    grimoire.init(onBlueMageSpellCast, windSpell);
}
