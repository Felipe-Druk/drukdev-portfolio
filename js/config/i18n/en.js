/**************************************************************
 * ENGLISH (EN) LOCALIZATION DICTIONARY (js/config/i18n/en.js)
 **************************************************************/

export const EN_TRANSLATIONS = {
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
};
