# The Gauntlet — Final Exam Feature Plan

> **Status:** Paused. User wants to resume after content enrichment work.
> **Last updated:** 2026-05-08

A 100-question final exam ("Gauntlet") per zone, unlocked only after all
Beginner / Intermediate / Expert modules in that zone are complete.
Each attempt serves a randomized 30-question subset, time-limited,
with a report card at the end.

---

## 1. Naming

Final pick pending user confirmation. Front-runner: **The Gauntlet**
(reusable per zone — "SQL Gauntlet", "Manual Gauntlet", etc.).

Alternates considered: Mastery Trial, Boss Battle, Grandmaster Trial,
Final Quest.

## 2. UI placement

- **Inside `ZoneView`** — appears as a 4th tile after the three tier
  cards (Beginner / Intermediate / Expert).
- **Locked state:** greyed-out card, padlock icon, progress bar showing
  "X / Y modules remaining". Tooltip explains unlock condition.
- **Unlocked state:** glowing card in the zone's accent color,
  "⚔️ Enter the Gauntlet" CTA, shows last attempt's score.
- **Exam screen:** full-screen route `/zone/:id/gauntlet` — no header,
  just questions + timer.

## 3. Lock logic

A zone's Gauntlet unlocks when **every module ID in
`ZONE_TIERS[zoneId]` (across all three tiers) is in
`completedLevels`**. New helper: `isZoneFullyComplete(zoneId)`.

## 4. Question bank — structure

New file `src/data/questionBank.ts` (separate from `quizzes.ts` to
keep both manageable).

```ts
interface GauntletQuestion {
  id: string;                     // 'sql-qb-001'
  type: 'mcq' | 'multi' | 'tf' | 'code-mcq';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  question: string;
  code?: string;                  // optional syntax-highlighted code block
  options: string[];              // for mcq/multi/code-mcq
  correctAnswers: number[];       // indices — array allows multi-select
  explanation: string;            // shown in report card
}
```

100 questions per zone × 6 zones = **600 questions total**.
Seed each zone with ~30-40 in v1, grow incrementally.

**Target mix per zone:**
- 50% single MCQ
- 20% multi-select
- 20% True/False
- 10% code-MCQ ("what does this output?")

## 5. Question types

| Type | UX |
|------|-----|
| `mcq` — 1 correct of 4 | Radio buttons |
| `multi` — 2-3 correct of 4-5 | Checkboxes, "Select all that apply" |
| `tf` — true/false | Two big buttons |
| `code-mcq` — code block + 4 options | MCQ with Prism-highlighted code |

**Skipped for v1** (complexity vs value): drag-to-order, fill-in-blank,
match-the-following. Can add later.

## 6. Per-attempt selection algorithm

Each new attempt:
1. Shuffle 100-question pool with fresh seed.
2. Pick **30 questions** ensuring:
   - ≥ 5 from each difficulty tier
   - ≥ 3 of each question type
   - No repeats within attempt
3. Different seed → different mix. Identical attempts effectively
   impossible.

Optional later: track recently-seen Qs per user, bias toward unseen.

## 7. Timer

**Recommendation: total budget** — 30 questions × 60s = 30 min
countdown. User can spend longer on hard, faster on easy. ISTQB-style.
Big countdown at top of screen. Auto-submit at 0.

Alternate: strict per-question 60s with auto-advance. More stressful;
not recommended for v1.

## 8. Report card

- **Headline:** score (e.g., "24 / 30 — 80%") + pass/fail banner.
  **Pass threshold: 70%**.
- **Stats:** time taken, accuracy by difficulty, accuracy by question
  type.
- **Per-question breakdown** (collapsible): question, your answer
  (red/green), correct answer, explanation.
- **CTAs:** Retake Gauntlet · Back to Zone.

## 9. Rewards & persistence

- **First pass:** unique Gauntlet badge per zone (6 total badges).
- **Pass:** 500 XP one-time per zone.
- **Best score:** stored per zone, syncs to Firestore.
- **Attempt count:** tracked.

New `useQuestStore` field:
```ts
gauntletScores: Record<string, {
  bestScore: number;
  attempts: number;
  lastAttemptAt: string;
}>;
```

Don't forget to add to `partialize` (localStorage persist) and
`UserProgress` shape (Firestore sync).

## 10. Anti-cheating (light)

- Warn before navigation away mid-exam.
- Detect tab-switch / window-blur → warning toast (no auto-fail).
- Don't expose `correctAnswers` to DOM until submit.

True anti-cheat needs a backend. Light deterrents are enough for a
learning app.

## 11. Build phases

| Phase | Scope | Effort |
|-------|-------|--------|
| 1. Plumbing | Data shape, lock helper, store fields, route, locked-tile UI | small |
| 2. Engine | All 4 question types, navigation, timer, submit flow | medium |
| 3. Report card | Score screen, breakdown, score persistence | small |
| 4. Rewards | Badges, XP, completion UI in zone | small |
| 5. Content | Author 100 Qs per zone (start with one zone, grow) | **largest** |

Phases 1–4 can ship first with ~30 Qs per zone seed; gauntlet is
functional. Phase 5 is ongoing content work, similar to lessons.

---

## Open questions for user (when resuming)

1. Confirm name — `The Gauntlet` or alternative?
2. Timer style — total budget (recommended) or strict per-question?
3. Pass threshold — 70% OK?
4. Question count — 30 per attempt, or 25?
5. Ship phased (engine + 30 Qs each, grow content) or wait for full
   100-Q content first?
6. Which zone gets content first — SQL? Manual?
