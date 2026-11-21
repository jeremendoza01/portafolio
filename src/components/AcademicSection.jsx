import { ACADEMIC_PROGRAMS, RELEVANT_SUBJECTS } from '../data/portfolioData';

export default function AcademicSection() {
  return (
    <section id="academia" data-state="4" className="relative mx-auto max-w-[1440px] px-[var(--pad)] py-[clamp(90px,13vh,150px)]">
      <div className="mb-[clamp(40px,6.5vh,72px)] flex flex-wrap items-baseline gap-x-5 gap-y-3.5 border-b border-white/10 pb-5">
        <span
          className="grid h-11 w-11 flex-none place-items-center self-center rounded-full border font-mono text-[13px]"
          style={{ borderColor: 'var(--acc)', color: 'var(--acc)' }}
        >
          05
        </span>
        <h2 className="font-display text-[clamp(32px,5.8vw,88px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
          Historia Académica
        </h2>
        <span className="w-full font-mono text-xs text-[#8d8d97] md:ml-auto md:w-auto">
          UNViMe · formación técnica
        </span>
      </div>

      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
        {ACADEMIC_PROGRAMS.map((p) => (
          <article
            key={p.title}
            className="flex flex-col rounded-[22px] border border-white/10 bg-gradient-to-b from-[#111116] to-[#0a0a0c] p-6 transition-colors hover:border-[rgba(var(--acc-rgb),0.5)] sm:p-8"
          >
            <div className="flex items-center justify-between gap-2.5 font-mono text-[11.5px] tracking-[0.04em] text-[#8d8d97]">
              <span style={{ color: 'var(--acc)' }}>{p.badge}</span>
              <span>{p.meta}</span>
            </div>
            <h3 className="mt-3.5 font-display text-[clamp(24px,2.4vw,32px)] font-bold leading-[1.08] tracking-[-0.02em]">
              {p.title}
            </h3>
            <p className="mt-1.5 text-[15px] text-[#8d8d97]">{p.place}</p>

            <div className="mt-7">
              <div className="mb-2.5 flex justify-between gap-2.5 font-mono text-[12.5px]">
                <span>{p.progressLabel}</span>
                <span>
                  <b style={{ color: 'var(--acc)' }}>{p.percentText}</b> · {p.approved} aprobadas
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full border border-white/10 bg-[#17171e]">
                <div className="stripe-bar h-full rounded-full" style={{ width: `${p.percent}%` }} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3.5 border-t border-white/10 pt-5 font-mono sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <span className="font-display text-[clamp(26px,2.6vw,36px)] font-extrabold leading-none" style={{ color: 'var(--acc)' }}>
                  {p.avgNoFails}
                </span>
                <span className="text-[10.5px] leading-snug text-[#8d8d97]">promedio sin aplazos</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[clamp(26px,2.6vw,36px)] font-extrabold leading-none">
                  {p.avgWithFails}
                </span>
                <span className="text-[10.5px] leading-snug text-[#8d8d97]">promedio con aplazos</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[clamp(26px,2.6vw,36px)] font-extrabold leading-none">
                  {p.approved}
                </span>
                <span className="text-[10.5px] leading-snug text-[#8d8d97]">materias aprobadas</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-[18px] grid grid-cols-1 gap-[18px] lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[22px] border border-white/10 bg-[#111116] p-7">
          <h4 className="mb-4 font-mono text-[13.5px] font-medium">
            <span style={{ color: 'var(--acc)' }}>#</span> materias relevantes cursadas
          </h4>
          <ul className="flex flex-wrap gap-2">
            {RELEVANT_SUBJECTS.map((m) => (
              <li
                key={m}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-rotate-2 hover:scale-105 hover:bg-[#ecebe6] hover:text-black"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#111116] p-7">
          <div className="flex items-center justify-between gap-2 font-mono text-[11.5px] text-[#8d8d97]">
            <span style={{ color: 'var(--acc)' }}>2014 — 2020</span>
            <span>SECUNDARIO TÉCNICO</span>
          </div>
          <h4 className="my-3 font-display text-[22px] font-bold leading-tight">
            Técnico Electromecánico en Mantenimiento Industrial
          </h4>
          <p className="text-[15px] text-[#8d8d97]">
            Escuela Secundaria Gdor. Elías Adre — base técnica en circuitos, lógica y resolución práctica de problemas antes de pasar al software.
          </p>
        </div>
      </div>
    </section>
  );
}
