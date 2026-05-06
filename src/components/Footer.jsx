// ─────────────────────────────────────────────────────────────
//  src/components/Footer.jsx
// ─────────────────────────────────────────────────────────────

import { WHATSAPP_LINK } from "../data/content.js";

const FOOTER_LINKS = [
  { heading: "Explore",    links: ["About Us", "Mentors", "Guidance Areas", "Scholarships"] },
  { heading: "Community",  links: ["Join Us", "Discussion Rooms", "Ask Doubts", "Opportunities"] },
  { heading: "Connect",    links: ["Instagram", "WhatsApp Community", "Telegram", "Email Us"] },
];

export default function Footer() {
  return (
    <footer style={{ background: "#020810", padding: "60px 2rem 32px", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 24, background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 14 }}>
              D • D • D
            </div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, fontFamily: "'Lora',serif" }}>
              Dream. Decide. Dominate. A student mentorship community building brighter futures.
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: 16, background: "linear-gradient(135deg,#38bdf8,#6366f1)", color: "#fff", padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "'Syne',sans-serif" }}
            >
              Join on WhatsApp 💬
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#38bdf8", marginBottom: 16 }}>
                {heading}
              </div>
              {links.map(link => (
                <div
                  key={link}
                  style={{ fontSize: 13, color: "#64748b", marginBottom: 10, cursor: "pointer", fontFamily: "'Lora',serif", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#e2e8f0"}
                  onMouseLeave={e => e.target.style.color = "#64748b"}
                >
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 16, color: "#475569" }}>
            "Dream. Decide. Dominate."
          </div>
          <div style={{ fontSize: 12, color: "#334155", fontFamily: "'Syne',sans-serif" }}>
            © 2025 Dream • Decide • Dominate. Made with ❤️ for students.
          </div>
        </div>

      </div>
    </footer>
  );
}
