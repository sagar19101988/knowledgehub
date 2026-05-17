import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuestStore } from '../store/useQuestStore';
import { UserAvatarMenu } from './UserAvatarMenu';
import { ZONES } from '../data/zones';
import { MASTERY_BADGES } from '../data/questionBank';

const ZONE_LIGHT_TILE: Record<string, { bg: string; border: string; title: string; iconBg: string }> = {
  manual:     { bg: 'bg-orange-50',  border: 'border-orange-200',  title: 'text-orange-800',  iconBg: 'bg-orange-100'  },
  sql:        { bg: 'bg-blue-50',    border: 'border-blue-200',    title: 'text-blue-800',    iconBg: 'bg-blue-100'    },
  api:        { bg: 'bg-violet-50',  border: 'border-violet-200',  title: 'text-violet-800',  iconBg: 'bg-violet-100'  },
  typescript: { bg: 'bg-sky-50',     border: 'border-sky-200',     title: 'text-sky-800',     iconBg: 'bg-sky-100'     },
  playwright: { bg: 'bg-emerald-50', border: 'border-emerald-200', title: 'text-emerald-800', iconBg: 'bg-emerald-100' },
  'ai-qa':    { bg: 'bg-rose-50',    border: 'border-rose-200',    title: 'text-rose-800',    iconBg: 'bg-rose-100'    },
};

