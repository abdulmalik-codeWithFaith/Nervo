
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export type AccountType = "company" | "candidate";

export interface SignUpCompanyInput {
  name: string;
  company: string;
  email: string;
  password: string;
  role: string;
}

export interface SignUpCandidateInput {
  name: string;
  email: string;
  password: string;
  targetRole?: string;
}

// ── Friendly error messages ──────────────────────────────
function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "That email already has an account. Try signing in instead.",
    "auth/invalid-email":        "That email address doesn't look right.",
    "auth/weak-password":        "Password should be at least 6 characters.",
    "auth/user-not-found":       "No account found with that email.",
    "auth/wrong-password":       "Incorrect password. Try again or reset it.",
    "auth/invalid-credential":   "Incorrect email or password.",
    "auth/too-many-requests":    "Too many attempts. Please wait a moment and try again.",
    "auth/popup-closed-by-user": "Google sign-in was closed before completing.",
    "auth/network-request-failed": "Network error — check your connection and try again.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}

// ── Core hook: track auth state ──────────────────────────
export function useAuthState() {
  const [user, setUser]       = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  return { user, initializing };
}

// ── Auth actions hook: sign up, sign in, sign out ────────
export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function clearError() { setError(""); }

  // ── Company sign-up ──
  const signUpCompany = useCallback(async (input: SignUpCompanyInput) => {
    setLoading(true); setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
      await updateProfile(cred.user, { displayName: input.name });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name: input.name,
        email: input.email,
        accountType: "company" as AccountType,
        companyName: input.company,
        role: input.role,
        createdAt: serverTimestamp(),
      });

      return cred.user;
    } catch (e: any) {
      setError(friendlyError(e.code));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Candidate sign-up ──
  const signUpCandidate = useCallback(async (input: SignUpCandidateInput) => {
    setLoading(true); setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
      await updateProfile(cred.user, { displayName: input.name });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name: input.name,
        email: input.email,
        accountType: "candidate" as AccountType,
        targetRole: input.targetRole ?? "",
        freeTrialUsed: false,
        createdAt: serverTimestamp(),
      });

      return cred.user;
    } catch (e: any) {
      setError(friendlyError(e.code));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Sign in (email/password) ──
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true); setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } catch (e: any) {
      setError(friendlyError(e.code));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Google sign-in (used for both sign-up and sign-in) ──
  const signInWithGoogle = useCallback(async (accountType?: AccountType) => {
    setLoading(true); setError("");
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);

      // Only write a user doc if this is a brand-new sign-up flow
      if (accountType) {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          name: cred.user.displayName ?? "",
          email: cred.user.email ?? "",
          accountType,
          createdAt: serverTimestamp(),
        }, { merge: true });
      }

      return cred.user;
    } catch (e: any) {
      setError(friendlyError(e.code));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Password reset ──
  const resetPassword = useCallback(async (email: string) => {
    setLoading(true); setError("");
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e: any) {
      setError(friendlyError(e.code));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Sign out ──
  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  return {
    loading, error, clearError,
    signUpCompany, signUpCandidate,
    signIn, signInWithGoogle,
    resetPassword, signOut,
  };
}