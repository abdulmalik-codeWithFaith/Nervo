"use client";

// ─────────────────────────────────────────────────────────
//  Shared UI primitives used across all companies pages
// ─────────────────────────────────────────────────────────

import Link from "next/link";

/* ── Style tokens injected once ── */
export function CompaniesStyles() {
  return (
    <style>{`
      /* ── Cards ── */
      .card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 16px; padding: 22px;
      }
      .card-sm { border-radius: 12px; padding: 16px 18px; }
      .card-hover {
        transition: background 0.2s, border-color 0.2s, transform 0.2s;
        cursor: pointer;
      }
      .card-hover:hover {
        background: rgba(255,255,255,0.055);
        border-color: rgba(124,58,237,0.28);
        transform: translateY(-1px);
      }

      /* ── Stat card ── */
      .stat-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 16px; padding: 20px 22px;
        position: relative; overflow: hidden;
      }
      .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
      .stat-purple::before { background: linear-gradient(90deg,#7c3aed,#4f46e5); }
      .stat-blue::before   { background: linear-gradient(90deg,#0891b2,#4f46e5); }
      .stat-green::before  { background: linear-gradient(90deg,#059669,#0891b2); }
      .stat-amber::before  { background: linear-gradient(90deg,#d97706,#7c3aed); }
      .stat-icon { font-size: 18px; margin-bottom: 10px; opacity: 0.7; }
      .stat-num {
        font-family: var(--font-syne), sans-serif;
        font-size: 26px; font-weight: 800; letter-spacing: -1px; color: #fff; margin-bottom: 3px;
      }
      .stat-lbl { font-size: 11px; font-weight: 300; color: #4f4e6a; }
      .stat-delta {
        position: absolute; top: 16px; right: 16px;
        font-size: 10px; font-weight: 500; padding: 3px 8px; border-radius: 999px;
      }
      .delta-up   { background: rgba(74,222,128,0.1);  color: #4ade80; }
      .delta-down { background: rgba(251,191,36,0.1);  color: #fbbf24; }
      .delta-neu  { background: rgba(255,255,255,0.06); color: #4f4e6a; }

      /* ── Badge / pill ── */
      .badge-pill {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 3px 10px; border-radius: 999px;
        font-size: 11px; font-weight: 500; white-space: nowrap;
      }
      .pill-green  { background: rgba(74,222,128,0.1);  color: #4ade80;  border: 1px solid rgba(74,222,128,0.2);  }
      .pill-yellow { background: rgba(251,191,36,0.1);  color: #fbbf24;  border: 1px solid rgba(251,191,36,0.2);  }
      .pill-red    { background: rgba(239,68,68,0.1);   color: #f87171;  border: 1px solid rgba(239,68,68,0.2);   }
      .pill-purple { background: rgba(124,58,237,0.12); color: #c4b5fd;  border: 1px solid rgba(124,58,237,0.25); }
      .pill-blue   { background: rgba(8,145,178,0.12);  color: #38bdf8;  border: 1px solid rgba(8,145,178,0.22);  }
      .pill-gray   { background: rgba(255,255,255,0.05);color: #4f4e6a;  border: 1px solid rgba(255,255,255,0.08);}

      /* ── Section header ── */
      .sec-hd {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
      }
      .sec-hd h2 {
        font-family: var(--font-syne), sans-serif;
        font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
      }
      .sec-hd a, .sec-hd button {
        font-size: 12px; font-weight: 400; color: #7c3aed; text-decoration: none;
        background: none; border: none; cursor: pointer;
        transition: color 0.2s; font-family: var(--font-dm-sans), sans-serif;
      }
      .sec-hd a:hover, .sec-hd button:hover { color: #a78bfa; }

      /* ── Score bar ── */
      .score-bar-wrap { display: flex; flex-direction: column; gap: 10px; }
      .score-bar-item { display: flex; flex-direction: column; gap: 4px; }
      .score-bar-top  { display: flex; justify-content: space-between; }
      .score-bar-name { font-size: 12px; color: #8b8aa6; }
      .score-bar-val  { font-size: 12px; font-weight: 600; color: #fff; }
      .score-bar-track { height: 5px; background: rgba(255,255,255,0.07); border-radius: 999px; overflow: hidden; }
      .score-bar-fill  { height: 100%; border-radius: 999px; transition: width 0.8s ease; }

      /* ── Table ── */
      .data-table { width: 100%; border-collapse: collapse; }
      .data-table th {
        text-align: left; padding: 10px 14px;
        font-size: 10px; font-weight: 600; color: #4f4e6a;
        text-transform: uppercase; letter-spacing: 0.1em;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .data-table td {
        padding: 13px 14px;
        font-size: 13px; font-weight: 300; color: #8b8aa6;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        vertical-align: middle;
      }
      .data-table tr:last-child td { border-bottom: none; }
      .data-table tr { transition: background 0.15s; cursor: pointer; }
      .data-table tr:hover td { background: rgba(255,255,255,0.025); }
      .td-name { font-size: 13px; font-weight: 500; color: #fff; }

      /* ── Avatar ── */
      .avatar {
        width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 600; color: #fff;
      }

      /* ── Empty state ── */
      .empty-state {
        text-align: center; padding: 60px 24px;
        background: rgba(255,255,255,0.02);
        border: 1px dashed rgba(255,255,255,0.08);
        border-radius: 16px;
      }
      .empty-icon { font-size: 36px; margin-bottom: 14px; opacity: 0.5; }
      .empty-state h3 {
        font-family: var(--font-syne), sans-serif;
        font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;
      }
      .empty-state p { font-size: 13px; color: #4f4e6a; line-height: 1.6; margin-bottom: 20px; }

      /* ── Btn shared ── */
      .btn {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 10px 20px; border-radius: 9px; border: none; cursor: pointer;
        font-family: var(--font-dm-sans), sans-serif;
        font-size: 13px; font-weight: 500; text-decoration: none;
        transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
      }
      .btn-primary {
        background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff;
        box-shadow: 0 0 20px rgba(124,58,237,0.3);
      }
      .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 32px rgba(124,58,237,0.5); }
      .btn-outline {
        background: transparent; color: #c4b5fd;
        border: 1px solid rgba(124,58,237,0.35);
      }
      .btn-outline:hover { background: rgba(124,58,237,0.1); }
      .btn-ghost {
        background: rgba(255,255,255,0.05); color: #8b8aa6;
        border: 1px solid rgba(255,255,255,0.09);
      }
      .btn-ghost:hover { background: rgba(255,255,255,0.09); color: #fff; }

      /* ── Divider ── */
      .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 20px 0; }

      /* ── Animations ── */
      @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      .anim-1 { animation: fadeUp 0.4s 0.00s ease both; }
      .anim-2 { animation: fadeUp 0.4s 0.06s ease both; }
      .anim-3 { animation: fadeUp 0.4s 0.12s ease both; }
      .anim-4 { animation: fadeUp 0.4s 0.18s ease both; }
      .anim-5 { animation: fadeUp 0.4s 0.24s ease both; }
    `}</style>
  );
}

