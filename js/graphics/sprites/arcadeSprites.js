/**************************************************************
 * PROCEDURAL ARCADE SPRITES (BUG SLASHER & SNAKE CRT)
 **************************************************************/

import { drawRect } from './canvasUtils.js';
import { drawDragonKnightGuardian } from './dragonSprite.js';

const SLASHER_PIXEL_UNIT = 3;
const SLASH_MAX_TIMER = 14;
const SLASH_STEP_PIXELS = 2;

export function drawSlasherHero(context, x, y) {
    drawDragonKnightGuardian(context, x, y, SLASHER_PIXEL_UNIT);
}

export function drawSlasherSwordWave(context, playerX, playerY, playerWidth, attackTimer, slashColor) {
    if (attackTimer <= 0) return;
    const slashOffset = (SLASH_MAX_TIMER - attackTimer) * SLASH_STEP_PIXELS;
    drawRect(context, playerX + playerWidth + slashOffset, playerY + 2, 10, 30, slashColor);
    drawRect(context, playerX + playerWidth + slashOffset + 10, playerY + 8, 6, 18, '#D4957A');
}

export function drawBugEnemy(context, x, y, palette) {
    const u = SLASHER_PIXEL_UNIT;
    const shellColor = palette?.slashColor || '#B92B92';
    const coreColor = palette?.warmBronze || '#D4957A';

    // Antennae
    drawRect(context, x + 2 * u, y, u, u, coreColor);
    drawRect(context, x + 5 * u, y, u, u, coreColor);

    // Carapace & Glowing Eyes
    drawRect(context, x + u, y + u, 6 * u, 5 * u, '#231C1A');
    drawRect(context, x + 2 * u, y + 2 * u, 4 * u, 3 * u, shellColor);
    drawRect(context, x + 2 * u, y + 2 * u, u, u, coreColor);
    drawRect(context, x + 5 * u, y + 2 * u, u, u, coreColor);

    // Skittering Legs
    drawRect(context, x, y + 6 * u, 2 * u, 2 * u, '#231C1A');
    drawRect(context, x + 3 * u, y + 6 * u, 2 * u, 2 * u, '#231C1A');
    drawRect(context, x + 6 * u, y + 6 * u, 2 * u, 2 * u, '#231C1A');
}

export function drawCommitGem(context, x, y, palette) {
    const u = SLASHER_PIXEL_UNIT;
    const outerColor = palette?.slashColor || '#B92B92';
    const midColor = palette?.warmBronze || '#D4957A';
    const coreColor = palette?.steelHighlight || '#D8E2EB';

    drawRect(context, x + 3 * u, y, 2 * u, 8 * u, outerColor);
    drawRect(context, x + u, y + 2 * u, 6 * u, 4 * u, outerColor);
    drawRect(context, x + 2 * u, y + u, 4 * u, 6 * u, midColor);
    drawRect(context, x + 3 * u, y + 3 * u, 2 * u, 2 * u, coreColor);
}

export function drawSnakeFoodNode(context, gridX, gridY, cellSize, phosphorColors) {
    const pixelX = gridX * cellSize;
    const pixelY = gridY * cellSize;
    drawRect(context, pixelX + 2, pixelY + 2, cellSize - 4, cellSize - 4, phosphorColors.fg);
    drawRect(context, pixelX + 5, pixelY + 5, cellSize - 10, cellSize - 10, phosphorColors.bg);
}

export function drawSnakeSegment(context, gridX, gridY, cellSize, isHead, phosphorColors) {
    const inset = isHead ? 1 : 2;
    const segmentColor = isHead ? phosphorColors.fg : phosphorColors.dim;
    drawRect(
        context,
        gridX * cellSize + inset,
        gridY * cellSize + inset,
        cellSize - inset * 2,
        cellSize - inset * 2,
        segmentColor
    );
}
