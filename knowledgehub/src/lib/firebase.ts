import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
export const auth   = getAuth(app);
export const db     = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ─── Types ────────────────────────────────────────────────────
export type { User };

export interface UserProgress {
  xp: number;
  zoneProgress: Record<string, number>;
  unlockedBadges: string[];
  completedLevels: string[];
  lastBountyDate: string | null;
  theme: 'dark' | 'light';
}

export interface FirestoreUser {
  displayName: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
  lastLoginAt: string;
  progress: UserProgress;
}

// ─── Default progress for new users ───────────────────────────
export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  zoneProgress: { manual: 0, sql: 0, api: 0, typescript: 0, playwright: 0, 'ai-qa': 0 },
  unlockedBadges: [],
  completedLevels: [],
  lastBountyDate: null,
  theme: 'dark',
};

// ─── Auth helpers ──────────────────────────────────────────────
export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  // Create Firestore doc for new user
  await setDoc(doc(db, 'users', cred.user.uid), {
    displayName: name,
    email,
    isPremium: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    progress: DEFAULT_PROGRESS,
  } satisfies FirestoreUser);
  return cred;
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const userRef = doc(db, 'users', cred.user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    // First time Google login — create their doc
    await setDoc(userRef, {
      displayName: cred.user.displayName ?? 'Adventurer',
      email: cred.user.email ?? '',
      isPremium: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      progress: DEFAULT_PROGRESS,
    } satisfies FirestoreUser);
  } else {
    // Returning user — update last login timestamp
    await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
  }
  return cred;
}

export async function signOutUser() {
  return firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// ─── Firestore progress helpers ────────────────────────────────
export async function loadUserProgress(uid: string): Promise<UserProgress | null> {
  console.log('[Firestore] loadUserProgress →', uid);
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    console.warn('[Firestore] no document for uid:', uid);
    return null;
  }
  const data = snap.data() as FirestoreUser;
  console.log('[Firestore] loaded progress:', data.progress);
  return data.progress ?? DEFAULT_PROGRESS;
}

export async function saveUserProgress(uid: string, progress: UserProgress): Promise<void> {
  console.log('[Firestore] saveUserProgress →', uid, progress);
  // Use setDoc with merge:true — safer than updateDoc (works even if doc is missing)
  await setDoc(
    doc(db, 'users', uid),
    { progress, lastLoginAt: new Date().toISOString() },
    { merge: true }
  );
  console.log('[Firestore] ✅ progress saved successfully');
}

export { onAuthStateChanged };
