"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const NAV = [
  { href: "/companies",              icon: "⊞",  label: "Dashboard"   },
  { href: "/companies/campaigns",    icon: "📋", label: "Campaigns"   },
  { href: "/companies/candidates",   icon: "👥", label: "Candidates"  },
  { href: "/companies/settings",     icon: "⚙️", label: "Settings"    },
];

const USER = { name: "Sarah Chen", role: "Head of Talent", avatar: "SC" };

export default function CompaniesSidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .csb {
          width: ${collapsed ? "68px" : "224px"};
          min-height: 100vh; flex-shrink: 0;
          background: rgba(7,7,18,0.97);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          transition: width 0.22s ease;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 40;
          overflow: hidden;
        }

        /* top bar */
        .csb-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 16px 16px; min-height: 62px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .csb-logo {
          font-family: var(--font-syne), sans-serif;
          font-size: 19px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; text-decoration: none; white-space: nowrap;
          transition: opacity 0.15s;
          opacity: ${collapsed ? 0 : 1};
          pointer-events: ${collapsed ? "none" : "auto"};
        }
        .csb-toggle {
          width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #4f4e6a; margin-left: auto;
          transition: background 0.2s, color 0.2s;
        }
        .csb-toggle:hover { background: rgba(255,255,255,0.09); color: #fff; }

        /* section label */
        .csb-section-label {
          font-size: 9px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: #2a2a3d; padding: 16px 18px 6px;
          white-space: nowrap; overflow: hidden;
          transition: opacity 0.15s;
          opacity: ${collapsed ? 0 : 1};
        }

        /* nav */
        .csb-nav { flex: 1; padding: 10px 8px; display: flex; flex-direction: column; gap: 2px; }
        .csb-link {
          display: flex; align-items: center; gap: 11px;
          padding: 9px 10px; border-radius: 9px;
          font-size: 13px; font-weight: 400; color: #8b8aa6;
          text-decoration: none; white-space: nowrap;
          transition: background 0.18s, color 0.18s;
          position: relative; cursor: pointer;
        }
        .csb-link:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .csb-link.active {
          background: rgba(124,58,237,0.13);
          color: #c4b5fd;
          border: 1px solid rgba(124,58,237,0.2);
        }
        .csb-icon { font-size: 15px; flex-shrink: 0; width: 20px; text-align: center; line-height: 1; }
        .csb-label { transition: opacity 0.15s; opacity: ${collapsed ? 0 : 1}; }
        .csb-active-bar {
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 999px;
          background: linear-gradient(180deg, #7c3aed, #38bdf8);
        }

        /* tooltip */
        .csb-link:hover .csb-tip { opacity: 1; pointer-events: auto; }
        .csb-tip {
          position: absolute; left: 54px; top: 50%; transform: translateY(-50%);
          background: rgba(12,12,30,0.97); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px; padding: 5px 11px;
          font-size: 12px; color: #fff; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.12s;
          display: ${collapsed ? "block" : "none"};
          z-index: 100;
        }

        /* upgrade */
        .csb-upgrade {
          margin: 8px; padding: 14px 12px;
          background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.07));
          border: 1px solid rgba(124,58,237,0.2); border-radius: 11px;
          display: ${collapsed ? "none" : "block"};
        }
        .csb-upgrade p { font-size: 11px; font-weight: 300; color: #8b8aa6; line-height: 1.5; margin-bottom: 10px; }
        .csb-upgrade p strong { color: #c4b5fd; font-weight: 500; }
        .csb-upgrade a {
          display: block; text-align: center; padding: 7px;
          border-radius: 7px; font-size: 12px; font-weight: 500;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; text-decoration: none; transition: opacity 0.2s;
        }
        .csb-upgrade a:hover { opacity: 0.85; }

        /* user */
        .csb-user {
          padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 9px; cursor: pointer;
        }
        .csb-avatar {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #fff;
        }
        .csb-user-info { min-width: 0; transition: opacity 0.15s; opacity: ${collapsed ? 0 : 1}; }
        .csb-uname { font-size: 12px; font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .csb-urole { font-size: 10px; color: #4f4e6a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>

      <aside className="csb">
        <div className="csb-top">
          <Link href="/companies" className="csb-logo">Nervo</Link>
          <button className="csb-toggle" onClick={onToggle}>{collapsed ? "→" : "←"}</button>
        </div>

        <div className="csb-section-label">Main menu</div>

        <nav className="csb-nav">
          {NAV.map(n => {
            const active = pathname === n.href || (n.href !== "/companies" && pathname.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href} className={`csb-link ${active ? "active" : ""}`}>
                {active && <span className="csb-active-bar" />}
                <span className="csb-icon">{n.icon}</span>
                <span className="csb-label">{n.label}</span>
                <span className="csb-tip">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="csb-upgrade">
          <p>You're on the <strong>Starter plan</strong>. Upgrade for unlimited campaigns and email automation.</p>
          <Link href="/companies/settings?tab=billing">Upgrade plan →</Link>
        </div>

        <div className="csb-user">
          <div className="csb-avatar">{USER.avatar}</div>
          <div className="csb-user-info">
            <div className="csb-uname">{USER.name}</div>
            <div className="csb-urole">{USER.role}</div>
          </div>
        </div>
      </aside>
    </>
  );
}