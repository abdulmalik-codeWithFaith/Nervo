"use client";

import { useState } from "react";
import {
  TextField, PasswordField,
  GoogleButton, AuthDivider, ErrorBanner,
  SubmitButton, BackButton, FooterNote,
} from "./AuthFormFields";
import { useAuthActions } from "../../lib/hooks/useAuth";

interface Props {
  onBack:         () => void;
  onSignUp:       () => void;
  onForgot:       () => void;
  onSuccess:      () => void;
}

export default function SignIn({ onBack, onSignUp, onForgot, onSuccess }: Props) {
  const { loading, error, signIn, signInWithGoogle } = useAuthActions();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const valid = email && password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    try {
      await signIn(email, password);
      onSuccess();
    } catch {}
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle();
      onSuccess();
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BackButton onClick={onBack} />

      <div style={{ marginBottom: 6 }}>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.4, marginBottom: 4 }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: "#8b8aa6" }}>Sign in to your Nervo account.</p>
      </div>

      <GoogleButton onClick={handleGoogle} loading={loading} label="Continue with Google" />
      <AuthDivider text="or sign in with email" />

      <ErrorBanner message={error} />

      <TextField     label="Email"    placeholder="you@example.com" value={email}    onChange={setEmail}    type="email" />
      <PasswordField label="Password" placeholder="Your password"   value={password} onChange={setPassword} />

      {/* Forgot password inline link */}
      <button
        type="button"
        onClick={onForgot}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 12, color: "#6d5acf", alignSelf: "flex-end",
          fontFamily: "var(--font-dm-sans)", marginTop: -6,
          transition: "color 0.2s",
        }}
      >
        Forgot password?
      </button>

      <SubmitButton label="Sign in →" loadingLabel="Signing in…" loading={loading} disabled={!valid} />
      <FooterNote text="Don't have an account?" actionLabel="Get started free" onClick={onSignUp} />
    </form>
  );
}