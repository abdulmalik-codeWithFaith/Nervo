"use client";

// components/dashboard/CandidateLayout.tsx

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthState } from "@/lib/hooks/useAuth";
import CandidateSidebar from "./CandidateSidebar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":          "Dashboard",
  "/dashboard/practice": "Practice",
  "/dashboard/feedback": "Feedback",
};

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const router                  = useRouter();
  const pathname                = usePathname();
  const { user, initializing }  = useAuthState();
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking]   = useState(true); // checking accountType

  useEffect(() => {
    if (initializing) return;

    // No session at all → go sign in
    if (!user) {
      router.replace("/get-started");
      return;
    }

    // Session exists → check accountType in Firestore
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) {
        const accountType = snap.data().accountType;
        if (accountType === "company") {
          // Company user landed on candidate dashboard — redirect them
          router.replace("/companies");
          return;
        }
      }
      // Candidate (or doc not found) — allow through
      setChecking(false);
    }).catch(() => {
      // Firestore error — let them through rather than locking them out
      setChecking(false);
    });

  }, [user, initializing, router]);

  // Blank screen while Firebase + Firestore resolves
  if (initializing || checking) {
    return (
      <div style={{
        background: "#05050f", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "2px solid rgba(124,58,237,0.3)",
          borderTopColor: "#7c3aed",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const title = PAGE_TITLES[pathname] ?? "Dashboard";
  const sideW = collapsed ? 68 : 224;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #05050f; color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
          -webkit-font-smoothing: antialiased; min-height: 100vh;
        }
        .cl-shell { display: flex; min-height: 100vh; }
        .cl-main {
          flex: 1; margin-left: ${sideW}px;
          transition: margin-left 0.22s ease;
          display: flex; flex-direction: column; min-height: 100vh;
        }
        .cl-topbar {
          position: sticky; top: 0; z-index: 30;
          height: 58px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          background: rgba(5,5,15,0.88); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cl-topbar h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .cl-topbar-btn {
          padding: 7px 16px; border-radius: 8px;
          font-size: 12px; font-weight: 500; color: #c4b5fd;
          border: 1px solid rgba(124,58,237,0.35);
          background: transparent; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: background 0.2s;
        }
        .cl-topbar-btn:hover { background: rgba(124,58,237,0.12); }
        .cl-content { flex: 1; padding: 28px; position: relative; z-index: 1; }
        .cl-glow {
          position: fixed; top: -160px; left: 60px;
          width: 500px; height: 500px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
        }
        @media (max-width: 768px) {
          .cl-main { margin-left: 0; }
          .cl-topbar, .cl-content { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>

      <div className="cl-glow" aria-hidden="true" />
      <div className="cl-shell">
        <CandidateSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        <div className="cl-main">
          <header className="cl-topbar">
            <h1>{title}</h1>
            <Link href="/dashboard/practice" className="cl-topbar-btn">
              🎙 New interview
            </Link>
          </header>
          <main className="cl-content">{children}</main>
        </div>
      </div>
    </>
  );
}