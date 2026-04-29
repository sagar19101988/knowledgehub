import { create } from 'zustand';

export interface AuthState {
  pat: string;
  orgUrl: string;
  project: string;
  team: string;
  isConnected: boolean;
  setCredentials: (pat: string, orgUrl: string) => void;
  setProjectAndTeam: (project: string, team: string) => void;
  disconnect: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  pat: '',
  orgUrl: '',
  project: '',
  team: '',
  isConnected: false,
  setCredentials: (pat, orgUrl) => set({ pat, orgUrl, isConnected: true }),
  setProjectAndTeam: (project, team) => set({ project, team }),
  disconnect: () => set({ pat: '', orgUrl: '', project: '', team: '', isConnected: false }),
}));
