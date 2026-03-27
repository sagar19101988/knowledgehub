// src/components/ui/MorningBriefing.tsx
import { useEffect, useState, useMemo } from 'react';
import { useJobs } from '../../context/JobContext';
import { computeBriefing, markBriefingSeenToday } from '../../utils/briefing';
import {
  Sun, Flame, Briefcase, Clock, Target, Trophy,
  ChevronRight, Star, X, Activity
} from 'lucide-react';

interface MorningBriefingProps {
  onClose: () => void;
}

export default function MorningBriefing({ onClose }: MorningBriefingProps) {
  const { jobs } = useJobs();
  const briefing = useMemo(() => computeBriefing(jobs), [jobs]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    markBriefingSeenToday();
    setTimeout(onClose, 350);
  };

  const scoreColor =
    briefing.healthScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
    briefing.healthScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
    briefing.healthScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
    'text-orange-600 dark:text-orange-400';

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 transition-all duration-300 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop: Adaptive light/dark blur */}
      <div 
        className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-md transition-colors duration-300"
        onClick={handleClose} 
      />

      {/* Card */}
      <div className={`relative w-full max-w-xl bg-white dark:bg-gray-900/95 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-350 ${
        visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-6'
      }`}>

        {/* Decorative top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="p-7">
          {/* Header: Greeting */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-400/20 dark:to-orange-400/20 border border-yellow-200 dark:border-yellow-400/20">
              <Sun size={28} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400/70 uppercase tracking-widest mb-0.5">{dateStr} · {timeStr}</p>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{briefing.greeting}! 👋</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">"{briefing.motivationalLine}"</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {/* Streak */}
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-3.5 text-center transition-colors">
              <Flame size={20} className={`mx-auto mb-1 ${briefing.streakDays > 0 ? 'text-orange-500 dark:text-orange-400' : 'text-gray-300 dark:text-gray-600'}`} />
              <p className="text-2xl font-black text-gray-900 dark:text-white">{briefing.streakDays}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-0.5">Day Streak</p>
            </div>
            {/* Total applied */}
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-3.5 text-center transition-colors">
              <Briefcase size={20} className="mx-auto mb-1 text-indigo-500 dark:text-indigo-400" />
              <p className="text-2xl font-black text-gray-900 dark:text-white">{briefing.totalJobs}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-0.5">Total Jobs</p>
            </div>
            {/* Health score */}
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-3.5 text-center transition-colors">
              <Activity size={20} className={`mx-auto mb-1 ${scoreColor}`} />
              <p className={`text-2xl font-black ${scoreColor}`}>{briefing.healthScore}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-0.5">{briefing.healthLabel}</p>
            </div>
          </div>

          {/* Alerts section */}
          {(briefing.overdueFollowUps.length > 0 || briefing.upcomingInterviews.length > 0 || briefing.offerCount > 0) && (
            <div className="mb-5 space-y-2">
              {briefing.offerCount > 0 && (
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3">
                  <Trophy size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                    🎉 You have <span className="font-bold">{briefing.offerCount} offer{briefing.offerCount > 1 ? 's' : ''}</span> — don't leave them waiting!
                  </p>
                </div>
              )}
              {briefing.overdueFollowUps.length > 0 && (
                <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-3">
                  <Clock size={16} className="text-orange-500 dark:text-orange-400 shrink-0" />
                  <p className="text-sm text-orange-900 dark:text-orange-300 font-medium">
                    <span className="font-bold">{briefing.overdueFollowUps.length} application{briefing.overdueFollowUps.length > 1 ? 's' : ''}</span> need{briefing.overdueFollowUps.length === 1 ? 's' : ''} a follow-up today
                    <span className="text-orange-700/60 dark:text-white/40 font-normal"> — {briefing.overdueFollowUps.map(j => j.company).join(', ')}</span>
                  </p>
                </div>
              )}
              {briefing.upcomingInterviews.length > 0 && (
                <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-3">
                  <Star size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                  <p className="text-sm text-purple-900 dark:text-purple-300 font-medium">
                    <span className="font-bold">{briefing.upcomingInterviews.length} active interview{briefing.upcomingInterviews.length > 1 ? 's' : ''}</span>
                    <span className="text-purple-700/60 dark:text-white/40 font-normal"> — {briefing.upcomingInterviews.map(j => j.company).join(', ')}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Today's targets */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Today's Battle Plan</p>
            </div>
            <div className="space-y-2">
              {briefing.todayTargets.map((target, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-white/5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-500/30 border border-indigo-200 dark:border-indigo-400/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{target}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md text-sm"
            >
              Let's Go
              <ChevronRight size={16} />
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-3 rounded-xl text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 text-sm font-medium transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
