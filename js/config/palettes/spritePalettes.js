/**************************************************************
 * SPRITE COLOR PALETTES (js/config/palettes/spritePalettes.js)
 **************************************************************/

import { DRUK_CORE_PALETTE } from './corePalette.js';
import { SANCTUARY_SCENE_PALETTE } from './sanctuaryPalettes.js';

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
    blueMage: Object.freeze({
        shadowOutline: DRUK_CORE_PALETTE.abyss,
        robeDark: '#1A3347',
        robeMid: '#2C5E7A',
        robeLight: '#7AD7F0',
        hatBand: DRUK_CORE_PALETTE.steelLight,
        bootLeather: '#1A3347',
        handBronze: DRUK_CORE_PALETTE.bronzeWarm,
        faceShadow: DRUK_CORE_PALETTE.obsidianLabelBg,
        eyeGlow: '#7AD7F0',
        beardLight: DRUK_CORE_PALETTE.steelLight,
        beardTip: DRUK_CORE_PALETTE.steelMuted,
        staffWoodDark: DRUK_CORE_PALETTE.steelDark,
        staffWoodLight: DRUK_CORE_PALETTE.steelMuted,
        staffCastHalo: 'rgba(122, 215, 240, 0.28)'
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
