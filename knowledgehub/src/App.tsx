import React, { useState, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Play, BookOpen, ShieldAlert, Database, Code, ShieldCheck, Cpu, Swords, LogOut, ChevronDown, Sun, Moon, ArrowLeft, CheckCircle2, Lock, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ZONES_CONTENT } from './data/analogies';
import { QuizEngine } from './components/QuizEngine';
import { BadgeToast } from './components/BadgeToast';
import { useQuestStore } from './store/useQuestStore';

// Mock Data for the Zones
const ZONES = [
  {
    id: 'manual',
    title: 'Manual Testing',
    icon: <ShieldAlert size={32} className="text-orange-400" />,
    description: 'Explore the foundations of breaking things before the users do.',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badge: 'The Detective',
    colorText: 'text-orange-400'
  },
  {
    id: 'sql',
    title: 'SQL Sorcery',
    icon: <Database size={32} className="text-blue-400" />,
    description: 'Master the art of demanding data from the kitchen without crashing the server.',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badge: 'Data Whisperer',
    colorText: 'text-blue-400'
  },
  {
    id: 'api',
    title: 'API Testing',
    icon: <Cpu size={32} className="text-purple-400" />,
    description: 'The invisible glue. Order unicorns from waiters and handle 404s with grace.',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badge: 'The Postman',
    colorText: 'text-purple-400'
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    icon: <Code size={32} className="text-sky-400" />,
    description: 'JavaScript with an overly protective mother. Learn to build Tupperware for your code.',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    badge: 'Type Guardian',
    colorText: 'text-sky-400'
  },
  {
    id: 'playwright',
    title: 'Playwright',
    icon: <Play size={32} className="text-emerald-400" />,
    description: 'Give the hitman a precise description, not just "the guy in the shirt".',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badge: 'Grandmaster Automaton',
    colorText: 'text-emerald-400'
  },
  {
    id: 'ai-qa',
    title: 'AI for QA',
    icon: <ShieldCheck size={32} className="text-rose-400" />,
    description: 'Talk to literal-minded genies and build self-healing zombie scripts.',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badge: 'Cyborg Tester',
    colorText: 'text-rose-400'
  }
];

const ZONE_TIERS: Record<string, { id: string; label: string; color: string; moduleIds: string[] }[]> = {
  typescript: [
    {
      id: 'beginner',
      label: 'Beginner',
      color: 'text-emerald-400',
      moduleIds: ['data-types','objects-arrays','control-flow','loops','functions','async','error-handling','oop','modules','ts-types','template-literals','destructuring'],
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      color: 'text-sky-400',
      moduleIds: ['type-aliases','type-narrowing','generics','utility-types','null-safety'],
    },
    {
      id: 'expert',
      label: 'Expert',
      color: 'text-amber-400',
      moduleIds: [],
    },
  ],
  manual: [
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['what-is-testing','types-of-testing','writing-test-cases','happy-path','negative-testing','exploratory-testing','bug-life-cycle','severity-vs-priority'],
    },
    {
      id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',
      moduleIds: ['bva','equivalence-partitioning','state-transition','test-planning','defect-reporting','regression-testing'],
    },
    {
      id: 'expert', label: 'Expert', color: 'text-amber-400',
      moduleIds: ['risk-based-testing','state-dependency','race-conditions','interrupt-testing','usability-testing','test-metrics'],
    },
  ],
  sql: [
    { id: 'beginner',     label: 'Beginner',     color: 'text-emerald-400', moduleIds: ['basic']        },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',     moduleIds: ['intermediate'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400',   moduleIds: ['expert']       },
  ],
  api: [
    { id: 'beginner',     label: 'Beginner',     color: 'text-emerald-400', moduleIds: ['basic']        },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',     moduleIds: ['intermediate'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400',   moduleIds: ['expert']       },
  ],
  playwright: [
    { id: 'beginner',     label: 'Beginner',     color: 'text-emerald-400', moduleIds: ['basic']        },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',     moduleIds: ['intermediate'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400',   moduleIds: ['expert']       },
  ],
  'ai-qa': [
    { id: 'beginner',     label: 'Beginner',     color: 'text-emerald-400', moduleIds: ['basic']        },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',     moduleIds: ['intermediate'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400',   moduleIds: ['expert']       },
  ],
};

const XP_LEVELS = [
  { level: 1, title: 'Professional Button Clicker', min: 0    },
  { level: 2, title: 'Chaos Apprentice',            min: 200  },
  { level: 3, title: 'Bug Whisperer',               min: 500  },
  { level: 4, title: 'Assert Addict',               min: 1000 },
  { level: 5, title: 'Flake Fighter',               min: 1800 },
  { level: 6, title: 'Pipeline Overlord',           min: 2800 },
  { level: 7, title: 'Test Oracle',                 min: 4000 },
  { level: 8, title: 'The Unkillable QA',           min: 5500 },
];

function getLevel(xp: number) {
  let current = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (xp >= lvl.min) current = lvl;
  }
  const nextIdx = XP_LEVELS.findIndex(l => l.level === current.level) + 1;
  const next = XP_LEVELS[nextIdx] ?? null;
  const progress = next
    ? Math.min(((xp - current.min) / (next.min - current.min)) * 100, 100)
    : 100;
  return { current, next, progress };
}

