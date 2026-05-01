import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveUserProgress, type UserProgress } from '../lib/firebase';

export interface QuestState {
  playerName: string | null;
  xp: number;
  zoneProgress: Record<string, number>;
  unlockedBadges: string[];
  completedLevels: string[];
  lastBountyDate: string | null;
  theme: 'dark' | 'light';

  // Actions
  setPlayerName: (name: string) => void;
  clearPlayerName: () => void;
  addXp: (amount: number) => void;
  updateZoneProgress: (zoneId: string, progressToAdd: number) => void;
  unlockBadge: (badge: string) => void;
  markLevelComplete: (levelKey: string) => void;
  claimDailyBounty: () => void;
  toggleTheme: () => void;

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
    saveUserProgress(uid, progress).catch(() => {/* silent — offline */});
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

      // ── Called by useAuthStore when user logs in ────────────
      hydrateFromFirestore: (progress, displayName) => {
        set({
          playerName:     displayName,
          xp:             progress.xp,
          zoneProgress:   { ...INITIAL_ZONE_PROGRESS, ...progress.zoneProgress },
          unlockedBadges: progress.unlockedBadges,
          completedLevels:progress.completedLevels,
          lastBountyDate: progress.lastBountyDate,
          theme:          progress.theme,
        });
      },

      // ── Called on logout to wipe local state ───────────────
      resetProgress: () => {
        // Cancel any pending debounced save — prevents wiping Firestore
        // with zeroed-out state after logout clears the store
        if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
        set({
          playerName:     null,
          xp:             0,
          zoneProgress:   { ...INITIAL_ZONE_PROGRESS },
          unlockedBadges: [],
          completedLevels:[],
          lastBountyDate: null,
        });
      },

      // ── Debounced Firestore save ────────────────────────────
      syncToFirestore: (uid) => {
        const s = get();
        debouncedSave(uid, {
          xp:             s.xp,
          zoneProgress:   s.zoneProgress,
          unlockedBadges: s.unlockedBadges,
          completedLevels:s.completedLevels,
          lastBountyDate: s.lastBountyDate,
          theme:          s.theme,
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
        // playerName intentionally excluded — always comes from Firebase auth
      }),
    }
  )
);