/* ── StatCard ── */
interface StatCardProps {
  icon: string; num: string; label: string;
  delta?: string; deltaType?: "up"|"down"|"neu"; colorClass?: string;
}
export function StatCard({ icon, num, label, delta, deltaType = "up", colorClass = "stat-purple" }: StatCardProps) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-num">{num}</div>
      <div className="stat-lbl">{label}</div>
      {delta && <div className={`stat-delta delta-${deltaType}`}>{delta}</div>}
    </div>
  );
}

/* ── Recommendation pill ── */
export function RecPill({ rec }: { rec: string }) {
  const map: Record<string, string> = {
    "Strong yes": "pill-green",
    "Yes":        "pill-blue",
    "Maybe":      "pill-yellow",
    "No":         "pill-red",
    "Pending":    "pill-gray",
  };
  return <span className={`badge-pill ${map[rec] ?? "pill-gray"}`}>{rec}</span>;
}

/* ── Score bar group ── */
interface ScoreBarProps { items: { name: string; val: number; color: string }[] }
export function ScoreBars({ items }: ScoreBarProps) {
  return (
    <div className="score-bar-wrap">
      {items.map(s => (
        <div className="score-bar-item" key={s.name}>
          <div className="score-bar-top">
            <span className="score-bar-name">{s.name}</span>
            <span className="score-bar-val">{s.val}%</span>
          </div>
          <div className="score-bar-track">
            <div className="score-bar-fill" style={{ width: `${s.val}%`, background: s.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Empty state ── */
interface EmptyProps { icon: string; title: string; body: string; action?: React.ReactNode }
export function EmptyState({ icon, title, body, action }: EmptyProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

/* ── Campaign status pill ── */
export function CampaignStatus({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Active":   "pill-green",
    "Draft":    "pill-gray",
    "Paused":   "pill-yellow",
    "Closed":   "pill-red",
  };
  return <span className={`badge-pill ${map[status] ?? "pill-gray"}`}>{status}</span>;
}