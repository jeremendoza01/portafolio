export const ACCENTS = [
  { name: 'lima', hex: '#c8ff2e', rgb: '200, 255, 46' },
  { name: 'ámbar ampli', hex: '#ffb534', rgb: '255, 181, 52' },
  { name: 'rojo rock', hex: '#ff4d4d', rgb: '255, 77, 77' },
  { name: 'cian', hex: '#34f5ff', rgb: '52, 245, 255' },
  { name: 'violeta', hex: '#a98bff', rgb: '169, 139, 255' },
];

export const SECTIONS = [
  { id: 'inicio', num: '01', label: 'inicio' },
  { id: 'sobre-mi', num: '02', label: 'sobre mí' },
  { id: 'proyectos', num: '03', label: 'proyectos' },
  { id: 'stack', num: '04', label: 'stack' },
  { id: 'academia', num: '05', label: 'historia académica' },
  { id: 'contacto', num: '06', label: 'contacto' },
];

export const TYPED_ROLES = [
  'full stack con React & Node.',
  'frontend con Tailwind CSS.',
  'backend con Express & APIs REST.',
  'apasionado por el rock argentino y las guitarras.',
  'enfocado en código limpio.',
];

// Progresión "De Música Ligera" (Bm - G - D - A) + acordes abiertos
export const HERO_CHORDS = [
  { name: 'Bm · De Música Ligera', freqs: [123.47, 123.47, 185.0, 246.94, 293.66, 369.99] },
  { name: 'G · De Música Ligera', freqs: [98.0, 123.47, 146.83, 196.0, 246.94, 392.0] },
  { name: 'D · De Música Ligera', freqs: [110.0, 146.83, 146.83, 220.0, 293.66, 369.99] },
  { name: 'A · De Música Ligera', freqs: [110.0, 110.0, 164.81, 220.0, 277.18, 329.63] },
  { name: 'Em9 · Rock Open', freqs: [82.41, 123.47, 164.81, 196.0, 246.94, 369.99] },
];

export const EXPERIENCE = [
  {
    role: 'Asesor de Ventas',
    company: 'CAM-Metalúrgica',
    period: '02/2026 — 04/2026',
    desc: 'Asesoramiento comercial en el sector metalúrgico, atención directa y seguimiento de clientes aplicando comunicación efectiva.',
  },
  {
    role: 'Encargado de atención y stock',
    company: 'Casa de Repuestos',
    period: '01/2022 — 08/2022',
    desc: 'Asesoramiento técnico a clientes, gestión de pedidos de repuestos, control de stock y operación del sistema de facturación.',
  },
];

export const ACADEMIC_PROGRAMS = [
  {
    badge: '2021 — PRESENTE',
    meta: 'UNViMe · 5° año',
    title: 'Ingeniería en Sistemas de Información',
    place: 'Universidad Nacional de Villa Mercedes',
    progressLabel: 'Avance de carrera',
    percent: 60,
    percentText: '60%',
    approved: 27,
    avgNoFails: '7.22',
    avgWithFails: '6.06',
  },
  {
    badge: 'TÍTULO INTERMEDIO',
    meta: 'a 4 materias',
    title: 'Analista Universitario en Sistemas',
    place: 'Universidad Nacional de Villa Mercedes',
    progressLabel: 'Avance del título',
    percent: 85.71,
    percentText: '85.71%',
    approved: 24,
    avgNoFails: '7.21',
    avgWithFails: '5.94',
  },
];

export const RELEVANT_SUBJECTS = [
  'Algoritmos y Estructuras de Datos',
  'Arquitectura de Computadoras',
  'Ingeniería de Software I y II',
  'Inteligencia Artificial',
  'Bases de Datos',
  'Teoría de la Computación',
];

export const GH_USER = 'jeremendoza01';
export const GH_REPOS_URL = `https://github.com/${GH_USER}?tab=repositories`;

