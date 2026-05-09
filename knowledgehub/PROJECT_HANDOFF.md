# QA Quest – KnowledgeHub  ·  Project Handoff Document

> **Purpose:** Pass full project context from one Claude Code session/profile to the next.  
> **Last updated:** 2026-05-09 (significant updates — see Section 8 work log and Section 18 open ideas)  
> **Read this file first**, then `CLAUDE.md` (also at the project root) before doing any work.

---

## TL;DR — What the new agent must know in 30 seconds

- **Project:** A gamified QA learning platform called *QA Quest – The Knowledge Hub*. Six "zones" (subjects), three tiers each (Beginner / Intermediate / Expert), each tier has multiple modules with a lesson + Boss Fight (quiz).
- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand + Firebase Auth + Firestore + react-router-dom v7. Deployed on Vercel.
- **Repo:** `https://github.com/sagar19101988/knowledgehub` — primary branch `main`. Vercel auto-deploys from `main`.
- **MONOREPO:** `.git` is at `C:\AITestingMaster\AI-Projects\` (parent), NOT at the knowledgehub directory. Multiple sibling projects share the same git repo. Read section 4 carefully.
- **Production URL:** https://knowledgehub-indol.vercel.app
- **Local path:** `C:\AITestingMaster\AI-Projects\knowledgehub` (Windows). Run dev with `npm run dev` from this directory.
- **Required local env:** `.env.local` with `VITE_FIREBASE_*` keys must exist; otherwise auth breaks.
- **User working style:** Plan first, confirm before implementing, **never push without explicit "commit and push" instruction**.
- **Current state (2026-05-09):** All recent work shipped to production. Latest commit on main: `ad17ad4 feat(typescript): 4 new modules covering modern TS gaps`. The user is **handing off to a different Claude account for some days**.
- **Important paused work:** A "Gauntlet" final-exam feature is fully designed but paused. **The full plan is at [`knowledgehub/Gauntlet_Plan.md`](Gauntlet_Plan.md)** (now committed). Read it before resuming. Six open questions are pinned at the bottom.
- **Active idea (not yet acted on):** User wants to migrate from `knowledgehub-indol.vercel.app` to a custom `.com` domain. Brand-name brainstorming was done; user has NOT bought a domain yet. See Section 18.

---

## 1. Project Overview

QA Quest is a self-hosted browser app that teaches QA engineering through structured lessons + interactive quizzes. The visual aesthetic is "cosmic neon" with a Daybreak lavender light mode and dark mode supported throughout. Each module has narrative-style copy, code examples (when relevant), and a "Boss Fight" multiple-choice quiz that awards XP on first-time completion.

### The Six Zones
1. **Manual Testing** (id: `manual`) — testing fundamentals
2. **SQL Sorcery** (id: `sql`) — database query skills
3. **API** (id: `api`) — REST/HTTP testing
4. **TypeScript** (id: `typescript`) — language fundamentals
5. **Playwright** (id: `playwright`) — browser automation
6. **AI for QA** (id: `ai-qa`) — AI/ML testing

### Three Tiers per Zone
- `beginner` (emerald) · `intermediate` (sky) · `expert` (amber)

### Module Anatomy
Each module = `{ id, title, lessonMarkdown, analogy }` + a quiz keyed by the same `id`. Lesson content uses `### ` for sub-headings (this convention matters for any progressive-reading feature).

---

## 2. Tech Stack (versions)

| Package | Version | Role |
|---------|---------|------|
| react | 19.2.5 | UI |
| react-router-dom | 7.14.2 | Routing |
| zustand | 5.0.12 | State management (with persist middleware) |
| firebase | 12.12.1 | Auth (email/password + Google) and Firestore for cross-device progress |
| framer-motion | 12.38.0 | Animations |
| lucide-react | 1.11.0 | Icons |
| react-markdown | 10.1.0 | Lesson rendering |
| react-syntax-highlighter | 16.1.1 | Code blocks |
| remark-gfm | 4.0.1 | GitHub-flavored markdown (tables, strikethrough) |
| canvas-confetti | 1.9.4 | Quiz completion celebration animation |
| tailwindcss | 4.2.4 | Styling (v4 — uses `@import "tailwindcss"` syntax) |
| @tailwindcss/typography | plugin | `prose` classes for markdown |
| vite | 8.0.10 | Dev/build |

Tailwind config is in `src/index.css` via `@theme` and CSS overrides — **no `tailwind.config.js`**.

---

## 3. Repository & Deployment

| Item | Value |
|------|-------|
| GitHub repo | https://github.com/sagar19101988/knowledgehub |
| Default branch | `main` |
| Deployment | Vercel (auto-deploys on push to `main`) |
| Production URL | https://knowledgehub-indol.vercel.app |
| Vercel project name | `knowledgehub` |
| Vercel team / owner | `sagar19101988s-projects` |
| Git user | `sagar19101988` |

### Monorepo structure (CRITICAL)

This is part of a **monorepo**. The `.git` directory is at `C:\AITestingMaster\AI-Projects\.git` (parent), and the knowledgehub project lives in a subdirectory. Sibling projects in the same repo include `Doc2MDConverter`, `JobAssistantBuddy`, `SprintAnalyzerAgent`, `TestOrchestrator`, `sprintlens`, `sprintpulse`.

