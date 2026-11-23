import { useEffect, useRef, useState } from 'react';
import { RIFFS } from '../data/riffs';

const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const SECTION_MAP = {
  inicio: 'inicio',
  sobre: 'sobre-mi',
  'sobre-mi': 'sobre-mi',
  proyectos: 'proyectos',
  stack: 'stack',
  skills: 'stack',
  academia: 'academia',
  educacion: 'academia',
  contacto: 'contacto',
};

const FILE_MAP = {
  'sobre-mi.md': 'sobre',
  'experiencia.log': 'experiencia',
  'academia.txt': 'academia',
  'stack.json': 'skills',
  'contacto.txt': 'contacto',
  'cv.pdf': 'cv',
  'proyectos/': 'proyectos',
  proyectos: 'proyectos',
};

const ALIAS = {
  about: 'sobre',
  'sobre-mi': 'sobre',
  exp: 'experiencia',
  experience: 'experiencia',
  edu: 'academia',
  educacion: 'academia',
  educación: 'academia',
  projects: 'proyectos',
  stack: 'skills',
  contact: 'contacto',
  contratar: 'contacto',
  hire: 'contacto',
  goto: 'ir',
  tocar: 'riff',
  play: 'riff',
  theme: 'tema',
  musica: 'rock',
  música: 'rock',
  guitarra: 'acorde',
  cls: 'clear',
  quit: 'exit',
  hello: 'hola',
  ayuda: 'help',
};

