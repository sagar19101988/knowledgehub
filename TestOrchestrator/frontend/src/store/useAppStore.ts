import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, Story, TestPlan, TestCase, Page } from '../types';

interface AppState {
  session: 'unauthenticated' | 'guest' | 'logged_in';
  user: { name: string; email: string } | null;
  token: string | null;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;

  stories: Story[];
  setStories: (stories: Story[]) => void;
  addStories: (stories: Story[]) => void;

  testPlans: TestPlan[];
  addTestPlan: (plan: TestPlan) => void;

  testCases: TestCase[];
  addTestCases: (cases: TestCase[]) => void;
  updateTestCase: (id: string, updates: Partial<TestCase>) => void;

  clearAllData: () => void;
  login: (user: { name: string; email: string }, token?: string | null) => void;
  continueAsGuest: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      session: 'unauthenticated',
      user: null,
      token: null,
      currentPage: 'integrations',
      setCurrentPage: (currentPage) => set({ currentPage }),

      settings: {
        llmProvider: 'Groq',
        llmApiKey: '',
        llmBaseUrl: '',
        jira: null,
        azureDevOps: null,
      },
      updateSettings: (partial) => set((state) => ({
        settings: { ...state.settings, ...partial }
      })),

      stories: [],
      setStories: (stories) => set({ stories }),
      addStories: (newStories) => set((state) => {
        const existingIds = new Set(state.stories.map(s => s.id));
        const added = newStories.filter(s => !existingIds.has(s.id));
        return { stories: [...state.stories, ...added] };
      }),

      testPlans: [],
      addTestPlan: (plan) => set((state) => ({ testPlans: [...state.testPlans, plan] })),

      testCases: [],
      addTestCases: (newCases) => set((state) => ({ testCases: [...state.testCases, ...newCases] })),
      updateTestCase: (id, updates) => set((state) => ({
        testCases: state.testCases.map(tc => tc.id === id ? { ...tc, ...updates } : tc)
      })),

      clearAllData: () => {
        // Clear the persisted localStorage key so stale data is truly gone
        localStorage.removeItem('test-orchestrator-storage');
        localStorage.removeItem('test-orchestrator-jira-storage');
        // Also clear any other persisted keys
        Object.keys(localStorage)
          .filter(k => k.startsWith('test-orchestrator'))
          .forEach(k => localStorage.removeItem(k));
        // Force a full page reload so Zustand re-initialises from scratch
        window.location.reload();
      },

      login: (user, token = null) => set({ session: 'logged_in', user, token }),
      continueAsGuest: () => set({ session: 'guest', user: null, token: null }),
      logout: () => set({ session: 'unauthenticated', user: null, token: null }),
    }),
    {
      name: 'test-orchestrator-storage',
    }
  )
);
