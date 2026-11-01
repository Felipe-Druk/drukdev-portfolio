/**************************************************************
 * SKY CONSTELLATIONS — BLUEPRINTS, GEOMETRY & RENDERING
 **************************************************************/

import { CONTACT_LINKS, getLocalizedCvPath } from '../../config/links.js';
import { TRANSLATIONS, getCurrentLanguage } from '../../config/i18n.js';
import { DRUK_CORE_PALETTE, SANCTUARY_SCENE_PALETTE } from '../../config/palettes.js';
import { drawRect, drawPixelLine, drawFloatingPixelLabel } from '../sprites/index.js';

export const CONSTELLATION_ZONE_PREFIX = 'constellation:';

export const CONSTELLATION_BLUEPRINTS = [
    {
        id: 'github',
        type: 'social',
        relativeX: 0.14,
        relativeY: 0.22,
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
        id: 'linkedin',
        type: 'social',
        relativeX: 0.44,
        relativeY: 0.17,
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
        relativeX: 0.59,
        relativeY: 0.23,
        rotationAngle: 0.19,
        nodes: [
            [-36, -20], [36, -20], [36, 20], [-36, 20],
            [0, 5]
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [0, 4], [1, 4]
        ]
    },
    {
        id: 'cv',
        type: 'cv',
        relativeX: 0.74,
        relativeY: 0.18,
        rotationAngle: -0.15,
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
    }
];

let cachedConstellationState = {
    cacheKey: '',
    zones: []
};

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

    const scale = Math.max(0.85, Math.min(1.35, Math.min(width / 1180, height / 720)));
    const minSkyY = width < 640 ? 122 : 104;
    const maxSkyY = Math.max(minSkyY + 24, horizonY - 250);

    const activeConstellations = [];
    CONSTELLATION_BLUEPRINTS.forEach((blueprint) => {
        const targetValue = getConstellationTargetValue(blueprint, activeLanguage);
        if (!targetValue) return;

        const centerX = Math.floor(width * blueprint.relativeX);
        const centerY = Math.max(minSkyY, Math.min(maxSkyY, Math.floor(height * blueprint.relativeY)));
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

function drawConstellationEdges(context, constellation, isHovered) {
    constellation.edges.forEach(([fromNodeIndex, toNodeIndex]) => {
        const fromNode = constellation.nodes[fromNodeIndex];
        const toNode = constellation.nodes[toNodeIndex];
        if (!fromNode || !toNode) return;

        if (isHovered) {
            context.globalAlpha = 0.26;
            drawPixelLine(context, fromNode.x, fromNode.y, toNode.x, toNode.y, DRUK_CORE_PALETTE.dragonLight, 4);
            context.globalAlpha = 1.0;
            drawPixelLine(context, fromNode.x, fromNode.y, toNode.x, toNode.y, DRUK_CORE_PALETTE.dragonLight, 2);
        } else {
            context.globalAlpha = 0.52;
            drawPixelLine(context, fromNode.x, fromNode.y, toNode.x, toNode.y, DRUK_CORE_PALETTE.dragonBase, 2);
            context.globalAlpha = 1.0;
        }
    });
}

function drawConstellationStars(context, constellation, constellationIndex, isHovered, sanctuaryTick) {
    constellation.nodes.forEach((node, nodeIndex) => {
        if (isHovered) {
            drawRect(context, node.x - 5, node.y - 1, 10, 2, DRUK_CORE_PALETTE.ivoryGlow);
            drawRect(context, node.x - 1, node.y - 5, 2, 10, DRUK_CORE_PALETTE.ivoryGlow);
            drawRect(context, node.x - 2, node.y - 2, 4, 4, DRUK_CORE_PALETTE.ivoryGlow);
            drawRect(context, node.x - 1, node.y - 1, 2, 2, DRUK_CORE_PALETTE.steelLight);
            return;
        }

        const isBrightPhase = Math.sin(sanctuaryTick * 0.06 + nodeIndex * 1.7 + constellationIndex * 1.3) > 0;
        const starColor = isBrightPhase ? DRUK_CORE_PALETTE.steelLight : DRUK_CORE_PALETTE.bronzeWarm;
        const starSize = (nodeIndex % 2 === 0 || isBrightPhase) ? 4 : 2;
        drawRect(
            context,
            node.x - starSize / 2,
            node.y - starSize / 2,
            starSize,
            starSize,
            starColor
        );
    });
}

function drawConstellationLabel(context, constellation, translationEntry, isHovered, mailCopiedTimer) {
    if (!translationEntry) return;

    const labelText = isHovered ? translationEntry.hover : translationEntry.label;
    const labelY = constellation.centerY + Math.floor(38 * constellation.scale);
    context.font = '8px "Press Start 2P", monospace';
    context.textAlign = 'center';

    if (isHovered) {
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
            : DRUK_CORE_PALETTE.steelLight;
        context.fillText(labelText, constellation.centerX, labelY);
    } else {
        context.fillStyle = SANCTUARY_SCENE_PALETTE.constellationMutedLabel;
        context.fillText(labelText, constellation.centerX, labelY);
    }

    if (constellation.id === 'mail' && mailCopiedTimer > 0 && translationEntry.copied) {
        const animationProgress = 1 - mailCopiedTimer / 115;
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

export function drawSkyConstellations(context, constellations, hoveredZone, sanctuaryTick, mailCopiedTimer) {
    const activeLangConstellations = TRANSLATIONS[getCurrentLanguage()].sanctuary.constellations;

    constellations.forEach((constellation, constellationIndex) => {
        const isHovered = hoveredZone === constellation.zoneKey;
        const translationEntry = activeLangConstellations[constellation.id];

        drawConstellationEdges(context, constellation, isHovered);
        drawConstellationStars(context, constellation, constellationIndex, isHovered, sanctuaryTick);
        drawConstellationLabel(context, constellation, translationEntry, isHovered, mailCopiedTimer);
    });
}
