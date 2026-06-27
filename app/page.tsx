"use client";

import Link from "next/link";

export default function LandingPage() {
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
          overflow-x: hidden;
        }

        /* ── Ambient glows ── */
        .glow-l {
          position: fixed; top: -200px; left: -200px;
          width: 700px; height: 700px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
          animation: driftA 12s ease-in-out infinite alternate;
        }
        .glow-r {
          position: fixed; bottom: -100px; right: -100px;
          width: 600px; height: 600px; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 70%);
          animation: driftB 15s ease-in-out infinite alternate;
        }

        /* ── Nav ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 64px;
          background: rgba(5,5,15,0.75);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-logo {
          font-family: var(--font-syne), sans-serif;
          font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a {
          font-size: 14px; font-weight: 300; color: #8b8aa6;
          text-decoration: none; transition: color 0.2s;
        }
        .nav-links a:hover { color: #fff; }
        .nav-actions { display: flex; gap: 12px; align-items: center; }
        .nav-btn-ghost {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 400; color: #8b8aa6;
          background: transparent; cursor: pointer; text-decoration: none;
          padding: 8px 16px; border-radius: 8px;
          border: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .nav-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.1); }
        .nav-btn {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px; font-weight: 500; color: #c4b5fd;
          background: transparent; cursor: pointer; text-decoration: none;
          padding: 8px 20px; border-radius: 8px;
          border: 1px solid rgba(124,58,237,0.45);
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-btn:hover {
          background: rgba(124,58,237,0.15);
          border-color: rgba(167,139,250,0.7);
        }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 64px;
          padding: 140px 64px 80px;
          max-width: 1280px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        .hero-left { display: flex; flex-direction: column; gap: 28px; }

        .badge {
          display: inline-flex; align-items: center; gap: 8px; width: fit-content;
          padding: 6px 16px; border-radius: 999px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.3);
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
          flex-shrink: 0; animation: pulseDot 2s ease infinite;
        }
        .badge span {
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #c4b5fd;
        }

        h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(38px, 4.2vw, 62px);
          font-weight: 800; line-height: 1.07;
          letter-spacing: -1.5px; color: #fff;
        }
        .grad {
          background: linear-gradient(120deg, #c084fc 10%, #818cf8 55%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 17px; font-weight: 300; line-height: 1.7;
          color: #8b8aa6; max-width: 460px;
        }

        .hero-sub strong { color: #c4b5fd; font-weight: 500; }

        .actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: var(--font-dm-sans), sans-serif;
          font-size: 15px; font-weight: 500; text-decoration: none; cursor: pointer;
          box-shadow: 0 0 30px rgba(124,58,237,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 55px rgba(124,58,237,0.65);
        }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 24px; border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #c4b5fd; font-family: var(--font-dm-sans), sans-serif;
          font-size: 15px; font-weight: 400; text-decoration: none; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(167,139,250,0.4);
        }

        .btn-ghost {
          font-size: 14px; font-weight: 300; color: #8b8aa6;
          background: none; border: none; cursor: pointer;
          text-decoration: none; transition: color 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .btn-ghost:hover { color: #fff; }

        /* ── Dashboard mockup ── */
        .dash-wrap {
          position: relative;
          animation: fadeUp 0.9s 0.2s ease both;
        }
        .dash-glow {
          position: absolute; inset: -40px; pointer-events: none;
          background: radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.2) 0%, transparent 65%);
        }
        .dash-card {
          position: relative;
          background: rgba(12,12,28,0.92);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 20px; padding: 24px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .dash-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .dash-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 13px; font-weight: 600; color: #c4b5fd;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .dash-live {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: #4ade80;
        }
        .dash-live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
          animation: pulseDot 1.5s ease infinite;
        }
        .candidate-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .candidate-row:last-child { border-bottom: none; padding-bottom: 0; }
        .candidate-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .candidate-info { flex: 1; min-width: 0; }
        .candidate-name { font-size: 13px; font-weight: 500; color: #fff; }
        .candidate-role { font-size: 11px; color: #4f4e6a; margin-top: 1px; }
        .candidate-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .score-pill {
          font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px;
        }
        .score-high { background: rgba(74,222,128,0.12); color: #4ade80; }
        .score-mid  { background: rgba(251,191,36,0.12); color: #fbbf24; }
        .culture-tag {
          font-size: 10px; font-weight: 500; padding: 3px 8px; border-radius: 999px;
          background: rgba(192,132,252,0.12); color: #c084fc;
          border: 1px solid rgba(192,132,252,0.2);
        }
        .dash-footer {
          margin-top: 16px; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 10px;
        }
        .dash-footer-stat {
          flex: 1; text-align: center;
        }
        .dash-footer-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 700; color: #a78bfa;
        }
        .dash-footer-lbl {
          font-size: 10px; color: #4f4e6a; margin-top: 2px;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .dash-footer-div { width: 1px; height: 36px; background: rgba(255,255,255,0.05); }

        /* floating chips */
        .float-chip {
          position: absolute; font-size: 12px; font-weight: 500; white-space: nowrap;
          border-radius: 10px; padding: 8px 13px;
          background: rgba(10,10,26,0.9); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; gap: 7px;
        }
        .fc1 { top: -18px; right: 8px; color: #c084fc; animation: chipFloat 4s ease-in-out infinite; }
        .fc2 { bottom: -14px; left: 8px; color: #38bdf8; animation: chipFloat 4s 1.3s ease-in-out infinite; }
        .fc-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.7; }

        /* ── Section shared ── */
        .section {
          padding: 96px 64px;
          max-width: 1280px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        .eyebrow {
          display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
        }
        .eyebrow-line { display:inline-block; width:28px; height:1px; background:#7c3aed; }
        .eyebrow span { font-size:11px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#7c3aed; }

        h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 700; letter-spacing: -0.8px;
          color: #fff; margin-bottom: 12px;
        }
        .section-sub {
          font-size: 16px; font-weight: 300; color: #8b8aa6; line-height: 1.65;
          max-width: 560px; margin-bottom: 52px;
        }

        /* ── Audience split ── */
        .audience-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }
        .audience-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 36px 32px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, background 0.3s;
        }
        .audience-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(124,58,237,0.35);
        }
        .audience-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
        }
        .card-companies::before { background: linear-gradient(90deg, #7c3aed, #4f46e5); }
        .card-candidates::before { background: linear-gradient(90deg, #0891b2, #7c3aed); }
        .audience-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 20px;
        }
        .icon-companies { background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.25); }
        .icon-candidates { background: rgba(8,145,178,0.15); border: 1px solid rgba(8,145,178,0.25); }
        .audience-card h3 {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px; font-weight: 700; color: #fff;
          margin-bottom: 10px; letter-spacing: -0.3px;
        }
        .audience-card p {
          font-size: 14px; font-weight: 300; color: #8b8aa6; line-height: 1.65;
          margin-bottom: 24px;
        }
        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .feature-list li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.5;
        }
        .check-icon {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
        }
        .check-purple { background: rgba(124,58,237,0.15); color: #a78bfa; }
        .check-blue   { background: rgba(8,145,178,0.15);  color: #38bdf8; }
        .audience-link {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 24px;
          font-size: 13px; font-weight: 500; text-decoration: none;
          transition: gap 0.2s;
        }
        .audience-link:hover { gap: 10px; }
        .link-purple { color: #a78bfa; }
        .link-blue   { color: #38bdf8; }

        /* ── Hiring workflow ── */
        .workflow-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
          position: relative;
        }
        .workflow-line {
          position: absolute; top: 40px; left: 12.5%; right: 12.5%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.35) 20%, rgba(124,58,237,0.35) 80%, transparent);
          pointer-events: none;
        }
        .workflow-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 24px 20px;
          position: relative;
          transition: transform 0.3s, background 0.3s, border-color 0.3s;
        }
        .workflow-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.06);
          border-color: rgba(124,58,237,0.35);
        }
        .wf-num {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-syne), sans-serif;
          font-size: 13px; font-weight: 700; margin-bottom: 16px;
          background: rgba(124,58,237,0.12); color: #c4b5fd;
          border: 1px solid rgba(124,58,237,0.25);
        }
        .wf-emoji { position: absolute; top: 20px; right: 16px; font-size: 18px; opacity: 0.2; }
        .workflow-card h4 {
          font-family: var(--font-syne), sans-serif;
          font-size: 15px; font-weight: 600; color: #fff;
          margin-bottom: 8px; letter-spacing: -0.2px;
        }
        .workflow-card p { font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.6; }

        /* ── Culture fit ── */
        .culture-section {
          background: rgba(124,58,237,0.06);
          border: 1px solid rgba(124,58,237,0.15);
          border-radius: 24px; padding: 60px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
        }
        .culture-left h2 { margin-bottom: 16px; }
        .culture-left p {
          font-size: 15px; font-weight: 300; color: #8b8aa6; line-height: 1.7;
          margin-bottom: 12px;
        }
        .insight-block {
          margin-top: 24px; padding: 20px 22px;
          background: rgba(255,255,255,0.04); border-radius: 12px;
          border-left: 3px solid #7c3aed;
        }
        .insight-block p {
          font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.65;
          font-style: italic; margin-bottom: 0;
        }
        .insight-block cite {
          display: block; margin-top: 8px;
          font-size: 11px; font-style: normal; font-weight: 500;
          color: #4f4e6a; letter-spacing: 0.05em;
        }
        .trait-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .trait-pill {
          display: flex; align-items: center; gap: 9px;
          padding: 12px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          font-size: 13px; font-weight: 400; color: #c4b5fd;
          transition: background 0.2s, border-color 0.2s;
        }
        .trait-pill:hover {
          background: rgba(124,58,237,0.1);
          border-color: rgba(124,58,237,0.3);
        }
        .trait-icon { font-size: 15px; }

        /* ── Report preview ── */
        .report-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
        }
        .report-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 22px 20px;
        }
        .report-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #4f4e6a; margin-bottom: 12px;
        }
        .score-bar-wrap { display: flex; flex-direction: column; gap: 8px; }
        .score-bar-item { display: flex; flex-direction: column; gap: 5px; }
        .score-bar-top { display: flex; justify-content: space-between; }
        .score-bar-name { font-size: 12px; color: #8b8aa6; }
        .score-bar-val  { font-size: 12px; font-weight: 600; color: #fff; }
        .score-bar-track {
          height: 4px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden;
        }
        .score-bar-fill { height: 100%; border-radius: 999px; }

        .report-summary-text {
          font-size: 13px; font-weight: 300; color: #8b8aa6; line-height: 1.65;
        }
        .recommendation-badge {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 12px;
          padding: 7px 14px; border-radius: 999px;
          background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25);
          font-size: 12px; font-weight: 500; color: #4ade80;
        }
        .culture-fit-score {
          display: flex; align-items: flex-end; gap: 6px; margin-bottom: 14px;
        }
        .cfs-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 40px; font-weight: 800; color: #a78bfa; line-height: 1;
        }
        .cfs-label { font-size: 13px; color: #4f4e6a; padding-bottom: 6px; }
        .culture-trait-list { display: flex; flex-direction: column; gap: 7px; }
        .ct-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #8b8aa6;
        }
        .ct-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .ct-green  { background: #4ade80; }
        .ct-yellow { background: #fbbf24; }
        .ct-purple { background: #a78bfa; }

        /* ── Stats ── */
        .stats {
          padding: 72px 64px; text-align: center;
          position: relative; z-index: 1;
        }
        .stats-label { font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #4f4e6a; margin-bottom: 40px; }
        .stats-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 80px; }
        .stat-num {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(32px, 4vw, 46px); font-weight: 800; letter-spacing: -1.5px; display: block;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .stat-lbl { font-size: 13px; font-weight: 300; color: #4f4e6a; margin-top: 4px; }

        /* ── CTA ── */
        .cta-wrap {
          padding: 80px 64px 100px;
          max-width: 1280px; margin: 0 auto;
          position: relative; z-index: 1;
        }
        .cta-card {
          position: relative; overflow: hidden; border-radius: 24px;
          padding: 72px 48px;
          background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.07));
          border: 1px solid rgba(124,58,237,0.25);
        }
        .cta-glow {
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 400px; height: 200px; pointer-events: none;
          background: radial-gradient(ellipse, rgba(124,58,237,0.28) 0%, transparent 70%);
        }
        .cta-card h2 { margin-bottom: 16px; text-align: center; }
        .cta-sub {
          font-size: 16px; font-weight: 300; color: #8b8aa6; line-height: 1.65;
          max-width: 480px; margin: 0 auto 36px; text-align: center;
        }
        .cta-actions {
          display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;
          position: relative;
        }

        /* ── Footer ── */
        footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 28px 64px;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1280px; margin: 0 auto;
          position: relative; z-index: 1;
        }
        .footer-logo {
          font-family: var(--font-syne), sans-serif; font-size: 16px; font-weight: 700;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        footer p { font-size: 12px; font-weight: 300; color: #4f4e6a; }

        /* ── Divider ── */
        .divider {
          height: 1px; max-width: 1280px; margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.22), transparent);
        }

        /* ── Animations ── */
        .f1 { animation: fadeUp 0.7s 0.05s ease both; }
        .f2 { animation: fadeUp 0.7s 0.15s ease both; }
        .f3 { animation: fadeUp 0.7s 0.25s ease both; }
        .f4 { animation: fadeUp 0.7s 0.35s ease both; }
        .f5 { animation: fadeUp 0.7s 0.45s ease both; }

        @keyframes driftA  { from{transform:translate(0,0)}     to{transform:translate(60px,40px)} }
        @keyframes driftB  { from{transform:translate(0,0)}     to{transform:translate(-40px,-60px)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.75)} }
        @keyframes chipFloat{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 120px 24px 60px; gap: 40px; }
          nav { padding: 20px 24px; }
          .nav-links { display: none; }
          .audience-grid { grid-template-columns: 1fr; }
          .workflow-grid { grid-template-columns: 1fr 1fr; }
          .workflow-line { display: none; }
          .culture-section { grid-template-columns: 1fr; padding: 36px 28px; gap: 36px; }
          .report-grid { grid-template-columns: 1fr; }
          .section { padding: 60px 24px; }
          .stats { padding: 60px 24px; }
          .cta-wrap { padding: 60px 24px 80px; }
          .cta-card { padding: 48px 28px; }
          footer { padding: 24px 24px; }
        }
      `}</style>

      <div className="glow-l" aria-hidden="true" />
      <div className="glow-r" aria-hidden="true" />

      {/* ── Nav ── */}
      <nav>
        <span className="nav-logo">Nervo</span>
        <ul className="nav-links">
          <li><a href="#for-companies">For companies</a></li>
          <li><a href="#for-candidates">For candidates</a></li>
          <li><a href="#how-it-works">How it works</a></li>
        </ul>
        <div className="nav-actions">
          <Link href="/get-started" className="nav-btn-ghost">Sign in</Link>
          <Link href="/get-started" className="nav-btn">Get started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="badge f1">
            <span className="badge-dot" />
            <span>AI Hiring Assistant</span>
          </div>

          <h1 className="f2">
            Automate First-Round<br />
            Interviews. Hire for<br />
            <span className="grad">Culture & Skill.</span>
          </h1>

          <p className="hero-sub f3">
            Nervo conducts AI interviews at scale — evaluating technical ability <strong>and</strong> culture fit —
            so your team only spends time on the candidates who are actually worth it.
          </p>

          <div className="actions f4">
            <Link href="/get-started" className="btn-primary">
              Start hiring with Nervo →
            </Link>
            <Link href="/practice" className="btn-secondary">
              Practice an interview
            </Link>
          </div>
        </div>

        {/* Right — Dashboard mockup */}
        <div className="dash-wrap f4">
          <div className="dash-glow" aria-hidden="true" />
          <div className="float-chip fc1">
            <span className="fc-dot" />
            3 interviews in progress
          </div>
          <div className="dash-card">
            <div className="dash-header">
              <span className="dash-title">Senior Product Designer — Shortlist</span>
              <span className="dash-live"><span className="dash-live-dot" />Live</span>
            </div>

            {[
              { initials: "AO", bg: "linear-gradient(135deg,#7c3aed,#4f46e5)", name: "Aisha Okonkwo", role: "5 yrs · UX / Systems Design", score: "92%", scoreClass: "score-high", culture: "Culture: Strong" },
              { initials: "LM", bg: "linear-gradient(135deg,#0891b2,#6366f1)", name: "Lucas Martins",  role: "4 yrs · Product / SaaS",      score: "88%", scoreClass: "score-high", culture: "Culture: High" },
              { initials: "PR", bg: "linear-gradient(135deg,#6d28d9,#a21caf)", name: "Priya Rao",     role: "3 yrs · Mobile / Growth",     score: "74%", scoreClass: "score-mid",  culture: "Culture: Moderate" },
            ].map(c => (
              <div className="candidate-row" key={c.initials}>
                <div className="candidate-avatar" style={{ background: c.bg }}>{c.initials}</div>
                <div className="candidate-info">
                  <div className="candidate-name">{c.name}</div>
                  <div className="candidate-role">{c.role}</div>
                </div>
                <div className="candidate-meta">
                  <span className={`score-pill ${c.scoreClass}`}>{c.score}</span>
                  <span className="culture-tag">{c.culture}</span>
                </div>
              </div>
            ))}

            <div className="dash-footer">
              <div className="dash-footer-stat">
                <div className="dash-footer-num">14</div>
                <div className="dash-footer-lbl">Interviewed</div>
              </div>
              <div className="dash-footer-div" />
              <div className="dash-footer-stat">
                <div className="dash-footer-num">3</div>
                <div className="dash-footer-lbl">Shortlisted</div>
              </div>
              <div className="dash-footer-div" />
              <div className="dash-footer-stat">
                <div className="dash-footer-num">6h</div>
                <div className="dash-footer-lbl">Time saved</div>
              </div>
            </div>
          </div>
          <div className="float-chip fc2">
            <span className="fc-dot" />
            Culture fit report ready
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Who it's for ── */}
      <section className="section" id="for-companies">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          <span>Built for both sides of hiring</span>
        </div>
        <h2>One platform. Two powerful use cases.</h2>
        <p className="section-sub">
          Whether you're building a team or preparing for your next role, Nervo has you covered.
        </p>

        <div className="audience-grid">
          {/* Companies */}
          <div className="audience-card card-companies">
            <div className="audience-icon icon-companies">🏢</div>
            <h3>For companies</h3>
            <p>
              Launch a hiring campaign and let Nervo interview every applicant — asking tailored technical
              and behavioral questions, evaluating culture fit, and handing you a ranked shortlist.
            </p>
            <ul className="feature-list">
              {[
                "AI conducts first-round interviews at any scale",
                "Culture fit evaluation alongside technical scoring",
                "Detailed candidate reports with hiring recommendations",
                "Transcript, recording, and AI summary per candidate",
                "Automatic ranking — only review the top candidates",
              ].map(f => (
                <li key={f}>
                  <span className="check-icon check-purple">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/companies" className="audience-link link-purple">
              See how it works for recruiters →
            </Link>
          </div>

          {/* Candidates */}
          <div className="audience-card card-candidates" id="for-candidates">
            <div className="audience-icon icon-candidates">🎯</div>
            <h3>For candidates</h3>
            <p>
              Practice interviews tailored to your resume and target role. Get scored on communication,
              technical depth, and confidence — then use the feedback to improve before the real thing.
            </p>
            <ul className="feature-list">
              {[
                "AI voice interview based on your resume and job description",
                "Scores across technical, communication, confidence & problem-solving",
                "Personalized improvement suggestions after every session",
                "AI resume analyzer with ATS score and job match scoring",
                "Resume builder with target-role optimization",
              ].map(f => (
                <li key={f}>
                  <span className="check-icon check-blue">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/practice" className="audience-link link-blue">
              Start practicing free →
            </Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Hiring workflow ── */}
      <section className="section" id="how-it-works">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          <span>Hiring workflow</span>
        </div>
        <h2>From job post to shortlist — automatically.</h2>
        <p className="section-sub">
          Nervo replaces the most time-consuming part of hiring: interviewing every applicant.
          You focus on the decisions; Nervo handles the conversations.
        </p>

        <div className="workflow-grid">
          <div className="workflow-line" />
          {[
            { num: "01", emoji: "📋", title: "Create a campaign", body: "Set the role, skills, experience level, company values, and how many candidates to shortlist." },
            { num: "02", emoji: "🔗", title: "Share the link", body: "Candidates receive a personalised interview link. No scheduling. No back-and-forth." },
            { num: "03", emoji: "🤖", title: "AI interviews everyone", body: "Nervo asks technical and behavioral questions, follows up dynamically, and evaluates every response." },
            { num: "04", emoji: "📊", title: "Review your shortlist", body: "Get ranked candidates with transcripts, culture fit scores, and hiring recommendations. Decide faster." },
          ].map(s => (
            <div className="workflow-card" key={s.num}>
              <div className="wf-num">{s.num}</div>
              <span className="wf-emoji">{s.emoji}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Culture fit ── */}
      <section className="section">
        <div className="culture-section">
          <div className="culture-left">
            <div className="eyebrow" style={{ marginBottom: "12px" }}>
              <span className="eyebrow-line" />
              <span>Culture fit analysis</span>
            </div>
            <h2>Technical skills are table stakes.<br />Culture fit is the real risk.</h2>
            <p>
              A candidate can learn any technical skill in six months. A bad culture fit can damage a team
              that took years to build.
            </p>
            <p>
              Nervo's AI goes beyond job knowledge — it assesses ownership, accountability, coachability, and
              team compatibility through behavioral questions designed around your company's values.
            </p>
            <div className="insight-block">
              <p>
                "Technical skills are becoming easier to learn because AI can help. The real challenge
                is finding people who fit your culture. One bad hire can poison an entire team."
              </p>
              <cite>— Hiring manager, 18 years experience</cite>
            </div>
          </div>

          <div className="trait-grid">
            {[
              { icon: "🎯", label: "Ownership & accountability" },
              { icon: "🤝", label: "Team collaboration" },
              { icon: "🌱", label: "Growth mindset" },
              { icon: "🔄", label: "Adaptability" },
              { icon: "💬", label: "Communication style" },
              { icon: "⚡", label: "Leadership potential" },
              { icon: "🧩", label: "Conflict resolution" },
              { icon: "❤️", label: "Values alignment" },
            ].map(t => (
              <div className="trait-pill" key={t.label}>
                <span className="trait-icon">{t.icon}</span>
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Report preview ── */}
      <section className="section">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          <span>Candidate report</span>
        </div>
        <h2>Every candidate. A full picture.</h2>
        <p className="section-sub">
          No more gut feelings. Every interview produces a structured report so you can compare
          candidates fairly and make confident decisions.
        </p>

        <div className="report-grid">
          {/* Scores */}
          <div className="report-card">
            <div className="report-label">Performance scores</div>
            <div className="score-bar-wrap">
              {[
                { name: "Technical ability", val: 88, color: "#818cf8" },
                { name: "Communication",     val: 92, color: "#38bdf8" },
                { name: "Problem solving",   val: 79, color: "#a78bfa" },
                { name: "Confidence",         val: 85, color: "#c084fc" },
              ].map(s => (
                <div className="score-bar-item" key={s.name}>
                  <div className="score-bar-top">
                    <span className="score-bar-name">{s.name}</span>
                    <span className="score-bar-val">{s.val}%</span>
                  </div>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${s.val}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI summary */}
          <div className="report-card">
            <div className="report-label">AI summary</div>
            <p className="report-summary-text">
              Strong senior-level candidate who demonstrates clear systems thinking and user empathy.
              Communicates trade-offs confidently and asks clarifying questions before diving in.
              Showed genuine ownership of past failures. Low risk for culture friction.
            </p>
            <div className="recommendation-badge">
              ✓ Recommended for next round
            </div>
          </div>

          {/* Culture fit */}
          <div className="report-card">
            <div className="report-label">Culture fit</div>
            <div className="culture-fit-score">
              <span className="cfs-num">91</span>
              <span className="cfs-label">/ 100</span>
            </div>
            <div className="culture-trait-list">
              {[
                { dot: "ct-green",  label: "High ownership — strong" },
                { dot: "ct-green",  label: "Team collaboration — strong" },
                { dot: "ct-green",  label: "Coachability — excellent" },
                { dot: "ct-yellow", label: "Conflict resolution — moderate" },
              ].map(c => (
                <div className="ct-item" key={c.label}>
                  <span className={`ct-dot ${c.dot}`} />
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Stats ── */}
      <section className="stats">
        <p className="stats-label">Results that speak for themselves</p>
        <div className="stats-row">
          {[
            ["94%", "of candidates report more confidence after practice"],
            ["6× faster", "first-round screening vs. manual interviews"],
            ["3,200+", "hiring campaigns run on Nervo"],
          ].map(([n, l]) => (
            <div key={n}>
              <span className="stat-num">{n}</span>
              <p className="stat-lbl">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── CTA ── */}
      <div className="cta-wrap">
        <div className="cta-card">
          <div className="cta-glow" />
          <h2>Ready to hire smarter?</h2>
          <p className="cta-sub">
            Stop spending hours on first-round interviews. Let Nervo find the candidates worth your time.
          </p>
          <div className="cta-actions">
            <Link href="/companies" className="btn-primary">
              Start a hiring campaign →
            </Link>
            <Link href="/practice" className="btn-secondary">
              Practice an interview
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer>
        <span className="footer-logo">Nervo</span>
        <p>© 2026 Nervo. All rights reserved.</p>
      </footer>
    </>
  );
}