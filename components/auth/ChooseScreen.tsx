"use client";

import { GoogleButton, AuthDivider, FooterNote, AuthFieldStyles } from "./AuthFormFields";

interface Props {
  onCompany:   () => void;
  onCandidate: () => void;
  onSignIn:    () => void;
  onGoogle:    () => void;
  loading:     boolean;
}

export default function ChooseScreen({ onCompany, onCandidate, onSignIn, onGoogle, loading }: Props) {
  return (
    <>
      <AuthFieldStyles />
      <style>{`
        .cs-header { margin-bottom: 28px; }
        .cs-header h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 24px; font-weight: 700; letter-spacing: -0.4px;
          color: #fff; margin-bottom: 6px;
        }
        .cs-header p { font-size: 13px; font-weight: 300; color: #8b8aa6; }

        .cs-cards { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .cs-card {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 20px; border-radius: 14px; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          text-align: left; width: 100%;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .cs-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-1px); }
        .cs-card.company:hover   { border-color: rgba(124,58,237,0.5); }
        .cs-card.candidate:hover { border-color: rgba(8,145,178,0.5);  }

        .cs-icon {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .ci-company   { background: rgba(124,58,237,0.14); border: 1px solid rgba(124,58,237,0.25); }
        .ci-candidate { background: rgba(8,145,178,0.14);  border: 1px solid rgba(8,145,178,0.25);  }

        .cs-text { flex: 1; }
        .cs-title { font-size: 14px; font-weight: 500; color: #fff; margin-bottom: 3px; }
        .cs-desc  { font-size: 12px; font-weight: 300; color: #8b8aa6; line-height: 1.5; }
        .cs-arrow { font-size: 14px; color: #4f4e6a; flex-shrink: 0; }

        .cs-signin-btn {
          width: 100%; padding: 12px; border-radius: 10px; cursor: pointer;
          background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: #8b8aa6; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 400;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .cs-signin-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.18); color: #fff; }
      `}</style>

      <div className="cs-header">
        <h2>Get started with Nervo</h2>
        <p>Free to start — no credit card required.</p>
      </div>


      <AuthDivider text="or choose how you'll use Nervo" />

      {/* Audience picker */}
      <div className="cs-cards" style={{ marginTop: 20 }}>
        <button className="cs-card company" onClick={onCompany}>
          <div className="cs-icon ci-company">🏢</div>
          <div className="cs-text">
            <div className="cs-title">I'm hiring</div>
            <div className="cs-desc">Automate interviews and find culture-fit candidates</div>
          </div>
          <span className="cs-arrow">→</span>
        </button>

        <button className="cs-card candidate" onClick={onCandidate}>
          <div className="cs-icon ci-candidate">🎯</div>
          <div className="cs-text">
            <div className="cs-title">I'm job hunting</div>
            <div className="cs-desc">Practice AI interviews and improve before the real thing</div>
          </div>
          <span className="cs-arrow">→</span>
        </button>
      </div>

      <AuthDivider text="already have an account?" />
      <button className="cs-signin-btn" style={{ marginTop: 16 }} onClick={onSignIn}>
        Sign in
      </button>
    </>
  );
}