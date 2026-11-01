/**************************************************************
 * UNIFIED ELEMENTAL MAGE SPRITE RENDERER (GREEN & BLUE MAGES)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import {
    SPRITE_PALETTES,
    getActiveBiomePalette,
    getActiveCloudPalette
} from '../../config/palettes.js';
import { drawRect, drawFloatingPixelLabel } from './canvasUtils.js';

const GREEN_MAGE_BASE_COLORS = SPRITE_PALETTES.mage;
const BLUE_MAGE_BASE_COLORS = SPRITE_PALETTES.blueMage;

const CAST_STAFF_LIFT_Y = -6;
const GEM_PULSE_DIVISOR = 12;

function drawCloudPedestal(context, centerX, pedestalY, cloudPalette) {
    drawRect(context, centerX - 28, pedestalY + 4, 56, 8, cloudPalette.shadow);
    drawRect(context, centerX - 20, pedestalY + 10, 40, 4, cloudPalette.shadow);

    drawRect(context, centerX - 32, pedestalY - 4, 64, 10, cloudPalette.mid);
    drawRect(context, centerX - 24, pedestalY - 8, 48, 8, cloudPalette.mid);

    drawRect(context, centerX - 26, pedestalY - 6, 20, 6, cloudPalette.light);
    drawRect(context, centerX - 10, pedestalY - 10, 22, 6, cloudPalette.light);
    drawRect(context, centerX + 8, pedestalY - 6, 18, 6, cloudPalette.light);
}

function drawMageRobeAndBoots(context, centerX, figureBaseY, staffLiftY, colors, shadowHalfWidth) {
    drawRect(context, centerX - shadowHalfWidth, figureBaseY - 2, shadowHalfWidth * 2, 4, colors.shadowOutline);
    drawRect(context, centerX - 8, figureBaseY - 6, 6, 6, colors.bootLeather);
    drawRect(context, centerX + 2, figureBaseY - 6, 6, 6, colors.bootLeather);

    drawRect(context, centerX - 12, figureBaseY - 24, 24, 18, colors.robeDark);
    drawRect(context, centerX - 10, figureBaseY - 22, 20, 16, colors.robeMid);
    drawRect(context, centerX - 2, figureBaseY - 22, 4, 16, colors.robeLight);

    drawRect(context, centerX - 15, figureBaseY - 20, 5, 10, colors.robeDark);
    drawRect(context, centerX + 10, figureBaseY - 20 + staffLiftY, 5, 10, colors.robeDark);
    drawRect(context, centerX + 11, figureBaseY - 12 + staffLiftY, 4, 4, colors.handBronze);
}

function drawMageHeadAndHat(context, centerX, figureBaseY, colors, isWindSwept) {
    const beardMidOffsetX = isWindSwept ? -5 : -6;
    const beardTipOffsetX = isWindSwept ? -2 : -4;
    const hatUpperMidOffsetX = isWindSwept ? -6 : -7;
    const hatTipBaseOffsetX = isWindSwept ? -2 : -5;
    const hatTipPeakOffsetX = isWindSwept ? 4 : -8;
    const hatTipPeakOffsetY = isWindSwept ? -57 : -56;

    drawRect(context, centerX - 8, figureBaseY - 32, 16, 8, colors.faceShadow);
    drawRect(context, centerX - 5, figureBaseY - 29, 3, 2, colors.eyeGlow);
    drawRect(context, centerX + 2, figureBaseY - 29, 3, 2, colors.eyeGlow);

    drawRect(context, centerX - 8, figureBaseY - 25, 16, 6, colors.beardLight);
    drawRect(context, centerX + beardMidOffsetX, figureBaseY - 19, 12, 6, colors.beardLight);
    drawRect(context, centerX + beardTipOffsetX, figureBaseY - 13, 8, 4, colors.beardTip);

    drawRect(context, centerX - 16, figureBaseY - 34, 32, 4, colors.robeDark);
    drawRect(context, centerX - 12, figureBaseY - 38, 24, 4, colors.hatBand);
    drawRect(context, centerX - 10, figureBaseY - 44, 20, 6, colors.robeMid);
    drawRect(context, centerX + hatUpperMidOffsetX, figureBaseY - 50, 14, 6, colors.robeDark);
    drawRect(context, centerX + hatTipBaseOffsetX, figureBaseY - 54, 12, 4, colors.robeLight);
    drawRect(context, centerX + hatTipPeakOffsetX, figureBaseY + hatTipPeakOffsetY, 8, 3, colors.robeLight);
}

function drawMageStaff(context, centerX, figureBaseY, staffLiftY, isCasting, sanctuaryTick, colors) {
    const staffX = centerX + 14;
    const staffTopY = figureBaseY - 40 + staffLiftY;

    drawRect(context, staffX, staffTopY + 6, 3, 34, colors.staffWoodDark);
    drawRect(context, staffX + 1, staffTopY + 8, 2, 30, colors.staffWoodLight);

    const isGemPulsing = isCasting || (Math.floor(sanctuaryTick / GEM_PULSE_DIVISOR) % 2 === 0);
    if (isCasting) {
        drawRect(context, staffX - 7, staffTopY - 5, 17, 17, colors.staffCastHalo);
    }
    drawRect(context, staffX - 3, staffTopY - 1, 9, 9, colors.robeMid);
    drawRect(context, staffX - 1, staffTopY + 1, 5, 5, isGemPulsing ? colors.gemPulse : colors.robeLight);
}

export function drawElementalMage(context, zone, variantConfig) {
    if (!zone) return;

    const {
        bobY = 0,
        figureOffsetY = 0,
        shadowHalfWidth = 14,
        isWindSwept = false,
        isCasting = false,
        isHovered = false,
        isPanelOpen = false,
        sanctuaryTick = 0,
        hoverLabelKey,
        hoverLabelOffsetY = 68,
        hoverBorderColor,
        cloudPalette = null,
        colors
    } = variantConfig;

    const centerX = zone.centerX;
    const animatedBaseY = zone.baseY + bobY;
    const figureBaseY = animatedBaseY + figureOffsetY;
    const staffLiftY = isCasting ? CAST_STAFF_LIFT_Y : 0;

    if (cloudPalette) {
        drawCloudPedestal(context, centerX, animatedBaseY, cloudPalette);
    }

    drawMageRobeAndBoots(context, centerX, figureBaseY, staffLiftY, colors, shadowHalfWidth);
    drawMageHeadAndHat(context, centerX, figureBaseY, colors, isWindSwept);
    drawMageStaff(context, centerX, figureBaseY, staffLiftY, isCasting, sanctuaryTick, colors);

    if (isHovered && !isPanelOpen && hoverLabelKey) {
        const hoverLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary[hoverLabelKey];
        drawFloatingPixelLabel(
            context,
            centerX,
            animatedBaseY - hoverLabelOffsetY,
            hoverLabel,
            hoverBorderColor || colors.robeLight
        );
    }
}

export function drawGreenMage(
    context,
    mageZone,
    isHovered,
    sanctuaryTick,
    mageCastTimer,
    isFloraPanelOpen = false
) {
    const biomePalette = getActiveBiomePalette();
    const bobY = Math.sin(sanctuaryTick * 0.06) > 0 ? -2 : 0;

    drawElementalMage(context, mageZone, {
        bobY,
        figureOffsetY: 0,
        shadowHalfWidth: 14,
        isWindSwept: false,
        isCasting: mageCastTimer > 0,
        isHovered,
        isPanelOpen: isFloraPanelOpen,
        sanctuaryTick,
        hoverLabelKey: 'mageHover',
        hoverLabelOffsetY: 68,
        hoverBorderColor: biomePalette.tip,
        cloudPalette: null,
        colors: {
            ...GREEN_MAGE_BASE_COLORS,
            robeDark: biomePalette.base,
            robeMid: biomePalette.mid,
            robeLight: biomePalette.tip,
            hatBand: biomePalette.accent,
            gemPulse: biomePalette.accent
        }
    });
}

export function drawBlueMage(
    context,
    blueMageZone,
    isHovered,
    sanctuaryTick,
    blueMageCastTimer = 0,
    isCloudPanelOpen = false,
    celestialProgress = 0
) {
    const cloudPalette = getActiveCloudPalette(celestialProgress);
    const bobY = Math.round(Math.sin(sanctuaryTick * 0.045) * 5);

    drawElementalMage(context, blueMageZone, {
        bobY,
        figureOffsetY: -4,
        shadowHalfWidth: 12,
        isWindSwept: true,
        isCasting: blueMageCastTimer > 0,
        isHovered,
        isPanelOpen: isCloudPanelOpen,
        sanctuaryTick,
        hoverLabelKey: 'blueMageHover',
        hoverLabelOffsetY: 74,
        hoverBorderColor: BLUE_MAGE_BASE_COLORS.robeLight,
        cloudPalette,
        colors: {
            ...BLUE_MAGE_BASE_COLORS,
            hatBand: cloudPalette.accent,
            gemPulse: cloudPalette.accent
        }
    });
}
