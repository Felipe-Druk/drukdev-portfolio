/**************************************************************
 * INTERACTIVE PIXEL-ART SANCTUARY SCENE (MAIN STAGE CANVAS)
 **************************************************************/

import { TRANSLATIONS, getCurrentLanguage } from '../config/i18n.js';
import { playSound } from '../audio/soundEngine.js';
import { SPRITES, drawPixelSprite } from './sprites.js';
import { THEME_PALETTES } from '../config/themes.js';

const PIXEL_UNIT = 4;

let sanctuaryCanvas = null;
let sanctuaryContext = null;
let sanctuaryTick = 0;
let openTerminalCallback = null;

const pointerState = {
    x: -1,
    y: -1,
    hoveredZone: null
};

const sanctuaryState = {
    moonPhase: 0,
    treeRustleTimer: 0,
    dungeonShakeTimer: 0,
    dungeonMessageTimer: 0,
    heroOffsetY: 0,
    heroVelocityY: 0,
    heroJumping: false
};

let particles = [];
let pondRipples = [];
let ambientFireflies = [];

function snapToPixel(value) {
    return Math.floor(value / PIXEL_UNIT) * PIXEL_UNIT;
}

function drawRect(x, y, width, height, color) {
    sanctuaryContext.fillStyle = color;
    sanctuaryContext.fillRect(
        Math.floor(x),
        Math.floor(y),
        Math.floor(width),
        Math.floor(height)
    );
}

function isPointInRect(pointX, pointY, rect) {
    return (
        pointX >= rect.x &&
        pointX <= rect.x + rect.w &&
        pointY >= rect.y &&
        pointY <= rect.y + rect.h
    );
}

function getLayoutZones(width, height) {
    const horizonY = Math.floor(height * 0.66);
    const treeX = Math.floor(width * 0.19);
    const treeY = horizonY - 148;

    const pondX = Math.floor(width * 0.28);
    const pondY = horizonY + 26;
    const pondW = Math.min(340, Math.floor(width * 0.36));
    const pondH = 68;

    const consoleX = Math.floor(width * 0.50);
    const consoleY = horizonY - 38;

    const dungeonX = Math.floor(width * 0.76);
    const dungeonY = horizonY - 140;

    const moonX = Math.floor(width * 0.84);
    const moonY = Math.max(58, Math.floor(height * 0.11));

    const heroX = Math.floor(width * 0.36);
    const heroY = horizonY - 36 + sanctuaryState.heroOffsetY;

    return {
        horizonY,
        tree: { x: treeX - 88, y: treeY - 36, w: 176, h: 196, centerX: treeX, baseY: horizonY },
        pond: { x: pondX, y: pondY, w: pondW, h: pondH },
        console: { x: consoleX - 32, y: consoleY - 16, w: 68, h: 58, baseX: consoleX, baseY: consoleY },
        dungeon: { x: dungeonX - 74, y: dungeonY - 10, w: 148, h: 156, centerX: dungeonX, baseY: horizonY },
        moon: { x: moonX - 28, y: moonY - 28, w: 64, h: 64, centerX: moonX, centerY: moonY },
        hero: { x: heroX - 6, y: heroY - 6, w: 48, h: 48, spriteX: heroX, spriteY: heroY }
    };
}

function initAmbientFireflies(width, height) {
    ambientFireflies = [];
    for (let index = 0; index < 36; index++) {
        ambientFireflies.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.85),
            vx: (Math.random() - 0.5) * 0.35,
            vy: -0.15 - Math.random() * 0.25,
            size: Math.random() > 0.6 ? 4 : 3,
            phase: Math.random() * Math.PI * 2,
            color: index % 3 === 0 ? '#00FF41' : (index % 2 === 0 ? '#D4957A' : '#B92B92')
        });
    }
}

