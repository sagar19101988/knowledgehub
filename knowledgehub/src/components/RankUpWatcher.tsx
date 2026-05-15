import { useEffect, useRef, useState } from 'react';
import { useQuestStore } from '../store/useQuestStore';
import { XP_LEVELS, getLevel } from '../data/zones';
import { RankUpModal } from './RankUpModal';

/**
 * Globally-mounted watcher: detects level-ups regardless of which route is
 * active (HubMap, ZoneView, etc.) and triggers the celebration modal.
 *
 * First mount / Firestore hydration is silently absorbed so we never fire
 * on page load or login.
 */
type RankUpPayload = {
  fromTitle: string | null;
  toTitle: string;
  toLevel: number;
  flavor: string;
};

/** Max XP that can be earned in a single tick (one module = 100 XP). */
const MAX_NORMAL_XP_DELTA = 200;

export function RankUpWatcher() {
  const xp = useQuestStore((s) => s.xp);
  const completedCount = useQuestStore((s) => s.completedLevels.length);
  const rankUpPaused = useQuestStore((s) => s.rankUpPaused);
  const { current } = getLevel(xp, { completedModuleCount: completedCount });

  const lastXpRef = useRef<number | null>(null);
  const lastLevelRef = useRef<number | null>(null);
  const pendingRef = useRef<RankUpPayload | null>(null);
  const [rankUp, setRankUp] = useState<RankUpPayload | null>(null);

  // ── Detect level-ups; queue the modal if rank-up is paused ──
  useEffect(() => {
    // First mount: snapshot, no celebration.
    if (lastXpRef.current === null) {
      lastXpRef.current = xp;
      lastLevelRef.current = current.level;
      return;
    }

    const xpDelta = xp - lastXpRef.current;

    // A large positive jump = Firestore hydration on login.
    // A negative delta = logout reset (xp → 0).
    // In both cases the level may shift but the user didn't *earn* it now.
    const isHydrationOrReset = xpDelta > MAX_NORMAL_XP_DELTA || xpDelta < 0;

    if (
      !isHydrationOrReset
      && lastLevelRef.current !== null
      && current.level > lastLevelRef.current
    ) {
      const fromEntry = XP_LEVELS.find((l) => l.level === lastLevelRef.current);
      const payload: RankUpPayload = {
        fromTitle: fromEntry?.title ?? null,
        toTitle: current.title,
        toLevel: current.level,
        flavor: current.flavor,
      };

      if (rankUpPaused) {
        // Queue silently — will be released by the resumeRankUp effect below.
        pendingRef.current = payload;
      } else {
        setRankUp(payload);
      }
    }

    lastXpRef.current = xp;
    lastLevelRef.current = current.level;
  }, [xp, current.level, current.title, current.flavor, rankUpPaused]);

  // ── When rank-up is resumed, flush any queued payload ──
  useEffect(() => {
    if (!rankUpPaused && pendingRef.current) {
      setRankUp(pendingRef.current);
      pendingRef.current = null;
    }
  }, [rankUpPaused]);

  return (
    <RankUpModal
      open={rankUp !== null}
      fromTitle={rankUp?.fromTitle ?? null}
      toTitle={rankUp?.toTitle ?? null}
      toLevel={rankUp?.toLevel ?? null}
      flavor={rankUp?.flavor ?? null}
      onClose={() => setRankUp(null)}
    />
  );
}
