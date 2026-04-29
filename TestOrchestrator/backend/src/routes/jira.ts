import { Router, Response } from 'express';
import { fetchJiraStories } from '../services/jiraService';
import { requireAuth } from '../middleware/authMiddleware';
import { getUserIntegrations } from '../services/configService';
import axios from 'axios';

const router = Router();

// POST /api/jira/test — live test credentials (does NOT require DB saved config)
router.post('/test', requireAuth, async (req: any, res: Response) => {
  const { jiraConfig } = req.body;
  if (!jiraConfig?.url || !jiraConfig?.token || !jiraConfig?.authId) {
    return res.status(400).json({ error: 'url, authId (email), and token are all required to test Jira.' });
  }
  try {
    const auth = Buffer.from(`${jiraConfig.authId}:${jiraConfig.token}`).toString('base64');
    await axios.get(`${jiraConfig.url}/rest/api/3/myself`, {
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }
    });
    res.json({ ok: true, message: 'Jira connection verified.' });
  } catch (err: any) {
    const detail = err?.response?.data?.errorMessages?.[0] || err?.response?.data?.message || err.message;
    res.status(400).json({ error: `Jira connection failed: ${detail}` });
  }
});

// GET /api/jira/stories?projectKey=MYPROJECT&maxResults=50
router.get('/stories', requireAuth, async (req: any, res: Response) => {
  const { projectKey, maxResults } = req.query;

  if (!projectKey || typeof projectKey !== 'string') {
    return res.status(400).json({ error: 'projectKey query parameter is required' });
  }

  const integrations = await getUserIntegrations(req.user.userId);
  if (!integrations?.jiraConfig) {
    return res.status(400).json({ error: 'Jira credentials not configured. Please save them in Integrations first.' });
  }

  try {
    const stories = await fetchJiraStories(projectKey, integrations.jiraConfig, maxResults ? parseInt(maxResults as string) : 50);
    res.json({ stories, total: stories.length });
  } catch (err: any) {
    console.error('Jira fetch error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to fetch Jira stories',
      details: err?.response?.data?.errorMessages || err.message,
    });
  }
});

// GET /api/jira/health — check if Jira credentials are configured in DB
router.get('/health', requireAuth, async (req: any, res: Response) => {
  const integrations = await getUserIntegrations(req.user.userId);
  const configured = !!integrations?.jiraConfig;
  res.json({
    configured,
    baseUrl: integrations?.jiraConfig?.url || null,
    email: integrations?.jiraConfig?.authId ? integrations.jiraConfig.authId.replace(/(.{2}).+(@.+)/, '$1***$2') : null,
  });
});

export default router;
