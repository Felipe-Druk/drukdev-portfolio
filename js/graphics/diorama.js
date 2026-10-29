/**************************************************************
 * INTERACTIVE HERO DIORAMA & AMBIENT BACKGROUND CANVASES
 **************************************************************/

import { THEME_PALETTES, getCurrentTheme } from '../config/themes.js';
import { playSound } from '../audio/soundEngine.js';
import { SPRITES, drawPixelSprite } from './sprites.js';

let dioramaCanvas = null;
let dctx = null;
let dioramaParticles = [];
let dioramaTick = 0;

let bgCanvas = null;
let bgCtx = null;
let bgStars = [];

export function resizeDiorama() {
    if (!dioramaCanvas || !dioramaCanvas.parentElement) return;
    const rect = dioramaCanvas.parentElement.getBoundingClientRect();
    dioramaCanvas.width = Math.max(300, Math.floor(rect.width));
    dioramaCanvas.height = Math.max(140, Math.floor(rect.height));
}

export function spawnDioramaBurst(x, y, count = 16) {
    const palette = THEME_PALETTES[getCurrentTheme()];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 3.2;
        dioramaParticles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8,
            size: Math.random() > 0.5 ? 4 : 3,
            life: 1,
            color: palette.particleColors[Math.floor(Math.random() * palette.particleColors.length)]
        });
    }
}

export function spawnCenterDioramaBurst(count = 24) {
    if (!dioramaCanvas) return;
    spawnDioramaBurst(dioramaCanvas.width / 2, dioramaCanvas.height / 2, count);
}

export function initDiorama() {
    dioramaCanvas = document.getElementById('dioramaCanvas');
    if (!dioramaCanvas) return;
    dctx = dioramaCanvas.getContext('2d');

    resizeDiorama();

    const container = dioramaCanvas.parentElement;
    if (container) {
        container.addEventListener('click', (e) => {
            const rect = dioramaCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            spawnDioramaBurst(x, y, 22);
            playSound('click');
        });
    }
}

