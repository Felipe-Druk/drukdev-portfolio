# ⚔️⚡ DrukDev Portfolio — Coming Soon (Pixel Art & Arcade Edition)

Landing page interactiva **"Coming Soon"** de **DrukDev**, diseñada con gráficos **Pixel-Art 100% procedurales en HTML5 Canvas**, cambio de dimensión en tiempo real (**Dark Fantasy** vs **Cyber Neon**), sintetizador de efectos 8-bit con **Web Audio API** y el minijuego arcade integrado **"Druk's Bug Slasher"**.

---

## 🏗️ Arquitectura del Proyecto

El proyecto está estructurado de forma modular usando **Vanilla JavaScript (ES6 Modules)** y **CSS Modular**, sin dependencias de empaquetadores para garantizar compatibilidad inmediata con **GitHub Pages** y **Vercel**.

```text
drukdev-portfolio/
├── index.html                  # Marcado HTML semántico y enlaces a hojas de estilo y módulo principal
├── README.md                   # Documentación y arquitectura del proyecto
├── css/
│   ├── variables.css           # Variables CSS (:root) y paletas de temas (Dark Fantasy y Cyber Neon)
│   ├── base.css                # Reset, tipografías, fondo, scanlines CRT y animaciones globales
│   └── components.css          # Cajas pixel-art, botones arcade, barra de progreso y componentes UI
└── js/
    ├── main.js                 # Punto de entrada: inicializa temas, eventos UI, diorama, juego y loop principal
    ├── config/
    │   ├── links.js            # Configuración centralizada de email, redes sociales y CV
    │   └── themes.js           # Configuración de paletas de color, textos UI y constantes de ambos mundos
    ├── audio/
    │   └── soundEngine.js      # Sintetizador de efectos de sonido 8-bit con Web Audio API (sin MP3 externos)
    ├── graphics/
    │   ├── sprites.js          # Matrices de sprites pixel-art (caballero, cyber-runner, bugs, gemas) y renderizado
    │   └── diorama.js          # Escenario interactivo en Canvas 2D y sistema de partículas ambientales
    └── game/
        └── bugSlasher.js       # Motor del minijuego arcade (física, colisiones, spawns, Hi-Score y controles)
```

---

## ✨ Características Principales

- **Selector de Dimensión en Tiempo Real (`Dark Fantasy` / `Cyber Neon`):** Actualiza variables CSS, textos de la interfaz, paletas de sprites y el escenario procedural al instante.
- **Pixel-Art Procedural (Zero Assets Externos):** Todos los personajes, enemigos, gemas y escenarios se dibujan dinámicamente a partir de matrices en `js/graphics/sprites.js`.
- **Audio 8-Bit Procedural:** Efectos de salto, ataque, monedas, colisión y game over generados en tiempo real mediante osciladores de la Web Audio API (`js/audio/soundEngine.js`).
- **Minijuego Arcade ("Bug Slasher"):** Juego endless runner con soporte para teclado (`W`/`Espacio`/`Flecha Arriba` para saltar, `K`/`J`/`Enter` para atacar), ratón y controles táctiles en pantalla, además de persistencia de `Hi-Score` en `localStorage`.

---

## 🚀 Ejecución Local y Despliegue

Al utilizar **ES6 Modules** (`<script type="module">`), el proyecto debe servirse mediante un servidor HTTP local (por políticas CORS de los navegadores sobre `file://`):

```bash
# Con Python 3
python3 -m http.server 8080

# O con Node.js (npx)
npx serve .
```

Luego abre `http://localhost:8080` en tu navegador.
