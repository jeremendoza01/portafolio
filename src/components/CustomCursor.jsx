import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const wrapRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    document.body.classList.add('has-cursor');
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, rx: window.innerWidth / 2, ry: window.innerHeight / 2 };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onOver = (e) => {
      const wrap = wrapRef.current;
      const lblEl = labelRef.current;
      if (!wrap || !lblEl) return;
      const t = e.target.closest('[data-cursor], a, button, .rig-key');
      wrap.classList.remove('hover', 'label');
      if (!t) return;
      const lbl = t.dataset.cursor || (t.classList.contains('rig-key') ? 'tocar' : '');
      if (lbl && lbl !== 'hover') {
        lblEl.textContent = lbl;
        wrap.classList.add('label');
      } else {
        wrap.classList.add('hover');
      }
    };
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    let raf;
    const loop = () => {
      mouse.rx += (mouse.x - mouse.rx) * 0.18;
      mouse.ry += (mouse.y - mouse.ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${mouse.rx}px, ${mouse.ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, []);

  return (
    <div ref={wrapRef} className="cursor-wrap" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
