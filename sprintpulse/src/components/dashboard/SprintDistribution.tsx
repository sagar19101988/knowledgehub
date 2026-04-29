import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import type { WorkItem } from '../../store/sprintStore';

interface Props {
  workItems: WorkItem[];
}

const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Critical', color: '#ef4444' },
  2: { label: 'High',     color: '#f97316' },
  3: { label: 'Medium',   color: '#eab308' },
  4: { label: 'Low',      color: '#6b7280' },
};

const STATE_COLORS: Record<string, string> = {
  done: '#10b981',
  closed: '#10b981',
  resolved: '#10b981',
  'in progress': '#6366f1',
  active: '#6366f1',
  committed: '#6366f1',
  approved: '#6366f1',
  new: '#9ca3af',
  'to do': '#9ca3af',
  proposed: '#9ca3af',
  removed: '#ef4444',
};

function TagCloud({ tags }: { tags: { tag: string; count: number }[] }) {
  if (!tags.length) return <p className="text-xs text-gray-400 text-center py-6">No tags found in this sprint.</p>;
  const max = Math.max(...tags.map(t => t.count));
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {tags.map(({ tag, count }) => {
        const ratio = count / max;
        const size = ratio > 0.8 ? 'text-base font-bold' : ratio > 0.5 ? 'text-sm font-semibold' : 'text-xs font-medium';
        const opacity = 0.4 + ratio * 0.6;
        return (
          <span
            key={tag}
            className={`px-2.5 py-1 rounded-full bg-indigo-500 text-white ${size} cursor-default select-none transition-transform hover:scale-105`}
            style={{ opacity }}
            title={`${count} item${count !== 1 ? 's' : ''}`}
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
}

export default function SprintDistribution({ workItems }: Props) {
  const { priorityData, stateData, tagData } = useMemo(() => {
    // Priority distribution
    const priorityCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    workItems.forEach(i => {
      const p = i.priority in priorityCounts ? i.priority : 4;
      priorityCounts[p]++;
    });
    const priorityData = [1, 2, 3, 4]
      .filter(p => priorityCounts[p] > 0)
      .map(p => ({
        name: PRIORITY_LABELS[p].label,
        count: priorityCounts[p],
        color: PRIORITY_LABELS[p].color,
      }));

    // State distribution
    const stateCounts: Record<string, number> = {};
    workItems.forEach(i => {
      const s = i.state;
      stateCounts[s] = (stateCounts[s] || 0) + 1;
    });
    const stateData = Object.entries(stateCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([state, count]) => ({
        state,
        count,
        color: STATE_COLORS[state.toLowerCase()] || '#8b5cf6',
      }));

    // Tag frequency
    const tagCounts: Record<string, number> = {};
    workItems.forEach(i => {
      i.tags.filter(t => t.length > 0).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const tagData = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([tag, count]) => ({ tag, count }));

    return { priorityData, stateData, tagData };
  }, [workItems]);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-purple-500 rounded-full" />
        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Work Item Distribution</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Horizontal Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Items by Priority</h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={priorityData}
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.15} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={55} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                  formatter={(val) => [`${val} items`, 'Count']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Distribution Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Items by State</h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stateData}
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.15} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis type="category" dataKey="state" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                  formatter={(val) => [`${val} items`, 'Count']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                  {stateData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tag Cloud */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Tag Intelligence Cloud</h4>
          <div className="h-52 overflow-auto">
            <TagCloud tags={tagData} />
          </div>
        </div>
      </div>
    </div>
  );
}
