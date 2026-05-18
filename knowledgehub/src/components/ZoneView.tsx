// ── ZoneView — lazy-loaded route component ────────────────────
// Heavy deps (ReactMarkdown, SyntaxHighlighter, ZONES_CONTENT) live
// only here so they are excluded from the initial JS bundle.

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, BookOpen, Swords, ChevronDown, CheckCircle2, Lock, Menu, X, Trophy } from 'lucide-react';
import { ZONES_CONTENT } from '../data/analogies';
import { MASTERY_BADGES, QUESTION_BANK } from '../data/questionBank';
import { ZONES, ZONE_TIERS } from '../data/zones';
import { QuizEngine } from './QuizEngine';
import { UserAvatarMenu } from './UserAvatarMenu';
import { useQuestStore } from '../store/useQuestStore';
import { isModuleUnlocked, isTierUnlocked, getFirstUnlockedModule, getPrerequisiteHint } from '../utils/unlockRules';

export default function ZoneView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mode, setMode] = useState<'library' | 'arena'>('library');
  const [level, setLevel] = useState<string>('');
  const [justCompleted, setJustCompleted] = useState(false);
  const [completionWasFirstTime, setCompletionWasFirstTime] = useState(false);
  const [completedModuleTitle, setCompletedModuleTitle] = useState('');
  const [collapsedTiers, setCollapsedTiers] = useState<Record<string, boolean>>({ beginner: true, intermediate: true, expert: true });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [lockToast, setLockToast] = useState<string | null>(null);
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const sidebarScrollRef = React.useRef<HTMLDivElement>(null);
  const justCompletedTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTier = (tierId: string) =>
    setCollapsedTiers((prev) => ({ ...prev, [tierId]: !prev[tierId] }));

  const zoneMeta = ZONES.find(z => z.id === id);
  const contentData = ZONES_CONTENT[id || ''];
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const masteryBadges = useQuestStore((state) => state.masteryBadges);
  const masteryScores = useQuestStore((state) => state.masteryScores);
  const theme = useQuestStore((state) => state.theme);

  React.useEffect(() => {
    if (contentData && contentData.levels.length > 0 && !contentData.levels.find(l => l.id === level)) {
      const firstUnlocked = getFirstUnlockedModule(id || '', completedLevels) || contentData.levels[0].id;
      setLevel(firstUnlocked);
    }
  }, [contentData, level, id, completedLevels]);

  React.useEffect(() => {
    if (!level || !id) return;
    if (!isModuleUnlocked(id, level, completedLevels)) {
      const fallback = getFirstUnlockedModule(id, completedLevels);
      if (fallback && fallback !== level) setLevel(fallback);
    }
  }, [level, id, completedLevels]);

  // Lock the body on desktop only (Approach A — isolated two-panel scroll).
  // On mobile/tablet, let the page scroll naturally — mobile has only one visible panel
  // (sidebar is a drawer), so isolation isn't needed and a locked body breaks scrolling.
  React.useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const apply = () => {
      document.body.style.overflow = mql.matches ? 'hidden' : '';
    };
    apply();
    mql.addEventListener('change', apply);
    return () => {
      mql.removeEventListener('change', apply);
      document.body.style.overflow = '';
    };
  }, []);

  // On mount (entering a zone from anywhere), reset all possible scroll containers to top.
  // Window covers mobile; main + sidebar cover desktop two-panel layout. Both are safe to call.
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
    if (sidebarScrollRef.current) sidebarScrollRef.current.scrollTop = 0;
  }, []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
  }, [level]);

  // Reset scroll when switching between Library (learn) and Arena (Boss Fight)
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
  }, [mode]);

  // Auto-dismiss the "Boss Defeated!" banner after 4.5s
  React.useEffect(() => {
    if (!justCompleted) return;
    if (justCompletedTimer.current) clearTimeout(justCompletedTimer.current);
    justCompletedTimer.current = setTimeout(() => setJustCompleted(false), 4500);
    return () => {
      if (justCompletedTimer.current) clearTimeout(justCompletedTimer.current);
    };
  }, [justCompleted]);

  // Expand the tier containing the active module, collapse others, then scroll it into view
  React.useEffect(() => {
    if (!level || !id) return;
    const tiers = ZONE_TIERS[id];
    if (!tiers) return;
    const activeTier = tiers.find(t => t.moduleIds.includes(level));
    if (!activeTier) return;
    setCollapsedTiers({ beginner: true, intermediate: true, expert: true, [activeTier.id]: false });
    // After tier expands, scroll active module into view within sidebar
    setTimeout(() => {
      const el = sidebarScrollRef.current?.querySelector('[data-active-module="true"]') as HTMLElement | null;
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, [level, id]);

  if (!zoneMeta) return <div className="p-8 text-white">Zone not found</div>;

  const isDark = theme === 'dark';

  const currentContent = contentData?.levels.find(l => l.id === level);

  const availableLevels = contentData?.levels.map(l => l.id) || [];
  const progressIncrement = Math.floor(100 / (availableLevels.length || 1));

  const pickLevel = (lvl: string) => {
    setLevel(lvl);
    setDrawerOpen(false);
    setJustCompleted(false);
    setCompletedModuleTitle('');
  };

  const showLockToast = (msg: string) => {
    setLockToast(msg);
    window.setTimeout(() => setLockToast(null), 2500);
  };

  return (
    <div className={`min-h-screen lg:h-screen lg:overflow-hidden font-sans flex flex-col ${isDark ? 'bg-[#07050f] text-slate-200' : 'bg-[#eff4fb] text-slate-900'}`}>
      {/* Top Navbar — HUD Layout: Left | Center | Right */}
      <nav className={`h-16 px-3 sm:px-6 flex items-center sticky top-0 z-[80] gap-2 ${
        isDark ? 'border-b border-violet-900/30 bg-[#07050f]' : 'border-b border-slate-200 bg-[#eff4fb]'
      }`}>

        {/* ── LEFT: Back + Hamburger (mobile) + Breadcrumb ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={() => navigate('/')}
            aria-label="Go back"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors duration-150 group flex-shrink-0"
            style={{
              background: backHovered ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)') : (isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'),
              borderColor: backHovered ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)') : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
              color: backHovered ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)') : (isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)'),
              boxShadow: backHovered ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.2)') : 'none',
            }}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm font-semibold hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open module navigator"
            className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 flex-shrink-0 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-fuchsia-500 hover:border-fuchsia-700 hover:bg-fuchsia-900/20'
                : 'bg-white border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <Menu size={17} />
          </button>
          <span className={`select-none hidden sm:inline ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>|</span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="[&>svg]:w-5 [&>svg]:h-5 flex-shrink-0 hidden sm:inline">{zoneMeta.icon}</span>
            <span className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{zoneMeta.title}</span>
          </div>
        </div>

        {/* ── CENTER: Mode switcher ── */}
        <div className={`flex rounded-xl p-1 gap-1 shadow-sm flex-shrink-0 ${
          isDark ? 'bg-slate-900 border border-violet-900/40' : 'bg-white border border-slate-200'
        }`}>
          <button
            onClick={() => setMode('library')}
            aria-label="The Library"
            className={`px-3 sm:px-5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
              mode === 'library'
                ? (isDark
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_2px_14px_rgba(109,40,217,0.45)]'
                    : 'bg-blue-600 text-white')
                : (isDark
                    ? 'text-slate-400 hover:text-violet-300 hover:bg-violet-900/20'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50')
            }`}
          >
            <BookOpen size={15} />
            <span className="hidden sm:inline">The Library</span>
          </button>
          <button
            onClick={() => setMode('arena')}
            aria-label="The Arena"
            className={`px-3 sm:px-5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
              mode === 'arena'
                ? (isDark
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-[0_2px_14px_rgba(244,63,94,0.45)]'
                    : 'bg-rose-500 text-white')
                : (isDark
                    ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-900/20'
                    : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50')
            }`}
          >
            <Swords size={15} />
            <span className="hidden sm:inline">The Arena</span>
          </button>
        </div>

        {/* ── RIGHT: Mastery Trial + Avatar dropdown ── */}
        <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
          {(QUESTION_BANK[id || ''] ?? []).length > 0 && (() => {
            const earned = masteryBadges[id || ''] === true;
            const badge = MASTERY_BADGES[id || ''];
            return (
              <button
                onClick={() => navigate(`/zone/${id}/mastery`)}
                aria-label="Open Mastery Trial"
                title={earned && badge ? `${badge.name} earned — Mastery Trial` : 'Mastery Trial'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all duration-200 group flex-shrink-0 active:scale-[0.98]
                  ${isDark
                    ? earned
                      ? 'bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 dark:from-violet-500/20 dark:to-fuchsia-500/20 border-violet-400 dark:border-violet-500/60 text-violet-700 dark:text-violet-200 shadow-[0_0_14px_rgba(139,92,246,0.35)] dark:shadow-[0_0_16px_rgba(139,92,246,0.45)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-[1.03]'
                      : `${zoneMeta.bgColor} ${zoneMeta.borderColor} ${zoneMeta.colorText} shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_14px_rgba(168,85,247,0.25)] hover:scale-[1.03]`
                    : earned
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm hover:bg-indigo-100 hover:border-indigo-400'
                      : 'bg-blue-600 border-blue-600 text-white shadow-sm hover:bg-blue-700 hover:border-blue-700'}`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border ${
                  isDark
                    ? earned
                      ? 'bg-white/80 dark:bg-slate-900/80 border-violet-300 dark:border-violet-500/40'
                      : `bg-white/80 dark:bg-slate-900/80 ${zoneMeta.borderColor}`
                    : earned
                      ? 'bg-white border-indigo-300'
                      : 'bg-white/20 border-white/30'
                }`}>
                  {earned && badge
                    ? <span className="leading-none">{badge.icon}</span>
                    : <Trophy size={13} className={`${isDark ? zoneMeta.colorText : earned ? 'text-indigo-600' : 'text-white'} group-hover:rotate-[8deg] transition-transform duration-200`} />}
                </span>
                <span className={`hidden md:inline text-xs uppercase tracking-[0.08em] ${isDark ? 'font-black' : 'font-bold'}`}>
                  {earned ? badge?.name ?? 'Mastery Trial' : 'Mastery Trial'}
                </span>
              </button>
            );
          })()}
          <UserAvatarMenu />
        </div>
      </nav>

      <div className="flex-1 lg:min-h-0 w-full flex gap-3 sm:gap-6 px-3 sm:pl-6 sm:pr-8 py-4 sm:py-6 relative lg:overflow-hidden">

        {/* Mobile drawer backdrop */}
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}

        {/* ── Left Sidebar: Module Navigator (desktop inline / mobile drawer) ── */}
        <aside
          className={`
            fixed top-16 left-0 z-[70] h-[calc(100vh-4rem)] w-[85%] max-w-sm shadow-2xl
            transition-transform duration-300 ease-out
            lg:relative lg:flex-shrink-0 lg:top-auto lg:left-auto lg:z-auto lg:h-full lg:min-h-0 lg:w-72 lg:max-w-none lg:shadow-none lg:translate-x-0 lg:bg-transparent lg:border-0
            ${isDark ? 'bg-[#0a0715] border-r border-violet-900/40' : 'bg-[#eff4fb] border-r border-slate-200'}
            ${drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Mobile drawer header */}
          <div className={`lg:hidden flex items-center justify-between px-4 py-3 ${isDark ? 'border-b border-violet-900/40' : 'border-b border-slate-200'}`}>
            <h2 className={`text-sm uppercase tracking-widest ${isDark ? 'font-black text-slate-300' : 'font-semibold text-slate-700'}`}>Modules</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-fuchsia-500 hover:bg-fuchsia-900/20'
                  : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <X size={18} />
            </button>
          </div>
          <div ref={sidebarScrollRef} className="h-[calc(100vh-7.25rem)] lg:h-full overflow-y-auto pr-1 px-3 lg:px-0 py-3 lg:py-0 sidebar-scroll space-y-3">

            {/* Header */}
            <div className="hidden lg:flex items-center justify-between px-1 mb-1">
              <h3 className={`text-sm uppercase tracking-widest ${isDark ? 'font-black text-slate-400' : 'font-semibold text-slate-600'}`}>Modules</h3>
              {contentData && (
                <span className={`text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
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
                const tierLocked = !isTierUnlocked(id || '', tier.id, completedLevels);

                const TC = {
                  beginner: {
                    emoji: '🌱',
                    label: tier.color,
                    headerBg: isDark ? 'bg-emerald-500/6' : 'bg-emerald-50',
                    headerBorder: isDark ? 'border-emerald-500/25' : 'border-emerald-200',
                    accentBorder: isDark ? 'border-l-emerald-500/40' : 'border-l-emerald-500',
                    shadow: isDark ? 'shadow-none' : 'shadow-sm',
                    bar: 'bg-emerald-500',
                    badge: isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-800',
                    activeBg: isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300',
                    activeGlow: isDark ? 'shadow-[inset_0_0_0_1px_rgba(16,185,129,0.3)]' : 'ring-1 ring-emerald-200',
                    numActive: isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
                    dot: 'bg-emerald-400',
                    headerAccent: 'from-emerald-500/20 to-transparent',
                  },
                  intermediate: {
                    emoji: '⚡',
                    label: tier.color,
                    headerBg: isDark ? 'bg-sky-500/6' : 'bg-sky-50',
                    headerBorder: isDark ? 'border-sky-500/25' : 'border-sky-200',
                    accentBorder: isDark ? 'border-l-sky-500/40' : 'border-l-sky-500',
                    shadow: isDark ? 'shadow-none' : 'shadow-sm',
                    bar: 'bg-sky-500',
                    badge: isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-100 text-sky-800',
                    activeBg: isDark ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-300',
                    activeGlow: isDark ? 'shadow-[inset_0_0_0_1px_rgba(14,165,233,0.3)]' : 'ring-1 ring-sky-200',
                    numActive: isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-700',
                    dot: 'bg-sky-400',
                    headerAccent: 'from-sky-500/20 to-transparent',
                  },
                  expert: {
                    emoji: '🔥',
                    label: tier.color,
                    headerBg: isDark ? 'bg-amber-500/6' : 'bg-amber-50',
                    headerBorder: isDark ? 'border-amber-500/25' : 'border-amber-200',
                    accentBorder: isDark ? 'border-l-amber-500/40' : 'border-l-amber-500',
                    shadow: isDark ? 'shadow-none' : 'shadow-sm',
                    bar: 'bg-amber-500',
                    badge: isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-800',
                    activeBg: isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-300',
                    activeGlow: isDark ? 'shadow-[inset_0_0_0_1px_rgba(245,158,11,0.3)]' : 'ring-1 ring-amber-200',
                    numActive: isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700',
                    dot: 'bg-amber-400',
                    headerAccent: 'from-amber-500/20 to-transparent',
                  },
                }[tier.id] || {} as any;

                return (
                  <div key={tier.id} className={`overflow-hidden transition-all duration-200 ${
                    isDark
                      ? `rounded-2xl border border-l-4 ${tierLocked ? 'bg-slate-900/40 border-slate-800 border-l-slate-700' : `${TC.headerBg} ${TC.headerBorder} ${TC.accentBorder}`}`
                      : `rounded-xl border ${tierLocked ? 'border-slate-200 bg-slate-50/70 opacity-60' : 'border-slate-200 bg-white'}`
                  }`}>

                    {/* ── Tier Header ── */}
                    <button
                      onClick={() => toggleTier(tier.id)}
                      className={`w-full text-left group ${isDark ? 'px-4 pt-3.5 pb-3' : 'px-4 pt-3 pb-2.5'}`}
                      title={tierLocked ? 'Complete the previous tier to unlock' : undefined}
                    >
                      {isDark ? (
                        /* Dark mode: emoji icon + colored label (unchanged) */
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${
                            tierLocked
                              ? 'bg-slate-800 border-slate-700 grayscale opacity-70'
                              : `${TC.headerBg} ${TC.headerBorder}`
                          }`}>
                            {TC.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-base font-black ${tierLocked ? 'text-slate-400' : tier.color}`}>{tier.label}</span>
                              {allTierDone ? (
                                <span className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                                  <CheckCircle2 size={12} /> All done
                                </span>
                              ) : (
                                <span className={`text-sm font-bold px-1.5 py-0.5 rounded-md ${
                                  tierLocked ? 'bg-slate-800 text-slate-400' : TC.badge
                                }`}>
                                  {tier.moduleIds.length > 0 ? `${completedInTier}/${tier.moduleIds.length}` : '—'}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown size={13} className={`text-slate-400 group-hover:text-slate-300 transition-transform duration-250 flex-shrink-0 ${isCollapsed ? '-rotate-90' : ''}`} />
                        </div>
                      ) : (
                        /* Light mode: Pluralsight-flat — small uppercase label, plain count */
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${tierLocked ? 'text-slate-400' : 'text-slate-500'}`}>
                            {tier.label}
                          </span>
                          <div className="flex items-center gap-2">
                            {allTierDone ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 size={10} /> Done
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                                {tier.moduleIds.length > 0 ? `${completedInTier} / ${tier.moduleIds.length}` : '—'}
                              </span>
                            )}
                            <ChevronDown size={12} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-250 flex-shrink-0 ${isCollapsed ? '-rotate-90' : ''}`} />
                          </div>
                        </div>
                      )}
                      {/* Progress bar */}
                      {tier.moduleIds.length > 0 && (
                        isDark ? (
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${allTierDone ? 'bg-emerald-500' : tierLocked ? 'bg-slate-700' : TC.bar} rounded-full transition-all duration-700`}
                              style={{ width: `${tierPct}%` }}
                            />
                          </div>
                        ) : (
                          <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${allTierDone ? 'bg-emerald-500' : tierLocked ? 'bg-slate-200' : 'bg-blue-500'}`}
                              style={{ width: `${tierPct}%` }}
                            />
                          </div>
                        )
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
                            const moduleLocked = tierLocked || !isModuleUnlocked(id || '', lvl, completedLevels);
                            const prereqId = moduleLocked && !tierLocked ? getPrerequisiteHint(id || '', lvl) : '';
                            const prereqMeta = prereqId ? contentData?.levels.find(l => l.id === prereqId) : null;
                            const prereqShort = prereqMeta?.title.split(':')[1]?.trim() || prereqMeta?.title || prereqId;
                            const lockTitle = tierLocked
                              ? 'Complete the previous tier to unlock'
                              : moduleLocked
                              ? `Complete "${prereqShort}" first`
                              : undefined;

                            return (
                              <button
                                key={lvl}
                                data-active-module={isActive ? 'true' : undefined}
                                onClick={() => moduleLocked ? (lockTitle && showLockToast(lockTitle)) : pickLevel(lvl)}
                                title={lockTitle}
                                className={`w-full text-left px-2.5 py-2 rounded-xl border transition-all duration-200 group/item ${
                                  moduleLocked
                                    ? tierLocked
                                      ? 'border-transparent opacity-70 cursor-not-allowed'
                                      : 'border-dashed border-slate-300/60 dark:border-slate-700/50 opacity-65 cursor-not-allowed'
                                    : isActive
                                    ? `${TC.activeBg} ${TC.activeGlow}`
                                    : isCompleted
                                    ? 'border-transparent hover:bg-emerald-500/5 hover:border-emerald-500/10'
                                    : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {/* Status badge */}
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                                    moduleLocked
                                      ? 'bg-slate-200/60 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600'
                                      : isActive
                                      ? `${TC.numActive}`
                                      : isCompleted
                                      ? 'bg-emerald-500/15 text-emerald-400'
                                      : 'bg-slate-200/80 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500'
                                  }`}>
                                    {moduleLocked
                                      ? <Lock size={11} />
                                      : isCompleted
                                      ? <CheckCircle2 size={13} />
                                      : <span style={{ fontSize: '10px' }}>{String(idx + 1).padStart(2, '0')}</span>}
                                  </div>
                                  {/* Title */}
                                  <span className={`text-sm font-semibold leading-snug flex-1 transition-colors ${
                                    moduleLocked
                                      ? 'text-slate-500 dark:text-slate-400'
                                      : isActive
                                      ? 'text-slate-900 dark:text-white'
                                      : isCompleted
                                      ? 'text-slate-500 dark:text-slate-400'
                                      : 'text-slate-600 dark:text-slate-400 group-hover/item:text-slate-800 dark:group-hover/item:text-slate-200'
                                  }`}>{shortTitle}</span>
                                  {/* Active pulse dot */}
                                  {isActive && !moduleLocked && (
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
                      onClick={() => pickLevel(lvl)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                        isActive
                          ? `bg-slate-100 dark:bg-slate-800 ${zoneMeta.colorText} border-current`
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                          isActive ? `bg-slate-200 dark:bg-slate-700 ${zoneMeta.colorText}` :
                          isCompleted ? 'bg-emerald-500/15 text-emerald-400' :
                          'bg-slate-200 dark:bg-slate-700/60 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={13} /> : <span style={{ fontSize: '10px' }}>{String(idx + 1).padStart(2, '0')}</span>}
                        </div>
                        <span className="font-semibold text-sm leading-snug flex-1">{shortTitle}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Mastery Trial tile ── */}
            {(() => {
              const hasQuestions = (QUESTION_BANK[id || ''] ?? []).length > 0;
              const badge = MASTERY_BADGES[id || ''];
              const earned = masteryBadges[id || ''] === true;
              const score = masteryScores[id || ''];
              return (
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  onClick={() => navigate(`/zone/${id}/mastery`)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 group
                    ${isDark
                      ? earned
                        ? 'border-violet-500/60 bg-violet-500/5 hover:border-violet-500 hover:bg-violet-500/12'
                        : hasQuestions
                          ? `${zoneMeta?.borderColor ?? 'border-slate-300'} ${zoneMeta?.bgColor ?? 'bg-slate-50'} hover:border-opacity-80 hover:scale-[1.01]`
                          : 'border-slate-800 bg-slate-900/30 opacity-70 cursor-not-allowed'
                      : earned
                        ? 'border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100 shadow-sm'
                        : hasQuestions
                          ? 'border-slate-300 bg-white hover:border-blue-300 hover:bg-blue-50 hover:scale-[1.01] shadow-sm'
                          : 'border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed'
                    }`}
                  disabled={!hasQuestions}
                  title={!hasQuestions ? 'Questions coming soon' : undefined}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                      isDark
                        ? earned
                          ? 'bg-violet-500/15 border-violet-500/40 text-violet-400'
                          : 'bg-slate-900/80 border-slate-700 text-slate-500'
                        : earned
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                      <Trophy size={18} className={isDark ? (earned ? 'text-violet-500' : '') : (earned ? 'text-indigo-600' : 'text-blue-600')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-black leading-tight ${
                        isDark
                          ? earned ? 'text-violet-300' : 'text-slate-200'
                          : earned ? 'text-indigo-900' : 'text-slate-800'
                      }`}>
                        Mastery Trial
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {hasQuestions ? '30 questions · 30 min' : 'Coming soon'}
                      </p>
                    </div>
                    {earned && badge && (
                      <span className="text-lg flex-shrink-0" title={badge.name}>{badge.icon}</span>
                    )}
                  </div>
                  {/* Badge name if earned */}
                  {earned && badge && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-xs font-black ${isDark ? 'text-violet-400' : 'text-indigo-700'}`}>{badge.icon} {badge.name}</span>
                    </div>
                  )}
                  {/* Score stats */}
                  {score && (
                    <div className={`flex gap-3 mt-2 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span>Best: {score.bestScore}/30</span>
                      <span>·</span>
                      <span>{score.attempts} attempt{score.attempts !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {/* CTA */}
                  {hasQuestions && (
                    <div className={`mt-2.5 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all ${
                      isDark
                        ? earned ? 'text-violet-400' : (zoneMeta?.colorText ?? 'text-slate-600')
                        : earned ? 'text-indigo-700' : 'text-blue-700'
                    }`}>
                      ⚔️ {score ? 'Retake Trial' : 'Enter the Trial'} →
                    </div>
                  )}
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Fade gradient — signals more content below without a scrollbar */}
          <div className={`pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t to-transparent ${isDark ? 'from-[#07050f]' : 'from-[#eff4fb]'}`} />
        </aside>

        {/* Main Content Area */}
        <main ref={mainContentRef} className={`flex-1 lg:min-h-0 min-w-0 rounded-2xl p-4 sm:p-6 lg:p-8 relative lg:overflow-y-auto lg:sidebar-scroll ${
          isDark
            ? 'bg-slate-900/50 border border-violet-900/25 shadow-2xl'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>

          {/* ── Step Indicator ── */}
          {(() => {
            const isLevelDone = completedLevels.includes(`${id}::${level}`);

            if (isLevelDone) {
              return (
                <div className={`mb-8 rounded-2xl overflow-hidden ${
                  isDark
                    ? 'border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shadow-[0_0_24px_rgba(16,185,129,0.08)]'
                    : 'border border-emerald-200 bg-emerald-50 shadow-sm'
                }`}>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isDark
                        ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                        : 'bg-emerald-100 border-emerald-300'
                    }`}>
                      <CheckCircle2 size={22} className={isDark ? 'text-emerald-400' : 'text-emerald-700'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm tracking-wide ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>Module Complete ✓</p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>You have mastered this topic. Review or re-fight anytime.</p>
                    </div>
                    <div className={`flex items-center rounded-xl p-1 gap-1 flex-shrink-0 ${isDark ? 'bg-slate-800/80' : 'bg-white border border-slate-200'}`}>
                      <button
                        onClick={() => setMode('library')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          mode === 'library'
                            ? (isDark ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40' : 'bg-blue-600 text-white')
                            : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-blue-700')
                        }`}
                      >
                        <BookOpen size={12} /> Learn
                      </button>
                      <button
                        onClick={() => setMode('arena')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          mode === 'arena'
                            ? (isDark ? 'bg-rose-500 text-white shadow-md shadow-rose-900/40' : 'bg-rose-500 text-white')
                            : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-rose-700')
                        }`}
                      >
                        <Swords size={12} /> Boss Fight
                      </button>
                    </div>
                  </div>
                  {/* Completion progress bar — full */}
                  <div className={`h-0.5 w-full ${isDark ? 'bg-emerald-500/40' : 'bg-emerald-300'}`} />
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
              <div className={`flex items-center mb-8 rounded-2xl p-1.5 gap-1.5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100 border border-slate-200'}`}>
                {steps.map((s, i) => {
                  const isDone = i < activeIdx;
                  const isActive = i === activeIdx;
                  return (
                    <React.Fragment key={s.key}>
                      <button
                        onClick={() => s.modeKey && setMode(s.modeKey)}
                        disabled={!s.modeKey}
                        className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-1.5 sm:px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                          isActive && s.key === 'learn'
                            ? (isDark ? 'bg-violet-600 text-white shadow-[0_4px_14px_rgba(109,40,217,0.35)]' : 'bg-blue-600 text-white')
                            : isActive && s.key === 'fight'
                            ? (isDark ? 'bg-rose-500 text-white shadow-[0_4px_14px_rgba(244,63,94,0.35)]' : 'bg-rose-500 text-white')
                            : isDone
                            ? (isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                            : (isDark ? 'text-slate-500' : 'text-slate-500')
                        } ${s.modeKey ? 'cursor-pointer hover:brightness-110' : 'cursor-default'}`}
                      >
                        {isDone
                          ? <CheckCircle2 size={15} />
                          : <span className="text-base leading-none">{s.emoji}</span>}
                        <span className="truncate">{s.label}</span>
                      </button>
                      {i < steps.length - 1 && (
                        <div className={`w-3 sm:w-6 h-0.5 rounded-full flex-shrink-0 transition-colors duration-500 ${
                          isDone ? (isDark ? 'bg-emerald-400/50' : 'bg-emerald-400') : (isDark ? 'bg-slate-700' : 'bg-slate-300')
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })()}

          {mode === 'library' ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={`library-${level}`}>
              <AnimatePresence>
              {justCompleted && (() => {
                const currentIdx = availableLevels.indexOf(level);
                const nextLevel = availableLevels[currentIdx + 1] ?? null;
                return (
                  <motion.div
                    key="boss-defeated-banner"
                    initial={{ opacity: 0, scale: 0.96, y: -12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -8, transition: { duration: 0.35, ease: 'easeIn' } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className={`mb-8 rounded-2xl overflow-hidden ${
                      isDark
                        ? 'border border-emerald-500/30 shadow-[0_0_48px_rgba(16,185,129,0.15)]'
                        : 'border border-emerald-200 shadow-sm'
                    }`}
                  >
                    {/* Top gradient bar — thicker */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                    <div className={`px-6 py-5 ${isDark ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent' : 'bg-emerald-50'}`}>

                      {/* Row 1 — icon + title + XP badge */}
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 ${
                          isDark
                            ? 'bg-emerald-500/15 border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.25)]'
                            : 'bg-emerald-100 border-emerald-300'
                        }`}>
                          <span className="text-3xl">{completionWasFirstTime ? '🏆' : '⚔️'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className={`text-xl font-black leading-tight ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                              {completionWasFirstTime ? 'Boss Defeated!' : 'Victory — Again!'}
                            </h3>
                            {completionWasFirstTime && (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border font-black text-sm ${
                                isDark ? 'bg-amber-400/20 border-amber-400/30 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800'
                              }`}>
                                +100 XP ✨
                              </span>
                            )}
                            {!nextLevel && (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-black text-sm ${
                                isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-800'
                              }`}>
                                🎉 Zone Complete!
                              </span>
                            )}
                          </div>
                          {/* Completed module name */}
                          <p className={`mt-1.5 text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {completionWasFirstTime
                              ? <><span className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>{completedModuleTitle}</span> <span className={`font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>mastered</span></>
                              : <span className={`font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Practice makes perfect. Knowledge compounds every replay.</span>
                            }
                          </p>
                        </div>
                      </div>

                      {/* Row 2 — Now Studying */}
                      {completionWasFirstTime && nextLevel && (() => {
                        const moduleTitle = currentContent?.title.split(':').slice(1).join(':').trim() || currentContent?.title;
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
                            className={`mt-4 pt-4 border-t flex items-center gap-3 ${isDark ? 'border-emerald-500/20' : 'border-emerald-200'}`}
                          >
                            <span className={`text-xs font-black uppercase tracking-widest flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Now Studying</span>
                            <div className={`h-px flex-1 ${isDark ? 'bg-slate-700/60' : 'bg-slate-300'}`} />
                            <span className={`text-base font-black text-right ${isDark ? 'text-violet-400' : 'text-blue-700'}`}>
                              {moduleTitle}
                            </span>
                          </motion.div>
                        );
                      })()}
                    </div>
                  </motion.div>
                );
              })()}
              </AnimatePresence>
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
                              style={isDark ? atomDark : oneLight}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl border border-slate-200 dark:border-slate-700"
                              {...props}
                            />
                          ) : (
                            <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                              isDark ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-blue-700'
                            }`} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {currentContent.lessonMarkdown}
                    </ReactMarkdown>
                  </div>

                  <div className={`mt-12 p-6 rounded-xl ${
                    isDark ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h4 className={`font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-blue-700'}`}>
                      <span>💡</span> The Core Analogy Summary
                    </h4>
                    <p className={`text-lg italic leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      "{currentContent.analogy}"
                    </p>
                  </div>

                  {/* Boss Fight CTA */}
                  {!completedLevels.includes(`${id}::${level}`) && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`mt-8 flex flex-col items-center gap-3 p-6 rounded-2xl border ${
                        isDark ? 'border-rose-500/20 bg-rose-500/5' : 'border-rose-200 bg-rose-50'
                      }`}
                    >
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Finished reading? Put your knowledge to the test.</p>
                      <button
                        onClick={() => setMode('arena')}
                        className={`flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all duration-200 text-sm ${
                          isDark
                            ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_24px_rgba(244,63,94,0.3)] hover:shadow-[0_0_32px_rgba(244,63,94,0.5)]'
                            : 'bg-rose-500 hover:bg-rose-600 shadow-sm'
                        }`}
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
                // Capture completed module title before navigating away
                const rawTitle = contentData?.levels.find(l => l.id === level)?.title || '';
                setCompletedModuleTitle(rawTitle.split(':').slice(1).join(':').trim() || rawTitle);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
                // Auto-navigate to the next module and expand its tier if needed
                const currentIdx = availableLevels.indexOf(level);
                const nextId = availableLevels[currentIdx + 1] ?? null;
                if (nextId) {
                  setLevel(nextId);
                  const tierWithNext = ZONE_TIERS[id || '']?.find(t => t.moduleIds.includes(nextId));
                  if (tierWithNext) {
                    setCollapsedTiers(prev => ({ ...prev, [tierWithNext.id]: false }));
                  }
                }
              }}
            />
          )}

        </main>
      </div>

      {/* Lock toast (mobile-friendly tap feedback) */}
      <AnimatePresence>
        {lockToast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl flex items-center gap-2.5 max-w-[calc(100vw-2rem)] ${
              isDark ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            <Lock size={14} className={`flex-shrink-0 ${isDark ? 'text-fuchsia-400' : 'text-amber-400'}`} />
            <span>{lockToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
