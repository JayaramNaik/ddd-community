// ─────────────────────────────────────────────────────────────
//  src/components/FAQ.jsx
//  To add/edit FAQs → update src/data/content.js (FAQS)
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useTranslation } from "../data/translations.js";
import { FadeIn } from "../hooks/useInView.jsx";
import { FAQS } from "../data/content.js";

export default function FAQ({ dark, lang }) {
  const t = useTranslation(lang);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" style={{ padding: "80px 2rem", background: dark ? "#040b1c" : "#fff" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            {/* Badge */}
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg,#38bdf822,#818cf822)",
              border: "1px solid #38bdf833",
              borderRadius: 40,
              padding: "6px 20px",
              fontSize: 11,
              fontWeight: 700,
              color: "#38bdf8",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 16,
            }}>
              {t.faq.badge}
            </div>

            <h2 style={{
              fontSize: "clamp(1.8rem,3.5vw,2.5rem)",
              fontFamily: "'Playfair Display',serif",
              fontWeight: 900,
              color: dark ? "#f1f5f9" : "#0f172a",
            }}>
              {t.faq.title}{" "}
              <span style={{
                background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {t.faq.highlight}
              </span>
            </h2>
          </div>
        </FadeIn>

        {FAQS.map((faq, i) => (
          <FadeIn key={faq.q} delay={i * 0.08}>
            <div style={{
              marginBottom: 12,
              background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
              border: `1px solid ${openIndex === i ? "rgba(56,189,248,0.4)" : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 14,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}>
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "18px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  color: dark ? "#e2e8f0" : "#0f172a",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  textAlign: "left",
                }}
              >
                {faq.q}
                <span style={{
                  color: "#38bdf8",
                  fontSize: 20,
                  transition: "transform 0.3s",
                  transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-block",
                  flexShrink: 0,
                  marginLeft: 12,
                }}>
                  +
                </span>
              </button>
              {openIndex === i && (
                <div style={{
                  padding: "0 22px 18px",
                  fontSize: 14,
                  color: dark ? "#94a3b8" : "#475569",
                  lineHeight: 1.7,
                  fontFamily: "'Lora',serif",
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          </FadeIn>
        ))}

      </div>
    </section>
  );
}
