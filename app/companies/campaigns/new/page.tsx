"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CompaniesStyles } from "@/components/companies-ui";

import { useCompanyProfile, useCreateCampaign } from "@/lib/hooks/useCompanyData";

// ── Helpers ────────────────────────────────────────────────
function generateToken(role: string) {
  const slug = role
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 20);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${slug}-${rand}`;
}

const STEP_LABELS = [
  "Company",
  "Role",
  "Experience",
  "Skills",
  "Other requirements",
  "Applicant cap",
  "Interview slots",
  "Review",
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { companyName: existingCompanyName, loading: companyLoading } = useCompanyProfile();
  const { createCampaign, submitting, error: createError } = useCreateCampaign();

  // If company name already exists, skip step 0
  const startStep = existingCompanyName ? 1 : 0;
  const [step, setStep] = useState(startStep);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    companyName: existingCompanyName || "",
    role: "",
    yearsExperience: "",
    skills: [] as string[],
    skillInput: "",
    otherRequirements: "",
    applicantCap: 20,
    slots: [] as string[],
    slotInput: "",
  });

  const steps = existingCompanyName ? STEP_LABELS.slice(1) : STEP_LABELS;
  const stepIndexForDisplay = existingCompanyName ? step - 1 : step;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function addSkill() {
    const val = form.skillInput.trim();
    if (val && !form.skills.includes(val)) {
      update("skills", [...form.skills, val]);
    }
    update("skillInput", "");
  }

  function removeSkill(skill: string) {
    update("skills", form.skills.filter(s => s !== skill));
  }

  function addSlot() {
    const val = form.slotInput.trim();
    if (val && !form.slots.includes(val)) {
      update("slots", [...form.slots, val]);
    }
    update("slotInput", "");
  }

  function removeSlot(slot: string) {
    update("slots", form.slots.filter(s => s !== slot));
  }

  function canGoNext() {
    switch (step) {
      case 0: return form.companyName.trim().length > 0;
      case 1: return form.role.trim().length > 0;
      case 2: return form.yearsExperience.trim().length > 0;
      case 3: return form.skills.length > 0;
      case 4: return true; // optional
      case 5: return form.applicantCap > 0;
      case 6: return form.slots.length > 0;
      default: return true;
    }
  }

  async function handleGenerate() {
    const token = generateToken(form.role);

    const id = await createCampaign({
      companyName: form.companyName,
      role: form.role,
      yearsExperience: form.yearsExperience,
      skills: form.skills,
      otherRequirements: form.otherRequirements,
      applicantCap: form.applicantCap,
      availableSlots: form.slots,
      linkToken: token,
    });

    if (id) {
      setGeneratedLink(`nervo.vercel.app/apply/${token}`);
    }
  }

  function copyLink() {
    if (!generatedLink) return;
    navigator.clipboard.writeText(`https://${generatedLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const totalSteps = steps.length;

  return (
    <>
      <CompaniesStyles />
      <style>{`
        .wiz-wrap { max-width: 640px; margin: 0 auto; }

        .wiz-progress { display: flex; gap: 6px; margin-bottom: 28px; }
        .wiz-dot {
          flex: 1; height: 4px; border-radius: 999px;
          background: rgba(255,255,255,0.07); transition: background 0.25s;
        }
        .wiz-dot.done   { background: linear-gradient(90deg,#7c3aed,#4f46e5); }
        .wiz-dot.active { background: linear-gradient(90deg,#7c3aed,#4f46e5); opacity: 0.6; }

        .wiz-step-label {
          font-size: 11px; color: #4f4e6a; text-transform: uppercase;
          letter-spacing: 0.1em; margin-bottom: 8px;
        }
        .wiz-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 32px; min-height: 280px;
          display: flex; flex-direction: column; gap: 18px;
        }
        .wiz-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.3px;
        }
        .wiz-sub { font-size: 13px; color: #8b8aa6; line-height: 1.55; margin-top: -10px; }

        .wiz-input, .wiz-textarea {
          width: 100%; padding: 12px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 14px; font-family: var(--font-dm-sans), sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .wiz-input:focus, .wiz-textarea:focus { border-color: rgba(124,58,237,0.5); }
        .wiz-textarea { resize: vertical; min-height: 90px; }

        .wiz-tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .wiz-tag {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 999px;
          background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25);
          color: #c4b5fd; font-size: 12px;
        }
        .wiz-tag button {
          background: none; border: none; color: #a78bfa; cursor: pointer;
          font-size: 13px; line-height: 1; padding: 0;
        }
        .wiz-add-row { display: flex; gap: 8px; }
        .wiz-add-btn {
          padding: 0 18px; border-radius: 10px; border: 1px solid rgba(124,58,237,0.3);
          background: rgba(124,58,237,0.12); color: #c4b5fd; cursor: pointer;
          font-size: 13px; font-family: var(--font-dm-sans), sans-serif; white-space: nowrap;
        }

        .wiz-cap-row { display: flex; align-items: center; gap: 14px; }
        .wiz-cap-btn {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 16px; cursor: pointer;
        }
        .wiz-cap-num {
          font-family: var(--font-syne), sans-serif; font-size: 26px; font-weight: 800; color: #fff;
          min-width: 60px; text-align: center;
        }

        .wiz-nav { display: flex; justify-content: space-between; margin-top: 24px; }

        .wiz-review-row {
          display: flex; justify-content: space-between; gap: 16px;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 13px;
        }
        .wiz-review-row:last-child { border-bottom: none; }
        .wiz-review-label { color: #4f4e6a; flex-shrink: 0; }
        .wiz-review-val { color: #fff; text-align: right; }

        .wiz-success {
          text-align: center; padding: 20px 0; display: flex; flex-direction: column;
          align-items: center; gap: 16px;
        }
        .wiz-success-icon {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 26px;
        }
        .wiz-link-box {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 12px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
        }
        .wiz-link-text { flex: 1; font-size: 13px; color: #c4b5fd; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .wiz-error { color: #f87171; font-size: 12px; margin-top: -8px; }
      `}</style>

      <div className="wiz-wrap">
        {!generatedLink && (
          <>
            <div className="wiz-progress">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`wiz-dot ${i < stepIndexForDisplay ? "done" : i === stepIndexForDisplay ? "active" : ""}`}
                />
              ))}
            </div>
            <div className="wiz-step-label">Step {stepIndexForDisplay + 1} of {totalSteps} · {steps[stepIndexForDisplay]}</div>
          </>
        )}

        <div className="wiz-card">
          {generatedLink ? (
            <div className="wiz-success">
              <div className="wiz-success-icon">✅</div>
              <div className="wiz-title">Campaign is live</div>
              <p className="wiz-sub" style={{ marginTop: 0 }}>
                Share this link anywhere — LinkedIn, job boards, your careers page.
                Applicants who submit will pick an interview slot and get an
                invite email automatically.
              </p>
              <div className="wiz-link-box">
                <span>🔗</span>
                <span className="wiz-link-text">{generatedLink}</span>
                <button className="link-copy" onClick={copyLink} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: 12 }}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: 8 }}
                onClick={() => router.push("/companies/campaigns")}
              >
                Go to campaigns →
              </button>
            </div>
          ) : (
            <>
              {/* Step 0: Company name */}
              {step === 0 && (
                <>
                  <div className="wiz-title">What's your company called?</div>
                  <p className="wiz-sub">This shows up on the candidate-facing interview page.</p>
                  <input
                    className="wiz-input"
                    placeholder="e.g. Acme Inc."
                    value={form.companyName}
                    onChange={e => update("companyName", e.target.value)}
                    autoFocus
                  />
                </>
              )}

              {/* Step 1: Role */}
              {step === 1 && (
                <>
                  <div className="wiz-title">What role are you hiring for?</div>
                  <p className="wiz-sub">e.g. Frontend Developer, Backend Engineer, Growth Marketer.</p>
                  <input
                    className="wiz-input"
                    placeholder="e.g. Frontend Developer"
                    value={form.role}
                    onChange={e => update("role", e.target.value)}
                    autoFocus
                  />
                </>
              )}

              {/* Step 2: Years of experience */}
              {step === 2 && (
                <>
                  <div className="wiz-title">How much experience do you need?</div>
                  <p className="wiz-sub">This helps Nervo calibrate the interview difficulty.</p>
                  <input
                    className="wiz-input"
                    placeholder="e.g. 3+ years"
                    value={form.yearsExperience}
                    onChange={e => update("yearsExperience", e.target.value)}
                    autoFocus
                  />
                </>
              )}

              {/* Step 3: Skills */}
              {step === 3 && (
                <>
                  <div className="wiz-title">What skills matter most?</div>
                  <p className="wiz-sub">Add each skill one at a time — press Enter or tap Add.</p>
                  <div className="wiz-add-row">
                    <input
                      className="wiz-input"
                      placeholder="e.g. React"
                      value={form.skillInput}
                      onChange={e => update("skillInput", e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      autoFocus
                    />
                    <button className="wiz-add-btn" onClick={addSkill}>Add</button>
                  </div>
                  <div className="wiz-tag-row">
                    {form.skills.map(s => (
                      <span className="wiz-tag" key={s}>
                        {s}
                        <button onClick={() => removeSkill(s)}>×</button>
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Step 4: Other requirements */}
              {step === 4 && (
                <>
                  <div className="wiz-title">Anything else Nervo should know?</div>
                  <p className="wiz-sub">Optional — culture notes, must-haves, nice-to-haves.</p>
                  <textarea
                    className="wiz-textarea"
                    placeholder="e.g. Must be comfortable with async communication and ambiguity."
                    value={form.otherRequirements}
                    onChange={e => update("otherRequirements", e.target.value)}
                    autoFocus
                  />
                </>
              )}

              {/* Step 5: Applicant cap */}
              {step === 5 && (
                <>
                  <div className="wiz-title">How many applicants max?</div>
                  <p className="wiz-sub">Once this many people apply, the link auto-closes to new submissions.</p>
                  <div className="wiz-cap-row">
                    <button className="wiz-cap-btn" onClick={() => update("applicantCap", Math.max(1, form.applicantCap - 5))}>−</button>
                    <div className="wiz-cap-num">{form.applicantCap}</div>
                    <button className="wiz-cap-btn" onClick={() => update("applicantCap", form.applicantCap + 5)}>+</button>
                  </div>
                </>
              )}

              {/* Step 6: Interview slots */}
              {step === 6 && (
                <>
                  <div className="wiz-title">What interview slots can candidates pick from?</div>
                  <p className="wiz-sub">Candidates will choose one of these when they apply.</p>
                  <div className="wiz-add-row">
                    <input
                      className="wiz-input"
                      type="datetime-local"
                      value={form.slotInput}
                      onChange={e => update("slotInput", e.target.value)}
                    />
                    <button className="wiz-add-btn" onClick={addSlot}>Add slot</button>
                  </div>
                  <div className="wiz-tag-row">
                    {form.slots.map(s => (
                      <span className="wiz-tag" key={s}>
                        {new Date(s).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        <button onClick={() => removeSlot(s)}>×</button>
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Step 7: Review */}
              {step === 7 && (
                <>
                  <div className="wiz-title">Review campaign</div>
                  <div>
                    <div className="wiz-review-row"><span className="wiz-review-label">Company</span><span className="wiz-review-val">{form.companyName}</span></div>
                    <div className="wiz-review-row"><span className="wiz-review-label">Role</span><span className="wiz-review-val">{form.role}</span></div>
                    <div className="wiz-review-row"><span className="wiz-review-label">Experience</span><span className="wiz-review-val">{form.yearsExperience}</span></div>
                    <div className="wiz-review-row"><span className="wiz-review-label">Skills</span><span className="wiz-review-val">{form.skills.join(", ")}</span></div>
                    <div className="wiz-review-row"><span className="wiz-review-label">Other</span><span className="wiz-review-val">{form.otherRequirements || "—"}</span></div>
                    <div className="wiz-review-row"><span className="wiz-review-label">Applicant cap</span><span className="wiz-review-val">{form.applicantCap}</span></div>
                    <div className="wiz-review-row"><span className="wiz-review-label">Interview slots</span><span className="wiz-review-val">{form.slots.length} slot(s)</span></div>
                  </div>
                  {createError && <p className="wiz-error">{createError}</p>}
                </>
              )}
            </>
          )}
        </div>

        {!generatedLink && (
          <div className="wiz-nav">
            <button
              className="btn btn-ghost"
              disabled={step === startStep}
              onClick={() => setStep(s => s - 1)}
              style={{ opacity: step === startStep ? 0.3 : 1 }}
            >
              ← Back
            </button>

            {step < 7 ? (
              <button
                className="btn btn-primary"
                disabled={!canGoNext()}
                onClick={() => setStep(s => s + 1)}
                style={{ opacity: canGoNext() ? 1 : 0.4 }}
              >
                Next →
              </button>
            ) : (
              <button className="btn btn-primary" disabled={submitting} onClick={handleGenerate}>
                {submitting ? "Generating…" : "Generate link →"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}