// ─────────────────────────────────────────────────────────────
//  src/components/About.jsx
// ─────────────────────────────────────────────────────────────

import { FadeIn } from "../hooks/useInView.js";

const VALUES = [
  { icon: "🎯", title: "Goal-Oriented",    desc: "Clear direction for every student's journey." },
  { icon: "💡", title: "Awareness First",  desc: "Know your options before making decisions." },
  { icon: "🌱", title: "Growth Mindset",   desc: "Continuous learning and self-improvement." },
  { icon: "🤝", title: "Community Support",desc: "Never walk alone — we grow together." },
];

export default function About({ dark }) {
  const card = {
    background:   dark ? "rgba(255,255,255,0.04)" : "#fff",
    border:       `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
    borderRadius: 16,
    padding:      "20px 16px",
    transition:   "transform 0.2s,box-shadow 0.2s",
  };

  return (
    <section id="about" style={{ padding: "100px 2rem", background: dark ? "#060d1f" : "#f8fafc" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "center" }}>

        <FadeIn>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>
              ABOUT THE INITIATIVE
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 24, lineHeight: 1.2 }}>
              Seniors Guiding{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Juniors</span>{" "}
              Forward
            </h2>
            <p style={{ color: dark ? "#94a3b8" : "#475569", lineHeight: 1.8, fontSize: 16, marginBottom: 20, fontFamily: "'Lora',serif" }}>
              This initiative is started by seniors to support juniors with guidance, awareness, mentorship, and opportunities. We believe every student deserves clarity about their future.
            </p>
            <div style={{ background: dark ? "rgba(56,189,248,0.08)" : "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 16, padding: "20px 24px", fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 17, color: dark ? "#e2e8f0" : "#1e293b", lineHeight: 1.6 }}>
              ✨ "Small guidance today can create big success tomorrow."
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {VALUES.map(v => (
              <div
                key={v.title}
                style={card}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(56,189,248,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: dark ? "#e2e8f0" : "#0f172a", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: dark ? "#64748b" : "#64748b", lineHeight: 1.5, fontFamily: "'Lora',serif" }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
