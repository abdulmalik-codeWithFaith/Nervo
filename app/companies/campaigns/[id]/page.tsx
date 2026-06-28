"use client";

import Link from "next/link";
import { useState } from "react";
import { CompaniesStyles, RecPill, CampaignStatus, ScoreBars } from "@/components/companies-ui";

const CAMPAIGN = {
  id: 1, title: "Senior Product Designer", dept: "Design", status: "Active",
  created: "Jun 22, 2026", daysLeft: 4, link: "nervo.ai/i/spd-x1",
  description: "We're looking for a senior product designer to own end-to-end design across our core product. You'll work closely with PMs and engineers.",
  skills: ["Figma", "Design systems", "User research", "Prototyping", "Cross-functional collaboration"],
  shortlistTarget: 5, experienceLevel: "Senior (5+ yrs)", focus: "General + Culture fit",
};

const CANDIDATES = [
  { id:1,  name:"Aisha Okonkwo",  avatar:"AO", bg:"linear-gradient(135deg,#7c3aed,#4f46e5)", score:92, culture:91, tech:88, comm:95, conf:90, prob:87, rec:"Strong yes", time:"2 min ago",  duration:"14m" },
  { id:2,  name:"Lucas Martins",  avatar:"LM", bg:"linear-gradient(135deg,#0891b2,#6366f1)", score:88, culture:84, tech:85, comm:88, conf:91, prob:82, rec:"Yes",        time:"18 min ago", duration:"11m" },
  { id:3,  name:"Jin-ho Seo",     avatar:"JS", bg:"linear-gradient(135deg,#059669,#0891b2)", score:82, culture:88, tech:78, comm:85, conf:82, prob:79, rec:"Yes",        time:"1 hr ago",   duration:"13m" },
  { id:4,  name:"Maria Ferreira", avatar:"MF", bg:"linear-gradient(135deg,#d97706,#7c3aed)", score:76, culture:72, tech:74, comm:80, conf:73, prob:75, rec:"Maybe",      time:"3 hrs ago",  duration:"10m" },
  { id:5,  name:"Priya Rao",      avatar:"PR", bg:"linear-gradient(135deg,#6d28d9,#a21caf)", score:74, culture:70, tech:70, comm:78, conf:72, prob:71, rec:"Maybe",      time:"5 hrs ago",  duration:"12m" },
  { id:6,  name:"Tom Adeyemi",    avatar:"TA", bg:"linear-gradient(135deg,#7c3aed,#059669)", score:68, culture:64, tech:65, comm:72, conf:66, prob:68, rec:"No",         time:"Yesterday",  duration:"09m" },
  { id:7,  name:"James Park",     avatar:"JP", bg:"linear-gradient(135deg,#374151,#6b7280)", score:61, culture:55, tech:58, comm:65, conf:59, prob:61, rec:"No",         time:"Yesterday",  duration:"08m" },
];

type SortKey = "score"|"culture"|"rec"|"time";
type RecFilter = "All"|"Strong yes"|"Yes"|"Maybe"|"No";