**Implications:**
- Running `git log` from the knowledgehub directory shows commits from ALL sibling projects, not just knowledgehub.
- Git commands accept paths relative to the **repo root** (the parent), so referencing files in commands looks like `git show origin/main:knowledgehub/src/data/quizzes.ts` (with `knowledgehub/` prefix).
- A `cd ../` from knowledgehub puts you at the monorepo root.
- The Vercel deploy is configured to build from the `knowledgehub/` subdirectory.

### Vercel SPA routing
Configured via `knowledgehub/vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

This is what makes deep links like `/zone/manual` resolve to the React app instead of 404'ing.

---

## 4. Local Development Setup

### Run dev server
```bash
cd C:\AITestingMaster\AI-Projects\knowledgehub
npm run dev
```
Vite default port is `5173`; if occupied it auto-picks the next free port.

### Build
```bash
npm run build           # runs tsc -b && vite build (so type-check is part of build)
```
Output goes to `dist/`. Vercel uses this output.

### Type-check only
```bash
npx tsc --noEmit
```

### Lint
```bash
npm run lint            # uses eslint.config.js (ESLint flat config)
```

### Firebase config
- Initialization: `src/lib/firebase.ts` — reads config from `import.meta.env.VITE_FIREBASE_*` env vars.
- The auth helpers exported include: `signInWithEmail`, `signUpWithEmail`, `signInWithGoogle`, `signOutUser`, `resetPassword`, `sendVerificationEmail`, `reloadUser`, plus Firestore helpers `saveUserProgress` and `loadUserProgress`.
- **Firestore IS used** for cross-device progress sync (not just localStorage). Authenticated users get their `completedLevels`, `xp`, badges synced to a `users/{uid}` doc.

### Environment variables (REQUIRED)

The `.env.local` file at the project root contains:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=knowledgehub-42f16.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=knowledgehub-42f16
VITE_FIREBASE_STORAGE_BUCKET=knowledgehub-42f16.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=231597464249
VITE_FIREBASE_APP_ID=1:231597464249:web:9944924deea2f5f77d1968
```

**These are required for local dev to work.** Without them, `import.meta.env.VITE_FIREBASE_API_KEY` is undefined and Firebase auth crashes on page load.

`.env.local` is **not committed** (in `.gitignore`). If you lose it on a new machine, regenerate by running:
```bash
npx vercel link               # link to the Vercel project
npx vercel env pull .env.local
```

The Firebase project itself (`knowledgehub-42f16`) is owned by the user's Firebase account. Auth providers configured: Email/Password, Google.

### Source-of-truth protocol (from CLAUDE.md)

Always run `git fetch origin` before doing codebase analysis. The deployed app is built from `origin/main`. If local `main` ever drifts from `origin/main`, **trust the remote**.

```bash
git fetch origin
git log --oneline HEAD..origin/main   # shows what you're missing
```

If local has diverged with unrelated histories (this happened once in May 2026), recovery:
```bash
git branch main-old-backup main           # preserve local commits first
git checkout main && git reset --hard origin/main
```

---

## 5. Project Structure

```
knowledgehub/                         (this project; .git is in parent)
├── PROJECT_HANDOFF.md                # ← this file
├── CLAUDE.md                         # Claude Code project rules (READ THIS TOO)
├── AI_for_QA_Plan.md                 # User's content roadmap (reference doc)
├── QA_Quest_Tracker.md               # User's project tracker (reference doc)
├── README.md                         # Standard repo README
├── .env.local                        # Firebase env vars (NOT committed)
├── .gitignore                        # Standard ignores + .env.local
├── eslint.config.js                  # ESLint flat config
├── tsconfig.json                     # TS project references entry
├── tsconfig.app.json                 # App TS config
├── tsconfig.node.json                # Node-side TS config (for vite.config etc.)
├── vercel.json                       # SPA rewrite rules
├── package.json
├── index.html                        # Vite entry HTML
├── public/
│   ├── favicon.svg
│   └── narrator.mpeg                 # Voice-over for AuthPage (login narrator)
└── src/
    ├── App.tsx                       # Routes + HubMap (home page) + ZoneMap (constellation view)
    ├── main.tsx                       # React entry
    ├── index.css                      # Tailwind v4 + custom CSS (theme tokens, prose, mobile)
    ├── components/
    │   ├── AuthPage.tsx               # Email/password + Google + guest mode entry
    │   ├── ZoneView.tsx               # The lesson + Boss Fight page (per-zone)
    │   ├── QuizEngine.tsx             # Quiz UI (multiple choice, scoring, XP award)
    │   └── BadgeToast.tsx             # Floating toast for unlocked zone badges
    ├── data/
    │   ├── zones.tsx                  # ZONES array + ZONE_TIERS (which modules in which tier)
    │   ├── analogies.ts               # ZONES_CONTENT — every module's lessonMarkdown + analogy
    │   └── quizzes.ts                 # All quiz questions keyed by module id
    ├── store/
    │   ├── useQuestStore.ts           # Zustand: completedLevels, xp, theme, playerName, isGuest…
    │   └── useAuthStore.ts            # Firebase auth state (user, actionLoading, errors)
    ├── utils/
    │   └── unlockRules.ts             # Pure: isModuleUnlocked, isTierUnlocked, etc.
    └── lib/
        └── firebase.ts                # Firebase init + auth + Firestore helpers

(repo root, parent of knowledgehub/, holds the .git directory and sibling projects)
```

### Notable utility-script clutter at the project root

