import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AzDOSettings } from '@/types/azdo'

interface SettingsState {
  azdoConfig: AzDOSettings | null;
  setAzdoConfig: (config: AzDOSettings) => void;
  clearConfig: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      azdoConfig: null,
      setAzdoConfig: (config) => set({ azdoConfig: config }),
      clearConfig: () => set({ azdoConfig: null })
    }),
    {
      name: 'sprintlens-settings-storage',
    }
  )
)
