import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Code2, Play, Copy, Check, Download, Layers } from 'lucide-react';
import { generateAutomationCodeAI } from '../api/backend';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Framework = 'Selenium (Java)' | 'Playwright (TypeScript)';

export default function CodeGenPage() {
  const { testCases } = useAppStore();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(testCases.length > 0 ? testCases[0].id : null);
  const [framework, setFramework] = useState<Framework>('Playwright (TypeScript)');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedCase = testCases.find(tc => tc.id === selectedCaseId) || null;

  const handleGenerate = async () => {
    if (!selectedCase) return;
    setGenerating(true);
    setGeneratedCode('');
    try {
      const code = await generateAutomationCodeAI(selectedCase, framework);
      setGeneratedCode(code);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = framework.includes('Java') ? 'java' : 'ts';
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCase?.id || 'test'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Left Sidebar - Test Cases List */}
      <div className="w-80 flex flex-col bg-dark-800 rounded-xl border border-dark-600 shadow-md overflow-hidden shrink-0">
        <div className="p-4 border-b border-dark-600 bg-dark-900/50">
          <h2 className="font-bold text-gray-200 flex items-center gap-2"><Layers size={18} className="text-purple-500"/> Select Test Case</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {testCases.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500">No test cases available.</p>
          ) : (
            testCases.map(tc => (
              <button
                key={tc.id}
                onClick={() => setSelectedCaseId(tc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedCaseId === tc.id ? 'bg-primary/10 border-primary text-gray-200 shadow-[0_0_8px_rgba(0,212,255,0.2)]' : 'bg-transparent border-transparent text-gray-400 hover:bg-dark-700 hover:text-gray-300'}`}
              >
                <div className="text-xs font-mono font-semibold mb-1 opacity-70">{tc.id}</div>
                <div className="text-sm font-medium line-clamp-2">{tc.title}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Area - Code Generation */}
      <div className="flex-1 flex flex-col bg-dark-800 rounded-xl border border-dark-600 shadow-md overflow-hidden relative">
        {!selectedCase ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-3">
            <Code2 size={48} className="opacity-20" />
            <p>Select a test case from the left to generate code.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-dark-600 flex justify-between items-center bg-dark-900/50">
              <div className="flex items-center gap-4">
                <select 
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as Framework)}
                  className="bg-dark-900 border border-dark-500 text-gray-200 text-sm rounded-md px-3 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
                >
                  <option value="Playwright (TypeScript)">Playwright (TypeScript)</option>
                  <option value="Selenium (Java)">Selenium (Java)</option>
                  <option value="Playwright (Python)">Playwright (Python)</option>
                  <option value="Selenium (Python)">Selenium (Python)</option>
                </select>
                <span className="text-sm text-gray-400 font-mono hidden xl:inline">{selectedCase.id}: {selectedCase.title.slice(0, 40)}...</span>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={generating}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-dark-900 px-5 py-2 rounded font-bold text-sm flex items-center gap-2 shadow-[0_0_10px_rgba(0,212,255,0.3)] transition-all"
              >
                {generating ? <span className="animate-pulse">Generating Code...</span> : <><Play size={16}/> Generate Script</>}
              </button>
            </div>

            <div className="flex-1 overflow-auto relative bg-[#1E1E1E]">
              {generatedCode ? (
                <>
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button onClick={handleCopy} className="p-2 bg-dark-700 hover:bg-dark-600 border border-dark-500 text-gray-300 rounded shadow-md transition-colors" title="Copy code">
                      {copied ? <Check size={16} className="text-green-400"/> : <Copy size={16}/>}
                    </button>
                    <button onClick={handleDownload} className="p-2 bg-dark-700 hover:bg-dark-600 border border-dark-500 text-gray-300 rounded shadow-md transition-colors" title="Download file">
                      <Download size={16}/>
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={framework.includes('Java') ? 'java' : framework.includes('Python') ? 'python' : 'typescript'}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.5rem', minHeight: '100%', fontSize: '14px', background: 'transparent' }}
                    showLineNumbers={true}
                  >
                    {generatedCode}
                  </SyntaxHighlighter>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600 flex-col gap-3 font-mono text-sm opacity-50">
                  <Code2 size={48} className="mb-2"/>
                  {generating ? 'AI is writing code...' : 'Output will appear here'}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
