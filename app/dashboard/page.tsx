"use client";

// app/dashboard/page.tsx

import Link from "next/link";
import { useState } from "react";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import {
  useCandidateProfile,
  usePracticeSessions,
  useDashboardStats,
} from "@/lib/hooks/useCandidateData";

// ── Shared stat card ─────────────────────────────────────
function StatCard({
  icon, num, label, delta, deltaType = "up", accent = "purple",
}: {
  icon: string; num: string | number; label: string;
  delta?: string; deltaType?: "up" | "neu"; accent?: string;
}) {
  const colors: Record<string, string> = {
    purple: "linear-gradient(90deg,#7c3aed,#4f46e5)",
    blue:   "linear-gradient(90deg,#0891b2,#4f46e5)",
    green:  "linear-gradient(90deg,#059669,#0891b2)",
    pink:   "linear-gradient(90deg,#a21caf,#7c3aed)",
  };
  return (
    <div className="db-stat-card">
      <div className="db-stat-top" style={{ background: colors[accent] }} />
      <div className="db-stat-icon">{icon}</div>
      <div className="db-stat-num">{num}</div>
      <div className="db-stat-lbl">{label}</div>
      {delta && (
        <div className={`db-stat-delta ${deltaType === "up" ? "delta-up" : "delta-neu"}`}>
          {delta}
        </div>
      )}
    </div>
  );
}

// ── Score color helper ────────────────────────────────────
function scoreColor(v: number) {
  return v >= 80 ? "#4ade80" : v >= 70 ? "#fbbf24" : "#f87171";
}
function avg(s: { tech: number; comm: number; conf: number; prob: number }) {
  return Math.round((s.tech + s.comm + s.conf + s.prob) / 4);
}

