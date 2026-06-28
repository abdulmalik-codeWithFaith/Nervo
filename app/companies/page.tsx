"use client";

import Link from "next/link";
import { CompaniesStyles, StatCard, RecPill, CampaignStatus } from "@/components/companies-ui";

// ── mock data ─────────────────────────────────────────────
const CAMPAIGNS = [
  { id: 1, title: "Senior Product Designer",  status: "Active", candidates: 14, shortlist: 3, daysLeft: 4 },
  { id: 2, title: "Backend Engineer (Node)",  status: "Active", candidates: 22, shortlist: 5, daysLeft: 2 },
  { id: 3, title: "Growth Marketer",          status: "Paused", candidates: 7,  shortlist: 0, daysLeft: 9 },
  { id: 4, title: "Product Manager",          status: "Closed", candidates: 31, shortlist: 4, daysLeft: 0 },
];

const RECENT_CANDIDATES = [
  { id: 1, name: "Aisha Okonkwo",  role: "Sr. Product Designer",  score: 92, culture: 91, rec: "Strong yes", avatar: "AO", bg: "linear-gradient(135deg,#7c3aed,#4f46e5)", time: "2 min ago"  },
  { id: 2, name: "Lucas Martins",  role: "Sr. Product Designer",  score: 88, culture: 84, rec: "Yes",        avatar: "LM", bg: "linear-gradient(135deg,#0891b2,#6366f1)", time: "18 min ago" },
  { id: 3, name: "Priya Rao",      role: "Backend Engineer",       score: 74, culture: 70, rec: "Maybe",      avatar: "PR", bg: "linear-gradient(135deg,#6d28d9,#a21caf)", time: "1 hr ago"   },
  { id: 4, name: "James Park",     role: "Backend Engineer",       score: 61, culture: 55, rec: "No",         avatar: "JP", bg: "linear-gradient(135deg,#374151,#6b7280)", time: "3 hrs ago"  },
];