export function resizeSanctuary() {
    if (!sanctuaryCanvas) return;
    sanctuaryCanvas.width = window.innerWidth;
    sanctuaryCanvas.height = window.innerHeight;
    initAmbientFireflies(sanctuaryCanvas.width, sanctuaryCanvas.height);
}

function spawnTreeLeavesAndSpores(treeZone) {
    const leafColors = ['#2E5A44', '#3E7A5C', '#B92B92', '#D4957A', '#00FF41'];
    for (let index = 0; index < 28; index++) {
        particles.push({
            x: treeZone.centerX + (Math.random() * 140 - 70),
            y: treeZone.y + 30 + Math.random() * 70,
            vx: (Math.random() - 0.35) * 1.6,
            vy: 0.7 + Math.random() * 1.8,
            swayPhase: Math.random() * Math.PI * 2,
            isLeaf: true,
            size: Math.random() > 0.4 ? 5 : 4,
            life: 1.3,
            color: leafColors[Math.floor(Math.random() * leafColors.length)]
        });
    }
}

function spawnPondRipple(originX, originY, pondZone) {
    const clampedX = Math.max(pondZone.x + 24, Math.min(pondZone.x + pondZone.w - 24, originX));
    const clampedY = Math.max(pondZone.y + 14, Math.min(pondZone.y + pondZone.h - 14, originY));
    pondRipples.push({
        x: clampedX,
        y: clampedY,
        radiusX: 6,
        radiusY: 3,
        life: 1.0
    });

    // Water droplet splash pixels
    const dropletColors = ['#7AD7F0', '#D8E2EB', '#2C5E7A'];
    for (let index = 0; index < 10; index++) {
        const angle = -Math.PI * Math.random();
        const speed = 1.0 + Math.random() * 2.2;
        particles.push({
            x: clampedX,
            y: clampedY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8,
            isLeaf: false,
            size: 3,
            life: 0.75,
            color: dropletColors[index % dropletColors.length]
        });
    }
}

function spawnDungeonRuneSparks(dungeonZone) {
    const runeColors = ['#B92B92', '#7A1F73', '#D4957A', '#D8E2EB'];
    for (let index = 0; index < 32; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.5;
        particles.push({
            x: dungeonZone.centerX + (Math.random() * 60 - 30),
            y: dungeonZone.baseY - 65 + (Math.random() * 50 - 25),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.6,
            isLeaf: false,
            size: Math.random() > 0.5 ? 5 : 4,
            life: 1.0,
            color: runeColors[Math.floor(Math.random() * runeColors.length)]
        });
    }
}

function detectHoveredZone(pointX, pointY, zones) {
    if (isPointInRect(pointX, pointY, zones.console)) return 'console';
    if (isPointInRect(pointX, pointY, zones.dungeon)) return 'dungeon';
    if (isPointInRect(pointX, pointY, zones.tree)) return 'tree';
    if (isPointInRect(pointX, pointY, zones.pond)) return 'pond';
    if (isPointInRect(pointX, pointY, zones.hero)) return 'hero';
    if (isPointInRect(pointX, pointY, zones.moon)) return 'moon';
    return null;
}

function handleSanctuaryClick(clickX, clickY) {
    const zones = getLayoutZones(sanctuaryCanvas.width, sanctuaryCanvas.height);
    const hitZone = detectHoveredZone(clickX, clickY, zones);

    if (hitZone === 'console') {
        playSound('terminal');
        if (typeof openTerminalCallback === 'function') {
            openTerminalCallback();
        }
        return;
    }

    if (hitZone === 'tree') {
        sanctuaryState.treeRustleTimer = 28;
        playSound('tree');
        spawnTreeLeavesAndSpores(zones.tree);
        return;
    }

    if (hitZone === 'pond') {
        playSound('water');
        spawnPondRipple(clickX, clickY, zones.pond);
        return;
    }

    if (hitZone === 'dungeon') {
        sanctuaryState.dungeonShakeTimer = 24;
        sanctuaryState.dungeonMessageTimer = 150;
        playSound('seal');
        spawnDungeonRuneSparks(zones.dungeon);
        return;
    }

    if (hitZone === 'hero') {
        if (!sanctuaryState.heroJumping) {
            sanctuaryState.heroVelocityY = -7.8;
            sanctuaryState.heroJumping = true;
            playSound('jump');
        }
        return;
    }

    if (hitZone === 'moon') {
        sanctuaryState.moonPhase = (sanctuaryState.moonPhase + 1) % 4;
        playSound('coin');
        return;
    }
}

