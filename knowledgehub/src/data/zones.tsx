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
    icon: <ShieldAlert size={32} className="text-orange-400" />,
    description: 'Explore the foundations of breaking things before the users do.',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badge: 'The Detective',
    colorText: 'text-orange-400',
    glowColor: 'rgba(249,115,22,0.28)',
    shimmerColor: 'rgba(251,146,60,0.18)',
  },
  {
    id: 'sql',
    title: 'SQL Sorcery',
    icon: <Database size={32} className="text-blue-400" />,
    description: 'Master the art of demanding data from the kitchen without crashing the server.',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badge: 'Data Whisperer',
    colorText: 'text-blue-400',
    glowColor: 'rgba(59,130,246,0.28)',
    shimmerColor: 'rgba(96,165,250,0.18)',
  },
  {
    id: 'api',
    title: 'API Testing',
    icon: <Cpu size={32} className="text-purple-400" />,
    description: 'The invisible glue. Order unicorns from waiters and handle 404s with grace.',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badge: 'The Postman',
    colorText: 'text-purple-400',
    glowColor: 'rgba(168,85,247,0.28)',
    shimmerColor: 'rgba(192,132,252,0.18)',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    icon: <Code size={32} className="text-sky-400" />,
    description: 'JavaScript with an overly protective mother. Learn to build Tupperware for your code.',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    badge: 'Type Guardian',
    colorText: 'text-sky-400',
    glowColor: 'rgba(14,165,233,0.28)',
    shimmerColor: 'rgba(56,189,248,0.18)',
  },
  {
    id: 'playwright',
    title: 'Playwright',
    icon: <Play size={32} className="text-emerald-400" />,
    description: 'Give the hitman a precise description, not just "the guy in the shirt".',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badge: 'Grandmaster Automaton',
    colorText: 'text-emerald-400',
    glowColor: 'rgba(16,185,129,0.28)',
    shimmerColor: 'rgba(52,211,153,0.18)',
  },
  {
    id: 'ai-qa',
    title: 'AI for QA',
    icon: <ShieldCheck size={32} className="text-rose-400" />,
    description: 'Talk to literal-minded genies and build self-healing zombie scripts.',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badge: 'Cyborg Tester',
    colorText: 'text-rose-400',
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
      moduleIds: ['ts-intro','ts-variables','ts-control-flow','ts-template-destructuring','ts-basic-types','ts-arrays-tuples','ts-objects-interfaces','ts-functions','ts-union-intersection','ts-enums','ts-type-aliases','ts-null-safety','ts-type-assertions'],
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      color: 'text-sky-400',
      moduleIds: ['ts-generics','ts-utility-types','ts-keyof-typeof','ts-mapped-types','ts-conditional-types','ts-template-literal-types','ts-indexed-access','ts-classes','ts-oop-principles','ts-modules-imports','ts-decorators'],
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
      moduleIds: ['what-is-testing','types-of-testing','writing-test-cases','happy-path','negative-testing','exploratory-testing','bug-life-cycle','severity-vs-priority'],
    },
    {
      id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',
      moduleIds: ['bva','equivalence-partitioning','state-transition','test-planning','defect-reporting','regression-testing'],
    },
    {
      id: 'expert', label: 'Expert', color: 'text-amber-400',
      moduleIds: ['risk-based-testing','state-dependency','race-conditions','interrupt-testing','usability-testing','test-metrics'],
    },
  ],
  sql: [
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['sql-what-is-db','sql-select','sql-where','sql-order-limit','sql-insert','sql-update-delete','sql-data-types','sql-aggregations'],
    },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',   moduleIds: ['sql-joins','sql-group-by','sql-subqueries','sql-views','sql-indexes','sql-transactions','sql-string-date','sql-case-null'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400', moduleIds: ['sql-window-functions','sql-cte','sql-advanced-joins','sql-stored-procedures','sql-triggers-constraints','sql-query-plan'] },
  ],
  api: [
    {
      id: 'beginner', label: 'Beginner', color: 'text-emerald-400',
      moduleIds: ['api-what-is-api','api-http-methods','api-request-anatomy','api-response-anatomy','api-status-codes','api-json-basics','api-postman-basics','api-headers-params'],
    },
    {
      id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',
      moduleIds: ['api-auth-types','api-test-scenarios','api-assertions','api-chaining','api-schema-validation','api-mock-servers'],
    },
    {
      id: 'expert', label: 'Expert', color: 'text-amber-400',
      moduleIds: ['api-automation','api-security-testing','api-contract-testing','api-performance-testing','api-ci-cd'],
    },
  ],
  playwright: [
    { id: 'beginner',     label: 'Beginner',     color: 'text-emerald-400', moduleIds: ['pw-what-is-playwright','pw-installation-setup','pw-first-test-anatomy','pw-locators','pw-actions','pw-assertions','pw-config','pw-running-tests'] },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',     moduleIds: ['pw-auto-waiting','pw-fixtures-lifecycle','pw-page-object-model','pw-network-interception','pw-advanced-locators','pw-dialogs-popups-iframes','pw-test-organisation','pw-api-testing'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400',   moduleIds: ['expert']       },
  ],
  'ai-qa': [
    { id: 'beginner',     label: 'Beginner',     color: 'text-emerald-400', moduleIds: ['basic']        },
    { id: 'intermediate', label: 'Intermediate', color: 'text-sky-400',     moduleIds: ['intermediate'] },
    { id: 'expert',       label: 'Expert',       color: 'text-amber-400',   moduleIds: ['expert']       },
  ],
};

export const XP_LEVELS = [
  { level: 1, title: 'Professional Button Clicker', min: 0    },
  { level: 2, title: 'Chaos Apprentice',            min: 200  },
  { level: 3, title: 'Bug Whisperer',               min: 500  },
  { level: 4, title: 'Assert Addict',               min: 1000 },
  { level: 5, title: 'Flake Fighter',               min: 1800 },
  { level: 6, title: 'Pipeline Overlord',           min: 2800 },
  { level: 7, title: 'Test Oracle',                 min: 4000 },
  { level: 8, title: 'The Unkillable QA',           min: 5500 },
];

export function getLevel(xp: number) {
  let current = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (xp >= lvl.min) current = lvl;
  }
  const nextIdx = XP_LEVELS.findIndex(l => l.level === current.level) + 1;
  const next    = XP_LEVELS[nextIdx] ?? null;
  const progress = next
    ? Math.min(((xp - current.min) / (next.min - current.min)) * 100, 100)
    : 100;
  return { current, next, progress };
}
