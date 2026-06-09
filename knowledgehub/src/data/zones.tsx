// ── Shared zone metadata, tiers, and XP config ───────────────
// Imported by both App.tsx (HubMap/ZoneMap) and ZoneView.tsx
// Keeping this in a separate file allows both to share the same
// data without circular imports.

import { Play, BookOpen as _BookOpen, ShieldAlert, Database, Code, ShieldCheck, Cpu } from 'lucide-react';

// Suppress unused warning — BookOpen alias kept for future use
void _BookOpen;

export const ZONES = [
  {
    id: 'manual',
    title: 'Manual Testing',
    icon: <ShieldAlert size={32} className="text-orange-500 dark:text-orange-400" />,
    description: 'Explore the foundations of breaking things before the users do.',
    bgColor: 'bg-orange-50 dark:bg-orange-500/10',
    borderColor: 'border-orange-400/60 dark:border-orange-500/30',
    accentBorder: 'border-l-orange-500 dark:border-l-orange-500/40',
    cardShadow: 'shadow-[0_4px_20px_rgba(249,115,22,0.15)] dark:shadow-none',
    badge: 'The Detective',
    colorText: 'text-orange-600 dark:text-orange-400',
    glowColor: 'rgba(249,115,22,0.28)',
    shimmerColor: 'rgba(251,146,60,0.18)',
    progressiveUnlock: true,
  },
  {
    id: 'sql',
    title: 'SQL Sorcery',
    progressiveUnlock: true,
    icon: <Database size={32} className="text-blue-500 dark:text-blue-400" />,
    description: 'Master the art of demanding data from the kitchen without crashing the server.',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    borderColor: 'border-blue-400/60 dark:border-blue-500/30',
    accentBorder: 'border-l-blue-500 dark:border-l-blue-500/40',
    cardShadow: 'shadow-[0_4px_20px_rgba(59,130,246,0.15)] dark:shadow-none',
    badge: 'Data Whisperer',
    colorText: 'text-blue-600 dark:text-blue-400',
    glowColor: 'rgba(59,130,246,0.28)',
    shimmerColor: 'rgba(96,165,250,0.18)',
  },
  {
    id: 'api',
    progressiveUnlock: true,
    title: 'API Testing',
    icon: <Cpu size={32} className="text-purple-500 dark:text-purple-400" />,
    description: 'The invisible glue. Order unicorns from waiters and handle 404s with grace.',
    bgColor: 'bg-purple-50 dark:bg-purple-500/10',
    borderColor: 'border-purple-400/60 dark:border-purple-500/30',
    accentBorder: 'border-l-purple-500 dark:border-l-purple-500/40',
    cardShadow: 'shadow-[0_4px_20px_rgba(168,85,247,0.15)] dark:shadow-none',
    badge: 'The Postman',
    colorText: 'text-purple-600 dark:text-purple-400',
    glowColor: 'rgba(168,85,247,0.28)',
    shimmerColor: 'rgba(192,132,252,0.18)',
  },
  {
    id: 'typescript',
    progressiveUnlock: true,
    title: 'TypeScript',
    icon: <Code size={32} className="text-sky-500 dark:text-sky-400" />,
    description: 'JavaScript with an overly protective mother. Learn to build Tupperware for your code.',
    bgColor: 'bg-sky-50 dark:bg-sky-500/10',
    borderColor: 'border-sky-400/60 dark:border-sky-500/30',
    accentBorder: 'border-l-sky-500 dark:border-l-sky-500/40',
    cardShadow: 'shadow-[0_4px_20px_rgba(14,165,233,0.15)] dark:shadow-none',
    badge: 'Type Guardian',
    colorText: 'text-sky-600 dark:text-sky-400',
    glowColor: 'rgba(14,165,233,0.28)',
    shimmerColor: 'rgba(56,189,248,0.18)',
  },
  {
    id: 'playwright',
    progressiveUnlock: true,
    title: 'Playwright',
    icon: <Play size={32} className="text-emerald-500 dark:text-emerald-400" />,
    description: 'Give the hitman a precise description, not just "the guy in the shirt".',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderColor: 'border-emerald-400/60 dark:border-emerald-500/30',
    accentBorder: 'border-l-emerald-500 dark:border-l-emerald-500/40',
    cardShadow: 'shadow-[0_4px_20px_rgba(16,185,129,0.15)] dark:shadow-none',
    badge: 'Grandmaster Automaton',
    colorText: 'text-emerald-600 dark:text-emerald-400',
    glowColor: 'rgba(16,185,129,0.28)',
    shimmerColor: 'rgba(52,211,153,0.18)',
  },
  {
    id: 'ai-qa',
    progressiveUnlock: true,
    title: 'AI for QA',
    icon: <ShieldCheck size={32} className="text-rose-500 dark:text-rose-400" />,
    description: 'Talk to literal-minded genies and build self-healing zombie scripts.',
    bgColor: 'bg-rose-50 dark:bg-rose-500/10',
    borderColor: 'border-rose-400/60 dark:border-rose-500/30',
    accentBorder: 'border-l-rose-500 dark:border-l-rose-500/40',
    cardShadow: 'shadow-[0_4px_20px_rgba(244,63,94,0.15)] dark:shadow-none',
    badge: 'Cyborg Tester',
    colorText: 'text-rose-600 dark:text-rose-400',
    glowColor: 'rgba(244,63,94,0.28)',
    shimmerColor: 'rgba(251,113,133,0.18)',
  },
];

