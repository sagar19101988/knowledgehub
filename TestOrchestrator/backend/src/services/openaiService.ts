import OpenAI from 'openai';
import dotenv from 'dotenv';
import { JiraStory } from './jiraService';
dotenv.config();

// Helper to create OpenAI client dynamically based on provider
export function getAiClientExported(provider: string, apiKey: string) {
  let baseURL: string | undefined = undefined;
  
  if (provider === 'Groq') baseURL = 'https://api.groq.com/openai/v1';
  if (provider === 'LM Studio') baseURL = 'http://localhost:1234/v1';
  if (provider === 'Ollama') baseURL = 'http://localhost:11434/v1';

  // Use provided key, fall back to env var (supports dev .env setup)
  const resolvedKey = (apiKey && apiKey.trim().length > 5 ? apiKey.trim() : null)
    ?? process.env.OPENAI_API_KEY
    ?? 'dummy-key';

  return new OpenAI({ apiKey: resolvedKey, baseURL });
}

function getModel(provider: string) {
  if (provider === 'Groq') return 'llama-3.3-70b-versatile';  // Current flagship Groq model
  if (provider === 'Claude') return 'claude-3-5-haiku-20241022';
  if (provider === 'Gemini') return 'gemini-1.5-flash';
  if (provider === 'LM Studio' || provider === 'Ollama') return 'local-model';
  return 'gpt-4o-mini'; // OpenAI default (cost-effective)
}

// ─── Test Plan Generation ────────────────────────────────────────────────────
export async function generateTestPlan(stories: JiraStory[], provider: string, apiKey: string): Promise<any> {
  const openai = getAiClientExported(provider, apiKey);
  const model = getModel(provider);
  const storySummaries = stories.map(s => `- [${s.key}] ${s.summary}: ${s.description}`).join('\n');

  const prompt = `You are a senior QA architect. Based on the following Jira User Stories, generate a comprehensive Test Plan in JSON format.

User Stories:
${storySummaries}

Return a JSON object with these exact keys:
{
  "title": "Test Plan title",
  "version": "1.0",
  "scope": "What is in scope and out of scope",
  "objectives": ["objective 1", "objective 2", ...],
  "testStrategy": {
    "approach": "Overall approach",
    "testTypes": ["Unit", "Integration", "E2E", ...],
    "tools": ["Tool 1", "Tool 2", ...]
  },
  "entryCriteria": ["criterion 1", "criterion 2", ...],
  "exitCriteria": ["criterion 1", "criterion 2", ...],
  "risks": ["risk 1", "risk 2", ...],
  "schedule": "Estimated timeline"
}`;

  const response = await openai.chat.completions.create({
    model: model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content || '{}';
  return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
}

// ─── Test Cases Generation ───────────────────────────────────────────────────
export async function generateTestCases(story: JiraStory, provider: string, apiKey: string): Promise<any[]> {
  const openai = getAiClientExported(provider, apiKey);
  const model = getModel(provider);
  const prompt = `You are a senior QA engineer. Generate comprehensive test cases for the following Jira User Story.

Story ID: ${story.key}
Summary: ${story.summary}
Description: ${story.description}
Acceptance Criteria: ${story.acceptanceCriteria}

Return a JSON array of test cases. Each test case must have these EXACT keys:
[
  {
    "id": "TC-001",
    "storyKey": "${story.key}",
    "title": "Test case title",
    "preconditions": "What must be true before running",
    "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
    "expectedResult": "What should happen",
    "priority": "High|Medium|Low",
    "type": "Functional|Negative|Edge Case|Performance|Security",
    "status": "Draft"
  }
]

Generate at least 5 test cases covering happy path, negative cases, and edge cases.`;

  const response = await openai.chat.completions.create({
    model: model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  const content = response.choices[0].message.content || '[]';
  return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
}

// ─── Code Generation ─────────────────────────────────────────────────────────
export async function generateAutomationCode(
  testCase: any,
  framework: 'selenium-java' | 'playwright-typescript',
  provider: string,
  apiKey: string
): Promise<string> {
  const openai = getAiClientExported(provider, apiKey);
  const aiModel = getModel(provider);
  const isSelenium = framework === 'selenium-java';

  const prompt = `You are a senior test automation engineer. Generate ${isSelenium ? 'Selenium Java' : 'Playwright TypeScript'} automation code for this test case.

Test Case:
- Title: ${testCase.title}
- Preconditions: ${testCase.preconditions}
- Steps: ${testCase.steps.join(' | ')}
- Expected Result: ${testCase.expectedResult}
- Type: ${testCase.type}

Requirements:
${isSelenium ? `
- Use Page Object Model pattern
- Include proper imports (WebDriver, ChromeDriver, WebDriverWait, ExpectedConditions)
- Use JUnit 5 annotations (@Test, @BeforeEach, @AfterEach)
- Include proper assertions with Assert class
- Add meaningful comments
` : `
- Use Page Object Model pattern  
- Include proper imports from @playwright/test
- Use test() and expect() from Playwright
- Include proper locators (getByRole, getByText, locator)
- Add meaningful comments
`}

Return ONLY the code, no explanation. Include full class/file structure.`;

  const response = await openai.chat.completions.create({
    model: aiModel,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  return response.choices[0].message.content || '// Error generating code';
}
