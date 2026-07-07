"use client";

// ─────────────────────────────────────────────────────────
//  app/get-started/page.tsx
// ─────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthState } from "@/lib/hooks/useAuth";
import AuthLeftPanel   from "@/components/auth/AuthLeftPanel";
import ChooseScreen    from "@/components/auth/ChooseScreen";
import CompanySignUp   from "@/components/auth/CompanySignUp";
import CandidateSignUp from "@/components/auth/CandidateSignUp";
import SignIn          from "@/components/auth/SignIn";
import ForgotPassword  from "@/components/auth/ForgotPassword";
import { AuthFieldStyles } from "@/components/auth/AuthFormFields";

type Screen = "choose" | "company" | "candidate" | "signin" | "forgot";

// ── Read accountType from Firestore and redirect accordingly ──
async function redirectByAccountType(
  uid: string,
  router: ReturnType<typeof useRouter>
) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      const accountType = snap.data().accountType;
      router.replace(accountType === "company" ? "/companies" : "/dashboard");
    } else {
      router.replace("/dashboard");
    }
  } catch {
    router.replace("/dashboard");
  }
}

export default function GetStartedPage() {
  const router = useRouter();
  const { user, initializing } = useAuthState();
  const [screen, setScreen]       = useState<Screen>("choose");
  const [redirecting, setRedirecting] = useState(false);

  // Track whether we've already run the on-mount check.
  // This prevents the useEffect from firing again when the
  // user navigates between screens (e.g. choose → signin).
  const checkedOnMount = useRef(false);

  useEffect(() => {
    // Still waiting for Firebase to resolve the session — do nothing
    if (initializing) return;

    // Already ran this check — don't run again
    if (checkedOnMount.current) return;
    checkedOnMount.current = true;

    // User has an active session and landed on this page —
    // send them to the right dashboard immediately
    if (user && !redirecting) {
      setRedirecting(true);
      redirectByAccountType(user.uid, router);
    }

    // No active session — do nothing, let them use the forms normally
  }, [initializing]); // ← intentionally only depends on initializing
                      //   so it fires exactly once after Firebase resolves

  // ── Post sign-up callbacks (type already known) ──
  function handleCompanySuccess() {
    router.replace("/companies");
  }
  function handleCandidateSuccess() {
    router.replace("/dashboard");
  }

  // ── Post sign-in callback (type unknown — fetch from Firestore) ──
  async function handleSignInSuccess() {
    // user from useAuthState may not have updated yet,
    // so we import auth directly and read currentUser synchronously
    const { auth } = await import("@/lib/firebase");
    // Give Firebase one tick to settle after signIn resolves
    await new Promise(r => setTimeout(r, 100));
    const currentUser = auth.currentUser;
    if (currentUser) {
      setRedirecting(true);
      await redirectByAccountType(currentUser.uid, router);
    }
  }

  // ── Google sign-in from choose screen (type unknown) ──
  async function handleGoogleSuccess() {
    const { auth } = await import("@/lib/firebase");
    await new Promise(r => setTimeout(r, 100));
    const currentUser = auth.currentUser;
    if (currentUser) {
      setRedirecting(true);
      await redirectByAccountType(currentUser.uid, router);
    }
  }

  // Show blank screen while Firebase resolves OR while redirecting
  if (initializing || redirecting) {
    return <div style={{ background: "#05050f", minHeight: "100vh" }} />;
  }

  const panelMode = screen === "forgot" ? "forgot" : screen;

  return (
    <>
      <AuthFieldStyles />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #05050f; color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .gs-glow-tl {
          position: fixed; top: -180px; left: -180px;
          width: 520px; height: 520px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%);
        }
        .gs-glow-br {
          position: fixed; bottom: -120px; right: -120px;
          width: 460px; height: 460px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%);
        }
        .gs-shell {
          min-height: 100vh;
          display: grid; grid-template-columns: 1fr 1fr;
          position: relative; z-index: 1;
        }
        .gs-right {
          display: flex; align-items: center; justify-content: center;
          padding: 40px 48px;
        }
        .gs-form-shell {
          width: 100%; max-width: 420px;
          animation: gsUp 0.38s ease both;
        }
        @keyframes gsUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 860px) {
          .gs-shell { grid-template-columns: 1fr; }
          .gs-right { padding: 48px 20px; align-items: flex-start; padding-top: 72px; }
          .gs-form-shell { max-width: 100%; }
        }
      `}</style>

      <div className="gs-glow-tl" aria-hidden="true" />
      <div className="gs-glow-br" aria-hidden="true" />

      <div className="gs-shell">
        <AuthLeftPanel mode={panelMode} />

        <div className="gs-right">
          <div className="gs-form-shell" key={screen}>

            {screen === "choose" && (
              <ChooseScreen
                onCompany={()    => setScreen("company")}
                onCandidate={()  => setScreen("candidate")}
                onSignIn={()     => setScreen("signin")}
                onGoogle={handleGoogleSuccess}
                loading={false}
              />
            )}

            {screen === "company" && (
              <CompanySignUp
                onBack={()    => setScreen("choose")}
                onSignIn={()  => setScreen("signin")}
                onSuccess={handleCompanySuccess}
              />
            )}

            {screen === "candidate" && (
              <CandidateSignUp
                onBack={()    => setScreen("choose")}
                onSignIn={()  => setScreen("signin")}
                onSuccess={handleCandidateSuccess}
              />
            )}

            {screen === "signin" && (
              <SignIn
                onBack={()    => setScreen("choose")}
                onSignUp={()  => setScreen("choose")}
                onForgot={()  => setScreen("forgot")}
                onSuccess={handleSignInSuccess}
              />
            )}

            {screen === "forgot" && (
              <ForgotPassword
                onBack={() => setScreen("signin")}
              />
            )}

          </div>
        </div>
      </div>
    </>
  );
}