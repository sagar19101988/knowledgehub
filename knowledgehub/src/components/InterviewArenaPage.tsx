import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Home, ChevronLeft, ChevronRight, Shuffle as ShuffleIcon, Eye, ArrowUpRight, MessageSquare } from 'lucide-react';
import { ZONES } from '../data/zones';
import { INTERVIEW_BANK, type InterviewQA } from '../data/interviewBank';
import { useQuestStore } from '../store/useQuestStore';
import { UserAvatarMenu } from './UserAvatarMenu';
import { makeMarkdownComponents } from '../lib/markdown';

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

// War Room intro — per-level cards (accent matches the in-deck level toggle colours)
const WAR_ROOM_LEVELS: { key: Level; label: string; range: string; desc: string; accent: string; accentText: string }[] = [
  { key: 'junior', label: 'Junior', range: '0–2 yrs', desc: "Fundamentals & core concepts you'll be asked first.",        accent: '#10b981', accentText: '#34d399' },
  { key: 'mid',    label: 'Mid',    range: '2–5 yrs', desc: 'Scenario & trade-off questions that probe real judgement.',  accent: '#3b82f6', accentText: '#60a5fa' },
  { key: 'senior', label: 'Senior', range: '5+ yrs', desc: 'Architecture, strategy & leadership-level deep dives.',       accent: '#f97316', accentText: '#fb923c' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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

  const [started, setStarted] = useState(false);
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

  // ── Intro landing (shown until the user picks a level) ──
  if (!started) {
    const enterLevel = (lv: Level) => { setActiveLevel(lv); setStarted(true); };
    return (
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#07050f] text-white' : 'bg-[#eff4fb] text-slate-900'}`}>

        {/* Header Nav — matches the deck */}
        <nav className={`h-16 px-3 sm:px-6 flex items-center gap-2 sticky top-0 z-[80] ${
          isDark ? 'border-b border-violet-900/30 bg-[#07050f]' : 'border-b border-slate-200 bg-[#eff4fb]'
        }`}>
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
              <span className="text-sm font-semibold hidden sm:inline">Zone</span>
            </button>
            <span className={`select-none hidden sm:inline ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>|</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="[&>svg]:w-5 [&>svg]:h-5 flex-shrink-0 hidden sm:inline">{zoneMeta.icon}</span>
              <span className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{zoneMeta.title}</span>
              <span className={`text-sm font-medium hidden sm:inline flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/ War Room</span>
            </div>
          </div>
          <UserAvatarMenu />
        </nav>

        <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border"
            style={{
              borderColor: isDark ? 'rgba(225,29,72,0.4)' : 'rgba(225,29,72,0.22)',
              background: isDark
                ? 'linear-gradient(135deg, rgba(20,3,9,0.97) 0%, rgba(45,5,17,0.97) 55%, rgba(15,2,5,0.97) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #fff5f6 100%)',
              boxShadow: isDark ? '0 0 50px rgba(225,29,72,0.16), 0 20px 50px rgba(0,0,0,0.4)' : '0 10px 30px rgba(225,29,72,0.08)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(225,29,72,0.16) 0%, transparent 70%)' }} />
            <div className="relative z-10 px-7 sm:px-10 py-11 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 [&>svg]:w-10 [&>svg]:h-10"
                style={{
                  background: isDark ? 'rgba(225,29,72,0.16)' : 'rgba(225,29,72,0.10)',
                  border: '1.5px solid rgba(225,29,72,0.5)',
                  boxShadow: '0 0 34px rgba(225,29,72,0.3)',
                }}
              >
                {zoneMeta.icon}
              </motion.div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: isDark ? '#fb7185' : '#e11d48' }}>
                {zoneMeta.title} · The War Room
              </p>
              <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.02em' }}>
                Walk in ready.
              </h1>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#64748b' }}>
                The kind of {zoneMeta.title} questions you're most likely to face in interviews — with full, walked-through answers. Browse at your own pace. No timer, no score.
              </p>
            </div>
          </motion.div>

          {/* Level cards */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 px-1">Pick your level</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {WAR_ROOM_LEVELS.map((lv, i) => (
                <motion.button
                  key={lv.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.06 }}
                  onClick={() => enterLevel(lv.key)}
                  className="group relative text-left rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300"
                  style={{ borderColor: `${lv.accent}55`, background: isDark ? `${lv.accent}0f` : `${lv.accent}0a` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = lv.accent;
                    e.currentTarget.style.boxShadow = `0 0 24px ${lv.accent}40`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${lv.accent}55`;
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <ArrowUpRight size={16} className="absolute top-3.5 right-3.5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: lv.accent }} />
                  <div className="text-base font-black mb-2" style={{ color: isDark ? lv.accentText : lv.accent }}>{lv.label}</div>
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{lv.range}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md" style={{ color: isDark ? lv.accentText : lv.accent, background: `${lv.accent}22` }}>
                      {countPerLevel[lv.key]} questions
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}>{lv.desc}</p>
                </motion.button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-3">
              Switch levels anytime from the toggle inside — no need to come back here.
            </p>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {[
              { icon: <Eye size={17} />, text: 'Reveal-only — answer when ready' },
              { icon: <MessageSquare size={17} />, text: 'Interview-style questions' },
              { icon: <ShuffleIcon size={17} />, text: 'Shuffle & browse freely' },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${
                  isDark ? 'bg-white/[0.03] border-white/8' : 'bg-white border-slate-200'
                }`}
              >
                <span style={{ color: isDark ? '#fb7185' : '#e11d48' }}>{item.icon}</span>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex justify-center gap-8 sm:gap-12 py-5 rounded-2xl border ${
              isDark ? 'bg-white/[0.03] border-white/8' : 'bg-white border-slate-200'
            }`}
          >
            {[
              { num: allCards.length, label: 'Questions' },
              { num: 3, label: 'Levels' },
              { num: ZONES.length, label: 'Zones' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black tabular-nums" style={{ color: isDark ? '#fb7185' : '#e11d48' }}>{s.num}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    );
  }

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
            <span className="text-sm font-semibold hidden sm:inline">Zone</span>
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
