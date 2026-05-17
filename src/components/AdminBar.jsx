// ─────────────────────────────────────────────────────────────
//  src/components/AdminBar.jsx  —  Saffron & Earth Theme
// ─────────────────────────────────────────────────────────────

export default function AdminBar({ onGoToDashboard }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999,
      background: "linear-gradient(90deg,#1a0e00,#2d1a00)",
      borderBottom: "1px solid rgba(217,119,6,0.3)",
      padding: "7px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14 }}>🔐</span>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#d97706", letterSpacing: "0.06em" }}>
          ADMIN MODE
        </span>
        <span style={{ width: 1, height: 14, background: "rgba(217,119,6,0.25)", display: "inline-block" }} />
        <span style={{ fontFamily: "'Lora',serif", fontSize: 12, color: "rgba(245,230,200,0.45)" }}>
          You are viewing the site as admin
        </span>
      </div>
      <button
        onClick={onGoToDashboard}
        style={{
          padding: "5px 16px", borderRadius: 20,
          border: "1px solid rgba(217,119,6,0.4)",
          background: "rgba(217,119,6,0.12)",
          color: "#d97706", fontFamily: "'Syne',sans-serif",
          fontWeight: 700, fontSize: 11, cursor: "pointer",
          letterSpacing: "0.06em", transition: "all 0.2s", whiteSpace: "nowrap",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(217,119,6,0.25)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(217,119,6,0.12)"}
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