These untracked files exist from earlier content authoring sessions and should NOT be added to commits:
`fix_*.cjs`, `splice_*.cjs`, `pw_beginner_*.txt`, `pw_intermediate_*.txt`, `pw_expert_*.txt`, `ts_expert_*.txt`, `ts_intermediate_*.txt`, `ts_new_basic_*.txt`, `ts_oop_*.txt`, etc. The user knows about these and hasn't decided whether to gitignore or delete them.

### Key files to know

- **`src/data/zones.tsx`** — single source of truth for zone metadata + tier→module mapping. Has a `progressiveUnlock: true` flag on every zone meta enabling sequential gating.
- **`src/data/analogies.ts`** — *huge* file. Contains all lesson markdown for every module across every zone. Often >1MB.
- **`src/data/quizzes.ts`** — *huge* file. Quiz questions for every module. Keyed by module id.
- **`src/components/ZoneView.tsx`** — the second-most-complex component. Renders the navbar, sidebar (module navigator), lesson body, and Boss Fight. Lazy-loaded.
- **`src/store/useQuestStore.ts`** — central client state. Note: `completedLevels` is the array of `${zoneId}::${moduleId}` strings that drives all unlock logic.

---

## 6. Key Data Models

### A "completed level"
Stored in `completedLevels: string[]` in Zustand. Format: `"manual::what-is-testing"`, `"sql::sql-select"`, etc. **Always use `${zoneId}::${moduleId}` as the key** — this convention is depended on across many components.

### Zone tier structure (`ZONE_TIERS` in zones.tsx)
```ts
ZONE_TIERS: Record<string /*zoneId*/, {
  id: 'beginner' | 'intermediate' | 'expert';
  label: string;
  color: string;        // tailwind text color
  moduleIds: string[];  // ordered — the order is the sequential unlock order
}[]>
```

### ZONE meta (`ZONES` array in zones.tsx)
```ts
{
  id: 'manual', title: 'Manual Testing',
  icon, description, badge, colorText,
  bgColor, borderColor, accentBorder, cardShadow, glowColor, shimmerColor,
  progressiveUnlock: true,   // 👈 enables sequential gating; present on all 6 zones
}
```

### Routes (App.tsx)
- `/login` → AuthPage (or redirect to `/` if logged in)
- `/` → HubMap (protected; requires user OR isGuest)
- `/zone/:id` → ZoneView (protected)
- `*` → redirect to `/`

`ProtectedRoute` checks: `if (!user && !isGuest) navigate('/login')`.  
`LoginRoute` checks: `if (user) navigate('/')`.

---

## 7. Authentication

### Modes
1. **Email + Password** — Firebase auth with email-verification flow. New signups must verify before they can log in.
2. **Google OAuth** — Firebase popup-based sign-in.
3. **Guest mode** — sets `isGuest=true` and `playerName` in Zustand. Progress saved to localStorage only. App shows a warning modal explaining data-loss risk before entering.

### Auth store states (`useAuthStore`)
| Field | Meaning |
|-------|---------|
| `user` | Firebase user or `null` |
| `authLoading` | `true` while Firebase checks session on startup (prevents Welcome page flash on logout) |
| `actionLoading` | `true` while login/signup/logout is in-flight |
| `pendingVerification` | `true` after signup until email is verified |
| `unverifiedEmail` | email address awaiting verification |
| `error` | last auth error message |

### Cross-device sync (Firestore)
For authenticated users, `useAuthStore` calls `loadUserProgress(user.uid)` on login and `saveUserProgress(user.uid, payload)` on relevant changes. The Firestore doc is `users/{uid}` containing `completedLevels`, `xp`, badges, etc. Guest users skip this entirely — their progress lives in localStorage only.

### Session storage
- Firebase persists auth in IndexedDB (`firebaseLocalStorageDb`).
- Zustand persists `quest-storage` in localStorage (theme, playerName, completedLevels, xp, etc.).
- To fully reset local state for testing: DevTools → Application → Storage → "Clear site data".

### Inputs disabled during loading
The login/signup form disables name/email/password inputs while `actionLoading` is true (prevents edits mid-submission).

---

## 8. Recent Work Log (chronological)

### Jul–Sep 2025 (early phase, summarized)
- Initial scaffold and TypeScript zone (commits going back to Tier 1/2 TypeScript modules)
- Light/dark mode + theme system
- Manual Testing zone (20 modules + 100 quizzes)
- Login narrator voice-over

### Oct 2025
- SQL Sorcery zone (Beginner – 8 modules)
- Holographic shimmer + animations on zone cards
- RPG-style zone progress map
- Auth: email verification flow + signup validation
- Auth: guest mode warning modal
- Parchment warm light mode
- AI for QA zone — Beginner (13), Intermediate (14), Expert (13)
- Playwright zone — Beginner, Intermediate, Expert
- AuthPage: keep spinner active until user fully loaded
- AuthPage: eliminate Welcome page flash on logout

