import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { WorkItem, SprintData } from '../../store/sprintStore';

interface SprintChartsProps {
  sprint: SprintData;
  workItems: WorkItem[];
}

export default function SprintCharts({ sprint, workItems }: SprintChartsProps) {
  // --- 1. Hours-based Burndown (OriginalEstimate vs CompletedWork) ---
  const burndownData = useMemo(() => {
    if (!sprint.startDate || !sprint.endDate || workItems.length === 0) return [];

    // Sum up estimates across ALL items (Tasks, PBIs, Bugs) case someone tracks hours directly on PBIs
    const totalHours = workItems.reduce((sum, i) => sum + (i.originalEstimate || 0), 0);
    const burnUnit = totalHours;
    const label = 'Hours';

    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const allDays: Date[] = [];
    const d = new Date(start);
    while (d <= end) {
      if (d.getDay() !== 0 && d.getDay() !== 6) allDays.push(new Date(d)); // weekdays only
      d.setDate(d.getDate() + 1);
    }
    const workingDays = allDays.length || 1;
    const idealDropPerDay = burnUnit / workingDays;

    return allDays.map((day, idx) => {
      const isFuture = day > new Date();
      const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);

      let burnedUpToDay = 0;
      
      // Sum: completedWork logged by this day (use closedDate as proxy if completedWork = 0)
      workItems.forEach(item => {
        if (item.completedWork > 0) {
          // Treat completedWork as fully logged when item was closed
          if (item.closedDate && new Date(item.closedDate) <= dayEnd) {
            burnedUpToDay += item.completedWork;
          } else if (!item.closedDate && ['done', 'closed', 'resolved'].includes(item.state.toLowerCase())) {
            burnedUpToDay += item.completedWork; // closed, no date — count it
          }
        } else if (
          item.originalEstimate > 0 &&
          item.closedDate && new Date(item.closedDate) <= dayEnd
        ) {
          // No completedWork logged but item is closed → treat estimate as burned
          burnedUpToDay += item.originalEstimate;
        }
      });

      const remaining = Math.max(0, burnUnit - burnedUpToDay);

      return {
        day: `D${idx + 1} (${day.toLocaleDateString('en', { month: 'short', day: 'numeric' })})`,
        [`Ideal (${label})`]: Math.max(0, Math.round((burnUnit - idealDropPerDay * idx) * 10) / 10),
        [`Remaining (${label})`]: isFuture ? null : Math.round(remaining * 10) / 10,
        label,
      };
    });
  }, [sprint, workItems]);

  return (
    <div className="mb-6">
      {/* Burndown Chart Element */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sprint Delivery Burndown</h3>
            {burndownData.length > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                Remaining hours (Original Estimate − Completed Work) per sprint day
              </p>
            )}
          </div>
          {burndownData.length > 0 && (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              ⏱ Hours Mode
            </span>
          )}
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={burndownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 600 }}
                formatter={(value: any, name: any) => [
                  `${value} ${burndownData[0]?.label ?? ''}`,
                  name
                ]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {burndownData.length > 0 && (
                <>
                  <Area
                    type="monotone"
                    dataKey={`Ideal (${burndownData[0]?.label})`}
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none"
                  />
                  <Area
                    type="stepAfter"
                    dataKey={`Remaining (${burndownData[0]?.label})`}
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    connectNulls={false}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
