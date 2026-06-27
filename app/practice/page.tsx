"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────
type Screen =
  | "landing"       // default: pick role, set up free interview
  | "interview"     // live mock interview session
  | "feedback"      // post-interview results (teased for guests)
  | "gate";         // sign-up wall after free interview

type UserStatus = "guest" | "signed-in";

interface Message {
  role: "ai" | "user";
  text: string;
}

// ─── Sample AI conversation flow ─────────────────────────
const SAMPLE_QUESTIONS = [
  "Tell me about yourself and what draws you to this role.",
  "Walk me through a project you're most proud of. What was your specific contribution?",
  "Describe a time you had to deal with a difficult stakeholder. How did you handle it?",
  "What's your approach when you disagree with your manager's decision?",
];

// ─── Component ───────────────────────────────────────────
export default function PracticePage() {
  const [userStatus] = useState<UserStatus>("guest"); // swap to "signed-in" when auth is wired
  const [screen, setScreen] = useState<Screen>("landing");

  // Setup fields
  const [targetRole, setTargetRole] = useState("");
  const [interviewType, setInterviewType] = useState("general");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);

  // Interview state
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [interviewDone, setInterviewDone] = useState(false);

  // ── Start interview ──
  function startInterview() {
    if (userStatus === "guest" && hasUsedFreeTrial) {
      setScreen("gate");
      return;
    }
    const opening: Message = {
      role: "ai",
      text: `Hi! I'm your Nervo interviewer. Today we're simulating a ${interviewType} interview for a ${targetRole || "Software Engineer"} role at the ${experienceLevel} level. Take your time and answer naturally — I'll follow up as we go.\n\n${SAMPLE_QUESTIONS[0]}`,
    };
    setMessages([opening]);
    setQuestionIndex(0);
    setInterviewDone(false);
    setScreen("interview");
  }

  // ── Send answer ──
  function sendAnswer() {
    if (!userInput.trim()) return;
    const userMsg: Message = { role: "user", text: userInput };
    setUserInput("");
    setIsAiTyping(true);

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      let aiText = "";

      if (nextIndex < SAMPLE_QUESTIONS.length) {
        // Follow-up acknowledgement + next question
        const followUps = [
          "That's a solid answer. I appreciate the specificity. Let me follow up —",
          "Interesting — I'd love to dig a little deeper on that. Next:",
          "Good. That gives me a clear picture. Moving on —",
        ];
        aiText = `${followUps[Math.floor(Math.random() * followUps.length)]} ${SAMPLE_QUESTIONS[nextIndex]}`;
        setQuestionIndex(nextIndex);
      } else {
        aiText =
          "That wraps up our session. You gave some strong answers — particularly around handling disagreement. Let's look at your results.";
        setInterviewDone(true);
      }

      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
      setIsAiTyping(false);
    }, 1400);
  }

  // ── Finish → feedback or gate ──
  function viewFeedback() {
    if (userStatus === "guest") {
      setHasUsedFreeTrial(true);
      setScreen("feedback"); // show teased results, then gate inside
    } else {
      setScreen("feedback");
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          background: #05050f;
          color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        /* ── Glows ── */
        .glow-tl {
          position: fixed; top: -180px; left: -180px;
          width: 560px; height: 560px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%);
        }
        .glow-br {
          position: fixed; bottom: -100px; right: -100px;
          width: 480px; height: 480px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
        }

        /* ── Nav ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(5,5,15,0.8);
          backdrop-filter: blur(20px);
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
        .nav-link {
          font-size: 13px; font-weight: 300; color: #8b8aa6;
          text-decoration: none; transition: color 0.2s;
        }
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
          background: rgba(124,58,237,0.1);
          border-bottom: 1px solid rgba(124,58,237,0.2);
          padding: 10px 48px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .gb-text { font-size: 13px; font-weight: 300; color: #c4b5fd; }
        .gb-text strong { font-weight: 600; }
        .gb-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
        .gb-sign-up {
          font-size: 12px; font-weight: 500; color: #a78bfa;
          padding: 5px 14px; border-radius: 7px;
          border: 1px solid rgba(124,58,237,0.4);
          background: transparent; cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
          text-decoration: none;
          transition: background 0.2s;
        }
        .gb-sign-up:hover { background: rgba(124,58,237,0.15); }

        /* ── Page layout ── */
        .page-body {
          padding-top: 110px; /* nav + banner */
          min-height: 100vh;
          position: relative; z-index: 1;
        }
        .page-body.no-banner { padding-top: 80px; }

        /* ════════════════════════════════════════
           LANDING SCREEN
        ════════════════════════════════════════ */
        .landing-wrap {
          max-width: 780px; margin: 0 auto; padding: 48px 24px 80px;
        }

        .landing-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 24px;
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.25);
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #a78bfa;
          animation: pulseDot 2s ease infinite;
        }
        .landing-badge span { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #c4b5fd; }

        .landing-h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(30px, 4vw, 52px); font-weight: 800;
          line-height: 1.07; letter-spacing: -1.2px; color: #fff;
          margin-bottom: 16px;
        }
        .landing-h1 .grad {
          background: linear-gradient(120deg, #c084fc 10%, #818cf8 55%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .landing-sub {
          font-size: 16px; font-weight: 300; color: #8b8aa6;
          line-height: 1.7; max-width: 540px; margin-bottom: 40px;
        }

        /* free trial callout */
        .free-callout {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 18px 20px; border-radius: 12px; margin-bottom: 36px;
          background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.18);
        }
        .free-callout-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .free-callout-text h4 { font-size: 14px; font-weight: 500; color: #4ade80; margin-bottom: 4px; }
        .free-callout-text p  { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.55; }
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
          font-size: 16px; font-weight: 700; color: #fff;
          margin-bottom: 24px; letter-spacing: -0.2px;
        }
        .setup-fields { display: flex; flex-direction: column; gap: 18px; margin-bottom: 28px; }
        .setup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .field { display: flex; flex-direction: column; gap: 7px; }
        label { font-size: 12px; font-weight: 500; color: #8b8aa6; letter-spacing: 0.04em; }

        input[type="text"], select {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 300; outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
        }
        input::placeholder { color: #4f4e6a; }
        select { color: #8b8aa6; cursor: pointer; }
        select option { background: #0e0e1f; color: #fff; }
        input:focus, select:focus {
          border-color: rgba(124,58,237,0.55);
          background: rgba(124,58,237,0.05);
        }

        /* interview type selector */
        .type-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .type-pill {
          padding: 8px 16px; border-radius: 999px; cursor: pointer;
          font-size: 13px; font-weight: 400;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #8b8aa6; transition: all 0.2s;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .type-pill.active {
          background: rgba(124,58,237,0.15);
          border-color: rgba(124,58,237,0.45);
          color: #c4b5fd;
        }
        .type-pill:hover:not(.active) {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
          color: #fff;
        }

        .btn-start {
          width: 100%; padding: 15px;
          border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 15px; font-weight: 500;
          box-shadow: 0 0 28px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-start:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(124,58,237,0.55);
        }

        /* what to expect strip */
        .expect-strip {
          display: flex; gap: 20px; margin-top: 28px; flex-wrap: wrap;
        }
        .expect-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 300; color: #4f4e6a;
        }
        .expect-dot { width: 5px; height: 5px; border-radius: 50%; background: #7c3aed; }

        /* ════════════════════════════════════════
           INTERVIEW SCREEN
        ════════════════════════════════════════ */
        .interview-wrap {
          max-width: 720px; margin: 0 auto; padding: 32px 24px 120px;
          display: flex; flex-direction: column; gap: 0;
        }

        .interview-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px; padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .interview-title {
          display: flex; flex-direction: column; gap: 3px;
        }
        .interview-title h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px;
        }
        .interview-title span { font-size: 12px; color: #4f4e6a; }
        .interview-badge {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 999px;
          background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2);
          font-size: 12px; font-weight: 500; color: #4ade80;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
          animation: pulseDot 1.5s ease infinite;
        }

        /* progress bar */
        .progress-bar {
          height: 3px; background: rgba(255,255,255,0.06);
          border-radius: 999px; margin-bottom: 28px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #7c3aed, #38bdf8);
          transition: width 0.6s ease;
        }

        /* messages */
        .messages { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }

        .msg {
          display: flex; gap: 12px; align-items: flex-start;
          animation: fadeUp 0.35s ease both;
        }
        .msg.user { flex-direction: row-reverse; }

        .msg-avatar {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600;
        }
        .avatar-ai {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
        }
        .avatar-user {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: #8b8aa6;
        }

        .msg-bubble {
          max-width: 82%; padding: 14px 16px; border-radius: 14px;
          font-size: 14px; font-weight: 300; line-height: 1.65;
        }
        .bubble-ai {
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          color: #e2e0f5; border-top-left-radius: 4px;
        }
        .bubble-user {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          color: #c4c3dc; border-top-right-radius: 4px;
        }

        /* typing indicator */
        .typing-indicator {
          display: flex; align-items: center; gap: 12px; padding: 10px 0;
          animation: fadeUp 0.3s ease;
        }
        .typing-dots { display: flex; gap: 4px; align-items: center; }
        .typing-dots span {
          width: 6px; height: 6px; border-radius: 50%; background: #7c3aed;
          animation: dotBounce 1.2s ease infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        .typing-label { font-size: 12px; color: #4f4e6a; }

        /* input bar */
        .input-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 30;
          background: rgba(5,5,15,0.92);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 16px 24px;
        }
        .input-inner {
          max-width: 720px; margin: 0 auto;
          display: flex; gap: 10px; align-items: flex-end;
        }
        textarea {
          flex: 1; padding: 12px 16px; border-radius: 12px; resize: none;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 300; outline: none; line-height: 1.6;
          min-height: 48px; max-height: 140px;
          transition: border-color 0.2s;
        }
        textarea::placeholder { color: #4f4e6a; }
        textarea:focus { border-color: rgba(124,58,237,0.5); }

        .btn-send {
          width: 48px; height: 48px; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-size: 18px;
          box-shadow: 0 0 20px rgba(124,58,237,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .btn-send:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(124,58,237,0.5); }
        .btn-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .btn-finish {
          padding: 12px 22px; border-radius: 10px; border: none; cursor: pointer;
          background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80; font-family: var(--font-dm-sans), sans-serif;
          font-size: 13px; font-weight: 500;
          transition: background 0.2s;
          white-space: nowrap; flex-shrink: 0;
        }
        .btn-finish:hover { background: rgba(74,222,128,0.18); }

        /* ════════════════════════════════════════
           FEEDBACK SCREEN
        ════════════════════════════════════════ */
        .feedback-wrap {
          max-width: 720px; margin: 0 auto; padding: 32px 24px 80px;
        }

        .feedback-header { margin-bottom: 32px; }
        .feedback-header h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 26px; font-weight: 700; letter-spacing: -0.5px; color: #fff;
          margin-bottom: 6px;
        }
        .feedback-header p { font-size: 14px; font-weight: 300; color: #8b8aa6; }

        /* score cards */
        .score-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 24px; }
        .score-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 18px 16px; text-align: center;
        }
        .score-label { font-size: 11px; font-weight: 500; color: #4f4e6a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .score-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 28px; font-weight: 800; letter-spacing: -1px;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .score-bar-mini { height: 3px; background: rgba(255,255,255,0.06); border-radius: 999px; margin-top: 8px; overflow: hidden; }
        .score-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#7c3aed,#818cf8); }

        /* ai summary */
        .summary-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 24px; margin-bottom: 20px;
        }
        .summary-card h4 {
          font-family: var(--font-syne), sans-serif;
          font-size: 13px; font-weight: 600; color: #a78bfa;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .summary-card p { font-size: 14px; font-weight: 300; color: #8b8aa6; line-height: 1.7; }

        /* ── Guest gate overlay ── */
        .gate-overlay {
          position: relative; margin-top: 8px;
        }
        .gate-blur-content {
          filter: blur(6px); pointer-events: none; user-select: none;
          opacity: 0.5;
        }
        .gate-card {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .gate-inner {
          background: rgba(5,5,15,0.92);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 20px; padding: 36px 32px; text-align: center;
          backdrop-filter: blur(20px);
          max-width: 380px; width: 90%;
          box-shadow: 0 0 60px rgba(0,0,0,0.5);
        }
        .gate-icon { font-size: 32px; margin-bottom: 14px; }
        .gate-inner h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 700; color: #fff;
          margin-bottom: 10px; letter-spacing: -0.3px;
        }
        .gate-inner p {
          font-size: 13px; font-weight: 300; color: #8b8aa6;
          line-height: 1.65; margin-bottom: 22px;
        }
        .gate-perks { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; text-align: left; }
        .gate-perk {
          display: flex; align-items: center; gap: 9px;
          font-size: 12px; font-weight: 400; color: #c4b5fd;
        }
        .gate-check {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          background: rgba(124,58,237,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: #a78bfa;
        }
        .btn-gate-primary {
          width: 100%; padding: 13px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 500; margin-bottom: 10px;
          box-shadow: 0 0 24px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none; display: block;
        }
        .btn-gate-primary:hover { transform: translateY(-1px); box-shadow: 0 0 36px rgba(124,58,237,0.5); }
        .btn-gate-ghost {
          width: 100%; padding: 11px; border-radius: 10px; cursor: pointer;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #8b8aa6; font-family: var(--font-dm-sans), sans-serif;
          font-size: 13px; font-weight: 300;
          transition: background 0.2s, color 0.2s;
          text-decoration: none; display: block; text-align: center;
        }
        .btn-gate-ghost:hover { background: rgba(255,255,255,0.05); color: #fff; }

        /* blurred locked sections */
        .locked-section { position: relative; }
        .locked-section .blur-layer {
          filter: blur(5px); pointer-events: none; user-select: none; opacity: 0.45;
        }
        .locked-pill {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 18px; border-radius: 999px;
          background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3);
          font-size: 12px; font-weight: 500; color: #c4b5fd; white-space: nowrap;
        }

        /* ════════════════════════════════════════
           ANIMATIONS
        ════════════════════════════════════════ */
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        @keyframes dotBounce{ 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          nav { padding: 16px 20px; }
          .guest-banner { padding: 10px 20px; flex-wrap: wrap; }
          .score-grid { grid-template-columns: 1fr 1fr; }
          .setup-row { grid-template-columns: 1fr; }
          .landing-wrap, .interview-wrap, .feedback-wrap { padding-left: 16px; padding-right: 16px; }
          .input-bar { padding: 12px 16px; }
        }
      `}</style>

      {/* Glows */}
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

      {/* ── Guest banner (only on landing/interview screens) ── */}
      {userStatus === "guest" && screen !== "feedback" && (
        <div className="guest-banner">
          <p className="gb-text">
            🎁 <strong>1 free interview</strong> — no account needed.
            Sign up to unlock unlimited practice, resume analysis, and full feedback reports.
          </p>
          <div className="gb-actions">
            <Link href="/get-started" className="gb-sign-up">Sign up free →</Link>
          </div>
        </div>
      )}

      <div className={`page-body ${userStatus !== "guest" || screen === "feedback" ? "no-banner" : ""}`}>

        {/* ════════════════════════════════════════
            LANDING SCREEN
        ════════════════════════════════════════ */}
        {screen === "landing" && (
          <div className="landing-wrap" style={{ animation: "fadeUp 0.5s ease both" }}>
            <div className="landing-badge">
              <span className="badge-dot" />
              <span>AI Interview Practice</span>
            </div>

            <h1 className="landing-h1">
              Practice interviews that<br />
              <span className="grad">feel like the real thing.</span>
            </h1>
            <p className="landing-sub">
              Tell Nervo your target role and get a conversational AI interview — adaptive
              questions, real follow-ups, and feedback on every answer.
            </p>

            {/* Free trial callout */}
            <div className="free-callout">
              <div className="free-callout-icon">🎁</div>
              <div className="free-callout-text">
                <h4>1 full interview — completely free, no sign-up required</h4>
                <p>
                  After your free session you'll see your scores and a preview of your feedback.{" "}
                  <Link href="/get-started">Create a free account</Link> to unlock unlimited
                  interviews, full reports, and resume analysis.
                </p>
              </div>
            </div>

            {/* Setup card */}
            <div className="setup-card">
              <h3>Set up your interview</h3>
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
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioural</option>
                      <option value="product">Product sense</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Interview style</label>
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
                <span>🎙</span>
                Start free interview
              </button>

              <div className="expect-strip">
                {["~10 min session", "4–6 adaptive questions", "Instant feedback after", "No sign-up required"].map(e => (
                  <div className="expect-item" key={e}>
                    <span className="expect-dot" />
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            INTERVIEW SCREEN
        ════════════════════════════════════════ */}
        {screen === "interview" && (
          <>
            <div className="interview-wrap">
              <div className="interview-header">
                <div className="interview-title">
                  <h2>{targetRole || "Software Engineer"} Interview</h2>
                  <span>{experienceLevel} · {interviewType}</span>
                </div>
                <div className="interview-badge">
                  <span className="live-dot" />
                  In progress
                </div>
              </div>

              {/* progress */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(((questionIndex) / SAMPLE_QUESTIONS.length) * 100, 100)}%` }}
                />
              </div>

              {/* messages */}
              <div className="messages">
                {messages.map((msg, i) => (
                  <div className={`msg ${msg.role}`} key={i}>
                    <div className={`msg-avatar ${msg.role === "ai" ? "avatar-ai" : "avatar-user"}`}>
                      {msg.role === "ai" ? "N" : "U"}
                    </div>
                    <div className={`msg-bubble ${msg.role === "ai" ? "bubble-ai" : "bubble-user"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="typing-indicator">
                    <div className="msg-avatar avatar-ai">N</div>
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                    <span className="typing-label">Nervo is thinking…</span>
                  </div>
                )}
              </div>
            </div>

            {/* fixed input bar */}
            {!interviewDone ? (
              <div className="input-bar">
                <div className="input-inner">
                  <textarea
                    rows={1}
                    placeholder="Type your answer… or speak (coming soon)"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                    disabled={isAiTyping}
                  />
                  <button className="btn-send" onClick={sendAnswer} disabled={!userInput.trim() || isAiTyping}>↑</button>
                </div>
              </div>
            ) : (
              <div className="input-bar">
                <div className="input-inner" style={{ justifyContent: "center" }}>
                  <button className="btn-finish" onClick={viewFeedback}>
                    View my feedback report →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════
            FEEDBACK SCREEN
        ════════════════════════════════════════ */}
        {screen === "feedback" && (
          <div className="feedback-wrap" style={{ animation: "fadeUp 0.5s ease both" }}>
            <div className="feedback-header">
              <h2>Your interview results</h2>
              <p>{targetRole || "Software Engineer"} · {experienceLevel} · {interviewType}</p>
            </div>

            {/* Scores — always visible */}
            <div className="score-grid">
              {[
                { label: "Technical", val: 78 },
                { label: "Communication", val: 85 },
                { label: "Confidence", val: 72 },
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
                especially when discussing past challenges. Communication was clear and structured.
                The main area to focus on is leading with impact first — starting answers with the
                outcome before the context will make your responses stronger.
              </p>
            </div>

            {/* Strengths, weaknesses, suggestions — gated for guests */}
            {userStatus === "guest" ? (
              <div className="gate-overlay">
                <div className="gate-blur-content">
                  {/* Fake locked content underneath blur */}
                  <div className="summary-card" style={{ marginBottom: 16 }}>
                    <h4>Strengths</h4>
                    <p>Strong ownership language. Clear narrative structure. Demonstrated empathy in team scenarios. Responded well under follow-up pressure. Good use of the STAR format throughout.</p>
                  </div>
                  <div className="summary-card" style={{ marginBottom: 16 }}>
                    <h4>Areas to improve</h4>
                    <p>Lead with the outcome first. Quantify impact where possible. Avoid filler phrases like "I think" and "kind of". Practice concise closing statements for each answer.</p>
                  </div>
                  <div className="summary-card">
                    <h4>Suggested follow-up questions to practise</h4>
                    <p>Tell me about a time your plan completely fell apart. How did you prioritise when everything felt urgent? Describe your communication style to a new team.</p>
                  </div>
                </div>

                {/* Gate card */}
                <div className="gate-card">
                  <div className="gate-inner">
                    <div className="gate-icon">🔓</div>
                    <h3>Unlock your full report</h3>
                    <p>
                      Create a free account to see your strengths, areas to improve,
                      suggested follow-up questions, and unlimited future interviews.
                    </p>
                    <div className="gate-perks">
                      {[
                        "Full strengths & weakness breakdown",
                        "Personalised follow-up questions",
                        "Unlimited practice interviews",
                        "AI resume analyzer & ATS scoring",
                        "Track progress across sessions",
                      ].map(p => (
                        <div className="gate-perk" key={p}>
                          <span className="gate-check">✓</span>
                          {p}
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
              /* Signed-in users see everything */
              <>
                <div className="summary-card" style={{ marginBottom: 16 }}>
                  <h4>Strengths</h4>
                  <p>Strong ownership language. Clear narrative structure. Demonstrated empathy in team scenarios. Responded well under follow-up pressure.</p>
                </div>
                <div className="summary-card" style={{ marginBottom: 16 }}>
                  <h4>Areas to improve</h4>
                  <p>Lead with the outcome first. Quantify impact where possible. Avoid filler phrases. Practice concise closing statements.</p>
                </div>
                <div className="summary-card">
                  <h4>Suggested questions to practise next</h4>
                  <p>Tell me about a time your plan completely fell apart. How did you prioritise when everything felt urgent? Describe your communication style to a new team.</p>
                </div>
                <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn-start" style={{ width: "auto", padding: "13px 28px" }} onClick={() => { setScreen("landing"); setMessages([]); }}>
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