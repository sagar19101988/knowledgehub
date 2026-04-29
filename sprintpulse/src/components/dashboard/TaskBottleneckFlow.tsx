import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import type { WorkItem } from '../../store/sprintStore';
import { Clock, AlertTriangle, FastForward } from 'lucide-react';

interface Props {
  workItems: WorkItem[];
}

export default function TaskBottleneckFlow({ workItems }: Props) {
  const flowMetrics = useMemo(() => {
    // Only analyze Tasks
    const tasks = workItems.filter(i => i.type.toLowerCase() === 'task');
    if (!tasks.length) return null;

    let totalWaitDays = 0;
    let totalActiveDays = 0;
    let completedCount = 0;
    
    // Track longest active task for the risk card
    let longestActiveTask = { id: 0, title: '', days: 0 };

    const now = new Date();

    tasks.forEach(task => {
      const created = task.createdDate ? new Date(task.createdDate) : null;
      const activated = task.activatedDate ? new Date(task.activatedDate) : null;
      const closed = task.closedDate ? new Date(task.closedDate) : null;

      if (!created) return;

      // Calculate Wait Time (Created -> Activated)
      let waitTime = 0;
      if (activated) {
        waitTime = (activated.getTime() - created.getTime()) / (1000 * 3600 * 24);
      } else if (closed) {
        // Went straight to closed from created with no active state
        waitTime = (closed.getTime() - created.getTime()) / (1000 * 3600 * 24);
      } else {
        // Open, not activated yet
        waitTime = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
      }
      
      // Calculate Active Time (Activated -> Closed or Now)
      let activeTime = 0;
      if (activated) {
        const endPoint = closed || now;
        activeTime = (endPoint.getTime() - activated.getTime()) / (1000 * 3600 * 24);
        
        if (!closed && activeTime > longestActiveTask.days) {
          longestActiveTask = { id: task.id, title: task.title, days: activeTime };
        }
      }

      totalWaitDays += Math.max(0, waitTime);
      totalActiveDays += Math.max(0, activeTime);
      
      if (closed) completedCount++;
    });

    const totalTasksTracked = tasks.length;
    const avgWait = totalWaitDays / totalTasksTracked;
    const avgActive = totalActiveDays / totalTasksTracked;
    const avgLeadTime = avgWait + avgActive;

    // We build the chart data summarizing by State
    // "How much time on average do tasks spend in these phases?"
    const chartData = [
      {
        name: 'Average Task Lifecycle',
        Wait: Number(avgWait.toFixed(1)),
        Active: Number(avgActive.toFixed(1)),
      }
    ];

    return {
      avgWait,
      avgActive,
      avgLeadTime,
      completedCount,
      chartData,
      longestActiveTask: longestActiveTask.id ? longestActiveTask : null
    };
  }, [workItems]);

  if (!flowMetrics) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Summary Metrics */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Task Bottleneck Flow</h3>
            <p className="text-xs text-gray-500 mt-0.5">Average time-in-state across all sprint tasks</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-indigo-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Lead Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {flowMetrics.avgLeadTime.toFixed(1)} <span className="text-sm font-normal text-gray-500">days</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <FastForward size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Queue / Wait Ratio</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {flowMetrics.avgLeadTime > 0 ? Math.round((flowMetrics.avgWait / flowMetrics.avgLeadTime) * 100) : 0}%
            </div>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
              % of lifecycle spent waiting
            </p>
          </div>

          {flowMetrics.longestActiveTask && (
             <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
               <div className="flex items-center gap-2 mb-1">
                 <AlertTriangle size={16} className="text-amber-500" />
                 <span className="text-sm font-semibold text-amber-800 dark:text-amber-500">Aging Risk</span>
               </div>
               <div className="text-sm font-medium text-amber-900 dark:text-amber-400 mt-2 line-clamp-2" title={flowMetrics.longestActiveTask.title}>
                 #{flowMetrics.longestActiveTask.id}: {flowMetrics.longestActiveTask.title}
               </div>
               <p className="text-xs font-bold text-amber-700 dark:text-amber-600 mt-2">
                 Active for {flowMetrics.longestActiveTask.days.toFixed(1)} days
               </p>
             </div>
          )}
        </div>

        {/* Right Side: Flow Split Chart */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={flowMetrics.chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} unit=" days" />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value} days`, '']}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                
                {/* Wait Time (Idle Stack) */}
                <Bar dataKey="Wait" name="Waiting to Start" stackId="a" fill="#e5e7eb" radius={[4, 0, 0, 4]}>
                  <Cell fill="var(--color-wait, #9ca3af)" />
                </Bar>
                
                {/* Active Time Stack */}
                <Bar dataKey="Active" name="Actively In-Progress" stackId="a" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-center mt-4 text-xs text-gray-500 max-w-lg mx-auto pt-2">
            <strong>Bottleneck Insight:</strong> If the gray "Waiting" stack is significantly larger than the blue "Active" stack, tasks are lingering in queues rather than being actively worked on. This signals a constraint in capacity or dependency blockers.
          </div>
        </div>
      </div>
    </div>
  );
}