export function initSanctuary(onOpenTerminal) {
    openTerminalCallback = onOpenTerminal;
    sanctuaryCanvas = document.getElementById('sanctuaryCanvas');
    if (!sanctuaryCanvas) return;
    sanctuaryContext = sanctuaryCanvas.getContext('2d');

    resizeSanctuary();

    sanctuaryCanvas.addEventListener('mousemove', (event) => {
        const rect = sanctuaryCanvas.getBoundingClientRect();
        pointerState.x = event.clientX - rect.left;
        pointerState.y = event.clientY - rect.top;
        const zones = getLayoutZones(sanctuaryCanvas.width, sanctuaryCanvas.height);
        pointerState.hoveredZone = detectHoveredZone(pointerState.x, pointerState.y, zones);
        sanctuaryCanvas.style.cursor = pointerState.hoveredZone ? 'pointer' : 'default';
    });

    sanctuaryCanvas.addEventListener('click', (event) => {
        const rect = sanctuaryCanvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        handleSanctuaryClick(clickX, clickY);
    });
}

function updateSanctuaryState(zones) {
    if (sanctuaryState.treeRustleTimer > 0) sanctuaryState.treeRustleTimer--;
    if (sanctuaryState.dungeonShakeTimer > 0) sanctuaryState.dungeonShakeTimer--;
    if (sanctuaryState.dungeonMessageTimer > 0) sanctuaryState.dungeonMessageTimer--;

    if (sanctuaryState.heroJumping) {
        sanctuaryState.heroOffsetY += sanctuaryState.heroVelocityY;
        sanctuaryState.heroVelocityY += 0.45;
        if (sanctuaryState.heroOffsetY >= 0) {
            sanctuaryState.heroOffsetY = 0;
            sanctuaryState.heroVelocityY = 0;
            sanctuaryState.heroJumping = false;
        }
    }

    // Occasional gentle ambient ripple in the lagoon
    if (sanctuaryTick % 140 === 0) {
        const randomX = zones.pond.x + 36 + Math.random() * (zones.pond.w - 72);
        const randomY = zones.pond.y + 16 + Math.random() * (zones.pond.h - 32);
        pondRipples.push({
            x: randomX,
            y: randomY,
            radiusX: 4,
            radiusY: 2,
            life: 0.75
        });
    }
}

function drawNightSkyAndMoon(width, height, moonZone) {
    const skyGradient = sanctuaryContext.createLinearGradient(0, 0, 0, height * 0.7);
    skyGradient.addColorStop(0, '#07080C');
    skyGradient.addColorStop(0.6, '#120E18');
    skyGradient.addColorStop(1, '#1E1622');
    sanctuaryContext.fillStyle = skyGradient;
    sanctuaryContext.fillRect(0, 0, width, height);

    // Distant mountain silhouettes
    drawRect(0, height * 0.56, width * 0.45, height * 0.14, '#0D0C12');
    drawRect(width * 0.35, height * 0.53, width * 0.40, height * 0.17, '#100E16');
    drawRect(width * 0.65, height * 0.50, width * 0.35, height * 0.20, '#0B0A10');

    // Mystic Moon with interactive phases
    const mx = moonZone.centerX;
    const my = moonZone.centerY;
    drawRect(mx - 30, my - 30, 60, 60, 'rgba(185, 43, 146, 0.16)');
    drawRect(mx - 22, my - 22, 44, 44, '#7A1F73');
    drawRect(mx - 16, my - 16, 32, 32, '#B92B92');
    drawRect(mx - 10, my - 10, 20, 20, '#D4957A');

    if (sanctuaryState.moonPhase === 1) {
        drawRect(mx - 2, my - 20, 22, 40, '#09090E');
    } else if (sanctuaryState.moonPhase === 2) {
        drawRect(mx - 16, my - 16, 32, 32, '#09090E');
        drawRect(mx - 4, my - 4, 8, 8, '#B92B92');
    } else if (sanctuaryState.moonPhase === 3) {
        drawRect(mx - 20, my - 20, 22, 40, '#09090E');
    }
}

