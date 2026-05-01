import React, { useState, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Play, BookOpen, ShieldAlert, Database, Code, ShieldCheck, Cpu, Swords, LogOut, ChevronDown, Sun, Moon, ArrowLeft, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ZONES_CONTENT } from './data/analogies';
import { QuizEngine } from './components/QuizEngine';
import { BadgeToast } from './components/BadgeToast';
import { useQuestStore } from './store/useQuestStore';
import { useAuthStore } from './store/useAuthStore';
import { AuthPage } from './components/AuthPage';

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
    colorText: 'text-orange-400',
    glowColor: 'rgba(249,115,22,0.28)',
    shimmerColor: 'rgba(251,146,60,0.18)',
  },
  {
    id: 'sql',
    title: 'SQL Sorcery',
    icon: <Database size={32} className="text-blue-400" />,
    description: 'Master the art of demanding data from the kitchen without crashing the server.',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badge: 'Data Whisperer',
    colorText: 'text-blue-400',
    glowColor: 'rgba(59,130,246,0.28)',
    shimmerColor: 'rgba(96,165,250,0.18)',
  },
  {
    id: 'api',
    title: 'API Testing',
    icon: <Cpu size={32} className="text-purple-400" />,
    description: 'The invisible glue. Order unicorns from waiters and handle 404s with grace.',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badge: 'The Postman',
    colorText: 'text-purple-400',
    glowColor: 'rgba(168,85,247,0.28)',
    shimmerColor: 'rgba(192,132,252,0.18)',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    icon: <Code size={32} className="text-sky-400" />,
    description: 'JavaScript with an overly protective mother. Learn to build Tupperware for your code.',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    badge: 'Type Guardian',
    colorText: 'text-sky-400',
    glowColor: 'rgba(14,165,233,0.28)',
    shimmerColor: 'rgba(56,189,248,0.18)',
  },
  {
    id: 'playwright',
    title: 'Playwright',
    icon: <Play size={32} className="text-emerald-400" />,
    description: 'Give the hitman a precise description, not just "the guy in the shirt".',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badge: 'Grandmaster Automaton',
    colorText: 'text-emerald-400',
    glowColor: 'rgba(16,185,129,0.28)',
    shimmerColor: 'rgba(52,211,153,0.18)',
  },
  {
    id: 'ai-qa',
    title: 'AI for QA',
    icon: <ShieldCheck size={32} className="text-rose-400" />,
    description: 'Talk to literal-minded genies and build self-healing zombie scripts.',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badge: 'Cyborg Tester',
    colorText: 'text-rose-400',
    glowColor: 'rgba(244,63,94,0.28)',
    shimmerColor: 'rgba(251,113,133,0.18)',
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
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['sql-what-is-db','sql-select','sql-where','sql-order-limit','sql-insert','sql-update-delete','sql-data-types','sql-aggregations'],
    },
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

// ─────────────────────────────────────────────────────────────
//  🗺️  ZONE PROGRESS MAP
// ─────────────────────────────────────────────────────────────
const MAP_NODES = [
  { id: 'manual',     x: 11, y: 26 },
  { id: 'sql',        x: 21, y: 65 },
  { id: 'api',        x: 46, y: 43 },
  { id: 'typescript', x: 69, y: 17 },
  { id: 'playwright', x: 74, y: 60 },
  { id: 'ai-qa',      x: 87, y: 73 },
];

const MAP_PATHS: [string, string][] = [
  ['manual', 'sql'],
  ['manual', 'api'],
  ['sql',    'api'],
  ['api',    'typescript'],
  ['api',    'playwright'],
  ['typescript', 'playwright'],
  ['playwright', 'ai-qa'],
];

