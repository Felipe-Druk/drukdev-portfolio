/**************************************************************
 * PROCEDURAL GREEN MAGE NPC SPRITE RENDERER
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import { getActiveBiomePalette } from '../sanctuary/floraSystem.js';
import { drawRect, drawFloatingPixelLabel } from './canvasUtils.js';

const IDLE_BOB_FREQUENCY = 0.06;
const IDLE_BOB_OFFSET_Y = -2;
const CAST_STAFF_LIFT_Y = -6;
const GEM_PULSE_DIVISOR = 12;
const HOVER_LABEL_OFFSET_Y = 68;

function drawMageRobeAndBoots(context, centerX, baseY, idleBobY, staffLiftY, palette) {
    drawRect(context, centerX - 14, baseY - 2, 28, 4, '#0D0D0F');
    drawRect(context, centerX - 8, baseY - 6, 6, 6, '#231C1A');
    drawRect(context, centerX + 2, baseY - 6, 6, 6, '#231C1A');

    drawRect(context, centerX - 12, baseY - 24 + idleBobY, 24, 18, palette.base);
    drawRect(context, centerX - 10, baseY - 22 + idleBobY, 20, 16, palette.mid);
    drawRect(context, centerX - 2, baseY - 22 + idleBobY, 4, 16, palette.tip);

    drawRect(context, centerX - 15, baseY - 20 + idleBobY, 5, 10, palette.base);
    drawRect(context, centerX + 10, baseY - 20 + idleBobY + staffLiftY, 5, 10, palette.base);
    drawRect(context, centerX + 11, baseY - 12 + idleBobY + staffLiftY, 4, 4, '#D4957A');
}

function drawMageHeadAndHat(context, centerX, baseY, idleBobY, palette) {
    drawRect(context, centerX - 8, baseY - 32 + idleBobY, 16, 8, '#141116');
    drawRect(context, centerX - 5, baseY - 29 + idleBobY, 3, 2, '#F3D5B5');
    drawRect(context, centerX + 2, baseY - 29 + idleBobY, 3, 2, '#F3D5B5');

    drawRect(context, centerX - 8, baseY - 25 + idleBobY, 16, 6, '#D8E2EB');
    drawRect(context, centerX - 6, baseY - 19 + idleBobY, 12, 6, '#D8E2EB');
    drawRect(context, centerX - 4, baseY - 13 + idleBobY, 8, 4, '#9BA7B4');

    drawRect(context, centerX - 16, baseY - 34 + idleBobY, 32, 4, palette.base);
    drawRect(context, centerX - 12, baseY - 38 + idleBobY, 24, 4, palette.accent);
    drawRect(context, centerX - 10, baseY - 44 + idleBobY, 20, 6, palette.mid);
    drawRect(context, centerX - 7, baseY - 50 + idleBobY, 14, 6, palette.base);
    drawRect(context, centerX - 5, baseY - 54 + idleBobY, 12, 4, palette.tip);
    drawRect(context, centerX - 8, baseY - 56 + idleBobY, 8, 3, palette.tip);
}

function drawMageStaff(context, centerX, baseY, idleBobY, staffLiftY, isCasting, sanctuaryTick, palette) {
    const staffX = centerX + 14;
    const staffTopY = baseY - 40 + idleBobY + staffLiftY;

    drawRect(context, staffX, staffTopY + 6, 3, 34, '#3D271E');
    drawRect(context, staffX + 1, staffTopY + 8, 2, 30, '#5C3A2B');

    const isGemPulsing = isCasting || (Math.floor(sanctuaryTick / GEM_PULSE_DIVISOR) % 2 === 0);
    if (isCasting) {
        drawRect(context, staffX - 7, staffTopY - 5, 17, 17, 'rgba(243, 213, 181, 0.25)');
    }
    drawRect(context, staffX - 3, staffTopY - 1, 9, 9, palette.mid);
    drawRect(context, staffX - 1, staffTopY + 1, 5, 5, isGemPulsing ? palette.accent : palette.tip);
}

export function drawGreenMage(context, mageZone, isHovered, sanctuaryTick, mageCastTimer) {
    const palette = getActiveBiomePalette();
    const centerX = mageZone.centerX;
    const baseY = mageZone.baseY;
    const idleBobY = Math.sin(sanctuaryTick * IDLE_BOB_FREQUENCY) > 0 ? IDLE_BOB_OFFSET_Y : 0;
    const isCasting = mageCastTimer > 0;
    const staffLiftY = isCasting ? CAST_STAFF_LIFT_Y : 0;

    drawMageRobeAndBoots(context, centerX, baseY, idleBobY, staffLiftY, palette);
    drawMageHeadAndHat(context, centerX, baseY, idleBobY, palette);
    drawMageStaff(context, centerX, baseY, idleBobY, staffLiftY, isCasting, sanctuaryTick, palette);

    const panelElement = document.getElementById('floraPanel');
    const isPanelHidden = !panelElement || panelElement.classList.contains('hidden');

    if (isHovered && isPanelHidden) {
        const hoverLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary.mageHover;
        drawFloatingPixelLabel(context, centerX, baseY - HOVER_LABEL_OFFSET_Y + idleBobY, hoverLabel, palette.tip);
    }
}
