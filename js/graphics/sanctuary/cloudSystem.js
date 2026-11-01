/**************************************************************
 * PROCEDURAL PARALLAX CLOUD ENGINE — WEATHER STATE & SKY RENDERING
 **************************************************************/

import {
    CLOUD_PALETTES,
    setActiveWeatherKey,
    getActiveCloudPalette
} from '../../config/palettes.js';
import { snapToPixel, drawRect } from '../sprites/index.js';
import { getCelestialProgress } from './celestialSystem.js';
import { clamp } from '../../utils/mathUtils.js';
import { loadJson, saveJson } from '../../utils/safeStorage.js';
import { createSeededRandom } from '../../utils/seededRandom.js';

export const CLOUD_STORAGE_KEY = 'druk_cloud_config';
const MAX_CLOUD_COUNT = 18;
const WRAP_MARGIN_PX = 160;

const PARALLAX_LAYERS = Object.freeze({
    far: Object.freeze({
        key: 'far',
        speedMultiplier: 0.25,
        scaleMultiplier: 0.65,
        alpha: 0.68,
        minYRatio: 0.08,
        maxYRatio: 0.24
    }),
    mid: Object.freeze({
        key: 'mid',
        speedMultiplier: 0.55,
        scaleMultiplier: 0.85,
        alpha: 0.82,
        minYRatio: 0.16,
        maxYRatio: 0.36
    }),
    near: Object.freeze({
        key: 'near',
        speedMultiplier: 1.0,
        scaleMultiplier: 1.05,
        alpha: 0.94,
        minYRatio: 0.24,
        maxYRatio: 0.46
    })
});

const LAYER_ORDER = ['far', 'mid', 'near'];

const DEFAULT_CLOUD_CONFIG = {
    seed: 482915,
    density: 0.65,
    windSpeed: 0.8,
    cloudScale: 1.0,
    weather: 'ethereal'
};

export const clampCloudValue = clamp;

function loadCloudConfig() {
    const parsed = loadJson(CLOUD_STORAGE_KEY, null);
    if (!parsed) return { ...DEFAULT_CLOUD_CONFIG };

    const resolvedWeather = CLOUD_PALETTES[parsed.weather]
        ? parsed.weather
        : DEFAULT_CLOUD_CONFIG.weather;
    const rawDensity = typeof parsed.density === 'number'
        ? parsed.density
        : (typeof parsed.cloudCount === 'number' ? parsed.cloudCount : DEFAULT_CLOUD_CONFIG.density);

    return {
        seed: Number.isFinite(parsed.seed) ? parsed.seed : DEFAULT_CLOUD_CONFIG.seed,
        density: clamp(rawDensity, 0.0, 1.0),
        windSpeed: typeof parsed.windSpeed === 'number'
            ? clamp(parsed.windSpeed, -2.0, 2.0)
            : DEFAULT_CLOUD_CONFIG.windSpeed,
        cloudScale: typeof parsed.cloudScale === 'number'
            ? clamp(parsed.cloudScale, 0.5, 1.8)
            : DEFAULT_CLOUD_CONFIG.cloudScale,
        weather: resolvedWeather
    };
}

const cloudConfig = loadCloudConfig();
setActiveWeatherKey(cloudConfig.weather);

let cachedCloudState = {
    cacheKey: '',
    clouds: []
};

function saveCloudConfig() {
    saveJson(CLOUD_STORAGE_KEY, cloudConfig);
}

export function getCloudConfig() {
    return cloudConfig;
}

export function updateCloudConfig(partialConfig) {
    if (typeof partialConfig.seed === 'number') {
        cloudConfig.seed = Math.floor(partialConfig.seed);
    }
    if (typeof partialConfig.density === 'number') {
        cloudConfig.density = clamp(partialConfig.density, 0.0, 1.0);
    }
    if (typeof partialConfig.cloudCount === 'number') {
        cloudConfig.density = clamp(partialConfig.cloudCount, 0.0, 1.0);
    }
    if (typeof partialConfig.windSpeed === 'number') {
        cloudConfig.windSpeed = clamp(partialConfig.windSpeed, -2.0, 2.0);
    }
    if (typeof partialConfig.cloudScale === 'number') {
        cloudConfig.cloudScale = clamp(partialConfig.cloudScale, 0.5, 1.8);
    }
    if (typeof partialConfig.weather === 'string' && CLOUD_PALETTES[partialConfig.weather]) {
        cloudConfig.weather = setActiveWeatherKey(partialConfig.weather);
    }
    saveCloudConfig();
}

function createCloudLobes(random) {
    const lobeCount = 3 + Math.floor(random() * 4); // 3 to 6 overlapping lobes
    const lobes = [];

    for (let lobeIndex = 0; lobeIndex < lobeCount; lobeIndex++) {
        const normalizedIndex = lobeCount > 1 ? (lobeIndex / (lobeCount - 1)) - 0.5 : 0;
        const centerProximity = 1 - Math.abs(normalizedIndex) * 1.15;
        const offsetX = normalizedIndex * (54 + random() * 26);
        const offsetY = (1 - centerProximity) * 8 + (random() - 0.5) * 6;
        const radiusX = (18 + random() * 14) * (0.75 + centerProximity * 0.35);
        const radiusY = (10 + random() * 8) * (0.75 + centerProximity * 0.35);

        lobes.push({
            offsetX,
            offsetY,
            radiusX,
            radiusY
        });
    }

    return lobes;
}

