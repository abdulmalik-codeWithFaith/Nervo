"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────
type Screen = "landing" | "interview" | "feedback";
type CallStatus = "idle" | "ai-speaking" | "listening" | "processing";
type UserStatus = "guest" | "signed-in";

interface Turn {
  role: "ai" | "user";
  text: string;
}

// ─── Interview questions ──────────────────────────────────
const QUESTIONS = [
  "Tell me about yourself and what draws you to this role.",
  "Walk me through a project you're most proud of and your specific contribution.",
  "Describe a time you had to deal with a difficult stakeholder. How did you handle it?",
  "What's your approach when you disagree with your manager's decision?",
];

const FOLLOW_UPS = [
  "That's really helpful, thank you. Let me follow up on that —",
  "Interesting — I'd love to dig a little deeper. Here's my next question —",
  "Good, that gives me a clear picture. Let's keep going —",
  "I appreciate the detail there. Moving on —",
];

// ─── Browser speech helpers ───────────────────────────────
function speak(text: string, onEnd: () => void) {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1;
  utter.volume = 1;

  // prefer a natural-sounding voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    /samantha|karen|daniel|moira|fiona|kate|victoria|zira|david/i.test(v.name)
  ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
  if (preferred) utter.voice = preferred;

  utter.onend = onEnd;
  utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

// ─── Main component ───────────────────────────────────────
export default function PracticePage() {
  const [userStatus] = useState<UserStatus>("guest");
  const [screen, setScreen] = useState<Screen>("landing");

  // Setup
  const [targetRole, setTargetRole] = useState("");
  const [interviewType, setInterviewType] = useState("General");
  const [experienceLevel, setExperienceLevel] = useState("mid");

  // Call state
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [liveCaption, setLiveCaption] = useState(""); // what user is currently saying
  const [aiCaption, setAiCaption] = useState("");     // what AI just said
  const [callDuration, setCallDuration] = useState(0);
  const [interviewDone, setInterviewDone] = useState(false);
  const [micError, setMicError] = useState("");

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasUsedFreeTrial = useRef(false);

  // ── Timer ──
  useEffect(() => {
    if (screen === "interview" && !interviewDone) {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen, interviewDone]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── AI speaks a turn, then starts listening ──
  const aiSpeak = useCallback((text: string, done = false) => {
    setCallStatus("ai-speaking");
    setAiCaption(text);
    setTranscript(prev => [...prev, { role: "ai", text }]);

    speak(text, () => {
      if (done) {
        setInterviewDone(true);
        setCallStatus("idle");
        setAiCaption("");
        return;
      }
      // Start listening after AI finishes
      setCallStatus("listening");
      setAiCaption("");
      startListening();
    });
  }, []);

  // ── Speech recognition ──
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicError("Speech recognition isn't supported in this browser. Try Chrome.");
      return;
    }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    rec.onstart = () => {
      setLiveCaption("");
      setCallStatus("listening");
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setLiveCaption(final || interim);
    };

    rec.onend = () => {
      // grab whatever was captured
      setLiveCaption(prev => {
        const captured = prev.trim();
        if (captured) {
          handleUserAnswer(captured);
        } else {
          // Nothing heard — prompt again
          setCallStatus("listening");
          setTimeout(() => startListening(), 600);
        }
        return "";
      });
    };

    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "no-speech") {
        // retry silently
        setTimeout(() => startListening(), 800);
      } else if (e.error === "not-allowed") {
        setMicError("Microphone access was denied. Please allow mic access and reload.");
        setCallStatus("idle");
      }
    };

    rec.start();
  }, []);

  // ── Handle user answer ──
  const handleUserAnswer = useCallback((answer: string) => {
    setCallStatus("processing");
    setTranscript(prev => [...prev, { role: "user", text: answer }]);

    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex < QUESTIONS.length) {
        const followUp = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];
        const aiText = `${followUp} ${QUESTIONS[nextIndex]}`;
        setQuestionIndex(nextIndex);
        aiSpeak(aiText);
      } else {
        aiSpeak(
          "That wraps up our interview. You gave some thoughtful answers — I especially liked how you handled the stakeholder question. Give me a moment and I'll generate your full feedback report.",
          true
        );
      }
    }, 600);
  }, [questionIndex, aiSpeak]);

  // ── Start the call ──
  function startInterview() {
    setTranscript([]);
    setQuestionIndex(0);
    setCallDuration(0);
    setInterviewDone(false);
    setLiveCaption("");
    setAiCaption("");
    setMicError("");
    setScreen("interview");

    // Small delay so screen renders first
    setTimeout(() => {
      const opening = `Hi! I'm your Nervo AI interviewer. We're doing a ${interviewType.toLowerCase()} interview for a ${targetRole || "Software Engineer"} role at the ${experienceLevel} level. Just speak naturally — take your time. Let's start. ${QUESTIONS[0]}`;
      aiSpeak(opening);
    }, 400);
  }

  // ── End call & go to feedback ──
  function endCall() {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();
    if (timerRef.current) clearInterval(timerRef.current);
    hasUsedFreeTrial.current = true;
    setScreen("feedback");
  }

  // ── Mute toggle (stops listening, resumes after) ──
  const [muted, setMuted] = useState(false);
  function toggleMute() {
    if (!muted) {
      if (recognitionRef.current) recognitionRef.current.abort();
      setMuted(true);
      setCallStatus("idle");
    } else {
      setMuted(false);
      if (callStatus === "idle" && !interviewDone && !aiCaption) {
        setCallStatus("listening");
        startListening();
      }
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #05050f; color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
          -webkit-font-smoothing: antialiased; min-height: 100vh;
        }

        /* ── Glows ── */
        .glow-tl {
          position: fixed; top: -200px; left: -200px;
          width: 600px; height: 600px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
        }
        .glow-br {
          position: fixed; bottom: -120px; right: -120px;
          width: 500px; height: 500px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
        }

        /* ── Nav ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(5,5,15,0.85); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-logo {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; text-decoration: none;
        }
        .nav-right { display: flex; gap: 10px; align-items: center; }
        .nav-link { font-size: 13px; font-weight: 300; color: #8b8aa6; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .nav-btn {
          font-size: 13px; font-weight: 500; color: #c4b5fd;
          padding: 7px 18px; border-radius: 8px;
          border: 1px solid rgba(124,58,237,0.4);
          background: transparent; text-decoration: none; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-btn:hover { background: rgba(124,58,237,0.14); border-color: rgba(167,139,250,0.6); }

        /* ── Guest banner ── */
        .guest-banner {
          position: fixed; top: 65px; left: 0; right: 0; z-index: 40;
          background: rgba(124,58,237,0.09);
          border-bottom: 1px solid rgba(124,58,237,0.18);
          padding: 9px 48px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .gb-text { font-size: 13px; font-weight: 300; color: #c4b5fd; }
        .gb-text strong { font-weight: 600; }
        .gb-sign-up {
          font-size: 12px; font-weight: 500; color: #a78bfa;
          padding: 5px 14px; border-radius: 7px;
          border: 1px solid rgba(124,58,237,0.4);
          background: transparent; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
          text-decoration: none; transition: background 0.2s; flex-shrink: 0;
        }
        .gb-sign-up:hover { background: rgba(124,58,237,0.15); }

        /* ── Page body ── */
        .page-body { padding-top: 112px; min-height: 100vh; position: relative; z-index: 1; }
        .page-body.no-banner { padding-top: 80px; }

        /* ════════════════════
           LANDING
        ════════════════════ */
        .landing-wrap {
          max-width: 760px; margin: 0 auto; padding: 48px 24px 80px;
          animation: fadeUp 0.5s ease both;
        }
        .landing-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 22px;
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.25);
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #a78bfa; animation: pulseDot 2s ease infinite; }
        .landing-badge span { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #c4b5fd; }

        .landing-h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(30px, 4vw, 50px); font-weight: 800;
          line-height: 1.08; letter-spacing: -1.2px; color: #fff; margin-bottom: 14px;
        }
        .landing-h1 .grad {
          background: linear-gradient(120deg, #c084fc 10%, #818cf8 55%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .landing-sub {
          font-size: 15px; font-weight: 300; color: #8b8aa6;
          line-height: 1.7; max-width: 520px; margin-bottom: 32px;
        }

        /* how it works strip */
        .how-strip {
          display: flex; gap: 0; margin-bottom: 36px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
        }
        .how-item {
          flex: 1; padding: 18px 20px; display: flex; align-items: flex-start; gap: 12px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .how-item:last-child { border-right: none; }
        .how-icon {
          width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
          background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.2);
        }
        .how-text h4 { font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 3px; }
        .how-text p  { font-size: 11px; font-weight: 300; color: #4f4e6a; line-height: 1.4; }

        /* free callout */
        .free-callout {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 20px; border-radius: 12px; margin-bottom: 28px;
          background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.18);
        }
        .free-callout-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .free-callout-text h4 { font-size: 13px; font-weight: 500; color: #4ade80; margin-bottom: 3px; }
        .free-callout-text p  { font-size: 12px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }
        .free-callout-text p a { color: #a78bfa; text-decoration: none; }
        .free-callout-text p a:hover { text-decoration: underline; }

        /* setup card */
        .setup-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 32px;
        }
        .setup-card h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 22px; letter-spacing: -0.2px;
        }
        .setup-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        .setup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 12px; font-weight: 500; color: #8b8aa6; letter-spacing: 0.04em; }

        input[type="text"], select {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 300; outline: none;
          transition: border-color 0.2s, background 0.2s; -webkit-appearance: none;
        }
        input::placeholder { color: #4f4e6a; }
        select { color: #8b8aa6; cursor: pointer; }
        select option { background: #0e0e1f; color: #fff; }
        input:focus, select:focus { border-color: rgba(124,58,237,0.55); background: rgba(124,58,237,0.05); }

        .type-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .type-pill {
          padding: 7px 16px; border-radius: 999px; cursor: pointer;
          font-size: 13px; font-weight: 400;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #8b8aa6; transition: all 0.2s; font-family: var(--font-dm-sans), sans-serif;
        }
        .type-pill.active { background: rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.45); color: #c4b5fd; }
        .type-pill:hover:not(.active) { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); color: #fff; }

        .btn-start {
          width: 100%; padding: 15px; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 15px; font-weight: 500;
          box-shadow: 0 0 28px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-start:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(124,58,237,0.55); }

        .mic-note {
          text-align: center; margin-top: 16px;
          font-size: 12px; font-weight: 300; color: #4f4e6a;
        }
        .mic-note span { color: #6d5acf; }

        /* ════════════════════
           INTERVIEW / CALL UI
        ════════════════════ */
        .call-screen {
          min-height: calc(100vh - 112px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px;
          position: relative;
          animation: fadeUp 0.4s ease both;
        }

        /* call card */
        .call-card {
          width: 100%; max-width: 480px;
          background: rgba(12,12,28,0.85);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 28px; padding: 40px 36px 36px;
          backdrop-filter: blur(24px);
          box-shadow: 0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
          display: flex; flex-direction: column; align-items: center; gap: 0;
          position: relative;
        }

        /* call header */
        .call-header {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px;
        }
        .call-label {
          font-family: var(--font-syne), sans-serif;
          font-size: 13px; font-weight: 600; color: #a78bfa; letter-spacing: 0.06em;
        }
        .call-timer {
          font-family: var(--font-syne), sans-serif;
          font-size: 13px; font-weight: 600; color: #4f4e6a; letter-spacing: 0.08em;
        }

        /* progress dots */
        .progress-dots {
          display: flex; gap: 7px; margin-bottom: 36px;
        }
        .prog-dot {
          height: 4px; border-radius: 999px;
          transition: all 0.5s ease;
        }
        .prog-dot.done   { background: #7c3aed; width: 24px; }
        .prog-dot.active { background: linear-gradient(90deg, #7c3aed, #38bdf8); width: 32px; }
        .prog-dot.future { background: rgba(255,255,255,0.08); width: 14px; }

        /* AI avatar orb */
        .orb-container { position: relative; margin-bottom: 28px; }
        .orb {
          width: 110px; height: 110px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #a78bfa, #6d28d9 55%, #1e1b4b 100%);
          position: relative;
          transition: transform 0.3s ease;
        }
        .orb.speaking { animation: orbPulse 1.2s ease-in-out infinite; }
        .orb-shine {
          position: absolute; inset: 14px; border-radius: 50%;
          background: radial-gradient(circle at 40% 30%, rgba(255,255,255,0.25), transparent 65%);
        }
        .orb-label {
          position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
          background: rgba(124,58,237,0.9); backdrop-filter: blur(8px);
          border-radius: 999px; padding: 4px 12px;
          font-size: 11px; font-weight: 600; color: #fff; white-space: nowrap;
          border: 1px solid rgba(167,139,250,0.4);
        }

        /* sound waves (show when AI speaking) */
        .wave-bars {
          display: flex; align-items: center; gap: 4px; height: 32px;
          margin-bottom: 24px;
        }
        .wave-bar {
          width: 4px; border-radius: 999px;
          background: linear-gradient(180deg, #a78bfa, #4f46e5);
          animation: waveBounce 0.8s ease-in-out infinite;
        }
        .wave-bar:nth-child(1) { animation-delay: 0s;    height: 10px; }
        .wave-bar:nth-child(2) { animation-delay: 0.1s;  height: 20px; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s;  height: 28px; }
        .wave-bar:nth-child(4) { animation-delay: 0.15s; height: 22px; }
        .wave-bar:nth-child(5) { animation-delay: 0.05s; height: 14px; }
        .wave-bar:nth-child(6) { animation-delay: 0.25s; height: 26px; }
        .wave-bar:nth-child(7) { animation-delay: 0.1s;  height: 18px; }
        .wave-bar.paused { animation: none; height: 4px !important; opacity: 0.3; }

        /* status label */
        .call-status-text {
          font-size: 13px; font-weight: 400; color: #8b8aa6;
          margin-bottom: 10px; min-height: 20px; text-align: center;
        }

        /* live caption (what user is saying) */
        .caption-bubble {
          width: 100%; min-height: 52px; padding: 12px 16px;
          background: rgba(255,255,255,0.04); border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 28px;
          font-size: 14px; font-weight: 300; color: #c4b5fd;
          line-height: 1.6; text-align: center;
          transition: border-color 0.3s;
        }
        .caption-bubble.active { border-color: rgba(124,58,237,0.4); }
        .caption-bubble.empty { color: #4f4e6a; }

        /* mic ring (listening indicator) */
        .mic-ring-wrap {
          position: relative; display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
        }
        .mic-ring {
          width: 64px; height: 64px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          background: rgba(124,58,237,0.12); border: 2px solid rgba(124,58,237,0.3);
          position: relative; z-index: 1;
          transition: background 0.3s, border-color 0.3s;
        }
        .mic-ring.listening {
          background: rgba(124,58,237,0.2); border-color: rgba(167,139,250,0.6);
          animation: micPulse 1.5s ease-in-out infinite;
        }
        .mic-ring.processing {
          background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.35);
        }
        .mic-pulse-ring {
          position: absolute; width: 64px; height: 64px; border-radius: 50%;
          border: 2px solid rgba(124,58,237,0.3);
          animation: ringOut 1.5s ease-out infinite;
        }
        .mic-pulse-ring:nth-child(2) { animation-delay: 0.5s; }

        /* call controls */
        .call-controls {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .ctrl-btn {
          width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
          transition: transform 0.2s, background 0.2s;
        }
        .ctrl-btn:hover { transform: scale(1.08); }
        .ctrl-mute {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
        }
        .ctrl-mute.muted {
          background: rgba(251,191,36,0.12); border-color: rgba(251,191,36,0.3);
        }
        .ctrl-end {
          background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);
          color: #f87171; width: 60px; height: 60px; font-size: 22px;
        }
        .ctrl-end:hover { background: rgba(239,68,68,0.25); }

        /* error */
        .mic-error {
          margin-top: 16px; padding: 12px 16px; border-radius: 10px;
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
          font-size: 13px; color: #f87171; text-align: center; line-height: 1.5;
        }

        /* finish banner */
        .finish-banner {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
          background: rgba(5,5,15,0.95); backdrop-filter: blur(20px);
          border-top: 1px solid rgba(74,222,128,0.2);
          padding: 18px 24px;
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .finish-banner p { font-size: 14px; font-weight: 300; color: #8b8aa6; }
        .btn-feedback {
          padding: 12px 28px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 500;
          box-shadow: 0 0 20px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-feedback:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(124,58,237,0.5); }

        /* ════════════════════
           FEEDBACK
        ════════════════════ */
        .feedback-wrap {
          max-width: 720px; margin: 0 auto; padding: 36px 24px 80px;
          animation: fadeUp 0.5s ease both;
        }
        .feedback-header { margin-bottom: 28px; }
        .feedback-header h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 26px; font-weight: 700; letter-spacing: -0.5px; color: #fff; margin-bottom: 6px;
        }
        .feedback-header p { font-size: 13px; font-weight: 300; color: #8b8aa6; }

        .score-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
        .score-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 18px 16px; text-align: center;
        }
        .score-label { font-size: 10px; font-weight: 500; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .score-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 28px; font-weight: 800; letter-spacing: -1px;
          background: linear-gradient(135deg,#a78bfa,#818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .score-bar-mini { height: 3px; background: rgba(255,255,255,0.06); border-radius: 999px; margin-top: 8px; overflow: hidden; }
        .score-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#7c3aed,#818cf8); }

        .summary-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 22px; margin-bottom: 16px;
        }
        .summary-card h4 {
          font-family: var(--font-syne), sans-serif;
          font-size: 12px; font-weight: 600; color: #a78bfa;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;
        }
        .summary-card p { font-size: 14px; font-weight: 300; color: #8b8aa6; line-height: 1.7; }

        /* transcript */
        .transcript-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 20px; margin-bottom: 16px;
        }
        .transcript-card h4 {
          font-family: var(--font-syne), sans-serif;
          font-size: 12px; font-weight: 600; color: #4f4e6a;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px;
        }
        .transcript-turns { display: flex; flex-direction: column; gap: 12px; max-height: 240px; overflow-y: auto; }
        .transcript-turn { display: flex; gap: 10px; align-items: flex-start; }
        .tt-role {
          font-size: 10px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; padding: 3px 8px; border-radius: 999px;
          flex-shrink: 0; margin-top: 1px;
        }
        .tt-ai   { background: rgba(124,58,237,0.15); color: #a78bfa; }
        .tt-user { background: rgba(255,255,255,0.06); color: #8b8aa6; }
        .tt-text { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.6; }

        /* gate */
        .gate-overlay { position: relative; }
        .gate-blur-content { filter: blur(6px); pointer-events: none; user-select: none; opacity: 0.45; }
        .gate-card { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .gate-inner {
          background: rgba(5,5,15,0.94); border: 1px solid rgba(124,58,237,0.3);
          border-radius: 20px; padding: 36px 32px; text-align: center;
          backdrop-filter: blur(20px); max-width: 360px; width: 90%;
          box-shadow: 0 0 60px rgba(0,0,0,0.5);
        }
        .gate-icon { font-size: 32px; margin-bottom: 12px; }
        .gate-inner h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; letter-spacing: -0.3px;
        }
        .gate-inner p { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.65; margin-bottom: 20px; }
        .gate-perks { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; text-align: left; }
        .gate-perk { display: flex; align-items: center; gap: 9px; font-size: 12px; font-weight: 400; color: #c4b5fd; }
        .gate-check { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; background: rgba(124,58,237,0.15); display: flex; align-items: center; justify-content: center; font-size: 9px; color: #a78bfa; }
        .btn-gate-primary {
          width: 100%; padding: 13px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff;
          font-family: var(--font-dm-sans), sans-serif; font-size: 14px; font-weight: 500;
          margin-bottom: 10px; box-shadow: 0 0 24px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; display: block;
        }
        .btn-gate-primary:hover { transform: translateY(-1px); box-shadow: 0 0 36px rgba(124,58,237,0.5); }
        .btn-gate-ghost {
          width: 100%; padding: 11px; border-radius: 10px; cursor: pointer;
          background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: #8b8aa6; font-family: var(--font-dm-sans), sans-serif;
          font-size: 13px; font-weight: 300; transition: background 0.2s, color 0.2s;
          text-decoration: none; display: block; text-align: center;
        }
        .btn-gate-ghost:hover { background: rgba(255,255,255,0.05); color: #fff; }

        /* ── Keyframes ── */
        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        @keyframes orbPulse  {
          0%,100% { box-shadow: 0 0 30px rgba(124,58,237,.55), 0 0 60px rgba(124,58,237,.25); }
          50%     { box-shadow: 0 0 55px rgba(124,58,237,.85), 0 0 110px rgba(124,58,237,.4); }
        }
        @keyframes waveBounce {
          0%,100% { transform: scaleY(0.4); }
          50%     { transform: scaleY(1);   }
        }
        @keyframes micPulse  {
          0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
          50%     { box-shadow: 0 0 0 12px rgba(124,58,237,0); }
        }
        @keyframes ringOut   {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0;   }
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          nav { padding: 16px 20px; }
          .guest-banner { padding: 9px 20px; flex-wrap: wrap; }
          .how-strip { flex-direction: column; }
          .how-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .how-item:last-child { border-bottom: none; }
          .setup-row { grid-template-columns: 1fr; }
          .score-grid { grid-template-columns: 1fr 1fr; }
          .call-card { padding: 28px 20px 24px; }
          .landing-wrap, .feedback-wrap { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>

      <div className="glow-tl" aria-hidden="true" />
      <div className="glow-br" aria-hidden="true" />

      {/* ── Nav ── */}
      <nav>
        <Link href="/" className="nav-logo">Nervo</Link>
        <div className="nav-right">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/get-started" className="nav-btn">Sign up free</Link>
        </div>
      </nav>

      {/* Guest banner */}
      {userStatus === "guest" && screen !== "feedback" && (
        <div className="guest-banner">
          <p className="gb-text">
            🎁 <strong>1 free voice interview</strong> — no account needed.
            Sign up to unlock unlimited practice and full feedback reports.
          </p>
          <Link href="/get-started" className="gb-sign-up">Sign up free →</Link>
        </div>
      )}

      <div className={`page-body ${userStatus !== "guest" || screen === "feedback" ? "no-banner" : ""}`}>

        {/* ════════════════════
            LANDING
        ════════════════════ */}
        {screen === "landing" && (
          <div className="landing-wrap">
            <div className="landing-badge">
              <span className="badge-dot" />
              <span>Voice Interview Practice</span>
            </div>

            <h1 className="landing-h1">
              A real interview,<br />
              <span className="grad">no typing required.</span>
            </h1>
            <p className="landing-sub">
              Nervo's AI interviewer asks you questions out loud. You answer by speaking — just like
              a real phone screen. Your voice is transcribed, the AI responds, and after the session
              you get a scored feedback report.
            </p>

            {/* How it works */}
            <div className="how-strip">
              {[
                { icon: "🎙", title: "Speak your answers", body: "No typing. Talk naturally like a real call." },
                { icon: "🤖", title: "AI listens & responds", body: "Nervo asks follow-ups and adapts to what you say." },
                { icon: "📊", title: "Get your report", body: "Scores, strengths, and personalised tips after." },
              ].map(h => (
                <div className="how-item" key={h.title}>
                  <div className="how-icon">{h.icon}</div>
                  <div className="how-text"><h4>{h.title}</h4><p>{h.body}</p></div>
                </div>
              ))}
            </div>

            {/* Free callout */}
            <div className="free-callout">
              <div className="free-callout-icon">🎁</div>
              <div className="free-callout-text">
                <h4>1 full interview — free, no sign-up</h4>
                <p>
                  After your session you'll see your scores and an AI summary preview.{" "}
                  <Link href="/get-started">Create a free account</Link> for unlimited
                  interviews, full reports, and resume analysis.
                </p>
              </div>
            </div>

            {/* Setup */}
            <div className="setup-card">
              <h3>Configure your interview</h3>
              <div className="setup-fields">
                <div className="field">
                  <label>Target role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Product Designer, Backend Engineer…"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                  />
                </div>
                <div className="setup-row">
                  <div className="field">
                    <label>Experience level</label>
                    <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}>
                      <option value="junior">Junior (0–2 yrs)</option>
                      <option value="mid">Mid-level (2–5 yrs)</option>
                      <option value="senior">Senior (5+ yrs)</option>
                      <option value="lead">Lead / Principal</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Interview focus</label>
                    <select value={interviewType} onChange={e => setInterviewType(e.target.value)}>
                      <option>General</option>
                      <option>Technical</option>
                      <option>Behavioural</option>
                      <option>Product sense</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Style</label>
                  <div className="type-pills">
                    {["Conversational", "Structured", "Pressure test"].map(t => (
                      <button
                        key={t}
                        className={`type-pill ${interviewType === t ? "active" : ""}`}
                        onClick={() => setInterviewType(t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button className="btn-start" onClick={startInterview}>
                <span>📞</span> Start voice interview
              </button>
              <p className="mic-note">
                Nervo will ask for <span>microphone access</span> when the call starts · Works best in Chrome
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════
            CALL SCREEN
        ════════════════════ */}
        {screen === "interview" && (
          <>
            <div className="call-screen">
              <div className="call-card">

                {/* Header */}
                <div className="call-header">
                  <span className="call-label">
                    {targetRole || "Software Engineer"} · {interviewType}
                  </span>
                  <span className="call-timer">{formatTime(callDuration)}</span>
                </div>

                {/* Progress dots */}
                <div className="progress-dots">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`prog-dot ${i < questionIndex ? "done" : i === questionIndex ? "active" : "future"}`}
                    />
                  ))}
                </div>

                {/* AI orb */}
                <div className="orb-container">
                  <div className={`orb ${callStatus === "ai-speaking" ? "speaking" : ""}`}>
                    <div className="orb-shine" />
                  </div>
                  <div className="orb-label">
                    {callStatus === "ai-speaking" ? "Nervo is speaking…" :
                     callStatus === "listening"   ? "Your turn" :
                     callStatus === "processing"  ? "Processing…" : "Nervo AI"}
                  </div>
                </div>

                {/* Sound wave bars */}
                <div className="wave-bars">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`wave-bar ${callStatus !== "ai-speaking" ? "paused" : ""}`}
                    />
                  ))}
                </div>

                {/* Status */}
                <p className="call-status-text">
                  {callStatus === "ai-speaking" ? aiCaption.slice(0, 60) + (aiCaption.length > 60 ? "…" : "") :
                   callStatus === "listening"   ? "Listening — speak your answer" :
                   callStatus === "processing"  ? "Got it, thinking…" :
                   interviewDone               ? "Interview complete" : "Connecting…"}
                </p>

                {/* Live caption — what user is saying */}
                {callStatus === "listening" && (
                  <div className={`caption-bubble ${liveCaption ? "active" : "empty"}`}>
                    {liveCaption || "Start speaking…"}
                  </div>
                )}

                {/* Mic ring — listening state */}
                {callStatus === "listening" && (
                  <div className="mic-ring-wrap">
                    <div className="mic-pulse-ring" />
                    <div className="mic-pulse-ring" />
                    <div className="mic-ring listening">🎙</div>
                  </div>
                )}

                {callStatus === "processing" && (
                  <div className="mic-ring-wrap">
                    <div className="mic-ring processing">⏳</div>
                  </div>
                )}

                {/* Controls */}
                <div className="call-controls">
                  <button
                    className={`ctrl-btn ctrl-mute ${muted ? "muted" : ""}`}
                    onClick={toggleMute}
                    title={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? "🔇" : "🎤"}
                  </button>
                  <button className="ctrl-btn ctrl-end" onClick={endCall} title="End interview">
                    📵
                  </button>
                </div>

                {micError && <p className="mic-error">{micError}</p>}
              </div>
            </div>

            {/* Finish banner */}
            {interviewDone && (
              <div className="finish-banner">
                <p>Interview complete — your report is ready.</p>
                <button className="btn-feedback" onClick={endCall}>
                  View feedback report →
                </button>
              </div>
            )}
          </>
        )}

        {/* ════════════════════
            FEEDBACK
        ════════════════════ */}
        {screen === "feedback" && (
          <div className="feedback-wrap">
            <div className="feedback-header">
              <h2>Your interview results</h2>
              <p>{targetRole || "Software Engineer"} · {experienceLevel} · {interviewType}</p>
            </div>

            {/* Scores — always visible */}
            <div className="score-grid">
              {[
                { label: "Technical",       val: 78 },
                { label: "Communication",   val: 85 },
                { label: "Confidence",      val: 72 },
                { label: "Problem solving", val: 80 },
              ].map(s => (
                <div className="score-card" key={s.label}>
                  <div className="score-label">{s.label}</div>
                  <div className="score-num">{s.val}</div>
                  <div className="score-bar-mini">
                    <div className="score-bar-fill" style={{ width: `${s.val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI summary — always visible */}
            <div className="summary-card">
              <h4>AI Summary</h4>
              <p>
                You came across as thoughtful and self-aware. Your answers showed genuine reflection,
                especially when discussing past challenges. Communication was clear and easy to follow.
                The main area to work on: lead with the outcome first — state the result before the
                context to make your answers land harder.
              </p>
            </div>

            {/* Transcript — always visible */}
            {transcript.length > 0 && (
              <div className="transcript-card">
                <h4>Call transcript</h4>
                <div className="transcript-turns">
                  {transcript.map((t, i) => (
                    <div className="transcript-turn" key={i}>
                      <span className={`tt-role ${t.role === "ai" ? "tt-ai" : "tt-user"}`}>
                        {t.role === "ai" ? "Nervo" : "You"}
                      </span>
                      <span className="tt-text">{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths / improvements / suggestions — gated for guests */}
            {userStatus === "guest" ? (
              <div className="gate-overlay">
                <div className="gate-blur-content">
                  <div className="summary-card" style={{ marginBottom: 14 }}>
                    <h4>Strengths</h4>
                    <p>Strong ownership language. Clear narrative structure. Good use of specific examples. Demonstrated empathy. Handled follow-up questions confidently.</p>
                  </div>
                  <div className="summary-card" style={{ marginBottom: 14 }}>
                    <h4>Areas to improve</h4>
                    <p>Lead with the outcome first. Quantify impact where possible. Reduce filler phrases. Practice concise closing statements for each answer.</p>
                  </div>
                  <div className="summary-card">
                    <h4>Suggested questions to practice next</h4>
                    <p>Tell me about a time your plan completely fell apart. How do you prioritise when everything feels urgent? How do you describe your working style to a new team?</p>
                  </div>
                </div>
                <div className="gate-card">
                  <div className="gate-inner">
                    <div className="gate-icon">🔓</div>
                    <h3>Unlock your full report</h3>
                    <p>Create a free account to access strengths, improvement areas, follow-up questions, and unlimited voice interviews.</p>
                    <div className="gate-perks">
                      {[
                        "Full strengths & weaknesses breakdown",
                        "Personalised follow-up question bank",
                        "Unlimited voice interview sessions",
                        "AI resume analyser & ATS scoring",
                        "Progress tracking across sessions",
                      ].map(p => (
                        <div className="gate-perk" key={p}>
                          <span className="gate-check">✓</span>{p}
                        </div>
                      ))}
                    </div>
                    <Link href="/get-started?from=practice" className="btn-gate-primary">
                      Create free account →
                    </Link>
                    <Link href="/get-started?tab=signin" className="btn-gate-ghost">
                      Already have an account? Sign in
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="summary-card" style={{ marginBottom: 14 }}>
                  <h4>Strengths</h4>
                  <p>Strong ownership language. Clear narrative structure. Demonstrated empathy in team scenarios. Handled follow-up pressure well.</p>
                </div>
                <div className="summary-card" style={{ marginBottom: 14 }}>
                  <h4>Areas to improve</h4>
                  <p>Lead with the outcome first. Quantify impact where possible. Avoid filler phrases. Practice concise closing statements.</p>
                </div>
                <div className="summary-card">
                  <h4>Suggested questions to practice next</h4>
                  <p>Tell me about a time your plan fell apart. How do you prioritise when everything is urgent? Describe your communication style to a new team.</p>
                </div>
                <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                  <button
                    className="btn-start"
                    style={{ width: "auto", padding: "13px 28px" }}
                    onClick={() => { setScreen("landing"); setTranscript([]); setCallDuration(0); }}
                  >
                    Practice again →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}