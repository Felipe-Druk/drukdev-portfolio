/**************************************************************
 * SANCTUARY RESPONSIVE LAYOUT ZONES & HIT DETECTION
 **************************************************************/

import { getCurrentLanguage } from '../../config/i18n.js';
import { clamp, isPortraitAspectRatio } from '../../utils/mathUtils.js';
import { isPointInRect } from '../sprites/index.js';
import { buildConstellationZones } from './constellations.js';
import { getCelestialBodyZone } from './celestialSystem.js';

export { isPortraitAspectRatio };

const MIN_LOGICAL_CANVAS_WIDTH = 560;
const MIN_LOGICAL_CANVAS_HEIGHT = 520;
const MAX_DYNAMIC_RESOLUTION_SCALE = 1.65;

let cachedLayoutState = {
    cacheKey: '',
    baseHeroY: 0,
    zones: null
};

export function computeCanvasLogicalDimensions(viewportWidth, viewportHeight) {
    const safeWidth = Math.max(1, viewportWidth);
    const safeHeight = Math.max(1, viewportHeight);
    const widthScale = safeWidth < MIN_LOGICAL_CANVAS_WIDTH
        ? MIN_LOGICAL_CANVAS_WIDTH / safeWidth
        : 1;
    const heightScale = safeHeight < MIN_LOGICAL_CANVAS_HEIGHT
        ? MIN_LOGICAL_CANVAS_HEIGHT / safeHeight
        : 1;
    const resolutionScale = Math.min(
        MAX_DYNAMIC_RESOLUTION_SCALE,
        Math.max(1, widthScale, heightScale)
    );

    return {
        width: Math.round(safeWidth * resolutionScale),
        height: Math.round(safeHeight * resolutionScale),
        resolutionScale
    };
}

const POND_HEIGHT = 68;
const TREE_HORIZON_OFFSET_Y = 148;
const DUNGEON_HORIZON_OFFSET_Y = 140;

function computePortraitLayoutAnchors(width, height) {
    const horizonY = Math.floor(height * 0.62);
    const meadowSpan = Math.max(180, height - horizonY);

    const treeX = clamp(Math.floor(width * 0.21), 92, width - 92);
    const dungeonX = clamp(Math.floor(width * 0.79), 80, width - 80);

    const consoleX = Math.floor(width * 0.50);
    const consoleY = horizonY - 22;

    const pondW = Math.min(296, Math.floor(width * 0.54));
    const pondX = clamp(Math.floor((width - pondW) * 0.44), 76, width - pondW - 64);
    const pondY = horizonY + clamp(Math.floor(meadowSpan * 0.34), 76, 148);

    const heroX = clamp(pondX - 50, 20, width - 64);
    const baseHeroY = pondY - 34;

    const mageX = clamp(pondX + pondW + 38, 36, width - 36);
    const mageBaseY = pondY + 24;

    const blueMageX = Math.floor(width * 0.50);
    const blueMageBaseY = clamp(Math.floor(horizonY * 0.74), 240, horizonY - 76);

    return {
        horizonY,
        treeX,
        pondX,
        pondY,
        pondW,
        consoleX,
        consoleY,
        dungeonX,
        mageX,
        mageBaseY,
        blueMageX,
        blueMageBaseY,
        heroX,
        baseHeroY
    };
}

function computeLandscapeLayoutAnchors(width, height) {
    const horizonY = Math.floor(height * 0.66);
    const treeX = Math.max(92, Math.floor(width * 0.19));

    const pondX = Math.floor(width * 0.28);
    const pondY = horizonY + 26;
    const pondW = Math.min(340, Math.floor(width * 0.36));

    const consoleX = Math.floor(width * 0.50);
    const consoleY = horizonY - 38;

    const dungeonX = Math.min(width - 80, Math.floor(width * 0.76));

    const consoleRightEdge = consoleX + 36;
    const dungeonLeftEdge = dungeonX - 74;
    const hasHorizonGapForMage = dungeonLeftEdge - consoleRightEdge >= 48;
    const mageX = hasHorizonGapForMage
        ? Math.floor((consoleRightEdge + dungeonLeftEdge) / 2)
        : clamp(pondX + pondW + 36, 36, width - 36);
    const mageBaseY = hasHorizonGapForMage ? horizonY : pondY + 34;

    const blueMageX = Math.floor(width * 0.46);
    const blueMageBaseY = clamp(Math.floor(horizonY * 0.68), 210, horizonY - 82);

    const heroX = Math.floor(width * 0.36);
    const baseHeroY = horizonY - 36;

    return {
        horizonY,
        treeX,
        pondX,
        pondY,
        pondW,
        consoleX,
        consoleY,
        dungeonX,
        mageX,
        mageBaseY,
        blueMageX,
        blueMageBaseY,
        heroX,
        baseHeroY
    };
}

