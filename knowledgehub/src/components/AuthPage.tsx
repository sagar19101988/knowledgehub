import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Eye, EyeOff, Loader2, Mail, Lock, User,
  AlertCircle, Sun, Moon, Volume2, VolumeX, MailCheck,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useQuestStore } from '../store/useQuestStore';

// ─── Google SVG icon ──────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

type Mode = 'login' | 'signup';

const PREVIEW_MODULES = ['Data Types', 'Control Flow', 'Functions', 'Async / Await', 'Generics', 'Null Safety'];

export function AuthPage() {
  const navigate = useNavigate();
  const {
    loginWithEmail, signupWithEmail, loginWithGoogle, logout, forgotPassword,
    resendVerification, checkVerification,
    actionLoading, pendingVerification, unverifiedEmail, error, clearError,
  } = useAuthStore();
  const theme        = useQuestStore((s) => s.theme);
  const toggleTheme  = useQuestStore((s) => s.toggleTheme);
  const enterGuestMode = useQuestStore((s) => s.enterGuestMode);

  // ── Auth form state ───────────────────────────────────────
  const [mode, setMode]         = useState<Mode>('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) { setEmailError(''); return true; }
    // Reject spaces anywhere, require local@domain.tld pattern
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
    setEmailError(ok ? '' : 'Please enter a valid email address (e.g. you@example.com)');
    return ok;
  };

  // ── Narrator audio ────────────────────────────────────────
  const audioRef               = React.useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted]   = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  React.useEffect(() => {
    const audio = new Audio('/narrator.mpeg');
    audio.volume = 0.92;
    audioRef.current = audio;
    audio.addEventListener('play',  () => setIsSpeaking(true));
    audio.addEventListener('ended', () => setIsSpeaking(false));
    audio.addEventListener('pause', () => setIsSpeaking(false));
    audio.addEventListener('error', () => setIsSpeaking(false));
    const timer = setTimeout(() => {
      if (!audio.muted) audio.play().catch(() => {});
    }, 900);
    return () => { clearTimeout(timer); audio.pause(); audio.src = ''; };
  }, []);

  const handleVoiceToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
      if (audio.ended || audio.paused) { audio.currentTime = 0; audio.play().catch(() => {}); }
    } else {
      audio.muted = true;
      setIsMuted(true);
      setIsSpeaking(false);
    }
  };

  // ── Live preview animation ────────────────────────────────
  const [previewModuleIdx, setPreviewModuleIdx] = useState(0);
  const [previewXp, setPreviewXp]   = useState(750);
  const [previewBar, setPreviewBar] = useState(42);
  const [phase, setPhase]           = useState<'studying' | 'completing' | 'badge'>('studying');
  const [completedSet, setCompletedSet] = useState<number[]>([0, 1]);

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      setPhase('studying');
      timers.push(setTimeout(() => {
        setPhase('completing');
        setCompletedSet(prev => [...prev, previewModuleIdx]);
        timers.push(setTimeout(() => {
          setPhase('badge');
          setPreviewXp(prev => Math.min(prev + 100, 1750));
          setPreviewBar(prev => Math.min(prev + 18, 95));
          timers.push(setTimeout(() => {
            setPreviewModuleIdx(prev => (prev + 1) % PREVIEW_MODULES.length);
            setPhase('studying');
          }, 1800));
        }, 1200));
      }, 2500));
    };
    cycle();
    const loop = setInterval(cycle, 6000);
    return () => { clearInterval(loop); timers.forEach(clearTimeout); };
  }, [previewModuleIdx]);

  // ── Auth handlers ─────────────────────────────────────────
  const switchMode = (m: Mode) => { clearError(); setMode(m); setName(''); setEmail(''); setPassword(''); setEmailError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    if (mode === 'login') {
      await loginWithEmail(email, password);
    } else {
      if (!name.trim()) return;
      await signupWithEmail(name.trim(), email, password);
    }
    // Do NOT navigate manually here.
    // onAuthStateChanged in useAuthStore fires after Firebase confirms the session,
    // which causes LoginRoute to reactively redirect to '/' once user is set.
  };

  const handleForgotPassword = async () => {
    // forgotPassword will surface a "missing email" Firebase error if email is blank
    await forgotPassword(email.trim());
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
    // Same — let onAuthStateChanged + LoginRoute handle the redirect.
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-[#fef7e4] dark:bg-[#07050f] font-sans flex overflow-hidden">

        {/* ══════════════════════════════════════════
            LEFT HERO PANEL — narrator + live preview
        ══════════════════════════════════════════ */}
        <div className="relative hidden md:flex w-[58%] flex-col justify-center gap-10 px-14 py-12 overflow-hidden">

          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.055) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.38, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-fuchsia-500/20 rounded-full blur-[130px]"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.28, 0.15] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px]"
            />
          </div>

          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-7xl font-black bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-none mb-3">
              QA Quest
            </h1>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Master QA Engineering.</p>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-7">
              Six realms of knowledge. Real XP. Boss fights. The only QA learning hub built like a game.
            </p>
            <div className="flex items-center gap-8">
              {[{ v: '6', l: 'Realms' }, { v: '50+', l: 'Modules' }, { v: '8', l: 'XP Levels' }].map(s => (
                <div key={s.l}>
                  <p className="text-3xl font-black bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">{s.v}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live animated preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-400" />
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Live session</p>
            </div>

            {/* App window frame */}
            <div className="bg-white/70 dark:bg-slate-900/70 border border-violet-300/50 dark:border-violet-900/40 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-violet-300/50 dark:border-violet-900/30 bg-white/80 dark:bg-slate-950/50">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <div className="flex-1 mx-4 bg-slate-200/80 dark:bg-slate-800/80 rounded-md h-5 flex items-center px-3">
                  <span className="text-slate-500 dark:text-slate-600 text-xs">qa-quest.app / zone / typescript</span>
                </div>
              </div>

              <div className="p-5 flex gap-5">
                {/* Sidebar */}
                <div className="w-36 flex-shrink-0 space-y-1">
                  <p className="text-slate-500 dark:text-slate-600 text-xs uppercase tracking-wider mb-2 font-semibold">Modules</p>
                  {PREVIEW_MODULES.map((mod, i) => {
                    const isDone   = completedSet.includes(i);
                    const isActive = i === previewModuleIdx;
                    return (
                      <div key={mod} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all duration-500 ${
                        isActive ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                        isDone   ? 'text-slate-500' : 'text-slate-500 dark:text-slate-700'
                      }`}>
                        {isDone   ? <span className="text-emerald-400 flex-shrink-0">✓</span> :
                         isActive ? <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 animate-pulse" /> :
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0" />}
                        <span className="truncate">{mod}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Main content area */}
                <div className="flex-1 space-y-4 min-w-0">
                  {/* Step tabs */}
                  <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl p-1.5">
                    {['📖 Learn', '⚔️ Boss Fight', '✓ Complete'].map((s, i) => (
                      <div key={s} className={`flex-1 text-center text-xs py-1.5 rounded-lg font-semibold transition-all duration-500 ${
                        i === 0 && phase === 'studying'   ? 'bg-slate-700 text-white' :
                        i === 1 && phase === 'completing' ? 'bg-rose-500/80 text-white' :
                        i === 2 && phase === 'badge'      ? 'bg-emerald-500/80 text-white' :
                        'text-slate-500 dark:text-slate-600'
                      }`}>{s}</div>
                    ))}
                  </div>

                  {/* Lesson progress */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{PREVIEW_MODULES[previewModuleIdx]}</span>
                      <span>{previewBar}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: phase === 'completing' || phase === 'badge' ? '100%' : `${previewBar}%` }}
                        transition={{ duration: phase === 'completing' ? 0.8 : 0.3, ease: 'easeOut' }}
                        className={`h-full rounded-full ${phase === 'completing' || phase === 'badge' ? 'bg-emerald-500' : 'bg-violet-500'}`}
                      />
                    </div>
                  </div>

                  {/* XP bar */}
                  <div className="bg-slate-100/80 dark:bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">⚡</span>
                        <span className="text-amber-400 text-xs font-bold">Bug Whisperer</span>
                      </div>
                      <motion.span
                        key={previewXp}
                        initial={{ scale: 1.4, color: '#fbbf24' }}
                        animate={{ scale: 1, color: '#6b7280' }}
                        transition={{ duration: 0.5 }}
                        className="text-xs font-bold text-slate-500"
                      >
                        {previewXp.toLocaleString()} XP
                      </motion.span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${(previewXp / 1800) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Badge flash */}
                  <motion.div
                    animate={{ opacity: phase === 'badge' ? 1 : 0, y: phase === 'badge' ? 0 : 8 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3"
                  >
                    <span className="text-lg">🏆</span>
                    <div>
                      <p className="text-emerald-400 text-xs font-bold">+100 XP — Module Complete!</p>
                      <p className="text-slate-500 text-xs">Type Guardian badge progress</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT AUTH PANEL — login / signup form
        ══════════════════════════════════════════ */}
        <div className="w-full md:w-[42%] flex flex-col justify-center px-8 md:px-12 py-12 border-l border-violet-200/50 dark:border-violet-900/25 bg-[#fef3d0]/90 dark:bg-[#0a0715]/70 backdrop-blur-sm relative">

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg bg-white/60 dark:bg-slate-900/60 border border-violet-200/50 dark:border-violet-900/40 text-slate-500 hover:text-violet-500 transition-all"
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Narrator button */}
          <div className="absolute top-5 left-5">
            <button onClick={handleVoiceToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
                isMuted
                  ? 'bg-white/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/60 text-slate-400 hover:text-slate-600'
                  : 'bg-violet-500/10 border-violet-400/30 dark:border-violet-500/30 text-violet-500 dark:text-violet-400 hover:bg-violet-500/20'
              }`}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {!isMuted && isSpeaking && (
                <div className="flex items-end gap-px h-3">
                  {[0, 0.18, 0.09].map((delay, i) => (
                    <motion.div key={i} className="w-0.5 bg-violet-400 rounded-full"
                      animate={{ height: ['3px', '11px', '3px'] }}
                      transition={{ duration: 0.55, repeat: Infinity, delay, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              )}
              <span className="hidden sm:inline">{isMuted ? 'Narrator off' : isSpeaking ? 'Narrating…' : 'Replay'}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
          {pendingVerification ? (
            /* ── Email verification holding screen ──────────────── */
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-sm mx-auto text-center"
            >
              {/* Icon */}
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(192,38,211,0.2)', '0 0 40px rgba(192,38,211,0.45)', '0 0 20px rgba(192,38,211,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center mb-5 mx-auto"
              >
                <MailCheck size={30} className="text-fuchsia-400" />
              </motion.div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Check your inbox</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                We sent a verification link to:
              </p>
              <p className="text-violet-600 dark:text-violet-400 font-semibold text-sm mb-6 break-all">
                {unverifiedEmail}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-8 leading-relaxed">
                Click the link in the email to activate your account, then press the button below.
              </p>

              {/* Error / success */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border mb-4 ${
                      error.startsWith('✅')
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40'
                        : 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'
                    }`}
                  >
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue button */}
              <motion.button
                onClick={checkVerification}
                disabled={actionLoading}
                whileHover={{ scale: actionLoading ? 1 : 1.01 }}
                whileTap={{ scale: actionLoading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all
                  bg-gradient-to-r from-fuchsia-500 to-violet-600
                  shadow-[0_0_24px_rgba(192,38,211,0.35)]
                  hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                  flex items-center justify-center gap-2 mb-3"
              >
                {actionLoading
                  ? <><Loader2 size={16} className="animate-spin" /> Checking…</>
                  : <>I've verified — Continue →</>
                }
              </motion.button>

              {/* Resend link */}
              <button
                type="button"
                onClick={resendVerification}
                disabled={actionLoading}
                className="text-xs text-violet-500 dark:text-violet-400 hover:underline disabled:opacity-50 transition-colors mb-6 block w-full"
              >
                Resend verification email
              </button>

              {/* Back to login */}
              <div className="pt-4 border-t border-violet-200/40 dark:border-slate-800">
                <button
                  type="button"
                  onClick={async () => { clearError(); await logout(); }}
                  className="text-xs text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            </motion.div>
          ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-full max-w-sm mx-auto"
          >
            {/* Logo */}
            <div className="mb-7">
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(192,38,211,0.2)', '0 0 40px rgba(192,38,211,0.45)', '0 0 20px rgba(192,38,211,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center mb-5"
              >
                <BookOpen size={28} className="text-fuchsia-400" />
              </motion.div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {mode === 'login' ? 'Welcome back' : 'Get started'}
              </h2>
              <p className="text-slate-500 text-sm">
                {mode === 'login' ? 'Continue your quest.' : 'Create your free account.'}
              </p>
            </div>

            {/* Mode toggle tabs */}
            <div className="flex bg-white/60 dark:bg-slate-800/60 rounded-xl p-1 mb-6 border border-violet-200/40 dark:border-violet-900/30">
              {(['login', 'signup'] as Mode[]).map((m) => (
                <button key={m} onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    mode === m
                      ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Google button */}
            <motion.button onClick={handleGoogle} disabled={actionLoading}
              whileHover={{ scale: actionLoading ? 1 : 1.01 }}
              whileTap={{ scale: actionLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all mb-5 disabled:opacity-50 shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-violet-200/60 dark:bg-slate-800" />
              <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">or with email</span>
              <div className="flex-1 h-px bg-violet-200/60 dark:bg-slate-800" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                  >
                    <AuthInput icon={<User size={15} />} type="text" placeholder="Your name"
                      value={name} onChange={setName} autoFocus={mode === 'signup'} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <AuthInput icon={<Mail size={15} />} type="email" placeholder="Email address"
                  value={email} onChange={(v) => { setEmail(v); if (emailError) validateEmail(v); }}
                  onBlur={() => validateEmail(email)}
                  autoFocus={mode === 'login'} />
                {/* Inline format error */}
                <AnimatePresence>
                  {emailError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle size={11} className="shrink-0" />{emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
                {/* Signup hint — only shown when no format error */}
                {mode === 'signup' && !emailError && (
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Mail size={11} className="shrink-0 text-violet-400" />
                    Use a real, accessible email — we'll send a verification link.
                  </p>
                )}
              </div>

              <div className="relative">
                <AuthInput icon={<Lock size={15} />} type={showPw ? 'text' : 'password'}
                  placeholder="Password" value={password} onChange={setPassword} paddingRight />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot password link — only in login mode */}
              {mode === 'login' && (
                <div className="flex justify-end -mt-1">
                  <button type="button" onClick={handleForgotPassword}
                    className="text-xs text-violet-500 dark:text-violet-400 hover:underline transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error / Success */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${
                      error.startsWith('✅')
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40'
                        : 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'
                    }`}
                  >
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit"
                disabled={actionLoading || !email || !!emailError || !password || (mode === 'signup' && !name)}
                whileHover={{ scale: actionLoading ? 1 : 1.01 }}
                whileTap={{ scale: actionLoading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all
                  bg-gradient-to-r from-fuchsia-500 to-violet-600
                  shadow-[0_0_24px_rgba(192,38,211,0.35)]
                  hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                  flex items-center justify-center gap-2"
              >
                {actionLoading
                  ? <><Loader2 size={16} className="animate-spin" /> Please wait…</>
                  : mode === 'login' ? 'Enter the Realm →' : 'Create Account →'
                }
              </motion.button>
            </form>

            {/* Guest bypass */}
            <div className="mt-5 pt-4 border-t border-violet-200/40 dark:border-slate-800">
              <motion.button
                type="button"
                onClick={() => setShowGuestWarning(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all
                  border-2 border-dashed border-slate-300 dark:border-slate-700
                  text-slate-500 dark:text-slate-400
                  hover:border-violet-400 dark:hover:border-violet-600
                  hover:text-violet-600 dark:hover:text-violet-400
                  hover:bg-violet-50 dark:hover:bg-violet-900/10
                  flex items-center justify-center gap-2"
              >
                <span>👤</span> Continue as Guest
              </motion.button>
              <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-2">
                Progress saved on this device only
              </p>
            </div>

            {/* Guest warning modal */}
            <AnimatePresence>
              {showGuestWarning && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                  onClick={() => setShowGuestWarning(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 16 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 border border-violet-200/50 dark:border-violet-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                  >
                    <div className="text-3xl mb-3 text-center">⚠️</div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white text-center mb-2">
                      Guest mode limitations
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed mb-5">
                      Your progress is saved <span className="font-semibold text-slate-700 dark:text-slate-300">on this device only</span>. If you clear your browser, switch devices, or use a different browser — <span className="font-semibold text-red-500">all progress will be lost permanently</span>.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-5">
                      Create a free account to save your XP, badges, and progress to the cloud.
                    </p>
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowGuestWarning(false); switchMode('signup'); }}
                        className="w-full py-3 rounded-xl font-bold text-sm text-white
                          bg-gradient-to-r from-fuchsia-500 to-violet-600
                          shadow-[0_0_24px_rgba(192,38,211,0.35)]
                          hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]"
                      >
                        Create a free account →
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowGuestWarning(false); enterGuestMode(); navigate('/', { replace: true }); }}
                        className="w-full py-3 rounded-xl font-bold text-sm transition-all
                          border border-slate-200 dark:border-slate-700
                          text-slate-500 dark:text-slate-400
                          hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        I understand, continue as guest
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// ─── Reusable styled input ────────────────────────────────────
function AuthInput({ icon, type, placeholder, value, onChange, onBlur, autoFocus, paddingRight }: {
  icon: React.ReactNode; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; onBlur?: () => void;
  autoFocus?: boolean; paddingRight?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">{icon}</span>
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} onBlur={onBlur} autoFocus={autoFocus} required
        className={`w-full bg-white/80 dark:bg-slate-800/60 border border-violet-300/60 dark:border-slate-700/60 rounded-xl
          pl-9 ${paddingRight ? 'pr-10' : 'pr-4'} py-3 text-sm
          text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600
          focus:outline-none focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20 transition-all`}
      />
    </div>
  );
}
