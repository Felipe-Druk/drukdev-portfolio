# 🐉🖥️ DrukDev Portfolio — Interactive Sanctuary, Dungeon & DrukSystem OS

Portafolio interactivo de **DrukDev** construido con **Vanilla JavaScript (ES6 Modules)**, **HTML5 Canvas Pixel-Art Procedural** y **Web Audio API**.

---

## 🏗️ Arquitectura y Estructura del Proyecto

```text
portfolio/
├── index.html                          # Escenario fullscreen del Santuario, HUD superior, Dungeon Modal, monitor CRT y Toast
├── DESIGN_RULES.md                     # Reglas de diseño, paleta ADN DrukDev, tipografías y modos de fósforo CRT
├── LICENSE                             # Licencia MIT del proyecto
├── README.md                           # Documentación técnica y mapa de arquitectura
├── assets/
│   ├── docs/
│   │   ├── CV-Felipe-Druk-ES.pdf       # CV en español (apertura y descarga directa)
│   │   └── CV-Felipe-Druk-EN.pdf       # CV en inglés (apertura y descarga directa)
│   └── img/
│       └── logo-drukdev.png            # Avatar / emblema oficial del dragón DrukDev en el HUD superior
├── css/
│   ├── variables.css                   # Tokens CSS, @font-face, paleta ADN DrukDev y modos de fósforo CRT
│   ├── base.css                        # Reset global (100dvh), tipografías, scanlines y soporte prefers-reduced-motion
│   ├── components.css                  # Archivo barril CSS (@import) que centraliza los estilos modulares de componentes
│   └── components/
│       ├── hud.css                     # Marcos biselados de Acero Forjado, anillo de avatar, botones arcade y selector ES|EN
│       ├── terminal.css                # Monitor CRT DrukSystem OS, pantalla de fósforo, chips de comando e inputs CLI
│       ├── grimoires.css               # Estilos unificados DRY (--grimoire-ui-*) para #floraPanel y #cloudPanel
│       └── dungeon.css                 # Modal de la Dungeon Interactiva, cartas de clase RPG, barras de stats y reliquias
└── js/
    ├── main.js                         # Punto de entrada: inicializa módulos, bucle RAF normalizado a 60Hz y eventos UI
    ├── audio/
    │   └── soundEngine.js              # Sintetizador 8-bit procedural (Web Audio API) sin archivos de audio externos
    ├── utils/
    │   ├── clipboard.js                # Utilidad desacoplada copyTextToClipboard con fallback seguro para portapapeles
    │   ├── colorMath.js                # Primitivas puras de color: parseHexColorToRgb, interpolateHexColor y shadeHexColorByDepth
    │   ├── seededRandom.js             # Generador pseudo-aleatorio determinista LCG (createSeededRandom) con hashing 32-bit
    │   ├── mathUtils.js                # Helpers matemáticos: clamp, isPortraitAspectRatio, areRectsIntersecting y removeItemSwapAndPop
    │   └── safeStorage.js              # Wrapper seguro con try/catch para localStorage (loadJson, saveJson, loadItem, saveItem)
    ├── config/
    │   ├── dungeonData.js              # Datos puros de dominio RPG: las 4 clases, proyectos, experiencia, FIUBA y Boot.dev
    │   ├── i18n.js                     # Archivo barril y gestor de estado de internacionalización (ES / EN)
    │   ├── i18n/
    │   │   ├── es.js                   # Diccionario completo de textos en español (ES_TRANSLATIONS)
    │   │   └── en.js                   # Diccionario completo de textos en inglés (EN_TRANSLATIONS)
    │   ├── links.js                    # Fuente única de verdad para correo electrónico, redes sociales y rutas de CV por idioma
    │   ├── palettes.js                 # Archivo barril centralizado que re-exporta todas las paletas sin dependencias circulares
    │   └── palettes/
    │       ├── corePalette.js          # ADN DrukDev: DRUK_CORE_PALETTE, tonos de marca, metales y acentos
    │       ├── sanctuaryPalettes.js    # SANCTUARY_SCENE_PALETTE, CELESTIAL_STAGES, CLOUD_PALETTES e interpolación cromática
    │       ├── biomePalettes.js        # BIOME_PALETTES (emerald, druk, autumn, matrix) y getActiveBiomePalette
    │       ├── terminalPalettes.js     # TERMINAL_PALETTES (fósforos matrix, amber, druk, cyan)
    │       └── spritePalettes.js       # SPRITE_PALETTES (dragón, héroe, magos elementales, arcade)
    ├── dungeon/
    │   ├── dungeonUI.js                # Orquestador del modal de la Dungeon, cierre por backdrop y navegación híbrida Mouse/Teclado
    │   └── chamberRenderer.js          # Renderizador DOM puro para Armas, Reliquias (Proyectos), Crónicas (Experiencia) y Sellos
    ├── graphics/
    │   ├── sanctuary.js                # Controlador principal del Santuario: resolución virtual, touch/mouse, auto-cierre de grimorios y frame
    │   ├── sprites/
    │   │   ├── index.js                # Archivo barril de primitivas Canvas y renderizadores procedurales de sprites
    │   │   ├── canvasUtils.js          # Primitivas pixel-art (drawRect, drawPixelLine, etiquetas flotantes y detección de punto)
    │   │   ├── mageSprite.js           # Renderizador unificado de magos elementales (drawElementalMage + wrappers Verde/Azul)
    │   │   ├── dragonSprite.js         # Renderizado procedural del Guardián Druk y el Dragón alado (Santuario, HUD y Flappy Dragon)
    │   │   ├── classEmblems.js         # Emblemas procedurales de las 4 clases RPG + Modo Omnisciente para la Dungeon
    │   │   └── arcadeSprites.js        # Sprites procedurales para Bug Slasher (héroe, onda de espada, bugs, gemas) y Snake CRT
    │   └── sanctuary/
    │       ├── celestialSystem.js      # Ciclo Noche -> Atardecer -> Día, arco parabólico al horizonte y Sol/Luna pixel-art
    │       ├── cloudSystem.js          # Motor procedural de nubes parallax de 3 capas (far, mid, near) y estado climático
    │       ├── cloudPanelUI.js         # Controlador DOM del Grimorio Atmosférico (#cloudPanel) apoyado en grimoirePanelUtils
    │       ├── constellations.js       # Planos, grilla escalonada en portrait, rotación 2D y renderizado de las 5 constelaciones
    │       ├── environmentRenderer.js  # Renderizado de cielo/montañas/laguna interpolados, Árbol Antiguo, Portal Dungeon y Consola CRT
    │       ├── floraSystem.js          # Motor matemático y generación procedural del pasto (dispersión, cúmulos y sombreado por profundidad)
    │       ├── floraPanelUI.js         # Controlador DOM del Grimorio Botánico (#floraPanel) apoyado en grimoirePanelUtils
    │       ├── layoutZones.js          # Resolución lógica dinámica (min 560x520) y cálculo de zonas por relación de aspecto (portrait/landscape)
    │       ├── grimoirePanelUtils.js   # Fábrica createGrimoirePanel, proyección canvas->viewport, sliders/botones DRY y closeAllGrimoires
    │       └── particles.js            # Sistema de partículas con removeItemSwapAndPop O(1): luciérnagas, polen, ondas, chispas y lluvia estelar
    ├── terminal/
    │   ├── drukSystem.js               # Controlador principal del monitor CRT: ciclo de vida del modal, cierre por backdrop, historial e input
    │   ├── terminalDom.js              # Helpers DOM de la terminal, salida de texto y conmutador de sub-vistas CRT (CLI y cartuchos)
    │   └── commands/
    │       ├── index.js                # Registro y despachador central de comandos (Command Pattern) y alias CLI
    │       ├── systemCommands.js       # Comandos de sistema y directorio virtual (help, ls, dungeon, clear y banner de arranque)
    │       ├── cvCommand.js            # Comando cv / resume: apertura y enlace de descarga directa del PDF según idioma activo
    │       ├── contactCommand.js       # Comando contacto / links: listado de redes sociales y copia de email al portapapeles
    │       ├── appearanceCommands.js   # Comandos color y font: persistencia con safeStorage y cambio en vivo de fósforo CRT y tipografía
    │       └── playCommand.js          # Comando play y lanzador de cartuchos arcade (snake, flappy, slasher)
    └── game/
        ├── snakeGame.js                # Minijuego Druk Snake con controles de teclado y pad táctil responsivo
        ├── flappyDragon.js             # Minijuego Flappy Dragon normalizado a 60Hz con colisión AABB y swap-and-pop O(1)
        └── bugSlasher.js               # Minijuego arcade runner 2D (Druk's Bug Slasher) con colisión AABB y swap-and-pop O(1)
```

