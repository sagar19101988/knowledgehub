import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ChevronRight, Map, Trophy, BookOpen, Award, Target, Star, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuestStore } from '../store/useQuestStore';

type StepBase = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

type Step =
  | (StepBase & { kind: 'welcome' })
  | (StepBase & {
      kind: 'spotlight';
      target: string;
      route: string;
      // Some home-page targets differ between the Realm Map and Skill Tree
      // (grid) views. When the user is in grid view we spotlight altTarget
      // and, if provided, show altDescription instead.
      altTarget?: string;
      altDescription?: string;
    });

// Manual Testing is always available (no prerequisites), so we use it as
// the demo zone the tour visits to show Mastery Trial + War Room buttons.
const DEMO_ZONE = '/zone/manual';

const STEPS: Step[] = [
  {
    kind: 'welcome',
    icon: Star,
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-500 dark:text-fuchsia-400',
    title: 'Welcome to QAVeda',
    description:
      "Your gamified learning platform for QA engineers. This quick tour will walk you through the app — it takes about 30 seconds.",
  },
  {
    kind: 'spotlight',
    target: 'zone-map',
    altTarget: 'zone-grid',
    route: '/home',
    icon: Map,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
    title: 'The QA Realm',
    description:
      'These are your 6 learning zones — Manual Testing, SQL, API, TypeScript, Playwright, and AI for QA. Click any zone to enter.',
  },
  {
    kind: 'spotlight',
    target: 'zone-node',
    altTarget: 'zone-card',
    route: '/home',
    icon: BookOpen,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-500',
    title: 'Inside a Zone',
    description:
      'Each zone has Beginner → Intermediate → Expert modules. The ring around the node tracks your progress. Read in the Library, then battle in the Boss Fight to earn XP.',
    altDescription:
      'Each zone has Beginner → Intermediate → Expert modules. The progress bar tracks how far you have got. Read in the Library, then battle in the Boss Fight to earn XP.',
  },
  {
    kind: 'spotlight',
    target: 'rank-card',
    route: '/home',
    icon: Trophy,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-500',
    title: 'XP & Rank',
    description:
      'Every Boss Fight victory earns XP. Your rank climbs automatically from Novice all the way to Sage. Click this card any time to see the full Rank Ladder.',
  },
  {
    kind: 'spotlight',
    target: 'daily-bounty',
    route: '/home',
    icon: Target,
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-500',
    title: 'Daily Bounty',
    description:
      'Claim a free +50 XP every day — just for showing up. The pulse dot tells you when it is ready to claim again.',
  },
  // Cross-page step — tour navigates into a zone to spotlight the real button
  {
    kind: 'spotlight',
    target: 'mastery-trial-btn',
    route: DEMO_ZONE,
    icon: Award,
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-500',
    title: 'Mastery Trial',
    description:
      'Inside every zone: complete all modules to unlock the Mastery Trial — a 30-question timed exam. Pass at 80% to earn a downloadable Certificate of Mastery.',
  },
  // Same page — spotlight switches to the War Room button
  {
    kind: 'spotlight',
    target: 'war-room-btn',
    route: DEMO_ZONE,
    icon: Shield,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
    title: 'The War Room',
    description:
      'Every zone also has a War Room with 150 real interview questions — split into Junior, Mid, and Senior levels. Ideal for interview prep at any stage.',
  },
  // Back to home for the final step
  {
    kind: 'spotlight',
    target: 'badges-link',
    route: '/home',
    icon: Star,
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-500 dark:text-fuchsia-400',
    title: 'Badges & Certificates',
    description:
      'All your earned badges and downloadable Mastery Certificates live on the Badges page. 12 badges to collect — 6 Completion and 6 Mastery. Good luck!',
  },
];

const SPOTLIGHT_PADDING = 10;
const SPOTLIGHT_RADIUS  = 14;
const TOOLTIP_GAP       = 18;
const TOOLTIP_W         = 360;
const TOOLTIP_H         = 290;

type Rect = { x: number; y: number; width: number; height: number };

/**
 * Tracks the position of a target element by `data-tour` attribute.
 * Waits via MutationObserver if the element hasn't mounted yet — important
 * for cross-route steps where the target lives on a different page.
 */
