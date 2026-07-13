"use client";

import { useState } from "react";
import {
  Building2, Users, CreditCard, Bell, Plug,
  Check, Loader2, Mail, Trash2, UserPlus,
  Globe, ShieldCheck, Zap,
} from "lucide-react";
import { CompaniesStyles } from "@/components/companies-ui";
import { useCompanyProfile } from "@/lib/hooks/useCompanyData";

type Tab = "Profile" | "Team" | "Billing" | "Notifications" | "Integrations";

const TABS: { key: Tab; icon: React.ElementType }[] = [
  { key: "Profile",       icon: Building2 },
  { key: "Team",          icon: Users },
  { key: "Billing",       icon: CreditCard },
  { key: "Notifications", icon: Bell },
  { key: "Integrations",  icon: Plug },
];

const TEAM = [
  { id: 1, name: "You",        email: "you@company.com",   role: "Owner",  avatar: "YO", bg: "linear-gradient(135deg,#7c3aed,#4f46e5)" },
  { id: 2, name: "Sarah Chen", email: "sarah@company.com", role: "Admin",  avatar: "SC", bg: "linear-gradient(135deg,#0891b2,#6366f1)" },
  { id: 3, name: "David Osei", email: "david@company.com", role: "Member", avatar: "DO", bg: "linear-gradient(135deg,#059669,#0891b2)" },
];

const INTEGRATIONS = [
  { id: "gmail",   name: "Gmail",   desc: "Auto-detect applications sent to your inbox.", icon: Mail,  status: "Coming soon" },
  { id: "outlook", name: "Outlook", desc: "Auto-detect applications sent to your inbox.", icon: Mail,  status: "Coming soon" },
  { id: "slack",   name: "Slack",   desc: "Get notified in Slack when candidates apply.", icon: Zap,   status: "Coming soon" },
];

