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

    // Background Gradient (#0D0D0F -> #231C1A in Dark Fantasy)
    const grad = dctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, palette.bgSkyTop);
    grad.addColorStop(1, palette.bgSkyBottom);
    dctx.fillStyle = grad;
    dctx.fillRect(0, 0, w, h);

    if (currentTheme === 'fantasy') {
        // Draw Mystic Dragon Moon (Escamas Base #7A1F73, Escamas Luz #B92B92, Bronce #D4957A)
        dctx.fillStyle = 'rgba(185, 43, 146, 0.22)';
        dctx.fillRect(w - 110, 14, 56, 56);
        dctx.fillStyle = '#7A1F73';
        dctx.fillRect(w - 102, 22, 40, 40);
        dctx.fillStyle = '#B92B92';
        dctx.fillRect(w - 96, 28, 28, 28);
        dctx.fillStyle = '#D4957A';
        dctx.fillRect(w - 90, 34, 16, 16);

        // Distant Dragon Keep / Monoliths Silhouette (#231C1A & #7A1F73 accents)
        for (let x = 0; x < w; x += 24) {
            const towerH = 28 + ((x * 17) % 45);
            dctx.fillStyle = '#0D0D0F';
            dctx.fillRect(x, h - 28 - towerH, 20, towerH);
            dctx.fillStyle = '#231C1A';
            dctx.fillRect(x + 2, h - 28 - towerH + 2, 16, towerH - 2);
            if (x % 48 === 0) {
                dctx.fillStyle = '#D4957A';
                dctx.fillRect(x + 8, h - 20 - towerH, 4, 6);
            }
        }

        // Dragon Forge Brazier in Center (#8A4E3B, #B92B92, #7A1F73, #D4957A)
        const fireX = Math.floor(w / 2);
        const fireY = h - 32;
        dctx.fillStyle = '#56616E';
        dctx.fillRect(fireX - 15, fireY + 4, 30, 6);
        dctx.fillStyle = '#8A4E3B';
        dctx.fillRect(fireX - 12, fireY + 2, 24, 4);

        const flameH = 10 + Math.floor(Math.sin(dioramaTick * 0.2) * 4);
        dctx.fillStyle = '#7A1F73';
        dctx.fillRect(fireX - 10, fireY - flameH + 2, 20, flameH + 2);
        dctx.fillStyle = '#B92B92';
        dctx.fillRect(fireX - 7, fireY - flameH, 14, flameH + 2);
        dctx.fillStyle = '#D4957A';
        dctx.fillRect(fireX - 4, fireY - flameH + 4, 8, flameH - 2);

        // Spawn gentle rising dragon embers (#B92B92, #D4957A, #7A1F73)
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

    // Ground Platform (#231C1A base with #B92B92 & #56616E border in Dark Fantasy)
    dctx.fillStyle = palette.groundColor;
    dctx.fillRect(0, h - 28, w, 28);
    dctx.fillStyle = palette.groundLine;
    dctx.fillRect(0, h - 28, w, 3);
    dctx.fillStyle = palette.steelBorder;
    dctx.fillRect(0, h - 25, w, 2);

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
