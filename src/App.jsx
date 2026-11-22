import { useCallback, useEffect, useRef, useState } from 'react';
import { audioRig } from './audio/audioRig';
import { ACCENTS, FALLBACK_REPOS, FEATURED_REPOS, GH_USER } from './data/portfolioData';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Topbar from './components/Topbar';
import HeroStrings from './components/HeroStrings';
import Marquee from './components/Marquee';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import StackRig from './components/StackRig';
import AcademicSection from './components/AcademicSection';
import ContactSection from './components/ContactSection';
import TerminalModal from './components/TerminalModal';

export default function App() {
  const [accIdx, setAccIdx] = useState(() => +(localStorage.getItem('jm-acc') || 0) % ACCENTS.length);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(audioRig.enabled);
  const [termOpen, setTermOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [repos, setRepos] = useState(FALLBACK_REPOS);
  const [repoTotal, setRepoTotal] = useState(25);

  const toastTimerRef = useRef(null);
  const heroRef = useRef(null);
  const rigRef = useRef(null);

  const accent = ACCENTS[accIdx];

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2200);
  }, []);

  // Aplicar acento CSS
  useEffect(() => {
    document.documentElement.style.setProperty('--acc', accent.hex);
    document.documentElement.style.setProperty('--acc-rgb', accent.rgb);
    localStorage.setItem('jm-acc', String(accIdx));
  }, [accIdx, accent]);

  const cycleAccent = useCallback(() => {
    let nextName = '';
    setAccIdx((prev) => {
      const next = (prev + 1) % ACCENTS.length;
      nextName = ACCENTS[next].name;
      return next;
    });
    const nextIdx = (accIdx + 1) % ACCENTS.length;
    nextName = ACCENTS[nextIdx].name;
    showToast(`acento: ${nextName}`);
    return nextName;
  }, [accIdx, showToast]);

  // Suscripción a estado de audio
  useEffect(() => audioRig.subscribe(({ enabled }) => setSoundEnabled(enabled)), []);

  const toggleSound = useCallback(() => {
    const next = !audioRig.enabled;
    audioRig.setEnabled(next);
    showToast(next ? 'ampli encendido 🎸' : 'sonido silenciado');
    if (next) audioRig.pluck(329.63, 1.3, 0.7);
  }, [showToast]);

  // Scroll tracking (progreso + sección activa)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      setProgress(max > 0 ? y / max : 0);
      setScrolled(y > 40);

      const probe = vh * 0.45;
      const els = document.querySelectorAll('[data-state]');
      let idx = 0;
      els.forEach((s, k) => {
        if (s.getBoundingClientRect().top <= probe) idx = k;
      });
      setActiveIdx(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch dinámico de repos de GitHub
  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (!alive || !Array.isArray(data)) return;
        setRepoTotal(data.length);
        const mapped = data
          .filter((r) => !r.fork && !FEATURED_REPOS.includes(r.name.toLowerCase()))
          .map((r) => ({
            name: r.name,
            language: r.language,
            date: (r.pushed_at || r.updated_at).slice(0, 7),
            homepage: r.homepage,
            description: r.description,
            html_url: r.html_url,
          }));
        setRepos(mapped);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Atajos globales para terminal (Ctrl+K, ~, Esc)
  useEffect(() => {
    const onKeyDown = (e) => {
      const k = (e.key || '').toLowerCase();
      if (k === 'escape' && termOpen) {
        setTermOpen(false);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && k === 'k') {
        e.preventDefault();
        setTermOpen((v) => !v);
        return;
      }
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
      if (typing || termOpen) return;
      if (['`', '~', '|', 'º', '¬'].includes(e.key)) {
        e.preventDefault();
        setTermOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [termOpen]);

  useEffect(() => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
          document.documentElement.style.scrollBehavior = '';
        }, 120);
      }
    }
    console.log(
      '%c JM %c React + Tailwind + Rock Argentino. escribime: mjeremiasadriel@gmail.com ',
      'background:#c8ff2e;color:#000;font-weight:700;padding:4px 6px;border-radius:4px 0 0 4px',
      'background:#111;color:#c8ff2e;padding:4px 6px;border-radius:0 4px 4px 0'
    );
  }, []);

  return (
    <>
      <Loader />
      <div className="grain" aria-hidden="true" />
      <CustomCursor />

      <div
        className="fixed left-0 top-0 z-[800] h-[2px] w-full origin-left"
        style={{ background: 'var(--acc)', transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <Topbar
        activeIdx={activeIdx}
        scrolled={scrolled}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenTerminal={() => setTermOpen(true)}
        onCycleAccent={cycleAccent}
      />

      <main>
        <HeroStrings
          ref={heroRef}
          accentRgb={accent.rgb}
          onOpenTerminal={() => setTermOpen(true)}
        />
        <Marquee />
        <AboutSection repoTotal={repoTotal} />
        <ProjectsSection repos={repos} onToast={showToast} />
        <StackRig ref={rigRef} accentRgb={accent.rgb} onToast={showToast} />
        <AcademicSection />
        <ContactSection onToast={showToast} />
      </main>

      <TerminalModal
        open={termOpen}
        onClose={() => setTermOpen(false)}
        repoCount={repos.length}
        onCycleAccent={cycleAccent}
        onStrumHero={() => heroRef.current?.strumChord(true)}
        onPlayRiff={(id) => rigRef.current?.playRiff(id)}
      />

      <div
        role="status"
        style={{ background: 'var(--acc)' }}
        className={`pointer-events-none fixed bottom-7 left-1/2 z-[970] -translate-x-1/2 rounded-full px-5 py-3 font-mono text-[13px] font-bold text-black transition-all duration-300 ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
        }`}
      >
        {toastMsg}
      </div>
    </>
  );
}
