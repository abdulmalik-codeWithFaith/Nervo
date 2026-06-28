"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type CallStatus = "idle" | "ai-speaking" | "listening" | "processing";

interface Turn { role: "ai" | "user"; text: string; }

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

function speak(text: string, onEnd: () => void) {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95; utter.pitch = 1; utter.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    /samantha|karen|daniel|moira|fiona|kate|victoria|zira|david/i.test(v.name)
  ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
  if (preferred) utter.voice = preferred;
  utter.onend = onEnd; utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

export default function PracticePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<"setup" | "call">("setup");
  const [targetRole, setTargetRole] = useState("");
  const [interviewType, setInterviewType] = useState("General");
  const [experienceLevel, setExperienceLevel] = useState("mid");

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [liveCaption, setLiveCaption] = useState("");
  const [aiCaption, setAiCaption] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [interviewDone, setInterviewDone] = useState(false);
  const [micError, setMicError] = useState("");
  const [muted, setMuted] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicError("Speech recognition not supported. Please use Chrome."); return; }
    const rec = new SR();
    rec.continuous = false; rec.interimResults = true; rec.lang = "en-US";
    recognitionRef.current = rec;
    rec.onstart  = () => { setLiveCaption(""); setCallStatus("listening"); };
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      setLiveCaption(final || interim);
    };
    rec.onend = () => {
      setLiveCaption(prev => {
        const captured = prev.trim();
        if (captured) handleUserAnswer(captured);
        else { setCallStatus("listening"); setTimeout(() => startListening(), 600); }
        return "";
      });
    };
    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "no-speech") setTimeout(() => startListening(), 800);
      else if (e.error === "not-allowed") { setMicError("Microphone access denied."); setCallStatus("idle"); }
    };
    rec.start();
  }, []);

  const aiSpeak = useCallback((text: string, done = false) => {
    setCallStatus("ai-speaking");
    setAiCaption(text);
    setTranscript(prev => [...prev, { role: "ai", text }]);
    speak(text, () => {
      if (done) { setInterviewDone(true); setCallStatus("idle"); setAiCaption(""); return; }
      setCallStatus("listening"); setAiCaption(""); startListening();
    });
  }, [startListening]);

  const handleUserAnswer = useCallback((answer: string) => {
    setCallStatus("processing");
    setTranscript(prev => [...prev, { role: "user", text: answer }]);
    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex < QUESTIONS.length) {
        const fu = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];
        setQuestionIndex(nextIndex);
        aiSpeak(`${fu} ${QUESTIONS[nextIndex]}`);
      } else {
        aiSpeak("That wraps up our session. You gave some really thoughtful answers. Give me a moment and I'll take you to your feedback report.", true);
      }
    }, 600);
  }, [questionIndex, aiSpeak]);

  function startCall() {
    setTranscript([]); setQuestionIndex(0); setCallDuration(0);
    setInterviewDone(false); setLiveCaption(""); setAiCaption(""); setMicError("");
    setScreen("call");
    timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    setTimeout(() => {
      const opening = `Hi! I'm your Nervo AI interviewer. Today we're running a ${interviewType.toLowerCase()} interview for a ${targetRole || "Software Engineer"} role at the ${experienceLevel} level. Speak naturally and take your time. Let's begin. ${QUESTIONS[0]}`;
      aiSpeak(opening);
    }, 500);
  }

  function endCall() {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();
    if (timerRef.current) clearInterval(timerRef.current);
    router.push("/dashboard/feedback");
  }

  function toggleMute() {
    if (!muted) {
      if (recognitionRef.current) recognitionRef.current.abort();
      setMuted(true); setCallStatus("idle");
    } else {
      setMuted(false);
      if (!interviewDone && !aiCaption) { setCallStatus("listening"); startListening(); }
    }
  }

  return (
    <>
      <style>{`
        /* ── Setup ── */
        .setup-wrap { max-width: 640px; animation: fadeUp 0.4s ease both; }
        .setup-intro { margin-bottom: 28px; }
        .setup-intro h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.4px; margin-bottom: 6px;
        }
        .setup-intro p { font-size: 14px; font-weight: 300; color: #8b8aa6; line-height: 1.6; }

        .setup-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 28px;
        }
        .setup-card h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 20px; letter-spacing: -0.2px;
        }
        .setup-fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 22px; }
        .setup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 11px; font-weight: 500; color: #8b8aa6; letter-spacing: 0.05em; text-transform: uppercase; }
        input[type="text"], select {
          width: 100%; padding: 10px 13px; border-radius: 9px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 13px; font-weight: 300; outline: none;
          transition: border-color 0.2s; -webkit-appearance: none;
        }
        input::placeholder { color: #4f4e6a; }
        select { color: #8b8aa6; cursor: pointer; }
        select option { background: #0e0e1f; color: #fff; }
        input:focus, select:focus { border-color: rgba(124,58,237,0.5); }

        .style-pills { display: flex; gap: 7px; flex-wrap: wrap; }
        .style-pill {
          padding: 7px 14px; border-radius: 999px; cursor: pointer; font-size: 12px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #8b8aa6; transition: all 0.2s; font-family: var(--font-dm-sans), sans-serif;
        }
        .style-pill.active { background: rgba(124,58,237,0.14); border-color: rgba(124,58,237,0.4); color: #c4b5fd; }

        .btn-start-call {
          width: 100%; padding: 14px; border-radius: 11px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff;
          font-family: var(--font-dm-sans), sans-serif; font-size: 14px; font-weight: 500;
          box-shadow: 0 0 26px rgba(124,58,237,0.35); transition: transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 9px;
        }
        .btn-start-call:hover { transform: translateY(-2px); box-shadow: 0 0 44px rgba(124,58,237,0.55); }

        .mic-note { text-align: center; margin-top: 13px; font-size: 11px; color: #4f4e6a; }
        .mic-note span { color: #6d5acf; }

        /* ── Call screen ── */
        .call-wrap {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: calc(100vh - 120px); animation: fadeUp 0.4s ease both;
        }
        .call-card {
          width: 100%; max-width: 440px;
          background: rgba(10,10,24,0.9); border: 1px solid rgba(124,58,237,0.2);
          border-radius: 28px; padding: 36px 32px 30px;
          backdrop-filter: blur(24px);
          box-shadow: 0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
          display: flex; flex-direction: column; align-items: center;
        }
        .call-hd {
          width: 100%; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px;
        }
        .call-hd-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 13px; font-weight: 600; color: #a78bfa; letter-spacing: 0.05em;
        }
        .call-timer {
          font-family: var(--font-syne), sans-serif;
          font-size: 13px; font-weight: 600; color: #4f4e6a; letter-spacing: 0.1em;
        }

        /* progress */
        .prog-dots { display: flex; gap: 6px; margin-bottom: 30px; }
        .prog-dot {
          height: 4px; border-radius: 999px; transition: all 0.5s ease;
        }
        .pd-done   { background: #7c3aed; width: 22px; }
        .pd-active { background: linear-gradient(90deg,#7c3aed,#38bdf8); width: 30px; }
        .pd-future { background: rgba(255,255,255,0.07); width: 12px; }

        /* orb */
        .orb-wrap { position: relative; margin-bottom: 24px; }
        .orb {
          width: 100px; height: 100px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #a78bfa, #6d28d9 55%, #1e1b4b 100%);
        }
        .orb.speaking { animation: orbPulse 1.2s ease-in-out infinite; }
        .orb-shine {
          position: absolute; inset: 12px; border-radius: 50%;
          background: radial-gradient(circle at 40% 30%, rgba(255,255,255,0.22), transparent 65%);
        }
        .orb-tag {
          position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
          background: rgba(124,58,237,0.9); border-radius: 999px; padding: 3px 11px;
          font-size: 10px; font-weight: 600; color: #fff; white-space: nowrap;
          border: 1px solid rgba(167,139,250,0.4);
        }

        /* waves */
        .wave-bars { display: flex; align-items: center; gap: 4px; height: 28px; margin-bottom: 18px; }
        .wb { width: 4px; border-radius: 999px; background: linear-gradient(180deg,#a78bfa,#4f46e5); animation: waveBounce 0.8s ease-in-out infinite; }
        .wb:nth-child(1){animation-delay:0s;   height:9px}
        .wb:nth-child(2){animation-delay:0.1s; height:18px}
        .wb:nth-child(3){animation-delay:0.2s; height:26px}
        .wb:nth-child(4){animation-delay:0.15s;height:20px}
        .wb:nth-child(5){animation-delay:0.05s;height:13px}
        .wb:nth-child(6){animation-delay:0.25s;height:24px}
        .wb:nth-child(7){animation-delay:0.1s; height:16px}
        .wb.flat { animation: none; height: 4px !important; opacity: 0.25; }

        .status-text {
          font-size: 12px; color: #8b8aa6; margin-bottom: 10px; text-align: center; min-height: 18px;
        }

        /* caption */
        .caption {
          width: 100%; padding: 11px 14px; border-radius: 10px; text-align: center;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          font-size: 13px; font-weight: 300; color: #c4b5fd; line-height: 1.55; margin-bottom: 22px;
          min-height: 46px; transition: border-color 0.3s;
        }
        .caption.active { border-color: rgba(124,58,237,0.4); }
        .caption.dim { color: #4f4e6a; }

        /* mic ring */
        .mic-ring-outer { position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 22px; }
        .mic-pulse { position: absolute; width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(124,58,237,0.3); animation: ringOut 1.5s ease-out infinite; }
        .mic-pulse:nth-child(2){ animation-delay: 0.5s; }
        .mic-btn {
          width: 56px; height: 56px; border-radius: 50%; z-index: 1;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: rgba(124,58,237,0.12); border: 2px solid rgba(124,58,237,0.3);
        }
        .mic-btn.on { animation: micPulse 1.5s ease-in-out infinite; background: rgba(124,58,237,0.2); border-color: rgba(167,139,250,0.6); }
        .mic-btn.proc { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.35); }

        /* controls */
        .controls { display: flex; align-items: center; justify-content: center; gap: 14px; }
        .ctrl {
          width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          transition: transform 0.15s, background 0.2s;
        }
        .ctrl:hover { transform: scale(1.08); }
        .ctrl-mute { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); }
        .ctrl-mute.muted { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.3); }
        .ctrl-end { background: rgba(239,68,68,0.14); border: 1px solid rgba(239,68,68,0.28); width: 58px; height: 58px; font-size: 20px; }
        .ctrl-end:hover { background: rgba(239,68,68,0.24); }

        .mic-err { margin-top: 14px; padding: 11px 14px; border-radius: 10px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); font-size: 12px; color: #f87171; text-align: center; }

        /* done banner */
        .done-banner {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          background: rgba(5,5,15,0.96); backdrop-filter: blur(20px);
          border-top: 1px solid rgba(74,222,128,0.2); padding: 16px 24px;
          display: flex; align-items: center; justify-content: center; gap: 14px;
        }
        .done-banner p { font-size: 13px; color: #8b8aa6; }
        .btn-see-results {
          padding: 11px 24px; border-radius: 9px; border: none; cursor: pointer;
          background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff;
          font-family: var(--font-dm-sans), sans-serif; font-size: 13px; font-weight: 500;
          box-shadow: 0 0 20px rgba(124,58,237,0.35); transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-see-results:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(124,58,237,0.5); }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbPulse  { 0%,100%{box-shadow:0 0 28px rgba(124,58,237,.5),0 0 56px rgba(124,58,237,.22)} 50%{box-shadow:0 0 52px rgba(124,58,237,.8),0 0 100px rgba(124,58,237,.38)} }
        @keyframes waveBounce{ 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
        @keyframes micPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)} 50%{box-shadow:0 0 0 10px rgba(124,58,237,0)} }
        @keyframes ringOut   { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.1);opacity:0} }

        @media (max-width: 580px) {
          .setup-row { grid-template-columns: 1fr; }
          .call-card { padding: 24px 18px 20px; }
        }
      `}</style>

      {/* ── Setup screen ── */}
      {screen === "setup" && (
        <div className="setup-wrap">
          <div className="setup-intro">
            <h2>Start a new voice interview</h2>
            <p>
              Set your role and Nervo will run a real-time AI interview — asking questions out loud,
              listening to your answers, and generating a full feedback report when you're done.
            </p>
          </div>

          <div className="setup-card">
            <h3>Interview settings</h3>
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
                  <label>Focus</label>
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
                <div className="style-pills">
                  {["Conversational", "Structured", "Pressure test"].map(t => (
                    <button
                      key={t}
                      className={`style-pill ${interviewType === t ? "active" : ""}`}
                      onClick={() => setInterviewType(t)}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn-start-call" onClick={startCall}>
              <span>📞</span> Start voice interview
            </button>
            <p className="mic-note">
              Nervo will request <span>microphone access</span> · Works best in Chrome
            </p>
          </div>
        </div>
      )}

      {/* ── Call screen ── */}
      {screen === "call" && (
        <>
          <div className="call-wrap">
            <div className="call-card">
              <div className="call-hd">
                <span className="call-hd-title">{targetRole || "Software Engineer"} · {interviewType}</span>
                <span className="call-timer">{formatTime(callDuration)}</span>
              </div>

              <div className="prog-dots">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`prog-dot ${i < questionIndex ? "pd-done" : i === questionIndex ? "pd-active" : "pd-future"}`} />
                ))}
              </div>

              <div className="orb-wrap">
                <div className={`orb ${callStatus === "ai-speaking" ? "speaking" : ""}`}>
                  <div className="orb-shine" />
                </div>
                <div className="orb-tag">
                  {callStatus === "ai-speaking" ? "Speaking…" :
                   callStatus === "listening"   ? "Your turn" :
                   callStatus === "processing"  ? "Processing…" : "Nervo AI"}
                </div>
              </div>

              <div className="wave-bars">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`wb ${callStatus !== "ai-speaking" ? "flat" : ""}`} />
                ))}
              </div>

              <p className="status-text">
                {callStatus === "ai-speaking" ? aiCaption.slice(0, 55) + (aiCaption.length > 55 ? "…" : "") :
                 callStatus === "listening"   ? "Listening — speak your answer" :
                 callStatus === "processing"  ? "Got it, thinking…" :
                 interviewDone               ? "Interview complete ✓" : "Connecting…"}
              </p>

              {/* caption / mic ring */}
              {callStatus === "listening" && (
                <>
                  <div className={`caption ${liveCaption ? "active" : "dim"}`}>
                    {liveCaption || "Start speaking…"}
                  </div>
                  <div className="mic-ring-outer">
                    <div className="mic-pulse" />
                    <div className="mic-pulse" />
                    <div className="mic-btn on">🎙</div>
                  </div>
                </>
              )}

              {callStatus === "processing" && (
                <div className="mic-ring-outer">
                  <div className="mic-btn proc">⏳</div>
                </div>
              )}

              <div className="controls">
                <button className={`ctrl ctrl-mute ${muted ? "muted" : ""}`} onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
                  {muted ? "🔇" : "🎤"}
                </button>
                <button className="ctrl ctrl-end" onClick={endCall} title="End call">📵</button>
              </div>

              {micError && <p className="mic-err">{micError}</p>}
            </div>
          </div>

          {interviewDone && (
            <div className="done-banner">
              <p>Interview complete — your report is ready.</p>
              <button className="btn-see-results" onClick={endCall}>View feedback →</button>
            </div>
          )}
        </>
      )}
    </>
  );
}