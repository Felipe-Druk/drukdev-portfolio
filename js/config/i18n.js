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
            langTitle: 'Cambiar idioma (ES / EN)',
            openTerminalBtn: 'DRUKSYSTEM OS',
            subtitle: 'Santuario Pixel-Art & Consola Interactiva'
        },
        sanctuary: {
            hint: '✨ Interactúa con el Santuario: Constelaciones, Árbol Antiguo, Laguna, Mago Verde, Portal Dungeon o Consola DrukSystem',
            treeHover: '[ÁRBOL ANTIGUO]',
            pondHover: '[LAGUNA DE NENÚFARES]',
            dungeonSign: 'DUNGEON // ENTER',
            dungeonHover: '[MAZMORRA // ENTRAR]',
            dungeonSealMsg: 'Abriendo los archivos de la Dungeon...',
            consoleHover: '[ABRIR DRUKSYSTEM OS]',
            mageHover: '[MAGO VERDE // FLORA]',
            blueMageHover: '[MAGO AZUL // CLIMA]',
            moonHover: '[LUNA // CAMBIAR A DÍA]',
            sunHover: '[SOL // CAMBIAR A NOCHE]',
            constellations: {
                github: {
                    label: '[GITHUB]',
                    hover: '[ABRIR GITHUB]'
                },
                youtube: {
                    label: '[YOUTUBE]',
                    hover: '[ABRIR YOUTUBE]'
                },
                linkedin: {
                    label: '[LINKEDIN]',
                    hover: '[ABRIR LINKEDIN]'
                },
                mail: {
                    label: '[MAIL / COPY]',
                    hover: '[COPIAR EMAIL]',
                    copied: '¡CORREO COPIADO!'
                },
                cv: {
                    label: '[CV / RESUME]',
                    hover: '[ABRIR CV PDF]'
                }
            }
        },
        flora: {
            panelTitle: '🌿 GRIMORIO BOTÁNICO',
            densityLabel: 'DISPERSIÓN',
            clumpingLabel: 'CÚMULO',
            lengthLabel: 'LARGO',
            biomeLabel: 'BIOMA',
            reseedBtn: '[RE-SEMBRAR / SEED]',
            biomes: {
                emerald: 'ESMERALDA',
                druk: 'DRUK',
                autumn: 'OTOÑO',
                matrix: 'MATRIX'
            }
        },
        cloud: {
            panelTitle: '☁️ GRIMORIO ATMOSFÉRICO',
            densityLabel: 'CANTIDAD',
            windLabel: 'VIENTO',
            scaleLabel: 'TAMAÑO',
            weatherLabel: 'CLIMA',
            reseedBtn: '[INVOCAR RÁFAGA / SEED]',
            weathers: {
                ethereal: 'ETÉREO',
                storm: 'TORMENTA',
                aurora: 'AURORA',
                crimson: 'CARMESÍ'
            }
        },
        terminal: {
            windowTitle: 'DRUKSYSTEM OS v2.4 // MONITOR DE FÓSFORO',
            inputPlaceholder: 'Escribe un comando (help, ls, dungeon, cv, contacto, play snake, play flappy, color, font)...',
            btnHelp: '[help]',
            btnLs: '[ls]',
            btnDungeon: '[dungeon]',
            btnCv: '[cv]',
            btnContact: '[contacto]',
            btnSnake: '[play snake]',
            btnFlappy: '[play flappy]',
            btnSlasher: '[play slasher]',
            btnColor: '[color]',
            btnFont: '[font]',
            btnClose: '[cerrar]',
            bootBanner: [
                '========================================================',
                ' DRUKSYSTEM OS v2.4 — CONSOLA ARCAICA DEL SANTUARIO',
                ' NÚCLEO: DRUK-KERNEL 8-BIT // ESTADO: ONLINE',
                '========================================================',
                'Escribe "help" o haz clic en los botones para navegar.'
            ],
            helpLines: [
                'COMANDOS DISPONIBLES EN DRUKSYSTEM OS:',
                '  help                       Muestra esta guía de comandos',
                '  ls                         Lista archivos y módulos del sistema',
                '  dungeon                    Abre la Dungeon Interactiva (Proyectos y CV RPG)',
                '  cv / resume                Abre el CV en PDF (ES/EN) y enlace de descarga',
                '  contacto / links           Muestra redes sociales y email directo',
                '  play                       Lista los minijuegos arcade instalados',
                '  play snake                 Clásico Snake en fósforo CRT',
                '  play flappy / play dragon  Flappy Dragon: Esquiva los pilares de la mazmorra',
                '  play slasher               Ejecuta DRUK\'S BUG SLASHER',
                '  color <matrix|amber|druk|cyan> Cambia el color del fósforo',
                '  font <ibm|vt323|gothic>    Cambia la tipografía del monitor',
                '  clear                      Limpia la pantalla de la terminal',
                '  exit                       Apaga el monitor y vuelve al Santuario'
            ],
            lsLines: [
                'DIRECTORIO: /santuario/drukdev/',
                '  drwxr-xr-x  dungeon_portafolio/    [Ejecuta "dungeon"]',
                '  -rw-r--r--  readme_arquitectura.md [ES6 Modules + Canvas 2D]',
                '  -r--r--r--  cv_felipe_druk.pdf     [Ejecuta "cv"]',
                '  -rwxr-xr-x  contacto.lnk           [Ejecuta "contacto"]',
                '  -rwxr-xr-x  games/snake.rom        [Ejecuta "play snake"]',
                '  -rwxr-xr-x  games/flappy_dragon.rom[Ejecuta "play flappy"]',
                '  -rwxr-xr-x  games/bug_slasher.rom  [Ejecuta "play slasher"]'
            ],
            contactTitle: '=== ENLACES DE CONTACTO & REDES OFICIALES ===',
            copyEmailAction: '[COPIAR EMAIL]',
            copiedEmailAction: '[¡COPIADO!]',
            dungeonOpening: '🗡️ Abriendo el Portal de la Dungeon Interactiva...',
            cvOpening: '📄 Abriendo CV en PDF (ES) en una nueva pestaña...',
            cvDownloadLabel: '• DESCARGA DIRECTA ->',
            cvDownloadAction: '[DESCARGAR CV PDF]',
            cvUnavailable: 'El archivo CV no está disponible para el idioma activo.',
            playListLines: [
                'CARTUCHOS ARCADE DISPONIBLES:',
                '  • play snake   -> Clásico Snake en fósforo CRT.',
                '  • play flappy  -> Flappy Dragon: Esquiva los pilares de la mazmorra.',
                '  • play slasher -> Druk\'s Bug Slasher (Runner 2D).'
            ],
            colorUpdated: (mode) => `Fósforo CRT actualizado a: ${mode.toUpperCase()} (Opciones: matrix, amber, druk, cyan)`,
            fontUpdated: (font) => `Tipografía CRT actualizada a: ${font.toUpperCase()} (Opciones: ibm, vt323, gothic)`,
            unknownCommand: (cmd) => `Comando no reconocido: "${cmd}". Escribe "help" para ver los comandos.`
        },
        snake: {
            title: 'DRUK SNAKE // MODO FÓSFORO',
            controlsHint: 'Controles: WASD / Flechas | [ESPACIO] Reiniciar | [ESC / Q] Salir al prompt',
            gameOver: '¡COLISIÓN DETECTADA! Presiona [ESPACIO] o [REINICIAR]',
            exitBtn: '[Q / ESC] VOLVER AL PROMPT',
            restartBtn: '[REINICIAR]'
        },
        flappy: {
            title: 'FLAPPY DRAGON // PILARES DE LA DUNGEON',
            controlsHint: '[ESPACIO / CLICK] Aletear • [ESC] Salir',
            gameOver: (score, hiScore) => `¡IMPACTO CONTRA PILAR! SCORE: ${score} (HI: ${hiScore}) — [ESPACIO / CLICK] Reiniciar`,
            exitBtn: '[SALIR / ESC]',
            restartBtn: '[REINICIAR]',
            flapBtn: '🐉 ALETEAR (ESPACIO / CLICK)'
        },
        hero: {
            copyEmailBtn: 'Copiar Email',
            copiedEmailBtn: '¡Copiado!'
        },
        game: {
            eyebrow: '🕹️ CARTUCHO ARCADE: BUG SLASHER',
            overlayTitle: '¡DEFIENDE EL REPOSITORIO!',
            overlayDescHtml: 'Salta los <span class="text-[#B92B92] font-bold">Bugs</span> o destrúyelos con tu ataque y recolecta <span class="text-bronze font-bold">Commits</span>.',
            startBtn: 'INSERT COIN / JUGAR',
            retryBtn: 'REINTENTAR / PLAY AGAIN',
            jumpBtn: 'SALTAR (W / ESPACIO)',
            gameOverTitle: (score) => `¡BUG EN PRODUCCIÓN! (SCORE: ${score})`,
            gameOverDescHtml: (hiScore) => `Tu récord actual es <b class="text-bronze">${hiScore} pts</b>. ¿Otra partida rápida?`
        },
        toast: {
            copiedTitle: '¡EMAIL COPIADO!',
            copiedMsg: (email) => `${email} listo para pegar.`
        },
        dungeon: {
            headerTitle: '⚔️ LA DUNGEON DE DRUKDEV // ARCHIVO DE CLASES Y RELIQUIAS',
            selectTitle: 'ELIGE TU CLASE DE INSPECCIÓN',
            selectSubtitle: 'Filtra mi experiencia, proyectos y formación según el perfil que buscas, o desbloquea el archivo completo.',
            selectHint: '🖱️ Haz clic en una carta o usa [◀ / ▶] + [ENTER] • [ESC] Salir al Santuario',
            enterClassBtn: '[INSPECCIONAR CLASE]',
            omniscientBtn: '[*] MODO OMNISCIENTE // VER TODO EL CV SIN FILTROS (RECRUITER MODE)',
            tabAll: '[*] TODAS / OMNISCIENTE',
            tabBackend: '[BACKEND]',
            tabAlgorithms: '[ALGORITHMS & DATA]',
            tabGamedev: '[GAME DEV]',
            tabFullstack: '[FULL-STACK]',
            backToClassesBtn: '[◀ CLASES]',
            downloadCvBtn: '[DESCARGAR CV PDF]',
            closeBtn: '[X / SALIR AL SANTUARIO]',
            omniscientBannerTitle: 'MODO OMNISCIENTE ACTIVO — ARCHIVO COMPLETO DEL CV',
            omniscientBannerDesc: 'Mostrando todas las tecnologías, proyectos, experiencia docente/laboral y certificaciones de Felipe Druk sin filtros.',
            sectionWeapons: '⚔️ ARMAS EQUIPADAS // STACK TÉCNICO',
            sectionRelics: '🏺 RELIQUIAS FORJADAS // PROYECTOS DESTACADOS',
            sectionChronicles: '📜 CRÓNICAS DEL GREMIO // EXPERIENCIA LABORAL Y DOCENTE',
            sectionSeals: '🔮 SELLOS ARCANOS // INGENIERÍA FIUBA & CERTIFICACIONES BOOT.DEV',
            fiubaCoursesLabel: 'Materias Clave Cursadas:',
            bootdevTitle: 'Boot.dev — Backend & Computer Science Path',
            repoLinkLabel: '[REPOSITORIO ↗]',
            certVerifyLabel: '[VERIFICAR ↗]',
            certVerifiedBadge: '[COMPLETADO]'
        },
        themes: {
            fantasy: {
                themeSubtitle: 'Santuario Pixel-Art & Consola Interactiva',
                heroTitle: 'SANTUARIO DE DRUKDEV',
                progressTask: '🐉 FORJANDO LA DUNGEON DEL PORTAFOLIO...',
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
            langTitle: 'Switch language (ES / EN)',
            openTerminalBtn: 'DRUKSYSTEM OS',
            subtitle: 'Pixel-Art Sanctuary & Interactive Console'
        },
        sanctuary: {
            hint: '✨ Interact with the Sanctuary: Constellations, Ancient Tree, Lagoon, Green Mage, Dungeon Gate, or DrukSystem Console',
            treeHover: '[ANCIENT TREE]',
            pondHover: '[LILYPAD LAGOON]',
            dungeonSign: 'DUNGEON // ENTER',
            dungeonHover: '[DUNGEON // ENTER]',
            dungeonSealMsg: 'Opening the Dungeon archives...',
            consoleHover: '[OPEN DRUKSYSTEM OS]',
            mageHover: '[GREEN MAGE // FLORA]',
            blueMageHover: '[BLUE MAGE // WEATHER]',
            moonHover: '[MOON // SWITCH TO DAY]',
            sunHover: '[SUN // SWITCH TO NIGHT]',
            constellations: {
                github: {
                    label: '[GITHUB]',
                    hover: '[OPEN GITHUB]'
                },
                youtube: {
                    label: '[YOUTUBE]',
                    hover: '[OPEN YOUTUBE]'
                },
                linkedin: {
                    label: '[LINKEDIN]',
                    hover: '[OPEN LINKEDIN]'
                },
                mail: {
                    label: '[MAIL / COPY]',
                    hover: '[COPY EMAIL]',
                    copied: 'EMAIL COPIED!'
                },
                cv: {
                    label: '[CV / RESUME]',
                    hover: '[OPEN CV PDF]'
                }
            }
        },
        flora: {
            panelTitle: '🌿 BOTANICAL GRIMOIRE',
            densityLabel: 'DISPERSION',
            clumpingLabel: 'CLUMPING',
            lengthLabel: 'LENGTH',
            biomeLabel: 'BIOME',
            reseedBtn: '[RESEED / SEED]',
            biomes: {
                emerald: 'EMERALD',
                druk: 'DRUK',
                autumn: 'AUTUMN',
                matrix: 'MATRIX'
            }
        },
        cloud: {
            panelTitle: '☁️ ATMOSPHERIC GRIMOIRE',
            densityLabel: 'DENSITY',
            windLabel: 'WIND',
            scaleLabel: 'SCALE',
            weatherLabel: 'WEATHER',
            reseedBtn: '[SUMMON GUST / SEED]',
            weathers: {
                ethereal: 'ETHEREAL',
                storm: 'STORM',
                aurora: 'AURORA',
                crimson: 'CRIMSON'
            }
        },
        terminal: {
            windowTitle: 'DRUKSYSTEM OS v2.4 // PHOSPHOR MONITOR',
            inputPlaceholder: 'Type a command (help, ls, dungeon, cv, contact, play snake, play flappy, color, font)...',
            btnHelp: '[help]',
            btnLs: '[ls]',
            btnDungeon: '[dungeon]',
            btnCv: '[cv]',
            btnContact: '[contact]',
            btnSnake: '[play snake]',
            btnFlappy: '[play flappy]',
            btnSlasher: '[play slasher]',
            btnColor: '[color]',
            btnFont: '[font]',
            btnClose: '[close]',
            bootBanner: [
                '========================================================',
                ' DRUKSYSTEM OS v2.4 — SANCTUARY RELIC TERMINAL',
                ' KERNEL: DRUK-KERNEL 8-BIT // STATUS: ONLINE',
                '========================================================',
                'Type "help" or click the command buttons below to navigate.'
            ],
            helpLines: [
                'AVAILABLE COMMANDS IN DRUKSYSTEM OS:',
                '  help                       Show this command reference',
                '  ls                         List virtual files and system modules',
                '  dungeon                    Open the Interactive Dungeon (RPG Projects & CV)',
                '  cv / resume                Open PDF Resume / CV (ES/EN) and download link',
                '  contact / contacto / links Show social links and direct email',
                '  play                       List installed arcade mini-games',
                '  play snake                 Classic Snake in CRT phosphor',
                '  play flappy / play dragon  Flappy Dragon: Dodge the dungeon pillars',
                '  play slasher               Launch DRUK\'S BUG SLASHER',
                '  color <matrix|amber|druk|cyan> Change CRT phosphor color',
                '  font <ibm|vt323|gothic>    Change terminal font family',
                '  clear                      Clear terminal screen',
                '  exit                       Power off monitor and return to Sanctuary'
            ],
            lsLines: [
                'DIRECTORY: /sanctuary/drukdev/',
                '  drwxr-xr-x  portfolio_dungeon/     [Run "dungeon"]',
                '  -rw-r--r--  architecture_readme.md [ES6 Modules + 2D Canvas]',
                '  -r--r--r--  cv_felipe_druk.pdf     [Run "cv"]',
                '  -rwxr-xr-x  contact.lnk            [Run "contact"]',
                '  -rwxr-xr-x  games/snake.rom        [Run "play snake"]',
                '  -rwxr-xr-x  games/flappy_dragon.rom[Run "play flappy"]',
                '  -rwxr-xr-x  games/bug_slasher.rom  [Run "play slasher"]'
            ],
            contactTitle: '=== OFFICIAL CONTACT & SOCIAL NETWORK LINKS ===',
            copyEmailAction: '[COPY EMAIL]',
            copiedEmailAction: '[COPIED!]',
            dungeonOpening: '🗡️ Opening the Interactive Dungeon Gate...',
            cvOpening: '📄 Opening CV / Resume PDF (EN) in a new tab...',
            cvDownloadLabel: '• DIRECT DOWNLOAD  ->',
            cvDownloadAction: '[DOWNLOAD CV PDF]',
            cvUnavailable: 'The CV file is not available for the active language.',
            playListLines: [
                'AVAILABLE ARCADE CARTRIDGES:',
                '  • play snake   -> Classic Snake in CRT phosphor.',
                '  • play flappy  -> Flappy Dragon: Dodge the dungeon pillars.',
                '  • play slasher -> Druk\'s Bug Slasher (2D Runner).'
            ],
            colorUpdated: (mode) => `CRT phosphor updated to: ${mode.toUpperCase()} (Options: matrix, amber, druk, cyan)`,
            fontUpdated: (font) => `CRT font updated to: ${font.toUpperCase()} (Options: ibm, vt323, gothic)`,
            unknownCommand: (cmd) => `Unrecognized command: "${cmd}". Type "help" for available commands.`
        },
        snake: {
            title: 'DRUK SNAKE // PHOSPHOR EDITION',
            controlsHint: 'Controls: WASD / Arrows | [SPACE] Restart | [ESC / Q] Back to prompt',
            gameOver: 'COLLISION DETECTED! Press [SPACE] or [RESTART]',
            exitBtn: '[Q / ESC] BACK TO PROMPT',
            restartBtn: '[RESTART]'
        },
        flappy: {
            title: 'FLAPPY DRAGON // DUNGEON PILLARS',
            controlsHint: '[SPACE / CLICK] Flap • [ESC] Exit',
            gameOver: (score, hiScore) => `PILLAR COLLISION! SCORE: ${score} (HI: ${hiScore}) — [SPACE / CLICK] Restart`,
            exitBtn: '[EXIT / ESC]',
            restartBtn: '[RESTART]',
            flapBtn: '🐉 FLAP (SPACE / CLICK)'
        },
        hero: {
            copyEmailBtn: 'Copy Email',
            copiedEmailBtn: 'Copied!'
        },
        game: {
            eyebrow: '🕹️ ARCADE CARTRIDGE: BUG SLASHER',
            overlayTitle: 'DEFEND THE REPOSITORY!',
            overlayDescHtml: 'Jump over <span class="text-[#B92B92] font-bold">Bugs</span> or slash them with your attack and collect <span class="text-bronze font-bold">Commits</span>.',
            startBtn: 'INSERT COIN / PLAY',
            retryBtn: 'RETRY / PLAY AGAIN',
            jumpBtn: 'JUMP (W / SPACE)',
            gameOverTitle: (score) => `BUG IN PRODUCTION! (SCORE: ${score})`,
            gameOverDescHtml: (hiScore) => `Your current high score is <b class="text-bronze">${hiScore} pts</b>. Another quick round?`
        },
        toast: {
            copiedTitle: 'EMAIL COPIED!',
            copiedMsg: (email) => `${email} ready to paste.`
        },
        dungeon: {
            headerTitle: '⚔️ DRUKDEV DUNGEON // CLASS & RELIC ARCHIVES',
            selectTitle: 'SELECT YOUR INSPECTION CLASS',
            selectSubtitle: 'Filter my experience, projects, and coursework by specialization, or unlock the full unfiltered archive.',
            selectHint: '🖱️ Click a class card or use [◀ / ▶] + [ENTER] • [ESC] Return to Sanctuary',
            enterClassBtn: '[INSPECT CLASS]',
            omniscientBtn: '[*] OMNISCIENT MODE // VIEW FULL UNFILTERED CV (RECRUITER MODE)',
            tabAll: '[*] ALL / OMNISCIENT',
            tabBackend: '[BACKEND]',
            tabAlgorithms: '[ALGORITHMS & DATA]',
            tabGamedev: '[GAME DEV]',
            tabFullstack: '[FULL-STACK]',
            backToClassesBtn: '[◀ CLASSES]',
            downloadCvBtn: '[DOWNLOAD CV PDF]',
            closeBtn: '[X / EXIT TO SANCTUARY]',
            omniscientBannerTitle: 'OMNISCIENT MODE ACTIVE — COMPLETE UNFILTERED CV ARCHIVE',
            omniscientBannerDesc: 'Displaying all technologies, projects, teaching/industry roles, and certifications by Felipe Druk without filters.',
            sectionWeapons: '⚔️ EQUIPPED WEAPONS // TECH STACK',
            sectionRelics: '🏺 FORGED RELICS // FEATURED PROJECTS',
            sectionChronicles: '📜 GUILD CHRONICLES // WORK & TEACHING EXPERIENCE',
            sectionSeals: '🔮 ARCANE SEALS // FIUBA ENGINEERING & BOOT.DEV CERTIFICATIONS',
            fiubaCoursesLabel: 'Highlighted Core Coursework:',
            bootdevTitle: 'Boot.dev — Backend & Computer Science Path',
            repoLinkLabel: '[REPOSITORY ↗]',
            certVerifyLabel: '[VERIFY ↗]',
            certVerifiedBadge: '[COMPLETED]'
        },
        themes: {
            fantasy: {
                themeSubtitle: 'Pixel-Art Sanctuary & Interactive Console',
                heroTitle: 'DRUKDEV SANCTUARY',
                progressTask: '🐉 FORGING THE PORTFOLIO DUNGEON...',
                gameTitle: "DRUK'S BUG SLASHER",
                attackBtnLabel: 'SWORD SLASH (K / CLICK)'
            },
            cyber: {
                themeSubtitle: 'Synthwave Grid & Full-Stack Architecture',
                heroTitle: 'INITIALIZING DRUK.DEV SYSTEM',
                progressTask: '⚡ LOADING NEON SHADERS & MINIJUEGOS...',
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