function drawSanctuaryMeadowAndLagoon(width, height, zones) {
    const { horizonY, pond } = zones;

    // Terraced pixel-art meadow grass & dark earth
    drawRect(0, horizonY, width, height - horizonY, '#14241D');
    drawRect(0, horizonY, width, 6, '#1E3A2F');
    drawRect(0, horizonY + 6, width, 4, '#2E5A44');
    drawRect(0, horizonY + 96, width, height - (horizonY + 96), '#0D1713');

    // Lagoon basin with stepped pixel banks
    drawRect(pond.x - 8, pond.y - 4, pond.w + 16, pond.h + 8, '#0D1713');
    drawRect(pond.x - 4, pond.y - 2, pond.w + 8, pond.h + 4, '#1A3347');
    drawRect(pond.x, pond.y, pond.w, pond.h, '#0E2233');
    drawRect(pond.x + 12, pond.y + 8, pond.w - 24, pond.h - 16, '#132D42');

    // Shimmering water reflections
    const shimmerOffset = Math.floor(Math.sin(sanctuaryTick * 0.05) * 6);
    drawRect(pond.x + 36 + shimmerOffset, pond.y + 16, 44, 3, '#2C5E7A');
    drawRect(pond.x + pond.w - 110 - shimmerOffset, pond.y + 42, 52, 3, '#2C5E7A');

    // Pixel Lilypads & Lotus Blossoms
    const lilypads = [
        { x: pond.x + 42, y: pond.y + 24, hasFlower: true },
        { x: pond.x + Math.floor(pond.w * 0.52), y: pond.y + 40, hasFlower: false },
        { x: pond.x + pond.w - 68, y: pond.y + 22, hasFlower: true }
    ];

    lilypads.forEach((pad, idx) => {
        const bobX = Math.floor(Math.sin(sanctuaryTick * 0.04 + idx) * 2);
        drawRect(pad.x + bobX, pad.y, 20, 10, '#1E3A2F');
        drawRect(pad.x + 2 + bobX, pad.y + 2, 16, 6, '#2E5A44');
        if (pad.hasFlower) {
            drawRect(pad.x + 6 + bobX, pad.y - 4, 8, 6, '#B92B92');
            drawRect(pad.x + 8 + bobX, pad.y - 6, 4, 4, '#D4957A');
        }
    });

    // Draw expanding pixelated water ripples
    for (let index = pondRipples.length - 1; index >= 0; index--) {
        const ripple = pondRipples[index];
        ripple.radiusX += 0.65;
        ripple.radiusY += 0.32;
        ripple.life -= 0.022;

        if (ripple.life <= 0) {
            pondRipples.splice(index, 1);
        } else {
            sanctuaryContext.strokeStyle = `rgba(216, 226, 235, ${ripple.life * 0.7})`;
            sanctuaryContext.lineWidth = 2;
            sanctuaryContext.strokeRect(
                snapToPixel(ripple.x - ripple.radiusX),
                snapToPixel(ripple.y - ripple.radiusY),
                snapToPixel(ripple.radiusX * 2),
                snapToPixel(ripple.radiusY * 2)
            );
        }
    }
}

