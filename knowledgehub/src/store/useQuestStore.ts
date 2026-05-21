import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveUserProgress, type UserProgress, type MasteryScore } from '../lib/firebase';

export interface QuestState {
  playerName: string | null;
  xp: number;
  zoneProgress: Record<string, number>;
  unlockedBadges: string[];
  completedLevels: string[];
  lastBountyDate: string | null;
  theme: 'dark' | 'light';
  isGuest: boolean;
  masteryBadges: Record<string, boolean>;
  masteryScores: Record<string, MasteryScore>;

  // Runtime UI flag — queues the rank-up modal so it doesn't fire mid-celebration
  // (e.g. Boss Fight victory waits for the XP float to finish before popping the modal).
  // NOT persisted; resets to false on every load.
  rankUpPaused: boolean;

  // Actions
  setPlayerName: (name: string) => void;
  clearPlayerName: () => void;
  addXp: (amount: number) => void;
  updateZoneProgress: (zoneId: string, progressToAdd: number) => void;
  unlockBadge: (badge: string) => void;
  markLevelComplete: (levelKey: string) => void;
  claimDailyBounty: () => void;
  toggleTheme: () => void;
  enterGuestMode: () => void;
  recordMasteryResult: (zoneId: string, score: number, passed: boolean) => void;
  pauseRankUp: () => void;
  resumeRankUp: () => void;

  // Firebase sync
  hydrateFromFirestore: (progress: UserProgress, displayName: string) => void;
  resetProgress: () => void;
  syncToFirestore: (uid: string) => void;
}

const INITIAL_ZONE_PROGRESS = {
  manual: 0, sql: 0, api: 0, typescript: 0, playwright: 0, 'ai-qa': 0,
};

// Debounce helper — saves at most once every 2s
let saveTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedSave(uid: string, progress: UserProgress) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveUserProgress(uid, progress).catch((err) => {
      console.error('[debouncedSave] Firestore write failed:', err);
    });
  }, 2000);
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      playerName: null,
      xp: 0,
      theme: 'dark' as const,
      zoneProgress: { ...INITIAL_ZONE_PROGRESS },
      unlockedBadges: [],
      completedLevels: [],
      lastBountyDate: null,
      isGuest: false,
      masteryBadges: {},
      masteryScores: {},
      rankUpPaused: false,

      setPlayerName: (name) => set({ playerName: name.trim() }),
      clearPlayerName: () => set({ playerName: null }),

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

      updateZoneProgress: (zoneId, progressToAdd) => set((state) => {
        const current = state.zoneProgress[zoneId] || 0;
        const next = Math.min(current + progressToAdd, 100);
        return { zoneProgress: { ...state.zoneProgress, [zoneId]: next } };
      }),

      unlockBadge: (badge) => set((state) => {
        if (!state.unlockedBadges.includes(badge)) {
          return { unlockedBadges: [...state.unlockedBadges, badge] };
        }
        return state;
      }),

      markLevelComplete: (levelKey) => set((state) => {
        if (!state.completedLevels.includes(levelKey)) {
          return { completedLevels: [...state.completedLevels, levelKey] };
        }
        return state;
      }),

      claimDailyBounty: () => set((state) => {
        const today = new Date().toISOString().slice(0, 10);
        if (state.lastBountyDate === today) return state;
        return { xp: state.xp + 50, lastBountyDate: today };
      }),

      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark',
      })),

      enterGuestMode: () => set({ isGuest: true, playerName: 'Guest' }),

      pauseRankUp:  () => set({ rankUpPaused: true }),
      resumeRankUp: () => set({ rankUpPaused: false }),

      recordMasteryResult: (zoneId, score, passed) => set((state) => {
        const existing = state.masteryScores[zoneId];
        const now = new Date().toISOString();
        const updatedScore: MasteryScore = {
          bestScore: existing ? Math.max(existing.bestScore, score) : score,
          attempts: (existing?.attempts ?? 0) + 1,
          lastAttemptAt: now,
          // Preserve the original first-pass date once set; otherwise record it
          // the first time the user passes (used by the certificate).
          firstPassedAt: existing?.firstPassedAt ?? (passed ? now : undefined),
        };
        const earnBadge = passed && !state.masteryBadges[zoneId];
        return {
          masteryScores: { ...state.masteryScores, [zoneId]: updatedScore },
          ...(earnBadge ? { masteryBadges: { ...state.masteryBadges, [zoneId]: true } } : {}),
        };
      }),

      // ── Called by useAuthStore when user logs in ────────────
      hydrateFromFirestore: (progress, displayName) => {
        // Theme is intentionally NOT hydrated — it's a device-local preference
        // (your phone and laptop can have different themes). Login should not
        // override the theme you were just using.
        set({
          playerName:     displayName,
          xp:             progress.xp,
          zoneProgress:   { ...INITIAL_ZONE_PROGRESS, ...progress.zoneProgress },
          unlockedBadges: progress.unlockedBadges,
          completedLevels:progress.completedLevels,
          lastBountyDate: progress.lastBountyDate,
          isGuest:        false,
          masteryBadges:  progress.masteryBadges  ?? {},
          masteryScores:  progress.masteryScores  ?? {},
        });
      },

      // ── Called on logout to wipe local state ───────────────
      resetProgress: () => {
        // Cancel any pending save BEFORE wiping
        if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
        set({
          playerName:     null,
          xp:             0,
          zoneProgress:   { ...INITIAL_ZONE_PROGRESS },
          unlockedBadges: [],
          completedLevels:[],
          lastBountyDate: null,
          isGuest:        false,
          masteryBadges:  {},
          masteryScores:  {},
        });
        // CRITICAL: the set() above triggers SyncToCloud's subscription,
        // which calls syncToFirestore → schedules a NEW debounced save
        // with the now-zeroed state. We must cancel that too, otherwise
        // it fires 2s later and overwrites Firestore with empty progress.
        if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
      },

      // ── Debounced Firestore save ────────────────────────────
      syncToFirestore: (uid) => {
        // Theme is intentionally NOT synced — it's a device-local preference.
        const s = get();
        debouncedSave(uid, {
          xp:             s.xp,
          zoneProgress:   s.zoneProgress,
          unlockedBadges: s.unlockedBadges,
          completedLevels:s.completedLevels,
          lastBountyDate: s.lastBountyDate,
          masteryBadges:  s.masteryBadges,
          masteryScores:  s.masteryScores,
        });
      },
    }),
    {
      name: 'qa-quest-storage',
      partialize: (state) => ({
        xp:             state.xp,
        zoneProgress:   state.zoneProgress,
        unlockedBadges: state.unlockedBadges,
        completedLevels:state.completedLevels,
        lastBountyDate: state.lastBountyDate,
        theme:          state.theme,
        isGuest:        state.isGuest,
        masteryBadges:  state.masteryBadges,
        masteryScores:  state.masteryScores,
        // playerName intentionally excluded — always comes from Firebase auth or enterGuestMode
      }),
      // After rehydrating from localStorage, restore the guest display name.
      // (playerName isn't persisted, so a refreshed guest session would otherwise
      // come back with playerName=null even though isGuest=true.)
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        if (state.isGuest && !state.playerName) {
          state.playerName = 'Guest';
        }
      },
    }
  )
);
