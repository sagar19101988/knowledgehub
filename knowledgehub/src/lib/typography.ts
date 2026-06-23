// ── App typography scale ──────────────────────────────────────
// Single source of truth for text sizing/weight, derived from the War Room.
// Use these tokens everywhere a given text *role* appears so the whole app
// stays visually consistent. Compose with TEXT_COLOR for colour.
//
//   <p className={`${TEXT.body} ${TEXT_COLOR.body}`}>…</p>

export const TEXT = {
  /** Pill labels / section kickers — e.g. QUESTION, ANSWER, topic, TRIAL RULES */
  eyebrow: 'text-[10px] font-black uppercase tracking-[0.12em]',
  /** Meta text — hints, counts, timestamps */
  caption: 'text-xs font-medium',
  /** Default compact body — cards, Q&A answers, MCQ options, explanations */
  body: 'text-sm leading-relaxed',
  /** Emphasis within body */
  bodyStrong: 'text-sm font-semibold',
  /** Primary question / main statement on a card */
  prompt: 'text-base sm:text-lg font-semibold leading-relaxed',
  /** Inline heading inside answers (markdown h2/h3) */
  headingSm: 'text-sm font-bold',
  /** Card / section titles */
  headingMd: 'text-base font-bold',
  /** Page / hero titles (Home, Badges, results header) */
  headingLg: 'text-xl font-black tracking-tight',
} as const;

export const TEXT_COLOR = {
  /** Headings, key statements */
  primary: 'text-slate-900 dark:text-white',
  /** Default running text */
  body: 'text-slate-700 dark:text-slate-300',
  /** Secondary / muted */
  muted: 'text-slate-500 dark:text-slate-400',
  /** Faint / de-emphasised */
  faint: 'text-slate-400 dark:text-slate-500',
} as const;