---

## 🔗 Conexión entre Módulos Principales

1. **Punto de Entrada (`js/main.js`):**
   - Inicializa el escenario del Santuario (`initSanctuary`), la terminal (`initDrukSystem`), la Dungeon Interactiva (`initDungeonUI`), el cartucho runner (`initGame`), las vistas previas procedurales (`renderStaticPreviews`) y el idioma activo (`setLanguage`).
   - Ejecuta el bucle principal `requestAnimationFrame` (`mainLoop`) pausando automáticamente `updateAndDrawSanctuary()` cuando los modales de pantalla completa están abiertos y ejecutando `updateAndDrawGame()` exclusivamente en la vista `slasher`.
2. **Motor de Sprites Procedurales (`js/graphics/sprites/*`):**
   - Centraliza todas las primitivas de dibujo pixel-art (`canvasUtils.js`) y estandariza cada entidad visual mediante funciones procedurales basadas en `drawRect` consumiendo colores desde `js/config/palettes.js`:
     - `mageSprite.js` centraliza la geometría de los magos en `drawElementalMage` y expone los wrappers `drawGreenMage` (**Mago Verde**, paleta del bioma activo) y `drawBlueMage` (**Mago Azul / Aeromante**, levitando sobre su nube-pedestal reactiva al clima y al ciclo celeste).
     - `dragonSprite.js` renderiza al Guardián en el Santuario, las vistas previas estáticas y el dragón en vuelo de `flappyDragon.js`.
     - `classEmblems.js` traza los emblemas pixel-art de las 4 clases RPG (`backend`, `algorithms`, `gamedev`, `fullstack`) y del Modo Omnisciente.
     - `arcadeSprites.js` provee los sprites procedurales para `bugSlasher.js` y `snakeGame.js`.
