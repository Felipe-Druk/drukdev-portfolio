/**************************************************************
 * SKY CONSTELLATIONS — BLUEPRINTS, GEOMETRY & RENDERING
 **************************************************************/

import { CONTACT_LINKS, getLocalizedCvPath } from '../../config/links.js';
import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import {
    DRUK_CORE_PALETTE,
    SANCTUARY_SCENE_PALETTE,
    getInterpolatedScenePalette
} from '../../config/palettes.js';
import { clamp, isPortraitAspectRatio } from '../../utils/mathUtils.js';
import { drawRect, drawPixelLine, drawFloatingPixelLabel } from '../sprites/index.js';
import { getCelestialProgress } from './celestialSystem.js';

export const CONSTELLATION_ZONE_PREFIX = 'constellation:';

const ATTENTION_TARGET_CONSTELLATION_ID = 'cv';
const ATTENTION_BLINK_FREQUENCY = 0.16;
const DAYTIME_CONTRAST_THRESHOLD = 0.35;
const MAIL_COPIED_DURATION_TICKS = 115;

export const CONSTELLATION_BLUEPRINTS = [
    {
        id: 'github',
        type: 'social',
        relativeX: 0.14,
        relativeY: 0.22,
        portraitRelativeX: 0.20,
        portraitRelativeY: 0.17,
        rotationAngle: -0.18,
        nodes: [
            [-22, -16], [-38, 0], [-22, 16],
            [-7, 20], [0, 0], [7, -20],
            [22, -16], [38, 0], [22, 16]
        ],
        edges: [
            [0, 1], [1, 2],
            [3, 4], [4, 5],
            [6, 7], [7, 8]
        ]
    },
    {
        id: 'youtube',
        type: 'social',
        relativeX: 0.29,
        relativeY: 0.15,
        portraitRelativeX: 0.52,
        portraitRelativeY: 0.15,
        rotationAngle: 0.14,
        nodes: [
            [-36, -20], [36, -20], [36, 20], [-36, 20],
            [-10, -11], [-10, 11], [15, 0]
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 4]
        ]
    },
    {
        id: 'cv',
        type: 'cv',
        relativeX: 0.44,
        relativeY: 0.17,
        portraitRelativeX: 0.50,
        portraitRelativeY: 0.30,
        rotationAngle: -0.10,
        nodes: [
            [-22, -22], [10, -22], [22, -10], [22, 22], [-22, 22],
            [10, -10],
            [-12, -2], [10, -2],
            [-12, 10], [12, 10]
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
            [1, 5], [5, 2],
            [6, 7], [8, 9]
        ]
    },
    {
        id: 'linkedin',
        type: 'social',
        relativeX: 0.59,
        relativeY: 0.22,
        portraitRelativeX: 0.20,
        portraitRelativeY: 0.30,
        rotationAngle: -0.13,
        nodes: [
            [-22, -18], [-22, -4], [-22, 18],
            [-6, 18], [-6, -4], [7, -9], [21, -3], [21, 18]
        ],
        edges: [
            [0, 1], [1, 2],
            [3, 4], [4, 5], [5, 6], [6, 7]
        ]
    },
    {
        id: 'mail',
        type: 'email',
        relativeX: 0.74,
        relativeY: 0.18,
        portraitRelativeX: 0.80,
        portraitRelativeY: 0.31,
        rotationAngle: 0.16,
        nodes: [
            [-36, -20], [36, -20], [36, 20], [-36, 20],
            [0, 5]
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [0, 4], [1, 4]
        ]
    }
];

let cachedConstellationState = {
    cacheKey: '',
    zones: []
};

let hasHighlightedAnyConstellation = false;

export function dismissConstellationAttentionBlink() {
    hasHighlightedAnyConstellation = true;
}

export function resetConstellationAttentionBlink() {
    hasHighlightedAnyConstellation = false;
}