function drawAncientTree(treeZone, isHovered) {
    const rustleShake = sanctuaryState.treeRustleTimer > 0
        ? Math.floor(Math.sin(sanctuaryTick * 1.4) * 4)
        : 0;
    const gentleSway = Math.floor(Math.sin(sanctuaryTick * 0.03) * 3) + rustleShake;
    const cx = treeZone.centerX;
    const baseY = treeZone.baseY;

    // Roots & Gnarled Trunk (#231C1A & #4A3024)
    drawRect(cx - 32, baseY - 14, 64, 16, '#231C1A');
    drawRect(cx - 20, baseY - 96, 40, 84, '#231C1A');
    drawRect(cx - 14, baseY - 92, 24, 78, '#3D271E');
    drawRect(cx - 6, baseY - 86, 8, 68, '#5C3A2B');

    // Glowing rune hollow in trunk
    drawRect(cx - 4, baseY - 52, 8, 14, '#B92B92');
    drawRect(cx - 2, baseY - 48, 4, 8, '#D4957A');

    // Layered Pixel Canopy
    drawRect(cx - 84 + gentleSway, baseY - 154, 168, 64, '#13261E');
    drawRect(cx - 72 + gentleSway, baseY - 178, 144, 72, '#1E3A2F');
    drawRect(cx - 54 + gentleSway, baseY - 196, 108, 64, '#2E5A44');
    drawRect(cx - 34 + gentleSway, baseY - 206, 68, 36, '#3E7A5C');

    // Glowing Blossom Spores in Canopy
    const sporeOffsets = [
        [-52, -138], [-24, -168], [18, -176], [48, -142], [-10, -130], [30, -152]
    ];
    sporeOffsets.forEach(([ox, oy], idx) => {
        const color = idx % 2 === 0 ? '#B92B92' : '#D4957A';
        drawRect(cx + ox + gentleSway, baseY + oy, 6, 6, color);
    });

    if (isHovered) {
        const label = TRANSLATIONS[getCurrentLanguage()].sanctuary.treeHover;
        drawFloatingPixelLabel(cx, baseY - 220, label, '#D4957A');
    }
}

function drawSealedDungeonPortal(dungeonZone, isHovered) {
    const shakeX = sanctuaryState.dungeonShakeTimer > 0
        ? Math.floor((Math.random() - 0.5) * 8)
        : 0;
    const shakeY = sanctuaryState.dungeonShakeTimer > 0
        ? Math.floor((Math.random() - 0.5) * 6)
        : 0;

    const cx = dungeonZone.centerX + shakeX;
    const baseY = dungeonZone.baseY + shakeY;

    // Stone & Forged Steel Outer Monolith (#56616E, #2B3138, #0D0D0F)
    drawRect(cx - 68, baseY - 132, 136, 134, '#0D0D0F');
    drawRect(cx - 64, baseY - 128, 128, 128, '#2B3138');
    drawRect(cx - 56, baseY - 120, 112, 120, '#56616E');
    drawRect(cx - 48, baseY - 112, 96, 112, '#231C1A');

    // Sealed Dark Inner Gate
    drawRect(cx - 36, baseY - 92, 72, 92, '#0D0D0F');

    // Forged Steel Bars & Mystic Chains
    for (let barX = -24; barX <= 24; barX += 16) {
        drawRect(cx + barX - 2, baseY - 90, 4, 90, '#56616E');
    }

    // Glowing Magenta Magic Runes (#B92B92 & #D4957A)
    const runePulse = 0.65 + 0.35 * Math.sin(sanctuaryTick * 0.08);
    sanctuaryContext.globalAlpha = runePulse;
    drawRect(cx - 52, baseY - 84, 6, 14, '#B92B92');
    drawRect(cx - 52, baseY - 52, 6, 14, '#B92B92');
    drawRect(cx + 46, baseY - 84, 6, 14, '#B92B92');
    drawRect(cx + 46, baseY - 52, 6, 14, '#B92B92');
    // Central Magic Seal Emblem
    drawRect(cx - 14, baseY - 58, 28, 28, '#7A1F73');
    drawRect(cx - 10, baseY - 54, 20, 20, '#B92B92');
    drawRect(cx - 4, baseY - 48, 8, 8, '#D4957A');
    sanctuaryContext.globalAlpha = 1.0;

    // Carved Signboard at top of portal ("COMING SOON")
    drawRect(cx - 62, baseY - 144, 124, 24, '#0D0D0F');
    drawRect(cx - 60, baseY - 142, 120, 20, '#231C1A');
    sanctuaryContext.strokeStyle = '#56616E';
    sanctuaryContext.lineWidth = 2;
    sanctuaryContext.strokeRect(cx - 60, baseY - 142, 120, 20);

    const signText = TRANSLATIONS[getCurrentLanguage()].sanctuary.dungeonSign;
    sanctuaryContext.font = '9px "Press Start 2P", monospace';
    sanctuaryContext.fillStyle = '#D4957A';
    sanctuaryContext.textAlign = 'center';
    sanctuaryContext.fillText(signText, cx, baseY - 128);

    // Floating RPG message when clicked
    if (sanctuaryState.dungeonMessageTimer > 0) {
        const sealMsg = TRANSLATIONS[getCurrentLanguage()].sanctuary.dungeonSealMsg;
        drawFloatingPixelLabel(cx, baseY - 164, `🔒 ${sealMsg}`, '#B92B92');
    } else if (isHovered) {
        const hoverLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary.dungeonHover;
        drawFloatingPixelLabel(cx, baseY - 160, hoverLabel, '#D8E2EB');
    }
}

