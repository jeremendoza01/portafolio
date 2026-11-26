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

        {/* Credencial estática Dev Pass */}
        <div className="order-first flex flex-col items-center justify-center select-none lg:order-none">
          <div className="h-14 w-3.5 rounded-t-full border-x border-black/30" style={{ background: 'var(--acc)', boxShadow: '0 6px 14px rgba(0, 0, 0, .45)' }} aria-hidden="true" />
          <div
            style={{
              background: 'linear-gradient(160deg, #1c1c24 0%, #121218 60%, #0e0e13 100%)',
              boxShadow: '0 30px 60px -10px rgba(0, 0, 0, .7), inset 0 1px 0 rgba(255, 255, 255, .08)',
            }}
            className="relative -mt-1.5 w-[280px] overflow-hidden rounded-[20px] border border-white/15 px-[22px] pb-5 pt-[26px]"
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
        </div>
      </div>
    </section>
  );
}