function shouldHighlightConstellationForAttention(constellationId, sanctuaryTick) {
    if (hasHighlightedAnyConstellation || constellationId !== ATTENTION_TARGET_CONSTELLATION_ID) {
        return false;
    }
    return Math.sin(sanctuaryTick * ATTENTION_BLINK_FREQUENCY) > 0;
}

export function isConstellationZone(zoneKey) {
    return typeof zoneKey === 'string' && zoneKey.startsWith(CONSTELLATION_ZONE_PREFIX);
}

function getConstellationTargetValue(blueprint, language) {
    if (blueprint.type === 'social') {
        const rawUrl = CONTACT_LINKS.socials?.[blueprint.id];
        return typeof rawUrl === 'string' ? rawUrl.trim() : '';
    }
    if (blueprint.type === 'email') {
        const rawEmail = CONTACT_LINKS.email;
        return typeof rawEmail === 'string' ? rawEmail.trim() : '';
    }
    if (blueprint.type === 'cv') {
        return getLocalizedCvPath(language);
    }
    return '';
}

function rotateAndScaleNode([offsetX, offsetY], centerX, centerY, scale, rotationAngle) {
    const cosAngle = Math.cos(rotationAngle);
    const sinAngle = Math.sin(rotationAngle);
    const rotatedX = offsetX * cosAngle - offsetY * sinAngle;
    const rotatedY = offsetX * sinAngle + offsetY * cosAngle;

    return {
        x: Math.floor((centerX + rotatedX * scale) / 2) * 2,
        y: Math.floor((centerY + rotatedY * scale) / 2) * 2
    };
}

export function buildConstellationZones(width, height, horizonY) {
    const activeLanguage = getCurrentLanguage();
    const cacheKey = `${width}x${height}:${horizonY}:${activeLanguage}`;
    if (cachedConstellationState.cacheKey === cacheKey) {
        return cachedConstellationState.zones;
    }

    const isPortrait = isPortraitAspectRatio(width, height);
    const scale = isPortrait
        ? clamp(width / 620, 0.76, 1.12)
        : clamp(Math.min(width / 1180, height / 720), 0.78, 1.35);
    const minSkyY = isPortrait ? 112 : (width < 640 ? 114 : 104);
    const horizonClearance = isPortrait ? 170 : 250;
    const maxSkyY = Math.max(minSkyY + 24, horizonY - horizonClearance);

    const activeConstellations = [];
    CONSTELLATION_BLUEPRINTS.forEach((blueprint) => {
        const targetValue = getConstellationTargetValue(blueprint, activeLanguage);
        if (!targetValue) return;

        const activeRelativeX = isPortrait && typeof blueprint.portraitRelativeX === 'number'
            ? blueprint.portraitRelativeX
            : blueprint.relativeX;
        const activeRelativeY = isPortrait && typeof blueprint.portraitRelativeY === 'number'
            ? blueprint.portraitRelativeY
            : blueprint.relativeY;

        const centerX = Math.floor(width * activeRelativeX);
        const centerY = clamp(Math.floor(height * activeRelativeY), minSkyY, maxSkyY);
        const halfWidth = Math.floor(56 * scale);
        const topPadding = Math.floor(34 * scale);
        const bottomPadding = Math.floor(48 * scale);
        const rotationAngle = blueprint.rotationAngle || 0;

        const nodes = blueprint.nodes.map((nodeCoords) => (
            rotateAndScaleNode(nodeCoords, centerX, centerY, scale, rotationAngle)
        ));

        activeConstellations.push({
            id: blueprint.id,
            zoneKey: `${CONSTELLATION_ZONE_PREFIX}${blueprint.id}`,
            type: blueprint.type,
            targetValue,
            centerX,
            centerY,
            scale,
            x: centerX - halfWidth,
            y: centerY - topPadding,
            w: halfWidth * 2,
            h: topPadding + bottomPadding,
            nodes,
            edges: blueprint.edges
        });
    });

    cachedConstellationState = {
        cacheKey,
        zones: activeConstellations
    };

    return activeConstellations;
}

