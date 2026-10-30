/**************************************************************
 * PROCEDURAL FLORA SYSTEM & GREEN MAGE NPC (floraSystem.js)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import { floraSpell, playSound } from '../../audio/soundEngine.js';
import { drawRect, drawFloatingPixelLabel } from './canvasUtils.js';

export const FLORA_STORAGE_KEY = 'druk_flora_config';
const ABYSS_SHADOW_HEX = '#080D0A';
const CLUMP_CENTER_COUNT = 26;
const POINTER_REPULSION_RADIUS_SQUARED = 3025;
const POINTER_STRONG_RADIUS_SQUARED = 900;

export const FLORA_BIOMES = {
    emerald: {
        soilDark: '#0D1713',
        soilMid: '#14241D',
        base: '#1E3F2B',
        mid: '#38754A',
        tip: '#58A668',
        accent: '#D4957A'
    },
    druk: {
        soilDark: '#120817',
        soilMid: '#1E0D24',
        base: '#3D1247',
        mid: '#7A1F73',
        tip: '#B92B92',
        accent: '#F3D5B5'
    },
    autumn: {
        soilDark: '#170E0A',
        soilMid: '#241610',
        base: '#4A2B1D',
        mid: '#8A4E3B',
        tip: '#D4957A',
        accent: '#F3D5B5'
    },
    matrix: {
        soilDark: '#020C02',
        soilMid: '#041804',
        base: '#003B00',
        mid: '#008F11',
        tip: '#00FF41',
        accent: '#D8E2EB'
    }
};

const DEFAULT_FLORA_CONFIG = {
    seed: 738192,
    density: 0.65,
    clumping: 0.6,
    grassLength: 1.0,
    biome: 'emerald'
};

function clampValue(value, minValue, maxValue) {
    return Math.max(minValue, Math.min(maxValue, value));
}

function loadFloraConfig() {
    try {
        const rawSaved = localStorage.getItem(FLORA_STORAGE_KEY);
        if (!rawSaved) return { ...DEFAULT_FLORA_CONFIG };
        const parsed = JSON.parse(rawSaved);
        return {
            seed: Number.isFinite(parsed.seed) ? parsed.seed : DEFAULT_FLORA_CONFIG.seed,
            density: typeof parsed.density === 'number'
                ? clampValue(parsed.density, 0.1, 1.0)
                : DEFAULT_FLORA_CONFIG.density,
            clumping: typeof parsed.clumping === 'number'
                ? clampValue(parsed.clumping, 0.0, 1.0)
                : DEFAULT_FLORA_CONFIG.clumping,
            grassLength: typeof parsed.grassLength === 'number'
                ? clampValue(parsed.grassLength, 0.3, 2.0)
                : DEFAULT_FLORA_CONFIG.grassLength,
            biome: FLORA_BIOMES[parsed.biome] ? parsed.biome : DEFAULT_FLORA_CONFIG.biome
        };
    } catch {
        return { ...DEFAULT_FLORA_CONFIG };
    }
}

const floraConfig = loadFloraConfig();

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

export function getActiveBiomePalette() {
    return FLORA_BIOMES[floraConfig.biome] || FLORA_BIOMES.emerald;
}

export function updateFloraConfig(partialConfig) {
    if (typeof partialConfig.seed === 'number') {
        floraConfig.seed = Math.floor(partialConfig.seed);
    }
    if (typeof partialConfig.density === 'number') {
        floraConfig.density = clampValue(partialConfig.density, 0.1, 1.0);
    }
    if (typeof partialConfig.clumping === 'number') {
        floraConfig.clumping = clampValue(partialConfig.clumping, 0.0, 1.0);
    }
    if (typeof partialConfig.grassLength === 'number') {
        floraConfig.grassLength = clampValue(partialConfig.grassLength, 0.3, 2.0);
    }
    if (typeof partialConfig.biome === 'string' && FLORA_BIOMES[partialConfig.biome]) {
        floraConfig.biome = partialConfig.biome;
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

const ABYSS_RGB = parseHexToRgb(ABYSS_SHADOW_HEX);

export function shadeHexColorByDepth(hexColor, depthRatio) {
    const clampedRatio = clampValue(depthRatio, 0, 1);
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
        x: clampValue(finalX, 4, width - 6),
        y: clampValue(finalY, minY, maxY)
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
    const depthRatio = clampValue((bladeY - horizonY) / totalDepthSpan, 0, 1);
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
            depthRatio: clampValue((snappedY - horizonY) / totalDepthSpan, 0, 1)
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
    const tipOffset = clampValue(windSway + pointerBend, -maxBend, maxBend);
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

export function drawGreenMage(context, mageZone, isHovered, sanctuaryTick, mageCastTimer) {
    const palette = getActiveBiomePalette();
    const centerX = mageZone.centerX;
    const baseY = mageZone.baseY;
    const idleBobY = Math.sin(sanctuaryTick * 0.06) > 0 ? -2 : 0;
    const isCasting = mageCastTimer > 0;
    const staffLiftY = isCasting ? -6 : 0;

    // Ground shadow & boots
    drawRect(context, centerX - 14, baseY - 2, 28, 4, '#0D0D0F');
    drawRect(context, centerX - 8, baseY - 6, 6, 6, '#231C1A');
    drawRect(context, centerX + 2, baseY - 6, 6, 6, '#231C1A');

    // Herbivore Mage Robe / Tunic (Active Biome Palette)
    drawRect(context, centerX - 12, baseY - 24 + idleBobY, 24, 18, palette.base);
    drawRect(context, centerX - 10, baseY - 22 + idleBobY, 20, 16, palette.mid);
    drawRect(context, centerX - 2, baseY - 22 + idleBobY, 4, 16, palette.tip);

    // Sleeves & Hands
    drawRect(context, centerX - 15, baseY - 20 + idleBobY, 5, 10, palette.base);
    drawRect(context, centerX + 10, baseY - 20 + idleBobY + staffLiftY, 5, 10, palette.base);
    drawRect(context, centerX + 11, baseY - 12 + idleBobY + staffLiftY, 4, 4, '#D4957A');

    // Shadowed Face & Luminous Eyes under Hat Brim
    drawRect(context, centerX - 8, baseY - 32 + idleBobY, 16, 8, '#141116');
    drawRect(context, centerX - 5, baseY - 29 + idleBobY, 3, 2, '#F3D5B5');
    drawRect(context, centerX + 2, baseY - 29 + idleBobY, 3, 2, '#F3D5B5');

    // Flowing Silver Beard (#D8E2EB)
    drawRect(context, centerX - 8, baseY - 25 + idleBobY, 16, 6, '#D8E2EB');
    drawRect(context, centerX - 6, baseY - 19 + idleBobY, 12, 6, '#D8E2EB');
    drawRect(context, centerX - 4, baseY - 13 + idleBobY, 8, 4, '#9BA7B4');

    // Classic Pointed Wizard Hat
    drawRect(context, centerX - 16, baseY - 34 + idleBobY, 32, 4, palette.base);
    drawRect(context, centerX - 12, baseY - 38 + idleBobY, 24, 4, palette.accent);
    drawRect(context, centerX - 10, baseY - 44 + idleBobY, 20, 6, palette.mid);
    drawRect(context, centerX - 7, baseY - 50 + idleBobY, 14, 6, palette.base);
    drawRect(context, centerX - 5, baseY - 54 + idleBobY, 12, 4, palette.tip);
    drawRect(context, centerX - 8, baseY - 56 + idleBobY, 8, 3, palette.tip);

    // Gnarled Wooden Staff & Luminous Biome Gem
    const staffX = centerX + 14;
    const staffTopY = baseY - 40 + idleBobY + staffLiftY;
    drawRect(context, staffX, staffTopY + 6, 3, 34, '#3D271E');
    drawRect(context, staffX + 1, staffTopY + 8, 2, 30, '#5C3A2B');

    const isGemPulsing = isCasting || (Math.floor(sanctuaryTick / 12) % 2 === 0);
    if (isCasting) {
        drawRect(context, staffX - 7, staffTopY - 5, 17, 17, 'rgba(243, 213, 181, 0.25)');
    }
    drawRect(context, staffX - 3, staffTopY - 1, 9, 9, palette.mid);
    drawRect(context, staffX - 1, staffTopY + 1, 5, 5, isGemPulsing ? palette.accent : palette.tip);

    const panelElement = document.getElementById('floraPanel');
    const isPanelHidden = !panelElement || panelElement.classList.contains('hidden');

    if (isHovered && isPanelHidden) {
        const hoverLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary.mageHover;
        drawFloatingPixelLabel(context, centerX, baseY - 68 + idleBobY, hoverLabel, palette.tip);
    }
}

export function positionFloraPanelAboveMage(mageZone, viewportWidth, viewportHeight) {
    const panelElement = document.getElementById('floraPanel');
    if (!panelElement || panelElement.classList.contains('hidden') || !mageZone) return;

    const panelWidth = panelElement.offsetWidth || 256;
    const panelHeight = panelElement.offsetHeight || 290;
    const screenMargin = 12;

    const idealLeft = Math.round(mageZone.centerX - panelWidth / 2);
    const clampedLeft = clampValue(idealLeft, screenMargin, viewportWidth - panelWidth - screenMargin);

    const idealTop = Math.round(mageZone.baseY - 68 - panelHeight);
    const minTop = 76;
    const maxTop = Math.max(minTop, viewportHeight - panelHeight - 48);
    const clampedTop = clampValue(idealTop, minTop, maxTop);

    panelElement.style.left = `${clampedLeft}px`;
    panelElement.style.top = `${clampedTop}px`;

    const arrowElement = document.getElementById('floraPanelArrow');
    if (arrowElement) {
        const arrowLocalX = clampValue(mageZone.centerX - clampedLeft, 18, panelWidth - 18);
        arrowElement.style.left = `${arrowLocalX}px`;
    }
}

function updateSliderAndBadge(sliderId, badgeId, rawValue, formattedText) {
    const sliderElement = document.getElementById(sliderId);
    const badgeElement = document.getElementById(badgeId);
    if (sliderElement) {
        sliderElement.value = String(rawValue);
    }
    if (badgeElement) {
        badgeElement.textContent = formattedText;
    }
}

export function syncFloraPanelUI() {
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

export function toggleFloraPanel(forceOpen = null, mageZone = null) {
    const panelElement = document.getElementById('floraPanel');
    if (!panelElement) return false;

    const isCurrentlyHidden = panelElement.classList.contains('hidden');
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : isCurrentlyHidden;
    panelElement.classList.toggle('hidden', !shouldOpen);
    if (shouldOpen) {
        syncFloraPanelUI();
        if (mageZone) {
            positionFloraPanelAboveMage(mageZone, window.innerWidth, window.innerHeight);
        }
    }
    return shouldOpen;
}

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

    const reseedButton = document.getElementById('floraReseedBtn');
    if (reseedButton) {
        reseedButton.addEventListener('click', () => {
            const nextSeed = Math.floor(100000 + Math.random() * 900000);
            updateFloraConfig({ seed: nextSeed });
            syncFloraPanelUI();
            floraSpell();
            if (typeof onMageSpellCast === 'function') {
                onMageSpellCast(true);
            }
        });
    }

    const closeButton = document.getElementById('floraCloseBtn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            playSound('click');
            toggleFloraPanel(false);
        });
    }

    syncFloraPanelUI();
}
