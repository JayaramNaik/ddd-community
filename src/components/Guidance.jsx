// ─────────────────────────────────────────────────────────────
//  src/components/Guidance.jsx
//  To add/edit areas → update src/data/content.js (GUIDANCE_AREAS)
// ─────────────────────────────────────────────────────────────

import { FadeIn } from "../hooks/useInView.js";
import { GUIDANCE_AREAS } from "../data/content.js";

export default function Guidance({ dark }) {
  return (
    <section id="guidance" style={{ padding: "100px 2rem", background: dark ? "#060d1f" : "#f1f5f9" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>
              WHAT WE OFFER
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f1f5f9" : "#0f172a" }}>
              Areas of{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Guidance</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {GUIDANCE_AREAS.map((area, i) => (
            <FadeIn key={area.title} delay={i * 0.1}>
              <div
                style={{ background: dark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, borderRadius: 20, padding: "32px 28px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(56,189,248,0.18)"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"; }}
              >
                <div style={{ fontSize: 44, marginBottom: 18 }}>{area.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 12 }}>{area.title}</h3>
                <p style={{ fontSize: 14, color: dark ? "#64748b" : "#64748b", lineHeight: 1.7, fontFamily: "'Lora',serif" }}>{area.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
