import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Clock, CheckCircle2, XCircle,
  AlertTriangle, Trophy, RotateCcw, ChevronDown, ChevronUp, Bookmark, CornerDownRight,
} from 'lucide-react';
import { ZONES } from '../data/zones';
import { QUESTION_BANK, MASTERY_BADGES, type MasteryTrialQuestion } from '../data/questionBank';
import { useQuestStore } from '../store/useQuestStore';

const TOTAL_QUESTIONS = 30;
const TOTAL_TIME = 30 * 60; // 1800 seconds
const PASS_THRESHOLD = 0.8; // 80% = 24/30

type Answer = number | boolean | string | null;

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function selectQuestions(pool: MasteryTrialQuestion[]): MasteryTrialQuestion[] {
  return shuffleArray(pool).slice(0, TOTAL_QUESTIONS);
}

function isCorrect(q: MasteryTrialQuestion, answer: Answer): boolean {
  if (answer === null || answer === undefined) return false;
  return answer === q.correct;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Question type renderers ───────────────────────────────────

function McqOptions({
  options, answer, submitted, correct, onChange,
}: {
  options: string[];
  answer: Answer;
  submitted: boolean;
  correct: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3 mt-6">
      {options.map((opt, i) => {
        const selected = answer === i;
        const isRight = submitted && i === correct;
        const isWrong = submitted && selected && i !== correct;
        return (
          <button
            key={i}
            disabled={submitted}
            onClick={() => onChange(i)}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl border-2 transition-all duration-200 text-[13px] font-medium leading-snug
              ${isRight  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' :
                isWrong  ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300' :
                selected  ? 'border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300' :
                submitted ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed text-slate-600 dark:text-slate-400' :
                            'border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-500/5 text-slate-700 dark:text-slate-300'}`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black
                ${isRight  ? 'border-emerald-500 bg-emerald-500 text-white' :
                  isWrong  ? 'border-rose-500 bg-rose-500 text-white' :
                  selected  ? 'border-violet-500 bg-violet-500 text-white' :
                              'border-current'}`}>
                {isRight ? '✓' : isWrong ? '✗' : String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TfOptions({
  answer, submitted, correct, onChange,
}: {
  answer: Answer;
  submitted: boolean;
  correct: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-4 mt-6">
      {([true, false] as const).map((val) => {
        const selected = answer === val;
        const isRight = submitted && val === correct;
        const isWrong = submitted && selected && val !== correct;
        const label = val ? 'True' : 'False';
        return (
          <button
            key={String(val)}
            disabled={submitted}
            onClick={() => onChange(val)}
            className={`flex-1 py-3.5 rounded-2xl border-2 text-base font-black transition-all duration-200
              ${isRight  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' :
                isWrong  ? 'border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-300' :
                selected  ? 'border-violet-500 bg-violet-500/15 text-violet-600 dark:text-violet-300' :
                submitted ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed text-slate-500' :
                val       ? 'border-emerald-400/50 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            'border-rose-400/50 hover:border-rose-500 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}
          >
            {isRight ? '✓ ' : isWrong ? '✗ ' : ''}{label}
          </button>
        );
      })}
    </div>
  );
}

function FillBlankOptions({
  blank, chips, answer, submitted, correct, onChange,
}: {
  blank: string;
  chips: string[];
  answer: Answer;
  submitted: boolean;
  correct: string;
  onChange: (v: string) => void;
}) {
  const parts = blank.split('___');
  const filled = typeof answer === 'string' ? answer : null;

  return (
    <div className="mt-6 space-y-6">
      {/* Sentence with blank */}
      <div className="text-base text-slate-700 dark:text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        {parts[0]}
        <span className={`inline-block mx-1 min-w-[120px] px-3 py-0.5 rounded-lg border-2 text-center font-bold transition-colors
          ${submitted && filled === correct ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' :
            submitted && filled !== correct ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300' :
            filled ? 'border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300' :
                     'border-dashed border-slate-400 dark:border-slate-500 text-slate-400 dark:text-slate-500'}`}>
          {filled ?? '?'}
        </span>
        {parts[1]}
        {submitted && filled !== correct && (
          <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold">→ {correct}</span>
        )}
      </div>
      {/* Word chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const selected = answer === chip;
          const isRight = submitted && chip === correct;
          const isWrong = submitted && selected && chip !== correct;
          return (
            <button
              key={chip}
              disabled={submitted}
              onClick={() => onChange(chip)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-200
                ${isRight  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' :
                  isWrong  ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300' :
                  selected  ? 'border-violet-500 bg-violet-500/15 text-violet-700 dark:text-violet-300' :
                  submitted ? 'border-slate-200 dark:border-slate-700 opacity-40 cursor-not-allowed text-slate-500' :
                              'border-slate-300 dark:border-slate-600 hover:border-violet-400 hover:bg-violet-500/8 text-slate-700 dark:text-slate-300'}`}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Report Card ───────────────────────────────────────────────

function ReportCard({
  questions,
  answers,
  score,
  timeTaken,
  zoneMeta,
  badgeEarned,
  badgeAlreadyHad,
  onRetake,
  onBack,
}: {
  questions: MasteryTrialQuestion[];
  answers: Record<string, Answer>;
  score: number;
  timeTaken: number;
  zoneMeta: typeof ZONES[number];
  badgeEarned: boolean;
  badgeAlreadyHad: boolean;
  onRetake: () => void;
  onBack: () => void;
}) {
  const pct = Math.round((score / questions.length) * 100);
  const passed = score >= Math.ceil(questions.length * PASS_THRESHOLD);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const masteryBadge = MASTERY_BADGES[zoneMeta.id];

  // ── Dynamic performance verdict ──
  const verdict = (() => {
    if (pct === 100)  return { line: `Flawless run — absolute command of ${zoneMeta.title}.`,        tag: 'LEGENDARY' };
    if (pct >= 93)    return { line: `Elite performance — top-shelf understanding throughout.`,      tag: 'ELITE' };
    if (pct >= 87)    return { line: `Excellent pass — deep grasp of the material with rare gaps.`,  tag: 'EXCELLENT' };
    if (pct >= 80)    return { line: `Solid pass — a handful of expert questions to revisit.`,       tag: 'SOLID' };
    if (pct >= 70)    return { line: `So close — intermediate concepts need another pass.`,          tag: 'NEAR MISS' };
    if (pct >= 50)    return { line: `Foundation in place — focus on the modules and try again.`,    tag: 'BUILDING' };
    return                     { line: `Early days — work through the library, then return.`,        tag: 'EARLY' };
  })();

  // SVG ring geometry
  const RING_SIZE = 200;
  const RING_STROKE = 16;
  const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
  const RING_CIRC = 2 * Math.PI * RING_RADIUS;

  return (
    <div className="min-h-screen bg-[#f4f3ff] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans">

      {/* ── Sticky action bar ── */}
      <div className="sticky top-0 z-40 bg-[#f4f3ff]/90 dark:bg-[#07050f]/90 backdrop-blur border-b border-violet-200/60 dark:border-violet-900/30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Back to Zone"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all duration-200 group flex-shrink-0"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-xs font-semibold hidden sm:inline">Back to Zone</span>
          </button>
          <div className="flex-1 flex justify-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs font-black tabular-nums
              ${passed
                ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'border-rose-500/60 bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
              {passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
              <span>{score}/{questions.length}</span>
              <span className="opacity-50">·</span>
              <span>{pct}%</span>
              <span className="opacity-50">·</span>
              <span>{passed ? 'PASSED' : 'NOT PASSED'}</span>
            </div>
          </div>
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-black transition"
          >
            <RotateCcw size={13} /> <span className="hidden sm:inline">Retake</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* ── Headline: circular ring + verdict ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border-2 p-8 flex flex-col sm:flex-row items-center gap-7 ${
            passed
              ? 'border-emerald-500/60 bg-emerald-500/8 dark:bg-emerald-500/5'
              : 'border-rose-500/60 bg-rose-500/8 dark:bg-rose-500/5'
          }`}
        >
          {/* Animated score ring */}
          <div className="relative flex-shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
            <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
              <circle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
                strokeWidth={RING_STROKE} fill="none"
                className="stroke-slate-200 dark:stroke-slate-800"
              />
              <motion.circle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
                strokeWidth={RING_STROKE} fill="none" strokeLinecap="round"
                className={passed ? 'stroke-emerald-500' : 'stroke-rose-500'}
                strokeDasharray={RING_CIRC}
                initial={{ strokeDashoffset: RING_CIRC }}
                animate={{ strokeDashoffset: RING_CIRC * (1 - pct / 100) }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.35 }}
                className={`text-5xl font-black tabular-nums ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}
              >
                {pct}%
              </motion.span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                {score} / {questions.length}
              </span>
            </div>
          </div>

          {/* Verdict + meta */}
          <div className="flex-1 text-center sm:text-left">
            <div className={`inline-block text-[10px] font-black uppercase tracking-[0.18em] px-2 py-0.5 rounded-md mb-2
              ${passed ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'}`}>
              {verdict.tag}
            </div>
            <h1 className={`text-2xl font-black mb-1.5 ${passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
              {passed ? 'PASSED' : 'NOT PASSED'}
              <span className="ml-2 text-xs font-bold opacity-60">
                pass mark {Math.ceil(questions.length * PASS_THRESHOLD)}/{questions.length}
              </span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
              {verdict.line}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Time taken: {formatTime(TOTAL_TIME - timeTaken)} · {zoneMeta.title} Mastery Trial
            </p>
          </div>
        </motion.div>

        {/* ── Badge earned ── */}
        {(badgeEarned || badgeAlreadyHad) && passed && masteryBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border p-5 flex items-center gap-4 ${zoneMeta.bgColor} ${zoneMeta.borderColor}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-white/80 dark:bg-slate-900/80 border ${zoneMeta.borderColor}`}>
              {masteryBadge.icon}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${zoneMeta.colorText}`}>
                {badgeEarned ? '🎉 Badge Earned!' : '✓ Badge Retained'}
              </p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{masteryBadge.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{zoneMeta.title} Mastery Trial</p>
            </div>
          </motion.div>
        )}

        {/* ── Per-question breakdown ── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 overflow-hidden">
          <button
            onClick={() => setBreakdownOpen(o => !o)}
            className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 flex-1 text-left">Question Breakdown</h3>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{questions.length} questions</span>
            {breakdownOpen
              ? <ChevronUp size={16} className="text-slate-400" />
              : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {breakdownOpen && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {questions.map((q, idx) => {
              const userAns = answers[q.id] ?? null;
              const correct = isCorrect(q, userAns);
              const open = expandedIds.has(q.id);

              const formatAnswer = (a: Answer): string => {
                if (a === null) return 'Not answered';
                if (typeof a === 'boolean') return a ? 'True' : 'False';
                if (typeof a === 'number' && q.options) return q.options[a] ?? String(a);
                return String(a);
              };
              const formatCorrect = (): string => {
                if (typeof q.correct === 'boolean') return q.correct ? 'True' : 'False';
                if (typeof q.correct === 'number' && q.options) return q.options[q.correct] ?? String(q.correct);
                return String(q.correct);
              };

              return (
                <div key={q.id}>
                  <button
                    onClick={() => setExpandedIds(prev => {
                      const next = new Set(prev);
                      next.has(q.id) ? next.delete(q.id) : next.add(q.id);
                      return next;
                    })}
                    className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {correct
                      ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                      : <XCircle size={16} className="text-rose-500 flex-shrink-0" />}
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 w-5">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 text-left line-clamp-1">
                      {q.question}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 capitalize">{q.difficulty}</span>
                    {open ? <ChevronUp size={14} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-1 space-y-2 bg-slate-50/60 dark:bg-slate-800/30">
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{q.question}</p>
                          {q.code && (
                            <div className="rounded-lg overflow-hidden text-xs">
                              <SyntaxHighlighter language={q.codeLanguage ?? 'text'} style={atomDark} customStyle={{ margin: 0, fontSize: '11px', borderRadius: '8px' }}>
                                {q.code}
                              </SyntaxHighlighter>
                            </div>
                          )}
                          <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${correct ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'}`}>
                            Your answer: {formatAnswer(userAns)}
                          </div>
                          {!correct && (
                            <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                              Correct: {formatCorrect()}
                            </div>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{q.explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Main exam page ────────────────────────────────────────────

export default function MasteryTrialPage() {
  const navigate = useNavigate();
  const { id: zoneId = '' } = useParams<{ id: string }>();
  const zoneMeta = ZONES.find(z => z.id === zoneId);
  const pool = QUESTION_BANK[zoneId] ?? [];

  const recordMasteryResult = useQuestStore(s => s.recordMasteryResult);
  const masteryBadges = useQuestStore(s => s.masteryBadges);
  const masteryScores = useQuestStore(s => s.masteryScores);

  // Initialise questions once (stable across re-renders)
  const [questions] = useState<MasteryTrialQuestion[]>(() => selectQuestions(pool));
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState<'intro' | 'exam' | 'report'>('intro');
  const [timeTaken, setTimeTaken] = useState(0);
  const [blurWarning, setBlurWarning] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  const toggleFlag = (qid: string) => setFlagged(prev => {
    const next = new Set(prev);
    next.has(qid) ? next.delete(qid) : next.add(qid);
    return next;
  });

  const jumpToNextUnanswered = () => {
    for (let i = 1; i <= questions.length; i++) {
      const idx = (currentIdx + i) % questions.length;
      if (answers[questions[idx].id] === undefined) { setCurrentIdx(idx); return; }
    }
  };
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [badgeAlreadyHad, setBadgeAlreadyHad] = useState(false);

  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  // ── Submit handler ──
  const handleSubmit = useCallback(() => {
    const score = questions.reduce((acc, q) => acc + (isCorrect(q, answers[q.id] ?? null) ? 1 : 0), 0);
    const passed = score / questions.length >= PASS_THRESHOLD;
    const hadBadge = masteryBadges[zoneId] === true;
    recordMasteryResult(zoneId, score, passed);
    setBadgeEarned(passed && !hadBadge);
    setBadgeAlreadyHad(hadBadge);
    setTimeTaken(timeLeft);
    setPhase('report');
  }, [questions, answers, zoneId, masteryBadges, recordMasteryResult, timeLeft]);

  // ── Timer ──
  useEffect(() => {
    if (phase !== 'exam') return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft, handleSubmit]);

  // ── Scroll to top when question changes ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIdx]);

  // ── Tab-blur warning ──
  useEffect(() => {
    if (phase !== 'exam') return;
    const handleBlur = () => { setBlurWarning(true); setTimeout(() => setBlurWarning(false), 3500); };
    document.addEventListener('visibilitychange', handleBlur);
    return () => document.removeEventListener('visibilitychange', handleBlur);
  }, [phase]);

  // ── Browser close/refresh guard ──
  useEffect(() => {
    if (phase !== 'exam') return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [phase]);

  // ── Retake (returns to intro so user re-acknowledges rules) ──
  const handleRetake = () => {
    setAnswers({});
    setFlagged(new Set());
    setCurrentIdx(0);
    setTimeLeft(TOTAL_TIME);
    setPhase('intro');
    setBadgeEarned(false);
    setBadgeAlreadyHad(false);
  };

  const handleBegin = () => {
    setTimeLeft(TOTAL_TIME);
    setPhase('exam');
  };

  if (!zoneMeta || pool.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f3ff] dark:bg-[#07050f] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-4xl">⚔️</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">Mastery Trial Coming Soon</p>
          <p className="text-slate-500 text-sm">Questions for this zone are being forged.</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition">
            Back to Zone
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'report') {
    const score = questions.reduce((acc, q) => acc + (isCorrect(q, answers[q.id] ?? null) ? 1 : 0), 0);
    return (
      <ReportCard
        questions={questions}
        answers={answers}
        score={score}
        timeTaken={timeTaken}
        zoneMeta={zoneMeta}
        badgeEarned={badgeEarned}
        badgeAlreadyHad={badgeAlreadyHad}
        onRetake={handleRetake}
        onBack={() => navigate(-1)}
      />
    );
  }

  if (phase === 'intro') {
    const badge = MASTERY_BADGES[zoneId];
    const stats = masteryScores[zoneId];
    const earned = masteryBadges[zoneId] === true;
    const lastAttemptLabel = stats?.lastAttemptAt
      ? new Date(stats.lastAttemptAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      : null;

    const rules: { icon: string; title: string; body: string }[] = [
      { icon: '⏱️', title: '30 minutes total',     body: 'One countdown — spend it however you like across the questions.' },
      { icon: '📋', title: '30 questions',         body: 'A mix of single choice, true/false, code reading, and fill-in-the-blank.' },
      { icon: '✅', title: '80% to pass',          body: 'You need 24 out of 30 correct. Failed attempts never lock you out.' },
      { icon: '🔖', title: 'Mark for review',      body: 'Flag questions to revisit them before submitting. Jump freely between any question.' },
      { icon: '⏸️', title: 'No pausing',           body: 'The timer keeps running if you switch tabs or refresh the browser.' },
      { icon: '🏆', title: 'Badge on first pass',  body: `Pass once to earn the ${badge?.name ?? 'Mastery'} badge — kept forever, even if later attempts don't pass.` },
    ];

    return (
      <div className="min-h-screen bg-[#f4f3ff] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border-2 p-7 flex flex-col sm:flex-row items-center gap-5 ${zoneMeta.bgColor} ${zoneMeta.borderColor}`}
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 bg-white/80 dark:bg-slate-900/80 border ${zoneMeta.borderColor}`}>
              {earned && badge ? badge.icon : '⚔️'}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${zoneMeta.colorText} mb-1`}>
                {zoneMeta.title} · Mastery Trial
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-1.5">
                {earned ? `Defend your ${badge?.name ?? 'badge'}` : `Earn the ${badge?.name ?? 'Mastery'} badge`}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                A 30-question, 30-minute trial covering everything in this zone. Take it when you're ready.
              </p>
            </div>
          </motion.div>

          {/* Rules grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-6"
          >
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Trial Rules</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {rules.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 leading-none mt-0.5">{r.icon}</span>
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-snug">{r.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* History (if any prior attempts) */}
          {stats && stats.attempts > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-5"
            >
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Your History</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-violet-500/10 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-400">Best Score</p>
                  <p className="text-xl font-black tabular-nums text-violet-700 dark:text-violet-400 mt-0.5">{stats.bestScore}/30</p>
                </div>
                <div className="rounded-xl bg-slate-500/10 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Attempts</p>
                  <p className="text-xl font-black tabular-nums text-slate-700 dark:text-slate-300 mt-0.5">{stats.attempts}</p>
                </div>
                <div className="rounded-xl bg-slate-500/10 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Last Attempt</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-300 mt-0.5">{lastAttemptLabel}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all duration-200 group text-sm font-semibold"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to Zone
            </button>
            <button
              onClick={handleBegin}
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-[0_0_22px_rgba(5,150,105,0.35)] transition"
            >
              <Trophy size={16} /> Begin Trial <ArrowRight size={15} />
            </button>
          </motion.div>

          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            The 30-minute timer starts when you click <span className="font-bold">Begin Trial</span>.
          </p>
        </div>
      </div>
    );
  }

  const timerRed = timeLeft < 300; // < 5 min
  const timerAmber = timeLeft < 600 && !timerRed;

  return (
    <div className="min-h-screen bg-[#f4f3ff] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans flex flex-col">

      {/* ── Leave confirmation modal ── */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-[#12102a] rounded-2xl border border-slate-200 dark:border-violet-900/50 p-6 max-w-sm w-full shadow-2xl"
            >
              <AlertTriangle size={28} className="text-amber-500 mb-3" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Leave the trial?</h3>
              <p className="text-sm text-slate-500 mb-5">Your progress and answers will be lost. The timer cannot be paused.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLeaveModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">Stay</button>
                <button onClick={() => navigate(-1)} className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition">Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit confirmation modal ── */}
      <AnimatePresence>
        {showSubmitModal && (() => {
          const unansweredIdxs = questions.map((q, i) => answers[q.id] === undefined ? i : -1).filter(i => i >= 0);
          const flaggedIdxs    = questions.map((q, i) => flagged.has(q.id) ? i : -1).filter(i => i >= 0);
          const unansweredCount = unansweredIdxs.length;
          const flaggedCount    = flaggedIdxs.length;
          const state: 'zero' | 'partial' | 'all' =
            unansweredCount === questions.length ? 'zero' :
            unansweredCount > 0 ? 'partial' : 'all';

          const headline =
            state === 'zero'    ? "You haven't answered any questions yet — submit anyway?" :
            state === 'partial' ? `${unansweredCount} ${unansweredCount === 1 ? 'question is' : 'questions are'} unanswered. They'll be marked wrong.` :
            flaggedCount > 0    ? `You flagged ${flaggedCount} ${flaggedCount === 1 ? 'question' : 'questions'} for review. Submit anyway?` :
                                  'Ready to submit your trial?';
          const accent =
            state === 'zero'    ? 'rose'   :
            state === 'partial' ? 'amber'  :
            flaggedCount > 0    ? 'amber'  :
                                  'emerald';

          const jumpTo = (idx: number) => { setCurrentIdx(idx); setShowSubmitModal(false); };
          const reviewUnanswered = () => { if (unansweredIdxs.length > 0) jumpTo(unansweredIdxs[0]); };
          const reviewFlagged    = () => { if (flaggedIdxs.length > 0)    jumpTo(flaggedIdxs[0]); };

          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-[#12102a] rounded-2xl border border-slate-200 dark:border-violet-900/50 p-6 max-w-md w-full shadow-2xl"
              >
                <div className={`mb-3 ${
                  accent === 'rose'    ? 'text-rose-500'    :
                  accent === 'amber'   ? 'text-amber-500'   :
                                         'text-emerald-500'
                }`}>
                  {accent === 'emerald'
                    ? <CheckCircle2 size={28} />
                    : <AlertTriangle size={28} />}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug">
                  {headline}
                </h3>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="rounded-lg bg-emerald-500/10 px-2 py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Answered</p>
                    <p className="text-xl font-black tabular-nums text-emerald-700 dark:text-emerald-400">{answeredCount}</p>
                  </div>
                  <div className={`rounded-lg px-2 py-2 ${unansweredCount > 0 ? 'bg-rose-500/10' : 'bg-slate-500/10'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${unansweredCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>Unanswered</p>
                    <p className={`text-xl font-black tabular-nums ${unansweredCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>{unansweredCount}</p>
                  </div>
                  <div className="rounded-lg bg-violet-500/10 px-2 py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-400">Time Left</p>
                    <p className="text-xl font-black tabular-nums text-violet-700 dark:text-violet-400">{formatTime(timeLeft)}</p>
                  </div>
                </div>

                {/* Clickable unanswered chips */}
                {unansweredCount > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                      <XCircle size={12} /> Unanswered ({unansweredCount}):
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                      {unansweredIdxs.map(i => (
                        <button
                          key={i}
                          onClick={() => jumpTo(i)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition"
                        >
                          Q{i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clickable flagged chips */}
                {flaggedCount > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                      <Bookmark size={12} className="fill-amber-500 text-amber-500" /> Marked for review ({flaggedCount}):
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                      {flaggedIdxs.map(i => (
                        <button
                          key={i}
                          onClick={() => jumpTo(i)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition"
                        >
                          Q{i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 min-w-[90px] py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  {unansweredCount > 0 && (
                    <button
                      onClick={reviewUnanswered}
                      className="flex-1 min-w-[130px] py-2.5 rounded-xl border border-violet-500 bg-violet-500/10 text-sm font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 transition"
                    >
                      Review unanswered
                    </button>
                  )}
                  {unansweredCount === 0 && flaggedCount > 0 && (
                    <button
                      onClick={reviewFlagged}
                      className="flex-1 min-w-[130px] py-2.5 rounded-xl border border-amber-500 bg-amber-500/10 text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition"
                    >
                      Review flagged
                    </button>
                  )}
                  <button
                    onClick={() => { setShowSubmitModal(false); handleSubmit(); }}
                    className={`flex-1 min-w-[110px] py-2.5 rounded-xl text-sm font-black text-white transition
                      ${accent === 'rose'    ? 'bg-rose-500 hover:bg-rose-600' :
                        accent === 'amber'   ? 'bg-amber-500 hover:bg-amber-600' :
                                               'bg-emerald-600 hover:bg-emerald-700'}`}
                  >
                    {state === 'all' && flaggedCount === 0 ? 'Submit Trial' : 'Submit anyway'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── Tab-blur warning toast ── */}
      <AnimatePresence>
        {blurWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] bg-amber-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
          >
            <AlertTriangle size={15} /> Tab switch detected — timer keeps running!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <header className="h-20 border-b border-violet-200/60 dark:border-violet-900/30 bg-white/85 dark:bg-[#0a0715]/80 backdrop-blur px-4 sm:px-6 flex items-center gap-3 sticky top-0 z-50">
        {/* Left: Exit (fuchsia-glow) + zone name */}
        <button
          onClick={() => setShowLeaveModal(true)}
          aria-label="Exit trial"
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all duration-200 group flex-shrink-0"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-sm font-semibold hidden sm:inline">Exit</span>
        </button>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="[&>svg]:w-5 [&>svg]:h-5">{zoneMeta.icon}</span>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${zoneMeta.colorText}`}>
              Mastery Trial
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white -mt-0.5">
              {zoneMeta.title}
            </span>
          </div>
        </div>

        {/* Center: Prev / Q counter / Next */}
        <div className="flex-1 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            aria-label="Previous question"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-violet-400 hover:enabled:text-violet-500 hover:enabled:bg-violet-50 dark:hover:enabled:bg-violet-900/20 transition"
          >
            <ArrowLeft size={15} />
          </button>
          <span className="text-base font-black text-slate-700 dark:text-slate-200 tabular-nums min-w-[70px] text-center">
            Q {currentIdx + 1} <span className="font-normal text-slate-400">/ {questions.length}</span>
          </span>
          <button
            onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
            disabled={currentIdx === questions.length - 1}
            aria-label="Next question"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-violet-400 hover:enabled:text-violet-500 hover:enabled:bg-violet-50 dark:hover:enabled:bg-violet-900/20 transition"
          >
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Right: timer (bigger, violet default) */}
        <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border-2 font-black text-2xl tabular-nums flex-shrink-0 transition-colors
          ${timerRed    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse' :
            timerAmber  ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          'border-violet-500/60 bg-violet-500/10 text-violet-600 dark:text-violet-400'}`}
        >
          <Clock size={20} className="flex-shrink-0" />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* ── Body: sidebar (question map) + main (question) ── */}
      <div className="flex-1 flex">

        {/* Left sidebar: question map (lg+ only) */}
        <aside className="hidden lg:block w-64 border-r border-violet-200/60 dark:border-violet-900/30 bg-white/40 dark:bg-[#0a0715]/40 flex-shrink-0">
          <div className="sticky top-20 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Questions</h3>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tabular-nums">
                {answeredCount} / {questions.length}
              </span>
            </div>

            {/* Subtle inline "next pending" link */}
            <button
              onClick={jumpToNextUnanswered}
              disabled={answeredCount === questions.length}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors -mt-2"
            >
              <CornerDownRight size={11} /> Next pending
            </button>

            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                const isFlagged = flagged.has(q.id);
                const tipParts = [`Q${idx + 1}`, answered ? 'Answered' : 'Unanswered', isFlagged ? 'Marked for review' : ''].filter(Boolean);
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    title={tipParts.join(' · ')}
                    className={`relative aspect-square rounded-lg text-xs font-bold transition-all duration-150
                      ${isCurrent   ? `${zoneMeta.bgColor} ${zoneMeta.colorText} ring-2 ring-current ring-offset-1 dark:ring-offset-[#0a0715] border ${zoneMeta.borderColor}` :
                        answered    ? 'bg-violet-500 text-white hover:bg-violet-600' :
                                      'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white dark:ring-[#0a0715]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit button (always present, becomes prominent when last Q or all answered) */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className={`w-full flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-sm font-black text-white transition
                ${answeredCount === questions.length
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_18px_rgba(5,150,105,0.35)]'
                  : 'bg-violet-600 hover:bg-violet-700'}`}
            >
              <Trophy size={15} /> Submit Trial
            </button>
          </div>
        </aside>

        {/* Main question area */}
        <main className="flex-1 min-w-0">
          {/* Mobile question map (horizontal strip) */}
          <div className="lg:hidden border-b border-violet-200/60 dark:border-violet-900/30 bg-white/60 dark:bg-[#0a0715]/60 px-4 py-3 overflow-x-auto sidebar-scroll">
            <div className="flex gap-1.5 min-w-max">
              {questions.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                const isFlagged = flagged.has(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative w-7 h-7 rounded-lg text-xs font-bold transition-all duration-150 flex-shrink-0
                      ${isCurrent   ? `${zoneMeta.bgColor} ${zoneMeta.colorText} ring-2 ring-current ring-offset-1 dark:ring-offset-[#0a0715] border ${zoneMeta.borderColor}` :
                        answered    ? 'bg-violet-500 text-white' :
                                      'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white dark:ring-[#0a0715]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-2xl mx-auto w-full px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
              >
                {/* Caption (type) + bookmark toggle */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 pt-1.5">
                    {{ mcq: 'Single Choice', tf: 'True / False', 'code-mcq': 'Code Reading', 'fill-blank': 'Fill in Blank' }[current.type]}
                    <span className="mx-1.5 opacity-40">·</span>
                    {current.difficulty.toUpperCase()}
                  </p>
                  <button
                    onClick={() => toggleFlag(current.id)}
                    aria-pressed={flagged.has(current.id)}
                    aria-label={flagged.has(current.id) ? 'Remove review mark' : 'Mark for review'}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-all duration-200 flex-shrink-0
                      ${flagged.has(current.id)
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 shadow-[0_0_0_1px_rgba(245,158,11,0.25)]'
                        : 'bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500'}`}
                  >
                    <Bookmark size={13} className={flagged.has(current.id) ? 'fill-amber-500 text-amber-600' : ''} />
                    {flagged.has(current.id) ? 'Marked for review' : 'Mark for review'}
                  </button>
                </div>

                {/* Question text (bigger) */}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-3">
                  {current.question}
                </h2>

                {/* Code block (code-mcq) */}
                {current.code && current.type === 'code-mcq' && (
                  <div className="rounded-xl overflow-hidden mt-4 mb-2">
                    <SyntaxHighlighter
                      language={current.codeLanguage ?? 'text'}
                      style={atomDark}
                      customStyle={{ margin: 0, fontSize: '13px', borderRadius: '12px', padding: '16px' }}
                    >
                      {current.code}
                    </SyntaxHighlighter>
                  </div>
                )}

                {/* Answer choices */}
                {(current.type === 'mcq' || current.type === 'code-mcq') && current.options && (
                  <McqOptions
                    options={current.options}
                    answer={answers[current.id] ?? null}
                    submitted={false}
                    correct={current.correct as number}
                    onChange={(v) => setAnswers(a => ({ ...a, [current.id]: v }))}
                  />
                )}
                {current.type === 'tf' && (
                  <TfOptions
                    answer={answers[current.id] ?? null}
                    submitted={false}
                    correct={current.correct as boolean}
                    onChange={(v) => setAnswers(a => ({ ...a, [current.id]: v }))}
                  />
                )}
                {current.type === 'fill-blank' && current.blank && current.chips && (
                  <FillBlankOptions
                    blank={current.blank}
                    chips={current.chips}
                    answer={answers[current.id] ?? null}
                    submitted={false}
                    correct={current.correct as string}
                    onChange={(v) => setAnswers(a => ({ ...a, [current.id]: v }))}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile-only sticky Submit footer */}
          <div className="lg:hidden sticky bottom-0 border-t border-violet-200/60 dark:border-violet-900/30 bg-white/85 dark:bg-[#0a0715]/80 backdrop-blur px-4 py-3">
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex-1">
                {answeredCount} / {questions.length} answered
              </span>
              <button
                onClick={() => setShowSubmitModal(true)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-white transition
                  ${answeredCount === questions.length
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_18px_rgba(5,150,105,0.35)]'
                    : 'bg-violet-600 hover:bg-violet-700'}`}
              >
                <Trophy size={14} /> Submit
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
