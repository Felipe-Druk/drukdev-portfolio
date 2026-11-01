/**************************************************************
 * PROCEDURAL RPG CLASS EMBLEMS (BACKEND, ALGORITHMS, GAMEDEV, FULLSTACK)
 **************************************************************/

import { SPRITE_PALETTES } from '../../config/palettes.js';
import { drawRect } from './canvasUtils.js';

const EMBLEM_COLORS = SPRITE_PALETTES.emblems;

export function drawBackendEmblem(context, offsetX = 0, offsetY = 0) {
    // Forged Steel Server Rack & Technomancer Core
    drawRect(context, offsetX + 8, offsetY + 6, 32, 36, EMBLEM_COLORS.steelBase);
    drawRect(context, offsetX + 10, offsetY + 8, 28, 32, EMBLEM_COLORS.abyss);

    // Server Nodes (3 Blades)
    for (let bladeIndex = 0; bladeIndex < 3; bladeIndex++) {
        const bladeY = offsetY + 10 + bladeIndex * 10;
        drawRect(context, offsetX + 12, bladeY, 24, 8, EMBLEM_COLORS.steelDark);
        drawRect(context, offsetX + 14, bladeY + 2, 4, 4, EMBLEM_COLORS.dragonLight);
        drawRect(context, offsetX + 20, bladeY + 3, 12, 2, EMBLEM_COLORS.bronzeWarm);
    }
}

export function drawAlgorithmsEmblem(context, offsetX = 0, offsetY = 0) {
    // Lorekeeper Arcane Grimoire & Binary Tree Graph
    drawRect(context, offsetX + 8, offsetY + 6, 32, 36, EMBLEM_COLORS.bronzeWarm);
    drawRect(context, offsetX + 10, offsetY + 8, 28, 32, EMBLEM_COLORS.dragonBase);
    drawRect(context, offsetX + 12, offsetY + 10, 24, 28, EMBLEM_COLORS.darkEarth);

    // Root Node & Child Nodes
    drawRect(context, offsetX + 21, offsetY + 13, 6, 6, EMBLEM_COLORS.ivoryGlow);
    drawRect(context, offsetX + 17, offsetY + 19, 14, 2, EMBLEM_COLORS.dragonLight);
    drawRect(context, offsetX + 14, offsetY + 23, 6, 6, EMBLEM_COLORS.bronzeWarm);
    drawRect(context, offsetX + 28, offsetY + 23, 6, 6, EMBLEM_COLORS.bronzeWarm);
    drawRect(context, offsetX + 16, offsetY + 32, 16, 2, EMBLEM_COLORS.steelLight);
}

export function drawGamedevEmblem(context, offsetX = 0, offsetY = 0) {
    // Worldbuilder Pixel Runeblade & Arcade Crystal
    drawRect(context, offsetX + 30, offsetY + 8, 8, 8, EMBLEM_COLORS.ivoryGlow);
    drawRect(context, offsetX + 24, offsetY + 12, 10, 10, EMBLEM_COLORS.steelLight);
    drawRect(context, offsetX + 18, offsetY + 18, 10, 10, EMBLEM_COLORS.dragonLight);

    // Crossguard & Pommel
    drawRect(context, offsetX + 12, offsetY + 24, 12, 4, EMBLEM_COLORS.bronzeWarm);
    drawRect(context, offsetX + 16, offsetY + 22, 4, 12, EMBLEM_COLORS.bronzeWarm);
    drawRect(context, offsetX + 10, offsetY + 32, 6, 6, EMBLEM_COLORS.dragonBase);
}

export function drawFullstackEmblem(context, offsetX = 0, offsetY = 0) {
    // Vanguard Heraldic Shield & Layered Stack
    drawRect(context, offsetX + 8, offsetY + 6, 32, 22, EMBLEM_COLORS.steelBase);
    drawRect(context, offsetX + 12, offsetY + 28, 24, 8, EMBLEM_COLORS.steelBase);
    drawRect(context, offsetX + 18, offsetY + 36, 12, 6, EMBLEM_COLORS.steelBase);

    drawRect(context, offsetX + 11, offsetY + 9, 26, 18, EMBLEM_COLORS.dragonBase);
    drawRect(context, offsetX + 15, offsetY + 27, 18, 6, EMBLEM_COLORS.dragonBase);

    // Inner Bronze Chevron
    drawRect(context, offsetX + 16, offsetY + 13, 16, 4, EMBLEM_COLORS.bronzeWarm);
    drawRect(context, offsetX + 20, offsetY + 19, 8, 8, EMBLEM_COLORS.ivoryGlow);
}

export function drawOmniscientEmblem(context, offsetX = 0, offsetY = 0) {
    // All-Seeing Arcane Eye
    drawRect(context, offsetX + 8, offsetY + 18, 32, 12, EMBLEM_COLORS.bronzeWarm);
    drawRect(context, offsetX + 14, offsetY + 14, 20, 20, EMBLEM_COLORS.dragonBase);
    drawRect(context, offsetX + 18, offsetY + 18, 12, 12, EMBLEM_COLORS.dragonLight);
    drawRect(context, offsetX + 22, offsetY + 22, 4, 4, EMBLEM_COLORS.ivoryGlow);
}

const EMBLEM_RENDERERS = {
    backend: drawBackendEmblem,
    algorithms: drawAlgorithmsEmblem,
    gamedev: drawGamedevEmblem,
    fullstack: drawFullstackEmblem,
    all: drawOmniscientEmblem
};

export function drawClassEmblem(context, emblemId, offsetX = 0, offsetY = 0) {
    const renderer = EMBLEM_RENDERERS[emblemId] || drawOmniscientEmblem;
    renderer(context, offsetX, offsetY);
}

export function paintClassEmblemOnCanvas(canvasElement, emblemId) {
    if (!canvasElement) return;
    const context = canvasElement.getContext('2d');
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    drawClassEmblem(context, emblemId, 0, 0);
}
