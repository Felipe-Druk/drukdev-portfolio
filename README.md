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
│   ├── base.css                        # Reset global, tipografías (--font-gothic-pixel, --font-terminal, --font-vt) y scanlines
│   └── components.css                  # Biselado de Acero Forjado, Dungeon RPG UI, monitor CRT DrukSystem OS y botones pixel-art
└── js/
    ├── main.js                         # Punto de entrada: inicializa Santuario, Dungeon, DrukSystem OS, minijuegos, i18n, audio y RAF
    ├── audio/
    │   └── soundEngine.js              # Sintetizador 8-bit procedural (Web Audio API) sin archivos de audio externos
    ├── config/
    │   ├── dungeonData.js              # Datos puros de dominio RPG: las 4 clases, proyectos, experiencia, FIUBA y Boot.dev
    │   ├── i18n.js                     # Diccionarios ES / EN y persistencia de idioma en localStorage
    │   ├── links.js                    # Fuente única de verdad para correo electrónico, redes sociales y rutas de CV por idioma
    │   └── themes.js                   # Paletas cromáticas base para escenarios y minijuegos
    ├── dungeon/
    │   ├── dungeonUI.js                # Orquestador del modal de la Dungeon, estado de vista y navegación híbrida Mouse/Teclado
    │   └── chamberRenderer.js          # Renderizador DOM puro para Armas, Reliquias (Proyectos), Crónicas (Experiencia) y Sellos
    ├── graphics/
    │   ├── sanctuary.js                # Controlador principal del Santuario: estado, eventos de puntero/click y orquestación de frame
    │   ├── sprites/
    │   │   ├── index.js                # Archivo barril de primitivas Canvas y renderizadores procedurales de sprites
    │   │   ├── canvasUtils.js          # Primitivas pixel-art (drawRect, drawPixelLine, etiquetas flotantes, colisión y portapapeles)
    │   │   ├── greenMageSprite.js      # Renderizado procedural del Mago Verde NPC (túnica reactiva al bioma, báculo y sombrero)
    │   │   ├── dragonSprite.js         # Renderizado procedural del Guardián Druk y el Dragón alado (Santuario, HUD y Flappy Dragon)
    │   │   ├── classEmblems.js         # Emblemas procedurales de las 4 clases RPG + Modo Omnisciente para la Dungeon
    │   │   └── arcadeSprites.js        # Sprites procedurales para Bug Slasher (héroe, onda de espada, bugs, gemas) y Snake CRT
    │   └── sanctuary/
    │       ├── constellations.js       # Planos, rotación 2D, escalado y renderizado de las 5 constelaciones (redes, mail y CV)
    │       ├── environmentRenderer.js  # Renderizado del cielo/luna, pradera/laguna, Árbol Antiguo, Portal Dungeon y Consola CRT
    │       ├── floraSystem.js          # Vegetación procedural (dispersión, cúmulos, 4 biomas) y controlador del Grimorio Botánico UI
    │       ├── layoutZones.js          # Cálculo responsivo de hitboxes/zonas interactivas y detección de hover
    │       └── particles.js            # Sistema de partículas: luciérnagas, hojas/esporas, ondas de agua, chispas rúnicas y lluvia estelar
    ├── terminal/
    │   ├── drukSystem.js               # Controlador principal del monitor CRT: ciclo de vida del modal, historial y eventos de entrada
    │   ├── terminalDom.js              # Helpers DOM de la terminal, salida de texto y conmutador de sub-vistas CRT (CLI y cartuchos)
    │   └── commands/
    │       ├── index.js                # Registro y despachador central de comandos (Command Pattern) y alias CLI
    │       ├── systemCommands.js       # Comandos de sistema y directorio virtual (help, ls, dungeon, clear y banner de arranque)
    │       ├── cvCommand.js            # Comando cv / resume: apertura y enlace de descarga directa del PDF según idioma activo
    │       ├── contactCommand.js       # Comando contacto / links: listado de redes sociales y copia de email al portapapeles
    │       ├── appearanceCommands.js   # Comandos color y font: persistencia y cambio en vivo de fósforo CRT y tipografía
    │       └── playCommand.js          # Comando play y lanzador de cartuchos arcade (snake, flappy, slasher)
    └── game/
        ├── snakeGame.js                # Minijuego Druk Snake renderizado con el color de fósforo activo del monitor CRT
        ├── flappyDragon.js             # Minijuego Flappy Dragon entre pilares de mazmorra dentro del monitor CRT
        └── bugSlasher.js               # Minijuego arcade runner 2D (Druk's Bug Slasher)
