// ── UserAvatarMenu — reusable profile avatar + dropdown ────────
// Renders the avatar circle, rank chip, theme toggle, and Exit Realm.
// Originally inlined in App.tsx + ZoneView.tsx; extracted so Mastery
// Trial screens (intro/exam/results) can reuse it without duplication.
//
// Props:
//   onExit?    – Override default logout behavior. Used by the exam
//                screen to show the "progress will be lost" warning
//                modal instead of logging out immediately.
//   exitLabel? – Override the "Exit Realm" label.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, ChevronDown, LogOut } from 'lucide-react';
import { useQuestStore } from '../store/useQuestStore';
import { useAuthStore } from '../store/useAuthStore';
import { getLevel, getTotalModuleCount } from '../data/zones';

interface UserAvatarMenuProps {
  onExit?: () => void;
  exitLabel?: string;
}

export function UserAvatarMenu({ onExit, exitLabel = 'Exit Realm' }: UserAvatarMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const theme = useQuestStore((state) => state.theme);
  const toggleTheme = useQuestStore((state) => state.toggleTheme);
  const playerName = useQuestStore((state) => state.playerName);
  const xp = useQuestStore((state) => state.xp);
  const completedLevels = useQuestStore((state) => state.completedLevels);
  const isGuest = useQuestStore((state) => state.isGuest);
  const resetProgress = useQuestStore((state) => state.resetProgress);
  const { logout } = useAuthStore();

  const isDark = theme === 'dark';
  const totalModules = getTotalModuleCount();
  const { current, next, progress } = getLevel(xp, { completedModuleCount: completedLevels.length });
  const isFinalRank = current.level === 8;
  const nextProgressText = !next
    ? `${xp.toLocaleString()} XP · Maximum rank`
    : next.requiresFullCompletion
      ? `${xp.toLocaleString()} / ${next.min.toLocaleString()} XP · ${completedLevels.length} / ${totalModules} modules`
      : `${xp.toLocaleString()} / ${next.min.toLocaleString()} XP`;

  React.useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const handleExit = () => {
    setOpen(false);
    if (onExit) {
      onExit();
      return;
    }
    if (isGuest) { resetProgress(); } else { logout(); }
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative" ref={rootRef}>
      {/* Avatar trigger button */}
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl transition-all duration-200 group ${
          isDark ? 'hover:bg-violet-900/20' : 'hover:bg-blue-50'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
          isDark
            ? 'bg-gradient-to-br from-fuchsia-500 to-violet-600 font-black shadow-[0_0_14px_rgba(192,38,211,0.5)] ring-2 ring-fuchsia-400/30'
            : 'bg-slate-700 font-semibold'
        }`}>
          {playerName?.[0]?.toUpperCase() ?? '?'}
        </div>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl overflow-hidden z-50 ${
            isDark
              ? 'bg-[#0e0b1f] border border-violet-900/50 shadow-2xl shadow-black/60'
              : 'bg-white border border-slate-200 shadow-xl'
          }`}
        >
          {/* Player header */}
          <div className={`px-4 py-3.5 ${
            isDark
              ? 'bg-gradient-to-r from-violet-900/30 to-fuchsia-900/20 border-b border-violet-900/30'
              : 'bg-slate-50 border-b border-slate-200'
          }`}>
            <div className="flex items-center gap-3 mb-2.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-base flex-shrink-0 ${
                isDark
                  ? 'bg-gradient-to-br from-fuchsia-500 to-violet-600 font-black shadow-[0_0_12px_rgba(192,38,211,0.4)]'
                  : 'bg-slate-700 font-semibold'
              }`}>
                {playerName?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{playerName}</p>
                <p className={`text-[11px] font-bold truncate ${
                  isDark ? 'text-amber-400' : isFinalRank ? 'text-amber-700' : 'text-slate-600'
                }`}>
                  Lv.{current.level} · {current.title}
                </p>
              </div>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className={`h-full rounded-full transition-all ${
                  isDark ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : isFinalRank ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`text-[10px] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{nextProgressText}</p>
          </div>

          <div className="p-1.5 space-y-0.5">
            {/* Theme toggle */}
            <button
              onClick={() => { toggleTheme(); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group/item ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'bg-slate-800 group-hover/item:bg-violet-900/40' : 'bg-slate-100 group-hover/item:bg-blue-100'
              }`}>
                {theme === 'dark'
                  ? <Sun size={14} className="text-amber-400" />
                  : <Moon size={14} className="text-blue-600" />}
              </span>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className={`h-px mx-2 ${isDark ? 'bg-slate-800/80' : 'bg-slate-200'}`} />

            {/* Exit Realm (or override) */}
            <button
              onClick={handleExit}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group/item ${
                isDark
                  ? 'text-rose-400 hover:bg-rose-950 hover:text-rose-200'
                  : 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'bg-rose-500/10 group-hover/item:bg-rose-500/20' : 'bg-rose-50 group-hover/item:bg-rose-100'
              }`}>
                <LogOut size={14} />
              </span>
              {exitLabel}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