export default function CampaignDetailPage() {
  const [sort, setSort]         = useState<SortKey>("score");
  const [recFilter, setRecFilter] = useState<RecFilter>("All");
  const [copied, setCopied]     = useState(false);

  const sorted = [...CANDIDATES]
    .filter(c => recFilter === "All" || c.rec === recFilter)
    .sort((a,b) => sort === "score" ? b.score - a.score : sort === "culture" ? b.culture - a.culture : 0);

  const shortlisted = CANDIDATES.filter(c => c.rec === "Strong yes" || c.rec === "Yes");

  return (
    <>
      <CompaniesStyles />
      <style>{`
        /* breadcrumb */
        .breadcrumb { display:flex; align-items:center; gap:6px; margin-bottom:20px; }
        .breadcrumb a { font-size:12px; color:#4f4e6a; text-decoration:none; transition:color 0.2s; }
        .breadcrumb a:hover { color:#a78bfa; }
        .breadcrumb span { font-size:12px; color:#2a2a3d; }

        /* campaign header */
        .camp-hd {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 22px 24px; margin-bottom: 20px;
          display: flex; align-items: flex-start; justify-content: space-between; gap: 20px;
        }
        .camp-hd-left h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.4px; margin-bottom: 6px;
        }
        .camp-hd-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
        .camp-hd-meta span { font-size: 12px; color: #4f4e6a; }
        .camp-hd-skills { display: flex; gap: 6px; flex-wrap: wrap; }
        .skill-tag {
          padding: 3px 10px; border-radius: 999px; font-size: 11px;
          background: rgba(124,58,237,0.09); border: 1px solid rgba(124,58,237,0.18); color: #c4b5fd;
        }
        .camp-hd-right { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; flex-shrink: 0; }
        .link-box {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 9px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          font-size: 12px; color: #4f4e6a;
        }
        .link-copy {
          font-size: 11px; font-weight: 500; color: #a78bfa;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif; transition: color 0.2s;
        }
        .link-copy:hover { color: #c4b5fd; }

        /* progress */
        .camp-progress {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 16px 20px; margin-bottom: 20px;
          display: flex; gap: 28px; align-items: center;
        }
        .cp-item { display: flex; flex-direction: column; gap: 2px; }
        .cp-num { font-family: var(--font-syne), sans-serif; font-size: 22px; font-weight: 800; color: #fff; }
        .cp-lbl { font-size: 10px; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.08em; }
        .cp-bar-wrap { flex: 1; }
        .cp-bar-label { display: flex; justify-content: space-between; font-size: 11px; color: #4f4e6a; margin-bottom: 6px; }
        .cp-track { height: 6px; background: rgba(255,255,255,0.07); border-radius: 999px; overflow: hidden; }
        .cp-fill  { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#7c3aed,#38bdf8); transition: width 1s ease; }

        /* candidates table */
        .cands-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px; flex-wrap: wrap; gap: 10px;
        }
        .cands-header h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .cands-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

        .sort-btn {
          padding: 6px 13px; border-radius: 999px; cursor: pointer; font-size: 11px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #8b8aa6; transition: all 0.2s; font-family: var(--font-dm-sans), sans-serif;
        }
        .sort-btn.on { background: rgba(124,58,237,0.12); border-color: rgba(124,58,237,0.35); color: #c4b5fd; }

        .cands-table-wrap {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }
        .cands-table { width: 100%; border-collapse: collapse; }
        .cands-table th {
          text-align: left; padding: 10px 16px; font-size: 10px; font-weight: 600;
          color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .cands-table td {
          padding: 12px 16px; font-size: 13px; font-weight: 300; color: #8b8aa6;
          border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;
        }
        .cands-table tr:last-child td { border-bottom: none; }
        .cands-table tbody tr { cursor: pointer; transition: background 0.14s; }
        .cands-table tbody tr:hover td { background: rgba(255,255,255,0.025); }

        .cand-cell { display: flex; align-items: center; gap: 10px; }
        .cand-td-name { font-size: 13px; font-weight: 500; color: #fff; }
        .cand-td-time { font-size: 11px; color: #4f4e6a; }

        .score-col { font-family: var(--font-syne), sans-serif; font-size: 14px; font-weight: 700; }
        .s-high { color: #4ade80; }
        .s-mid  { color: #fbbf24; }
        .s-low  { color: #f87171; }

        @media (max-width: 860px) {
          .camp-hd { flex-direction: column; }
          .camp-hd-right { align-items: flex-start; }
          .camp-progress { flex-wrap: wrap; }
        }
      `}</style>

      {/* breadcrumb */}
      <div className="breadcrumb anim-1">
        <Link href="/companies">Dashboard</Link>
        <span>/</span>
        <Link href="/companies/campaigns">Campaigns</Link>
        <span>/</span>
        <span style={{color:"#8b8aa6"}}>{CAMPAIGN.title}</span>
      </div>

      {/* campaign header */}
      <div className="camp-hd anim-2">
        <div className="camp-hd-left">
          <h1>{CAMPAIGN.title}</h1>
          <div className="camp-hd-meta">
            <CampaignStatus status={CAMPAIGN.status} />
            <span>{CAMPAIGN.dept}</span>
            <span>·</span>
            <span>{CAMPAIGN.experienceLevel}</span>
            <span>·</span>
            <span>{CAMPAIGN.focus}</span>
            <span>·</span>
            <span style={{color:"#fbbf24"}}>{CAMPAIGN.daysLeft} days left</span>
          </div>
          <div className="camp-hd-skills">
            {CAMPAIGN.skills.map(s => <span className="skill-tag" key={s}>{s}</span>)}
          </div>
        </div>
        <div className="camp-hd-right">
          <div className="link-box">
            🔗 <span style={{fontSize:12,color:"#8b8aa6"}}>{CAMPAIGN.link}</span>
            <button className="link-copy" onClick={() => { navigator.clipboard.writeText(`https://${CAMPAIGN.link}`); setCopied(true); setTimeout(()=>setCopied(false),1800); }}>
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Link href={`/companies/campaigns/${CAMPAIGN.id}/edit`} className="btn btn-ghost" style={{fontSize:12,padding:"8px 14px"}}>Edit</Link>
            <button className="btn btn-outline" style={{fontSize:12,padding:"8px 14px"}}>Pause</button>
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="camp-progress anim-3">
        {[
          { num: CANDIDATES.length, lbl: "Interviewed" },
          { num: shortlisted.length, lbl: "Shortlisted", color: "#4ade80" },
          { num: CAMPAIGN.shortlistTarget, lbl: "Target" },
        ].map(p => (
          <div className="cp-item" key={p.lbl}>
            <span className="cp-num" style={p.color ? {color:p.color} : {}}>{p.num}</span>
            <span className="cp-lbl">{p.lbl}</span>
          </div>
        ))}
        <div className="cp-bar-wrap">
          <div className="cp-bar-label">
            <span>Shortlist progress</span>
            <span style={{color:"#4ade80"}}>{shortlisted.length} / {CAMPAIGN.shortlistTarget}</span>
          </div>
          <div className="cp-track">
            <div className="cp-fill" style={{width:`${Math.min((shortlisted.length/CAMPAIGN.shortlistTarget)*100,100)}%`}} />
          </div>
        </div>
      </div>

      {/* candidates table */}
      <div className="anim-4">
        <div className="cands-header">
          <h2>Candidates ({sorted.length})</h2>
          <div className="cands-controls">
            {/* rec filter */}
            {(["All","Strong yes","Yes","Maybe","No"] as RecFilter[]).map(r => (
              <button key={r} className={`sort-btn ${recFilter===r?"on":""}`} onClick={()=>setRecFilter(r)}>{r}</button>
            ))}
            <div style={{width:1,height:20,background:"rgba(255,255,255,0.08)"}} />
            {/* sort */}
            <button className={`sort-btn ${sort==="score"?"on":""}`} onClick={()=>setSort("score")}>↓ Score</button>
            <button className={`sort-btn ${sort==="culture"?"on":""}`} onClick={()=>setSort("culture")}>↓ Culture</button>
          </div>
        </div>

        <div className="cands-table-wrap">
          <table className="cands-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Overall</th>
                <th>Culture fit</th>
                <th>Tech</th>
                <th>Comm</th>
                <th>Recommendation</th>
                <th>Duration</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => {
                const cls = c.score >= 85 ? "s-high" : c.score >= 70 ? "s-mid" : "s-low";
                return (
                  <tr key={c.id} onClick={() => window.location.href=`/companies/candidates/${c.id}`}>
                    <td>
                      <div className="cand-cell">
                        <div className="avatar" style={{background:c.bg}}>{c.avatar}</div>
                        <div>
                          <div className="cand-td-name">{c.name}</div>
                          <div className="cand-td-time">{c.time}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`score-col ${cls}`}>{c.score}</span></td>
                    <td><span className={`score-col ${c.culture>=80?"s-high":c.culture>=70?"s-mid":"s-low"}`}>{c.culture}</span></td>
                    <td>{c.tech}</td>
                    <td>{c.comm}</td>
                    <td><RecPill rec={c.rec} /></td>
                    <td>{c.duration}</td>
                    <td style={{color:"#4f4e6a",fontSize:12}}>→</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}