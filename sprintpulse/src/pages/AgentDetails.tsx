import { Brain } from 'lucide-react';

export default function AgentDetails() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-indigo-500/50">
        <Brain size={32} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI Agent Details</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        The persistent AI Agent module (9D) is coming soon. This agent will provide natural language 
        sprint insights, automated dependency risk checking, and code-review intelligence.
      </p>
    </div>
  );
}
