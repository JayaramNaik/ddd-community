// ─────────────────────────────────────────────────────────────
//  src/components/LanguageSelect.jsx
//  Shown once after login — user picks preferred language
// ─────────────────────────────────────────────────────────────

import { useState } from "react";

const LANGUAGES = [
  {
    code: "en",
    name: "English",
    native: "English",
    greeting: "Welcome to DDD Community!",
    sub: "Your mentorship journey starts here.",
    flag: "🇬🇧",
  },
  {
    code: "kn",
    name: "Kannada",
    native: "ಕನ್ನಡ",
    greeting: "DDD ಸಮುದಾಯಕ್ಕೆ ಸ್ವಾಗತ!",
    sub: "ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶನ ಪ್ರಯಾಣ ಇಲ್ಲಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.",
    flag: "🏴",
  },
  {
    code: "hi",
    name: "Hindi",
    native: "हिन्दी",
    greeting: "DDD समुदाय में आपका स्वागत है!",
    sub: "आपकी मार्गदर्शन यात्रा यहाँ से शुरू होती है।",
    flag: "🇮🇳",
  },
];

export default function LanguageSelect({ dark, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => {
      onSelect(selected.code);
    }, 800);
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: dark
        ? "linear-gradient(135deg,#020818 0%,#0c1445 50%,#0a0a1a 100%)"
        : "linear-gradient(135deg,#e0f2fe 0%,#ede9fe 50%,#f0fdf4 100%)",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background blobs */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,0.12) 0%,transparent 70%)", top: "-10%", left: "-10%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(129,140,248,0.12) 0%,transparent 70%)", bottom: "0%", right: "-5%", pointerEvents: "none" }} />

      <div style={{
        width: "100%",
        maxWidth: 560,
        zIndex: 2,
        opacity: confirming ? 0 : 1,
        transform: confirming ? "scale(0.97)" : "scale(1)",
        transition: "all 0.5s ease",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌐</div>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#38bdf8",
            marginBottom: 12,
            fontFamily: "'Syne',sans-serif",
          }}>
            Dream • Decide • Dominate
          </div>
          <h1 style={{
            fontSize: "clamp(1.6rem,4vw,2.4rem)",
            fontFamily: "'Playfair Display',serif",
            fontWeight: 900,
            color: dark ? "#f1f5f9" : "#0f172a",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}>
            Choose Your Language
          </h1>
          <p style={{
            fontFamily: "'Lora',serif",
            color: dark ? "#94a3b8" : "#64748b",
            fontSize: 14,
            margin: 0,
            lineHeight: 1.7,
          }}>
            ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ &nbsp;·&nbsp; अपनी भाषा चुनें
          </p>
        </div>

        {/* Language Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              onClick={() => setSelected(lang)}
              style={{
                background: selected?.code === lang.code
                  ? dark ? "rgba(56,189,248,0.12)" : "rgba(56,189,248,0.08)"
                  : dark ? "rgba(255,255,255,0.04)" : "#fff",
                border: `2px solid ${selected?.code === lang.code ? "#38bdf8" : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)")}`,
                borderRadius: 18,
                padding: "20px 24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 18,
                transition: "all 0.25s",
                boxShadow: selected?.code === lang.code ? "0 0 24px rgba(56,189,248,0.15)" : "none",
              }}
              onMouseEnter={e => {
                if (selected?.code !== lang.code) {
                  e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={e => {
                if (selected?.code !== lang.code) {
                  e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
                  e.currentTarget.style.transform = "";
                }
              }}
            >
              {/* Flag / Icon */}
              <div style={{
                fontSize: 36,
                flexShrink: 0,
                width: 56,
                height: 56,
                borderRadius: 14,
                background: selected?.code === lang.code ? "rgba(56,189,248,0.15)" : (dark ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {lang.flag}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                  <span style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: selected?.code === lang.code ? "#38bdf8" : (dark ? "#f1f5f9" : "#0f172a"),
                  }}>
                    {lang.native}
                  </span>
                  {lang.native !== lang.name && (
                    <span style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: dark ? "#475569" : "#94a3b8",
                    }}>
                      {lang.name}
                    </span>
                  )}
                </div>
                <p style={{
                  fontFamily: "'Lora',serif",
                  fontSize: 13,
                  color: dark ? "#64748b" : "#94a3b8",
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {lang.greeting}
                </p>
              </div>

              {/* Check */}
              {selected?.code === lang.code && (
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#38bdf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: 700,
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "15px 20px",
            borderRadius: 14,
            border: "none",
            background: selected
              ? "linear-gradient(135deg,#38bdf8,#818cf8)"
              : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"),
            color: selected ? "#fff" : (dark ? "#475569" : "#94a3b8"),
            fontSize: 15,
            fontWeight: 700,
            cursor: selected ? "pointer" : "not-allowed",
            fontFamily: "'Syne',sans-serif",
            letterSpacing: "0.02em",
            transition: "all 0.25s",
            boxShadow: selected ? "0 8px 24px rgba(56,189,248,0.25)" : "none",
          }}
          onMouseEnter={e => { if (selected) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          {confirming ? "✨ Loading..." : selected ? `Continue in ${selected.native} →` : "Select a language to continue"}
        </button>

        <p style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 12,
          color: dark ? "#334155" : "#94a3b8",
          fontFamily: "'Lora',serif",
        }}>
          You can change this later from settings.
        </p>

      </div>
    </main>
  );
}
