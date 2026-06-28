"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ─── Shared sidebar layout ─────────────────────────────────
export function CandidateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const nav = [
    { href: "/dashboard",          icon: "⊞",  label: "Dashboard"  },
    { href: "/dashboard/practice", icon: "🎙", label: "Practice"   },
    { href: "/dashboard/feedback", icon: "📊", label: "Feedback"   },
  ];

  const user = { name: "Alex Johnson", role: "Senior Product Designer", avatar: "AJ" };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #05050f; color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
          -webkit-font-smoothing: antialiased; min-height: 100vh;
        }

        /* ── Shell ── */
        .shell { display: flex; min-height: 100vh; }

        /* ── Sidebar ── */
        .sidebar {
          width: ${collapsed ? "72px" : "230px"};
          min-height: 100vh; flex-shrink: 0;
          background: rgba(8,8,20,0.95);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          transition: width 0.25s ease;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 40;
          overflow: hidden;
        }

        /* top logo row */
        .sb-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 18px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          min-height: 66px;
        }
        .sb-logo {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; text-decoration: none;
          white-space: nowrap; opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.15s;
        }
        .sb-collapse {
          width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #4f4e6a;
          transition: background 0.2s, color 0.2s;
          margin-left: ${collapsed ? "auto" : "0"};
        }
        .sb-collapse:hover { background: rgba(255,255,255,0.09); color: #fff; }

        /* nav links */
        .sb-nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 3px; }
        .sb-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 10px; border-radius: 10px;
          font-size: 13px; font-weight: 400; color: #8b8aa6;
          text-decoration: none; white-space: nowrap;
          transition: background 0.2s, color 0.2s;
          position: relative;
        }
        .sb-link:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .sb-link.active {
          background: rgba(124,58,237,0.14);
          color: #c4b5fd; border: 1px solid rgba(124,58,237,0.2);
        }
        .sb-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
        .sb-label { opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s; }

        /* tooltip when collapsed */
        .sb-link:hover .sb-tooltip {
          opacity: 1; pointer-events: auto;
        }
        .sb-tooltip {
          position: absolute; left: 56px; top: 50%; transform: translateY(-50%);
          background: rgba(15,15,35,0.95); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 6px 12px;
          font-size: 12px; color: #fff; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.15s;
          display: ${collapsed ? "block" : "none"};
        }

        /* upgrade banner */
        .sb-upgrade {
          margin: 10px; padding: 14px;
          background: linear-gradient(135deg, rgba(124,58,237,0.14), rgba(59,130,246,0.08));
          border: 1px solid rgba(124,58,237,0.2); border-radius: 12px;
          display: ${collapsed ? "none" : "block"};
        }
        .sb-upgrade p {
          font-size: 11px; font-weight: 300; color: #8b8aa6;
          line-height: 1.55; margin-bottom: 10px;
        }
        .sb-upgrade p strong { color: #c4b5fd; font-weight: 500; }
        .sb-upgrade a {
          display: block; text-align: center; padding: 8px;
          border-radius: 8px; font-size: 12px; font-weight: 500;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; text-decoration: none;
          transition: opacity 0.2s;
        }
        .sb-upgrade a:hover { opacity: 0.85; }

        /* user row at bottom */
        .sb-user {
          padding: 14px 12px; border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 10px; cursor: pointer;
        }
        .sb-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff;
        }
        .sb-user-info { min-width: 0; opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s; }
        .sb-user-name { font-size: 12px; font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-user-role { font-size: 11px; color: #4f4e6a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* ── Main content ── */
        .main {
          flex: 1;
          margin-left: ${collapsed ? "72px" : "230px"};
          transition: margin-left 0.25s ease;
          min-height: 100vh;
        }

        /* top bar */
        .topbar {
          position: sticky; top: 0; z-index: 30;
          background: rgba(5,5,15,0.85); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 0 36px;
          height: 60px; display: flex; align-items: center; justify-content: space-between;
        }
        .topbar-left h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .topbar-left span { font-size: 12px; color: #4f4e6a; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .topbar-btn {
          padding: 7px 16px; border-radius: 8px;
          font-size: 12px; font-weight: 500; color: #c4b5fd;
          border: 1px solid rgba(124,58,237,0.35);
          background: transparent; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
          text-decoration: none; transition: background 0.2s;
        }
        .topbar-btn:hover { background: rgba(124,58,237,0.12); }

        /* content area */
        .content { padding: 32px 36px; }

        /* glows */
        .glow-tl {
          position: fixed; top: -180px; left: -180px;
          width: 500px; height: 500px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
        }

        @media (max-width: 768px) {
          .sidebar { width: 0; border: none; }
          .main { margin-left: 0; }
          .topbar { padding: 0 20px; }
          .content { padding: 24px 20px; }
        }
      `}</style>

      <div className="glow-tl" aria-hidden="true" />

      <div className="shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sb-top">
            {!collapsed && <Link href="/" className="sb-logo">Nervo</Link>}
            <button className="sb-collapse" onClick={() => setCollapsed(c => !c)}>
              {collapsed ? "→" : "←"}
            </button>
          </div>

          <nav className="sb-nav">
            {nav.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`sb-link ${pathname === n.href ? "active" : ""}`}
              >
                <span className="sb-icon">{n.icon}</span>
                <span className="sb-label">{n.label}</span>
                <span className="sb-tooltip">{n.label}</span>
              </Link>
            ))}
          </nav>

          <div className="sb-upgrade">
            <p>You're on the <strong>Free plan</strong>. Unlock unlimited interviews and full reports.</p>
            <Link href="/get-started?upgrade=1">Upgrade free →</Link>
          </div>

          <div className="sb-user">
            <div className="sb-avatar">{user.avatar}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{user.name}</div>
              <div className="sb-user-role">{user.role}</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h1>{nav.find(n => n.href === pathname)?.label ?? "Dashboard"}</h1>
            </div>
            <div className="topbar-right">
              <Link href="/dashboard/practice" className="topbar-btn">+ New interview</Link>
            </div>
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
//  DASHBOARD PAGE
// ═══════════════════════════════════════════════
const sessions = [
  { role: "Senior Product Designer", type: "General",    date: "Today, 2:14 pm",    scores: { tech: 78, comm: 85, conf: 72, prob: 80 }, duration: "11 min" },
  { role: "UX Lead",                 type: "Behavioural", date: "Yesterday, 10:08 am", scores: { tech: 82, comm: 79, conf: 88, prob: 74 }, duration: "09 min" },
  { role: "Product Manager",         type: "Technical",   date: "3 days ago",          scores: { tech: 65, comm: 90, conf: 70, prob: 77 }, duration: "13 min" },
];

function avg(s: typeof sessions[0]["scores"]) {
  return Math.round((s.tech + s.comm + s.conf + s.prob) / 4);
}

export default function DashboardPage() {
  return (
    <>
      <style>{`
        /* ── Shared card styles (dashboard scope) ── */
        .dash-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 28px; }
        .stat-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 20px 22px; position: relative; overflow: hidden;
        }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
        }
        .sc-purple::before { background: linear-gradient(90deg,#7c3aed,#4f46e5); }
        .sc-blue::before   { background: linear-gradient(90deg,#0891b2,#4f46e5); }
        .sc-green::before  { background: linear-gradient(90deg,#059669,#0891b2); }
        .sc-pink::before   { background: linear-gradient(90deg,#a21caf,#7c3aed); }
        .stat-icon { font-size: 20px; margin-bottom: 12px; opacity: 0.7; }
        .stat-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 28px; font-weight: 800; letter-spacing: -1px; color: #fff;
          margin-bottom: 4px;
        }
        .stat-label { font-size: 12px; font-weight: 300; color: #4f4e6a; }
        .stat-delta {
          position: absolute; top: 18px; right: 18px;
          font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: 999px;
        }
        .delta-up   { background: rgba(74,222,128,0.1); color: #4ade80; }
        .delta-down { background: rgba(251,191,36,0.1); color: #fbbf24; }

        /* ── Section header ── */
        .section-hd {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .section-hd h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .section-hd a {
          font-size: 12px; font-weight: 400; color: #7c3aed; text-decoration: none;
          transition: color 0.2s;
        }
        .section-hd a:hover { color: #a78bfa; }

        /* ── Recent sessions ── */
        .sessions-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .session-row {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px; border-radius: 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none; transition: background 0.2s, border-color 0.2s;
        }
        .session-row:hover { background: rgba(255,255,255,0.06); border-color: rgba(124,58,237,0.3); }
        .session-icon {
          width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.2);
        }
        .session-info { flex: 1; min-width: 0; }
        .session-role { font-size: 14px; font-weight: 500; color: #fff; margin-bottom: 3px; }
        .session-meta { font-size: 12px; font-weight: 300; color: #4f4e6a; }
        .session-meta span { color: #6d5acf; margin: 0 4px; }
        .session-scores { display: flex; gap: 8px; flex-shrink: 0; align-items: center; }
        .mini-score {
          font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px;
        }
        .ms-high { background: rgba(74,222,128,0.1);  color: #4ade80; }
        .ms-mid  { background: rgba(251,191,36,0.1);  color: #fbbf24; }
        .ms-low  { background: rgba(239,68,68,0.1);   color: #f87171; }
        .session-arrow { color: #4f4e6a; font-size: 14px; flex-shrink: 0; }

        /* ── Two column lower ── */
        .lower-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .panel-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 22px;
        }
        .panel-card h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 14px; font-weight: 700; color: #fff;
          margin-bottom: 18px; letter-spacing: -0.2px;
        }

        /* score trend bars */
        .trend-rows { display: flex; flex-direction: column; gap: 13px; }
        .trend-row { display: flex; flex-direction: column; gap: 5px; }
        .trend-top { display: flex; justify-content: space-between; }
        .trend-name { font-size: 12px; color: #8b8aa6; }
        .trend-val  { font-size: 12px; font-weight: 600; color: #fff; }
        .trend-track { height: 5px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; }
        .trend-fill  { height: 100%; border-radius: 999px; transition: width 1s ease; }

        /* upcoming tips */
        .tip-list { display: flex; flex-direction: column; gap: 11px; }
        .tip-item {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 12px 14px; border-radius: 11px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
        }
        .tip-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .tip-text h4 { font-size: 12px; font-weight: 500; color: #fff; margin-bottom: 2px; }
        .tip-text p  { font-size: 11px; font-weight: 300; color: #4f4e6a; line-height: 1.5; }

        /* start CTA */
        .start-cta {
          margin-bottom: 28px; padding: 28px 30px;
          background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.07));
          border: 1px solid rgba(124,58,237,0.22); border-radius: 18px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
        }
        .start-cta-text h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 5px; letter-spacing: -0.2px;
        }
        .start-cta-text p { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }
        .btn-cta {
          display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
          padding: 12px 24px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 500; text-decoration: none;
          box-shadow: 0 0 24px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-cta:hover { transform: translateY(-1px); box-shadow: 0 0 36px rgba(124,58,237,0.5); }

        /* streak */
        .streak-wrap { display: flex; gap: 6px; margin-bottom: 8px; }
        .streak-day {
          flex: 1; height: 32px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 500;
        }
        .streak-done   { background: rgba(124,58,237,0.25); color: #c4b5fd; border: 1px solid rgba(124,58,237,0.3); }
        .streak-today  { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; }
        .streak-future { background: rgba(255,255,255,0.04); color: #2a2a3d; border: 1px solid rgba(255,255,255,0.06); }
        .streak-label  { font-size: 11px; color: #4f4e6a; text-align: center; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        @media (max-width: 900px) {
          .dash-grid  { grid-template-columns: 1fr 1fr; }
          .lower-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
          .dash-grid { grid-template-columns: 1fr 1fr; }
          .session-scores { display: none; }
        }
      `}</style>

      {/* ── Welcome ── */}
      <div className="start-cta" style={{ animation: "fadeUp 0.4s ease both" }}>
        <div className="start-cta-text">
          <h3>Ready for your next practice interview?</h3>
          <p>Keep your streak going — a 10-minute session is enough to sharpen your answers.</p>
        </div>
        <Link href="/dashboard/practice" className="btn-cta">
          🎙 Start interview
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="dash-grid" style={{ animation: "fadeUp 0.45s 0.05s ease both" }}>
        {[
          { icon: "🎙", num: "3",   label: "Interviews done",   delta: "+1 this week", cls: "sc-purple delta-up"   },
          { icon: "📈", num: "79",  label: "Avg. overall score", delta: "+4 pts",       cls: "sc-blue delta-up"     },
          { icon: "⏱",  num: "33m", label: "Total practice",    delta: null,            cls: "sc-green"             },
          { icon: "🔥", num: "3",   label: "Day streak",        delta: "Keep it up!",   cls: "sc-pink delta-up"     },
        ].map(s => (
          <div className={`stat-card ${s.cls.split(" ")[0]}`} key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
            {s.delta && (
              <div className={`stat-delta ${s.cls.split(" ")[1] ?? "delta-up"}`}>{s.delta}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Recent sessions ── */}
      <div style={{ animation: "fadeUp 0.45s 0.1s ease both" }}>
        <div className="section-hd">
          <h2>Recent sessions</h2>
          <Link href="/dashboard/feedback">View all feedback →</Link>
        </div>

        <div className="sessions-list">
          {sessions.map((s, i) => {
            const score = avg(s.scores);
            const cls = score >= 80 ? "ms-high" : score >= 70 ? "ms-mid" : "ms-low";
            return (
              <Link href="/dashboard/feedback" className="session-row" key={i}>
                <div className="session-icon">🎙</div>
                <div className="session-info">
                  <div className="session-role">{s.role}</div>
                  <div className="session-meta">
                    {s.type}<span>·</span>{s.date}<span>·</span>{s.duration}
                  </div>
                </div>
                <div className="session-scores">
                  <span className={`mini-score ${cls}`}>{score}%</span>
                </div>
                <span className="session-arrow">→</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Lower panels ── */}
      <div className="lower-grid" style={{ animation: "fadeUp 0.45s 0.15s ease both" }}>

        {/* Score breakdown */}
        <div className="panel-card">
          <h3>Average scores</h3>
          <div className="trend-rows">
            {[
              { name: "Technical",       val: 75, color: "#818cf8" },
              { name: "Communication",   val: 85, color: "#38bdf8" },
              { name: "Confidence",      val: 77, color: "#a78bfa" },
              { name: "Problem solving", val: 77, color: "#c084fc" },
            ].map(t => (
              <div className="trend-row" key={t.name}>
                <div className="trend-top">
                  <span className="trend-name">{t.name}</span>
                  <span className="trend-val">{t.val}%</span>
                </div>
                <div className="trend-track">
                  <div className="trend-fill" style={{ width: `${t.val}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* weekly streak */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, color: "#4f4e6a", marginBottom: 8 }}>This week</div>
            <div className="streak-wrap">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div
                  key={i}
                  className={`streak-day ${i < 3 ? "streak-done" : i === 3 ? "streak-today" : "streak-future"}`}
                >{d}</div>
              ))}
            </div>
            <div className="streak-label">3-day streak 🔥 — keep going!</div>
          </div>
        </div>

        {/* Tips */}
        <div className="panel-card">
          <h3>Focus areas for next session</h3>
          <div className="tip-list">
            {[
              { icon: "🎯", title: "Lead with the outcome",      body: "Start every answer with the result, then explain how you got there." },
              { icon: "📏", title: "Quantify your impact",       body: "Add numbers wherever you can — percentages, time saved, team size." },
              { icon: "🤝", title: "Show team collaboration",    body: "Mention how you brought others in, not just what you did alone." },
              { icon: "🧠", title: "Practice STAR format",       body: "Situation → Task → Action → Result. Keep each part concise." },
            ].map(t => (
              <div className="tip-item" key={t.title}>
                <div className="tip-icon">{t.icon}</div>
                <div className="tip-text"><h4>{t.title}</h4><p>{t.body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}