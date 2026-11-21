import { useEffect, useRef, useState } from 'react';
import { EXPERIENCE } from '../data/portfolioData';

const STATEMENT_WORDS = [
  { t: 'Desarrollador' },
  { t: 'apasionado' },
  { t: 'por' },
  { t: 'crear' },
  { t: 'software', em: true },
  { t: 'sólido,', em: true },
  { t: 'aprender' },
  { t: 'nuevas' },
  { t: 'tecnologías' },
  { t: 'y' },
  { t: 'tocar' },
  { t: 'la' },
  { t: 'guitarra.', em: true },
  { t: 'Me' },
  { t: 'gusta' },
  { t: 'escribir' },
  { t: 'código', em: true },
  { t: 'limpio', em: true },
  { t: 'y' },
  { t: 'entender' },
  { t: 'cómo' },
  { t: 'funcionan' },
  { t: 'las' },
  { t: 'cosas' },
  { t: 'por' },
  { t: 'dentro.' },
];

export default function AboutSection({ repoTotal }) {
  const statementRef = useRef(null);
  const stageRef = useRef(null);
  const badgeRef = useRef(null);
  const bandRef = useRef(null);
  const stitchRef = useRef(null);
  const [litWords, setLitWords] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  // Revelado palabra por palabra con el scroll
  useEffect(() => {
    const update = () => {
      const el = statementRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < vh && r.bottom > 0) {
        const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
        setLitWords(Math.floor(p * STATEMENT_WORDS.length * 1.25));
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Física Verlet para la credencial colgante (Backstage Pass)
  useEffect(() => {
    const stage = stageRef.current;
    const badge = badgeRef.current;
    const band = bandRef.current;
    const stitch = stitchRef.current;
    if (!stage || !badge || !band || !stitch) return;

    const N = 14;
    let pts = [];
    let seg = 10;
    let anchor = { x: 0, y: 0 };
    let W = 0;
    let H = 0;
    let bw = 280;
    let bh = 440;
    let dragging = false;
    let target = { x: 0, y: 0 };
    let grab = { x: 0, y: 0 };
    let visible = true;

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    const layout = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      bw = badge.offsetWidth;
      bh = badge.offsetHeight;
      anchor = { x: W / 2, y: -30 };
      const len = clamp(H - bh - 50, 80, 210);
      seg = len / N;
      if (!pts.length) {
        const ang = -0.25;
        pts = Array.from({ length: N + 1 }, (_, i) => {
          const x = anchor.x + Math.sin(ang) * seg * i;
          const y = anchor.y + Math.cos(ang) * seg * i;
          return { x, y, px: x, py: y };
        });
      }
    };

    const toLocal = (e) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e) => {
      dragging = true;
      badge.setPointerCapture(e.pointerId);
      badge.style.cursor = 'grabbing';
      const p = toLocal(e);
      const last = pts[N];
      grab = { x: p.x - last.x, y: p.y - last.y };
      target = { x: last.x, y: last.y };
    };
    const onMove = (e) => {
      if (!dragging) return;
      const p = toLocal(e);
      target = { x: p.x - grab.x, y: p.y - grab.y };
    };
    const release = () => {
      dragging = false;
      badge.style.cursor = 'grab';
    };

    badge.addEventListener('pointerdown', onDown);
    badge.addEventListener('pointermove', onMove);
    badge.addEventListener('pointerup', release);
    badge.addEventListener('pointercancel', release);

    const step = () => {
      for (let i = 1; i <= N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.985;
        const vy = (p.y - p.py) * 0.985;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + 0.55;
      }
      const last = pts[N];
      if (dragging) {
        last.x = target.x;
        last.y = target.y;
      }
      for (let k = 0; k < 14; k++) {
        pts[0].x = anchor.x;
        pts[0].y = anchor.y;
        for (let i = 0; i < N; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = (d - seg) / d;
          if (i === 0) {
            b.x -= dx * diff;
            b.y -= dy * diff;
          } else if (i + 1 === N) {
            const wa = dragging ? 1 : 0.75;
            const wb = 1 - wa;
            a.x += dx * diff * wa;
            a.y += dy * diff * wa;
            b.x -= dx * diff * wb;
            b.y -= dy * diff * wb;
          } else {
            a.x += dx * diff * 0.5;
            a.y += dy * diff * 0.5;
            b.x -= dx * diff * 0.5;
            b.y -= dy * diff * 0.5;
          }
        }
      }
      last.x = clamp(last.x, bw * 0.5, Math.max(bw * 0.5, W - bw * 0.5));
      last.y = clamp(last.y, 0, H - bh * 0.6);
    };

    const render = () => {
      let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < N; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        d += ` Q${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
      }
      d += ` L${pts[N].x.toFixed(1)},${pts[N].y.toFixed(1)}`;
      band.setAttribute('d', d);
      stitch.setAttribute('d', d);

      const last = pts[N];
      const ref = pts[N - 3];
      const ang = Math.atan2(last.x - ref.x, last.y - ref.y);
      const deg = clamp((-ang * 180) / Math.PI, -65, 65);
      badge.style.transform = `translate(${(last.x - bw / 2).toFixed(1)}px, ${(last.y - 12).toFixed(1)}px) rotate(${deg.toFixed(2)}deg)`;
      badge.style.setProperty('--holo', `${50 + deg * 2.2}%`);
    };

    layout();
    step();
    render();
    window.addEventListener('resize', layout);
    document.fonts?.ready.then(layout);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '120px' }
    );
    io.observe(stage);

    let raf;
    const loop = () => {
      if (visible) {
        step();
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', layout);
      badge.removeEventListener('pointerdown', onDown);
      badge.removeEventListener('pointermove', onMove);
      badge.removeEventListener('pointerup', release);
      badge.removeEventListener('pointercancel', release);
    };
  }, []);

  return (
    <section id="sobre-mi" data-state="1" className="relative mx-auto max-w-[1440px] px-[var(--pad)] py-[clamp(90px,13vh,150px)]">
      <div className="mb-[clamp(40px,6.5vh,72px)] flex flex-wrap items-baseline gap-x-5 gap-y-3.5 border-b border-white/10 pb-5">
        <span className="grid h-11 w-11 flex-none place-items-center self-center rounded-full border font-mono text-[13px]" style={{ borderColor: 'var(--acc)', color: 'var(--acc)' }}>
          02
        </span>
        <h2 className="font-display text-[clamp(32px,5.8vw,88px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
          Sobre mí
        </h2>
        <span className="w-full font-mono text-xs text-[#8d8d97] md:ml-auto md:w-auto">perfil · experiencia</span>
      </div>

      <div className="grid grid-cols-1 items-start gap-[clamp(40px,6vw,90px)] lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p ref={statementRef} className="font-display text-[clamp(26px,3.2vw,46px)] font-semibold leading-[1.14] tracking-[-0.02em]">
            {STATEMENT_WORDS.map((w, i) => {
              const on = i < litWords;
              return (
                <span
                  key={i}
                  className="transition-colors duration-300"
                  style={{
                    opacity: on ? 1 : 0.16,
                    color: on && w.em ? 'var(--acc)' : 'inherit',
                  }}
                >
                  {w.t}{' '}
                </span>
              );
            })}
          </p>

          <p className="mt-8 max-w-[640px] text-[17px] leading-relaxed text-[#8d8d97]">
            Trabajo creando aplicaciones web full stack con React, Tailwind CSS, Node.js y Express, combinando bases
            técnicas fuertes con buena comunicación. Mi experiencia previa en el área comercial y de atención al cliente
            me enseñó a escuchar, adaptarme rápido y trabajar en equipo. Busco sumarme a un equipo IT donde aportar
            valor desde el primer día y seguir creciendo.
          </p>

          <div className="mt-11 grid grid-cols-2 overflow-hidden rounded-[22px] border border-white/10 sm:grid-cols-4">
            {[
              { val: repoTotal, sup: '+', lbl: 'repos en GitHub' },
              { val: 6, lbl: 'proyectos destacados' },
              { val: 24, lbl: 'tecnologías & tools' },
              { val: 2, lbl: 'idiomas · ES / EN' },
            ].map((s, idx) => (
              <div
                key={s.lbl}
                data-cursor="hover"
                className={`flex flex-col gap-1.5 border-white/10 p-5 transition-colors hover:bg-white/[0.04] ${
                  idx < 2 ? 'border-b sm:border-b-0' : ''
                } ${idx % 2 === 0 ? 'border-r' : 'sm:border-r'} ${idx === 3 ? 'sm:border-r-0' : ''}`}
              >
                <span className="font-display text-[clamp(34px,3.8vw,52px)] font-extrabold leading-none">
                  {s.val}
                  {s.sup && (
                    <sup className="ml-0.5 align-top text-[0.45em]" style={{ color: 'var(--acc)' }}>
                      {s.sup}
                    </sup>
                  )}
                </span>
                <span className="font-mono text-[11px] text-[#8d8d97]">{s.lbl}</span>
              </div>
            ))}
          </div>

          {/* Experiencia laboral compacta del CV */}
          <div className="mt-10">
            <h3 className="mb-4 font-mono text-[13px] font-medium text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>#</span> experiencia laboral
            </h3>
            <div className="grid gap-3.5">
              {EXPERIENCE.map((e) => (
                <article
                  key={e.company}
                  className="rounded-[18px] border border-white/10 bg-[#111116] p-5 transition-colors hover:border-[rgba(var(--acc-rgb),0.45)]"
                >
                  <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-[19px] font-bold">
                      {e.role} · <span className="font-medium text-[#8d8d97]">{e.company}</span>
                    </h4>
                    <span className="font-mono text-xs" style={{ color: 'var(--acc)' }}>
                      {e.period}
                    </span>
                  </div>
                  <p className="text-[14.5px] text-[#8d8d97]">{e.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Credencial colgante Backstage Pass con física */}
        <div
          ref={stageRef}
          className="relative order-first -mt-2 h-[540px] select-none lg:order-none lg:-mt-5 lg:h-[620px]"
        >
          <svg className="strap pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <path ref={bandRef} className="band" />
            <path ref={stitchRef} className="stitch" />
          </svg>
          <div
            ref={badgeRef}
            data-cursor="arrastrame"
            style={{
              background: 'linear-gradient(160deg, #1c1c24 0%, #121218 60%, #0e0e13 100%)',
              boxShadow: '0 30px 60px -10px rgba(0, 0, 0, .7), inset 0 1px 0 rgba(255, 255, 255, .08)',
              transformOrigin: '50% 0',
              touchAction: 'none',
            }}
            className="absolute left-0 top-0 w-[280px] cursor-grab overflow-hidden rounded-[20px] border border-white/15 px-[22px] pb-5 pt-[26px] will-change-transform"
          >
            <span className="absolute left-1/2 top-[9px] -ml-[23px] h-[9px] w-[46px] rounded-full border border-white/15 bg-[#0a0a0c]" />
            <div className="badge-holo pointer-events-none absolute inset-0" />
            <div className="mt-1.5 flex justify-between font-mono text-[9.5px] tracking-[0.04em] text-[#8d8d97]">
              <span>ALL ACCESS · DEV PASS</span>
              <span style={{ color: 'var(--acc)' }}>● LIVE</span>
            </div>
            <div className="relative my-4 grid aspect-[4/3] place-items-center overflow-hidden rounded-[14px] border border-white/10 bg-[#14141b]">
              {!imgFailed && (
                <img
                  src="https://github.com/jeremendoza01.png?size=300"
                  alt="Jeremías Mendoza"
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                  className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover contrast-105 grayscale-[15%]"
                />
              )}
              <svg viewBox="0 0 48 48" className="w-[54%]" aria-hidden="true">
                <circle cx="24" cy="24" r="21" fill="none" stroke="var(--acc)" strokeWidth="2" />
                <circle cx="24" cy="24" r="17" fill="none" stroke="var(--acc)" strokeWidth="1" opacity="0.6" />
                <text x="24" y="29.5" textAnchor="middle" fill="var(--acc)" className="font-mono text-[14px] font-bold">
                  JM
                </text>
              </svg>
            </div>
            <div className="font-display text-2xl font-extrabold leading-[1.02] tracking-[-0.02em]">
              Jeremías Adriel
              <br />
              Mendoza
            </div>
            <div className="mt-2 font-mono text-[11px]" style={{ color: 'var(--acc)' }}>
              Full Stack Developer
            </div>
            <dl className="mt-3.5 grid gap-1.5 border-t border-dashed border-white/15 pt-3 font-mono text-[10px]">
              <div className="flex justify-between">
                <dt className="text-[#8d8d97]">BASE</dt>
                <dd>Villa Mercedes, SL</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8d8d97]">VIBES</dt>
                <dd>Rock · Guitarras · Code</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8d8d97]">ESTADO</dt>
                <dd style={{ color: 'var(--acc)' }}>OPEN TO WORK</dd>
              </div>
            </dl>
            <div className="badge-barcode mt-3.5 h-[34px] rounded opacity-85" />
          </div>
          <span className="absolute inset-x-0 bottom-2.5 text-center font-mono text-[11px] text-[#8d8d97]">
            ↑ arrastrá el pase
          </span>
        </div>
      </div>
    </section>
  );
}
