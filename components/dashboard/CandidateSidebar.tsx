"use client";

// components/dashboard/CandidateSidebar.tsx

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions, useAuthState } from "@/lib/hooks/useAuth";

interface Props {
  collapsed: boolean;
  onToggle:  () => void;
}

const NAV = [
  { href: "/dashboard",          icon: "⊞",  label: "Dashboard" },
  { href: "/dashboard/practice", icon: "🎙", label: "Practice"  },
  { href: "/dashboard/feedback", icon: "📊", label: "Feedback"  },
];

export default function CandidateSidebar({ collapsed, onToggle }: Props) {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user }    = useAuthState();
  const { signOut } = useAuthActions();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  async function handleSignOut() {
    await signOut();
    // replace so they can't go back
    router.replace("/get-started");
  }

  return (
    <>
      {/* All static styles — no JS template literals */}
      <style>{`
        .csb {
          min-height: 100vh; flex-shrink: 0;
          background: rgba(7,7,18,0.97);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          transition: width 0.22s ease;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 40;
          overflow: hidden;
        }

        /* ── top ── */
        .csb-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 14px 16px; min-height: 62px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 8px;
        }
        .csb-logo {
          font-family: var(--font-syne), sans-serif;
          font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; text-decoration: none; white-space: nowrap;
          transition: opacity 0.15s;
        }
        .csb-toggle {
          width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #4f4e6a;
          transition: background 0.2s, color 0.2s;
        }
        .csb-toggle:hover { background: rgba(255,255,255,0.09); color: #fff; }

        /* ── nav ── */
        .csb-nav {
          flex: 1; padding: 10px 8px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .csb-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 10px; border-radius: 9px;
          font-size: 13px; font-weight: 400; color: #8b8aa6;
          text-decoration: none; white-space: nowrap;
          transition: background 0.18s, color 0.18s;
          position: relative;
        }
        .csb-link:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .csb-link.active {
          background: rgba(124,58,237,0.13); color: #c4b5fd;
          border: 1px solid rgba(124,58,237,0.2);
        }
        .csb-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; line-height: 1; }
        .csb-label { white-space: nowrap; transition: opacity 0.15s; }

        /* tooltip for collapsed state */
        .csb-tip {
          position: absolute; left: 52px; top: 50%; transform: translateY(-50%);
          background: rgba(12,12,30,0.97); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px; padding: 5px 11px;
          font-size: 12px; color: #fff; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.12s;
          z-index: 100;
        }
        .csb-link:hover .csb-tip { opacity: 1; }

        /* ── logout button (full row) ── */
        .csb-logout-row {
          margin: 8px; border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(239,68,68,0.15);
        }
        .csb-logout-btn {
          width: 100%; display: flex; align-items: center; gap: 11px;
          padding: 10px 10px; cursor: pointer;
          background: rgba(239,68,68,0.06);
          border: none; color: #f87171;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 13px; font-weight: 400;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
        }
        .csb-logout-btn:hover { background: rgba(239,68,68,0.14); color: #fca5a5; }
        .csb-logout-icon { font-size: 15px; flex-shrink: 0; width: 20px; text-align: center; }
        .csb-logout-label { transition: opacity 0.15s; }

        /* ── user row ── */
        .csb-user {
          padding: 12px 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 9px;
        }
        .csb-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
        }
        .csb-user-info { flex: 1; min-width: 0; transition: opacity 0.15s; }
        .csb-uname {
          font-size: 12px; font-weight: 500; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .csb-urole {
          font-size: 10px; color: #4f4e6a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
      `}</style>

      <aside
        className="csb"
        style={{ width: collapsed ? 68 : 224 }}
      >
        {/* ── Top: logo + collapse toggle ── */}
        <div className="csb-top">
          <Link
            href="/"
            className="csb-logo"
            style={{ opacity: collapsed ? 0 : 1, pointerEvents: collapsed ? "none" : "auto" }}
          >
            Nervo
          </Link>
          <button className="csb-toggle" onClick={onToggle}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* ── Nav links ── */}
        <nav className="csb-nav">
          {NAV.map(n => {
            const active = pathname === n.href
              || (n.href !== "/dashboard" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`csb-link ${active ? "active" : ""}`}
              >
                <span className="csb-icon">{n.icon}</span>
                <span
                  className="csb-label"
                  style={{ opacity: collapsed ? 0 : 1 }}
                >
                  {n.label}
                </span>
                {/* Tooltip — only useful when collapsed */}
                {collapsed && <span className="csb-tip">{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* ── Sign out button ── */}
        <div className="csb-logout-row">
          <button className="csb-logout-btn" onClick={handleSignOut}>
            <span className="csb-logout-icon">🚪</span>
            <span
              className="csb-logout-label"
              style={{ opacity: collapsed ? 0 : 1 }}
            >
              Sign out
            </span>
          </button>
        </div>

        {/* ── User info row ── */}
        <div className="csb-user">
          <div className="csb-avatar">{initials}</div>
          <div
            className="csb-user-info"
            style={{ opacity: collapsed ? 0 : 1 }}
          >
            <div className="csb-uname">
              {user?.displayName || user?.email || "Candidate"}
            </div>
            <div className="csb-urole">Candidate account</div>
          </div>
        </div>
      </aside>
    </>
  );
}