"use client";

import Link from "next/link";
import { useState } from "react";
import { CompaniesStyles, RecPill, ScoreBars } from "@/components/companies-ui";

const CANDIDATE = {
  id: 1, name: "Aisha Okonkwo", avatar: "AO", bg: "linear-gradient(135deg,#7c3aed,#4f46e5)",
  role: "Senior Product Designer", campaign: "Senior Product Designer", campaignId: 1,
  time: "2 min ago", duration: "14 min",
  scores: { overall: 92, tech: 88, comm: 95, conf: 90, prob: 87, culture: 91 },
  rec: "Strong yes",
  summary: "Aisha is an exceptionally strong candidate for this role. She communicated with clarity and confidence throughout, backed her answers with specific, quantified examples, and demonstrated genuine ownership over past outcomes. Her collaborative instincts and willingness to challenge decisions respectfully make her a compelling culture fit. Recommend advancing to the next round immediately.",
  strengths: [
    "Leads with outcomes — consistently started answers with the result before explaining the process",
    "Quantified impact clearly across multiple answers (38% → 61% activation, team of 8, 3-month timeline)",
    "Showed strong ownership: didn't deflect blame, acknowledged what she'd do differently",
    "Handled follow-up pressure without getting defensive",
    "Stakeholder management answer demonstrated genuine empathy and data-led persuasion",
  ],
  risks: [
    "Limited evidence of experience managing direct reports — worth probing in next round",
    "One answer on conflict resolution leaned slightly toward avoidance; worth exploring further",
  ],
  culture: {
    score: 91,
    summary: "Aisha's responses consistently reflected a high degree of ownership, accountability, and team orientation. She spoke about colleagues' contributions unprompted, acknowledged personal failures without deflection, and showed strong coachability. No significant culture risks detected.",
    traits: [
      { name: "Ownership & accountability", rating: "Strong",   dot: "#4ade80" },
      { name: "Team collaboration",         rating: "Strong",   dot: "#4ade80" },
      { name: "Growth mindset",             rating: "Strong",   dot: "#4ade80" },
      { name: "Conflict resolution",        rating: "Moderate", dot: "#fbbf24" },
      { name: "Communication style",        rating: "Strong",   dot: "#4ade80" },
      { name: "Adaptability",               rating: "Strong",   dot: "#4ade80" },
    ],
  },
  followUps: [
    "Have you ever managed direct reports? If so, how did you approach performance conversations?",
    "Tell me about a time you had a persistent disagreement with a colleague — how did it resolve?",
    "How do you stay up to date with design trends and emerging tools?",
  ],
  transcript: [
    { role: "ai",   text: "Tell me about yourself and what draws you to this role." },
    { role: "user", text: "I've been a product designer for about six years, mostly in B2B SaaS. I'm drawn to this role because of the scale of the user base and the ambiguity — I thrive when I have to build clarity from messy problem spaces." },
    { role: "ai",   text: "Walk me through a project you're most proud of and your specific contribution." },
    { role: "user", text: "The project I'm most proud of was redesigning our onboarding flow. Activation was at around 38% and we had a hypothesis that users weren't reaching the aha moment fast enough. I ran discovery, co-designed with engineering, and we shipped an interactive checklist. Activation hit 61% in two months." },
    { role: "ai",   text: "Describe a time you had to deal with a difficult stakeholder." },
    { role: "user", text: "We had a VP of Sales who wanted to add a feature that research showed users didn't want. Instead of pushing back directly I ran a quick usability test with his own customers and shared the recordings. He withdrew the request after watching three sessions." },
    { role: "ai",   text: "What's your approach when you disagree with your manager's decision?" },
    { role: "user", text: "I'll share my perspective clearly and once, with data if I have it. But once a decision is made I commit to it fully. I've found that's how you build the trust to be heard more in future disagreements." },
  ],
};

type Tab = "report" | "culture" | "transcript";

