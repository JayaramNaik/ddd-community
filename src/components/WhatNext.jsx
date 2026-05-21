// ─────────────────────────────────────────────────────────────
//  src/components/WhatNext.jsx
//  Main "What Next?" feature page
//  Drop into your components folder and import in App.jsx
import ShareButton from "../components/ShareButton.jsx";
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { FadeIn } from "../hooks/useInView.jsx";
import CareerCard from "./whatnext/CareerCard.jsx";
import CareerQuiz from "./whatnext/CareerQuiz.jsx";
import { AFTER_10TH, AFTER_12TH, MOTIVATIONAL_QUOTES } from "../data/whatNextData.js";

const STREAMS = [
  { key: "science",  label: "Science",          icon: "🔬", color: "#38bdf8", desc: "PCM / PCB path" },
  { key: "commerce", label: "Commerce",          icon: "📊", color: "#34d399", desc: "Finance & Business" },
  { key: "arts",     label: "Arts / Humanities", icon: "🎭", color: "#f472b6", desc: "Creative & Social" },
];

export default function WhatNext({ dark }) {
  const [qualification, setQualification] = useState(null); // "10th" | "12th"
  const [stream, setStream] = useState(null);               // "science" | "commerce" | "arts"
  const [search, setSearch] = useState("");
  const [quoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));

  const quote = MOTIVATIONAL_QUOTES[quoteIdx];

  // Determine which careers to show
  const careers = (() => {
    if (qualification === "10th") return AFTER_10TH;
    if (qualification === "12th" && stream) return AFTER_12TH[stream] || [];
    return [];
  })();

  const filtered = search.trim()
    ? careers.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase()) ||
        c.careerScope.some(s => s.toLowerCase().includes(search.toLowerCase()))
      )
    : careers;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section
      id="whatnext"
      style={{
        minHeight: "100vh",
        background: dark ? "#040b1c" : "#f8fafc",
        padding: "80px 2rem 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Landing Hero ── */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #38bdf822, #818cf822)",
              border: "1px solid #38bdf833",
              borderRadius: 40,
              padding: "6px 20px",
              fontSize: 12,
              fontWeight: 700,
              color: "#38bdf8",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 20,
            }}>
              Career Explorer
            </div>

            <h1 style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: dark ? "#f1f5f9" : "#0f172a",
              margin: "0 0 20px",
              lineHeight: 1.15,
            }}>
              What Next?{" "}
              <span style={{
                background: "linear-gradient(135deg, #38bdf8, #818cf8, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                🚀
              </span>
            </h1>

            <p style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: dark ? "#64748b" : "#64748b",
              fontFamily: "'Lora', serif",
              maxWidth: 580,
              margin: "0 auto 16px",
              lineHeight: 1.8,
            }}>
              Confused about what to do after 10th or 12th? Explore the best paths based on your interests, goals, and strengths.
            </p>

            {/* Floating emoji illustration */}
            <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: 12, marginTop: 24, opacity: 0.8 }}>
              📚 🎯 💡 🏆 🌟
            </div>
          </div>
        </FadeIn>

        {/* ── Motivational Quote ── */}
        <FadeIn delay={0.1}>
          <div style={{
            background: dark
              ? "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.08))"
              : "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.06))",
            border: `1px solid ${dark ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.2)"}`,
            borderLeft: "4px solid #38bdf8",
            borderRadius: 16,
            padding: "20px 28px",
            marginBottom: 56,
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
          }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>💬</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 16, color: dark ? "#e2e8f0" : "#1e293b", margin: "0 0 6px", lineHeight: 1.7 }}>
                "{quote.quote}"
              </p>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#38bdf8", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                — {quote.author}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── Step 1: Qualification Selection ── */}
        <FadeIn delay={0.15}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>
                Step 1
              </p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
                Where are you right now?
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {[
                { key: "10th", icon: "🏫", label: "After 10th", sub: "Completed class 10th / SSLC", color: "#38bdf8" },
                { key: "12th", icon: "🎓", label: "After 12th", sub: "Completed PUC / 12th / Intermediate", color: "#818cf8" },
              ].map(opt => (
                <div
                  key={opt.key}
                  onClick={() => { setQualification(opt.key); setStream(null); }}
                  style={{
                    background: qualification === opt.key
                      ? `linear-gradient(135deg, ${opt.color}22, ${opt.color}10)`
                      : (dark ? "rgba(255,255,255,0.04)" : "#fff"),
                    border: `2px solid ${qualification === opt.key ? opt.color : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)")}`,
                    borderRadius: 24,
                    padding: "36px 28px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={e => {
                    if (qualification !== opt.key) {
                      e.currentTarget.style.borderColor = opt.color;
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (qualification !== opt.key) {
                      e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
                      e.currentTarget.style.transform = "";
                    }
                  }}
                >
                  <div style={{ fontSize: 52, marginBottom: 16 }}>{opt.icon}</div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>
                    {opt.label}
                  </h3>
                  <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 14, margin: 0 }}>
                    {opt.sub}
                  </p>
                  {qualification === opt.key && (
                    <div style={{ marginTop: 16, color: opt.color, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Step 2: Stream (only for 12th) ── */}
        {qualification === "12th" && (
          <FadeIn>
            <div style={{ marginBottom: 56 }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#f472b6", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>
                  Step 2
                </p>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
                  Which stream did you choose?
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {STREAMS.map(s => (
                  <div
                    key={s.key}
                    onClick={() => setStream(s.key)}
                    style={{
                      background: stream === s.key
                        ? `linear-gradient(135deg, ${s.color}22, ${s.color}10)`
                        : (dark ? "rgba(255,255,255,0.04)" : "#fff"),
                      border: `2px solid ${stream === s.key ? s.color : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)")}`,
                      borderRadius: 20,
                      padding: "28px 20px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={e => {
                      if (stream !== s.key) e.currentTarget.style.borderColor = s.color;
                    }}
                    onMouseLeave={e => {
                      if (stream !== s.key) e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>
                      {s.label}
                    </h3>
                    <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 13, margin: 0 }}>
                      {s.desc}
                    </p>
                    {stream === s.key && (
                      <div style={{ marginTop: 10, color: s.color, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12 }}>
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Career Cards ── */}
        {careers.length > 0 && (
          <FadeIn>
            <div style={{ marginBottom: 56 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#34d399", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>
                    {qualification === "12th" ? `Step 3 · ${stream?.charAt(0).toUpperCase() + stream?.slice(1)} Paths` : "Step 2 · Your Options"}
                  </p>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
                    Explore Your Paths
                  </h2>
                </div>

                {/* Search */}
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search careers..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                      border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      borderRadius: 12,
                      padding: "10px 16px 10px 42px",
                      color: dark ? "#f1f5f9" : "#0f172a",
                      fontFamily: "'Lora',serif",
                      fontSize: 14,
                      outline: "none",
                      width: 220,
                    }}
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <p style={{ textAlign: "center", color: dark ? "#64748b" : "#94a3b8", fontFamily: "'Lora',serif", fontSize: 15, padding: "40px 0" }}>
                  No results for "{search}" — try a different keyword.
                </p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {filtered.map((career, i) => (
                    <CareerCard key={career.id} career={career} dark={dark} delay={i * 0.07} />
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* ── Quiz ── */}
        {qualification && (qualification === "10th" || stream) && (
          <FadeIn>
            <CareerQuiz dark={dark} qualification={qualification} />
          </FadeIn>
        )}

        {/* ── Ask Senior + CTA ── */}
        {qualification && (
          <FadeIn>
            <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {/* Ask Senior */}
              <div style={{
                background: dark ? "rgba(56,189,248,0.06)" : "rgba(56,189,248,0.05)",
                border: "1.5px solid rgba(56,189,248,0.2)",
                borderRadius: 20,
                padding: "28px 24px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>
                  Ask a Senior
                </h3>
                <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 18px" }}>
                  Still confused? Connect directly with our mentors who've walked this path.
                </p>
                <a
                  href="#community"
                  style={{
                    display: "inline-block",
                    background: "#38bdf8",
                    color: "#fff",
                    padding: "10px 24px",
                    borderRadius: 12,
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  Go to Community →
                </a>
              </div>

              {/* Scholarships */}
              <div style={{
                background: dark ? "rgba(129,140,248,0.06)" : "rgba(129,140,248,0.05)",
                border: "1.5px solid rgba(129,140,248,0.2)",
                borderRadius: 20,
                padding: "28px 24px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>
                  Find Scholarships
                </h3>
                <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 18px" }}>
                  Don't let finances stop your dreams. Check out available scholarships.
                </p>
                <a
                  href="#scholarships"
                  style={{
                    display: "inline-block",
                    background: "#818cf8",
                    color: "#fff",
                    padding: "10px 24px",
                    borderRadius: 12,
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  View Scholarships →
                </a>
              </div>

              {/* Join WhatsApp */}
              <div style={{
                background: dark ? "rgba(52,211,153,0.06)" : "rgba(52,211,153,0.05)",
                border: "1.5px solid rgba(52,211,153,0.2)",
                borderRadius: 20,
                padding: "28px 24px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>
                  Join the Community
                </h3>
                <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 18px" }}>
                  Join thousands of students discussing careers, exams, and opportunities.
                </p>
                <a
                  href="#community"
                  style={{
                    display: "inline-block",
                    background: "#34d399",
                    color: "#fff",
                    padding: "10px 24px",
                    borderRadius: 12,
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  Join Now →
                </a>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Final CTA ── */}
        <FadeIn>
          <div style={{
            textAlign: "center",
            marginTop: 80,
            padding: "48px 32px",
            background: dark
              ? "linear-gradient(135deg, rgba(56,189,248,0.06), rgba(129,140,248,0.06))"
              : "linear-gradient(135deg, rgba(56,189,248,0.05), rgba(129,140,248,0.05))",
            borderRadius: 28,
            border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
          }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>✨</p>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 900,
              fontSize: "clamp(1.4rem,3vw,2.2rem)",
              color: dark ? "#f1f5f9" : "#0f172a",
              margin: "0 0 16px",
              lineHeight: 1.4,
            }}>
              Your future is not limited to one path.
            </h2>
            <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              Explore, learn, and choose wisely. Every great career started with a single curious step.
            </p>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