const PREVIEW_MODULES = ['Data Types', 'Control Flow', 'Functions', 'Async / Await', 'Generics', 'Null Safety'];

function WelcomePage() {
  const navigate = useNavigate();
  const setPlayerName = useQuestStore((state) => state.setPlayerName);
  const xp = useQuestStore((state) => state.xp);
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const theme = useQuestStore((state) => state.theme);
  const toggleTheme = useQuestStore((state) => state.toggleTheme);
  const isReturning = xp > 0 || completedLevels.length > 0;
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = React.useRef<SpeechSynthesis | null>(null);

  // ── Narrator voice-over ──────────────────────────────────────
  const NARRATOR_LINES = [
    { text: "Welcome.", rate: 0.88, pitch: 0.65 },
    { text: "To the Q A Quest Arena.", rate: 0.92, pitch: 0.68 },
    { text: "Six realms of knowledge await.", rate: 0.95, pitch: 0.70 },
    { text: "Infinite bugs hide in the shadows.", rate: 0.93, pitch: 0.67 },
    { text: "One tester stands between order and chaos.", rate: 0.91, pitch: 0.65 },
    { text: "Enter your name.", rate: 0.87, pitch: 0.62 },
    { text: "And begin... your legend.", rate: 0.85, pitch: 0.70 },
  ];

  const speakNarration = React.useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    if (synth.speaking) synth.cancel();

    const pickVoice = (voices: SpeechSynthesisVoice[]) => {
      const preferred = [
        'Google UK English Male',
        'Microsoft George Online (Natural)',
        'Microsoft George',
        'Microsoft David Desktop',
        'Microsoft David',
        'Daniel',
        'Alex',
      ];
      let v = voices.find(vx => preferred.some(p => vx.name.includes(p)));
      if (!v) v = voices.find(vx => vx.lang.startsWith('en') && /male|daniel|david|alex|george|oliver|arthur/i.test(vx.name));
      if (!v) v = voices.find(vx => vx.lang.startsWith('en'));
      return v ?? null;
    };

    const queue = (voices: SpeechSynthesisVoice[]) => {
      setIsSpeaking(true);
      const voice = pickVoice(voices);
      NARRATOR_LINES.forEach((line, i) => {
        const utt = new SpeechSynthesisUtterance(line.text);
        if (voice) utt.voice = voice;
        utt.rate   = line.rate;
        utt.pitch  = line.pitch;
        utt.volume = 0.88;
        if (i === NARRATOR_LINES.length - 1) {
          utt.onend = () => setIsSpeaking(false);
          utt.onerror = () => setIsSpeaking(false);
        }
        synth.speak(utt);
      });
    };

    const voices = synth.getVoices();
    if (voices.length > 0) {
      queue(voices);
    } else {
      synth.addEventListener('voiceschanged', () => queue(synth.getVoices()), { once: true });
    }
  }, []);

  // Auto-play on mount (slight delay so page animation settles first)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMuted) speakNarration();
    }, 900);
    return () => {
      clearTimeout(timer);
      synthRef.current?.cancel();
      setIsSpeaking(false);
    };
  }, []);

  // Toggle mute / unmute
  const handleVoiceToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      speakNarration();
    } else {
      setIsMuted(true);
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  // Live preview animation state
  const [previewModuleIdx, setPreviewModuleIdx] = useState(0);
  const [previewXp, setPreviewXp] = useState(750);
  const [previewBar, setPreviewBar] = useState(42);
  const [phase, setPhase] = useState<'studying' | 'completing' | 'badge'>('studying');
  const [completedSet, setCompletedSet] = useState<number[]>([0, 1]);

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      // Phase 1: studying (progress bar fills)
      setPhase('studying');
      timers.push(setTimeout(() => {
        // Phase 2: module completes
        setPhase('completing');
        setCompletedSet(prev => [...prev, previewModuleIdx]);
        timers.push(setTimeout(() => {
          // Phase 3: XP + badge flash
          setPhase('badge');
          setPreviewXp(prev => Math.min(prev + 100, 1750));
          setPreviewBar(prev => Math.min(prev + 18, 95));
          timers.push(setTimeout(() => {
            // Advance to next module
            setPreviewModuleIdx(prev => (prev + 1) % PREVIEW_MODULES.length);
            setPhase('studying');
          }, 1800));
        }, 1200));
      }, 2500));
    };
    cycle();
    const loop = setInterval(cycle, 6000);
    return () => { clearInterval(loop); timers.forEach(clearTimeout); };
  }, [previewModuleIdx]);

  const handleEnter = () => {
    if (input.trim().length === 0) return;
    setPlayerName(input.trim());
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#07050f] font-sans flex overflow-hidden">

      {/* ════════════════════════════════
          LEFT HERO  (60%)
      ════════════════════════════════ */}
      <div className="relative hidden md:flex w-[60%] flex-col justify-center gap-10 px-14 py-12 overflow-hidden">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.055) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.38, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-fuchsia-500/20 rounded-full blur-[130px]" />
          <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.28, 0.15] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px]" />
        </div>

        {/* ── Branding: QA Quest as the hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
          <h1 className="text-7xl font-black bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-none mb-3">
            QA Quest
          </h1>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Master QA Engineering.</p>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-sm leading-relaxed mb-7">
            Six realms of knowledge. Real XP. Boss fights. The only QA learning hub built like a game.
          </p>
          <div className="flex items-center gap-8">
            {[{ v: '6', l: 'Realms' }, { v: '50+', l: 'Modules' }, { v: '8', l: 'XP Levels' }].map(s => (
              <div key={s.l}>
                <p className="text-3xl font-black bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">{s.v}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Live animated session preview ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-400" />
            </span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Live session</p>
          </div>

          {/* App window frame */}
          <div className="bg-white/70 dark:bg-slate-900/70 border border-violet-300/50 dark:border-violet-900/40 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-violet-300/50 dark:border-violet-900/30 bg-white/80 dark:bg-slate-950/50">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <div className="flex-1 mx-4 bg-slate-200/80 dark:bg-slate-800/80 rounded-md h-5 flex items-center px-3">
                <span className="text-slate-500 dark:text-slate-600 text-xs">qa-quest.app / zone / typescript</span>
              </div>
            </div>

            <div className="p-5 flex gap-5">
              {/* Sidebar */}
              <div className="w-36 flex-shrink-0 space-y-1">
                <p className="text-slate-500 dark:text-slate-600 text-xs uppercase tracking-wider mb-2 font-semibold">Modules</p>
                {PREVIEW_MODULES.map((mod, i) => {
                  const isDone = completedSet.includes(i);
                  const isActive = i === previewModuleIdx;
                  return (
                    <div key={mod} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all duration-500 ${
                      isActive ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                      isDone ? 'text-slate-500' : 'text-slate-500 dark:text-slate-700'
                    }`}>
                      {isDone ? <span className="text-emerald-400 flex-shrink-0">✓</span> :
                       isActive ? <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 animate-pulse" /> :
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0" />}
                      <span className="truncate">{mod}</span>
                    </div>
                  );
                })}
              </div>

              {/* Main content */}
              <div className="flex-1 space-y-4 min-w-0">
                {/* Step indicator */}
                <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl p-1.5">
                  {['📖 Learn', '⚔️ Boss Fight', '✓ Complete'].map((s, i) => (
                    <div key={s} className={`flex-1 text-center text-xs py-1.5 rounded-lg font-semibold transition-all duration-500 ${
                      i === 0 && phase === 'studying' ? 'bg-slate-700 text-white' :
                      i === 1 && phase === 'completing' ? 'bg-rose-500/80 text-white' :
                      i === 2 && phase === 'badge' ? 'bg-emerald-500/80 text-white' :
                      'text-slate-500 dark:text-slate-600'
                    }`}>{s}</div>
                  ))}
                </div>

                {/* Lesson progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{PREVIEW_MODULES[previewModuleIdx]}</span>
                    <span>{previewBar}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: phase === 'completing' ? '100%' : phase === 'badge' ? '100%' : `${previewBar}%` }}
                      transition={{ duration: phase === 'completing' ? 0.8 : 0.3, ease: 'easeOut' }}
                      className={`h-full rounded-full ${phase === 'completing' || phase === 'badge' ? 'bg-emerald-500' : 'bg-violet-500'}`}
                    />
                  </div>
                </div>

                {/* XP bar */}
                <div className="bg-slate-100/80 dark:bg-slate-800/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">⚡</span>
                      <span className="text-amber-400 text-xs font-bold">Bug Whisperer</span>
                    </div>
                    <motion.span
                      key={previewXp}
                      initial={{ scale: 1.4, color: '#fbbf24' }}
                      animate={{ scale: 1, color: '#6b7280' }}
                      transition={{ duration: 0.5 }}
                      className="text-xs font-bold text-slate-500"
                    >
                      {previewXp.toLocaleString()} XP
                    </motion.span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${(previewXp / 1800) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Badge flash */}
                <motion.div
                  animate={{ opacity: phase === 'badge' ? 1 : 0, y: phase === 'badge' ? 0 : 8 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3"
                >
                  <span className="text-lg">🏆</span>
                  <div>
                    <p className="text-emerald-400 text-xs font-bold">+100 XP — Module Complete!</p>
                    <p className="text-slate-500 text-xs">Type Guardian badge progress</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════
          RIGHT LOGIN PANEL  (40%)
      ════════════════════════════════ */}
      <div className="w-full md:w-[40%] flex flex-col justify-center px-10 py-12 border-l border-violet-200/50 dark:border-violet-900/25 bg-[#ede8ff]/70 dark:bg-[#0a0715]/70 backdrop-blur-sm relative">
        {/* Theme toggle — top right */}
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg bg-white/60 dark:bg-slate-900/60 border border-violet-200/50 dark:border-violet-900/40 text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Narrator voice button — top left */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <button
            onClick={handleVoiceToggle}
            title={isMuted ? 'Play narrator' : 'Mute narrator'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
              isMuted
                ? 'bg-white/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                : 'bg-violet-500/10 dark:bg-violet-500/10 border-violet-400/30 dark:border-violet-500/30 text-violet-500 dark:text-violet-400 hover:bg-violet-500/20'
            }`}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            {/* Animated sound-wave bars */}
            {!isMuted && isSpeaking && (
              <div className="flex items-end gap-px h-3">
                {[0, 0.18, 0.09].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-violet-400 rounded-full"
                    animate={{ height: ['3px', '11px', '3px'] }}
                    transition={{ duration: 0.55, repeat: Infinity, delay, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            )}
            <span className="hidden sm:inline">
              {isMuted ? 'Narrator off' : isSpeaking ? 'Narrating…' : 'Replay'}
            </span>
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Logo */}
          <div className="mb-8">
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(192,38,211,0.2)', '0 0 40px rgba(192,38,211,0.45)', '0 0 20px rgba(192,38,211,0.2)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center mb-6"
            >
              <BookOpen size={28} className="text-fuchsia-400" />
            </motion.div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
              {isReturning ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isReturning ? 'Continue your quest.' : 'Enter your name to begin.'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3 mb-8">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
              placeholder="Your name"
              maxLength={30}
              autoFocus
              className="w-full bg-white/80 dark:bg-slate-900/80 border border-violet-300/60 dark:border-violet-900/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20 transition"
            />
            <motion.button
              onClick={handleEnter}
              disabled={input.trim().length === 0}
              whileHover={{ scale: input.trim().length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all
                bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white
                shadow-[0_0_24px_rgba(192,38,211,0.35)]
                hover:shadow-[0_0_40px_rgba(192,38,211,0.55)]
                disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Enter the Realm →
            </motion.button>
          </div>

          {/* Stat strip */}
          <div className="flex items-center justify-between pt-6 border-t border-violet-300/50 dark:border-violet-900/30">
            {[{ v: '6', l: 'Realms' }, { v: '50+', l: 'Modules' }, { v: '8', l: 'XP Levels' }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-slate-900 dark:text-white font-black text-xl leading-tight">{s.v}</p>
                <p className="text-slate-500 dark:text-slate-600 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-500 dark:text-slate-700 text-xs mt-6 text-center">No account needed · Progress saved locally</p>
        </motion.div>
      </div>
    </div>
  );
}

function HubMap() {
  const navigate = useNavigate();
  const zoneProgress = useQuestStore((state) => state.zoneProgress);
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const xp = useQuestStore((state) => state.xp);
  const playerName = useQuestStore((state) => state.playerName);
  const clearPlayerName = useQuestStore((state) => state.clearPlayerName);
  const unlockedBadges = useQuestStore((state) => state.unlockedBadges);
  const lastBountyDate = useQuestStore((state) => state.lastBountyDate);
  const claimDailyBounty = useQuestStore((state) => state.claimDailyBounty);
  const theme = useQuestStore((state) => state.theme);
  const toggleTheme = useQuestStore((state) => state.toggleTheme);
  const today = new Date().toISOString().slice(0, 10);
  const bountyAlreadyClaimed = lastBountyDate === today;

  const { current, next, progress } = getLevel(xp);
  const earnedCount = unlockedBadges.length;

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#07050f] text-slate-700 dark:text-slate-200 font-sans flex flex-col">

      {/* Top navbar */}
      <header className="h-16 border-b border-violet-300/50 dark:border-violet-900/30 bg-[#ede8ff]/80 dark:bg-[#0a0715]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-fuchsia-400 flex-shrink-0" />
          <h1 className="text-xl font-black bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_12px_rgba(192,38,211,0.3)]">
            QA Quest: The Knowledge Hub
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-110 active:scale-95 transition-all duration-200"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {/* Logout */}
          <div className="relative group">
            <button
              onClick={() => { clearPlayerName(); navigate('/login', { replace: true }); }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10 hover:shadow-[0_0_14px_rgba(244,63,94,0.25)] hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <LogOut size={15} />
            </button>
            <span className="absolute right-11 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Log out
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ── */}
        <aside className="w-72 flex-shrink-0 border-r border-violet-200/50 dark:border-violet-900/25 bg-[#ede8ff]/60 dark:bg-[#0a0715]/60 flex flex-col gap-5 p-5 overflow-y-auto sidebar-scroll">

          {/* Player card */}
          <div className="bg-white/60 dark:bg-slate-900/60 border border-violet-300/50 dark:border-violet-900/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-[0_0_16px_rgba(192,38,211,0.4)]">
                {playerName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{playerName}</p>
                <p className="text-amber-400 text-xs truncate">{current.title}</p>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700px-2 py-0.5 rounded-full flex-shrink-0">
                Lv.{current.level}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-medium">{xp.toLocaleString()} XP</span>
              <span>{next ? `Next: ${next.min.toLocaleString()}` : 'Max Level'}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
              />
            </div>
            <p className="text-slate-500 dark:text-slate-600 text-xs mt-1.5">
              {next ? `${(next.min - xp).toLocaleString()} XP to ${next.title}` : 'You have achieved the ultimate rank.'}
            </p>
          </div>

          {/* Daily Bounty */}
          <div className={`rounded-2xl border p-4 transition-all ${bountyAlreadyClaimed ? 'bg-white/60 dark:bg-slate-900/60 border-slate-800' : 'bg-amber-500/5 border-amber-500/25'}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-base">⚔️</span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Daily Bounty</p>
              </div>
              {!bountyAlreadyClaimed && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs mb-3 leading-relaxed">
              {bountyAlreadyClaimed ? "Come back tomorrow for more XP!" : "Complete your daily quest and earn +50 XP."}
            </p>
            <button
              onClick={claimDailyBounty}
              disabled={bountyAlreadyClaimed}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                bountyAlreadyClaimed
                  ? 'bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:shadow-[0_0_18px_rgba(245,158,11,0.25)]'
              }`}
            >
              {bountyAlreadyClaimed ? '✓ Claimed Today' : 'Claim +50 XP'}
            </button>
          </div>

          {/* Mastery Badges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mastery Badges</h2>
              <span className="text-xs text-slate-500 dark:text-slate-600">{earnedCount}/{ZONES.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ZONES.map((zone) => {
                const earned = unlockedBadges.includes(zone.badge);
                return (
                  <div
                    key={zone.id}
                    className={`relative flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                      earned
                        ? `${zone.bgColor} ${zone.borderColor} shadow-[0_0_12px_rgba(0,0,0,0.2)]`
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 [&>svg]:w-5 [&>svg]:h-5 ${earned ? 'bg-white/80 dark:bg-slate-900/80' : 'bg-slate-200 dark:bg-slate-700/50'}`}>
                      {earned ? zone.icon : <span className="text-slate-400 dark:text-slate-500 text-sm">🔒</span>}
                    </div>
                    <p className={`text-xs font-bold leading-tight ${earned ? zone.colorText : 'text-slate-400 dark:text-slate-500'}`}>{zone.badge}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 truncate w-full">{zone.title}</p>
                    {earned && <span className="absolute top-1.5 right-1.5 text-xs">⭐</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Main: zone cards ── */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Welcome back, <span className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 dark:from-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">{playerName}</span> 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Choose a realm to conquer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {ZONES.map((zone, i) => {
              const progress = zoneProgress[zone.id] || 0;
              const isMastered = progress >= 100;
              const isStarted = progress > 0 && !isMastered;
              const totalModules = ZONES_CONTENT[zone.id]?.levels.length ?? 0;
              const completedCount = ZONES_CONTENT[zone.id]?.levels.filter(
                l => completedLevels.includes(`${zone.id}::${l.id}`)
              ).length ?? 0;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  key={zone.id}
                  onClick={() => navigate(`/zone/${zone.id}`)}
                  className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${zone.bgColor} ${
                    isMastered
                      ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                      : isStarted
                      ? zone.borderColor + ' shadow-[inset_3px_0_0_0] ' + zone.colorText.replace('text-', 'shadow-')
                      : zone.borderColor + ' hover:border-slate-500'
                  }`}
                >
                  {isMastered && (
                    <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                      ⭐ {zone.badge}
                    </div>
                  )}
                  {progress === 0 && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-0 transition-opacity group-hover:opacity-0" />
                  )}
                  <div className="p-6 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900shadow-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-center mb-5">
                      {zone.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{zone.title}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${zone.bgColor} ${zone.colorText} border-current opacity-80`}>
                        {completedCount}/{totalModules}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">{zone.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex-1 mr-4">
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Map Explored</span>
                          <span className={isMastered ? 'text-amber-400' : 'text-slate-600 dark:text-slate-300'}>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${isMastered ? 'bg-amber-400' : zone.colorText.replace('text-', 'bg-')}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <button className="font-bold text-sm px-4 py-2 bg-slate-900/5 hover:bg-slate-900/10 border border-slate-900/10 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 rounded-lg text-slate-800 dark:text-white transition">
                        Enter
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>

      </div>
    </div>
  );
}

// The Library & Arena
function ZoneView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mode, setMode] = useState<'library' | 'arena'>('library');
  const [level, setLevel] = useState<string>('');
  const [justCompleted, setJustCompleted] = useState(false);
  const [completionWasFirstTime, setCompletionWasFirstTime] = useState(false);
  const [collapsedTiers, setCollapsedTiers] = useState<Record<string, boolean>>({ beginner: true, intermediate: true, expert: true });
  const mainContentRef = React.useRef<HTMLDivElement>(null);

  const toggleTier = (tierId: string) =>
    setCollapsedTiers((prev) => ({ ...prev, [tierId]: !prev[tierId] }));
  
  const zoneMeta = ZONES.find(z => z.id === id);
  const contentData = ZONES_CONTENT[id || ''];
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const theme = useQuestStore((state) => state.theme);
  const toggleTheme = useQuestStore((state) => state.toggleTheme);

  React.useEffect(() => {
    if (contentData && contentData.levels.length > 0 && !contentData.levels.find(l => l.id === level)) {
      setLevel(contentData.levels[0].id);
    }
  }, [contentData, level]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
    setJustCompleted(false);
  }, [level]);

  if (!zoneMeta) return <div className="p-8 text-white">Zone not found</div>;

  const currentContent = contentData?.levels.find(l => l.id === level);

  const availableLevels = contentData?.levels.map(l => l.id) || [];
  const progressIncrement = Math.floor(100 / (availableLevels.length || 1));

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#07050f] text-slate-700 dark:text-slate-200 font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-violet-300/50 dark:border-violet-900/30 bg-[#ede8ff]/80 dark:bg-[#0a0715]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => navigate('/', { replace: true })}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all duration-200 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm font-semibold">Back</span>
          </button>

          {/* Separator */}
          <span className="text-slate-300 dark:text-slate-700 select-none">|</span>

          {/* Breadcrumb: zone icon + name */}
          <div className="flex items-center gap-2">
            <span className="[&>svg]:w-5 [&>svg]:h-5">{zoneMeta.icon}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{zoneMeta.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          {/* Library / Arena toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setMode('library')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition ${mode === 'library' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <BookOpen size={16} /> The Library
            </button>
            <button
              onClick={() => setMode('arena')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition ${mode === 'arena' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Swords size={16} /> The Arena
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl w-full mx-auto p-6 flex gap-8">
        
        {/* ── Left Sidebar: Module Navigator ── */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 sidebar-scroll space-y-3">

            {/* Header */}
            <div className="flex items-center justify-between px-1 mb-1">
              <h3 className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">Modules</h3>
              {contentData && (
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  {completedLevels.filter(k => k.startsWith(`${id}::`)).length}/{contentData.levels.length}
                </span>
              )}
            </div>

            {ZONE_TIERS[id || ''] ? (
              ZONE_TIERS[id || ''].map((tier) => {
                const isCollapsed = !!collapsedTiers[tier.id];
                const completedInTier = tier.moduleIds.filter(lvl => completedLevels.includes(`${id}::${lvl}`)).length;
                const tierPct = tier.moduleIds.length > 0 ? Math.round((completedInTier / tier.moduleIds.length) * 100) : 0;
                const allTierDone = tier.moduleIds.length > 0 && completedInTier === tier.moduleIds.length;

                const TC = {
                  beginner: {
                    emoji: '🌱',
                    label: tier.color,
                    headerBg: 'bg-emerald-500/8 dark:bg-emerald-500/6',
                    headerBorder: 'border-emerald-500/25',
                    bar: 'bg-emerald-500',
                    badge: 'bg-emerald-500/15 text-emerald-400',
                    activeBg: 'bg-emerald-500/12 dark:bg-emerald-500/10 border-emerald-500/30',
                    activeGlow: 'shadow-[inset_0_0_0_1px_rgba(16,185,129,0.3)]',
                    numActive: 'bg-emerald-500/20 text-emerald-400',
                    dot: 'bg-emerald-400',
                    headerAccent: 'from-emerald-500/20 to-transparent',
                  },
                  intermediate: {
                    emoji: '⚡',
                    label: tier.color,
                    headerBg: 'bg-sky-500/8 dark:bg-sky-500/6',
                    headerBorder: 'border-sky-500/25',
                    bar: 'bg-sky-500',
                    badge: 'bg-sky-500/15 text-sky-400',
                    activeBg: 'bg-sky-500/12 dark:bg-sky-500/10 border-sky-500/30',
                    activeGlow: 'shadow-[inset_0_0_0_1px_rgba(14,165,233,0.3)]',
                    numActive: 'bg-sky-500/20 text-sky-400',
                    dot: 'bg-sky-400',
                    headerAccent: 'from-sky-500/20 to-transparent',
                  },
                  expert: {
                    emoji: '🔥',
                    label: tier.color,
                    headerBg: 'bg-amber-500/8 dark:bg-amber-500/6',
                    headerBorder: 'border-amber-500/25',
                    bar: 'bg-amber-500',
                    badge: 'bg-amber-500/15 text-amber-400',
                    activeBg: 'bg-amber-500/12 dark:bg-amber-500/10 border-amber-500/30',
                    activeGlow: 'shadow-[inset_0_0_0_1px_rgba(245,158,11,0.3)]',
                    numActive: 'bg-amber-500/20 text-amber-400',
                    dot: 'bg-amber-400',
                    headerAccent: 'from-amber-500/20 to-transparent',
                  },
                }[tier.id] || {};

                return (
                  <div key={tier.id} className={`rounded-2xl border overflow-hidden transition-all duration-200 ${TC.headerBg} ${TC.headerBorder}`}>

                    {/* ── Tier Header ── */}
                    <button
                      onClick={() => toggleTier(tier.id)}
                      className="w-full px-4 pt-3.5 pb-3 text-left group"
                    >
                      <div className="flex items-center gap-2.5 mb-2.5">
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 border ${TC.headerBg} ${TC.headerBorder}`}>
                          {TC.emoji}
                        </div>
                        {/* Label + count */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-sm font-black ${tier.color}`}>{tier.label}</span>
                            {allTierDone ? (
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                                <CheckCircle2 size={11} /> All done
                              </span>
                            ) : (
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${TC.badge}`}>
                                {tier.moduleIds.length > 0 ? `${completedInTier}/${tier.moduleIds.length}` : '—'}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          size={13}
                          className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-250 flex-shrink-0 ${isCollapsed ? '-rotate-90' : ''}`}
                        />
                      </div>
                      {/* Progress bar */}
                      {tier.moduleIds.length > 0 && (
                        <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${allTierDone ? 'bg-emerald-500' : TC.bar} rounded-full transition-all duration-700`}
                            style={{ width: `${tierPct}%` }}
                          />
                        </div>
                      )}
                    </button>

                    {/* ── Module List ── */}
                    {!isCollapsed && (
                      tier.moduleIds.length === 0 ? (
                        <div className="flex items-center gap-2 px-4 pb-3 pt-1">
                          <Lock size={11} className="text-slate-400 dark:text-slate-600" />
                          <p className="text-xs text-slate-400 dark:text-slate-600 italic">Coming Soon</p>
                        </div>
                      ) : (
                        <div className="px-2 pb-2.5 space-y-0.5">
                          {/* Separator */}
                          <div className="h-px bg-slate-200/70 dark:bg-slate-700/40 mx-2 mb-2" />
                          {tier.moduleIds.map((lvl, idx) => {
                            const levelMeta = contentData?.levels.find(l => l.id === lvl);
                            const shortTitle = levelMeta?.title.split(':')[1]?.trim() || levelMeta?.title || lvl;
                            const isCompleted = completedLevels.includes(`${id}::${lvl}`);
                            const isActive = level === lvl;

                            return (
                              <button
                                key={lvl}
                                onClick={() => setLevel(lvl)}
                                className={`w-full text-left px-2.5 py-2 rounded-xl border transition-all duration-200 group/item ${
                                  isActive
                                    ? `${TC.activeBg} ${TC.activeGlow}`
                                    : isCompleted
                                    ? 'border-transparent hover:bg-emerald-500/5 hover:border-emerald-500/10'
                                    : 'border-transparent hover:bg-white/70 dark:hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {/* Status badge */}
                                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                                    isActive
                                      ? `${TC.numActive}`
                                      : isCompleted
                                      ? 'bg-emerald-500/15 text-emerald-400'
                                      : 'bg-slate-200/80 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500'
                                  }`}>
                                    {isCompleted
                                      ? <CheckCircle2 size={12} />
                                      : <span style={{ fontSize: '9px' }}>{String(idx + 1).padStart(2, '0')}</span>}
                                  </div>
                                  {/* Title */}
                                  <span className={`text-xs font-semibold leading-snug flex-1 transition-colors ${
                                    isActive
                                      ? 'text-slate-900 dark:text-white'
                                      : isCompleted
                                      ? 'text-slate-500 dark:text-slate-400'
                                      : 'text-slate-600 dark:text-slate-400 group-hover/item:text-slate-800 dark:group-hover/item:text-slate-200'
                                  }`}>{shortTitle}</span>
                                  {/* Active pulse dot */}
                                  {isActive && (
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${TC.dot}`} />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                );
              })
            ) : (
              // Flat fallback
              <div className="space-y-1">
                {availableLevels.map((lvl, idx) => {
                  const levelMeta = contentData?.levels.find(l => l.id === lvl);
                  const shortTitle = levelMeta?.title.split(':')[1]?.trim() || levelMeta?.title || lvl;
                  const isCompleted = completedLevels.includes(`${id}::${lvl}`);
                  const isActive = level === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                        isActive
                          ? `bg-slate-100 dark:bg-slate-800 ${zoneMeta.colorText} border-current`
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                          isActive ? `bg-slate-200 dark:bg-slate-700 ${zoneMeta.colorText}` :
                          isCompleted ? 'bg-emerald-500/15 text-emerald-400' :
                          'bg-slate-200 dark:bg-slate-700/60 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={12} /> : <span style={{ fontSize: '9px' }}>{String(idx + 1).padStart(2, '0')}</span>}
                        </div>
                        <span className="font-semibold text-xs leading-snug flex-1">{shortTitle}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main ref={mainContentRef} className="flex-1 bg-white/50 dark:bg-slate-900/50 border border-violet-200/50 dark:border-violet-900/25 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

          {/* ── Step Indicator ── */}
          {(() => {
            const isLevelDone = completedLevels.includes(`${id}::${level}`);

            if (isLevelDone) {
              return (
                <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shadow-[0_0_24px_rgba(16,185,129,0.08)] overflow-hidden">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(16,185,129,0.25)]">
                      <CheckCircle2 size={22} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-emerald-400 font-black text-sm tracking-wide">Module Complete ✓</p>
                      <p className="text-slate-500 text-xs mt-0.5">You have mastered this topic. Review or re-fight anytime.</p>
                    </div>
                    <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 gap-1 flex-shrink-0">
                      <button
                        onClick={() => setMode('library')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'library' ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                      >
                        <BookOpen size={12} /> Learn
                      </button>
                      <button
                        onClick={() => setMode('arena')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'arena' ? 'bg-rose-500 text-white shadow-md shadow-rose-900/40' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                      >
                        <Swords size={12} /> Boss Fight
                      </button>
                    </div>
                  </div>
                  {/* Completion progress bar — full */}
                  <div className="h-0.5 w-full bg-emerald-500/40" />
                </div>
              );
            }

            const steps = [
              { key: 'learn', label: 'Learn', emoji: '📖', modeKey: 'library' as const },
              { key: 'fight', label: 'Boss Fight', emoji: '⚔️', modeKey: 'arena' as const },
              { key: 'complete', label: 'Complete', emoji: '🏆', modeKey: null },
            ];
            const activeIdx = mode === 'arena' ? 1 : 0;

            return (
              <div className="flex items-center mb-8 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl p-1.5 gap-1.5">
                {steps.map((s, i) => {
                  const isDone = i < activeIdx;
                  const isActive = i === activeIdx;
                  return (
                    <React.Fragment key={s.key}>
                      <button
                        onClick={() => s.modeKey && setMode(s.modeKey)}
                        disabled={!s.modeKey}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isActive && s.key === 'learn'
                            ? 'bg-violet-600 text-white shadow-[0_4px_14px_rgba(109,40,217,0.35)]'
                            : isActive && s.key === 'fight'
                            ? 'bg-rose-500 text-white shadow-[0_4px_14px_rgba(244,63,94,0.35)]'
                            : isDone
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'text-slate-400 dark:text-slate-500'
                        } ${s.modeKey ? 'cursor-pointer hover:brightness-110' : 'cursor-default'}`}
                      >
                        {isDone
                          ? <CheckCircle2 size={15} />
                          : <span className="text-base leading-none">{s.emoji}</span>}
                        <span>{s.label}</span>
                      </button>
                      {i < steps.length - 1 && (
                        <div className={`w-6 h-0.5 rounded-full flex-shrink-0 transition-colors duration-500 ${isDone ? 'bg-emerald-400/50' : 'bg-slate-300 dark:bg-slate-700'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })()}

          {mode === 'library' ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={`library-${level}`}>
              {justCompleted && (() => {
                const currentIdx = availableLevels.indexOf(level);
                const nextLevel = availableLevels[currentIdx + 1] ?? null;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="mb-8 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_0_32px_rgba(16,185,129,0.12)]"
                  >
                    {/* Top gradient bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
                    <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                          <span className="text-2xl">{completionWasFirstTime ? '🏆' : '⚔️'}</span>
                        </div>
                        <div>
                          <p className="text-emerald-400 font-black text-base">
                            {completionWasFirstTime ? 'Boss Defeated! +100 XP' : 'Victory — Again!'}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                            {completionWasFirstTime
                              ? 'Module mastered. The next challenge awaits you.'
                              : 'Practice makes perfect. Knowledge compounds every replay.'}
                          </p>
                        </div>
                      </div>
                      {nextLevel ? (
                        <button
                          onClick={() => setLevel(nextLevel)}
                          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.3)] hover:shadow-[0_0_24px_rgba(16,185,129,0.5)] transition-all duration-200"
                        >
                          Next Module <span className="text-base">→</span>
                        </button>
                      ) : (
                        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-sm rounded-xl">
                          🎉 Zone Complete!
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}
              {currentContent ? (
                <>
                  <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : 'prose-slate'} prose-indigo`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, '')}
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl border border-slate-200 dark:border-slate-700"
                              {...props}
                            />
                          ) : (
                            <code className="bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {currentContent.lessonMarkdown}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-12 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <h4 className="text-indigo-600 dark:text-indigo-400 font-bold mb-2 flex items-center gap-2">
                      <span>💡</span> The Core Analogy Summary
                    </h4>
                    <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{currentContent.analogy}"
                    </p>
                  </div>

                  {/* Boss Fight CTA */}
                  {!completedLevels.includes(`${id}::${level}`) && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 flex flex-col items-center gap-3 p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5"
                    >
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Finished reading? Put your knowledge to the test.</p>
                      <button
                        onClick={() => setMode('arena')}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-[0_0_24px_rgba(244,63,94,0.3)] hover:shadow-[0_0_32px_rgba(244,63,94,0.5)] transition-all duration-200 text-sm"
                      >
                        <Swords size={18} /> Fight the Boss →
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-slate-500 py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
                  Content for this level is being scribed by the Quality Oracle...
                </div>
              )}
            </motion.div>
          ) : (
            <QuizEngine
              zoneId={zoneMeta.id}
              level={level}
              progressIncrement={progressIncrement}
              onComplete={(firstTime) => {
                setMode('library');
                setJustCompleted(true);
                setCompletionWasFirstTime(firstTime);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
              }}
            />
          )}

        </main>
      </div>
    </div>
  )
}

function LoginRoute() {
  const playerName = useQuestStore((state) => state.playerName);
  if (playerName) return <Navigate to="/" replace />;
  return <WelcomePage />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const playerName = useQuestStore((state) => state.playerName);
  if (!playerName) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const theme = useQuestStore((state) => state.theme);

  // Sync theme class to <html> before first paint to avoid flash
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const badgesMap = ZONES.reduce((acc, zone) => {
    acc[zone.id] = zone.badge;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Router>
      <BadgeToast badgesMap={badgesMap} />
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/" element={<ProtectedRoute><HubMap /></ProtectedRoute>} />
        <Route path="/zone/:id" element={<ProtectedRoute><ZoneView /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