export const FEATURED_REPOS = [
  'to-do-list-v5',
  'api',
  'simulador-automatas-unvime',
  'tdc-tp3',
  'simbiosis',
  'tp3',
  'sistema-de-trabajadores',
  'perritosaleatorios',
];

export const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  CSS: '#663399',
  HTML: '#e34c26',
  C: '#a8b9cc',
  Java: '#b07219',
  Python: '#3572A5',
};

export const REPO_META = {
  'To-Do-List-v5': {
    language: 'JavaScript',
    homepage: 'https://to-do-list-v5.vercel.app',
    description: 'Task Tracker: gestión ágil jerárquica (Proyectos → Épicas → Historias → Tareas) con React, Context API y Supabase PostgreSQL.',
  },
  'Simulador-Automatas-UNViMe': {
    language: 'C',
    homepage: '',
    description: 'Motor en C de expresiones regulares: Parser LL(1) → AST → AFN (Thompson) → AFD (Subconjuntos), Minigrep y Graphviz DOT.',
  },
  tp3: {
    language: 'Python',
    homepage: 'https://tp3-one.vercel.app',
    description: 'Ordenamiento y estructuras sobre 100M de datos (Counting, Heap y Selection Sort, Árbol AVL y Max/Min Heap) en Python + Web Lab + GUI.',
  },
  'TdC-TP3': {
    language: 'C',
    homepage: '',
    description: 'Simulador interactivo de Autómatas Finitos No Deterministas (AFN) desde expresiones regulares con el Algoritmo de Thompson.',
  },
  portfolio: {
    language: 'JavaScript',
    homepage: 'https://portafolio-two-zeta-67.vercel.app',
    description: 'Portfolio interactivo con React 19, Tailwind CSS v4, síntesis Karplus-Strong en Web Audio API y física Verlet.',
  },
  api: {
    language: 'JavaScript',
    homepage: '',
    description: 'API REST con Node.js, Express, MongoDB (Mongoose), autenticación JWT y bcrypt para gestión de proyectos y tareas.',
  },
  simbiosis: {
    language: 'CSS',
    homepage: 'https://simbiosis-eta.vercel.app',
    description: 'Web institucional responsive y catálogo para Simbiosis Geo con CI/CD en GitHub Actions, Vercel y Zeabur.',
  },
  'Sistema-de-Trabajadores': {
    language: 'C',
    homepage: '',
    description: 'Sistema en C que modela tareas, niveles de complejidad laboral y cálculo de estrés por sector.',
  },
  Rick: {
    language: 'JavaScript',
    homepage: 'https://rick-zeta.vercel.app',
    description: 'Explorador web de personajes de Rick and Morty consumiendo API externa.',
  },
  'List-App': {
    language: 'JavaScript',
    homepage: 'https://list-app-murex.vercel.app',
    description: 'Aplicación de listas de tareas construida con React y Vite.',
  },
  'List-App-v2': {
    language: 'JavaScript',
    homepage: 'https://list-app-v2.vercel.app',
    description: 'Segunda iteración de la app de listas con React, Vite y mejoras de interfaz.',
  },
  'To-Do-List-v3': {
    language: 'JavaScript',
    homepage: 'https://to-do-list-v3-pi.vercel.app',
    description: 'Tercera versión del gestor de tareas en React + Vite desplegada en Vercel.',
  },
  'reloj-js': {
    language: 'JavaScript',
    homepage: '',
    description: 'Reloj digital en tiempo real desarrollado con HTML, CSS y JavaScript vanilla.',
  },
  perritosaleatorios: {
    language: 'JavaScript',
    homepage: 'https://perritosaleatorios.vercel.app',
    description: 'Generador de perritos al azar consumiendo la API pública Dog CEO con Fetch API.',
  },
  gatitosaleatorios: {
    language: 'JavaScript',
    homepage: '',
    description: 'Generador de gatitos aleatorios mediante consumo de API REST con Fetch.',
  },
  Proyecto: {
    language: 'TypeScript',
    homepage: '',
    description: 'Proyecto web frontend estructurado con Angular y TypeScript.',
  },
  AVL: {
    language: 'Java',
    homepage: '',
    description: 'Implementación de Árbol AVL autobalanceado con rotaciones simples y dobles en Java.',
  },
  agenda2: {
    language: 'Java',
    homepage: '',
    description: 'Sistema de agenda y gestión de contactos implementado en Java aplicando POO.',
  },
  Casarural: {
    language: 'Java',
    homepage: '',
    description: 'Gestión de casas rurales en Java utilizando tablas de dispersión (Hash Tables).',
  },
  Tareas1: {
    language: 'Java',
    homepage: '',
    description: 'Práctica de estructuras de datos y gestión de tareas en Java.',
  },
  arbolBinario: {
    language: 'Java',
    homepage: '',
    description: 'Implementación de Árbol Binario de Búsqueda y recorridos (preorden, inorden, postorden) en Java.',
  },
  'ejercicioo12.7-': {
    language: 'Java',
    homepage: '',
    description: 'Resolución práctica 12.7 de estructuras de datos y dispersión en Java.',
  },
  'Ejercicio12.7': {
    language: 'Java',
    homepage: '',
    description: 'Implementación de tabla dispersa y manejo de colisiones en Java (Ejercicio 12.7).',
  },
  'TablaDispersa12.5': {
    language: 'Java',
    homepage: '',
    description: 'Implementación de Tabla Dispersa (Hash Table) con direccionamiento en Java (Ejercicio 12.5).',
  },
  jeremendoza01: {
    language: 'Markdown',
    homepage: 'https://github.com/jeremendoza01',
    description: 'Configuración y README de mi perfil de GitHub.',
  },
};

