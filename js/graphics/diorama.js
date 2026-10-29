/**************************************************************
 * INTERACTIVE HERO DIORAMA & AMBIENT BACKGROUND CANVASES
 **************************************************************/

import { THEME_PALETTES, getCurrentTheme } from '../config/themes.js';
import { playSound } from '../audio/soundEngine.js';
import { SPRITES, drawPixelSprite } from './sprites.js';

let dioramaCanvas = null;
let dioramaContext = null;
let dioramaParticles = [];
let dioramaTick = 0;

let bgCanvas = null;
let backgroundContext = null;
let backgroundStars = [];

export function resizeDiorama() {
    if (!dioramaCanvas || !dioramaCanvas.parentElement) return;
    const containerRect = dioramaCanvas.parentElement.getBoundingClientRect();
    dioramaCanvas.width = Math.max(300, Math.floor(containerRect.width));
    dioramaCanvas.height = Math.max(140, Math.floor(containerRect.height));
}

export function spawnDioramaBurst(originX, originY, particleCount = 16) {
    const palette = THEME_PALETTES[getCurrentTheme()];
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
            color: palette.particleColors[Math.floor(Math.random() * palette.particleColors.length)]
        });
    }
}

export function spawnCenterDioramaBurst(particleCount = 24) {
    if (!dioramaCanvas) return;
    spawnDioramaBurst(dioramaCanvas.width / 2, dioramaCanvas.height / 2, particleCount);
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
            spawnDioramaBurst(clickX, clickY, 22);
            playSound('click');
        });
    }
}

function drawSkyGradient(width, height, palette) {
    const skyGradient = dioramaContext.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, palette.bgSkyTop);
    skyGradient.addColorStop(1, palette.bgSkyBottom);
    dioramaContext.fillStyle = skyGradient;
    dioramaContext.fillRect(0, 0, width, height);
}

function drawFantasyDioramaScene(width, height) {
    // Mystic Dragon Moon (Escamas Base #7A1F73, Escamas Luz #B92B92, Bronce #D4957A)
    dioramaContext.fillStyle = 'rgba(185, 43, 146, 0.22)';
    dioramaContext.fillRect(width - 110, 14, 56, 56);
    dioramaContext.fillStyle = '#7A1F73';
    dioramaContext.fillRect(width - 102, 22, 40, 40);
    dioramaContext.fillStyle = '#B92B92';
    dioramaContext.fillRect(width - 96, 28, 28, 28);
    dioramaContext.fillStyle = '#D4957A';
    dioramaContext.fillRect(width - 90, 34, 16, 16);

    // Distant Dragon Keep / Monoliths Silhouette
    for (let towerX = 0; towerX < width; towerX += 24) {
        const towerHeight = 28 + ((towerX * 17) % 45);
        dioramaContext.fillStyle = '#0D0D0F';
        dioramaContext.fillRect(towerX, height - 28 - towerHeight, 20, towerHeight);
        dioramaContext.fillStyle = '#231C1A';
        dioramaContext.fillRect(towerX + 2, height - 28 - towerHeight + 2, 16, towerHeight - 2);
        if (towerX % 48 === 0) {
            dioramaContext.fillStyle = '#D4957A';
            dioramaContext.fillRect(towerX + 8, height - 20 - towerHeight, 4, 6);
        }
    }

    // Dragon Forge Brazier in Center
    const fireX = Math.floor(width / 2);
    const fireY = height - 32;
    dioramaContext.fillStyle = '#56616E';
    dioramaContext.fillRect(fireX - 15, fireY + 4, 30, 6);
    dioramaContext.fillStyle = '#8A4E3B';
    dioramaContext.fillRect(fireX - 12, fireY + 2, 24, 4);

    const flameHeight = 10 + Math.floor(Math.sin(dioramaTick * 0.2) * 4);
    dioramaContext.fillStyle = '#7A1F73';
    dioramaContext.fillRect(fireX - 10, fireY - flameHeight + 2, 20, flameHeight + 2);
    dioramaContext.fillStyle = '#B92B92';
    dioramaContext.fillRect(fireX - 7, fireY - flameHeight, 14, flameHeight + 2);
    dioramaContext.fillStyle = '#D4957A';
    dioramaContext.fillRect(fireX - 4, fireY - flameHeight + 4, 8, flameHeight - 2);

    // Spawn gentle rising dragon embers
    if (dioramaTick % 4 === 0) {
        const emberColors = ['#B92B92', '#D4957A', '#7A1F73'];
        dioramaParticles.push({
            x: fireX + (Math.random() * 20 - 10),
            y: fireY - 6,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -0.7 - Math.random() * 1.1,
            size: 3,
            life: 1,
            color: emberColors[Math.floor(Math.random() * emberColors.length)]
        });
    }
}

function drawCyberDioramaScene(width, height) {
    const sunX = Math.floor(width / 2);
    const sunY = height - 42;
    dioramaContext.fillStyle = '#ff007f';
    dioramaContext.fillRect(sunX - 36, sunY - 36, 72, 42);
    dioramaContext.fillStyle = '#00f5d4';
    dioramaContext.fillRect(sunX - 28, sunY - 28, 56, 12);

    // Skyline Buildings with Neon Windows
    dioramaContext.fillStyle = '#07091e';
    for (let buildingX = 10; buildingX < width; buildingX += 38) {
        const buildingHeight = 35 + ((buildingX * 23) % 55);
        dioramaContext.fillRect(buildingX, height - 28 - buildingHeight, 30, buildingHeight);
        dioramaContext.fillStyle = (buildingX % 76 === 0) ? '#00f5d4' : '#ff007f';
        dioramaContext.fillRect(buildingX + 6, height - 22 - buildingHeight, 4, 4);
        dioramaContext.fillRect(buildingX + 16, height - 12 - buildingHeight, 4, 4);
        dioramaContext.fillStyle = '#07091e';
    }

    // Ambient digital rain
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

function drawDioramaForeground(width, height, currentTheme, palette) {
    // Ground Platform
    dioramaContext.fillStyle = palette.groundColor;
    dioramaContext.fillRect(0, height - 28, width, 28);
    dioramaContext.fillStyle = palette.groundLine;
    dioramaContext.fillRect(0, height - 28, width, 3);
    dioramaContext.fillStyle = palette.steelBorder;
    dioramaContext.fillRect(0, height - 25, width, 2);

    // Animated Hero Sprite standing in Diorama
    const bobOffset = Math.sin(dioramaTick * 0.1) > 0 ? -3 : 0;
    const heroSprite = currentTheme === 'fantasy' ? SPRITES.fantasyKnight : SPRITES.cyberRunner;
    drawPixelSprite(
        dioramaContext,
        heroSprite,
        Math.floor(width * 0.22),
        height - 64 + bobOffset,
        3,
        palette.spriteColors
    );

    // Floating Gem / Artifact on the right
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

function updateAndDrawDioramaParticles() {
    for (let index = dioramaParticles.length - 1; index >= 0; index--) {
        const particle = dioramaParticles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        if (particle.life <= 0) {
            dioramaParticles.splice(index, 1);
        } else {
            dioramaContext.fillStyle = particle.color;
            dioramaContext.globalAlpha = Math.max(0, particle.life);
            dioramaContext.fillRect(
                Math.floor(particle.x),
                Math.floor(particle.y),
                particle.size,
                particle.size
            );
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
