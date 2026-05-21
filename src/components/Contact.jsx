// ─────────────────────────────────────────────────────────────
//  src/components/Contact.jsx
//  Sends form data via EmailJS REST API.
//  Email keys → src/config/emailjs.js
//  Send logic → src/utils/sendEmail.js
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import ShareButton from "../components/ShareButton.jsx";
import { useTranslation } from "../data/translations.js";
import { FadeIn } from "../hooks/useInView.jsx";
import { sendJoinEmail } from "../utils/sendEmail.js";
import { WHATSAPP_LINK } from "../data/content.js";

const GRADE_OPTIONS = ["10th Student", "10th Passout", "PUC Student", "PUC Passout", "Degree Student", "Other"];

export default function Contact({ dark, lang }) {
  const t = useTranslation(lang);
  const [form, setForm]     = useState({ name: "", email: "", grade: "", msg: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handle = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const isReady = form.name.trim() && form.email.trim();

  const handleSubmit = async () => {
    if (!isReady) return;
    setStatus("sending");
    try {
      await sendJoinEmail(form);
      setStatus("success");
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("error");
    }
  };

  const inputStyle = {
    background:   dark ? "rgba(255,255,255,0.06)" : "#f8fafc",
    border:       `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
    borderRadius: 10,
    padding:      "12px 16px",
    width:        "100%",
    color:        dark ? "#e2e8f0" : "#0f172a",
    fontSize:     14,
    fontFamily:   "'Lora',serif",
    outline:      "none",
    boxSizing:    "border-box",
  };

  return (
    <section id="contact" style={{ padding: "80px 2rem", background: dark ? "#060d1f" : "#f8fafc" , position: "relative"}}>
        <ShareButton section="contact" label="Join the Movement" dark={dark} />
      <div style={{ maxWidth: 580, margin: "0 auto" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f1f5f9" : "#0f172a" }}>
              {t.contact.title}{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.contact.highlight}</span>
            </h2>
            <p style={{ color: dark ? "#64748b" : "#64748b", marginTop: 10, fontFamily: "'Lora',serif" }}>
              {t.contact.subtitle}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          {status === "success" ? (
            // ── Success state ──
            <div style={{ textAlign: "center", padding: "48px 24px", background: dark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 20 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: dark ? "#f1f5f9" : "#0f172a", fontSize: 22, marginBottom: 10 }}>Request Received!</h3>
              <p style={{ color: dark ? "#94a3b8" : "#475569", fontFamily: "'Lora',serif", marginBottom: 24 }}>
                {t.contact.successMsg}
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg,#25d366,#128c7e)",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: 12,
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                Join WhatsApp Community →
              </a>
            </div>
          ) : (
            // ── Form ──
            <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 20, padding: 32 }}>

              {/* Name & Email */}
              {[["Full Name *", "name", "text"], ["Email Address *", "email", "email"]].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: dark ? "#94a3b8" : "#64748b", marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => handle(key, e.target.value)}
                    placeholder={label.replace(" *", "")}
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Grade */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: dark ? "#94a3b8" : "#64748b", marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>
                  Your Current Grade / Status
                </label>
                <select value={form.grade} onChange={e => handle("grade", e.target.value)} style={inputStyle}>
                  <option value="">Select...</option>
                  {GRADE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: dark ? "#94a3b8" : "#64748b", marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>
                  What guidance do you need?
                </label>
                <textarea
                  value={form.msg}
                  onChange={e => handle("msg", e.target.value)}
                  placeholder="Tell us about your goals and questions..."
                  style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                />
              </div>

              {/* Error message */}
              {status === "error" && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#f87171", fontFamily: "'Lora',serif" }}>
                  ⚠️ Couldn't send the email. Please try again or contact us directly.
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={status === "sending" || !isReady}
                style={{
                  width:        "100%",
                  background:   isReady ? "linear-gradient(135deg,#38bdf8,#6366f1)" : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  color:        isReady ? "#fff" : dark ? "#475569" : "#94a3b8",
                  border:       "none",
                  borderRadius: 12,
                  padding:      "14px",
                  fontSize:     16,
                  fontWeight:   700,
                  cursor:       isReady ? "pointer" : "default",
                  fontFamily:   "'Syne',sans-serif",
                  transition:   "all 0.2s",
                }}
                onMouseEnter={e => { if (isReady) e.target.style.opacity = "0.88"; }}
                onMouseLeave={e => { e.target.style.opacity = "1"; }}
              >
                {status === "sending" ? "Sending... ⏳" : t.contact.submitBtn}
              </button>

              <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: dark ? "#334155" : "#94a3b8", fontFamily: "'Lora',serif" }}>
                Your details will be shared only with the DDD mentorship team.
              </p>
            </div>
          )}
        </FadeIn>

      </div>
    </section>
  );
}
