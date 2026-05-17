import { useState, useEffect, useCallback, useRef, type ComponentType } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle,
  AlertTriangle, Trophy, RotateCcw, ChevronDown, ChevronUp, Bookmark, CornerDownRight,
} from 'lucide-react';
import { ZONES } from '../data/zones';
import { QUESTION_BANK, MASTERY_BADGES, type MasteryTrialQuestion } from '../data/questionBank';
import { useQuestStore } from '../store/useQuestStore';
import { UserAvatarMenu } from './UserAvatarMenu';
import confetti from 'canvas-confetti';

const TOTAL_QUESTIONS = 30;
const TOTAL_TIME = 30 * 60; // 1800 seconds
const PASS_THRESHOLD = 0.8; // 80% = 24/30

type Answer = number | boolean | string | null;

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function selectQuestions(pool: MasteryTrialQuestion[]): MasteryTrialQuestion[] {
  return shuffleArray(pool).slice(0, TOTAL_QUESTIONS);
}

function isCorrect(q: MasteryTrialQuestion, answer: Answer): boolean {
  if (answer === null || answer === undefined) return false;
  return answer === q.correct;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Floating circular timer widget (fixed, bottom-right) ─────
function CircularTimer({ timeLeft }: { timeLeft: number }) {
  const isDark = useQuestStore(s => s.theme) === 'dark';
  const pct = Math.max(0, timeLeft / TOTAL_TIME);
  const SIZE = 112;
  const STROKE = 8;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - pct);

  const isRed   = timeLeft < 300;
  const isAmber = timeLeft < 600 && !isRed;
  const strokeColor = isRed ? '#ef4444' : isAmber ? '#f59e0b' : (isDark ? '#7c3aed' : '#2563eb');
  const textCls = isRed
    ? 'text-rose-500 dark:text-rose-400'
    : isAmber
      ? 'text-amber-500 dark:text-amber-400'
      : 'text-blue-600 dark:text-violet-400';
  return (
    <div
      className={`fixed bottom-6 right-6 z-[80] rounded-full
        bg-white/92 dark:bg-[#0f0c20]/92 backdrop-blur-sm
        ${isRed ? 'animate-pulse' : ''}`}
      style={{
        width: SIZE,
        height: SIZE,
        boxShadow: isDark
          ? '0 4px 28px rgba(0,0,0,0.18), 0 0 0 1px rgba(139,92,246,0.16)'
          : '0 2px 12px rgba(15,23,42,0.08), 0 0 0 1px #e2e8f0',
      }}
      aria-label={`Time remaining: ${formatTime(timeLeft)}`}
    >
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          strokeWidth={STROKE} fill="none"
          stroke={isDark ? 'rgba(139,92,246,0.14)' : '#e2e8f0'}
        />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          strokeWidth={STROKE} fill="none"
          stroke={strokeColor}
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke 0.6s ease, stroke-dashoffset 0.98s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className={`text-base font-black tabular-nums leading-none tracking-tight ${textCls}`}>
          {formatTime(timeLeft)}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">
          left
        </span>
      </div>
    </div>
  );
}

// ── Floating particle canvas (intro hero backdrop) ────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.8,
      hue: Math.random() > 0.5 ? '139,92,246' : '217,70,239',
      alpha: Math.random() * 0.55 + 0.25,
    }));

    let raf = 0;
    const tick = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
        ctx.shadowColor = `rgba(${p.hue},0.8)`;
        ctx.shadowBlur = 12;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

// ── Per-zone hero illustrations ───────────────────────────────
// Inline SVG so each zone's Mastery Trial intro gets its own "boss portrait"
// without external asset files. New zones can be added by registering here.

