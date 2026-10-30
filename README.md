# 🐉🖥️ DrukDev Portfolio — Interactive Sanctuary & DrukSystem OS

Portafolio interactivo de **DrukDev** construido con **Vanilla JavaScript (ES6 Modules)**, **HTML5 Canvas Pixel-Art Procedural** y **Web Audio API**.

---

## 🏗️ Arquitectura y Estructura del Proyecto

```text
portfolio/
├── index.html                          # Escenario fullscreen del Santuario, HUD superior, modal CRT DrukSystem OS y Toast
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
│   └── components.css                  # Biselado de Acero Forjado, monitor CRT DrukSystem OS, botones pixel-art y chips CLI
└── js/
    ├── main.js                         # Punto de entrada: inicializa Santuario, DrukSystem OS, minijuegos, i18n, audio y bucle RAF
    ├── audio/
    │   └── soundEngine.js              # Sintetizador 8-bit procedural (Web Audio API) sin archivos de audio externos
    ├── config/
    │   ├── i18n.js                     # Diccionarios ES / EN y persistencia de idioma en localStorage
    │   ├── links.js                    # Fuente única de verdad para correo electrónico, redes sociales y rutas de CV por idioma
    │   └── themes.js                   # Paletas cromáticas pixel-art para sprites y escenarios
    ├── graphics/
    │   ├── sprites.js                  # Matrices de sprites pixel-art (caballero, enemigos, gemas) y helper de pintado en Canvas
    │   ├── diorama.js                  # Módulo secundario de diorama / escena alternativa
    │   ├── sanctuary.js                # Controlador principal del Santuario: estado, eventos de puntero/click y orquestación de frame
    │   └── sanctuary/
    │       ├── canvasUtils.js          # Primitivas pixel-art (drawRect, drawPixelLine, etiquetas flotantes, colisión y portapapeles)
    │       ├── constellations.js       # Planos, rotación 2D, escalado y renderizado de las 5 constelaciones (redes, mail y CV)
    │       ├── environmentRenderer.js  # Renderizado del cielo/luna, pradera/laguna, Árbol Antiguo, Portal Dungeon y Consola CRT
    │       ├── floraSystem.js          # Vegetación procedural (dispersión, cúmulos, 4 biomas), Mago Verde NPC y Grimorio Botánico UI
    │       ├── layoutZones.js          # Cálculo responsivo de hitboxes/zonas interactivas y detección de hover
    │       └── particles.js            # Sistema de partículas: luciérnagas, hojas/esporas, ondas de agua, chispas rúnicas y lluvia estelar
    ├── terminal/
    │   ├── drukSystem.js               # Controlador principal del monitor CRT: ciclo de vida del modal, historial y eventos de entrada
    │   ├── terminalDom.js              # Helpers DOM de la terminal, salida de texto y conmutador de sub-vistas CRT (CLI y cartuchos)
    │   └── commands/
    │       ├── index.js                # Registro y despachador central de comandos (Command Pattern) y alias CLI
    │       ├── systemCommands.js       # Comandos de sistema y directorio virtual (help, ls, clear y banner de arranque)
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
   - Inicializa el escenario del Santuario (`initSanctuary`), la terminal (`initDrukSystem`), el cartucho runner (`initGame`), las vistas previas de sprites (`renderStaticPreviews`) y el idioma activo (`setLanguage`).
   - Ejecuta el bucle principal `requestAnimationFrame` (`mainLoop`) que invoca en cada frame a `updateAndDrawSanctuary()` y `updateAndDrawGame()`.
2. **Escenario del Santuario (`js/graphics/sanctuary.js` + `js/graphics/sanctuary/*`):**
   - `sanctuary.js` actúa como controlador de estado e input del canvas `#sanctuaryCanvas` y delega responsabilidades en `js/graphics/sanctuary/`:
     - `layoutZones.js` calcula las coordenadas relativas al viewport para que ningún elemento colisione en distintas resoluciones.
     - `environmentRenderer.js` dibuja el cielo nocturno, la luna de fases interactivas, la pradera, la laguna con nenúfares, el Árbol Antiguo, la entrada sellada a la Dungeon y la consola reliquia `DrukSystem`, sincronizando su paleta vegetal con el bioma activo.
     - `floraSystem.js` gestiona la vegetación procedural del pasto (`seed`, `density`, `clumping` y biomas `emerald`, `druk`, `autumn`, `matrix` persistidos en `localStorage` bajo `druk_flora_config`), la física de viento/repulsión del cursor, el renderizado del **Mago Verde** y el **Grimorio Botánico (`#floraPanel`)**.
     - `constellations.js` lee `CONTACT_LINKS` (`getLocalizedCvPath`) desde `js/config/links.js` y `TRANSLATIONS` desde `js/config/i18n.js` para trazar en el cielo las 5 constelaciones interactivas (**GitHub**, **YouTube**, **LinkedIn**, **Mail** y **CV**), abriendo enlaces/PDFs o copiando el email con `canvasUtils.js`.
     - `particles.js` actualiza y dibuja luciérnagas ambientales, ondas en el agua (`updateAndDrawPondRipples`), hojas, chispas del sello y lluvia estelar de las constelaciones.
   - Al hacer clic sobre la consola del pasto (o el botón del HUD), invoca el callback `openDrukSystem` hacia `js/terminal/drukSystem.js`.
3. **Artefacto `DrukSystem OS` (`js/terminal/drukSystem.js` + `js/terminal/terminalDom.js` + `js/terminal/commands/*`):**
   - `drukSystem.js` orquesta la apertura/cierre del modal (`#drukSystemModal`), el historial de comandos por teclado (`ArrowUp`/`ArrowDown`) y los chips rápidos (`help`, `ls`, `cv`, `contacto`, `play snake`, `play flappy`, `play slasher`, `color`, `font`, `clear`, `exit`).
   - `terminalDom.js` encapsula la manipulación del DOM de la pantalla CRT y la conmutación entre la vista CLI y las vistas de los minijuegos.
   - `commands/index.js` implementa un registro declarativo de comandos que delega la ejecución en módulos independientes de responsabilidad única (`systemCommands.js`, `cvCommand.js`, `contactCommand.js`, `appearanceCommands.js` y `playCommand.js`).
4. **Minijuegos (`js/game/snakeGame.js`, `js/game/flappyDragon.js`, `js/game/bugSlasher.js`):**
   - `playCommand.js` y `terminalDom.js` alternan entre la vista CLI y los contenedores CRT de cada cartucho (`play snake`, `play flappy`, `play slasher`), deteniendo el juego activo al cambiar de vista o cerrar el monitor.
   - Todos los juegos consumen `js/graphics/sprites.js`, `js/audio/soundEngine.js` y `js/config/i18n.js`.
5. **Audio (`js/audio/soundEngine.js`), Internacionalización (`js/config/i18n.js`) y Enlaces (`js/config/links.js`):**
   - `soundEngine.js` sintetiza efectos 8-bit (`jump`, `flap`, `attack`, `coin`, `hit`, `gameover`, `click`, `tree`, `water`, `seal`, `terminal`, `starHover`, `constellation`) consumidos por el Santuario, la terminal y los tres minijuegos.
   - `i18n.js` centraliza todos los textos del DOM (`data-i18n*`), etiquetas flotantes del canvas y mensajes de la CLI.
   - `links.js` alimenta tanto las constelaciones del cielo del Santuario como los comandos `contacto` y `cv` de `DrukSystem OS` (ocultando automáticamente cualquier red o CV cuya ruta esté vacía).
