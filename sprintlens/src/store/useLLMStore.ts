import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserLLMConfig, PROVIDERS } from '@/types/llm'

interface LLMState {
  configs: UserLLMConfig[];
  activeProviderId: string;
  activeModelId: string;
  addConfig: (config: UserLLMConfig) => void;
  setActiveModel: (providerId: string, modelId: string) => void;
  removeConfig: (providerId: string) => void;
}

export const useLLMStore = create<LLMState>()(
  persist(
    (set) => ({
      configs: [],
      activeProviderId: 'groq',
      activeModelId: 'llama-3.3-70b-versatile',
      addConfig: (config) => set((state) => {
        const exists = state.configs.find(c => c.providerId === config.providerId)
        if (exists) {
          return { configs: state.configs.map(c => c.providerId === config.providerId ? config : c) }
        }
        return { configs: [...state.configs, config] }
      }),
      setActiveModel: (providerId, modelId) => set({ activeProviderId: providerId, activeModelId: modelId }),
      removeConfig: (providerId) => set((state) => ({
        configs: state.configs.filter(c => c.providerId !== providerId)
      }))
    }),
    {
      name: 'sprintlens-llm-storage', // Note: In production SECRETS must be in backend DB, not localStorage. This is for dev demo.
    }
  )
)