3. **Escenario del Santuario (`js/graphics/sanctuary.js` + `js/graphics/sanctuary/*`):**
   - `sanctuary.js` actúa como controlador de estado e input del canvas `#sanctuaryCanvas` y delega responsabilidades en `js/graphics/sanctuary/`:
     - `celestialSystem.js` gestiona el ciclo **Noche -> Atardecer Dorado -> Día** (`druk_celestial_mode`), la trayectoria parabólica del astro hacia el horizonte y el renderizado pixel-art de la Luna y el Sol.
     - `cloudSystem.js` genera y anima las nubes procedurales en 3 capas parallax (`far`, `mid`, `near`) detrás de las constelaciones (`druk_cloud_config`), iterando directamente sin asignaciones de arrays intermedias.
     - `cloudPanelUI.js` y `floraPanelUI.js` delegan la creación de paneles, registro de exclusión mutua y reactividad en el módulo utilitario común `grimoirePanelUtils.js`, eliminando dependencias circulares.
     - `layoutZones.js` calcula y memoiza las coordenadas relativas al viewport y actualiza el hitbox dinámico del astro en tiempo real.
     - `environmentRenderer.js` dibuja el cielo, montañas y laguna consumiendo la paleta de escena precalculada por frame (`getInterpolatedScenePalette`), el Árbol Antiguo, el Portal de la Dungeon (`DUNGEON // ENTER`) y la consola reliquia `DrukSystem`.
     - `floraSystem.js` gestiona el motor matemático y la generación procedural del pasto (`seed`, `density`, `clumping`, `grassLength`), precalculando y cacheando los colores por profundidad en la geometría para renderizar a 0 llamadas recurrentes de sombreado.
     - `constellations.js` traza las 5 constelaciones interactivas (**GitHub**, **YouTube**, **LinkedIn**, **Mail** y **CV**), adaptándolas como un **Astrolabio Solar** durante el día.
     - `particles.js` actualiza y dibuja partículas con algoritmo swap-and-pop O(1) al expirar: luciérnagas nocturnas / polen solar diurno, ondas en el agua, hojas, chispas del portal y lluvia estelar.
4. **La Dungeon Interactiva (`js/dungeon/dungeonUI.js` + `js/dungeon/chamberRenderer.js` + `js/config/dungeonData.js`):**
   - `dungeonData.js` contiene datos puros de dominio (sin lógica visual) para las 4 clases RPG, proyectos (`DUNGEON_PROJECTS`), experiencia (`DUNGEON_EXPERIENCE`), materias de **FIUBA** (`DUNGEON_EDUCATION`) y certificaciones de **Boot.dev** (`DUNGEON_CERTIFICATIONS`).
   - `dungeonUI.js` controla el modal `#dungeonModal`, la selección de clase por **Mouse y Teclado** (`ArrowLeft`/`ArrowRight` + `Enter` + `Escape`) y el **Modo Omnisciente**.
   - `chamberRenderer.js` construye las tarjetas DOM de Armas Equipadas, Reliquias, Crónicas y Sellos Arcanos.
5. **Artefacto `DrukSystem OS` (`js/terminal/drukSystem.js` + `js/terminal/terminalDom.js` + `js/terminal/commands/*`):**
   - `drukSystem.js` orquesta la apertura/cierre del modal (`#drukSystemModal`), el historial de comandos y los chips rápidos (`help`, `ls`, `dungeon`, `cv`, `contacto`, `play snake`, `play flappy`, `play slasher`, `color`, `font`, `clear`, `exit`).
   - `commands/index.js` despacha cada comando hacia su módulo especializado (`systemCommands.js`, `cvCommand.js`, `contactCommand.js`, `appearanceCommands.js` y `playCommand.js`).
