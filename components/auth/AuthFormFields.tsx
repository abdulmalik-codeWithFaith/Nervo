// ─────────────────────────────────────────────────────────
//  components/auth/AuthFormFields.tsx
//  Small reusable input/button primitives shared by every
//  auth screen. Keeps the screen components tiny.
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";

/* ── Styles injected once per page that uses these ── */
export function AuthFieldStyles() {
  return (
    <style>{`
      .af-field { display: flex; flex-direction: column; gap: 6px; }
      .af-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .af-label { font-size: 12px; font-weight: 500; color: #8b8aa6; letter-spacing: 0.04em; }
      .af-input-wrap { position: relative; }
      .af-input {
        width: 100%; padding: 11px 14px; border-radius: 10px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff; font-family: var(--font-dm-sans), sans-serif;
        font-size: 14px; font-weight: 300; outline: none;
        transition: border-color 0.2s, background 0.2s;
        -webkit-appearance: none;
      }
      .af-input::placeholder { color: #4f4e6a; }
      .af-input:focus { border-color: rgba(124,58,237,0.6); background: rgba(124,58,237,0.06); }
      .af-input.error { border-color: rgba(239,68,68,0.5); }
      select.af-input { color: #8b8aa6; cursor: pointer; }
      select.af-input option { background: #0e0e1f; color: #fff; }

      .af-pw-toggle {
        position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
        background: none; border: none; cursor: pointer;
        font-size: 13px; color: #4f4e6a; padding: 2px 4px;
        transition: color 0.2s;
      }
      .af-pw-toggle:hover { color: #8b8aa6; }

      .af-checkbox-row { display: flex; align-items: flex-start; gap: 10px; }
      .af-checkbox-row input[type="checkbox"] {
        width: 16px; height: 16px; min-width: 16px;
        border-radius: 4px; margin-top: 1px; cursor: pointer;
        accent-color: #7c3aed;
      }
      .af-checkbox-row label {
        font-size: 12px; font-weight: 300; color: #8b8aa6;
        line-height: 1.55; cursor: pointer; letter-spacing: 0;
      }
      .af-checkbox-row label a { color: #a78bfa; text-decoration: none; }
      .af-checkbox-row label a:hover { text-decoration: underline; }

      .af-btn-submit {
        width: 100%; padding: 14px;
        border-radius: 10px; border: none; cursor: pointer;
        background: linear-gradient(135deg, #7c3aed, #4f46e5);
        color: #fff; font-family: var(--font-dm-sans), sans-serif;
        font-size: 15px; font-weight: 500;
        box-shadow: 0 0 28px rgba(124,58,237,0.35);
        transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        display: flex; align-items: center; justify-content: center; gap: 8px;
      }
      .af-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 0 44px rgba(124,58,237,0.55); }
      .af-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .af-spinner {
        width: 15px; height: 15px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
        animation: af-spin 0.7s linear infinite;
      }
      @keyframes af-spin { to { transform: rotate(360deg); } }

      .af-oauth-group { display: flex; flex-direction: column; gap: 10px; }
      .af-btn-oauth {
        width: 100%; padding: 12px 16px; border-radius: 10px; cursor: pointer;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #c4b5fd; font-family: var(--font-dm-sans), sans-serif;
        font-size: 13px; font-weight: 400;
        display: flex; align-items: center; justify-content: center; gap: 10px;
        transition: background 0.2s, border-color 0.2s, opacity 0.2s;
      }
      .af-btn-oauth:hover:not(:disabled) { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.18); }
      .af-btn-oauth:disabled { opacity: 0.5; cursor: not-allowed; }

      .af-divider { display: flex; align-items: center; gap: 14px; }
      .af-divider::before, .af-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
      .af-divider span { font-size: 12px; color: #4f4e6a; white-space: nowrap; }

      .af-error-banner {
        display: flex; align-items: center; gap: 8px;
        padding: 11px 14px; border-radius: 10px;
        background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
        font-size: 12px; color: #f87171; line-height: 1.5;
      }

      .af-footer-note {
        font-size: 12px; font-weight: 300; color: #4f4e6a;
        text-align: center; line-height: 1.6;
      }
      .af-footer-note button {
        background: none; border: none; cursor: pointer;
        color: #a78bfa; font-size: 12px;
        font-family: var(--font-dm-sans), sans-serif;
        transition: color 0.2s;
      }
      .af-footer-note button:hover { color: #c4b5fd; }

      .af-back {
        display: inline-flex; align-items: center; gap: 6px; margin-bottom: 28px;
        font-size: 13px; font-weight: 400; color: #4f4e6a;
        background: none; border: none; cursor: pointer;
        font-family: var(--font-dm-sans), sans-serif;
        transition: color 0.2s;
      }
      .af-back:hover { color: #8b8aa6; }

      .af-forgot-link {
        font-size: 12px; color: #6d5acf; text-decoration: none;
        align-self: flex-end; margin-top: -8px;
        background: none; border: none; cursor: pointer;
        font-family: var(--font-dm-sans), sans-serif;
        transition: color 0.2s;
      }
      .af-forgot-link:hover { color: #a78bfa; }
    `}</style>
  );
}

