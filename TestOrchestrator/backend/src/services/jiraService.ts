import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

function getAuthHeader(): string {
  return `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`;
}

export interface JiraStory {
  id: string;
  key: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;
  status: string;
  priority: string;
  assignee: string | null;
  storyPoints: number | null;
}

function extractText(doc: any): string {
  if (!doc) return '';
  if (typeof doc === 'string') return doc;
  if (doc.type === 'text') return doc.text || '';
  if (doc.content && Array.isArray(doc.content)) {
    return doc.content.map(extractText).join(' ');
  }
  return '';
}

export async function fetchJiraStories(projectKey: string, maxResults = 50): Promise<JiraStory[]> {
  const jql = `project = ${projectKey} AND issuetype = Story ORDER BY created DESC`;
  const url = `${JIRA_BASE_URL}/rest/api/3/search`;

  const response = await axios.get(url, {
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
    params: { jql, maxResults, fields: 'summary,description,customfield_10016,status,priority,assignee,customfield_10014' },
  });

  return response.data.issues.map((issue: any) => ({
    id: issue.id,
    key: issue.key,
    summary: issue.fields.summary,
    description: extractText(issue.fields.description),
    acceptanceCriteria: extractText(issue.fields.customfield_10014) || 'Not specified',
    status: issue.fields.status?.name || 'Unknown',
    priority: issue.fields.priority?.name || 'Medium',
    assignee: issue.fields.assignee?.displayName || null,
    storyPoints: issue.fields.customfield_10016 || null,
  }));
}
