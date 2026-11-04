/**************************************************************
 * BOTANICAL GRIMOIRE FLOATING PANEL UI CONTROLLER (floraPanelUI.js)
 **************************************************************/

import { floraSpell } from '../../audio/soundEngine.js';
import { clamp } from '../../utils/mathUtils.js';
import { getFloraConfig, updateFloraConfig } from './floraSystem.js';
import {
    createGrimoirePanel,
    updateSliderAndBadge,
    projectZoneToViewport
} from './grimoirePanelUtils.js';

export function positionFloraPanelAboveMage(mageZone, viewportWidth, viewportHeight) {
    const panelElement = document.getElementById('floraPanel');
    if (!panelElement || !isFloraPanelOpen() || !mageZone) return;

    const projectedMageZone = projectZoneToViewport(mageZone, viewportWidth, viewportHeight);
    const panelWidth = panelElement.offsetWidth || 256;
    const panelHeight = panelElement.offsetHeight || 290;
    const screenMargin = 12;

    const idealLeft = Math.round(projectedMageZone.centerX - panelWidth / 2);
    const clampedLeft = clamp(idealLeft, screenMargin, viewportWidth - panelWidth - screenMargin);

    const idealTop = Math.round(projectedMageZone.baseY - 68 - panelHeight);
    const minTop = 76;
    const maxTop = Math.max(minTop, viewportHeight - panelHeight - 48);
    const clampedTop = clamp(idealTop, minTop, maxTop);

    panelElement.style.left = `${clampedLeft}px`;
    panelElement.style.top = `${clampedTop}px`;

    const arrowElement = document.getElementById('floraPanelArrow');
    if (arrowElement) {
        const arrowLocalX = clamp(projectedMageZone.centerX - clampedLeft, 18, panelWidth - 18);
        arrowElement.style.left = `${arrowLocalX}px`;
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

const grimoire = createGrimoirePanel({
    panelId: 'floraPanel',
    closeBtnId: 'floraCloseBtn',
    reseedBtnId: 'floraReseedBtn',
    syncUI: syncFloraPanelUI,
    onReseed: (nextSeed) => updateFloraConfig({ seed: nextSeed }),
    positionPanel: positionFloraPanelAboveMage
});

export const isFloraPanelOpen = grimoire.isOpen;
export const toggleFloraPanel = grimoire.toggle;

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

    grimoire.init(onMageSpellCast, floraSpell);
}
