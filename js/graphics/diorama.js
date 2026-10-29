/**************************************************************
 * INTERACTIVE HERO DIORAMA & AMBIENT BACKGROUND CANVASES
 **************************************************************/

import { THEME_PALETTES, getCurrentTheme } from '../config/themes.js';
import { playSound } from '../audio/soundEngine.js';
import { SPRITES, drawPixelSprite } from './sprites.js';

const HERO_GRAVITY = 0.48;
const HERO_JUMP_FORCE = -8.2;
const CORE_FLARE_DURATION = 42;
const GEM_RESPAWN_DURATION = 95;
const TOTAL_MOON_PHASES = 4;

const FANTASY_EMBER_COLORS = ['#B92B92', '#D4957A', '#7A1F73', '#D8E2EB'];
const CYBER_BEAM_COLORS = ['#00f5d4', '#ff007f', '#ffffff', '#38bdf8'];

let dioramaCanvas = null;
let dioramaContext = null;
let dioramaParticles = [];
let dioramaTick = 0;

const dioramaState = {
    heroOffsetY: 0,
    heroVelocityY: 0,
    heroJumping: false,
    fireFlareTimer: 0,
    gemRespawnTimer: 0,
    moonPhase: 0
};

let bgCanvas = null;
let backgroundContext = null;
let backgroundStars = [];

function fillCanvasRect(x, y, width, height, color) {
    dioramaContext.fillStyle = color;
    dioramaContext.fillRect(x, y, width, height);
}

function isPointInBox(pointX, pointY, boxX, boxY, boxWidth, boxHeight) {
    return (
        pointX >= boxX &&
        pointX <= boxX + boxWidth &&
        pointY >= boxY &&
        pointY <= boxY + boxHeight
    );
}

export function resizeDiorama() {
    if (!dioramaCanvas || !dioramaCanvas.parentElement) return;
    const containerRect = dioramaCanvas.parentElement.getBoundingClientRect();
    dioramaCanvas.width = Math.max(300, Math.floor(containerRect.width));
    dioramaCanvas.height = Math.max(140, Math.floor(containerRect.height));
}

export function spawnDioramaBurst(originX, originY, particleCount = 16, customColors = null) {
    const colorPool = customColors || THEME_PALETTES[getCurrentTheme()].particleColors;
    for (let index = 0; index < particleCount; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 3.2;
        dioramaParticles.push({
            x: originX,
            y: originY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8,
            size: Math.random() > 0.5 ? 4 : 3,
            life: 1,
            color: colorPool[Math.floor(Math.random() * colorPool.length)]
        });
    }
}

function spawnAscendingColumnParticles(originX, originY, colorPool, particleCount = 26) {
    for (let index = 0; index < particleCount; index++) {
        dioramaParticles.push({
            x: originX + (Math.random() * 24 - 12),
            y: originY - Math.random() * 12,
            vx: (Math.random() - 0.5) * 1.0,
            vy: -2.4 - Math.random() * 3.6,
            size: Math.random() > 0.4 ? 4 : 3,
            life: 1.15,
            color: colorPool[Math.floor(Math.random() * colorPool.length)]
        });
    }
}

export function spawnCenterDioramaBurst(particleCount = 24) {
    if (!dioramaCanvas) return;
    spawnDioramaBurst(dioramaCanvas.width / 2, dioramaCanvas.height / 2, particleCount);
}

function tryInteractWithMoon(clickX, clickY, width) {
    if (!isPointInBox(clickX, clickY, width - 118, 10, 72, 64)) return false;

    dioramaState.moonPhase = (dioramaState.moonPhase + 1) % TOTAL_MOON_PHASES;
    playSound('coin');
    spawnDioramaBurst(width - 82, 42, 18);
    return true;
}

function tryInteractWithHero(clickX, clickY, width, height) {
    const heroX = Math.floor(width * 0.22);
    const heroY = height - 64 + dioramaState.heroOffsetY;
    if (!isPointInBox(clickX, clickY, heroX - 8, heroY - 8, 52, 52)) return false;

    if (!dioramaState.heroJumping) {
        dioramaState.heroVelocityY = HERO_JUMP_FORCE;
        dioramaState.heroJumping = true;
        playSound('jump');
        spawnDioramaBurst(heroX + 18, height - 30, 12);
    }
    return true;
}

