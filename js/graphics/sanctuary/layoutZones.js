/**************************************************************
 * SANCTUARY RESPONSIVE LAYOUT ZONES & HIT DETECTION
 **************************************************************/

import { getCurrentLanguage } from '../../config/i18n.js';
import { isPointInRect } from '../sprites/index.js';
import { buildConstellationZones } from './constellations.js';
import { getCelestialBodyZone } from './celestialSystem.js';

let cachedLayoutState = {
    cacheKey: '',
    baseHeroY: 0,
    zones: null
};

export function getLayoutZones(width, height, heroOffsetY = 0) {
    const activeLanguage = getCurrentLanguage();
    const cacheKey = `${width}x${height}:${activeLanguage}`;

    if (cachedLayoutState.cacheKey !== cacheKey || !cachedLayoutState.zones) {
        const horizonY = Math.floor(height * 0.66);
        const treeX = Math.floor(width * 0.19);
        const treeY = horizonY - 148;

        const pondX = Math.floor(width * 0.28);
        const pondY = horizonY + 26;
        const pondW = Math.min(340, Math.floor(width * 0.36));
        const pondH = 68;

        const consoleX = Math.floor(width * 0.50);
        const consoleY = horizonY - 38;

        const dungeonX = Math.floor(width * 0.76);
        const dungeonY = horizonY - 140;

        const consoleRightEdge = consoleX + 36;
        const dungeonLeftEdge = dungeonX - 74;
        const mageX = Math.floor((consoleRightEdge + dungeonLeftEdge) / 2);

        const heroX = Math.floor(width * 0.36);
        const baseHeroY = horizonY - 36;

        const constellations = buildConstellationZones(width, height, horizonY);
        const initialCelestialZone = getCelestialBodyZone(width, height, horizonY);

        cachedLayoutState = {
            cacheKey,
            baseHeroY,
            zones: {
                horizonY,
                constellations,
                tree: { x: treeX - 88, y: treeY - 36, w: 176, h: 196, centerX: treeX, baseY: horizonY },
                pond: { x: pondX, y: pondY, w: pondW, h: pondH },
                console: { x: consoleX - 32, y: consoleY - 16, w: 68, h: 58, baseX: consoleX, baseY: consoleY },
                mage: { x: mageX - 20, y: horizonY - 58, w: 42, h: 60, centerX: mageX, baseY: horizonY },
                dungeon: { x: dungeonX - 74, y: dungeonY - 10, w: 148, h: 156, centerX: dungeonX, baseY: horizonY },
                moon: initialCelestialZone,
                celestial: initialCelestialZone,
                hero: { x: heroX - 6, y: baseHeroY - 6, w: 48, h: 48, spriteX: heroX, spriteY: baseHeroY }
            }
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
    if (isPointInRect(pointX, pointY, zones.dungeon)) return 'dungeon';
    if (isPointInRect(pointX, pointY, zones.tree)) return 'tree';
    if (isPointInRect(pointX, pointY, zones.pond)) return 'pond';
    if (isPointInRect(pointX, pointY, zones.hero)) return 'hero';
    if (isPointInRect(pointX, pointY, zones.moon)) return 'moon';
    return null;
}
