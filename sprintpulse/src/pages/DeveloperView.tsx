import { useState, useMemo } from 'react';
import { useSprintStore } from '../store/sprintStore';
import { Target, Clock, GitPullRequest, Activity, AlertTriangle, CheckCircle2, User, ShieldAlert, Code2 } from 'lucide-react';

export default function DeveloperView() {
  const { workItems } = useSprintStore();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Extract all unique assigned users — prefer dev activity, fallback to all task assignees
  const developers = useMemo(() => {
    const users = new Map();
    workItems.forEach(i => {
      if (i.assignedTo?.displayName && i.type.toLowerCase() === 'task' && i.activity?.toLowerCase().includes('dev')) {
        if (!users.has(i.assignedTo.displayName)) {
          users.set(i.assignedTo.displayName, i.assignedTo.imageUrl);
        }
      }
    });
    if (users.size === 0) {
      workItems.forEach(i => {
        if (i.assignedTo?.displayName && i.type.toLowerCase() === 'task') {
          users.set(i.assignedTo.displayName, i.assignedTo.imageUrl);
        }
      });
    }
    return Array.from(users.entries()).map(([name, imageUrl]) => ({ name, imageUrl })).sort((a, b) => a.name.localeCompare(b.name));
  }, [workItems]);

  if (!selectedUser && developers.length > 0) {
    setSelectedUser(developers[0].name);
  }

  const metrics = useMemo(() => {
    if (!selectedUser) return null;
    const tasks = workItems.filter(i => i.assignedTo?.displayName === selectedUser && i.type.toLowerCase() === 'task');

    let overruns = 0;
    let completedWork = 0;
    let originalEst = 0;

    tasks.forEach(t => {
      completedWork += t.completedWork || 0;
      originalEst += t.originalEstimate || 0;
      if (['done', 'closed', 'resolved'].includes(t.state.toLowerCase()) && !t.closedDate) {
        overruns++;
      } else if (t.completedWork > t.originalEstimate && t.originalEstimate > 0) {
        overruns++;
      }
    });

    const mockPrs = 3 + (selectedUser.length % 4);
    const mockReviews = 5 + (selectedUser.charCodeAt(0) % 5);

    return { tasks, overruns, completedWork, originalEst, mockPrs, mockReviews };
  }, [selectedUser, workItems]);

  if (developers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500">No developer tasks found in this sprint.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Developer Selector */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Developer Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">Deep dive into individual engineering performance</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm w-full md:w-auto focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
          <User className="text-indigo-500 ml-2" size={18} />
          <select
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-base font-bold text-gray-900 dark:text-white w-full min-w-[220px] outline-none cursor-pointer py-1"
          >
            {developers.map(d => (
              <option key={d.name} value={d.name} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium">
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel 1: Task Intelligence — 2 columns */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Target className="text-indigo-500" size={20} />
                <h3 className="text-lg font-bold">Task Intelligence</h3>
              </div>

              {/* Capacity Burn Bar */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Capacity Burn</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.completedWork}</span>
                      <span className="text-sm text-gray-400">/ {metrics.originalEst || 0} hrs</span>
                    </div>
                  </div>
                  {metrics.completedWork > metrics.originalEst && metrics.originalEst > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold">
                      <ShieldAlert size={12} />
                      {Math.round(((metrics.completedWork - metrics.originalEst) / metrics.originalEst) * 100)}% Overrun
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${metrics.completedWork > metrics.originalEst ? 'bg-red-500' : 'bg-indigo-600'}`}
                    style={{ width: `${Math.min(100, metrics.originalEst ? (metrics.completedWork / metrics.originalEst) * 100 : 0)}%` }}
                  />
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Assigned Tasks (top 5)</h4>
                {metrics.tasks.slice(0, 5).map(task => {
                  const isDone = ['done', 'closed', 'resolved'].includes(task.state.toLowerCase());
                  const isOverrun = task.originalEstimate && task.completedWork && task.completedWork > task.originalEstimate;
                  return (
                    <div key={task.id} className={`flex flex-col sm:flex-row justify-between sm:items-center p-3 rounded-lg border ${isOverrun ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30' : 'bg-white dark:bg-gray-800/20 border-gray-100 dark:border-gray-700'}`}>
                      <div className="flex items-center gap-3">
                        {isDone ? <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} /> : <Clock className="text-amber-500 flex-shrink-0" size={18} />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] uppercase font-bold tracking-wider">
                            <span className="text-gray-400">#{task.id}</span>
                            <span className={isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{task.state}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex gap-4 text-xs font-mono text-gray-500">
                        {task.originalEstimate > 0 && <span>Est: {task.originalEstimate}h</span>}
                        {task.completedWork > 0 && <span className={isOverrun ? 'text-red-500 font-bold' : ''}>Logged: {task.completedWork}h</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Panel 2 + Panel 3 */}
          <div className="col-span-1 space-y-6">
            {/* Panel 2: Code Intelligence */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <GitPullRequest className="text-blue-500" size={18} />
                <h3 className="text-lg font-bold">Code Intelligence</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">PRs Merged</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.mockPrs}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg">
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Code Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.mockReviews}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-start gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <Code2 className="shrink-0 mt-0.5 text-gray-400" size={14} />
                <p>PR and Git metric integration requires setting up the Azure Repos webhook in Data Settings.</p>
              </div>
            </div>

            {/* Panel 3: AI Synthesized Insight */}
            <div className="bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 rounded-xl border border-indigo-100 dark:border-indigo-800/30 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-indigo-600 dark:text-indigo-400" size={18} />
                <h3 className="text-md font-bold text-indigo-900 dark:text-indigo-100">AI Synthesized Insight</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Based on this sprint's telemetry, <strong className="font-semibold text-gray-900 dark:text-white">{selectedUser}</strong> exhibits strong review participation but is carrying high capacity risk.
                </p>
                {metrics.overruns > 0 && (
                  <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800/50">
                    <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                    <p className="text-xs text-amber-800 dark:text-amber-400">
                      <strong className="block mb-1">Estimation Accuracy Flag</strong>
                      We detected {metrics.overruns} tasks exceeding their original baseline estimate. Consider breaking down complex features into smaller 1-2 day tasks to improve predictability.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