function tryInteractWithCenterCore(clickX, clickY, width, height, currentTheme) {
    const centerX = Math.floor(width / 2);
    const centerY = height - 32;
    if (!isPointInBox(clickX, clickY, centerX - 28, height - 84, 56, 60)) return false;

    dioramaState.fireFlareTimer = CORE_FLARE_DURATION;
    playSound('attack');
    const columnColors = currentTheme === 'fantasy' ? FANTASY_EMBER_COLORS : CYBER_BEAM_COLORS;
    spawnAscendingColumnParticles(centerX, centerY, columnColors, 28);
    return true;
}

function tryInteractWithGem(clickX, clickY, width, height, palette) {
    if (dioramaState.gemRespawnTimer > 0) return false;

    const gemX = Math.floor(width * 0.75);
    const gemBobOffset = Math.floor(Math.sin(dioramaTick * 0.08) * 5);
    const gemY = height - 62 + gemBobOffset;
    if (!isPointInBox(clickX, clickY, gemX - 10, gemY - 10, 44, 46)) return false;

    dioramaState.gemRespawnTimer = GEM_RESPAWN_DURATION;
    playSound('coin');
    spawnDioramaBurst(gemX + 12, gemY + 12, 20, [palette.warmBronze, palette.steelHighlight]);
    return true;
}

function handleDioramaInteraction(clickX, clickY) {
    const width = dioramaCanvas.width;
    const height = dioramaCanvas.height;
    const currentTheme = getCurrentTheme();
    const palette = THEME_PALETTES[currentTheme];

    if (tryInteractWithMoon(clickX, clickY, width)) return;
    if (tryInteractWithHero(clickX, clickY, width, height)) return;
    if (tryInteractWithCenterCore(clickX, clickY, width, height, currentTheme)) return;
    if (tryInteractWithGem(clickX, clickY, width, height, palette)) return;

    spawnDioramaBurst(clickX, clickY, 22);
    playSound('click');
}

export function initDiorama() {
    dioramaCanvas = document.getElementById('dioramaCanvas');
    if (!dioramaCanvas) return;
    dioramaContext = dioramaCanvas.getContext('2d');

    resizeDiorama();

    const dioramaContainer = dioramaCanvas.parentElement;
    if (dioramaContainer) {
        dioramaContainer.addEventListener('click', (event) => {
            const canvasRect = dioramaCanvas.getBoundingClientRect();
            const clickX = event.clientX - canvasRect.left;
            const clickY = event.clientY - canvasRect.top;
            handleDioramaInteraction(clickX, clickY);
        });
    }
}

function updateDioramaInteractiveState(width, height) {
    if (dioramaState.heroJumping) {
        dioramaState.heroOffsetY += dioramaState.heroVelocityY;
        dioramaState.heroVelocityY += HERO_GRAVITY;

        if (dioramaState.heroOffsetY >= 0) {
            dioramaState.heroOffsetY = 0;
            dioramaState.heroVelocityY = 0;
            dioramaState.heroJumping = false;
        }
    }

    if (dioramaState.fireFlareTimer > 0) {
        dioramaState.fireFlareTimer--;
        if (dioramaState.fireFlareTimer % 2 === 0) {
            const columnColors = getCurrentTheme() === 'fantasy' ? FANTASY_EMBER_COLORS : CYBER_BEAM_COLORS;
            spawnAscendingColumnParticles(Math.floor(width / 2), height - 32, columnColors, 3);
        }
    }

    if (dioramaState.gemRespawnTimer > 0) {
        dioramaState.gemRespawnTimer--;
        if (dioramaState.gemRespawnTimer === 0) {
            spawnDioramaBurst(Math.floor(width * 0.75) + 12, height - 50, 14);
        }
    }
}

function drawSkyGradient(width, height, palette) {
    const skyGradient = dioramaContext.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, palette.bgSkyTop);
    skyGradient.addColorStop(1, palette.bgSkyBottom);
    dioramaContext.fillStyle = skyGradient;
    dioramaContext.fillRect(0, 0, width, height);
}

