"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import CompaniesSidebar from "@/components/companies-sidebar";
import Link from "next/link";

interface Props { children: React.ReactNode; }

const PAGE_TITLES: Record<string, string> = {
  "/companies":            "Dashboard",
  "/companies/campaigns":  "Campaigns",
  "/companies/candidates": "Candidates",
  "/companies/settings":   "Settings",
};

export default function CompaniesLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname  = usePathname();

  const title = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1] ?? "Companies";

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
          flex: 1;
          margin-left: ${sideW}px;
          transition: margin-left 0.22s ease;
          display: flex; flex-direction: column; min-height: 100vh;
        }
        .cl-topbar {
          position: sticky; top: 0; z-index: 30;
          height: 58px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          background: rgba(5,5,15,0.88); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cl-topbar-left { display: flex; align-items: center; gap: 10px; }
        .cl-topbar-left h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .cl-topbar-right { display: flex; align-items: center; gap: 10px; }
        .cl-topbar-btn {
          padding: 7px 16px; border-radius: 8px;
          font-size: 12px; font-weight: 500; color: #c4b5fd;
          border: 1px solid rgba(124,58,237,0.35);
          background: transparent; text-decoration: none; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
          display: inline-flex; align-items: center; gap: 6px;
          transition: background 0.2s;
        }
        .cl-topbar-btn:hover { background: rgba(124,58,237,0.12); }
        .cl-topbar-btn.primary {
          background: linear-gradient(135deg,#7c3aed,#4f46e5);
          border-color: transparent; color: #fff;
          box-shadow: 0 0 18px rgba(124,58,237,0.3);
        }
        .cl-topbar-btn.primary:hover { opacity: 0.9; }

        .cl-content { flex: 1; padding: 28px 32px; }

        /* ambient glow */
        .cl-glow {
          position: fixed; top: -160px; left: 60px;
          width: 500px; height: 500px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%);
        }

        @media (max-width: 768px) {
          .cl-main { margin-left: 0; }
          .cl-topbar { padding: 0 16px; }
          .cl-content { padding: 20px 16px; }
        }
      `}</style>

      <div className="cl-glow" aria-hidden="true" />
      <div className="cl-shell">
        <CompaniesSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

        <div className="cl-main">
          {/* Topbar */}
          <header className="cl-topbar">
            <div className="cl-topbar-left">
              <h1>{title}</h1>
            </div>
            <div className="cl-topbar-right">
              <Link href="/companies/campaigns/new" className="cl-topbar-btn primary">
                + New campaign
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="cl-content">{children}</main>
        </div>
      </div>
    </>
  );
}