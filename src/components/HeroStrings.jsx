import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { audioRig } from '../audio/audioRig';
import { HERO_CHORDS, TYPED_ROLES } from '../data/portfolioData';

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const GAUGES = [1.0, 1.25, 1.55, 1.95, 2.35, 2.85];

const HeroStrings = forwardRef(function HeroStrings({ accentRgb, onOpenTerminal }, ref) {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [typed, setTyped] = useState('');
  const [chordName, setChordName] = useState(HERO_CHORDS[0].name);
  const chordIdxRef = useRef(0);
  const accentRgbRef = useRef(accentRgb);
  accentRgbRef.current = accentRgb;

  const stringsRef = useRef(
    STRING_NAMES.map((label, i) => ({
      label,
      gauge: GAUGES[i],
      y: 0,
      amp: 0,
      vel: 0,
      px: 0.5,
      glow: 0,
      freqIdx: 5 - i,
      lastPluck: 0,
    }))
  );

  // Efecto typed roles
  useEffect(() => {
    let r = 0;
    let i = 0;
    let del = false;
    let timer;
    const tick = () => {
      const word = TYPED_ROLES[r];
      i += del ? -1 : 1;
      setTyped(word.slice(0, i));
      let wait = del ? 32 : 64 + Math.random() * 50;
      if (!del && i === word.length) {
        del = true;
        wait = 1900;
      } else if (del && i === 0) {
        del = false;
        r = (r + 1) % TYPED_ROLES.length;
        wait = 280;
      }
      timer = setTimeout(tick, wait);
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, []);

  const pluckString = (s, strength, xRatio, playSound = true) => {
    const now = performance.now();
    if (now - s.lastPluck < 75) return;
    s.lastPluck = now;
    s.vel += Math.max(-28, Math.min(28, strength));
    s.px = Math.max(0.15, Math.min(0.85, xRatio));
    s.glow = 1;
    if (playSound && audioRig.enabled) {
      const f = HERO_CHORDS[chordIdxRef.current].freqs[s.freqIdx];
      audioRig.pluck(f, 1.9, Math.max(0.35, Math.min(0.95, Math.abs(strength) / 22)));
    }
  };

  const strumChord = (forceSound = true) => {
    if (forceSound && !audioRig.enabled) audioRig.setEnabled(true);
    let nextIdx = Math.floor(Math.random() * HERO_CHORDS.length);
    if (HERO_CHORDS.length > 1 && nextIdx === chordIdxRef.current) {
      nextIdx = (nextIdx + 1) % HERO_CHORDS.length;
    }
    chordIdxRef.current = nextIdx;
    setChordName(HERO_CHORDS[nextIdx].name);
    [5, 4, 3, 2, 1, 0].forEach((idx, step) => {
      setTimeout(() => {
        pluckString(stringsRef.current[idx], 18, 0.36 + step * 0.05, forceSound || audioRig.enabled);
      }, step * 40);
    });
  };

  useImperativeHandle(ref, () => ({ strumChord }));

  useEffect(() => {
    const hero = heroRef.current;
    const cv = canvasRef.current;
    if (!hero || !cv) return;
    const ctx = cv.getContext('2d');
    const strings = stringsRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const top = H * 0.22;
      const span = H * 0.56;
      strings.forEach((s, i) => {
        s.y = top + (span / 5) * i;
      });
    };
    resize();

    let resTimer;
    const onResize = () => {
      clearTimeout(resTimer);
      resTimer = setTimeout(resize, 120);
    };
    window.addEventListener('resize', onResize);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '100px' }
    );
    io.observe(hero);

    let prevY = null;
    const onMove = (e) => {
      if (!visible) return;
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (prevY !== null) {
        const dy = y - prevY;
        strings.forEach((s) => {
          const crossed = (prevY < s.y && y >= s.y) || (prevY > s.y && y <= s.y);
          if (crossed) pluckString(s, Math.max(-22, Math.min(22, dy * 1.4)) || 12, x / (W || 1));
        });
      }
      prevY = y;
    };
    const onLeave = () => {
      prevY = null;
    };
    const onDown = (e) => {
      if (e.target.closest('a, button')) return;
      strumChord(true);
    };

    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
    hero.addEventListener('pointerdown', onDown);

    if (!reduced) strings[5].vel = 4.5;

    let raf;
    const draw = () => {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        const acc = accentRgbRef.current;

        // Trastes minimalistas tipo diapasón
        const frets = 8;
        ctx.strokeStyle = 'rgba(255,255,255,0.035)';
        ctx.lineWidth = 1;
        const topY = strings[0].y - 26;
        const botY = strings[5].y + 26;
        for (let f = 1; f < frets; f++) {
          const x = (W * (1 - Math.pow(0.84, f))) / (1 - Math.pow(0.84, frets));
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, botY);
          ctx.stroke();
          if (f === 3 || f === 5 || f === 7) {
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.beginPath();
            ctx.arc(x - W * 0.045, (topY + botY) / 2, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        strings.forEach((s, idx) => {
          const k = 0.26 + (5 - idx) * 0.025;
          s.vel += -k * s.amp;
          s.vel *= 0.92;
          s.amp += s.vel;
          if (Math.abs(s.amp) < 0.04 && Math.abs(s.vel) < 0.04) {
            s.amp = 0;
            s.vel = 0;
          }
          s.glow *= 0.94;

          const vibr = Math.min(1, Math.abs(s.amp) / 14 + s.glow);
          const cpX = s.px * W;
          const cpY = s.y + s.amp * 2.1;

          if (vibr > 0.04) {
            ctx.strokeStyle = `rgba(${acc},${vibr * 0.35})`;
            ctx.lineWidth = s.gauge + 6 * vibr;
            ctx.beginPath();
            ctx.moveTo(0, s.y);
            ctx.quadraticCurveTo(cpX, cpY, W, s.y);
            ctx.stroke();
          }

          ctx.strokeStyle =
            vibr > 0.05
              ? `rgba(${acc},${0.28 + vibr * 0.72})`
              : `rgba(236,235,230,${0.11 + idx * 0.018})`;
          ctx.lineWidth = s.gauge;
          ctx.beginPath();
          ctx.moveTo(0, s.y);
          ctx.quadraticCurveTo(cpX, cpY, W, s.y);
          ctx.stroke();

          ctx.font = '500 11px "JetBrains Mono", monospace';
          ctx.fillStyle = vibr > 0.1 ? `rgba(${acc},${0.45 + vibr * 0.55})` : 'rgba(141,141,151,0.38)';
          ctx.fillText(s.label, 14, s.y - 6);
        });
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={heroRef}
      data-state="0"
      className="hero-bg relative flex min-h-svh flex-col justify-center overflow-hidden px-[var(--pad)] pb-40 pt-28 md:pb-28"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/4 bg-gradient-to-t from-[#0a0a0c] to-transparent" />

      <div className="pointer-events-none relative z-[2]">
        <p className="mb-5 font-mono text-[13px] tracking-[0.03em] text-[#8d8d97]">
          <span style={{ color: 'var(--acc)' }}>//</span> desarrollador full stack · Villa Mercedes, San Luis, AR
        </p>

        <h1
          aria-label="Jeremías Mendoza"
          className="flex flex-col font-display text-[clamp(32px,9.2vw,166px)] font-extrabold leading-[0.9] tracking-[-0.04em]"
        >
          <span className="block w-fit whitespace-nowrap">JEREMÍAS</span>
          <span className="hero-outline block w-fit whitespace-nowrap md:ml-[clamp(0px,5vw,100px)]">MENDOZA</span>
        </h1>

        <p className="mt-7 max-w-[860px] text-[clamp(17px,2vw,26px)] text-[#8d8d97]">
          Código, rock y software — desarrollador{' '}
          <span className="font-mono font-medium" style={{ color: 'var(--acc)' }}>
            {typed}
          </span>
          <span className="caret-blink font-mono" style={{ color: 'var(--acc)' }}>
            _
          </span>
        </p>

        <div className="pointer-events-auto mt-9 flex flex-wrap gap-3">
          <a
            href="#proyectos"
            data-cursor="ver"
            className="btn-sweep btn-sweep-primary inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-colors"
          >
            <span>Ver proyectos</span>
            <i className="bx bx-right-arrow-alt text-xl" />
          </a>
          <a
            href="./assets/CV-Jeremias-Mendoza.pdf"
            download
            data-cursor="pdf"
            className="btn-sweep btn-sweep-ghost inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0a0a0c]/60 px-6 py-3.5 text-[15px] font-semibold backdrop-blur-md transition-colors"
          >
            <i className="bx bx-download text-lg" />
            <span>Descargar CV</span>
          </a>
          <button
            type="button"
            onClick={() => strumChord(true)}
            data-cursor="rasguear"
            className="btn-sweep btn-sweep-ghost inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0a0a0c]/60 px-6 py-3.5 text-[15px] font-semibold backdrop-blur-md transition-colors"
          >
            <i className="bx bx-music text-lg" />
            <span>Rasguear acorde</span>
          </button>
          <button
            type="button"
            onClick={onOpenTerminal}
            data-cursor="cli"
            className="btn-sweep btn-sweep-ghost inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0a0a0c]/60 px-6 py-3.5 text-[15px] font-semibold backdrop-blur-md transition-colors"
          >
            <i className="bx bx-terminal text-lg" />
            <span>Terminal</span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-[var(--pad)] bottom-20 z-[2] flex items-center justify-center font-mono text-[11.5px] text-[#8d8d97] md:bottom-8 md:justify-between">
        <span className="hidden flex-1 items-center gap-1.5 md:inline-flex">
          <i className="bx bx-slider-alt" /> pasá el mouse por las cuerdas o hacé click · acorde:{' '}
          <b style={{ color: 'var(--acc)' }}>{chordName}</b>
        </span>
        <a
          href="#sobre-mi"
          data-cursor="bajar"
          className="pointer-events-auto flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.2em]"
        >
          <span>scroll</span>
          <i className="scroll-drip relative block h-11 w-[1px] overflow-hidden bg-white/15" />
        </a>
        <span className="hidden flex-1 items-center justify-end gap-1.5 md:inline-flex">
          <kbd>Ctrl</kbd> + <kbd>K</kbd> abre la terminal
        </span>
      </div>
    </section>
  );
});

export default HeroStrings;
