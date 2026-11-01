/**************************************************************
 * SANCTUARY PARTICLES, AMBIENT FIREFLIES & WATER RIPPLES
 **************************************************************/

import {
    DRUK_CORE_PALETTE,
    SANCTUARY_SCENE_PALETTE,
    getActiveBiomePalette,
    interpolateHexColor
} from '../../config/palettes.js';
import { snapToPixel, drawRect } from '../sprites/index.js';
import { getCelestialProgress } from './celestialSystem.js';

let particles = [];
let pondRipples = [];
let ambientFireflies = [];

export function initAmbientFireflies(width, height) {
    ambientFireflies = [];
    for (let index = 0; index < 36; index++) {
        const nightColor = index % 3 === 0
            ? DRUK_CORE_PALETTE.matrixGreen
            : (index % 2 === 0 ? DRUK_CORE_PALETTE.bronzeWarm : DRUK_CORE_PALETTE.dragonLight);
        const dayColor = index % 3 === 0
            ? SANCTUARY_SCENE_PALETTE.pollenIvory
            : (index % 2 === 0 ? SANCTUARY_SCENE_PALETTE.pollenGold : SANCTUARY_SCENE_PALETTE.pollenWarm);

        ambientFireflies.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.85),
            velocityX: (Math.random() - 0.5) * 0.35,
            velocityY: -0.15 - Math.random() * 0.25,
            size: Math.random() > 0.6 ? 4 : 3,
            phase: Math.random() * Math.PI * 2,
            color: nightColor,
            nightColor,
            dayColor
        });
    }
}

export function spawnAmbientLagoonRipple(pondZone) {
    const randomX = pondZone.x + 36 + Math.random() * (pondZone.w - 72);
    const randomY = pondZone.y + 16 + Math.random() * (pondZone.h - 32);
    pondRipples.push({
        x: randomX,
        y: randomY,
        radiusX: 4,
        radiusY: 2,
        life: 0.75
    });
}

export function spawnTreeLeavesAndSpores(treeZone) {
    const palette = getActiveBiomePalette();
    const leafColors = [
        palette.base,
        palette.mid,
        palette.tip,
        palette.accent,
        DRUK_CORE_PALETTE.dragonLight
    ];
    for (let index = 0; index < 28; index++) {
        particles.push({
            x: treeZone.centerX + (Math.random() * 140 - 70),
            y: treeZone.y + 30 + Math.random() * 70,
            velocityX: (Math.random() - 0.35) * 1.6,
            velocityY: 0.7 + Math.random() * 1.8,
            swayPhase: Math.random() * Math.PI * 2,
            isLeaf: true,
            size: Math.random() > 0.4 ? 5 : 4,
            life: 1.3,
            color: leafColors[Math.floor(Math.random() * leafColors.length)]
        });
    }
}

export function spawnPondRipple(originX, originY, pondZone) {
    const clampedX = Math.max(pondZone.x + 24, Math.min(pondZone.x + pondZone.w - 24, originX));
    const clampedY = Math.max(pondZone.y + 14, Math.min(pondZone.y + pondZone.h - 14, originY));
    pondRipples.push({
        x: clampedX,
        y: clampedY,
        radiusX: 6,
        radiusY: 3,
        life: 1.0
    });

    const dropletColors = [
        SANCTUARY_SCENE_PALETTE.waterFoam,
        DRUK_CORE_PALETTE.steelLight,
        SANCTUARY_SCENE_PALETTE.waterHighlight
    ];
    for (let index = 0; index < 10; index++) {
        const angle = -Math.PI * Math.random();
        const speed = 1.0 + Math.random() * 2.2;
        particles.push({
            x: clampedX,
            y: clampedY,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed - 0.8,
            isLeaf: false,
            size: 3,
            life: 0.75,
            color: dropletColors[index % dropletColors.length]
        });
    }
}

export function spawnDungeonRuneSparks(dungeonZone) {
    const runeColors = [
        DRUK_CORE_PALETTE.dragonLight,
        DRUK_CORE_PALETTE.dragonBase,
        DRUK_CORE_PALETTE.bronzeWarm,
        DRUK_CORE_PALETTE.steelLight
    ];
    for (let index = 0; index < 32; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.5;
        particles.push({
            x: dungeonZone.centerX + (Math.random() * 60 - 30),
            y: dungeonZone.baseY - 65 + (Math.random() * 50 - 25),
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed - 0.6,
            isLeaf: false,
            size: Math.random() > 0.5 ? 5 : 4,
            life: 1.0,
            color: runeColors[Math.floor(Math.random() * runeColors.length)]
        });
    }
}

export function spawnConstellationStarfall(constellation) {
    const starColors = [
        DRUK_CORE_PALETTE.ivoryGlow,
        DRUK_CORE_PALETTE.steelLight,
        DRUK_CORE_PALETTE.bronzeWarm,
        DRUK_CORE_PALETTE.dragonLight,
        DRUK_CORE_PALETTE.matrixGreen
    ];
    constellation.nodes.forEach((node) => {
        for (let index = 0; index < 4; index++) {
            particles.push({
                x: node.x + (Math.random() * 6 - 3),
                y: node.y + (Math.random() * 6 - 3),
                velocityX: (Math.random() - 0.5) * 2.2,
                velocityY: 0.6 + Math.random() * 2.4,
                isLeaf: false,
                size: Math.random() > 0.4 ? 4 : 2,
                life: 1.05,
                color: starColors[Math.floor(Math.random() * starColors.length)]
            });
        }
    });
}

