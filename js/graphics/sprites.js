/**************************************************************
 * PIXEL ART SPRITE MATRICES & CANVAS DRAWING HELPERS
 **************************************************************/

import { THEME_PALETTES, getCurrentTheme } from '../config/themes.js';

// Pixel Art Sprite Matrices (8x8 or 12x12 grids encoded as strings)
// Legend (Dark Fantasy / Dragon Palette):
// '.' = transparent
// '1' = Escamas luz (#B92B92) / Cyber Slate
// '2' = Escamas base (#7A1F73) / Neon Magenta
// '3' = Pecho bronce (#D4957A) / Cyber Cyan
// '4' = Carbón oscuro (#231C1A) / Dark Outline
export const SPRITES = {
    fantasyKnight: [
        '..3.2222.3..',
        '.3211111123.',
        '..21444412..',
        '..14333341..',
        '.2114334112.',
        '22.133331.22',
        '2..133331..2',
        '.2113333112.',
        '..21333312..',
        '...12..21...',
        '...22..22...',
        '..44....44..'
    ],
    cyberRunner: [
        '....3333....',
        '...111111...',
        '..11333311..',
        '..13222231..',
        '..11111111..',
        '...221122...',
        '..21133112..',
        '.3.111111.3.',
        '...112211...',
        '...11..11...',
        '..31....13..',
        '..33....33..'
    ],
    fantasyBug: [
        '....3..3....',
        '...344443...',
        '..41111114..',
        '.4133113314.',
        '.4111111114.',
        '..41211214..',
        '...44..44...',
        '..4..44..4..'
    ],
    cyberBug: [
        '..3......3..',
        '...311113...',
        '..11444411..',
        '.1432442341.',
        '.1111111111.',
        '..2.1221.2..',
        '.2..1..1..2.',
        '2..2....2..2'
    ],
    commitGem: [
        '....33....',
        '...3223...',
        '..321123..',
        '.32133123.',
        '.32133123.',
        '..321123..',
        '...3223...',
        '....33....'
    ]
};

export function drawPixelSprite(context, matrix, offsetX, offsetY, pixelScale, colorMap) {
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
        const rowString = matrix[rowIndex];
        for (let colIndex = 0; colIndex < rowString.length; colIndex++) {
            const colorKey = rowString[colIndex];
            if (colorKey !== '.' && colorMap[colorKey]) {
                context.fillStyle = colorMap[colorKey];
                context.fillRect(
                    Math.floor(offsetX + colIndex * pixelScale),
                    Math.floor(offsetY + rowIndex * pixelScale),
                    Math.ceil(pixelScale),
                    Math.ceil(pixelScale)
                );
            }
        }
    }
}

function renderSpriteOnCanvas(canvasId, spriteMatrix, offsetX, offsetY, pixelScale, colorMap) {
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    const canvasContext = canvasElement.getContext('2d');
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    drawPixelSprite(canvasContext, spriteMatrix, offsetX, offsetY, pixelScale, colorMap);
}

export function renderStaticPreviews(theme = getCurrentTheme()) {
    const palette = THEME_PALETTES[theme];
    const heroSprite = theme === 'fantasy' ? SPRITES.fantasyKnight : SPRITES.cyberRunner;

    renderSpriteOnCanvas('logoSpriteCanvas', heroSprite, 4, 4, 3, palette.spriteColors);
    renderSpriteOnCanvas('heroPreviewCanvas', heroSprite, 8, 4, 4, palette.spriteColors);
}
