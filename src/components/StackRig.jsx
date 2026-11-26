import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { audioRig } from '../audio/audioRig';
import { BLACK_KEYS, SOFT_SKILLS, STACK_CATS, WHITE_KEYS } from '../data/portfolioData';
import { RIFFS } from '../data/riffs';

const CAT_COLOR = {
  lang: 'var(--c-lang)',
  fw: 'var(--c-fw)',
  db: 'var(--c-db)',
  tool: 'var(--c-tool)',
};

// Mapea cualquier MIDI (incluso graves de guitarra como E3=52) al rango visual del teclado 60..83
function mapMidiToKey(midi) {
  let m = midi;
  while (m < 60) m += 12;
  while (m > 83) m -= 12;
  return m;
}

const StackRig = forwardRef(function StackRig({ accentRgb, onToast }, ref) {
  const sectionRef = useRef(null);
  const scopeRef = useRef(null);
  const accentRgbRef = useRef(accentRgb);
  accentRgbRef.current = accentRgb;

  const [audioMode, setAudioMode] = useState(audioRig.mode);
  const [selectedRiffId, setSelectedRiffId] = useState(RIFFS[0].id);
  const [playingRiffId, setPlayingRiffId] = useState(null);
  const [bpm, setBpm] = useState(RIFFS[0].bpm);
  const [beatPulse, setBeatPulse] = useState(false);
  const [activeMidis, setActiveMidis] = useState({});
  const [lcd, setLcd] = useState({
    cat: `guitarra · ${RIFFS[0].bpm} BPM original`,
    name: 'tocá una tecla o elegí un riff',
    desc: '24 tecnologías · 4 riffs al tempo original de cada tema',
  });

  const demoTimerRef = useRef(null);
  const bpmRef = useRef(RIFFS[0].bpm);
  bpmRef.current = bpm;
  const keyTimersRef = useRef({});
  const pointerDownRef = useRef(false);
  const visibleRef = useRef(false);

  const finePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const keyByMidi = useMemo(() => {
    const map = {};
    [...WHITE_KEYS, ...BLACK_KEYS].forEach((k) => {
      map[k.midi] = k;
    });
    return map;
  }, []);

  const hotToMidi = useMemo(() => {
    const map = {};
    [...WHITE_KEYS, ...BLACK_KEYS].forEach((k) => {
      map[k.hot] = k.midi;
    });
    return map;
  }, []);

  const flashKey = useCallback((visualMidi, durationMs = 240) => {
    setActiveMidis((prev) => ({ ...prev, [visualMidi]: true }));
    clearTimeout(keyTimersRef.current[visualMidi]);
    keyTimersRef.current[visualMidi] = setTimeout(() => {
      setActiveMidis((prev) => {
        if (!prev[visualMidi]) return prev;
        const copy = { ...prev };
        delete copy[visualMidi];
        return copy;
      });
    }, durationMs);
  }, []);

  const pressKey = useCallback(
    (midi, { sound = true, dur = 0.55, overrideLcd = null } = {}) => {
      const k = keyByMidi[midi];
      if (!k) return;
      flashKey(midi, Math.max(160, dur * 550));
      if (overrideLcd) {
        setLcd(overrideLcd);
      } else {
        setLcd({
          cat: `${audioRig.mode === 'guitar' ? 'guitarra' : 'synth'} · ${STACK_CATS[k.cat]}`,
          name: k.name,
          desc: k.desc,
        });
      }
      if (sound) audioRig.note(midi, dur);
    },
    [flashKey, keyByMidi]
  );

  const stopRiff = useCallback(() => {
    clearTimeout(demoTimerRef.current);
    demoTimerRef.current = null;
    setPlayingRiffId(null);
    setBeatPulse(false);
  }, []);

  const playRiff = useCallback(
    (riffId, keepCustomBpm = false) => {
      const targetId = riffId || selectedRiffId;
      const riff = RIFFS.find((r) => r.id === targetId) || RIFFS[0];

      // Si clickeó el mismo riff que ya está sonando, lo detiene
      if (playingRiffId === riff.id && !riffId) {
        stopRiff();
        return;
      }

      stopRiff();
      setSelectedRiffId(riff.id);
      if (!keepCustomBpm) {
        setBpm(riff.bpm);
        bpmRef.current = riff.bpm;
      }
      setPlayingRiffId(riff.id);
      if (!audioRig.enabled) audioRig.setEnabled(true);

      let i = 0;
      let nextTime = performance.now();

      const next = () => {
        if (i >= riff.steps.length) {
          stopRiff();
          return;
        }
        const [midiOrList, beats] = riff.steps[i++];
        const curBpm = bpmRef.current;
        const beatMs = 60000 / curBpm;
        const stepMs = beats * beatMs;
        const durSec = stepMs / 1000;

        setBeatPulse((p) => !p);
        if (midiOrList) {
          audioRig.note(midiOrList, Math.max(0.22, durSec * 0.96));
          const list = Array.isArray(midiOrList) ? midiOrList : [midiOrList];
          const primaryVisual = mapMidiToKey(list[list.length - 1]);
          list.forEach((m) => flashKey(mapMidiToKey(m), Math.max(130, stepMs * 0.85)));
          const tech = keyByMidi[primaryVisual];
          setLcd({
            cat: `▶ ${riff.artist} (${riff.origin}) · ${curBpm} BPM${curBpm === riff.bpm ? ' orig.' : ''}`,
            name: riff.name,
            desc: tech ? `sonando en tecla: ${tech.name}` : riff.artist,
          });
        }

        // Programación sin drift para mantener el tempo exacto
        nextTime += stepMs;
        const delay = Math.max(10, nextTime - performance.now());
        demoTimerRef.current = setTimeout(next, delay);
      };
      next();
    },
    [flashKey, keyByMidi, playingRiffId, selectedRiffId, stopRiff]
  );

  useImperativeHandle(ref, () => ({
    playRiff,
    stopRiff,
  }));

  useEffect(() => {
    const unsub = audioRig.subscribe(({ mode }) => setAudioMode(mode));
    const onUp = () => {
      pointerDownRef.current = false;
    };
    window.addEventListener('pointerup', onUp);
    return () => {
      unsub();
      stopRiff();
      window.removeEventListener('pointerup', onUp);
    };
  }, [stopRiff]);

  // Atajos de teclado físico cuando Stack está visible
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!visibleRef.current) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (/input|textarea|select/i.test(document.activeElement?.tagName || '')) return;
      const k = (e.key || '').toLowerCase();
      if (hotToMidi[k] !== undefined) {
        if (!audioRig.enabled) audioRig.setEnabled(true);
        pressKey(hotToMidi[k]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotToMidi, pressKey]);

  // Osciloscopio del LCD
  useEffect(() => {
    const cv = scopeRef.current;
    const sec = sectionRef.current;
    if (!cv || !sec) return;
    const ctx = cv.getContext('2d');
    let W = 0;
    let H = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: '100px' }
    );
    io.observe(sec);

    let raf;
    const draw = (now) => {
      if (visibleRef.current) {
        ctx.clearRect(0, 0, W, H);
        const acc = accentRgbRef.current;
        ctx.strokeStyle = `rgba(${acc},.85)`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `rgba(${acc},.8)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        const d = audioRig.wave();
        for (let x = 0; x <= W; x += 2) {
          let y;
          if (d) y = (d[Math.floor((x / W) * (d.length - 1))] / 128 - 1) * H * 0.95 + H / 2;
          else y = H / 2 + Math.sin(x * 0.05 + now * 0.003) * 1.5;
          if (x) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const toggleMode = () => {
    const next = audioRig.mode === 'guitar' ? 'synth' : 'guitar';
    audioRig.setMode(next);
    setLcd((prev) => ({ ...prev, cat: `${next === 'guitar' ? 'guitarra' : 'synth'} · listo` }));
    onToast?.(next === 'guitar' ? 'tono: guitarra eléctrica 🎸' : 'tono: sintetizador 🎹');
  };

  const currentRiff = RIFFS.find((r) => r.id === selectedRiffId) || RIFFS[0];

  return (
    <section
      id="stack"
      ref={sectionRef}
      data-state="3"
      className="relative mx-auto max-w-[1440px] px-[var(--pad)] py-[clamp(90px,13vh,150px)]"
    >
      <div className="mb-[clamp(40px,6.5vh,72px)] flex flex-wrap items-baseline gap-x-5 gap-y-3.5 border-b border-white/10 pb-5">
        <span
          className="grid h-11 w-11 flex-none place-items-center self-center rounded-full border font-mono text-[13px]"
          style={{ borderColor: 'var(--acc)', color: 'var(--acc)' }}
        >
          04
        </span>
        <h2 className="font-display text-[clamp(32px,5.8vw,88px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
          Stack
        </h2>
        <span className="w-full font-mono text-xs text-[#8d8d97] md:ml-auto md:w-auto">
          instrumento · 24 herramientas · 4 riffs
        </span>
      </div>

      <p className="mb-10 max-w-[780px] text-[clamp(17px,1.55vw,20px)] text-[#8d8d97]">
        Mis herramientas, en forma de instrumento. <b className="text-[#ecebe6]">Tocá las teclas</b> (o usá tu teclado:{' '}
        <kbd>Z</kbd>–<kbd>M</kbd> y <kbd>Q</kbd>–<kbd>U</kbd>), elegí un{' '}
        <b className="text-[#ecebe6]">riff de rock argentino o clásico</b> y alterná entre{' '}
        <b className="text-[#ecebe6]">guitarra eléctrica</b> o <b className="text-[#ecebe6]">sintetizador</b>.
      </p>

      <div
        className="rounded-[28px] border border-white/15 p-[clamp(16px,2.4vw,30px)]"
        style={{
          background: 'linear-gradient(180deg, #1a1a21, #111116)',
          boxShadow: '0 40px 80px -30px rgba(0, 0, 0, .8), inset 0 1px 0 rgba(255, 255, 255, .07)',
        }}
      >
        {/* Panel superior */}
        <div className="mb-5 grid grid-cols-1 items-center gap-5 xl:grid-cols-[auto_1fr_auto]">
          <div className="flex flex-col">
            <span className="font-mono text-[26px] font-bold tracking-[-0.02em]">JM-24</span>
            <small className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8d8d97]">rock / synth rig</small>
          </div>

          <div
            className="lcd-scan relative h-24 overflow-hidden rounded-[14px] border border-[#23262a] bg-[#07090a]"
            style={{ boxShadow: 'inset 0 0 30px rgba(var(--acc-rgb), .06), inset 0 2px 8px rgba(0, 0, 0, .8)' }}
          >
            <canvas ref={scopeRef} className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true" />
            <div
              className="relative z-[1] flex h-full flex-col justify-center px-5 font-mono"
              style={{ color: 'var(--acc)', textShadow: '0 0 8px rgba(var(--acc-rgb), .6)' }}
            >
              <span className="text-[10px] uppercase tracking-[0.15em] opacity-75">{lcd.cat}</span>
              <span className="truncate text-[21px] font-bold leading-tight">{lcd.name}</span>
              <span className="truncate text-xs opacity-80">{lcd.desc}</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between xl:flex-col xl:items-end">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleMode}
                data-cursor="tono"
                className="btn-sweep btn-sweep-ghost inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold"
              >
                <i className="bx bx-slider text-base" />
                <span>{audioMode === 'guitar' ? 'guitarra' : 'synth'}</span>
              </button>
              <button
                type="button"
                onClick={() => (playingRiffId ? stopRiff() : playRiff(currentRiff.id, true))}
                data-cursor="riff"
                className="btn-sweep inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors"
                style={
                  playingRiffId
                    ? { background: 'var(--acc)', borderColor: 'var(--acc)', color: '#000' }
                    : { borderColor: 'var(--line-2)', color: 'var(--fg)' }
                }
              >
                <i className={`bx ${playingRiffId ? 'bx-stop' : 'bx-play'} text-base`} />
                <span>{playingRiffId ? 'stop' : 'tocar riff'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-1 font-mono text-[10.5px] text-[#8d8d97]">
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-[#ffd43b]" />lenguajes</span>
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-[#5ce1ff]" />frameworks</span>
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-[#ff6b9d]" />bases de datos</span>
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-[#b38cff]" />herramientas</span>
            </div>
          </div>
        </div>

        {/* Selector de riffs conocidos + control de tempo BPM */}
        <div className="mb-5 flex flex-col gap-3 border-y border-white/10 py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-[#8d8d97]">
              <i className="bx bxs-guitar-amp mr-1" style={{ color: 'var(--acc)' }} />
              riffs:
            </span>
            {RIFFS.map((r) => {
              const isPlaying = playingRiffId === r.id;
              const isSelected = selectedRiffId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => (isPlaying ? stopRiff() : playRiff(r.id))}
                  data-cursor="tocar"
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11.5px] transition-all"
                  style={
                    isPlaying
                      ? { background: 'var(--acc)', borderColor: 'var(--acc)', color: '#000', fontWeight: 700 }
                      : isSelected
                      ? { borderColor: 'rgba(var(--acc-rgb), 0.6)', color: 'var(--fg)', background: 'rgba(var(--acc-rgb), 0.08)' }
                      : { borderColor: 'var(--line)', color: 'var(--mute)' }
                  }
                >
                  <i className={`bx ${isPlaying ? 'bx-stop-circle' : 'bx-play-circle'} text-sm`} />
                  <span>{r.name}</span>
                  <span className="opacity-60">· {r.artist}</span>
                  <span className="opacity-55">{r.bpm}bpm</span>
                  {r.origin === 'AR' && (
                    <span
                      className="rounded px-1 py-[1px] text-[9px] font-bold"
                      style={
                        isPlaying
                          ? { background: 'rgba(0,0,0,0.2)', color: '#000' }
                          : { background: 'rgba(92,225,255,0.16)', color: '#5ce1ff' }
                      }
                    >
                      AR
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11.5px] text-[#8d8d97]">
            <span className="inline-flex items-center gap-2">
              <i
                className="h-2 w-2 rounded-full transition-transform duration-100"
                style={{
                  background: playingRiffId ? 'var(--acc)' : 'rgba(255,255,255,0.2)',
                  transform: playingRiffId && beatPulse ? 'scale(1.5)' : 'scale(1)',
                  boxShadow: playingRiffId && beatPulse ? '0 0 10px var(--acc)' : 'none',
                }}
              />
              TEMPO:
              <b className="text-[#ecebe6]">{bpm} BPM</b>
              {bpm === currentRiff.bpm && <span style={{ color: 'var(--acc)' }}>(original)</span>}
            </span>
            <input
              type="range"
              min="70"
              max="185"
              value={bpm}
              aria-label="Ajustar tempo en BPM"
              onChange={(e) => setBpm(Number(e.target.value))}
              style={{ accentColor: 'var(--acc)' }}
              className="h-1 w-36 cursor-pointer rounded-lg bg-white/15"
            />
            {bpm !== currentRiff.bpm && (
              <button
                type="button"
                onClick={() => setBpm(currentRiff.bpm)}
                className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10.5px] text-[#ecebe6] transition-colors hover:border-[var(--acc)] hover:text-[var(--acc)]"
              >
                volver a {currentRiff.bpm} BPM
              </button>
            )}
          </div>
        </div>

        {/* Teclado de 24 teclas */}
        <div className="overflow-x-auto rounded-[14px] pb-1.5">
          <div className="relative flex h-[220px] min-w-[860px] select-none rounded-xl bg-[#050507] px-0.5 pt-1.5 sm:h-[260px]">
            {WHITE_KEYS.map((k) => (
              <button
                key={k.midi}
                type="button"
                aria-label={`${k.name}: ${k.desc}`}
                style={{ '--kc': CAT_COLOR[k.cat] }}
                className={`rig-key white ${activeMidis[k.midi] ? 'active' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  pointerDownRef.current = true;
                  if (!audioRig.enabled) audioRig.setEnabled(true);
                  pressKey(k.midi);
                }}
                onPointerEnter={() => {
                  if (pointerDownRef.current) pressKey(k.midi, { sound: true, dur: 0.35 });
                  else if (finePointer && !playingRiffId) pressKey(k.midi, { sound: false });
                }}
              >
                <span className="k-vertical whitespace-nowrap text-xs font-bold tracking-[0.04em]">{k.name}</span>
                {finePointer && <span className="mt-2.5 text-[10px] uppercase opacity-45">{k.hot}</span>}
              </button>
            ))}

            {BLACK_KEYS.map((k) => (
              <button
                key={k.midi}
                type="button"
                aria-label={`${k.name}: ${k.desc}`}
                style={{
                  '--kc': CAT_COLOR[k.cat],
                  left: `calc(${((k.pos + 1) * 100) / 14}% - ${(100 / 14) * 0.31}%)`,
                }}
                className={`rig-key black ${activeMidis[k.midi] ? 'active' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  pointerDownRef.current = true;
                  if (!audioRig.enabled) audioRig.setEnabled(true);
                  pressKey(k.midi);
                }}
                onPointerEnter={() => {
                  if (pointerDownRef.current) pressKey(k.midi, { sound: true, dur: 0.35 });
                  else if (finePointer && !playingRiffId) pressKey(k.midi, { sound: false });
                }}
              >
                <span className="k-vertical whitespace-nowrap text-[10px] font-bold tracking-[0.04em]">{k.name}</span>
                {finePointer && <span className="mt-2 text-[10px] uppercase opacity-45">{k.hot}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Habilidades blandas e idiomas */}
      <div className="mt-[18px] grid grid-cols-1 gap-[18px] lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[22px] border border-white/10 bg-[#111116] p-7">
          <h3 className="mb-4 font-mono text-sm font-medium">
            <span style={{ color: 'var(--acc)' }}>#</span> habilidades blandas
          </h3>
          <ul className="flex flex-wrap gap-2">
            {SOFT_SKILLS.map((s) => (
              <li
                key={s}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-rotate-2 hover:scale-105 hover:bg-[#ecebe6] hover:text-black"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[#111116] p-7">
          <h3 className="mb-4 font-mono text-sm font-medium">
            <span style={{ color: 'var(--acc)' }}>#</span> idiomas
          </h3>
          <div className="mb-3.5 grid grid-cols-[75px_1fr_85px] items-center gap-3.5 font-semibold">
            <span>Español</span>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#17171e]">
              <div className="h-full w-full rounded-full" style={{ background: 'var(--acc)' }} />
            </div>
            <span className="text-right font-mono text-xs font-normal text-[#8d8d97]">nativo</span>
          </div>
          <div className="grid grid-cols-[75px_1fr_85px] items-center gap-3.5 font-semibold">
            <span>Inglés</span>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#17171e]">
              <div className="h-full w-[55%] rounded-full" style={{ background: 'var(--acc)' }} />
            </div>
            <span className="text-right font-mono text-xs font-normal text-[#8d8d97]">intermedio</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default StackRig;
