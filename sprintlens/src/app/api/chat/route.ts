import { streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { POST as getDashboardData } from '../azdo/dashboard/route';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, providerId, modelId, apiKey, dataContext, availableSprints, azdoConfig, baseUrl } = await req.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is missing.' }), { status: 401 });
    }

    let model: any;

    if (providerId === 'openai') {
      const openai = createOpenAI({ apiKey });
      model = openai(modelId);
    } else if (providerId === 'anthropic') {
      const anthropic = createAnthropic({ apiKey });
      model = anthropic(modelId);
    } else if (providerId === 'google') {
      const google = createGoogleGenerativeAI({ apiKey });
      model = google(modelId);
    } else if (providerId === 'groq') {
      const groq = createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey });
      model = groq(modelId);
    } else {
      return new Response(JSON.stringify({ error: `Unsupported provider: ${providerId}` }), { status: 400 });
    }

    let systemPrompt = `You are SprintLens Agent, an elite engineering and Agile analytics assistant.
Your goal is to answer questions about the team's current active sprint, pull requests, and bottlenecks.
Be concise, analytical, and professional. Use markdown tables or lists when appropriate.`;

    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    
    // Deterministic pre-fetching: Bypasses unstable LLM tool-calling bugs (especially on Groq/Llama)
    let dynamicSprintData: any = null;
    let targetSprintMatch = null;
    
    if (availableSprints && availableSprints.length > 0) {
      for (const sprint of availableSprints) {
         // sprint might be 'SomeProject\Release 2\Sprint 1'
         const parts = sprint.split('\\');
         const shortName = parts[parts.length - 1]; // "Sprint 1"
         
         if (lastUserMessage.toLowerCase().includes(shortName.toLowerCase())) {
            targetSprintMatch = sprint;
            break;
         }
      }
    }

    if (targetSprintMatch) {
       try {
         const mockReq = new Request(typeof baseUrl === 'string' ? `${baseUrl}/api/azdo/dashboard` : 'http://localhost/api/azdo/dashboard', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ azdoConfig, targetSprint: targetSprintMatch })
         });
         const res = await getDashboardData(mockReq);
         if (res.ok) {
           const data = await res.json();
           const s = data.sprints?.[0];
           if (s) {
              dynamicSprintData = {
                sprintName: s.name || targetSprintMatch,
                summary: { totalTasks: s.taskCount || 0, done: s.taskDone || 0, estimatedHours: s.totalEstimatedHours || 0, completedHours: s.totalCompletedHours || 0, blocked: s.blocked || 0 },
                velocity: { aiAssisted: s.aiAnalytics?.avgHoursPerAITask, standard: s.aiAnalytics?.avgHoursPerStdTask, aiCount: s.aiAssistedTasks || 0 },
                prHealth: { activePRs: s.prAnalytics?.statusCounts?.active || 0, blockedTasks: s.prBlockedTasks || 0, avgCycleDays: s.prAnalytics?.avgCycleDays },
                teamAllocation: (s.resourceBreakdown || []).map((r: any) => ({ name: r.fullName, tasks: r.taskCount, tasksDone: r.taskDone, estimatedHours: r.estimated, actualHours: r.completed }))
              };
           }
         }
       } catch (err) {
         console.error('Failed to pre-fetch dynamic sprint:', err);
       }
    }

    // Prepare ground truth context
    const finalContext = dynamicSprintData ? JSON.stringify(dynamicSprintData) : dataContext;

    if (finalContext) {
      systemPrompt += `\n\n--- CURRENT TARGET SPRINT CONTEXT ---\nThe following JSON is the ground truth data for the sprint the user is inquiring about:\n${finalContext}\n-----------------------------`;
    }

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const result = streamText({
          model,
          system: systemPrompt,
          messages,
        });
        
        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });

  } catch (error: any) {
    console.error('[/api/chat] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Text generation failed.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