export const ZONE_TIERS: Record<string, { id: string; label: string; color: string; moduleIds: string[] }[]> = {
  typescript: [
    {
      id: 'beginner',
      label: 'Beginner',
      color: 'text-emerald-400',
      moduleIds: ['ts-intro','ts-variables','ts-control-flow','ts-template-destructuring','ts-basic-types','ts-arrays-tuples','ts-objects-interfaces','ts-functions','ts-union-intersection','ts-enums','ts-type-aliases','ts-null-safety','ts-type-assertions','ts-async-promises'],
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      color: 'text-sky-400',
      moduleIds: ['ts-generics','ts-never-unknown','ts-narrowing-exhaustive','ts-satisfies-operator','ts-utility-types','ts-keyof-typeof','ts-mapped-types','ts-conditional-types','ts-template-literal-types','ts-indexed-access','ts-classes','ts-oop-principles','ts-modules-imports','ts-decorators'],
    },
    {
      id: 'expert',
      label: 'Expert',
      color: 'text-amber-400',
      moduleIds: ['ts-advanced-conditional-types','ts-advanced-mapped-types','ts-variadic-tuples','ts-branded-nominal-types','ts-error-handling-patterns','ts-type-safe-builders','ts-declaration-merging','ts-performance-compiler'],
    },
  ],
  manual: [
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['what-is-testing','qa-vs-qc-vs-testing','verification-vs-validation','sdlc-vs-stlc','types-of-testing','test-levels','static-vs-dynamic','writing-test-cases','test-scenarios-vs-test-cases','happy-path','negative-testing','smoke-vs-sanity','exploratory-testing','bug-life-cycle','severity-vs-priority'],
    },
    {
      id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',
      moduleIds: ['bva','equivalence-partitioning','decision-table-testing','pairwise-testing','use-case-testing','error-guessing','state-transition','test-planning','entry-exit-criteria','test-estimation','defect-reporting','regression-testing','compatibility-testing','localization-testing','accessibility-testing','mobile-testing'],
    },
    {
      id: 'expert', label: 'Expert', color: 'text-amber-400',
      moduleIds: ['risk-based-testing','test-environment-management','test-data-management','state-dependency','race-conditions','interrupt-testing','performance-testing','security-testing','usability-testing','ci-cd-testing','shift-left-shift-right','ab-testing','production-testing','chaos-engineering','test-metrics','modern-testing-principles'],
    },
  ],
  sql: [
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['sql-what-is-db','sql-select','sql-where','sql-order-limit','sql-insert','sql-update-delete','sql-data-types','sql-aggregations','sql-foreign-keys','sql-constraints','sql-like-wildcards'],
    },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',   moduleIds: ['sql-joins','sql-group-by','sql-subqueries','sql-views','sql-indexes','sql-transactions','sql-string-date','sql-case-null','sql-delete-truncate-drop','sql-insert-advanced'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400', moduleIds: ['sql-window-functions','sql-cte','sql-advanced-joins','sql-stored-procedures','sql-triggers-constraints','sql-query-plan','sql-error-handling','sql-pivot-reporting'] },
  ],
  api: [
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['api-what-is-api','api-rest-vs-soap-vs-graphql','api-http-methods','api-request-anatomy','api-response-anatomy','api-status-codes','api-json-basics','api-postman-basics','api-curl-basics','api-headers-params','api-versioning-basics'],
    },
    {
      id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',
      moduleIds: ['api-auth-types','api-error-handling','api-rate-limiting-throttling','api-test-scenarios','api-assertions','api-pagination-filtering-sorting','api-chaining','api-schema-validation','api-file-upload-download','api-webhooks-callbacks','api-mock-servers'],
    },
    {
      id: 'expert', label: 'Expert', color: 'text-amber-400',
      moduleIds: ['api-automation','api-test-data-strategies','api-graphql-testing','api-security-testing','api-contract-testing','api-performance-testing','api-load-testing-tools','api-monitoring-observability','api-ci-cd'],
    },
  ],
  playwright: [
    { id: 'beginner',     label: 'Beginner',     color: 'text-emerald-400', moduleIds: ['pw-what-is-playwright','pw-installation-setup','pw-first-test-anatomy','pw-locators','pw-actions','pw-assertions','pw-config','pw-running-tests'] },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',     moduleIds: ['pw-auto-waiting','pw-fixtures-lifecycle','pw-page-object-model','pw-network-interception','pw-advanced-locators','pw-ui-interactions','pw-mobile-device-emulation','pw-dialogs-popups-iframes','pw-test-organisation','pw-api-testing','pw-accessibility-testing','pw-test-debugging','pw-data-driven-testing','pw-cicd-github-actions'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400',   moduleIds: ['pw-auth-at-scale','pw-visual-regression','pw-performance-web-vitals','pw-ci-cd-sharding','pw-debugging-cdp','pw-test-data-management','pw-component-testing','pw-bdd-cucumber-integration','pw-custom-reporters','pw-advanced-architecture'] },
  ],
  'ai-qa': [
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['ai-what-is-ai','ai-how-it-thinks','ai-your-first-prompt','ai-prompt-craft','ai-test-cases','ai-bug-reports','ai-test-data','ai-tools-overview','ai-reading-code','ai-limitations','ai-test-planning','ai-verify-output','ai-iterative-prompting'],
    },
    {
      id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',
      moduleIds: ['ai-prompt-engineering','ai-api-testing','ai-playwright-scripts','ai-code-review','ai-test-documentation','ai-accessibility-testing','ai-performance-analysis','ai-exploratory-testing','ai-prompt-templates','ai-mobile-testing','ai-regression-planning','ai-cicd-failures','ai-sql-data-validation','ai-cross-browser-testing'],
    },
    {
      id: 'expert', label: 'Expert', color: 'text-amber-400',
      moduleIds: ['ai-self-healing-tests','ai-visual-testing','ai-testing-ai-systems','ai-autonomous-agents','ai-custom-ai-tools','ai-test-generation-scale','ai-security-testing','ai-observability','ai-ethics-bias','ai-future-qa','ai-prompt-injection-security','ai-test-data-scale','ai-contract-testing'],
    },
  ],
};