function drawDrukSystemRelicConsole(consoleZone, isHovered) {
    const cx = consoleZone.baseX;
    const cy = consoleZone.baseY;

    // Mossy stone pedestal & power cables on the grass
    drawRect(cx - 28, cy + 28, 56, 12, '#2B3138');
    drawRect(cx - 24, cy + 24, 48, 6, '#56616E');
    drawRect(cx - 38, cy + 34, 16, 4, '#1E3A2F');

    // Forged Steel CRT Casing (#56616E & #231C1A)
    drawRect(cx - 22, cy - 8, 44, 34, '#0D0D0F');
    drawRect(cx - 20, cy - 6, 40, 30, '#56616E');
    drawRect(cx - 17, cy - 3, 34, 24, '#231C1A');

    // Blinking Matrix Green CRT Screen (#030803 & #00FF41)
    drawRect(cx - 14, cy, 28, 18, '#030803');

    const screenBlink = Math.floor(sanctuaryTick / 18) % 2 === 0;
    drawRect(cx - 11, cy + 3, 14, 2, '#00FF41');
    drawRect(cx - 11, cy + 7, 20, 2, '#008F11');
    drawRect(cx - 11, cy + 11, 10, 2, '#00FF41');
    if (screenBlink) {
        drawRect(cx + 1, cy + 11, 4, 3, '#00FF41');
    }

    // Matrix green ambient ground glow
    sanctuaryContext.fillStyle = isHovered
        ? 'rgba(0, 255, 65, 0.28)'
        : 'rgba(0, 255, 65, 0.12)';
    sanctuaryContext.fillRect(cx - 28, cy - 14, 56, 52);

    // Always-visible subtle beacon or full prompt on hover
    const promptText = TRANSLATIONS[getCurrentLanguage()].sanctuary.consoleHover;
    const floatOffset = Math.floor(Math.sin(sanctuaryTick * 0.08) * 3);
    if (isHovered) {
        drawFloatingPixelLabel(cx, cy - 24 + floatOffset, promptText, '#00FF41');
    } else {
        drawFloatingPixelLabel(cx, cy - 22 + floatOffset, '▼ DRUKSYSTEM OS', '#00FF41');
    }
}