export function spawnMageFloraWave(mageZone, horizonY, width, includeMeadowBurst = false) {
    const palette = getActiveBiomePalette();
    const spellColors = [palette.tip, palette.mid, palette.accent, DRUK_CORE_PALETTE.steelLight];
    const staffOriginX = mageZone.centerX + 14;
    const staffOriginY = mageZone.baseY - 44;

    for (let index = 0; index < 26; index++) {
        const angle = (index / 26) * Math.PI * 2;
        const speed = 1.1 + Math.random() * 2.6;
        particles.push({
            x: staffOriginX,
            y: staffOriginY,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed - 0.4,
            isLeaf: false,
            size: index % 2 === 0 ? 4 : 3,
            life: 1.0,
            color: spellColors[index % spellColors.length]
        });
    }

    if (includeMeadowBurst) {
        for (let index = 0; index < 32; index++) {
            particles.push({
                x: Math.random() * width,
                y: horizonY + Math.random() * 120,
                velocityX: (Math.random() - 0.5) * 0.9,
                velocityY: -0.9 - Math.random() * 1.6,
                isLeaf: false,
                size: Math.random() > 0.5 ? 4 : 2,
                life: 0.95,
                color: spellColors[index % spellColors.length]
            });
        }
    }
}

export function spawnCelestialBurst(celestialZone) {
    const isSun = celestialZone.bodyType === 'sun';
    const burstColors = isSun
        ? [
            SANCTUARY_SCENE_PALETTE.pollenIvory,
            SANCTUARY_SCENE_PALETTE.pollenGold,
            SANCTUARY_SCENE_PALETTE.sunOuterRing,
            DRUK_CORE_PALETTE.bronzeWarm
        ]
        : [
            DRUK_CORE_PALETTE.dragonLight,
            DRUK_CORE_PALETTE.dragonBase,
            DRUK_CORE_PALETTE.bronzeWarm,
            DRUK_CORE_PALETTE.ivoryGlow
        ];

    for (let index = 0; index < 20; index++) {
        const angle = (index / 20) * Math.PI * 2;
        const speed = 1.0 + Math.random() * 2.2;
        particles.push({
            x: celestialZone.centerX,
            y: celestialZone.centerY,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            isLeaf: false,
            size: index % 2 === 0 ? 4 : 3,
            life: 0.9,
            color: burstColors[index % burstColors.length]
        });
    }
}

export function updateAndDrawPondRipples(context) {
    for (let index = pondRipples.length - 1; index >= 0; index--) {
        const ripple = pondRipples[index];
        ripple.radiusX += 0.65;
        ripple.radiusY += 0.32;
        ripple.life -= 0.022;

        if (ripple.life <= 0) {
            pondRipples.splice(index, 1);
        } else {
            context.strokeStyle = `rgba(${SANCTUARY_SCENE_PALETTE.rippleStrokeRgb}, ${ripple.life * 0.7})`;
            context.lineWidth = 2;
            context.strokeRect(
                snapToPixel(ripple.x - ripple.radiusX),
                snapToPixel(ripple.y - ripple.radiusY),
                snapToPixel(ripple.radiusX * 2),
                snapToPixel(ripple.radiusY * 2)
            );
        }
    }
}

function updateAndDrawAmbientFireflies(context, width, height, sanctuaryTick) {
    const celestialProgress = getCelestialProgress();
    const isDayPollen = celestialProgress >= 0.5;

    for (let index = 0; index < ambientFireflies.length; index++) {
        const mote = ambientFireflies[index];
        const horizontalSway = isDayPollen
            ? Math.sin(sanctuaryTick * 0.025 + mote.phase) * 0.35
            : Math.sin(sanctuaryTick * 0.02 + mote.phase) * 0.2;
        const verticalSpeedScale = isDayPollen ? 0.55 : 1.0;

        mote.x += mote.velocityX + horizontalSway;
        mote.y += mote.velocityY * verticalSpeedScale;

        if (mote.y < 0) mote.y = height * 0.85;
        if (mote.x < 0) mote.x = width;
        if (mote.x > width) mote.x = 0;

        const baseAlpha = isDayPollen ? 0.38 : 0.25;
        const pulseAmplitude = isDayPollen ? 0.42 : 0.55;
        const alpha = baseAlpha + pulseAmplitude * Math.abs(Math.sin(sanctuaryTick * 0.04 + mote.phase));
        const activeColor = celestialProgress <= 0
            ? mote.nightColor
            : (celestialProgress >= 1
                ? mote.dayColor
                : interpolateHexColor(mote.nightColor, mote.dayColor, celestialProgress));

        context.globalAlpha = alpha;
        drawRect(context, mote.x, mote.y, mote.size, mote.size, activeColor);
    }
    context.globalAlpha = 1.0;
}

function updateAndDrawInteractiveParticles(context, sanctuaryTick) {
    for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index];
        if (particle.isLeaf) {
            particle.x += particle.velocityX + Math.sin(sanctuaryTick * 0.08 + particle.swayPhase) * 0.7;
            particle.y += particle.velocityY;
            particle.life -= 0.012;
        } else {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life -= 0.025;
        }

        if (particle.life <= 0) {
            particles.splice(index, 1);
        } else {
            context.globalAlpha = Math.min(1, particle.life);
            drawRect(context, particle.x, particle.y, particle.size, particle.size, particle.color);
            context.globalAlpha = 1.0;
        }
    }
}

export function updateAndDrawParticles(context, width, height, sanctuaryTick) {
    updateAndDrawAmbientFireflies(context, width, height, sanctuaryTick);
    updateAndDrawInteractiveParticles(context, sanctuaryTick);
}
