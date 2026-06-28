"use client";

import Link from "next/link";
import { useState } from "react";
import { CompaniesStyles, RecPill, CampaignStatus } from "@/components/companies-ui";

// ── mock data ─────────────────────────────────────────────
const ALL_CANDIDATES = [
  { id:1,  name:"Aisha Okonkwo",   avatar:"AO", bg:"linear-gradient(135deg,#7c3aed,#4f46e5)", campaign:"Sr. Product Designer",  status:"Active", score:92, culture:91, rec:"Strong yes", time:"2 min ago",   duration:"14m" },
  { id:2,  name:"Lucas Martins",   avatar:"LM", bg:"linear-gradient(135deg,#0891b2,#6366f1)", campaign:"Sr. Product Designer",  status:"Active", score:88, culture:84, rec:"Yes",        time:"18 min ago",  duration:"11m" },
  { id:3,  name:"Jin-ho Seo",      avatar:"JS", bg:"linear-gradient(135deg,#059669,#0891b2)", campaign:"Sr. Product Designer",  status:"Active", score:82, culture:88, rec:"Yes",        time:"1 hr ago",    duration:"13m" },
  { id:4,  name:"Maria Ferreira",  avatar:"MF", bg:"linear-gradient(135deg,#d97706,#7c3aed)", campaign:"Backend Engineer",      status:"Active", score:91, culture:87, rec:"Strong yes", time:"2 hrs ago",   duration:"12m" },
  { id:5,  name:"Chidi Obi",       avatar:"CO", bg:"linear-gradient(135deg,#7c3aed,#059669)", campaign:"Backend Engineer",      status:"Active", score:86, culture:80, rec:"Yes",        time:"3 hrs ago",   duration:"10m" },
  { id:6,  name:"Priya Rao",       avatar:"PR", bg:"linear-gradient(135deg,#6d28d9,#a21caf)", campaign:"Sr. Product Designer",  status:"Active", score:74, culture:70, rec:"Maybe",      time:"5 hrs ago",   duration:"12m" },
  { id:7,  name:"Sara Lindqvist",  avatar:"SL", bg:"linear-gradient(135deg,#0891b2,#7c3aed)", campaign:"Growth Marketer",       status:"Paused", score:79, culture:76, rec:"Maybe",      time:"Yesterday",   duration:"09m" },
  { id:8,  name:"Tom Adeyemi",     avatar:"TA", bg:"linear-gradient(135deg,#7c3aed,#059669)", campaign:"Backend Engineer",      status:"Active", score:68, culture:64, rec:"No",         time:"Yesterday",   duration:"09m" },
  { id:9,  name:"James Park",      avatar:"JP", bg:"linear-gradient(135deg,#374151,#6b7280)", campaign:"Sr. Product Designer",  status:"Active", score:61, culture:55, rec:"No",         time:"2 days ago",  duration:"08m" },
  { id:10, name:"Amara Diallo",    avatar:"AD", bg:"linear-gradient(135deg,#a21caf,#7c3aed)", campaign:"Product Manager",       status:"Closed", score:88, culture:90, rec:"Strong yes", time:"3 days ago",  duration:"13m" },
  { id:11, name:"Erik Svensson",   avatar:"ES", bg:"linear-gradient(135deg,#0891b2,#059669)", campaign:"Product Manager",       status:"Closed", score:83, culture:78, rec:"Yes",        time:"3 days ago",  duration:"11m" },
  { id:12, name:"Nkechi Eze",      avatar:"NE", bg:"linear-gradient(135deg,#d97706,#a21caf)", campaign:"Growth Marketer",       status:"Paused", score:72, culture:68, rec:"Maybe",      time:"4 days ago",  duration:"10m" },
];

type RecFilter = "All" | "Strong yes" | "Yes" | "Maybe" | "No";
type SortKey   = "score" | "culture" | "name" | "recent";

const CAMPAIGNS = ["All campaigns", "Sr. Product Designer", "Backend Engineer", "Growth Marketer", "Product Manager"];