/* ── Text input ── */
interface TextFieldProps {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; required?: boolean; error?: boolean;
}
export function TextField({ label, type = "text", placeholder, value, onChange, error }: TextFieldProps) {
  return (
    <div className="af-field">
      <label className="af-label">{label}</label>
      <input
        type={type}
        className={`af-input ${error ? "error" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

/* ── Password input with show/hide toggle ── */
interface PasswordFieldProps {
  label?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; error?: boolean;
}
export function PasswordField({ label = "Password", placeholder = "Min. 6 characters", value, onChange, error }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="af-field">
      <label className="af-label">{label}</label>
      <div className="af-input-wrap">
        <input
          type={show ? "text" : "password"}
          className={`af-input ${error ? "error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ paddingRight: 44 }}
        />
        <button type="button" className="af-pw-toggle" onClick={() => setShow(s => !s)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

/* ── Select dropdown ── */
interface SelectFieldProps {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}
export function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div className="af-field">
      <label className="af-label">{label}</label>
      <select className="af-input" value={value} onChange={e => onChange(e.target.value)}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ── Submit button with loading spinner ── */
interface SubmitButtonProps {
  label: string; loadingLabel?: string; loading?: boolean; disabled?: boolean; onClick?: () => void;
}
export function SubmitButton({ label, loadingLabel = "Please wait…", loading, disabled }: SubmitButtonProps) {
  return (
    <button type="submit" className="af-btn-submit" disabled={disabled || loading}>
      {loading ? (<><span className="af-spinner" />{loadingLabel}</>) : label}
    </button>
  );
}

/* ── Google OAuth button ── */
interface GoogleButtonProps { onClick: () => void; loading?: boolean; label?: string; }
export function GoogleButton({ onClick, loading, label = "Continue with Google" }: GoogleButtonProps) {
  return (
    <button type="button" className="af-btn-oauth" onClick={onClick} disabled={loading}>
      <span style={{ fontSize: 16 }}>G</span>{label}
    </button>
  );
}

/* ── "or" divider ── */
export function AuthDivider({ text }: { text: string }) {
  return <div className="af-divider"><span>{text}</span></div>;
}

/* ── Error banner ── */
export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return <div className="af-error-banner">⚠ {message}</div>;
}

/* ── Terms checkbox ── */
interface TermsCheckboxProps { checked: boolean; onChange: (v: boolean) => void; id: string; }
export function TermsCheckbox({ checked, onChange, id }: TermsCheckboxProps) {
  return (
    <div className="af-checkbox-row">
      <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} />
      <label htmlFor={id}>
        I agree to Nervo's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
      </label>
    </div>
  );
}

/* ── Back button ── */
export function BackButton({ onClick }: { onClick: () => void }) {
  return <button className="af-back" onClick={onClick}>← Back</button>;
}

/* ── Footer switch link (e.g. "Already have an account? Sign in") ── */
interface FooterNoteProps { text: string; actionLabel: string; onClick: () => void; }
export function FooterNote({ text, actionLabel, onClick }: FooterNoteProps) {
  return (
    <p className="af-footer-note">
      {text} <button onClick={onClick}>{actionLabel}</button>
    </p>
  );
}