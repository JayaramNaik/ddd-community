// ─────────────────────────────────────────────────────────────
//  src/components/whatnext/CareerCard.jsx
//  Reusable expandable career card with modal popup
// ─────────────────────────────────────────────────────────────

import { useState } from "react";

export default function CareerCard({ career, dark, delay = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        style={{
          background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
          border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
          borderTop: `3px solid ${career.color}`,
          borderRadius: 20,
          padding: "24px 20px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          backdropFilter: "blur(12px)",
          animationDelay: `${delay}s`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = `0 20px 48px ${career.color}22`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>{career.icon}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: dark ? "#f1f5f9" : "#0f172a",
            margin: 0,
            lineHeight: 1.3,
          }}>
            {career.title}
          </h3>
          <span style={{
            background: career.color + "22",
            color: career.color,
            fontSize: 10,
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 700,
            whiteSpace: "nowrap",
            fontFamily: "'Syne', sans-serif",
            flexShrink: 0,
            marginLeft: 8,
            border: `1px solid ${career.color}44`,
          }}>
            {career.duration}
          </span>
        </div>
        <p style={{
          fontSize: 12,
          color: career.color,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          margin: "0 0 8px",
        }}>
          {career.tagline}
        </p>
        <p style={{
          fontSize: 13,
          color: dark ? "#94a3b8" : "#64748b",
          lineHeight: 1.6,
          fontFamily: "'Lora', serif",
          margin: "0 0 16px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {career.desc}
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: career.color,
          fontSize: 13,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
        }}>
          Explore details
          <span style={{ fontSize: 16 }}>→</span>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? "#0f172a" : "#fff",
              border: `2px solid ${career.color}44`,
              borderTop: `4px solid ${career.color}`,
              borderRadius: 24,
              padding: "36px",
              maxWidth: 600,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: dark ? "rgba(255,255,255,0.1)" : "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                fontSize: 18,
                color: dark ? "#f1f5f9" : "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: 48, marginBottom: 12 }}>{career.icon}</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 28,
              color: dark ? "#f1f5f9" : "#0f172a",
              margin: "0 0 4px",
            }}>
              {career.title}
            </h2>
            <p style={{ color: career.color, fontFamily: "'Syne',sans-serif", fontWeight: 600, margin: "0 0 20px" }}>
              {career.tagline}
            </p>
            <p style={{ color: dark ? "#94a3b8" : "#64748b", fontFamily: "'Lora',serif", lineHeight: 1.8, margin: "0 0 24px" }}>
              {career.desc}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                { label: "⏱ Duration", value: career.duration },
                { label: "✅ Eligibility", value: career.eligibility },
                { label: "💰 Salary Range", value: career.salary },
              ].map(item => (
                <div key={item.label} style={{
                  background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                }}>
                  <div style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", fontFamily: "'Syne',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 13, color: dark ? "#e2e8f0" : "#1e293b", fontFamily: "'Lora',serif", fontWeight: 600 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Career Scope */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 10, fontSize: 14 }}>
                🎯 Career Scope
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {career.careerScope.map(c => (
                  <span key={c} style={{
                    background: career.color + "18",
                    color: career.color,
                    border: `1px solid ${career.color}33`,
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 600,
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Exams */}
            {career.exams && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 10, fontSize: 14 }}>
                  📝 Key Exams
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {career.exams.map(e => (
                    <span key={e} style={{
                      background: dark ? "rgba(255,255,255,0.07)" : "#f1f5f9",
                      color: dark ? "#cbd5e1" : "#475569",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 600,
                      border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"}`,
                    }}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Future */}
            <div style={{
              background: `linear-gradient(135deg, ${career.color}11, ${career.color}05)`,
              border: `1px solid ${career.color}22`,
              borderRadius: 14,
              padding: "16px 18px",
            }}>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: career.color, marginBottom: 6, fontSize: 13 }}>
                🚀 Future Outlook
              </h4>
              <p style={{ fontSize: 13, color: dark ? "#94a3b8" : "#64748b", fontFamily: "'Lora',serif", margin: 0, lineHeight: 1.7 }}>
                {career.future}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
