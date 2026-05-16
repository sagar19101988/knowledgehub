import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Star, Crown, CheckCircle2, Circle } from 'lucide-react';
import { XP_LEVELS, getLevel, getTotalModuleCount } from '../data/zones';

interface RankLadderModalProps {
  open: boolean;
  onClose: () => void;
  xp: number;
  completedModuleCount: number;
}

export function RankLadderModal({ open, onClose, xp, completedModuleCount }: RankLadderModalProps) {
  const { current, next } = getLevel(xp, { completedModuleCount });
  const totalModules = getTotalModuleCount();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-[#0e0b1f] border border-slate-200 dark:border-violet-900/50 rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-violet-900/40 bg-white/90 dark:bg-[#0a0715]/95 backdrop-blur rounded-t-2xl">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Rank Ladder</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{xp.toLocaleString()} XP earned</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Rank list */}
            <ul className="p-3 space-y-2">
              {XP_LEVELS.map((lvl) => {
                const isCurrent = lvl.level === current.level;
                const isLocked  = xp < lvl.min;
                const isNext    = next?.level === lvl.level;
                const xpToGo    = isNext ? lvl.min - xp : 0;

                return (
                  <li
                    key={lvl.level}
                    className={[
                      'relative rounded-xl border px-4 py-3 transition-all',
                      isCurrent
                        ? 'border-amber-400/70 bg-gradient-to-r from-amber-500/10 to-yellow-400/5 dark:from-amber-500/15 dark:to-yellow-400/5 shadow-[0_0_20px_rgba(245,158,11,0.18)]'
                        : isLocked
                          ? 'border-slate-300/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/30 opacity-70'
                          : 'border-slate-200 dark:border-violet-900/40 bg-white/60 dark:bg-slate-900/40',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-3">
                      {/* Level number badge */}
                      <div
                        className={[
                          'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm',
                          isCurrent
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                            : isLocked
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                              : 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
                        ].join(' ')}
                      >
                        {isLocked ? <Lock size={14} /> : lvl.level}
                      </div>

                      {/* Title + flavor */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={[
                              'font-bold text-sm tracking-tight',
                              isCurrent
                                ? 'text-amber-600 dark:text-amber-400'
                                : isLocked
                                  ? 'text-slate-500 dark:text-slate-400'
                                  : 'text-slate-900 dark:text-white',
                            ].join(' ')}
                          >
                            {lvl.title}
                          </h3>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                              <Star size={9} className="fill-current" /> Current
                            </span>
                          )}
                          {isNext && !lvl.requiresFullCompletion && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                              Next
                            </span>
                          )}
                          {lvl.requiresFullCompletion && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/30 px-1.5 py-0.5 rounded">
                              <Crown size={9} /> Final Trial
                            </span>
                          )}
                        </div>
                        <p
                          className={[
                            'text-xs italic mt-1 leading-snug',
                            isLocked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400',
                          ].join(' ')}
                        >
                          “{lvl.flavor}”
                        </p>

                        {/* Final Trial dual-gate panel — only on Lv.8 */}
                        {lvl.requiresFullCompletion ? (
                          <div className="mt-2 rounded-lg border border-fuchsia-300/40 dark:border-fuchsia-800/40 bg-fuchsia-500/5 dark:bg-fuchsia-900/15 px-2.5 py-2 space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-300">
                              Requires both:
                            </p>
                            {/* XP gate */}
                            <div className="flex items-center gap-1.5 text-[11px]">
                              {xp >= lvl.min
                                ? <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                                : <Circle size={12} className="text-slate-400 flex-shrink-0" />}
                              <span className={xp >= lvl.min ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}>
                                {xp.toLocaleString()} / {lvl.min.toLocaleString()} XP
                              </span>
                            </div>
                            {/* Completion gate */}
                            <div className="flex items-center gap-1.5 text-[11px]">
                              {completedModuleCount >= totalModules
                                ? <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                                : <Circle size={12} className="text-slate-400 flex-shrink-0" />}
                              <span className={completedModuleCount >= totalModules ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}>
                                {completedModuleCount} / {totalModules} modules
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-500 mt-1.5">
                            {isNext
                              ? `${xpToGo.toLocaleString()} XP to go`
                              : `${lvl.min.toLocaleString()} XP`}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer note explaining the daily-bounty implication */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-violet-900/40 bg-white/60 dark:bg-[#0a0715]/50 rounded-b-2xl">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">Final Trial:</span>{' '}
                Lv.8 requires both the XP threshold <em>and</em> 100% module completion.
                Daily bounty XP can carry you to Lv.7 — the last rank is earned by mastering every module.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
