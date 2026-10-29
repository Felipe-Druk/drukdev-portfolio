/**************************************************************
 * PIXEL ART SPRITE MATRICES & CANVAS DRAWING HELPERS
 **************************************************************/

import { THEME_PALETTES, getCurrentTheme } from '../config/themes.js';

// Pixel Art Sprite Matrices (8x8 or 12x12 grids encoded as strings)
// Legend:
// '.' = transparent
// '1' = Primary Armor / Suit
// '2' = Secondary Accent (Gold / Magenta)
// '3' = Glow / Visor / Eyes / Blade Energy
// '4' = Dark Outline / Shadow
export const SPRITES = {
    fantasyKnight: [
        "....2222....",
        "...111111...",
        "..11444411..",
        "..14333341..",
        "..11444411..",
        "...112211...",
        "..21111112..",
        ".2111221112.",
        ".2.111111.2.",
        "...11..11...",
        "...11..11...",
        "..44....44.."
    ],
    cyberRunner: [
        "....3333....",
        "...111111...",
        "..11333311..",
        "..13222231..",
        "..11111111..",
        "...221122...",
        "..21133112..",
        ".3.111111.3.",
        "...112211...",
        "...11..11...",
        "..31....13..",
        "..33....33.."
    ],
    fantasyBug: [
        "....3..3....",
        "...344443...",
        "..41111114..",
        ".4133113314.",
        ".4111111114.",
        "..41211214..",
        "...44..44...",
        "..4..44..4.."
    ],
    cyberBug: [
        "..3......3..",
        "...311113...",
        "..11444411..",
        ".1432442341.",
        ".1111111111.",
        "..2.1221.2..",
        ".2..1..1..2.",
        "2..2....2..2"
    ],
    commitGem: [
        "....33....",
        "...3223...",
        "..321123..",
        ".32133123.",
        ".32133123.",
        "..321123..",
        "...3223...",
        "....33...."
    ]
};

export function drawPixelSprite(ctx, matrix, x, y, scale, colorMap) {
    for (let r = 0; r < matrix.length; r++) {
        const row = matrix[r];
        for (let c = 0; c < row.length; c++) {
            const ch = row[c];
            if (ch !== '.' && colorMap[ch]) {
                ctx.fillStyle = colorMap[ch];
                ctx.fillRect(
                    Math.floor(x + c * scale),
                    Math.floor(y + r * scale),
                    Math.ceil(scale),
                    Math.ceil(scale)
                );
            }
        }
    }
}

export function renderStaticPreviews(theme = getCurrentTheme()) {
    const palette = THEME_PALETTES[theme];
    const sprite = theme === 'fantasy' ? SPRITES.fantasyKnight : SPRITES.cyberRunner;

    // Header small avatar
    const logoCanvas = document.getElementById('logoSpriteCanvas');
    if (logoCanvas) {
        const lctx = logoCanvas.getContext('2d');
        lctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
        drawPixelSprite(lctx, sprite, 4, 4, 3, palette.spriteColors);
    }

    // Game overlay hero preview
    const prevCanvas = document.getElementById('heroPreviewCanvas');
    if (prevCanvas) {
        const pctx = prevCanvas.getContext('2d');
        pctx.clearRect(0, 0, prevCanvas.width, prevCanvas.height);
        drawPixelSprite(pctx, sprite, 8, 4, 4, palette.spriteColors);
    }
}
