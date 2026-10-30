/**************************************************************
 * THEME PALETTES & GLOBAL STORAGE CONSTANTS
 **************************************************************/

export const DEFAULT_THEME = 'fantasy';
export const HISCORE_STORAGE_KEY = 'drukdev_hiscore';

let currentTheme = DEFAULT_THEME;

export function getCurrentTheme() {
    return currentTheme;
}

export function setCurrentTheme(theme) {
    if (THEME_PALETTES[theme]) {
        currentTheme = theme;
    }
    return currentTheme;
}

export const THEME_PALETTES = {
    fantasy: {
        bgSkyTop: '#0D0D0F',
        bgSkyBottom: '#231C1A',
        groundColor: '#231C1A',
        groundLine: '#B92B92',
        steelBorder: '#56616E',
        steelHighlight: '#D8E2EB',
        warmBronze: '#D4957A',
        warmShadow: '#8A4E3B',
        particleColors: ['#B92B92', '#7A1F73', '#D4957A', '#D8E2EB'],
        slashColor: '#B92B92'
    },
    cyber: {
        bgSkyTop: '#03030c',
        bgSkyBottom: '#0f1035',
        groundColor: '#0b0c24',
        groundLine: '#00f5d4',
        steelBorder: '#1d2b64',
        steelHighlight: '#e2f1ff',
        warmBronze: '#00f5d4',
        warmShadow: '#121738',
        particleColors: ['#00f5d4', '#ff007f', '#a855f7', '#38bdf8'],
        slashColor: '#00f5d4'
    }
};
