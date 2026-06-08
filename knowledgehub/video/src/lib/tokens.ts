// Brand tokens — kept in sync with knowledgehub/src/components/AuthPage.tsx
// and knowledgehub/src/data/zones.tsx.

export const COLORS = {
  // Backdrops
  bgCosmic:     '#0a0420',
  bgCosmicTop:  '#0b1024',
  bgDark:       '#07050f',
  bgLight:      '#eff4fb',
  inkDark:      '#0f172a',
  inkLight:     '#f1f5f9',
  white:        '#ffffff',
  muted:        '#94a3b8',
  faint:        '#64748b',

  // Brand
  brand:        '#2563eb',   // Pluralsight blue (light mode)
  brandDark:    '#1d4ed8',
  brandSoft:    '#60a5fa',
  fuchsia:      '#d946ef',
  violet:       '#8b5cf6',
  cyan:         '#67e8f9',

  // Status
  emerald:      '#10b981',
  amber:        '#f59e0b',
  rose:         '#f43f5e',
  orange:       '#f97316',

  // Real zone colors (must match src/data/zones.tsx)
  zones: {
    manual:     '#f97316',
    sql:        '#3b82f6',
    api:        '#a855f7',
    typescript: '#0ea5e9',
    playwright: '#10b981',
    'ai-qa':    '#f43f5e',
  },
} as const;

export const FONT = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", system-ui, sans-serif';
export const FONT_SERIF = 'Georgia, "Times New Roman", serif';
export const FONT_MONO  = 'ui-monospace, SFMono-Regular, Menlo, monospace';

// Shot timing constants (frames @ 30fps).
// Source of truth for the 90s composition (v2).
export const FPS = 30;
export const TOTAL = 2700;

// v4: multi-zone journey, 90s. Each feature shot is now preceded by a 1.2s
// full-screen TextBeat (the "story card"), which cuts into a clean UI shot with
// no lower-third pill. 8 beats × 36f = 288f added; the UI shots were trimmed by
// the same total (they no longer hold a caption). Total stays 2700.
export const SHOTS = {
  COLD_OPEN:        { start: 0,    dur: 75  },  // 2.5s
  LOGO:             { start: 75,   dur: 75  },  // 2.5s
  COLOR_SLAM:       { start: 150,  dur: 30  },  // 1.0s — music drop
  BEAT_HERO:        { start: 180,  dur: 54  },  // 1.8s — "Six zones. One quest."
  HERO_HUB:         { start: 234,  dur: 156 },  // 5.2s — Realm Map, all 6 zones lit
  PICK_PATH:        { start: 390,  dur: 150 },  // 5.0s — 6 zone tiles reveal
  BEAT_ZONE:        { start: 540,  dur: 54  },  // 1.8s — "Beginner to expert."
  ZONE_PAGE:        { start: 594,  dur: 117 },  // 3.9s — TypeScript tiers
  BEAT_LESSON:      { start: 711,  dur: 54  },  // 1.8s — "Learn it for real."
  LESSON_MONTAGE:   { start: 765,  dur: 156 },  // 5.2s — Manual / TS / AI
  BEAT_BOSS:        { start: 921,  dur: 54  },  // 1.8s — "Then fight the boss."
  BOSS_FIGHT:       { start: 975,  dur: 180 },  // 6.0s — API + XP→rank-up tail
  BEAT_MASTERY:     { start: 1155, dur: 54  },  // 1.8s — "Prove your mastery."
  MASTERY_TRIAL:    { start: 1209, dur: 174 },  // 5.8s — Playwright
  BEAT_WARROOM:     { start: 1383, dur: 54  },  // 1.8s — "Enter the War Room."
  WAR_ROOM_MONTAGE: { start: 1437, dur: 270 },  // 9.0s — TS Sr / AI Mid / PW Jr
  BEAT_BADGE:       { start: 1707, dur: 54  },  // 1.8s — "Collect every badge."
  BADGE_WALL:       { start: 1761, dur: 108 },  // 3.6s
  BEAT_CERT:        { start: 1869, dur: 54  },  // 1.8s — "Earn the certificate."
  CERT_STACK:       { start: 1923, dur: 72  },  // 2.4s — fan of 3 certs
  ALWAYS_GROWING:   { start: 1995, dur: 210 },  // 7.0s
  STATS_SLAM:       { start: 2205, dur: 240 },  // 8.0s — 4 stats incl. ∞
  CTA:              { start: 2445, dur: 180 },  // 6.0s
  END_CARD:         { start: 2625, dur: 75  },  // 2.5s
} as const;

// Music drop should land here (frame index). Synced to the color slam.
export const MUSIC_DROP_FRAME = 150;

// Set to true after dropping your track at video/src/assets/audio/track.mp3
// (file must literally be named track.mp3 to use this default).
export const HAS_TRACK = true;
export const TRACK_VOLUME = 0.85;

export const URL_TEXT = 'qaquest.vercel.app';
