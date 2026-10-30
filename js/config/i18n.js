/**************************************************************
 * LIGHTWEIGHT INTERNATIONALIZATION (i18n) CONFIGURATION
 **************************************************************/

export const LANG_STORAGE_KEY = 'druk_lang';
export const SUPPORTED_LANGUAGES = ['es', 'en'];

function detectInitialLanguage() {
    const savedLanguage = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
        return savedLanguage;
    }
    const browserLanguage = (navigator.language || 'es').toLowerCase();
    return browserLanguage.startsWith('es') ? 'es' : 'en';
}

let currentLanguage = detectInitialLanguage();

export function getCurrentLanguage() {
    return currentLanguage;
}

export function setCurrentLanguage(language) {
    if (SUPPORTED_LANGUAGES.includes(language)) {
        currentLanguage = language;
        localStorage.setItem(LANG_STORAGE_KEY, language);
    }
    return currentLanguage;
}

export const TRANSLATIONS = {
    es: {
        nav: {
            sfxOn: 'SFX ON',
            sfxMute: 'MUTE',
            soundTitle: 'Efectos de sonido 8-bit',
            crtTitle: 'Filtro Monitor Retro CRT',
            langTitle: 'Cambiar idioma (ES / EN)'
        },
        hero: {
            dioramaHint: '✨ Click en la escena para interactuar',
            dioramaTitle: 'Haz clic en el escenario para interactuar',
            comingSoonBadge: 'PRÓXIMAMENTE // COMING SOON',
            descriptionHtml: '¡Hola! Estoy construyendo un portafolio interactivo fuera de lo común: gráficos <strong class="text-bronze">pixel-art generados 100% por código</strong>, minijuegos integrados y mis mejores proyectos de desarrollo. Mientras termino de pulir los últimos niveles, puedes jugar una partida rápida o contactarme directamente.',
            stepDomain: '✔ Dominio & Hosting',
            stepEngine: '⚙ Motor Pixel-Art Procedural',
            stepCases: '⏳ Casos de Estudio & Demos',
            recruiterPrompt: '¿Eres reclutador, suscriptor o quieres colaborar? Conecta conmigo:',
            downloadCv: 'Descargar CV',
            copyEmailBtn: 'Copiar Email',
            copiedEmailBtn: '¡Copiado!'
        },
        features: {
            feat1Title: 'PROYECTOS REALES',
            feat1Desc: 'Arquitectura, código limpio y demos en vivo.',
            feat2Title: 'ARTE POR CÓDIGO',
            feat2Desc: 'Canvas 2D, partículas y diseño con personalidad.',
            feat3Title: 'GAMIFICACIÓN',
            feat3Desc: 'Explora mi experiencia como si fuera un RPG.'
        },
        game: {
            eyebrow: '🕹️ MINIJUEGO MIENTRAS ESPERAS',
            overlayTitle: '¡DEFIENDE EL REPOSITORIO!',
            overlayDescHtml: 'Salta los <span class="text-[#B92B92] font-bold">Bugs</span> o destrúyelos con tu ataque y recolecta <span class="text-bronze font-bold">Commits</span> para acelerar el deploy.',
            startBtn: 'INSERT COIN / JUGAR',
            retryBtn: 'REINTENTAR / PLAY AGAIN',
            jumpBtn: 'SALTAR (W / ESPACIO)',
            themeTipHtml: '💡 Cambia entre <b>Dark Fantasy</b> y <b>Cyber Neon</b> arriba para transformar al héroe.',
            gameOverTitle: (score) => `¡BUG EN PRODUCCIÓN! (SCORE: ${score})`,
            gameOverDescHtml: (hiScore) => `Tu récord actual es <b class="text-bronze">${hiScore} pts</b>. ¿Otra partida rápida mientras DrukDev termina el deploy?`
        },
        toast: {
            copiedTitle: '¡EMAIL COPIADO!',
            copiedMsg: (email) => `${email} listo para pegar.`
        },
        footer: {
            madeWith: '— Hecho desde cero con HTML5 Canvas & Pixel Art Procedural.',
            serverStatusLabel: 'Estado del servidor: ',
            serverStatusOnline: '● ONLINE (Esperando Deploy Final)'
        },
        themes: {
            fantasy: {
                themeSubtitle: 'Grimorio Digital & Código Artesanal',
                heroTitle: 'FORJANDO EL PORTAFOLIO DE DRUKDEV',
                progressTask: '🐉 FORJANDO SHADERS & PROYECTOS...',
                gameTitle: "DRUK'S BUG SLASHER",
                attackBtnLabel: 'ESPADAZO (K / CLICK)'
            },
            cyber: {
                themeSubtitle: 'Synthwave Grid & Arquitectura Full-Stack',
                heroTitle: 'INICIALIZANDO EL SISTEMA DRUK.DEV',
                progressTask: '⚡ CARGANDO NEON SHADERS & MINIJUEGOS...',
                gameTitle: 'CYBER BUG RUNNER 2099',
                attackBtnLabel: 'PULSO LÁSER (K / CLICK)'
            }
        }
    },
    en: {
        nav: {
            sfxOn: 'SFX ON',
            sfxMute: 'MUTE',
            soundTitle: '8-bit sound effects',
            crtTitle: 'Retro CRT Monitor Filter',
            langTitle: 'Switch language (ES / EN)'
        },
        hero: {
            dioramaHint: '✨ Click on the scene to interact',
            dioramaTitle: 'Click on the stage to interact',
            comingSoonBadge: 'COMING SOON // IN DEVELOPMENT',
            descriptionHtml: 'Hi! I am building an unconventional interactive portfolio: <strong class="text-bronze">100% code-generated pixel-art</strong> graphics, built-in mini-games, and my best development projects. While I finish polishing the final levels, you can play a quick match or reach out directly.',
            stepDomain: '✔ Domain & Hosting',
            stepEngine: '⚙ Procedural Pixel-Art Engine',
            stepCases: '⏳ Case Studies & Demos',
            recruiterPrompt: 'Recruiter, subscriber, or looking to collaborate? Connect with me:',
            downloadCv: 'Download CV',
            copyEmailBtn: 'Copy Email',
            copiedEmailBtn: 'Copied!'
        },
        features: {
            feat1Title: 'REAL PROJECTS',
            feat1Desc: 'Clean architecture, solid code, and live demos.',
            feat2Title: 'CODE-DRIVEN ART',
            feat2Desc: '2D Canvas, particles, and distinctive design.',
            feat3Title: 'GAMIFICATION',
            feat3Desc: 'Explore my experience like an RPG adventure.'
        },
        game: {
            eyebrow: '🕹️ MINI-GAME WHILE YOU WAIT',
            overlayTitle: 'DEFEND THE REPOSITORY!',
            overlayDescHtml: 'Jump over <span class="text-[#B92B92] font-bold">Bugs</span> or slash them with your attack and collect <span class="text-bronze font-bold">Commits</span> to speed up deployment.',
            startBtn: 'INSERT COIN / PLAY',
            retryBtn: 'RETRY / PLAY AGAIN',
            jumpBtn: 'JUMP (W / SPACE)',
            themeTipHtml: '💡 Switch between <b>Dark Fantasy</b> and <b>Cyber Neon</b> above to transform the hero.',
            gameOverTitle: (score) => `BUG IN PRODUCTION! (SCORE: ${score})`,
            gameOverDescHtml: (hiScore) => `Your current high score is <b class="text-bronze">${hiScore} pts</b>. Another quick round while DrukDev finishes the deploy?`
        },
        toast: {
            copiedTitle: 'EMAIL COPIED!',
            copiedMsg: (email) => `${email} ready to paste.`
        },
        footer: {
            madeWith: '— Built from scratch with HTML5 Canvas & Procedural Pixel Art.',
            serverStatusLabel: 'Server status: ',
            serverStatusOnline: '● ONLINE (Awaiting Final Deploy)'
        },
        themes: {
            fantasy: {
                themeSubtitle: 'Digital Grimoire & Handcrafted Code',
                heroTitle: 'FORGING THE DRUKDEV PORTFOLIO',
                progressTask: '🐉 FORGING SHADERS & PROJECTS...',
                gameTitle: "DRUK'S BUG SLASHER",
                attackBtnLabel: 'SWORD SLASH (K / CLICK)'
            },
            cyber: {
                themeSubtitle: 'Synthwave Grid & Full-Stack Architecture',
                heroTitle: 'INITIALIZING DRUK.DEV SYSTEM',
                progressTask: '⚡ LOADING NEON SHADERS & MINI-GAMES...',
                gameTitle: 'CYBER BUG RUNNER 2099',
                attackBtnLabel: 'LASER PULSE (K / CLICK)'
            }
        }
    }
};

export function getTranslationByKey(dotPath, language = currentLanguage) {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS.es;
    return dotPath
        .split('.')
        .reduce((currentNode, keySegment) => (
            currentNode && currentNode[keySegment] !== undefined ? currentNode[keySegment] : null
        ), dictionary);
}
