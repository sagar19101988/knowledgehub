# QA Quest — The Knowledge Hub

A gamified QA engineering learning platform built with React, TypeScript, and Tailwind CSS.

## Features

- **6 Learning Zones** — Manual Testing, SQL Sorcery, API Testing, TypeScript, Playwright, AI for QA
- **Tiered Curriculum** — Beginner / Intermediate / Expert modules per zone
- **Boss Fight Quizzes** — Complete a lesson, fight the boss to earn XP
- **XP & Level System** — 8 ranks from *Professional Button Clicker* to *The Unkillable QA*
- **Mastery Badges** — One badge per zone, earned on completion
- **Daily Bounty** — Claim +50 XP once per day
- **Progress Persistence** — All progress saved locally via localStorage (no account needed)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Zustand v5 (persisted) |
| Animation | Framer Motion |
| Build | Vite |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── App.tsx              # All page components & routing
├── index.css            # Global styles & Tailwind config
├── main.tsx             # Entry point
├── components/
│   ├── BadgeToast.tsx   # Badge unlock notification
│   └── QuizEngine.tsx   # Boss fight quiz component
├── data/
│   ├── analogies.ts     # Lesson content for all zones
│   └── quizzes.ts       # Quiz questions for all zones
└── store/
    └── useQuestStore.ts # Zustand global state
```

## Deployment

Deployed on Vercel. The `vercel.json` handles SPA routing (all paths → `index.html`).