/** XP awarded for first-time completion of any module. */
export const XP_PER_MODULE = 100;

/**
 * Total XP a player can earn from completing every module in every zone exactly once.
 * Auto-derived from ZONE_TIERS — add/remove modules and this updates automatically.
 * Does NOT include daily-bounty XP (which is unbounded and treated as bonus).
 */
export function getTotalEarnableXp(): number {
  return Object.values(ZONE_TIERS)
    .flat()
    .reduce((sum, tier) => sum + tier.moduleIds.length, 0) * XP_PER_MODULE;
}

/**
 * Rank ladder (hybrid auto-anchored design).
 *
 * Lv.1–7 use fixed thresholds — stable across typical content additions, so
 * existing players don't get unexpectedly demoted when a few modules are added.
 *
 * Lv.8 (max rank) is auto-anchored to 100% content completion via
 * getTotalEarnableXp(). Add modules → threshold rises in lockstep.
 * "Max rank" therefore always means "you've completed everything that exists."
 *
 * ⚠️ Review Lv.2–7 thresholds when total earnable XP grows beyond ~25,000
 * (currently auto-tracked; ~15,800 with 158 modules as of last calibration).
 */
const RANK_FIXED_LOWER = [0, 500, 1500, 3000, 5500, 8500, 12000];