function drawFantasyMoonWithPhase(width) {
    const moonX = width - 102;
    const moonY = 22;
    const phase = dioramaState.moonPhase;

    fillCanvasRect(moonX - 8, moonY - 8, 56, 56, 'rgba(185, 43, 146, 0.22)');
    fillCanvasRect(moonX, moonY, 40, 40, '#7A1F73');
    fillCanvasRect(moonX + 6, moonY + 6, 28, 28, '#B92B92');
    fillCanvasRect(moonX + 12, moonY + 12, 16, 16, '#D4957A');

    if (phase === 1) {
        fillCanvasRect(moonX + 18, moonY + 2, 20, 36, '#0D0D0F');
        fillCanvasRect(moonX + 14, moonY + 6, 6, 28, '#0D0D0F');
    } else if (phase === 2) {
        fillCanvasRect(moonX + 5, moonY + 5, 30, 30, '#0D0D0F');
        fillCanvasRect(moonX + 17, moonY + 17, 6, 6, '#B92B92');
    } else if (phase === 3) {
        fillCanvasRect(moonX + 2, moonY + 2, 20, 36, '#0D0D0F');
        fillCanvasRect(moonX + 20, moonY + 6, 6, 28, '#0D0D0F');
    }
}

function drawFantasyCastles(width, height) {
    for (let towerX = 0; towerX < width; towerX += 24) {
        const towerHeight = 28 + ((towerX * 17) % 45);
        fillCanvasRect(towerX, height - 28 - towerHeight, 20, towerHeight, '#0D0D0F');
        fillCanvasRect(towerX + 2, height - 28 - towerHeight + 2, 16, towerHeight - 2, '#231C1A');
        if (towerX % 48 === 0) {
            fillCanvasRect(towerX + 8, height - 20 - towerHeight, 4, 6, '#D4957A');
        }
    }
}

function drawFantasyCampfire(width, height) {
    const fireX = Math.floor(width / 2);
    const fireY = height - 32;

    fillCanvasRect(fireX - 15, fireY + 4, 30, 6, '#56616E');
    fillCanvasRect(fireX - 12, fireY + 2, 24, 4, '#8A4E3B');

    const flareBoost = Math.floor(dioramaState.fireFlareTimer * 0.85);
    const flameHeight = 10 + flareBoost + Math.floor(Math.sin(dioramaTick * 0.2) * 4);
    const flameWidthBoost = dioramaState.fireFlareTimer > 0 ? 4 : 0;

    fillCanvasRect(fireX - 10 - flameWidthBoost, fireY - flameHeight + 2, 20 + flameWidthBoost * 2, flameHeight + 2, '#7A1F73');
    fillCanvasRect(fireX - 7 - Math.floor(flameWidthBoost / 2), fireY - flameHeight, 14 + flameWidthBoost, flameHeight + 2, '#B92B92');
    fillCanvasRect(fireX - 4, fireY - flameHeight + 4, 8, Math.max(4, flameHeight - 2), '#D4957A');

    if (dioramaState.fireFlareTimer > 0) {
        fillCanvasRect(fireX - 2, fireY - flameHeight + 8, 4, Math.max(4, flameHeight - 8), '#D8E2EB');
    }

    if (dioramaTick % 4 === 0) {
        dioramaParticles.push({
            x: fireX + (Math.random() * 20 - 10),
            y: fireY - 6,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -0.7 - Math.random() * 1.1,
            size: 3,
            life: 1,
            color: FANTASY_EMBER_COLORS[Math.floor(Math.random() * 3)]
        });
    }
}

function drawFantasyDioramaScene(width, height) {
    drawFantasyMoonWithPhase(width);
    drawFantasyCastles(width, height);
    drawFantasyCampfire(width, height);
}

