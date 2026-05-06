// ─────────────────────────────────────────────────────────────
//  src/components/Guidelines.jsx
// ─────────────────────────────────────────────────────────────

import { FadeIn } from "../hooks/useInView.jsx";

const DOS   = [
  "Respectful and kind interaction at all times",
  "Meaningful discussions that add value",
  "Learning-oriented usage of the community",
  "Support and encourage fellow students",
];
const DONTS = [
  "No spam or irrelevant chats",
  "No self-promotion without permission",
  "No sharing of misinformation",
  "No negativity or discouragement",
];

export default function Guidelines({ dark }) {
  return (
    <section id="guidelines" style={{ padding: "80px 2rem", background: dark ? "#040b1c" : "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f1f5f9" : "#0f172a" }}>
              Community{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Guidelines</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          <FadeIn delay={0.1}>
            <div style={{ background: dark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.06)", border: "1.5px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "28px 28px" }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: "#10b981", marginBottom: 20 }}>✅ Do's</h3>
              {DOS.map(d => (
                <div key={d} style={{ display: "flex", gap: 10, marginBottom: 14, fontSize: 14, color: dark ? "#94a3b8" : "#475569", fontFamily: "'Lora',serif", lineHeight: 1.6 }}>
                  <span style={{ color: "#10b981", fontWeight: 700, flexShrink: 0 }}>✓</span> {d}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{ background: dark ? "rgba(239,68,68,0.07)" : "rgba(239,68,68,0.05)", border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: "28px 28px" }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: "#ef4444", marginBottom: 20 }}>❌ Don'ts</h3>
              {DONTS.map(d => (
                <div key={d} style={{ display: "flex", gap: 10, marginBottom: 14, fontSize: 14, color: dark ? "#94a3b8" : "#475569", fontFamily: "'Lora',serif", lineHeight: 1.6 }}>
                  <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>✗</span> {d}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
