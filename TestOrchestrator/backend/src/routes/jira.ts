import { Router, Request, Response } from 'express';
import { fetchJiraStories } from '../services/jiraService';

const router = Router();

// GET /api/jira/stories?projectKey=MYPROJECT&maxResults=50
router.get('/stories', async (req: Request, res: Response) => {
  const { projectKey, maxResults } = req.query;

  if (!projectKey || typeof projectKey !== 'string') {
    return res.status(400).json({ error: 'projectKey query parameter is required' });
  }

  if (!process.env.JIRA_BASE_URL || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    return res.status(500).json({ error: 'Jira credentials not configured in server .env file' });
  }

  try {
    const stories = await fetchJiraStories(projectKey, maxResults ? parseInt(maxResults as string) : 50);
    res.json({ stories, total: stories.length });
  } catch (err: any) {
    console.error('Jira fetch error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to fetch Jira stories',
      details: err?.response?.data?.errorMessages || err.message,
    });
  }
});

// GET /api/jira/health — check if Jira credentials are configured
router.get('/health', (_req: Request, res: Response) => {
  const configured = !!(process.env.JIRA_BASE_URL && process.env.JIRA_EMAIL && process.env.JIRA_API_TOKEN);
  res.json({
    configured,
    baseUrl: process.env.JIRA_BASE_URL || null,
    email: process.env.JIRA_EMAIL ? process.env.JIRA_EMAIL.replace(/(.{2}).+(@.+)/, '$1***$2') : null,
  });
});

export default router;
