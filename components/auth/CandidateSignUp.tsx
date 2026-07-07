"use client";

import { useState } from "react";
import {
  TextField, PasswordField,
  GoogleButton, AuthDivider, ErrorBanner,
  SubmitButton, TermsCheckbox, BackButton, FooterNote,
} from "./AuthFormFields";
import { useAuthActions } from "../../lib/hooks/useAuth";

interface Props {
  onBack:    () => void;
  onSignIn:  () => void;
  onSuccess: () => void;
}

export default function CandidateSignUp({ onBack, onSignIn, onSuccess }: Props) {
  const { loading, error, signUpCandidate, signInWithGoogle } = useAuthActions();

  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [agreed,     setAgreed]     = useState(false);

  const valid = name && email && password && agreed;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    try {
      await signUpCandidate({ name, email, password, targetRole });
      onSuccess();
    } catch {}
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle("candidate");
      onSuccess();
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BackButton onClick={onBack} />

      <div style={{ marginBottom: 6 }}>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.4, marginBottom: 4 }}>
          Create your practice account
        </h2>
        <p style={{ fontSize: 13, color: "#8b8aa6" }}>Free to start — no credit card needed.</p>
      </div>

      <GoogleButton onClick={handleGoogle} loading={loading} label="Sign up with Google" />
      <AuthDivider text="or sign up with email" />

      <ErrorBanner message={error} />

      <TextField    label="Full name"   placeholder="Alex Johnson"          value={name}       onChange={setName}       />
      <TextField    label="Email"       placeholder="alex@email.com"         value={email}      onChange={setEmail}      type="email" />
      <PasswordField                    placeholder="Min. 6 characters"      value={password}   onChange={setPassword}   />
      <TextField
        label="Target role"
        placeholder="e.g. Senior Product Designer (optional)"
        value={targetRole}
        onChange={setTargetRole}
      />

      <TermsCheckbox id="agree-candidate" checked={agreed} onChange={setAgreed} />
      <SubmitButton label="Start practising free →" loadingLabel="Creating account…" loading={loading} disabled={!valid} />
      <FooterNote text="Already have an account?" actionLabel="Sign in" onClick={onSignIn} />
    </form>
  );
}