export const FALLBACK_REPOS = [
  ['To-Do-List-v5', 'JavaScript', '2026-11', 'https://to-do-list-v5.vercel.app'],
  ['portfolio', 'JavaScript', '2026-11', 'https://portafolio-two-zeta-67.vercel.app'],
  ['tp3', 'Python', '2026-11', 'https://tp3-one.vercel.app'],
  ['TdC-TP3', 'C', '2026-06', ''],
  ['Simulador-Automatas-UNViMe', 'C', '2026-06', ''],
  ['api', 'JavaScript', '2025-04', ''],
  ['simbiosis', 'CSS', '2024-09', 'https://simbiosis-eta.vercel.app'],
  ['Sistema-de-Trabajadores', 'C', '2024-09', ''],
  ['Rick', 'JavaScript', '2024-09', 'https://rick-zeta.vercel.app'],
  ['List-App', 'JavaScript', '2024-09', 'https://list-app-murex.vercel.app'],
  ['List-App-v2', 'JavaScript', '2024-09', 'https://list-app-v2.vercel.app'],
  ['To-Do-List-v3', 'JavaScript', '2024-09', 'https://to-do-list-v3-pi.vercel.app'],
  ['reloj-js', 'JavaScript', '2024-03', ''],
  ['perritosaleatorios', 'JavaScript', '2023-10', 'https://perritosaleatorios.vercel.app'],
  ['gatitosaleatorios', 'JavaScript', '2023-06', ''],
  ['Proyecto', 'TypeScript', '2023-05', ''],
  ['AVL', 'Java', '2022-06', ''],
  ['agenda2', 'Java', '2022-06', ''],
  ['Casarural', 'Java', '2022-06', ''],
  ['Tareas1', 'Java', '2022-06', ''],
  ['arbolBinario', 'Java', '2022-06', ''],
  ['ejercicioo12.7-', 'Java', '2022-06', ''],
  ['Ejercicio12.7', 'Java', '2022-05', ''],
  ['TablaDispersa12.5', 'Java', '2022-05', ''],
].map(([name, language, date, homepage]) => ({
  name,
  language: REPO_META[name]?.language || language,
  date,
  homepage: REPO_META[name]?.homepage || homepage,
  description: REPO_META[name]?.description || '',
  html_url: `https://github.com/${GH_USER}/${name}`,
}));

