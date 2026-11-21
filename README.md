# jere.dev — Portfolio de Jeremías Mendoza

Portfolio interactivo personal construido con **React 19**, **Vite** y **Tailwind CSS v4**, combinando desarrollo de software con una estética oscura editorial inspirada en el rock y las guitarras.

## Características destacadas

- **Hero con 6 cuerdas de guitarra interactivas (`E A D G B e`)**: canvas con física de cuerda vibrante y diapasón minimalista. Al pasar el cursor o hacer click se rasguean acordes (*De Música Ligera* `Bm → G → D → A` y acordes abiertos) sintetizados en tiempo real con **Web Audio API (algoritmo Karplus-Strong)** y un toque de overdrive cálido.
- **JM-24 Rock / Synth Rig (Stack interactivo)**: teclado de 24 teclas (2 octavas, usable con mouse, táctil o teclado `Z–M` y `Q–U`) que presenta cada tecnología del stack con osciloscopio LCD en vivo, selector de tono (**guitarra eléctrica / sintetizador**) y **7 riffs tocables**:
  - **Rock argentino**: *De Música Ligera* (Soda Stereo), *Ji Ji Ji* (Los Redondos), *Lamento Boliviano* (Enanitos Verdes) y *Persiana Americana* (Soda Stereo).
  - **Clásicos del rock**: *Smoke on the Water* (Deep Purple), *Seven Nation Army* (The White Stripes) y *Come As You Are* (Nirvana).
- **Credencial Backstage Pass con física**: pase colgante interactivo (`ALL ACCESS · DEV PASS`) simulado con integración Verlet que se puede arrastrar y balancear con brillo holográfico reactivo.
- **Proyectos + Archivo de GitHub en vivo**: bento grid con tarjetas 3D/spotlight, visuales animados, demo interactiva de consumo de API (*Perritos Aleatorios*) y listado dinámico sincronizado con la API pública de GitHub filtrable por lenguaje.
- **Historia Académica**: sección dedicada con progreso de **Ingeniería en Sistemas de Información** y **Analista Universitario en Sistemas** (UNViMe), promedios, materias relevantes y formación técnica secundaria.
- **Terminal interactiva (`Ctrl + K` o `~`)**: CLI embebida con autocompletado (`Tab`), historial (`↑`/`↓`) y comandos como `whoami`, `proyectos`, `skills`, `academia`, `cv`, `acorde`, `riffs`, `riff <nombre>`, `tema` e `ir <sección>`.
- **Selector de color de acento**: 5 paletas persistidas en `localStorage` (*lima*, *ámbar ampli*, *rojo rock*, *cian*, *violeta*), cursor personalizado y reloj en vivo de Villa Mercedes, San Luis.

## Stack utilizado

- **Frontend**: React 19, Tailwind CSS v4, Vite 6
- **Audio y gráficos**: Web Audio API (Karplus-Strong + osciladores + analizador FFT), HTML5 Canvas 2D, SVG
- **Iconos y tipografía**: Boxicons, Syne, Manrope, JetBrains Mono

## Estructura del proyecto

```text
.
├── public/
│   └── assets/
│       └── CV-Jeremias-Mendoza.pdf
├── src/
│   ├── audio/
│   │   └── audioRig.js           # Motor Web Audio (guitarra Karplus-Strong + synth)
│   ├── components/
│   │   ├── AboutSection.jsx      # Bio, experiencia laboral y pase con física Verlet
│   │   ├── AcademicSection.jsx   # Historia académica (UNViMe + secundario técnico)
│   │   ├── ContactSection.jsx    # Título de peso variable, email copiable y reloj
│   │   ├── CustomCursor.jsx      # Cursor reactivo contextual
│   │   ├── HeroStrings.jsx       # Hero con 6 cuerdas de guitarra interactivas
│   │   ├── Loader.jsx            # Afinador de arranque E-A-D-G-B-e
│   │   ├── Marquee.jsx           # Cinta tipográfica reactiva al scroll
│   │   ├── ProjectsSection.jsx   # Bento grid + archivo dinámico de GitHub
│   │   ├── StackRig.jsx          # Teclado JM-24 + osciloscopio + selector de riffs
│   │   ├── TerminalModal.jsx     # Terminal interactiva (Ctrl + K)
│   │   └── Topbar.jsx            # Barra superior y navegación tracklist (01–06)
│   ├── data/
│   │   ├── portfolioData.js      # Datos del portfolio, stack, acordes y academia
│   │   └── riffs.js              # Partituras MIDI de los 7 riffs
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Instalación y uso local

Requisitos: **Node.js 18+** y **npm**.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar entorno de desarrollo
npm run dev

# 3. Compilar para producción (genera /dist)
npm run build

# 4. Previsualizar la build de producción
npm run preview
```

## Despliegue

El proyecto está configurado con `Vite` y `base: './'` en `vite.config.js`, listo para desplegar sin configuración adicional en **Vercel**, **Netlify** o **GitHub Pages**:

- **Build command**: `npm run build`
- **Output directory**: `dist`

## Contacto

- **Email**: [mjeremiasadriel@gmail.com](mailto:mjeremiasadriel@gmail.com)
- **GitHub**: [@jeremendoza01](https://github.com/jeremendoza01)
- **LinkedIn**: [linkedin.com/in/jeremendoza01](https://linkedin.com/in/jeremendoza01/)
- **Ubicación**: Villa Mercedes, San Luis, Argentina
