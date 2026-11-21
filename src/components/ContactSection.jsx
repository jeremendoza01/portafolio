import { useEffect, useRef, useState } from 'react';

const WORDS = ['¿Construimos', 'algo', 'juntos?'];

export default function ContactSection({ onToast }) {
  const secRef = useRef(null);
  const charRefs = useRef([]);
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState('--:--');

  // Reloj en vivo Villa Mercedes
  useEffect(() => {
    let fmt;
    try {
      fmt = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Argentina/San_Luis',
      });
    } catch {
      fmt = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Argentina/Buenos_Aires',
      });
    }
    const tick = () => setClock(`${fmt.format(new Date())} (GMT-3)`);
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  // Peso de fuente variable reactivo al cursor
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: '100px' }
    );
    if (secRef.current) io.observe(secRef.current);

    const onMove = (e) => {
      if (!visible) return;
      charRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        const t = Math.max(0, Math.min(1, 1 - d / 260));
        const w = Math.round(400 + 400 * t);
        el.style.fontVariationSettings = `'wght' ${w}`;
        el.style.fontWeight = w;
        el.style.color = t > 0.55 ? 'var(--acc)' : 'var(--fg)';
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const copyMail = async () => {
    const mail = 'mjeremiasadriel@gmail.com';
    try {
      await navigator.clipboard.writeText(mail);
      setCopied(true);
      onToast?.('¡email copiado! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${mail}`;
    }
  };

  let charIdx = 0;

  return (
    <section
      id="contacto"
      ref={secRef}
      data-state="5"
      className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-[var(--pad)] pb-24 pt-[clamp(90px,13vh,150px)] lg:pb-10"
    >
      <div className="mb-[clamp(40px,6.5vh,72px)] flex flex-wrap items-baseline gap-x-5 gap-y-3.5 border-b border-white/10 pb-5">
        <span
          className="grid h-11 w-11 flex-none place-items-center self-center rounded-full border font-mono text-[13px]"
          style={{ borderColor: 'var(--acc)', color: 'var(--acc)' }}
        >
          06
        </span>
        <h2 className="font-display text-[clamp(32px,5.8vw,88px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
          Contacto
        </h2>
        <span className="w-full font-mono text-xs text-[#8d8d97] md:ml-auto md:w-auto">hablemos</span>
      </div>

      <h3
        aria-label="¿Construimos algo juntos?"
        className="mb-12 max-w-[12ch] font-display text-[clamp(44px,9.2vw,154px)] font-bold leading-[0.92] tracking-[-0.04em] md:font-normal"
      >
        {WORDS.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
            {[...word].map((ch) => {
              const i = charIdx++;
              return (
                <span
                  key={i}
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                  className="inline-block transition-colors duration-200"
                >
                  {ch}
                </span>
              );
            })}
            {wi < WORDS.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </h3>

      <button
        type="button"
        onClick={copyMail}
        data-cursor="copiar"
        style={copied ? { background: 'var(--acc)', color: '#000', borderColor: 'var(--acc)' } : undefined}
        className="inline-flex max-w-full items-center gap-4 self-start rounded-full border border-white/15 px-5 py-3.5 font-mono text-[15px] transition-colors hover:border-[var(--acc)] hover:text-[var(--acc)] sm:px-7 sm:py-4 sm:text-[clamp(18px,2.5vw,32px)]"
      >
        <span className="truncate">mjeremiasadriel@gmail.com</span>
        <i className={`bx ${copied ? 'bx-check' : 'bx-copy'}`} />
      </button>

      <div className="mt-7 flex flex-wrap gap-3">
        {[
          { href: 'https://linkedin.com/in/jeremendoza01/', icon: 'bxl-linkedin', label: 'LinkedIn', cursor: 'linkedin' },
          { href: 'https://github.com/jeremendoza01', icon: 'bxl-github', label: 'GitHub', cursor: 'github' },
          { href: 'https://wa.me/542664001759', icon: 'bxl-whatsapp', label: 'WhatsApp', cursor: 'whatsapp' },
          { href: './assets/CV-Jeremias-Mendoza.pdf', icon: 'bxs-file-pdf', label: 'CV', cursor: 'pdf', download: true },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            download={s.download}
            target={s.download ? undefined : '_blank'}
            rel={s.download ? undefined : 'noopener noreferrer'}
            data-cursor={s.cursor}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#111116] px-5 py-3.5 font-semibold transition-colors hover:bg-[#ecebe6] hover:text-black"
          >
            <i className={`bx ${s.icon} text-[22px]`} />
            <span>{s.label}</span>
          </a>
        ))}
      </div>

      <footer className="mt-auto flex flex-wrap justify-between gap-3.5 pt-20 font-mono text-xs text-[#8d8d97]">
        <span>© {new Date().getFullYear()} Jeremías Mendoza · hecho con React + Tailwind CSS</span>
        <span className="inline-flex items-center gap-1.5">
          <i className="bx bx-map" /> Villa Mercedes · <b className="font-medium text-[#ecebe6]">{clock}</b>
        </span>
        <span className="opacity-65">
          tip: tocá las cuerdas del inicio o escribí <b className="text-[#ecebe6]">riffs</b> en la terminal
        </span>
      </footer>
    </section>
  );
}
