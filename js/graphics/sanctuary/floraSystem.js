/**************************************************************
 * PROCEDURAL FLORA ENGINE — MEADOW GEOMETRY, DEPTH SHADING & STATE
 **************************************************************/

import {
    BIOME_PALETTES,
    SANCTUARY_SCENE_PALETTE,
    setActiveBiomeKey,
    getActiveBiomePalette
} from '../../config/palettes.js';
import { drawRect } from '../sprites/index.js';

export { BIOME_PALETTES as FLORA_BIOMES, getActiveBiomePalette };

export const FLORA_STORAGE_KEY = 'druk_flora_config';
const CLUMP_CENTER_COUNT = 26;
const POINTER_REPULSION_RADIUS_SQUARED = 3025;
const POINTER_STRONG_RADIUS_SQUARED = 900;

const DEFAULT_FLORA_CONFIG = {
    seed: 738192,
    density: 0.65,
    clumping: 0.6,
    grassLength: 1.0,
    biome: 'emerald'
};

export function clampFloraValue(value, minValue, maxValue) {
    return Math.max(minValue, Math.min(maxValue, value));
}

function loadFloraConfig() {
    try {
        const rawSaved = localStorage.getItem(FLORA_STORAGE_KEY);
        if (!rawSaved) return { ...DEFAULT_FLORA_CONFIG };
        const parsed = JSON.parse(rawSaved);
        const resolvedBiome = BIOME_PALETTES[parsed.biome] ? parsed.biome : DEFAULT_FLORA_CONFIG.biome;
        return {
            seed: Number.isFinite(parsed.seed) ? parsed.seed : DEFAULT_FLORA_CONFIG.seed,
            density: typeof parsed.density === 'number'
                ? clampFloraValue(parsed.density, 0.1, 1.0)
                : DEFAULT_FLORA_CONFIG.density,
            clumping: typeof parsed.clumping === 'number'
                ? clampFloraValue(parsed.clumping, 0.0, 1.0)
                : DEFAULT_FLORA_CONFIG.clumping,
            grassLength: typeof parsed.grassLength === 'number'
                ? clampFloraValue(parsed.grassLength, 0.3, 2.0)
                : DEFAULT_FLORA_CONFIG.grassLength,
            biome: resolvedBiome
        };
    } catch {
        return { ...DEFAULT_FLORA_CONFIG };
    }
}

const floraConfig = loadFloraConfig();
setActiveBiomeKey(floraConfig.biome);

let cachedFloraGeometry = {
    cacheKey: '',
    groundPixels: [],
    grassBlades: []
};

function saveFloraConfig() {
    try {
        localStorage.setItem(FLORA_STORAGE_KEY, JSON.stringify(floraConfig));
    } catch {
        // Ignore storage quota errors
    }
}

export function getFloraConfig() {
    return floraConfig;
}

export function updateFloraConfig(partialConfig) {
    if (typeof partialConfig.seed === 'number') {
        floraConfig.seed = Math.floor(partialConfig.seed);
    }
    if (typeof partialConfig.density === 'number') {
        floraConfig.density = clampFloraValue(partialConfig.density, 0.1, 1.0);
    }
    if (typeof partialConfig.clumping === 'number') {
        floraConfig.clumping = clampFloraValue(partialConfig.clumping, 0.0, 1.0);
    }
    if (typeof partialConfig.grassLength === 'number') {
        floraConfig.grassLength = clampFloraValue(partialConfig.grassLength, 0.3, 2.0);
    }
    if (typeof partialConfig.biome === 'string' && BIOME_PALETTES[partialConfig.biome]) {
        floraConfig.biome = setActiveBiomeKey(partialConfig.biome);
    }
    saveFloraConfig();
}

function parseHexToRgb(hexColor) {
    const cleanHex = hexColor.replace('#', '');
    return {
        red: parseInt(cleanHex.slice(0, 2), 16),
        green: parseInt(cleanHex.slice(2, 4), 16),
        blue: parseInt(cleanHex.slice(4, 6), 16)
    };
}