function drawConstellationEdges(context, constellation, isHighlighted, scenePalette, celestialProgress) {
    const isDaytimeSky = celestialProgress >= DAYTIME_CONTRAST_THRESHOLD;
    const idleCoreAlpha = 0.86 + 0.12 * celestialProgress;
    const idleUnderlayColor = isDaytimeSky
        ? DRUK_CORE_PALETTE.abyss
        : scenePalette.constellationEdgeIdle;
    const idleUnderlayAlpha = isDaytimeSky
        ? 0.28 + 0.16 * celestialProgress
        : 0.28;

    constellation.edges.forEach(([fromNodeIndex, toNodeIndex]) => {
        const fromNode = constellation.nodes[fromNodeIndex];
        const toNode = constellation.nodes[toNodeIndex];
        if (!fromNode || !toNode) return;

        if (isHighlighted) {
            context.globalAlpha = 0.38;
            drawPixelLine(context, fromNode.x, fromNode.y, toNode.x, toNode.y, scenePalette.constellationEdgeHover, 6);
            context.globalAlpha = 1.0;
            drawPixelLine(context, fromNode.x, fromNode.y, toNode.x, toNode.y, scenePalette.constellationEdgeHover, 2);
        } else {
            context.globalAlpha = idleUnderlayAlpha;
            drawPixelLine(context, fromNode.x, fromNode.y, toNode.x, toNode.y, idleUnderlayColor, 4);
            context.globalAlpha = idleCoreAlpha;
            drawPixelLine(context, fromNode.x, fromNode.y, toNode.x, toNode.y, scenePalette.constellationEdgeIdle, 2);
            context.globalAlpha = 1.0;
        }
    });
}

function drawConstellationStars(
    context,
    constellation,
    constellationIndex,
    isHighlighted,
    sanctuaryTick,
    scenePalette,
    celestialProgress
) {
    const isDaytimeSky = celestialProgress >= DAYTIME_CONTRAST_THRESHOLD;

    constellation.nodes.forEach((node, nodeIndex) => {
        if (isHighlighted) {
            drawRect(context, node.x - 6, node.y - 1, 12, 2, scenePalette.constellationEdgeHover);
            drawRect(context, node.x - 1, node.y - 6, 2, 12, scenePalette.constellationEdgeHover);
            drawRect(context, node.x - 3, node.y - 3, 6, 6, scenePalette.constellationStarBright);
            drawRect(context, node.x - 1, node.y - 1, 2, 2, DRUK_CORE_PALETTE.steelLight);
            return;
        }

        const isBrightPhase = Math.sin(sanctuaryTick * 0.06 + nodeIndex * 1.7 + constellationIndex * 1.3) > 0;
        const starColor = isBrightPhase
            ? scenePalette.constellationStarBright
            : scenePalette.constellationStarDim;
        const starSize = (nodeIndex % 2 === 0 || isBrightPhase) ? 4 : 2;
        const halfStarSize = starSize / 2;

        if (isDaytimeSky) {
            drawRect(
                context,
                node.x - halfStarSize - 1,
                node.y - halfStarSize - 1,
                starSize + 2,
                starSize + 2,
                DRUK_CORE_PALETTE.abyss
            );
        } else {
            context.globalAlpha = 0.34;
            drawRect(
                context,
                node.x - halfStarSize - 1,
                node.y - halfStarSize - 1,
                starSize + 2,
                starSize + 2,
                scenePalette.constellationEdgeIdle
            );
            context.globalAlpha = 1.0;
        }

        if (isBrightPhase) {
            context.globalAlpha = isDaytimeSky ? 0.75 : 0.60;
            drawRect(context, node.x - 4, node.y - 1, 8, 2, scenePalette.constellationEdgeIdle);
            drawRect(context, node.x - 1, node.y - 4, 2, 8, scenePalette.constellationEdgeIdle);
            context.globalAlpha = 1.0;
        }

        drawRect(
            context,
            node.x - halfStarSize,
            node.y - halfStarSize,
            starSize,
            starSize,
            starColor
        );

        if (starSize >= 4) {
            drawRect(
                context,
                node.x - 1,
                node.y - 1,
                2,
                2,
                scenePalette.constellationStarBright
            );
        }
    });
}