```

---

## 🔗 Conexión entre Módulos Principales

1. **Punto de Entrada (`js/main.js`):**
   - Inicializa el escenario del Santuario (`initSanctuary`), la terminal (`initDrukSystem`), la Dungeon Interactiva (`initDungeonUI`), el cartucho runner (`initGame`), las vistas previas procedurales (`renderStaticPreviews`) y el idioma activo (`setLanguage`).
   - Ejecuta el bucle principal `requestAnimationFrame` (`mainLoop`) que invoca en cada frame a `updateAndDrawSanctuary()` y `updateAndDrawGame()`.
2. **Motor de Sprites Procedurales (`js/graphics/sprites/*`):**
   - Centraliza todas las primitivas de dibujo pixel-art (`canvasUtils.js`) y estandariza cada entidad visual mediante funciones procedurales basadas en `drawRect`:
     - `greenMageSprite.js` dibuja al **Mago Verde** sincronizado con la paleta del bioma activo.
     - `dragonSprite.js` renderiza al Guardián en el Santuario, las vistas previas estáticas y el dragón en vuelo de `flappyDragon.js`.
     - `classEmblems.js` traza los emblemas pixel-art de las 4 clases RPG (`backend`, `algorithms`, `gamedev`, `fullstack`) y del Modo Omnisciente.
     - `arcadeSprites.js` provee los sprites procedurales para `bugSlasher.js` y `snakeGame.js`.
3. **Escenario del Santuario (`js/graphics/sanctuary.js` + `js/graphics/sanctuary/*`):**
   - `sanctuary.js` actúa como controlador de estado e input del canvas `#sanctuaryCanvas` y delega responsabilidades en `js/graphics/sanctuary/`:
     - `layoutZones.js` calcula las coordenadas relativas al viewport para que ningún elemento colisione en distintas resoluciones.
     - `environmentRenderer.js` dibuja el cielo nocturno, la luna de fases interactivas, la pradera, la laguna con nenúfares, el Árbol Antiguo, el Portal de la Dungeon (`DUNGEON // ENTER`) y la consola reliquia `DrukSystem`.
     - `floraSystem.js` gestiona exclusivamente la generación procedural del pasto (`seed`, `density`, `clumping`, `grassLength` y biomas `emerald`, `druk`, `autumn`, `matrix`) y el panel `#floraPanel`.
     - `constellations.js` traza las 5 constelaciones interactivas (**GitHub**, **YouTube**, **LinkedIn**, **Mail** y **CV**).
     - `particles.js` actualiza y dibuja luciérnagas ambientales, ondas en el agua, hojas, chispas del portal y lluvia estelar.
4. **La Dungeon Interactiva (`js/dungeon/dungeonUI.js` + `js/dungeon/chamberRenderer.js` + `js/config/dungeonData.js`):**
   - `dungeonData.js` contiene datos puros de dominio (sin lógica visual) para las 4 clases RPG, proyectos (`DUNGEON_PROJECTS`), experiencia (`DUNGEON_EXPERIENCE`), materias de **FIUBA** (`DUNGEON_EDUCATION`) y certificaciones de **Boot.dev** (`DUNGEON_CERTIFICATIONS`).
   - `dungeonUI.js` controla el modal `#dungeonModal`, la selección de clase por **Mouse y Teclado** (`ArrowLeft`/`ArrowRight` + `Enter` + `Escape`) y el **Modo Omnisciente**.
   - `chamberRenderer.js` construye las tarjetas DOM de Armas Equipadas, Reliquias, Crónicas y Sellos Arcanos.
5. **Artefacto `DrukSystem OS` (`js/terminal/drukSystem.js` + `js/terminal/terminalDom.js` + `js/terminal/commands/*`):**
   - `drukSystem.js` orquesta la apertura/cierre del modal (`#drukSystemModal`), el historial de comandos y los chips rápidos (`help`, `ls`, `dungeon`, `cv`, `contacto`, `play snake`, `play flappy`, `play slasher`, `color`, `font`, `clear`, `exit`).
   - `commands/index.js` despacha cada comando hacia su módulo especializado (`systemCommands.js`, `cvCommand.js`, `contactCommand.js`, `appearanceCommands.js` y `playCommand.js`).
