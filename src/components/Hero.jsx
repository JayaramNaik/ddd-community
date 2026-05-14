// ─────────────────────────────────────────────────────────────
//  src/components/Hero.jsx
//  Join button → modal form → sendEmail + WhatsApp redirect
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { FadeIn } from "../hooks/useInView.jsx";
import { WHATSAPP_LINK } from "../data/content.js";
import { useTranslation } from "../data/translations.js";
import { sendJoinEmail } from "../utils/sendEmail.js";

const PARTICLE_COUNT = 30;
const GRADE_OPTIONS  = [
  "10th Student",
  "10th Passout",
  "PUC / 11th–12th Student",
  "PUC Passout",
  "Degree Student",
  "Other",
];

const inputStyle = (dark) => ({
  background:   dark ? "rgba(255,255,255,0.07)" : "#f8fafc",
  border:       `1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
  borderRadius: 10,
  padding:      "11px 14px",
  width:        "100%",
  color:        dark ? "#e2e8f0" : "#0f172a",
  fontSize:     14,
  fontFamily:   "'Lora', serif",
  outline:      "none",
  boxSizing:    "border-box",
  transition:   "border-color 0.2s",
});

const lbl = (dark) => ({
  display:       "block",
  fontSize:      12,
  fontWeight:    700,
  fontFamily:    "'Syne', sans-serif",
  color:         dark ? "#94a3b8" : "#64748b",
  marginBottom:  5,
  letterSpacing: "0.04em",
});

export default function Hero({ dark, lang }) {
  const t = useTranslation(lang);

  const [particles] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x:     Math.random() * 100,
      y:     Math.random() * 100,
      size:  Math.random() * 3 + 1,
      delay: Math.random() * 5,
      dur:   4 + Math.random() * 6,
    }))
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState({ name: "", email: "", grade: "", reason: "" });
  const [status, setStatus]       = useState("idle"); // idle | sending | done | error

  const handle   = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const isReady  = form.name.trim() && form.email.trim() && form.grade;

  const closeModal = () => {
    setModalOpen(false);
    setStatus("idle");
    setForm({ name: "", email: "", grade: "", reason: "" });
  };

  const handleJoin = async () => {
    if (!isReady) return;
    setStatus("sending");
    try {
      await sendJoinEmail({ ...form, msg: form.reason });
      setStatus("done");
      setTimeout(() => {
        window.open(WHATSAPP_LINK, "_blank");
        closeModal();
      }, 1600);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", paddingTop: 80,
        background: dark
          ? "linear-gradient(135deg,#020818 0%,#0c1445 50%,#0a0a1a 100%)"
          : "linear-gradient(135deg,#e0f2fe 0%,#ede9fe 50%,#f0fdf4 100%)",
      }}>

        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,0.18) 0%,transparent 70%)", top: "10%", left: "-10%", animation: "blob 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(129,140,248,0.18) 0%,transparent 70%)", bottom: "5%", right: "-5%", animation: "blob 10s ease-in-out infinite reverse" }} />

        {particles.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: "rgba(56,189,248,0.5)", animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate` }} />
        ))}

        <div style={{ textAlign: "center", zIndex: 2, padding: "2rem" }}>

          <FadeIn>
            <div style={{ display: "inline-block", background: dark ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 20, padding: "6px 18px", fontSize: 12, color: "#38bdf8", fontWeight: 700, marginBottom: 24, fontFamily: "'Syne', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {t.hero.badge}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)", fontFamily: "'Playfair Display', serif", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: dark ? "#fff" : "#0f172a" }}>
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.hero.title1}</span>
              <br />
              <span style={{ color: dark ? "#fff" : "#0f172a" }}>{t.hero.title2}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p style={{ fontSize: "clamp(1rem,2.5vw,1.3rem)", color: dark ? "#94a3b8" : "#475569", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7, fontFamily: "'Lora', serif" }}>
              {t.hero.subtitle}
            </p>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>

              {/* JOIN → opens modal */}
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background:  "linear-gradient(135deg,#38bdf8,#6366f1)",
                  color:       "#fff",
                  padding:     "14px 32px",
                  borderRadius: 50,
                  fontSize:    15,
                  fontWeight:  700,
                  border:      "none",
                  cursor:      "pointer",
                  boxShadow:   "0 0 30px rgba(56,189,248,0.4)",
                  transition:  "transform 0.2s,box-shadow 0.2s",
                  fontFamily:  "'Syne', sans-serif",
                }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 50px rgba(56,189,248,0.6)"; }}
                onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 0 30px rgba(56,189,248,0.4)"; }}
              >
                {t.hero.joinBtn}
              </button>

              <a
                href="#guidance"
                style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: `1.5px solid ${dark ? "rgba(56,189,248,0.3)" : "rgba(56,189,248,0.5)"}`, color: dark ? "#e2e8f0" : "#0f172a", padding: "14px 32px", borderRadius: 50, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", fontFamily: "'Syne', sans-serif" }}
                onMouseEnter={e => { e.target.style.background = "rgba(56,189,248,0.12)"; }}
                onMouseLeave={e => { e.target.style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"; }}
              >
                {t.hero.exploreBtn}
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div style={{ marginTop: 56, display: "inline-block", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${dark ? "rgba(56,189,248,0.2)" : "rgba(56,189,248,0.3)"}`, borderRadius: 16, padding: "18px 32px", maxWidth: 520 }}>
              <p style={{ margin: 0, fontSize: 15, color: dark ? "#94a3b8" : "#475569", fontFamily: "'Lora', serif", fontStyle: "italic", lineHeight: 1.75 }}>
                {t.hero.note}
              </p>
            </div>
          </FadeIn>
        </div>

        <style>{`
          @keyframes blob  { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.1) translate(20px,-20px)} }
          @keyframes float { from{transform:translateY(0)} to{transform:translateY(-15px)} }
          @keyframes progress { from{width:0%} to{width:100%} }
        `}</style>
      </section>

      {/* ─── JOIN MODAL ─── */}
      {modalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         9999,
            background:     "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "1rem",
          }}
        >
          <div style={{
            background:   dark ? "#0f172a" : "#fff",
            border:       `1.5px solid ${dark ? "rgba(56,189,248,0.2)" : "rgba(56,189,248,0.25)"}`,
            borderRadius: 24,
            padding:      "clamp(24px, 5vw, 36px) clamp(20px, 5vw, 32px)",
            width:        "100%",
            maxWidth:     460,
            maxHeight:    "90vh",
            overflowY:    "auto",
            position:     "relative",
            boxShadow:    "0 32px 80px rgba(0,0,0,0.45)",
          }}>

            {/* Close button */}
            <button
              onClick={closeModal}
              style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: dark ? "#475569" : "#94a3b8", lineHeight: 1, padding: 4 }}
            >
              ✕
            </button>

            {/* ── SUCCESS ── */}
            {status === "done" ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(1.2rem,3vw,1.5rem)", color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>
                  You're in, {form.name.split(" ")[0]}!
                </h3>
                <p style={{ fontFamily: "'Lora', serif", fontSize: 14, color: dark ? "#94a3b8" : "#64748b", lineHeight: 1.7, marginBottom: 20 }}>
                  Details saved ✓ — taking you to the WhatsApp community now...
                </p>
                <div style={{ height: 5, borderRadius: 3, background: dark ? "rgba(255,255,255,0.07)" : "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(135deg,#38bdf8,#6366f1)", animation: "progress 1.5s linear forwards" }} />
                </div>
              </div>

            ) : (
              <>
                {/* Header */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                    Quick intro — 30 seconds
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(1.2rem,3vw,1.5rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 6px", lineHeight: 1.25 }}>
                    Join DDD Community 🚀
                  </h2>
                  <p style={{ fontFamily: "'Lora', serif", fontSize: 13, color: dark ? "#64748b" : "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                    Tell us about yourself so our mentors can guide you better from day one.
                  </p>
                </div>

                {/* Name */}
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl(dark)}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Arjun Kumar"
                    value={form.name}
                    onChange={e => handle("name", e.target.value)}
                    style={inputStyle(dark)}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e  => e.target.style.borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl(dark)}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. arjun@gmail.com"
                    value={form.email}
                    onChange={e => handle("email", e.target.value)}
                    style={inputStyle(dark)}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e  => e.target.style.borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
                  />
                </div>

                {/* Grade */}
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl(dark)}>Current Study Level *</label>
                  <select
                    value={form.grade}
                    onChange={e => handle("grade", e.target.value)}
                    style={inputStyle(dark)}
                  >
                    <option value="">Select your level...</option>
                    {GRADE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                {/* Reason */}
                <div style={{ marginBottom: 22 }}>
                  <label style={lbl(dark)}>
                    Why do you want to join?{" "}
                    <span style={{ fontWeight: 400, color: dark ? "#334155" : "#cbd5e1" }}>(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. I need guidance on which stream to choose after 10th..."
                    value={form.reason}
                    onChange={e => handle("reason", e.target.value)}
                    style={{ ...inputStyle(dark), resize: "vertical", minHeight: 80 }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e  => e.target.style.borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#f87171", fontFamily: "'Lora', serif" }}>
                    ⚠️ Couldn't send the email right now — you'll still join WhatsApp and we'll follow up manually.
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleJoin}
                  disabled={!isReady || status === "sending"}
                  style={{
                    width:        "100%",
                    background:   isReady
                      ? "linear-gradient(135deg,#38bdf8,#6366f1)"
                      : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"),
                    color:        isReady ? "#fff" : (dark ? "#334155" : "#cbd5e1"),
                    border:       "none",
                    borderRadius: 14,
                    padding:      "14px",
                    fontSize:     15,
                    fontWeight:   700,
                    fontFamily:   "'Syne', sans-serif",
                    cursor:       isReady ? "pointer" : "default",
                    transition:   "opacity 0.2s",
                    boxShadow:    isReady ? "0 0 24px rgba(56,189,248,0.3)" : "none",
                  }}
                  onMouseEnter={e => { if (isReady) e.target.style.opacity = "0.88"; }}
                  onMouseLeave={e => { e.target.style.opacity = "1"; }}
                >
                  {status === "sending" ? "Saving your details... ⏳" : "Join the Community → WhatsApp 🚀"}
                </button>

                <p style={{ textAlign: "center", marginTop: 11, fontSize: 11, color: dark ? "#1e293b" : "#e2e8f0", fontFamily: "'Lora', serif" }}>
                  Your info is only shared with the DDD mentorship team.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
