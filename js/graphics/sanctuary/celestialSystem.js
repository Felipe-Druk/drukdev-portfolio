/**************************************************************
 * CELESTIAL CYCLE SYSTEM — STATE, PARABOLIC ARC & SUN/MOON RENDERING
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import {
    DRUK_CORE_PALETTE,
    SANCTUARY_SCENE_PALETTE
} from '../../config/palettes.js';
import { drawRect, drawFloatingPixelLabel } from '../sprites/index.js';

export const CELESTIAL_STORAGE_KEY = 'druk_celestial_mode';
export const CELESTIAL_TRANSITION_DURATION_MS = 2200;

const CELESTIAL_MODES = Object.freeze({
    NIGHT: 'night',
    DAY: 'day'
});

function loadInitialCelestialMode() {
    try {
        const savedMode = localStorage.getItem(CELESTIAL_STORAGE_KEY);
        if (savedMode === CELESTIAL_MODES.DAY || savedMode === CELESTIAL_MODES.NIGHT) {
            return savedMode;
        }
    } catch {
        // Ignore storage read errors in restricted environments
    }
    return CELESTIAL_MODES.NIGHT;
}

function saveCelestialMode(mode) {
    try {
        localStorage.setItem(CELESTIAL_STORAGE_KEY, mode);
    } catch {
        // Ignore storage quota errors
    }
}

const initialMode = loadInitialCelestialMode();
const initialProgress = initialMode === CELESTIAL_MODES.DAY ? 1.0 : 0.0;

const celestialState = {
    mode: initialMode,
    progress: initialProgress,
    isTransitioning: false,
    startProgress: initialProgress,
    targetProgress: initialProgress,
    transitionStartTime: 0
};

export function easeInOutCubic(normalizedTime) {
    const clampedTime = Math.max(0, Math.min(1, normalizedTime));
    return clampedTime < 0.5
        ? 4 * clampedTime * clampedTime * clampedTime
        : 1 - Math.pow(-2 * clampedTime + 2, 3) / 2;
}

export function getCelestialState() {
    return {
        mode: celestialState.mode,
        progress: celestialState.progress,
        isTransitioning: celestialState.isTransitioning
    };
}

export function getCelestialProgress() {
    return celestialState.progress;
}

export function getCelestialMode() {
    return celestialState.mode;
}

export function toggleCelestialCycle(currentTimestamp = performance.now()) {
    const nextMode = celestialState.mode === CELESTIAL_MODES.NIGHT
        ? CELESTIAL_MODES.DAY
        : CELESTIAL_MODES.NIGHT;

    celestialState.mode = nextMode;
    celestialState.startProgress = celestialState.progress;
    celestialState.targetProgress = nextMode === CELESTIAL_MODES.DAY ? 1.0 : 0.0;
    celestialState.transitionStartTime = currentTimestamp;
    celestialState.isTransitioning = true;

    saveCelestialMode(nextMode);
    return nextMode;
}

export function updateCelestialCycle(currentTimestamp = performance.now()) {
    if (!celestialState.isTransitioning) {
        return celestialState.progress;
    }

    const elapsedMs = Math.max(0, currentTimestamp - celestialState.transitionStartTime);
    const normalizedTime = Math.min(1, elapsedMs / CELESTIAL_TRANSITION_DURATION_MS);
    const easedFactor = easeInOutCubic(normalizedTime);

    celestialState.progress = (
        celestialState.startProgress +
        (celestialState.targetProgress - celestialState.startProgress) * easedFactor
    );

    if (normalizedTime >= 1) {
        celestialState.progress = celestialState.targetProgress;
        celestialState.isTransitioning = false;
    }

    return celestialState.progress;
}

export function getCelestialBodyZone(canvasWidth, canvasHeight, horizonY) {
    const resolvedHorizonY = Number.isFinite(horizonY)
        ? horizonY
        : Math.floor(canvasHeight * 0.66);

    const zenithX = Math.floor(canvasWidth * (canvasWidth < 640 ? 0.85 : 0.83));
    const zenithY = Math.max(58, Math.floor(canvasHeight * 0.11));

    const maxHorizontalArcOffset = Math.min(76, Math.max(24, canvasWidth - zenithX - 20));
    const mountainRidgeY = Math.floor(canvasHeight * 0.50);
    const horizonSinkY = Math.max(mountainRidgeY + 38, Math.floor(resolvedHorizonY * 0.92));

    // Parabolic horizon factor: 0.0 at zenith (progress 0 or 1), 1.0 at horizon (progress 0.5)
    const horizonFactor = 1 - Math.abs(celestialState.progress - 0.5) * 2;
    const clampedFactor = Math.max(0, Math.min(1, horizonFactor));

    const centerX = Math.floor(zenithX + maxHorizontalArcOffset * clampedFactor);
    const centerY = Math.floor(zenithY + (horizonSinkY - zenithY) * (clampedFactor * clampedFactor));
    const isSolarPhase = celestialState.progress >= 0.5;

    return {
        x: centerX - 30,
        y: centerY - 30,
        w: 60,
        h: 60,
        centerX,
        centerY,
        zenithX,
        zenithY,
        bodyType: isSolarPhase ? 'sun' : 'moon'
    };
}

function drawMysticMoon(context, centerX, centerY) {
    drawRect(context, centerX - 30, centerY - 30, 60, 60, SANCTUARY_SCENE_PALETTE.moonHalo);
    drawRect(context, centerX - 22, centerY - 22, 44, 44, DRUK_CORE_PALETTE.dragonBase);
    drawRect(context, centerX - 16, centerY - 16, 32, 32, DRUK_CORE_PALETTE.dragonLight);
    drawRect(context, centerX - 10, centerY - 10, 20, 20, DRUK_CORE_PALETTE.bronzeWarm);
}

function drawPixelArtSun(context, centerX, centerY, sanctuaryTick) {
    const pulseWave = Math.sin(sanctuaryTick * 0.06);
    const coronaExpand = pulseWave > 0.25 ? 4 : (pulseWave < -0.25 ? 0 : 2);
    const coronaSize = 60 + coronaExpand * 2;

    // Subtle pulsing outer solar corona & cardinal rays
    drawRect(
        context,
        centerX - coronaSize / 2,
        centerY - coronaSize / 2,
        coronaSize,
        coronaSize,
        SANCTUARY_SCENE_PALETTE.sunHalo
    );
    drawRect(
        context,
        centerX - coronaSize / 2 - 4,
        centerY - 10,
        coronaSize + 8,
        20,
        SANCTUARY_SCENE_PALETTE.sunHalo
    );
    drawRect(
        context,
        centerX - 10,
        centerY - coronaSize / 2 - 4,
        20,
        coronaSize + 8,
        SANCTUARY_SCENE_PALETTE.sunHalo
    );

    // Concentric geometric pixel-art solar rings & ivory core
    drawRect(context, centerX - 24, centerY - 24, 48, 48, SANCTUARY_SCENE_PALETTE.sunOuterRing);
    drawRect(context, centerX - 17, centerY - 17, 34, 34, SANCTUARY_SCENE_PALETTE.sunInnerRing);
    drawRect(context, centerX - 10, centerY - 10, 20, 20, SANCTUARY_SCENE_PALETTE.sunCore);
}

export function drawCelestialBody(context, celestialZone, sanctuaryTick = 0) {
    const { centerX, centerY, bodyType } = celestialZone;
    if (bodyType === 'sun') {
        drawPixelArtSun(context, centerX, centerY, sanctuaryTick);
    } else {
        drawMysticMoon(context, centerX, centerY);
    }
}

export function drawCelestialHoverLabel(context, celestialZone, canvasWidth, horizonY) {
    const sanctuaryTranslations = TRANSLATIONS[getCurrentLanguage()].sanctuary;
    const isSun = celestialZone.bodyType === 'sun';
    const labelText = isSun
        ? sanctuaryTranslations.sunHover
        : sanctuaryTranslations.moonHover;
    const borderColor = isSun
        ? SANCTUARY_SCENE_PALETTE.sunInnerRing
        : DRUK_CORE_PALETTE.bronzeWarm;

    const clampedCenterX = Math.max(96, Math.min(canvasWidth - 96, celestialZone.centerX));
    const maxLabelY = Number.isFinite(horizonY) ? horizonY - 18 : celestialZone.centerY + 46;
    const labelY = Math.min(maxLabelY, celestialZone.centerY + 46);

    drawFloatingPixelLabel(context, clampedCenterX, labelY, labelText, borderColor);
}