const RANK_META = [
  { title: 'Professional Button Clicker', flavor: 'Every great QA starts with a click. And another. And another.' },
  { title: 'Chaos Apprentice',            flavor: "You've learned to break things on purpose. Mostly on purpose." },
  { title: 'Bug Whisperer',               flavor: "They don't shout at bugs. The bugs shout to them." },
  { title: 'Assert Addict',               flavor: 'You see truth, and you pin it down with `expect(`.' },
  { title: 'Flake Fighter',               flavor: 'Intermittent failures bow to your retry strategy.' },
  { title: 'Pipeline Overlord',           flavor: 'Green builds bend the knee.' },
  { title: 'Test Oracle',                 flavor: 'You glimpse the failure before the build runs.' },
  { title: 'The Unkillable QA',           flavor: 'Production may burn. You will not.' },
];

export const XP_LEVELS = RANK_META.map((meta, i) => ({
  level:  i + 1,
  title:  meta.title,
  flavor: meta.flavor,
  // Lv.1–7 = fixed thresholds. Lv.8 = max rank = auto-anchored to 100% completion.
  // Math.max guard ensures Lv.8 always exceeds Lv.7 even if content radically shrinks.
  min: i < RANK_FIXED_LOWER.length
    ? RANK_FIXED_LOWER[i]
    : Math.max(getTotalEarnableXp(), RANK_FIXED_LOWER[RANK_FIXED_LOWER.length - 1] + 1),
  // True only for the max rank — UI uses this to surface the dual-gate requirement.
  requiresFullCompletion: i === RANK_META.length - 1,
}));

/** Total module count across all zones — used by the Lv.8 completion gate. */
export function getTotalModuleCount(): number {
  return Object.values(ZONE_TIERS)
    .flat()
    .reduce((sum, tier) => sum + tier.moduleIds.length, 0);
}

/**
 * Compute current rank from XP.
 *
 * `ctx.completedModuleCount` enables the Lv.8 completion gate: if a player has
 * enough XP for Lv.8 but hasn't finished every module, they stay at Lv.7. This
 * prevents pure daily-bounty grinding from reaching the max title.
 *
 * Without `ctx`, ranks are pure-XP (legacy behaviour).
 */
export function getLevel(xp: number, ctx?: { completedModuleCount: number }) {
  let current = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (xp >= lvl.min) current = lvl;
  }

  // Lv.8 completion gate
  if (ctx && current.requiresFullCompletion) {
    const total = getTotalModuleCount();
    if (ctx.completedModuleCount < total) {
      // Cap at Lv.7
      current = XP_LEVELS[XP_LEVELS.length - 2];
    }
  }

  const nextIdx = XP_LEVELS.findIndex(l => l.level === current.level) + 1;
  const next    = XP_LEVELS[nextIdx] ?? null;
  const progress = next
    ? Math.min(((xp - current.min) / (next.min - current.min)) * 100, 100)
    : 100;
  return { current, next, progress };
}
