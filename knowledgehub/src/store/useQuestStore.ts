import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuestState {
  playerName: string | null;
  xp: number;
  zoneProgress: Record<string, number>;
  unlockedBadges: string[];
  completedLevels: string[];
  lastBountyDate: string | null;
  setPlayerName: (name: string) => void;
  clearPlayerName: () => void;
  addXp: (amount: number) => void;
  updateZoneProgress: (zoneId: string, progressToAdd: number) => void;
  unlockBadge: (badge: string) => void;
  markLevelComplete: (levelKey: string) => void;
  claimDailyBounty: () => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set) => ({
      playerName: null,
      xp: 0,
      zoneProgress: {
        manual: 0,
        sql: 0,
        api: 0,
        typescript: 0,
        playwright: 0,
        'ai-qa': 0,
      },
      unlockedBadges: [],
      completedLevels: [],
      lastBountyDate: null,
      setPlayerName: (name) => set({ playerName: name.trim() }),
      clearPlayerName: () => set({ playerName: null }),
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      updateZoneProgress: (zoneId, progressToAdd) => set((state) => {
        const current = state.zoneProgress[zoneId] || 0;
        const next = Math.min(current + progressToAdd, 100);
        return {
          zoneProgress: {
            ...state.zoneProgress,
            [zoneId]: next
          }
        };
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
      })
    }),
    {
      name: 'qa-quest-storage',
    }
  )
);
