import sql from './db';
import { decrypt } from './encryption';

export async function getUserIntegrations(userId: string) {
  const result = await sql`SELECT * FROM user_integrations WHERE user_id = ${userId}`;
  const config = result.rows[0];

  let llmApiKey: string | null = null;
  let llmProvider = 'Groq';

  if (config) {
    llmProvider = config.llm_provider || 'Groq';

    if (config.llm_api_key_encrypted) {
      try { llmApiKey = decrypt(config.llm_api_key_encrypted); } catch(e){}
    }
  }

  // Fall back to env var so local .env setup works out of the box
  if (!llmApiKey && process.env.OPENAI_API_KEY) {
    llmApiKey = process.env.OPENAI_API_KEY;
  }

  let jiraConfig = null;
  if (config?.jira_config_encrypted) {
    try { jiraConfig = JSON.parse(decrypt(config.jira_config_encrypted)); }
    catch (e: any) { console.error('[configService] Failed to decrypt jira_config:', e.message); }
  }

  let adoConfig = null;
  if (config?.ado_config_encrypted) {
    try { adoConfig = JSON.parse(decrypt(config.ado_config_encrypted)); }
    catch (e: any) { console.error('[configService] Failed to decrypt ado_config — encryption key mismatch? Error:', e.message); }
  }

  return {
    llmProvider,
    llmApiKey,
    jiraConfig,
    adoConfig
  };
}
