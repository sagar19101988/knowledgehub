import { Router, Response } from 'express';
import { fetchAzureStories } from '../services/azureService';
import { requireAuth } from '../middleware/authMiddleware';
import { getUserIntegrations } from '../services/configService';
import axios from 'axios';

const router = Router();

// POST /api/azure/test — verify credentials (no DB required)
router.post('/test', requireAuth, async (req: any, res: Response) => {
  const { adoConfig } = req.body;
  if (!adoConfig?.url || !adoConfig?.token) {
    return res.status(400).json({ error: 'Organization URL and Personal Access Token are required.' });
  }
  try {
    const cleanUrl = adoConfig.url.replace(/\/$/, '');
    const auth = Buffer.from(`:${adoConfig.token}`).toString('base64');
    const resp = await axios.get(`${cleanUrl}/_apis/projects?api-version=7.0`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const projects = resp.data?.value?.map((p: any) => p.name) || [];
    res.json({ ok: true, message: 'Azure DevOps connection verified.', projects });
  } catch (err: any) {
    const detail = err?.response?.data?.message || err?.response?.statusText || err.message;
    res.status(400).json({ error: `Azure DevOps connection failed: ${detail}` });
  }
});

// GET /api/azure/diagnose — list projects + raw work items for debugging
router.get('/diagnose', requireAuth, async (req: any, res: Response) => {
  const integrations = await getUserIntegrations(req.user.userId);
  if (!integrations?.adoConfig) {
    return res.status(400).json({ error: 'Azure DevOps credentials not configured.' });
  }

  const { url, token, projectOrOrg } = integrations.adoConfig;
  const cleanUrl = url.replace(/\/$/, '');
  const auth = `Basic ${Buffer.from(`:${token}`).toString('base64')}`;

  try {
    const projectsResp = await axios.get(`${cleanUrl}/_apis/projects?api-version=7.0`, {
      headers: { Authorization: auth }
    });
    const projects = projectsResp.data?.value?.map((p: any) => ({ id: p.id, name: p.name, state: p.state })) || [];

    const project = (req.query.project as string) || projectOrOrg || projects[0]?.name;
    let rawItems: any[] = [];
    let wiqlError = null;

    try {
      const wiqlResp = await axios.post(
        `${cleanUrl}/_apis/wit/wiql?api-version=7.0&$top=10`,
        { query: `SELECT [System.Id],[System.Title],[System.WorkItemType],[System.State] FROM WorkItems WHERE [System.TeamProject] = '${project}' ORDER BY [System.ChangedDate] DESC` },
        { headers: { Authorization: auth, 'Content-Type': 'application/json' } }
      );
      const ids = (wiqlResp.data.workItems || []).slice(0, 10).map((w: any) => w.id).join(',');
      if (ids) {
        const detailResp = await axios.get(
          `${cleanUrl}/_apis/wit/workitems?ids=${ids}&fields=System.Id,System.Title,System.WorkItemType,System.State&api-version=7.0`,
          { headers: { Authorization: auth } }
        );
        rawItems = detailResp.data.value || [];
      }
    } catch (e: any) {
      wiqlError = e?.response?.data?.message || e.message;
    }

    res.json({ projects, usedProject: project, rawItems, wiqlError });
  } catch (err: any) {
    res.status(500).json({ error: err?.response?.data?.message || err.message });
  }
});

// GET /api/azure/workitem/:id — fetch a single work item by numeric ID
router.get('/workitem/:id', requireAuth, async (req: any, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'A numeric work item ID is required.' });
  }

  const integrations = await getUserIntegrations(req.user.userId);
  if (!integrations?.adoConfig) {
    return res.status(400).json({ error: 'Azure DevOps credentials not configured. Please save them in Integrations first.' });
  }

  const { url, token } = integrations.adoConfig;
  const cleanUrl = url.replace(/\/$/, '');
  const auth = `Basic ${Buffer.from(`:${token}`).toString('base64')}`;

  // Try explicit fields, then $expand=all, across multiple API versions for TFS compatibility
  const tryUrls = [
    `${cleanUrl}/_apis/wit/workitems/${id}?api-version=7.0`,
    `${cleanUrl}/_apis/wit/workitems/${id}?api-version=6.0`,
    `${cleanUrl}/_apis/wit/workitems/${id}?api-version=5.1`,
    `${cleanUrl}/_apis/wit/workitems/${id}?api-version=5.0`,
    `${cleanUrl}/_apis/wit/workitems/${id}?api-version=3.0`,
    `${cleanUrl}/_apis/wit/workitems/${id}?api-version=2.0`,
    `${cleanUrl}/_apis/wit/workitems/${id}?$expand=all&api-version=7.0`,
    `${cleanUrl}/_apis/wit/workitems/${id}?$expand=all&api-version=5.1`,
    `${cleanUrl}/_apis/wit/workitems/${id}?$expand=all&api-version=3.0`,
    `${cleanUrl}/_apis/wit/workitems/${id}?$expand=all`,
    `${cleanUrl}/_apis/wit/workitems/${id}`,
  ];

  let data: any = null;
  let lastErr: any = null;

  for (const tryUrl of tryUrls) {
    try {
      console.log(`[Azure] Trying: ${tryUrl}`);
      const resp = await axios.get(tryUrl, { headers: { Authorization: auth } });
      data = resp.data;
      // Log the actual field keys so we can see what TFS returns
      const fieldKeys = Object.keys(data?.fields || data || {});
      console.log(`[Azure] Success — field keys: ${fieldKeys.slice(0, 20).join(', ')}`);
      if (data?.fields) {
        console.log(`[Azure] System.Title = "${data.fields['System.Title']}"`);
        console.log(`[Azure] System.State = "${data.fields['System.State']}"`);
        console.log(`[Azure] System.WorkItemType = "${data.fields['System.WorkItemType']}"`);
      }
      break;
    } catch (e: any) {
      console.warn(`[Azure] Failed ${tryUrl}: HTTP ${e?.response?.status} — ${e?.response?.data?.message || e.message}`);
      lastErr = e;
    }
  }

  if (!data) {
    const status = lastErr?.response?.status;
    const msg    = lastErr?.response?.data?.message || lastErr?.message;
    if (status === 404) return res.status(404).json({ error: `Work item #${id} not found in your Azure DevOps organization.` });
    if (status === 401 || status === 403) return res.status(403).json({ error: `Access denied. Ensure your PAT has "Work Items (Read)" permission.` });
    return res.status(500).json({ error: `Failed to reach Azure DevOps: ${msg}` });
  }

  // ── FULL DIAGNOSTIC DUMP — this shows every field TFS returns ──────────────
  console.log(`[Azure] Full data.fields dump:`);
  console.log(JSON.stringify(data.fields, null, 2));
  // ───────────────────────────────────────────────────────────────────────────

  // Standard response has data.fields; some TFS versions put fields at top-level
  const f = data.fields || data;

  const stripHtml = (s: string) => (s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  const PRIORITY_MAP: Record<string, string> = { '1': 'Critical', '2': 'High', '3': 'Medium', '4': 'Low' };
  const rawPriority = String(f['Microsoft.VSTS.Common.Priority'] ?? f['Priority'] ?? '');

  // Resolve description from multiple possible field names (differs across SCRUM / Agile / CMMI / custom templates)
  const description = stripHtml(
    f['System.Description'] ||
    f['Description'] ||
    f['Microsoft.VSTS.Common.DescriptionHtml'] ||
    ''
  );

  // Resolve acceptance criteria — also differs per process template
  const acceptanceCriteria = stripHtml(
    f['Microsoft.VSTS.Common.AcceptanceCriteria'] ||
    f['AcceptanceCriteria'] ||
    f['Microsoft.VSTS.Common.AcceptanceCriteriaHtml'] ||
    f['Custom.AcceptanceCriteria'] ||
    ''
  );

  const storyPoints =
    f['Microsoft.VSTS.Scheduling.StoryPoints'] ??
    f['Microsoft.VSTS.Scheduling.Effort'] ??
    f['Microsoft.VSTS.Scheduling.Size'] ??
    f['StoryPoints'] ??
    null;

  const story = {
    key:                `ADO-${id}`,
    id:                 `ADO-${id}`,
    summary:            f['System.Title']       || f['Title']       || '(No Title)',
    description,
    acceptanceCriteria,
    status:             f['System.State']       || f['State']       || 'Unknown',
    workItemType:       f['System.WorkItemType']|| f['WorkItemType']|| 'Work Item',
    priority:           PRIORITY_MAP[rawPriority] || rawPriority   || 'Medium',
    assignee:           f['System.AssignedTo']?.displayName || f['AssignedTo'] || null,
    storyPoints:        storyPoints !== null ? Number(storyPoints) || null : null,
  };

  console.log(`[Azure] Mapped #${id}: title="${story.summary}" type="${story.workItemType}" state="${story.status}"`);

  // Return rawFields alongside story for frontend debug display
  res.json({ story, rawFields: data.fields || {} });
});

