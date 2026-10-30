# 🐉🖥️ DrukDev Portfolio — Interactive Sanctuary & DrukSystem OS

Portafolio interactivo de **DrukDev** construido con **Vanilla JavaScript (ES6 Modules)**, **HTML5 Canvas Pixel-Art Procedural** y **Web Audio API**.

---

## 🏗️ Arquitectura del Proyecto

```text
drukdev-portfolio/
├── index.html                  # Escenario del Santuario, HUD mínimo y modal CRT de DrukSystem OS
├── DESIGN_RULES.md             # Reglas de diseño, paleta ADN DrukDev, tipografías e interacciones
├── README.md                   # Documentación técnica del proyecto
├── css/
│   ├── variables.css           # Tokens CSS, @font-face, paleta del Santuario y modos de fósforo CRT
│   ├── base.css                # Reset, tipografías (--font-gothic-pixel, --font-terminal, --font-vt) y scanlines
│   └── components.css          # Marco de Acero Forjado, monitor CRT DrukSystem y chips de comandos
└── js/
    ├── main.js                 # Punto de entrada: inicializa Santuario, DrukSystem OS, i18n y audio
    ├── config/
    │   ├── i18n.js             # Traducciones ES / EN para el Santuario, DrukSystem OS y minijuegos
    │   ├── links.js            # Configuración centralizada de email y redes sociales
    │   └── themes.js           # Paletas pixel-art para sprites y escenarios
    ├── audio/
    │   └── soundEngine.js      # Sintetizador 8-bit procedural con Web Audio API
    ├── graphics/
    │   ├── sprites.js          # Matrices pixel-art y renderizado en Canvas 2D
    │   ├── sanctuary.js        # Escenario principal interactivo (Árbol, Laguna, Dungeon y Consola)
    │   └── diorama.js          # Módulo de escena secundaria
    ├── terminal/
    │   └── drukSystem.js       # Sistema operativo CRT (comandos CLI + botones clicables)
    └── game/
        ├── snakeGame.js        # Minijuego Snake renderizado en el fósforo activo del monitor CRT
        └── bugSlasher.js       # Minijuego arcade runner (Druk's Bug Slasher)
```
