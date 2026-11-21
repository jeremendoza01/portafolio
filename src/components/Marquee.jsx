import { useEffect, useRef } from 'react';

const ROW_1 = 'React ✦ Tailwind CSS ✦ JavaScript ✦ TypeScript ✦ Node.js ✦ Express ✦ Python ✦ C ✦ Java ✦ PostgreSQL ✦ MongoDB ✦ MySQL ✦ Docker ✦ Git ✦ ';
const ROW_2 = 'código limpio ◎ rock argentino & guitarras ◎ construir ◎ desplegar ◎ iterar ◎ código limpio ◎ rock argentino & guitarras ◎ construir ◎ ';

export default function Marquee() {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const rows = [
      { el: row1Ref.current, dir: 1, x: 0, w: 1 },
      { el: row2Ref.current, dir: -1, x: 0, w: 1 },
    ];

    const measure = () => {
      rows.forEach((r) => {
        if (r.el?.firstElementChild) r.w = r.el.firstElementChild.offsetWidth || 1;
      });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);

    let lastY = window.scrollY;
    let vel = 0;
    let raf;

    const tick = () => {
      const y = window.scrollY;
      vel += (y - lastY - vel) * 0.2;
      lastY = y;
      const skew = Math.max(-10, Math.min(10, -vel * 0.2));
      rows.forEach((r) => {
        if (!r.el) return;
        r.x -= (1 + Math.abs(vel) * 0.3) * r.dir;
        if (r.x <= -r.w) r.x += r.w;
        if (r.x > 0) r.x -= r.w;
        r.el.style.transform = `translate3d(${r.x}px,0,0) skewX(${skew}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div className="relative z-[3] flex flex-col gap-1.5 overflow-hidden border-y border-white/10 bg-[#0a0a0c] py-5" aria-hidden="true">
      <div ref={row1Ref} className="flex whitespace-nowrap will-change-transform">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-none pr-[0.4em] font-display text-[clamp(28px,4.5vw,56px)] font-bold tracking-[-0.02em]">
            {ROW_1}
          </div>
        ))}
      </div>
      <div ref={row2Ref} className="flex whitespace-nowrap will-change-transform">
        {[0, 1, 2].map((i) => (
          <div key={i} className="marquee-outline flex-none pr-[0.4em] font-display text-[clamp(28px,4.5vw,56px)] font-bold tracking-[-0.02em]">
            {ROW_2}
          </div>
        ))}
      </div>
    </div>
  );
}