// GET /api/azure/stories — fetch all active stories from the configured project
router.get('/stories', requireAuth, async (req: any, res: Response) => {
  const { maxResults } = req.query;
  const integrations = await getUserIntegrations(req.user.userId);
  if (!integrations?.adoConfig) {
    return res.status(400).json({ error: 'Azure DevOps credentials not configured. Go to Integrations and save your settings.' });
  }

  const projectKey = (req.query.projectKey as string) || integrations.adoConfig.projectOrOrg;
  if (!projectKey) {
    return res.status(400).json({ error: 'Project name not found. Set it in Integrations → Azure DevOps → Project Name.' });
  }

  console.log(`[Azure /stories] project="${projectKey}" org="${integrations.adoConfig.url}"`);

  try {
    const stories = await fetchAzureStories(projectKey, integrations.adoConfig, maxResults ? parseInt(maxResults as string) : 50);
    res.json({ stories, total: stories.length, project: projectKey });
  } catch (err: any) {
    console.error('Azure DevOps fetch error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to fetch Azure DevOps work items',
      details: err?.response?.data?.message || err.message,
    });
  }
});

// GET /api/azure/health
router.get('/health', requireAuth, async (req: any, res: Response) => {
  const integrations = await getUserIntegrations(req.user.userId);
  const configured = !!integrations?.adoConfig;
  res.json({ configured, baseUrl: integrations?.adoConfig?.url || null });
});

export default router;
