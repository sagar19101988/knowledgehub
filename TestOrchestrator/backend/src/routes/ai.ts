import { Router, Response } from 'express';
import { generateTestPlan, generateTestCases, generateAutomationCode, getAiClientExported } from '../services/openaiService';
import { requireAuth } from '../middleware/authMiddleware';
import { getUserIntegrations } from '../services/configService';

const router = Router();

// POST /api/ai/test-connection — validate LLM credentials using the /models endpoint (no tokens consumed)
router.post('/test-connection', requireAuth, async (req: any, res: Response) => {
  const { llmProvider, llmApiKey } = req.body;
  if (!llmProvider) return res.status(400).json({ error: 'llmProvider is required' });

  const key = (llmApiKey || '').trim();

  // Local providers don't need a key
  if (llmProvider === 'Ollama' || llmProvider === 'LM Studio') {
    return res.json({ ok: true, message: `${llmProvider} is a local provider — no API key needed.` });
  }

  if (!key) {
    return res.status(400).json({ error: 'API Key is required for this provider.' });
  }

  // Key format hints (skip for Gemini which has no standard prefix)
  const formatErrors: Record<string, string> = {
    'Groq':   key.startsWith('gsk_') ? '' : 'Groq keys should start with "gsk_". Check you copied the full key.',
    'OpenAI': key.startsWith('sk-')  ? '' : 'OpenAI keys start with "sk-".',
    'Claude': key.startsWith('sk-ant-') ? '' : 'Claude keys start with "sk-ant-".',
  };
  const formatErr = formatErrors[llmProvider];
  if (formatErr) return res.status(400).json({ error: `Key format looks wrong: ${formatErr}` });

  // Diagnostic log — shows key prefix/suffix only, never the full key
  const keyPreview = key.length > 12 ? `${key.slice(0, 8)}...${key.slice(-4)}` : '(too short)';
  console.log(`[AI Test] Provider=${llmProvider} | Key=${keyPreview} | Length=${key.length}`);

  const baseURLs: Record<string, string> = {
    'Groq':   'https://api.groq.com/openai/v1',
    'OpenAI': 'https://api.openai.com/v1',
    'Claude': 'https://api.anthropic.com/v1',
    'Gemini': 'https://generativelanguage.googleapis.com/v1beta',
  };

  try {
    const axios = (await import('axios')).default;
    const baseUrl = baseURLs[llmProvider] || 'https://api.openai.com/v1';

    let response: any;
    if (llmProvider === 'Claude') {
      response = await axios.get(`${baseUrl}/models`, {
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' }
      });
    } else if (llmProvider === 'Gemini') {
      response = await axios.get(`${baseUrl}/models?key=${key}`);
    } else {
      response = await axios.get(`${baseUrl}/models`, {
        headers: { Authorization: `Bearer ${key}` }
      });
    }

    console.log(`[AI Test] SUCCESS for ${llmProvider} — ${response.data?.data?.length ?? '?'} models available`);
    res.json({ ok: true, message: `${llmProvider} connection verified. ${response.data?.data?.length ?? ''} models available.` });
  } catch (err: any) {
    const status = err?.response?.status;
    const rawGroqErr = err?.response?.data;
    const msg = rawGroqErr?.error?.message || rawGroqErr?.message || err.message;

    // Log full Groq error to backend console for debugging
    console.error(`[AI Test] FAILED for ${llmProvider} | Status=${status} | Key=${keyPreview}`);
    console.error(`[AI Test] Raw error from provider:`, JSON.stringify(rawGroqErr, null, 2));

    if (status === 401) {
      return res.status(400).json({
        error: `API key rejected by ${llmProvider} (401). The key "${keyPreview}" is invalid or has been revoked. Generate a fresh one at console.groq.com/keys`,
        detail: msg
      });
    }
    if (status === 403) {
      return res.status(400).json({ error: `Access denied by ${llmProvider} (403): ${msg}` });
    }
    res.status(400).json({ error: `Connection to ${llmProvider} failed (HTTP ${status ?? 'network error'}): ${msg}` });
  }
});

// POST /api/ai/generate-plan
router.post('/generate-plan', requireAuth, async (req: any, res: Response) => {
  const { stories } = req.body;
  if (!stories || !Array.isArray(stories) || stories.length === 0) {
    return res.status(400).json({ error: 'stories array is required' });
  }
  
  const integrations = await getUserIntegrations(req.user.userId);
  if (!integrations?.llmApiKey && integrations?.llmProvider !== 'Ollama' && integrations?.llmProvider !== 'LM Studio') {
    return res.status(500).json({ error: 'LLM API key not configured in integrations' });
  }

  try {
    const plan = await generateTestPlan(stories, integrations.llmProvider, integrations.llmApiKey || '');
    res.json({ plan });
  } catch (err: any) {
    console.error('OpenAI plan gen error:', err.message);
    res.status(500).json({ error: 'Failed to generate test plan', details: err.message });
  }
});

// POST /api/ai/generate-cases
router.post('/generate-cases', requireAuth, async (req: any, res: Response) => {
  const { story } = req.body;
  if (!story) {
    return res.status(400).json({ error: 'story object is required' });
  }
  
  const integrations = await getUserIntegrations(req.user.userId);
  if (!integrations?.llmApiKey && integrations?.llmProvider !== 'Ollama' && integrations?.llmProvider !== 'LM Studio') {
    return res.status(500).json({ error: 'LLM API key not configured in integrations' });
  }

  try {
    const testCases = await generateTestCases(story, integrations.llmProvider, integrations.llmApiKey || '');
    res.json({ testCases });
  } catch (err: any) {
    console.error('OpenAI case gen error:', err.message);
    res.status(500).json({ error: 'Failed to generate test cases', details: err.message });
  }
});

// POST /api/ai/generate-code
router.post('/generate-code', requireAuth, async (req: any, res: Response) => {
  const { testCase, framework } = req.body;
  if (!testCase || !framework) {
    return res.status(400).json({ error: 'testCase and framework are required' });
  }

  const integrations = await getUserIntegrations(req.user.userId);
  if (!integrations?.llmApiKey && integrations?.llmProvider !== 'Ollama' && integrations?.llmProvider !== 'LM Studio') {
    return res.status(500).json({ error: 'LLM API key not configured in integrations' });
  }

  try {
    const code = await generateAutomationCode(testCase, framework, integrations.llmProvider, integrations.llmApiKey || '');
    res.json({ code });
  } catch (err: any) {
    console.error('OpenAI code gen error:', err.message);
    res.status(500).json({ error: 'Failed to generate code', details: err.message });
  }
});

export default router;