const ABYSS_RGB = parseHexToRgb(SANCTUARY_SCENE_PALETTE.abyssSoilShadow);

export function shadeHexColorByDepth(hexColor, depthRatio) {
    const clampedRatio = clampFloraValue(depthRatio, 0, 1);
    const darkenStrength = Math.min(0.84, Math.pow(clampedRatio, 1.05) * 0.82);
    const sourceRgb = parseHexToRgb(hexColor);

    const red = Math.round(sourceRgb.red + (ABYSS_RGB.red - sourceRgb.red) * darkenStrength);
    const green = Math.round(sourceRgb.green + (ABYSS_RGB.green - sourceRgb.green) * darkenStrength);
    const blue = Math.round(sourceRgb.blue + (ABYSS_RGB.blue - sourceRgb.blue) * darkenStrength);

    return `rgb(${red}, ${green}, ${blue})`;
}

function createSeededRandom(seedValue) {
    let state = (seedValue >>> 0) || 1;
    return function nextRandom() {
        state = (state + 0x6D2B79F5) >>> 0;
        let bitMix = Math.imul(state ^ (state >>> 15), 1 | state);
        bitMix = (bitMix + Math.imul(bitMix ^ (bitMix >>> 7), 61 | bitMix)) ^ bitMix;
        return ((bitMix ^ (bitMix >>> 14)) >>> 0) / 4294967296;
    };
}

function isInsideExcludedZone(pointX, pointY, zones) {
    const { pond, dungeon } = zones;
    const isInsidePond = (
        pointX >= pond.x - 12 &&
        pointX <= pond.x + pond.w + 12 &&
        pointY >= pond.y - 8 &&
        pointY <= pond.y + pond.h + 8
    );
    if (isInsidePond) return true;

    return (
        pointX >= dungeon.centerX - 70 &&
        pointX <= dungeon.centerX + 70 &&
        pointY >= dungeon.baseY - 10 &&
        pointY <= dungeon.baseY + 14
    );
}

function generateClumpCenters(random, width, meadowTopY, meadowBottomY) {
    const clumpCenters = [];
    for (let index = 0; index < CLUMP_CENTER_COUNT; index++) {
        clumpCenters.push({
            x: 24 + random() * Math.max(40, width - 48),
            y: meadowTopY + random() * Math.max(20, meadowBottomY - meadowTopY)
        });
    }
    return clumpCenters;
}

function generateClumpedPosition(random, width, minY, maxY, clumpCenters, clumpingFactor) {
    const uniformX = random() * width;
    const uniformY = minY + random() * (maxY - minY);

    if (clumpCenters.length === 0 || clumpingFactor <= 0.01) {
        return { x: uniformX, y: uniformY };
    }

    const chosenCenter = clumpCenters[Math.floor(random() * clumpCenters.length)];
    const angle = random() * Math.PI * 2;
    const maxSpreadX = 140 * (1.15 - clumpingFactor * 0.78);
    const maxSpreadY = 48 * (1.15 - clumpingFactor * 0.78);
    const radialDistance = Math.pow(random(), 0.75);

    const clumpedX = chosenCenter.x + Math.cos(angle) * radialDistance * maxSpreadX;
    const clumpedY = chosenCenter.y + Math.sin(angle) * radialDistance * maxSpreadY;

    const finalX = uniformX * (1 - clumpingFactor) + clumpedX * clumpingFactor;
    const finalY = uniformY * (1 - clumpingFactor) + clumpedY * clumpingFactor;

    return {
        x: clampFloraValue(finalX, 4, width - 6),
        y: clampFloraValue(finalY, minY, maxY)
    };
}

function pickOrganicBaseBladeHeight(random) {
    const roll = random();
    if (roll < 0.22) return 2;
    if (roll < 0.50) return 4;
    if (roll < 0.76) return 6;
    if (roll < 0.92) return 9;
    return 12;
}

