import { useState, useEffect } from 'react';
import { useLLMStore } from '../../store/llmStore';
import { LLMService } from '../../services/llm.service';
import type { LLMProvider, LLMConfig } from '../../services/llm.service';
import { X, Check, Eye, EyeOff, Zap, Brain, DollarSign, Plug, Settings2, Trash2 } from 'lucide-react';

const PROVIDERS: { id: LLMProvider; name: string; color: string }[] = [
  { id: 'groq', name: 'Groq', color: 'bg-orange-500' },
  { id: 'anthropic', name: 'Anthropic', color: 'bg-amber-800' },
  { id: 'openai', name: 'OpenAI', color: 'bg-green-600' },
  { id: 'google', name: 'Google Gemini', color: 'bg-blue-500' },
  { id: 'mistral', name: 'Mistral AI', color: 'bg-yellow-500' },
  { id: 'ollama', name: 'Ollama (Local)', color: 'bg-gray-700' },
];

const MODELS: Record<LLMProvider, { id: string; name: string; tags: ('fast' | 'smart' | 'economy')[] }[]> = {
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', tags: ['smart'] },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', tags: ['fast', 'economy'] },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', tags: ['fast'] },
  ],
  anthropic: [
    { id: 'claude-sonnet-4-20250514', name: 'Claude 3.5 Sonnet', tags: ['smart'] },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude 3.5 Haiku', tags: ['fast', 'economy'] },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', tags: ['smart'] },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', tags: ['fast', 'economy'] },
    { id: 'o1-mini', name: 'o1 Mini', tags: ['smart'] },
  ],
  google: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tags: ['smart'] },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tags: ['fast', 'economy'] },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', tags: ['fast'] },
  ],
  mistral: [
    { id: 'mistral-large-latest', name: 'Mistral Large', tags: ['smart'] },
    { id: 'mistral-small-latest', name: 'Mistral Small', tags: ['fast', 'economy'] },
    { id: 'open-mixtral-8x22b', name: 'Mixtral 8x22B', tags: ['smart'] },
  ],
  ollama: [
    { id: 'llama3', name: 'Llama 3 (Local)', tags: ['fast', 'economy'] },
    { id: 'mistral', name: 'Mistral (Local)', tags: ['fast'] },
  ],
};