function drawConstellationLabel(
    context,
    constellation,
    translationEntry,
    isHovered,
    isAttentionBlinkActive,
    mailCopiedTimer,
    scenePalette
) {
    if (!translationEntry) return;

    const labelText = isHovered ? translationEntry.hover : translationEntry.label;
    const isLabelHighlighted = isHovered || isAttentionBlinkActive;
    const labelY = constellation.centerY + Math.floor(38 * constellation.scale);
    context.font = '8px "Press Start 2P", monospace';
    context.textAlign = 'center';

    if (isLabelHighlighted) {
        const labelWidth = Math.ceil(context.measureText(labelText).width + 12);
        drawRect(
            context,
            constellation.centerX - labelWidth / 2,
            labelY - 10,
            labelWidth,
            14,
            SANCTUARY_SCENE_PALETTE.constellationHoverBg
        );
        context.fillStyle = constellation.type === 'email'
            ? DRUK_CORE_PALETTE.matrixGreen
            : scenePalette.constellationEdgeHover;
        context.fillText(labelText, constellation.centerX, labelY);
    } else {
        context.fillStyle = DRUK_CORE_PALETTE.abyss;
        context.fillText(labelText, constellation.centerX - 1, labelY);
        context.fillText(labelText, constellation.centerX + 1, labelY);
        context.fillText(labelText, constellation.centerX, labelY - 1);
        context.fillText(labelText, constellation.centerX, labelY + 1);
        context.fillText(labelText, constellation.centerX + 1, labelY + 1);

        context.fillStyle = scenePalette.constellationLabel;
        context.fillText(labelText, constellation.centerX, labelY);
    }

    if (constellation.id === 'mail' && mailCopiedTimer > 0 && translationEntry.copied) {
        const animationProgress = 1 - mailCopiedTimer / MAIL_COPIED_DURATION_TICKS;
        const floatRiseOffset = Math.floor(animationProgress * 18);
        drawFloatingPixelLabel(
            context,
            constellation.centerX,
            constellation.centerY - Math.floor(34 * constellation.scale) - floatRiseOffset,
            translationEntry.copied,
            DRUK_CORE_PALETTE.matrixGreen
        );
    }
}

export function drawSkyConstellations(
    context,
    constellations,
    hoveredZone,
    sanctuaryTick,
    mailCopiedTimer,
    passedScenePalette = null,
    passedCelestialProgress = null
) {
    if (isConstellationZone(hoveredZone)) {
        dismissConstellationAttentionBlink();
    }

    const activeLangConstellations = TRANSLATIONS[getCurrentLanguage()].sanctuary.constellations;
    const celestialProgress = passedCelestialProgress !== null
        ? passedCelestialProgress
        : getCelestialProgress();
    const scenePalette = passedScenePalette || getInterpolatedScenePalette(celestialProgress);

    constellations.forEach((constellation, constellationIndex) => {
        const isHovered = hoveredZone === constellation.zoneKey;
        const isAttentionBlinkActive = shouldHighlightConstellationForAttention(
            constellation.id,
            sanctuaryTick
        );
        const isHighlighted = isHovered || isAttentionBlinkActive;
        const translationEntry = activeLangConstellations[constellation.id];

        drawConstellationEdges(context, constellation, isHighlighted, scenePalette, celestialProgress);
        drawConstellationStars(
            context,
            constellation,
            constellationIndex,
            isHighlighted,
            sanctuaryTick,
            scenePalette,
            celestialProgress
        );
        drawConstellationLabel(
            context,
            constellation,
            translationEntry,
            isHovered,
            isAttentionBlinkActive,
            mailCopiedTimer,
            scenePalette
        );
    });
}
