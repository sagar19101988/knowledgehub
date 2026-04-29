import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Clock, Zap, ShieldAlert, Users, Target, Circle, Layers, ArchiveX, X } from 'lucide-react';
import type { WorkItem, SprintData } from '../../store/sprintStore';

interface Props {
  sprint: SprintData;
  workItems: WorkItem[];
}

type DrillDownType = 'spilled' | 'removed' | 'notstarted' | null;

function StatTile({
  icon, label, value, sub, color, trend, border, onClick, clickable
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  border?: string;
  onClick?: () => void;
  clickable?: boolean;
}) {
  const trendIcon = trend === 'up'
    ? <TrendingUp size={14} className="text-emerald-500" />
    : trend === 'down'
    ? <TrendingDown size={14} className="text-red-500" />
    : <Minus size={14} className="text-gray-400" />;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-xl p-5 border shadow-sm flex flex-col gap-2
        ${border || 'border-gray-200 dark:border-gray-800'}
        ${clickable ? 'cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all' : ''}`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
      {sub && (
        <div className="flex items-center gap-1.5 mt-auto">
          {trend && trendIcon}
          <span className="text-xs text-gray-400">{sub}</span>
        </div>
      )}
      {clickable && Number(value) > 0 && (
        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1">Click to view details →</span>
      )}
    </div>
  );
}

function RiskBadge({ score }: { score: number }) {
  const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
  const color = score >= 70
    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800'
    : score >= 40
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl p-5 border shadow-sm flex flex-col gap-2 ${score >= 70 ? 'border-red-200 dark:border-red-800/50' : score >= 40 ? 'border-amber-200 dark:border-amber-800/50' : 'border-emerald-200 dark:border-emerald-800/50'}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${score >= 70 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : score >= 40 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
        <ShieldAlert size={18} />
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Overrun Risk</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{score}</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mb-0.5 ${color}`}>{level}</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1">
        <div className={`h-1.5 rounded-full transition-all ${score >= 70 ? 'bg-red-500' : score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function DrillDownPanel({ type, items, onClose }: { type: DrillDownType; items: WorkItem[]; onClose: () => void }) {
  if (!type || !items.length) return null;

  const title =
    type === 'spilled' ? '↩️ Spilled PBIs — Carry-over Analysis' :
    type === 'notstarted' ? '⚠️ Not Started PBIs — At-Risk Items' :
    '🗑️ Removed PBIs — Descope Analysis';

  const description =
    type === 'spilled'
      ? 'These PBIs were not completed by sprint end. They were still in an active or unstarted state when the sprint closed.'
      : type === 'notstarted'
      ? 'These PBIs have not been picked up yet. They are at risk of spilling into the next sprint if no action is taken.'
      : 'These PBIs were explicitly removed/descoped from this sprint before completion.';

  const getStateReason = (state: string) => {
    const s = state.toLowerCase();
    if (['active', 'in progress', 'committed'].includes(s)) return { label: 'Was In Progress', reason: 'Work started but not finished before sprint ended.', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' };
    if (['new', 'to do', 'proposed', 'backlog'].includes(s)) return { label: 'Never Started', reason: 'Item was never picked up during the sprint.', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };
    if (s === 'removed') return { label: 'Removed', reason: 'Explicitly descoped — may have been reprioritized or deemed out of scope.', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' };
    return { label: state, reason: 'Item did not reach completion state.', color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-800/50 shadow-sm overflow-hidden animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-red-50/50 dark:bg-red-900/10">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ml-4 mt-0.5">
          <X size={18} />
        </button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map(item => {
          const stateInfo = getStateReason(item.state);
          return (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 shrink-0">#{item.id}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">{item.type}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stateInfo.color}`}>{stateInfo.label}</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">💡 {stateInfo.reason}</p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.tags.filter(t => t).map(tag => (
                      <span key={tag} className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 text-right">
                {item.assignedTo ? (
                  <div className="flex items-center gap-1.5 justify-end">
                    {item.assignedTo.imageUrl && <img src={item.assignedTo.imageUrl} className="w-5 h-5 rounded-full" />}
                    <span className="text-xs text-gray-500">{item.assignedTo.displayName}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Unassigned</span>
                )}
                {item.storyPoints > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{item.storyPoints} pts</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SprintScorecard({ sprint, workItems }: Props) {
  const [drillDown, setDrillDown] = useState<DrillDownType>(null);

  const { metrics, spilledPBIItems, removedPBIItems, notStartedPBIItems } = useMemo(() => {
    if (!workItems.length) return { metrics: null, spilledPBIItems: [], removedPBIItems: [], notStartedPBIItems: [] };

    const sprintStart = sprint.startDate ? new Date(sprint.startDate) : null;
    const sprintEnd = sprint.endDate ? new Date(sprint.endDate) : null;
    const today = new Date();
    const isSprintOver = sprintEnd ? today > sprintEnd : false;
    const daysTotal = sprintStart && sprintEnd
      ? Math.ceil((sprintEnd.getTime() - sprintStart.getTime()) / 86400000) : 14;
    const daysLeft = sprintEnd && !isSprintOver
      ? Math.max(0, Math.ceil((sprintEnd.getTime() - today.getTime()) / 86400000)) : 0;
    const daysElapsed = Math.max(1, daysTotal - daysLeft);

    const PBI_TYPES = ['product backlog item', 'bug', 'user story', 'feature'];
    const EXCLUDED_TYPES = ['sprint goal'];
    const pbiItems = workItems.filter(i =>
      !EXCLUDED_TYPES.includes(i.type.toLowerCase()) &&
      (
        PBI_TYPES.includes(i.type.toLowerCase()) ||
        !i.parentId ||
        !workItems.some(p => p.id === i.parentId)
      )
    );

    const completedPBIs = pbiItems.filter(i => ['done', 'closed', 'resolved'].includes(i.state.toLowerCase()));
    const committedSP = pbiItems.reduce((s, i) => s + (i.storyPoints || 0), 0);
    const velocitySP = completedPBIs.reduce((s, i) => s + (i.storyPoints || 0), 0);
    const usesSP = committedSP > 0;
    const totalPBIs = pbiItems.length;
    const completionPct = totalPBIs > 0 ? Math.round((completedPBIs.length / totalPBIs) * 100) : 0;

    const totalBugs = pbiItems.filter(i => i.type.toLowerCase() === 'bug').length;
    const fixedBugs = pbiItems.filter(i => i.type.toLowerCase() === 'bug' && ['done', 'closed', 'resolved'].includes(i.state.toLowerCase())).length;

    const closedWithDates = completedPBIs.filter(i => i.closedDate && i.createdDate);
    const avgCycleTimeDays = closedWithDates.length
      ? Math.round(closedWithDates.reduce((s, i) => s + (new Date(i.closedDate!).getTime() - new Date(i.createdDate!).getTime()) / 86400000, 0) / closedWithDates.length)
      : null;

    const blockedItems = pbiItems.filter(i => i.tags.some(t => t.toLowerCase().includes('block')) || i.state.toLowerCase().includes('block')).length;
    const inProgress = pbiItems.filter(i => ['in progress', 'active', 'committed', 'approved'].includes(i.state.toLowerCase())).length;
    const notStarted = pbiItems.filter(i => ['new', 'to do', 'proposed', 'backlog'].includes(i.state.toLowerCase())).length;

    const sprintMidpoint = sprintStart && sprintEnd ? new Date((sprintStart.getTime() + sprintEnd.getTime()) / 2) : null;
    const scopeAdded = sprintMidpoint ? pbiItems.filter(i => i.createdDate && new Date(i.createdDate) > sprintMidpoint).length : 0;

    const elapsedPct = (daysElapsed / daysTotal) * 100;
    const completionGap = isSprintOver ? 0 : Math.max(0, elapsedPct - completionPct);
    const rawRisk = isSprintOver ? 0 : Math.min(100, Math.max(0, Math.round((completionGap * 1.0) + (blockedItems * 8) + (scopeAdded * 5))));
    const teamHealth = Math.min(100, Math.max(0, Math.round(completionPct * 0.7 + (100 - rawRisk) * 0.3)));

    // Actual item arrays for drill-down
    const removedPBIItems = pbiItems.filter(i => i.state.toLowerCase() === 'removed');
    const spilledPBIItems = isSprintOver
      ? pbiItems.filter(i => !['done', 'closed', 'resolved', 'removed'].includes(i.state.toLowerCase()))
      : [];
    const notStartedPBIItems = pbiItems.filter(i =>
      ['new', 'to do', 'proposed', 'backlog'].includes(i.state.toLowerCase())
    );

    return {
      metrics: {
        totalPBIs, committedSP, velocitySP, usesSP, completionPct,
        completedPBIs: completedPBIs.length,
        totalBugs, fixedBugs, avgCycleTimeDays,
        blockedItems, inProgress, notStarted,
        removedPBIs: removedPBIItems.length,
        spilledPBIs: spilledPBIItems.length,
        scopeAdded, riskScore: rawRisk, teamHealth,
        daysLeft, isSprintOver,
      },
      spilledPBIItems,
      removedPBIItems,
      notStartedPBIItems,
    };
  }, [sprint, workItems]);

  if (!metrics) return null;

  const toggleDrill = (type: DrillDownType) => {
    setDrillDown(prev => prev === type ? null : type);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-indigo-500 rounded-full" />
        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Sprint Health Scorecard</h3>
      </div>

      {/* Row 1 — Context-aware PBI status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tile 1: Total PBIs — always */}
        <StatTile
          icon={<Target size={18} />}
          label="Total PBIs"
          value={metrics.totalPBIs}
          sub={`${metrics.totalPBIs} in this sprint`}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />

        {/* Tile 2: Done — always */}
        <StatTile
          icon={<Zap size={18} />}
          label="Done"
          value={metrics.completedPBIs}
          sub={`${metrics.completionPct}% completion rate`}
          color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          trend={metrics.completionPct >= 80 ? 'up' : metrics.completionPct >= 50 ? 'neutral' : 'down'}
        />

        {/* Tile 3: In Progress (active) OR Removed (completed) */}
        {!metrics.isSprintOver ? (
          <StatTile
            icon={<Circle size={18} />}
            label="In Progress"
            value={metrics.inProgress}
            sub={metrics.inProgress > 0 ? 'Currently being worked' : 'Nothing in progress yet'}
            color="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          />
        ) : (
          <StatTile
            icon={<ArchiveX size={18} />}
            label="Removed"
            value={metrics.removedPBIs}
            sub={metrics.removedPBIs > 0 ? 'Descoped from sprint' : 'None removed this sprint'}
            color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            clickable={metrics.removedPBIs > 0}
            onClick={() => metrics.removedPBIs > 0 && toggleDrill('removed')}
            border={drillDown === 'removed' ? 'border-orange-400 dark:border-orange-600' : undefined}
          />
        )}

        {/* Tile 4: Spilled (completed) or Not Started / At Risk (active) — always clickable when > 0 */}
        <StatTile
          icon={<Layers size={18} />}
          label={metrics.isSprintOver ? 'Spilled' : 'Not Started'}
          value={metrics.isSprintOver ? metrics.spilledPBIs : metrics.notStarted}
          sub={
            metrics.isSprintOver
              ? metrics.spilledPBIs > 0
                ? 'Click to see which PBIs'
                : '✅ Nothing spilled!'
              : metrics.notStarted > 0
                ? 'Click to see which PBIs'
                : '✅ All items picked up'
          }
          color={
            (metrics.isSprintOver ? metrics.spilledPBIs : metrics.notStarted) > 0
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }
          clickable={
            metrics.isSprintOver ? metrics.spilledPBIs > 0 : metrics.notStarted > 0
          }
          onClick={() => {
            if (metrics.isSprintOver && metrics.spilledPBIs > 0) toggleDrill('spilled');
            else if (!metrics.isSprintOver && metrics.notStarted > 0) toggleDrill('notstarted');
          }}
          border={
            drillDown === 'spilled' || drillDown === 'notstarted'
              ? 'border-red-400 dark:border-red-600'
              : undefined
          }
        />
      </div>

      {/* Drill-down panel */}
      {drillDown === 'spilled' && spilledPBIItems.length > 0 && (
        <DrillDownPanel type="spilled" items={spilledPBIItems} onClose={() => setDrillDown(null)} />
      )}
      {drillDown === 'removed' && removedPBIItems.length > 0 && (
        <DrillDownPanel type="removed" items={removedPBIItems} onClose={() => setDrillDown(null)} />
      )}
      {drillDown === 'notstarted' && notStartedPBIItems.length > 0 && (
        <DrillDownPanel type="notstarted" items={notStartedPBIItems} onClose={() => setDrillDown(null)} />
      )}

      {/* Row 2 — Risk + Time & Flow */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-1">
          <RiskBadge score={metrics.riskScore} />
        </div>
        <StatTile
          icon={<Users size={18} />}
          label="Team Health Index"
          value={`${metrics.teamHealth}/100`}
          sub={metrics.teamHealth >= 70 ? '✅ Healthy' : metrics.teamHealth >= 40 ? '⚠️ Moderate' : '🚨 Needs focus'}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatTile
          icon={<Clock size={18} />}
          label="Avg Lead Time"
          value={metrics.avgCycleTimeDays !== null ? `${metrics.avgCycleTimeDays}d` : 'N/A'}
          sub="Created → Closed (incl. backlog wait)"
          color="bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
        />
        <StatTile
          icon={<AlertTriangle size={18} />}
          label="Blocked Items"
          value={metrics.blockedItems}
          sub={metrics.blockedItems > 0 ? 'Needs immediate action' : 'No blockers 👍'}
          color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          border={metrics.blockedItems > 0 ? 'border-orange-300 dark:border-orange-800' : undefined}
        />
        <StatTile
          icon={<ArchiveX size={18} />}
          label="Removed / Spilled"
          value={metrics.removedPBIs + metrics.spilledPBIs}
          sub={metrics.isSprintOver ? 'Not completed by sprint end' : 'Items at risk'}
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
        <StatTile
          icon={<Layers size={18} />}
          label="Not Started"
          value={metrics.notStarted}
          sub={
            !metrics.isSprintOver && metrics.daysLeft <= 2 && metrics.notStarted > 0
              ? '⚠️ Sprint ending soon'
              : metrics.isSprintOver && metrics.notStarted > 0
              ? '↩️ Spilled over'
              : 'Yet to be picked up'
          }
          color="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          border={!metrics.isSprintOver && metrics.daysLeft <= 2 && metrics.notStarted > 0 ? 'border-amber-300 dark:border-amber-800' : undefined}
        />
        <StatTile
          icon={<TrendingUp size={18} />}
          label="Scope Changes"
          value={metrics.scopeAdded}
          sub="Added after mid-sprint"
          color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
        />
      </div>
    </div>
  );
}
