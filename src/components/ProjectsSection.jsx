import { useEffect, useMemo, useRef, useState } from 'react';
import { LANG_COLORS } from '../data/portfolioData';

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

export default function ProjectsSection({ repos, onToast }) {
  const [lang, setLang] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [dogUrl, setDogUrl] = useState('');
  const [dogLoaded, setDogLoaded] = useState(false);
  const [dogBusy, setDogBusy] = useState(false);

  const LIMIT = 8;

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
        <span className="w-full font-mono text-xs text-[#8d8d97] md:ml-auto md:w-auto">selección · github</span>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-3">
        {/* P-01 Roja Directa */}
        <TiltCard className="md:col-span-2">
          <div
            className="relative h-[230px] overflow-hidden border-b border-white/10"
            style={{ background: 'radial-gradient(ellipse at center, #10200f 0%, var(--bg) 75%)' }}
          >
            <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
              <g className="pitch-lines">
                <rect x="20" y="15" width="360" height="170" rx="4" />
                <line x1="200" y1="15" x2="200" y2="185" />
                <circle cx="200" cy="100" r="28" />
                <rect x="20" y="60" width="44" height="80" />
                <rect x="336" y="60" width="44" height="80" />
              </g>
              <path id="ballpath" d="M60,100 C120,30 170,160 230,70 S330,140 345,100 S250,40 150,130 S80,120 60,100" fill="none" />
              <circle r="6" fill="var(--acc)" style={{ filter: 'drop-shadow(0 0 8px var(--acc))' }}>
                <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#ballpath" />
                </animateMotion>
              </circle>
            </svg>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 font-mono text-[11px]">
              <span className="rounded-lg border border-white/15 bg-[#0a0a0c]/80 px-2.5 py-1 backdrop-blur">18:00</span>
              <span className="rounded-lg border border-white/15 bg-[#0a0a0c]/80 px-2.5 py-1 text-[#8d8d97] line-through opacity-60">19:00</span>
              <span className="rounded-lg border border-white/15 bg-[#0a0a0c]/80 px-2.5 py-1 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--acc)] group-hover:bg-[var(--acc)] group-hover:text-black">
                20:00
              </span>
              <span className="rounded-lg border border-white/15 bg-[#0a0a0c]/80 px-2.5 py-1 backdrop-blur">21:00</span>
              <span className="rounded-lg border border-white/15 bg-[#0a0a0c]/80 px-2.5 py-1 text-[#8d8d97] line-through opacity-60">22:00</span>
            </div>
            <span className="absolute right-4 top-4 inline-flex -translate-y-2.5 scale-95 items-center gap-1.5 rounded-full bg-[#009ee3] px-3 py-1.5 font-mono text-[11px] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
              <i className="bx bx-check-circle" /> pago aprobado · Mercado Pago
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-01</span>
              <span>08/2024 — 11/2024</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              Roja Directa
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              App web para reservar canchas: turnos en tiempo real, autenticación de usuarios con tokens y pagos integrados con Mercado Pago.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['React', 'Custom Hooks', 'Context API', 'Auth con tokens', 'Mercado Pago'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </TiltCard>

        {/* P-02 Simbiosis Geo */}
        <TiltCard>
          <div className="pvis-grid relative h-[230px] overflow-hidden border-b border-white/10">
            <TopoSvg />
            <span className="absolute bottom-3 left-3.5 rounded-md bg-[#0a0a0c]/80 px-2 py-0.5 font-mono text-[10.5px] text-[#8d8d97]">
              33°40′S · 65°27′O
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-02</span>
              <span>2023 — 2024</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              Simbiosis Geo
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Web institucional responsive con catálogo de productos y despliegue automatizado.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['HTML', 'CSS', 'JavaScript', 'GitHub Actions', 'Vercel', 'Zeabur'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-4 pt-5 font-mono text-[13px] font-medium">
              <a href="https://simbiosis-eta.vercel.app" target="_blank" rel="noopener noreferrer" data-cursor="demo" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bx-link-external" /> demo
              </a>
              <a href="https://github.com/jeremendoza01/simbiosis" target="_blank" rel="noopener noreferrer" data-cursor="código" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bxl-github" /> código
              </a>
            </div>
          </div>
        </TiltCard>

        {/* P-03 Simulador de Autómatas */}
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
              <text x="115" y="50" textAnchor="middle" fill="var(--acc)" className="font-mono text-[11px]">a</text>
              <text x="215" y="50" textAnchor="middle" fill="var(--acc)" className="font-mono text-[11px]">b</text>
              <text x="165" y="150" textAnchor="middle" fill="var(--acc)" className="font-mono text-[11px]">c</text>
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
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-03</span>
              <span>2026</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              Simulador de Autómatas
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Simulador de autómatas finitos escrito en C para evaluar cadenas y transiciones de estados.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['C', 'Autómatas', 'Algoritmos'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-4 pt-5 font-mono text-[13px] font-medium">
              <a href="https://github.com/jeremendoza01/Simulador-Automatas-UNViMe" target="_blank" rel="noopener noreferrer" data-cursor="código" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bxl-github" /> código
              </a>
            </div>
          </div>
        </TiltCard>

        {/* P-04 To-Do v5 + API */}
        <TiltCard className="md:col-span-2">
          <div className="pvis-grid grid h-[230px] grid-cols-1 items-center gap-4 overflow-hidden border-b border-white/10 p-5 sm:grid-cols-[1.1fr_1fr] sm:p-6">
            <ul className="grid gap-2.5 font-mono text-[13px]">
              {['diseñar la API REST', 'conectar frontend ↔ backend', 'deploy en Vercel', 'tomar mate 🧉'].map((t, i) => (
                <li
                  key={t}
                  style={{ animationDelay: `${i}s` }}
                  className="todo-item flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-[#111116]/90 px-3 py-2"
                >
                  <i
                    style={{ animationDelay: `${i}s` }}
                    className="todo-box relative h-4 w-4 flex-none rounded-[5px] border-[1.5px] border-white/20"
                  />
                  {t}
                </li>
              ))}
            </ul>
            <div className="hidden gap-2 rounded-xl border border-white/10 bg-[#050507] p-3.5 font-mono text-[11.5px] sm:grid">
              {[
                { m: 'GET', cls: 'text-[#5ce1ff]', path: '/api/tasks', code: '200' },
                { m: 'POST', cls: 'text-[var(--acc)]', path: '/api/tasks', code: '201' },
                { m: 'PUT', cls: 'text-[#ffd43b]', path: '/api/tasks/3', code: '200' },
                { m: 'DELETE', cls: 'text-[#ff6b6b]', path: '/api/tasks/4', code: '204' },
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
            <div className="flex justify-between font-mono text-[11.5px] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>P-04</span>
              <span>2025</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              To-Do List v5 + API
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Quinta iteración de mi gestor de tareas: frontend desplegado en Vercel y una API REST propia construida con Express.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['JavaScript', 'Node.js', 'Express', 'API REST', 'Vercel'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-4 pt-5 font-mono text-[13px] font-medium">
              <a href="https://to-do-list-v5.vercel.app" target="_blank" rel="noopener noreferrer" data-cursor="demo" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bx-link-external" /> demo
              </a>
              <a href="https://github.com/jeremendoza01/To-Do-List-v5" target="_blank" rel="noopener noreferrer" data-cursor="código" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bxl-github" /> frontend
              </a>
              <a href="https://github.com/jeremendoza01/To-Do-List-v5-api" target="_blank" rel="noopener noreferrer" data-cursor="código" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bxl-github" /> api
              </a>
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
              <span style={{ color: 'var(--acc)' }}>P-05</span>
              <span>2024</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              Sistema de Trabajadores
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Sistema en C que regula la complejidad laboral y el nivel de estrés de los trabajadores.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['C', 'Estructuras de datos'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-4 pt-5 font-mono text-[13px] font-medium">
              <a href="https://github.com/jeremendoza01/Sistema-de-Trabajadores" target="_blank" rel="noopener noreferrer" data-cursor="código" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bxl-github" /> código
              </a>
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
              <span style={{ color: 'var(--acc)' }}>P-06</span>
              <span>2023</span>
            </div>
            <h3 className="my-2.5 font-display text-[clamp(24px,2.3vw,32px)] font-bold leading-[1.05] tracking-[-0.02em]">
              Perritos Aleatorios
            </h3>
            <p className="text-[15px] text-[#8d8d97]">
              Consumo de una API pública para generar perros al azar. Probalo acá mismo ↑
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['JavaScript', 'Fetch API', 'CSS'].map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#c4c4cb]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-4 pt-5 font-mono text-[13px] font-medium">
              <a href="https://perritosaleatorios.vercel.app" target="_blank" rel="noopener noreferrer" data-cursor="demo" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bx-link-external" /> demo
              </a>
              <a href="https://github.com/jeremendoza01/perritosaleatorios" target="_blank" rel="noopener noreferrer" data-cursor="código" className="inline-flex items-center gap-1.5 hover:text-[var(--acc)]">
                <i className="bx bxl-github" /> código
              </a>
            </div>
          </div>
        </TiltCard>

        {/* CTA GitHub */}
        <a
          href="https://github.com/jeremendoza01"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="github"
          style={{ background: 'var(--acc)', borderColor: 'var(--acc)' }}
          className="group flex min-h-[320px] flex-col justify-between rounded-[22px] border p-7 text-black"
        >
          <i className="bx bxl-github text-[64px] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
          <span className="font-display text-[clamp(30px,3vw,44px)] font-extrabold leading-[0.98] tracking-[-0.03em]">
            Todo el código
            <br />
            en GitHub
          </span>
          <span className="flex items-center justify-between font-mono text-sm font-bold">
            @jeremendoza01
            <i className="bx bx-right-top-arrow-circle text-[26px] transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </a>
      </div>

      {/* Archivo dinámico desde GitHub */}
      <div className="mt-20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-mono text-[15px] font-medium">
            <span style={{ color: 'var(--acc)' }}>$</span> ls ~/github --sort=updated
          </h3>
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
              style={{ animationDelay: `${i * 35}ms` }}
              className="arow group grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-white/10 px-3 py-4 transition-colors hover:bg-white/[0.03] md:grid-cols-[90px_1.2fr_130px_2fr_auto] md:gap-4"
            >
              <span className="col-start-1 row-start-2 font-mono text-xs text-[#8d8d97] md:row-start-1">{r.date}</span>
              <span className="font-bold transition-all group-hover:translate-x-1 group-hover:text-[var(--acc)]">
                {r.name.replace(/[-_]/g, ' ')}
              </span>
              <span className="hidden items-center gap-2 font-mono text-xs text-[#8d8d97] md:flex">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || '#888' }} />
                {r.language || '—'}
              </span>
              <span className="hidden truncate text-sm text-[#8d8d97] lg:block">{r.description || '·'}</span>
              <span className="col-start-2 row-span-2 flex gap-1.5 md:col-start-auto md:row-span-1">
                {r.homepage && (
                  <a
                    href={r.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="demo"
                    aria-label={`Demo de ${r.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-base transition-colors hover:border-[var(--acc)] hover:bg-[var(--acc)] hover:text-black"
                  >
                    <i className="bx bx-link-external" />
                  </a>
                )}
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="código"
                  aria-label={`Código de ${r.name}`}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-base transition-colors hover:border-[var(--acc)] hover:bg-[var(--acc)] hover:text-black"
                >
                  <i className="bx bxl-github" />
                </a>
              </span>
            </div>
          ))}
        </div>

        {filtered.length > LIMIT && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            data-cursor="más"
            className="btn-sweep btn-sweep-ghost mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold"
          >
            {expanded ? 'ver menos' : `ver todos (${filtered.length})`}
          </button>
        )}
      </div>
    </section>
  );
}
