/**************************************************************
 * SANCTUARY RESPONSIVE LAYOUT ZONES & HIT DETECTION
 **************************************************************/

import { isPointInRect } from './canvasUtils.js';
import { buildConstellationZones } from './constellations.js';

export function getLayoutZones(width, height, heroOffsetY = 0) {
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

    const moonX = Math.floor(width * (width < 640 ? 0.88 : 0.84));
    const moonY = Math.max(58, Math.floor(height * 0.11));

    const heroX = Math.floor(width * 0.36);
    const heroY = horizonY - 36 + heroOffsetY;

    const constellations = buildConstellationZones(width, height, horizonY);

    return {
        horizonY,
        constellations,
        tree: { x: treeX - 88, y: treeY - 36, w: 176, h: 196, centerX: treeX, baseY: horizonY },
        pond: { x: pondX, y: pondY, w: pondW, h: pondH },
        console: { x: consoleX - 32, y: consoleY - 16, w: 68, h: 58, baseX: consoleX, baseY: consoleY },
        dungeon: { x: dungeonX - 74, y: dungeonY - 10, w: 148, h: 156, centerX: dungeonX, baseY: horizonY },
        moon: { x: moonX - 28, y: moonY - 28, w: 64, h: 64, centerX: moonX, centerY: moonY },
        hero: { x: heroX - 6, y: heroY - 6, w: 48, h: 48, spriteX: heroX, spriteY: heroY }
    };
}

export function detectHoveredZone(pointX, pointY, zones) {
    for (let index = 0; index < zones.constellations.length; index++) {
        const constellation = zones.constellations[index];
        if (isPointInRect(pointX, pointY, constellation)) {
            return constellation.zoneKey;
        }
    }
    if (isPointInRect(pointX, pointY, zones.console)) return 'console';
    if (isPointInRect(pointX, pointY, zones.dungeon)) return 'dungeon';
    if (isPointInRect(pointX, pointY, zones.tree)) return 'tree';
    if (isPointInRect(pointX, pointY, zones.pond)) return 'pond';
    if (isPointInRect(pointX, pointY, zones.hero)) return 'hero';
    if (isPointInRect(pointX, pointY, zones.moon)) return 'moon';
    return null;
}
