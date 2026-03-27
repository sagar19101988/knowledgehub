// src/components/ui/GuidedTour.tsx
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Map } from 'lucide-react';

const TOUR_DISABLED_KEY = 'jobtracker-tour-disabled';

export function hasTourBeenDisabled(): boolean {
  return localStorage.getItem(TOUR_DISABLED_KEY) === 'true';
}

export function disableTourPermanently(): void {
  localStorage.setItem(TOUR_DISABLED_KEY, 'true');
}

export function resetTourDisabled(): void {
  localStorage.removeItem(TOUR_DISABLED_KEY);
}

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'kanban-board',
    title: '📋 Your Job Pipeline',
    description: 'This is your Kanban board! Every job application lives here as a card. Drag and drop cards between columns to update their status as you progress through your job hunt.',
    position: 'top',
  },
  {
    targetId: 'add-job-btn',
    title: '➕ Add a New Job',
    description: 'Click here to add a new job application. Fill in the company name, role, job URL, and status. You can also press the "N" key anywhere on the board as a shortcut!',
    position: 'bottom',
  },
  {
    targetId: 'search-input',
    title: '🔍 Smart Search & Filter',
    description: 'Instantly filter your entire pipeline by typing a company name or job title here. Press the "/" key anywhere on the page to instantly jump your cursor into this search bar.',
    position: 'bottom',
  },
  {
    targetId: 'pipeline-analytics',
    title: '📊 Pipeline Analytics',
    description: 'These cards give you a real-time overview of your job search health — including your Interview Rate, Response Rate, and an overall Health Score out of 100. Hover each card for a detailed explanation!',
    position: 'bottom',
  },
  {
    targetId: 'launchpad-btn',
    title: '🧭 Quick Launch Job Search',
    description: 'Click this Compass icon to instantly open a floating panel with pre-configured search links for LinkedIn (Easy Apply), Naukri, and a Direct ATS search on Greenhouse & Lever — the fastest way to find your next opportunity!',
    position: 'bottom',
  },
  {
    targetId: 'alerts-bell',
    title: '🔔 Smart Follow-Up Alerts',
    description: 'This bell icon lights up when you have applications that need your attention — like jobs you applied to more than a week ago without a follow-up, or upcoming interview dates approaching.',
    position: 'bottom',
  },
  {
    targetId: 'morning-briefing-btn',
    title: '📰 Morning Briefing',
    description: "Click here any time to open your personalised Morning Briefing — a beautiful daily dashboard showing your streak, pipeline health, today's battle plan, and motivational insights to keep you going!",
    position: 'bottom',
  },
];

interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface GuidedTourProps {
  onClose: () => void;
}

export default function GuidedTour({ onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [targetBox, setTargetBox] = useState<BoundingBox | null>(null);
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isFirst = currentStep === 0;

  // Find and measure the target element
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetBox({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setVisible(true);
    }, 150);
    return () => clearTimeout(t);
  }, [currentStep, step.targetId]);

  const handleClose = (skip = false) => {
    if (dontShowAgain || !skip) {
      disableTourPermanently();
    }
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      disableTourPermanently();
    }
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleFinish = () => {
    if (dontShowAgain) {
      disableTourPermanently();
    }
    disableTourPermanently(); // Always disable after completing the full tour
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetBox) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const GAP = 16;
    const tooltipWidth = 340;

    if (step.position === 'bottom') {
      return {
        position: 'fixed',
        top: targetBox.top + targetBox.height + GAP,
        left: Math.min(
          Math.max(targetBox.left + targetBox.width / 2 - tooltipWidth / 2, 12),
          window.innerWidth - tooltipWidth - 12
        ),
        width: tooltipWidth,
      };
    }

    if (step.position === 'top') {
      return {
        position: 'fixed',
        bottom: window.innerHeight - targetBox.top + GAP,
        left: Math.min(
          Math.max(targetBox.left + targetBox.width / 2 - tooltipWidth / 2, 12),
          window.innerWidth - tooltipWidth - 12
        ),
        width: tooltipWidth,
      };
    }

    return {
      position: 'fixed',
      top: targetBox.top + targetBox.height / 2 - 80,
      left: targetBox.left + targetBox.width + GAP,
      width: tooltipWidth,
    };
  };

  const PADDING = 8;
  const spotlightStyle: React.CSSProperties = targetBox
    ? {
        position: 'fixed',
        top: targetBox.top - PADDING,
        left: targetBox.left - PADDING,
        width: targetBox.width + PADDING * 2,
        height: targetBox.height + PADDING * 2,
        borderRadius: 12,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
        border: '2px solid rgba(99,102,241,0.8)',
        zIndex: 9998,
        transition: 'all 0.25s ease',
        pointerEvents: 'none',
      }
    : {};

  return (
    <>
      {/* Full screen backdrop */}
      <div
        className="fixed inset-0 z-[9997] cursor-pointer"
        onClick={handleSkip}
        style={{ background: 'transparent' }}
      />

      {/* Spotlight ring around target */}
      {targetBox && <div style={spotlightStyle} />}

      {/* Tooltip Card */}
      <div
        ref={tooltipRef}
        style={{
          ...getTooltipPosition(),
          zIndex: 9999,
          transition: 'opacity 0.2s, transform 0.2s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(8px)',
        }}
        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-indigo-500/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-5">
          {/* Step counter + close */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Map size={14} className="text-indigo-500" />
              <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <button
              onClick={() => handleClose(true)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Step dots */}
          <div className="flex gap-1.5 mb-4">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-indigo-500'
                    : i < currentStep
                    ? 'w-1.5 bg-indigo-300 dark:bg-indigo-700'
                    : 'w-1.5 bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Don't show again */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-500 accent-indigo-500 cursor-pointer"
            />
            <span className="text-[11px] text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
              Don't show this tour again
            </span>
          </label>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleSkip}
              className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline underline-offset-2"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={isFirst}
                onClick={() => setCurrentStep(c => c - 1)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={isLast ? handleFinish : () => setCurrentStep(c => c + 1)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-indigo-500/30"
              >
                {isLast ? '🎉 Finish' : 'Next'}
                {!isLast && <ChevronRight size={13} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
