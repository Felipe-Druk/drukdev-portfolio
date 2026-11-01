/**************************************************************
 * SANCTUARY ENVIRONMENT & INTERACTIVE LANDMARKS RENDERER
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import {
    DRUK_CORE_PALETTE,
    SANCTUARY_SCENE_PALETTE,
    getActiveBiomePalette,
    getInterpolatedScenePalette
} from '../../config/palettes.js';
import { drawRect, drawFloatingPixelLabel } from '../sprites/index.js';
import { updateAndDrawPondRipples } from './particles.js';
import {
    shadeHexColorByDepth,
    drawProceduralGrass
} from './floraSystem.js';
import {
    getCelestialProgress,
    drawCelestialBody,
    drawCelestialHoverLabel
} from './celestialSystem.js';

export function drawNightSkyAndMoon(
    context,
    width,
    height,
    celestialZone,
    sanctuaryTick = 0,
    isCelestialHovered = false,
    horizonY
) {
    const scenePalette = getInterpolatedScenePalette(getCelestialProgress());

    const skyGradient = context.createLinearGradient(0, 0, 0, height * 0.7);
    skyGradient.addColorStop(0, scenePalette.skyTop);
    skyGradient.addColorStop(0.6, scenePalette.skyMid);
    skyGradient.addColorStop(1, scenePalette.skyBottom);
    context.fillStyle = skyGradient;
    context.fillRect(0, 0, width, height);

    // Celestial body rendered along parabolic arc (occluded by mountains at horizon)
    drawCelestialBody(context, celestialZone, sanctuaryTick);

    // Distant mountain silhouettes with dynamic atmospheric haze
    drawRect(context, 0, height * 0.56, width * 0.45, height * 0.14, scenePalette.mountainMid);
    drawRect(context, width * 0.35, height * 0.53, width * 0.40, height * 0.17, scenePalette.mountainFar);
    drawRect(context, width * 0.65, height * 0.50, width * 0.35, height * 0.20, scenePalette.mountainNear);

    if (isCelestialHovered) {
        drawCelestialHoverLabel(context, celestialZone, width, horizonY);
    }
}

export const drawSkyAndCelestialBody = drawNightSkyAndMoon;

export function drawSanctuaryMeadowAndLagoon(
    context,
    width,
    height,
    zones,
    pointerState,
    sanctuaryTick
) {
    const { horizonY, pond } = zones;
    const biomePalette = getActiveBiomePalette();
    const scenePalette = getInterpolatedScenePalette(getCelestialProgress());

    // Terraced pixel-art meadow soil & base biome layers with progressive depth darkening
    const depthBands = 14;
    const meadowTotalHeight = Math.max(1, height - horizonY);
    const bandHeight = Math.ceil(meadowTotalHeight / depthBands);
    for (let bandIndex = 0; bandIndex < depthBands; bandIndex++) {
        const bandY = horizonY + bandIndex * bandHeight;
        const depthRatio = bandIndex / Math.max(1, depthBands - 1);
        const shadedSoil = shadeHexColorByDepth(biomePalette.soilMid, depthRatio);
        drawRect(context, 0, bandY, width, bandHeight + 1, shadedSoil);
    }
    drawRect(context, 0, horizonY, width, 6, biomePalette.base);
    drawRect(context, 0, horizonY + 6, width, 4, biomePalette.mid);

    // Procedural pixel-art grass & swaying blades across the meadow
    drawProceduralGrass(context, width, height, zones, pointerState, sanctuaryTick);

    // Lagoon basin with stepped pixel banks & dynamic celestial water reflections
    drawRect(context, pond.x - 8, pond.y - 4, pond.w + 16, pond.h + 8, biomePalette.soilDark);
    drawRect(context, pond.x - 4, pond.y - 2, pond.w + 8, pond.h + 4, scenePalette.waterRim);
    drawRect(context, pond.x, pond.y, pond.w, pond.h, scenePalette.waterDeep);
    drawRect(context, pond.x + 12, pond.y + 8, pond.w - 24, pond.h - 16, scenePalette.waterInner);

    // Shimmering water reflections
    const shimmerOffset = Math.floor(Math.sin(sanctuaryTick * 0.05) * 6);
    drawRect(context, pond.x + 36 + shimmerOffset, pond.y + 16, 44, 3, scenePalette.waterHighlight);
    drawRect(context, pond.x + pond.w - 110 - shimmerOffset, pond.y + 42, 52, 3, scenePalette.waterHighlight);

    // Pixel Lilypads & Lotus Blossoms harmonized with active biome
    const lilypads = [
        { x: pond.x + 42, y: pond.y + 24, hasFlower: true },
        { x: pond.x + Math.floor(pond.w * 0.52), y: pond.y + 40, hasFlower: false },
        { x: pond.x + pond.w - 68, y: pond.y + 22, hasFlower: true }
    ];

    lilypads.forEach((lilypad, padIndex) => {
        const bobOffsetX = Math.floor(Math.sin(sanctuaryTick * 0.04 + padIndex) * 2);
        drawRect(context, lilypad.x + bobOffsetX, lilypad.y, 20, 10, biomePalette.base);
        drawRect(context, lilypad.x + 2 + bobOffsetX, lilypad.y + 2, 16, 6, biomePalette.mid);
        if (lilypad.hasFlower) {
            drawRect(context, lilypad.x + 6 + bobOffsetX, lilypad.y - 4, 8, 6, DRUK_CORE_PALETTE.dragonLight);
            drawRect(context, lilypad.x + 8 + bobOffsetX, lilypad.y - 6, 4, 4, biomePalette.accent);
        }
    });

    updateAndDrawPondRipples(context);
}

export function drawAncientTree(context, treeZone, isHovered, sanctuaryTick, treeRustleTimer) {
    const biomePalette = getActiveBiomePalette();
    const rustleShake = treeRustleTimer > 0
        ? Math.floor(Math.sin(sanctuaryTick * 1.4) * 4)
        : 0;
    const gentleSway = Math.floor(Math.sin(sanctuaryTick * 0.03) * 3) + rustleShake;
    const centerX = treeZone.centerX;
    const baseY = treeZone.baseY;

    // Roots & Gnarled Trunk
    drawRect(context, centerX - 32, baseY - 14, 64, 16, DRUK_CORE_PALETTE.darkEarth);
    drawRect(context, centerX - 20, baseY - 96, 40, 84, DRUK_CORE_PALETTE.darkEarth);
    drawRect(context, centerX - 14, baseY - 92, 24, 78, SANCTUARY_SCENE_PALETTE.trunkDark);
    drawRect(context, centerX - 6, baseY - 86, 8, 68, SANCTUARY_SCENE_PALETTE.trunkLight);

    // Glowing rune hollow in trunk
    drawRect(context, centerX - 4, baseY - 52, 8, 14, DRUK_CORE_PALETTE.dragonLight);
    drawRect(context, centerX - 2, baseY - 48, 4, 8, biomePalette.accent);

    // Layered Pixel Canopy harmonized with active biome
    drawRect(context, centerX - 84 + gentleSway, baseY - 154, 168, 64, biomePalette.soilMid);
    drawRect(context, centerX - 72 + gentleSway, baseY - 178, 144, 72, biomePalette.base);
    drawRect(context, centerX - 54 + gentleSway, baseY - 196, 108, 64, biomePalette.mid);
    drawRect(context, centerX - 34 + gentleSway, baseY - 206, 68, 36, biomePalette.tip);

    // Glowing Blossom Spores in Canopy
    const sporeOffsets = [
        [-52, -138], [-24, -168], [18, -176], [48, -142], [-10, -130], [30, -152]
    ];
    sporeOffsets.forEach(([offsetX, offsetY], sporeIndex) => {
        const color = sporeIndex % 2 === 0 ? DRUK_CORE_PALETTE.dragonLight : biomePalette.accent;
        drawRect(context, centerX + offsetX + gentleSway, baseY + offsetY, 6, 6, color);
    });

    if (isHovered) {
        const label = TRANSLATIONS[getCurrentLanguage()].sanctuary.treeHover;
        drawFloatingPixelLabel(context, centerX, baseY - 220, label, biomePalette.accent);
    }
}

export function drawSealedDungeonPortal(
    context,
    dungeonZone,
    isHovered,
    sanctuaryTick,
    dungeonShakeTimer,
    dungeonMessageTimer
) {
    const shakeX = dungeonShakeTimer > 0
        ? Math.floor((Math.random() - 0.5) * 8)
        : 0;
    const shakeY = dungeonShakeTimer > 0
        ? Math.floor((Math.random() - 0.5) * 6)
        : 0;

    const centerX = dungeonZone.centerX + shakeX;
    const baseY = dungeonZone.baseY + shakeY;

    // Stone & Forged Steel Outer Monolith
    drawRect(context, centerX - 68, baseY - 132, 136, 134, DRUK_CORE_PALETTE.abyss);
    drawRect(context, centerX - 64, baseY - 128, 128, 128, DRUK_CORE_PALETTE.steelDark);
    drawRect(context, centerX - 56, baseY - 120, 112, 120, DRUK_CORE_PALETTE.steelBase);
    drawRect(context, centerX - 48, baseY - 112, 96, 112, DRUK_CORE_PALETTE.darkEarth);

    // Sealed Dark Inner Gate
    drawRect(context, centerX - 36, baseY - 92, 72, 92, DRUK_CORE_PALETTE.abyss);

    // Forged Steel Bars & Mystic Chains
    for (let barX = -24; barX <= 24; barX += 16) {
        drawRect(context, centerX + barX - 2, baseY - 90, 4, 90, DRUK_CORE_PALETTE.steelBase);
    }

    // Glowing Magenta Magic Runes
    const runePulse = 0.65 + 0.35 * Math.sin(sanctuaryTick * 0.08);
    context.globalAlpha = runePulse;
    drawRect(context, centerX - 52, baseY - 84, 6, 14, DRUK_CORE_PALETTE.dragonLight);
    drawRect(context, centerX - 52, baseY - 52, 6, 14, DRUK_CORE_PALETTE.dragonLight);
    drawRect(context, centerX + 46, baseY - 84, 6, 14, DRUK_CORE_PALETTE.dragonLight);
    drawRect(context, centerX + 46, baseY - 52, 6, 14, DRUK_CORE_PALETTE.dragonLight);
    drawRect(context, centerX - 14, baseY - 58, 28, 28, DRUK_CORE_PALETTE.dragonBase);
    drawRect(context, centerX - 10, baseY - 54, 20, 20, DRUK_CORE_PALETTE.dragonLight);
    drawRect(context, centerX - 4, baseY - 48, 8, 8, DRUK_CORE_PALETTE.bronzeWarm);
    context.globalAlpha = 1.0;

    // Carved Signboard at top of portal ("DUNGEON // ENTER")
    drawRect(context, centerX - 76, baseY - 144, 152, 24, DRUK_CORE_PALETTE.abyss);
    drawRect(context, centerX - 74, baseY - 142, 148, 20, DRUK_CORE_PALETTE.darkEarth);
    context.strokeStyle = isHovered ? DRUK_CORE_PALETTE.dragonLight : DRUK_CORE_PALETTE.steelBase;
    context.lineWidth = 2;
    context.strokeRect(centerX - 74, baseY - 142, 148, 20);

    const signText = TRANSLATIONS[getCurrentLanguage()].sanctuary.dungeonSign;
    context.font = '8px "Press Start 2P", monospace';
    context.fillStyle = isHovered ? DRUK_CORE_PALETTE.steelLight : DRUK_CORE_PALETTE.bronzeWarm;
    context.textAlign = 'center';
    context.fillText(signText, centerX, baseY - 129);

    if (dungeonMessageTimer > 0) {
        const sealMsg = TRANSLATIONS[getCurrentLanguage()].sanctuary.dungeonSealMsg;
        drawFloatingPixelLabel(context, centerX, baseY - 164, `⚔️ ${sealMsg}`, DRUK_CORE_PALETTE.dragonLight);
    } else if (isHovered) {
        const hoverLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary.dungeonHover;
        drawFloatingPixelLabel(context, centerX, baseY - 160, hoverLabel, DRUK_CORE_PALETTE.bronzeWarm);
    }
}

export function drawDrukSystemRelicConsole(context, consoleZone, isHovered, sanctuaryTick) {
    const centerX = consoleZone.baseX;
    const centerY = consoleZone.baseY;
    const biomePalette = getActiveBiomePalette();

    // Mossy stone pedestal & power cables on the grass
    drawRect(context, centerX - 28, centerY + 28, 56, 12, DRUK_CORE_PALETTE.steelDark);
    drawRect(context, centerX - 24, centerY + 24, 48, 6, DRUK_CORE_PALETTE.steelBase);
    drawRect(context, centerX - 38, centerY + 34, 16, 4, biomePalette.base);

    // Forged Steel CRT Casing
    drawRect(context, centerX - 22, centerY - 8, 44, 34, DRUK_CORE_PALETTE.abyss);
    drawRect(context, centerX - 20, centerY - 6, 40, 30, DRUK_CORE_PALETTE.steelBase);
    drawRect(context, centerX - 17, centerY - 3, 34, 24, DRUK_CORE_PALETTE.darkEarth);

    // Blinking Matrix Green CRT Screen
    drawRect(context, centerX - 14, centerY, 28, 18, DRUK_CORE_PALETTE.matrixBg);

    const isCursorVisible = Math.floor(sanctuaryTick / 18) % 2 === 0;
    drawRect(context, centerX - 11, centerY + 3, 14, 2, DRUK_CORE_PALETTE.matrixGreen);
    drawRect(context, centerX - 11, centerY + 7, 20, 2, DRUK_CORE_PALETTE.matrixDim);
    drawRect(context, centerX - 11, centerY + 11, 10, 2, DRUK_CORE_PALETTE.matrixGreen);
    if (isCursorVisible) {
        drawRect(context, centerX + 1, centerY + 11, 4, 3, DRUK_CORE_PALETTE.matrixGreen);
    }

    // Matrix green ambient ground glow
    context.fillStyle = isHovered
        ? SANCTUARY_SCENE_PALETTE.crtAmbientGlowHover
        : SANCTUARY_SCENE_PALETTE.crtAmbientGlowIdle;
    context.fillRect(centerX - 28, centerY - 14, 56, 52);

    // Always-visible subtle beacon or full prompt on hover
    const promptText = TRANSLATIONS[getCurrentLanguage()].sanctuary.consoleHover;
    const floatOffset = Math.floor(Math.sin(sanctuaryTick * 0.08) * 3);
    if (isHovered) {
        drawFloatingPixelLabel(context, centerX, centerY - 24 + floatOffset, promptText, DRUK_CORE_PALETTE.matrixGreen);
    } else {
        drawFloatingPixelLabel(context, centerX, centerY - 22 + floatOffset, '▼ DRUKSYSTEM OS', DRUK_CORE_PALETTE.matrixGreen);
    }
}
