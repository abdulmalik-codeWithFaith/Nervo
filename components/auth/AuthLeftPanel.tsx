"use client";

import Link from "next/link";

type PanelMode = "choose" | "company" | "candidate" | "signin" | "forgot";

const CONTENT: Record<PanelMode, {
  eyebrow: string;
  heading: React.ReactNode;
  body: string;
  proofs: { icon: string; text: React.ReactNode }[];
}> = {
  choose: {
    eyebrow: "AI Hiring Assistant",
    heading: <>Automate hiring.<br />Hire for <span className="grad">culture and skill.</span></>,
    body: "Whether you're a recruiter screening candidates at scale or a job seeker preparing for your next role — Nervo has you covered.",
    proofs: [
      { icon: "🏢", text: <><strong>For companies</strong> — automate first-round interviews and surface the best candidates</> },
      { icon: "🎯", text: <><strong>For candidates</strong> — practice with AI and land the role you're aiming for</> },
      { icon: "🔒", text: <><strong>Your data stays yours</strong> — never sold, never shared</> },
    ],
  },
  company: {
    eyebrow: "AI Hiring Assistant",
    heading: <>Stop interviewing everyone.<br /><span className="grad">Interview the right ones.</span></>,
    body: "Nervo runs first-round interviews at scale — evaluating both technical ability and culture fit — so your team only reviews the candidates who matter.",
    proofs: [
      { icon: "⚡", text: <><strong>6× faster</strong> first-round screening vs. manual interviews</> },
      { icon: "🎯", text: <><strong>Culture fit scoring</strong> alongside technical evaluation</> },
      { icon: "📊", text: <><strong>Ranked shortlists</strong> with transcripts and hiring recommendations</> },
    ],
  },
  candidate: {
    eyebrow: "Interview Practice",
    heading: <>Practice until the real thing<br /><span className="grad">feels easy.</span></>,
    body: "Nervo simulates real recruiter interviews based on your resume and target role — with voice questions, live feedback, and scores that show exactly where to improve.",
    proofs: [
      { icon: "🎙", text: <><strong>AI voice interviews</strong> tailored to your resume and job description</> },
      { icon: "📈", text: <><strong>Scores across 4 dimensions</strong> — technical, communication, confidence, problem-solving</> },
      { icon: "📄", text: <><strong>Resume analyzer</strong> with ATS score and job match scoring</> },
    ],
  },
  signin: {
    eyebrow: "Welcome back",
    heading: <>Good to see<br />you again.<br /><span className="grad">Let's keep going.</span></>,
    body: "Sign back in to access your campaigns, candidate reports, and practice sessions.",
    proofs: [
      { icon: "📋", text: <><strong>Your campaigns</strong> and candidate reports are waiting</> },
      { icon: "📊", text: <><strong>Track your progress</strong> across every practice session</> },
      { icon: "🔒", text: <><strong>Secure sign-in</strong> — your data is always private</> },
    ],
  },
  forgot: {
    eyebrow: "Account recovery",
    heading: <>We'll get you<br /><span className="grad">back in.</span></>,
    body: "Enter your email and we'll send you a link to reset your password. It only takes a moment.",
    proofs: [
      { icon: "📬", text: <><strong>Check your inbox</strong> — the link arrives in under a minute</> },
      { icon: "🔒", text: <><strong>Secure reset</strong> — link expires after 1 hour</> },
    ],
  },
};

export default function AuthLeftPanel({ mode }: { mode: PanelMode }) {
  const c = CONTENT[mode];

  return (
    <>
      <style>{`
        .alp {
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 36px 48px;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
        }
        .alp::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #7c3aed, #4f46e5, #38bdf8);
        }
        .alp-logo {
          font-family: var(--font-syne), sans-serif;
          font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; text-decoration: none;
        }
        .alp-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 32px 0; }
        .alp-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: #7c3aed; margin-bottom: 14px;
        }
        .alp-heading {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(26px, 2.8vw, 40px); font-weight: 800;
          line-height: 1.08; letter-spacing: -1px; color: #fff; margin-bottom: 16px;
        }
        .alp-heading .grad {
          background: linear-gradient(120deg, #c084fc 10%, #818cf8 55%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .alp-sub { font-size: 14px; font-weight: 300; color: #8b8aa6; line-height: 1.7; max-width: 360px; margin-bottom: 28px; }
        .alp-proofs { display: flex; flex-direction: column; gap: 12px; }
        .alp-proof { display: flex; align-items: flex-start; gap: 12px; }
        .alp-proof-icon {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 14px;
          background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.2);
        }
        .alp-proof-text { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }
        .alp-proof-text strong { color: #c4b5fd; font-weight: 500; }
        .alp-footer { font-size: 12px; font-weight: 300; color: #4f4e6a; }
        .alp-footer a { color: #6d5acf; text-decoration: none; }
        .alp-footer a:hover { color: #a78bfa; }

        @media (max-width: 860px) { .alp { display: none; } }
      `}</style>

      <div className="alp">
        <Link href="/" className="alp-logo">Nervo</Link>

        <div className="alp-body">
          <div className="alp-eyebrow">{c.eyebrow}</div>
          <h1 className="alp-heading">{c.heading}</h1>
          <p className="alp-sub">{c.body}</p>
          <div className="alp-proofs">
            {c.proofs.map((p, i) => (
              <div className="alp-proof" key={i}>
                <div className="alp-proof-icon">{p.icon}</div>
                <p className="alp-proof-text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="alp-footer">
          © 2026 Nervo · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
        </p>
      </div>
    </>
  );
}