// ─────────────────────────────────────────────────────────────
//  src/components/AdminBar.jsx
//  Thin bar shown ONLY to admin at the very top of every page
// ─────────────────────────────────────────────────────────────

export default function AdminBar({ onGoToDashboard }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 99999,
      background: "linear-gradient(90deg,#0f172a,#1e1b4b)",
      borderBottom: "1px solid rgba(129,140,248,0.3)",
      padding: "7px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14 }}>🔐</span>
        <span style={{
          fontFamily: "'Syne',sans-serif",
          fontWeight: 700,
          fontSize: 12,
          color: "#818cf8",
          letterSpacing: "0.06em",
        }}>
          ADMIN MODE
        </span>
        <span style={{
          width: 1, height: 14,
          background: "rgba(255,255,255,0.15)",
          display: "inline-block",
        }} />
        <span style={{
          fontFamily: "'Lora',serif",
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
        }}>
          You are viewing the site as admin
        </span>
      </div>

      {/* Right */}
      <button
        onClick={onGoToDashboard}
        style={{
          padding: "5px 16px",
          borderRadius: 20,
          border: "1px solid rgba(129,140,248,0.4)",
          background: "rgba(129,140,248,0.12)",
          color: "#818cf8",
          fontFamily: "'Syne',sans-serif",
          fontWeight: 700,
          fontSize: 11,
          cursor: "pointer",
          letterSpacing: "0.06em",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(129,140,248,0.25)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(129,140,248,0.12)"; }}
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