function createGrassBladeEntry(random, bladeX, bladeY, horizonY, totalDepthSpan, accentThreshold) {
    const depthRatio = clampFloraValue((bladeY - horizonY) / totalDepthSpan, 0, 1);
    return {
        x: bladeX,
        y: bladeY,
        baseHeight: pickOrganicBaseBladeHeight(random),
        phase: random() * Math.PI * 2,
        tipTier: random() > accentThreshold ? 'accent' : 'tip',
        depthRatio
    };
}

function generateGroundPixels(random, width, horizonY, meadowTopY, meadowBottomY, totalDepthSpan, clumpCenters, zones) {
    const groundPixels = [];
    const totalGroundPixels = Math.floor((width * (meadowBottomY - meadowTopY)) / 950 * floraConfig.density);

    for (let index = 0; index < totalGroundPixels; index++) {
        const position = generateClumpedPosition(
            random,
            width,
            meadowTopY,
            meadowBottomY,
            clumpCenters,
            floraConfig.clumping
        );
        const snappedX = Math.floor(position.x / 2) * 2;
        const snappedY = Math.floor(position.y / 2) * 2;

        if (isInsideExcludedZone(snappedX, snappedY, zones)) continue;

        const colorRoll = random();
        let colorTier = 'mid';
        if (colorRoll > 0.91) {
            colorTier = 'accent';
        } else if (colorRoll > 0.52) {
            colorTier = 'tip';
        }

        groundPixels.push({
            x: snappedX,
            y: snappedY,
            width: random() > 0.45 ? 4 : 2,
            height: 2,
            colorTier,
            depthRatio: clampFloraValue((snappedY - horizonY) / totalDepthSpan, 0, 1)
        });
    }

    return { groundPixels, totalGroundPixels };
}

function generateGrassBlades(
    random,
    width,
    horizonY,
    meadowTopY,
    meadowBottomY,
    totalDepthSpan,
    totalGroundPixels,
    clumpCenters,
    zones
) {
    const grassBlades = [];
    const horizonBladeCount = Math.floor((width / 8) * floraConfig.density);

    for (let index = 0; index < horizonBladeCount; index++) {
        const uniformX = random() * width;
        const center = clumpCenters[index % clumpCenters.length];
        const clumpedX = center.x + (random() - 0.5) * 110 * (1.1 - floraConfig.clumping * 0.7);
        const bladeX = Math.floor((uniformX * (1 - floraConfig.clumping) + clumpedX * floraConfig.clumping) / 2) * 2;
        const bladeY = horizonY + Math.floor(random() * 6);

        if (isInsideExcludedZone(bladeX, bladeY, zones)) continue;
        grassBlades.push(createGrassBladeEntry(random, bladeX, bladeY, horizonY, totalDepthSpan, 0.88));
    }

    const meadowBladeCount = Math.floor(totalGroundPixels * 0.62);
    for (let index = 0; index < meadowBladeCount; index++) {
        const position = generateClumpedPosition(
            random,
            width,
            meadowTopY,
            meadowBottomY - 8,
            clumpCenters,
            floraConfig.clumping
        );
        const bladeX = Math.floor(position.x / 2) * 2;
        const bladeY = Math.floor(position.y / 2) * 2;

        if (isInsideExcludedZone(bladeX, bladeY, zones)) continue;
        grassBlades.push(createGrassBladeEntry(random, bladeX, bladeY, horizonY, totalDepthSpan, 0.9));
    }

    return grassBlades;
}

function rebuildFloraGeometryIfNeeded(width, height, zones) {
    const cacheKey = `${width}x${height}:${floraConfig.seed}:${floraConfig.density.toFixed(2)}:${floraConfig.clumping.toFixed(2)}`;
    if (cachedFloraGeometry.cacheKey === cacheKey) return;

    const random = createSeededRandom(floraConfig.seed);
    const { horizonY } = zones;
    const meadowTopY = horizonY + 8;
    const meadowBottomY = Math.max(meadowTopY + 24, height - 10);
    const totalDepthSpan = Math.max(1, height - horizonY);

    const clumpCenters = generateClumpCenters(random, width, meadowTopY, meadowBottomY);
    const { groundPixels, totalGroundPixels } = generateGroundPixels(
        random,
        width,
        horizonY,
        meadowTopY,
        meadowBottomY,
        totalDepthSpan,
        clumpCenters,
        zones
    );
    const grassBlades = generateGrassBlades(
        random,
        width,
        horizonY,
        meadowTopY,
        meadowBottomY,
        totalDepthSpan,
        totalGroundPixels,
        clumpCenters,
        zones
    );

    cachedFloraGeometry = {
        cacheKey,
        groundPixels,
        grassBlades
    };
}

