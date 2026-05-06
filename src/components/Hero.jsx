// ─────────────────────────────────────────────────────────────
//  src/components/Hero.jsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { FadeIn } from "../hooks/useInView.jsx";
import { WHATSAPP_LINK } from "../data/content.js";

const PARTICLE_COUNT = 30;

export default function Hero({ dark }) {
  const [particles] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x:     Math.random() * 100,
      y:     Math.random() * 100,
      size:  Math.random() * 3 + 1,
      delay: Math.random() * 5,
      dur:   4 + Math.random() * 6,
    }))
  );

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", paddingTop: 80,
      background: dark
        ? "linear-gradient(135deg,#020818 0%,#0c1445 50%,#0a0a1a 100%)"
        : "linear-gradient(135deg,#e0f2fe 0%,#ede9fe 50%,#f0fdf4 100%)",
    }}>

      {/* Background blobs */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,0.18) 0%,transparent 70%)", top: "10%", left: "-10%", animation: "blob 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(129,140,248,0.18) 0%,transparent 70%)", bottom: "5%", right: "-5%", animation: "blob 10s ease-in-out infinite reverse" }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: "rgba(56,189,248,0.5)", animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate` }} />
      ))}

      {/* Main content */}
      <div style={{ textAlign: "center", zIndex: 2, padding: "2rem" }}>

        <FadeIn>
          <div style={{ display: "inline-block", background: dark ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 20, padding: "6px 18px", fontSize: 12, color: "#38bdf8", fontWeight: 700, marginBottom: 24, fontFamily: "'Syne', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Student Mentorship Community 🌟
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h1 style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)", fontFamily: "'Playfair Display', serif", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: dark ? "#fff" : "#0f172a" }}>
            <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dream • Decide</span>
            <br />
            <span style={{ color: dark ? "#fff" : "#0f172a" }}>Dominate ✨</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p style={{ fontSize: "clamp(1rem,2.5vw,1.3rem)", color: dark ? "#94a3b8" : "#475569", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7, fontFamily: "'Lora', serif" }}>
            A student mentorship community helping juniors make better academic, career, and life decisions.
          </p>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "linear-gradient(135deg,#38bdf8,#6366f1)", color: "#fff", padding: "14px 32px", borderRadius: 50, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 0 30px rgba(56,189,248,0.4)", transition: "transform 0.2s,box-shadow 0.2s", fontFamily: "'Syne', sans-serif" }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 50px rgba(56,189,248,0.6)"; }}
              onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 0 30px rgba(56,189,248,0.4)"; }}
            >
              Join Community 🚀
            </a>
            <a
              href="#guidance"
              style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: `1.5px solid ${dark ? "rgba(56,189,248,0.3)" : "rgba(56,189,248,0.5)"}`, color: dark ? "#e2e8f0" : "#0f172a", padding: "14px 32px", borderRadius: 50, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", fontFamily: "'Syne', sans-serif" }}
              onMouseEnter={e => { e.target.style.background = "rgba(56,189,248,0.12)"; }}
              onMouseLeave={e => { e.target.style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"; }}
            >
              Explore Opportunities →
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div style={{ marginTop: 56, display: "inline-block", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${dark ? "rgba(56,189,248,0.2)" : "rgba(56,189,248,0.3)"}`, borderRadius: 16, padding: "18px 32px", maxWidth: 520 }}>
            <p style={{ margin: 0, fontSize: 15, color: dark ? "#94a3b8" : "#475569", fontFamily: "'Lora', serif", fontStyle: "italic", lineHeight: 1.75 }}>
              🌱 We are just beginning — seniors and juniors learning together, one step at a time. This is a new chapter for all of us.
            </p>
          </div>
        </FadeIn>
      </div>

      <style>{`
        @keyframes blob  { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.1) translate(20px,-20px)} }
        @keyframes float { from{transform:translateY(0)} to{transform:translateY(-15px)} }
      `}</style>
    </section>
  );
}