function useTargetRect(selector: string | null): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (!selector) { setRect(null); return; }

    let cancelled = false;
    let mo: MutationObserver | null = null;
    let ro: ResizeObserver | null = null;
    let resizeListener: (() => void) | null = null;
    let scrollListener: (() => void) | null = null;

    const attach = (el: HTMLElement) => {
      const measure = () => {
        if (cancelled) return;
        const r = el.getBoundingClientRect();
        setRect({ x: r.left, y: r.top, width: r.width, height: r.height });
      };
      measure();
      requestAnimationFrame(measure);

      resizeListener = measure;
      scrollListener = measure;
      window.addEventListener('resize', resizeListener);
      window.addEventListener('scroll', scrollListener, true);

      if ('ResizeObserver' in window) {
        ro = new ResizeObserver(measure);
        ro.observe(el);
        ro.observe(document.body);
      }
    };

    const initial = document.querySelector<HTMLElement>(`[data-tour="${selector}"]`);
    if (initial) {
      attach(initial);
    } else {
      // Element not mounted yet (route transition in progress) — watch for it.
      setRect(null);
      mo = new MutationObserver(() => {
        if (cancelled) return;
        const el = document.querySelector<HTMLElement>(`[data-tour="${selector}"]`);
        if (el) {
          mo?.disconnect();
          mo = null;
          attach(el);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      mo?.disconnect();
      ro?.disconnect();
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (scrollListener) window.removeEventListener('scroll', scrollListener, true);
    };
  }, [selector]);

  return rect;
}

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center';

