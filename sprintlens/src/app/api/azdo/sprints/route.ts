import { NextResponse } from 'next/server';
import { AzDOClient } from '@/lib/azdo/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgUrl = searchParams.get('orgUrl');
    const pat = searchParams.get('pat');
    const project = searchParams.get('project');
    const team = searchParams.get('team');

    if (!orgUrl || !pat || !project || !team) {
      return NextResponse.json({ error: 'Missing required configuration parameters' }, { status: 400 });
    }

    const client = new AzDOClient({ orgUrl, pat, project, team });
    const isReady = await client.testConnection();

    if (!isReady) {
      return NextResponse.json({ error: 'Unauthorized to access Azure DevOps' }, { status: 401 });
    }

    const coreApi = await client.getCoreApi();

    // In a real application, we'd use getCoreApi or workApi to list sprints/iterations.
    // Since this is a scaffolding shell, we return a mock success structure.
    return NextResponse.json({ 
      success: true, 
      sprints: [
        { id: "sprint-14", name: "Sprint 14", attributes: { startDate: "2024-10-12", finishDate: "2024-10-26" } }
      ] 
    });
  } catch (error: any) {
    console.error('AzDO Sprints Error:', error);
    return NextResponse.json({ error: error.message || 'Error fetching sprints' }, { status: 500 });
  }
}
