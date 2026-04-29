import { useState, useRef, useEffect } from 'react';
import { Brain, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { useSprintStore } from '../../store/sprintStore';
import { useLLMStore } from '../../store/llmStore';
import { LLMService, type LLMMessage } from '../../services/llm.service';

export default function AgentPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sprint = useSprintStore(s => s.sprint);
  const workItems = useSprintStore(s => s.workItems);
  const { activeProvider, configs } = useLLMStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    
    const config = configs[activeProvider];
    // Allow Ollama without API key
    if (!config || (!config.apiKey && activeProvider !== 'ollama')) {
      setMessages(prev => [...prev, { role: 'user', content: inputVal }, { role: 'assistant', content: '⚠️ Please configure your AI API Key in Settings before chatting.' }]);
      setInputVal('');
      return;
    }

    const newMessages: LLMMessage[] = [...messages, { role: 'user', content: inputVal }];
    setMessages(newMessages);
    setInputVal('');
    setIsTyping(true);

    try {
      // Build context payload explicitly
      const ctxSummary = {
        sprintPath: sprint?.iterationPath || 'Unknown',
        totalItems: workItems.length,
        itemsByType: workItems.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + 1; return acc; }, {} as Record<string,number>),
        itemsByState: workItems.reduce((acc, i) => { acc[i.state] = (acc[i.state] || 0) + 1; return acc; }, {} as Record<string,number>),
        // Include a lightweight array of items for context
        workItemsSnapshot: workItems.map(i => ({
          id: i.id,
          type: i.type,
          title: i.title,
          state: i.state,
          assignedTo: i.assignedTo?.displayName || 'Unassigned',
          storyPoints: i.storyPoints,
          completedWork: i.completedWork,
          originalEstimate: i.originalEstimate,
          activity: i.activity
        }))
      };

      const systemPrompt: LLMMessage = {
        role: 'system',
        content: `You are Sprint Pulse, an elite Agile Analytics AI Assistant.
The current sprint context is provided below as JSON. Answer the user's questions based strictly on this sprint data. Identify risks, bottlenecks, and engineering performance clearly.
Do not hallucinate data that isn't provided. Keep answers concise, actionable, and formatted in Markdown.

Context JSON:
${JSON.stringify(ctxSummary, null, 2)}`
      };

      const llm = new LLMService(config);

      if (config.streaming) {
        // Stream response handling
        let streamedResponse = '';
        setMessages([...newMessages, { role: 'assistant', content: '' }]);
        
        for await (const chunk of llm.stream([systemPrompt, ...newMessages])) {
          streamedResponse += chunk;
          setMessages([...newMessages, { role: 'assistant', content: streamedResponse }]);
        }
      } else {
        // Fallback for non-streaming
        const res = await llm.complete([systemPrompt, ...newMessages]);
        setMessages([...newMessages, { role: 'assistant', content: res.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ **Error:** ${(err as Error).message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-transform z-40 flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100 hover:scale-105'}`}
      >
        <Brain size={24} className="fill-indigo-300/30" />
      </button>

      {/* Side Panel Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot size={18} />
            </div>
            <div className="leading-tight">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Sprint Pulse</h3>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">
                Powered by {activeProvider}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-3 px-4">
              <Brain size={48} className="text-gray-200 dark:text-gray-800" />
              <p>Hi! I'm your AI Sprint Analyst. Ask me anything about the sprint scope, team performance, or bottlenecks.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-[10px] uppercase font-bold tracking-wider">
                <button onClick={() => setInputVal("Who has the most story points assigned?")} className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">Who has the most points?</button>
                <button onClick={() => setInputVal("List all tasks that are currently overrunning their estimates.")} className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">Find Overruns</button>
                <button onClick={() => setInputVal("Write an executive summary of the sprint health.")} className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">Generate Health Summary</button>
              </div>
            </div>
          )}

          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                 {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
               </div>
               <div className={`p-3 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none whitespace-pre-wrap'}`}>
                 {m.content}
               </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                 <Loader2 size={16} className="animate-spin" />
               </div>
               <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl rounded-tl-none text-gray-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <div className="relative flex items-center">
            <textarea
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about the sprint..."
              className="w-full bg-gray-100 dark:bg-gray-950 border-none rounded-xl py-3 pl-4 pr-12 resize-none focus:ring-2 focus:ring-indigo-500 text-sm max-h-32 text-gray-900 dark:text-white"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputVal.trim()}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
             Auto-injecting context from {workItems.length} work items
          </p>
        </div>
      </div>
    </>
  );
}