### Recent (this session and previous)
- **`29e6629` fix(progress)** — compute zone % from `completedLevels` count instead of stored cumulative value (the zone progress was showing stale/wrong percentages).
- **`0beb2ab` fix(auth)** — disable AuthPage input fields while login/signup is in progress.
- **`387e01b` feat(sidebar)** — flush ZoneView sidebar to viewport left edge with bigger fonts.
- **`5e32df2` feat(unlock)** — sequential module/tier gating across ALL six zones. Pure functions in `src/utils/unlockRules.ts`. First Beginner module always open; subsequent modules unlock when previous one is in `completedLevels`. Intermediate tier requires Beginner 100%; Expert requires Intermediate 100%. Locked modules are clickable visually (grayed out + dashed border + lock icon + tooltip pointing to prerequisite). Direct URL access to a locked module auto-redirects to the first unlocked one.
- **`4068336` fix(unlock)** — replaced harsh `opacity-50 grayscale` with calmer slate palette on locked tiers. Tier card uses neutral slate background instead of brand color when locked. Glow removed when locked. Tier label, count badge, and progress bar all switch to slate. The lock icon stays only at the module level (status badge), not at the tier label.
- **`82c43de` feat(mobile)** — responsive layout pass.
  - **ZoneView:** hamburger button (top-left, mobile only) opens the module navigator as a slide-in drawer with backdrop. Same `<aside>` element morphs between inline (lg+) and drawer (< lg). Auto-closes when a module is picked.
  - Mode switcher (Library / Arena) collapses to icon-only below sm.
  - Back button collapses to icon-only below sm.
  - Lesson body padding scales `p-4 sm:p-6 lg:p-8`.
  - Step indicator (Learn → Boss Fight → Complete) labels truncate gracefully on narrow widths.
  - Lock toast (bottom-center) shows on tap when a locked module is touched — replaces hover-only tooltip on touch devices.
  - **HubMap:** nav title shortens to "QA Quest" on phones; welcome text hidden below md; left rail (player card, level progress) hidden below lg (info still in avatar dropdown).
  - **Realm Map:** wrapped in horizontally-scrollable container with 700px min-width so the constellation nodes don't overlap on small screens.
  - **Markdown content:** prose h3 size scales 1.25rem → 1.5rem → 1.75rem. Code blocks and tables get `overflow-x: auto`. Inline code wraps via `word-break`.
- **`41f5583` feat(rank)** — rank progression UI + Daybreak light mode pass.
  - **Rank system:** 8 ranks with flavor titles ("Professional Button Clicker" → "The Unkillable QA"). Rank chip on navbar (mobile) and sidebar (desktop) opens a full Rank Ladder modal. `RankUpWatcher` mounts globally and fires a celebration modal on rank-up regardless of route; has hydration/logout guard to prevent false fires on login.
  - **XP levels:** Lv.1–7 use fixed thresholds (stable across content additions). Lv.8 is auto-anchored to `getTotalEarnableXp()` and also dual-gated: requires both the XP threshold AND 100% module completion.
  - **Sidebar restructure:** slimmed player card to identity only (avatar + name), bigger rank chip with gold `Lv.N` badge, compact Total XP stat tile.
  - **Daybreak light mode:** replaced parchment/cream palette with lavender mist + frosted-white surfaces. Body text shifts from warm stone to cool slate. Prose H3 headings become violet-600 instead of amber-800. Light mode now harmonises with the cosmic-neon dark mode.
  - New components: `RankLadderModal.tsx`, `RankUpModal.tsx`, `RankUpWatcher.tsx`.
- **`e9be443` fix(theme)** — theme no longer syncs to Firestore; stays device-local. Previously, logging in would overwrite the current device's theme with whatever was last stored on the server. Theme is now excluded from `syncToFirestore` and `hydrateFromFirestore`. `UserProgress.theme` made optional so legacy Firestore docs with it written are silently ignored. Each device keeps its own theme preference independently via localStorage/Zustand persist.
- **`b5f258f` feat(manual)** — enrich Manual Testing Beginner tier with 7 new modules + migration-grace unlock.
- **`a483105` feat(manual)** — enrich Manual Testing Intermediate tier with 10 new modules.
- **`a595274` feat(manual)** — enrich Manual Testing Expert tier with 10 new modules.

### May 8–9, 2026 (this session block)

#### Bug fixes & infra
- **`71ed08d` / `66333cb` fix(sql)** — escape raw backticks in Expert SQL module template literals (Vite parse error). The pattern: any inline backtick inside a `lessonMarkdown: \`...\`` template literal MUST be escaped as `\\\``. Three locations were caught by Vite at run time. After this, a `Grep` for `^[^`\\\\]*\`[^\`]*\`[^\`]*$` in `analogies.ts` should return no matches — that's the canonical scan to rule out unescaped pairs after content edits.
- **`11bf5ff` fix(sync)** — **CRITICAL data-loss bug fix.** The previous `SyncToCloud` effect in `App.tsx` fired an immediate `syncToFirestore(uid)` on login. On a fresh browser (empty localStorage), this race could write `{xp:0, completedLevels:[]}` to Firestore *before* the Firestore read returned the user's real progress, wiping it. Fix: added `hydrated: boolean` flag to `useAuthStore`, set to `true` only after a confirmed Firestore read (existing progress loaded OR confirmed no-doc). `SyncToCloud` now gates on `hydrated`. Removed the "fire once immediately" line that was the actual destroyer. On Firestore read error, `hydrated` stays `false` — better to lose new in-session progress than to nuke the cloud copy. Files: `src/App.tsx`, `src/store/useAuthStore.ts`. The user confirmed their personal-laptop progress was intact (Firestore had it); the office laptop showed empty due to a separate corporate-network blocking issue, not this bug — but the bug was real and affected first-time multi-device logins.
- **`100b8dd` feat(ui)** — global Footer component with `© 2026 QA Quest · Built for testers who break things on purpose.` and three modal links: Privacy, Terms, Contact (`mailto:connect_qaquest@gmail.com`). New file `src/components/Footer.tsx`. Wrapped `<Routes>` in a flexbox so footer sticks to viewport bottom on short pages and scrolls naturally on long ones. Renders on every route including `/login`. Brand will become a domain name once the user buys one — see Section 18.

