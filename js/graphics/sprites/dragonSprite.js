/**************************************************************
 * PROCEDURAL DRUK DRAGON & GUARDIAN SPRITE RENDERERS
 **************************************************************/

import { SPRITE_PALETTES } from '../../config/palettes.js';
import { drawRect } from './canvasUtils.js';

const DRAGON_PALETTE = SPRITE_PALETTES.dragon;

export function drawDragonKnightGuardian(context, originX, originY, pixelUnit = 3) {
    const u = pixelUnit;

    // Horns & Dragon Crest
    drawRect(context, originX + 2 * u, originY, u, 2 * u, DRAGON_PALETTE.chestBronze);
    drawRect(context, originX + 9 * u, originY, u, 2 * u, DRAGON_PALETTE.chestBronze);
    drawRect(context, originX + 4 * u, originY, 4 * u, u, DRAGON_PALETTE.scaleBase);
    drawRect(context, originX + 3 * u, originY + u, 6 * u, u, DRAGON_PALETTE.scaleLight);

    // Visor & Luminous Eyes
    drawRect(context, originX + 2 * u, originY + 2 * u, 8 * u, 2 * u, DRAGON_PALETTE.shadowDark);
    drawRect(context, originX + 3 * u, originY + 2 * u, 2 * u, u, DRAGON_PALETTE.chestBronze);
    drawRect(context, originX + 7 * u, originY + 2 * u, 2 * u, u, DRAGON_PALETTE.chestBronze);

    // Dragon Wing Cape & Pauldrons
    drawRect(context, originX, originY + 5 * u, 2 * u, 3 * u, DRAGON_PALETTE.scaleBase);
    drawRect(context, originX + 10 * u, originY + 5 * u, 2 * u, 3 * u, DRAGON_PALETTE.scaleBase);
    drawRect(context, originX + u, originY + 4 * u, 10 * u, 4 * u, DRAGON_PALETTE.scaleLight);

    // Warm Bronze Chestplate
    drawRect(context, originX + 3 * u, originY + 4 * u, 6 * u, 5 * u, DRAGON_PALETTE.chestBronze);
    drawRect(context, originX + 4 * u, originY + 5 * u, 4 * u, 3 * u, DRAGON_PALETTE.hornGlow);

    // Greaves & Forged Boots
    drawRect(context, originX + 3 * u, originY + 9 * u, 2 * u, 2 * u, DRAGON_PALETTE.scaleBase);
    drawRect(context, originX + 7 * u, originY + 9 * u, 2 * u, 2 * u, DRAGON_PALETTE.scaleBase);
    drawRect(context, originX + 2 * u, originY + 11 * u, 3 * u, u, DRAGON_PALETTE.shadowDark);
    drawRect(context, originX + 7 * u, originY + 11 * u, 3 * u, u, DRAGON_PALETTE.shadowDark);
}

export function drawFlyingDragon(context, centerX, centerY, isFlappingDown = false, tiltAngle = 0) {
    context.save();
    context.translate(Math.floor(centerX), Math.floor(centerY));
    context.rotate(tiltAngle);

    const originX = -18;
    const originY = -14;

    // Tail & Spine
    drawRect(context, originX, originY + 16, 6, 4, DRAGON_PALETTE.scaleBase);
    drawRect(context, originX + 4, originY + 14, 8, 6, DRAGON_PALETTE.scaleLight);

    // Core Dragon Body & Warm Bronze Chest
    drawRect(context, originX + 10, originY + 10, 16, 12, DRAGON_PALETTE.scaleBase);
    drawRect(context, originX + 12, originY + 12, 12, 8, DRAGON_PALETTE.scaleLight);
    drawRect(context, originX + 18, originY + 14, 10, 8, DRAGON_PALETTE.chestBronze);

    // Dragon Head, Snout, Horns & Glowing Eye
    drawRect(context, originX + 22, originY + 4, 12, 10, DRAGON_PALETTE.scaleLight);
    drawRect(context, originX + 30, originY + 8, 6, 6, DRAGON_PALETTE.chestBronze);
    drawRect(context, originX + 22, originY, 3, 4, DRAGON_PALETTE.hornGlow);
    drawRect(context, originX + 27, originY, 3, 4, DRAGON_PALETTE.hornGlow);
    drawRect(context, originX + 26, originY + 6, 4, 3, DRAGON_PALETTE.shadowDark);
    drawRect(context, originX + 27, originY + 6, 2, 2, DRAGON_PALETTE.hornGlow);

    // Animated Dragon Wings (Up vs Down Stroke)
    if (isFlappingDown) {
        drawRect(context, originX + 8, originY + 16, 12, 10, DRAGON_PALETTE.scaleBase);
        drawRect(context, originX + 10, originY + 18, 8, 6, DRAGON_PALETTE.scaleLight);
    } else {
        drawRect(context, originX + 6, originY + 2, 14, 10, DRAGON_PALETTE.scaleBase);
        drawRect(context, originX + 8, originY + 4, 10, 6, DRAGON_PALETTE.scaleLight);
    }

    context.restore();
}

function paintDragonPreviewCanvas(canvasId, offsetX, offsetY, pixelUnit) {
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    const context = canvasElement.getContext('2d');
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    drawDragonKnightGuardian(context, offsetX, offsetY, pixelUnit);
}

export function renderStaticPreviews() {
    paintDragonPreviewCanvas('logoSpriteCanvas', 4, 4, 3);
    paintDragonPreviewCanvas('heroPreviewCanvas', 8, 4, 4);
}
