// ─────────────────────────────────────────────────────────────
//  src/components/Scholarships.jsx
//  To add/edit scholarships → update src/data/content.js (SCHOLARSHIPS)
// ─────────────────────────────────────────────────────────────

import { FadeIn } from "../hooks/useInView.jsx";
import { useTranslation } from "../data/translations.js";
import { SCHOLARSHIPS } from "../data/content.js";

export default function Scholarships({ dark, lang }) {
  const t = useTranslation(lang);
  const handleScholarshipClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="scholarships" style={{ padding: "100px 2rem", background: dark ? "#040b1c" : "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>
              FINANCIAL SUPPORT
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f1f5f9" : "#0f172a" }}>
              {t.scholarships.title}{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.scholarships.highlight}</span>
            </h2>
            <p style={{ color: dark ? "#64748b" : "#64748b", marginTop: 12, fontFamily: "'Lora',serif" }}>
              {t.scholarships.subtitle}
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {SCHOLARSHIPS.map((s, i) => (
            <FadeIn key={s.name} delay={i * 0.1}>
              <div
                onClick={() => handleScholarshipClick(s.url)}
                style={{ 
                  background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", 
                  border: `1.5px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, 
                  borderLeft: "4px solid #38bdf8", 
                  borderRadius: 16, 
                  padding: "24px 22px", 
                  transition: "all 0.3s",
                  cursor: s.url ? "pointer" : "default"
                }}
                onMouseEnter={e => { 
                  if (s.url) {
                    e.currentTarget.style.transform = "translateY(-4px)"; 
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(56,189,248,0.15)";
                  }
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.transform = ""; 
                  e.currentTarget.style.boxShadow = ""; 
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
                    {s.name}
                  </h3>
                  <span style={{ background: "linear-gradient(135deg,#38bdf8,#6366f1)", color: "#fff", fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 700, whiteSpace: "nowrap", fontFamily: "'Syne',sans-serif", flexShrink: 0, marginLeft: 8 }}>
                    {s.badge}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: dark ? "#64748b" : "#64748b", lineHeight: 1.6, fontFamily: "'Lora',serif", margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
