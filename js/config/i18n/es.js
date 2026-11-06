/**************************************************************
 * SPANISH (ES) LOCALIZATION DICTIONARY (js/config/i18n/es.js)
 **************************************************************/

export const ES_TRANSLATIONS = {
    nav: {
        sfxOn: 'SFX ON',
        sfxMute: 'MUTE',
        soundTitle: 'Efectos de sonido 8-bit',
        langTitle: 'Cambiar idioma (ES / EN)',
        openTerminalBtn: 'DRUKSYSTEM OS',
        subtitle: 'Santuario Pixel-Art & Consola Interactiva'
    },
    sanctuary: {
        hint: '[*] Interactúa con el Santuario: Constelaciones, Árbol Antiguo, Laguna, Mago Verde, Portal Dungeon o Consola DrukSystem',
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
        panelTitle: '[+] GRIMORIO BOTÁNICO',
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
        panelTitle: '[~] GRIMORIO ATMOSFÉRICO',
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
        safeModeBanner: [
            '========================================================',
            ' DRUKSYSTEM OS v2.4 [RECOVERY MODE]',
            ' NÚCLEO: DRUK-KERNEL 8-BIT RESTAURADO // /var/spells OK',
            '========================================================',
            'Sistema recuperado tras colapso crítico. Escribe "help".'
        ],
        cataclysmLines: [
            '[ALERTA] Purgando /boot/drukernel.bin y vectores de arranque...',
            '[ALERTA] Eliminando grimorios en /var/spells y ciclo astral...',
            '[FATAL] KERNEL PANIC — EJECUTANDO PROTOCOLO DE COLAPSO TOTAL...'
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
        dungeonOpening: '[>] Abriendo el Portal de la Dungeon Interactiva...',
        cvOpening: '[>] Abriendo CV en PDF (ES) en una nueva pestaña...',
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
        flapBtn: '[>] ALETEAR (ESPACIO / CLICK)'
    },
    hero: {
        copyEmailBtn: 'Copiar Email',
        copiedEmailBtn: '¡Copiado!'
    },
    game: {
        eyebrow: '[>] CARTUCHO ARCADE: BUG SLASHER',
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
        headerTitle: '[//] LA DUNGEON DE DRUKDEV // ARCHIVO DE CLASES Y RELIQUIAS',
        selectTitle: 'ELIGE TU CLASE DE INSPECCIÓN',
        selectSubtitle: 'Filtra mi experiencia, proyectos y formación según el perfil que buscas, o desbloquea el archivo completo.',
        selectHint: '[>] Haz clic en una carta o usa [◀ / ▶] + [ENTER] • [ESC] Salir al Santuario',
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
        sectionWeapons: '[+] ARMAS EQUIPADAS // STACK TÉCNICO',
        sectionRelics: '[*] RELIQUIAS FORJADAS // PROYECTOS DESTACADOS',
        sectionChronicles: '[//] CRÓNICAS DEL GREMIO // EXPERIENCIA LABORAL Y DOCENTE',
        sectionSeals: '[o] SELLOS ARCANOS // INGENIERÍA FIUBA & CERTIFICACIONES BOOT.DEV',
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
            progressTask: '[>] FORJANDO LA DUNGEON DEL PORTAFOLIO...',
            gameTitle: "DRUK'S BUG SLASHER",
            attackBtnLabel: 'ESPADAZO (K / CLICK)'
        },
        cyber: {
            themeSubtitle: 'Synthwave Grid & Arquitectura Full-Stack',
            heroTitle: 'INICIALIZANDO EL SISTEMA DRUK.DEV',
            progressTask: '[>] CARGANDO NEON SHADERS & MINIJUEGOS...',
            gameTitle: 'CYBER BUG RUNNER 2099',
            attackBtnLabel: 'PULSO LÁSER (K / CLICK)'
        }
    }
};
