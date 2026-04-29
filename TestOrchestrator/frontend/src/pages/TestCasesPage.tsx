import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FlaskConical, Search, Code2, ChevronDown, ChevronRight, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { generateTestCasesAI } from '../api/backend';

export default function TestCasesPage() {
  const { testCases, addTestCases, updateTestCase, setCurrentPage, testPlans, stories } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');

  const handleGenerate = async () => {
    if (testPlans.length === 0) {
      alert("Please generate a Test Plan first.");
      setCurrentPage('plans');
      return;
    }
    const plan = testPlans[0];
    const story = stories.find(s => s.id === plan.storyId);
    if (!story) return;

    setGenerating(true);
    try {
      const cases = await generateTestCasesAI(story, plan);
      addTestCases(cases);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setGenerating(false);
  };

  const statusIcon = {
    'Not Run': <Circle size={14} className="text-gray-500" />,
    'Passed': <CheckCircle2 size={14} className="text-green-500" />,
    'Failed': <XCircle size={14} className="text-red-500" />
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-100 flex items-center gap-3">
            <FlaskConical className="text-purple-500" /> Test Cases
          </h1>
          <p className="text-gray-400">Manage, execute, and generate automation code for your test cases.</p>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-dark-900 px-6 py-2 rounded-md font-bold text-sm shadow-[0_0_10px_rgba(0,212,255,0.3)] flex items-center gap-2"
        >
          {generating ? <span className="animate-pulse">Generating...</span> : 'Generate Sample Cases'}
        </button>
      </div>

      <div className="flex items-center gap-4 bg-dark-800 p-4 rounded-xl border border-dark-600 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search test cases..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-dark-600 rounded pl-9 pr-3 py-2 text-sm focus:border-primary text-gray-200"
          />
        </div>
        <div className="flex gap-4 ml-auto text-sm">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-500"></span> Not Run: {testCases.filter(c => c.status === 'Not Run').length}</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Passed: {testCases.filter(c => c.status === 'Passed').length}</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Failed: {testCases.filter(c => c.status === 'Failed').length}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-dark-800 rounded-xl border border-dark-600 shadow-lg">
        {testCases.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-3 p-12">
            <FlaskConical size={48} className="opacity-20" />
            <p>No test cases found. Generate them from a test plan.</p>
          </div>
        ) : (
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-dark-600">
              <thead className="bg-dark-900/50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-10"></th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700 bg-dark-800">
                {testCases.filter(tc => tc.title.toLowerCase().includes(search.toLowerCase()) || tc.id.toLowerCase().includes(search.toLowerCase())).map((tc) => {
                  const isExpanded = expandedId === tc.id;
                  return (
                    <React.Fragment key={tc.id}>
                      <tr className="hover:bg-dark-700/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : tc.id)}>
                          {isExpanded ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-400">{tc.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-200 font-medium">{tc.title}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${tc.priority === 'High' ? 'bg-red-900/30 text-red-400' : tc.priority === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-gray-800 text-gray-400'}`}>{tc.priority}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{tc.type}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <select 
                            value={tc.status} 
                            onChange={(e) => updateTestCase(tc.id, { status: e.target.value as any })}
                            className="bg-transparent border-0 text-sm focus:ring-0 cursor-pointer flex items-center gap-1 text-gray-300"
                          >
                            <option value="Not Run">⚪ Not Run</option>
                            <option value="Passed">🟢 Passed</option>
                            <option value="Failed">🔴 Failed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <button 
                            onClick={() => setCurrentPage('code')}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-dark-600 hover:bg-dark-500 border border-dark-500 rounded text-gray-300 transition-colors"
                          >
                            <Code2 size={14} className="text-primary"/> Gen Code
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-dark-900/30">
                          <td colSpan={7} className="px-8 py-4 border-l-4 border-primary">
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-1">Preconditions</h5>
                                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                  {tc.preconditions.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-1">Steps</h5>
                                <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                                  {tc.steps.map((s, i) => (
                                    <li key={i}>
                                      <span className="font-medium text-gray-200">{s.action}</span>
                                      {s.testData && <span className="ml-2 font-mono text-xs bg-dark-700 px-1.5 py-0.5 rounded text-gray-400">Data: {s.testData}</span>}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                              <div className="bg-dark-800 p-3 rounded border border-dark-600">
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-1">Expected Result</h5>
                                <p className="text-sm text-green-400">{tc.expectedResult}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
