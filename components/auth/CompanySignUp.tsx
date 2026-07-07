"use client";

import { useState } from "react";
import {
  TextField, PasswordField, SelectField,
  GoogleButton, AuthDivider, ErrorBanner,
  SubmitButton, TermsCheckbox, BackButton, FooterNote,
} from "./AuthFormFields";
import { useAuthActions } from "../../lib/hooks/useAuth";

interface Props {
  onBack:     () => void;
  onSignIn:   () => void;
  onSuccess:  () => void;
}

export default function CompanySignUp({ onBack, onSignIn, onSuccess }: Props) {
  const { loading, error, signUpCompany, signInWithGoogle } = useAuthActions();

  const [name,    setName]    = useState("");
  const [company, setCompany] = useState("");
  const [email,   setEmail]   = useState("");
  const [password,setPassword]= useState("");
  const [role,    setRole]    = useState("");
  const [agreed,  setAgreed]  = useState(false);

  const valid = name && company && email && password && role && agreed;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    try {
      await signUpCompany({ name, company, email, password, role });
      onSuccess();
    } catch {}
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle("company");
      onSuccess();
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BackButton onClick={onBack} />

      <div style={{ marginBottom: 6 }}>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.4, marginBottom: 4 }}>
          Set up your hiring account
        </h2>
        <p style={{ fontSize: 13, color: "#8b8aa6" }}>Your first campaign is free.</p>
      </div>

      <GoogleButton onClick={handleGoogle} loading={loading} label="Sign up with Google" />
      <AuthDivider text="or sign up with email" />

      <ErrorBanner message={error} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <TextField label="Your name"    placeholder="Jane Smith"  value={name}    onChange={setName}    />
        <TextField label="Company name" placeholder="Acme Inc."   value={company} onChange={setCompany} />
      </div>
      <TextField    label="Work email"  placeholder="jane@acme.com"  value={email}    onChange={setEmail}    type="email" />
      <PasswordField                    placeholder="Min. 6 characters" value={password} onChange={setPassword} />
      <SelectField
        label="Your role"
        value={role}
        onChange={setRole}
        placeholder="Select your role"
        options={["Founder / CEO", "HR Manager", "Recruiter", "Hiring Manager", "Other"]}
      />

      <TermsCheckbox id="agree-company" checked={agreed} onChange={setAgreed} />
      <SubmitButton label="Create hiring account →" loadingLabel="Creating account…" loading={loading} disabled={!valid} />
      <FooterNote text="Already have an account?" actionLabel="Sign in" onClick={onSignIn} />
    </form>
  );
}