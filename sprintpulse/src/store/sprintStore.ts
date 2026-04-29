import { AzdoService } from '../services/azdo.service';
import { create } from 'zustand';

export interface SprintData {
  id: string;
  iterationPath: string;
  name: string;
  startDate: string;
  endDate: string;
}


export interface WorkItem {
  id: number;
  parentId: number | null;
  type: string;
  state: string;
  title: string;
  priority: number;
  storyPoints: number;
  originalEstimate: number;   // hours planned
  completedWork: number;      // hours logged
  remainingWork: number;      // hours still remaining
  assignedTo?: {
    displayName: string;
    imageUrl: string;
  };
  tags: string[];
  createdDate?: string;
  changedDate?: string;
  stateChangeDate?: string;
  activatedDate?: string;
  closedDate?: string;
  activity?: string;
}

interface SprintStore {
  iterations: SprintData[];
  sprint: SprintData | null;
  workItems: WorkItem[];
  isLoading: boolean;
  error: string | null;
  initializeIterations: (orgUrl: string, pat: string, project: string, team: string) => Promise<void>;
  fetchSprintById: (orgUrl: string, pat: string, project: string, team: string, iterationId: string) => Promise<void>;
}

export const useSprintStore = create<SprintStore>((set, get) => ({
  iterations: [],
  sprint: null,
  workItems: [],
  isLoading: false,
  error: null,
  
  initializeIterations: async (orgUrl, pat, project, team) => {
    set({ isLoading: true, error: null });
    try {
      const azdo = new AzdoService(orgUrl, pat);
      
      // Fetch all iterations
      const allItersRaw = await azdo.getAllIterations(project, team);
      const allIters = allItersRaw.map(it => ({
        id: it.id,
        iterationPath: it.path,
        name: it.name,
        startDate: it.attributes.startDate,
        // Store explicit end-of-day to avoid midnight-UTC vs IST timezone drift
        endDate: it.attributes.finishDate
          ? new Date(new Date(it.attributes.finishDate).setHours(23, 59, 59, 999)).toISOString()
          : '',
      }));
      
      // Determine the current one
      const currentIterRaw = await azdo.getCurrentIteration(project, team);
      
      set({ iterations: allIters });
      
      if (currentIterRaw) {
        get().fetchSprintById(orgUrl, pat, project, team, currentIterRaw.id);
      } else if (allIters.length > 0) {
        // Fallback to latest
        get().fetchSprintById(orgUrl, pat, project, team, allIters[allIters.length - 1].id);
      } else {
        set({ error: 'No sprints configured for this team.', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to initialize iterations', isLoading: false });
    }
  },

  fetchSprintById: async (orgUrl, pat, project, team, iterationId) => {
    set({ isLoading: true, error: null });
    try {
      const azdo = new AzdoService(orgUrl, pat);
      
      const { iterations } = get();
      const targetIter = iterations.find(i => i.id === iterationId);
      
      const items = await azdo.getIterationWorkItems(project, team, iterationId);

      set({ 
        sprint: targetIter || null,
        workItems: items,
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to populate sprint items', isLoading: false });
    }
  }
}));
