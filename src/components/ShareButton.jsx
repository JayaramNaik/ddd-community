// ─────────────────────────────────────────────────────────────
//  src/components/ShareButton.jsx
//  Reusable share button for any section
//  Usage: <ShareButton section="engineering" label="Engineering Roadmap" dark={dark} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react";

export default function ShareButton({ section, label, dark, style = {} }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}#${section}`;
  const shareText = `Check out the ${label} section on DDD Community — free mentorship for students! 🎓`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("input");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");
    setShowMenu(false);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `DDD Community — ${label}`, text: shareText, url: shareUrl });
      } catch {}
    } else {
      copyLink();
    }
    setShowMenu(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        title={`Share ${label}`}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          borderRadius: 20, padding: "6px 14px",
          cursor: "pointer", color: dark ? "#64748b" : "#94a3b8",
          fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12,
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.color = "#38bdf8"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"; e.currentTarget.style.color = dark ? "#64748b" : "#94a3b8"; }}
      >
        {copied ? "✓ Copied!" : "🔗 Share"}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 299 }} />

          {/* Menu */}
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: dark ? "#0f172a" : "#fff",
            border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 14, padding: "8px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
            zIndex: 300, minWidth: 200,
          }}>
            {/* URL preview */}
            <div style={{
              padding: "8px 12px",
              background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
              borderRadius: 8, marginBottom: 8,
              fontFamily: "'Lora',serif", fontSize: 11,
              color: dark ? "#475569" : "#94a3b8",
              wordBreak: "break-all",
            }}>
              {shareUrl}
            </div>

            {[
              { icon: "📋", label: "Copy Link", action: copyLink },
              { icon: "💬", label: "Share on WhatsApp", action: shareWhatsApp },
              { icon: "📤", label: "Share...", action: shareNative },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  background: "transparent",
                  border: "none", borderRadius: 8, padding: "10px 12px",
                  cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                  fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13,
                  color: dark ? "#e2e8f0" : "#1e293b",
                }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
