/**************************************************************
 * DRUK SNAKE — CRT PHOSPHOR EDITION (js/game/snakeGame.js)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { getActiveTerminalPalette } from '../config/palettes.js';
import { playSound } from '../audio/soundEngine.js';
import { drawSnakeFoodNode, drawSnakeSegment } from '../graphics/sprites/index.js';

const SNAKE_HISCORE_KEY = 'druk_snake_hiscore';
const GRID_COLS = 24;
const GRID_ROWS = 16;
const CELL_SIZE = 16;
const TICK_INTERVAL_MS = 105;

let snakeCanvas = null;
let snakeContext = null;
let snakeLoopId = null;
let snakeActive = false;
let snakeGameOver = false;
let onExitSnakeCallback = null;

let snakeSegments = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let foodPosition = { x: 12, y: 8 };
let snakeScore = 0;
let snakeHiScore = parseInt(localStorage.getItem(SNAKE_HISCORE_KEY) || '0', 10);

function updateSnakeHud() {
    const scoreEl = document.getElementById('snakeScoreVal');
    const hiScoreEl = document.getElementById('snakeHiScoreVal');
    const statusEl = document.getElementById('snakeStatusMsg');

    if (scoreEl) scoreEl.textContent = String(snakeScore);
    if (hiScoreEl) hiScoreEl.textContent = String(snakeHiScore);
    if (statusEl) {
        statusEl.textContent = snakeGameOver
            ? TRANSLATIONS[getCurrentLanguage()].snake.gameOver
            : TRANSLATIONS[getCurrentLanguage()].snake.controlsHint;
    }
}

function spawnFood() {
    let candidate = null;
    while (!candidate) {
        const rx = Math.floor(Math.random() * GRID_COLS);
        const ry = Math.floor(Math.random() * GRID_ROWS);
        const collides = snakeSegments.some((seg) => seg.x === rx && seg.y === ry);
        if (!collides) {
            candidate = { x: rx, y: ry };
        }
    }
    foodPosition = candidate;
}

export function resetSnakeMatch() {
    snakeSegments = [
        { x: 6, y: 8 },
        { x: 5, y: 8 },
        { x: 4, y: 8 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    snakeScore = 0;
    snakeGameOver = false;
    spawnFood();
    updateSnakeHud();
    drawSnakeFrame();
}

function setSnakeDirection(dx, dy) {
    if (!snakeActive || snakeGameOver) return;
    // Prevent 180-degree self-reversal
    if (direction.x + dx === 0 && direction.y + dy === 0) return;
    nextDirection = { x: dx, y: dy };
}

function stepSnakeGame() {
    if (!snakeActive || snakeGameOver) return;

    direction = { ...nextDirection };
    const head = {
        x: snakeSegments[0].x + direction.x,
        y: snakeSegments[0].y + direction.y
    };

    // Wall collision
    if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) {
        handleSnakeCollision();
        return;
    }

    // Self collision
    if (snakeSegments.some((seg) => seg.x === head.x && seg.y === head.y)) {
        handleSnakeCollision();
        return;
    }

    snakeSegments.unshift(head);

    if (head.x === foodPosition.x && head.y === foodPosition.y) {
        snakeScore += 10;
        if (snakeScore > snakeHiScore) {
            snakeHiScore = snakeScore;
            localStorage.setItem(SNAKE_HISCORE_KEY, String(snakeHiScore));
        }
        playSound('coin');
        spawnFood();
    } else {
        snakeSegments.pop();
    }

    updateSnakeHud();
    drawSnakeFrame();
}

function handleSnakeCollision() {
    snakeGameOver = true;
    playSound('gameover');
    updateSnakeHud();
    drawSnakeFrame();
}

export function drawSnakeFrame() {
    if (!snakeCanvas || !snakeContext) return;

    const colors = getActiveTerminalPalette();
    const width = snakeCanvas.width;
    const height = snakeCanvas.height;

    // Clear CRT phosphor screen
    snakeContext.fillStyle = colors.bg;
    snakeContext.fillRect(0, 0, width, height);

    // Subtle phosphor grid dots
    snakeContext.fillStyle = colors.dim;
    snakeContext.globalAlpha = 0.25;
    for (let gx = 0; gx < GRID_COLS; gx++) {
        for (let gy = 0; gy < GRID_ROWS; gy++) {
            snakeContext.fillRect(gx * CELL_SIZE + 7, gy * CELL_SIZE + 7, 2, 2);
        }
    }
    snakeContext.globalAlpha = 1.0;

    // Draw Food & Snake Segments procedurally
    drawSnakeFoodNode(snakeContext, foodPosition.x, foodPosition.y, CELL_SIZE, colors);

    snakeSegments.forEach((segment, index) => {
        drawSnakeSegment(snakeContext, segment.x, segment.y, CELL_SIZE, index === 0, colors);
    });

    // Outer phosphor border
    snakeContext.strokeStyle = colors.dim;
    snakeContext.lineWidth = 2;
    snakeContext.strokeRect(1, 1, width - 2, height - 2);
}

export function startSnakeGame(onExitCallback) {
    onExitSnakeCallback = onExitCallback;
    snakeCanvas = document.getElementById('snakeCanvas');
    if (!snakeCanvas) return;

    snakeCanvas.width = GRID_COLS * CELL_SIZE;
    snakeCanvas.height = GRID_ROWS * CELL_SIZE;
    snakeContext = snakeCanvas.getContext('2d');

    snakeActive = true;
    resetSnakeMatch();

    clearInterval(snakeLoopId);
    snakeLoopId = setInterval(stepSnakeGame, TICK_INTERVAL_MS);
}

export function stopSnakeGame() {
    snakeActive = false;
    clearInterval(snakeLoopId);
    snakeLoopId = null;
}

export function isSnakeGameRunning() {
    return snakeActive;
}

export function initSnakeControls() {
    window.addEventListener('keydown', (event) => {
        if (!snakeActive) return;

        if (event.code === 'Escape' || event.code === 'KeyQ') {
            event.preventDefault();
            stopSnakeGame();
            if (typeof onExitSnakeCallback === 'function') {
                onExitSnakeCallback();
            }
            return;
        }

        if (snakeGameOver && event.code === 'Space') {
            event.preventDefault();
            playSound('click');
            resetSnakeMatch();
            return;
        }

        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            event.preventDefault();
            setSnakeDirection(0, -1);
        } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            event.preventDefault();
            setSnakeDirection(0, 1);
        } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            event.preventDefault();
            setSnakeDirection(-1, 0);
        } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            event.preventDefault();
            setSnakeDirection(1, 0);
        }
    });

    const bindDirBtn = (id, dx, dy) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => setSnakeDirection(dx, dy));
        btn.addEventListener('touchstart', (event) => {
            event.preventDefault();
            setSnakeDirection(dx, dy);
        }, { passive: false });
    };

    bindDirBtn('snakeUpBtn', 0, -1);
    bindDirBtn('snakeDownBtn', 0, 1);
    bindDirBtn('snakeLeftBtn', -1, 0);
    bindDirBtn('snakeRightBtn', 1, 0);

    const restartBtn = document.getElementById('snakeRestartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            playSound('click');
            resetSnakeMatch();
        });
    }

    const exitBtn = document.getElementById('snakeExitBtn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            playSound('click');
            stopSnakeGame();
            if (typeof onExitSnakeCallback === 'function') {
                onExitSnakeCallback();
            }
        });
    }
}
