/**************************************************************
 * FLAPPY DRAGON — DUNGEON PILLARS CRT EDITION (js/game/flappyDragon.js)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import {
    DRUK_CORE_PALETTE,
    getActiveTerminalPalette
} from '../config/palettes.js';
import { playSound } from '../audio/soundEngine.js';
import { drawFlyingDragon } from '../graphics/sprites/index.js';

const FLAPPY_HISCORE_KEY = 'druk_flappy_hiscore';
const CANVAS_WIDTH = 416;
const CANVAS_HEIGHT = 272;
const GRAVITY = 0.27;
const FLAP_VELOCITY = -5.3;
const BASE_SCROLL_SPEED = 2.15;
const BASE_PILLAR_GAP = 94;
const MIN_PILLAR_GAP = 72;
const PILLAR_WIDTH = 44;
const PILLAR_SPAWN_INTERVAL = 112;

let flappyCanvas = null;
let flappyContext = null;
let flappyAnimId = null;
let flappyRunning = false;
let flappyGameOver = false;
let gameOverCooldown = 0;
let flappyTick = 0;
let onExitFlappyCallback = null;

let flappyScore = 0;
let flappyHiScore = parseInt(localStorage.getItem(FLAPPY_HISCORE_KEY) || '0', 10);

const dragon = {
    x: 78,
    y: 116,
    vy: 0,
    w: 36,
    h: 30,
    flapTimer: 0
};

let pillars = [];
let flapParticles = [];
let spawnCounter = 0;

function updateFlappyHud() {
    const scoreEl = document.getElementById('flappyScoreVal');
    const hiScoreEl = document.getElementById('flappyHiScoreVal');
    const statusEl = document.getElementById('flappyStatusMsg');
    const flappyTexts = TRANSLATIONS[getCurrentLanguage()].flappy;

    if (scoreEl) scoreEl.textContent = String(flappyScore);
    if (hiScoreEl) hiScoreEl.textContent = String(flappyHiScore);
    if (statusEl) {
        statusEl.textContent = flappyGameOver
            ? flappyTexts.gameOver(flappyScore, flappyHiScore)
            : flappyTexts.controlsHint;
    }
}

function spawnFlapParticles(phosphorColor) {
    const palette = [
        DRUK_CORE_PALETTE.dragonLight,
        DRUK_CORE_PALETTE.bronzeWarm,
        phosphorColor
    ];
    for (let index = 0; index < 3; index++) {
        flapParticles.push({
            x: dragon.x + 2,
            y: dragon.y + 14 + (Math.random() * 8 - 4),
            vx: -1.4 - Math.random() * 1.6,
            vy: (Math.random() - 0.3) * 1.4,
            size: index === 0 ? 4 : 3,
            life: 1.0,
            color: palette[index % palette.length]
        });
    }
}

function getProgressionSettings() {
    const tier = Math.floor(flappyScore / 10);
    const scrollSpeed = Math.min(3.8, BASE_SCROLL_SPEED + tier * 0.22);
    const gapHeight = Math.max(MIN_PILLAR_GAP, BASE_PILLAR_GAP - tier * 4);
    return { scrollSpeed, gapHeight };
}

function spawnPillarPair() {
    const { gapHeight } = getProgressionSettings();
    const minTopHeight = 32;
    const maxTopHeight = CANVAS_HEIGHT - gapHeight - 36;
    const topHeight = Math.floor(minTopHeight + Math.random() * (maxTopHeight - minTopHeight));

    pillars.push({
        x: CANVAS_WIDTH + 8,
        w: PILLAR_WIDTH,
        topHeight,
        bottomY: topHeight + gapHeight,
        passed: false
    });
}

export function resetFlappyMatch() {
    dragon.y = Math.floor(CANVAS_HEIGHT / 2) - 16;
    dragon.vy = 0;
    dragon.flapTimer = 0;
    pillars = [];
    flapParticles = [];
    spawnCounter = 24;
    flappyScore = 0;
    flappyGameOver = false;
    gameOverCooldown = 0;
    updateFlappyHud();
}

export function triggerDragonFlap() {
    if (!flappyRunning) return;

    if (flappyGameOver) {
        if (gameOverCooldown <= 0) {
            playSound('click');
            resetFlappyMatch();
        }
        return;
    }

    dragon.vy = FLAP_VELOCITY;
    dragon.flapTimer = 10;
    playSound('flap');
    const colors = getActiveTerminalPalette();
    spawnFlapParticles(colors.fg);
}

function triggerFlappyGameOver() {
    flappyGameOver = true;
    gameOverCooldown = 16;
    playSound('gameover');

    const colors = getActiveTerminalPalette();
    for (let index = 0; index < 14; index++) {
        flapParticles.push({
            x: dragon.x + 16,
            y: dragon.y + 12,
            vx: (Math.random() - 0.5) * 4.2,
            vy: (Math.random() - 0.5) * 4.2,
            size: 4,
            life: 1.0,
            color: index % 2 === 0 ? DRUK_CORE_PALETTE.dragonLight : colors.fg
        });
    }
    updateFlappyHud();
}

function checkPillarCollision(pillar) {
    const hitbox = {
        x: dragon.x + 6,
        y: dragon.y + 4,
        w: dragon.w - 10,
        h: dragon.h - 8
    };

    const overlapsX = hitbox.x < pillar.x + pillar.w && hitbox.x + hitbox.w > pillar.x;
    if (!overlapsX) return false;

    const hitsTop = hitbox.y < pillar.topHeight;
    const hitsBottom = hitbox.y + hitbox.h > pillar.bottomY;
    return hitsTop || hitsBottom;
}

function updateFlappyPhysics() {
    flappyTick++;

    if (flappyGameOver) {
        if (gameOverCooldown > 0) gameOverCooldown--;
        return;
    }

    dragon.y += dragon.vy;
    dragon.vy += GRAVITY;
    if (dragon.flapTimer > 0) dragon.flapTimer--;

    // Ceiling & floor bounds
    if (dragon.y < 4) {
        dragon.y = 4;
        dragon.vy = 0;
    }
    if (dragon.y + dragon.h >= CANVAS_HEIGHT - 6) {
        dragon.y = CANVAS_HEIGHT - 6 - dragon.h;
        triggerFlappyGameOver();
        return;
    }

    const { scrollSpeed } = getProgressionSettings();
    spawnCounter++;
    if (spawnCounter >= PILLAR_SPAWN_INTERVAL) {
        spawnCounter = 0;
        spawnPillarPair();
    }

    for (let index = pillars.length - 1; index >= 0; index--) {
        const pillar = pillars[index];
        pillar.x -= scrollSpeed;

        if (checkPillarCollision(pillar)) {
            triggerFlappyGameOver();
            return;
        }

        if (!pillar.passed && pillar.x + pillar.w < dragon.x) {
            pillar.passed = true;
            flappyScore += 1;
            if (flappyScore > flappyHiScore) {
                flappyHiScore = flappyScore;
                localStorage.setItem(FLAPPY_HISCORE_KEY, String(flappyHiScore));
            }
            playSound('coin');
            updateFlappyHud();
        }

        if (pillar.x + pillar.w < -10) {
            pillars.splice(index, 1);
        }
    }
}

function drawDungeonPillarSection(x, y, width, height, isTopCap, colors) {
    if (height <= 0) return;

    // Dark stone core + forged steel / phosphor borders
    flappyContext.fillStyle = DRUK_CORE_PALETTE.abyss;
    flappyContext.fillRect(Math.floor(x), Math.floor(y), width, height);

    flappyContext.strokeStyle = colors.dim;
    flappyContext.lineWidth = 2;
    flappyContext.strokeRect(Math.floor(x) + 1, Math.floor(y) + 1, width - 2, height - 2);

    // Carved Dungeon Runes inside pillar shaft
    flappyContext.fillStyle = colors.fg;
    for (let runeY = y + 14; runeY < y + height - 16; runeY += 18) {
        flappyContext.fillRect(Math.floor(x) + Math.floor(width / 2) - 3, Math.floor(runeY), 6, 4);
        flappyContext.fillRect(Math.floor(x) + Math.floor(width / 2) - 1, Math.floor(runeY) + 4, 2, 4);
    }

    // Beveled Pillar Capital (Cap) near the gap
    const capHeight = Math.min(10, height);
    const capY = isTopCap ? y + height - capHeight : y;
    flappyContext.fillStyle = colors.dim;
    flappyContext.fillRect(Math.floor(x) - 3, Math.floor(capY), width + 6, capHeight);
    flappyContext.strokeStyle = colors.fg;
    flappyContext.strokeRect(Math.floor(x) - 3, Math.floor(capY), width + 6, capHeight);
}

export function drawFlappyFrame() {
    if (!flappyCanvas || !flappyContext) return;

    const colors = getActiveTerminalPalette();

    // 1. Background CRT Sky & Horizon Grid
    flappyContext.fillStyle = colors.bg;
    flappyContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    flappyContext.fillStyle = colors.dim;
    flappyContext.globalAlpha = 0.16;
    for (let y = 32; y < CANVAS_HEIGHT; y += 32) {
        flappyContext.fillRect(0, y, CANVAS_WIDTH, 1);
    }
    flappyContext.globalAlpha = 1.0;

    // 2. Draw Dungeon Pillars
    pillars.forEach((pillar) => {
        drawDungeonPillarSection(pillar.x, 0, pillar.w, pillar.topHeight, true, colors);
        drawDungeonPillarSection(
            pillar.x,
            pillar.bottomY,
            pillar.w,
            CANVAS_HEIGHT - pillar.bottomY,
            false,
            colors
        );
    });

    // 3. Update & Draw Flap Particles
    for (let index = flapParticles.length - 1; index >= 0; index--) {
        const p = flapParticles[index];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.045;
        if (p.life <= 0) {
            flapParticles.splice(index, 1);
        } else {
            flappyContext.globalAlpha = Math.max(0, p.life);
            flappyContext.fillStyle = p.color;
            flappyContext.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            flappyContext.globalAlpha = 1.0;
        }
    }

    // 4. Draw DrukDev Dragon Sprite (with wing state & velocity tilt)
    const tiltAngle = Math.max(-0.32, Math.min(0.42, dragon.vy * 0.06));
    drawFlyingDragon(
        flappyContext,
        dragon.x + dragon.w / 2,
        dragon.y + dragon.h / 2,
        dragon.flapTimer > 0,
        tiltAngle
    );

    // 5. Outer CRT Frame Border
    flappyContext.strokeStyle = colors.dim;
    flappyContext.lineWidth = 2;
    flappyContext.strokeRect(1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);
}

function flappyLoop() {
    if (!flappyRunning) return;
    updateFlappyPhysics();
    drawFlappyFrame();
    flappyAnimId = requestAnimationFrame(flappyLoop);
}

export function startFlappyDragonGame(onExitCallback) {
    onExitFlappyCallback = onExitCallback;
    flappyCanvas = document.getElementById('flappyCanvas');
    if (!flappyCanvas) return;

    flappyCanvas.width = CANVAS_WIDTH;
    flappyCanvas.height = CANVAS_HEIGHT;
    flappyContext = flappyCanvas.getContext('2d');

    stopFlappyDragonGame();
    flappyRunning = true;
    resetFlappyMatch();
    flappyAnimId = requestAnimationFrame(flappyLoop);
}

export function stopFlappyDragonGame() {
    flappyRunning = false;
    if (flappyAnimId) {
        cancelAnimationFrame(flappyAnimId);
        flappyAnimId = null;
    }
}

export function initFlappyDragonControls() {
    window.addEventListener('keydown', (event) => {
        if (!flappyRunning) return;

        if (event.code === 'Escape' || event.code === 'KeyQ') {
            event.preventDefault();
            stopFlappyDragonGame();
            if (typeof onExitFlappyCallback === 'function') {
                onExitFlappyCallback();
            }
            return;
        }

        if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
            event.preventDefault();
            triggerDragonFlap();
        }
    });

    const canvasEl = document.getElementById('flappyCanvas');
    if (canvasEl) {
        canvasEl.addEventListener('mousedown', (event) => {
            event.preventDefault();
            triggerDragonFlap();
        });
        canvasEl.addEventListener('touchstart', (event) => {
            event.preventDefault();
            triggerDragonFlap();
        }, { passive: false });
    }

    const flapBtn = document.getElementById('flappyFlapBtn');
    if (flapBtn) {
        flapBtn.addEventListener('mousedown', (event) => {
            event.preventDefault();
            triggerDragonFlap();
        });
        flapBtn.addEventListener('touchstart', (event) => {
            event.preventDefault();
            triggerDragonFlap();
        }, { passive: false });
    }

    const restartBtn = document.getElementById('flappyRestartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            playSound('click');
            resetFlappyMatch();
        });
    }

    const exitBtn = document.getElementById('flappyExitBtn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            playSound('click');
            stopFlappyDragonGame();
            if (typeof onExitFlappyCallback === 'function') {
                onExitFlappyCallback();
            }
        });
    }
}
