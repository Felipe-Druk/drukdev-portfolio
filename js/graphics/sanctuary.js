/**************************************************************
 * INTERACTIVE PIXEL-ART SANCTUARY SCENE (MAIN STAGE CONTROLLER)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { playSound } from '../audio/soundEngine.js';
import { SPRITES, drawPixelSprite } from './sprites.js';
import { THEME_PALETTES } from '../config/themes.js';
import { drawFloatingPixelLabel, copyTextToClipboard } from './sanctuary/canvasUtils.js';
import { drawSkyConstellations, isConstellationZone } from './sanctuary/constellations.js';
import { getLayoutZones, detectHoveredZone } from './sanctuary/layoutZones.js';
import {
    initAmbientFireflies,
    spawnAmbientLagoonRipple,
    spawnTreeLeavesAndSpores,
    spawnPondRipple,
    spawnDungeonRuneSparks,
    spawnConstellationStarfall,
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

const pointerState = {
    x: -1,
    y: -1,
    hoveredZone: null
};

const sanctuaryState = {
    moonPhase: 0,
    treeRustleTimer: 0,
    dungeonShakeTimer: 0,
    dungeonMessageTimer: 0,
    mailCopiedTimer: 0,
    heroOffsetY: 0,
    heroVelocityY: 0,
    heroJumping: false
};

export function resizeSanctuary() {
    if (!sanctuaryCanvas) return;
    sanctuaryCanvas.width = window.innerWidth;
    sanctuaryCanvas.height = window.innerHeight;
    initAmbientFireflies(sanctuaryCanvas.width, sanctuaryCanvas.height);
}

function activateConstellation(constellation) {
    playSound('constellation');
    spawnConstellationStarfall(constellation);

    if (constellation.type === 'social') {
        window.open(constellation.targetValue, '_blank', 'noopener,noreferrer');
    } else if (constellation.type === 'email') {
        copyTextToClipboard(constellation.targetValue);
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
        sanctuaryState.dungeonShakeTimer = 24;
        sanctuaryState.dungeonMessageTimer = 150;
        playSound('seal');
        spawnDungeonRuneSparks(zones.dungeon);
    },
    hero: () => {
        if (!sanctuaryState.heroJumping) {
            sanctuaryState.heroVelocityY = -7.8;
            sanctuaryState.heroJumping = true;
            playSound('jump');
        }
    },
    moon: () => {
        sanctuaryState.moonPhase = (sanctuaryState.moonPhase + 1) % 4;
        playSound('coin');
    }
};

function handleSanctuaryClick(clickX, clickY) {
    const zones = getLayoutZones(
        sanctuaryCanvas.width,
        sanctuaryCanvas.height,
        sanctuaryState.heroOffsetY
    );
    const hitZone = detectHoveredZone(clickX, clickY, zones);
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

export function initSanctuary(onOpenTerminal) {
    openTerminalCallback = onOpenTerminal;
    sanctuaryCanvas = document.getElementById('sanctuaryCanvas');
    if (!sanctuaryCanvas) return;
    sanctuaryContext = sanctuaryCanvas.getContext('2d');

    resizeSanctuary();

    sanctuaryCanvas.addEventListener('mousemove', (event) => {
        const rect = sanctuaryCanvas.getBoundingClientRect();
        pointerState.x = event.clientX - rect.left;
        pointerState.y = event.clientY - rect.top;
        const zones = getLayoutZones(
            sanctuaryCanvas.width,
            sanctuaryCanvas.height,
            sanctuaryState.heroOffsetY
        );
        const nextHoveredZone = detectHoveredZone(pointerState.x, pointerState.y, zones);

        if (nextHoveredZone !== pointerState.hoveredZone && isConstellationZone(nextHoveredZone)) {
            playSound('starHover');
        }

        pointerState.hoveredZone = nextHoveredZone;
        sanctuaryCanvas.style.cursor = pointerState.hoveredZone ? 'pointer' : 'default';
    });

    sanctuaryCanvas.addEventListener('click', (event) => {
        const rect = sanctuaryCanvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        handleSanctuaryClick(clickX, clickY);
    });
}

function updateSanctuaryState(zones) {
    if (sanctuaryState.treeRustleTimer > 0) sanctuaryState.treeRustleTimer--;
    if (sanctuaryState.dungeonShakeTimer > 0) sanctuaryState.dungeonShakeTimer--;
    if (sanctuaryState.dungeonMessageTimer > 0) sanctuaryState.dungeonMessageTimer--;
    if (sanctuaryState.mailCopiedTimer > 0) sanctuaryState.mailCopiedTimer--;

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
    const width = sanctuaryCanvas.width;
    const height = sanctuaryCanvas.height;
    const zones = getLayoutZones(width, height, sanctuaryState.heroOffsetY);

    updateSanctuaryState(zones);

    drawNightSkyAndMoon(sanctuaryContext, width, height, zones.moon, sanctuaryState.moonPhase);
    drawSkyConstellations(
        sanctuaryContext,
        zones.constellations,
        pointerState.hoveredZone,
        sanctuaryTick,
        sanctuaryState.mailCopiedTimer
    );
    drawSanctuaryMeadowAndLagoon(sanctuaryContext, width, height, zones, sanctuaryTick);
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

    if (pointerState.hoveredZone === 'pond') {
        const pondLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary.pondHover;
        drawFloatingPixelLabel(
            sanctuaryContext,
            zones.pond.x + zones.pond.w / 2,
            zones.pond.y - 14,
            pondLabel,
            '#7AD7F0'
        );
    }

    const idleBob = sanctuaryState.heroJumping ? 0 : (Math.sin(sanctuaryTick * 0.08) > 0 ? -3 : 0);
    drawPixelSprite(
        sanctuaryContext,
        SPRITES.fantasyKnight,
        zones.hero.spriteX,
        zones.hero.spriteY + idleBob,
        3,
        THEME_PALETTES.fantasy.spriteColors
    );

    updateAndDrawParticles(sanctuaryContext, width, height, sanctuaryTick);
}