function computeTooltipPosition(
  rect: Rect | null,
  vw: number,
  vh: number,
  isMobile: boolean,
  tw: number,
  th: number,
): { x: number; y: number; placement: Placement } {
  if (isMobile || !rect) {
    return {
      x: Math.max(16, (vw - tw) / 2),
      y: rect ? vh - th - 16 : (vh - th) / 2,
      placement: 'center',
    };
  }

  const spaceBelow = vh - (rect.y + rect.height);
  const spaceAbove = rect.y;
  const spaceRight = vw - (rect.x + rect.width);
  const spaceLeft  = rect.x;
  const isTallNarrow = rect.height > rect.width;

  if (isTallNarrow && spaceRight >= tw + TOOLTIP_GAP + 16) {
    return { x: rect.x + rect.width + TOOLTIP_GAP, y: clamp(rect.y + rect.height / 2 - th / 2, 16, vh - th - 16), placement: 'right' };
  }
  if (isTallNarrow && spaceLeft >= tw + TOOLTIP_GAP + 16) {
    return { x: rect.x - tw - TOOLTIP_GAP, y: clamp(rect.y + rect.height / 2 - th / 2, 16, vh - th - 16), placement: 'left' };
  }
  if (spaceBelow >= th + TOOLTIP_GAP + 16) {
    return { x: clamp(rect.x + rect.width / 2 - tw / 2, 16, vw - tw - 16), y: rect.y + rect.height + TOOLTIP_GAP, placement: 'bottom' };
  }
  if (spaceAbove >= th + TOOLTIP_GAP + 16) {
    return { x: clamp(rect.x + rect.width / 2 - tw / 2, 16, vw - tw - 16), y: rect.y - th - TOOLTIP_GAP, placement: 'top' };
  }
  if (spaceRight >= tw + TOOLTIP_GAP + 16) {
    return { x: rect.x + rect.width + TOOLTIP_GAP, y: clamp(rect.y + rect.height / 2 - th / 2, 16, vh - th - 16), placement: 'right' };
  }
  if (spaceLeft >= tw + TOOLTIP_GAP + 16) {
    return { x: rect.x - tw - TOOLTIP_GAP, y: clamp(rect.y + rect.height / 2 - th / 2, 16, vh - th - 16), placement: 'left' };
  }
  return { x: vw - tw - 24, y: vh - th - 24, placement: 'center' };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

interface GuidedTourProps {
  isDark: boolean;
}

export function GuidedTour({ isDark }: GuidedTourProps) {
  const navigate       = useNavigate();
  const location       = useLocation();
  const isGuest        = useQuestStore((s) => s.isGuest);
  const hasSeenTour    = useQuestStore((s) => s.hasSeenTour);
  const playerName     = useQuestStore((s) => s.playerName);
  const setHasSeenTour = useQuestStore((s) => s.setHasSeenTour);

  // Don't show the tour for users who aren't really "in" the app yet.
  // Without a playerName, they're on the login screen.
  const userReady = playerName !== null;
  const shouldShow = userReady && (isGuest || !hasSeenTour);

  const [step, setStep]       = useState(0);
  const [visible, setVisible] = useState(shouldShow);
  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1024,
    h: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  // Pick up shouldShow becoming true after auth/guest mode is established.
  // Always restart from step 0 on a fresh appearance — otherwise a returning
  // guest (who finished the tour last session) would re-open mid-tour, since
  // this component lives at the App root and never unmounts on logout.
  useEffect(() => {
    if (shouldShow && !visible) {
      setStep(0);
      setVisible(true);
    } else if (!shouldShow && visible) {
      // User logged out mid-tour — hide it.
      setVisible(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow]);

  // Track viewport size
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  // Adapt to the user's chosen home view (Realm Map vs Skill Tree grid) rather
  // than forcing them out of it. sessionStorage is the source of truth HubMap
  // reads on mount; default is 'map'.
  const inGridView =
    typeof window !== 'undefined' && sessionStorage.getItem('qa-hub-view') === 'grid';

  const targetSelector =
    current.kind === 'spotlight'
      ? (inGridView && current.altTarget ? current.altTarget : current.target)
      : null;
  const description =
    current.kind === 'spotlight' && inGridView && current.altDescription
      ? current.altDescription
      : current.description;
  const stepRoute = current.kind === 'spotlight' ? current.route : null;

  // Navigate when the current step lives on a different route
  useEffect(() => {
    if (!visible) return;
    if (stepRoute && stepRoute !== location.pathname) {
      navigate(stepRoute, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, visible]);

  // Only query for the target rect when we're already on the right route
  // (avoids briefly latching onto a stale element with the same data-tour id)
  const targetReady = stepRoute === null || stepRoute === location.pathname;
  const targetRect = useTargetRect(visible && targetReady ? targetSelector : null);

  const isMobile = viewport.w < 1024;

  // Measure the real card so placement uses its actual height/width instead of
  // a guessed constant — otherwise a tall card overlaps the target it points to
  // (e.g. step 8 was covering the "View All Badges" button).
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ w: TOOLTIP_W, h: TOOLTIP_H });
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setCardSize((prev) =>
        Math.abs(prev.w - r.width) > 1 || Math.abs(prev.h - r.height) > 1
          ? { w: r.width, h: r.height }
          : prev,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  // targetRect is included so the effect re-fires when the card first appears
  // after a cross-route transition (waitingForTarget kept the card hidden, so
  // cardRef.current was null on the initial step-change run).
  }, [step, visible, description, targetRect]);

  const tooltipPos = computeTooltipPosition(
    current.kind === 'spotlight' ? targetRect : null,
    viewport.w,
    viewport.h,
    isMobile,
    TOOLTIP_W,   // width is always the fixed constant on desktop — don't use potentially-stale cardSize.w
    cardSize.h,
  );

  // Final safety net: whatever placement is chosen, the card can never spill
  // off-screen (otherwise its text and the Next button get clipped).
  const safeX = clamp(tooltipPos.x, 8, Math.max(8, viewport.w - TOOLTIP_W - 8));
  const safeY = clamp(tooltipPos.y, 8, Math.max(8, viewport.h - cardSize.h - 8));

  const dismiss = () => {
    setVisible(false);
    setStep(0);
    if (!isGuest) setHasSeenTour(true);
    // If the tour navigated us off the home page, bring the user back.
    if (location.pathname !== '/home') navigate('/home', { replace: true });
  };

  const goNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else dismiss();
  };

  if (!visible) return null;

  const spotlightRect = current.kind === 'spotlight' && targetRect ? {
    x: targetRect.x - SPOTLIGHT_PADDING,
    y: targetRect.y - SPOTLIGHT_PADDING,
    width:  targetRect.width  + SPOTLIGHT_PADDING * 2,
    height: targetRect.height + SPOTLIGHT_PADDING * 2,
  } : null;

  const StepIcon = current.icon;
  const showSpotlight = !!spotlightRect && !isMobile;

  // While navigating to a spotlight step on another route, the target hasn't
  // mounted yet so its rect is null — without this guard the card would flash
  // centered on the *current* page for a frame before the route transition.
  // Keep the dim overlay up but hide the card until the target is located.
  const waitingForTarget = current.kind === 'spotlight' && !isMobile && !targetRect;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Dimming + spotlight cutout */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-auto"
        onClick={dismiss}
        style={{ cursor: 'pointer' }}
      >
        <defs>
          <mask id="qa-tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {showSpotlight && spotlightRect && (
              <rect
                x={spotlightRect.x}
                y={spotlightRect.y}
                width={spotlightRect.width}
                height={spotlightRect.height}
                rx={SPOTLIGHT_RADIUS}
                fill="black"
                style={{ transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,23,42,0.65)'}
          mask="url(#qa-tour-mask)"
        />
        {showSpotlight && spotlightRect && (
          <rect
            x={spotlightRect.x}
            y={spotlightRect.y}
            width={spotlightRect.width}
            height={spotlightRect.height}
            rx={SPOTLIGHT_RADIUS}
            fill="none"
            stroke={isDark ? 'rgb(167,139,250)' : 'rgb(139,92,246)'}
            strokeWidth={2}
            style={{ pointerEvents: 'none', transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        )}
      </svg>

      {/* Tooltip card */}
      {!waitingForTarget && (
        <div
          ref={cardRef}
          className="absolute pointer-events-auto"
          style={{
            width: TOOLTIP_W,
            maxWidth: 'calc(100vw - 32px)',
            left: safeX,
            top: safeY,
            borderRadius: 20,
            padding: 1,
            background: isDark
              ? 'linear-gradient(150deg, rgba(167,139,250,0.85), rgba(217,70,239,0.35) 45%, rgba(148,163,184,0.06) 80%)'
              : 'linear-gradient(150deg, rgba(124,58,237,0.55), rgba(59,130,246,0.30) 50%, rgba(226,232,240,0.9) 85%)',
            boxShadow: isDark
              ? '0 0 60px -10px rgba(124,58,237,0.45), 0 28px 60px -28px rgba(0,0,0,0.85)'
              : '0 0 50px -14px rgba(124,58,237,0.25), 0 24px 50px -24px rgba(79,70,229,0.28)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative"
            style={{
              borderRadius: 19,
              padding: '24px 24px 22px',
              background: isDark
                ? 'linear-gradient(168deg, #161033 0%, #0d0a1c 60%, #0b0816 100%)'
                : 'linear-gradient(168deg, #ffffff 0%, #fbfaff 100%)',
            }}
          >
            {showSpotlight && tooltipPos.placement !== 'center' && (
              <TooltipArrow placement={tooltipPos.placement} isDark={isDark} />
            )}

            {/* Header: icon + "Guided Tour" label | step counter + close button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: isDark
                      ? 'linear-gradient(150deg, rgba(167,139,250,0.22), rgba(217,70,239,0.14))'
                      : 'linear-gradient(150deg, rgba(124,58,237,0.14), rgba(59,130,246,0.10))',
                    boxShadow: isDark
                      ? 'inset 0 0 0 1px rgba(167,139,250,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
                      : 'inset 0 0 0 1px rgba(124,58,237,0.25)',
                  }}
                >
                  <StepIcon size={19} className={isDark ? 'text-violet-300' : 'text-violet-600'} />
                </div>
                <span className={`text-[10.5px] font-extrabold uppercase tracking-[0.16em] ${isDark ? 'text-violet-400' : 'text-violet-700'}`}>
                  Guided&nbsp;Tour
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[12.5px] font-bold tabular-nums ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span className={`text-[14px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {String(step + 1).padStart(2, '0')}
                  </span>
                  {' / '}{String(STEPS.length).padStart(2, '0')}
                </span>
                <button
                  onClick={dismiss}
                  aria-label="Skip tour"
                  className={`flex items-center justify-center transition-colors ${
                    isDark
                      ? 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.06]'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-black/[0.04]'
                  }`}
                  style={{ width: 26, height: 26, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Thin gradient progress bar */}
            <div
              className="w-full overflow-hidden mb-[18px]"
              style={{ height: 3, borderRadius: 99, background: isDark ? 'rgba(148,163,184,0.14)' : 'rgba(124,58,237,0.10)' }}
            >
              <div
                style={{
                  height: '100%', borderRadius: 99,
                  width: `${((step + 1) / STEPS.length) * 100}%`,
                  background: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
                  transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>

            <h2 className={`text-[19px] font-extrabold tracking-tight mb-[7px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {current.title}
            </h2>

            <p className={`text-[13.5px] leading-relaxed mb-[22px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              {description}
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={dismiss}
                className={`text-[13px] font-medium transition-colors ${
                  isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Skip tour
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 text-white font-bold transition-all hover:brightness-110"
                style={{
                  fontSize: 13.5, padding: '9px 16px', borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(90deg, #7c3aed, #c026d3)',
                  boxShadow: '0 8px 22px -8px rgba(192,38,211,0.6)',
                }}
              >
                {isLast ? "Let's go!" : 'Next'}
                {!isLast && <ChevronRight size={15} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TooltipArrow({ placement, isDark }: { placement: Placement; isDark: boolean }) {
  const bg = isDark ? '#0d0a1c' : '#ffffff';
  const border = isDark ? 'rgba(167,139,250,0.4)' : 'rgba(124,58,237,0.25)';
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 12,
    height: 12,
    background: bg,
    transform: 'rotate(45deg)',
  };
  if (placement === 'bottom') {
    Object.assign(base, { top: -6, left: '50%', marginLeft: -6, borderTop: `1px solid ${border}`, borderLeft: `1px solid ${border}` });
  } else if (placement === 'top') {
    Object.assign(base, { bottom: -6, left: '50%', marginLeft: -6, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}` });
  } else if (placement === 'right') {
    Object.assign(base, { left: -6, top: '50%', marginTop: -6, borderLeft: `1px solid ${border}`, borderBottom: `1px solid ${border}` });
  } else if (placement === 'left') {
    Object.assign(base, { right: -6, top: '50%', marginTop: -6, borderRight: `1px solid ${border}`, borderTop: `1px solid ${border}` });
  }
  return <div style={base} />;
}
