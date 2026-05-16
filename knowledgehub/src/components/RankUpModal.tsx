import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RankUpModalProps {
  open: boolean;
  fromTitle: string | null;
  toTitle: string | null;
  toLevel: number | null;
  flavor: string | null;
  onClose: () => void;
}

export function RankUpModal({ open, fromTitle, toTitle, toLevel, flavor, onClose }: RankUpModalProps) {
  useEffect(() => {
    if (!open) return;
    const burst = () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.45 },
        colors: ['#f59e0b', '#fde047', '#a855f7', '#22d3ee'],
      });
    };
    burst();
    const t1 = setTimeout(burst, 280);
    const t2 = setTimeout(burst, 620);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open]);

  return (
    <AnimatePresence>
      {open && toTitle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-gradient-to-br dark:from-[#1a1130] dark:to-[#0e0b1f] border-2 border-amber-400/60 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.4)] dark:shadow-[0_0_60px_rgba(245,158,11,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-7 text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated radial glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.4] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.35) 0%, transparent 60%)',
              }}
            />

            {/* Sparkles icon */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
              className="relative w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.55)]"
            >
              <Sparkles size={30} className="text-slate-900" />
            </motion.div>

            {/* Header */}
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-black tracking-[0.3em] text-amber-600 dark:text-amber-400 uppercase mb-1"
            >
              Rank Up
            </motion.p>

            {/* Old title (struck through) */}
            {fromTitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0.5] }}
                transition={{ delay: 0.45, duration: 1.1, times: [0, 0.3, 0.6, 1] }}
                className="text-sm text-slate-500 dark:text-slate-400 line-through mb-1"
              >
                {fromTitle}
              </motion.p>
            )}

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center mb-1"
            >
              <ArrowUp size={16} className="text-amber-500" />
            </motion.div>

            {/* New title */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85, type: 'spring', stiffness: 180, damping: 12 }}
              className="text-2xl font-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight"
            >
              {toTitle}
            </motion.h2>

            {toLevel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 mt-1"
              >
                LEVEL {toLevel}
              </motion.p>
            )}

            {flavor && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15 }}
                className="text-sm italic text-slate-600 dark:text-slate-300 mt-4 leading-snug"
              >
                “{flavor}”
              </motion.p>
            )}

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-black text-sm tracking-wider hover:shadow-[0_0_24px_rgba(245,158,11,0.6)] transition-shadow"
            >
              CONTINUE
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