export default function CandidatesPage() {
  const [search,    setSearch]    = useState("");
  const [recFilter, setRecFilter] = useState<RecFilter>("All");
  const [campaign,  setCampaign]  = useState("All campaigns");
  const [sort,      setSort]      = useState<SortKey>("recent");
  const [view,      setView]      = useState<"table"|"grid">("table");

  const filtered = ALL_CANDIDATES
    .filter(c => {
      const matchSearch   = c.name.toLowerCase().includes(search.toLowerCase()) || c.campaign.toLowerCase().includes(search.toLowerCase());
      const matchRec      = recFilter === "All" || c.rec === recFilter;
      const matchCampaign = campaign === "All campaigns" || c.campaign === campaign;
      return matchSearch && matchRec && matchCampaign;
    })
    .sort((a, b) => {
      if (sort === "score")   return b.score - a.score;
      if (sort === "culture") return b.culture - a.culture;
      if (sort === "name")    return a.name.localeCompare(b.name);
      return 0; // recent = default order
    });

  const scoreColor = (v: number) => v >= 85 ? "#4ade80" : v >= 70 ? "#fbbf24" : "#f87171";

  return (
    <>
      <CompaniesStyles />
      <style>{`
        /* ── stats strip ── */
        .cands-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }

        /* ── toolbar ── */
        .toolbar {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 18px; flex-wrap: wrap;
        }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px; border-radius: 10px; flex: 1; min-width: 200px; max-width: 320px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.2s;
        }
        .search-box:focus-within { border-color: rgba(124,58,237,0.5); }
        .search-box input {
          background: none; border: none; outline: none; width: 100%;
          font-size: 13px; font-weight: 300; color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .search-box input::placeholder { color: #4f4e6a; }
        .search-icon { font-size: 14px; opacity: 0.4; flex-shrink: 0; }

        .toolbar-select {
          padding: 9px 13px; border-radius: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #8b8aa6; font-size: 12px; font-family: var(--font-dm-sans), sans-serif;
          outline: none; cursor: pointer; -webkit-appearance: none;
          transition: border-color 0.2s;
        }
        .toolbar-select:focus { border-color: rgba(124,58,237,0.5); }
        .toolbar-select option { background: #0e0e1f; }

        .filter-pills { display:flex; gap:6px; flex-wrap:wrap; }
        .fpill {
          padding: 6px 13px; border-radius: 999px; cursor: pointer; font-size: 11px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #8b8aa6; transition: all 0.2s; font-family: var(--font-dm-sans), sans-serif;
        }
        .fpill.on { background: rgba(124,58,237,0.13); border-color: rgba(124,58,237,0.38); color: #c4b5fd; }

        .view-toggle {
          display: flex; gap: 2px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 3px;
          margin-left: auto;
        }
        .view-btn {
          width: 30px; height: 28px; border-radius: 6px; border: none; cursor: pointer;
          font-size: 14px; display: flex; align-items: center; justify-content: center;
          background: transparent; color: #4f4e6a; transition: all 0.18s;
        }
        .view-btn.on { background: rgba(124,58,237,0.2); color: #c4b5fd; }

        /* ── result count ── */
        .result-count { font-size: 12px; color: #4f4e6a; margin-bottom: 14px; }
        .result-count strong { color: #8b8aa6; }

        /* ── TABLE VIEW ── */
        .table-wrap {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }
        .sort-header { cursor: pointer; user-select: none; transition: color 0.15s; }
        .sort-header:hover { color: #c4b5fd !important; }
        .sort-header.active-sort { color: #a78bfa !important; }

        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left; padding: 10px 16px;
          font-size: 10px; font-weight: 600; color: #4f4e6a;
          text-transform: uppercase; letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        td {
          padding: 13px 16px; font-size: 13px; font-weight: 300; color: #8b8aa6;
          border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;
        }
        tbody tr { cursor: pointer; transition: background 0.14s; }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover td { background: rgba(255,255,255,0.025); }

        .td-cand { display:flex; align-items:center; gap:10px; }
        .td-name { font-size:13px; font-weight:500; color:#fff; }
        .td-campaign-tag {
          font-size: 10px; padding: 2px 8px; border-radius: 999px;
          background: rgba(255,255,255,0.06); color: #4f4e6a;
        }
        .score-val { font-family:var(--font-syne),sans-serif; font-size:14px; font-weight:700; }

        /* ── GRID VIEW ── */
        .cands-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .cand-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .cand-card:hover { background: rgba(255,255,255,0.055); border-color: rgba(124,58,237,0.28); transform: translateY(-1px); }
        .cand-card-top { display:flex; align-items:center; gap:12px; }
        .cand-avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#fff; flex-shrink:0; }
        .cand-card-name { font-family:var(--font-syne),sans-serif; font-size:14px; font-weight:700; color:#fff; margin-bottom:2px; letter-spacing:-0.2px; }
        .cand-card-campaign { font-size:11px; color:#4f4e6a; }
        .cand-card-scores { display:flex; gap:0; }
        .cand-score-cell { flex:1; text-align:center; padding:10px 0; }
        .cand-score-cell:not(:last-child) { border-right:1px solid rgba(255,255,255,0.06); }
        .csc-num { font-family:var(--font-syne),sans-serif; font-size:18px; font-weight:800; }
        .csc-lbl { font-size:9px; color:#4f4e6a; text-transform:uppercase; letter-spacing:0.07em; margin-top:2px; }
        .cand-card-footer { display:flex; align-items:center; justify-content:space-between; }

        /* empty */
        .no-results { text-align:center; padding:60px 24px; color:#4f4e6a; }
        .no-results p { font-size:14px; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .anim-in { animation: fadeUp 0.35s ease both; }

        @media (max-width:1000px) { .cands-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:860px)  { .cands-stats { grid-template-columns:1fr 1fr; } }
        @media (max-width:640px)  { .cands-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* ── Stats ── */}
      <div className="cands-stats anim-1">
        {[
          { icon:"👥", num:"43",  lbl:"Total interviewed",  delta:"+12 today",     dt:"up",  cls:"stat-purple" },
          { icon:"⭐", num:"12",  lbl:"Shortlisted",        delta:"across 4 roles", dt:"neu", cls:"stat-green"  },
          { icon:"📊", num:"79",  lbl:"Avg. overall score", delta:"+3 vs last week",dt:"up",  cls:"stat-blue"   },
          { icon:"🧠", num:"82",  lbl:"Avg. culture score", delta:"+2 vs last week",dt:"up",  cls:"stat-amber"  },
        ].map(s => (
          <div className={`stat-card ${s.cls}`} key={s.lbl}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
            <div className={`stat-delta delta-${s.dt}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="toolbar anim-2">
        {/* search */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search by name or role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* campaign filter */}
        <select className="toolbar-select" value={campaign} onChange={e => setCampaign(e.target.value)}>
          {CAMPAIGNS.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* rec filter pills */}
        <div className="filter-pills">
          {(["All","Strong yes","Yes","Maybe","No"] as RecFilter[]).map(r => (
            <button key={r} className={`fpill ${recFilter===r?"on":""}`} onClick={() => setRecFilter(r)}>{r}</button>
          ))}
        </div>

        {/* sort */}
        <select className="toolbar-select" value={sort} onChange={e => setSort(e.target.value as SortKey)}>
          <option value="recent">Most recent</option>
          <option value="score">Highest score</option>
          <option value="culture">Culture fit</option>
          <option value="name">Name A–Z</option>
        </select>

        {/* view toggle */}
        <div className="view-toggle">
          <button className={`view-btn ${view==="table"?"on":""}`} onClick={() => setView("table")}>☰</button>
          <button className={`view-btn ${view==="grid"?"on":""}`}  onClick={() => setView("grid")}>⊞</button>
        </div>
      </div>

      {/* result count */}
      <p className="result-count anim-2">
        Showing <strong>{filtered.length}</strong> of {ALL_CANDIDATES.length} candidates
      </p>

      {/* ── Table view ── */}
      {view === "table" && (
        <div className="table-wrap anim-in">
          {filtered.length === 0 ? (
            <div className="no-results"><p>No candidates match your filters.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Campaign</th>
                  <th
                    className={`sort-header ${sort==="score"?"active-sort":""}`}
                    onClick={() => setSort("score")}
                  >Overall {sort==="score"&&"↓"}</th>
                  <th
                    className={`sort-header ${sort==="culture"?"active-sort":""}`}
                    onClick={() => setSort("culture")}
                  >Culture {sort==="culture"&&"↓"}</th>
                  <th>Recommendation</th>
                  <th>Duration</th>
                  <th>When</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => window.location.href=`/companies/candidates/${c.id}`}>
                    <td>
                      <div className="td-cand">
                        <div className="avatar" style={{background:c.bg,width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{c.avatar}</div>
                        <div>
                          <div className="td-name">{c.name}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="td-campaign-tag">{c.campaign}</span></td>
                    <td><span className="score-val" style={{color:scoreColor(c.score)}}>{c.score}</span></td>
                    <td><span className="score-val" style={{color:scoreColor(c.culture),fontSize:13}}>{c.culture}</span></td>
                    <td><RecPill rec={c.rec} /></td>
                    <td>{c.duration}</td>
                    <td style={{fontSize:11,color:"#4f4e6a"}}>{c.time}</td>
                    <td style={{color:"#4f4e6a",fontSize:12}}>→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Grid view ── */}
      {view === "grid" && (
        filtered.length === 0
          ? <div className="no-results"><p>No candidates match your filters.</p></div>
          : (
            <div className="cands-grid anim-in">
              {filtered.map(c => (
                <Link href={`/companies/candidates/${c.id}`} className="cand-card" key={c.id}>
                  <div className="cand-card-top">
                    <div className="cand-avatar" style={{background:c.bg}}>{c.avatar}</div>
                    <div>
                      <div className="cand-card-name">{c.name}</div>
                      <div className="cand-card-campaign">{c.campaign}</div>
                    </div>
                  </div>
                  <div className="cand-card-scores" style={{background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}>
                    {[
                      {num:c.score,   lbl:"Overall",  color:scoreColor(c.score)},
                      {num:c.culture, lbl:"Culture",  color:scoreColor(c.culture)},
                    ].map(s => (
                      <div className="cand-score-cell" key={s.lbl}>
                        <div className="csc-num" style={{color:s.color}}>{s.num}</div>
                        <div className="csc-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="cand-card-footer">
                    <RecPill rec={c.rec} />
                    <span style={{fontSize:11,color:"#4f4e6a"}}>{c.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          )
      )}
    </>
  );
}