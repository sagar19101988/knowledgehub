/**
 * api/backend.ts — Centralized API client for all backend calls.
 * All calls go through the backend (with JWT auth) — never directly to AI providers from the browser.
 */
import axios from 'axios';
import { useAppStore } from '../store/useAppStore';
import type { Story, TestPlan, TestCase } from '../types';

function getAuthHeaders() {
  const token = useAppStore.getState().token;
  return { Authorization: `Bearer ${token}` };
}

// ─── Test Plan Generation ─────────────────────────────────────────────────────
export async function generateTestPlanAI(story: Story): Promise<TestPlan> {
  const res = await axios.post('/api/ai/generate-plan', {
    stories: [{
      key: story.id,
      summary: story.title,
      description: story.description,
      acceptanceCriteria: '',
      status: story.status,
      priority: story.priority,
      assignee: null,
      storyPoints: story.storyPoints,
    }]
  }, { headers: getAuthHeaders() });

  const raw = res.data.plan;
  return {
    id: crypto.randomUUID(),
    storyId: story.id,
    storyTitle: story.title,
    creationDate: new Date().toISOString(),
    planName: raw.title || `Test Plan - ${story.title}`,
    scope: raw.scope || '',
    objectives: raw.objectives || [],
    testStrategy: raw.testStrategy?.approach || '',
    entryCriteria: raw.entryCriteria || [],
    exitCriteria: raw.exitCriteria || [],
    estimatedHours: 8,
    riskAreas: raw.risks || [],
  };
}

// ─── Test Cases Generation ────────────────────────────────────────────────────
export async function generateTestCasesAI(story: Story, _plan: TestPlan): Promise<TestCase[]> {
  const res = await axios.post('/api/ai/generate-cases', {
    story: {
      key: story.id,
      summary: story.title,
      description: story.description,
      acceptanceCriteria: '',
      status: story.status,
      priority: story.priority,
      assignee: null,
      storyPoints: story.storyPoints,
    }
  }, { headers: getAuthHeaders() });

  return (res.data.testCases || []).map((tc: any) => ({
    id: tc.id || `TC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    planId: _plan.id,
    storyId: story.id,
    title: tc.title,
    module: tc.type || 'Functional',
    priority: tc.priority || 'Medium',
    type: tc.type || 'Functional',
    status: 'Not Run' as const,
    preconditions: Array.isArray(tc.preconditions) ? [tc.preconditions] : (tc.preconditions ? [tc.preconditions] : []),
    steps: (tc.steps || []).map((step: string, i: number) => ({
      stepNumber: i + 1,
      action: step,
      testData: '',
    })),
    expectedResult: tc.expectedResult || '',
    automatable: true,
  }));
}

// ─── Automation Code Generation ───────────────────────────────────────────────
export async function generateAutomationCodeAI(testCase: TestCase, framework: string): Promise<string> {
  const fwMap: Record<string, string> = {
    'Playwright (TypeScript)': 'playwright-typescript',
    'Selenium (Java)': 'selenium-java',
    'Playwright (Python)': 'playwright-typescript',  // fallback
    'Selenium (Python)': 'selenium-java',             // fallback
  };
  const res = await axios.post('/api/ai/generate-code', {
    testCase,
    framework: fwMap[framework] || 'playwright-typescript',
  }, { headers: getAuthHeaders() });

  return res.data.code || '// Error generating code';
}