function drawCyberShatteredMoonStation(width) {
    const baseX = width - 108;
    const baseY = 16;
    const phase = dioramaState.moonPhase;
    const driftOffset = (phase % 2) * 3;
    const beaconActive = Math.floor(dioramaTick / 15) % 2 === 0;

    // Orbital Space Station Ring & Solar Wings
    fillCanvasRect(baseX - 10, baseY + 18, 68, 6, '#1e293b');
    fillCanvasRect(baseX - 6, baseY + 20, 60, 2, '#56616E');
    fillCanvasRect(baseX - 14, baseY + 10, 8, 22, '#0f172a');
    fillCanvasRect(baseX + 54, baseY + 10, 8, 22, '#0f172a');
    fillCanvasRect(baseX - 12, baseY + 12, 4, 18, '#00f5d4');
    fillCanvasRect(baseX + 56, baseY + 12, 4, 18, '#00f5d4');

    // Exposed Energy Core
    fillCanvasRect(baseX + 6, baseY + 4, 36, 36, 'rgba(0, 245, 212, 0.25)');
    fillCanvasRect(baseX + 18, baseY + 16, 12, 12, phase === 2 ? '#ff007f' : '#00f5d4');

    // Intact Hemisphere & Shattered Floating Shards
    fillCanvasRect(baseX + 4, baseY + 10, 22, 28, '#334155');
    fillCanvasRect(baseX + 8, baseY + 14, 14, 20, '#94a3b8');
    fillCanvasRect(baseX + 28 + driftOffset, baseY + 4 - driftOffset, 14, 14, '#475569');
    fillCanvasRect(baseX + 30 + driftOffset, baseY + 6 - driftOffset, 8, 8, '#cbd5e1');
    fillCanvasRect(baseX + 44 + driftOffset, baseY + 2, 5, 5, '#94a3b8');
    fillCanvasRect(baseX + 32, baseY + 24 + driftOffset, 8, 8, '#94a3b8');
    fillCanvasRect(baseX + 43, baseY + 19 - driftOffset, 4, 4, '#94a3b8');

    // Docking Tower & Blinking Telemetry Beacons
    fillCanvasRect(baseX + 22, baseY - 4, 4, 16, '#1e293b');
    fillCanvasRect(baseX + 22, baseY - 6, 4, 4, beaconActive ? '#ff007f' : '#00f5d4');
    fillCanvasRect(baseX - 10, baseY + 18, 3, 3, beaconActive ? '#00f5d4' : '#ff007f');
    fillCanvasRect(baseX + 55, baseY + 18, 3, 3, beaconActive ? '#00f5d4' : '#ff007f');
}

function drawCyberSkyline(width, height) {
    for (let buildingX = 10; buildingX < width; buildingX += 38) {
        const buildingHeight = 35 + ((buildingX * 23) % 55);
        const windowColor = (buildingX % 76 === 0) ? '#00f5d4' : '#ff007f';
        fillCanvasRect(buildingX, height - 28 - buildingHeight, 30, buildingHeight, '#07091e');
        fillCanvasRect(buildingX + 6, height - 22 - buildingHeight, 4, 4, windowColor);
        fillCanvasRect(buildingX + 16, height - 12 - buildingHeight, 4, 4, windowColor);
    }
}

function drawCyberHolographicCore(width, height) {
    const coreX = Math.floor(width / 2);
    const coreY = height - 32;
    const hoverOffset = Math.floor(Math.sin(dioramaTick * 0.14) * 3);

    fillCanvasRect(coreX - 16, coreY + 2, 32, 6, '#1e293b');
    fillCanvasRect(coreX - 12, coreY, 24, 3, '#00f5d4');

    if (dioramaState.fireFlareTimer > 0) {
        const beamWidth = 8 + Math.floor((dioramaState.fireFlareTimer / CORE_FLARE_DURATION) * 14);
        fillCanvasRect(coreX - beamWidth, 0, beamWidth * 2, coreY, 'rgba(0, 245, 212, 0.28)');
        fillCanvasRect(coreX - Math.floor(beamWidth / 2), 0, beamWidth, coreY, '#ff007f');
        fillCanvasRect(coreX - 2, 0, 4, coreY, '#ffffff');
    }

    const holoY = coreY - 22 + hoverOffset;
    fillCanvasRect(coreX - 14, holoY - 4, 28, 24, 'rgba(0, 245, 212, 0.22)');
    fillCanvasRect(coreX - 10, holoY, 20, 16, '#00f5d4');
    fillCanvasRect(coreX - 6, holoY + 4, 12, 8, '#ff007f');
    fillCanvasRect(coreX - 2, holoY + 6, 4, 4, '#ffffff');

    if (dioramaTick % 3 === 0) {
        dioramaParticles.push({
            x: Math.random() * width,
            y: 0,
            vx: 0,
            vy: 1.5 + Math.random() * 2,
            size: 3,
            life: 1,
            color: Math.random() > 0.5 ? '#00f5d4' : '#ff007f'
        });
    }
}

