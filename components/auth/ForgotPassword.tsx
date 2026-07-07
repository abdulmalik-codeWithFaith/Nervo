"use client";

import { useState } from "react";
import {
  TextField, ErrorBanner,
  SubmitButton, BackButton,
} from "./AuthFormFields";
import { useAuthActions } from "../../lib/hooks/useAuth";

interface Props {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: Props) {
  const { loading, error, resetPassword } = useAuthActions();
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await resetPassword(email);
      setSent(true);
    } catch {}
  }

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BackButton onClick={onBack} />
        <div style={{
          textAlign: "center", padding: "32px 24px",
          background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>📬</div>
          <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Check your inbox
          </h3>
          <p style={{ fontSize: 13, color: "#8b8aa6", lineHeight: 1.6 }}>
            We sent a password reset link to <strong style={{ color: "#c4b5fd" }}>{email}</strong>.
            Check your spam folder if you don't see it.
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: "#7c3aed", fontFamily: "var(--font-dm-sans)",
            textAlign: "center", padding: "8px 0",
          }}
        >
          ← Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BackButton onClick={onBack} />

      <div style={{ marginBottom: 6 }}>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.4, marginBottom: 4 }}>
          Reset your password
        </h2>
        <p style={{ fontSize: 13, color: "#8b8aa6", lineHeight: 1.6 }}>
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <ErrorBanner message={error} />
      <TextField label="Email" placeholder="you@example.com" value={email} onChange={setEmail} type="email" />
      <SubmitButton label="Send reset link →" loadingLabel="Sending…" loading={loading} disabled={!email} />
    </form>
  );
}