function rebuildCloudPoolIfNeeded(width, height) {
    const cacheKey = `${width}x${height}:${cloudConfig.seed}`;
    if (cachedCloudState.cacheKey === cacheKey) return;

    const random = createSeededRandom(cloudConfig.seed);
    const totalSpanX = width + WRAP_MARGIN_PX * 2;
    const generatedClouds = [];

    for (let index = 0; index < MAX_CLOUD_COUNT; index++) {
        const layerKey = LAYER_ORDER[index % LAYER_ORDER.length];
        const layerSpec = PARALLAX_LAYERS[layerKey];
        const yRatio = layerSpec.minYRatio + random() * (layerSpec.maxYRatio - layerSpec.minYRatio);

        generatedClouds.push({
            index,
            layerKey,
            x: -WRAP_MARGIN_PX + random() * totalSpanX,
            y: Math.max(54, Math.floor(height * yRatio)),
            bobPhase: random() * Math.PI * 2,
            lobes: createCloudLobes(random)
        });
    }

    cachedCloudState = {
        cacheKey,
        clouds: generatedClouds
    };
}

function drawPixelOval(context, centerX, centerY, radiusX, radiusY, color) {
    const outerWidth = Math.max(8, snapToPixel(radiusX * 2));
    const outerHeight = Math.max(4, snapToPixel(radiusY * 1.3));
    const innerWidth = Math.max(4, snapToPixel(radiusX * 1.4));
    const innerHeight = Math.max(8, snapToPixel(radiusY * 2));

    drawRect(
        context,
        snapToPixel(centerX - outerWidth / 2),
        snapToPixel(centerY - outerHeight / 2),
        outerWidth,
        outerHeight,
        color
    );
    drawRect(
        context,
        snapToPixel(centerX - innerWidth / 2),
        snapToPixel(centerY - innerHeight / 2),
        innerWidth,
        innerHeight,
        color
    );
}

function drawSingleCloud(context, cloud, layerSpec, effectiveScale, cloudPalette, sanctuaryTick) {
    const gentleBobY = Math.sin(sanctuaryTick * 0.02 + cloud.bobPhase) * 2;
    const baseX = cloud.x;
    const baseY = cloud.y + gentleBobY;

    // 1. Bottom shadow pass across all overlapping lobes
    for (let index = 0; index < cloud.lobes.length; index++) {
        const lobe = cloud.lobes[index];
        const lobeX = baseX + lobe.offsetX * effectiveScale;
        const lobeY = baseY + lobe.offsetY * effectiveScale + 4 * effectiveScale;
        drawPixelOval(
            context,
            lobeX,
            lobeY,
            lobe.radiusX * effectiveScale,
            lobe.radiusY * 0.85 * effectiveScale,
            cloudPalette.shadow
        );
    }

    // 2. Mid body pass across all overlapping lobes
    for (let index = 0; index < cloud.lobes.length; index++) {
        const lobe = cloud.lobes[index];
        const lobeX = baseX + lobe.offsetX * effectiveScale;
        const lobeY = baseY + lobe.offsetY * effectiveScale;
        drawPixelOval(
            context,
            lobeX,
            lobeY,
            lobe.radiusX * effectiveScale,
            lobe.radiusY * effectiveScale,
            cloudPalette.mid
        );
    }

    // 3. Top highlight crown pass
    for (let index = 0; index < cloud.lobes.length; index++) {
        const lobe = cloud.lobes[index];
        const lobeX = baseX + lobe.offsetX * effectiveScale;
        const lobeY = baseY + lobe.offsetY * effectiveScale - 3 * effectiveScale;
        drawPixelOval(
            context,
            lobeX,
            lobeY,
            lobe.radiusX * 0.78 * effectiveScale,
            lobe.radiusY * 0.62 * effectiveScale,
            cloudPalette.light
        );
    }
}

export function updateAndDrawClouds(context, width, height, sanctuaryTick, celestialProgress = null) {
    rebuildCloudPoolIfNeeded(width, height);

    const activeCloudLimit = Math.round(MAX_CLOUD_COUNT * cloudConfig.density);
    if (activeCloudLimit <= 0) return;

    const currentCelestialProgress = celestialProgress !== null ? celestialProgress : getCelestialProgress();
    const cloudPalette = getActiveCloudPalette(currentCelestialProgress);
    const clouds = cachedCloudState.clouds;
    const activeCount = Math.min(clouds.length, activeCloudLimit);

    // Update horizontal parallax positions with screen wrap-around
    for (let index = 0; index < activeCount; index++) {
        const cloud = clouds[index];
        const layerSpec = PARALLAX_LAYERS[cloud.layerKey];
        cloud.x += cloudConfig.windSpeed * layerSpec.speedMultiplier * 0.85;

        if (cloud.x > width + WRAP_MARGIN_PX) {
            cloud.x = -WRAP_MARGIN_PX;
        } else if (cloud.x < -WRAP_MARGIN_PX) {
            cloud.x = width + WRAP_MARGIN_PX;
        }
    }

    // Render ordered by depth layer: far -> mid -> near
    for (let layerIdx = 0; layerIdx < LAYER_ORDER.length; layerIdx++) {
        const currentLayerKey = LAYER_ORDER[layerIdx];
        const layerSpec = PARALLAX_LAYERS[currentLayerKey];
        const effectiveScale = cloudConfig.cloudScale * layerSpec.scaleMultiplier;

        context.globalAlpha = layerSpec.alpha;
        for (let index = 0; index < activeCount; index++) {
            const cloud = clouds[index];
            if (cloud.layerKey !== currentLayerKey) continue;
            drawSingleCloud(context, cloud, layerSpec, effectiveScale, cloudPalette, sanctuaryTick);
        }
    }

    context.globalAlpha = 1.0;
}
