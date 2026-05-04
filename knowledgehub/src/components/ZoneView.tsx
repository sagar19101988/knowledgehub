// ── ZoneView — lazy-loaded route component ────────────────────
// Heavy deps (ReactMarkdown, SyntaxHighlighter, ZONES_CONTENT) live
// only here so they are excluded from the initial JS bundle.

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, BookOpen, Swords, Sun, Moon, ChevronDown, CheckCircle2, Lock, LogOut } from 'lucide-react';
import { ZONES_CONTENT } from '../data/analogies';
import { ZONES, ZONE_TIERS } from '../data/zones';
import { QuizEngine } from './QuizEngine';
import { useQuestStore } from '../store/useQuestStore';
import { useAuthStore } from '../store/useAuthStore';

export default function ZoneView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mode, setMode] = useState<'library' | 'arena'>('library');
  const [level, setLevel] = useState<string>('');
  const [justCompleted, setJustCompleted] = useState(false);
  const [completionWasFirstTime, setCompletionWasFirstTime] = useState(false);
  const [collapsedTiers, setCollapsedTiers] = useState<Record<string, boolean>>({ beginner: true, intermediate: true, expert: true });
  const [avatarOpen, setAvatarOpen] = useState(false);
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const avatarRef = React.useRef<HTMLDivElement>(null);

  const toggleTier = (tierId: string) =>
    setCollapsedTiers((prev) => ({ ...prev, [tierId]: !prev[tierId] }));

  const zoneMeta = ZONES.find(z => z.id === id);
  const contentData = ZONES_CONTENT[id || ''];
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const theme = useQuestStore((state) => state.theme);
  const toggleTheme = useQuestStore((state) => state.toggleTheme);
  const isGuest = useQuestStore((state) => state.isGuest);
  const resetProgress = useQuestStore((state) => state.resetProgress);
  const playerName = useQuestStore((state) => state.playerName);
  const { logout } = useAuthStore();

  // Close avatar dropdown on outside click
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
    <div className="min-h-screen bg-[#fef7e4] dark:bg-[#07050f] text-stone-800 dark:text-slate-200 font-sans flex flex-col">
      {/* Top Navbar — HUD Layout: Left | Center | Right */}
      <nav className="h-16 border-b border-violet-300/50 dark:border-violet-900/30 bg-[#fef3d0]/95 dark:bg-[#0a0715]/80 backdrop-blur px-6 flex items-center sticky top-0 z-50">

        {/* ── LEFT: Back + Breadcrumb ── */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all duration-200 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm font-semibold">Back</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700 select-none">|</span>
          <div className="flex items-center gap-2">
            <span className="[&>svg]:w-5 [&>svg]:h-5">{zoneMeta.icon}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{zoneMeta.title}</span>
          </div>
        </div>

        {/* ── CENTER: Mode switcher ── */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-violet-900/40 rounded-xl p-1 gap-1 shadow-sm">
          <button
            onClick={() => setMode('library')}
            className={`px-5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
              mode === 'library'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_2px_14px_rgba(109,40,217,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'
            }`}
          >
            <BookOpen size={15} />
            The Library
          </button>
          <button
            onClick={() => setMode('arena')}
            className={`px-5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
              mode === 'arena'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-[0_2px_14px_rgba(244,63,94,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
            }`}
          >
            <Swords size={15} />
            The Arena
          </button>
        </div>

        {/* ── RIGHT: Avatar dropdown ── */}
        <div className="flex-1 flex justify-end">
          <div className="relative" ref={avatarRef}>
            {/* Avatar trigger button */}
            <button
              onClick={() => setAvatarOpen(p => !p)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200 group"
            >
              {/* Avatar circle */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_14px_rgba(192,38,211,0.5)] ring-2 ring-fuchsia-400/30 flex-shrink-0">
                {playerName?.[0]?.toUpperCase() ?? '?'}
              </div>
              <ChevronDown
                size={13}
                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${avatarOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown panel */}
            {avatarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-[#0e0b1f] border border-slate-200 dark:border-violet-900/50 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden z-50"
              >
                {/* Player header */}
                <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 dark:from-violet-900/30 dark:to-fuchsia-900/20 border-b border-slate-100 dark:border-violet-900/30">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-[0_0_12px_rgba(192,38,211,0.4)] flex-shrink-0">
                    {playerName?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{playerName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{isGuest ? 'Guest Mode' : 'Explorer'}</p>
                  </div>
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
                    headerBg: 'bg-emerald-50 dark:bg-emerald-500/6',
                    headerBorder: 'border-emerald-400/60 dark:border-emerald-500/25',
                    accentBorder: 'border-l-emerald-500 dark:border-l-emerald-500/40',
                    shadow: 'shadow-[0_4px_16px_rgba(16,185,129,0.15)] dark:shadow-none',
                    bar: 'bg-emerald-500',
                    badge: 'bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
                    activeBg: 'bg-emerald-500/12 dark:bg-emerald-500/10 border-emerald-500/30',
                    activeGlow: 'shadow-[inset_0_0_0_1px_rgba(16,185,129,0.3)]',
                    numActive: 'bg-emerald-500/20 text-emerald-400',
                    dot: 'bg-emerald-400',
                    headerAccent: 'from-emerald-500/20 to-transparent',
                  },
                  intermediate: {
                    emoji: '⚡',
                    label: tier.color,
                    headerBg: 'bg-sky-50 dark:bg-sky-500/6',
                    headerBorder: 'border-sky-400/60 dark:border-sky-500/25',
                    accentBorder: 'border-l-sky-500 dark:border-l-sky-500/40',
                    shadow: 'shadow-[0_4px_16px_rgba(14,165,233,0.15)] dark:shadow-none',
                    bar: 'bg-sky-500',
                    badge: 'bg-sky-500/20 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
                    activeBg: 'bg-sky-500/12 dark:bg-sky-500/10 border-sky-500/30',
                    activeGlow: 'shadow-[inset_0_0_0_1px_rgba(14,165,233,0.3)]',
                    numActive: 'bg-sky-500/20 text-sky-400',
                    dot: 'bg-sky-400',
                    headerAccent: 'from-sky-500/20 to-transparent',
                  },
                  expert: {
                    emoji: '🔥',
                    label: tier.color,
                    headerBg: 'bg-amber-50 dark:bg-amber-500/6',
                    headerBorder: 'border-amber-400/60 dark:border-amber-500/25',
                    accentBorder: 'border-l-amber-500 dark:border-l-amber-500/40',
                    shadow: 'shadow-[0_4px_16px_rgba(245,158,11,0.15)] dark:shadow-none',
                    bar: 'bg-amber-500',
                    badge: 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
                    activeBg: 'bg-amber-500/12 dark:bg-amber-500/10 border-amber-500/30',
                    activeGlow: 'shadow-[inset_0_0_0_1px_rgba(245,158,11,0.3)]',
                    numActive: 'bg-amber-500/20 text-amber-400',
                    dot: 'bg-amber-400',
                    headerAccent: 'from-amber-500/20 to-transparent',
                  },
                }[tier.id] || {};

                return (
                  <div key={tier.id} className={`rounded-2xl border border-l-4 overflow-hidden transition-all duration-200 ${TC.headerBg} ${TC.headerBorder} ${TC.accentBorder} ${TC.shadow}`}>

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
                                    : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60'
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
                <div className="text-slate-500 py-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
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
  );
}
