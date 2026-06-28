"use client";

import Link from "next/link";
import { useState } from "react";
import { CompaniesStyles, StatCard, CampaignStatus, EmptyState } from "@/components/companies-ui";

const CAMPAIGNS = [
  { id: 1, title: "Senior Product Designer",  dept: "Design",      status: "Active", candidates: 14, shortlist: 3, created: "Jun 22", daysLeft: 4,  link: "nervo.ai/i/spd-x1" },
  { id: 2, title: "Backend Engineer (Node)",  dept: "Engineering",  status: "Active", candidates: 22, shortlist: 5, created: "Jun 20", daysLeft: 2,  link: "nervo.ai/i/be-x2"  },
  { id: 3, title: "Growth Marketer",          dept: "Marketing",    status: "Paused", candidates: 7,  shortlist: 0, created: "Jun 18", daysLeft: 9,  link: "nervo.ai/i/gm-x3"  },
  { id: 4, title: "Product Manager",          dept: "Product",      status: "Closed", candidates: 31, shortlist: 4, created: "Jun 1",  daysLeft: 0,  link: "nervo.ai/i/pm-x4"  },
];

type Filter = "All" | "Active" | "Paused" | "Closed" | "Draft";

export default function CampaignsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [copied, setCopied] = useState<number | null>(null);

  const filtered = filter === "All" ? CAMPAIGNS : CAMPAIGNS.filter(c => c.status === filter);

  function copyLink(id: number, link: string) {
    navigator.clipboard.writeText(`https://${link}`);
    setCopied(id); setTimeout(() => setCopied(null), 1800);
  }

  return (
    <>
      <CompaniesStyles />
      <style>{`
        .cmp-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 26px; }

        /* filters */
        .filter-row { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
        .filter-pill {
          padding: 6px 16px; border-radius: 999px; cursor: pointer;
          font-size: 12px; font-weight: 400;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #8b8aa6; transition: all 0.2s; font-family: var(--font-dm-sans), sans-serif;
        }
        .filter-pill.on { background: rgba(124,58,237,0.14); border-color: rgba(124,58,237,0.4); color: #c4b5fd; }

        /* campaign cards grid */
        .cmp-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }

        .cmp-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 16px;
          position: relative; overflow: hidden;
          transition: background 0.2s, border-color 0.2s;
        }
        .cmp-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(124,58,237,0.25); }
        .cmp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#7c3aed,#4f46e5); }

        .cmp-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .cmp-card-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.2px; margin-bottom: 4px;
        }
        .cmp-card-dept { font-size: 11px; color: #4f4e6a; }

        /* metrics row */
        .cmp-metrics { display: flex; gap: 0; }
        .cmp-metric { flex: 1; text-align: center; padding: 10px 0; }
        .cmp-metric:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.06); }
        .cm-num { font-family: var(--font-syne), sans-serif; font-size: 20px; font-weight: 800; color: #fff; }
        .cm-lbl { font-size: 10px; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

        /* actions row */
        .cmp-actions { display: flex; gap: 8px; align-items: center; }
        .cmp-link-box {
          flex: 1; display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          font-size: 11px; color: #4f4e6a; overflow: hidden;
        }
        .cmp-link-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cmp-copy-btn {
          flex-shrink: 0; font-size: 11px; font-weight: 500; color: #a78bfa;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif; transition: color 0.2s;
        }
        .cmp-copy-btn:hover { color: #c4b5fd; }
        .cmp-days-left {
          font-size: 11px; color: #fbbf24; background: rgba(251,191,36,0.08);
          padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(251,191,36,0.2);
          white-space: nowrap;
        }

        @media (max-width: 860px) {
          .cmp-stats { grid-template-columns: 1fr 1fr; }
          .cmp-grid  { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* stats */}
      <div className="cmp-stats anim-1">
        <StatCard icon="📋" num="4"  label="Total campaigns"     colorClass="stat-purple" />
        <StatCard icon="✅" num="2"  label="Active now"          delta="↑ 1 new"  deltaType="up" colorClass="stat-green" />
        <StatCard icon="👥" num="74" label="Total candidates"    delta="+12 this week" deltaType="up" colorClass="stat-blue" />
        <StatCard icon="⭐" num="12" label="Total shortlisted"   colorClass="stat-amber" />
      </div>

      {/* filters + new btn */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div className="filter-row" style={{marginBottom:0}}>
          {(["All","Active","Paused","Closed","Draft"] as Filter[]).map(f => (
            <button key={f} className={`filter-pill ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <Link href="/companies/campaigns/new" className="btn btn-primary anim-1">+ New campaign</Link>
      </div>

      {/* campaigns grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No campaigns here"
          body="Create your first hiring campaign and start screening candidates automatically."
          action={<Link href="/companies/campaigns/new" className="btn btn-primary">Create campaign</Link>}
        />
      ) : (
        <div className="cmp-grid anim-2">
          {filtered.map(c => (
            <div className="cmp-card" key={c.id}>
              <div className="cmp-card-top">
                <div>
                  <div className="cmp-card-title">{c.title}</div>
                  <div className="cmp-card-dept">{c.dept} · Created {c.created}</div>
                </div>
                <CampaignStatus status={c.status} />
              </div>

              <div className="cmp-metrics" style={{background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}>
                <div className="cmp-metric">
                  <div className="cm-num">{c.candidates}</div>
                  <div className="cm-lbl">Interviewed</div>
                </div>
                <div className="cmp-metric">
                  <div className="cm-num" style={{color:"#4ade80"}}>{c.shortlist}</div>
                  <div className="cm-lbl">Shortlisted</div>
                </div>
                <div className="cmp-metric">
                  <div className="cm-num" style={{color:"#a78bfa"}}>{c.candidates - c.shortlist}</div>
                  <div className="cm-lbl">Reviewed</div>
                </div>
              </div>

              <div className="cmp-actions">
                <div className="cmp-link-box">
                  <span>🔗</span>
                  <span className="cmp-link-text">{c.link}</span>
                  <button className="cmp-copy-btn" onClick={() => copyLink(c.id, c.link)}>
                    {copied === c.id ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                {c.status === "Active" && c.daysLeft > 0 && (
                  <span className="cmp-days-left">{c.daysLeft}d left</span>
                )}
              </div>

              <div style={{display:"flex",gap:8}}>
                <Link href={`/companies/campaigns/${c.id}`} className="btn btn-outline" style={{flex:1,justifyContent:"center",padding:"9px 0",fontSize:12}}>
                  View candidates →
                </Link>
                <Link href={`/companies/campaigns/${c.id}/edit`} className="btn btn-ghost" style={{padding:"9px 14px",fontSize:12}}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}