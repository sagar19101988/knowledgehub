import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuestState {
  xp: number;
  zoneProgress: Record<string, number>;
  unlockedBadges: string[];
  addXp: (amount: number) => void;
  updateZoneProgress: (zoneId: string, progressToAdd: number) => void;
  unlockBadge: (badge: string) => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set) => ({
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
      })
    }),
    {
      name: 'qa-quest-storage',
    }
  )
);