#### Content enrichment — SQL Sorcery
- **`e5b9b16`** (rough — see git log for exact hash) — SQL Beginner enrichment: 3 new modules (`sql-foreign-keys`, `sql-constraints`, `sql-like-wildcards`).
- **`ec...` / similar** — SQL Intermediate enrichment: 2 new (`sql-delete-truncate-drop`, `sql-insert-advanced`) + 5 enrichments to existing modules.
- **`01cc696`** feat(sql) — SQL Expert enrichment: 2 new (`sql-error-handling`, `sql-pivot-reporting`) + 4 enrichments to existing modules. SQL zone module count: 22 → 29.

#### Content enrichment — API Testing (3-phase)
- **`bdc67e9` feat(api)** — Phase 1 (Beginner): 3 new modules (`api-rest-vs-soap-vs-graphql`, `api-curl-basics`, `api-versioning-basics`) + 5 enrichments (HEAD/OPTIONS/idempotency, 429/502/503/504, path/query/body comparison, nested JSON+escaping, Postman workspaces/collections/imports).
- **`bab252c` feat(api)** — Phase 2 (Intermediate): 5 new modules (`api-error-handling`, `api-rate-limiting-throttling`, `api-pagination-filtering-sorting`, `api-file-upload-download`, `api-webhooks-callbacks`) + 2 enrichments (OAuth flows + refresh tokens + HMAC + mTLS in `api-auth-types`; WireMock/Mockoon/MSW + advanced stubbing in `api-mock-servers`).
- **`2441381` feat(api)** — Phase 3 (Expert): 4 new modules (`api-test-data-strategies`, `api-graphql-testing`, `api-load-testing-tools`, `api-monitoring-observability`) + 4 enrichments (data-driven tests + reporting in automation; full OWASP API Top 10 walkthrough in security; perf test patterns in performance; Newman/secrets/env-gates in ci-cd). API zone module count: 19 → 31.

#### Content enrichment — Playwright
- **`2d5bbf6` feat(playwright)** — 4 new modules + 2 enrichments. New: `pw-mobile-device-emulation` (touch events, geolocation, network throttling), `pw-accessibility-testing` (`@axe-core/playwright`, WCAG levels, `toMatchAriaSnapshot`), `pw-performance-web-vitals` (LCP/INP/CLS, Lighthouse, performance budgets), `pw-bdd-cucumber-integration` (when BDD pays off, World object, hooks, anti-patterns). Enrichments: tag-based filtering in `pw-test-organisation`, UI Mode + Debug Mode in `pw-running-tests`. Playwright zone module count: 25 → 29.

#### Content enrichment — TypeScript
- **`ad17ad4` feat(typescript)** — 4 new modules covering modern TS gaps. New: `ts-async-promises` (Beginner; `Promise<T>`, async/await rules, `Promise.all/allSettled/race`, retry+timeout patterns), `ts-never-unknown` (Intermediate; the "top" and "bottom" types, exhaustiveness check), `ts-narrowing-exhaustive` (Intermediate; control-flow narrowing, discriminated-union switches, `asserts x is T`), `ts-satisfies-operator` (Intermediate; the modern alternative to `as`). TypeScript zone module count: 32 → 36.

All commits are pushed and live on production via Vercel.

---

## 9. Active Feature Areas (current state)

### Sequential Module/Tier Unlock
**Status: Shipped.** All zones are gated. The unlock rule is purely derived from `completedLevels` — no new persistence layer. To turn it off for a zone: remove `progressiveUnlock: true` from its zone meta. To turn it off globally: remove the flag from all 6 zones.

### Mobile Responsiveness
**Status: Shipped.** Tested breakpoints: 360px, 414px, 768px, 1024px+. Desktop (lg+) view unchanged.

### Locked Tier Visibility
**Status: Shipped.** Final design: slate-palette card (neutral, no glow) with lock icon at module level only. Module rows in a locked tier still show their numbered badges and titles in muted slate.

### Auth (email + Google + guest)
**Status: Shipped & stable.** Full flow including email verification, password reset, guest warning modal.

### Rank Progression System
**Status: Shipped.** 8 ranks with flavor titles, XP thresholds, Rank Ladder modal, `RankUpWatcher` global component. Lv.8 dual-gated (XP + 100% completion). Theme: `RankLadderModal.tsx`, `RankUpModal.tsx`, `RankUpWatcher.tsx`.

### Daybreak Light Mode
**Status: Shipped.** Lavender mist + frosted-white surfaces. Replaces the old parchment/cream palette. Harmonises with cosmic-neon dark mode.

### Theme Device-Local
**Status: Shipped.** Theme is no longer written to or read from Firestore. Each device keeps its theme in localStorage independently.

### Manual Testing Content Enrichment
**Status: Shipped.** Manual Testing zone expanded to 47 modules total: 15 Beginner, 16 Intermediate, 16 Expert.

---

## 10. Pending / Deferred Work

### "Progressive Lesson" — section-level unlock inside a module
**Status: Plan written, NOT implemented.** The user reviewed two iterations of a generic plan and ultimately said: *"I don't want to proceed with the progressive learning for now."*

**If revived later:** the agreed design was data-driven — a `src/data/sectionQuestions.ts` registry keyed by module id, with three question types (true-false, card-pick, order-rank). The orchestrator splits markdown on `### ` and gates the Boss Fight until every section's question is answered. Pilot was to be Manual Testing › Beginner › "What is Software Testing".

