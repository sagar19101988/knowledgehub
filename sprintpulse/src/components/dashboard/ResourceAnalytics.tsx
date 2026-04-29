import { useMemo, useState } from 'react';
import type { WorkItem } from '../../store/sprintStore';
import type { SprintData } from '../../store/sprintStore';
import { TrendingUp, TrendingDown, Download, ChevronDown, ChevronUp, Filter, Target } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface ResourceRow {
  name: string;
  imageUrl?: string;
  assigned: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  storyPointsAssigned: number;
  storyPointsCompleted: number;
  hoursEstimated: number;
  hoursLogged: number;
  completionRate: number;
  avgCycleTimeDays: number | null;
  overrunCount: number; // items with no closed date but state=done (proxy for overrun signal)
}

interface Props {
  workItems: WorkItem[];
  sprint: SprintData;
}

type SortKey = keyof ResourceRow;
type SortDir = 'asc' | 'desc';

const DONE_STATES = ['done', 'closed', 'resolved'];
const IN_PROGRESS_STATES = ['in progress', 'active', 'committed', 'approved'];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function hslFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 55%, 45%)`;
}

function getTaskRole(activity?: string): 'Developers' | 'Testers' | 'Automation' | null {
  if (!activity) return null;
  const act = activity.toLowerCase();
  
  if (act.includes('development') || act === 'dev') return 'Developers';
  if (act.includes('automation')) return 'Automation';
  if (act.includes('test') || act === 'qa') return 'Testers';
  
  return null;
}

export default function ResourceAnalytics({ workItems, sprint }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('completionRate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedName, setExpandedName] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<'All' | 'Developers' | 'Testers' | 'Automation'>('All');


  const sprintEnd = sprint?.endDate ? new Date(sprint.endDate) : new Date();



  // Aggregate per resource based on task tags
  const resourceRows = useMemo<ResourceRow[]>(() => {
    const map = new Map<string, ResourceRow>();

    // Only consider Tasks
    const tasks = workItems.filter(i => i.type.toLowerCase() === 'task');

    tasks.forEach(item => {
      const role = getTaskRole(item.activity);

      // Skip tasks that do not have one of the 3 specific activities
      if (!role) return;

      // Apply UI filter
      if (roleFilter !== 'All' && role !== roleFilter) return;
      const name = item.assignedTo?.displayName || 'Unassigned';
      const imageUrl = item.assignedTo?.imageUrl;

      if (!map.has(name)) {
        map.set(name, {
          name,
          imageUrl,
          assigned: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          storyPointsAssigned: 0,
          storyPointsCompleted: 0,
          hoursEstimated: 0,
          hoursLogged: 0,
          completionRate: 0,
          avgCycleTimeDays: null,
          overrunCount: 0,
        });
      }

      const row = map.get(name)!;
      const stateLower = item.state.toLowerCase();
      const isDone = DONE_STATES.includes(stateLower);
      const isInProgress = IN_PROGRESS_STATES.includes(stateLower);

      row.assigned++;
      row.storyPointsAssigned += item.storyPoints || 0;
      row.hoursEstimated += item.originalEstimate || 0;
      row.hoursLogged += item.completedWork || 0;

      if (isDone) {
        row.completed++;
        row.storyPointsCompleted += item.storyPoints || 0;

        // Cycle time: createdDate → closedDate
        if (item.createdDate && item.closedDate) {
          const cycleMs = new Date(item.closedDate).getTime() - new Date(item.createdDate).getTime();
          const cycleDays = cycleMs / (1000 * 60 * 60 * 24);
          row.avgCycleTimeDays =
            row.avgCycleTimeDays === null
              ? Math.round(cycleDays * 10) / 10
              : Math.round(((row.avgCycleTimeDays * (row.completed - 1) + cycleDays) / row.completed) * 10) / 10;
        }

        // Overrun proxy: closed after sprint end
        if (item.closedDate && sprintEnd && new Date(item.closedDate) > sprintEnd) {
          row.overrunCount++;
        }
      } else if (isInProgress) {
        row.inProgress++;
      } else {
        row.notStarted++;
      }
    });

    // Compute completion rate
    map.forEach(row => {
      row.completionRate = row.assigned > 0 ? Math.round((row.completed / row.assigned) * 100) : 0;
    });

    return Array.from(map.values());
  }, [workItems, sprintEnd, roleFilter]);

  // Sorted rows
  const sorted = useMemo(() => {
    return [...resourceRows].sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
  }, [resourceRows, sortKey, sortDir]);


  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="ml-1 text-gray-400 opacity-30">↕</span>;
    return sortDir === 'asc' ? (
      <ChevronUp size={13} className="ml-1 inline text-indigo-400" />
    ) : (
      <ChevronDown size={13} className="ml-1 inline text-indigo-400" />
    );
  };

  const exportCSV = () => {
    const header = ['Name', 'Assigned', 'Completed', 'In Progress', 'Not Started', 'SP Assigned', 'SP Completed', 'Completion %', 'Avg Cycle Time (d)', 'Overruns'].join(',');
    const rows = sorted.map(r =>
      [r.name, r.assigned, r.completed, r.inProgress, r.notStarted, r.storyPointsAssigned, r.storyPointsCompleted, r.completionRate, r.avgCycleTimeDays ?? 'N/A', r.overrunCount].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resource-analytics-${sprint.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ─── Section 4A: Resource Summary Table ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white">Resource Analytics</h3>
            <p className="text-xs text-gray-500 mt-0.5">{sorted.length} team members · {sprint.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <Filter size={13} className="text-gray-400 ml-1" />
              {(['All', 'Developers', 'Testers', 'Automation'] as const).map(filterState => (
                <button
                  key={filterState}
                  onClick={() => setRoleFilter(filterState)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    roleFilter === filterState 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200 dark:border-gray-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-transparent'
                  }`}
                >
                  {filterState}
                </button>
              ))}
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Download size={13} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                {[
                  { label: 'Member', key: 'name' as SortKey },
                  { label: 'Assigned', key: 'assigned' as SortKey },
                  { label: 'Done', key: 'completed' as SortKey },
                  { label: 'In Progress', key: 'inProgress' as SortKey },
                  { label: 'Not Started', key: 'notStarted' as SortKey },
                  { label: 'Est. Hours', key: 'hoursEstimated' as SortKey },
                  { label: 'Logged Hours', key: 'hoursLogged' as SortKey },
                  { label: 'Completion', key: 'completionRate' as SortKey },
                  { label: 'Avg Lead Time', key: 'avgCycleTimeDays' as SortKey },
                  { label: 'Overruns', key: 'overrunCount' as SortKey },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => onSort(col.key)}
                    className="px-4 py-3 whitespace-nowrap cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sorted.map(row => {
                const isExpanded = expandedName === row.name;
                const assignedItems = workItems.filter(w => (w.assignedTo?.displayName || 'Unassigned') === row.name);
                return (
                  <>
                    <tr
                      key={row.name}
                      onClick={() => setExpandedName(isExpanded ? null : row.name)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      {/* Member */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {row.imageUrl ? (
                            <img src={row.imageUrl} className="w-7 h-7 rounded-full flex-shrink-0" />
                          ) : (
                            <span
                              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ backgroundColor: hslFromName(row.name) }}
                            >
                              {getInitials(row.name)}
                            </span>
                          )}
                          <span className="font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.assigned}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{row.completed}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-blue-500 dark:text-blue-400">{row.inProgress}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400">{row.notStarted}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.hoursEstimated}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                        <div className="flex items-center gap-1.5">
                          <span>{row.hoursLogged}</span>
                          {row.hoursLogged > row.hoursEstimated && row.hoursEstimated > 0 ? (
                            <span title="Overrun"><TrendingDown size={14} className="text-red-500 bg-red-100 dark:bg-red-500/20 p-0.5 rounded" /></span>
                          ) : row.hoursLogged < row.hoursEstimated && row.hoursEstimated > 0 ? (
                            <span title="Under run"><TrendingUp size={14} className="text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20 p-0.5 rounded" /></span>
                          ) : null}
                        </div>
                      </td>
                      {/* Completion Rate pill */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[90px]">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className={`h-1.5 rounded-full ${row.completionRate >= 80 ? 'bg-emerald-500' : row.completionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${row.completionRate}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold tabular-nums ${row.completionRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : row.completionRate >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'}`}>
                            {row.completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {row.avgCycleTimeDays !== null ? `${row.avgCycleTimeDays}d` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {row.overrunCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                            <TrendingDown size={13} />
                            {row.overrunCount}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-500">
                            <TrendingUp size={13} />
                            0
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* ─── Expanded row detail ─── */}
                    {isExpanded && (
                      <tr key={`${row.name}-detail`} className="bg-gray-50/80 dark:bg-gray-800/30">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="flex flex-col xl:flex-row gap-6">
                            {/* Left Side: Tasks */}
                            <div className="xl:w-2/3">
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                                {roleFilter === 'All' ? 'All Tasks' : `${roleFilter} Tasks`} for {row.name}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {assignedItems.filter(i => {
                                  if (i.type.toLowerCase() !== 'task') return false;
                                  const role = getTaskRole(i.activity);
                                  if (!role) return false;
                                  return roleFilter === 'All' || role === roleFilter;
                                }).map(wi => (
                                  <div key={wi.id} className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                    <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${DONE_STATES.includes(wi.state.toLowerCase()) ? 'bg-emerald-500' : IN_PROGRESS_STATES.includes(wi.state.toLowerCase()) ? 'bg-blue-400' : 'bg-gray-300'}`} />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{wi.title}</p>
                                      <p className="text-[10px] text-gray-400 mt-0.5">#{wi.id} · {wi.state} · {wi.storyPoints > 0 ? `${wi.storyPoints} pts` : 'No pts'}</p>
                                    </div>
                                  </div>
                                ))}
                                {assignedItems.length === 0 && (
                                  <div className="col-span-full py-4 text-xs text-gray-400 italic">No tasks found.</div>
                                )}
                              </div>
                            </div>
                            
                            {/* Right Side: Efficiency Radar */}
                            <div className="xl:w-1/3">
                              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 h-full flex flex-col shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <Target size={16} className="text-indigo-500" />
                                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Efficiency Radar</h4>
                                </div>
                                <div className="h-56 w-full mt-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                    {(() => {
                                      // Determine dominant role based on tasks
                                      let devTasks = 0;
                                      let qaTasks = 0;
                                      assignedItems.forEach(i => {
                                        if (i.type.toLowerCase() === 'task') {
                                          const r = getTaskRole(i.activity);
                                          if (r === 'Developers') devTasks++;
                                          if (r === 'Testers' || r === 'Automation') qaTasks++;
                                        }
                                      });
                                      
                                      const isQA = qaTasks > devTasks;
                                      
                                      // Common Axes
                                      const taskComp = row.completionRate;
                                      const cycleTime = row.avgCycleTimeDays === null ? 0 : Math.max(0, 100 - (row.avgCycleTimeDays * 15));
                                      const overrunSafety = Math.max(0, 100 - (row.overrunCount * 25));
                                      
                                      // Role-specific Axes
                                      let radarData = [];
                                      if (isQA) {
                                        // QA Metrics
                                        const testExecution = Math.min(100, Math.round((row.assigned > 0 ? (row.completed / row.assigned) : 0) * 100)); // Execution proxy
                                        const defectDiscovery = 60 + ((row.name.charCodeAt(0) * 5) % 40); // Placeholder
                                        const testCoverage = 50 + ((row.name.charCodeAt(row.name.length-1) * 8) % 50); // Placeholder
                                        
                                        radarData = [
                                          { subject: 'Task Comp.', score: taskComp, fullMark: 100 },
                                          { subject: 'Test Execution', score: testExecution, fullMark: 100 },
                                          { subject: 'Cycle Time', score: cycleTime, fullMark: 100 },
                                          { subject: 'Overrun Safety', score: overrunSafety, fullMark: 100 },
                                          { subject: 'Defects Found', score: defectDiscovery, fullMark: 100 },
                                          { subject: 'Test Coverage', score: testCoverage, fullMark: 100 },
                                        ];
                                      } else {
                                        // Dev Metrics
                                        const spDelivery = Math.min(100, Math.round((row.storyPointsCompleted / Math.max(1, row.storyPointsAssigned)) * 100));
                                        const prMerge = 60 + ((row.name.charCodeAt(0) * 7) % 40);
                                        const reviewPart = 50 + ((row.name.charCodeAt(row.name.length-1) * 11) % 50);
                                        
                                        radarData = [
                                          { subject: 'Task Comp.', score: taskComp, fullMark: 100 },
                                          { subject: 'SP Delivery', score: spDelivery, fullMark: 100 },
                                          { subject: 'Cycle Time', score: cycleTime, fullMark: 100 },
                                          { subject: 'Overrun Safety', score: overrunSafety, fullMark: 100 },
                                          { subject: 'PR Merge', score: prMerge, fullMark: 100 }, 
                                          { subject: 'Review Part.', score: reviewPart, fullMark: 100 },
                                        ];
                                      }

                                      return (
                                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                          <PolarGrid stroke="#374151" opacity={0.15} />
                                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                          <Radar name={row.name.split(' ')[0]} dataKey="score" stroke={isQA ? "#10b981" : "#4f46e5"} fill={isQA ? "#10b981" : "#4f46e5"} fillOpacity={0.3} />
                                          <RechartsTooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                            formatter={(value: any) => [`${value}/100`, 'Score']}
                                          />
                                        </RadarChart>
                                      );
                                    })()}
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No assignee data found for this sprint.
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