function drawCyberDioramaScene(width, height) {
    drawCyberShatteredMoonStation(width);
    drawCyberSkyline(width, height);
    drawCyberHolographicCore(width, height);
}

function drawDioramaForeground(width, height, currentTheme, palette) {
    fillCanvasRect(0, height - 28, width, 28, palette.groundColor);
    fillCanvasRect(0, height - 28, width, 3, palette.groundLine);
    fillCanvasRect(0, height - 25, width, 2, palette.steelBorder);

    const idleBobOffset = dioramaState.heroJumping ? 0 : (Math.sin(dioramaTick * 0.1) > 0 ? -3 : 0);
    const heroY = height - 64 + dioramaState.heroOffsetY + idleBobOffset;
    const heroSprite = currentTheme === 'fantasy' ? SPRITES.fantasyKnight : SPRITES.cyberRunner;
    drawPixelSprite(
        dioramaContext,
        heroSprite,
        Math.floor(width * 0.22),
        heroY,
        3,
        palette.spriteColors
    );

    if (dioramaState.gemRespawnTimer === 0) {
        const gemBobOffset = Math.floor(Math.sin(dioramaTick * 0.08) * 5);
        drawPixelSprite(
            dioramaContext,
            SPRITES.commitGem,
            Math.floor(width * 0.75),
            height - 62 + gemBobOffset,
            3,
            palette.gemColors
        );
    }
}

function updateAndDrawDioramaParticles() {
    for (let index = dioramaParticles.length - 1; index >= 0; index--) {
        const particle = dioramaParticles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        if (particle.life <= 0) {
            dioramaParticles.splice(index, 1);
        } else {
            dioramaContext.globalAlpha = Math.max(0, particle.life);
            fillCanvasRect(Math.floor(particle.x), Math.floor(particle.y), particle.size, particle.size, particle.color);
            dioramaContext.globalAlpha = 1.0;
        }
    }
}

export function updateAndDrawDiorama() {
    if (!dioramaCanvas || !dioramaContext) return;

    dioramaTick++;
    const width = dioramaCanvas.width;
    const height = dioramaCanvas.height;
    const currentTheme = getCurrentTheme();
    const palette = THEME_PALETTES[currentTheme];

    updateDioramaInteractiveState(width, height);
    drawSkyGradient(width, height, palette);

    if (currentTheme === 'fantasy') {
        drawFantasyDioramaScene(width, height);
    } else {
        drawCyberDioramaScene(width, height);
    }

    drawDioramaForeground(width, height, currentTheme, palette);
    updateAndDrawDioramaParticles();
}

export function initBgCanvas() {
    bgCanvas = document.getElementById('bgCanvas');
    if (!bgCanvas) return;
    backgroundContext = bgCanvas.getContext('2d');

    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    backgroundStars = [];

    for (let index = 0; index < 45; index++) {
        backgroundStars.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            size: Math.random() > 0.7 ? 3 : 2,
            speedY: (Math.random() * 0.4) + 0.15,
            phase: Math.random() * Math.PI * 2
        });
    }
}

export function updateAndDrawBg() {
    if (!bgCanvas || !backgroundContext) return;

    backgroundContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const currentTheme = getCurrentTheme();
    const palette = THEME_PALETTES[currentTheme];

    for (let index = 0; index < backgroundStars.length; index++) {
        const star = backgroundStars[index];
        star.y = (currentTheme === 'fantasy')
            ? star.y - star.speedY
            : star.y + star.speedY * 1.6;

        if (star.y < 0) star.y = bgCanvas.height;
        if (star.y > bgCanvas.height) star.y = 0;

        const alpha = 0.25 + 0.35 * Math.sin(dioramaTick * 0.04 + star.phase);
        backgroundContext.fillStyle = palette.particleColors[index % palette.particleColors.length];
        backgroundContext.globalAlpha = alpha;
        backgroundContext.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    }
    backgroundContext.globalAlpha = 1;
}
