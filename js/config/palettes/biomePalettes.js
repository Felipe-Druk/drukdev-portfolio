/**************************************************************
 * BIOME PALETTES & ACTIVE STATE (js/config/palettes/biomePalettes.js)
 **************************************************************/

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

let activeBiomeKey = 'emerald';

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
