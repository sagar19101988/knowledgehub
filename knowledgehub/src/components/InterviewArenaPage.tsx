import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Home, ChevronLeft, ChevronRight, Shuffle as ShuffleIcon, Eye } from 'lucide-react';
import { ZONES } from '../data/zones';
import { INTERVIEW_BANK, type InterviewQA } from '../data/interviewBank';
import { useQuestStore } from '../store/useQuestStore';
import { UserAvatarMenu } from './UserAvatarMenu';

type Level = 'junior' | 'mid' | 'senior';

const LEVEL_CONFIG: {
  key: Level;
  label: string;
  range: string;
  darkActive: string;
  lightActive: string;
  darkInactive: string;
  lightInactive: string;
}[] = [
  {
    key: 'junior',
    label: 'Junior',
    range: '0–2 yrs',
    darkActive: 'bg-emerald-600 text-white shadow-[0_2px_12px_rgba(16,185,129,0.4)]',
    lightActive: 'bg-emerald-500 text-white shadow-sm',
    darkInactive: 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/20',
    lightInactive: 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50',
  },
  {
    key: 'mid',
    label: 'Mid',
    range: '2–5 yrs',
    darkActive: 'bg-blue-600 text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]',
    lightActive: 'bg-blue-500 text-white shadow-sm',
    darkInactive: 'text-slate-400 hover:text-blue-400 hover:bg-blue-900/20',
    lightInactive: 'text-slate-600 hover:text-blue-700 hover:bg-blue-50',
  },
  {
    key: 'senior',
    label: 'Senior',
    range: '5+ yrs',
    darkActive: 'bg-orange-600 text-white shadow-[0_2px_12px_rgba(234,88,12,0.4)]',
    lightActive: 'bg-orange-500 text-white shadow-sm',
    darkInactive: 'text-slate-400 hover:text-orange-400 hover:bg-orange-900/20',
    lightInactive: 'text-slate-600 hover:text-orange-700 hover:bg-orange-50',
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function makeMarkdownComponents(isDark: boolean) {
  return {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          language={match[1]}
          style={isDark ? atomDark : oneLight}
          PreTag="div"
          customStyle={{ borderRadius: '0.75rem', fontSize: '0.8rem', margin: 0 }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`px-1.5 py-0.5 rounded text-[0.82em] font-mono ${
            isDark ? 'bg-slate-800 text-violet-300' : 'bg-slate-100 text-blue-700'
          }`}
          {...props}
        >
          {children}
        </code>
      );
    },
    p({ children }: any) {
      return (
        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {children}
        </p>
      );
    },
    strong({ children }: any) {
      return (
        <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {children}
        </strong>
      );
    },
    em({ children }: any) {
      return <em className={isDark ? 'text-slate-200' : 'text-slate-800'}>{children}</em>;
    },
    ul({ children }: any) {
      return <ul className="list-disc pl-5 space-y-1.5">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-5 space-y-1.5">{children}</ol>;
    },
    li({ children }: any) {
      return (
        <li className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {children}
        </li>
      );
    },
    h2({ children }: any) {
      return (
        <h2 className={`text-sm font-bold mt-3 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {children}
        </h2>
      );
    },
    h3({ children }: any) {
      return (
        <h3 className={`text-sm font-bold mt-2 mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {children}
        </h3>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-2">
          <table className={`w-full text-xs border-collapse ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className={`border px-2 py-1 text-left font-bold ${
          isDark ? 'border-slate-700 bg-slate-800/60 text-slate-200' : 'border-slate-300 bg-slate-100 text-slate-800'
        }`}>
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className={`border px-2 py-1 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          {children}
        </td>
      );
    },
  };
}

// ── Question Card (reveal style) ──────────────────────────────
function QuestionCard({
  card, revealed, onReveal, isDark,
}: {
  card: InterviewQA;
  revealed: boolean;
  onReveal: () => void;
  isDark: boolean;
}) {
  const md = makeMarkdownComponents(isDark);

  return (
    <div className={`w-full rounded-2xl border flex flex-col gap-5 p-6 sm:p-8 ${
      isDark
        ? 'bg-[#0d0a1a] border-violet-900/25 shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Question */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-[0.12em] font-black px-2 py-0.5 rounded-md ${
            isDark ? 'bg-violet-900/40 text-violet-400' : 'bg-blue-50 text-blue-600'
          }`}>
            Question
          </span>
          {card.topic && (
            <span className={`text-[10px] uppercase tracking-[0.08em] font-bold ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {card.topic}
            </span>
          )}
        </div>
        <p className={`text-base sm:text-lg font-semibold leading-relaxed ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {card.question}
        </p>
      </div>

      {/* Optional schema / scenario shown with the question */}
      {card.code && (
        <div className="rounded-xl overflow-hidden">
          <SyntaxHighlighter
            language={card.codeLanguage ?? 'sql'}
            style={isDark ? atomDark : oneLight}
            PreTag="div"
            customStyle={{ borderRadius: '0.75rem', fontSize: '0.8rem', margin: 0 }}
          >
            {card.code}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Divider */}
      <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

      {/* Answer */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="reveal-btn"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="flex justify-center py-2"
          >
            <button
              onClick={onReveal}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-200 active:scale-[0.97] ${
                isDark
                  ? 'border-violet-600/50 text-violet-300 bg-violet-900/20 hover:border-violet-500 hover:bg-violet-900/35 hover:text-violet-200'
                  : 'border-blue-300 text-blue-700 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
              }`}
            >
              <Eye size={15} />
              Reveal Answer
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex flex-col gap-3"
          >
            <span className={`self-start text-[10px] uppercase tracking-[0.12em] font-black px-2 py-0.5 rounded-md ${
              isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}>
              Answer
            </span>
            <div className="space-y-3">
              <ReactMarkdown components={md as any} remarkPlugins={[remarkGfm]}>
                {card.answer}
              </ReactMarkdown>
            </div>

            {/* Plain-English analogy — the app's USP */}
            {card.analogy && (
              <div className={`rounded-xl border p-4 mt-1 ${
                isDark ? 'bg-amber-500/[0.07] border-amber-500/25' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] font-black mb-2 ${
                  isDark ? 'text-amber-400' : 'text-amber-700'
                }`}>
                  <span>💡</span>
                  <span>Explain it like this</span>
                </div>
                <div className="text-sm leading-relaxed italic">
                  <ReactMarkdown components={md as any} remarkPlugins={[remarkGfm]}>
                    {card.analogy}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────
function EmptyState({ zoneName, isDark }: { zoneName: string; isDark: boolean }) {
  return (
    <div className={`w-full max-w-2xl rounded-2xl border p-12 flex flex-col items-center gap-4 text-center ${
      isDark ? 'bg-[#0d0a1a] border-violet-900/25' : 'bg-white border-slate-200'
    }`}>
      <span className="text-4xl">🔧</span>
      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Questions coming soon
      </p>
      <p className={`text-sm max-w-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Interview questions for {zoneName} are being prepared.{' '}
        <strong>SQL Sorcery</strong> is fully loaded — try it there first.
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function InterviewArenaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useQuestStore(s => s.theme);
  const isDark = theme === 'dark';

  const zoneMeta = ZONES.find(z => z.id === id) ?? ZONES[0];
  const allCards = INTERVIEW_BANK[id ?? ''] ?? [];

  const [activeLevel, setActiveLevel] = useState<Level>('junior');
  const [deck, setDeck] = useState<InterviewQA[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [homeHovered, setHomeHovered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);

  const countPerLevel = {
    junior: allCards.filter(c => c.level === 'junior').length,
    mid: allCards.filter(c => c.level === 'mid').length,
    senior: allCards.filter(c => c.level === 'senior').length,
  };

  useEffect(() => {
    const filtered = allCards.filter(c => c.level === activeLevel);
    setDeck(shuffleArray(filtered));
    setCardIndex(0);
    setRevealed(false);
  }, [activeLevel, id]);

  useEffect(() => {
    setRevealed(false);
  }, [cardIndex]);

  const card = deck[cardIndex];
  const total = deck.length;

  const handlePrev = () => setCardIndex(i => (i - 1 + total) % total);
  const handleNext = () => setCardIndex(i => (i + 1) % total);
  const handleShuffle = () => {
    setDeck(d => shuffleArray([...d]));
    setCardIndex(0);
  };

  const hoverStyle = (hovered: boolean) => ({
    background:   hovered ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)') : (isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'),
    borderColor:  hovered ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)') : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
    color:        hovered ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)')     : (isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)'),
    boxShadow:    hovered ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.2)') : 'none',
  });

  const levelConfig = LEVEL_CONFIG.find(l => l.key === activeLevel)!;

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#07050f] text-white' : 'bg-[#eff4fb] text-slate-900'}`}>

      {/* ── Header Nav ───────────────────────────────────────── */}
      <nav className={`h-16 px-3 sm:px-6 flex items-center gap-2 sticky top-0 z-[80] ${
        isDark ? 'border-b border-violet-900/30 bg-[#07050f]' : 'border-b border-slate-200 bg-[#eff4fb]'
      }`}>

        {/* Left: Home + Back + breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={() => navigate('/home')}
            aria-label="Home"
            onMouseEnter={() => setHomeHovered(true)}
            onMouseLeave={() => setHomeHovered(false)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors duration-150 flex-shrink-0"
            style={hoverStyle(homeHovered)}
          >
            <Home size={14} />
            <span className="text-sm font-semibold hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => navigate(`/zone/${id}`)}
            aria-label="Back to zone"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors duration-150 group flex-shrink-0"
            style={hoverStyle(backHovered)}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm font-semibold hidden sm:inline">Back</span>
          </button>

          <span className={`select-none hidden sm:inline ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>|</span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="[&>svg]:w-5 [&>svg]:h-5 flex-shrink-0 hidden sm:inline">{zoneMeta.icon}</span>
            <span className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {zoneMeta.title}
            </span>
            <span className={`text-sm font-medium hidden sm:inline flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              / War Room
            </span>
          </div>
        </div>

        {/* Right: avatar */}
        <UserAvatarMenu />
      </nav>

      {/* ── Page Content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 sm:py-10 gap-6">

        {/* Level selector */}
        <div className={`flex rounded-xl p-1 gap-1 shadow-sm ${
          isDark ? 'bg-slate-900 border border-violet-900/40' : 'bg-white border border-slate-200'
        }`}>
          {LEVEL_CONFIG.map(lv => (
            <button
              key={lv.key}
              onClick={() => setActiveLevel(lv.key)}
              className={`px-3 sm:px-5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                activeLevel === lv.key
                  ? (isDark ? lv.darkActive : lv.lightActive)
                  : (isDark ? lv.darkInactive : lv.lightInactive)
              }`}
            >
              <span>{lv.label}</span>
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-mono leading-none ${
                activeLevel === lv.key
                  ? 'bg-white/25'
                  : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
              }`}>
                {countPerLevel[lv.key]}
              </span>
            </button>
          ))}
        </div>

        {total === 0 ? (
          <EmptyState zoneName={zoneMeta.title} isDark={isDark} />
        ) : (
          <>
            {/* Card counter + progress bar */}
            <div className="w-full max-w-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs uppercase tracking-widest font-bold ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Card {cardIndex + 1} of {total}
                </span>
                <span className={`text-xs font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  {levelConfig.range}
                </span>
              </div>
              <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activeLevel === 'junior' ? 'bg-emerald-500' :
                    activeLevel === 'mid'    ? 'bg-blue-500'    : 'bg-orange-500'
                  }`}
                  style={{ width: `${((cardIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeLevel}-${cardIndex}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <QuestionCard
                    card={card}
                    revealed={revealed}
                    onReveal={() => setRevealed(true)}
                    isDark={isDark}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 w-full max-w-2xl">
              <button
                onClick={handlePrev}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 active:scale-[0.97] ${
                  isDark
                    ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white hover:bg-slate-800/60'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <button
                onClick={handleShuffle}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 active:scale-[0.97] ${
                  isDark
                    ? 'border-slate-700 text-slate-400 hover:border-violet-600/50 hover:text-violet-300 hover:bg-violet-900/20'
                    : 'border-slate-300 text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <ShuffleIcon size={15} />
                <span>Shuffle</span>
              </button>

              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 active:scale-[0.97] ${
                  isDark
                    ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white hover:bg-slate-800/60'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
