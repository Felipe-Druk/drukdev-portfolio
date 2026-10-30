# 🐉 DESIGN RULES — DrukDev Sanctuary & DrukSystem OS

## 1. Identidad Visual y Paleta ADN DrukDev
- **Fondo Principal / Noche:** `#0D0D0F`
- **Paneles / Tierra Oscura:** `#231C1A`
- **Acero Forjado (Bordes biselados sin `border-radius`):**
  - Base: `#56616E` (`--steel-base` / `--steel-mid`)
  - Sombra interior: `#2B3138` (`--steel-dark`)
  - Reflejos de luz: `#D8E2EB` (`--steel-light`)
- **Escamas de Dragón (Acentos Mágicos):**
  - Escamas luz: `#B92B92` (`--accent-main`)
  - Escamas base: `#7A1F73` (`--accent-secondary`)
- **Bronce Cálido (Pecho / Textos destacados):**
  - Luz: `#D4957A` (`--accent-warm`)
  - Sombra: `#8A4E3B` (`--shadow-warm`)
- **Santuario Natural:**
  - Musgo: `#1E3A2F` (`--sanctuary-moss`)
  - Follaje: `#2E5A44` (`--sanctuary-leaf`)
  - Agua profunda: `#0E2233` (`--sanctuary-water`)
  - Reflejo de agua: `#2C5E7A` (`--sanctuary-water-highlight`)

## 2. Tipografías y Modos de Fósforo CRT
- **Tipografías:**
  - `--font-gothic-pixel`: `'Press Start 2P', monospace` (con `@font-face` preparado en `css/variables.css` para fuente gótica pixel-art local).
  - `--font-terminal`: `'IBM Plex Mono', monospace` (por defecto en `DrukSystem OS`).
  - `--font-vt`: `'VT323', monospace` (alternativa retro en `DrukSystem OS`).
- **Modos de Fósforo (`[data-terminal-color]`):**
  - `matrix`: Fondo `#030803`, Texto `#00FF41`, Sombra `#008F11`
  - `amber`: Fondo `#0A0602`, Texto `#FFB000`, Sombra `#996900`
  - `druk`: Fondo `#0D070C`, Texto `#D4957A`, Sombra `#B92B92`
  - `cyan`: Fondo `#02080A`, Texto `#00F5D4`, Sombra `#008B76`

## 3. El Escenario Principal: El Santuario Interactivo (`js/graphics/sanctuary.js`)
Canvas Pixel-Art protagonista a pantalla completa con HUD mínimo superior (`ES | EN` y `MUTE`) e interacciones 8-bit (`js/audio/soundEngine.js`):
1. **El Árbol Antiguo:** Se mece suavemente; al hacer clic suelta hojas/esporas brillantes y emite sonido de ramas/viento (`tree`).
2. **La Laguna con Nenúfares:** Refleja la luz tenue; al hacer clic en el agua o nenúfares expande ondas concéntricas pixeladas y suena una gota de agua (`water`).
3. **La Entrada Sellada a la Dungeon ("COMING SOON"):** Portal de piedra y acero con runas magenta (`#B92B92`) y cartel `--font-gothic-pixel` `"COMING SOON"`. Al hacer clic tiembla (screen shake local), suelta chispas púrpura (`seal`) y muestra un mensaje flotante estilo RPG (`"Sellado por magia antigua... en construcción"`).
4. **La Consola `DrukSystem` en el piso:** Descansa sobre el pasto junto a la laguna. Su pantalla parpadea en verde Matrix (`#00FF41`), al pasar el mouse muestra `[ABRIR DRUKSYSTEM OS]` y al hacer clic abre el monitor CRT.

## 4. El Artefacto: `DrukSystem OS` (`js/terminal/drukSystem.js`)
Monitor CRT con marco exterior grueso de Acero Forjado (`#56616E`, biselado pixel-art sin `border-radius`), pantalla interior negra (`#030803`), scanlines CRT, botonera de comandos clicables con el mouse (`[help]`, `[ls]`, `[contacto]`, `[play snake]`, `[play slasher]`, `[color]`, `[font]`, `[cerrar]`) e input CLI de teclado:
- `help`: Muestra la ayuda en el idioma activo (`ES` / `EN`).
- `ls`: Lista los archivos virtuales y secciones.
- `contacto` / `links`: Muestra los enlaces reales desde `js/config/links.js` como links clicables y botón para copiar el email.
- `color <matrix|amber|druk|cyan>`: Cambia el color del fósforo de la terminal en vivo.
- `font <ibm|vt323|gothic>`: Cambia la fuente de la terminal en tiempo real.
- `play`: Muestra la lista de minijuegos disponibles (`play snake`, `play slasher`).
- `play snake`: Ejecuta el minijuego **Snake** (`js/game/snakeGame.js`) dentro de la pantalla de fósforo del monitor CRT.
- `clear` y `exit`: Limpia la terminal o apaga el monitor regresando al Santuario.
