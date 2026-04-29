import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  BookOpen, Search, CheckSquare, Square, ExternalLink,
  Zap, AlertCircle, RefreshCw, Settings, Hash, X, ArrowRight,
  Loader2, ChevronRight, Tag, User, BarChart2, FileText, CheckCircle
} from 'lucide-react';
import axios from 'axios';

interface Story {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria?: string;
  priority: string;
  status: string;
  workItemType?: string;
  storyPoints: number;
  assignee?: string | null;
  source: 'jira' | 'azure';
}

function DetailPanel({ story, onClose, onSelect, isSelected }: {
  story: Story;
  onClose: () => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  const priorityColor =
    story.priority === 'Critical' ? 'text-red-400 bg-red-900/20 border-red-700/40' :
    story.priority === 'High'     ? 'text-orange-400 bg-orange-900/20 border-orange-700/40' :
    story.priority === 'Medium'   ? 'text-amber-400 bg-amber-900/20 border-amber-700/40' :
                                    'text-gray-400 bg-gray-800 border-gray-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-dark-800 border border-dark-500 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-dark-600">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-primary/80 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-bold">{story.id}</span>
              {story.workItemType && (
                <span className="text-xs text-gray-500 bg-dark-700 border border-dark-500 px-2 py-0.5 rounded">{story.workItemType}</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-100 mt-2">{story.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 ml-4 shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-dark-600">
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${priorityColor}`}>
            <BarChart2 size={11} /> {story.priority}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-dark-700 border border-dark-600 px-3 py-1 rounded-full">
            <Tag size={11} /> {story.status}
          </span>
          {story.assignee && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-dark-700 border border-dark-600 px-3 py-1 rounded-full">
              <User size={11} /> {story.assignee}
            </span>
          )}
          {story.storyPoints > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-dark-700 border border-dark-600 px-3 py-1 rounded-full">
              <ChevronRight size={11} /> {story.storyPoints} pts
            </span>
          )}
        </div>

        {/* Description */}
        <div className="px-6 py-4 border-b border-dark-600">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText size={12} /> Description
          </h3>
          {story.description ? (
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{story.description}</p>
          ) : (
            <p className="text-sm text-gray-600 italic">No description provided.</p>
          )}
        </div>

        {/* Acceptance Criteria */}
        {story.acceptanceCriteria && (
          <div className="px-6 py-4 border-b border-dark-600">
            <h3 className="text-xs font-bold text-green-500/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle size={12} /> Acceptance Criteria
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{story.acceptanceCriteria}</p>
          </div>
        )}

        {/* Action */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-dark-500 rounded-lg transition-colors">
            Close
          </button>
          <button
            onClick={() => { onSelect(story.id); onClose(); }}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
              isSelected
                ? 'bg-dark-600 text-gray-300 border border-primary/30 hover:border-red-500/50 hover:text-red-400'
                : 'bg-primary text-dark-900 hover:bg-primary/90 shadow-[0_0_10px_rgba(0,212,255,0.3)]'
            }`}
          >
            {isSelected ? <><X size={14} /> Deselect</> : <><CheckSquare size={14} /> Select for Test Plan</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoriesPage() {
  const { stories, setStories, setCurrentPage, token } = useAppStore();
  const [source, setSource] = useState<'jira' | 'azure'>('azure');

  const [pbiId, setPbiId]           = useState('');
  const [pbiLoading, setPbiLoading] = useState(false);
  const [pbiError, setPbiError]     = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError]     = useState<string | null>(null);
  const [rawFields, setRawFields]   = useState<Record<string, any> | null>(null);

  const [search, setSearch]           = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailStory, setDetailStory] = useState<Story | null>(null);

  const [dbConfig, setDbConfig] = useState<{
    adoConfig: { url: string; projectOrOrg: string } | null;
    jiraConfig: { url: string; projectOrOrg: string } | null;
  }>({ adoConfig: null, jiraConfig: null });

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token || token === 'null') return;
    axios.get('/api/config/integrations/details', { headers: authHeaders })
      .then(res => setDbConfig({ adoConfig: res.data.adoConfig, jiraConfig: res.data.jiraConfig }))
      .catch(() => {});
  }, [token]);

  const handleFetchById = async () => {
    const trimmed = pbiId.trim().replace(/^ADO-/i, '');
    if (!trimmed || isNaN(Number(trimmed))) {
      setPbiError('Please enter a valid numeric PBI ID (e.g. 1017176).');
      return;
    }
    setPbiError(null);
    setPbiLoading(true);
    try {
      const res = await axios.get(`/api/azure/workitem/${trimmed}`, { headers: authHeaders });
      const s = res.data.story;
      const raw = res.data.rawFields || {};
      setRawFields(raw);

      // Log raw fields to browser console for debugging
      console.log('[Azure Debug] Raw fields from TFS:', raw);

      const story: Story = {
        id: s.key,
        title: s.summary || s.title || '(No Title)',
        description: s.description || '',
        acceptanceCriteria: s.acceptanceCriteria || '',
        priority: s.priority || 'Medium',
        status: s.status || 'Unknown',
        workItemType: s.workItemType,
        storyPoints: s.storyPoints || 0,
        assignee: s.assignee || null,
        source: 'azure',
      };
      setStories([...stories.filter(e => e.id !== story.id), story]);
      setPbiId('');
      setDetailStory(story);
    } catch (err: any) {
      setPbiError(err.response?.data?.error || err.message || 'Failed to fetch PBI.');
    } finally {
      setPbiLoading(false);
    }
  };

  const handleBulkFetch = async () => {
    setBulkError(null);
    setBulkLoading(true);
    try {
      const endpoint = source === 'azure' ? '/api/azure/stories' : '/api/jira/stories';
      const response = await axios.get(endpoint, { headers: authHeaders });
      const raw = response.data.stories || [];
      if (raw.length === 0) {
        setBulkError(`No active work items found. Try looking up a specific PBI by ID instead.`);
        return;
      }
      const fetched: Story[] = raw.map((s: any) => ({
        id: s.key, title: s.summary || 'Untitled', description: s.description || '',
        acceptanceCriteria: s.acceptanceCriteria || '',
        priority: s.priority || 'Medium', status: s.status || 'Unknown',
        workItemType: s.workItemType, storyPoints: s.storyPoints || 0,
        assignee: s.assignee || null, source,
      }));
      setStories([...stories.filter(s => s.source !== source), ...fetched]);
      setSelectedIds(new Set());
    } catch (err: any) {
      setBulkError(err.response?.data?.error || err.message);
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const filteredStories = stories
    .filter(s => s.source === source)
    .filter(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
    );

  const currentConfig = source === 'azure' ? dbConfig.adoConfig : dbConfig.jiraConfig;

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-gray-100 flex items-center gap-3">
            <BookOpen className="text-primary" /> User Stories
          </h1>
          <p className="text-gray-400 text-sm">Fetch PBIs by ID or load all active stories, then generate test plans.</p>
        </div>
        <div className="flex bg-dark-700 p-1 rounded-lg border border-dark-600">
          <button onClick={() => { setSource('jira'); setBulkError(null); setPbiError(null); }} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${source === 'jira' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>Jira</button>
          <button onClick={() => { setSource('azure'); setBulkError(null); setPbiError(null); }} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${source === 'azure' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>Azure DevOps</button>
        </div>
      </div>

      {/* Connection banner */}
      {currentConfig?.url ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-green-400 text-xs">
          <CheckSquare size={14} className="shrink-0" />
          Connected to <strong className="mx-1">{currentConfig.url}</strong> — Project: <strong className="ml-1">{currentConfig.projectOrOrg}</strong>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
          <AlertCircle size={16} />
          <span>Not configured. <button onClick={() => setCurrentPage('integrations')} className="underline font-semibold inline-flex items-center gap-1"><Settings size={12} /> Integrations</button> → fill in details → Save All Configurations.</span>
        </div>
      )}

      {/* Primary: fetch by ID */}
      <div className="bg-dark-800 border border-primary/30 rounded-xl p-5 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
        <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-2"><Hash size={13} /> Fetch Specific PBI by ID</h2>
        <p className="text-xs text-gray-500 mb-4">Enter the numeric Azure DevOps work item ID. The PBI will load and open for review.</p>
        <div className="flex gap-3 items-start">
          <div className="relative flex-1 max-w-xs">
            <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text" placeholder="e.g. 1017176"
              value={pbiId}
              onChange={e => { setPbiId(e.target.value.replace(/[^0-9]/g, '')); setPbiError(null); }}
              onKeyDown={e => e.key === 'Enter' && handleFetchById()}
              className="w-full bg-dark-900 border border-dark-500 focus:border-primary rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-200 outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleFetchById}
            disabled={pbiLoading || !pbiId.trim()}
            className="bg-primary hover:bg-primary/90 disabled:opacity-40 text-dark-900 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-[0_0_10px_rgba(0,212,255,0.3)] transition-all"
          >
            {pbiLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            {pbiLoading ? 'Fetching...' : 'Fetch PBI'}
          </button>
        </div>
        {pbiError && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle size={14} /> {pbiError}
          </div>
        )}
      </div>

      {/* Secondary: bulk + search + generate */}
      <div className="flex items-center gap-3 bg-dark-800 p-3 rounded-xl border border-dark-600">
        <button onClick={handleBulkFetch} disabled={bulkLoading} className="bg-dark-600 hover:bg-dark-500 disabled:opacity-50 text-gray-300 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-dark-500">
          {bulkLoading ? <><Loader2 size={13} className="animate-spin" /> Fetching...</> : <><RefreshCw size={13} /> Fetch All Active</>}
        </button>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search loaded stories..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-200 focus:border-primary outline-none" />
        </div>
        <div className="flex-1" />
        <button onClick={() => setCurrentPage('plans')} disabled={selectedIds.size === 0}
          className="bg-primary hover:bg-primary/90 disabled:opacity-40 text-dark-900 px-5 py-2 rounded-lg font-bold text-sm shadow-[0_0_10px_rgba(0,212,255,0.3)] flex items-center gap-2">
          <Zap size={14} /> Generate Test Plan ({selectedIds.size})
        </button>
      </div>

      {bulkError && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" /> <span>{bulkError}</span>
        </div>
      )}

      {/* Story cards */}
      <div className="flex-1 overflow-auto bg-dark-800 rounded-xl border border-dark-600 min-h-[200px] p-2">
        {filteredStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 space-y-2 py-14">
            <BookOpen size={40} className="opacity-20" />
            <p className="text-sm">Enter a PBI ID above and click <strong className="text-gray-400">Fetch PBI</strong> to load it.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-2">
            {filteredStories.map(story => {
              const isSelected = selectedIds.has(story.id);
              return (
                <div key={story.id} className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${isSelected ? 'bg-primary/10 border-primary shadow-[0_0_12px_rgba(0,212,255,0.12)]' : 'bg-dark-900 border-dark-600 hover:border-gray-500'}`}>
                  {/* Checkbox area */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono font-bold text-primary/80 bg-primary/5 border border-primary/20 px-2 py-0.5 rounded">{story.id}</span>
                      {story.workItemType && <span className="text-[10px] text-gray-500">{story.workItemType}</span>}
                    </div>
                    <button onClick={() => toggleSelect(story.id)} className="ml-2 shrink-0">
                      {isSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} className="text-gray-600 group-hover:text-gray-400" />}
                    </button>
                  </div>

                  {/* Title — click to open detail */}
                  <h3 onClick={() => setDetailStory(story)} className="font-semibold text-gray-100 mb-2 text-sm hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {story.title}
                  </h3>

                  {story.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{story.description}</p>
                  )}

                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-0.5 rounded font-medium ${story.priority === 'High' || story.priority === 'Critical' ? 'bg-red-900/30 text-red-400' : story.priority === 'Medium' ? 'bg-amber-900/30 text-amber-400' : 'bg-gray-800 text-gray-400'}`}>
                      {story.priority}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1"><ExternalLink size={11} /> {story.status}</span>
                  </div>

                  {/* View details link */}
                  <button onClick={() => setDetailStory(story)} className="mt-3 text-[11px] text-primary/60 hover:text-primary flex items-center gap-1 transition-colors w-full">
                    <ChevronRight size={12} /> View full details
                  </button>

                  {/* Remove */}
                  <button onClick={e => { e.stopPropagation(); setStories(stories.filter(s => s.id !== story.id)); setSelectedIds(prev => { const n = new Set(prev); n.delete(story.id); return n; }); }}
                    className="absolute top-3 right-3 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail panel modal */}
      {detailStory && (
        <DetailPanel
          story={detailStory}
          onClose={() => setDetailStory(null)}
          onSelect={toggleSelect}
          isSelected={selectedIds.has(detailStory.id)}
        />
      )}
    </div>
  );
}
