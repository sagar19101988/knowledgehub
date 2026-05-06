import React, { useState, useLayoutEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Sun, Moon, Loader2, Map, LayoutGrid, ChevronDown, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { BadgeToast } from './components/BadgeToast';
import { RankLadderModal } from './components/RankLadderModal';
import { RankUpWatcher } from './components/RankUpWatcher';
import { useQuestStore } from './store/useQuestStore';
import { useAuthStore } from './store/useAuthStore';
import { ZONES, ZONE_TIERS, getLevel, getTotalModuleCount } from './data/zones';

// ── Lazy-loaded routes (excluded from initial bundle) ─────────
const ZoneView  = React.lazy(() => import('./components/ZoneView'));
const AuthPage  = React.lazy(() => import('./components/AuthPage').then(m => ({ default: m.AuthPage })));

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
  const completedLevels = useQuestStore(s => s.completedLevels);
  const getZoneProg = (zoneId: string) => {
    const total = (ZONE_TIERS[zoneId] ?? []).reduce((s, t) => s + t.moduleIds.length, 0);
    return total ? Math.round(completedLevels.filter(k => k.startsWith(zoneId + '::')).length / total * 100) : 0;
  };

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
    <div className="w-full overflow-x-auto sm:overflow-x-visible -mx-3 sm:mx-0 px-3 sm:px-0">
      <div className="relative" style={{ minHeight: 480, minWidth: 700 }}>

      {/* ── Clipped art layer (bg + particles) ── */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden border border-violet-400/40 dark:border-violet-900/30 shadow-[0_0_40px_rgba(139,92,246,0.08)] dark:shadow-none bg-[#05030f]">
        {/* dot grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        {/* per-zone region halos */}
        {ZONES.map(zone => {
          const node = MAP_NODES.find(n => n.id === zone.id)!;
          const prog = getZoneProg(zone.id);
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
            const fProg = getZoneProg(fId);
            const tProg = getZoneProg(tId);
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
        const prog = getZoneProg(node.id);
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
    </div>
  );
}

function HubMap() {
  const navigate = useNavigate();
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const xp = useQuestStore((state) => state.xp);
  const playerName = useQuestStore((state) => state.playerName);
  const unlockedBadges = useQuestStore((state) => state.unlockedBadges);
  const lastBountyDate = useQuestStore((state) => state.lastBountyDate);
  const claimDailyBounty = useQuestStore((state) => state.claimDailyBounty);
  const theme = useQuestStore((state) => state.theme);
  const toggleTheme = useQuestStore((state) => state.toggleTheme);
  const isGuest = useQuestStore((state) => state.isGuest);
  const resetProgress = useQuestStore((state) => state.resetProgress);
  const { logout } = useAuthStore();
  const today = new Date().toISOString().slice(0, 10);
  const bountyAlreadyClaimed = lastBountyDate === today;
  const [viewMode, setViewMode] = useState<'map' | 'grid'>(
    () => (sessionStorage.getItem('qa-hub-view') as 'map' | 'grid') ?? 'map'
  );
  const handleSetViewMode = (v: 'map' | 'grid') => {
    sessionStorage.setItem('qa-hub-view', v);
    setViewMode(v);
  };
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!avatarOpen) return;
    const handle = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [avatarOpen]);

  const { current, next, progress } = getLevel(xp, { completedModuleCount: completedLevels.length });

  // Caption text — shows current XP + next threshold (and module gate when next is Final Trial).
  const totalModules = getTotalModuleCount();
  const nextProgressText = !next
    ? `${xp.toLocaleString()} XP · Maximum rank`
    : next.requiresFullCompletion
      ? `${xp.toLocaleString()} / ${next.min.toLocaleString()} XP · ${completedLevels.length} / ${totalModules} modules`
      : `${xp.toLocaleString()} / ${next.min.toLocaleString()} XP`;
  const earnedCount = unlockedBadges.length;

  // Rank ladder modal (rank-up celebration is now handled globally by RankUpWatcher in App)
  const [ladderOpen, setLadderOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f3ff] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans flex flex-col">

      {/* Top navbar — HUD Layout: Left | Center | Right */}
      <header className="h-16 border-b border-violet-200/60 dark:border-violet-900/30 bg-white/85 dark:bg-[#0a0715]/80 backdrop-blur px-3 sm:px-6 flex items-center sticky top-0 z-50 gap-2">

        {/* ── LEFT: Logo + title ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <BookOpen size={22} className="text-fuchsia-400 flex-shrink-0" />
          <h1 className="text-base sm:text-xl font-black bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_12px_rgba(192,38,211,0.3)] truncate">
            <span className="sm:hidden">QA Quest</span>
            <span className="hidden sm:inline">QA Quest: The Knowledge Hub</span>
          </h1>
        </div>

        {/* ── CENTER: Welcome text (desktop only) ── */}
        <h1 className="hidden md:block text-xl font-black text-slate-900 dark:text-white whitespace-nowrap">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            {playerName}
          </span>{' '}
          👋
        </h1>

        {/* ── RIGHT: Rank chip + Avatar dropdown ── */}
        <div className="flex-1 flex justify-end items-center gap-2">
          {/* Rank chip — mobile/tablet only (sidebar shows it on lg+) */}
          <button
            onClick={() => setLadderOpen(true)}
            aria-label={`Rank ${current.level} ${current.title} — open rank ladder`}
            className="lg:hidden group relative flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-xl border border-amber-400/40 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-400/70 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-all duration-200"
          >
            <Trophy size={13} className="text-amber-500 flex-shrink-0" />
            <span className="text-xs font-black text-amber-700 dark:text-amber-300 tracking-tight">
              Lv.{current.level}
            </span>
            <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[160px]">
              · {current.title}
            </span>
            {/* progress underline */}
            <span className="absolute left-2 right-2 -bottom-0.5 h-[2px] bg-slate-200/70 dark:bg-slate-800/80 rounded-full overflow-hidden">
              <span
                className="block h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </span>
          </button>

          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen(p => !p)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_14px_rgba(192,38,211,0.5)] ring-2 ring-fuchsia-400/30 flex-shrink-0">
                {playerName?.[0]?.toUpperCase() ?? '?'}
              </div>
              <ChevronDown
                size={13}
                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${avatarOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {avatarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-[#0e0b1f] border border-slate-200 dark:border-violet-900/50 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden z-50"
              >
                {/* Player header */}
                <div className="px-4 py-3.5 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 dark:from-violet-900/30 dark:to-fuchsia-900/20 border-b border-slate-100 dark:border-violet-900/30">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-[0_0_12px_rgba(192,38,211,0.4)] flex-shrink-0">
                      {playerName?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{playerName}</p>
                      <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                        Lv.{current.level} · {current.title}
                      </p>
                    </div>
                  </div>
                  {/* Rank progress */}
                  <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                    {nextProgressText}
                  </p>
                </div>

                <div className="p-1.5 space-y-0.5">
                  {/* Theme toggle */}
                  <button
                    onClick={() => { toggleTheme(); setAvatarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-white transition-all duration-150 group/item"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover/item:bg-violet-100 dark:group-hover/item:bg-violet-900/40 transition-colors">
                      {theme === 'dark'
                        ? <Sun size={14} className="text-amber-400" />
                        : <Moon size={14} className="text-violet-500" />}
                    </span>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800/80 mx-2" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setAvatarOpen(false);
                      if (isGuest) { resetProgress(); } else { logout(); }
                      navigate('/login', { replace: true });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 hover:text-rose-700 dark:hover:text-rose-200 transition-all duration-150 group/item"
                  >
                    <span className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center group-hover/item:bg-rose-100 dark:group-hover/item:bg-rose-500/20 transition-colors">
                      <LogOut size={14} />
                    </span>
                    Exit Realm
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar (hidden on mobile — info accessible via avatar) ── */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-violet-200/50 dark:border-violet-900/25 bg-white/70 dark:bg-[#0a0715]/60 flex-col gap-5 p-5 overflow-y-auto sidebar-scroll">

          {/* Player card — slimmed to identity only (rank info lives in chip below) */}
          <div className="bg-white/60 dark:bg-slate-900/60 border border-violet-300/50 dark:border-violet-900/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-[0_0_16px_rgba(192,38,211,0.4)]">
                {playerName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{playerName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{isGuest ? 'Guest Mode' : 'Explorer'}</p>
              </div>
            </div>
          </div>

          {/* Rank chip — desktop sidebar version (prominent identity card, click → ladder modal) */}
          <button
            onClick={() => setLadderOpen(true)}
            aria-label={`Rank ${current.level} ${current.title} — open rank ladder`}
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border border-amber-400/40 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-400/70 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-all duration-200 text-left"
          >
            {/* Level badge */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.35)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900/70 leading-none -mb-0.5">Lv</span>
              <span className="text-base font-black text-slate-900 leading-none ml-0.5">{current.level}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Trophy size={13} className="text-amber-500 flex-shrink-0" />
                <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {current.title}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {nextProgressText}
              </p>
            </div>
            {/* progress underline */}
            <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-slate-200/70 dark:bg-slate-800/80 rounded-full overflow-hidden">
              <span
                className="block h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </span>
          </button>

          {/* Total XP stat tile (compact, single-line) */}
          <div className="flex items-center justify-between rounded-xl border border-amber-300/30 dark:border-amber-700/30 bg-gradient-to-br from-amber-50 to-yellow-50/60 dark:from-amber-950/30 dark:to-yellow-900/15 px-3.5 py-2 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700/80 dark:text-amber-400/80">
              Total XP
            </p>
            <p className="text-base font-black text-amber-700 dark:text-amber-300 tracking-tight">
              {xp.toLocaleString()}
            </p>
          </div>

          {/* Guest mode banner */}
          {isGuest && (
            <div className="rounded-2xl border border-violet-400/30 bg-violet-500/5 p-3 flex flex-col gap-2">
              <p className="text-xs text-violet-500 dark:text-violet-400 font-semibold flex items-center gap-1.5">
                <span>🔓</span> Guest Mode
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Progress saved locally. Sign in to sync across devices.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white hover:opacity-90 transition"
              >
                Sign In / Sign Up →
              </button>
            </div>
          )}

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
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
          {/* View toggle — centred above content */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-violet-900/40 rounded-xl p-1 gap-1 shadow-sm">
              <button
                onClick={() => handleSetViewMode('map')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_2px_14px_rgba(139,92,246,0.45)]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                }`}
              >
                <Map size={14} /> Realm Map
              </button>
              <button
                onClick={() => handleSetViewMode('grid')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_2px_14px_rgba(139,92,246,0.45)]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                }`}
              >
                <LayoutGrid size={14} /> Skill Tree
              </button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Choose a realm to conquer.</p>
          </div>

          {/* ── Map View ── */}
          {viewMode === 'map' && (
            <ZoneMap onZoneClick={(id) => navigate(`/zone/${id}`)} />
          )}

          {/* ── Grid View ── */}
          {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {ZONES.map((zone, i) => {
              const totalModules = (ZONE_TIERS[zone.id] ?? []).reduce((sum, t) => sum + t.moduleIds.length, 0);
              const completedCount = completedLevels.filter(k => k.startsWith(`${zone.id}::`)).length;
              const progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
              const isMastered = progress >= 100;
              const isStarted = progress > 0 && !isMastered;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  key={zone.id}
                  onClick={() => navigate(`/zone/${zone.id}`)}
                  className={`group relative overflow-hidden rounded-2xl border border-l-4 cursor-pointer transition-all hover:scale-[1.02] ${zone.bgColor} ${zone.accentBorder} ${zone.cardShadow} ${
                    isMastered
                      ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                      : isStarted
                      ? zone.borderColor
                      : zone.borderColor + ' hover:border-opacity-80'
                  }`}
                >
                  {isMastered && (
                    <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                      ⭐ {zone.badge}
                    </div>
                  )}
                  {progress === 0 && (
                    <div className="absolute inset-0 dark:bg-slate-950/40 dark:backdrop-blur-[1px] z-0 transition-opacity group-hover:opacity-0" />
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
                    <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-center mb-5">
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
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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

      {/* Rank ladder modal */}
      <RankLadderModal
        open={ladderOpen}
        onClose={() => setLadderOpen(false)}
        xp={xp}
        completedModuleCount={completedLevels.length}
      />
    </div>
  );
}

// ZoneView is lazy-loaded — see React.lazy import at the top

// ── Auth-aware route guards ────────────────────────────────────
function LoginRoute() {
  const { user, authLoading } = useAuthStore();
  if (authLoading) return <AuthSpinner />;
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuthStore();
  const isGuest = useQuestStore((s) => s.isGuest);
  if (authLoading) return <AuthSpinner />;
  if (!user && !isGuest) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ── Full-screen spinner shown while Firebase checks auth session ─
// ─── Auto-sync progress to Firestore whenever it changes ─────
// Renders nothing. Subscribes to the quest store and debounce-writes
// to Firestore so progress survives logout/re-login.
function SyncToCloud() {
  const user = useAuthStore((s) => s.user);

  React.useEffect(() => {
    if (!user) return;

    // Fire once immediately on login to ensure cloud is up-to-date
    useQuestStore.getState().syncToFirestore(user.uid);

    // Then watch for any subsequent changes
    const unsubscribe = useQuestStore.subscribe(() => {
      useQuestStore.getState().syncToFirestore(user.uid);
    });

    return unsubscribe;
  }, [user?.uid]);

  return null;
}

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
      <SyncToCloud />
      <BadgeToast badgesMap={badgesMap} />
      <RankUpWatcher />
      <Suspense fallback={<AuthSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/" element={<ProtectedRoute><HubMap /></ProtectedRoute>} />
          <Route path="/zone/:id" element={<ProtectedRoute><ZoneView /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