function calculatePointerBladeBend(blade, pointerState, isPointerActiveInMeadow) {
    if (!isPointerActiveInMeadow) return 0;

    const deltaX = blade.x - pointerState.x;
    const deltaY = blade.y - pointerState.y;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    if (distanceSquared >= POINTER_REPULSION_RADIUS_SQUARED) return 0;

    const pushDirection = deltaX >= 0 ? 1 : -1;
    const pushMagnitude = distanceSquared < POINTER_STRONG_RADIUS_SQUARED ? 2 : 1;
    return pushDirection * pushMagnitude;
}

function drawSingleGrassBlade(
    context,
    blade,
    palette,
    lengthScale,
    pointerState,
    isPointerActiveInMeadow,
    sanctuaryTick
) {
    const scaledHeight = Math.max(2, Math.round((blade.baseHeight * lengthScale) / 2) * 2);
    const baseColor = shadeHexColorByDepth(palette.base, blade.depthRatio);
    const midColor = shadeHexColorByDepth(palette.mid, blade.depthRatio);
    const tipColor = shadeHexColorByDepth(palette[blade.tipTier] || palette.tip, blade.depthRatio);

    if (scaledHeight <= 2) {
        drawRect(context, blade.x, blade.y - 2, 2, 2, tipColor);
        return;
    }

    const windSway = Math.round(Math.sin(sanctuaryTick * 0.05 + blade.x * 0.03 + blade.phase) * 1.3);
    const pointerBend = calculatePointerBladeBend(blade, pointerState, isPointerActiveInMeadow);
    const maxBend = scaledHeight >= 8 ? 3 : 2;
    const tipOffset = clampFloraValue(windSway + pointerBend, -maxBend, maxBend);
    const midOffset = Math.trunc(tipOffset * 0.5);

    const baseSegmentHeight = Math.max(2, Math.floor(scaledHeight * 0.45));
    const tipSegmentHeight = 2;
    const midSegmentHeight = Math.max(0, scaledHeight - baseSegmentHeight - tipSegmentHeight);

    drawRect(context, blade.x, blade.y - baseSegmentHeight, 2, baseSegmentHeight, baseColor);

    if (midSegmentHeight > 0) {
        drawRect(
            context,
            blade.x + midOffset,
            blade.y - baseSegmentHeight - midSegmentHeight,
            2,
            midSegmentHeight,
            midColor
        );
    }

    drawRect(context, blade.x + tipOffset, blade.y - scaledHeight, 2, tipSegmentHeight, tipColor);
}

export function drawProceduralGrass(context, width, height, zones, pointerState, sanctuaryTick) {
    rebuildFloraGeometryIfNeeded(width, height, zones);
    const palette = getActiveBiomePalette();
    const lengthScale = floraConfig.grassLength;
    const isPointerActiveInMeadow = Boolean(
        pointerState && pointerState.x >= 0 && pointerState.y >= zones.horizonY - 24
    );

    cachedFloraGeometry.groundPixels.forEach((pixel) => {
        const rawColor = palette[pixel.colorTier] || palette.mid;
        const shadedColor = shadeHexColorByDepth(rawColor, pixel.depthRatio);
        drawRect(context, pixel.x, pixel.y, pixel.width, pixel.height, shadedColor);
    });

    cachedFloraGeometry.grassBlades.forEach((blade) => {
        drawSingleGrassBlade(
            context,
            blade,
            palette,
            lengthScale,
            pointerState,
            isPointerActiveInMeadow,
            sanctuaryTick
        );
    });
}
