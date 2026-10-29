/**************************************************************
 * PLAYABLE MINI-GAME ENGINE: "DRUK'S BUG SLASHER"
 **************************************************************/

import { THEME_PALETTES, HISCORE_STORAGE_KEY, getCurrentTheme } from '../config/themes.js';
import { playSound } from '../audio/soundEngine.js';
import { SPRITES, drawPixelSprite } from '../graphics/sprites.js';

const GAME_W = 400;
const GAME_H = 300;
const GROUND_Y = 248;

let gameCanvas = null;
let gctx = null;

let gameRunning = false;
let score = 0;
let hiScore = parseInt(localStorage.getItem(HISCORE_STORAGE_KEY) || '0', 10);

const player = {
    x: 48,
    y: GROUND_Y - 36,
    vy: 0,
    w: 36,
    h: 36,
    grounded: true,
    attackTimer: 0
};

let entities = []; // bugs and commit gems
let gameParticles = [];
let spawnTimer = 0;
let gameSpeed = 3.2;

function rectIntersect(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function spawnGameParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        gameParticles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: 4,
            life: 1,
            color
        });
    }
}

export function updateScoreUI() {
    const scoreEl = document.getElementById('scoreDisplay');
    const hiScoreEl = document.getElementById('hiScoreDisplay');
    if (scoreEl) scoreEl.textContent = score;
    if (hiScoreEl) hiScoreEl.textContent = hiScore;
}

export function startGame() {
    playSound('coin');
    const overlay = document.getElementById('gameOverlay');
    if (overlay) overlay.classList.add('hidden');

    score = 0;
    gameSpeed = 3.2;
    entities = [];
    gameParticles = [];
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.grounded = true;
    player.attackTimer = 0;
    gameRunning = true;
    updateScoreUI();
}

export function gameOver() {
    gameRunning = false;
    playSound('gameover');

    if (score > hiScore) {
        hiScore = score;
        localStorage.setItem(HISCORE_STORAGE_KEY, String(hiScore));
    }
    updateScoreUI();

    const overlay = document.getElementById('gameOverlay');
    if (overlay) overlay.classList.remove('hidden');

    const overlayTitle = document.getElementById('overlayTitle');
    const overlayDesc = document.getElementById('overlayDesc');
    const startBtnText = document.getElementById('startBtnText');

    if (overlayTitle) {
        overlayTitle.textContent = `¡BUG EN PRODUCCIÓN! (SCORE: ${score})`;
    }
    if (overlayDesc) {
        overlayDesc.innerHTML = `Tu récord actual es <b class="text-bronze">${hiScore} pts</b>. ¿Otra partida rápida mientras DrukDev termina el deploy?`;
    }
    if (startBtnText) {
        startBtnText.textContent = 'REINTENTAR / PLAY AGAIN';
    }
}

export function triggerJump(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!gameRunning) return;
    if (player.grounded) {
        player.vy = -9.6;
        player.grounded = false;
        playSound('jump');
        spawnGameParticles(player.x + 12, player.y + 34, 6, '#ffffff');
    }
}

export function triggerAttack(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!gameRunning) return;
    if (player.attackTimer <= 0) {
        player.attackTimer = 14;
        playSound('attack');

        const currentTheme = getCurrentTheme();
        const slashBox = {
            x: player.x + player.w - 4,
            y: player.y - 8,
            w: 48,
            h: player.h + 16
        };

        for (let i = entities.length - 1; i >= 0; i--) {
            const ent = entities[i];
            if (ent.type === 'bug' && rectIntersect(slashBox, ent)) {
                spawnGameParticles(ent.x + 12, ent.y + 12, 16, THEME_PALETTES[currentTheme].slashColor);
                entities.splice(i, 1);
                score += 15;
                playSound('hit');
                updateScoreUI();
            }
        }
    }
}

export function initGame() {
    gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;
    gctx = gameCanvas.getContext('2d');

    gameCanvas.width = GAME_W;
    gameCanvas.height = GAME_H;

    updateScoreUI();

    // Start button
    const btnStartGame = document.getElementById('btnStartGame');
    if (btnStartGame) {
        btnStartGame.addEventListener('click', startGame);
    }

    // Touch / Mouse control buttons
    const btnJump = document.getElementById('btnJump');
    if (btnJump) {
        btnJump.addEventListener('mousedown', () => triggerJump());
        btnJump.addEventListener('touchstart', (e) => triggerJump(e), { passive: false });
    }

    const btnAttack = document.getElementById('btnAttack');
    if (btnAttack) {
        btnAttack.addEventListener('mousedown', () => triggerAttack());
        btnAttack.addEventListener('touchstart', (e) => triggerAttack(e), { passive: false });
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
            if (gameRunning) {
                e.preventDefault();
                triggerJump();
            }
        } else if (['KeyK', 'KeyJ', 'ArrowRight', 'Enter'].includes(e.code)) {
            if (gameRunning) {
                e.preventDefault();
                triggerAttack();
            }
        }
    });

    // Click on Game Canvas to attack/jump
    gameCanvas.addEventListener('mousedown', (e) => {
        if (!gameRunning) return;
        const rect = gameCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width / 2) {
            triggerJump();
        } else {
            triggerAttack();
        }
    });
}

