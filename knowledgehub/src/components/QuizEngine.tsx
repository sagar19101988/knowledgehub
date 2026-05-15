import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, ChevronRight, RefreshCw, Skull, Zap } from 'lucide-react';
import { ZONES_QUIZZES } from '../data/quizzes';
import { ZONES } from '../data/zones';
import { useQuestStore } from '../store/useQuestStore';
import confetti from 'canvas-confetti';

interface QuizEngineProps {
  zoneId: string;
  level: string;
  progressIncrement: number;
  onComplete: (firstTime: boolean) => void;
}

const AUTO_ADVANCE_MS = 2500;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Inject scoped CSS keyframes once
const STYLE_ID = 'qe-boss-fight-anims';
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes qe-shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
    @keyframes qe-correct-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    @keyframes qe-hp-pulse {
      0%,100% { box-shadow: 0 0 8px rgba(239,68,68,0.4); }
      50% { box-shadow: 0 0 18px rgba(239,68,68,0.7); }
    }
    @keyframes qe-shimmer {
      0% { transform: translateX(-120%) skewX(-14deg); }
      100% { transform: translateX(900%) skewX(-14deg); }
    }
    @keyframes qe-xp-float {
      0%   { transform: translate(-50%, 0) scale(0.85);   opacity: 0; }
      12%  { transform: translate(-50%, -10vh) scale(1.1); opacity: 1; }
      40%  { transform: translate(-50%, -40vh) scale(1.05); opacity: 1; }
      82%  { transform: translate(-50%, -85vh) scale(1);   opacity: 1; }
      100% { transform: translate(-50%, -95vh) scale(0.95); opacity: 0; }
    }
    .qe-anim-shake { animation: qe-shake 0.4s ease; }
    .qe-anim-correct { animation: qe-correct-pulse 0.4s ease; }
    .qe-hp-fill { animation: qe-hp-pulse 2s ease-in-out infinite; }
    .qe-shimmer {
      content: '';
      position: absolute;
      inset-block: 0;
      width: 80px;
      background: linear-gradient(105deg, transparent 0%, rgba(139,92,246,0.12) 50%, transparent 100%);
      animation: qe-shimmer 4s ease-in-out infinite 1s;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

// Imperatively fires an XP float that survives the engine's unmount.
// Mounts a fixed-position element on <body>, animates bottom→top, then self-removes.
function fireXpFloat(amount: number) {
  if (typeof document === 'undefined') return;
  ensureStyles();
  const el = document.createElement('div');
  el.textContent = `+${amount} XP ✨`;
  el.style.cssText = [
    'position: fixed',
    'left: 50%',
    'bottom: 6vh',
    'z-index: 9999',
    'pointer-events: none',
    'user-select: none',
    'font-weight: 900',
    'font-size: clamp(56px, 12vw, 110px)',
    'letter-spacing: -0.02em',
    'background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d946ef 100%)',
    '-webkit-background-clip: text',
    'background-clip: text',
    '-webkit-text-fill-color: transparent',
    'filter: drop-shadow(0 0 18px rgba(251,191,36,0.6)) drop-shadow(0 0 36px rgba(217,70,239,0.4))',
    'animation: qe-xp-float 3.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
  ].join(';');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

export function QuizEngine({ zoneId, level, progressIncrement, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wasFirstCompletion, setWasFirstCompletion] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const resultRef      = useRef<HTMLDivElement>(null);
  const advanceTimer   = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateZoneProgress = useQuestStore((state) => state.updateZoneProgress);
  const addXp              = useQuestStore((state) => state.addXp);
  const completedLevels    = useQuestStore((state) => state.completedLevels);
  const markLevelComplete  = useQuestStore((state) => state.markLevelComplete);
  const pauseRankUp        = useQuestStore((state) => state.pauseRankUp);
  const resumeRankUp       = useQuestStore((state) => state.resumeRankUp);

  const quizzes   = ZONES_QUIZZES[zoneId];
  const levelData = quizzes?.find((q) => q.level === level);
  const questions = levelData?.questions || [];
  const question  = questions[currentIndex];
  const zone      = ZONES.find(z => z.id === zoneId);

  const isCorrect      = selectedOption ? (question?.options.find(o => o.id === selectedOption)?.isCorrect ?? false) : false;
  const isLastQuestion = currentIndex === questions.length - 1;

  // ── Inject scoped CSS once ──
  useEffect(() => { ensureStyles(); }, []);

  // ── Safety: if the engine unmounts while a rank-up is still queued
  //    (e.g. user navigates away before clicking Claim Victory), release
  //    the pause so the modal can fire instead of being stuck queued forever.
  useEffect(() => {
    return () => { resumeRankUp(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Reset when level / zone changes ──
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setWasFirstCompletion(false);
    setCountdown(null);
    stopTimers();
  }, [level, zoneId]);

  // ── Auto-scroll + auto-advance when result appears ──
  useEffect(() => {
    if (!showResult) return;

    const scrollTimer = setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);

    if (isCorrect && !isLastQuestion) {
      const secs = Math.ceil(AUTO_ADVANCE_MS / 1000);
      setCountdown(secs);

      countdownTimer.current = setInterval(() => {
        setCountdown(prev => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);

      advanceTimer.current = setTimeout(() => {
        stopTimers();
        advance();
      }, AUTO_ADVANCE_MS);
    }

    return () => {
      clearTimeout(scrollTimer);
      stopTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult]);

  // ── Keyboard shortcuts: 1-4 to select, Enter to submit ──
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (showResult) return;
      if (!question) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= question.options.length) {
        e.preventDefault();
        const opt = question.options[num - 1];
        if (opt) setSelectedOption(opt.id);
      } else if (e.key === 'Enter' && selectedOption) {
        e.preventDefault();
        handleSubmit();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, selectedOption, question]);

  function stopTimers() {
    if (advanceTimer.current)   { clearTimeout(advanceTimer.current);    advanceTimer.current   = null; }
    if (countdownTimer.current) { clearInterval(countdownTimer.current); countdownTimer.current = null; }
  }

  function advance() {
    setCountdown(null);
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setShowResult(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleSelect = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowResult(true);

    const correct = question.options.find(o => o.id === selectedOption)?.isCorrect;
    if (correct && isLastQuestion) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
      const levelKey = `${zoneId}::${level}`;
      const alreadyCompleted = completedLevels.includes(levelKey);
      updateZoneProgress(zoneId, progressIncrement);
      if (!alreadyCompleted) {
        // Queue any rank-up so it waits for the Claim Victory XP float.
        // RankUpWatcher will buffer the modal payload until resumeRankUp() fires.
        pauseRankUp();
        addXp(100);
        markLevelComplete(levelKey);
        setWasFirstCompletion(true);
      }
    }
  };

  const handleNext = () => {
    stopTimers();
    setCountdown(null);
    if (currentIndex < questions.length - 1) {
      advance();
    } else {
      if (wasFirstCompletion) {
        fireXpFloat(100);
        // Let the XP float finish, then let any queued rank-up modal fire.
        setTimeout(() => resumeRankUp(), 3300);
      }
      onComplete(wasFirstCompletion);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  if (!question) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>No boss fight available for this level yet.</p>
      </div>
    );
  }

  // HP bar: depletes immediately on correct hit, then stays put through next phase
  const damageDealt = currentIndex + (showResult && isCorrect ? 1 : 0);
  const hpRemaining = questions.length - damageDealt;
  const hpPct = (hpRemaining / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Zone-themed dark card with violet glow + shimmer sweep */}
      <div
        className="relative overflow-hidden rounded-2xl p-7 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(12,9,28,0.96) 0%, rgba(20,10,40,0.96) 100%)',
          border: '2px solid rgba(124,58,237,0.6)',
          boxShadow: '0 0 0 1px rgba(124,58,237,0.15), 0 0 40px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Shimmer sweep */}
        <div className="qe-shimmer" aria-hidden="true" />

        {/* Header: Boss Fight label + Phase counter */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(124,58,237,0.25))',
                border: '1px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 16px rgba(239,68,68,0.2)',
              }}
            >
              ⚔️
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[20px] font-black text-red-400" style={{ letterSpacing: '-0.01em' }}>
                Boss Fight
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-0.5">
                {zone?.title ?? zoneId} · {level}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-violet-500">Phase</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-black text-white leading-none">{currentIndex + 1}</span>
              <span className="text-xs font-bold text-slate-500">/ {questions.length}</span>
            </div>
          </div>
        </div>

        {/* Boss HP bar */}
        <div className="relative z-10 mb-7">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-red-500 flex items-center gap-1.5">
              <Skull size={12} /> Boss HP
            </span>
            <span className="text-[11px] font-extrabold text-red-400">
              {hpRemaining} / {questions.length}
            </span>
          </div>
          <div
            className="relative h-3.5 w-full rounded-md overflow-hidden"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <div
              className="qe-hp-fill h-full relative transition-all duration-700"
              style={{
                width: `${hpPct}%`,
                background: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)',
                borderRadius: '5px',
              }}
            >
              <div
                className="absolute inset-0 rounded-md"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 60%)' }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <p className="relative z-10 text-[17px] leading-[1.65] text-slate-100 font-medium mb-6">
          {question.question}
        </p>

        {/* Options — A/B/C/D letter badges + key hints */}
        <div className="relative z-10 flex flex-col gap-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === opt.id;
            const letter = LETTERS[idx] ?? String(idx + 1);

            let stateClass = '';
            const inlineStyle: React.CSSProperties = {
              transition: 'all 0.18s',
              border: '1.5px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.03)',
              color: '#cbd5e1',
            };

            if (showResult) {
              if (opt.isCorrect) {
                inlineStyle.background    = 'rgba(16,185,129,0.15)';
                inlineStyle.borderColor   = 'rgba(16,185,129,0.6)';
                inlineStyle.color         = '#6ee7b7';
                inlineStyle.boxShadow     = '0 0 20px rgba(16,185,129,0.2)';
                stateClass = 'qe-anim-correct';
              } else if (isSelected) {
                inlineStyle.background    = 'rgba(239,68,68,0.12)';
                inlineStyle.borderColor   = 'rgba(239,68,68,0.5)';
                inlineStyle.color         = '#fca5a5';
                stateClass = 'qe-anim-shake';
              } else {
                inlineStyle.opacity = 0.3;
              }
            } else if (isSelected) {
              inlineStyle.background  = 'rgba(124,58,237,0.15)';
              inlineStyle.borderColor = 'rgba(124,58,237,0.6)';
              inlineStyle.color       = '#c4b5fd';
              inlineStyle.boxShadow   = '0 0 20px rgba(124,58,237,0.2), inset 0 0 20px rgba(124,58,237,0.05)';
            }

            // Letter badge styling per state
            let badgeStyle: React.CSSProperties = {
              background: 'rgba(255,255,255,0.06)',
              color: '#64748b',
              border: '1px solid rgba(255,255,255,0.08)',
            };
            if (showResult && opt.isCorrect) {
              badgeStyle = { background: 'rgba(16,185,129,0.3)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.5)' };
            } else if (showResult && isSelected) {
              badgeStyle = { background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' };
            } else if (isSelected) {
              badgeStyle = { background: 'rgba(124,58,237,0.3)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.5)' };
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={showResult}
                className={`relative w-full text-left rounded-2xl flex items-center gap-3.5 overflow-hidden ${stateClass} ${!showResult ? 'hover:translate-x-[3px]' : ''}`}
                style={{ padding: '14px 18px', fontSize: 15, fontWeight: 600, ...inlineStyle }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center font-black text-xs rounded-lg"
                  style={{ width: 30, height: 30, ...badgeStyle, transition: 'all 0.18s' }}
                >
                  {letter}
                </span>
                <span className="flex-1">{opt.text}</span>
                <span
                  className="hidden sm:inline-block flex-shrink-0 text-[10px] font-bold tracking-wider rounded px-1.5 py-0.5"
                  style={{
                    color: '#475569',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submit — Launch Attack */}
        {!showResult && (
          <div className="relative z-10 mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="flex items-center gap-2 text-white font-extrabold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:-translate-y-px"
              style={{
                padding: '13px 32px',
                background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                boxShadow: '0 0 24px rgba(124,58,237,0.45), 0 4px 12px rgba(0,0,0,0.3)',
                fontSize: 13,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              <Zap size={16} /> Launch Attack
            </button>
          </div>
        )}

        {/* Result panel — banner + body */}
        {showResult && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-7"
          >
            {/* Banner */}
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-t-2xl"
              style={{
                background: isCorrect
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.08))'
                  : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))',
                border: `1.5px solid ${isCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                borderBottom: 'none',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                  boxShadow: isCorrect ? '0 0 16px rgba(16,185,129,0.3)' : '0 0 16px rgba(239,68,68,0.3)',
                }}
              >
                {isCorrect
                  ? <ShieldCheck size={22} className="text-emerald-400" />
                  : <XCircle    size={22} className="text-red-400" />
                }
              </div>
              <div className="flex-1 relative">
                <div className={`text-xl font-black leading-none ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Direct Hit!' : 'Attack Blocked!'}
                </div>
                <div
                  className="text-[11px] uppercase tracking-[0.1em] mt-0.5"
                  style={{ color: isCorrect ? 'rgba(52,211,153,0.7)' : 'rgba(248,113,113,0.7)' }}
                >
                  {isCorrect ? 'Boss takes damage' : 'Boss deflects your strike'}
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              className="px-5 py-5 rounded-b-2xl"
              style={{
                background: isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.04)',
                border: `1.5px solid ${isCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                borderTop: 'none',
              }}
            >
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {question.explanation}
              </p>

              <div className="flex items-center justify-between gap-4">
                {isCorrect && !isLastQuestion && countdown !== null && (
                  <span className="text-xs text-slate-500">
                    Auto-advancing in {countdown}s…
                  </span>
                )}
                <div className="ml-auto">
                  {isCorrect ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2 text-white font-extrabold rounded-lg transition hover:opacity-90"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 0 16px rgba(16,185,129,0.35)',
                      }}
                    >
                      {isLastQuestion
                        ? 'Claim Victory'
                        : countdown !== null
                          ? `Next Phase (${countdown}s)`
                          : 'Next Phase'}
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-2 px-6 py-2 font-bold rounded-lg transition"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <RefreshCw size={18} /> Try Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
