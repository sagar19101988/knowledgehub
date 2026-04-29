import { streamText } from 'ai';
import { getModel } from '@/lib/ai/gateway';
import { NextResponse } from 'next/server';
import { AzDOClient } from '@/lib/azdo/client';

export const maxDuration = 60; // Allow longer execution time for LLMs

export async function POST(req: Request) {
  try {
    const { messages, providerId, modelId, apiKey, azdoConfig } = await req.json();

    if (!providerId || !modelId) {
      return NextResponse.json({ error: 'providerId and modelId are required' }, { status: 400 });
    }

    const model = getModel(providerId, modelId, apiKey);
    
    // Auto-Context Injection Phase: Scope-Aware Connections
    let dynamicSystemContext = "You are the SprintLens Enterprise AI Agent. You strictly use evidence to answer.";
    if (azdoConfig?.orgUrl && azdoConfig?.pat) {
      const cleanUrl = azdoConfig.orgUrl.trim().replace(/\/+$/, '');
      const authHeader = `Basic ${Buffer.from(`:${azdoConfig.pat.trim()}`).toString('base64')}`;
      
      try {
        // Step 1: Prove the PAT works globally without triggering Scope bans
        const connectionTest = await fetch(`${cleanUrl}/_apis/connectionData`, {
            headers: { 'Authorization': authHeader }, cache: 'no-store'
        });
        
        if (!connectionTest.ok) {
           throw new Error(`HTTP ${connectionTest.status}: Root authentication failed. The token is entirely invalid.`);
        }

        // Step 2: Now try a WIQL query. Scope it tightly if the user defined a Team/Project Focus.
        let filterString = "";
        if (azdoConfig.team && azdoConfig.team.trim() !== '') {
           filterString = `WHERE [System.AreaPath] UNDER '${azdoConfig.team.trim()}' `;
        }
        const wiqlQuery = { query: `SELECT [System.Id], [System.Title], [System.State] FROM WorkItems ${filterString}ORDER BY [System.ChangedDate] DESC` };
        
        const wiqlResp = await fetch(`${cleanUrl}/_apis/wit/wiql?$top=5&api-version=6.0`, {
           method: 'POST',
           headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
           body: JSON.stringify(wiqlQuery),
           cache: 'no-store'
        });
        
        if (wiqlResp.ok) {
            const data = await wiqlResp.json();
            const ids = (data.workItems || data.results || []).map((w: any) => w.id).join(',');
            if (ids) {
                const detailResp = await fetch(`${cleanUrl}/_apis/wit/workitems?ids=${ids}&fields=System.Title,System.State&api-version=6.0`, {
                    headers: { 'Authorization': authHeader }
                });
                const detailData = await detailResp.json();
                dynamicSystemContext += `\n\nLIVE AZURE DEVOPS CONTEXT: Connected to ${cleanUrl}. Recent items: ${JSON.stringify(detailData.value.map((i:any) => ({ id: i.id, title: i.fields['System.Title'] } )))}`;
            } else {
                dynamicSystemContext += `\n\nLIVE AZURE DEVOPS CONTEXT: Connected to ${cleanUrl}, no items found.`;
            }
        } else if (wiqlResp.status === 401 || wiqlResp.status === 403) {
            // PAT is valid (passed Step 1) but WIQL is forbidden
            dynamicSystemContext += `\n\nLIVE AZURE DEVOPS CONTEXT: The user is authenticated securely against ${cleanUrl}. HOWEVER, their Enterprise security specifically blocks them from running global queries or listing all projects! If they ask to list projects or summarize sprints, tell them politely: "Your Enterprise Security Token is restricted. I cannot list global projects, but if you give me a specific Work Item ID (like 12345), I can analyze it for you!"`;
        }
      } catch (err: any) {
        dynamicSystemContext += `\n\nLIVE AZURE DEVOPS CONTEXT: The connection to Azure DevOps entirely failed: ${err.message}. The PAT or URL is totally invalid.`;
      }
    } else {
        dynamicSystemContext += "\n\nLIVE AZURE DEVOPS CONTEXT: No AzDO configuration provided.";
    }

    const result = await streamText({
      model: model,
      messages,
      system: dynamicSystemContext,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('LLM Stream Error:', error);
    return NextResponse.json({ error: error.message || 'Error communicating with AI Provider' }, { status: 500 });
  }
}
