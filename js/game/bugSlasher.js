/**************************************************************
 * PLAYABLE MINI-GAME ENGINE: "DRUK'S BUG SLASHER"
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { SPRITE_PALETTES } from '../config/palettes.js';
import { playSound } from '../audio/soundEngine.js';
import { areRectsIntersecting, removeItemSwapAndPop } from '../utils/mathUtils.js';
import { loadItem, saveItem } from '../utils/safeStorage.js';
import {
    drawSlasherHero,
    drawSlasherSwordWave,
    drawBugEnemy,
    drawCommitGem
} from '../graphics/sprites/index.js';

export const HISCORE_STORAGE_KEY = 'drukdev_hiscore';

const SLASHER_PALETTE = SPRITE_PALETTES.slasher;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 300;
const GROUND_Y = 248;
const GRAVITY = 0.52;
const JUMP_VELOCITY = -9.6;
const INITIAL_GAME_SPEED = 3.2;
const MAX_GAME_SPEED = 7.2;

let gameCanvas = null;
let gameContext = null;

let gameRunning = false;
let isGameOverState = false;
let score = 0;
let hiScore = parseInt(loadItem(HISCORE_STORAGE_KEY, '0') || '0', 10);

const player = {
    x: 48,
    y: GROUND_Y - 36,
    vy: 0,
    w: 36,
    h: 36,
    grounded: true,
    attackTimer: 0
};

let entities = [];
let gameParticles = [];
let spawnTimer = 0;
let gameSpeed = INITIAL_GAME_SPEED;

function getPlayerSlashHitbox() {
    return {
        x: player.x + player.w - 4,
        y: player.y - 8,
        w: 48,
        h: player.h + 16
    };
}

function getPlayerBodyHitbox() {
    return {
        x: player.x + 6,
        y: player.y + 4,
        w: player.w - 12,
        h: player.h - 6
    };
}

function spawnGameParticles(originX, originY, particleCount, color) {
    for (let index = 0; index < particleCount; index++) {
        gameParticles.push({
            x: originX,
            y: originY,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: 4,
            life: 1,
            color
        });
    }
}

function destroyBugEntity(entityIndex, slashColor, particleCount = 15) {
    const targetBug = entities[entityIndex];
    if (!targetBug) return;

    spawnGameParticles(targetBug.x + 12, targetBug.y + 12, particleCount, slashColor);
    entities.splice(entityIndex, 1);
    score += 15;
    playSound('hit');
    updateScoreUI();
}

export function updateScoreUI() {
    const scoreElement = document.getElementById('scoreDisplay');
    const hiScoreElement = document.getElementById('hiScoreDisplay');
    if (scoreElement) scoreElement.textContent = score;
    if (hiScoreElement) hiScoreElement.textContent = hiScore;
}

export function refreshGameOverlayLanguage() {
    const gameTexts = TRANSLATIONS[getCurrentLanguage()].game;
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayDesc = document.getElementById('overlayDesc');
    const startBtnText = document.getElementById('startBtnText');

    if (isGameOverState) {
        if (overlayTitle) overlayTitle.textContent = gameTexts.gameOverTitle(score);
        if (overlayDesc) overlayDesc.innerHTML = gameTexts.gameOverDescHtml(hiScore);
        if (startBtnText) startBtnText.textContent = gameTexts.retryBtn;
    } else {
        if (overlayTitle) overlayTitle.textContent = gameTexts.overlayTitle;
        if (overlayDesc) overlayDesc.innerHTML = gameTexts.overlayDescHtml;
        if (startBtnText) startBtnText.textContent = gameTexts.startBtn;
    }
}

export function startGame() {
    playSound('coin');
    const overlayElement = document.getElementById('gameOverlay');
    if (overlayElement) overlayElement.classList.add('hidden');

    score = 0;
    gameSpeed = INITIAL_GAME_SPEED;
    entities = [];
    gameParticles = [];
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.grounded = true;
    player.attackTimer = 0;
    isGameOverState = false;
    gameRunning = true;
    updateScoreUI();
}

export function gameOver() {
    gameRunning = false;
    isGameOverState = true;
    playSound('gameover');

    if (score > hiScore) {
        hiScore = score;
        saveItem(HISCORE_STORAGE_KEY, String(hiScore));
    }
    updateScoreUI();

    const overlayElement = document.getElementById('gameOverlay');
    if (overlayElement) overlayElement.classList.remove('hidden');

    refreshGameOverlayLanguage();
}

export function triggerJump(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!gameRunning || !player.grounded) return;

    player.vy = JUMP_VELOCITY;
    player.grounded = false;
    playSound('jump');
    spawnGameParticles(player.x + 12, player.y + 34, 6, SLASHER_PALETTE.jumpDust);
}

export function triggerAttack(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!gameRunning || player.attackTimer > 0) return;

    player.attackTimer = 14;
    playSound('attack');

    const slashHitbox = getPlayerSlashHitbox();

    for (let index = entities.length - 1; index >= 0; index--) {
        const entity = entities[index];
        if (entity.type === 'bug' && areRectsIntersecting(slashHitbox, entity)) {
            destroyBugEntity(index, SLASHER_PALETTE.slashColor, 16);
        }
    }
}

export function initGame() {
    gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;
    gameContext = gameCanvas.getContext('2d');

    gameCanvas.width = GAME_WIDTH;
    gameCanvas.height = GAME_HEIGHT;

    updateScoreUI();

    const btnStartGame = document.getElementById('btnStartGame');
    if (btnStartGame) {
        btnStartGame.addEventListener('click', startGame);
    }

    const btnJump = document.getElementById('btnJump');
    if (btnJump) {
        btnJump.addEventListener('mousedown', () => triggerJump());
        btnJump.addEventListener('touchstart', (event) => triggerJump(event), { passive: false });
    }

    const btnAttack = document.getElementById('btnAttack');
    if (btnAttack) {
        btnAttack.addEventListener('mousedown', () => triggerAttack());
        btnAttack.addEventListener('touchstart', (event) => triggerAttack(event), { passive: false });
    }

    window.addEventListener('keydown', (event) => {
        if (!gameRunning) return;
        if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
            event.preventDefault();
            triggerJump();
        } else if (['KeyK', 'KeyJ', 'ArrowRight', 'Enter'].includes(event.code)) {
            event.preventDefault();
            triggerAttack();
        }
    });

    gameCanvas.addEventListener('mousedown', (event) => {
        if (!gameRunning) return;
        const canvasRect = gameCanvas.getBoundingClientRect();
        const clickX = event.clientX - canvasRect.left;
        if (clickX < canvasRect.width / 2) {
            triggerJump();
        } else {
            triggerAttack();
        }
    });
}

function updatePlayerPhysics() {
    player.y += player.vy;
    player.vy += GRAVITY;

    if (player.y >= GROUND_Y - player.h) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.grounded = true;
    }

    if (player.attackTimer > 0) {
        player.attackTimer--;
    }
}

function updateEntitySpawner() {
    spawnTimer--;
    if (spawnTimer > 0) return;

    const isGem = Math.random() < 0.35;
    entities.push({
        type: isGem ? 'gem' : 'bug',
        x: GAME_WIDTH + 20,
        y: isGem ? (GROUND_Y - 32 - (Math.random() > 0.5 ? 42 : 0)) : (GROUND_Y - 26),
        w: 26,
        h: 26
    });
    spawnTimer = Math.floor(45 + Math.random() * 45);
}

function updateGameEntities(palette) {
    const slashHitbox = getPlayerSlashHitbox();
    const playerHitbox = getPlayerBodyHitbox();

    for (let index = entities.length - 1; index >= 0; index--) {
        const entity = entities[index];
        entity.x -= gameSpeed;

        // Destroy bugs inside active slash wave
        if (player.attackTimer > 4 && entity.type === 'bug' && areRectsIntersecting(slashHitbox, entity)) {
            destroyBugEntity(index, palette.slashColor, 14);
            continue;
        }

        // Check collision with player body
        if (areRectsIntersecting(playerHitbox, entity)) {
            if (entity.type === 'gem') {
                score += 25;
                playSound('coin');
                spawnGameParticles(entity.x + 10, entity.y + 10, 12, palette.warmBronze);
                entities.splice(index, 1);
                updateScoreUI();
                continue;
            }
            spawnGameParticles(player.x + 16, player.y + 16, 24, palette.slashColor);
            gameOver();
            break;
        }

        // Entity passed left screen edge safely
        if (entity.x + entity.w < 0) {
            if (entity.type === 'bug') {
                score += 5;
                updateScoreUI();
            }
            entities.splice(index, 1);
        }
    }
}

function drawGameScene(palette) {
    // Clear Sky
    gameContext.fillStyle = palette.bgSkyTop;
    gameContext.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Retro Horizon Grid Lines
    gameContext.fillStyle = palette.gridLine;
    for (let gridY = 40; gridY < GROUND_Y; gridY += 35) {
        gameContext.fillRect(0, gridY, GAME_WIDTH, 1);
    }

    // Ground
    gameContext.fillStyle = palette.groundColor;
    gameContext.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
    gameContext.fillStyle = palette.groundLine;
    gameContext.fillRect(0, GROUND_Y, GAME_WIDTH, 4);

    // Player Sprite & Attack Slash Wave
    drawSlasherHero(gameContext, player.x, player.y);
    drawSlasherSwordWave(
        gameContext,
        player.x,
        player.y,
        player.w,
        player.attackTimer,
        palette.slashColor
    );

    // Entities (Bugs & Commit Gems)
    for (const entity of entities) {
        if (entity.type === 'bug') {
            drawBugEnemy(gameContext, entity.x, entity.y, palette);
        } else {
            drawCommitGem(gameContext, entity.x, entity.y, palette);
        }
    }
}

function updateAndDrawGameParticles() {
    for (let index = gameParticles.length - 1; index >= 0; index--) {
        const particle = gameParticles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.05;

        if (particle.life <= 0) {
            removeItemSwapAndPop(gameParticles, index);
        } else {
            gameContext.fillStyle = particle.color;
            gameContext.globalAlpha = Math.max(0, particle.life);
            gameContext.fillRect(
                Math.floor(particle.x),
                Math.floor(particle.y),
                particle.size,
                particle.size
            );
            gameContext.globalAlpha = 1;
        }
    }
}

export function updateAndDrawGame() {
    if (!gameCanvas || !gameContext) return;

    if (gameRunning) {
        updatePlayerPhysics();
        gameSpeed = Math.min(MAX_GAME_SPEED, INITIAL_GAME_SPEED + score * 0.012);
        updateEntitySpawner();
        updateGameEntities(SLASHER_PALETTE);
    }

    drawGameScene(SLASHER_PALETTE);
    updateAndDrawGameParticles();
}
