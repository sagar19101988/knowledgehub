import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Search, CheckSquare, Square, ExternalLink, Zap } from 'lucide-react';
import type { Story } from '../types';

export default function StoriesPage() {
  const { settings, stories, addStories, setCurrentPage } = useAppStore();
  const [source, setSource] = useState<'jira' | 'azure'>('jira');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleFetch = async () => {
    setLoading(true);
    // Simulate API delay for prototype.
    // In production, you would fetch from Jira/Azure DevOps REST APIs.
    setTimeout(() => {
      const mockStories: Story[] = [
        { id: `${source.toUpperCase()}-101`, title: 'User Login via OAuth', description: 'As a user, I want to login using Google OAuth.', priority: 'High', status: 'To Do', storyPoints: 5, source },
        { id: `${source.toUpperCase()}-102`, title: 'Shopping Cart Checkout', description: 'Implement the final checkout flow including payment gateway integration.', priority: 'High', status: 'In Progress', storyPoints: 8, source },
        { id: `${source.toUpperCase()}-103`, title: 'Email Notifications on Order', description: 'Send an email receipt when purchase is completed.', priority: 'Medium', status: 'To Do', storyPoints: 3, source },
      ];
      addStories(mockStories);
      setLoading(false);
    }, 1500);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleGeneratePlans = () => {
    // We could store the selected stories somewhere or immediately transition to the Plans page
    setCurrentPage('plans');
  };

  const filteredStories = stories
    .filter(s => s.source === source)
    .filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-100 flex items-center gap-3">
            <BookOpen className="text-primary" /> User Stories
          </h1>
          <p className="text-gray-400">Import and manage stories from your project management tools.</p>
        </div>
        
        <div className="flex bg-dark-700 p-1 rounded-lg border border-dark-600">
          <button onClick={() => setSource('jira')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${source === 'jira' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>Jira</button>
          <button onClick={() => setSource('azure')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${source === 'azure' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>Azure DevOps</button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-dark-800 p-4 rounded-xl border border-dark-600 shadow-md">
        <button 
          onClick={handleFetch} 
          disabled={loading || (source === 'jira' && !settings.jira?.url) || (source === 'azure' && !settings.azureDevOps?.url)}
          className="bg-dark-600 hover:bg-dark-500 disabled:opacity-50 text-gray-200 px-4 py-2 rounded font-medium text-sm flex items-center gap-2 border border-dark-500 transition-colors"
        >
          {loading ? <span className="animate-pulse">Fetching...</span> : 'Fetch User Stories'}
        </button>
        
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search stories..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-dark-600 rounded pl-9 pr-3 py-2 text-sm focus:border-primary text-gray-200"
          />
        </div>

        <div className="flex-1"></div>

        <button 
          onClick={handleGeneratePlans}
          disabled={selectedIds.size === 0}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-dark-900 px-6 py-2 rounded font-bold text-sm shadow-[0_0_10px_rgba(0,212,255,0.3)] transition-all flex items-center gap-2"
        >
          <Zap size={16} /> Generate Test Plan ({selectedIds.size})
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-dark-800 rounded-xl border border-dark-600 shadow-lg p-2">
        {filteredStories.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-3">
            <BookOpen size={48} className="opacity-20" />
            <p>No stories found. Try fetching from {source === 'jira' ? 'Jira' : 'Azure DevOps'}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-2">
            {filteredStories.map(story => {
              const isSelected = selectedIds.has(story.id);
              return (
                <div 
                  key={story.id} 
                  onClick={() => toggleSelect(story.id)}
                  className={`relative p-4 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(0,212,255,0.1)]' : 'bg-dark-900 border-dark-600 hover:border-gray-500'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-bold text-gray-400 bg-dark-700 px-2 py-0.5 rounded">{story.id}</span>
                    {isSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} className="text-gray-600" />}
                  </div>
                  <h3 className="font-semibold text-gray-200 mb-2 line-clamp-2">{story.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-3">{story.description}</p>
                  <div className="flex justify-between items-center text-xs mt-auto">
                    <span className={`px-2 py-1 rounded ${story.priority === 'High' ? 'bg-red-900/30 text-red-400' : story.priority === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-gray-800 text-gray-400'}`}>{story.priority}</span>
                    <span className="text-gray-500 flex items-center gap-1"><ExternalLink size={12}/> {story.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