export default function TerminalModal({
  open,
  onClose,
  repoCount,
  onCycleAccent,
  onStrumHero,
  onPlayRiff,
}) {
  const [lines, setLines] = useState([
    {
      cls: 'text-[#b9b9c2]',
      html: `<span style="color:var(--acc)">jere.dev</span> — terminal interactiva (React + Tailwind)\nescribí <span style="color:var(--acc)">help</span> para ver los comandos  <span class="text-[#8d8d97]">(tab autocompleta · ↑↓ historial · esc cierra)</span>\n`,
    },
  ]);
  const [val, setVal] = useState('');
  const histRef = useRef([]);
  const hIdxRef = useRef(0);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const link = (href, txt) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:var(--acc);text-decoration:underline;text-underline-offset:3px">${txt}</a>`;

  const commands = {
    help: () => `<span style="color:var(--acc)">comandos disponibles</span>
  <b>whoami</b>          quién soy
  <b>sobre</b>           resumen profesional
  <b>proyectos</b>       proyectos destacados
  <b>skills</b>          stack técnico
  <b>experiencia</b>     trayectoria laboral
  <b>academia</b>        historia académica y promedios
  <b>contacto</b>        cómo encontrarme
  <b>cv</b>              descargar mi CV
  <b>github</b> · <b>linkedin</b>   abrir perfiles
  <b>ir</b> &lt;sección&gt;    navegar (inicio, sobre, proyectos, stack, academia, contacto)
  <b>acorde</b>          rasguear acorde en las cuerdas del inicio
  <b>riffs</b>           listar los 4 riffs (rock argentino e internacional)
  <b>riff</b> [nombre]   tocar un riff (ej: riff soda, riff smoke, riff nirvana)
  <b>tema</b>            cambiar color de acento
  <b>ls</b> · <b>cat</b> · <b>echo</b> · <b>date</b> · <b>history</b> · <b>clear</b> · <b>exit</b>`,
    whoami: () => `<b>Jeremías Adriel Mendoza</b>
desarrollador full stack (React, Tailwind CSS, Node.js, Express) · rock &amp; guitarras
📍 Villa Mercedes, San Luis, Argentina`,
    sobre: () => `Desarrollador apasionado por el software, las nuevas tecnologías y la música.
Creo aplicaciones web con React, Tailwind CSS, Node.js y Express. Mi paso por el
área comercial me dio comunicación, adaptabilidad y trabajo en equipo.
<span style="color:var(--acc)">Busco sumarme a un equipo IT para aportar valor y seguir creciendo.</span>`,
    experiencia: () => `<span style="color:var(--acc)">02/2026–04/2026</span>  Asesor de Ventas · CAM-Metalúrgica
                  asesoramiento comercial, atención y seguimiento de clientes
<span style="color:var(--acc)">01/2022–08/2022</span>  Encargado de atención y stock · Casa de Repuestos
                  asesoramiento técnico, pedidos, control de stock y facturación`,
    academia: () => `<span style="color:var(--acc)">Ingeniería en Sistemas de Información</span> · UNViMe (2021–hoy)
  avance: <b>60%</b> · 27 materias aprobadas
  promedio: <b>7.22</b> sin aplazos · 6.06 con aplazos

<span style="color:var(--acc)">Analista Universitario en Sistemas</span> (título intermedio)
  avance: <b>85.71%</b> · 24 aprobadas (a 4 de finalizar)
  promedio: <b>7.21</b> sin aplazos · 5.94 con aplazos

<span style="color:var(--acc)">Técnico Electromecánico</span> · Esc. Sec. Gdor. Elías Adre (2014–2020)`,
    proyectos: () => `<span style="color:var(--acc)">P-01</span> Roja Directa ........ React · Context · Auth tokens · Mercado Pago
<span style="color:var(--acc)">P-02</span> Simbiosis Geo ....... ${link('https://simbiosis-eta.vercel.app', 'demo')} · HTML/CSS/JS · GitHub Actions
<span style="color:var(--acc)">P-03</span> Simulador Autómatas . ${link('https://github.com/jeremendoza01/Simulador-Automatas-UNViMe', 'código')} · C
<span style="color:var(--acc)">P-04</span> To-Do List v5 + API . ${link('https://to-do-list-v5.vercel.app', 'demo')} · Express · REST
<span style="color:var(--acc)">P-05</span> Sist. Trabajadores .. ${link('https://github.com/jeremendoza01/Sistema-de-Trabajadores', 'código')} · C
<span style="color:var(--acc)">P-06</span> Perritos Aleatorios . ${link('https://perritosaleatorios.vercel.app', 'demo')} · Fetch API
<span class="text-[#8d8d97]">+ ${repoCount} repos más en ${link('https://github.com/jeremendoza01', 'github')}</span>`,
    skills: () => `{
  <span class="text-[#5ce1ff]">"lenguajes"</span>:  ["JavaScript", "TypeScript", "Python", "C", "Java", "HTML", "CSS"],
  <span class="text-[#5ce1ff]">"frameworks"</span>: ["React", "Tailwind CSS", "Node.js", "Express"],
  <span class="text-[#5ce1ff]">"bases"</span>:      ["MySQL", "PostgreSQL", "MongoDB"],
  <span class="text-[#5ce1ff]">"tools"</span>:      ["Git", "GitHub", "Docker", "Postman", "GitHub Actions", "APIs REST"],
  <span class="text-[#5ce1ff]">"idiomas"</span>:    { "español": "nativo", "inglés": "intermedio" }
}`,
    contacto: () => `✉  ${link('mailto:mjeremiasadriel@gmail.com', 'mjeremiasadriel@gmail.com')}
in ${link('https://linkedin.com/in/jeremendoza01/', 'linkedin.com/in/jeremendoza01')}
gh ${link('https://github.com/jeremendoza01', 'github.com/jeremendoza01')}
wa ${link('https://wa.me/542664001759', '+54 266 400-1759')}`,
    cv: () => {
      const a = document.createElement('a');
      a.href = './assets/CV-Jeremias-Mendoza.pdf';
      a.download = '';
      a.click();
      return 'descargando CV-Jeremias-Mendoza.pdf… ✓';
    },
    github: () => {
      window.open('https://github.com/jeremendoza01', '_blank');
      return 'abriendo github.com/jeremendoza01…';
    },
    linkedin: () => {
      window.open('https://linkedin.com/in/jeremendoza01/', '_blank');
      return 'abriendo linkedin…';
    },
    ir: (a) => {
      const id = SECTION_MAP[(a[0] || '').toLowerCase()];
      if (!id) return `<span class="text-[#ff6b6b]">uso: ir &lt;inicio|sobre|proyectos|stack|academia|contacto&gt;</span>`;
      onClose();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      return '';
    },
    acorde: () => {
      onClose();
      document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => onStrumHero?.(), 550);
      return '';
    },
    riffs: () =>
      `<span style="color:var(--acc)">riffs disponibles</span> (escribí <b>riff &lt;id&gt;</b>)\n` +
      RIFFS.map((r) => `  <b>${r.id.padEnd(20)}</b> ${r.name} · ${r.artist} [${r.origin} · ${r.bpm} BPM]`).join('\n'),
    riff: (a) => {
      const q = (a.join(' ') || '').toLowerCase();
      const found = q
        ? RIFFS.find((r) => r.id.includes(q) || r.name.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q))
        : RIFFS[0];
      if (!found) return `<span class="text-[#ff6b6b]">no encontré ese riff. probá: riffs</span>`;
      onClose();
      document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => onPlayRiff?.(found.id), 750);
      return '';
    },
    tema: () => {
      const name = onCycleAccent?.();
      return `acento cambiado a <span style="color:var(--acc)">${name}</span>`;
    },
    ls: () => `<span class="text-[#5ce1ff]">proyectos/</span>  sobre-mi.md  experiencia.log  academia.txt  stack.json  contacto.txt  cv.pdf`,
    cat: (a) => {
      const c = FILE_MAP[a[0]];
      return c ? commands[c]([]) : `<span class="text-[#ff6b6b]">cat: ${esc(a[0] || '')}: no existe el archivo</span>`;
    },
    echo: (a) => esc(a.join(' ')),
    date: () => new Date().toLocaleString('es-AR'),
    history: () => histRef.current.map((h, i) => `${String(i + 1).padStart(3)}  ${esc(h)}`).join('\n'),
    clear: () => {
      setLines([]);
      return '__CLEARED__';
    },
    exit: () => {
      onClose();
      return '';
    },
    sudo: () => `<span class="text-[#ff6b6b]">jere no está en el archivo sudoers. este incidente será reportado 😏</span>\npero podés contratarlo: escribí <span style="color:var(--acc)">contacto</span>`,
    rm: () => `<span class="text-[#ff6b6b]">buen intento. 🙃</span>`,
    rock: () => '🎸 código y rock argentino. probá <span style="color:var(--acc)">riffs</span> o <span style="color:var(--acc)">acorde</span>',
    hola: () => '¡hola! 👋 gracias por pasar. escribí <span style="color:var(--acc)">help</span> para empezar.',
  };

  const run = (raw) => {
    const line = raw.trim();
    const promptLine = {
      cls: 'text-[#ecebe6]',
      html: `<span style="color:var(--acc)">jere@portfolio</span>:<span class="text-[#5ce1ff]">~</span>$ ${esc(line)}`,
    };
    if (!line) {
      setLines((prev) => [...prev, promptLine]);
      return;
    }
    histRef.current.push(line);
    hIdxRef.current = histRef.current.length;
    const [c0, ...args] = line.split(/\s+/);
    const cmd = ALIAS[c0.toLowerCase()] || c0.toLowerCase();
    const fn = commands[cmd];
    const out = fn
      ? fn(args)
      : `<span class="text-[#ff6b6b]">comando no encontrado: ${esc(c0)}</span>. probá <span style="color:var(--acc)">help</span>`;

    if (out === '__CLEARED__') return;
    setLines((prev) => [...prev, promptLine, ...(out ? [{ cls: 'text-[#b9b9c2]', html: out }] : [])]);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[960] grid place-items-center bg-[#050507]/65 p-5 backdrop-blur-sm"
    >
      <div className="flex h-[min(560px,80vh)] w-[min(820px,100%)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0c0c0f]/95 shadow-[0_40px_100px_rgba(0,0,0,0.75)]">
        <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-3 text-xs text-[#8d8d97]">
          <span className="flex gap-1.5">
            <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <i className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="font-mono">jere@portfolio: ~</span>
          <button type="button" onClick={onClose} aria-label="Cerrar terminal" className="grid place-items-center text-xl hover:text-[#ecebe6]">
            <i className="bx bx-x" />
          </button>
        </div>

        <div ref={bodyRef} className="flex-1 overflow-y-auto whitespace-pre-wrap break-words px-5 pb-2 pt-4 font-mono text-[13.5px] leading-relaxed">
          {lines.map((l, idx) => (
            <div key={idx} className={l.cls} dangerouslySetInnerHTML={{ __html: l.html }} />
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(val);
            setVal('');
          }}
          autoComplete="off"
          className="flex items-center gap-2.5 px-5 pb-4 pt-3 font-mono text-[13.5px]"
        >
          <label htmlFor="term-in" className="whitespace-nowrap">
            <span style={{ color: 'var(--acc)' }}>jere@portfolio</span>:<span className="text-[#5ce1ff]">~</span>$
          </label>
          <input
            id="term-in"
            ref={inputRef}
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (hIdxRef.current > 0) setVal(histRef.current[--hIdxRef.current]);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                hIdxRef.current = Math.min(histRef.current.length, hIdxRef.current + 1);
                setVal(histRef.current[hIdxRef.current] || '');
              } else if (e.key === 'Tab') {
                e.preventDefault();
                const v = val.toLowerCase();
                if (!v) return;
                const opts = Object.keys(commands).filter((k) => k.startsWith(v));
                if (opts.length === 1) setVal(`${opts[0]} `);
                else if (opts.length > 1)
                  setLines((prev) => [...prev, { cls: 'text-[#8d8d97]', html: opts.join('   ') }]);
              }
            }}
            spellCheck={false}
            autoCapitalize="off"
            style={{ caretColor: 'var(--acc)' }}
            className="min-w-0 flex-1 bg-transparent text-[#ecebe6] outline-none"
          />
        </form>
      </div>
    </div>
  );
}
