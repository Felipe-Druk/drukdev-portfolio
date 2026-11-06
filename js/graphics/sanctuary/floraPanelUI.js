/**************************************************************
 * BOTANICAL GRIMOIRE FLOATING PANEL UI CONTROLLER (floraPanelUI.js)
 **************************************************************/

import { floraSpell } from '../../audio/index.js';
import { clamp } from '../../utils/mathUtils.js';
import { getFloraConfig, updateFloraConfig } from './floraSystem.js';
import {
    GRIMOIRE_SCREEN_MARGIN,
    createGrimoirePanel,
    updateSliderAndBadge,
    projectZoneToViewport,
    clampGrimoireVerticalPosition,
    bindNormalizedRangeSlider,
    bindGrimoireOptionButtons
} from './grimoirePanelUtils.js';

export function positionFloraPanelAboveMage(mageZone, viewportWidth, viewportHeight) {
    const panelElement = document.getElementById('floraPanel');
    if (!panelElement || !isFloraPanelOpen() || !mageZone) return;

    const projectedMageZone = projectZoneToViewport(mageZone, viewportWidth, viewportHeight);
    const panelWidth = panelElement.offsetWidth || 256;
    const panelHeight = panelElement.offsetHeight || 290;

    const idealLeft = Math.round(projectedMageZone.centerX - panelWidth / 2);
    const clampedLeft = clamp(
        idealLeft,
        GRIMOIRE_SCREEN_MARGIN,
        viewportWidth - panelWidth - GRIMOIRE_SCREEN_MARGIN
    );

    const idealTop = Math.round(projectedMageZone.baseY - 68 - panelHeight);
    const clampedTop = clampGrimoireVerticalPosition(idealTop, panelHeight, viewportHeight);

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

export function initFloraPanelUI(onMageSpellCast) {
    bindNormalizedRangeSlider('floraDensitySlider', 'density', updateFloraConfig, syncFloraPanelUI);
    bindNormalizedRangeSlider('floraClumpingSlider', 'clumping', updateFloraConfig, syncFloraPanelUI);
    bindNormalizedRangeSlider('floraLengthSlider', 'grassLength', updateFloraConfig, syncFloraPanelUI);

    bindGrimoireOptionButtons({
        selector: '.flora-biome-btn[data-flora-biome]',
        dataAttribute: 'data-flora-biome',
        configProperty: 'biome',
        updateConfigFn: updateFloraConfig,
        syncUIFn: syncFloraPanelUI,
        playSpellFn: floraSpell,
        onSpellCast: onMageSpellCast
    });

    grimoire.init(onMageSpellCast, floraSpell);
}
