import { Router, Request, Response } from 'express';
import { generateTestPlan, generateTestCases, generateAutomationCode } from '../services/openaiService';

const router = Router();

// POST /api/ai/generate-plan
router.post('/generate-plan', async (req: Request, res: Response) => {
  const { stories } = req.body;
  if (!stories || !Array.isArray(stories) || stories.length === 0) {
    return res.status(400).json({ error: 'stories array is required' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  try {
    const plan = await generateTestPlan(stories);
    res.json({ plan });
  } catch (err: any) {
    console.error('OpenAI plan gen error:', err.message);
    res.status(500).json({ error: 'Failed to generate test plan', details: err.message });
  }
});

// POST /api/ai/generate-cases
router.post('/generate-cases', async (req: Request, res: Response) => {
  const { story } = req.body;
  if (!story) {
    return res.status(400).json({ error: 'story object is required' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  try {
    const testCases = await generateTestCases(story);
    res.json({ testCases });
  } catch (err: any) {
    console.error('OpenAI case gen error:', err.message);
    res.status(500).json({ error: 'Failed to generate test cases', details: err.message });
  }
});

// POST /api/ai/generate-code
router.post('/generate-code', async (req: Request, res: Response) => {
  const { testCase, framework } = req.body;
  if (!testCase || !framework) {
    return res.status(400).json({ error: 'testCase and framework are required' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  try {
    const code = await generateAutomationCode(testCase, framework);
    res.json({ code });
  } catch (err: any) {
    console.error('OpenAI code gen error:', err.message);
    res.status(500).json({ error: 'Failed to generate code', details: err.message });
  }
});

export default router;