export function updateAndDrawDiorama() {
    if (!dioramaCanvas || !dctx) return;

    dioramaTick++;
    const w = dioramaCanvas.width;
    const h = dioramaCanvas.height;
    const currentTheme = getCurrentTheme();
    const palette = THEME_PALETTES[currentTheme];

    // Background Gradient
    const grad = dctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, palette.bgSkyTop);
    grad.addColorStop(1, palette.bgSkyBottom);
    dctx.fillStyle = grad;
    dctx.fillRect(0, 0, w, h);

    if (currentTheme === 'fantasy') {
        // Draw Pixel Blood Moon
        dctx.fillStyle = 'rgba(255, 59, 48, 0.18)';
        dctx.fillRect(w - 110, 14, 56, 56);
        dctx.fillStyle = '#ff3b30';
        dctx.fillRect(w - 102, 22, 40, 40);
        dctx.fillStyle = '#ffb703';
        dctx.fillRect(w - 94, 30, 24, 24);

        // Distant Gothic Castle / Monoliths Silhouette
        dctx.fillStyle = '#120817';
        for (let x = 0; x < w; x += 24) {
            const towerH = 28 + ((x * 17) % 45);
            dctx.fillRect(x, h - 28 - towerH, 20, towerH);
        }

        // Campfire & Flickering Torches in Center
        const fireX = Math.floor(w / 2);
        const fireY = h - 32;
        dctx.fillStyle = '#4a2c40';
        dctx.fillRect(fireX - 14, fireY + 4, 28, 6);
        const flameH = 10 + Math.floor(Math.sin(dioramaTick * 0.2) * 4);
        dctx.fillStyle = '#ff3b30';
        dctx.fillRect(fireX - 8, fireY - flameH, 16, flameH + 4);
        dctx.fillStyle = '#ffb703';
        dctx.fillRect(fireX - 4, fireY - flameH + 4, 8, flameH);

        // Spawn gentle rising embers
        if (dioramaTick % 4 === 0) {
            dioramaParticles.push({
                x: fireX + (Math.random() * 20 - 10),
                y: fireY - 6,
                vx: (Math.random() - 0.5) * 0.6,
                vy: -0.7 - Math.random() * 1.1,
                size: 3,
                life: 1,
                color: Math.random() > 0.4 ? '#ffb703' : '#ff3b30'
            });
        }
    } else {
        // CYBER NEON SCENE: Retro Synth Sun & Perspective Grid
        const sunX = Math.floor(w / 2);
        const sunY = h - 42;
        dctx.fillStyle = '#ff007f';
        dctx.fillRect(sunX - 36, sunY - 36, 72, 42);
        dctx.fillStyle = '#00f5d4';
        dctx.fillRect(sunX - 28, sunY - 28, 56, 12);

        // Skyline Buildings with Neon Windows
        dctx.fillStyle = '#07091e';
        for (let x = 10; x < w; x += 38) {
            const bH = 35 + ((x * 23) % 55);
            dctx.fillRect(x, h - 28 - bH, 30, bH);
            dctx.fillStyle = (x % 76 === 0) ? '#00f5d4' : '#ff007f';
            dctx.fillRect(x + 6, h - 22 - bH, 4, 4);
            dctx.fillRect(x + 16, h - 12 - bH, 4, 4);
            dctx.fillStyle = '#07091e';
        }

        // Ambient digital rain
        if (dioramaTick % 3 === 0) {
            dioramaParticles.push({
                x: Math.random() * w,
                y: 0,
                vx: 0,
                vy: 1.5 + Math.random() * 2,
                size: 3,
                life: 1,
                color: Math.random() > 0.5 ? '#00f5d4' : '#ff007f'
            });
        }
    }

    // Ground Platform
    dctx.fillStyle = palette.groundColor;
    dctx.fillRect(0, h - 28, w, 28);
    dctx.fillStyle = palette.groundLine;
    dctx.fillRect(0, h - 28, w, 3);

    // Animated Hero Sprite standing in Diorama
    const bobOffset = Math.sin(dioramaTick * 0.1) > 0 ? -3 : 0;
    const heroSprite = currentTheme === 'fantasy' ? SPRITES.fantasyKnight : SPRITES.cyberRunner;
    drawPixelSprite(dctx, heroSprite, Math.floor(w * 0.22), h - 64 + bobOffset, 3, palette.spriteColors);

    // Floating Gem / Artifact on the right
    const gemBob = Math.floor(Math.sin(dioramaTick * 0.08) * 5);
    drawPixelSprite(dctx, SPRITES.commitGem, Math.floor(w * 0.75), h - 62 + gemBob, 3, palette.gemColors);

    // Update & Draw Diorama Particles
    for (let i = dioramaParticles.length - 1; i >= 0; i--) {
        const p = dioramaParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
            dioramaParticles.splice(i, 1);
        } else {
            dctx.fillStyle = p.color;
            dctx.globalAlpha = Math.max(0, p.life);
            dctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            dctx.globalAlpha = 1.0;
        }
    }
}

export function initBgCanvas() {
    bgCanvas = document.getElementById('bgCanvas');
    if (!bgCanvas) return;
    bgCtx = bgCanvas.getContext('2d');

    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgStars = [];
    for (let i = 0; i < 45; i++) {
        bgStars.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            size: Math.random() > 0.7 ? 3 : 2,
            speedY: (Math.random() * 0.4) + 0.15,
            phase: Math.random() * Math.PI * 2
        });
    }
}

export function updateAndDrawBg() {
    if (!bgCanvas || !bgCtx) return;

    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const currentTheme = getCurrentTheme();
    const palette = THEME_PALETTES[currentTheme];

    for (let i = 0; i < bgStars.length; i++) {
        const star = bgStars[i];
        star.y = (currentTheme === 'fantasy')
            ? star.y - star.speedY // rising embers
            : star.y + star.speedY * 1.6; // falling cyber data

        if (star.y < 0) star.y = bgCanvas.height;
        if (star.y > bgCanvas.height) star.y = 0;

        const alpha = 0.25 + 0.35 * Math.sin(dioramaTick * 0.04 + star.phase);
        bgCtx.fillStyle = palette.particleColors[i % palette.particleColors.length];
        bgCtx.globalAlpha = alpha;
        bgCtx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    }
    bgCtx.globalAlpha = 1;
}