export default function LLMSettingsDrawer() {
  const { isDrawerOpen, toggleDrawer, configs, activeProvider, setConfig, setActiveProvider, sessionTokensUsed, sessionCostEstimate } = useLLMStore();
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setTestResult('idle');
  }, [activeProvider]);
  
  if (!isDrawerOpen) return null;

  const currentConfig = configs[activeProvider] || {
    provider: activeProvider,
    apiKey: '',
    model: MODELS[activeProvider][0].id,
    temperature: 0.3,
    maxTokens: 2000,
    streaming: true
  } as LLMConfig;

  const handleConfigChange = (key: keyof LLMConfig, value: any) => {
    setConfig(activeProvider, { ...currentConfig, [key]: value });
    if (key === 'apiKey' || key === 'baseUrl') {
      setTestResult('idle');
    }
  };

  const handleForget = () => {
    setConfig(activeProvider, { ...currentConfig, apiKey: '' });
  };

  const handleTestConnection = async () => {
    if (!currentConfig.apiKey && activeProvider !== 'ollama') return;
    setIsTesting(true);
    setTestResult('idle');
    try {
      const llm = new LLMService(currentConfig);
      await llm.complete([{ role: 'user', content: 'Say "test" and nothing else.' }]);
      setTestResult('success');
    } catch (err) {
      setTestResult('error');
      alert('Connection failed: ' + (err as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  const getTagIcon = (tag: string) => {
     switch(tag) {
       case 'fast': return <Zap size={10} className="mr-0.5 inline" />;
       case 'smart': return <Brain size={10} className="mr-0.5 inline" />;
       case 'economy': return <DollarSign size={10} className="mr-0.5 inline" />;
       default: return null;
     }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleDrawer}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-950 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Settings2 size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Engine Settings</h2>
          </div>
          <button 
            onClick={toggleDrawer}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          
          {/* Section 1: Provider Selection */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3 uppercase tracking-wider flex items-center gap-2">
               Provider
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PROVIDERS.map(p => {
                const isActive = activeProvider === p.id;
                const isConfigured = !!configs[p.id]?.apiKey || p.id === 'ollama';
                return (
                  <div 
                    key={p.id}
                    onClick={() => setActiveProvider(p.id)}
                    className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-start gap-2 ${isActive ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900/50'}`}
                  >
                    <div className="flex items-center w-full justify-between">
                       <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                       {isConfigured && <Check size={14} className="text-emerald-500" />}
                    </div>
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200 mt-1">{p.name}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Section 2: API Key Management */}
          <section className="bg-gray-50 dark:bg-gray-900/50 -mx-5 px-5 py-6 border-y border-gray-100 dark:border-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
               Authentication
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Keys are session-only and never leave your browser.</p>
            
            {activeProvider === 'ollama' ? (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Local API Base URL</label>
                <input 
                  type="text" 
                  value={currentConfig.baseUrl || 'http://localhost:11434'}
                  onChange={e => handleConfigChange('baseUrl', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ) : (
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
                   <div className="relative">
                     <input 
                       type={showKey ? "text" : "password"}
                       value={currentConfig.apiKey || ''}
                       onChange={e => handleConfigChange('apiKey', e.target.value)}
                       placeholder={`Enter ${PROVIDERS.find(p => p.id === activeProvider)?.name} API Key...`}
                       className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                     />
                     <button 
                       onClick={() => setShowKey(!showKey)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                     >
                       {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                   </div>
                 </div>
                 
                 <div className="flex gap-2">
                    <button 
                      onClick={handleTestConnection}
                      disabled={isTesting || !currentConfig.apiKey}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-white rounded-lg text-xs font-medium transition-colors border border-transparent shadow-sm disabled:opacity-50
                        ${testResult === 'success' ? 'bg-emerald-600' : 
                          testResult === 'error' ? 'bg-red-600' : 
                          'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                      {isTesting ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : testResult === 'success' ? (
                        <Check size={14} />
                      ) : testResult === 'error' ? (
                        <X size={14} />
                      ) : (
                        <Plug size={14} />
                      )}
                      {testResult === 'success' ? 'Connected!' : testResult === 'error' ? 'Connection Failed' : 'Test Connection'}
                    </button>
                    {currentConfig.apiKey && (
                      <button onClick={handleForget} className="px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors tooltip" title="Forget Key">
                        <Trash2 size={16} />
                      </button>
                    )}
                 </div>
               </div>
            )}
          </section>

          {/* Section 3: Model Selection */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
               Model Selection
            </h3>
            <div className="space-y-2">
               {MODELS[activeProvider]?.map(model => (
                 <label 
                   key={model.id}
                   className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${currentConfig.model === model.id ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
                 >
                   <input 
                     type="radio" 
                     name="model" 
                     value={model.id}
                     checked={currentConfig.model === model.id}
                     onChange={(e) => handleConfigChange('model', e.target.value)}
                     className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                   />
                   <div className="ml-3 flex-1">
                     <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{model.name}</span>
                     <div className="flex gap-1.5 mt-1">
                       {model.tags.map(tag => (
                         <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                           {getTagIcon(tag)}
                           {tag}
                         </span>
                       ))}
                     </div>
                   </div>
                 </label>
               ))}
               
               {activeProvider === 'ollama' && (
                 <div className="mt-4">
                   <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Model Name</label>
                   <input 
                     type="text" 
                     value={currentConfig.model}
                     onChange={e => handleConfigChange('model', e.target.value)}
                     className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                   />
                 </div>
               )}
            </div>
          </section>

          {/* Section 4: Inference Settings */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
               Inference Options
            </h3>
            <div className="space-y-4 max-w-full">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Temperature</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{currentConfig.temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={currentConfig.temperature}
                  onChange={e => handleConfigChange('temperature', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max Tokens</label>
                <input 
                  type="number" 
                  value={currentConfig.maxTokens}
                  onChange={e => handleConfigChange('maxTokens', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={currentConfig.streaming}
                  onChange={e => handleConfigChange('streaming', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div>
                  <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">Enable Streaming</span>
                  <span className="block text-xs text-gray-500">Show analysis text as it generates</span>
                </div>
              </label>
            </div>
          </section>

          {/* Section 5: Usage & Cost Tracker */}
          <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
               Session Usage
            </h3>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Tokens</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200 font-mono">{sessionTokensUsed.toLocaleString()}</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Est. Cost</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200 font-mono">${sessionCostEstimate.toFixed(4)}</p>
               </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
