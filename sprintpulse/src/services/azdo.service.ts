export interface AzdoProject {
  id: string;
  name: string;
  description?: string;
}

export interface AzdoTeam {
  id: string;
  name: string;
  description?: string;
}

export class AzdoService {
  private orgUrl: string;
  private pat: string;

  constructor(orgUrl: string, pat: string) {
    // Ensure clean URL without trailing slash
    this.orgUrl = orgUrl.trim().replace(/\/$/, '');
    this.pat = pat.trim();
  }

  private getHeaders(): HeadersInit {
    return {
      // Azure DevOps expects Basic Auth with an empty username and PAT as password
      'Authorization': `Basic ${btoa(':' + this.pat)}`,
      'Content-Type': 'application/json',
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.orgUrl}/_apis/projects?$top=1&api-version=7.1`, {
        headers: this.getHeaders(),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  }

  async getProjects(): Promise<AzdoProject[]> {
    const res = await fetch(`${this.orgUrl}/_apis/projects?api-version=7.1`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to authenticate or fetch projects');
    const data = await res.json();
    return data.value;
  }

  async getTeams(projectId: string): Promise<AzdoTeam[]> {
    const res = await fetch(`${this.orgUrl}/_apis/projects/${projectId}/teams?api-version=7.1`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch project teams');
    const data = await res.json();
    return data.value;
  }

  async getAllIterations(project: string, team: string): Promise<any[]> {
    const res = await fetch(`${this.orgUrl}/${encodeURIComponent(project)}/${encodeURIComponent(team)}/_apis/work/teamsettings/iterations?api-version=7.1`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch iterations');
    const data = await res.json();
    return data.value || [];
  }

  async getCurrentIteration(project: string, team: string): Promise<any> {
    const res = await fetch(`${this.orgUrl}/${encodeURIComponent(project)}/${encodeURIComponent(team)}/_apis/work/teamsettings/iterations?$timeframe=current&api-version=7.1`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch current iteration');
    const data = await res.json();
    return data.value && data.value.length > 0 ? data.value[0] : null;
  }

  async getIterationWorkItems(project: string, team: string, iterationId: string): Promise<any[]> {
    // 1. Get work item IDs active within this sprint
    const res = await fetch(`${this.orgUrl}/${encodeURIComponent(project)}/${encodeURIComponent(team)}/_apis/work/teamsettings/iterations/${iterationId}/workitems?api-version=7.1`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch iteration work items');
    const data = await res.json();
    
    if (!data.workItemRelations || data.workItemRelations.length === 0) return [];
    
    // Build topological map representing Parent -> Child links
    const relationMap = new Map<number, number>();
    data.workItemRelations.forEach((r: any) => {
      if (r.rel === 'System.LinkTypes.Hierarchy-Forward' && r.source) {
        relationMap.set(r.target.id, r.source.id);
      }
    });

    // Safety subset if sprint has too many items for a single batch (>200)
    const workItemIds = data.workItemRelations.map((item: any) => item.target.id).slice(0, 200);

    // 2. Fetch thick JSON blocks for all discovered IDs via POST batch
    const batchRes = await fetch(`${this.orgUrl}/${encodeURIComponent(project)}/_apis/wit/workitemsbatch?api-version=7.1`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        ids: workItemIds,
        fields: [
          'System.Id',
          'System.WorkItemType',
          'System.State',
          'System.Title',
          'Microsoft.VSTS.Common.Priority',
          'Microsoft.VSTS.Scheduling.StoryPoints',
          'Microsoft.VSTS.Scheduling.OriginalEstimate',
          'Microsoft.VSTS.Scheduling.CompletedWork',
          'Microsoft.VSTS.Scheduling.RemainingWork',
          'System.AssignedTo',
          'System.Tags',
          'System.CreatedDate',
          'System.ChangedDate',
          'Microsoft.VSTS.Common.StateChangeDate',
          'Microsoft.VSTS.Common.ActivatedDate',
          'Microsoft.VSTS.Common.ClosedDate',
          'Microsoft.VSTS.Common.Activity'
        ]
      })
    });

    if (!batchRes.ok) throw new Error('Failed to fetch detailed work items data');
    const batchData = await batchRes.json();
    
    return batchData.value.map((item: any) => ({
      id: item.id,
      parentId: relationMap.get(item.id) || null,
      type: item.fields['System.WorkItemType'],
      state: item.fields['System.State'],
      title: item.fields['System.Title'],
      priority: item.fields['Microsoft.VSTS.Common.Priority'] || 4,
      storyPoints: item.fields['Microsoft.VSTS.Scheduling.StoryPoints'] || 0,
      originalEstimate: item.fields['Microsoft.VSTS.Scheduling.OriginalEstimate'] || 0,
      completedWork: item.fields['Microsoft.VSTS.Scheduling.CompletedWork'] || 0,
      remainingWork: item.fields['Microsoft.VSTS.Scheduling.RemainingWork'] || 0,
      assignedTo: item.fields['System.AssignedTo'] ? {
        displayName: item.fields['System.AssignedTo'].displayName,
        imageUrl: item.fields['System.AssignedTo']._links?.avatar?.href,
      } : undefined,
      tags: item.fields['System.Tags'] ? item.fields['System.Tags'].split(';').map((t: string) => t.trim()) : [],
      createdDate: item.fields['System.CreatedDate'],
      changedDate: item.fields['System.ChangedDate'],
      stateChangeDate: item.fields['Microsoft.VSTS.Common.StateChangeDate'],
      activatedDate: item.fields['Microsoft.VSTS.Common.ActivatedDate'],
      closedDate: item.fields['Microsoft.VSTS.Common.ClosedDate'],
      activity: item.fields['Microsoft.VSTS.Common.Activity'],
    }));
  }
}
