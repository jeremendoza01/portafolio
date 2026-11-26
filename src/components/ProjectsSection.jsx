import { useEffect, useMemo, useRef, useState } from 'react';
import { GH_REPOS_URL, LANG_COLORS } from '../data/portfolioData';

function TiltCard({ className = '', children }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const card = ref.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    card.style.setProperty('--rx', `${((0.5 - y / r.height) * 5).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${((x / r.width - 0.5) * 5).toFixed(2)}deg`);
    card.classList.add('tilting');
  };

  const onLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.classList.remove('tilting');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="explorar"
      className={`pcard group relative flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#111116] ${className}`}
    >
      {children}
    </article>
  );
}

function TopoSvg() {
  const paths = useMemo(() => {
    const ring = (cx, cy, r0, k, amp) => {
      let d = '';
      for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.14) {
        const r =
          r0 +
          Math.sin(a * 3 + k * 0.6) * amp +
          Math.sin(a * 5 - k * 0.9) * amp * 0.6 +
          Math.cos(a * 2 + k) * amp * 0.4;
        d += `${d ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r * 0.8).toFixed(1)}`;
      }
      return `${d}Z`;
    };
    const g1 = Array.from({ length: 13 }, (_, idx) => ring(170, 95, (idx + 1) * 11, idx + 1, 2 + (idx + 1) * 0.55));
    const g2 = Array.from({ length: 6 }, (_, idx) => ring(40, 185, (idx + 1) * 12, idx + 4, 2 + (idx + 1) * 0.5));
    return { g1, g2 };
  }, []);

  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <g className="topo-g">
        {paths.g1.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i % 3 === 2 ? 'rgba(255,255,255,.25)' : 'rgba(var(--acc-rgb),.5)'}
            strokeWidth="1"
          />
        ))}
      </g>
      <g>
        {paths.g2.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(var(--acc-rgb),.4)" strokeWidth="1" />
        ))}
      </g>
      <circle cx="170" cy="95" r="3" fill="var(--acc)" />
    </svg>
  );
}

