"use client";

// hooks/useCandidateData.ts
// Fetches the logged-in candidate's real data from Firestore.
// Components just call this hook — they never touch Firebase directly.

import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy,
  limit, getDocs, doc, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthState } from "@/lib/hooks/useAuth";

export interface PracticeSession {
  id:           string;
  role:         string;
  interviewType:string;
  date:         string;        // formatted display string
  duration:     string;
  scores: {
    tech: number; comm: number; conf: number; prob: number;
  };
  createdAt:    number;        // unix timestamp for sorting
}

export interface CandidateProfile {
  name:         string;
  email:        string;
  targetRole:   string;
  freeTrialUsed:boolean;
  createdAt:    any;
}

export interface DashboardStats {
  totalSessions: number;
  avgScore:      number;
  totalMinutes:  number;
  streak:        number;
}

function avg(s: PracticeSession["scores"]) {
  return Math.round((s.tech + s.comm + s.conf + s.prob) / 4);
}

// ── Fetch candidate profile from users/{uid} ──────────────
export function useCandidateProfile() {
  const { user } = useAuthState();
  const [profile,  setProfile]  = useState<CandidateProfile | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({
          name:          d.name          ?? user.displayName ?? "Candidate",
          email:         d.email         ?? user.email       ?? "",
          targetRole:    d.targetRole    ?? "",
          freeTrialUsed: d.freeTrialUsed ?? false,
          createdAt:     d.createdAt,
        });
      }
      setLoading(false);
    });
  }, [user]);

  return { profile, loading };
}

// ── Fetch recent practice sessions from Firestore ─────────
export function usePracticeSessions(limitTo = 10) {
  const { user }    = useAuthState();
  const [sessions,  setSessions]  = useState<PracticeSession[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const q = query(
      collection(db, "practiceSessions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(limitTo)
    );

    getDocs(q).then(snap => {
      const data: PracticeSession[] = snap.docs.map(d => {
        const r = d.data();
        const ts = r.createdAt?.toDate?.() ?? new Date();
        return {
          id:            d.id,
          role:          r.role          ?? "Interview",
          interviewType: r.interviewType ?? "General",
          duration:      r.duration      ?? "—",
          scores: {
            tech: r.scores?.tech ?? 0,
            comm: r.scores?.comm ?? 0,
            conf: r.scores?.conf ?? 0,
            prob: r.scores?.prob ?? 0,
          },
          date:      formatDate(ts),
          createdAt: ts.getTime(),
        };
      });
      setSessions(data);
      setLoading(false);
    });
  }, [user, limitTo]);

  return { sessions, loading };
}

// ── Compute dashboard stats from sessions ─────────────────
export function useDashboardStats(sessions: PracticeSession[]): DashboardStats {
  if (sessions.length === 0) {
    return { totalSessions: 0, avgScore: 0, totalMinutes: 0, streak: 0 };
  }

  const totalSessions = sessions.length;

  const avgScore = Math.round(
    sessions.reduce((sum, s) => sum + avg(s.scores), 0) / totalSessions
  );

  const totalMinutes = sessions.reduce((sum, s) => {
    const n = parseInt(s.duration);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const streak = computeStreak(sessions);

  return { totalSessions, avgScore, totalMinutes, streak };
}

// ── Helpers ───────────────────────────────────────────────
function computeStreak(sessions: PracticeSession[]): number {
  if (!sessions.length) return 0;
  const days = new Set(
    sessions.map(s => {
      const d = new Date(s.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (days.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function formatDate(d: Date): string {
  const now  = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 172800) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}