export default function CompaniesDashboard() {
  return (
    <>
      <CompaniesStyles />
      <style>{`
        /* ── Dashboard-specific ── */
        .db-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 26px; }
        .db-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

        /* welcome */
        .db-welcome {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 24px 28px; border-radius: 18px; margin-bottom: 24px;
          background: linear-gradient(135deg, rgba(124,58,237,0.11), rgba(59,130,246,0.06));
          border: 1px solid rgba(124,58,237,0.2);
        }
        .db-welcome h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px; letter-spacing: -0.3px;
        }
        .db-welcome p { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }

        /* campaigns table card */
        .campaigns-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden; margin-bottom: 0;
        }
        .campaigns-card-head {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .campaigns-card-head h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }

        .camp-row {
          display: flex; align-items: center; padding: 13px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          gap: 12px; text-decoration: none;
          transition: background 0.15s;
        }
        .camp-row:last-child { border-bottom: none; }
        .camp-row:hover { background: rgba(255,255,255,0.025); }
        .camp-info { flex: 1; min-width: 0; }
        .camp-title { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 2px; }
        .camp-sub   { font-size: 11px; color: #4f4e6a; }
        .camp-meta  { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
        .camp-meta-item { display: flex; flex-direction: column; align-items: center; gap: 1px; }
        .camp-meta-num { font-family: var(--font-syne), sans-serif; font-size: 14px; font-weight: 700; color: #fff; }
        .camp-meta-lbl { font-size: 9px; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.08em; }
        .camp-arrow { color: #4f4e6a; font-size: 12px; flex-shrink: 0; }

        /* candidates list */
        .cand-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }
        .cand-card-head {
          padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .cand-card-head h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .cand-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.04);
          text-decoration: none; transition: background 0.15s; cursor: pointer;
        }
        .cand-row:last-child { border-bottom: none; }
        .cand-row:hover { background: rgba(255,255,255,0.025); }
        .cand-info { flex: 1; min-width: 0; }
        .cand-name { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 2px; }
        .cand-role { font-size: 11px; color: #4f4e6a; }
        .cand-scores { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .score-chip {
          display: flex; flex-direction: column; align-items: center; gap: 1px;
        }
        .score-chip-num { font-size: 13px; font-weight: 700; color: #fff; }
        .score-chip-lbl { font-size: 9px; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.06em; }
        .score-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.06); }
        .cand-time { font-size: 10px; color: #4f4e6a; flex-shrink: 0; min-width: 60px; text-align: right; }

        /* activity feed */
        .activity-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
        }
        .activity-head { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .activity-head h3 { font-family: var(--font-syne), sans-serif; font-size: 14px; font-weight: 700; color: #fff; }
        .activity-list { padding: 8px 0; }
        .activity-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 10px 20px;
        }
        .act-dot-wrap { display: flex; flex-direction: column; align-items: center; gap: 0; padding-top: 4px; }
        .act-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .act-line { width: 1px; flex: 1; background: rgba(255,255,255,0.06); min-height: 16px; }
        .act-content { flex: 1; min-width: 0; }
        .act-text { font-size: 12px; font-weight: 300; color: #8b8aa6; line-height: 1.55; margin-bottom: 2px; }
        .act-text strong { color: #c4b5fd; font-weight: 500; }
        .act-time { font-size: 10px; color: #4f4e6a; }

        @media (max-width: 900px) {
          .db-grid-4 { grid-template-columns: 1fr 1fr; }
          .db-grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .db-grid-4 { grid-template-columns: 1fr 1fr; }
          .camp-meta { display: none; }
        }
      `}</style>

      {/* ── Welcome ── */}
      <div className="db-welcome anim-1">
        <div>
          <h2>Good morning, Sarah 👋</h2>
          <p>You have <strong style={{color:"#c4b5fd"}}>3 new candidates</strong> interviewed since yesterday and 2 awaiting your review.</p>
        </div>
        <Link href="/companies/campaigns/new" className="btn btn-primary">
          + New campaign
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="db-grid-4 anim-2">
        <StatCard icon="📋" num="4"   label="Active campaigns"    delta="+1 this week" deltaType="up"  colorClass="stat-purple" />
        <StatCard icon="👥" num="43"  label="Candidates screened" delta="+12 today"    deltaType="up"  colorClass="stat-blue"   />
        <StatCard icon="⭐" num="12"  label="Shortlisted"         delta="3 new"        deltaType="up"  colorClass="stat-green"  />
        <StatCard icon="⏱" num="18h" label="Hours saved"         delta="this week"    deltaType="neu" colorClass="stat-amber"  />
      </div>

      {/* ── Two column ── */}
      <div className="db-grid-2 anim-3">

        {/* Campaigns */}
        <div className="campaigns-card">
          <div className="campaigns-card-head">
            <h3>Campaigns</h3>
            <Link href="/companies/campaigns" className="btn btn-outline" style={{padding:"5px 12px",fontSize:11}}>View all</Link>
          </div>
          {CAMPAIGNS.map(c => (
            <Link href={`/companies/campaigns/${c.id}`} className="camp-row" key={c.id}>
              <div className="camp-info">
                <div className="camp-title">{c.title}</div>
                <div className="camp-sub">
                  <CampaignStatus status={c.status} />
                  {c.status === "Active" && <span style={{color:"#4f4e6a",marginLeft:6}}>{c.daysLeft}d left</span>}
                </div>
              </div>
              <div className="camp-meta">
                <div className="camp-meta-item">
                  <span className="camp-meta-num">{c.candidates}</span>
                  <span className="camp-meta-lbl">Total</span>
                </div>
                <div className="camp-meta-item">
                  <span className="camp-meta-num" style={{color:"#4ade80"}}>{c.shortlist}</span>
                  <span className="camp-meta-lbl">Shortlist</span>
                </div>
              </div>
              <span className="camp-arrow">→</span>
            </Link>
          ))}
        </div>

        {/* Right column: recent candidates + activity */}
        <div style={{display:"flex",flexDirection:"column",gap:18}}>

          {/* Recent candidates */}
          <div className="cand-card">
            <div className="cand-card-head">
              <h3>Latest interviews</h3>
              <Link href="/companies/candidates" style={{fontSize:12,color:"#7c3aed",textDecoration:"none"}}>View all →</Link>
            </div>
            {RECENT_CANDIDATES.map(c => (
              <Link href={`/companies/candidates/${c.id}`} className="cand-row" key={c.id}>
                <div className="avatar" style={{background:c.bg}}>{c.avatar}</div>
                <div className="cand-info">
                  <div className="cand-name">{c.name}</div>
                  <div className="cand-role">{c.role}</div>
                </div>
                <div className="cand-scores">
                  <div className="score-chip">
                    <span className="score-chip-num">{c.score}</span>
                    <span className="score-chip-lbl">Score</span>
                  </div>
                  <div className="score-divider" />
                  <div className="score-chip">
                    <span className="score-chip-num" style={{color:"#a78bfa"}}>{c.culture}</span>
                    <span className="score-chip-lbl">Culture</span>
                  </div>
                  <RecPill rec={c.rec} />
                </div>
                <span className="cand-time">{c.time}</span>
              </Link>
            ))}
          </div>

          {/* Activity feed */}
          <div className="activity-card">
            <div className="activity-head"><h3>Activity</h3></div>
            <div className="activity-list">
              {[
                { dot:"#4ade80", text:<><strong>Aisha Okonkwo</strong> completed her interview for Sr. Product Designer</>, time:"2 min ago"   },
                { dot:"#38bdf8", text:<><strong>Lucas Martins</strong> completed his interview for Sr. Product Designer</>,  time:"18 min ago" },
                { dot:"#a78bfa", text:<>Campaign <strong>Backend Engineer</strong> reached 20 candidates</>,                time:"1 hr ago"   },
                { dot:"#fbbf24", text:<><strong>Growth Marketer</strong> campaign was paused</>,                             time:"3 hrs ago"  },
                { dot:"#4ade80", text:<>Campaign <strong>Sr. Product Designer</strong> went live</>,                         time:"Yesterday"  },
              ].map((a, i) => (
                <div className="activity-item" key={i}>
                  <div className="act-dot-wrap">
                    <div className="act-dot" style={{background:a.dot}} />
                    {i < 4 && <div className="act-line" />}
                  </div>
                  <div className="act-content">
                    <div className="act-text">{a.text}</div>
                    <div className="act-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}