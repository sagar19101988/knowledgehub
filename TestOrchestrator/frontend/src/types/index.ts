export type Page = 'integrations' | 'stories' | 'plans' | 'cases' | 'code';

export interface ProviderCredentials {
  url: string;
  projectOrOrg: string;
  authId: string; // Email for Jira
  token: string;
}

export interface Settings {
  llmProvider: string;
  llmApiKey: string;
  llmBaseUrl?: string; // used for custom endpoints like LM Studio
  jira: ProviderCredentials | null;
  azureDevOps: ProviderCredentials | null;
}

export interface Story {
  id: string; // Jira/ADO ID
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  status: string;
  storyPoints: number | string | null;
  source: 'jira' | 'azure';
}

export interface TestPlan {
  id: string;
  storyId: string;
  storyTitle: string;
  planName: string;
  creationDate: string;
  scope: string;
  objectives: string[];
  testStrategy: string;
  entryCriteria: string[];
  exitCriteria: string[];
  estimatedHours: number;
  riskAreas: string[];
}

export interface TestCase {
  id: string;
  planId: string;
  storyId: string;
  title: string;
  module: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Functional' | 'Regression' | 'Smoke' | 'E2E';
  status: 'Not Run' | 'Passed' | 'Failed';
  preconditions: string[];
  steps: { stepNumber: number; action: string; testData: string }[];
  expectedResult: string;
  actualResult?: string;
  automatable: boolean;
}
