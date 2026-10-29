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
        bgSkyTop: '#0D0D0F',
        bgSkyBottom: '#231C1A',
        groundColor: '#231C1A',
        groundLine: '#B92B92',
        steelBorder: '#56616E',
        steelHighlight: '#D8E2EB',
        warmBronze: '#D4957A',
        warmShadow: '#8A4E3B',
        spriteColors: {
            '1': '#B92B92', // Escamas luz (Primary Dragon Scales)
            '2': '#7A1F73', // Escamas base (Secondary Dragon Scales)
            '3': '#D4957A', // Pecho bronce (Warm Bronze Accent)
            '4': '#231C1A'  // Marrón carbón oscuro (Shadow / Outline)
        },
        bugColors: {
            '1': '#7A1F73',
            '2': '#D4957A',
            '3': '#B92B92',
            '4': '#231C1A'
        },
        gemColors: {
            '1': '#D8E2EB',
            '2': '#D4957A',
            '3': '#B92B92'
        },
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
        btnFantasyClass: 'px-3 py-1.5 rounded text-xs font-pixel flex items-center gap-1.5 transition-all bg-[#B92B92] border border-[#D8E2EB] text-[#D8E2EB] shadow',
        btnCyberClass: 'px-3 py-1.5 rounded text-xs font-pixel flex items-center gap-1.5 transition-all text-gray-400 hover:text-white',
        brandSuffixClass: 'text-bronze',
        statusBadgeClass: 'text-[10px] font-pixel px-2 py-0.5 rounded bg-[#7A1F73]/40 border border-[#B92B92] text-[#D4957A] animate-pulse',
        themeSubtitle: 'Grimorio Digital & Código Artesanal',
        heroTitle: 'FORJANDO EL PORTAFOLIO DE DRUKDEV',
        progressTask: '🐉 FORJANDO SHADERS & PROYECTOS...',
        gameTitle: "DRUK'S BUG SLASHER",
        attackBtnLabel: 'ESPADAZO (K / CLICK)',
        featIcons: ['🐉', '👾', '🕹️']
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
