export interface AzDOSettings {
  orgUrl: string;
  pat: string;
  project?: string;
  team?: string;
}

export interface WorkItem {
  id: number;
  rev: number;
  fields: Record<string, any>;
  url: string;
}

export interface Sprint {
  id: string;
  name: string;
  path: string;
  attributes: {
    startDate: string;
    finishDate: string;
    timeFrame: "past" | "current" | "future";
  };
}

export interface TeamMember {
  id: string;
  displayName: string;
  uniqueName: string;
  imageUrl: string;
}