function drawFloatingPixelLabel(centerX, topY, text, borderColor) {
    sanctuaryContext.font = '11px "IBM Plex Mono", monospace';
    const textWidth = sanctuaryContext.measureText(text).width;
    const boxWidth = Math.ceil(textWidth + 18);
    const boxHeight = 22;
    const boxX = Math.floor(centerX - boxWidth / 2);
    const boxY = Math.floor(topY - boxHeight / 2);

    drawRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4, '#0D0D0F');
    drawRect(boxX, boxY, boxWidth, boxHeight, '#141116');
    sanctuaryContext.strokeStyle = borderColor;
    sanctuaryContext.lineWidth = 2;
    sanctuaryContext.strokeRect(boxX, boxY, boxWidth, boxHeight);

    sanctuaryContext.fillStyle = borderColor;
    sanctuaryContext.textAlign = 'center';
    sanctuaryContext.fillText(text, centerX, boxY + 15);
}

function updateAndDrawParticles(width, height) {
    // Ambient fireflies
    for (let index = 0; index < ambientFireflies.length; index++) {
        const fly = ambientFireflies[index];
        fly.x += fly.vx + Math.sin(sanctuaryTick * 0.02 + fly.phase) * 0.2;
        fly.y += fly.vy;

        if (fly.y < 0) fly.y = height * 0.85;
        if (fly.x < 0) fly.x = width;
        if (fly.x > width) fly.x = 0;

        const alpha = 0.25 + 0.55 * Math.abs(Math.sin(sanctuaryTick * 0.04 + fly.phase));
        sanctuaryContext.globalAlpha = alpha;
        drawRect(fly.x, fly.y, fly.size, fly.size, fly.color);
    }
    sanctuaryContext.globalAlpha = 1.0;

    // Interactive particles (leaves, spores, droplets, rune sparks)
    for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index];
        if (particle.isLeaf) {
            particle.x += particle.vx + Math.sin(sanctuaryTick * 0.08 + particle.swayPhase) * 0.7;
            particle.y += particle.vy;
            particle.life -= 0.012;
        } else {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.025;
        }

        if (particle.life <= 0) {
            particles.splice(index, 1);
        } else {
            sanctuaryContext.globalAlpha = Math.min(1, particle.life);
            drawRect(particle.x, particle.y, particle.size, particle.size, particle.color);
            sanctuaryContext.globalAlpha = 1.0;
        }
    }
}

export function updateAndDrawSanctuary() {
    if (!sanctuaryCanvas || !sanctuaryContext) return;

    sanctuaryTick++;
    const width = sanctuaryCanvas.width;
    const height = sanctuaryCanvas.height;
    const zones = getLayoutZones(width, height);

    updateSanctuaryState(zones);

    drawNightSkyAndMoon(width, height, zones.moon);
    drawSanctuaryMeadowAndLagoon(width, height, zones);
    drawAncientTree(zones.tree, pointerState.hoveredZone === 'tree');
    drawSealedDungeonPortal(zones.dungeon, pointerState.hoveredZone === 'dungeon');
    drawDrukSystemRelicConsole(zones.console, pointerState.hoveredZone === 'console');

    // Pond hover indicator
    if (pointerState.hoveredZone === 'pond') {
        const pondLabel = TRANSLATIONS[getCurrentLanguage()].sanctuary.pondHover;
        drawFloatingPixelLabel(
            zones.pond.x + zones.pond.w / 2,
            zones.pond.y - 14,
            pondLabel,
            '#7AD7F0'
        );
    }

    // Draw Druk Dragon Hero guardian resting/jumping near the Ancient Tree & Lagoon
    const idleBob = sanctuaryState.heroJumping ? 0 : (Math.sin(sanctuaryTick * 0.08) > 0 ? -3 : 0);
    drawPixelSprite(
        sanctuaryContext,
        SPRITES.fantasyKnight,
        zones.hero.spriteX,
        zones.hero.spriteY + idleBob,
        3,
        THEME_PALETTES.fantasy.spriteColors
    );

    updateAndDrawParticles(width, height);
}
