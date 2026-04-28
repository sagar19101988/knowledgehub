import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useQuestStore } from '../store/useQuestStore';

interface BadgeToastProps {
  badgesMap: Record<string, string>;
}

export function BadgeToast({ badgesMap }: BadgeToastProps) {
  const [notification, setNotification] = useState<{ zoneId: string, badge: string } | null>(null);
  const zoneProgress = useQuestStore(state => state.zoneProgress);
  const unlockedBadges = useQuestStore(state => state.unlockedBadges);
  const unlockBadge = useQuestStore(state => state.unlockBadge);

  useEffect(() => {
    Object.entries(zoneProgress).forEach(([zoneId, progress]) => {
      if (progress >= 100) {
        const badgeName = badgesMap[zoneId];
        if (badgeName && !unlockedBadges.includes(badgeName)) {
          // Unlock it globally
          unlockBadge(badgeName);
          // Show toast
          setNotification({ zoneId, badge: badgeName });
          
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        }
      }
    });
  }, [zoneProgress, unlockedBadges, badgesMap, unlockBadge]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="bg-slate-900 border border-amber-500/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-amber-500 font-bold text-sm tracking-widest uppercase">Mastery Achieved</p>
              <h4 className="text-white text-xl font-black">Unlocked: {notification.badge}</h4>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
