// ─────────────────────────────────────────────────────────────
//  src/components/Mentors.jsx
//  To add/edit mentors → update src/data/content.js (MENTORS)
// ─────────────────────────────────────────────────────────────

import { FadeIn } from "../hooks/useInView.jsx";
import { useTranslation } from "../data/translations.js";
import { MENTORS } from "../data/content.js";

export default function Mentors({ dark, lang }) {
  const t = useTranslation(lang);
  return (
    <section id="mentors" style={{ padding: "100px 2rem", background: dark ? "#040b1c" : "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>
              MEET YOUR MENTORS
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f1f5f9" : "#0f172a" }}>
              {t.mentors.title}{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.mentors.highlight}</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 28 }}>
          {MENTORS.map((mentor, i) => (
            <FadeIn key={mentor.name} delay={i * 0.15}>
              <div
                style={{ background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 24, overflow: "hidden", transition: "transform 0.3s,box-shadow 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(56,189,248,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                {/* Color bar */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${mentor.gradientFrom}, ${mentor.gradientTo})` }} />

                <div style={{ padding: "32px 28px" }}>
                  {/* Avatar */}
                  <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.2))", border: "2px solid rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 20 }}>
                    {mentor.imageUrl ? (
                      <img
                        src={mentor.imageUrl}
                        alt={mentor.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span>{mentor.emoji}</span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 6 }}>
                    {mentor.name}
                  </h3>
                  <div style={{ fontSize: 14, color: "#38bdf8", fontWeight: 600, fontFamily: "'Syne',sans-serif", marginBottom: 4 }}>
                    {mentor.college}
                  </div>
                  {mentor.institution && (
                    <div style={{ fontSize: 13, color: dark ? "#64748b" : "#94a3b8", marginBottom: 20, fontFamily: "'Lora',serif" }}>
                      {mentor.institution}
                    </div>
                  )}

                  {/* Interest tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {mentor.interests.map(interest => (
                      <span key={interest} style={{ background: dark ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8", fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600, fontFamily: "'Syne',sans-serif" }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
