// ─────────────────────────────────────────────────────────────
//  src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useTranslation } from "../data/translations.js";
import { NotificationBell } from "./Notifications.jsx";
import { WHATSAPP_LINK } from "../data/content.js";
import GlobalSearch from "./GlobalSearch.jsx";

export default function Navbar({ dark, setDark, user, visitorCount, isHost, onLogout, onShowVisitors, lang, notifications, unread, onMarkRead, adminBarOffset }) {
  const t = useTranslation(lang);
  const NAV_LINKS = [
    { key: "about",        label: t.nav.about,        href: "#about" },
    { key: "mentors",      label: t.nav.mentors,      href: "#mentors" },
    { key: "guidance",     label: t.nav.guidance,     href: "#guidance" },
    { key: "scholarships", label: t.nav.scholarships, href: "#scholarships" },
    { key: "whatnext",     label: t.nav.whatNext,     href: "#whatnext" },
    { key: "engineering",  label: t.nav.engineering,  href: "#engineering" },
    { key: "medical",      label: t.nav.medical,      href: "#medical" },
    { key: "exams",        label: t.nav.exams,        href: "#exams" },
    { key: "community",    label: t.nav.community,    href: "#community" },
    { key: "faq",          label: t.nav.faq,          href: "#faq" },
  ];

  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Open search with Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Global Search Modal */}
      <GlobalSearch dark={dark} open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav style={{
        position: "fixed", top: adminBarOffset || 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? (dark ? "rgba(4,10,25,0.95)" : "rgba(255,255,255,0.95)") : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${dark ? "rgba(56,189,248,0.15)" : "rgba(0,0,0,0.08)"}` : "none",
        transition: "all 0.3s ease",
        padding: "0 2rem",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20, background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            D • D • D
          </span>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-links">
            {NAV_LINKS.map(link => (
              <a
                key={link.key}
                href={link.href}
                style={{ color: dark ? "#94a3b8" : "#475569", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s", fontFamily: "'Syne', sans-serif", letterSpacing: "0.02em" }}
                onMouseEnter={e => e.target.style.color = "#38bdf8"}
                onMouseLeave={e => e.target.style.color = dark ? "#94a3b8" : "#475569"}
              >
                {link.label}
              </a>
            ))}

            {/* 🔍 Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              title="Search (Ctrl+K)"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                borderRadius: 20, padding: "6px 14px",
                cursor: "pointer", color: dark ? "#64748b" : "#94a3b8",
                fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.color = "#38bdf8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"; e.currentTarget.style.color = dark ? "#64748b" : "#94a3b8"; }}
            >
              <span style={{ fontSize: 14 }}>🔍</span>
              <span style={{ fontSize: 12 }}>Search</span>
              <span style={{
                background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                borderRadius: 6, padding: "1px 6px", fontSize: 10, fontWeight: 700,
                color: dark ? "#475569" : "#94a3b8",
              }}>⌘K</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell dark={dark} user={user} unread={unread || 0} notifications={notifications || []} onMarkRead={onMarkRead || (() => {})} />

            {/* Dark/Light toggle */}
            <button
              onClick={() => setDark(!dark)}
              style={{ background: dark ? "rgba(56,189,248,0.12)" : "rgba(0,0,0,0.07)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 16 }}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {user ? (
              <>
                {isHost && (
                  <>
                    <span style={{ color: dark ? "#cbd5e1" : "#475569", fontSize: 13, padding: "8px 14px", borderRadius: 18, border: "1px solid rgba(56,189,248,0.18)", fontFamily: "'Syne',sans-serif" }}>
                      Visitors: {visitorCount}
                    </span>
                    <button
                      onClick={onShowVisitors}
                      style={{ background: "transparent", border: "1px solid rgba(56,189,248,0.35)", color: dark ? "#f8fafc" : "#0f172a", padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}
                    >
                      View Visitors
                    </button>
                  </>
                )}
                <button
                  onClick={onLogout}
                  style={{ background: "transparent", border: "1px solid rgba(56,189,248,0.35)", color: dark ? "#f8fafc" : "#0f172a", padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="#"
                onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "'Syne', sans-serif" }}
              >
                Login
              </a>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <div style={{ display: "none" }} className="mobile-right">
            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: dark ? "#94a3b8" : "#475569", marginRight: 8 }}
            >🔍</button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: dark ? "#fff" : "#0f172a" }}
              className="hamburger"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: dark ? "rgba(4,10,25,0.98)" : "#fff", padding: "16px 2rem 24px", display: "flex", flexDirection: "column", gap: 16 }} className="mobile-menu">
            {NAV_LINKS.map(link => (
              <a key={link.key} href={link.href} onClick={() => setMenuOpen(false)} style={{ color: dark ? "#94a3b8" : "#475569", fontSize: 15, fontWeight: 500, textDecoration: "none", fontFamily: "'Syne', sans-serif" }}>
                {link.label}
              </a>
            ))}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", padding: "10px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, textDecoration: "none", textAlign: "center", fontFamily: "'Syne', sans-serif" }}>
              Join Now
            </a>
          </div>
        )}

        <style>{`
          @media(max-width:768px){
            .nav-links { display: none !important; }
            .mobile-right { display: flex !important; align-items: center; }
          }
        `}</style>
      </nav>
    </>
  );
}
