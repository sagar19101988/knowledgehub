'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useLLMStore } from '@/store/useLLMStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Bot, Send, User, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent } from '@/components/ui/card';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AgentPage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sprintContext, setSprintContext] = useState<any>(null);
  const [availableSprints, setAvailableSprints] = useState<string[]>([]);
  const [isFetchingContext, setIsFetchingContext] = useState(false);

  const { activeProviderId, activeModelId, configs } = useLLMStore();
  const { azdoConfig } = useSettingsStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHasHydrated(true); }, []);

  const activeConfig = configs?.find(c => c.providerId === activeProviderId);
  const hasSettings = !!(azdoConfig?.pat && azdoConfig?.orgUrl);
  const hasLLMConfig = !!activeConfig;

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Fetch Sprint context to prime the Agent
  const fetchSprintContext = async () => {
    if (!hasSettings) return;
    setIsFetchingContext(true);
    try {
      const res = await fetch('/api/azdo/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ azdoConfig }),
      });
      if (res.ok) {
        const data = await res.json();
        // API returns { sprints: [sprint_object], defaultSprintId, availableSprints }
        const s = data.sprints?.[0] || {};
        if (data.availableSprints) setAvailableSprints(data.availableSprints);
        
        setSprintContext({
          sprintName: s.name || 'Current Sprint',
          summary: {
            totalTasks: s.taskCount || 0,
            done: s.taskDone || 0,
            estimatedHours: s.totalEstimatedHours || 0,
            completedHours: s.totalCompletedHours || 0,
            blocked: s.blocked || 0,
          },
          velocity: {
            aiAssisted: s.aiAnalytics?.avgHoursPerAITask,
            standard: s.aiAnalytics?.avgHoursPerStdTask,
            aiCount: s.aiAssistedTasks || 0,
          },
          prHealth: {
            activePRs: s.prAnalytics?.statusCounts?.active || 0,
            blockedTasks: s.prBlockedTasks || 0,
            avgCycleDays: s.prAnalytics?.avgCycleDays,
          },
          teamAllocation: (s.resourceBreakdown || []).map((r: any) => ({
            name: r.fullName,
            tasks: r.taskCount,
            tasksDone: r.taskDone,
            estimatedHours: r.estimated,
            actualHours: r.completed,
          })),
        });
      }
    } catch (e) {
      console.error('Context fetch failed:', e);
    } finally {
      setIsFetchingContext(false);
    }
  };

  useEffect(() => {
    if (hasSettings && hasHydrated) fetchSprintContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSettings, hasHydrated]);

  // Core chat function: manually streams SSE from /api/chat
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !hasLLMConfig) return;
    setError(null);

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    // Build the message history for the API (exclude the empty assistant placeholder)
    const historyForApi = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          providerId: activeProviderId,
          modelId: activeModelId,
          apiKey: activeConfig?.apiKey,
          dataContext: sprintContext ? JSON.stringify(sprintContext) : null,
          availableSprints,
          azdoConfig,
          baseUrl: window.location.origin
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errData.error || `Request failed: ${res.status}`);
      }

      if (!res.body) throw new Error('Response body is empty.');

      // Stream the SSE body and parse text chunks
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const rawData = line.slice(6).trim();
          if (rawData === '[DONE]') break;

          let parsed;
          try {
            parsed = JSON.parse(rawData);
          } catch (e) {
            console.error('SSE JSON parse error:', e);
            continue;
          }

          if (parsed.type === 'text-delta' && parsed.delta) {
            setMessages(prev => prev.map(m =>
              m.id === assistantId
                ? { ...m, content: m.content + parsed.delta }
                : m
            ));
          } else if (parsed.type === 'error') {
            throw new Error(parsed.error || parsed.errorText || 'Server stream error');
          } else if (parsed.type === 'tool-call') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId && !m.content
                ? { ...m, content: '_Fetching external data..._\n\n' } 
                : m
            ));
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Request failed. Check your API key and connection.');
      // Remove the empty assistant placeholder if nothing came through
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.id === assistantId && !last.content) return prev.slice(0, -1);
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    sendMessage(text);
  };

  if (!hasHydrated) return null;

  if (!hasSettings) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 h-[calc(100vh-64px)]">
        <Card className="max-w-md w-full border border-orange-500/30 bg-orange-500/5 shadow-xl">
          <CardContent className="p-8 text-center space-y-4 flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mb-2 opacity-80" />
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">Setup Required</h2>
            <p className="text-sm text-neutral-400">
              SprintLens Agent requires an active Azure DevOps connection. Please complete setup via Settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasLLMConfig) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 h-[calc(100vh-64px)]">
        <Card className="max-w-md w-full border border-blue-500/30 bg-blue-500/5 shadow-xl">
          <CardContent className="p-8 text-center space-y-4 flex flex-col items-center">
            <Bot className="w-12 h-12 text-blue-500 mb-2 opacity-80" />
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">Connect Your LLM</h2>
            <p className="text-sm text-neutral-400">
              Please configure an LLM provider (OpenAI, Anthropic, or Groq) in your LLM Settings to use the Agent.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto w-full pt-8 pb-4 px-4 overflow-hidden relative">

      {/* Header */}
      <div className="flex items-center justify-between pb-6 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Bot className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Sprint Agent</h1>
            <p className="text-sm font-medium text-neutral-400">Ask detailed questions about sprint capacity, blockers, and AI impact.</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Provider Context</span>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-muted/40 border border-white/5 text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              {activeProviderId} &bull; {activeModelId.split('-').slice(0, 3).join('-')}
            </span>
            <button onClick={fetchSprintContext} disabled={isFetchingContext}
              className="p-1.5 rounded bg-muted/40 hover:bg-muted transition-colors border border-white/5 group" title="Refresh Sprint Context">
              <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${isFetchingContext ? 'animate-spin' : 'group-hover:text-white'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 pr-1 space-y-5 relative">
        <AnimatePresence initial={false}>
          {messages.length === 0 && !isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="text-center w-full max-w-md mx-auto space-y-5">
                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-blue-500 opacity-80" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Hello! I am your SprintLens AI.</h3>
                  <p className="text-sm text-neutral-400 mb-5 leading-relaxed">
                    I have sprint context loaded. Ask me anything about workload, blockers, PRs or velocity.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 text-left">
                  {[
                    'Who is currently carrying the heaviest workload?',
                    'Are there any PR blockers active?',
                    'Summarize our AI velocity impact vs standard tasks.',
                    'Write a short sprint status email for stakeholders.',
                  ].map((prompt, i) => (
                    <button key={i} onClick={() => handleSuggestion(prompt)}
                      className="p-3 text-sm text-neutral-300 bg-muted/20 border border-white/5 rounded-lg hover:bg-muted/40 transition-colors text-left font-medium flex items-center">
                      <Send className="w-3 h-3 text-blue-500 mr-2 shrink-0 opacity-50" />{prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  m.role === 'user' ? 'bg-neutral-800 border-neutral-700 ml-3' : 'bg-blue-500/20 border-blue-500/30 mr-3'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-neutral-300" /> : <Bot className="w-4 h-4 text-blue-400" />}
                </div>
                <div className={`rounded-2xl p-4 shadow-lg ${
                  m.role === 'user'
                    ? 'bg-neutral-800/80 border border-neutral-700/50 text-white rounded-tr-sm'
                    : 'bg-muted/40 border border-white/10 text-neutral-200 rounded-tl-sm w-full'
                }`}>
                  {m.role === 'user' ? (
                    <span className="whitespace-pre-wrap font-medium text-[15px]">{m.content}</span>
                  ) : m.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                      table: ({ ...props }) => <div className="overflow-x-auto my-3"><table className="w-full text-sm border-collapse" {...props} /></div>,
                      th: ({ ...props }) => <th className="border-b border-white/10 bg-white/5 px-3 py-2 font-bold text-left text-blue-400 text-xs" {...props} />,
                      td: ({ ...props }) => <td className="border-b border-white/5 px-3 py-2 text-neutral-300 text-sm" {...props} />,
                      p: ({ ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-white" {...props} />,
                      code: ({ ...props }) => <code className="bg-black/40 px-1.5 py-0.5 rounded text-blue-300 text-xs" {...props} />,
                    }}>
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex flex-row">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mr-3">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="rounded-2xl p-4 bg-muted/40 border border-white/10 rounded-tl-sm">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="text-center py-3 px-4 text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            ⚠️ {error}
          </div>
        )}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Input */}
      <div className="pt-2 shrink-0 mb-2 relative">
        {sprintContext && messages.length > 0 && (
          <div className="absolute -top-9 left-0 right-0 flex justify-center">
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full flex items-center font-bold tracking-wider">
              <Bot className="w-3 h-3 mr-1.5" />
              Context: {sprintContext.summary.totalTasks} Tasks &bull; {sprintContext.prHealth.activePRs} Active PRs
            </span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative group">
          <input
            className="w-full bg-muted/30 hover:bg-muted/40 transition-colors border-2 border-white/10 group-hover:border-white/20 focus:border-blue-500/50 rounded-2xl pl-5 pr-14 py-4 text-[15px] font-medium text-white placeholder-neutral-500 outline-none shadow-xl"
            value={input}
            placeholder="Ask about team blockers, pull requests, or sprint health..."
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-40 disabled:bg-neutral-800 transition-all active:scale-95 shadow-md">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
