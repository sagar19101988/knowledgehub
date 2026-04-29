import { Router } from 'express';
import sql from '../services/db';
import { encrypt, decrypt } from '../services/encryption';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// POST /api/config/integrations — save encrypted integrations to DB
router.post('/integrations', requireAuth, async (req: any, res: any) => {
  try {
    const { llmProvider, llmApiKey, jiraConfig, adoConfig } = req.body;
    const userId = req.user.userId;

    const encryptedLlmKey = llmApiKey ? encrypt(llmApiKey) : null;
    const encryptedJira   = jiraConfig ? encrypt(JSON.stringify(jiraConfig)) : null;
    const encryptedAdo    = adoConfig  ? encrypt(JSON.stringify(adoConfig))  : null;

    // UPSERT: create row if it doesn't exist, otherwise update in place.
    // A plain UPDATE would silently affect 0 rows for newly-registered users
    // whose row hasn't been inserted yet, causing credentials to be lost.
    await sql`
      INSERT INTO user_integrations (user_id, llm_provider, llm_api_key_encrypted, jira_config_encrypted, ado_config_encrypted)
      VALUES (${userId}, ${llmProvider}, ${encryptedLlmKey}, ${encryptedJira}, ${encryptedAdo})
      ON CONFLICT (user_id) DO UPDATE SET
        llm_provider          = EXCLUDED.llm_provider,
        llm_api_key_encrypted = EXCLUDED.llm_api_key_encrypted,
        jira_config_encrypted = EXCLUDED.jira_config_encrypted,
        ado_config_encrypted  = EXCLUDED.ado_config_encrypted
    `;

    res.json({ message: 'Integrations securely encrypted and saved.' });
  } catch (error) {
    console.error('Config save error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/config/integrations/status — whether keys are configured (no raw keys returned)
router.get('/integrations/status', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const result = await sql`SELECT * FROM user_integrations WHERE user_id = ${userId}`;
    const config = result.rows[0] || {};
    res.json({
      hasLlmKey:   !!config.llm_api_key_encrypted,
      llmProvider: config.llm_provider || 'Groq',
      hasJira:     !!config.jira_config_encrypted,
      hasAdo:      !!config.ado_config_encrypted,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/config/integrations/details — return non-sensitive config details (URLs, project names)
// Tokens/keys are NEVER returned. This lets the frontend restore form fields on reload.
router.get('/integrations/details', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const result = await sql`SELECT * FROM user_integrations WHERE user_id = ${userId}`;
    const config = result.rows[0];

    if (!config) return res.json({ llmProvider: 'Groq', jiraConfig: null, adoConfig: null });

    let jiraConfig = null;
    let adoConfig  = null;

    if (config.jira_config_encrypted) {
      try {
        const full = JSON.parse(decrypt(config.jira_config_encrypted));
        // Return non-sensitive fields only
        jiraConfig = { url: full.url, projectOrOrg: full.projectOrOrg, authId: full.authId };
      } catch (e) {}
    }

    if (config.ado_config_encrypted) {
      try {
        const full = JSON.parse(decrypt(config.ado_config_encrypted));
        // Return non-sensitive fields only
        adoConfig = { url: full.url, projectOrOrg: full.projectOrOrg, authId: full.authId };
      } catch (e) {}
    }

    res.json({
      llmProvider: config.llm_provider || 'Groq',
      jiraConfig,
      adoConfig,
    });
  } catch (error) {
    console.error('Config details error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
