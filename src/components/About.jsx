// ─────────────────────────────────────────────────────────────
//  src/components/About.jsx  —  Saffron & Earth Theme
// ─────────────────────────────────────────────────────────────

import { FadeIn } from "../hooks/useInView.jsx";
import { useTranslation } from "../data/translations.js";

const VALUES = [
  { icon: "🎯", title: "Goal-Oriented",    desc: "Clear direction for every student's journey." },
  { icon: "💡", title: "Awareness First",  desc: "Know your options before making decisions." },
  { icon: "🌱", title: "Growth Mindset",   desc: "Continuous learning and self-improvement." },
  { icon: "🤝", title: "Community Support",desc: "Never walk alone — we grow together." },
];

export default function About({ dark, lang }) {
  const t = useTranslation(lang);

  const card = {
    background:   dark ? "rgba(217,119,6,0.06)" : "rgba(255,251,235,0.9)",
    border:       `1px solid ${dark ? "rgba(217,119,6,0.15)" : "rgba(217,119,6,0.2)"}`,
    borderRadius: 16,
    padding:      "20px 16px",
    transition:   "transform 0.2s,box-shadow 0.2s",
  };

  return (
    <section id="about" style={{ padding: "100px 2rem", background: dark ? "#140a00" : "#fffbeb" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "center" }}>

        <FadeIn>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>
              ABOUT THE INITIATIVE
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f5e6c8" : "#78350f", marginBottom: 24, lineHeight: 1.2 }}>
              {t.about.title}{" "}
              <span style={{ background: "linear-gradient(135deg,#d97706,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t.about.highlight}
              </span>
            </h2>
            <p style={{ color: dark ? "#92683a" : "#92400e", lineHeight: 1.8, fontSize: 16, marginBottom: 20, fontFamily: "'Lora',serif" }}>
              {t.about.desc}
            </p>
            <div style={{ background: dark ? "rgba(217,119,6,0.08)" : "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.25)", borderRadius: 16, padding: "20px 24px", fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 17, color: dark ? "#f5e6c8" : "#78350f", lineHeight: 1.6 }}>
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
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(217,119,6,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: dark ? "#f5e6c8" : "#78350f", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: dark ? "#92683a" : "#92400e", lineHeight: 1.5, fontFamily: "'Lora',serif" }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
