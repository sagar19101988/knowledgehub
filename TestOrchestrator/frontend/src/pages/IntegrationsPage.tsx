import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Server, Workflow, Save, Zap, EyeOff, Eye, Bot, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

type TestStatus = 'NOT TESTED' | 'TESTING' | 'SUCCESS' | 'FAILED';

export default function IntegrationsPage() {
  const { settings, updateSettings, clearAllData, token } = useAppStore();

  const [llmProvider, setLlmProvider] = useState(settings.llmProvider || 'Groq');
  const [llmApiKey, setLlmApiKey] = useState(settings.llmApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [llmTestStatus, setLlmTestStatus] = useState<TestStatus>('NOT TESTED');
  const [llmTestError, setLlmTestError] = useState('');

  const [jira, setJira] = useState(settings.jira || { url: '', projectOrOrg: '', authId: '', token: '' });
  const [jiraTestStatus, setJiraTestStatus] = useState<TestStatus>('NOT TESTED');
  const [jiraTestError, setJiraTestError] = useState('');

  const [ado, setAdo] = useState(settings.azureDevOps || { url: '', projectOrOrg: '', authId: '', token: '' });
  const [adoTestStatus, setAdoTestStatus] = useState<TestStatus>('NOT TESTED');
  const [adoTestError, setAdoTestError] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const providers = ['Groq', 'OpenAI', 'Claude', 'Gemini', 'Ollama', 'LM Studio'];

  const authHeaders = { Authorization: `Bearer ${token}` };

  // Load settings from DB on mount — restores form fields after page refresh
  useEffect(() => {
    if (!token) return;
    // Load status (for badge display)
    axios.get('/api/config/integrations/status', { headers: authHeaders })
      .then(res => {
        if (res.data.hasLlmKey) setLlmTestStatus('SUCCESS');
        if (res.data.hasJira)   setJiraTestStatus('SUCCESS');
        if (res.data.hasAdo)    setAdoTestStatus('SUCCESS');
        if (res.data.llmProvider) setLlmProvider(res.data.llmProvider);
      })
      .catch(() => {});

    // Load non-sensitive details (URLs, project names) to restore form fields
    axios.get('/api/config/integrations/details', { headers: authHeaders })
      .then(res => {
        if (res.data.jiraConfig) {
          setJira(prev => ({
            ...prev,
            url: res.data.jiraConfig.url || prev.url,
            projectOrOrg: res.data.jiraConfig.projectOrOrg || prev.projectOrOrg,
            authId: res.data.jiraConfig.authId || prev.authId,
          }));
        }
        if (res.data.adoConfig) {
          setAdo(prev => ({
            ...prev,
            url: res.data.adoConfig.url || prev.url,
            projectOrOrg: res.data.adoConfig.projectOrOrg || prev.projectOrOrg,
            authId: res.data.adoConfig.authId || prev.authId,
          }));
        }
      })
      .catch(() => {});
  }, [token]);

  const handleTestLlm = async () => {
    setLlmTestStatus('TESTING');
    setLlmTestError('');
    try {
      if (llmProvider === 'Ollama' || llmProvider === 'LM Studio') {
        // Local providers — just check key length as we can't call them from browser
        setLlmTestStatus('SUCCESS');
        return;
      }
      if (!llmApiKey || llmApiKey.trim().length < 10) {
        setLlmTestStatus('FAILED');
        setLlmTestError('API key is too short or missing.');
        return;
      }
      // Test via backend proxy
      await axios.post('/api/ai/test-connection', { llmProvider, llmApiKey }, { headers: authHeaders });
      setLlmTestStatus('SUCCESS');
    } catch (err: any) {
      setLlmTestStatus('FAILED');
      setLlmTestError(err.response?.data?.error || 'Connection failed. Check your API key.');
    }
  };

  const handleTestJira = async () => {
    setJiraTestStatus('TESTING');
    setJiraTestError('');
    try {
      await axios.post('/api/jira/test', { jiraConfig: jira }, { headers: authHeaders });
      setJiraTestStatus('SUCCESS');
    } catch (err: any) {
      setJiraTestStatus('FAILED');
      setJiraTestError(err.response?.data?.error || 'Connection failed. Check credentials.');
    }
  };

  const handleTestAdo = async () => {
    setAdoTestStatus('TESTING');
    setAdoTestError('');
    try {
      await axios.post('/api/azure/test', { adoConfig: ado }, { headers: authHeaders });
      setAdoTestStatus('SUCCESS');
    } catch (err: any) {
      setAdoTestStatus('FAILED');
      setAdoTestError(err.response?.data?.error || 'Connection failed. Check credentials.');
    }
  };

  const handleSave = async () => {
    if (!token) {
      alert('You must be logged in to save settings.');
      return;
    }
    setSaving(true);
    setSaveMessage('');
    try {
      // 1. Save to backend DB (encrypted)
      await axios.post('/api/config/integrations', {
        llmProvider,
        llmApiKey: llmApiKey || null,
        jiraConfig: jira.url ? jira : null,
        adoConfig: ado.url ? ado : null,
      }, { headers: authHeaders });

      // 2. Also update local Zustand state for use in front-end checks (e.g. button disabled state)
      updateSettings({
        llmProvider,
        llmApiKey,
        jira: jira.url ? jira : null,
        azureDevOps: ado.url ? ado : null,
      });

      setSaveMessage('✅ All configurations saved securely to the database.');
    } catch (err: any) {
      setSaveMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const StatusBadge = ({ status, error }: { status: TestStatus; error?: string }) => {
    if (status === 'NOT TESTED') return <span className="px-2.5 py-1 rounded-md bg-white/5 text-gray-400 text-xs font-bold tracking-wider">NOT TESTED</span>;
    if (status === 'TESTING') return <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider animate-pulse flex items-center gap-1"><Loader2 size={10} className="animate-spin" />TESTING</span>;
    if (status === 'SUCCESS') return <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold tracking-wider flex items-center gap-1"><CheckCircle size={10} />VERIFIED</span>;
    if (status === 'FAILED') return (
      <span className="flex flex-col gap-0.5">
        <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold tracking-wider flex items-center gap-1"><XCircle size={10} />FAILED</span>
        {error && <span className="text-red-400/70 text-[10px] px-1">{error}</span>}
      </span>
    );
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-100 flex items-center gap-3">
          <Workflow className="text-primary" /> Integrations & Settings
        </h1>
        <p className="text-gray-400">Configure your AI model and PM tools. All credentials are AES-256 encrypted in the database.</p>
      </div>

      {!token && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">You are in Guest mode. Log in to save settings to the database.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* LLM SETTINGS CARD */}
        <div className="bg-[#0B0F19] border border-dark-600 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-white/5">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0 relative">
                <Bot className="text-indigo-400" size={24} />
                {llmTestStatus === 'SUCCESS' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0F19]"></div>}
                {llmTestStatus === 'FAILED' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0B0F19]"></div>}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-100 m-0 leading-snug">LLM / AI Provider</h2>
                <p className="text-sm text-gray-400 mt-1">AI engine used to generate test plans and test cases.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <StatusBadge status={llmTestStatus} error={llmTestError} />
              <button
                onClick={handleTestLlm}
                disabled={llmTestStatus === 'TESTING'}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex-1 md:flex-initial justify-center disabled:opacity-75"
              >
                {llmTestStatus === 'TESTING' ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" className="text-yellow-300" />}
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
                  onChange={(e) => { setLlmProvider(e.target.value); setLlmTestStatus('NOT TESTED'); }}
                  className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 appearance-none transition-colors cursor-pointer"
                >
                  {providers.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-[#7B8296] uppercase block">API Key {(llmProvider === 'Ollama' || llmProvider === 'LM Studio') && <span className="text-gray-500 normal-case">(not required)</span>}</label>
              <div className="relative group">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={llmApiKey}
                  onChange={e => { setLlmApiKey(e.target.value); setLlmTestStatus('NOT TESTED'); }}
                  placeholder={llmProvider === 'Ollama' || llmProvider === 'LM Studio' ? 'Not required' : 'sk-...'}
                  disabled={llmProvider === 'Ollama' || llmProvider === 'LM Studio'}
                  className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] rounded-xl pl-4 pr-12 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-gray-600 font-mono disabled:opacity-50"
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
                <StatusBadge status={jiraTestStatus} error={jiraTestError} />
                <button
                  onClick={handleTestJira}
                  disabled={jiraTestStatus === 'TESTING' || !jira.url || !jira.token}
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
                <input type="text" value={jira.url} onChange={e => { setJira({ ...jira, url: e.target.value }); setJiraTestStatus('NOT TESTED'); }} placeholder="https://company.atlassian.net" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Project Key</label>
                <input type="text" value={jira.projectOrOrg} onChange={e => { setJira({ ...jira, projectOrOrg: e.target.value }); setJiraTestStatus('NOT TESTED'); }} placeholder="e.g. PRJ" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Email</label>
                <input type="email" value={jira.authId} onChange={e => { setJira({ ...jira, authId: e.target.value }); setJiraTestStatus('NOT TESTED'); }} placeholder="you@company.com" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">API Token</label>
                <input type="password" value={jira.token} onChange={e => { setJira({ ...jira, token: e.target.value }); setJiraTestStatus('NOT TESTED'); }} placeholder="••••••••••••••••" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg p-2 text-sm text-gray-200 font-mono transition-colors" />
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
                <StatusBadge status={adoTestStatus} error={adoTestError} />
                <button
                  onClick={handleTestAdo}
                  disabled={adoTestStatus === 'TESTING' || !ado.url || !ado.token}
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
                <input type="text" value={ado.url} onChange={e => { setAdo({ ...ado, url: e.target.value }); setAdoTestStatus('NOT TESTED'); }} placeholder="https://dev.azure.com/yourorg" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Project Name</label>
                <input type="text" value={ado.projectOrOrg} onChange={e => { setAdo({ ...ado, projectOrOrg: e.target.value }); setAdoTestStatus('NOT TESTED'); }} placeholder="Your Project" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Username / Email <span className="text-gray-600 normal-case">(optional)</span></label>
                <input type="text" value={ado.authId} onChange={e => { setAdo({ ...ado, authId: e.target.value }); setAdoTestStatus('NOT TESTED'); }} placeholder="user@company.com (optional)" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-[#7B8296] uppercase block">Personal Access Token</label>
                <input type="password" value={ado.token} onChange={e => { setAdo({ ...ado, token: e.target.value }); setAdoTestStatus('NOT TESTED'); }} placeholder="••••••••••••••••" className="w-full bg-[#111726] border border-[#232B3E] hover:border-[#38435E] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-lg p-2 text-sm text-gray-200 font-mono transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-xl border text-sm font-semibold ${saveMessage.startsWith('✅') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {saveMessage}
          </div>
        )}

        <div className="flex justify-between items-center py-4 border-t border-dark-700">
          <button onClick={clearAllData} className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded font-medium text-sm transition-colors cursor-pointer">
            Danger: Clear All Application Data
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-75 text-dark-900 px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save All Configurations'}
          </button>
        </div>
      </div>
    </div>
  );
}