export default function CandidateReportPage() {
  const [tab, setTab] = useState<Tab>("report");

  const sc = CANDIDATE.scores;
  const scoreColor = (v: number) => v >= 85 ? "#4ade80" : v >= 70 ? "#fbbf24" : "#f87171";

  return (
    <>
      <CompaniesStyles />
      <style>{`
        /* breadcrumb */
        .bc { display:flex;align-items:center;gap:6px;margin-bottom:18px; }
        .bc a  { font-size:12px;color:#4f4e6a;text-decoration:none;transition:color 0.2s; }
        .bc a:hover { color:#a78bfa; }
        .bc span { font-size:12px;color:#2a2a3d; }

        /* candidate header card */
        .cand-hdr {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 24px 26px; margin-bottom: 20px;
          display: flex; align-items: center; gap: 20px;
        }
        .cand-hdr-avatar {
          width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #fff;
        }
        .cand-hdr-info { flex: 1; min-width: 0; }
        .cand-hdr-name {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.4px; margin-bottom: 4px;
        }
        .cand-hdr-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .cand-hdr-meta span { font-size: 12px; color: #4f4e6a; }
        .cand-hdr-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
        .overall-score {
          text-align: center;
        }
        .os-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 38px; font-weight: 800; letter-spacing: -1.5px;
          line-height: 1;
        }
        .os-lbl { font-size: 10px; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

        /* tabs */
        .tab-bar { display: flex; gap: 6px; margin-bottom: 20px; }
        .tab-btn {
          padding: 7px 18px; border-radius: 999px; cursor: pointer;
          font-size: 12px; font-weight: 400; font-family: var(--font-dm-sans), sans-serif;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #8b8aa6; transition: all 0.2s;
        }
        .tab-btn.on { background: rgba(124,58,237,0.14); border-color: rgba(124,58,237,0.38); color: #c4b5fd; }

        /* two column layout for report */
        .report-layout { display: grid; grid-template-columns: 1fr 300px; gap: 16px; }

        /* section cards */
        .rpt-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 20px; margin-bottom: 14px;
        }
        .rpt-card:last-child { margin-bottom: 0; }
        .rpt-card h4 {
          font-family: var(--font-syne), sans-serif;
          font-size: 11px; font-weight: 600; color: #7c3aed;
          text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;
        }
        .rpt-card p { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.7; }

        /* check list */
        .chk-list { display: flex; flex-direction: column; gap: 10px; }
        .chk-item { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }
        .chk-ico { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 9px; margin-top: 1px; }
        .ico-green  { background: rgba(74,222,128,0.12); color: #4ade80; }
        .ico-yellow { background: rgba(251,191,36,0.12); color: #fbbf24; }

        /* follow up pills */
        .fup-pill {
          display: inline-flex; padding: 7px 13px; border-radius: 9px; margin: 4px 4px 4px 0;
          background: rgba(124,58,237,0.07); border: 1px solid rgba(124,58,237,0.18);
          font-size: 12px; font-weight: 300; color: #c4b5fd; line-height: 1.5;
        }

        /* right panel sticky */
        .right-panel { display: flex; flex-direction: column; gap: 14px; }
        .sticky-panel { position: sticky; top: 76px; }

        /* score cells */
        .score-cells { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .sc-cell {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px; padding: 12px; text-align: center;
        }
        .sc-cell-lbl { font-size: 10px; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
        .sc-cell-num { font-family: var(--font-syne), sans-serif; font-size: 22px; font-weight: 800; }

        /* culture traits */
        .trait-list { display: flex; flex-direction: column; gap: 9px; }
        .trait-item { display: flex; align-items: center; gap: 8px; }
        .trait-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .trait-name { font-size: 12px; color: #8b8aa6; flex: 1; }
        .trait-rating { font-size: 11px; font-weight: 500; }
        .tr-strong   { color: #4ade80; }
        .tr-moderate { color: #fbbf24; }
        .tr-weak     { color: #f87171; }

        /* transcript */
        .tx-list { display: flex; flex-direction: column; gap: 14px; }
        .tx-turn { display: flex; gap: 10px; align-items: flex-start; }
        .tx-badge { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 999px; flex-shrink: 0; margin-top: 2px; }
        .tx-ai   { background: rgba(124,58,237,0.15); color: #a78bfa; }
        .tx-user { background: rgba(255,255,255,0.07); color: #8b8aa6; }
        .tx-text { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.65; }

        /* action bar */
        .action-bar {
          display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;
        }

        @media (max-width: 860px) {
          .report-layout { grid-template-columns: 1fr; }
          .cand-hdr { flex-wrap: wrap; }
          .cand-hdr-right { align-items: flex-start; }
        }
      `}</style>

      {/* breadcrumb */}
      <div className="bc anim-1">
        <Link href="/companies">Dashboard</Link><span>/</span>
        <Link href="/companies/campaigns">Campaigns</Link><span>/</span>
        <Link href={`/companies/campaigns/${CANDIDATE.campaignId}`}>{CANDIDATE.campaign}</Link><span>/</span>
        <span style={{color:"#8b8aa6"}}>{CANDIDATE.name}</span>
      </div>

      {/* candidate header */}
      <div className="cand-hdr anim-2">
        <div className="cand-hdr-avatar" style={{background:CANDIDATE.bg}}>{CANDIDATE.avatar}</div>
        <div className="cand-hdr-info">
          <div className="cand-hdr-name">{CANDIDATE.name}</div>
          <div className="cand-hdr-meta">
            <RecPill rec={CANDIDATE.rec} />
            <span>·</span><span>{CANDIDATE.role}</span>
            <span>·</span><span>{CANDIDATE.duration}</span>
            <span>·</span><span>{CANDIDATE.time}</span>
          </div>
        </div>
        <div className="cand-hdr-right">
          <div className="overall-score">
            <div className="os-num" style={{color: scoreColor(sc.overall)}}>{sc.overall}</div>
            <div className="os-lbl">Overall</div>
          </div>
        </div>
      </div>

      {/* action bar */}
      <div className="action-bar anim-3">
        <button className="btn btn-primary">✓ Advance to next round</button>
        <button className="btn btn-ghost">✕ Reject</button>
        <button className="btn btn-outline">📩 Send feedback</button>
        <button className="btn btn-ghost">⬇ Download report</button>
      </div>

      {/* tabs */}
      <div className="tab-bar anim-3">
        {(["report","culture","transcript"] as Tab[]).map(t => (
          <button key={t} className={`tab-btn ${tab===t?"on":""}`} onClick={()=>setTab(t)}>
            {t === "report" ? "📊 Report" : t === "culture" ? "🧠 Culture fit" : "📝 Transcript"}
          </button>
        ))}
      </div>

      {/* ── REPORT TAB ── */}
      {tab === "report" && (
        <div className="report-layout anim-4">
          <div>
            {/* AI Summary */}
            <div className="rpt-card">
              <h4>AI Summary</h4>
              <p>{CANDIDATE.summary}</p>
            </div>

            {/* Strengths */}
            <div className="rpt-card">
              <h4>Strengths</h4>
              <div className="chk-list">
                {CANDIDATE.strengths.map(s => (
                  <div className="chk-item" key={s}>
                    <span className="chk-ico ico-green">✓</span>{s}
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="rpt-card">
              <h4>Risks / areas to probe</h4>
              <div className="chk-list">
                {CANDIDATE.risks.map(r => (
                  <div className="chk-item" key={r}>
                    <span className="chk-ico ico-yellow">!</span>{r}
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up questions */}
            <div className="rpt-card">
              <h4>Suggested follow-up questions for next round</h4>
              <div style={{marginTop:4}}>
                {CANDIDATE.followUps.map(q => (
                  <div className="fup-pill" key={q}>{q}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sticky panel */}
          <div className="right-panel">
            <div className="sticky-panel">
              <div className="rpt-card" style={{marginBottom:14}}>
                <h4>Score breakdown</h4>
                <div className="score-cells" style={{marginBottom:16}}>
                  {[
                    {lbl:"Technical", val:sc.tech},
                    {lbl:"Comm.",     val:sc.comm},
                    {lbl:"Confidence",val:sc.conf},
                    {lbl:"Problem",   val:sc.prob},
                  ].map(s=>(
                    <div className="sc-cell" key={s.lbl}>
                      <div className="sc-cell-lbl">{s.lbl}</div>
                      <div className="sc-cell-num" style={{color:scoreColor(s.val)}}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <ScoreBars items={[
                  {name:"Technical",      val:sc.tech,    color:"#818cf8"},
                  {name:"Communication",  val:sc.comm,    color:"#38bdf8"},
                  {name:"Confidence",     val:sc.conf,    color:"#a78bfa"},
                  {name:"Problem solving",val:sc.prob,    color:"#c084fc"},
                  {name:"Culture fit",    val:sc.culture, color:"#4ade80"},
                ]} />
              </div>

              {/* culture fit mini */}
              <div className="rpt-card">
                <h4>Culture fit — {sc.culture}/100</h4>
                <div className="trait-list">
                  {CANDIDATE.culture.traits.map(t=>(
                    <div className="trait-item" key={t.name}>
                      <span className="trait-dot" style={{background:t.dot}} />
                      <span className="trait-name">{t.name}</span>
                      <span className={`trait-rating ${t.rating==="Strong"?"tr-strong":t.rating==="Moderate"?"tr-moderate":"tr-weak"}`}>
                        {t.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CULTURE TAB ── */}
      {tab === "culture" && (
        <div className="anim-4">
          <div className="rpt-card" style={{marginBottom:14}}>
            <h4>Culture fit summary</h4>
            <p>{CANDIDATE.culture.summary}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
            {CANDIDATE.culture.traits.map(t=>(
              <div className="rpt-card" key={t.name} style={{marginBottom:0}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:t.dot,flexShrink:0,display:"inline-block"}} />
                  <span style={{fontFamily:"var(--font-syne)",fontSize:13,fontWeight:600,color:"#fff"}}>{t.name}</span>
                  <span className={`trait-rating ${t.rating==="Strong"?"tr-strong":t.rating==="Moderate"?"tr-moderate":"tr-weak"}`} style={{marginLeft:"auto",fontSize:12}}>
                    {t.rating}
                  </span>
                </div>
                <p style={{fontSize:12,color:"#4f4e6a",lineHeight:1.55}}>
                  {t.rating==="Strong" ? "Demonstrated clearly across multiple answers with specific examples." :
                   t.rating==="Moderate" ? "Present but could benefit from further probing in the next round." :
                   "Limited evidence observed — worth exploring directly."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TRANSCRIPT TAB ── */}
      {tab === "transcript" && (
        <div className="rpt-card anim-4">
          <h4>Full interview transcript · {CANDIDATE.duration}</h4>
          <div className="tx-list">
            {CANDIDATE.transcript.map((t,i)=>(
              <div className="tx-turn" key={i}>
                <span className={`tx-badge ${t.role==="ai"?"tx-ai":"tx-user"}`}>
                  {t.role==="ai"?"Nervo":"Candidate"}
                </span>
                <span className="tx-text">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}