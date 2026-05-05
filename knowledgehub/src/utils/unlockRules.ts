import { ZONES, ZONE_TIERS } from '../data/zones';

const TIER_ORDER = ['beginner', 'intermediate', 'expert'] as const;

function isProgressiveZone(zoneId: string): boolean {
  return !!(ZONES.find(z => z.id === zoneId) as { progressiveUnlock?: boolean } | undefined)?.progressiveUnlock;
}

function flatModules(zoneId: string): { tierId: string; moduleId: string }[] {
  const tiers = ZONE_TIERS[zoneId] ?? [];
  const sorted = [...tiers].sort((a, b) => TIER_ORDER.indexOf(a.id as any) - TIER_ORDER.indexOf(b.id as any));
  return sorted.flatMap(t => t.moduleIds.map(m => ({ tierId: t.id, moduleId: m })));
}

export function isModuleUnlocked(zoneId: string, moduleId: string, completedLevels: string[]): boolean {
  if (!isProgressiveZone(zoneId)) return true;

  const all = flatModules(zoneId);
  const idx = all.findIndex(m => m.moduleId === moduleId);
  if (idx === -1) return true;
  if (idx === 0) return true;
  if (completedLevels.includes(`${zoneId}::${moduleId}`)) return true;

  const prev = all[idx - 1];
  return completedLevels.includes(`${zoneId}::${prev.moduleId}`);
}

export function isTierUnlocked(zoneId: string, tierId: string, completedLevels: string[]): boolean {
  if (!isProgressiveZone(zoneId)) return true;

  const tiers = ZONE_TIERS[zoneId] ?? [];
  const tierIdx = TIER_ORDER.indexOf(tierId as any);
  if (tierIdx <= 0) return true;

  for (let i = 0; i < tierIdx; i++) {
    const prevTier = tiers.find(t => t.id === TIER_ORDER[i]);
    if (!prevTier || prevTier.moduleIds.length === 0) continue;
    const allDone = prevTier.moduleIds.every(m => completedLevels.includes(`${zoneId}::${m}`));
    if (!allDone) return false;
  }
  return true;
}

export function getPrerequisiteHint(zoneId: string, moduleId: string): string {
  if (!isProgressiveZone(zoneId)) return '';

  const all = flatModules(zoneId);
  const idx = all.findIndex(m => m.moduleId === moduleId);
  if (idx <= 0) return '';
  return all[idx - 1].moduleId;
}

export function getFirstUnlockedModule(zoneId: string, completedLevels: string[]): string | null {
  if (!isProgressiveZone(zoneId)) {
    const all = flatModules(zoneId);
    return all[0]?.moduleId ?? null;
  }

  const all = flatModules(zoneId);
  for (const m of all) {
    if (isModuleUnlocked(zoneId, m.moduleId, completedLevels)) {
      if (!completedLevels.includes(`${zoneId}::${m.moduleId}`)) return m.moduleId;
    }
  }
  return all[0]?.moduleId ?? null;
}