export default function BadgesPage() {
  const navigate = useNavigate();
  const theme          = useQuestStore(s => s.theme);
  const unlockedBadges = useQuestStore(s => s.unlockedBadges);
  const masteryBadges  = useQuestStore(s => s.masteryBadges);
  const masteryScores  = useQuestStore(s => s.masteryScores);
  const isDark = theme === 'dark';

  const [backHovered, setBackHovered] = useState(false);

  const completionCount = ZONES.filter(z => unlockedBadges.includes(z.badge)).length;
  const trialCount      = ZONES.filter(z => masteryBadges[z.id] === true).length;

  const accentDark  = 'rgba(251,191,36,1)';   // amber-400 — trophy feel
  const accentLight = 'rgba(99,102,241,1)';    // indigo-500 — matches mastery badge tiles

  return (
    <div className="min-h-screen relative bg-[#eff4fb] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans flex flex-col">

      {/* ── Decorative background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: isDark ? accentDark : accentLight, opacity: isDark ? 0.11 : 0.14 }} />
        <div className="absolute -bottom-48 -right-48 w-[520px] h-[520px] rounded-full blur-[100px]"
          style={{ background: isDark ? accentDark : accentLight, opacity: isDark ? 0.08 : 0.11 }} />
        <div className="absolute -top-28 -right-28 w-[480px] h-[480px] rounded-full"
          style={{ border: `1.5px solid ${isDark ? accentDark : accentLight}`, opacity: isDark ? 0.09 : 0.16 }} />
        <div className="absolute -bottom-40 -left-40 w-[380px] h-[380px] rounded-full"
          style={{ border: `1.5px solid ${isDark ? accentDark : accentLight}`, opacity: isDark ? 0.07 : 0.12 }} />
      </div>

      {/* Nav — matches Mastery Trial intro pattern */}
      <nav className="z-40 h-16 sticky top-0 bg-[#eff4fb]/85 dark:bg-[#0a0715]/80 backdrop-blur border-b border-violet-200/60 dark:border-violet-900/30 px-3 sm:px-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to Home"
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors duration-150 group flex-shrink-0"
          style={{
            background: backHovered ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)') : (isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'),
            borderColor: backHovered ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)') : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
            color: backHovered ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)') : (isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)'),
            boxShadow: backHovered ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.2)') : 'none',
          }}
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-sm font-semibold hidden sm:inline">Back to Home</span>
        </button>

        <h1 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          My Badges
        </h1>

        <UserAvatarMenu />
      </nav>

      {/* Page body */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* Earned count subtitle */}
        <div className="mb-8">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {completionCount + trialCount} of {ZONES.length * 2} badges earned
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* ── Section 1: Completion Badges ── */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border backdrop-blur-sm p-6"
            style={isDark ? {
              background: 'rgba(15,12,30,0.60)',
              borderColor: 'rgba(251,191,36,0.18)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            } : {
              background: 'rgba(210,222,242,0.82)',
              borderColor: 'rgba(180,200,228,0.9)',
              boxShadow: '0 4px 24px rgba(15,23,42,0.10)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
              background: isDark
                ? 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(251,191,36,0.10) 0%, transparent 70%)'
                : 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(251,191,36,0.12) 0%, transparent 70%)',
            }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-amber-400/70' : 'text-slate-500'}`}>Completion Badges</h3>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{completionCount}/{ZONES.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ZONES.map((zone) => {
                  const earned = unlockedBadges.includes(zone.badge);
                  const tint = ZONE_LIGHT_TILE[zone.id];
                  return (
                    <div key={zone.id} className={`relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all ${
                      earned
                        ? isDark ? `${zone.bgColor} ${zone.borderColor} shadow-[0_0_14px_rgba(0,0,0,0.25)]` : `${tint?.bg ?? 'bg-white'} ${tint?.border ?? 'border-slate-200'} shadow-sm`
                        : isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/60 border-slate-300/60'
                    }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 [&>svg]:w-6 [&>svg]:h-6 ${
                        earned ? isDark ? 'bg-slate-900/80' : (tint?.iconBg ?? 'bg-white') : isDark ? 'bg-slate-700/50' : 'bg-white/50'
                      }`}>
                        {earned ? zone.icon : <span className={`text-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>🔒</span>}
                      </div>
                      <p className={`text-sm font-bold leading-tight mb-1 ${earned ? isDark ? zone.colorText : (tint?.title ?? 'text-slate-900') : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {earned ? zone.badge : 'Locked'}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{zone.title}</p>
                      {!earned && <p className={`text-[11px] mt-1.5 leading-snug ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Complete all modules</p>}
                      {earned && <span className="absolute top-2.5 right-2.5 text-sm">⭐</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Mastery Trial Badges ── */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border backdrop-blur-sm p-6"
            style={isDark ? {
              background: 'rgba(15,12,30,0.60)',
              borderColor: 'rgba(139,92,246,0.22)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            } : {
              background: 'rgba(210,222,242,0.82)',
              borderColor: 'rgba(180,200,228,0.9)',
              boxShadow: '0 4px 24px rgba(15,23,42,0.10)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
              background: isDark
                ? 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)'
                : 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 70%)',
            }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-violet-400/70' : 'text-slate-500'}`}>Mastery Trial Badges</h3>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{trialCount}/{ZONES.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ZONES.map((zone) => {
                  const trialBadge = MASTERY_BADGES[zone.id];
                  const earned = masteryBadges[zone.id] === true;
                  const score = masteryScores[zone.id];
                  if (!trialBadge) return null;
                  return (
                    <div key={zone.id} className={`relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all ${
                      earned
                        ? isDark ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/60 shadow-[0_0_16px_rgba(139,92,246,0.35)]' : 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-100 shadow-sm'
                        : isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'
                    }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl ${
                        earned ? isDark ? 'bg-slate-900/80' : 'bg-indigo-100' : isDark ? 'bg-slate-700/50' : 'bg-slate-100'
                      }`}>
                        {earned ? <span className="leading-none">{trialBadge.icon}</span> : <span className={`text-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>🔒</span>}
                      </div>
                      <p className={`text-sm font-bold leading-tight mb-1 ${earned ? isDark ? 'text-violet-300' : 'text-indigo-900' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {earned ? trialBadge.name : 'Locked'}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{zone.title}</p>
                      {earned && score && <p className={`text-[11px] mt-1.5 font-semibold ${isDark ? 'text-slate-400' : 'text-indigo-600'}`}>Best: {score.bestScore}%</p>}
                      {!earned && <p className={`text-[11px] mt-1.5 leading-snug ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Pass the Mastery Trial</p>}
                      {earned && <span className={`absolute top-2.5 right-2.5 text-sm ${!isDark ? 'text-indigo-500' : ''}`}>🏆</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        </div>

      </main>
    </div>
  );
}
