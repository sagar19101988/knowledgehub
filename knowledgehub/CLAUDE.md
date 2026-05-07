# KnowledgeHub — CLAUDE.md

> **Read first:** `PROJECT_HANDOFF.md` (same folder). It contains the full project history, current state, gotchas, user working-style rules, and onboarding steps for new Claude sessions. The handoff doc supersedes anything stale in this file (notably the zone-count table below — it's outdated).

## Repo Layout — Monorepo

This project lives inside a **monorepo** at `C:\AITestingMaster\AI-Projects\` containing multiple sibling projects:

```
C:\AITestingMaster\AI-Projects\         ← .git lives here (repo root)
├── Doc2MDConverter/
├── JobAssistantBuddy/
├── SprintAnalyzerAgent/
├── TestOrchestrator/
├── knowledgehub/                       ← this project
│   ├── src/
│   ├── package.json
│   └── ...
├── sprintlens/
└── sprintpulse/
```

When using `git show <branch>:<path>`, paths must be from the repo root, e.g.:
```bash
git show origin/main:knowledgehub/src/data/quizzes.ts
```

## Source of Truth

**Always run `git fetch origin` before any codebase analysis.**

The deployed app is built from `origin/main`. If local `main` ever drifts from `origin/main`,
trust the remote — it is what users see.

```bash
git fetch origin
git log --oneline HEAD..origin/main   # see what you're missing
```

If local has diverged with unrelated histories (as happened in May 2026), the recovery is:
```bash
git branch main-old-backup main           # preserve local commits
git checkout main && git reset --hard origin/main
```

## Deployment

- **Live URL:** https://knowledgehub-indol.vercel.app
- **Deployed from:** `origin/main`, `knowledgehub/` subdirectory
- **Platform:** Vercel (SPA routing via `knowledgehub/vercel.json`)

## Project Overview

Gamified QA learning platform ("QA Quest"). React 19 + TypeScript + Tailwind v4 + Zustand + Framer Motion.

Key data files (all content lives here):
- `knowledgehub/src/data/analogies.ts` — lesson content (lessonMarkdown per module)
- `knowledgehub/src/data/quizzes.ts` — quiz questions per module
- `knowledgehub/src/store/useQuestStore.ts` — Zustand state (XP, progress, badges, localStorage)

## Zone Content Status (May 2026, origin/main)

| Zone | Modules | Breakdown | Status |
|------|---------|-----------|--------|
| Manual Testing | 47 | 15 Beginner, 16 Intermediate, 16 Expert | ✅ Complete |
| SQL Sorcery | 22 | 8 Beginner, 8 Intermediate, 6 Expert | ✅ Complete |
| API Testing | 19 | 8 Beginner, 6 Intermediate, 5 Expert | ✅ Complete |
| TypeScript | 17 | ✅ Complete |
| Playwright | 25 | 8 Beginner, 9 Intermediate, 8 Expert | ✅ Complete |
| AI for QA | 40 | 13 Beginner, 14 Intermediate, 13 Expert | ✅ Complete |

**Note:** All zones are now substantially populated. TypeScript questions are 3/module vs 5/module for other zones — could be upgraded for consistency.

## Sanity Check Protocol

Before reporting on content completeness, do a quick cross-check:
1. Pick a module visible in the live app (e.g. `sql-stored-procedures`)
2. Grep for it in `knowledgehub/src/data/quizzes.ts`
3. If not found → check `git status` and `git log HEAD..origin/main`. You may be on a stale branch.

## Tech Stack

- React 19, TypeScript, Tailwind CSS v4
- Zustand (persisted to localStorage)
- Framer Motion (animations)
- React Router v7
- react-markdown + remark-gfm (lesson rendering)
- react-syntax-highlighter/Prism (code blocks)
- canvas-confetti (quiz completion)
- Vite + Vercel
