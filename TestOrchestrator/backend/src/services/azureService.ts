import axios from 'axios';

export interface AzureStory {
  id: string;
  key: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;
  status: string;
  priority: string;
  assignee: string | null;
  storyPoints: number | null;
}

function getAuthHeader(token: string): string {
  return `Basic ${Buffer.from(`:${token}`).toString('base64')}`;
}

// TFS on-premises supports much older API versions; try newest → oldest
const API_VERSIONS = ['7.0', '6.0', '5.1', '5.0', '3.0', '2.0', '1.0'];

/**
 * Try to execute a WIQL query against multiple API versions and URL scopes.
 * Returns the list of {id} objects from the first successful response.
 */
async function runWiql(
  cleanUrl: string,
  projectName: string,
  authHeader: string,
  query: string,
  top: number
): Promise<any[]> {
  const urlTemplates = [
    // Project-scoped (preferred — respects project-level permissions)
    (v: string) => `${cleanUrl}/${encodeURIComponent(projectName)}/_apis/wit/wiql?api-version=${v}&$top=${top}`,
    // Org-level fallback (needed for some TFS topologies)
    (v: string) => `${cleanUrl}/_apis/wit/wiql?api-version=${v}&$top=${top}`,
    // Bare (no version header — very old TFS)
    (_v: string) => `${cleanUrl}/_apis/wit/wiql?$top=${top}`,
  ];

  for (const version of API_VERSIONS) {
    for (const makeUrl of urlTemplates) {
      const wiqlUrl = makeUrl(version);
      try {
        console.log(`[Azure] WIQL attempt: ${wiqlUrl}`);
        const resp = await axios.post(wiqlUrl, { query }, {
          headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
          timeout: 15000,
        });
        const items = resp.data?.workItems || resp.data?.results || [];
        console.log(`[Azure] WIQL success (v${version}): ${items.length} items`);
        return items;
      } catch (e: any) {
        const status = e?.response?.status;
        console.warn(`[Azure] WIQL failed (v${version} @ ${wiqlUrl}): HTTP ${status} — ${e?.response?.data?.message || e.message}`);
        // 401/403 = auth problem, stop trying versions immediately
        if (status === 401 || status === 403) throw e;
      }
    }
  }
  return [];
}

/**
 * Fetch work item details — tries multiple API versions and falls back to
 * $expand=all when explicit field list returns empty (common on old TFS).
 */
async function fetchWorkItemDetails(
  cleanUrl: string,
  ids: string,
  authHeader: string,
  fields: string
): Promise<any[]> {
  // Try explicit fields first (fastest), then $expand=all (broadest)
  const urlVariants = [
    ...API_VERSIONS.map(v => `${cleanUrl}/_apis/wit/workitems?ids=${ids}&fields=${fields}&api-version=${v}`),
    ...API_VERSIONS.map(v => `${cleanUrl}/_apis/wit/workitems?ids=${ids}&$expand=all&api-version=${v}`),
    `${cleanUrl}/_apis/wit/workitems?ids=${ids}&$expand=all`,
  ];

  for (const url of urlVariants) {
    try {
      const resp = await axios.get(url, {
        headers: { Authorization: authHeader },
        timeout: 15000,
      });
      const items: any[] = resp.data?.value || [];
      if (items.length > 0) {
        console.log(`[Azure] Work item details fetched (${items.length} items) via: ${url}`);
        return items;
      }
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) throw e;
      // Otherwise silently try next variant
    }
  }
  return [];
}

/** Strip HTML tags and decode common HTML entities */
function stripHtml(s: string | undefined | null): string {
  if (!s) return '';
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Resolve description from multiple possible field names across TFS process templates */
function resolveDescription(f: Record<string, any>): string {
  return stripHtml(
    f['System.Description'] ||
    f['Description'] ||
    f['Microsoft.VSTS.Common.DescriptionHtml'] ||
    ''
  );
}

/** Resolve acceptance criteria from multiple possible field names */
function resolveAcceptanceCriteria(f: Record<string, any>): string {
  return stripHtml(
    f['Microsoft.VSTS.Common.AcceptanceCriteria'] ||
    f['AcceptanceCriteria'] ||
    f['Microsoft.VSTS.Common.AcceptanceCriteriaHtml'] ||
    f['Custom.AcceptanceCriteria'] ||
    ''
  );
}

function resolveStoryPoints(f: Record<string, any>): number | null {
  const val = f['Microsoft.VSTS.Scheduling.StoryPoints']
    ?? f['Microsoft.VSTS.Scheduling.Effort']
    ?? f['Microsoft.VSTS.Scheduling.Size']
    ?? f['StoryPoints']
    ?? f['Effort']
    ?? null;
  return val !== null ? Number(val) || null : null;
}

const PRIORITY_MAP: Record<string, string> = { '1': 'Critical', '2': 'High', '3': 'Medium', '4': 'Low' };

export async function fetchAzureStories(
  projectName: string,
  adoConfig: any,
  maxResults = 50
): Promise<AzureStory[]> {
  const cleanUrl = adoConfig.url.replace(/\/$/, '');
  const authHeader = getAuthHeader(adoConfig.token);

  const wiqlQuery = `
    SELECT [System.Id]
    FROM WorkItems
    WHERE [System.TeamProject] = '${projectName}'
    ORDER BY [System.ChangedDate] DESC
  `;

  console.log(`[Azure] Querying project="${projectName}" at URL=${cleanUrl}`);

  const workItems = await runWiql(cleanUrl, projectName, authHeader, wiqlQuery, maxResults);

  if (!workItems || workItems.length === 0) {
    console.warn('[Azure] No work items returned from WIQL query.');
    return [];
  }

  const ids = workItems.slice(0, maxResults).map((wi: any) => wi.id).join(',');

  const fields = [
    'System.Id',
    'System.Title',
    'System.Description',
    'System.State',
    'System.WorkItemType',
    'System.AssignedTo',
    'Microsoft.VSTS.Common.Priority',
    'Microsoft.VSTS.Common.AcceptanceCriteria',
    'Microsoft.VSTS.Scheduling.StoryPoints',
    'Microsoft.VSTS.Scheduling.Effort',
    'Microsoft.VSTS.Scheduling.Size',
  ].join(',');

  const items = await fetchWorkItemDetails(cleanUrl, ids, authHeader, fields);

  if (items.length === 0) {
    console.error('[Azure] Could not fetch work item details via any API version.');
    return [];
  }

  return items.map((item: any) => {
    const f = item.fields ?? item; // some old TFS versions return fields at top level
    const rawPriority = String(f['Microsoft.VSTS.Common.Priority'] ?? f['Priority'] ?? '');

    return {
      id: item.id.toString(),
      key: `ADO-${item.id}`,
      summary: f['System.Title'] || f['Title'] || 'Untitled',
      description: resolveDescription(f),
      acceptanceCriteria: resolveAcceptanceCriteria(f),
      status: f['System.State'] || f['State'] || 'Unknown',
      priority: PRIORITY_MAP[rawPriority] || rawPriority || 'Medium',
      assignee: f['System.AssignedTo']?.displayName || f['AssignedTo'] || null,
      storyPoints: resolveStoryPoints(f),
    };
  });
}
