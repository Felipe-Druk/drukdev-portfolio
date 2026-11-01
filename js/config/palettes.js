/**************************************************************
 * CENTRALIZED COLOR PALETTES & VISUAL TOKENS (SINGLE SOURCE OF TRUTH)
 **************************************************************/

export const DRUK_CORE_PALETTE = Object.freeze({
    abyss: '#0D0D0F',
    darkEarth: '#231C1A',
    obsidianLabelBg: '#141116',
    steelDark: '#2B3138',
    steelBase: '#56616E',
    steelMuted: '#9BA7B4',
    steelLight: '#D8E2EB',
    dragonLight: '#B92B92',
    dragonBase: '#7A1F73',
    bronzeWarm: '#D4957A',
    bronzeShadow: '#8A4E3B',
    ivoryGlow: '#F3D5B5',
    matrixGreen: '#00FF41',
    matrixDim: '#008F11',
    matrixBg: '#030803'
});

export const SANCTUARY_SCENE_PALETTE = Object.freeze({
    skyTop: '#07080C',
    skyMid: '#120E18',
    skyBottom: '#1E1622',
    mountainLeft: '#0D0C12',
    mountainCenter: '#100E16',
    mountainRight: '#0B0A10',
    moonHalo: 'rgba(185, 43, 146, 0.16)',
    moonShadow: '#09090E',
    waterBank: '#1A3347',
    waterDeep: '#0E2233',
    waterMid: '#132D42',
    waterHighlight: '#2C5E7A',
    waterFoam: '#7AD7F0',
    rippleStrokeRgb: '216, 226, 235',
    trunkDark: '#3D271E',
    trunkLight: '#5C3A2B',
    abyssSoilShadow: '#080D0A',
    constellationMutedLabel: '#8E8582',
    constellationHoverBg: 'rgba(13, 13, 15, 0.85)',
    crtAmbientGlowHover: 'rgba(0, 255, 65, 0.28)',
    crtAmbientGlowIdle: 'rgba(0, 255, 65, 0.12)'
});

export const BIOME_PALETTES = Object.freeze({
    emerald: Object.freeze({
        soilDark: '#0D1713',
        soilMid: '#14241D',
        base: '#1E3F2B',
        mid: '#38754A',
        tip: '#58A668',
        accent: '#D4957A'
    }),
    druk: Object.freeze({
        soilDark: '#120817',
        soilMid: '#1E0D24',
        base: '#3D1247',
        mid: '#7A1F73',
        tip: '#B92B92',
        accent: '#F3D5B5'
    }),
    autumn: Object.freeze({
        soilDark: '#170E0A',
        soilMid: '#241610',
        base: '#4A2B1D',
        mid: '#8A4E3B',
        tip: '#D4957A',
        accent: '#F3D5B5'
    }),
    matrix: Object.freeze({
        soilDark: '#020C02',
        soilMid: '#041804',
        base: '#003B00',
        mid: '#008F11',
        tip: '#00FF41',
        accent: '#D8E2EB'
    })
});

export const TERMINAL_PALETTES = Object.freeze({
    matrix: Object.freeze({
        bg: '#030803',
        fg: '#00FF41',
        dim: '#008F11',
        glow: 'rgba(0, 255, 65, 0.32)'
    }),
    amber: Object.freeze({
        bg: '#0A0602',
        fg: '#FFB000',
        dim: '#996900',
        glow: 'rgba(255, 176, 0, 0.32)'
    }),
    druk: Object.freeze({
        bg: '#0D070C',
        fg: '#D4957A',
        dim: '#B92B92',
        glow: 'rgba(185, 43, 146, 0.38)'
    }),
    cyan: Object.freeze({
        bg: '#02080A',
        fg: '#00F5D4',
        dim: '#008B76',
        glow: 'rgba(0, 245, 212, 0.32)'
    })
});

