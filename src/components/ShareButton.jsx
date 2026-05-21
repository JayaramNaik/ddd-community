// ─────────────────────────────────────────────────────────────
//  src/components/ShareButton.jsx
//  Floating share button — top-right corner of each section
//  Uses native Web Share API (shows system share sheet on mobile)
//  Falls back to copy link + WhatsApp menu on desktop
// ─────────────────────────────────────────────────────────────

import { useState } from "react";

export default function ShareButton({ section, label, dark }) {
  const [copied, setCopied]     = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const baseUrl  = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}#${section}`;
  const shareText = `Check out the ${label} section on DDD Community — free mentorship for students! 🎓`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const el = document.createElement("input");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  const handleShare = async () => {
    // Use native share sheet if available (mobile / modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DDD Community — ${label}`,
          text:  shareText,
          url:   shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled — don't show menu
        if (err.name === "AbortError") return;
      }
    }
    // Fallback: show custom menu on desktop
    setShowMenu(prev => !prev);
  };

  const SHARE_OPTIONS = [
    {
      icon: "📋",
      label: copied ? "Copied!" : "Copy Link",
      action: copyLink,
    },
    {
      icon: "💬",
      label: "WhatsApp",
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");
        setShowMenu(false);
      },
    },
    {
      icon: "✉️",
      label: "Gmail",
      action: () => {
        window.open(`https://mail.google.com/mail/?view=cm&su=${encodeURIComponent("DDD Community — " + label)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`, "_blank");
        setShowMenu(false);
      },
    },
    {
      icon: "🐦",
      label: "Twitter / X",
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
        setShowMenu(false);
      },
    },
    {
      icon: "💼",
      label: "LinkedIn",
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
        setShowMenu(false);
      },
    },
    {
      icon: "📘",
      label: "Facebook",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        setShowMenu(false);
      },
    },
  ];

  return (
    <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>

      {/* Share Button */}
      <button
        onClick={handleShare}
        title={`Share ${label}`}
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            6,
          background:     dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
          border:         `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
          borderRadius:   40,
          padding:        "8px 16px",
          cursor:         "pointer",
          color:          dark ? "#94a3b8" : "#64748b",
          fontFamily:     "'Syne',sans-serif",
          fontWeight:     700,
          fontSize:       12,
          backdropFilter: "blur(8px)",
          boxShadow:      dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.08)",
          transition:     "all 0.2s",
          letterSpacing:  "0.03em",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background    = dark ? "rgba(255,255,255,0.14)" : "#fff";
          e.currentTarget.style.borderColor   = "#d97706";
          e.currentTarget.style.color         = "#d97706";
          e.currentTarget.style.boxShadow     = "0 4px 20px rgba(217,119,6,0.2)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background    = dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)";
          e.currentTarget.style.borderColor   = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
          e.currentTarget.style.color         = dark ? "#94a3b8" : "#64748b";
          e.currentTarget.style.boxShadow     = dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.08)";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {copied ? "✓ Copied!" : "Share"}
      </button>

      {/* Fallback dropdown menu (desktop only) */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowMenu(false)}
            style={{ position: "fixed", inset: 0, zIndex: 299 }}
          />

          {/* Menu */}
          <div style={{
            position:   "absolute",
            top:        "calc(100% + 8px)",
            right:      0,
            background: dark ? "#0f1a2e" : "#fff",
            border:     `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 16,
            padding:    "10px",
            boxShadow:  "0 16px 48px rgba(0,0,0,0.2)",
            zIndex:     300,
            minWidth:   200,
          }}>

            {/* URL preview */}
            <div style={{
              padding:    "8px 12px",
              background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
              borderRadius: 8,
              marginBottom: 8,
              fontFamily: "'Lora',serif",
              fontSize:   11,
              color:      dark ? "#475569" : "#94a3b8",
              wordBreak:  "break-all",
              lineHeight: 1.4,
            }}>
              🔗 {shareUrl}
            </div>

            {/* Share options */}
            {SHARE_OPTIONS.map(item => (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  width:      "100%",
                  display:    "flex",
                  alignItems: "center",
                  gap:        10,
                  background: "transparent",
                  border:     "none",
                  borderRadius: 10,
                  padding:    "10px 12px",
                  cursor:     "pointer",
                  textAlign:  "left",
                  transition: "background 0.15s",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 600,
                  fontSize:   13,
                  color:      dark ? "#e2e8f0" : "#1e293b",
                }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.07)" : "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 17, width: 22, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
