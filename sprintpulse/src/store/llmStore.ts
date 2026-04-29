import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LLMConfig, LLMProvider } from '../services/llm.service'

interface LLMStore {
  configs: Partial<Record<LLMProvider, LLMConfig>>
  activeProvider: LLMProvider
  sessionTokensUsed: number;
  sessionCostEstimate: number;
  isDrawerOpen: boolean;
  setConfig: (provider: LLMProvider, config: LLMConfig) => void
  setActiveProvider: (provider: LLMProvider) => void
  getActiveConfig: () => LLMConfig | null
  clearAll: () => void
  addUsage: (tokens: number, costPer1k: number) => void
  clearUsage: () => void
  toggleDrawer: () => void
}

export const useLLMStore = create<LLMStore>()(
  persist(
    (set, get) => ({
      configs: {
        groq: { provider: 'groq', apiKey: '', model: 'llama-3.3-70b-versatile', temperature: 0.3, maxTokens: 2000, streaming: true }
      },
      activeProvider: 'groq',
      sessionTokensUsed: 0,
      sessionCostEstimate: 0,
      isDrawerOpen: false,

      setConfig: (provider, config) =>
        set(s => ({ configs: { ...s.configs, [provider]: config } })),
        
      setActiveProvider: (provider) => set({ activeProvider: provider }),
      
      getActiveConfig: () => {
        const { configs, activeProvider } = get()
        return configs[activeProvider] ?? null
      },
      
      clearAll: () => set({ configs: {}, activeProvider: 'groq' }),
      
      addUsage: (tokens: number, costPer1k: number) => set((state) => ({
        sessionTokensUsed: state.sessionTokensUsed + tokens,
        sessionCostEstimate: state.sessionCostEstimate + (tokens / 1000) * costPer1k
      })),
      
      clearUsage: () => set({ sessionTokensUsed: 0, sessionCostEstimate: 0 }),
      
      toggleDrawer: () => set(state => ({ isDrawerOpen: !state.isDrawerOpen }))
    }),
    {
      name: 'sentinel-llm-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // Prompt says "sessionStorage" for keys
    }
  )
)