export const STACK_CATS = {
  lang: 'lenguaje',
  fw: 'framework / runtime',
  db: 'base de datos',
  tool: 'herramienta',
};

export const WHITE_KEYS = [
  { name: 'JavaScript', cat: 'lang', desc: 'Mi lenguaje principal: del DOM a la API.', midi: 60, hot: 'z' },
  { name: 'TypeScript', cat: 'lang', desc: 'Tipado estático para código que escala.', midi: 62, hot: 'x' },
  { name: 'Python', cat: 'lang', desc: 'Scripts, algoritmos y resolución de problemas.', midi: 64, hot: 'c' },
  { name: 'C', cat: 'lang', desc: 'Bajo nivel, memoria y simuladores.', midi: 65, hot: 'v' },
  { name: 'Java', cat: 'lang', desc: 'POO, árboles AVL y estructuras de datos.', midi: 67, hot: 'b' },
  { name: 'HTML', cat: 'lang', desc: 'Semántica y accesibilidad como base.', midi: 69, hot: 'n' },
  { name: 'CSS', cat: 'lang', desc: 'Layouts, animaciones y diseño responsive.', midi: 71, hot: 'm' },
  { name: 'React', cat: 'fw', desc: 'Hooks personalizados, componentes y Context API.', midi: 72, hot: 'q' },
  { name: 'Node.js', cat: 'fw', desc: 'JavaScript del lado del servidor.', midi: 74, hot: 'w' },
  { name: 'Express', cat: 'fw', desc: 'APIs REST como la de To-Do List v5.', midi: 76, hot: 'e' },
  { name: 'Tailwind', cat: 'fw', desc: 'Utility-first para iterar rápido y prolijo.', midi: 77, hot: 'r' },
  { name: 'MySQL', cat: 'db', desc: 'Modelado relacional y SQL.', midi: 79, hot: 't' },
  { name: 'PostgreSQL', cat: 'db', desc: 'Relacional robusta para producción.', midi: 81, hot: 'y' },
  { name: 'MongoDB', cat: 'db', desc: 'Documentos NoSQL flexibles.', midi: 83, hot: 'u' },
];

export const BLACK_KEYS = [
  { name: 'Git', cat: 'tool', desc: 'Control de versiones, ramas y merges.', midi: 61, hot: 's', pos: 0 },
  { name: 'GitHub', cat: 'tool', desc: '25+ repositorios públicos.', midi: 63, hot: 'd', pos: 1 },
  { name: 'Docker', cat: 'tool', desc: 'Contenedores y entornos reproducibles.', midi: 66, hot: 'g', pos: 3 },
  { name: 'Postman', cat: 'tool', desc: 'Testing y documentación de APIs.', midi: 68, hot: 'h', pos: 4 },
  { name: 'GH Actions', cat: 'tool', desc: 'CI/CD automatizado (Simbiosis Geo).', midi: 70, hot: 'j', pos: 5 },
  { name: 'APIs REST', cat: 'tool', desc: 'Diseño, integración y consumo de APIs.', midi: 73, hot: '2', pos: 7 },
  { name: 'Vercel', cat: 'tool', desc: 'Deploys de frontends en segundos.', midi: 75, hot: '3', pos: 8 },
  { name: 'Zeabur', cat: 'tool', desc: 'Hosting cloud para Simbiosis Geo.', midi: 78, hot: '5', pos: 10 },
  { name: 'Supabase', cat: 'tool', desc: 'PostgreSQL y BaaS en Task Tracker (To-Do v5).', midi: 80, hot: '6', pos: 11 },
  { name: 'JWT & Auth', cat: 'tool', desc: 'Autenticación con tokens y rutas protegidas.', midi: 82, hot: '7', pos: 12 },
];

export const SOFT_SKILLS = [
  'Compromiso',
  'Proactividad',
  'Trabajo en equipo',
  'Creatividad',
  'Resolución de problemas',
  'Comunicación',
];
