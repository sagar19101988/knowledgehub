import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { ZONES_QUIZZES } from '../data/quizzes';
import { useQuestStore } from '../store/useQuestStore';
import confetti from 'canvas-confetti';

interface QuizEngineProps {
  zoneId: string;
  level: string;
  progressIncrement: number;
  onComplete: (firstTime: boolean) => void;
}

const AUTO_ADVANCE_MS = 2500; // ms before auto-advancing on correct answer

export function QuizEngine({ zoneId, level, progressIncrement, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wasFirstCompletion, setWasFirstCompletion] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const resultRef        = useRef<HTMLDivElement>(null);
  const advanceTimer     = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const countdownTimer   = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateZoneProgress = useQuestStore((state) => state.updateZoneProgress);
  const addXp              = useQuestStore((state) => state.addXp);
  const completedLevels    = useQuestStore((state) => state.completedLevels);
  const markLevelComplete  = useQuestStore((state) => state.markLevelComplete);

  const quizzes    = ZONES_QUIZZES[zoneId];
  const levelData  = quizzes?.find((q) => q.level === level);
  const questions  = levelData?.questions || [];
  const question   = questions[currentIndex];

  const isCorrect      = selectedOption ? (question?.options.find(o => o.id === selectedOption)?.isCorrect ?? false) : false;
  const isLastQuestion = currentIndex === questions.length - 1;

  // ── Reset when level / zone changes ───────────────────────
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setWasFirstCompletion(false);
    setCountdown(null);
    stopTimers();
  }, [level, zoneId]);

  // ── Auto-scroll + auto-advance when result appears ────────
  useEffect(() => {
    if (!showResult) return;

    // Scroll result into view after animation starts
    const scrollTimer = setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);

    // Auto-advance only for correct, non-final answers
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

  function stopTimers() {
    if (advanceTimer.current)   { clearTimeout(advanceTimer.current);    advanceTimer.current   = null; }
    if (countdownTimer.current) { clearInterval(countdownTimer.current); countdownTimer.current = null; }
  }

  function advance() {
    setCountdown(null);
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setShowResult(false);
  }

  // ── Handlers ───────────────────────────────────────────────
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
            <span className="bg-rose-500/20 text-rose-400 p-2 rounded-lg">⚔️ Boss Fight: {level}</span>
          </h3>
          <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Phase {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let btnClass = 'w-full text-left p-4 rounded-xl border transition-all ';

            if (showResult) {
              if (opt.isCorrect) {
                btnClass += 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200';
              } else if (isSelected && !opt.isCorrect) {
                btnClass += 'bg-rose-500/20 border-rose-500/50 text-rose-200';
              } else {
                btnClass += 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-50';
              }
            } else {
              if (isSelected) {
                btnClass += 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]';
              } else {
                btnClass += 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-indigo-400' : 'border-slate-300 dark:border-slate-600'}`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-400" />}
                  </div>
                  <span className="font-medium">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit button */}
        {!showResult && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="px-8 py-3 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center gap-2"
            >
              Submit Attack <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Result panel — ref used for auto-scroll */}
        {showResult && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-8 p-6 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}
          >
            <div className="flex items-start gap-4">
              {isCorrect
                ? <ShieldCheck size={32} className="text-emerald-400 flex-shrink-0 mt-1" />
                : <XCircle    size={32} className="text-rose-400    flex-shrink-0 mt-1" />
              }
              <div className="w-full">
                <h4 className={`text-lg font-bold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCorrect ? 'Direct Hit!' : 'Attack Blocked!'}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {question.explanation}
                </p>

                <div className="flex items-center justify-between gap-4">
                  {/* Auto-advance countdown hint */}
                  {isCorrect && !isLastQuestion && countdown !== null && (
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      Auto-advancing in {countdown}s…
                    </span>
                  )}
                  <div className="ml-auto">
                    {isCorrect ? (
                      <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition flex items-center gap-2"
                      >
                        {isLastQuestion
                          ? 'Claim Victory'
                          : countdown !== null
                            ? `Next Phase (${countdown}s)`
                            : 'Next Phase'
                        }
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2"
                      >
                        <RefreshCw size={18} /> Try Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