export function updateAndDrawGame() {
    if (!gameCanvas || !gctx) return;

    const currentTheme = getCurrentTheme();
    const palette = THEME_PALETTES[currentTheme];

    // Clear Sky
    gctx.fillStyle = palette.bgSkyTop;
    gctx.fillRect(0, 0, GAME_W, GAME_H);

    // Retro Horizon Grid Lines
    gctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let y = 40; y < GROUND_Y; y += 35) {
        gctx.fillRect(0, y, GAME_W, 1);
    }

    // Ground
    gctx.fillStyle = palette.groundColor;
    gctx.fillRect(0, GROUND_Y, GAME_W, GAME_H - GROUND_Y);
    gctx.fillStyle = palette.groundLine;
    gctx.fillRect(0, GROUND_Y, GAME_W, 4);

    if (gameRunning) {
        // Physics
        player.y += player.vy;
        player.vy += 0.52; // gravity

        if (player.y >= GROUND_Y - player.h) {
            player.y = GROUND_Y - player.h;
            player.vy = 0;
            player.grounded = true;
        }

        if (player.attackTimer > 0) {
            player.attackTimer--;
        }

        // Increase speed gradually
        gameSpeed = Math.min(7.2, 3.2 + score * 0.012);

        // Spawn Bugs and Commit Gems
        spawnTimer--;
        if (spawnTimer <= 0) {
            const isGem = Math.random() < 0.35;
            entities.push({
                type: isGem ? 'gem' : 'bug',
                x: GAME_W + 20,
                y: isGem ? (GROUND_Y - 32 - (Math.random() > 0.5 ? 42 : 0)) : (GROUND_Y - 26),
                w: 26,
                h: 26
            });
            spawnTimer = Math.floor(45 + Math.random() * 45);
        }

        // Update Entities
        const slashBox = {
            x: player.x + player.w - 4,
            y: player.y - 8,
            w: 48,
            h: player.h + 16
        };

        for (let i = entities.length - 1; i >= 0; i--) {
            const ent = entities[i];
            ent.x -= gameSpeed;

            // If player is actively slashing, destroy bugs in front
            if (player.attackTimer > 4 && ent.type === 'bug' && rectIntersect(slashBox, ent)) {
                spawnGameParticles(ent.x + 12, ent.y + 12, 14, palette.slashColor);
                entities.splice(i, 1);
                score += 15;
                playSound('hit');
                updateScoreUI();
                continue;
            }

            // Check collision with player body
            const playerHitbox = {
                x: player.x + 6,
                y: player.y + 4,
                w: player.w - 12,
                h: player.h - 6
            };

            if (rectIntersect(playerHitbox, ent)) {
                if (ent.type === 'gem') {
                    score += 25;
                    playSound('coin');
                    spawnGameParticles(ent.x + 10, ent.y + 10, 12, palette.warmBronze);
                    entities.splice(i, 1);
                    updateScoreUI();
                    continue;
                } else {
                    // Hit a Bug!
                    spawnGameParticles(player.x + 16, player.y + 16, 24, palette.slashColor);
                    gameOver();
                    break;
                }
            }

            // Passed screen safely
            if (ent.x + ent.w < 0) {
                if (ent.type === 'bug') {
                    score += 5;
                    updateScoreUI();
                }
                entities.splice(i, 1);
            }
        }
    }

    // Draw Player Sprite
    const heroSprite = currentTheme === 'fantasy' ? SPRITES.fantasyKnight : SPRITES.cyberRunner;
    drawPixelSprite(gctx, heroSprite, player.x, player.y, 3, palette.spriteColors);

    // Draw Attack Slash Wave
    if (player.attackTimer > 0) {
        gctx.fillStyle = palette.slashColor;
        const offset = (14 - player.attackTimer) * 2;
        gctx.fillRect(player.x + player.w + offset, player.y + 2, 10, 30);
        gctx.fillRect(player.x + player.w + offset + 10, player.y + 8, 6, 18);
    }

    // Draw Entities
    const bugSprite = currentTheme === 'fantasy' ? SPRITES.fantasyBug : SPRITES.cyberBug;
    for (const ent of entities) {
        if (ent.type === 'bug') {
            drawPixelSprite(gctx, bugSprite, ent.x, ent.y, 3, palette.bugColors);
        } else {
            drawPixelSprite(gctx, SPRITES.commitGem, ent.x, ent.y, 3, palette.gemColors);
        }
    }

    // Draw Game Particles
    for (let i = gameParticles.length - 1; i >= 0; i--) {
        const p = gameParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) {
            gameParticles.splice(i, 1);
        } else {
            gctx.fillStyle = p.color;
            gctx.globalAlpha = Math.max(0, p.life);
            gctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            gctx.globalAlpha = 1;
        }
    }
}
