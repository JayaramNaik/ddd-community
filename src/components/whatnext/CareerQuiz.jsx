// ─────────────────────────────────────────────────────────────
//  src/components/whatnext/CareerQuiz.jsx
//  Interest-based career recommendation quiz
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { QUIZ_QUESTIONS, AFTER_10TH, AFTER_12TH } from "../../data/whatNextData.js";

export default function CareerQuiz({ dark, qualification }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const allCareers = qualification === "10th"
    ? AFTER_10TH
    : [...(AFTER_12TH.science || []), ...(AFTER_12TH.commerce || []), ...(AFTER_12TH.arts || [])];

  const handleAnswer = (tags) => {
    const newAnswers = [...answers, ...tags];
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      // Tally scores
      const scores = {};
      newAnswers.forEach(tag => {
        scores[tag] = (scores[tag] || 0) + 1;
      });
      const topTag = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
      const matched = allCareers.find(c => c.id === topTag) || allCareers[0];
      setResult(matched);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const q = QUIZ_QUESTIONS[step];

  return (
    <div style={{
      background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
      border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
      borderRadius: 24,
      padding: "36px",
      marginTop: 48,
    }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>
          🧠 Smart Guidance
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
          What Suits You?
        </h3>
        <p style={{ color: dark ? "#64748b" : "#94a3b8", fontFamily: "'Lora',serif", marginTop: 8, fontSize: 14 }}>
          Answer 4 quick questions and we'll suggest your best-fit career path.
        </p>
      </div>

      {!result ? (
        <>
          {/* Progress */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
            {QUIZ_QUESTIONS.map((_, i) => (
              <div key={i} style={{
                height: 4,
                width: 48,
                borderRadius: 4,
                background: i <= step ? "#818cf8" : (dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"),
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          <p style={{
            textAlign: "center",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: dark ? "#e2e8f0" : "#1e293b",
            marginBottom: 24,
          }}>
            {q.question}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.tags)}
                style={{
                  background: dark ? "rgba(255,255,255,0.05)" : "#fff",
                  border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  borderRadius: 14,
                  padding: "16px 20px",
                  cursor: "pointer",
                  fontFamily: "'Lora',serif",
                  fontSize: 14,
                  color: dark ? "#cbd5e1" : "#334155",
                  textAlign: "left",
                  transition: "all 0.25s",
                  lineHeight: 1.5,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#818cf8";
                  e.currentTarget.style.background = dark ? "rgba(129,140,248,0.12)" : "rgba(129,140,248,0.08)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
                  e.currentTarget.style.background = dark ? "rgba(255,255,255,0.05)" : "#fff";
                  e.currentTarget.style.transform = "";
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: "center", color: dark ? "#475569" : "#94a3b8", fontSize: 12, fontFamily: "'Syne',sans-serif", marginTop: 20 }}>
            Question {step + 1} of {QUIZ_QUESTIONS.length}
          </p>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{result.icon}</div>
          <p style={{ color: "#818cf8", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Your best-fit career path
          </p>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 12px" }}>
            {result.title}
          </h3>
          <p style={{ color: dark ? "#94a3b8" : "#64748b", fontFamily: "'Lora',serif", lineHeight: 1.8, maxWidth: 480, margin: "0 auto 24px" }}>
            {result.desc}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
            {result.careerScope.slice(0, 4).map(c => (
              <span key={c} style={{
                background: result.color + "18",
                color: result.color,
                border: `1px solid ${result.color}33`,
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontFamily: "'Syne',sans-serif",
                fontWeight: 600,
              }}>
                {c}
              </span>
            ))}
          </div>
          <button
            onClick={reset}
            style={{
              background: "linear-gradient(135deg, #818cf8, #38bdf8)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 28px",
              cursor: "pointer",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
