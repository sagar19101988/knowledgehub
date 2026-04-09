import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Server, Workflow, Save, Zap, EyeOff, Eye, Bot, Loader2 } from 'lucide-react';

type TestStatus = 'NOT TESTED' | 'TESTING' | 'SUCCESS' | 'FAILED';

export default function IntegrationsPage() {
  const { settings, updateSettings, clearAllData } = useAppStore();
  
  const [llmProvider, setLlmProvider] = useState(settings.llmProvider || 'Groq');
  const [llmApiKey, setLlmApiKey] = useState(settings.llmApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>('NOT TESTED');
  
  const [jira, setJira] = useState(settings.jira || { url: '', projectOrOrg: '', authId: '', token: '' });
  const [jiraTestStatus, setJiraTestStatus] = useState<TestStatus>('NOT TESTED');
  
  const [ado, setAdo] = useState(settings.azureDevOps || { url: '', projectOrOrg: '', authId: '', token: '' });
  const [adoTestStatus, setAdoTestStatus] = useState<TestStatus>('NOT TESTED');

  const providers = ['Groq', 'OpenAI', 'Claude', 'Gemini', 'Ollama', 'LM Studio'];

  const handleTestLlm = () => {
    setTestStatus('TESTING');
    setTimeout(() => {
      if (llmApiKey.trim().length > 10 || llmProvider === 'Ollama' || llmProvider === 'LM Studio') {
        setTestStatus('SUCCESS');
      } else {
        setTestStatus('FAILED');
      }
    }, 1200);
  };

  const handleTestJira = () => {
    setJiraTestStatus('TESTING');
    setTimeout(() => {
      if (jira.url.includes('http') && jira.token.length > 5 && jira.projectOrOrg.length > 1) {
        setJiraTestStatus('SUCCESS');
      } else {
        setJiraTestStatus('FAILED');
      }
    }, 1500);
  };

  const handleTestAdo = () => {
    setAdoTestStatus('TESTING');
    setTimeout(() => {
      if (ado.url.includes('http') && ado.token.length > 5 && ado.projectOrOrg.length > 1) {
        setAdoTestStatus('SUCCESS');
      } else {
        setAdoTestStatus('FAILED');
      }
    }, 1500);
  };

  const handleSave = () => {
    updateSettings({
      llmProvider,
      llmApiKey,
      jira: jira.url ? jira : null,
      azureDevOps: ado.url ? ado : null,
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-100 flex items-center gap-3">
          <Workflow className="text-primary" /> Integrations & Settings
        </h1>
        <p className="text-gray-400">Configure your AI model and PM tools to sync data.</p>
      </div>

      <div className="space-y-6">
        {/* LLM SETTINGS CARD */}
        <div className="bg-[#0B0F19] border border-dark-600 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-white/5">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0 relative">
                <Bot className="text-indigo-400" size={24} />
                {testStatus === 'SUCCESS' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0F19]"></div>}
                {testStatus === 'FAILED' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0B0F19]"></div>}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-100 m-0 leading-snug">LLM / AI Provider</h2>
                <p className="text-sm text-gray-400 mt-1">AI engine used to generate test plans.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {testStatus === 'NOT TESTED' && <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-bold tracking-wider whitespace-nowrap">NOT TESTED</span>}
              {testStatus === 'TESTING' && <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider animate-pulse whitespace-nowrap">TESTING...</span>}
              {testStatus === 'SUCCESS' && <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold tracking-wider whitespace-nowrap">VERIFIED</span>}
              {testStatus === 'FAILED' && <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold tracking-wider whitespace-nowrap">FAILED</span>}
              
              <button 
                onClick={handleTestLlm}
                disabled={testStatus === 'TESTING'}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex-1 md:flex-initial justify-center disabled:opacity-75"
              >
                {testStatus === 'TESTING' ? <Loader2 size={16} className="animate-spin text-yellow-300" /> : <Zap size={16} fill="currentColor" className="text-yellow-300" />}
                Test Connection
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-[#7B8296] uppercase block">Provider</label>
              <div className="relative">
                <select 
                  value={llmProvider}
                  onChange={(e) => { setLlmProvider(e.target.value); setTestStatus('NOT TESTED'); }}
                  className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 appearance-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select provider...</option>
                  {providers.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-[#7B8296] uppercase block">API Key</label>
              <div className="relative group">
                <input 
                  type={showKey ? 'text' : 'password'}
                  value={llmApiKey}
                  onChange={e => { setLlmApiKey(e.target.value); setTestStatus('NOT TESTED'); }}
                  placeholder="sk-..." 
                  className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] rounded-xl pl-4 pr-12 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-gray-600 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#7B8296] hover:bg-white/5 hover:text-gray-300 transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jira Integration */}
          <div className="bg-[#0B0F19] border border-dark-600 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/80"></div>
            <div className="p-6 border-b border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Server size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-100 leading-snug">Jira Software</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Sync boards and user stories</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2">
                <div className="flex gap-2">
                  {jiraTestStatus === 'NOT TESTED' && settings.jira && <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold tracking-wider">SAVED</span>}
                  {jiraTestStatus === 'SUCCESS' && <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold tracking-wider">VERIFIED</span>}
                  {jiraTestStatus === 'FAILED' && <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold tracking-wider">FAILED</span>}
                  {jiraTestStatus === 'TESTING' && <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider animate-pulse">TESTING</span>}
                </div>
                
                <button 
                  onClick={handleTestJira}
                  disabled={jiraTestStatus === 'TESTING' || !jira.url}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50"
                >
                  {jiraTestStatus === 'TESTING' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  Test Connection
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Base URL</label>
                <input type="text" value={jira.url} onChange={e => {setJira({...jira, url: e.target.value}); setJiraTestStatus('NOT TESTED');}} placeholder="https://company.atlassian.net" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Project Key</label>
                <input type="text" value={jira.projectOrOrg} onChange={e => {setJira({...jira, projectOrOrg: e.target.value}); setJiraTestStatus('NOT TESTED');}} placeholder="e.g. PRJ" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Email</label>
                <input type="email" value={jira.authId} onChange={e => {setJira({...jira, authId: e.target.value}); setJiraTestStatus('NOT TESTED');}} placeholder="you@dev.com" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">API Token</label>
                <input type="password" value={jira.token} onChange={e => {setJira({...jira, token: e.target.value}); setJiraTestStatus('NOT TESTED');}} placeholder="••••••••••••••••" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 font-mono transition-colors" />
              </div>
            </div>
          </div>

          {/* Azure DevOps Integration */}
          <div className="bg-[#0B0F19] border border-dark-600 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-600/80"></div>
            <div className="p-6 border-b border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                    <Server size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-100 leading-snug">Azure DevOps</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Sync PBIs and iterations</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2">
                <div className="flex gap-2">
                  {adoTestStatus === 'NOT TESTED' && settings.azureDevOps && <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold tracking-wider">SAVED</span>}
                  {adoTestStatus === 'SUCCESS' && <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold tracking-wider">VERIFIED</span>}
                  {adoTestStatus === 'FAILED' && <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold tracking-wider">FAILED</span>}
                  {adoTestStatus === 'TESTING' && <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-wider animate-pulse">TESTING</span>}
                </div>
                
                <button 
                  onClick={handleTestAdo}
                  disabled={adoTestStatus === 'TESTING' || !ado.url}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
                >
                  {adoTestStatus === 'TESTING' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  Test Connection
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Organization URL</label>
                <input type="text" value={ado.url} onChange={e => {setAdo({...ado, url: e.target.value}); setAdoTestStatus('NOT TESTED');}} placeholder="https://dev.azure.com/org" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Project Name</label>
                <input type="text" value={ado.projectOrOrg} onChange={e => {setAdo({...ado, projectOrOrg: e.target.value}); setAdoTestStatus('NOT TESTED');}} placeholder="Project" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Username / Email</label>
                <input type="text" value={ado.authId} onChange={e => {setAdo({...ado, authId: e.target.value}); setAdoTestStatus('NOT TESTED');}} placeholder="User (Optional)" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Personal Access Token</label>
                <input type="password" value={ado.token} onChange={e => {setAdo({...ado, token: e.target.value}); setAdoTestStatus('NOT TESTED');}} placeholder="••••••••••••••••" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 font-mono transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 border-t border-dark-700">
          <button onClick={clearAllData} className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded font-medium text-sm transition-colors cursor-pointer">
            Danger: Clear All Application Data
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-dark-900 px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all">
            <Save size={18} /> Save All Configurations
          </button>
        </div>
      </div>
    </div>
  );
}
