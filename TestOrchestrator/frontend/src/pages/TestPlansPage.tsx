import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ClipboardList, ChevronDown, ChevronUp, Zap, Clock, ShieldAlert } from 'lucide-react';
import { generateTestPlanAI } from '../api/backend';

export default function TestPlansPage() {
  const { testPlans, addTestPlan, stories, setCurrentPage } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  // In a real flow, you'd pass selected stories from Stories page to here.
  // For demo, we just add a button to generate one from the first story if empty.
  const handleGenerate = async () => {
    if (stories.length === 0) {
      alert("Please fetch stories first.");
      setCurrentPage('stories');
      return;
    }
    const story = stories[0];
    setGeneratingFor(story.id);
    try {
      const plan = await generateTestPlanAI(story);
      addTestPlan(plan);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setGeneratingFor(null);
  };

  const handleGenerateCases = (planId: string) => {
    // Navigate to Test Cases page and generate
    setCurrentPage('cases');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-100 flex items-center gap-3">
            <ClipboardList className="text-warning" /> Test Plans
          </h1>
          <p className="text-gray-400">View and generate high-level test plans from user stories.</p>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={generatingFor !== null || stories.length === 0}
          className="bg-dark-700 hover:bg-dark-600 border border-dark-500 text-gray-200 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {generatingFor ? <span className="animate-pulse">Generating...</span> : 'Generate Sample Plan'}
        </button>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        {testPlans.length === 0 ? (
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-12 text-center shadow-lg">
            <ClipboardList size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-300">No Test Plans Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't generated any test plans. Select stories from the Stories page to create your first plan.</p>
            <button onClick={() => setCurrentPage('stories')} className="bg-primary hover:bg-primary/90 text-dark-900 px-6 py-2 rounded font-bold shadow-[0_0_15px_rgba(0,212,255,0.4)]">Go to Stories</button>
          </div>
        ) : (
          testPlans.map(plan => {
            const isExpanded = expandedId === plan.id;
            return (
              <div key={plan.id} className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden shadow-md">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-700/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-dark-900 px-3 py-1.5 rounded border border-dark-600 font-mono text-sm text-gray-400">
                      {plan.storyId}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">{plan.planName}</h3>
                      <p className="text-xs text-gray-500">Created: {new Date(plan.creationDate).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-dark-900 px-2.5 py-1 rounded-full"><Clock size={12}/> {plan.estimatedHours}h</span>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 border-t border-dark-600 bg-dark-900/50 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Scope</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{plan.scope}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Objectives</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                          {plan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Criteria</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><span className="text-green-400 font-semibold">Entry:</span> {plan.entryCriteria.join(', ')}</p>
                          <p><span className="text-red-400 font-semibold">Exit:</span> {plan.exitCriteria.join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                      <div className="flex items-center gap-2 text-sm text-warning">
                        <ShieldAlert size={16} /> <span className="font-medium">Risks:</span> {plan.riskAreas.length} identified
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleGenerateCases(plan.id); }}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Zap size={16} /> Generate Test Cases
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
