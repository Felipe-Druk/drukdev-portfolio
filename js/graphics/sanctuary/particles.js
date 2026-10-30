/**************************************************************
 * SANCTUARY PARTICLES, AMBIENT FIREFLIES & WATER RIPPLES
 **************************************************************/

import { snapToPixel, drawRect } from './canvasUtils.js';

let particles = [];
let pondRipples = [];
let ambientFireflies = [];

export function initAmbientFireflies(width, height) {
    ambientFireflies = [];
    for (let index = 0; index < 36; index++) {
        ambientFireflies.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.85),
            velocityX: (Math.random() - 0.5) * 0.35,
            velocityY: -0.15 - Math.random() * 0.25,
            size: Math.random() > 0.6 ? 4 : 3,
            phase: Math.random() * Math.PI * 2,
            color: index % 3 === 0 ? '#00FF41' : (index % 2 === 0 ? '#D4957A' : '#B92B92')
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
    const leafColors = ['#2E5A44', '#3E7A5C', '#B92B92', '#D4957A', '#00FF41'];
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

    const dropletColors = ['#7AD7F0', '#D8E2EB', '#2C5E7A'];
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
    const runeColors = ['#B92B92', '#7A1F73', '#D4957A', '#D8E2EB'];
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
    const starColors = ['#F3D5B5', '#D8E2EB', '#D4957A', '#B92B92', '#00FF41'];
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

export function updateAndDrawPondRipples(context) {
    for (let index = pondRipples.length - 1; index >= 0; index--) {
        const ripple = pondRipples[index];
        ripple.radiusX += 0.65;
        ripple.radiusY += 0.32;
        ripple.life -= 0.022;

        if (ripple.life <= 0) {
            pondRipples.splice(index, 1);
        } else {
            context.strokeStyle = `rgba(216, 226, 235, ${ripple.life * 0.7})`;
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
    for (let index = 0; index < ambientFireflies.length; index++) {
        const firefly = ambientFireflies[index];
        firefly.x += firefly.velocityX + Math.sin(sanctuaryTick * 0.02 + firefly.phase) * 0.2;
        firefly.y += firefly.velocityY;

        if (firefly.y < 0) firefly.y = height * 0.85;
        if (firefly.x < 0) firefly.x = width;
        if (firefly.x > width) firefly.x = 0;

        const alpha = 0.25 + 0.55 * Math.abs(Math.sin(sanctuaryTick * 0.04 + firefly.phase));
        context.globalAlpha = alpha;
        drawRect(context, firefly.x, firefly.y, firefly.size, firefly.size, firefly.color);
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