function ProjectLink({ href, icon = 'bxl-github', label, cursor = 'código', primary = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor={cursor}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[12px] font-semibold transition-all ${
        primary
          ? 'border-[rgba(var(--acc-rgb),0.55)] bg-[rgba(var(--acc-rgb),0.12)] text-[var(--acc)] hover:bg-[var(--acc)] hover:text-black'
          : 'border-white/15 bg-white/[0.03] text-[#ecebe6] hover:border-[var(--acc)] hover:text-[var(--acc)]'
      }`}
    >
      <i className={`bx ${icon} text-[15px]`} />
      <span>{label}</span>
    </a>
  );
}

export default function ProjectsSection({ repos, onToast }) {
  const [lang, setLang] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [dogUrl, setDogUrl] = useState('');
  const [dogLoaded, setDogLoaded] = useState(false);
  const [dogBusy, setDogBusy] = useState(false);

  const LIMIT = 10;

  const langCounts = useMemo(() => {
    const counts = {};
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [repos]);

  const filtered = useMemo(
    () => repos.filter((r) => lang === 'all' || r.language === lang),
    [repos, lang]
  );

  const shown = expanded ? filtered : filtered.slice(0, LIMIT);

  const fetchDog = async () => {
    setDogBusy(true);
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await res.json();
      setDogLoaded(false);
      setDogUrl(data.message);
    } catch {
      setDogBusy(false);
      onToast?.('sin conexión con la API de perritos 🐶');
    }
  };

  useEffect(() => {
    setExpanded(false);
  }, [lang]);

  return (
    <section id="proyectos" data-state="2" className="relative mx-auto max-w-[1440px] px-[var(--pad)] py-[clamp(90px,13vh,150px)]">
      <div className="mb-[clamp(40px,6.5vh,72px)] flex flex-wrap items-baseline gap-x-5 gap-y-3.5 border-b border-white/10 pb-5">
        <span className="grid h-11 w-11 flex-none place-items-center self-center rounded-full border font-mono text-[13px]" style={{ borderColor: 'var(--acc)', color: 'var(--acc)' }}>
          03
        </span>
        <h2 className="font-display text-[clamp(32px,5.8vw,88px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
          Proyectos
        </h2>
        <a
          href={GH_REPOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="github"
          className="inline-flex w-full items-center gap-1.5 font-mono text-xs text-[#8d8d97] transition-colors hover:text-[var(--acc)] md:ml-auto md:w-auto"
        >
          <i className="bx bxl-github text-base" />
          <span>github.com/jeremendoza01?tab=repositories</span>
          <i className="bx bx-link-external text-sm" />
        </a>
      </div>

      {/* Bento grid sincronizado con los repositorios reales de GitHub */}
      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-3">
        {/* P-01 To-Do List v5 (Task Tracker) */}
        <TiltCard className="md:col-span-2">
          <div className="pvis-grid grid h-[230px] grid-cols-1 items-center gap-4 overflow-hidden border-b border-white/10 p-5 sm:grid-cols-[1.15fr_1fr] sm:p-6">
            <ul className="grid gap-2.5 font-mono text-[12.5px]">
              {[
                'Proyectos → Épicas → Historias → Tareas',
                'AuthProvider + rutas protegidas',
                'Dashboard con KPIs en tiempo real',
                'Persistencia en PostgreSQL (Supabase)',
              ].map((t, i) => (
                <li
                  key={t}
                  style={{ animationDelay: `${i}s` }}
                  className="todo-item flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-[#111116]/90 px-3 py-2"
                >
                  <i
                    style={{ animationDelay: `${i}s` }}
                    className="todo-box relative h-4 w-4 flex-none rounded-[5px] border-[1.5px] border-white/20"
                  />
                  <span className="truncate">{t}</span>
                </li>
              ))}
            </ul>
            <div className="hidden gap-2 rounded-xl border border-white/10 bg-[#050507] p-3.5 font-mono text-[11.5px] sm:grid">
              {[
                { m: 'GET', cls: 'text-[#5ce1ff]', path: '/my-projects/:epicId', code: '200' },
                { m: 'POST', cls: 'text-[var(--acc)]', path: '/my-stories/:storyId', code: '201' },
                { m: 'PUT', cls: 'text-[#ffd43b]', path: '/settings', code: '200' },
                { m: 'AUTH', cls: 'text-[#ff6b9d]', path: 'Supabase PostgreSQL', code: 'OK' },
              ].map((r, i) => (
                <span key={r.m} style={{ animationDelay: `${i}s` }} className="req-line flex items-center justify-between gap-2">
                  <span className="truncate">
                    <b className={`mr-1.5 ${r.cls}`}>{r.m}</b>
                    {r.path}
                  </span>
                  <em className="not-italic" style={{ color: 'var(--acc)' }}>
                    {r.code}
                  </em>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center justify-between gap-2 font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-01 · To-Do-List-v5</span>
              <span>Programación Web · UNViMe</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              <a
                href="https://github.com/jeremendoza01/To-Do-List-v5"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="github"
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--acc)]"
              >
                <span>Task Tracker · To-Do List v5</span>
                <i className="bx bx-right-top-arrow-circle text-[22px] opacity-70" />
              </a>
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Sistema de gestión de proyectos y tareas bajo estructura ágil jerárquica (Proyectos → Épicas → Historias de Usuario → Tareas), con autenticación de usuarios, rutas protegidas, dashboard de KPIs en tiempo real y persistencia en base de datos relacional PostgreSQL (Supabase).
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['React 18', 'Vite 5', 'React Router v6', 'Context API', 'Custom Hooks', 'Supabase / PostgreSQL', 'CSS3'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
              <ProjectLink
                href="https://github.com/jeremendoza01/To-Do-List-v5"
                icon="bxl-github"
                label="To-Do-List-v5"
                cursor="código"
                primary
              />
              <ProjectLink
                href="https://to-do-list-v5.vercel.app"
                icon="bx-link-external"
                label="demo en vivo"
                cursor="demo"
              />
            </div>
          </div>
        </TiltCard>

        {/* P-02 Simulador de Autómatas UNViMe */}
        <TiltCard>
          <div className="pvis-grid relative h-[230px] overflow-hidden border-b border-white/10">
            <svg viewBox="0 0 300 180" className="block h-full w-full" aria-hidden="true">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#8d8d97" />
                </marker>
              </defs>
              <path d="M78,80 Q115,45 152,80" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" markerEnd="url(#arr)" />
              <path d="M178,80 Q215,45 252,80" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" markerEnd="url(#arr)" />
              <path d="M252,100 Q165,165 78,100" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" markerEnd="url(#arr)" />
              <text x="115" y="50" textAnchor="middle" fill="var(--acc)" className="font-mono text-[11px]">a*</text>
              <text x="215" y="50" textAnchor="middle" fill="var(--acc)" className="font-mono text-[11px]">b+</text>
              <text x="165" y="150" textAnchor="middle" fill="var(--acc)" className="font-mono text-[11px]">ε</text>
              <circle cx="60" cy="90" r="18" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.5" />
              <circle cx="165" cy="90" r="18" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.5" />
              <circle cx="270" cy="90" r="18" fill="var(--bg)" stroke="var(--acc)" strokeWidth="1.5" />
              <circle cx="270" cy="90" r="13" fill="none" stroke="var(--acc)" strokeWidth="1.5" />
              <text x="60" y="95" textAnchor="middle" fill="var(--fg)" className="font-mono text-[11px]">q0</text>
              <text x="165" y="95" textAnchor="middle" fill="var(--fg)" className="font-mono text-[11px]">q1</text>
              <text x="270" y="95" textAnchor="middle" fill="var(--fg)" className="font-mono text-[11px]">q2</text>
              <circle r="5" fill="var(--acc)" style={{ filter: 'drop-shadow(0 0 6px var(--acc))' }}>
                <animateMotion
                  dur="4.5s"
                  repeatCount="indefinite"
                  keyPoints="0;0.2;0.26;0.47;0.52;1"
                  keyTimes="0;0.22;0.3;0.5;0.58;1"
                  calcMode="linear"
                  path="M78,80 Q115,45 152,80 L178,80 Q215,45 252,80 L252,100 Q165,165 78,100"
                />
              </circle>
            </svg>
            <span className="absolute bottom-3 left-3.5 rounded-md bg-[#0a0a0c]/85 px-2 py-0.5 font-mono text-[10.5px] text-[#8d8d97]">
              LL(1) → AST → AFN → AFD → .dot
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-02 · Teoría de la Computación</span>
              <span>2026</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              <a
                href="https://github.com/jeremendoza01/Simulador-Automatas-UNViMe"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="github"
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--acc)]"
              >
                <span>Simulador de Autómatas</span>
                <i className="bx bx-right-top-arrow-circle text-[22px] opacity-70" />
              </a>
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Motor en C para evaluar expresiones regulares: Parser LL(1), AST, construcción de Thompson (AFN), construcción de subconjuntos (AFD), Minigrep y exportación a Graphviz DOT.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['C', 'Parser LL(1)', 'Thompson AFN', 'Subconjuntos AFD', 'Graphviz DOT'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
              <ProjectLink
                href="https://github.com/jeremendoza01/Simulador-Automatas-UNViMe"
                icon="bxl-github"
                label="Simulador-Automatas-UNViMe"
                cursor="código"
                primary
              />
              <ProjectLink
                href="https://github.com/jeremendoza01/TdC-TP3"
                icon="bxl-github"
                label="TdC-TP3"
                cursor="código"
              />
            </div>
          </div>
        </TiltCard>

        {/* P-03 Simbiosis Geo */}
        <TiltCard>
          <div className="pvis-grid relative h-[230px] overflow-hidden border-b border-white/10">
            <TopoSvg />
            <span className="absolute bottom-3 left-3.5 rounded-md bg-[#0a0a0c]/80 px-2 py-0.5 font-mono text-[10.5px] text-[#8d8d97]">
              33°40′S · 65°27′O
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-03 · simbiosis</span>
              <span>2023 — 2024</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              <a
                href="https://github.com/jeremendoza01/simbiosis"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="github"
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--acc)]"
              >
                <span>Simbiosis Geo</span>
                <i className="bx bx-right-top-arrow-circle text-[22px] opacity-70" />
              </a>
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Web institucional responsive con catálogo de productos y flujo de despliegue automatizado (CI/CD) con GitHub Actions en Vercel y Zeabur.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['HTML5', 'CSS3', 'JavaScript', 'GitHub Actions', 'Vercel', 'Zeabur'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
              <ProjectLink
                href="https://github.com/jeremendoza01/simbiosis"
                icon="bxl-github"
                label="simbiosis"
                cursor="código"
                primary
              />
              <ProjectLink
                href="https://simbiosis-eta.vercel.app"
                icon="bx-link-external"
                label="demo en vivo"
                cursor="demo"
              />
            </div>
          </div>
        </TiltCard>

        {/* P-04 TP3: Ordenamiento y Estructuras sobre 100 Millones de Datos */}
        <TiltCard className="md:col-span-2">
          <div className="pvis-grid grid h-[230px] grid-cols-1 items-center gap-4 overflow-hidden border-b border-white/10 p-5 sm:grid-cols-[1.15fr_1fr] sm:p-6">
            <div className="grid gap-2.5 font-mono text-[12px]">
              {[
                { name: 'Counting Sort · 100M', comp: 'O(n + k)', w: '92%', acc: true },
                { name: 'Heap Sort · 10M in-place', comp: 'O(n log n)', w: '74%', acc: false },
                { name: 'Árbol AVL · búsqueda', comp: 'O(log n)', w: '96%', acc: true },
                { name: 'Max / Min Heap · raíz', comp: 'O(1)', w: '88%', acc: false },
              ].map((row) => (
                <div key={row.name} className="rounded-[10px] border border-white/10 bg-[#111116]/90 px-3 py-2">
                  <div className="mb-1 flex items-center justify-between text-[11.5px]">
                    <span className="truncate text-[#ecebe6]">{row.name}</span>
                    <span style={{ color: 'var(--acc)' }}>{row.comp}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: row.w,
                        background: row.acc ? 'var(--acc)' : 'rgba(92, 225, 255, 0.85)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden gap-2 rounded-xl border border-white/10 bg-[#050507] p-3.5 font-mono text-[11.5px] sm:grid">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[11px] text-[#8d8d97]">
                <span>$ python tp3.py</span>
                <span style={{ color: 'var(--acc)' }}>100.000.000 ints</span>
              </div>
              <span className="flex justify-between">
                <span className="text-[#8d8d97]">Counting Sort (100M)</span>
                <b style={{ color: 'var(--acc)' }}>≈ 70 s</b>
              </span>
              <span className="flex justify-between">
                <span className="text-[#8d8d97]">AVL Search (1M, h=24)</span>
                <b className="text-[#5ce1ff]">≈ 15 µs</b>
              </span>
              <span className="flex justify-between">
                <span className="text-[#8d8d97]">Max/Min Heap (10M)</span>
                <b className="text-[#ffd43b]">≈ 8 s</b>
              </span>
              <span className="flex justify-between text-[11px] text-[#8d8d97]">
                <span>Modos:</span>
                <span className="text-[#ecebe6]">Web Lab · Tkinter · CLI</span>
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-04 · tp3</span>
              <span>Análisis y Diseño de Algoritmos · 2026</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              <a
                href="https://github.com/jeremendoza01/tp3"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="github"
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--acc)]"
              >
                <span>Ordenamiento y Estructuras · 100M de Datos</span>
                <i className="bx bx-right-top-arrow-circle text-[22px] opacity-70" />
              </a>
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Benchmark empírico y teórico sobre 100 millones de números aleatorios en Python: Counting Sort, Heap Sort y Selection Sort, junto a implementaciones propias de Árbol AVL y Max/Min Heap. Incluye Laboratorio Web interactivo en Vercel, GUI en Tkinter y tests unitarios.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['Python', 'JavaScript', 'Counting & Heap Sort', 'Árbol AVL', 'Max/Min Heap', 'Tkinter GUI', 'Vercel'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
              <ProjectLink
                href="https://github.com/jeremendoza01/tp3"
                icon="bxl-github"
                label="tp3"
                cursor="código"
                primary
              />
              <ProjectLink
                href="https://tp3-one.vercel.app"
                icon="bx-link-external"
                label="laboratorio web (demo)"
                cursor="demo"
              />
            </div>
          </div>
        </TiltCard>

        {/* P-05 Sistema de Trabajadores */}
        <TiltCard>
          <div className="pvis-grid flex h-[230px] flex-col justify-end gap-3.5 overflow-hidden border-b border-white/10 p-5">
            <div className="flex h-[140px] items-end gap-2">
              {[
                { h: '40%', d: '-0.2s' },
                { h: '75%', d: '-0.9s' },
                { h: '55%', d: '-1.4s' },
                { h: '95%', d: '-0.5s', alert: true },
                { h: '35%', d: '-1.8s' },
                { h: '65%', d: '-1.1s' },
                { h: '50%', d: '-0.3s' },
              ].map((b, i) => (
                <i
                  key={i}
                  className="stress-bar flex-1 rounded-t-md rounded-b-sm"
                  style={{
                    height: b.h,
                    animationDelay: b.d,
                    background: b.alert
                      ? 'linear-gradient(#ff6b6b, rgba(255,107,107,.15))'
                      : 'linear-gradient(var(--acc), rgba(var(--acc-rgb),.15))',
                  }}
                />
              ))}
            </div>
            <code className="font-mono text-xs text-[#8d8d97]">$ ./trabajadores --estres</code>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-05 · Sistema-de-Trabajadores</span>
              <span>2022 — 2024</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              <a
                href="https://github.com/jeremendoza01/Sistema-de-Trabajadores"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="github"
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--acc)]"
              >
                <span>Sistema de Trabajadores</span>
                <i className="bx bx-right-top-arrow-circle text-[22px] opacity-70" />
              </a>
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Sistema en C que modela estructuras de tareas, complejidad laboral y cálculo del nivel de estrés de los trabajadores según su área.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['C', 'Structs', 'Estructuras de datos'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
              <ProjectLink
                href="https://github.com/jeremendoza01/Sistema-de-Trabajadores"
                icon="bxl-github"
                label="Sistema-de-Trabajadores"
                cursor="código"
                primary
              />
            </div>
          </div>
        </TiltCard>

        {/* P-06 Perritos Aleatorios */}
        <TiltCard>
          <div className="pvis-grid relative grid h-[230px] place-items-center overflow-hidden border-b border-white/10">
            <pre
              className={`font-mono text-xs leading-7 text-[#8d8d97] transition-opacity duration-300 ${
                dogLoaded ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {`{\n  `}
              <b className="font-medium text-[#5ce1ff]">"message"</b>
              {`: `}
              <span style={{ color: 'var(--acc)' }}>"https://images.dog.ceo/…"</span>
              {`,\n  `}
              <b className="font-medium text-[#5ce1ff]">"status"</b>
              {`: `}
              <span style={{ color: 'var(--acc)' }}>"success"</span>
              {`\n}`}
            </pre>
            {dogUrl && (
              <img
                src={dogUrl}
                alt="Perrito aleatorio"
                onLoad={() => {
                  setDogLoaded(true);
                  setDogBusy(false);
                }}
                onError={() => {
                  setDogBusy(false);
                  onToast?.('el perrito se escapó 🐕 probá de nuevo');
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                  dogLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                }`}
              />
            )}
            <button
              type="button"
              onClick={fetchDog}
              data-cursor="fetch()"
              className="absolute bottom-3.5 right-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-xs font-bold text-black transition-transform hover:scale-105"
              style={{ background: 'var(--acc)' }}
            >
              <i className={`bx bxs-dog ${dogBusy ? 'animate-spin' : ''}`} />
              {dogUrl ? 'otro perrito' : 'traer perrito'}
            </button>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-06 · perritosaleatorios</span>
              <span>2023</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              <a
                href="https://github.com/jeremendoza01/perritosaleatorios"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="github"
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--acc)]"
              >
                <span>Perritos Aleatorios</span>
                <i className="bx bx-right-top-arrow-circle text-[22px] opacity-70" />
              </a>
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Consumo de la API pública Dog CEO con Fetch API para generar perros al azar. Probalo acá mismo ↑
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['JavaScript', 'Fetch API', 'CSS3', 'Vercel'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
              <ProjectLink
                href="https://github.com/jeremendoza01/perritosaleatorios"
                icon="bxl-github"
                label="perritosaleatorios"
                cursor="código"
                primary
              />
              <ProjectLink
                href="https://perritosaleatorios.vercel.app"
                icon="bx-link-external"
                label="demo"
                cursor="demo"
              />
              <ProjectLink
                href="https://github.com/jeremendoza01/gatitosaleatorios"
                icon="bxl-github"
                label="gatitos"
                cursor="código"
              />
            </div>
          </div>
        </TiltCard>

        {/* CTA GitHub Repositories */}
        <a
          href={GH_REPOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="github"
          style={{ background: 'var(--acc)', borderColor: 'var(--acc)' }}
          className="group flex min-h-[320px] flex-col justify-between rounded-[22px] border p-7 text-black"
        >
          <div className="flex items-center justify-between">
            <i className="bx bxl-github text-[64px] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
            <span className="rounded-full border border-black/20 bg-black/10 px-3 py-1 font-mono text-xs font-bold">
              {repos.length}+ repos
            </span>
          </div>
          <span className="font-display text-[clamp(28px,2.8vw,42px)] font-extrabold leading-[0.98] tracking-[-0.03em]">
            Todos los
            <br />
            repositorios
            <br />
            en GitHub
          </span>
          <span className="flex items-center justify-between font-mono text-sm font-bold">
            github.com/jeremendoza01
            <i className="bx bx-right-top-arrow-circle text-[26px] transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </a>
      </div>

      {/* Archivo completo de repositorios de GitHub con link directo en cada uno */}
      <div className="mt-20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-mono text-[15px] font-medium">
              <span style={{ color: 'var(--acc)' }}>$</span> ls ~/github/jeremendoza01 --sort=updated
            </h3>
            <a
              href={GH_REPOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="github"
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-[#8d8d97] transition-colors hover:border-[var(--acc)] hover:text-[var(--acc)]"
            >
              <i className="bx bxl-github" />
              <span>ver perfil en GitHub</span>
              <i className="bx bx-link-external" />
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLang('all')}
              data-cursor="filtrar"
              className="rounded-full border px-3 py-1 font-mono text-[11.5px] font-medium transition-colors"
              style={
                lang === 'all'
                  ? { background: 'var(--acc)', borderColor: 'var(--acc)', color: '#000' }
                  : { borderColor: 'var(--line-2)', color: 'var(--mute)' }
              }
            >
              todos<span className="ml-1 opacity-60">{repos.length}</span>
            </button>
            {langCounts.map(([l, count]) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                data-cursor="filtrar"
                className="rounded-full border px-3 py-1 font-mono text-[11.5px] font-medium transition-colors"
                style={
                  lang === l
                    ? { background: 'var(--acc)', borderColor: 'var(--acc)', color: '#000' }
                    : { borderColor: 'var(--line-2)', color: 'var(--mute)' }
                }
              >
                {l}
                <span className="ml-1 opacity-60">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10" aria-live="polite">
          {shown.map((r, i) => (
            <div
              key={r.name}
              style={{ animationDelay: `${i * 30}ms` }}
              className="arow group grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-white/10 px-3 py-4 transition-colors hover:bg-white/[0.03] md:grid-cols-[90px_1.25fr_130px_2fr_auto] md:gap-4"
            >
              <span className="col-start-1 row-start-2 font-mono text-xs text-[#8d8d97] md:row-start-1">{r.date}</span>
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="código"
                className="inline-flex items-center gap-1.5 font-bold transition-all group-hover:translate-x-1 group-hover:text-[var(--acc)]"
              >
                <span>{r.name}</span>
                <i className="bx bx-link-external text-xs opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <span className="hidden items-center gap-2 font-mono text-xs text-[#8d8d97] md:flex">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || '#888' }} />
                {r.language || '—'}
              </span>
              <span className="hidden truncate text-sm text-[#8d8d97] lg:block">{r.description || 'Repositorio en GitHub'}</span>
              <span className="col-start-2 row-span-2 flex items-center gap-2 md:col-start-auto md:row-span-1">
                {r.homepage && (
                  <a
                    href={r.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="demo"
                    aria-label={`Demo de ${r.name}`}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-white/10 px-3 font-mono text-xs transition-colors hover:border-[var(--acc)] hover:bg-[var(--acc)] hover:text-black"
                  >
                    <i className="bx bx-link-external text-sm" />
                    <span className="hidden sm:inline">demo</span>
                  </a>
                )}
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="código"
                  aria-label={`Repositorio GitHub de ${r.name}`}
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-white/10 px-3 font-mono text-xs transition-colors hover:border-[var(--acc)] hover:bg-[var(--acc)] hover:text-black"
                >
                  <i className="bx bxl-github text-sm" />
                  <span>github</span>
                </a>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {filtered.length > LIMIT && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              data-cursor="más"
              className="btn-sweep btn-sweep-ghost inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold"
            >
              {expanded ? 'ver menos' : `ver todos los repositorios (${filtered.length})`}
            </button>
          )}
          <a
            href={GH_REPOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="github"
            className="btn-sweep btn-sweep-ghost inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-xs font-semibold text-[#8d8d97]"
          >
            <i className="bx bxl-github text-base" />
            <span>abrir github.com/jeremendoza01?tab=repositories</span>
            <i className="bx bx-right-top-arrow-circle text-base" />
          </a>
        </div>
      </div>
    </section>
  );
}
