"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "choose" | "company" | "candidate" | "signin";

export default function GetStartedPage() {
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #05050f;
          color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        /* ── Ambient glows ── */
        .glow-tl {
          position: fixed; top: -180px; left: -180px;
          width: 560px; height: 560px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%);
        }
        .glow-br {
          position: fixed; bottom: -120px; right: -120px;
          width: 500px; height: 500px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 70%);
        }

        /* ── Layout ── */
        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative; z-index: 1;
        }

        /* ── Left panel ── */
        .left-panel {
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 40px 56px;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #7c3aed, #4f46e5, #38bdf8);
        }

        .panel-logo {
          font-family: var(--font-syne), sans-serif;
          font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
        }

        .panel-content {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 40px 0;
        }

        .panel-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: #7c3aed; margin-bottom: 16px;
        }

        .panel-heading {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(28px, 3vw, 42px); font-weight: 800;
          line-height: 1.08; letter-spacing: -1px; color: #fff;
          margin-bottom: 18px;
        }
        .panel-heading .grad {
          background: linear-gradient(120deg, #c084fc 10%, #818cf8 55%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .panel-body {
          font-size: 15px; font-weight: 300; color: #8b8aa6;
          line-height: 1.7; max-width: 380px; margin-bottom: 36px;
        }

        .panel-proof {
          display: flex; flex-direction: column; gap: 14px;
        }
        .proof-item {
          display: flex; align-items: flex-start; gap: 12px;
        }
        .proof-icon {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.2);
        }
        .proof-text { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }
        .proof-text strong { color: #c4b5fd; font-weight: 500; }

        .panel-quote {
          margin-top: 40px; padding: 20px 22px;
          background: rgba(255,255,255,0.03); border-radius: 12px;
          border-left: 3px solid rgba(124,58,237,0.6);
        }
        .panel-quote p {
          font-size: 13px; font-weight: 300; color: #8b8aa6;
          line-height: 1.65; font-style: italic;
        }
        .panel-quote cite {
          display: block; margin-top: 8px;
          font-size: 11px; font-style: normal; font-weight: 500;
          color: #4f4e6a; letter-spacing: 0.05em;
        }

        .panel-footer {
          font-size: 12px; font-weight: 300; color: #4f4e6a;
        }
        .panel-footer a { color: #6d5acf; text-decoration: none; }
        .panel-footer a:hover { color: #a78bfa; }

        /* ── Right panel ── */
        .right-panel {
          display: flex; align-items: center; justify-content: center;
          padding: 40px 56px;
        }

        .form-shell {
          width: 100%; max-width: 420px;
          display: flex; flex-direction: column; gap: 0;
          animation: fadeUp 0.45s ease both;
        }

        /* ── Choose screen ── */
        .choose-header { margin-bottom: 36px; }
        .choose-header h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 26px; font-weight: 700; letter-spacing: -0.5px;
          color: #fff; margin-bottom: 8px;
        }
        .choose-header p { font-size: 14px; font-weight: 300; color: #8b8aa6; line-height: 1.6; }

        .choice-cards { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }

        .choice-card {
          display: flex; align-items: center; gap: 16px;
          padding: 20px 22px; border-radius: 14px; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          text-align: left; width: 100%;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .choice-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(124,58,237,0.4);
          transform: translateY(-1px);
        }
        .choice-card.company:hover { border-color: rgba(124,58,237,0.5); }
        .choice-card.candidate:hover { border-color: rgba(8,145,178,0.5); }

        .choice-icon {
          width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
        }
        .ci-company  { background: rgba(124,58,237,0.14); border: 1px solid rgba(124,58,237,0.25); }
        .ci-candidate{ background: rgba(8,145,178,0.14);  border: 1px solid rgba(8,145,178,0.25);  }

        .choice-text { flex: 1; }
        .choice-title {
          font-size: 15px; font-weight: 500; color: #fff; margin-bottom: 3px;
        }
        .choice-desc { font-size: 12px; font-weight: 300; color: #8b8aa6; line-height: 1.5; }

        .choice-arrow { font-size: 16px; color: #4f4e6a; flex-shrink: 0; }

        .divider-or {
          display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
        }
        .divider-or::before, .divider-or::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07);
        }
        .divider-or span { font-size: 12px; color: #4f4e6a; white-space: nowrap; }

        .signin-link-btn {
          width: 100%; padding: 13px; border-radius: 10px; cursor: pointer;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #8b8aa6; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 400;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          text-align: center;
        }
        .signin-link-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.18);
          color: #fff;
        }

        /* ── Form shared ── */
        .form-back {
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 28px;
          font-size: 13px; font-weight: 400; color: #4f4e6a;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
          transition: color 0.2s;
        }
        .form-back:hover { color: #8b8aa6; }

        .form-heading { margin-bottom: 28px; }
        .form-heading h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 24px; font-weight: 700; letter-spacing: -0.4px;
          color: #fff; margin-bottom: 6px;
        }
        .form-heading p { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.6; }

        .field-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        label {
          font-size: 12px; font-weight: 500; color: #8b8aa6;
          letter-spacing: 0.04em;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        select {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 300;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
        }
        input::placeholder { color: #4f4e6a; }
        select { color: #8b8aa6; cursor: pointer; }
        select option { background: #0e0e1f; color: #fff; }

        input:focus, select:focus {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.06);
        }

        .checkbox-row {
          display: flex; align-items: flex-start; gap: 10px;
          margin-bottom: 20px;
        }
        .checkbox-row input[type="checkbox"] {
          width: 16px; height: 16px; min-width: 16px;
          border-radius: 4px; margin-top: 1px; cursor: pointer;
          accent-color: #7c3aed;
        }
        .checkbox-row label {
          font-size: 12px; font-weight: 300; color: #8b8aa6;
          line-height: 1.55; cursor: pointer; letter-spacing: 0;
        }
        .checkbox-row label a { color: #a78bfa; text-decoration: none; }
        .checkbox-row label a:hover { text-decoration: underline; }

        .btn-submit {
          width: 100%; padding: 14px;
          border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 15px; font-weight: 500;
          box-shadow: 0 0 28px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-bottom: 16px;
        }
        .btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 44px rgba(124,58,237,0.55);
        }
        .btn-submit:disabled {
          opacity: 0.45; cursor: not-allowed; transform: none;
        }

        .form-footer-note {
          font-size: 12px; font-weight: 300; color: #4f4e6a;
          text-align: center; line-height: 1.6;
        }
        .form-footer-note button {
          background: none; border: none; cursor: pointer;
          color: #a78bfa; font-size: 12px;
          font-family: var(--font-dm-sans), sans-serif;
          transition: color 0.2s;
        }
        .form-footer-note button:hover { color: #c4b5fd; }

        /* ── OAuth ── */
        .oauth-group {
          display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;
        }
        .btn-oauth {
          width: 100%; padding: 12px 16px; border-radius: 10px; cursor: pointer;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #c4b5fd; font-family: var(--font-dm-sans), sans-serif;
          font-size: 13px; font-weight: 400;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-oauth:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
        }
        .oauth-logo { font-size: 16px; }

        /* ── Sign-in specific ── */
        .forgot-link {
          font-size: 12px; color: #6d5acf; text-decoration: none;
          align-self: flex-end; margin-top: -8px;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #a78bfa; }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .page { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 40px 24px; align-items: flex-start; padding-top: 80px; }
          .form-shell { max-width: 100%; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="glow-tl" aria-hidden="true" />
      <div className="glow-br" aria-hidden="true" />

      <div className="page">

        {/* ── Left panel ── */}
        <div className="left-panel">
          <Link href="/" className="panel-logo">Nervo</Link>

          <div className="panel-content">
            {mode === "company" || mode === "signin" ? (
              <>
                <div className="panel-eyebrow">AI Hiring Assistant</div>
                <h1 className="panel-heading">
                  Stop interviewing<br />everyone.<br />
                  <span className="grad">Interview the right ones.</span>
                </h1>
                <p className="panel-body">
                  Nervo runs first-round interviews at scale — evaluating both technical ability
                  and culture fit — so your team only reviews the candidates who are actually worth your time.
                </p>
                <div className="panel-proof">
                  {[
                    { icon: "⚡", text: <><strong>6× faster</strong> first-round screening vs. manual interviews</> },
                    { icon: "🎯", text: <><strong>Culture fit scoring</strong> alongside technical evaluation</> },
                    { icon: "📊", text: <><strong>Ranked shortlists</strong> with transcripts and hiring recommendations</> },
                  ].map((p, i) => (
                    <div className="proof-item" key={i}>
                      <div className="proof-icon">{p.icon}</div>
                      <p className="proof-text">{p.text}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : mode === "candidate" ? (
              <>
                <div className="panel-eyebrow">Interview Practice</div>
                <h1 className="panel-heading">
                  Practice until<br />the real thing<br />
                  <span className="grad">feels easy.</span>
                </h1>
                <p className="panel-body">
                  Nervo simulates real recruiter interviews based on your resume and target role —
                  with voice questions, live feedback, and scores that show exactly where to improve.
                </p>
                <div className="panel-proof">
                  {[
                    { icon: "🎙", text: <><strong>AI voice interviews</strong> tailored to your resume and job description</> },
                    { icon: "📈", text: <><strong>Scores across 4 dimensions</strong> — technical, communication, confidence, problem-solving</> },
                    { icon: "📄", text: <><strong>Resume analyzer</strong> with ATS score and job match scoring</> },
                  ].map((p, i) => (
                    <div className="proof-item" key={i}>
                      <div className="proof-icon">{p.icon}</div>
                      <p className="proof-text">{p.text}</p>
                    </div>
                  ))}
                </div>
                <div className="panel-quote">
                  <p>"After three Nervo sessions I felt completely different walking into the real interview."</p>
                  <cite>— Software engineer, hired at Series B startup</cite>
                </div>
              </>
            ) : (
              <>
                <div className="panel-eyebrow">AI Hiring Assistant</div>
                <h1 className="panel-heading">
                  Automate hiring.<br />Hire for<br />
                  <span className="grad">culture and skill.</span>
                </h1>
                <p className="panel-body">
                  Whether you're a recruiter looking to screen candidates at scale or a job seeker
                  preparing for your next role — Nervo has you covered.
                </p>
                <div className="panel-proof">
                  {[
                    { icon: "🏢", text: <><strong>For companies</strong> — automate first-round interviews and surface the best candidates</> },
                    { icon: "🎯", text: <><strong>For candidates</strong> — practice with AI and land the role you're aiming for</> },
                    { icon: "🔒", text: <><strong>Your data stays yours</strong> — never sold, never shared</> },
                  ].map((p, i) => (
                    <div className="proof-item" key={i}>
                      <div className="proof-icon">{p.icon}</div>
                      <p className="proof-text">{p.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="panel-footer">
            © 2026 Nervo ·{" "}
            <a href="/privacy">Privacy</a> ·{" "}
            <a href="/terms">Terms</a>
          </p>
        </div>

        {/* ── Right panel ── */}
        <div className="right-panel">

          {/* Choose audience */}
          {mode === "choose" && (
            <div className="form-shell" key="choose">
              <div className="choose-header">
                <h2>Get started with Nervo</h2>
                <p>Create a free account — no credit card required.</p>
              </div>

              <div className="oauth-group">
                <button className="btn-oauth">
                  <span className="oauth-logo">G</span>
                  Continue with Google
                </button>
              </div>

              <div className="divider-or"><span>or choose how you'll use Nervo</span></div>

              <div className="choice-cards">
                <button className="choice-card company" onClick={() => setMode("company")}>
                  <div className="choice-icon ci-company">🏢</div>
                  <div className="choice-text">
                    <div className="choice-title">I'm hiring</div>
                    <div className="choice-desc">Automate interviews and find culture-fit candidates at scale</div>
                  </div>
                  <span className="choice-arrow">→</span>
                </button>

                <button className="choice-card candidate" onClick={() => setMode("candidate")}>
                  <div className="choice-icon ci-candidate">🎯</div>
                  <div className="choice-text">
                    <div className="choice-title">I'm job hunting</div>
                    <div className="choice-desc">Practice AI interviews and improve before the real thing</div>
                  </div>
                  <span className="choice-arrow">→</span>
                </button>
              </div>

              <div className="divider-or"><span>already have an account?</span></div>
              <button className="signin-link-btn" onClick={() => setMode("signin")}>Sign in</button>
            </div>
          )}

          {/* Company sign-up */}
          {mode === "company" && (
            <div className="form-shell" key="company">
              <button className="form-back" onClick={() => setMode("choose")}>← Back</button>
              <div className="form-heading">
                <h2>Set up your hiring account</h2>
                <p>Start screening candidates in minutes. Your first campaign is free.</p>
              </div>

              <div className="oauth-group">
                <button className="btn-oauth">
                  <span className="oauth-logo">G</span>
                  Continue with Google
                </button>
              </div>
              <div className="divider-or"><span>or sign up with email</span></div>

              <div className="field-group">
                <div className="field-row">
                  <div className="field">
                    <label>Your name</label>
                    <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Company name</label>
                    <input type="text" placeholder="Acme Inc." value={company} onChange={e => setCompany(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>Work email</label>
                  <input type="email" placeholder="jane@acme.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="field">
                  <label>Your role</label>
                  <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="" disabled>Select your role</option>
                    <option>Founder / CEO</option>
                    <option>HR Manager</option>
                    <option>Recruiter</option>
                    <option>Hiring Manager</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="checkbox-row">
                <input type="checkbox" id="agree-company" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <label htmlFor="agree-company">
                  I agree to Nervo's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>

              <button
                className="btn-submit"
                disabled={!email || !password || !name || !company || !agreed}
              >
                Create hiring account →
              </button>
              <p className="form-footer-note">
                Already have an account?{" "}
                <button onClick={() => setMode("signin")}>Sign in</button>
              </p>
            </div>
          )}

          {/* Candidate sign-up */}
          {mode === "candidate" && (
            <div className="form-shell" key="candidate">
              <button className="form-back" onClick={() => setMode("choose")}>← Back</button>
              <div className="form-heading">
                <h2>Create your practice account</h2>
                <p>Free to start — no credit card needed. Upload your resume after sign-up.</p>
              </div>

              <div className="oauth-group">
                <button className="btn-oauth">
                  <span className="oauth-logo">G</span>
                  Continue with Google
                </button>
              </div>
              <div className="divider-or"><span>or sign up with email</span></div>

              <div className="field-group">
                <div className="field">
                  <label>Full name</label>
                  <input type="text" placeholder="Alex Johnson" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="alex@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="field">
                  <label>Target role <span style={{ color: "#4f4e6a", fontWeight: 300 }}>(optional)</span></label>
                  <input type="text" placeholder="e.g. Senior Product Designer" value={role} onChange={e => setRole(e.target.value)} />
                </div>
              </div>

              <div className="checkbox-row">
                <input type="checkbox" id="agree-candidate" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <label htmlFor="agree-candidate">
                  I agree to Nervo's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>

              <button
                className="btn-submit"
                disabled={!email || !password || !name || !agreed}
              >
                Start practicing free →
              </button>
              <p className="form-footer-note">
                Already have an account?{" "}
                <button onClick={() => setMode("signin")}>Sign in</button>
              </p>
            </div>
          )}

          {/* Sign in */}
          {mode === "signin" && (
            <div className="form-shell" key="signin">
              <button className="form-back" onClick={() => setMode("choose")}>← Back</button>
              <div className="form-heading">
                <h2>Welcome back</h2>
                <p>Sign in to your Nervo account.</p>
              </div>

              <div className="oauth-group">
                <button className="btn-oauth">
                  <span className="oauth-logo">G</span>
                  Continue with Google
                </button>
              </div>
              <div className="divider-or"><span>or sign in with email</span></div>

              <div className="field-group">
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              <button
                className="btn-submit"
                disabled={!email || !password}
              >
                Sign in →
              </button>
              <p className="form-footer-note">
                Don't have an account?{" "}
                <button onClick={() => setMode("choose")}>Get started free</button>
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}