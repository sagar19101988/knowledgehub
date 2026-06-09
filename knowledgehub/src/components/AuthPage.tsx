import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  BookOpen, Eye, EyeOff, Loader2, Mail, Lock, User,
  AlertCircle, Sun, Moon, Volume2, VolumeX, MailCheck,
  // Tour: zone icons (must match src/data/zones.tsx)
  ShieldAlert, Database, Cpu, Code, Play, ShieldCheck,
  // Tour: chrome / scene icons
  Map as MapIcon, LayoutGrid, Check, Zap, Target,
  Lightbulb, Download,
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
  const [hoveredTab, setHoveredTab] = useState<Mode | null>(null);
  const [googleHovered, setGoogleHovered] = useState(false);
  const [guestHovered, setGuestHovered] = useState(false);

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

  const isDark = theme === 'dark';

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [3, -3]), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-600, 600], [-3, 3]), { stiffness: 80, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <motion.div
        initial={{ opacity: 0, scale: 0.78, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="min-h-screen bg-[#eff4fb] dark:bg-[#07050f] font-sans flex overflow-hidden"
      >

        {/* ══════════════════════════════════════════
            LEFT HERO PANEL — 6-feature tabbed tour
        ══════════════════════════════════════════ */}
        <LeftPanelTour isDark={isDark} />

        {/* ══════════════════════════════════════════
            RIGHT AUTH PANEL — login / signup form
        ══════════════════════════════════════════ */}
        <div className={`w-full md:w-[42%] flex flex-col justify-center px-8 md:px-12 py-12 backdrop-blur-sm relative ${
          isDark ? 'border-l border-violet-900/25 bg-[#0a0715]/70' : 'border-l border-slate-200 bg-white'
        }`}>

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className={`absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              isDark
                ? 'bg-slate-900/60 border border-violet-900/40 text-slate-500 hover:text-violet-500'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
            }`}
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Narrator button */}
          <div className="absolute top-5 left-5">
            <button onClick={handleVoiceToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
                isMuted
                  ? (isDark
                      ? 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50')
                  : (isDark
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20'
                      : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100')
              }`}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {!isMuted && isSpeaking && (
                <div className="flex items-end gap-px h-3">
                  {[0, 0.18, 0.09].map((delay, i) => (
                    <motion.div key={i} className={`w-0.5 rounded-full ${isDark ? 'bg-violet-400' : 'bg-blue-500'}`}
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
              {isDark ? (
                <motion.div
                  animate={{ boxShadow: ['0 0 20px rgba(192,38,211,0.2)', '0 0 40px rgba(192,38,211,0.45)', '0 0 20px rgba(192,38,211,0.2)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center mb-5 mx-auto"
                >
                  <MailCheck size={30} className="text-fuchsia-400" />
                </motion.div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-5 mx-auto">
                  <MailCheck size={30} className="text-blue-600" />
                </div>
              )}

              <h2 className={`text-2xl mb-2 ${isDark ? 'font-black text-white' : 'font-semibold text-slate-900'}`}>Check your inbox</h2>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                We sent a verification link to:
              </p>
              <p className={`font-semibold text-sm mb-6 break-all ${isDark ? 'text-violet-400' : 'text-blue-700'}`}>
                {unverifiedEmail}
              </p>
              <p className={`text-xs mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                  flex items-center justify-center gap-2 mb-3 ${
                    isDark
                      ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 shadow-[0_0_24px_rgba(192,38,211,0.35)] hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
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
                className={`text-xs hover:underline disabled:opacity-50 transition-colors mb-6 block w-full ${
                  isDark ? 'text-violet-400' : 'text-blue-600'
                }`}
              >
                Resend verification email
              </button>

              {/* Back to login */}
              <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={async () => { clearError(); await logout(); }}
                  className={`text-xs transition-colors ${
                    isDark ? 'text-slate-600 hover:text-slate-400' : 'text-slate-500 hover:text-slate-700'
                  }`}
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
              {isDark ? (
                <motion.div
                  animate={{ boxShadow: ['0 0 20px rgba(192,38,211,0.2)', '0 0 40px rgba(192,38,211,0.45)', '0 0 20px rgba(192,38,211,0.2)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center mb-5"
                >
                  <BookOpen size={28} className="text-fuchsia-400" />
                </motion.div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-5">
                  <BookOpen size={28} className="text-blue-600" />
                </div>
              )}
              <h2 className={`text-3xl mb-1 ${isDark ? 'font-black text-white' : 'font-semibold text-slate-900'}`}>
                {mode === 'login' ? 'Welcome back' : 'Get started'}
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                {mode === 'login' ? 'Continue your quest.' : 'Create your free account.'}
              </p>
            </div>

            {/* Mode toggle tabs */}
            <div className={`flex rounded-xl p-1 mb-6 border ${
              isDark ? 'bg-slate-800/60 border-violet-900/30' : 'bg-slate-100 border-slate-200'
            }`}>
              {(['login', 'signup'] as Mode[]).map((m) => {
                const active = mode === m;
                const tabHovered = !active && hoveredTab === m;
                return (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    onMouseEnter={() => !active && setHoveredTab(m)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors duration-150 ${
                      active
                        ? (isDark ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-sm' : 'bg-blue-600 text-white')
                        : ''
                    }`}
                    style={!active ? {
                      color: tabHovered
                        ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)')
                        : (isDark ? 'rgba(100,116,139,1)' : 'rgba(71,85,105,1)'),
                      boxShadow: tabHovered
                        ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.25)')
                        : 'none',
                    } : undefined}
                  >
                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                );
              })}
            </div>

            {/* Google button */}
            <motion.button onClick={handleGoogle} disabled={actionLoading}
              onMouseEnter={() => !actionLoading && setGoogleHovered(true)}
              onMouseLeave={() => setGoogleHovered(false)}
              whileHover={{ scale: actionLoading ? 1 : 1.01 }}
              whileTap={{ scale: actionLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-150 mb-5 disabled:opacity-50 border"
              style={{
                background: googleHovered
                  ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)')
                  : (isDark ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,1)'),
                borderColor: googleHovered
                  ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)')
                  : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
                color: googleHovered
                  ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)')
                  : (isDark ? 'rgba(226,232,240,1)' : 'rgba(51,65,85,1)'),
                boxShadow: googleHovered
                  ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.25)')
                  : '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              <GoogleIcon />
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>or with email</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
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
                      value={name} onChange={setName} autoFocus={mode === 'signup'} disabled={actionLoading} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <AuthInput icon={<Mail size={15} />} type="email" placeholder="Email address"
                  value={email} onChange={(v) => { setEmail(v); if (emailError) validateEmail(v); }}
                  onBlur={() => validateEmail(email)}
                  autoFocus={mode === 'login'} disabled={actionLoading} />
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
                  <p className={`mt-1.5 text-xs flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    <Mail size={11} className={`shrink-0 ${isDark ? 'text-violet-400' : 'text-blue-500'}`} />
                    Use a real, accessible email — we'll send a verification link.
                  </p>
                )}
              </div>

              <div className="relative">
                <AuthInput icon={<Lock size={15} />} type={showPw ? 'text' : 'password'}
                  placeholder="Password" value={password} onChange={setPassword} paddingRight disabled={actionLoading} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot password link — only in login mode */}
              {mode === 'login' && (
                <div className="flex justify-end -mt-1">
                  <button type="button" onClick={handleForgotPassword}
                    className={`text-xs hover:underline transition-colors ${isDark ? 'text-violet-400' : 'text-blue-600 hover:text-blue-700'}`}>
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
                className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                  flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 shadow-[0_0_24px_rgba(192,38,211,0.35)] hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {actionLoading
                  ? <><Loader2 size={16} className="animate-spin" /> Please wait…</>
                  : mode === 'login' ? 'Enter the Realm →' : 'Create Account →'
                }
              </motion.button>
            </form>

            {/* Guest bypass */}
            <div className={`mt-5 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <motion.button
                type="button"
                onClick={() => setShowGuestWarning(true)}
                onMouseEnter={() => setGuestHovered(true)}
                onMouseLeave={() => setGuestHovered(false)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-sm transition-colors duration-150 border-2 border-dashed flex items-center justify-center gap-2"
                style={{
                  background: guestHovered
                    ? (isDark ? 'rgba(217,70,239,0.08)' : 'rgba(239,246,255,1)')
                    : 'transparent',
                  borderColor: guestHovered
                    ? (isDark ? 'rgba(217,70,239,0.55)' : 'rgba(147,197,253,1)')
                    : (isDark ? 'rgba(51,65,85,1)' : 'rgba(203,213,225,1)'),
                  color: guestHovered
                    ? (isDark ? 'rgba(232,121,249,1)' : 'rgba(29,78,216,1)')
                    : (isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)'),
                  boxShadow: guestHovered
                    ? (isDark ? '0 0 18px rgba(192,38,211,0.4)' : '0 0 14px rgba(37,99,235,0.25)')
                    : 'none',
                }}
              >
                <span>👤</span> Continue as Guest
              </motion.button>
              <p className={`text-center text-xs mt-2 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
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
                    className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl ${
                      isDark ? 'bg-slate-900 border border-violet-900/40' : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className="text-3xl mb-3 text-center">⚠️</div>
                    <h3 className={`text-lg text-center mb-2 ${isDark ? 'font-black text-white' : 'font-semibold text-slate-900'}`}>
                      Guest mode limitations
                    </h3>
                    <p className={`text-sm text-center leading-relaxed mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Your progress is saved <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>on this device only</span>. If you clear your browser, switch devices, or use a different browser — <span className={`font-semibold ${isDark ? 'text-red-500' : 'text-rose-600'}`}>all progress will be lost permanently</span>.
                    </p>
                    <p className={`text-xs text-center mb-5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Create a free account to save your XP, badges, and progress to the cloud.
                    </p>
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowGuestWarning(false); switchMode('signup'); }}
                        className={`w-full py-3 rounded-xl font-bold text-sm text-white ${
                          isDark
                            ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 shadow-[0_0_24px_rgba(192,38,211,0.35)] hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        Create a free account →
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowGuestWarning(false); enterGuestMode(); navigate('/home', { replace: true }); }}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all border ${
                          isDark
                            ? 'border-slate-700 text-slate-400 hover:text-slate-300'
                            : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
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

      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  LEFT PANEL — feature tour (6 scenes, tabbed)
// ════════════════════════════════════════════════════════════

const MAP_NODES = [
  { id: 'manual',     x: 11, y: 26 },
  { id: 'sql',        x: 21, y: 65 },
  { id: 'api',        x: 46, y: 43 },
  { id: 'typescript', x: 69, y: 17 },
  { id: 'playwright', x: 74, y: 60 },
  { id: 'ai-qa',      x: 87, y: 73 },
] as const;

const MAP_PATHS: ReadonlyArray<readonly [string, string]> = [
  ['manual', 'sql'], ['manual', 'api'], ['sql', 'api'],
  ['api', 'typescript'], ['api', 'playwright'],
  ['typescript', 'playwright'], ['playwright', 'ai-qa'],
];

type ZoneTheme = { color: string; soft: string; glow: string; name: string };
const ZONE_THEMES: Record<string, ZoneTheme> = {
  manual:     { color: '#f97316', soft: 'rgba(249,115,22,0.12)', glow: 'rgba(249,115,22,0.30)', name: 'Manual Testing' },
  sql:        { color: '#3b82f6', soft: 'rgba(59,130,246,0.12)', glow: 'rgba(59,130,246,0.30)', name: 'SQL Sorcery' },
  api:        { color: '#a855f7', soft: 'rgba(168,85,247,0.12)', glow: 'rgba(168,85,247,0.30)', name: 'API Testing' },
  typescript: { color: '#0ea5e9', soft: 'rgba(14,165,233,0.12)', glow: 'rgba(14,165,233,0.30)', name: 'TypeScript' },
  playwright: { color: '#10b981', soft: 'rgba(16,185,129,0.12)', glow: 'rgba(16,185,129,0.30)', name: 'Playwright' },
  'ai-qa':    { color: '#f43f5e', soft: 'rgba(244,63,94,0.12)',  glow: 'rgba(244,63,94,0.30)',  name: 'AI for QA' },
};

function ZoneIcon({ id, size = 18 }: { id: string; size?: number }) {
  switch (id) {
    case 'manual':     return <ShieldAlert size={size} />;
    case 'sql':        return <Database size={size} />;
    case 'api':        return <Cpu size={size} />;
    case 'typescript': return <Code size={size} />;
    case 'playwright': return <Play size={size} />;
    case 'ai-qa':      return <ShieldCheck size={size} />;
    default:           return null;
  }
}

type TabId = 'hub' | 'learn' | 'war' | 'trial' | 'badges' | 'cert';
type TourTab = { id: TabId; num: string; name: string; pitch: string; color: string; soft: string; url: string };
const TABS: ReadonlyArray<TourTab> = [
  { id: 'hub',    num: '01', name: 'Realm Map',     pitch: 'Navigate 6 zones. Each one a skill. All yours to conquer.',          color: '#3b82f6', soft: 'rgba(59,130,246,0.10)',  url: 'qaquest.vercel.app/' },
  { id: 'learn',  num: '02', name: 'Lessons',       pitch: 'Bite-sized modules with real examples. Learn by doing.',             color: '#10b981', soft: 'rgba(16,185,129,0.10)',  url: 'qaquest.vercel.app/zone/sql' },
  { id: 'war',    num: '03', name: 'War Room',      pitch: 'Deep answers. Real scenarios. All QA.',                             color: '#f43f5e', soft: 'rgba(244,63,94,0.10)',   url: 'qaquest.vercel.app/zone/sql/interview' },
  { id: 'trial',  num: '04', name: 'Mastery Trial', pitch: 'Think you know it? Prove it. Pass the trial, earn the cert.',        color: '#f97316', soft: 'rgba(249,115,22,0.10)',  url: 'qaquest.vercel.app/zone/api/mastery' },
  { id: 'badges', num: '05', name: 'Badges',        pitch: 'Every skill you unlock. Every milestone you hit. All in one place.', color: '#a855f7', soft: 'rgba(168,85,247,0.10)',  url: 'qaquest.vercel.app/badges' },
  { id: 'cert',   num: '06', name: 'Certificate',   pitch: 'A real proof of mastery. Download it. Put it on LinkedIn.',          color: '#0ea5e9', soft: 'rgba(14,165,233,0.10)',  url: 'qaquest.vercel.app/badges' },
];

const SCENE_MS = 5500;
const HUB_VIEW_MS = 2700;

function LeftPanelTour({ isDark }: { isDark: boolean }) {
  const [sceneIdx, setSceneIdx]     = useState(0);
  const [hubViewIdx, setHubViewIdx] = useState(0);
  const pausedRef = useRef(false);

  // Scene auto-rotate — single interval, ref controls pause without recreating
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setSceneIdx(i => (i + 1) % TABS.length);
    }, SCENE_MS);
    return () => clearInterval(id);
  }, []);

  // Hub view auto-cycle (only on hub scene)
  useEffect(() => {
    if (TABS[sceneIdx].id !== 'hub') return;
    const id = setInterval(() => setHubViewIdx(v => (v + 1) % 2), HUB_VIEW_MS);
    return () => clearInterval(id);
  }, [sceneIdx]);

  const activeTab = TABS[sceneIdx];

  return (
    <div className="relative hidden md:flex w-[58%] flex-col justify-center gap-7 px-12 py-10 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.055) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: isDark ? [0.28, 0.5, 0.28] : [0.06, 0.13, 0.06], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[110px] ${isDark ? 'bg-fuchsia-500/30' : 'bg-blue-500/30'}`}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: isDark ? [0.2, 0.38, 0.2] : [0.04, 0.10, 0.04], x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className={`absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full blur-[110px] ${isDark ? 'bg-violet-500/30' : 'bg-indigo-500/30'}`}
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: isDark ? [0.12, 0.25, 0.12] : [0.03, 0.07, 0.03], x: [0, 15, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className={`absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full blur-[120px] ${isDark ? 'bg-cyan-500/20' : 'bg-sky-400/20'}`}
        />
      </div>

      {/* Brand */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
        {isDark ? (
          <h1 className="text-6xl font-black bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-none mb-4">QAVeda</h1>
        ) : (
          <h1 className="text-6xl font-bold text-slate-900 tracking-tight leading-none mb-4">QAVeda</h1>
        )}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-xl">
          <Typewriter text="Master QA Engineering — gamified, from first test to interview day." />
        </p>
        <div className="flex items-center gap-9">
          {[
            { target: 6,   suffix: '',  l: 'ZONES' },
            { target: 200, suffix: '+', l: 'MODULES' },
            { target: 900, suffix: '+', l: 'INTERVIEW Q&A' },
          ].map(s => (
            <div key={s.l}>
              <p className={`text-2xl ${isDark ? 'font-black bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent' : 'font-bold text-blue-600'}`}>
                <CountUp target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-slate-500 text-[10px] mt-1.5 tracking-[0.10em] font-semibold">{s.l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tour */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative z-10 mt-4">
        {/* Minimal header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDark ? 'bg-fuchsia-400' : 'bg-blue-500'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-fuchsia-400' : 'bg-blue-500'}`} />
          </span>
          <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
            <motion.p
              key={activeTab.name}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="text-[16px] font-black uppercase tracking-[0.1em] shrink-0"
              style={{ color: activeTab.color }}
            >
              {activeTab.name}
            </motion.p>
            <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>·</span>
            <motion.p
              key={activeTab.pitch}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={`text-[14px] font-semibold ${isDark ? 'text-white/80' : 'text-slate-800'}`}
            >
              {activeTab.pitch}
            </motion.p>
          </div>
          <p className="shrink-0 text-[10px] font-bold text-slate-500 font-mono">{activeTab.num} / 06</p>
        </div>

        {/* Window */}
        <div onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }} className={`rounded-2xl overflow-hidden backdrop-blur-sm ${
          isDark
            ? 'bg-slate-900/70 border border-violet-900/40 shadow-[0_24px_48px_rgba(0,0,0,0.4)]'
            : 'bg-white border border-slate-200 shadow-lg'
        }`}>
          <div className="w-full h-[2px]" style={{ background: `linear-gradient(90deg, ${activeTab.color}, transparent)` }} />

          {/* Scene */}
          <div className="relative h-[300px] overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab.id === 'hub'    && <HubScene    key="hub"    isDark={isDark} hubViewIdx={hubViewIdx} onPickView={setHubViewIdx} />}
              {activeTab.id === 'learn'  && <LearnScene  key="learn"  isDark={isDark} />}
              {activeTab.id === 'war'    && <WarRoomScene key="war"   isDark={isDark} />}
              {activeTab.id === 'trial'  && <TrialScene  key="trial"  isDark={isDark} />}
              {activeTab.id === 'badges' && <BadgesScene key="badges" isDark={isDark} />}
              {activeTab.id === 'cert'   && <CertScene   key="cert"   isDark={isDark} />}
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className={`flex items-center justify-center gap-2 py-3 border-t ${isDark ? 'border-violet-900/30' : 'border-slate-100'}`}>
            {TABS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSceneIdx(idx)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: idx === sceneIdx ? 20 : 6,
                  height: 6,
                  background: idx === sceneIdx ? t.color : (isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.4)'),
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Scene({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.4 }}
      className={`absolute inset-0 p-4 ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Scene 1: Realm Map + Skill Tree ─────────────────────────
function HubScene({ isDark, hubViewIdx, onPickView }: { isDark: boolean; hubViewIdx: number; onPickView: (v: number) => void }) {
  const stars = useMemo(() => Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: 2 + (i * 41 + i * i * 17) % 96,
    y: 2 + (i * 59 + i * i * 11) % 96,
    r: 1 + (i % 3),
    delay: (i * 0.27) % 5,
    dur: 2.5 + (i % 5),
    op: 0.15 + (i % 6) * 0.10,
  })), []);

  return (
    <Scene>
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {/* Toggle pill */}
        <div className={`absolute top-2.5 left-3 z-10 flex gap-0.5 rounded-lg p-0.5 backdrop-blur ${
          isDark ? 'bg-slate-900/80 border border-slate-700/50' : 'bg-white/95 border border-slate-300 shadow-sm'
        }`}>
          {[
            { key: 0, label: 'Map',        Icon: MapIcon },
            { key: 1, label: 'Skill Tree', Icon: LayoutGrid },
          ].map(({ key, label, Icon }) => {
            const active = hubViewIdx === key;
            return (
              <button key={key} onClick={() => onPickView(key)}
                className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.06em] px-2 py-1 rounded-md transition-all ${
                  active
                    ? (isDark ? 'bg-fuchsia-500 text-white' : 'bg-blue-600 text-white')
                    : 'text-slate-500'
                }`}
              >
                <Icon size={10} /> {label}
              </button>
            );
          })}
        </div>

        {/* MAP view */}
        <AnimatePresence>
          {hubViewIdx === 0 && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, #0b1024 0%, #0a0420 100%)' }}
            >
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
              {stars.map(s => (
                <motion.div key={s.id} className="absolute rounded-full bg-white pointer-events-none"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r }}
                  animate={{ opacity: [0, s.op, 0] }}
                  transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
                />
              ))}
              <p className="absolute top-3 right-4 text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-600">🗺️ The QA Realm</p>
              <p className="absolute bottom-2.5 right-4 font-mono text-[9px] text-slate-600/60">N ↑</p>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <filter id="mglow-tour" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="0.6" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {MAP_PATHS.map(([fId, tId]) => {
                  const f = MAP_NODES.find(n => n.id === fId)!;
                  const t = MAP_NODES.find(n => n.id === tId)!;
                  const mx = (f.x + t.x) / 2, my = (f.y + t.y) / 2;
                  const dx = t.x - f.x, dy = t.y - f.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const cx = mx + (-dy / len) * 5, cy = my + (dx / len) * 5;
                  const d = `M ${f.x} ${f.y} Q ${cx} ${cy} ${t.x} ${t.y}`;
                  const fromMastered = fId === 'manual';
                  const fromActive   = fId === 'sql';
                  return (
                    <g key={`${fId}-${tId}`}>
                      <path d={d} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="0.4" strokeDasharray="1.2 2"/>
                      {fromMastered && <path d={d} fill="none" stroke="rgba(249,115,22,0.70)" strokeWidth="0.55" filter="url(#mglow-tour)"/>}
                      {fromActive   && <path d={d} fill="none" stroke="rgba(59,130,246,0.45)" strokeWidth="0.4" strokeDasharray="0.8 1.6" filter="url(#mglow-tour)"/>}
                    </g>
                  );
                })}
              </svg>
              {MAP_NODES.map(n => {
                const t = ZONE_THEMES[n.id];
                const isActive = n.id === 'manual' || n.id === 'sql';
                const isMastered = n.id === 'manual';
                const sub = isMastered ? '⭐ Mastered' : n.id === 'sql' ? '62%' : 'Click to explore';
                return (
                  <div key={n.id} className="absolute z-10 flex flex-col items-center"
                    style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%, -50%)' }}>
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                      style={{
                        borderColor: isActive ? t.color : 'rgba(148,163,184,0.35)',
                        background: isActive ? t.soft : 'rgba(2,6,23,0.85)',
                        color: isActive ? t.color : 'rgba(148,163,184,0.70)',
                        boxShadow: isActive ? `0 0 24px ${t.glow}` : 'none',
                        opacity: isActive ? 1 : 0.55,
                      }}
                      animate={isActive ? { boxShadow: [`0 0 18px ${t.glow}`, `0 0 32px ${t.glow}`, `0 0 18px ${t.glow}`] } : undefined}
                      transition={isActive ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
                    >
                      <ZoneIcon id={n.id} size={20} />
                    </motion.div>
                    <p className="mt-1 text-[9.5px] font-extrabold leading-tight whitespace-nowrap"
                       style={{ color: isActive ? t.color : 'rgba(148,163,184,0.55)' }}>
                      {t.name}
                    </p>
                    <p className="text-[8px] font-semibold leading-tight"
                       style={{ color: isMastered ? '#fbbf24' : '#64748b' }}>
                      {sub}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SKILL TREE view */}
        <AnimatePresence>
          {hubViewIdx === 1 && (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className={`absolute inset-0 grid grid-cols-3 gap-2 px-3 pt-11 pb-3 ${isDark ? 'bg-slate-950/60' : 'bg-white'}`}
            >
              {(['manual','sql','api','typescript','playwright','ai-qa'] as const).map(id => {
                const t = ZONE_THEMES[id];
                const isStart = id === 'sql';
                const counts: Record<string, string> = { manual:'40+', sql:'25+', api:'30+', typescript:'30+', playwright:'25+', 'ai-qa':'35+' };
                return (
                  <div key={id} className={`relative rounded-xl border px-3 py-2.5 flex flex-col gap-1.5 overflow-hidden ${
                    isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white border-slate-200'
                  }`}
                    style={{
                      borderTopWidth: 2,
                      borderTopColor: t.color,
                      ...(isStart ? { boxShadow: `0 6px 18px ${t.glow}`, transform: 'translateY(-2px)' } : {}),
                    }}
                  >
                    {isStart && (
                      <span className="absolute top-1.5 right-1.5 text-[7.5px] font-extrabold tracking-[0.10em] text-white px-1.5 py-0.5 rounded animate-pulse"
                        style={{ background: t.color, boxShadow: `0 2px 6px ${t.glow}` }}>START</span>
                    )}
                    <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center"
                      style={{ background: t.soft, color: t.color }}>
                      <ZoneIcon id={id} size={16} />
                    </div>
                    <p className={`text-[11.5px] font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</p>
                    <p className="text-[9.5px] text-slate-500 font-medium">3 tiers · {counts[id]} modules</p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Scene>
  );
}

// ─── Scene 2: Lessons ───────────────────────────────────────
function LearnScene({ isDark }: { isDark: boolean }) {
  return (
    <Scene>
      <div className="grid grid-cols-[130px_1fr] gap-3 h-full">
        <div className={`rounded-xl p-2 border overflow-hidden ${isDark ? 'bg-slate-950/40 border-slate-700/40' : 'bg-white border-slate-200'}`}>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.10em] text-emerald-500 pb-1 mb-1 border-b border-slate-200/30">BEGINNER</p>
          <LzMod state="done"  text="SELECT basics" />
          <LzMod state="done"  text="WHERE clauses" />
          <p className="text-[9px] font-extrabold uppercase tracking-[0.10em] text-sky-500 pb-1 mb-1 mt-2 border-b border-slate-200/30">INTERMEDIATE</p>
          <LzMod state="active" text="JOINs" />
          <LzMod state="todo"  text="GROUP BY" />
          <p className="text-[9px] font-extrabold uppercase tracking-[0.10em] text-amber-500 pb-1 mb-1 mt-2 border-b border-slate-200/30">EXPERT</p>
          <LzMod state="todo"  text="Window funcs" />
          <LzMod state="todo"  text="CTEs" />
        </div>
        <div className="flex flex-col gap-2.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-[14px] font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>SQL Joins — INNER vs LEFT</h3>
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-600">Intermediate</span>
          </div>
          <div className="h-1 rounded-full bg-slate-300/20 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '45%', background: 'linear-gradient(90deg, #2563eb, #4f46e5)' }} />
          </div>
          <div className={`rounded-xl border p-3 text-[11px] leading-relaxed flex flex-col gap-2 ${
            isDark ? 'bg-slate-950/40 border-slate-700/40 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <p>An <b className={isDark ? 'text-white' : 'text-slate-900'}>INNER JOIN</b> returns only rows where both tables match — a strict handshake. A <b className={isDark ? 'text-white' : 'text-slate-900'}>LEFT JOIN</b> keeps every row from the left table, filling unmatched right-side columns with NULL.</p>
            <pre className={`font-mono text-[10.5px] rounded p-2 border-l-2 whitespace-pre overflow-x-auto ${isDark ? 'bg-slate-800/60 text-slate-300 border-fuchsia-500' : 'bg-slate-100 text-slate-700 border-blue-500'}`}>{`SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;`}</pre>
          </div>
          <span className={`inline-flex items-center gap-1.5 self-start text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}><Zap size={11} /> +100 XP on completion</span>
        </div>
      </div>
    </Scene>
  );
}

function LzMod({ state, text }: { state: 'done' | 'active' | 'todo'; text: string }) {
  const isDark = useQuestStore(s => s.theme) === 'dark';
  if (state === 'done') return (
    <div className="flex items-center gap-1.5 px-2 py-1 text-[10.5px] text-slate-500">
      <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
        <Check size={8} strokeWidth={4} />
      </span>
      {text}
    </div>
  );
  if (state === 'active') return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10.5px] font-bold border ${
      isDark ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300' : 'bg-blue-50 border-blue-200 text-blue-700'
    }`}>
      <span className={`w-3 h-3 rounded-full shrink-0 ${isDark ? 'bg-fuchsia-400' : 'bg-blue-500'}`} />
      {text}
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 text-[10.5px] text-slate-500">
      <span className="w-3 h-3 rounded-full bg-slate-400/30 shrink-0" />
      {text}
    </div>
  );
}

// ─── Scene 3: War Room ──────────────────────────────────────
function WarRoomScene({ isDark }: { isDark: boolean }) {
  return (
    <Scene>
      <div className="flex flex-col gap-2 h-full">
        <div className={`flex gap-1 p-0.5 rounded-lg ${isDark ? 'bg-slate-800/40' : 'bg-slate-100'}`}>
          <div className="flex-1 text-center py-1 rounded text-[10px] font-bold text-slate-500">
            Junior <span className="block text-[8.5px] font-medium opacity-70">0–2 yrs</span>
          </div>
          <div className="flex-1 text-center py-1 rounded text-[10px] font-bold text-white"
            style={{ background: '#3b82f6', boxShadow: '0 2px 8px rgba(59,130,246,0.35)' }}>
            Mid <span className="block text-[8.5px] font-medium opacity-90">2–5 yrs</span>
          </div>
          <div className="flex-1 text-center py-1 rounded text-[10px] font-bold text-slate-500">
            Senior <span className="block text-[8.5px] font-medium opacity-70">5+ yrs</span>
          </div>
        </div>
        <div className={`rounded-xl border p-3 flex flex-col gap-2 flex-1 overflow-hidden ${isDark ? 'bg-slate-950/40 border-slate-700/40' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>SQL · Mid · Card 14 of 26</span>
            <span>💡 with analogy</span>
          </div>
          <p className={`text-[13px] font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>Find the second-highest salary in the Employee table.</p>
          <div className={`text-[11px] leading-relaxed border-l-2 pl-2.5 ${isDark ? 'text-slate-300 border-fuchsia-500' : 'text-slate-700 border-blue-500'}`}>
            <b className={isDark ? 'text-white' : 'text-slate-900'}>Approach 1 — easiest:</b><br/>
            <code className={`font-mono text-[10px] rounded px-1 ${isDark ? 'bg-slate-800/80 text-violet-300' : 'bg-slate-100 text-blue-700'}`}>{`SELECT MAX(salary) FROM employee WHERE salary < (SELECT MAX(salary) FROM employee);`}</code><br/>
            <b className={isDark ? 'text-white' : 'text-slate-900'}>Approach 2:</b> <code className={`font-mono text-[10px] rounded px-1 ${isDark ? 'bg-slate-800/80 text-violet-300' : 'bg-slate-100 text-blue-700'}`}>DENSE_RANK()</code> ordered by salary DESC, filter rank = 2.
          </div>
          <div className={`mt-auto rounded-lg border p-2.5 text-[11px] font-medium leading-snug flex items-start gap-2 ${
            isDark ? 'bg-amber-500/10 border-amber-500/25 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <Lightbulb size={13} className={isDark ? 'text-amber-300 mt-0.5 shrink-0' : 'text-amber-600 mt-0.5 shrink-0'} />
            <span><b className="font-extrabold">Explain it like this:</b> it's a podium — gold's already on top, so just ask "who's standing on silver?"</span>
          </div>
        </div>
      </div>
    </Scene>
  );
}

// ─── Scene 4: Mastery Trial ─────────────────────────────────
function TrialScene({ isDark }: { isDark: boolean }) {
  return (
    <Scene>
      <div className="flex flex-col gap-2.5 h-full">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-full border bg-rose-500/10 border-rose-500/30 text-rose-500">
            <Target size={11} /> Mastery Trial · API · Question 9 of 30
          </span>
          <div className={`w-[54px] h-[54px] rounded-full relative flex flex-col items-center justify-center border ${
            isDark ? 'bg-slate-950/40 border-slate-700/40' : 'bg-white border-slate-200'
          }`}>
            <svg className="absolute inset-0" width="54" height="54" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="27" cy="27" r="22" stroke="rgba(148,163,184,0.20)" strokeWidth="4" fill="none"/>
              <circle cx="27" cy="27" r="22" stroke={isDark ? '#d946ef' : '#2563eb'} strokeWidth="4" fill="none"
                      strokeDasharray="138" strokeDashoffset="48" strokeLinecap="round"/>
            </svg>
            <span className={`text-[11px] font-extrabold tabular-nums ${isDark ? 'text-fuchsia-400' : 'text-blue-600'}`}>21:34</span>
            <span className="text-[7px] font-bold uppercase tracking-[0.10em] text-slate-500 mt-0.5">left</span>
          </div>
        </div>
        <p className={`text-[13px] font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Which HTTP method is <b>idempotent</b> — i.e., multiple identical requests have the same effect as a single one?
        </p>
        <div className="flex flex-col gap-1.5">
          <TrialOpt letter="A" text="POST" />
          <TrialOpt letter="B" text="PUT" correct />
          <TrialOpt letter="C" text="PATCH" />
        </div>
        <div className="mt-auto flex items-center justify-between text-[10.5px] font-semibold text-slate-500">
          <span>30 Qs · pass at 80%</span>
          <span className="text-emerald-500 font-extrabold inline-flex items-center gap-1"><Check size={11} /> On track · 89% correct</span>
        </div>
        <div className="h-1 rounded-full bg-slate-300/20 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: '30%', background: 'linear-gradient(90deg, #e11d48, #f97316)' }} />
        </div>
      </div>
    </Scene>
  );
}

function TrialOpt({ letter, text, correct }: { letter: string; text: string; correct?: boolean }) {
  const isDark = useQuestStore(s => s.theme) === 'dark';
  if (correct) return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11.5px] font-bold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
      <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{letter}</span>
      {text}
      <Check size={13} className="ml-auto" />
    </div>
  );
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11.5px] border ${
      isDark ? 'bg-slate-950/40 border-slate-700/40 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
    }`}>
      <span className="w-5 h-5 rounded bg-slate-400/20 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">{letter}</span>
      {text}
    </div>
  );
}

// ─── Scene 5: Badges ────────────────────────────────────────
const HERO_BADGES = [
  { id: 'manual',     label: 'Manual Testing',  kind: 'Mastery Badge' },
  { id: 'sql',        label: 'SQL Sorcery',      kind: 'Completion Badge' },
  { id: 'playwright', label: 'Playwright',       kind: 'Mastery Badge' },
];

function BadgesScene({ isDark }: { isDark: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % HERO_BADGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const badge = HERO_BADGES[idx];
  const t = ZONE_THEMES[badge.id];

  return (
    <Scene>
      <div className="h-full flex items-center gap-6 px-2">

        {/* Left — hero badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3 shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-60" style={{ background: t.glow }} />
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center border-4"
                style={{ background: t.soft, borderColor: t.color, boxShadow: `0 0 28px ${t.glow}` }}>
                <div style={{ color: t.color }}><ZoneIcon id={badge.id} size={34} /></div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white whitespace-nowrap"
                style={{ background: `linear-gradient(135deg, ${t.color}, ${t.glow})` }}>
                EARNED
              </div>
            </div>
            <div className="text-center mt-1">
              <p className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{badge.label}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: t.color }}>{badge.kind}</p>
            </div>
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {HERO_BADGES.map((b, i) => (
                <button key={b.id} onClick={() => setIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === idx ? 14 : 5, height: 5, background: i === idx ? ZONE_THEMES[b.id].color : (isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.4)') }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div className={`w-px self-stretch my-4 shrink-0 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

        {/* Right — how to earn */}
        <div className="flex flex-col gap-3 flex-1">
          <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>How to earn</p>

          <div className={`flex items-start gap-2.5 rounded-xl p-3 border ${isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/15 border border-emerald-500/30">
              <Zap size={13} className="text-emerald-400" />
            </div>
            <div>
              <p className={`text-[11px] font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Complete all levels</p>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Finish every module in a zone → Completion Badge</p>
            </div>
          </div>

          <div className={`flex items-start gap-2.5 rounded-xl p-3 border ${isDark ? 'bg-slate-800/50 border-slate-700/40' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/15 border border-amber-500/30">
              <Target size={13} className="text-amber-400" />
            </div>
            <div>
              <p className={`text-[11px] font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pass the Mastery Trial</p>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Score 80%+ in the zone exam → Mastery Badge</p>
            </div>
          </div>
        </div>

      </div>
    </Scene>
  );
}

// ─── Scene 6: Certificate ───────────────────────────────────
function CertScene({ isDark }: { isDark: boolean }) {
  const c1 = '#3b82f6', c2 = '#60a5fa', cDark = '#1d4ed8';
  const accentBar = `linear-gradient(90deg, ${cDark}, ${c1}, ${c2}, ${c1}, ${cDark})`;
  return (
    <Scene>
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="relative shadow-[0_16px_36px_rgba(15,23,42,0.20)] rounded"
          style={{ width: 320, aspectRatio: '1.414 / 1', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)', fontFamily: 'Georgia, "Times New Roman", serif' }}>
          <div className="absolute left-0 right-0 top-0 h-1" style={{ background: accentBar }} />
          <div className="absolute left-0 right-0 bottom-0 h-1" style={{ background: accentBar }} />
          <div className="absolute inset-2.5 border border-slate-200" />
          <div className="absolute inset-3.5 border" style={{ borderColor: 'rgba(59,130,246,0.13)' }} />
          <span className="absolute w-4 h-4 top-2.5 left-2.5" style={{ borderTop: `2px solid ${c1}`, borderLeft: `2px solid ${c1}` }} />
          <span className="absolute w-4 h-4 top-2.5 right-2.5" style={{ borderTop: `2px solid ${c1}`, borderRight: `2px solid ${c1}` }} />
          <span className="absolute w-4 h-4 bottom-2.5 left-2.5" style={{ borderBottom: `2px solid ${c1}`, borderLeft: `2px solid ${c1}` }} />
          <span className="absolute w-4 h-4 bottom-2.5 right-2.5" style={{ borderBottom: `2px solid ${c1}`, borderRight: `2px solid ${c1}` }} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ fontSize: 200, lineHeight: 1, color: c1, opacity: 0.035, fontFamily: 'Arial, sans-serif' }}>✦</div>
          <div className="relative z-10 h-full flex flex-col items-center justify-between px-9 py-5">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-9 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c1})` }} />
                <span className="text-[9px]" style={{ color: c1 }}>✦</span>
                <div className="w-9 h-px" style={{ background: `linear-gradient(90deg, ${c1}, transparent)` }} />
              </div>
              <div className="text-[22px] font-bold uppercase tracking-[0.20em] text-slate-900 leading-none" style={{ paddingLeft: '0.20em' }}>QAVeda</div>
              <div className="text-[8px] uppercase tracking-[0.18em] font-bold mt-1" style={{ color: cDark }}>Certificate of Mastery</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-[13px] font-bold text-slate-800">Awarded to You</div>
              <div className="text-[9px] text-slate-500 italic max-w-[240px] text-center mt-1 leading-snug">For passing the SQL Sorcery Mastery Trial</div>
            </div>
            <div className="flex items-end justify-between w-full">
              <div className="text-[8px] text-slate-400">Issued · 30 May 2026</div>
              <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white shadow-[0_2px_8px_rgba(59,130,246,0.35)]"
                style={{ background: `linear-gradient(135deg, ${cDark}, ${c1})` }}>
                <ShieldCheck size={13} />
              </div>
              <div className="text-[8px] text-slate-400">qaveda · authenticated</div>
            </div>
          </div>
        </div>
        <button className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold text-white animate-pulse ${
          isDark ? 'bg-fuchsia-500 shadow-[0_6px_18px_rgba(217,70,239,0.35)]' : 'bg-blue-600 shadow-[0_6px_18px_rgba(37,99,235,0.35)]'
        }`}>
          <Download size={12} /> Download PDF
        </button>
      </div>
    </Scene>
  );
}

// ─── Reusable styled input ────────────────────────────────────
function AuthInput({ icon, type, placeholder, value, onChange, onBlur, autoFocus, paddingRight, disabled }: {
  icon: React.ReactNode; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; onBlur?: () => void;
  autoFocus?: boolean; paddingRight?: boolean; disabled?: boolean;
}) {
  const theme = useQuestStore((s) => s.theme);
  const isDark = theme === 'dark';
  return (
    <div className="relative">
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{icon}</span>
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} onBlur={onBlur} autoFocus={autoFocus} required
        disabled={disabled}
        className={`w-full rounded-xl
          pl-9 ${paddingRight ? 'pr-10' : 'pr-4'} py-3 text-sm transition-all
          disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20'
              : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }`}
      />
    </div>
  );
}

function Typewriter({ text, speed = 28 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <>{displayed}<span className="animate-pulse">|</span></>;
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return <>{count}{suffix}</>;
}
