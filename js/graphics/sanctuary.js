/**************************************************************
 * INTERACTIVE PIXEL-ART SANCTUARY SCENE (MAIN STAGE CONTROLLER)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { SANCTUARY_SCENE_PALETTE, getInterpolatedScenePalette } from '../config/palettes.js';
import { playSound, floraSpell, windSpell, celestialShift } from '../audio/index.js';
import { copyTextToClipboard } from '../utils/clipboard.js';
import {
    drawFloatingPixelLabel,
    drawGreenMage,
    drawBlueMage,
    drawDragonKnightGuardian
} from './sprites/index.js';
import {
    drawSkyConstellations,
    isConstellationZone,
    dismissConstellationAttentionBlink
} from './sanctuary/constellations.js';
import {
    getLayoutZones,
    detectHoveredZone,
    computeCanvasLogicalDimensions
} from './sanctuary/layoutZones.js';
import {
    getCelestialProgress,
    toggleCelestialCycle,
    updateCelestialCycle
} from './sanctuary/celestialSystem.js';
import { closeAllGrimoires } from './sanctuary/grimoirePanelUtils.js';
import {
    isFloraPanelOpen,
    initFloraPanelUI,
    toggleFloraPanel,
    positionFloraPanelAboveMage
} from './sanctuary/floraPanelUI.js';
import {
    isCloudPanelOpen,
    initCloudPanelUI,
    toggleCloudPanel,
    positionCloudPanelNearBlueMage
} from './sanctuary/cloudPanelUI.js';
import {
    initAmbientFireflies,
    spawnAmbientLagoonRipple,
    spawnTreeLeavesAndSpores,
    spawnPondRipple,
    spawnDungeonRuneSparks,
    spawnConstellationStarfall,
    spawnMageFloraWave,
    spawnBlueMageWindWave,
    spawnCelestialBurst,
    updateAndDrawParticles
} from './sanctuary/particles.js';
import {
    drawNightSkyAndMoon,
    drawSanctuaryMeadowAndLagoon,
    drawAncientTree,
    drawSealedDungeonPortal,
    drawDrukSystemRelicConsole
} from './sanctuary/environmentRenderer.js';

let sanctuaryCanvas = null;
let sanctuaryContext = null;
let sanctuaryTick = 0;
let openTerminalCallback = null;
let openDungeonCallback = null;
let copyEmailCallback = null;

const pointerState = {
    x: -1,
    y: -1,
    hoveredZone: null
};

const sanctuaryState = {
    treeRustleTimer: 0,
    dungeonShakeTimer: 0,
    dungeonMessageTimer: 0,
    mailCopiedTimer: 0,
    mageCastTimer: 0,
    blueMageCastTimer: 0,
    heroOffsetY: 0,
    heroVelocityY: 0,
    heroJumping: false
};

function getCurrentSanctuaryZones() {
    return getLayoutZones(
        sanctuaryCanvas.width,
        sanctuaryCanvas.height,
        sanctuaryState.heroOffsetY
    );
}

export function resizeSanctuary() {
    if (!sanctuaryCanvas) return;
    const logicalDimensions = computeCanvasLogicalDimensions(window.innerWidth, window.innerHeight);
    sanctuaryCanvas.width = logicalDimensions.width;
    sanctuaryCanvas.height = logicalDimensions.height;
    initAmbientFireflies(sanctuaryCanvas.width, sanctuaryCanvas.height);

    const zones = getCurrentSanctuaryZones();
    positionFloraPanelAboveMage(zones.mage, window.innerWidth, window.innerHeight);
    positionCloudPanelNearBlueMage(zones.blueMage, window.innerWidth, window.innerHeight);
}

function triggerMageCastEffect(includeMeadowBurst = false) {
    if (!sanctuaryCanvas) return;
    const zones = getCurrentSanctuaryZones();
    sanctuaryState.mageCastTimer = 32;
    spawnMageFloraWave(zones.mage, zones.horizonY, sanctuaryCanvas.width, includeMeadowBurst);
}

function triggerBlueMageCastEffect(includeSkyGust = false) {
    if (!sanctuaryCanvas) return;
    const zones = getCurrentSanctuaryZones();
    sanctuaryState.blueMageCastTimer = 32;
    spawnBlueMageWindWave(zones.blueMage, zones.horizonY, sanctuaryCanvas.width, includeSkyGust);
}

function activateConstellation(constellation) {
    dismissConstellationAttentionBlink();
    playSound('constellation');
    spawnConstellationStarfall(constellation);

    if (constellation.type === 'social' || constellation.type === 'cv') {
        window.open(constellation.targetValue, '_blank', 'noopener,noreferrer');
    } else if (constellation.type === 'email') {
        if (typeof copyEmailCallback === 'function') {
            copyEmailCallback();
        } else {
            copyTextToClipboard(constellation.targetValue);
        }
        sanctuaryState.mailCopiedTimer = 115;
    }
}

const ZONE_CLICK_HANDLERS = {
    console: () => {
        playSound('terminal');
        if (typeof openTerminalCallback === 'function') {
            openTerminalCallback();
        }
    },
    mage: (zones) => {
        floraSpell();
        sanctuaryState.mageCastTimer = 32;
        spawnMageFloraWave(zones.mage, zones.horizonY, sanctuaryCanvas.width, true);
        toggleFloraPanel(null, zones.mage);
    },
    blueMage: (zones) => {
        windSpell();
        sanctuaryState.blueMageCastTimer = 32;
        spawnBlueMageWindWave(zones.blueMage, zones.horizonY, sanctuaryCanvas.width, true);
        toggleCloudPanel(null, zones.blueMage);
    },
    tree: (zones) => {
        sanctuaryState.treeRustleTimer = 28;
        playSound('tree');
        spawnTreeLeavesAndSpores(zones.tree);
    },
    pond: (zones, clickX, clickY) => {
        playSound('water');
        spawnPondRipple(clickX, clickY, zones.pond);
    },
    dungeon: (zones) => {
        sanctuaryState.dungeonShakeTimer = 16;
        sanctuaryState.dungeonMessageTimer = 60;
        playSound('constellation');
        spawnDungeonRuneSparks(zones.dungeon);
        if (typeof openDungeonCallback === 'function') {
            openDungeonCallback();
        }
    },
    hero: () => {
        if (!sanctuaryState.heroJumping) {
            sanctuaryState.heroVelocityY = -7.8;
            sanctuaryState.heroJumping = true;
            playSound('jump');
        }
    },
    moon: (zones) => {
        toggleCelestialCycle();
        celestialShift();
        spawnCelestialBurst(zones.moon);
    }
};

function mapClientPointToCanvas(clientX, clientY) {
    if (!sanctuaryCanvas) return { x: 0, y: 0 };
    const rect = sanctuaryCanvas.getBoundingClientRect();
    const scaleX = sanctuaryCanvas.width / Math.max(1, rect.width);
    const scaleY = sanctuaryCanvas.height / Math.max(1, rect.height);
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function updatePointerHoverState(canvasX, canvasY) {
    pointerState.x = canvasX;
    pointerState.y = canvasY;
    const zones = getCurrentSanctuaryZones();
    const nextHoveredZone = detectHoveredZone(pointerState.x, pointerState.y, zones);

    if (isConstellationZone(nextHoveredZone)) {
        dismissConstellationAttentionBlink();
        if (nextHoveredZone !== pointerState.hoveredZone) {
            playSound('starHover');
        }
    }

    pointerState.hoveredZone = nextHoveredZone;
    sanctuaryCanvas.style.cursor = pointerState.hoveredZone ? 'pointer' : 'default';
}

function handleSanctuaryClick(clickX, clickY) {
    pointerState.x = clickX;
    pointerState.y = clickY;
    const zones = getCurrentSanctuaryZones();
    const hitZone = detectHoveredZone(clickX, clickY, zones);
    pointerState.hoveredZone = hitZone;

    if (hitZone !== 'mage' && hitZone !== 'blueMage') {
        closeAllGrimoires();
    }
    if (!hitZone) return;

    if (isConstellationZone(hitZone)) {
        const clickedConstellation = zones.constellations.find((item) => item.zoneKey === hitZone);
        if (clickedConstellation) {
            activateConstellation(clickedConstellation);
        }
        return;
    }

    const zoneHandler = ZONE_CLICK_HANDLERS[hitZone];
    if (zoneHandler) {
        zoneHandler(zones, clickX, clickY);
    }
}

export function initSanctuary(onOpenTerminal, onOpenDungeon, onCopyEmail = null) {
    openTerminalCallback = onOpenTerminal;
    openDungeonCallback = onOpenDungeon;
    copyEmailCallback = onCopyEmail;
    sanctuaryCanvas = document.getElementById('sanctuaryCanvas');
    if (!sanctuaryCanvas) return;
    sanctuaryContext = sanctuaryCanvas.getContext('2d');

    resizeSanctuary();
    initFloraPanelUI(triggerMageCastEffect);
    initCloudPanelUI(triggerBlueMageCastEffect);

    sanctuaryCanvas.addEventListener('mousemove', (event) => {
        const canvasPoint = mapClientPointToCanvas(event.clientX, event.clientY);
        updatePointerHoverState(canvasPoint.x, canvasPoint.y);
    });

    sanctuaryCanvas.addEventListener('touchmove', (event) => {
        if (!event.touches || event.touches.length === 0) return;
        const primaryTouch = event.touches[0];
        const canvasPoint = mapClientPointToCanvas(primaryTouch.clientX, primaryTouch.clientY);
        updatePointerHoverState(canvasPoint.x, canvasPoint.y);
    }, { passive: true });

    sanctuaryCanvas.addEventListener('click', (event) => {
        const canvasPoint = mapClientPointToCanvas(event.clientX, event.clientY);
        handleSanctuaryClick(canvasPoint.x, canvasPoint.y);
    });
}

function updateSanctuaryState(zones) {
    if (sanctuaryState.treeRustleTimer > 0) sanctuaryState.treeRustleTimer--;
    if (sanctuaryState.dungeonShakeTimer > 0) sanctuaryState.dungeonShakeTimer--;
    if (sanctuaryState.dungeonMessageTimer > 0) sanctuaryState.dungeonMessageTimer--;
    if (sanctuaryState.mailCopiedTimer > 0) sanctuaryState.mailCopiedTimer--;
    if (sanctuaryState.mageCastTimer > 0) sanctuaryState.mageCastTimer--;
    if (sanctuaryState.blueMageCastTimer > 0) sanctuaryState.blueMageCastTimer--;

    if (sanctuaryState.heroJumping) {
        sanctuaryState.heroOffsetY += sanctuaryState.heroVelocityY;
        sanctuaryState.heroVelocityY += 0.45;
        if (sanctuaryState.heroOffsetY >= 0) {
            sanctuaryState.heroOffsetY = 0;
            sanctuaryState.heroVelocityY = 0;
            sanctuaryState.heroJumping = false;
        }
    }

    if (sanctuaryTick % 140 === 0) {
        spawnAmbientLagoonRipple(zones.pond);
    }
}

export function updateAndDrawSanctuary() {
    if (!sanctuaryCanvas || !sanctuaryContext) return;

    sanctuaryTick++;
    updateCelestialCycle();

    const width = sanctuaryCanvas.width;
    const height = sanctuaryCanvas.height;
    const zones = getLayoutZones(width, height, sanctuaryState.heroOffsetY);

    if (pointerState.x >= 0 && pointerState.y >= 0) {
        pointerState.hoveredZone = detectHoveredZone(pointerState.x, pointerState.y, zones);
        sanctuaryCanvas.style.cursor = pointerState.hoveredZone ? 'pointer' : 'default';
    }

    updateSanctuaryState(zones);

    const celestialProgress = getCelestialProgress();
    const scenePalette = getInterpolatedScenePalette(celestialProgress);

    drawNightSkyAndMoon(
        sanctuaryContext,
        width,
        height,
        zones.moon,
        sanctuaryTick,
        pointerState.hoveredZone === 'moon',
        zones.horizonY,
        scenePalette,
        celestialProgress
    );
    drawSkyConstellations(
        sanctuaryContext,
        zones.constellations,
        pointerState.hoveredZone,
        sanctuaryTick,
        sanctuaryState.mailCopiedTimer,
        scenePalette,
        celestialProgress
    );
    drawBlueMage(
        sanctuaryContext,
        zones.blueMage,
        pointerState.hoveredZone === 'blueMage',
        sanctuaryTick,
        sanctuaryState.blueMageCastTimer,
        isCloudPanelOpen(),
        celestialProgress
    );
    drawSanctuaryMeadowAndLagoon(
        sanctuaryContext,
        width,
        height,
        zones,
        pointerState,
        sanctuaryTick,
        scenePalette
    );
    drawAncientTree(
        sanctuaryContext,
        zones.tree,
        pointerState.hoveredZone === 'tree',
        sanctuaryTick,
        sanctuaryState.treeRustleTimer
    );
    drawSealedDungeonPortal(
        sanctuaryContext,
        zones.dungeon,
        pointerState.hoveredZone === 'dungeon',
        sanctuaryTick,
        sanctuaryState.dungeonShakeTimer,
        sanctuaryState.dungeonMessageTimer
    );
    drawDrukSystemRelicConsole(
        sanctuaryContext,
        zones.console,
        pointerState.hoveredZone === 'console',
        sanctuaryTick
    );
    drawGreenMage(
        sanctuaryContext,
        zones.mage,
        pointerState.hoveredZone === 'mage',
        sanctuaryTick,
        sanctuaryState.mageCastTimer,
        isFloraPanelOpen()
    );

    if (pointerState.hoveredZone === 'pond') {
        const pondLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary.pondHover;
        drawFloatingPixelLabel(
            sanctuaryContext,
            zones.pond.x + zones.pond.w / 2,
            zones.pond.y - 14,
            pondLabel,
            SANCTUARY_SCENE_PALETTE.waterFoam
        );
    }

    const idleBob = sanctuaryState.heroJumping ? 0 : (Math.sin(sanctuaryTick * 0.08) > 0 ? -3 : 0);
    drawDragonKnightGuardian(
        sanctuaryContext,
        zones.hero.spriteX,
        zones.hero.spriteY + idleBob,
        3
    );

    updateAndDrawParticles(sanctuaryContext, width, height, sanctuaryTick);
}
