import React, { useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSprintStore } from '../store/sprintStore';
import SprintCharts from '../components/dashboard/SprintCharts';
import SprintScorecard from '../components/dashboard/SprintScorecard';
import TaskBottleneckFlow from '../components/dashboard/TaskBottleneckFlow';
import ResourceAnalytics from '../components/dashboard/ResourceAnalytics';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function DashboardHome() {
  const { orgUrl, pat, project, team } = useAuthStore();
  const { iterations, sprint, workItems, isLoading, error, fetchSprintById } = useSprintStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Extract core parent items (PBIs/Bugs or orphans) and their attached children
  const { topLevelItems, childMap } = useMemo(() => {
    if (!workItems.length) return { topLevelItems: [], childMap: new Map(), stats: null };
    
    const children = new Map<number, typeof workItems>();
    
    // Group children by parentId
    workItems.forEach(item => {
      if (item.parentId) {
        if (!children.has(item.parentId)) children.set(item.parentId, []);
        children.get(item.parentId)!.push(item);
      }
    });

    // Exclude Sprint Goals — they are planning artefacts, not deliverable PBIs
    const EXCLUDED_TYPES = ['sprint goal'];

    // Top level are PBIs, Bugs, or items that have no parent found in the current fetched batch
    const topLevel = workItems.filter(i => {
      if (EXCLUDED_TYPES.includes(i.type.toLowerCase())) return false;
      return (
        i.type.toLowerCase() === 'product backlog item' ||
        i.type.toLowerCase() === 'bug' ||
        !i.parentId ||
        // If it says it has a parentId, but that parent isn't in this sprint's data, treat it as an orphan top-level
        !workItems.some(p => p.id === i.parentId)
      );
    });

    const total = topLevel.length;
    const completed = topLevel.filter(i => ['done', 'closed', 'resolved'].includes(i.state.toLowerCase())).length;
    const removed = topLevel.filter(i => i.state.toLowerCase() === 'removed').length;
    const inProgress = topLevel.filter(i => ['in progress', 'active', 'committed', 'approved'].includes(i.state.toLowerCase())).length;
    // Spilled items are typically "New" or anything that didn't make it to Done/Removed/InProgress by sprint end
    const spilled = total - completed - removed - inProgress;

    return {
      topLevelItems: topLevel,
      childMap: children,
      stats: {
        total,
        completed,
        inProgress,
        removed,
        spilled: Math.max(0, spilled),
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    };
  }, [workItems]);

  if (isLoading && !sprint) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 animate-pulse"></div>
              <div className="w-1/2 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-red-800 font-bold mb-2">Failed to load Sprint</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
           <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-lg font-bold text-gray-800 dark:text-white">
        <span>{project}</span>
        <ChevronRight size={18} className="text-gray-400" />
        <span>{team}</span>
        <ChevronRight size={18} className="text-gray-400" />
        {sprint && iterations.length > 0 && (
          <select 
            value={sprint.id}
            onChange={(e) => fetchSprintById(orgUrl, pat, project, team, e.target.value)}
            className="bg-transparent border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-bold focus:ring-2 focus:ring-indigo-500 rounded-lg py-1.5 pl-3 pr-8 cursor-pointer appearance-none transition-all outline-none text-base"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            {iterations.map(iter => (
              <option key={iter.id} value={iter.id} className="text-gray-900 dark:text-gray-100 font-medium">
                {iter.name}
              </option>
            ))}
          </select>
        )}
      </div>


      {sprint && <SprintScorecard sprint={sprint} workItems={workItems} />}


      {sprint && <SprintCharts sprint={sprint} workItems={workItems} />}

      {sprint && <TaskBottleneckFlow workItems={workItems} />}

      {sprint && <ResourceAnalytics sprint={sprint} workItems={workItems} />}

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Active Product Backlog</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 min-w-[300px]">Title</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {topLevelItems.map((item) => {
                const children = childMap.get(item.id) || [];
                const isExpanded = expandedItems.has(item.id);
                
                return (
                  <React.Fragment key={item.id}>
                    {/* Parent Row */}
                    <tr 
                      onClick={() => children.length > 0 && toggleExpand(item.id)}
                      className={`transition-colors ${children.length > 0 ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''} ${isExpanded ? 'bg-gray-50 dark:bg-gray-800/30' : ''}`}
                    >
                      <td className="px-4 py-4 text-gray-400">
                        {children.length > 0 ? (
                          isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                        ) : null}
                      </td>
                      <td className="px-4 py-4 font-medium text-indigo-600 dark:text-indigo-400">#{item.id}</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">
                        {item.title}
                        {children.length > 0 && (
                          <span className="ml-3 text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {children.length} tasks
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          ['done','closed','resolved'].includes(item.state.toLowerCase())
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/30'
                            : ['in progress','active','committed'].includes(item.state.toLowerCase())
                            ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/30'
                            : item.state.toLowerCase() === 'removed'
                            ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800/30'
                            : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                        }`}>
                          {item.state}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          {item.assignedTo?.imageUrl ? (
                            <img src={item.assignedTo.imageUrl} className="w-6 h-6 rounded-full bg-gray-200" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          )}
                          <span className="truncate max-w-[120px]">{item.assignedTo?.displayName || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        {item.storyPoints > 0 ? item.storyPoints : '-'}
                      </td>
                    </tr>
                    
                    {/* Children Rows */}
                    {isExpanded && children.map((child: any) => (
                      <tr key={child.id} className="bg-gray-50/50 dark:bg-gray-800/20 border-l-[3px] border-l-indigo-400 dark:border-l-indigo-600">
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-500">#{child.id}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-[10px] font-medium border border-gray-200 dark:border-gray-700">
                            {child.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 pl-4 relative">
                          <div className="absolute left-0 top-1/2 w-3 border-t border-gray-300 dark:border-gray-700"></div>
                          {child.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{child.state}</span>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-2 scale-90 origin-left">
                            {child.assignedTo?.imageUrl ? (
                              <img src={child.assignedTo.imageUrl} className="w-5 h-5 rounded-full" />
                            ) : null}
                            <span className="text-xs text-gray-500">{child.assignedTo?.displayName || ''}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {child.storyPoints > 0 ? child.storyPoints : ''}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
              {topLevelItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No PBIs found in this sprint.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