The full plan is in the conversation transcript — not in code. Search for "Generic Progressive Learning Plan" if you need to resurrect it.

### Untracked junk in main project
The repository root has many untracked utility files left over from one-off content authoring scripts:
- `*.cjs` — Node scripts used to splice content into `analogies.ts` and `quizzes.ts`
- `*.txt` — content snippets staged for splicing
- `pw_*`, `ts_*`, `splice_*`, `fix_*` prefixes
- `AI_for_QA_Plan.md`, `QA_Quest_Tracker.md`, `CLAUDE.md`

**The user has been warned about these but hasn't decided whether to .gitignore or delete them.** Don't add them to commits without explicit approval. Don't clean them up unilaterally.

### Mobile QuizEngine polish
The mobile pass kept the existing QuizEngine layout. If quiz options break on narrow widths, that's a follow-up — not a known issue at present.

---

## 11. User Working Style — IMPORTANT

The user has consistent expectations from prior sessions. Memorize these:

| Rule | Meaning |
|------|---------|
| **Plan first, then confirm, then implement** | When asked for a feature, write a detailed plan and wait for "go ahead" / "implement" before editing code. |
| **Never push without explicit instruction** | Even for trivial fixes. The user always says "commit and push" when ready. Until then, work stays local. |
| **Respect "DON'T MAKE CHANGES UNLESS I CONFIRM"** | The user uses this phrase often. Honor it strictly — give plan/answer only, no edits. |
| **Token efficiency** | Be concise. Long preambles annoy. Status updates should be 1–2 sentences. |
| **Verify before claiming done** | Run `npx tsc --noEmit` and (if applicable) `npx vite build` before declaring success. |
| **Test locally before push** | The user runs `npm run dev` from the main project root themselves and verifies the changes visually before approving a push. |
| **No documentation files unless asked** | Don't create README/MD files spontaneously. The user will ask if they want documentation. |

---

## 12. Common Gotchas (from real incidents this session)

### Gotcha 1: Worktree vs Main Project
Claude Code may operate in a **git worktree** at `C:\AITestingMaster\AI-Projects\knowledgehub\.claude\worktrees\<random-name>\`. This worktree is on a **different (often older) branch** than `main`.

- **All file edits you make** in a Claude Code session land in the main project (`C:\AITestingMaster\AI-Projects\knowledgehub`), not the worktree, *unless* you explicitly write into the worktree path.
- **The Vite preview server spawned by Claude's `preview_start` tool runs from the worktree** — so it serves the worktree's branch, not your edits to main. **Skip preview verification when changes are in main.**
- **The user must run `npm run dev` themselves** from the main project root to see the actual edits.
- Communicating this clearly to the user is critical — they once thought edits broke the auth page, when really they were comparing main-project code to a worktree-branch dev server.

### Gotcha 2: The Vite cache
If the dev server seems to serve old code, kill all `node.exe` processes and `rm -rf node_modules/.vite` to clear Vite's optimizer cache.

### Gotcha 3: localStorage state masquerading as bugs
A cached `isGuest: true` in localStorage will skip `/login` and land users on the home page guest panel. To test the auth page, clear `quest-storage` localStorage AND `firebaseLocalStorageDb` IndexedDB. Easiest: DevTools → Application → "Clear site data".

### Gotcha 4: Tailwind v4 syntax
This project uses Tailwind v4 (not v3). Custom theme tokens are declared via `@theme { … }` in `index.css`, not in `tailwind.config.js`. Don't try to add a `tailwind.config.js`.

### Gotcha 5: `ZONE_TIERS` keys vs `ZONES[].id`
Both must match. The keys in `ZONE_TIERS` ARE the zone ids: `manual`, `sql`, `api`, `typescript`, `playwright`, `ai-qa`. Don't confuse `manual` with `manual-testing` — only the former is correct.

### Gotcha 6: Module ids must be globally unique
Even though they live inside zone-scoped tiers, the unlock-key format `${zoneId}::${moduleId}` makes them effectively scoped. Still, by convention each zone prefixes its module ids (e.g., `sql-select`, `pw-locators`, `ts-generics`) — except Manual Testing which uses bare names like `what-is-testing`.

### Gotcha 7: `analogies.ts` template literal escaping
This file uses backtick template literals containing example YAML/code that includes `${...}`. Any GitHub Actions snippet must escape `${{ ... }}` as `\${{ ... }}` or it will be parsed as JS template expression — TypeScript will fail. Watch for this when editing.

### Gotcha 8: Always trust the code over any doc for module counts
CLAUDE.md zone counts have historically drifted. As of `ad17ad4` (latest main, 2026-05-09):
- Manual Testing: 15 Beginner + 16 Intermediate + 16 Expert = **47 modules**
- Playwright: 8 Beginner + 11 Intermediate + 10 Expert = **29 modules**
- AI for QA: 13 Beginner + 14 Intermediate + 13 Expert = **40 modules**
- SQL Sorcery: 11 Beginner + 10 Intermediate + 8 Expert = **29 modules**
- API Testing: 11 Beginner + 11 Intermediate + 9 Expert = **31 modules**
- TypeScript: 14 Beginner + 14 Intermediate + 8 Expert = **36 modules**
- **Grand total: 212 modules**

When any doc and the actual code disagree, **trust the code**. Always grep `zones.tsx` (`moduleIds` arrays) for authoritative counts before quoting numbers.

### Gotcha 11: Template-literal closing backtick errors
When inserting a new module into `analogies.ts`, the closing `\`` of `lessonMarkdown` must be a **raw backtick** (`` ` ``), not an escaped one (`\\\``). It's an easy slip when ending a content block — and Vite parse-errors loudly when wrong. The canonical scan after content edits:
```bash
grep -nE "^[^\`\\\\]*\`[^\`]*\`[^\`]*$" src/data/analogies.ts
```
Should return zero matches if every inline backtick is escaped and every fence is `\\\`\\\`\\\``.

