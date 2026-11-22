import { useEffect, useState } from 'react';

const NOTES = ['E', 'A', 'D', 'G', 'B', 'e'];

export default function Loader({ onDone }) {
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorage.getItem('jm-booted') || window.location.hash) {
      setGone(true);
      onDone?.();
      return;
    }
    sessionStorage.setItem('jm-booted', '1');
    document.body.classList.add('loading');

    let idx = 0;
    const timers = [];
    const tick = () => {
      if (idx < NOTES.length) {
        idx += 1;
        setStep(idx);
        timers.push(setTimeout(tick, 120));
      } else {
        timers.push(
          setTimeout(() => {
            setClosing(true);
            document.body.classList.remove('loading');
            onDone?.();
            timers.push(setTimeout(() => setGone(true), 850));
          }, 220)
        );
      }
    };
    timers.push(setTimeout(tick, 140));
    return () => {
      timers.forEach(clearTimeout);
      document.body.classList.remove('loading');
    };
  }, [onDone]);

  if (gone) return null;

  const finishNow = () => {
    setClosing(true);
    document.body.classList.remove('loading');
    onDone?.();
    setTimeout(() => setGone(true), 850);
  };

  return (
    <div
      onClick={finishNow}
      aria-hidden="true"
      className="fixed inset-0 z-[1000] grid place-items-center bg-[#0a0a0c] transition-[clip-path] duration-700"
      style={{ clipPath: closing ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)' }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex gap-2.5 font-mono">
          {NOTES.map((n, i) => {
            const on = i < step;
            return (
              <span
                key={n + i}
                className="grid h-10 w-10 place-items-center rounded-[10px] border text-sm font-bold transition-all duration-200"
                style={{
                  borderColor: on ? 'var(--acc)' : 'var(--line-2)',
                  background: on ? 'var(--acc)' : 'transparent',
                  color: on ? '#000' : 'var(--mute)',
                  transform: on ? 'translateY(-4px)' : 'none',
                  boxShadow: on ? '0 8px 24px rgba(var(--acc-rgb), .3)' : 'none',
                }}
              >
                {n}
              </span>
            );
          })}
        </div>
        <div className="h-[2px] w-[290px] overflow-hidden rounded bg-white/10">
          <div
            className="h-full origin-left transition-transform duration-200"
            style={{
              background: 'var(--acc)',
              transform: `scaleX(${step / NOTES.length})`,
            }}
          />
        </div>
        <p
          className="font-mono text-xs tracking-widest"
          style={{ color: step >= NOTES.length ? 'var(--acc)' : 'var(--mute)' }}
        >
          afinación estándar · listo
        </p>
      </div>
    </div>
  );
}
