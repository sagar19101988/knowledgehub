import type { Story, TestPlan, TestCase } from '../types';
import { useAppStore } from '../store/useAppStore';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const { settings } = useAppStore.getState();
  if (!settings.groqApiKey) {
    throw new Error('Groq API Key is missing. Please set it in Integrations.');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.groqApiKey}`
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192', // Fast and highly capable for JSON & Code
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2, // Low temperature for deterministic structures
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateTestPlanAI(story: Story): Promise<TestPlan> {
  const systemPrompt = 'You are a senior QA architect. Return ONLY valid JSON, no markdown blocks, no explanations.';
  const userPrompt = `Given this user story: ${story.title} — ${story.description}, generate a comprehensive test plan in JSON with these exact fields: planName, scope, objectives (array of strings), testStrategy, entryCriteria (array of strings), exitCriteria (array of strings), estimatedHours (number), riskAreas (array of strings).`;
  
  const text = await callGroq(systemPrompt, userPrompt);
  try {
    const parsed = JSON.parse(text.trim());
    return {
      id: crypto.randomUUID(),
      storyId: story.id,
      storyTitle: story.title,
      creationDate: new Date().toISOString(),
      ...parsed
    };
  } catch (e) {
    console.error("Failed JSON:", text);
    throw new Error('Failed to parse Groq JSON response for Test Plan');
  }
}

export async function generateTestCasesAI(story: Story, plan: TestPlan): Promise<TestCase[]> {
  const systemPrompt = 'You are a QA engineer. Return ONLY a valid JSON array of objects, no markdown formatting, no explanations.';
  const userPrompt = `Based on this test plan (${JSON.stringify(plan)}) and user story (${JSON.stringify(story)}), generate 5 test cases. Each test case must have: title, module, priority ("High"|"Medium"|"Low"), type ("Functional"|"Regression"|"Smoke"|"E2E"), preconditions (array of strings), steps (array of objects {stepNumber: number, action: string, testData: string}), expectedResult, automatable (boolean).`;

  const text = await callGroq(systemPrompt, userPrompt);
  try {
    const parsed = JSON.parse(text.trim());
    return parsed.map((tc: any) => ({
      id: `TC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      planId: plan.id,
      storyId: story.id,
      status: 'Not Run',
      ...tc
    }));
  } catch (e) {
    console.error("Failed JSON:", text);
    throw new Error('Failed to parse Groq JSON response for Test Cases');
  }
}

export async function generateAutomationCodeAI(testCase: TestCase, framework: string): Promise<string> {
  const systemPrompt = 'You are a senior test automation engineer. Return only raw code. Do not wrap in markdown boxes (e.g. ```java). No explanations.';
  const userPrompt = `Convert this test case into ${framework} code: ${JSON.stringify(testCase, null, 2)}. Use Page Object Model. Include imports, class structure, setup/teardown, and assertions. Add inline comments.`;

  const text = await callGroq(systemPrompt, userPrompt);
  return text.trim();
}