### Gotcha 9: Sanity-check protocol (from CLAUDE.md)
Before claiming anything about content completeness or module counts:
1. Pick a module visible in the live app (e.g. `sql-stored-procedures`)
2. Grep for it in `src/data/quizzes.ts` and `src/data/analogies.ts`
3. If not found, check `git status` and `git log HEAD..origin/main` — you may be on a stale branch.

### Gotcha 10: `npm run build` includes type-check
`npm run build` runs `tsc -b && vite build`. So `npm run build` doubles as a full type-check across project references. `npx tsc --noEmit` is faster for quick checks but build is the authoritative validation.

---

## 13. New Profile / New Agent — Onboarding Steps

When you switch to a different profile and start a new Claude Code session:

### Step 1 — Provide this file + CLAUDE.md
Hand the new agent BOTH `PROJECT_HANDOFF.md` and `CLAUDE.md` at the project root. Tell it:
> "Read `PROJECT_HANDOFF.md` first, then `CLAUDE.md`, before doing anything. Both live at `C:\AITestingMaster\AI-Projects\knowledgehub\`. Follow the user working style rules in section 11 of the handoff. Note that the zone-count table in `CLAUDE.md` is outdated — section 12 (Gotcha 8) of the handoff has the corrected counts."

### Step 2 — Verify access
The new profile's GitHub credentials must allow push access to `https://github.com/sagar19101988/knowledgehub`. Confirm with `gh auth status` or `git push --dry-run origin main`.

### Step 3 — Verify `.env.local` exists
The new agent CAN'T see env files normally, but the new profile's filesystem must have `C:\AITestingMaster\AI-Projects\knowledgehub\.env.local` with all six `VITE_FIREBASE_*` keys. If the new machine doesn't have this file:
```bash
cd C:\AITestingMaster\AI-Projects\knowledgehub
npx vercel link               # one-time link to the project
npx vercel env pull .env.local
```
Without this, local dev will silently break Firebase auth.

### Step 4 — Pull latest
```bash
cd C:\AITestingMaster\AI-Projects\knowledgehub
git pull origin main
```
This ensures the new session starts from the production state.

### Step 5 — Inform the agent of branching strategy
> "Work directly on `main`. Each user-confirmed change set becomes its own commit. Never branch unless I explicitly ask you to."

### Step 6 — Tell the agent how dev runs
> "I run `npm run dev` myself from `C:\AITestingMaster\AI-Projects\knowledgehub`. Don't try to start the dev server yourself — the harness will spawn it from a worktree on an old branch and confuse us both. Skip preview verification."

### Step 7 — Set expectations
> "Plan-first, confirm-then-implement. Never commit/push unless I say 'commit and push'. Be concise."

### Step 8 (optional) — Show the agent the recent work summary
Section 8 of this document is the work log. The new agent doesn't need to read every line of every commit but should skim it to understand what's been touched recently.

---

## 14. Quick Reference Commands

```bash
# Run dev (do this in your own terminal)
npm run dev

# Type-check
npx tsc --noEmit

# Production build (rarely needed locally; Vercel does this)
npm run build

# See recent commits
git log --oneline -10

# Stage specific files
git add src/components/ZoneView.tsx src/data/zones.tsx

# Commit (always include Co-Authored-By for Claude work)
git commit -m "feat(scope): subject line

Body explaining the why.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

# Push
git push origin main

# Pull from remote
git pull origin main
```

---

## 15. Known State at Handoff (2026-05-09)

- **Branch:** `main`
- **Latest commit:** `ad17ad4 feat(typescript): 4 new modules covering modern TS gaps`
- **Working tree:** clean (only untracked utility scripts left over from earlier content authoring; safely ignored)
- **Remote:** in sync with `origin/main`
- **Vercel:** auto-deployed from latest commit
- **TypeScript:** clean (`npx tsc --noEmit` passes)
- **Module totals:** Manual 47 · Playwright 29 · AI for QA 40 · SQL 29 · API 31 · TypeScript 36 = **212 modules**
- **No uncommitted user-facing changes**

### Files specifically worth knowing about for the new agent
- **`Gauntlet_Plan.md`** — full design for the paused final-exam feature. Read before resuming Gauntlet work.
- **`AI_for_QA_Plan.md`** / **`QA_Quest_Tracker.md`** — older user-authored reference docs.
- **`src/components/Footer.tsx`** — global footer (Privacy/Terms/Contact modals). Brand string `© 2026 QA Quest` will need updating once a domain/brand is finalised.
- **`src/store/useAuthStore.ts`** — added `hydrated: boolean` flag (May 8). Critical for the data-loss fix. Don't remove.
- **`src/App.tsx`** `SyncToCloud` — gated on `hydrated`. Removing the gate reintroduces the data-loss race condition.

---

## 16. Things That Should NOT Be Done Without Asking

Repeat after me:

