import { create } from 'zustand';
import {
  auth,
  onAuthStateChanged,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  saveUserProgress,
  loadUserProgress,
  type User,
} from '../lib/firebase';
import { useQuestStore } from './useQuestStore';

interface AuthState {
  user: User | null;
  authLoading: boolean;      // true while Firebase checks session on startup
  actionLoading: boolean;    // true while login/signup/logout is in-flight
  error: string | null;

  // Actions
  loginWithEmail:    (email: string, password: string) => Promise<void>;
  signupWithEmail:   (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle:   () => Promise<void>;
  logout:            () => Promise<void>;
  forgotPassword:    (email: string) => Promise<void>;
  clearError:        () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {

  // ── Listen to Firebase session on startup ──────────────────
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // User is logged in — load their progress from Firestore into the quest store
      try {
        const progress = await loadUserProgress(firebaseUser.uid);
        if (progress) {
          useQuestStore.getState().hydrateFromFirestore(progress, firebaseUser.displayName ?? '');
        } else {
          useQuestStore.getState().setPlayerName(firebaseUser.displayName ?? 'Adventurer');
        }
      } catch {
        // Firestore unavailable — fall back to localStorage data already in store
        useQuestStore.getState().setPlayerName(firebaseUser.displayName ?? 'Adventurer');
      }
      set({ user: firebaseUser, authLoading: false });
    } else {
      // Logged out — clear progress
      useQuestStore.getState().resetProgress();
      set({ user: null, authLoading: false });
    }
  });

  return {
    user: null,
    authLoading: true,
    actionLoading: false,
    error: null,

    loginWithEmail: async (email, password) => {
      set({ actionLoading: true, error: null });
      try {
        await signInWithEmail(email, password);
        // onAuthStateChanged above handles the rest
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code ?? 'unknown';
        console.error('[loginWithEmail] Firebase error code:', code, err);
        set({ error: friendlyError(err), actionLoading: false });
      } finally {
        set({ actionLoading: false });
      }
    },

    signupWithEmail: async (name, email, password) => {
      set({ actionLoading: true, error: null });
      try {
        await signUpWithEmail(name, email, password);
      } catch (err: unknown) {
        set({ error: friendlyError(err), actionLoading: false });
      } finally {
        set({ actionLoading: false });
      }
    },

    loginWithGoogle: async () => {
      set({ actionLoading: true, error: null });
      try {
        await signInWithGoogle();
      } catch (err: unknown) {
        set({ error: friendlyError(err), actionLoading: false });
      } finally {
        set({ actionLoading: false });
      }
    },

    logout: async () => {
      set({ actionLoading: true, error: null });
      try {
        // ── Flush latest progress to Firestore BEFORE signing out ──
        // This guarantees the cloud has the latest state even if the
        // 2-second debounce hasn't fired yet.
        const uid = get().user?.uid;
        if (uid) {
          const s = useQuestStore.getState();
          await saveUserProgress(uid, {
            xp:             s.xp,
            zoneProgress:   s.zoneProgress,
            unlockedBadges: s.unlockedBadges,
            completedLevels: s.completedLevels,
            lastBountyDate: s.lastBountyDate,
            theme:          s.theme,
          }).catch((err) => {
            console.error('[logout] final Firestore save failed:', err);
          });
        }
        await signOutUser();
      } catch (err: unknown) {
        set({ error: friendlyError(err), actionLoading: false });
      } finally {
        set({ actionLoading: false });
      }
    },

    forgotPassword: async (email) => {
      set({ actionLoading: true, error: null });
      try {
        await resetPassword(email);
        set({ error: '✅ Password reset email sent! Check your inbox.' });
      } catch (err: unknown) {
        set({ error: friendlyError(err) });
      } finally {
        set({ actionLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  };
});

// ─── Human-readable Firebase error messages ────────────────────
function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-email':            'That doesn\'t look like a valid email address.',
    'auth/user-not-found':           'No account found with that email.',
    'auth/wrong-password':           'Incorrect password. Try again.',
    'auth/invalid-credential':       'Incorrect email or password. Use "Forgot password?" to reset it.',
    'auth/email-already-in-use':     'An account with this email already exists.',
    'auth/weak-password':            'Password must be at least 6 characters.',
    'auth/too-many-requests':        'Too many attempts. Please wait a moment and try again.',
    'auth/popup-closed-by-user':     'Google sign-in was cancelled.',
    'auth/network-request-failed':   'Network error. Check your connection.',
    'auth/missing-email':            'Enter your email address above first, then click Forgot password.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}
