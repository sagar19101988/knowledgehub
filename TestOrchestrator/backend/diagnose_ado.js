const { neon } = require('@neondatabase/serverless');
const { decrypt } = require('./src/services/encryption');
const axios = require('axios');
require('dotenv').config();

const sql = neon(process.env.POSTGRES_URL);

async function main() {
  // Get the stored ADO config for Sagar's account
  const rows = await sql`SELECT ado_config_encrypted FROM user_integrations WHERE user_id = '0df6596f-b80e-442d-8e79-0a39c96855ef'`;
  if (!rows[0]?.ado_config_encrypted) {
    console.log('No ADO config found in DB');
    return;
  }

  const adoConfig = JSON.parse(decrypt(rows[0].ado_config_encrypted));
  console.log('ADO URL:', adoConfig.url);
  console.log('ADO Project:', adoConfig.projectOrOrg);

  const cleanUrl = adoConfig.url.replace(/\/$/, '');
  const auth = `Basic ${Buffer.from(`:${adoConfig.token}`).toString('base64')}`;

  const testId = 1017176;

  // Try fetching the raw item
  for (const url of [
    `${cleanUrl}/_apis/wit/workitems/${testId}?api-version=7.0`,
    `${cleanUrl}/_apis/wit/workitems/${testId}?$expand=all&api-version=7.0`,
    `${cleanUrl}/_apis/wit/workitems/${testId}?$expand=all`,
  ]) {
    try {
      console.log(`\nTrying: ${url}`);
      const resp = await axios.get(url, { headers: { Authorization: auth }, timeout: 15000 });
      const data = resp.data;
      console.log('Response type:', typeof data);
      console.log('Keys:', Object.keys(data || {}).slice(0, 30));
      console.log('Has fields?', !!data.fields);
      console.log('fields type:', typeof data.fields);
      if (data.fields) {
        console.log('fields keys:', Object.keys(data.fields).slice(0, 20));
        console.log('System.Title:', data.fields['System.Title']);
        console.log('System.State:', data.fields['System.State']);
        console.log('System.Description:', data.fields['System.Description']?.substring(0, 100));
        console.log('AcceptanceCriteria:', data.fields['Microsoft.VSTS.Common.AcceptanceCriteria']?.substring(0, 100));
      } else {
        // Maybe fields are at top level or array
        console.log('Full raw (first 1000 chars):', JSON.stringify(data).substring(0, 1000));
      }
      break; // stop on first success
    } catch (e) {
      console.log(`  Error: HTTP ${e?.response?.status} — ${e?.response?.data?.message || e.message}`);
    }
  }
}

main().catch(e => console.error('Fatal:', e.message));