1. ❌ Don't `git push` without the user saying "push" or "commit and push".
2. ❌ Don't `git push --force` ever.
3. ❌ Don't run destructive git commands (`reset --hard`, `clean -f`, `branch -D`) without confirmation.
4. ❌ Don't add untracked utility files to commits.
5. ❌ Don't change auth, Firebase config, or anything in `lib/firebase.ts` without asking.
6. ❌ Don't edit `analogies.ts` or `quizzes.ts` content without confirming the scope (these are content files, not code).
7. ❌ Don't introduce new dependencies without asking.
8. ❌ Don't create README or docs files unless requested.
9. ❌ Don't start the dev server yourself when the user is testing — they prefer to run it.
10. ❌ Don't claim verification when you skipped it. If preview verification was skipped because of the worktree gotcha, say so explicitly.

---

## 17. Where This File Lives

**Path:** `C:\AITestingMaster\AI-Projects\knowledgehub\PROJECT_HANDOFF.md`  
**Status:** Tracked + committed (since the original handoff). Stays on GitHub for future Claude sessions to read.

---

## 18. Open Ideas & Decisions Pending (read before resuming work)

This section captures ideas that have been **discussed but not implemented**. The new agent should not act on these without the user's explicit confirmation — they're parked for the user's own decision.

### A. The Gauntlet (final-exam feature) — paused
- **Status:** Fully designed. Plan saved at `Gauntlet_Plan.md` (committed alongside this handoff).
- **What it is:** A 100-question final exam per zone, unlocked only after all three tiers (Beginner / Intermediate / Expert) of that zone are complete. Each attempt serves a randomized 30-question subset, time-limited, with a report card at the end. 4 question types (single MCQ, multi-MCQ, true/false, code-MCQ).
- **Why paused:** The user wanted to focus on content enrichment first ("the exam is meaningless without enough modules to test on"). With the recent enrichments, every zone except AI for QA now has substantial coverage — the Gauntlet is now realistically buildable.
- **Six open questions** are pinned at the bottom of `Gauntlet_Plan.md`. Get the user's answers before writing any code.

### B. Custom domain migration (`.com`)
- **Status:** Not yet bought. User wants to move off `knowledgehub-indol.vercel.app` to a real `.com` domain.
- **Brand-name brainstorming done:** The user wants something that fuses the **game theme** with the **QA learning theme**. Top suggestions discussed: `bugforge.com`, `debugdungeon.com`, `qadojo.com`, `bugcodex.com`, `qaquest.com`. User's expressed preference: keep `QA Quest` branding for now, decide on actual domain later.
- **What needs to happen when a domain is bought:**
  1. User purchases (Cloudflare Registrar recommended, ~$10/yr)
  2. Add custom domain in Vercel → project Settings → Domains
  3. Configure DNS at registrar (CNAME to `cname.vercel-dns.com` or A record `76.76.21.21`)
  4. **Update Firebase Console → Authentication → Authorized domains** with the new domain (otherwise Google sign-in breaks silently)
  5. Update `knowledgehub/src/components/Footer.tsx` brand string (`© 2026 QA Quest`)
  6. Update `CLAUDE.md` and this `PROJECT_HANDOFF.md` with new URL

### C. Skipped on purpose (low-priority for now)
These were considered but deliberately skipped — don't propose them again unless the user asks:

- **AI/MCP Playwright integration module** — bleeding-edge May 2026 feature, will likely shift fast. Add later when stable.
- **JSX/React types module in TypeScript zone** — useful but most QAs writing TS for Playwright don't touch JSX.
- **Setting up TypeScript for Jest/Playwright tooling module** — scattered coverage already exists across modules.
- **A11y a deeper dive across other zones** — Manual zone has it, Playwright now has a full module; further coverage isn't critical.
- **AI for QA zone enrichment** — already at 40 modules. The user has not asked for enrichment here yet.

### D. User-flagged future tasks (general)
- Track which utility scripts at the project root (`fix_*.cjs`, `splice_*.cjs`, `pw_*.txt`, `ts_*.txt`) should be `.gitignore`d or deleted. The user is aware but hasn't decided.
- Decide if Footer's contact email (`connect_qaquest@gmail.com`) should later become a contact form or HelpScout-style ticketing.
- Phone number `967519533` was originally given for Contact then replaced with email — the phone number should NOT be reintroduced to the codebase.

---

## 19. Quick Resume Checklist for the New Agent

When the user reopens this project in a fresh Claude Code session, here's the recommended onboarding sequence:

1. **Pull latest:** `git fetch origin && git pull origin main`
2. **Read** `PROJECT_HANDOFF.md` (this file) → `CLAUDE.md` → `Gauntlet_Plan.md`
3. **Confirm** `.env.local` exists with `VITE_FIREBASE_*` keys (if missing: `npx vercel env pull .env.local`)
4. **Verify** typecheck passes: `npx tsc --noEmit`
5. **Read** the user's first message carefully — they will tell you which thread to pick up:
   - "Resume Gauntlet" → read `Gauntlet_Plan.md`, get answers to the six open questions
   - "I bought a domain" → walk through Section 18.B steps
   - "Continue content enrichment" → ask which zone, follow the same pattern used for SQL/API/Playwright/TypeScript (scan → propose plan with insertion points → user confirms → write → typecheck → user says commit)
   - Anything else → plan-first protocol applies (Section 11)

6. **Don't push anything** until the user explicitly says "commit and push." Even trivial fixes wait.

---

*End of handoff document. Welcome aboard.*