export const SPRITE_PALETTES = Object.freeze({
    dragon: Object.freeze({
        scaleLight: DRUK_CORE_PALETTE.dragonLight,
        scaleBase: DRUK_CORE_PALETTE.dragonBase,
        chestBronze: DRUK_CORE_PALETTE.bronzeWarm,
        hornGlow: DRUK_CORE_PALETTE.ivoryGlow,
        steelLight: DRUK_CORE_PALETTE.steelLight,
        shadowDark: DRUK_CORE_PALETTE.darkEarth,
        abyssOutline: DRUK_CORE_PALETTE.abyss
    }),
    emblems: Object.freeze({
        abyss: DRUK_CORE_PALETTE.abyss,
        darkEarth: DRUK_CORE_PALETTE.darkEarth,
        steelDark: DRUK_CORE_PALETTE.steelDark,
        steelBase: DRUK_CORE_PALETTE.steelBase,
        steelLight: DRUK_CORE_PALETTE.steelLight,
        dragonLight: DRUK_CORE_PALETTE.dragonLight,
        dragonBase: DRUK_CORE_PALETTE.dragonBase,
        bronzeWarm: DRUK_CORE_PALETTE.bronzeWarm,
        ivoryGlow: DRUK_CORE_PALETTE.ivoryGlow
    }),
    mage: Object.freeze({
        shadowOutline: DRUK_CORE_PALETTE.abyss,
        bootLeather: DRUK_CORE_PALETTE.darkEarth,
        handBronze: DRUK_CORE_PALETTE.bronzeWarm,
        faceShadow: DRUK_CORE_PALETTE.obsidianLabelBg,
        eyeGlow: DRUK_CORE_PALETTE.ivoryGlow,
        beardLight: DRUK_CORE_PALETTE.steelLight,
        beardTip: DRUK_CORE_PALETTE.steelMuted,
        staffWoodDark: SANCTUARY_SCENE_PALETTE.trunkDark,
        staffWoodLight: SANCTUARY_SCENE_PALETTE.trunkLight,
        staffCastHalo: 'rgba(243, 213, 181, 0.25)'
    }),
    slasher: Object.freeze({
        bgSkyTop: DRUK_CORE_PALETTE.abyss,
        bgSkyBottom: DRUK_CORE_PALETTE.darkEarth,
        groundColor: DRUK_CORE_PALETTE.darkEarth,
        groundLine: DRUK_CORE_PALETTE.dragonLight,
        gridLine: 'rgba(255, 255, 255, 0.04)',
        steelBorder: DRUK_CORE_PALETTE.steelBase,
        steelHighlight: DRUK_CORE_PALETTE.steelLight,
        warmBronze: DRUK_CORE_PALETTE.bronzeWarm,
        warmShadow: DRUK_CORE_PALETTE.bronzeShadow,
        slashColor: DRUK_CORE_PALETTE.dragonLight,
        jumpDust: DRUK_CORE_PALETTE.steelLight,
        carapaceDark: DRUK_CORE_PALETTE.darkEarth
    })
});

let activeBiomeKey = 'emerald';
let activeTerminalColorMode = 'matrix';

export function getActiveBiomeKey() {
    return activeBiomeKey;
}

export function setActiveBiomeKey(biomeKey) {
    if (BIOME_PALETTES[biomeKey]) {
        activeBiomeKey = biomeKey;
    }
    return activeBiomeKey;
}

export function getActiveBiomePalette() {
    return BIOME_PALETTES[activeBiomeKey] || BIOME_PALETTES.emerald;
}

export function getActiveTerminalColorMode() {
    return activeTerminalColorMode;
}

export function setActiveTerminalColorMode(mode) {
    if (TERMINAL_PALETTES[mode]) {
        activeTerminalColorMode = mode;
    }
    return activeTerminalColorMode;
}

export function getActiveTerminalPalette() {
    return TERMINAL_PALETTES[activeTerminalColorMode] || TERMINAL_PALETTES.matrix;
}
