/**************************************************************
 * THEME PALETTES, UI TEXTS & GLOBAL CONSTANTS
 **************************************************************/

export const DEFAULT_THEME = 'fantasy';
export const CONTACT_EMAIL = 'contacto@druk.dev';
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
        bgSkyTop: '#08050b',
        bgSkyBottom: '#1c0d1f',
        groundColor: '#251329',
        groundLine: '#ff3b30',
        spriteColors: {
            '1': '#d8dee9', // Silver Steel
            '2': '#ffb703', // Royal Gold
            '3': '#ff3b30', // Crimson Ember
            '4': '#1a1423'  // Dark Obsidian
        },
        bugColors: {
            '1': '#7f1d1d',
            '2': '#ffb703',
            '3': '#ff3b30',
            '4': '#2b0909'
        },
        gemColors: {
            '1': '#ffffff',
            '2': '#ffb703',
            '3': '#fb8500'
        },
        particleColors: ['#ff3b30', '#ffb703', '#fb8500', '#fde047'],
        slashColor: '#ffb703'
    },
    cyber: {
        bgSkyTop: '#03030c',
        bgSkyBottom: '#0f1035',
        groundColor: '#0b0c24',
        groundLine: '#00f5d4',
        spriteColors: {
            '1': '#1e293b', // Cyber Slate
            '2': '#ff007f', // Neon Magenta
            '3': '#00f5d4', // Cyber Cyan
            '4': '#020617'
        },
        bugColors: {
            '1': '#3b0764',
            '2': '#00f5d4',
            '3': '#ff007f',
            '4': '#090d16'
        },
        gemColors: {
            '1': '#ffffff',
            '2': '#00f5d4',
            '3': '#ff007f'
        },
        particleColors: ['#00f5d4', '#ff007f', '#a855f7', '#38bdf8'],
        slashColor: '#00f5d4'
    }
};

export const THEME_UI = {
    fantasy: {
        isCyber: false,
        btnFantasyClass: 'px-3 py-1.5 rounded text-xs font-pixel flex items-center gap-1.5 transition-all bg-red-600 text-white shadow',
        btnCyberClass: 'px-3 py-1.5 rounded text-xs font-pixel flex items-center gap-1.5 transition-all text-gray-400 hover:text-white',
        brandSuffixClass: 'text-amber-400',
        statusBadgeClass: 'text-[10px] font-pixel px-2 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-red-300 animate-pulse',
        themeSubtitle: 'Grimorio Digital & Código Artesanal',
        heroTitle: 'FORJANDO EL PORTAFOLIO DE DRUKDEV',
        progressTask: '🔨 FORJANDO SHADERS & PROYECTOS...',
        gameTitle: "DRUK'S BUG SLASHER",
        attackBtnLabel: 'ESPADAZO (K / CLICK)',
        featIcons: ['🗡️', '👾', '🕹️']
    },
    cyber: {
        isCyber: true,
        btnFantasyClass: 'px-3 py-1.5 rounded text-xs font-pixel flex items-center gap-1.5 transition-all text-gray-400 hover:text-white',
        btnCyberClass: 'px-3 py-1.5 rounded text-xs font-pixel flex items-center gap-1.5 transition-all bg-cyan-500 text-black shadow font-bold',
        brandSuffixClass: 'text-cyan-400',
        statusBadgeClass: 'text-[10px] font-pixel px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 animate-pulse',
        themeSubtitle: 'Synthwave Grid & Arquitectura Full-Stack',
        heroTitle: 'INICIALIZANDO EL SISTEMA DRUK.DEV',
        progressTask: '⚡ CARGANDO NEON SHADERS & MINIJUEGOS...',
        gameTitle: 'CYBER BUG RUNNER 2099',
        attackBtnLabel: 'PULSO LÁSER (K / CLICK)',
        featIcons: ['🛰️', '🌆', '⚡']
    }
};