function ZoneMap({ onZoneClick }: { onZoneClick: (id: string) => void }) {
  const zoneProgress = useQuestStore(s => s.zoneProgress);

  // stable pseudo-random stars (no Math.random on render)
  const stars = React.useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 2 + (i * 41 + i * i * 17) % 96,
      y: 2 + (i * 59 + i * i * 11) % 96,
      r: 1 + (i % 3),
      delay: (i * 0.27) % 5,
      dur: 2.5 + (i % 5),
      op: 0.15 + (i % 6) * 0.08,
    })), []);

  return (
    <div className="relative w-full" style={{ minHeight: 480 }}>

      {/* ── Clipped art layer (bg + particles) ── */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden border border-violet-900/30 bg-[#05030f]">
        {/* dot grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        {/* per-zone region halos */}
        {ZONES.map(zone => {
          const node = MAP_NODES.find(n => n.id === zone.id)!;
          const prog = zoneProgress[zone.id] || 0;
          return (
            <div key={zone.id} className="absolute pointer-events-none transition-opacity duration-1000"
              style={{ left: `${node.x}%`, top: `${node.y}%`, width: 260, height: 260, transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${zone.glowColor.replace('0.28', prog > 0 ? '0.11' : '0.035')} 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(36px)' }}
            />
          );
        })}
        {/* centre ambient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 65%)' }} />
        {/* stars */}
        {stars.map(s => (
          <motion.div key={s.id} className="absolute rounded-full bg-white pointer-events-none"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r }}
            animate={{ opacity: [0, s.op, 0] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Clipped SVG paths ── */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {ZONES.map(z => (
              <filter key={z.id} id={`mglow-${z.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.6" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            ))}
          </defs>
          {MAP_PATHS.map(([fId, tId]) => {
            const f = MAP_NODES.find(n => n.id === fId)!;
            const t = MAP_NODES.find(n => n.id === tId)!;
            const fZone = ZONES.find(z => z.id === fId)!;
            const fProg = zoneProgress[fId] || 0;
            const tProg = zoneProgress[tId] || 0;
            // perpendicular bezier curve for organic feel
            const mx = (f.x + t.x) / 2, my = (f.y + t.y) / 2;
            const dx = t.x - f.x, dy = t.y - f.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const cx = mx + (-dy / len) * 5, cy = my + (dx / len) * 5;
            const d = `M ${f.x} ${f.y} Q ${cx} ${cy} ${t.x} ${t.y}`;
            const bothActive = fProg > 0 && tProg > 0;
            const oneActive  = fProg > 0;
            return (
              <g key={`${fId}-${tId}`}>
                <path d={d} fill="none" stroke="rgba(148,163,184,0.07)" strokeWidth="0.4" strokeDasharray="1.2 2"/>
                {oneActive && (
                  <path d={d} fill="none"
                    stroke={fZone.glowColor.replace('0.28', bothActive ? '0.75' : '0.38')}
                    strokeWidth={bothActive ? '0.5' : '0.32'}
                    strokeDasharray={bothActive ? undefined : '0.8 1.6'}
                    filter={`url(#mglow-${fId})`}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Map title + compass ── */}
      <div className="absolute top-4 left-5 pointer-events-none z-10">
        <p className="text-slate-600 dark:text-slate-700 text-[10px] font-black uppercase tracking-widest select-none">🗺️ The QA Realm</p>
      </div>
      <div className="absolute bottom-3 right-4 pointer-events-none z-10 text-slate-700 font-mono text-[10px] select-none opacity-40">N ↑</div>

      {/* ── Zone nodes (outside overflow-hidden so labels aren't clipped) ── */}
      {MAP_NODES.map((node, i) => {
        const zone = ZONES.find(z => z.id === node.id)!;
        const prog = zoneProgress[node.id] || 0;
        const isMastered  = prog >= 100;
        const isStarted   = prog > 0 && !isMastered;
        const isUnstarted = prog === 0;

        const R    = 26;
        const circ = 2 * Math.PI * R;
        const dash = circ - (prog / 100) * circ;

        return (
          // Outer div handles ONLY positioning — never touched by Framer Motion
          <div key={node.id}
            className="absolute z-20"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%,-50%)' }}
          >
          {/* Inner motion.div handles ONLY scale animation + click */}
          <motion.div
            className="select-none cursor-pointer"
            onClick={() => onZoneClick(node.id)}
            whileHover={{ scale: 1.13 }}
            whileTap={{ scale: 0.92 }}
          >
            {/* Outer pulse ring for in-progress */}
            {isStarted && (
              <motion.div className="absolute rounded-full pointer-events-none"
                style={{ inset: -9, border: `1.5px solid ${zone.glowColor.replace('0.28','0.55')}` }}
                animate={{ scale:[1,1.35,1], opacity:[0.6,0,0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease:'easeOut', delay: i*0.4 }}
              />
            )}
            {/* Subtle hover invitation ring for unstarted zones */}
            {isUnstarted && (
              <motion.div className="absolute rounded-full pointer-events-none"
                style={{ inset: -6, border: `1px solid ${zone.glowColor.replace('0.28','0.22')}` }}
                animate={{ opacity:[0.3,0.7,0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease:'easeInOut', delay: i*0.5 }}
              />
            )}
            {/* Gold ring for mastered */}
            {isMastered && (
              <motion.div className="absolute rounded-full pointer-events-none border-2 border-amber-400"
                style={{ inset: -7 }}
                animate={{ opacity:[0.5,1,0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease:'easeInOut', delay: i*0.3 }}
              />
            )}

            {/* SVG progress ring */}
            <svg width="72" height="72" className="absolute inset-0 pointer-events-none" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="36" cy="36" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5"/>
              {prog > 0 && (
                <motion.circle cx="36" cy="36" r={R} fill="none"
                  stroke={isMastered ? '#fbbf24' : zone.glowColor.replace('0.28','0.9')}
                  strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={circ}
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: dash }}
                  transition={{ duration: 1.6, ease:'easeOut', delay: 0.3 + i*0.1 }}
                />
              )}
            </svg>

            {/* Node body */}
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center relative border-2 transition-all duration-300"
              style={{
                background: isMastered
                  ? 'rgba(251,191,36,0.15)'
                  : isStarted
                    ? zone.glowColor.replace('0.28','0.12')
                    : 'rgba(12,9,28,0.85)',
                borderColor: isMastered
                  ? '#fbbf24'
                  : isStarted
                    ? zone.glowColor.replace('0.28','0.65')
                    : zone.glowColor.replace('0.28','0.2'),
                boxShadow: isMastered
                  ? '0 0 26px rgba(251,191,36,0.38)'
                  : isStarted
                    ? `0 0 22px ${zone.glowColor}`
                    : 'none',
              }}
            >
              <div className={`[&>svg]:w-[26px] [&>svg]:h-[26px] transition-opacity ${isUnstarted ? 'opacity-50' : 'opacity-100'}`}>
                {zone.icon}
              </div>
            </div>

            {/* Label */}
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none">
              <p className={`text-[11px] font-bold leading-tight ${isMastered ? 'text-amber-400' : isStarted ? zone.colorText : 'text-slate-500'}`}>
                {zone.title}
              </p>
              <p className={`text-[10px] mt-0.5 font-semibold ${isUnstarted ? 'text-slate-600' : 'text-slate-500'}`}>
                {isMastered ? '⭐ Mastered' : prog > 0 ? `${prog}%` : 'Click to explore'}
              </p>
            </div>
          </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function HubMap() {
  const navigate = useNavigate();
  const zoneProgress = useQuestStore((state) => state.zoneProgress);
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const xp = useQuestStore((state) => state.xp);
  const playerName = useQuestStore((state) => state.playerName);
  const unlockedBadges = useQuestStore((state) => state.unlockedBadges);
  const lastBountyDate = useQuestStore((state) => state.lastBountyDate);
  const claimDailyBounty = useQuestStore((state) => state.claimDailyBounty);
  const theme = useQuestStore((state) => state.theme);
  const toggleTheme = useQuestStore((state) => state.toggleTheme);
  const { logout } = useAuthStore();
  const today = new Date().toISOString().slice(0, 10);
  const bountyAlreadyClaimed = lastBountyDate === today;
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

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
              onClick={() => { logout(); navigate('/login', { replace: true }); }}
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
          {/* Header row */}
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Welcome back, <span className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 dark:from-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">{playerName}</span> 👋
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Choose a realm to conquer.</p>
            </div>
            {/* Map / Grid toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 flex-shrink-0">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
              >
                ⊞ Grid
              </button>
            </div>
          </div>

          {/* ── Map View ── */}
          {viewMode === 'map' && (
            <ZoneMap onZoneClick={(id) => navigate(`/zone/${id}`)} />
          )}

          {/* ── Grid View ── */}
          {viewMode === 'grid' && (
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

                  {/* ── Holographic shimmer sweep ── */}
                  <motion.div
                    className="absolute inset-y-0 pointer-events-none z-20"
                    style={{
                      width: '90px',
                      background: isMastered
                        ? 'linear-gradient(105deg, transparent 0%, rgba(251,191,36,0.22) 50%, transparent 100%)'
                        : `linear-gradient(105deg, transparent 0%, ${zone.shimmerColor} 50%, transparent 100%)`,
                      transform: 'skewX(-14deg)',
                    }}
                    animate={{ left: ['-90px', 'calc(100% + 90px)'] }}
                    transition={{
                      duration: 1.35,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 3.8 + i * 0.72,
                      delay: 2 + i * 0.9,
                    }}
                    aria-hidden="true"
                  />

                  {/* ── In-progress zone colour pulse ── */}
                  {isStarted && !isMastered && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 2.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.55,
                      }}
                      style={{ boxShadow: `inset 0 0 32px ${zone.glowColor}` }}
                      aria-hidden="true"
                    />
                  )}

                  {/* ── Mastered golden ambient pulse ── */}
                  {isMastered && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                      animate={{ opacity: [0, 0.7, 0] }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.4,
                      }}
                      style={{ boxShadow: 'inset 0 0 40px rgba(251,191,36,0.2)' }}
                      aria-hidden="true"
                    />
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
          )} {/* end grid view */}
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

// ── Auth-aware route guards ────────────────────────────────────
function LoginRoute() {
  const { user, authLoading } = useAuthStore();
  if (authLoading) return <AuthSpinner />;
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuthStore();
  if (authLoading) return <AuthSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ── Full-screen spinner shown while Firebase checks auth session ─
function AuthSpinner() {
  const theme = useQuestStore((s) => s.theme);
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#05030f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(192,38,211,0.2)', '0 0 40px rgba(192,38,211,0.45)', '0 0 20px rgba(192,38,211,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center"
          >
            <BookOpen size={28} className="text-fuchsia-400" />
          </motion.div>
          <Loader2 size={20} className="text-fuchsia-400 animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const theme = useQuestStore((state) => state.theme);
  // Initialise the auth listener as early as possible
  useAuthStore();

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