export default function SettingsPage() {
  const { companyName: savedName, loading } = useCompanyProfile();
  const [tab, setTab] = useState<Tab>("Profile");

  // ── Profile state ──
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [about, setAbout] = useState("");
  const [saved, setSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Team invite state ──
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [inviteSent, setInviteSent] = useState(false);

  // ── Notifications state ──
  const [notifs, setNotifs] = useState({
    newApplicant:   true,
    interviewDone:  true,
    weeklyDigest:   true,
    capReached:     true,
    productUpdates: false,
  });

  function toggleNotif(key: keyof typeof notifs) {
    setNotifs(n => ({ ...n, [key]: !n[key] }));
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    // TODO: persist to Firestore
    // await updateDoc(doc(db, "users", user.uid), { companyName, website, industry, about });
    await new Promise(r => setTimeout(r, 700));
    setSavingProfile(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function handleInvite() {
    if (!inviteEmail.trim()) return;
    // TODO: send real invite email + write pendingInvites/{id} to Firestore
    setInviteSent(true);
    setInviteEmail("");
    setTimeout(() => setInviteSent(false), 2200);
  }

  return (
    <>
      <CompaniesStyles />
      <style>{`
        .set-wrap { display: grid; grid-template-columns: 210px 1fr; gap: 24px; align-items: start; }

        .set-nav {
          display: flex; flex-direction: column; gap: 3px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 8px;
        }
        .set-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px; cursor: pointer;
          font-size: 13px; color: #8b8aa6; background: transparent; border: 1px solid transparent;
          transition: background 0.16s, color 0.16s;
        }
        .set-nav-item:hover { background: rgba(255,255,255,0.03); }
        .set-nav-item.on {
          background: rgba(124,58,237,0.13); border-color: rgba(124,58,237,0.25); color: #c4b5fd;
        }
        .set-nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }

        .set-panel {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 28px;
        }
        .set-panel-hd { margin-bottom: 22px; }
        .set-panel-hd h2 {
          font-family: var(--font-syne), sans-serif; font-size: 17px; font-weight: 700;
          color: #fff; letter-spacing: -0.3px; margin-bottom: 4px;
          display: flex; align-items: center; gap: 9px;
        }
        .set-panel-hd h2 svg { width: 18px; height: 18px; color: #a78bfa; }
        .set-panel-hd p { font-size: 12.5px; color: #4f4e6a; }

        .set-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .set-label { font-size: 12px; color: #8b8aa6; font-weight: 500; }
        .set-input, .set-textarea, .set-select {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 13.5px; font-family: var(--font-dm-sans), sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .set-input:focus, .set-textarea:focus, .set-select:focus { border-color: rgba(124,58,237,0.5); }
        .set-textarea { resize: vertical; min-height: 90px; }
        .set-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .set-save-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 9px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff;
          font-family: var(--font-dm-sans), sans-serif; font-size: 13px; font-weight: 500;
        }
        .set-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .set-save-btn svg { width: 15px; height: 15px; }
        .set-saved-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; color: #4ade80; margin-left: 10px;
        }
        .set-saved-tag svg { width: 14px; height: 14px; }

        /* team */
        .team-row {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 4px; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .team-row:last-child { border-bottom: none; }
        .team-info { flex: 1; min-width: 0; }
        .team-name { font-size: 13px; font-weight: 500; color: #fff; }
        .team-email { font-size: 11.5px; color: #4f4e6a; }
        .team-role-tag {
          font-size: 11px; padding: 4px 11px; border-radius: 999px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); color: #8b8aa6;
        }
        .team-role-tag.owner { background: rgba(124,58,237,0.13); border-color: rgba(124,58,237,0.28); color: #c4b5fd; }
        .team-remove {
          background: none; border: none; cursor: pointer; color: #4f4e6a;
          padding: 6px; border-radius: 7px; transition: color 0.2s, background 0.2s;
        }
        .team-remove:hover { color: #f87171; background: rgba(248,113,113,0.08); }
        .team-remove svg { width: 15px; height: 15px; }

        .invite-row { display: flex; gap: 8px; margin-top: 18px; }
        .invite-row .set-select { flex-shrink: 0; width: 130px; }

        /* billing */
        .plan-card {
          border-radius: 14px; padding: 20px 22px; margin-bottom: 20px;
          background: linear-gradient(135deg, rgba(124,58,237,0.11), rgba(59,130,246,0.06));
          border: 1px solid rgba(124,58,237,0.22);
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
        }
        .plan-name {
          font-family: var(--font-syne), sans-serif; font-size: 16px; font-weight: 700; color: #fff;
          display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
        }
        .plan-name svg { width: 16px; height: 16px; color: #a78bfa; }
        .plan-desc { font-size: 12px; color: #8b8aa6; }
        .plan-price { font-family: var(--font-syne), sans-serif; font-size: 22px; font-weight: 800; color: #fff; text-align: right; }
        .plan-price span { font-size: 11px; font-weight: 400; color: #4f4e6a; display: block; }

        .billing-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 4px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px;
        }
        .billing-row:last-child { border-bottom: none; }
        .billing-row-label { color: #8b8aa6; }
        .billing-row-val { color: #fff; font-weight: 500; }

        /* notifications */
        .notif-row {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          padding: 14px 4px; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .notif-row:last-child { border-bottom: none; }
        .notif-title { font-size: 13px; color: #fff; font-weight: 500; margin-bottom: 2px; }
        .notif-desc { font-size: 11.5px; color: #4f4e6a; }

        .switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .switch-track {
          position: absolute; inset: 0; border-radius: 999px; cursor: pointer;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.2s;
        }
        .switch input:checked + .switch-track { background: linear-gradient(135deg,#7c3aed,#4f46e5); border-color: transparent; }
        .switch-thumb {
          position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%;
          background: #fff; transition: transform 0.2s;
        }
        .switch input:checked ~ .switch-thumb { transform: translateX(18px); }

        /* integrations */
        .integ-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 4px; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .integ-row:last-child { border-bottom: none; }
        .integ-icon {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2);
        }
        .integ-icon svg { width: 17px; height: 17px; color: #a78bfa; }
        .integ-info { flex: 1; min-width: 0; }
        .integ-name { font-size: 13px; font-weight: 500; color: #fff; }
        .integ-desc { font-size: 11.5px; color: #4f4e6a; }
        .integ-status {
          font-size: 11px; padding: 4px 11px; border-radius: 999px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); color: #4f4e6a;
          white-space: nowrap;
        }

        @media (max-width: 760px) {
          .set-wrap { grid-template-columns: 1fr; }
          .set-nav { flex-direction: row; overflow-x: auto; }
          .set-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="set-wrap">
        {/* ── Side nav ── */}
        <div className="set-nav anim-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <div
                key={t.key}
                className={`set-nav-item ${tab === t.key ? "on" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <Icon />
                {t.key}
              </div>
            );
          })}
        </div>

        {/* ── Panel ── */}
        <div className="set-panel anim-2">

          {/* Profile */}
          {tab === "Profile" && (
            <>
              <div className="set-panel-hd">
                <h2><Building2 />Company profile</h2>
                <p>This information appears on your candidate-facing interview pages.</p>
              </div>

              <div className="set-field">
                <label className="set-label">Company name</label>
                <input
                  className="set-input"
                  placeholder={loading ? "Loading…" : savedName || "e.g. Acme Inc."}
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>

              <div className="set-row-2">
                <div className="set-field">
                  <label className="set-label">Website</label>
                  <input
                    className="set-input"
                    placeholder="https://acme.com"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                  />
                </div>
                <div className="set-field">
                  <label className="set-label">Industry</label>
                  <input
                    className="set-input"
                    placeholder="e.g. SaaS, Fintech"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                  />
                </div>
              </div>

              <div className="set-field">
                <label className="set-label">About the company</label>
                <textarea
                  className="set-textarea"
                  placeholder="A short description candidates will see before their interview."
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                />
              </div>

              <button className="set-save-btn" disabled={savingProfile} onClick={handleSaveProfile}>
                {savingProfile ? <Loader2 className="spin" /> : <Check />}
                {savingProfile ? "Saving…" : "Save changes"}
              </button>
              {saved && <span className="set-saved-tag"><Check />Saved</span>}
            </>
          )}

          {/* Team */}
          {tab === "Team" && (
            <>
              <div className="set-panel-hd">
                <h2><Users />Team members</h2>
                <p>Invite teammates to review candidates and manage campaigns together.</p>
              </div>

              <div>
                {TEAM.map(m => (
                  <div className="team-row" key={m.id}>
                    <div className="avatar" style={{ background: m.bg }}>{m.avatar}</div>
                    <div className="team-info">
                      <div className="team-name">{m.name}</div>
                      <div className="team-email">{m.email}</div>
                    </div>
                    <span className={`team-role-tag ${m.role === "Owner" ? "owner" : ""}`}>{m.role}</span>
                    {m.role !== "Owner" && (
                      <button className="team-remove"><Trash2 /></button>
                    )}
                  </div>
                ))}
              </div>

              <div className="invite-row">
                <input
                  className="set-input"
                  placeholder="teammate@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
                <select className="set-select" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  <option>Member</option>
                  <option>Admin</option>
                </select>
                <button className="set-save-btn" onClick={handleInvite}>
                  <UserPlus />
                  Invite
                </button>
              </div>
              {inviteSent && <span className="set-saved-tag"><Check />Invite sent</span>}
            </>
          )}

          {/* Billing */}
          {tab === "Billing" && (
            <>
              <div className="set-panel-hd">
                <h2><CreditCard />Billing</h2>
                <p>Manage your plan and payment details.</p>
              </div>

              <div className="plan-card">
                <div>
                  <div className="plan-name"><ShieldCheck />Growth plan</div>
                  <div className="plan-desc">Up to 5 active campaigns, unlimited interviews</div>
                </div>
                <div className="plan-price">$149<span>/ month</span></div>
              </div>

              <div>
                <div className="billing-row">
                  <span className="billing-row-label">Payment method</span>
                  <span className="billing-row-val">•••• 4242</span>
                </div>
                <div className="billing-row">
                  <span className="billing-row-label">Next billing date</span>
                  <span className="billing-row-val">Aug 8, 2026</span>
                </div>
                <div className="billing-row">
                  <span className="billing-row-label">Billing email</span>
                  <span className="billing-row-val">billing@company.com</span>
                </div>
              </div>

              <button className="set-save-btn" style={{ marginTop: 18 }}>
                <CreditCard />
                Manage subscription
              </button>
            </>
          )}

          {/* Notifications */}
          {tab === "Notifications" && (
            <>
              <div className="set-panel-hd">
                <h2><Bell />Notifications</h2>
                <p>Choose what you get notified about.</p>
              </div>

              {[
                { key: "newApplicant",   title: "New applicant",           desc: "When a candidate applies to one of your campaigns." },
                { key: "interviewDone",  title: "Interview completed",     desc: "When a candidate finishes their AI interview." },
                { key: "capReached",     title: "Applicant cap reached",   desc: "When a campaign's link auto-closes." },
                { key: "weeklyDigest",   title: "Weekly digest",           desc: "A summary of activity across all campaigns." },
                { key: "productUpdates", title: "Product updates",         desc: "News about new Nervo features." },
              ].map(n => (
                <div className="notif-row" key={n.key}>
                  <div>
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-desc">{n.desc}</div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifs[n.key as keyof typeof notifs]}
                      onChange={() => toggleNotif(n.key as keyof typeof notifs)}
                    />
                    <span className="switch-track" />
                    <span className="switch-thumb" />
                  </label>
                </div>
              ))}
            </>
          )}

          {/* Integrations */}
          {tab === "Integrations" && (
            <>
              <div className="set-panel-hd">
                <h2><Plug />Integrations</h2>
                <p>Connect the tools you already use.</p>
              </div>

              {INTEGRATIONS.map(i => {
                const Icon = i.icon;
                return (
                  <div className="integ-row" key={i.id}>
                    <div className="integ-icon"><Icon /></div>
                    <div className="integ-info">
                      <div className="integ-name">{i.name}</div>
                      <div className="integ-desc">{i.desc}</div>
                    </div>
                    <span className="integ-status">{i.status}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}