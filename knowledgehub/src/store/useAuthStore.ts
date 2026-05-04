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
  sendVerificationEmail,
  reloadUser,
  type User,
} from '../lib/firebase';
import { useQuestStore } from './useQuestStore';

interface AuthState {
  user: User | null;
  authLoading: boolean;         // true while Firebase checks session on startup
  actionLoading: boolean;       // true while login/signup/logout is in-flight
  pendingVerification: boolean; // true after signup until email is verified
  unverifiedEmail: string | null; // email address awaiting verification
  error: string | null;

  // Actions
  loginWithEmail:       (email: string, password: string) => Promise<void>;
  signupWithEmail:      (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle:      () => Promise<void>;
  logout:               () => Promise<void>;
  forgotPassword:       (email: string) => Promise<void>;
  resendVerification:   () => Promise<void>;
  checkVerification:    () => Promise<void>;
  clearError:           () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {

  // ── Listen to Firebase session on startup ──────────────────
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // If email/password signup and email not yet verified — hold in pending state.
      // Google users are always pre-verified so they pass through immediately.
      if (!firebaseUser.emailVerified && firebaseUser.providerData[0]?.providerId === 'password') {
        set({
          user: null,
          authLoading: false,
          actionLoading: false,
          pendingVerification: true,
          unverifiedEmail: firebaseUser.email,
        });
        return;
      }

      // User is logged in and verified — load their progress from Firestore
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
      // Clear actionLoading here so the login spinner stays visible until
      // the user is fully loaded and LoginRoute fires the redirect.
      set({ user: firebaseUser, authLoading: false, actionLoading: false, pendingVerification: false, unverifiedEmail: null });
    } else {
      // Logged out — clear progress UNLESS the user is in guest mode
      // (onAuthStateChanged fires on every page load when no Firebase user exists,
      //  so we must not wipe a guest's local progress on each refresh)
      if (!useQuestStore.getState().isGuest) {
        useQuestStore.getState().resetProgress();
      }
      set({ user: null, authLoading: false, actionLoading: false, pendingVerification: false, unverifiedEmail: null });
    }
  });

  return {
    user: null,
    authLoading: true,
    actionLoading: false,
    pendingVerification: false,
    unverifiedEmail: null,
    error: null,

    loginWithEmail: async (email, password) => {
      set({ actionLoading: true, error: null });
      try {
        await signInWithEmail(email, password);
        // Keep actionLoading: true — onAuthStateChanged clears it once the
        // user is fully loaded, so the spinner stays visible the whole time.
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code ?? 'unknown';
        console.error('[loginWithEmail] Firebase error code:', code, err);
        set({ error: friendlyError(err), actionLoading: false });
      }
    },

    signupWithEmail: async (name, email, password) => {
      set({ actionLoading: true, error: null });
      try {
        const cred = await signUpWithEmail(name, email, password);
        // Send verification email immediately after account creation
        await sendVerificationEmail(cred.user);
        // onAuthStateChanged will fire and set pendingVerification: true
        // Keep actionLoading: true until that fires.
      } catch (err: unknown) {
        set({ error: friendlyError(err), actionLoading: false });
      }
    },

    loginWithGoogle: async () => {
      set({ actionLoading: true, error: null });
      try {
        await signInWithGoogle();
        // Keep actionLoading: true — onAuthStateChanged clears it once loaded.
      } catch (err: unknown) {
        set({ error: friendlyError(err), actionLoading: false });
      }
    },

    logout: async () => {
      // Capture uid before clearing user so the Firestore save still works
      const uid = get().user?.uid;

      // Clear user immediately — ProtectedRoute redirects to /login right away,
      // eliminating the Welcome page flash that occurred while awaiting Firestore.
      set({ user: null, actionLoading: true, error: null });

      try {
        // ── Flush latest progress to Firestore BEFORE signing out ──
        // This guarantees the cloud has the latest state even if the
        // 2-second debounce hasn't fired yet.
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

    resendVerification: async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      set({ error: null });
      try {
        await sendVerificationEmail(firebaseUser);
        set({ error: '✅ Verification email resent! Check your inbox.' });
      } catch (err: unknown) {
        set({ error: friendlyError(err) });
      }
    },

    checkVerification: async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      set({ actionLoading: true, error: null });
      try {
        const refreshed = await reloadUser(firebaseUser);
        if (refreshed.emailVerified) {
          // Trigger onAuthStateChanged flow by reloading — it will grant access
          // Manually kick the same flow since reload doesn't re-fire onAuthStateChanged
          try {
            const progress = await loadUserProgress(refreshed.uid);
            if (progress) {
              useQuestStore.getState().hydrateFromFirestore(progress, refreshed.displayName ?? '');
            } else {
              useQuestStore.getState().setPlayerName(refreshed.displayName ?? 'Adventurer');
            }
          } catch {
            useQuestStore.getState().setPlayerName(refreshed.displayName ?? 'Adventurer');
          }
          set({ user: refreshed, pendingVerification: false, unverifiedEmail: null, actionLoading: false });
        } else {
          set({ error: 'Email not verified yet. Please click the link in your inbox.', actionLoading: false });
        }
      } catch (err: unknown) {
        set({ error: friendlyError(err), actionLoading: false });
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