function SqlSorceryIllustration({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="sql-disk-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="sql-disk-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#a21caf" />
        </linearGradient>
        <linearGradient id="sql-disk-bot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <radialGradient id="sql-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="rgba(217,70,239,0.55)" />
          <stop offset="60%"  stopColor="rgba(124,58,237,0.18)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#sql-halo)" />
      <g opacity="0.75">
        <line x1="60" y1="28" x2="60" y2="6"  stroke="#f0abfc" strokeWidth="1.4" strokeDasharray="2 3" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1.4s" repeatCount="indefinite" />
        </line>
        <line x1="48" y1="30" x2="42" y2="12" stroke="#c4b5fd" strokeWidth="1"   strokeDasharray="1.5 3" strokeLinecap="round" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="72" y1="30" x2="78" y2="12" stroke="#c4b5fd" strokeWidth="1"   strokeDasharray="1.5 3" strokeLinecap="round" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1.2s" repeatCount="indefinite" />
        </line>
      </g>
      <g>
        <path d="M 28 84 L 28 92 A 32 9 0 0 0 92 92 L 92 84 Z" fill="url(#sql-disk-bot)" stroke="#3b0764" strokeWidth="0.8" />
        <ellipse cx="60" cy="84" rx="32" ry="9" fill="#4c1d95" stroke="#3b0764" strokeWidth="0.8" />
      </g>
      <g>
        <path d="M 28 60 L 28 68 A 32 9 0 0 0 92 68 L 92 60 Z" fill="url(#sql-disk-mid)" stroke="#701a75" strokeWidth="0.8" />
        <ellipse cx="60" cy="60" rx="32" ry="9" fill="url(#sql-disk-mid)" stroke="#701a75" strokeWidth="0.8" />
      </g>
      <g>
        <path d="M 28 36 L 28 44 A 32 9 0 0 0 92 44 L 92 36 Z" fill="url(#sql-disk-top)" stroke="#5b21b6" strokeWidth="0.8" />
        <ellipse cx="60" cy="36" rx="32" ry="9" fill="url(#sql-disk-top)" stroke="#5b21b6" strokeWidth="0.8">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="2.4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="60" cy="33.5" rx="20" ry="3" fill="#ffffff" opacity="0.35" />
      </g>
      <g fill="#fde047">
        <path d="M 20 26 L 21 29.4 L 24.4 30 L 21 30.6 L 20 34 L 19 30.6 L 15.6 30 L 19 29.4 Z" opacity="0.9">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </path>
        <path d="M 100 50 L 100.8 52.4 L 103.2 53.2 L 100.8 54 L 100 56.4 L 99.2 54 L 96.8 53.2 L 99.2 52.4 Z" opacity="0.85">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.2s" begin="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M 16 72 L 16.7 74 L 18.7 74.7 L 16.7 75.4 L 16 77.4 L 15.3 75.4 L 13.3 74.7 L 15.3 74 Z" opacity="0.7">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.6s" begin="0.8s" repeatCount="indefinite" />
        </path>
        <path d="M 102 92 L 102.6 93.7 L 104.3 94.3 L 102.6 94.9 L 102 96.6 L 101.4 94.9 L 99.7 94.3 L 101.4 93.7 Z" opacity="0.75">
          <animate attributeName="opacity" values="0.3;0.85;0.3" dur="2s" begin="1.1s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

function ManualTestingIllustration({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="manual-lens" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="rgba(196,181,253,0.35)" />
          <stop offset="70%"  stopColor="rgba(124,58,237,0.12)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
        <radialGradient id="manual-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="rgba(16,185,129,0.45)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#manual-halo)" />
      <line x1="78" y1="78" x2="100" y2="100" stroke="#5b21b6" strokeWidth="8"   strokeLinecap="round" />
      <line x1="78" y1="78" x2="100" y2="100" stroke="#a78bfa" strokeWidth="4"   strokeLinecap="round" />
      <line x1="80" y1="80" x2="92"  y2="92"  stroke="#ddd6fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="50" cy="50" r="32" fill="url(#manual-lens)" stroke="#7c3aed" strokeWidth="5" />
      <circle cx="50" cy="50" r="32" fill="none"              stroke="#c4b5fd" strokeWidth="1.2" opacity="0.7" />
      <path d="M 32 36 A 24 24 0 0 1 50 26" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      <g>
        <ellipse cx="50" cy="52" rx="11" ry="8" fill="#10b981" stroke="#065f46" strokeWidth="1.2" />
        <line    x1="50" y1="44" x2="50" y2="60"               stroke="#065f46" strokeWidth="1.2" />
        <circle  cx="50" cy="42" r="3.5" fill="#10b981"         stroke="#065f46" strokeWidth="1.2" />
        <path d="M 48 39 Q 45 35 43 32" fill="none" stroke="#065f46" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 52 39 Q 55 35 57 32" fill="none" stroke="#065f46" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="43" cy="32" r="1" fill="#065f46" />
        <circle cx="57" cy="32" r="1" fill="#065f46" />
        <line x1="40" y1="48" x2="34" y2="44" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="40" y1="52" x2="33" y2="52" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="40" y1="56" x2="34" y2="60" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="60" y1="48" x2="66" y2="44" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="60" y1="52" x2="67" y2="52" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="60" y1="56" x2="66" y2="60" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <g>
        <path d="M 95 18 L 99 22 L 106 14" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M 8 96 L 12 100 L 19 92" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.3s" begin="0.7s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

function ApiTestingIllustration({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="api-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="rgba(34,211,238,0.5)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </radialGradient>
        <linearGradient id="api-node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#api-halo)" />
      <path d="M 30 60 Q 60 18 90 60" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3 4" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M 90 60 Q 60 102 30 60" fill="none" stroke="#d946ef" strokeWidth="2" strokeDasharray="3 4" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="14"  dur="1.5s" repeatCount="indefinite" />
      </path>
      <g>
        <circle cx="30" cy="60" r="15" fill="url(#api-node)"   stroke="#0e7490" strokeWidth="1.5" />
        <circle cx="30" cy="60" r="15" fill="none"             stroke="#67e8f9" strokeWidth="1"   opacity="0.6" />
        <line x1="23" y1="55" x2="37" y2="55" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="23" y1="60" x2="37" y2="60" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="23" y1="65" x2="37" y2="65" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="34" cy="55" r="1" fill="#10b981" />
      </g>
      <g>
        <circle cx="90" cy="60" r="15" fill="url(#api-node)"   stroke="#0e7490" strokeWidth="1.5" />
        <circle cx="90" cy="60" r="15" fill="none"             stroke="#67e8f9" strokeWidth="1"   opacity="0.6" />
        <line x1="83" y1="55" x2="97" y2="55" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="83" y1="60" x2="97" y2="60" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="83" y1="65" x2="97" y2="65" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="94" cy="55" r="1" fill="#10b981" />
      </g>
      <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#fde047" stroke="#f59e0b" strokeWidth="0.8" opacity="0.95">
        <animateMotion path="M 30 60 Q 60 18 90 60" dur="1.5s" repeatCount="indefinite" rotate="auto" />
      </rect>
      <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#86efac" stroke="#16a34a" strokeWidth="0.8" opacity="0.95">
        <animateMotion path="M 90 60 Q 60 102 30 60" dur="1.5s" repeatCount="indefinite" rotate="auto" />
      </rect>
    </svg>
  );
}

function TypeScriptIllustration({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="ts-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="rgba(59,130,246,0.55)" />
          <stop offset="60%"  stopColor="rgba(59,130,246,0.18)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
        <linearGradient id="ts-glyph" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#93c5fd" />
          <stop offset="60%"  stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#ts-halo)" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#3b82f6" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.35" />
      <g style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.55))' }}>
        <text
          x="60" y="75"
          textAnchor="middle"
          fontSize="42"
          fontWeight="900"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fill="url(#ts-glyph)"
          letterSpacing="-2.5"
        >&lt;T&gt;</text>
        <text
          x="60" y="75"
          textAnchor="middle"
          fontSize="42"
          fontWeight="900"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fill="#60a5fa"
          letterSpacing="-2.5"
          opacity="0"
        >
          &lt;T&gt;
          <animate attributeName="opacity" values="0;0.4;0" dur="2.6s" repeatCount="indefinite" />
        </text>
      </g>
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontWeight="700">
        <text x="98" y="32" textAnchor="middle" fontSize="13" fill="#7dd3fc">
          &lt;U&gt;
          <animate attributeName="opacity" values="0.4;0.95;0.4" dur="2.4s" repeatCount="indefinite" />
        </text>
        <text x="22" y="98" textAnchor="middle" fontSize="11" fill="#a5b4fc">
          &lt;K&gt;
          <animate attributeName="opacity" values="0.3;0.85;0.3" dur="2.8s" begin="0.5s" repeatCount="indefinite" />
        </text>
        <text x="22" y="32" textAnchor="middle" fontSize="10" fill="#c4b5fd">
          &lt;V&gt;
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.2s" begin="0.8s" repeatCount="indefinite" />
        </text>
      </g>
      <circle cx="98" cy="62" r="2.6" fill="#10b981">
        <animate attributeName="opacity" values="0.45;1;0.45" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function PlaywrightIllustration({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="pw-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="rgba(16,185,129,0.5)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
        </radialGradient>
        <linearGradient id="pw-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0b1220" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#pw-halo)" />
      <g>
        <rect x="14" y="22" width="92" height="76" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <path d="M 14 28 Q 14 22 20 22 L 100 22 Q 106 22 106 28 L 106 38 L 14 38 Z" fill="#1e293b" />
        <line x1="14" y1="38" x2="106" y2="38" stroke="#475569" strokeWidth="1" />
        <circle cx="22" cy="30" r="2" fill="#ef4444" />
        <circle cx="28" cy="30" r="2" fill="#f59e0b" />
        <circle cx="34" cy="30" r="2" fill="#22c55e" />
        <rect x="42" y="27" width="56" height="6" rx="3" fill="#334155" />
        <circle cx="46" cy="30" r="1.2" fill="#94a3b8" />
        <line x1="50" y1="30" x2="94" y2="30" stroke="#64748b" strokeWidth="0.8" />
        <rect x="18" y="42" width="84" height="52" fill="url(#pw-screen)" />
        <rect x="24" y="48" width="38" height="3" rx="1.5" fill="#475569" />
        <rect x="24" y="55" width="60" height="2" rx="1"   fill="#334155" />
        <rect x="24" y="60" width="48" height="2" rx="1"   fill="#334155" />
        <rect x="56" y="72" width="30" height="11" rx="2.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.8">
          <animate attributeName="fill" values="#3b82f6;#60a5fa;#3b82f6" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <text x="71" y="80" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="5.5" fontWeight="800" fill="#ffffff" letterSpacing="0.3">SUBMIT</text>
      </g>
      <g>
        <circle cx="72" cy="78" r="3" fill="none" stroke="#22d3ee" strokeWidth="1.4">
          <animate attributeName="r"       from="3"   to="16"  dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.9" to="0"   dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="72" cy="78" r="3" fill="none" stroke="#22d3ee" strokeWidth="1.4">
          <animate attributeName="r"       from="3"   to="16"  dur="1.8s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.9" to="0"   dur="1.8s" begin="0.6s" repeatCount="indefinite" />
        </circle>
      </g>
      <g>
        <path d="M 70 71 L 70 84 L 73.2 80.8 L 76 86 L 78 85 L 75.2 79.8 L 79 78.8 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" strokeLinejoin="round">
          <animateTransform attributeName="transform" type="translate" values="-4 -3; 0 0; -4 -3" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <circle cx="100" cy="14" r="3" fill="#ef4444">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.1s" repeatCount="indefinite" />
        </circle>
        <text x="94" y="17" textAnchor="end" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="6.5" fontWeight="900" fill="#ef4444" letterSpacing="0.4">REC</text>
      </g>
    </svg>
  );
}

function AiForQaIllustration({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="ai-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="rgba(217,70,239,0.5)" />
          <stop offset="100%" stopColor="rgba(217,70,239,0)" />
        </radialGradient>
        <linearGradient id="ai-brain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#ai-halo)" />
      <g stroke="#a855f7" strokeWidth="2" fill="url(#ai-brain)" opacity="0.88">
        <path d="M 56 30 Q 36 30 28 48 Q 22 60 30 76 Q 26 88 42 92 Q 50 94 56 88 L 56 30 Z" />
        <path d="M 60 30 Q 80 30 88 48 Q 94 60 86 76 Q 90 88 74 92 Q 66 94 60 88 L 60 30 Z" />
      </g>
      <line x1="58" y1="32" x2="58" y2="88" stroke="#5b21b6" strokeWidth="1.2" opacity="0.7" />
      <g>
        <circle cx="40" cy="48" r="2.6" fill="#fde047">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="48" cy="62" r="2.6" fill="#fde047">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="38" cy="76" r="2.6" fill="#fde047">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
        </circle>
      </g>
      <g>
        <circle cx="74" cy="46" r="2.6" fill="#67e8f9">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" begin="0.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="64" r="2.6" fill="#67e8f9">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="72" cy="78" r="2.6" fill="#67e8f9">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" begin="1s"   repeatCount="indefinite" />
        </circle>
      </g>
      <g strokeWidth="0.8" fill="none" opacity="0.55">
        <line x1="40" y1="48" x2="48" y2="62" stroke="#fde047" />
        <line x1="48" y1="62" x2="38" y2="76" stroke="#fde047" />
        <line x1="40" y1="48" x2="38" y2="76" stroke="#fde047" />
        <line x1="74" y1="46" x2="80" y2="64" stroke="#67e8f9" />
        <line x1="80" y1="64" x2="72" y2="78" stroke="#67e8f9" />
        <line x1="74" y1="46" x2="72" y2="78" stroke="#67e8f9" />
      </g>
      <line x1="48" y1="62" x2="80" y2="64" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" />
      <g strokeLinecap="round">
        <line x1="60" y1="14" x2="60" y2="24" stroke="#fde047" strokeWidth="2">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
        </line>
        <line x1="54" y1="18" x2="66" y2="18" stroke="#fde047" strokeWidth="2">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
        </line>
      </g>
    </svg>
  );
}

const ZONE_ILLUSTRATIONS: Record<string, ComponentType<{ size?: number }>> = {
  sql:          SqlSorceryIllustration,
  manual:       ManualTestingIllustration,
  api:          ApiTestingIllustration,
  typescript:   TypeScriptIllustration,
  playwright:   PlaywrightIllustration,
  'ai-qa':      AiForQaIllustration,
};


// ── Question type renderers ───────────────────────────────────

function McqOptions({
  options, answer, submitted, correct, onChange,
}: {
  options: string[];
  answer: Answer;
  submitted: boolean;
  correct: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2.5 mt-6">
      {options.map((opt, i) => {
        const selected = answer === i;
        const isRight = submitted && i === correct;
        const isWrong = submitted && selected && i !== correct;
        const letter = String.fromCharCode(65 + i);
        return (
          <button
            key={i}
            disabled={submitted}
            onClick={() => onChange(i)}
            className={`group w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-xl border-2 transition-all duration-200
              ${isRight  ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/8' :
                isWrong  ? 'border-rose-500 bg-rose-500/10 dark:bg-rose-500/8' :
                selected  ? 'border-blue-500 bg-blue-50 dark:border-violet-500 dark:bg-violet-500/15 dark:shadow-[0_0_0_1px_rgba(124,58,237,0.12)]' :
                submitted ? 'border-slate-200 dark:border-slate-700/60 opacity-40 cursor-not-allowed' :
                            'border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-violet-500/60 hover:bg-blue-50/50 dark:hover:bg-violet-500/8'}`}
          >
            {/* Letter badge */}
            <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black leading-none transition-all duration-200
              ${isRight  ? 'bg-emerald-500 text-white' :
                isWrong  ? 'bg-rose-500 text-white' :
                selected  ? 'bg-blue-600 text-white dark:bg-violet-600 dark:shadow-[0_0_12px_rgba(124,58,237,0.5)]' :
                submitted ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' :
                            'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-violet-500/25 group-hover:text-blue-700 dark:group-hover:text-violet-300'}`}
            >
              {isRight ? '✓' : isWrong ? '✗' : letter}
            </span>
            {/* Option text */}
            <span className={`text-sm flex-1 text-left leading-snug
              ${isRight  ? 'font-semibold text-emerald-700 dark:text-emerald-300' :
                isWrong  ? 'font-semibold text-rose-700 dark:text-rose-300' :
                selected  ? 'font-semibold text-blue-700 dark:text-violet-200' :
                submitted ? 'font-medium text-slate-400 dark:text-slate-500' :
                            'font-medium text-slate-700 dark:text-slate-300'}`}
            >
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TfOptions({
  answer, submitted, correct, onChange,
}: {
  answer: Answer;
  submitted: boolean;
  correct: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-3 mt-6">
      {([true, false] as const).map((val) => {
        const selected = answer === val;
        const isRight = submitted && val === correct;
        const isWrong = submitted && selected && val !== correct;
        const letter = val ? 'T' : 'F';
        const label  = val ? 'True' : 'False';
        return (
          <button
            key={String(val)}
            disabled={submitted}
            onClick={() => onChange(val)}
            className={`group flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all duration-200
              ${isRight  ? 'border-emerald-500 bg-emerald-500/10' :
                isWrong  ? 'border-rose-500 bg-rose-500/10' :
                selected  ? 'border-blue-500 bg-blue-50 dark:border-violet-500 dark:bg-violet-500/15 dark:shadow-[0_0_0_1px_rgba(124,58,237,0.12)]' :
                submitted ? 'border-slate-200 dark:border-slate-700 opacity-40 cursor-not-allowed' :
                val       ? 'border-emerald-400/50 hover:border-emerald-500/80 hover:bg-emerald-500/8' :
                            'border-rose-400/50 hover:border-rose-500/80 hover:bg-rose-500/8'}`}
          >
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-black leading-none transition-all duration-200
              ${isRight  ? 'bg-emerald-500 text-white' :
                isWrong  ? 'bg-rose-500 text-white' :
                selected  ? 'bg-blue-600 text-white dark:bg-violet-600 dark:shadow-[0_0_12px_rgba(124,58,237,0.5)]' :
                submitted ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' :
                val       ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/25' :
                            'bg-rose-500/15 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500/25'}`}
            >
              {isRight ? '✓' : isWrong ? '✗' : letter}
            </span>
            <span className={`text-base font-black
              ${isRight  ? 'text-emerald-600 dark:text-emerald-300' :
                isWrong  ? 'text-rose-600 dark:text-rose-300' :
                selected  ? 'text-blue-700 dark:text-violet-200' :
                submitted ? 'text-slate-400' :
                val       ? 'text-emerald-600 dark:text-emerald-400' :
                            'text-rose-600 dark:text-rose-400'}`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FillBlankOptions({
  blank, chips, answer, submitted, correct, onChange,
}: {
  blank: string;
  chips: string[];
  answer: Answer;
  submitted: boolean;
  correct: string;
  onChange: (v: string) => void;
}) {
  const parts = blank.split('___');
  const filled = typeof answer === 'string' ? answer : null;

  return (
    <div className="mt-6 space-y-6">
      {/* Sentence with blank */}
      <div className="text-base text-slate-700 dark:text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        {parts[0]}
        <span className={`inline-block mx-1 min-w-[120px] px-3 py-0.5 rounded-lg border-2 text-center font-bold transition-colors
          ${submitted && filled === correct ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' :
            submitted && filled !== correct ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300' :
            filled ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-violet-500 dark:bg-violet-500/10 dark:text-violet-300' :
                     'border-dashed border-slate-400 dark:border-slate-500 text-slate-400 dark:text-slate-500'}`}>
          {filled ?? '?'}
        </span>
        {parts[1]}
        {submitted && filled !== correct && (
          <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold">→ {correct}</span>
        )}
      </div>
      {/* Word chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const selected = answer === chip;
          const isRight = submitted && chip === correct;
          const isWrong = submitted && selected && chip !== correct;
          return (
            <button
              key={chip}
              disabled={submitted}
              onClick={() => onChange(chip)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-200
                ${isRight  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' :
                  isWrong  ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300' :
                  selected  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-violet-500 dark:bg-violet-500/15 dark:text-violet-300' :
                  submitted ? 'border-slate-200 dark:border-slate-700 opacity-40 cursor-not-allowed text-slate-500' :
                              'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:border-violet-400 dark:hover:bg-violet-500/8 text-slate-700 dark:text-slate-300'}`}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Zone card themes for the results hero card ────────────────
const ZONE_CARD_THEMES: Record<string, {
  gradient: string; glow: string; accent: string; confettiColors: string[];
}> = {
  manual:     { gradient: 'linear-gradient(135deg, #1a0a03 0%, #2d1506 55%, #0f0602 100%)', glow: 'rgba(249,115,22,0.35)',  accent: '#fb923c', confettiColors: ['#fb923c', '#fbbf24', '#ef4444', '#7c3aed'] },
  sql:        { gradient: 'linear-gradient(135deg, #030d1e 0%, #061828 55%, #020810 100%)', glow: 'rgba(59,130,246,0.35)',  accent: '#60a5fa', confettiColors: ['#60a5fa', '#a5f3fc', '#818cf8', '#fbbf24'] },
  api:        { gradient: 'linear-gradient(135deg, #0f0520 0%, #190840 55%, #080315 100%)', glow: 'rgba(168,85,247,0.40)', accent: '#c084fc', confettiColors: ['#c084fc', '#f0abfc', '#818cf8', '#fbbf24'] },
  typescript: { gradient: 'linear-gradient(135deg, #03101e 0%, #051928 55%, #020a12 100%)', glow: 'rgba(14,165,233,0.35)',  accent: '#38bdf8', confettiColors: ['#38bdf8', '#7dd3fc', '#818cf8', '#fbbf24'] },
  playwright: { gradient: 'linear-gradient(135deg, #031210 0%, #061e18 55%, #020c09 100%)', glow: 'rgba(16,185,129,0.35)',  accent: '#34d399', confettiColors: ['#34d399', '#6ee7b7', '#a3e635', '#fbbf24'] },
  'ai-qa':    { gradient: 'linear-gradient(135deg, #1a030a 0%, #2d0510 55%, #0f0205 100%)', glow: 'rgba(244,63,94,0.35)',   accent: '#fb7185', confettiColors: ['#fb7185', '#f9a8d4', '#c084fc', '#fbbf24'] },
};

// ── Report Card ───────────────────────────────────────────────

function ReportCard({
  questions,
  answers,
  score,
  timeTaken,
  zoneMeta,
  badgeEarned,
  badgeAlreadyHad,
  onRetake,
  onBack,
}: {
  questions: MasteryTrialQuestion[];
  answers: Record<string, Answer>;
  score: number;
  timeTaken: number;
  zoneMeta: typeof ZONES[number];
  badgeEarned: boolean;
  badgeAlreadyHad: boolean;
  onRetake: () => void;
  onBack: () => void;
}) {
  const pct = Math.round((score / questions.length) * 100);
  const passed = score >= Math.ceil(questions.length * PASS_THRESHOLD);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [backTopHovered, setBackTopHovered] = useState(false);
  const [backBottomHovered, setBackBottomHovered] = useState(false);
  const masteryBadge = MASTERY_BADGES[zoneMeta.id];
  const masteryScores = useQuestStore(s => s.masteryScores);
  const isDark = useQuestStore(s => s.theme) === 'dark';
  const attempts = masteryScores[zoneMeta.id]?.attempts ?? 1;
  const theme = ZONE_CARD_THEMES[zoneMeta.id] ?? ZONE_CARD_THEMES['manual'];
  const timeTakenSecs = TOTAL_TIME - timeTaken;

  // ── Dynamic performance verdict ──
  const verdict = (() => {
    if (pct === 100)  return { line: `Flawless run — absolute command of ${zoneMeta.title}.`,        tag: 'LEGENDARY' };
    if (pct >= 93)    return { line: `Elite performance — top-shelf understanding throughout.`,      tag: 'ELITE' };
    if (pct >= 87)    return { line: `Excellent pass — deep grasp of the material with rare gaps.`,  tag: 'EXCELLENT' };
    if (pct >= 80)    return { line: `Solid pass — a handful of expert questions to revisit.`,       tag: 'SOLID' };
    if (pct >= 70)    return { line: `So close — intermediate concepts need another pass.`,          tag: 'NEAR MISS' };
    if (pct >= 50)    return { line: `Foundation in place — focus on the modules and try again.`,    tag: 'BUILDING' };
    return                   { line: `Early days — work through the library, then return.`,          tag: 'EARLY' };
  })();

  // SVG ring geometry
  const RING_SIZE = 180;
  const RING_STROKE = 14;
  const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
  const RING_CIRC = 2 * Math.PI * RING_RADIUS;

  // ── Score count-up animation ──
  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayPct(Math.round(eased * pct));
      if (t < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [pct]);

  // ── Confetti on pass ──
  useEffect(() => {
    if (!passed) return;
    const t = setTimeout(() => {
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.45 }, colors: theme.confettiColors });
    }, 700);
    return () => clearTimeout(t);
  }, [passed, theme.confettiColors]);

  return (
    <div className="min-h-screen relative bg-[#eff4fb] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans overflow-hidden">

      {/* ── Decorative page background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: theme.accent, opacity: isDark ? 0.13 : 0.18 }} />
        <div className="absolute -bottom-48 -right-48 w-[520px] h-[520px] rounded-full blur-[100px]"
          style={{ background: theme.accent, opacity: isDark ? 0.10 : 0.14 }} />
        <div className="absolute -top-28 -right-28 w-[480px] h-[480px] rounded-full"
          style={{ border: `1.5px solid ${theme.accent}`, opacity: isDark ? 0.09 : 0.18 }} />
        <div className="absolute -bottom-40 -left-40 w-[380px] h-[380px] rounded-full"
          style={{ border: `1.5px solid ${theme.accent}`, opacity: isDark ? 0.07 : 0.14 }} />
      </div>

      {/* ── Sticky action bar ── */}
      <div className="sticky top-0 z-40 bg-[#eff4fb]/90 dark:bg-[#07050f]/90 backdrop-blur border-b border-slate-200 dark:border-violet-900/30 h-14 px-3 sm:px-6 flex items-center justify-between">
          <button
            onClick={onBack}
            aria-label="Back to Zone"
            onMouseEnter={() => setBackTopHovered(true)}
            onMouseLeave={() => setBackTopHovered(false)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors duration-150 group flex-shrink-0"
            style={{
              background: backTopHovered ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)') : (isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'),
              borderColor: backTopHovered ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)') : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
              color: backTopHovered ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)') : (isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)'),
              boxShadow: backTopHovered ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.2)') : 'none',
            }}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-xs font-semibold hidden sm:inline">Back to Zone</span>
          </button>
          <UserAvatarMenu />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* ── Hero screenshot card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: theme.gradient,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 20px 60px rgba(0,0,0,0.5), 0 0 100px ${theme.glow}`,
          }}
        >
          {/* Dot-grid texture */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          {/* Top glow bloom */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 45% at 50% 0%, ${theme.glow} 0%, transparent 70%)` }} />

          <div className="relative z-10 px-7 sm:px-10 py-10 flex flex-col items-center text-center gap-6">

            {/* Zone + trial label */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: theme.accent }}>
                {zoneMeta.title} · Mastery Trial
              </p>
              <p className="text-lg font-black text-white/90">{passed ? '✦ Trial Complete' : 'Trial Result'}</p>
            </motion.div>

            {/* Animated score ring with count-up */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-shrink-0"
              style={{ width: RING_SIZE, height: RING_SIZE }}
            >
              <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
                <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} strokeWidth={RING_STROKE} fill="none" stroke="rgba(255,255,255,0.08)" />
                <motion.circle
                  cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
                  strokeWidth={RING_STROKE} fill="none" strokeLinecap="round"
                  stroke={passed ? '#10b981' : '#ef4444'}
                  strokeDasharray={RING_CIRC}
                  initial={{ strokeDashoffset: RING_CIRC }}
                  animate={{ strokeDashoffset: RING_CIRC * (1 - pct / 100) }}
                  transition={{ duration: 1.3, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black tabular-nums leading-none ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {displayPct}%
                </span>
                <span className="text-sm font-bold text-white/50 mt-1">{score} / {questions.length}</span>
              </div>
            </motion.div>

            {/* Verdict */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-[0.22em] px-2.5 py-1 rounded-md"
                style={{ background: `${theme.accent}22`, color: theme.accent, border: `1px solid ${theme.accent}44` }}
              >
                {verdict.tag}
              </span>
              <h1 className={`text-2xl font-black ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {passed ? 'PASSED' : 'NOT PASSED'}
                <span className="ml-2 text-xs font-bold text-white/30">pass mark {Math.ceil(questions.length * PASS_THRESHOLD)}/{questions.length}</span>
              </h1>
              <p className="text-sm text-white/65 leading-snug max-w-xs">{verdict.line}</p>
            </motion.div>

            {/* 3-up stats */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-3 gap-3 w-full">
              {[
                { label: 'Score',    value: `${score}/${questions.length}` },
                { label: 'Time',     value: formatTime(timeTakenSecs) },
                { label: 'Attempts', value: String(attempts) },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                  <p className="text-base font-black text-white tabular-nums">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Badge with pulsing glow */}
            {(badgeEarned || badgeAlreadyHad) && passed && masteryBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, type: 'spring', stiffness: 200 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${theme.accent}55`, boxShadow: `0 0 28px ${theme.glow}` }}
              >
                <motion.span
                  className="text-3xl"
                  animate={{ filter: [`drop-shadow(0 0 0px ${theme.glow})`, `drop-shadow(0 0 14px ${theme.glow})`, `drop-shadow(0 0 0px ${theme.glow})`] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {masteryBadge.icon}
                </motion.span>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent }}>
                    {badgeEarned ? '🎉 Badge Earned!' : '✓ Badge Retained'}
                  </p>
                  <p className="text-sm font-black text-white">{masteryBadge.name}</p>
                </div>
              </motion.div>
            )}

            {/* Footer credit */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
              QA Quest · {zoneMeta.title} Mastery Trial
            </motion.p>

          </div>
        </motion.div>

        {/* ── Action buttons (outside card) ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-3">
          <button
            onClick={onBack}
            onMouseEnter={() => setBackBottomHovered(true)}
            onMouseLeave={() => setBackBottomHovered(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors duration-150 text-sm font-bold group"
            style={{
              background: backBottomHovered ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)') : (isDark ? 'transparent' : 'transparent'),
              borderColor: backBottomHovered ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)') : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
              color: backBottomHovered ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)') : (isDark ? 'rgba(203,213,225,1)' : 'rgba(71,85,105,1)'),
              boxShadow: backBottomHovered ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.2)') : 'none',
            }}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" /> Back to Zone
          </button>
          <button onClick={onRetake} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white text-sm font-black transition dark:shadow-[0_0_18px_rgba(124,58,237,0.35)]">
            <RotateCcw size={15} /> Retake Trial
          </button>
        </motion.div>

        {/* ── Per-question breakdown ── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 overflow-hidden">
          <button
            onClick={() => setBreakdownOpen(o => !o)}
            className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 flex-1 text-left">Question Breakdown</h3>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{questions.length} questions</span>
            {breakdownOpen
              ? <ChevronUp size={16} className="text-slate-400" />
              : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {breakdownOpen && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {questions.map((q, idx) => {
              const userAns = answers[q.id] ?? null;
              const correct = isCorrect(q, userAns);
              const open = expandedIds.has(q.id);

              const formatAnswer = (a: Answer): string => {
                if (a === null) return 'Not answered';
                if (typeof a === 'boolean') return a ? 'True' : 'False';
                if (typeof a === 'number' && q.options) return q.options[a] ?? String(a);
                return String(a);
              };
              const formatCorrect = (): string => {
                if (typeof q.correct === 'boolean') return q.correct ? 'True' : 'False';
                if (typeof q.correct === 'number' && q.options) return q.options[q.correct] ?? String(q.correct);
                return String(q.correct);
              };

              return (
                <div key={q.id}>
                  <button
                    onClick={() => setExpandedIds(prev => {
                      const next = new Set(prev);
                      next.has(q.id) ? next.delete(q.id) : next.add(q.id);
                      return next;
                    })}
                    className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {correct
                      ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                      : <XCircle size={16} className="text-rose-500 flex-shrink-0" />}
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 w-5">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 text-left line-clamp-1">
                      {q.question}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 capitalize">{q.difficulty}</span>
                    {open ? <ChevronUp size={14} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-1 space-y-2 bg-slate-50/60 dark:bg-slate-800/30">
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{q.question}</p>
                          {q.code && (
                            <div className="rounded-lg overflow-hidden text-xs">
                              <SyntaxHighlighter
                                language={q.codeLanguage ?? 'text'}
                                style={isDark ? atomDark : oneLight}
                                customStyle={{
                                  margin: 0,
                                  fontSize: '11px',
                                  borderRadius: '8px',
                                  border: isDark ? 'none' : '1px solid #e2e8f0',
                                }}
                              >
                                {q.code}
                              </SyntaxHighlighter>
                            </div>
                          )}
                          <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${correct ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'}`}>
                            Your answer: {formatAnswer(userAns)}
                          </div>
                          {!correct && (
                            <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                              Correct: {formatCorrect()}
                            </div>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{q.explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Main exam page ────────────────────────────────────────────

export default function MasteryTrialPage() {
  const navigate = useNavigate();
  const { id: zoneId = '' } = useParams<{ id: string }>();
  const zoneMeta = ZONES.find(z => z.id === zoneId);
  const pool = QUESTION_BANK[zoneId] ?? [];

  const recordMasteryResult = useQuestStore(s => s.recordMasteryResult);
  const masteryBadges = useQuestStore(s => s.masteryBadges);
  const isDark = useQuestStore(s => s.theme) === 'dark';
  const masteryScores = useQuestStore(s => s.masteryScores);

  // Initialise questions once (stable across re-renders)
  const [questions] = useState<MasteryTrialQuestion[]>(() => selectQuestions(pool));
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState<'intro' | 'exam' | 'report'>('intro');
  const [timeTaken, setTimeTaken] = useState(0);
  const [blurWarning, setBlurWarning] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [introBackHovered, setIntroBackHovered] = useState(false);
  const [examBackHovered, setExamBackHovered] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState<number | null>(null);

  const toggleFlag = (qid: string) => setFlagged(prev => {
    const next = new Set(prev);
    next.has(qid) ? next.delete(qid) : next.add(qid);
    return next;
  });

  const jumpToNextUnanswered = () => {
    for (let i = 1; i <= questions.length; i++) {
      const idx = (currentIdx + i) % questions.length;
      if (answers[questions[idx].id] === undefined) { setCurrentIdx(idx); return; }
    }
  };
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [badgeAlreadyHad, setBadgeAlreadyHad] = useState(false);

  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  // ── Submit handler ──
  const handleSubmit = useCallback(() => {
    const score = questions.reduce((acc, q) => acc + (isCorrect(q, answers[q.id] ?? null) ? 1 : 0), 0);
    const passed = score / questions.length >= PASS_THRESHOLD;
    const hadBadge = masteryBadges[zoneId] === true;
    recordMasteryResult(zoneId, score, passed);
    setBadgeEarned(passed && !hadBadge);
    setBadgeAlreadyHad(hadBadge);
    setTimeTaken(timeLeft);
    setPhase('report');
  }, [questions, answers, zoneId, masteryBadges, recordMasteryResult, timeLeft]);

  // ── Timer ──
  useEffect(() => {
    if (phase !== 'exam') return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft, handleSubmit]);

  // ── Scroll to top when question changes ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIdx]);

  // ── Hard scroll to top when entering the exam phase (after countdown) ──
  // Without this, if the user scrolled down on the intro to read the rules,
  // the exam Q1 would render mid-page instead of at the top.
  useEffect(() => {
    if (phase === 'exam') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [phase]);

  // ── Tab-blur warning ──
  useEffect(() => {
    if (phase !== 'exam') return;
    const handleBlur = () => { setBlurWarning(true); setTimeout(() => setBlurWarning(false), 3500); };
    document.addEventListener('visibilitychange', handleBlur);
    return () => document.removeEventListener('visibilitychange', handleBlur);
  }, [phase]);

  // ── Browser close/refresh guard ──
  useEffect(() => {
    if (phase !== 'exam') return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [phase]);

  // ── Keyboard shortcuts: A/B/C/D for MCQ, T/F for T-F, arrows to navigate ──
  useEffect(() => {
    if (phase !== 'exam') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (current.type === 'mcq' || current.type === 'code-mcq') {
        const map: Record<string, number> = { a: 0, '1': 0, b: 1, '2': 1, c: 2, '3': 2, d: 3, '4': 3 };
        const idx = map[key];
        if (idx !== undefined && current.options && idx < current.options.length) {
          setAnswers(a => ({ ...a, [current.id]: idx }));
          return;
        }
      }
      if (current.type === 'tf') {
        if (key === 't') { setAnswers(a => ({ ...a, [current.id]: true })); return; }
        if (key === 'f') { setAnswers(a => ({ ...a, [current.id]: false })); return; }
      }
      if (key === 'arrowleft'  && currentIdx > 0)                    setCurrentIdx(i => i - 1);
      if (key === 'arrowright' && currentIdx < questions.length - 1) setCurrentIdx(i => i + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, current, currentIdx, questions.length, setAnswers]);

  // ── Retake (returns to intro so user re-acknowledges rules) ──
  const handleRetake = () => {
    setAnswers({});
    setFlagged(new Set());
    setCurrentIdx(0);
    setTimeLeft(TOTAL_TIME);
    setPhase('intro');
    setBadgeEarned(false);
    setBadgeAlreadyHad(false);
  };

  const handleBegin = () => {
    setCountdown(3);
  };

  // ── 3-2-1 countdown before the trial actually starts ──
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setTimeLeft(TOTAL_TIME);
      setPhase('exam');
      setCountdown(null);
      return;
    }
    const id = setTimeout(() => setCountdown(c => (c === null ? null : c - 1)), 900);
    return () => clearTimeout(id);
  }, [countdown]);

  if (!zoneMeta || pool.length === 0) {
    return (
      <div className="min-h-screen bg-[#eff4fb] dark:bg-[#07050f] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-4xl">⚔️</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">Mastery Trial Coming Soon</p>
          <p className="text-slate-500 text-sm">Questions for this zone are being forged.</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition">
            Back to Zone
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'report') {
    const score = questions.reduce((acc, q) => acc + (isCorrect(q, answers[q.id] ?? null) ? 1 : 0), 0);
    return (
      <ReportCard
        questions={questions}
        answers={answers}
        score={score}
        timeTaken={timeTaken}
        zoneMeta={zoneMeta}
        badgeEarned={badgeEarned}
        badgeAlreadyHad={badgeAlreadyHad}
        onRetake={handleRetake}
        onBack={() => navigate(-1)}
      />
    );
  }

  if (phase === 'intro') {
    const badge = MASTERY_BADGES[zoneId];
    const stats = masteryScores[zoneId];
    const earned = masteryBadges[zoneId] === true;
    const lastAttemptLabel = stats?.lastAttemptAt
      ? new Date(stats.lastAttemptAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      : null;

    const rules: { icon: string; title: string; body: string; accent: string }[] = [
      { icon: '⏱️', title: '30 minutes total',     body: 'One countdown — spend it however you like across the questions.',                                                              accent: '#8b5cf6' },
      { icon: '📋', title: '30 questions',         body: 'A mix of single choice, true/false, code reading, and fill-in-the-blank.',                                                     accent: '#d946ef' },
      { icon: '✅', title: '80% to pass',          body: 'You need 24 out of 30 correct. Failed attempts never lock you out.',                                                            accent: '#10b981' },
      { icon: '🔖', title: 'Mark for review',      body: 'Flag questions to revisit them before submitting. Jump freely between any question.',                                          accent: '#f59e0b' },
      { icon: '⏸️', title: 'No pausing',           body: 'The timer keeps running if you switch tabs or refresh the browser.',                                                            accent: '#f43f5e' },
      { icon: '🏆', title: 'Badge on first pass',  body: `Pass once to earn the ${badge?.name ?? 'Mastery'} badge — kept forever, even if later attempts don't pass.`,                    accent: '#6366f1' },
    ];

    const introTheme = ZONE_CARD_THEMES[zoneId] ?? ZONE_CARD_THEMES['manual'];

    return (
      <div className="min-h-screen relative bg-[#eff4fb] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans overflow-hidden">

        {/* ── Decorative page background ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0" style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: introTheme.accent, opacity: isDark ? 0.13 : 0.18 }} />
          <div className="absolute -bottom-48 -right-48 w-[520px] h-[520px] rounded-full blur-[100px]"
            style={{ background: introTheme.accent, opacity: isDark ? 0.10 : 0.14 }} />
          <div className="absolute -top-28 -right-28 w-[480px] h-[480px] rounded-full"
            style={{ border: `1.5px solid ${introTheme.accent}`, opacity: isDark ? 0.09 : 0.18 }} />
          <div className="absolute -bottom-40 -left-40 w-[380px] h-[380px] rounded-full"
            style={{ border: `1.5px solid ${introTheme.accent}`, opacity: isDark ? 0.07 : 0.14 }} />
        </div>

        {/* ── 3-2-1 countdown overlay (fires on Begin Trial) ── */}
        <AnimatePresence>
          {countdown !== null && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="font-black tabular-nums leading-none"
                style={{
                  fontSize: 'clamp(180px, 30vw, 360px)',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #d946ef 50%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 60px rgba(217,70,239,0.6)) drop-shadow(0 0 120px rgba(124,58,237,0.4))',
                }}
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sticky top nav — back button matches ZoneView Library ── */}
        <nav className="h-16 sticky top-0 z-40 bg-[#eff4fb]/85 dark:bg-[#0a0715]/80 backdrop-blur border-b border-violet-200/60 dark:border-violet-900/30 px-3 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back to Zone"
            onMouseEnter={() => setIntroBackHovered(true)}
            onMouseLeave={() => setIntroBackHovered(false)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors duration-150 group flex-shrink-0"
            style={{
              background: introBackHovered ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)') : (isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'),
              borderColor: introBackHovered ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)') : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
              color: introBackHovered ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)') : (isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)'),
              boxShadow: introBackHovered ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.2)') : 'none',
            }}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm font-semibold hidden sm:inline">Back to Zone</span>
          </button>
          <UserAvatarMenu />
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 relative z-10">

          {/* ── A: Cinematic hero ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border-2 border-violet-500/40 dark:border-violet-500/50"
            style={{
              background: 'linear-gradient(135deg, rgba(12,9,28,0.97) 0%, rgba(28,14,52,0.97) 50%, rgba(40,16,64,0.97) 100%)',
              boxShadow: '0 0 60px rgba(124,58,237,0.25), 0 20px 60px rgba(0,0,0,0.4)',
              minHeight: 340,
            }}
          >
            {/* Floating particles */}
            <ParticleCanvas />

            {/* Dual rotating glow rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
                className="absolute rounded-full"
                style={{
                  width: 360, height: 360,
                  border: '1px solid rgba(139,92,246,0.28)',
                  boxShadow: 'inset 0 0 60px rgba(139,92,246,0.16), 0 0 60px rgba(139,92,246,0.16)',
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute rounded-full"
                style={{
                  width: 250, height: 250,
                  border: '1px dashed rgba(217,70,239,0.38)',
                  boxShadow: 'inset 0 0 40px rgba(217,70,239,0.14), 0 0 40px rgba(217,70,239,0.18)',
                }}
              />
            </div>

            {/* Hero content */}
            <div className="relative z-10 px-7 sm:px-10 py-12 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.55, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl mb-6 leading-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.28), rgba(217,70,239,0.28))',
                  border: '2px solid rgba(217,70,239,0.55)',
                  boxShadow: '0 0 50px rgba(217,70,239,0.5), 0 0 100px rgba(124,58,237,0.4), inset 0 0 30px rgba(255,255,255,0.06)',
                }}
              >
                {(() => {
                  const Illustration = ZONE_ILLUSTRATIONS[zoneId];
                  if (Illustration) return <Illustration size={88} />;
                  if (earned && badge) return badge.icon;
                  return '⚔️';
                })()}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-[11px] font-black uppercase tracking-[0.32em] text-violet-300 mb-2.5"
              >
                {zoneMeta.title} · Mastery Trial
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-black leading-tight mb-3 max-w-xl"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #f5d0fe 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                {earned ? `Defend your ${badge?.name ?? 'badge'}` : `Earn the ${badge?.name ?? 'Mastery'} badge`}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                className="text-sm text-slate-300/85 leading-relaxed max-w-md"
              >
                A 30-question, 30-minute trial covering everything in this zone. Take it when you're ready.
              </motion.p>
            </div>
          </motion.div>

          {/* ── C: Rules as 2×3 glow cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 px-1">Trial Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rules.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="relative rounded-2xl p-4 bg-white/70 dark:bg-slate-900/50 cursor-default transition-all duration-300"
                  style={{ border: `1.5px solid ${r.accent}33` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${r.accent}99`;
                    e.currentTarget.style.boxShadow = `0 0 24px ${r.accent}33, inset 0 0 18px ${r.accent}12`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${r.accent}33`;
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 leading-none"
                      style={{
                        background: `${r.accent}1a`,
                        border: `1px solid ${r.accent}40`,
                        boxShadow: `0 0 14px ${r.accent}25`,
                      }}
                    >
                      {r.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-snug">{r.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{r.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* History (if any prior attempts) */}
          {stats && stats.attempts > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-5"
            >
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Your History</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-violet-500/10 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-400">Best Score</p>
                  <p className="text-xl font-black tabular-nums text-violet-700 dark:text-violet-400 mt-0.5">{stats.bestScore}/30</p>
                </div>
                <div className="rounded-xl bg-slate-500/10 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Attempts</p>
                  <p className="text-xl font-black tabular-nums text-slate-700 dark:text-slate-300 mt-0.5">{stats.attempts}</p>
                </div>
                <div className="rounded-xl bg-slate-500/10 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Last Attempt</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-300 mt-0.5">{lastAttemptLabel}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action — Begin Trial (Back button lives in the sticky top bar) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="pt-2"
          >
            <button
              onClick={handleBegin}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-black text-sm shadow-[0_0_22px_rgba(37,99,235,0.35)] dark:shadow-[0_0_22px_rgba(5,150,105,0.35)] transition"
            >
              <Trophy size={16} /> Begin Trial <ArrowRight size={15} />
            </button>
          </motion.div>

          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            The 30-minute timer starts when you click <span className="font-bold">Begin Trial</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eff4fb] dark:bg-[#07050f] text-slate-800 dark:text-slate-200 font-sans flex flex-col">

      {/* ── Leave confirmation modal ── */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-[#12102a] rounded-2xl border border-slate-200 dark:border-violet-900/50 p-6 max-w-sm w-full shadow-2xl"
            >
              <AlertTriangle size={28} className="text-amber-500 mb-3" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Leave the trial?</h3>
              <p className="text-sm text-slate-500 mb-5">Your progress and answers will be lost. The timer cannot be paused.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLeaveModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">Stay</button>
                <button onClick={() => navigate(-1)} className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition">Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit confirmation modal ── */}
      <AnimatePresence>
        {showSubmitModal && (() => {
          const unansweredIdxs = questions.map((q, i) => answers[q.id] === undefined ? i : -1).filter(i => i >= 0);
          const flaggedIdxs    = questions.map((q, i) => flagged.has(q.id) ? i : -1).filter(i => i >= 0);
          const unansweredCount = unansweredIdxs.length;
          const flaggedCount    = flaggedIdxs.length;
          const state: 'zero' | 'partial' | 'all' =
            unansweredCount === questions.length ? 'zero' :
            unansweredCount > 0 ? 'partial' : 'all';

          const headline =
            state === 'zero'    ? "You haven't answered any questions yet — submit anyway?" :
            state === 'partial' ? `${unansweredCount} ${unansweredCount === 1 ? 'question is' : 'questions are'} unanswered. They'll be marked wrong.` :
            flaggedCount > 0    ? `You flagged ${flaggedCount} ${flaggedCount === 1 ? 'question' : 'questions'} for review. Submit anyway?` :
                                  'Ready to submit your trial?';
          const accent =
            state === 'zero'    ? 'rose'   :
            state === 'partial' ? 'amber'  :
            flaggedCount > 0    ? 'amber'  :
                                  'emerald';

          const jumpTo = (idx: number) => { setCurrentIdx(idx); setShowSubmitModal(false); };
          const reviewUnanswered = () => { if (unansweredIdxs.length > 0) jumpTo(unansweredIdxs[0]); };
          const reviewFlagged    = () => { if (flaggedIdxs.length > 0)    jumpTo(flaggedIdxs[0]); };

          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-[#12102a] rounded-2xl border border-slate-200 dark:border-violet-900/50 p-6 max-w-md w-full shadow-2xl"
              >
                <div className={`mb-3 ${
                  accent === 'rose'    ? 'text-rose-500'    :
                  accent === 'amber'   ? 'text-amber-500'   :
                                         'text-emerald-500'
                }`}>
                  {accent === 'emerald'
                    ? <CheckCircle2 size={28} />
                    : <AlertTriangle size={28} />}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug">
                  {headline}
                </h3>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="rounded-lg bg-emerald-500/10 px-2 py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Answered</p>
                    <p className="text-xl font-black tabular-nums text-emerald-700 dark:text-emerald-400">{answeredCount}</p>
                  </div>
                  <div className={`rounded-lg px-2 py-2 ${unansweredCount > 0 ? 'bg-rose-500/10' : 'bg-slate-500/10'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${unansweredCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>Unanswered</p>
                    <p className={`text-xl font-black tabular-nums ${unansweredCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>{unansweredCount}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 dark:bg-violet-500/10 px-2 py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-violet-400">Time Left</p>
                    <p className="text-xl font-black tabular-nums text-blue-700 dark:text-violet-400">{formatTime(timeLeft)}</p>
                  </div>
                </div>

                {/* Clickable unanswered chips */}
                {unansweredCount > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                      <XCircle size={12} /> Unanswered ({unansweredCount}):
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                      {unansweredIdxs.map(i => (
                        <button
                          key={i}
                          onClick={() => jumpTo(i)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition"
                        >
                          Q{i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clickable flagged chips */}
                {flaggedCount > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                      <Bookmark size={12} className="fill-amber-500 text-amber-500" /> Marked for review ({flaggedCount}):
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                      {flaggedIdxs.map(i => (
                        <button
                          key={i}
                          onClick={() => jumpTo(i)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition"
                        >
                          Q{i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 min-w-[90px] py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  {unansweredCount > 0 && (
                    <button
                      onClick={reviewUnanswered}
                      className="flex-1 min-w-[130px] py-2.5 rounded-xl border border-blue-500 bg-blue-50 text-sm font-bold text-blue-700 hover:bg-blue-100 dark:border-violet-500 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20 transition"
                    >
                      Review unanswered
                    </button>
                  )}
                  {unansweredCount === 0 && flaggedCount > 0 && (
                    <button
                      onClick={reviewFlagged}
                      className="flex-1 min-w-[130px] py-2.5 rounded-xl border border-amber-500 bg-amber-500/10 text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition"
                    >
                      Review flagged
                    </button>
                  )}
                  <button
                    onClick={() => { setShowSubmitModal(false); handleSubmit(); }}
                    className={`flex-1 min-w-[110px] py-2.5 rounded-xl text-sm font-black text-white transition
                      ${accent === 'rose'    ? 'bg-rose-500 hover:bg-rose-600' :
                        accent === 'amber'   ? 'bg-amber-500 hover:bg-amber-600' :
                                               'bg-emerald-600 hover:bg-emerald-700'}`}
                  >
                    {state === 'all' && flaggedCount === 0 ? 'Submit Trial' : 'Submit anyway'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── Floating circular timer (fixed bottom-right) ── */}
      <CircularTimer timeLeft={timeLeft} />

      {/* ── Tab-blur warning toast ── */}
      <AnimatePresence>
        {blurWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] bg-amber-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
          >
            <AlertTriangle size={15} /> Tab switch detected — timer keeps running!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <header className="h-20 border-b border-violet-200/60 dark:border-violet-900/30 bg-white/85 dark:bg-[#0a0715]/80 backdrop-blur px-4 sm:px-6 flex items-center gap-3 sticky top-0 z-50">
        {/* Left: Exit (fuchsia-glow) + zone name */}
        <button
          onClick={() => setShowLeaveModal(true)}
          aria-label="Exit trial"
          onMouseEnter={() => setExamBackHovered(true)}
          onMouseLeave={() => setExamBackHovered(false)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors duration-150 group flex-shrink-0"
          style={{
            background: examBackHovered ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)') : (isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'),
            borderColor: examBackHovered ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)') : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
            color: examBackHovered ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)') : (isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)'),
            boxShadow: examBackHovered ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.2)') : 'none',
          }}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-sm font-semibold hidden sm:inline">Back to Zone</span>
        </button>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="[&>svg]:w-6 [&>svg]:h-6">{zoneMeta.icon}</span>
          <span className="hidden sm:inline text-base font-black text-slate-900 dark:text-white">
            {zoneMeta.title}
          </span>
        </div>

        {/* Center: Prev / Q counter / Next */}
        <div className="flex-1 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            aria-label="Previous question"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-violet-400 hover:enabled:text-violet-500 hover:enabled:bg-violet-50 dark:hover:enabled:bg-violet-900/20 transition"
          >
            <ArrowLeft size={15} />
          </button>
          <span className="text-base font-black text-slate-700 dark:text-slate-200 tabular-nums min-w-[70px] text-center">
            Q {currentIdx + 1} <span className="font-normal text-slate-400">/ {questions.length}</span>
          </span>
          <button
            onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
            disabled={currentIdx === questions.length - 1}
            aria-label="Next question"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-violet-400 hover:enabled:text-violet-500 hover:enabled:bg-violet-50 dark:hover:enabled:bg-violet-900/20 transition"
          >
            <ArrowRight size={15} />
          </button>
        </div>

        <UserAvatarMenu onExit={() => setShowLeaveModal(true)} />
      </header>

      {/* ── Body: sidebar (question map) + main (question) ── */}
      <div className="flex-1 flex">

        {/* Left sidebar: question map (lg+ only) */}
        <aside className="hidden lg:block w-64 border-r border-violet-200/60 dark:border-violet-900/30 bg-white/40 dark:bg-[#0a0715]/40 flex-shrink-0">
          <div className="sticky top-20 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Questions</h3>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tabular-nums">
                {answeredCount} / {questions.length}
              </span>
            </div>

            {/* Subtle inline "next pending" link */}
            <button
              onClick={jumpToNextUnanswered}
              disabled={answeredCount === questions.length}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-violet-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors -mt-2"
            >
              <CornerDownRight size={11} /> Next pending
            </button>

            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                const isFlagged = flagged.has(q.id);
                const tipParts = [`Q${idx + 1}`, answered ? 'Answered' : 'Unanswered', isFlagged ? 'Marked for review' : ''].filter(Boolean);
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    title={tipParts.join(' · ')}
                    className={`relative aspect-square rounded-lg text-xs font-bold transition-all duration-150
                      ${isCurrent   ? `${zoneMeta.bgColor} ${zoneMeta.colorText} ring-2 ring-current ring-offset-1 dark:ring-offset-[#0a0715] border ${zoneMeta.borderColor}` :
                        answered    ? 'bg-violet-500 text-white hover:bg-violet-600' :
                                      'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white dark:ring-[#0a0715]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit button (always present, becomes prominent when last Q or all answered) */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className={`w-full flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-sm font-black text-white transition
                ${answeredCount === questions.length
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_18px_rgba(5,150,105,0.35)]'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-violet-600 dark:hover:bg-violet-700'}`}
            >
              <Trophy size={15} /> Submit Trial
            </button>
          </div>
        </aside>

        {/* Main question area */}
        <main className="flex-1 min-w-0">
          {/* Mobile question map (horizontal strip) */}
          <div className="lg:hidden border-b border-violet-200/60 dark:border-violet-900/30 bg-white/60 dark:bg-[#0a0715]/60 px-4 py-3 overflow-x-auto sidebar-scroll">
            <div className="flex gap-1.5 min-w-max">
              {questions.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                const isFlagged = flagged.has(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative w-7 h-7 rounded-lg text-xs font-bold transition-all duration-150 flex-shrink-0
                      ${isCurrent   ? `${zoneMeta.bgColor} ${zoneMeta.colorText} ring-2 ring-current ring-offset-1 dark:ring-offset-[#0a0715] border ${zoneMeta.borderColor}` :
                        answered    ? 'bg-violet-500 text-white' :
                                      'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white dark:ring-[#0a0715]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-2xl mx-auto w-full px-4 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl border border-violet-500/20 dark:border-violet-500/25 bg-white dark:bg-[#100d22] p-6 sm:p-8"
                style={{ boxShadow: '0 0 0 1px rgba(139,92,246,0.06), 0 4px 28px rgba(0,0,0,0.1), 0 0 80px rgba(139,92,246,0.07)' }}
              >
                {/* Q-badge + type label + bookmark */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-violet-600/20 border border-blue-200 dark:border-violet-500/25 flex-shrink-0">
                      <span className="text-xs font-black text-blue-700 dark:text-violet-300 tabular-nums">Q{currentIdx + 1}</span>
                      <span className="text-[10px] text-blue-500/60 dark:text-violet-400/55 font-bold">/{questions.length}</span>
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 truncate">
                      {{ mcq: 'Single Choice', tf: 'True / False', 'code-mcq': 'Code Reading', 'fill-blank': 'Fill in Blank' }[current.type]}
                      <span className="mx-1.5 opacity-40">·</span>
                      {current.difficulty.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFlag(current.id)}
                    aria-pressed={flagged.has(current.id)}
                    aria-label={flagged.has(current.id) ? 'Remove review mark' : 'Mark for review'}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-all duration-200 flex-shrink-0
                      ${flagged.has(current.id)
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 shadow-[0_0_0_1px_rgba(245,158,11,0.25)]'
                        : 'bg-white dark:bg-slate-900/50 border-amber-400 dark:border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500'}`}
                  >
                    <Bookmark size={13} className={flagged.has(current.id) ? 'fill-amber-500 text-amber-600' : ''} />
                    <span className="hidden sm:inline">{flagged.has(current.id) ? 'Flagged' : 'Flag'}</span>
                  </button>
                </div>

                {/* Question text */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-4">
                  {current.question}
                </h2>

                {/* Code block (code-mcq) */}
                {current.code && current.type === 'code-mcq' && (
                  <div className="rounded-xl overflow-hidden mt-4 mb-2">
                    <SyntaxHighlighter
                      language={current.codeLanguage ?? 'text'}
                      style={isDark ? atomDark : oneLight}
                      customStyle={{
                        margin: 0,
                        fontSize: '13px',
                        borderRadius: '12px',
                        padding: '16px',
                        border: isDark ? 'none' : '1px solid #e2e8f0',
                      }}
                    >
                      {current.code}
                    </SyntaxHighlighter>
                  </div>
                )}

                {/* Answer choices */}
                {(current.type === 'mcq' || current.type === 'code-mcq') && current.options && (
                  <McqOptions
                    options={current.options}
                    answer={answers[current.id] ?? null}
                    submitted={false}
                    correct={current.correct as number}
                    onChange={(v) => setAnswers(a => ({ ...a, [current.id]: v }))}
                  />
                )}
                {current.type === 'tf' && (
                  <TfOptions
                    answer={answers[current.id] ?? null}
                    submitted={false}
                    correct={current.correct as boolean}
                    onChange={(v) => setAnswers(a => ({ ...a, [current.id]: v }))}
                  />
                )}
                {current.type === 'fill-blank' && current.blank && current.chips && (
                  <FillBlankOptions
                    blank={current.blank}
                    chips={current.chips}
                    answer={answers[current.id] ?? null}
                    submitted={false}
                    correct={current.correct as string}
                    onChange={(v) => setAnswers(a => ({ ...a, [current.id]: v }))}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile-only sticky Submit footer */}
          <div className="lg:hidden sticky bottom-0 border-t border-violet-200/60 dark:border-violet-900/30 bg-white/85 dark:bg-[#0a0715]/80 backdrop-blur px-4 py-3">
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex-1">
                {answeredCount} / {questions.length} answered
              </span>
              <button
                onClick={() => setShowSubmitModal(true)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-white transition
                  ${answeredCount === questions.length
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_18px_rgba(5,150,105,0.35)]'
                    : 'bg-violet-600 hover:bg-violet-700'}`}
              >
                <Trophy size={14} /> Submit
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