function buildZonesFromAnchors(width, height, anchors) {
    const {
        horizonY,
        treeX,
        pondX,
        pondY,
        pondW,
        consoleX,
        consoleY,
        dungeonX,
        mageX,
        mageBaseY,
        blueMageX,
        blueMageBaseY,
        heroX,
        baseHeroY
    } = anchors;

    const treeY = horizonY - TREE_HORIZON_OFFSET_Y;
    const dungeonY = horizonY - DUNGEON_HORIZON_OFFSET_Y;
    const blueMageZone = {
        x: blueMageX - 32,
        y: blueMageBaseY - 64,
        w: 64,
        h: 78,
        centerX: blueMageX,
        baseY: blueMageBaseY
    };

    const constellations = buildConstellationZones(width, height, horizonY);
    const initialCelestialZone = getCelestialBodyZone(width, height, horizonY);

    return {
        horizonY,
        constellations,
        tree: { x: treeX - 88, y: treeY - 36, w: 176, h: 196, centerX: treeX, baseY: horizonY },
        pond: { x: pondX, y: pondY, w: pondW, h: POND_HEIGHT },
        console: { x: consoleX - 32, y: consoleY - 16, w: 68, h: 58, baseX: consoleX, baseY: consoleY },
        mage: { x: mageX - 20, y: mageBaseY - 58, w: 42, h: 60, centerX: mageX, baseY: mageBaseY },
        blueMage: blueMageZone,
        blueMageZone,
        dungeon: { x: dungeonX - 74, y: dungeonY - 10, w: 148, h: 156, centerX: dungeonX, baseY: horizonY },
        moon: initialCelestialZone,
        celestial: initialCelestialZone,
        hero: { x: heroX - 6, y: baseHeroY - 6, w: 48, h: 48, spriteX: heroX, spriteY: baseHeroY }
    };
}

export function getLayoutZones(width, height, heroOffsetY = 0) {
    const activeLanguage = getCurrentLanguage();
    const cacheKey = `${width}x${height}:${activeLanguage}`;

    if (cachedLayoutState.cacheKey !== cacheKey || !cachedLayoutState.zones) {
        const anchors = isPortraitAspectRatio(width, height)
            ? computePortraitLayoutAnchors(width, height)
            : computeLandscapeLayoutAnchors(width, height);

        cachedLayoutState = {
            cacheKey,
            baseHeroY: anchors.baseHeroY,
            zones: buildZonesFromAnchors(width, height, anchors)
        };
    }

    const dynamicHeroY = cachedLayoutState.baseHeroY + heroOffsetY;
    cachedLayoutState.zones.hero.y = dynamicHeroY - 6;
    cachedLayoutState.zones.hero.spriteY = dynamicHeroY;

    const activeCelestialZone = getCelestialBodyZone(width, height, cachedLayoutState.zones.horizonY);
    cachedLayoutState.zones.moon = activeCelestialZone;
    cachedLayoutState.zones.celestial = activeCelestialZone;

    return cachedLayoutState.zones;
}

export function detectHoveredZone(pointX, pointY, zones) {
    for (let index = 0; index < zones.constellations.length; index++) {
        const constellation = zones.constellations[index];
        if (isPointInRect(pointX, pointY, constellation)) {
            return constellation.zoneKey;
        }
    }
    if (isPointInRect(pointX, pointY, zones.console)) return 'console';
    if (isPointInRect(pointX, pointY, zones.mage)) return 'mage';
    if (isPointInRect(pointX, pointY, zones.blueMage)) return 'blueMage';
    if (isPointInRect(pointX, pointY, zones.dungeon)) return 'dungeon';
    if (isPointInRect(pointX, pointY, zones.tree)) return 'tree';
    if (isPointInRect(pointX, pointY, zones.pond)) return 'pond';
    if (isPointInRect(pointX, pointY, zones.hero)) return 'hero';
    if (isPointInRect(pointX, pointY, zones.moon)) return 'moon';
    return null;
}