// ── Empty state ───────────────────────────────────────────
function EmptySessions() {
  return (
    <div className="db-empty">
      <div className="db-empty-icon">🎙</div>
      <h3>No interviews yet</h3>
      <p>Start your first AI voice interview and your results will appear here.</p>
      <Link href="/dashboard/practice" className="db-btn-primary">
        Start first interview →
      </Link>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function DashboardPage() {
  const { profile, loading: profileLoading } = useCandidateProfile();
  const { sessions, loading: sessionsLoading } = usePracticeSessions(5);
  const stats = useDashboardStats(sessions);
  const [collapsed, setCollapsed] = useState(false);

  const loading = profileLoading || sessionsLoading;

  const firstName = profile?.name?.split(" ")[0] ?? "there";

  // Hour of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display: "flex" }}>
      <CandidateSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div style={{ flex: 1, marginLeft: collapsed ? 68 : 224, transition: "margin-left 0.22s ease" }}>

      <style>{`
        /* ── stat cards ── */
        .db-stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 26px; }
        .db-stat-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 20px 22px; position: relative; overflow: hidden;
        }
        .db-stat-top { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
        .db-stat-icon { font-size: 18px; margin-bottom: 10px; opacity: 0.7; }
        .db-stat-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 26px; font-weight: 800; letter-spacing: -1px; color: #fff; margin-bottom: 3px;
        }
        .db-stat-lbl { font-size: 11px; font-weight: 300; color: #4f4e6a; }
        .db-stat-delta {
          position: absolute; top: 16px; right: 14px;
          font-size: 10px; font-weight: 500; padding: 3px 8px; border-radius: 999px;
        }
        .delta-up  { background: rgba(74,222,128,0.1);  color: #4ade80; }
        .delta-neu { background: rgba(255,255,255,0.06); color: #4f4e6a; }

        /* ── welcome banner ── */
        .db-welcome {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 22px 26px; border-radius: 18px; margin-bottom: 24px;
          background: linear-gradient(135deg, rgba(124,58,237,0.11), rgba(59,130,246,0.06));
          border: 1px solid rgba(124,58,237,0.2);
        }
        .db-welcome h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; letter-spacing: -0.2px;
        }
        .db-welcome p { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }
        .db-btn-primary {
          display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
          padding: 11px 22px; border-radius: 9px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff;
          font-family: var(--font-dm-sans), sans-serif; font-size: 13px; font-weight: 500;
          text-decoration: none; box-shadow: 0 0 20px rgba(124,58,237,0.3);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .db-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 32px rgba(124,58,237,0.5); }

        /* ── two-col layout ── */
        .db-cols { display: grid; grid-template-columns: 1fr 300px; gap: 18px; }

        /* ── sessions card ── */
        .db-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }
        .db-card-hd {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .db-card-hd h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .db-card-hd a { font-size: 12px; color: #7c3aed; text-decoration: none; transition: color 0.2s; }
        .db-card-hd a:hover { color: #a78bfa; }

        .db-session-row {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 20px; border-bottom: 1px solid rgba(255,255,255,0.04);
          text-decoration: none; transition: background 0.14s; cursor: pointer;
        }
        .db-session-row:last-child { border-bottom: none; }
        .db-session-row:hover { background: rgba(255,255,255,0.025); }
        .db-session-icon {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
          background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.2);
        }
        .db-session-info { flex: 1; min-width: 0; }
        .db-session-role { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .db-session-meta { font-size: 11px; color: #4f4e6a; }
        .db-session-score {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px; font-weight: 800; flex-shrink: 0;
        }
        .db-session-arrow { font-size: 12px; color: #4f4e6a; flex-shrink: 0; }

        /* ── score bars ── */
        .db-score-bars { display: flex; flex-direction: column; gap: 12px; padding: 18px 20px; }
        .db-bar-item { display: flex; flex-direction: column; gap: 4px; }
        .db-bar-top { display: flex; justify-content: space-between; }
        .db-bar-name { font-size: 12px; color: #8b8aa6; }
        .db-bar-val  { font-size: 12px; font-weight: 600; color: #fff; }
        .db-bar-track { height: 5px; background: rgba(255,255,255,0.07); border-radius: 999px; overflow: hidden; }
        .db-bar-fill  { height: 100%; border-radius: 999px; transition: width 0.8s ease; }

        /* ── streak ── */
        .db-streak-wrap { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.05); }
        .db-streak-label { font-size: 11px; color: #4f4e6a; margin-bottom: 8px; }
        .db-streak-days { display: flex; gap: 5px; }
        .db-streak-day {
          flex: 1; height: 30px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
        }
        .sd-done   { background: rgba(124,58,237,0.25); color: #c4b5fd; border: 1px solid rgba(124,58,237,0.3); }
        .sd-today  { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; }
        .sd-future { background: rgba(255,255,255,0.04); color: #2a2a3d; border: 1px solid rgba(255,255,255,0.06); }

        /* ── tips ── */
        .db-tips { display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; }
        .db-tip {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 11px 13px; border-radius: 10px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
        }
        .db-tip-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
        .db-tip h4 { font-size: 12px; font-weight: 500; color: #fff; margin-bottom: 2px; }
        .db-tip p  { font-size: 11px; font-weight: 300; color: #4f4e6a; line-height: 1.5; }

        /* ── empty ── */
        .db-empty {
          text-align: center; padding: 52px 24px;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.08); border-radius: 16px;
        }
        .db-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.5; }
        .db-empty h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;
        }
        .db-empty p { font-size: 13px; color: #4f4e6a; margin-bottom: 20px; line-height: 1.6; }

        /* ── skeleton ── */
        .db-skeleton {
          background: linear-gradient(90deg,
            rgba(255,255,255,0.04) 25%,
            rgba(255,255,255,0.08) 50%,
            rgba(255,255,255,0.04) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .anim-1 { animation: fadeUp 0.4s 0.00s ease both; }
        .anim-2 { animation: fadeUp 0.4s 0.07s ease both; }
        .anim-3 { animation: fadeUp 0.4s 0.14s ease both; }

        @media (max-width: 900px) {
          .db-stat-grid { grid-template-columns: 1fr 1fr; }
          .db-cols      { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Welcome banner ── */}
      <div>
        <div className="db-welcome anim-1">
          <div>
            <h2>
              {loading ? "Loading…" : `${greeting}, ${firstName} 👋`}
            </h2>
            <p>
              {stats.totalSessions === 0
                ? "Start your first AI interview to begin tracking your progress."
                : `You've completed ${stats.totalSessions} interview${stats.totalSessions !== 1 ? "s" : ""}. Keep the streak going.`
              }
            </p>
          </div>
          <Link href="/dashboard/practice" className="db-btn-primary">
            🎙 New interview
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="db-stat-grid anim-2">
          <StatCard
            icon="🎙" num={loading ? "—" : stats.totalSessions}
            label="Interviews done"
            delta={stats.totalSessions > 0 ? "total" : undefined}
            deltaType="neu" accent="purple"
          />
          <StatCard
            icon="📈" num={loading ? "—" : stats.avgScore || "—"}
            label="Avg. overall score"
            delta={stats.avgScore > 0 ? "out of 100" : undefined}
            deltaType="neu" accent="blue"
          />
          <StatCard
            icon="⏱" num={loading ? "—" : stats.totalMinutes > 0 ? `${stats.totalMinutes}m` : "—"}
            label="Total practice time"
            accent="green"
          />
          <StatCard
            icon="🔥" num={loading ? "—" : stats.streak || 0}
            label="Day streak"
            delta={stats.streak > 0 ? "Keep it up!" : undefined}
            deltaType="up" accent="pink"
          />
        </div>

        {/* ── Two column ── */}
        <div className="db-cols anim-3">

          {/* Recent sessions */}
          <div className="db-card">
            <div className="db-card-hd">
              <h3>Recent sessions</h3>
              <Link href="/dashboard/feedback">View all →</Link>
            </div>

            {loading ? (
              // Skeleton rows
              <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="db-skeleton" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div className="db-skeleton" style={{ height: 13, width: "60%" }} />
                      <div className="db-skeleton" style={{ height: 10, width: "40%" }} />
                    </div>
                    <div className="db-skeleton" style={{ width: 32, height: 20 }} />
                  </div>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div style={{ padding: "16px 20px" }}>
                <EmptySessions />
              </div>
            ) : (
              sessions.map(s => {
                const score = avg(s.scores);
                return (
                  <Link href="/dashboard/feedback" className="db-session-row" key={s.id}>
                    <div className="db-session-icon">🎙</div>
                    <div className="db-session-info">
                      <div className="db-session-role">{s.role}</div>
                      <div className="db-session-meta">{s.interviewType} · {s.date} · {s.duration}</div>
                    </div>
                    <div className="db-session-score" style={{ color: scoreColor(score) }}>{score}</div>
                    <span className="db-session-arrow">→</span>
                  </Link>
                );
              })
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Score averages */}
            <div className="db-card">
              <div className="db-card-hd"><h3>Average scores</h3></div>
              {loading ? (
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div className="db-skeleton" style={{ height: 11, width: "50%" }} />
                      <div className="db-skeleton" style={{ height: 5, width: "100%", borderRadius: 999 }} />
                    </div>
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, color: "#4f4e6a", textAlign: "center", padding: "12px 0" }}>
                    Complete an interview to see your scores.
                  </p>
                </div>
              ) : (
                <div className="db-score-bars">
                  {(() => {
                    const n = sessions.length;
                    const t = Math.round(sessions.reduce((s, x) => s + x.scores.tech, 0) / n);
                    const c = Math.round(sessions.reduce((s, x) => s + x.scores.comm, 0) / n);
                    const f = Math.round(sessions.reduce((s, x) => s + x.scores.conf, 0) / n);
                    const p = Math.round(sessions.reduce((s, x) => s + x.scores.prob, 0) / n);
                    return [
                      { name: "Technical",       val: t, color: "#818cf8" },
                      { name: "Communication",   val: c, color: "#38bdf8" },
                      { name: "Confidence",      val: f, color: "#a78bfa" },
                      { name: "Problem solving", val: p, color: "#c084fc" },
                    ].map(b => (
                      <div className="db-bar-item" key={b.name}>
                        <div className="db-bar-top">
                          <span className="db-bar-name">{b.name}</span>
                          <span className="db-bar-val">{b.val}%</span>
                        </div>
                        <div className="db-bar-track">
                          <div className="db-bar-fill" style={{ width: `${b.val}%`, background: b.color }} />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* Weekly streak */}
              <div className="db-streak-wrap">
                <div className="db-streak-label">This week</div>
                <div className="db-streak-days">
                  {["M","T","W","T","F","S","S"].map((d, i) => {
                    const cls = i < stats.streak
                      ? "sd-done"
                      : i === stats.streak
                      ? "sd-today"
                      : "sd-future";
                    return <div key={i} className={`db-streak-day ${cls}`}>{d}</div>;
                  })}
                </div>
              </div>
            </div>

            {/* Focus tips */}
            <div className="db-card">
              <div className="db-card-hd"><h3>Focus for next session</h3></div>
              <div className="db-tips">
                {[
                  { icon: "🎯", title: "Lead with the outcome", body: "Start every answer with the result, then explain how you got there." },
                  { icon: "📏", title: "Quantify your impact",  body: "Add numbers wherever you can — percentages, time saved, team size." },
                  { icon: "🤝", title: "Show collaboration",    body: "Mention how you brought others in, not just what you did alone." },
                ].map(t => (
                  <div className="db-tip" key={t.title}>
                    <span className="db-tip-icon">{t.icon}</span>
                    <div><h4>{t.title}</h4><p>{t.body}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}