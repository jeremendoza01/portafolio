import { SECTIONS } from '../data/portfolioData';

export default function Topbar({
  activeIdx,
  scrolled,
  soundEnabled,
  onToggleSound,
  onOpenTerminal,
  onCycleAccent,
}) {
  const current = SECTIONS[activeIdx] || SECTIONS[0];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[700] flex items-center justify-between gap-5 px-[var(--pad)] transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-[#0a0a0c]/75 py-2.5 backdrop-blur-xl'
            : 'py-4'
        }`}
      >
        <a href="#inicio" className="group flex items-center gap-2.5" data-cursor="inicio" aria-label="Inicio">
          <svg
            viewBox="0 0 48 48"
            className="h-[38px] w-[38px] transition-transform duration-700 group-hover:rotate-[360deg]"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="21" fill="none" stroke="var(--acc)" strokeWidth="2" />
            <circle cx="24" cy="24" r="17" fill="none" stroke="var(--acc)" strokeWidth="1" opacity="0.6" />
            <text x="24" y="29.5" textAnchor="middle" fill="var(--acc)" className="font-mono text-[14px] font-bold">
              JM
            </text>
          </svg>
          <span className="hidden font-mono text-[15px] font-bold sm:inline">
            jere<span style={{ color: 'var(--acc)' }}>.</span>dev
          </span>
        </a>

        <div
          className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 font-mono text-xs text-[#8d8d97] lg:flex"
          aria-live="polite"
        >
          <span>
            TRACK <b style={{ color: 'var(--acc)' }}>{current.num}</b>
            <span className="opacity-50">/06</span>
          </span>
          <span className="border-l border-white/10 pl-3 text-[#ecebe6]">{current.label}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1.5 hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] text-[#8d8d97] xl:inline-flex">
            <i className="pulse-dot h-[7px] w-[7px] rounded-full" style={{ background: 'var(--acc)' }} />
            abierto a oportunidades
          </span>
          <button
            type="button"
            onClick={onToggleSound}
            data-cursor="sonido"
            aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            aria-pressed={soundEnabled}
            className="grid h-[38px] w-[38px] place-items-center rounded-full border text-lg transition-all duration-300"
            style={
              soundEnabled
                ? { background: 'var(--acc)', color: '#000', borderColor: 'var(--acc)' }
                : { borderColor: 'var(--line)' }
            }
          >
            <i className={`bx ${soundEnabled ? 'bx-volume-full' : 'bx-volume-mute'}`} />
          </button>
          <button
            type="button"
            onClick={onOpenTerminal}
            data-cursor="terminal"
            aria-label="Abrir terminal"
            className="grid h-[38px] w-[38px] place-items-center rounded-full border border-white/10 text-lg transition-colors hover:border-[var(--acc)] hover:text-[var(--acc)]"
          >
            <i className="bx bx-terminal" />
          </button>
          <button
            type="button"
            onClick={onCycleAccent}
            data-cursor="color"
            aria-label="Cambiar color de acento"
            className="grid h-[38px] w-[38px] place-items-center rounded-full border border-white/10 text-lg transition-colors hover:border-[var(--acc)] hover:text-[var(--acc)]"
          >
            <i className="bx bx-palette" />
          </button>
        </div>
      </header>

      {/* Navegación lateral en desktop / barra inferior en mobile */}
      <nav
        aria-label="Secciones"
        className="fixed bottom-3.5 left-1/2 z-[600] -translate-x-1/2 rounded-full border border-white/10 bg-[#111116]/90 px-3.5 py-2 backdrop-blur-xl lg:bottom-auto lg:left-auto lg:right-[calc(var(--pad)*0.45)] lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
      >
        <ol className="flex flex-row gap-3 lg:flex-col lg:gap-[18px]">
          {SECTIONS.map((s, idx) => {
            const active = idx === activeIdx;
            return (
              <li key={s.id} className="relative">
                <a href={`#${s.id}`} className="group relative flex items-center justify-center">
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full border font-mono text-[10px] font-medium transition-all duration-300 lg:h-[30px] lg:w-[30px]"
                    style={
                      active
                        ? {
                            background: 'var(--acc)',
                            borderColor: 'var(--acc)',
                            color: '#000',
                            boxShadow: '0 0 20px rgba(var(--acc-rgb), 0.4)',
                          }
                        : {
                            background: 'var(--bg)',
                            borderColor: 'var(--line-2)',
                            color: 'var(--mute)',
                          }
                    }
                  >
                    {s.num}
                  </span>
                  <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden translate-x-2 whitespace-nowrap rounded-full border border-white/10 bg-[#17171e] px-2.5 py-1 font-mono text-[11px] font-medium text-[#ecebe6] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:block">
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
