// ─────────────────────────────────────────────────────────────
//  src/components/Navbar.jsx  —  Saffron & Earth Theme
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useTranslation } from "../data/translations.js";
import { NotificationBell } from "./Notifications.jsx";
import { WHATSAPP_LINK } from "../data/content.js";
import GlobalSearch from "./GlobalSearch.jsx";

const S = {
  primary:     "#d97706",
  primaryHov:  "#b45309",
  primarySoft: "rgba(217,119,6,0.12)",
  primaryBdr:  "rgba(217,119,6,0.3)",
  darkBg:      "rgba(26,14,0,0.97)",
  lightBg:     "rgba(254,252,232,0.97)",
  darkText:    "#f5e6c8",
  darkMuted:   "#92683a",
  lightText:   "#78350f",
  lightMuted:  "#92400e",
};

export default function Navbar({ dark, setDark, user, visitorCount, isHost, onLogout, onShowVisitors, lang, notifications, unread, onMarkRead, adminBarOffset, onGoToProfile, onGoHome }) {
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

  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <GlobalSearch dark={dark} open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav style={{
        position: "fixed", top: adminBarOffset || 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? (dark ? S.darkBg : S.lightBg) : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${dark ? "rgba(217,119,6,0.2)" : "rgba(217,119,6,0.15)"}` : "none",
        transition: "all 0.3s ease", padding: "0 2rem",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 20, background: "linear-gradient(135deg,#d97706,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            D • D • D
          </span>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }} className="nav-links">
            {NAV_LINKS.map(link => (
              <a key={link.key} href={link.href}
                style={{ color: dark ? S.darkMuted : S.lightMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s", fontFamily: "'Syne',sans-serif", letterSpacing: "0.02em" }}
                onMouseEnter={e => e.target.style.color = S.primary}
                onMouseLeave={e => e.target.style.color = dark ? S.darkMuted : S.lightMuted}
              >{link.label}</a>
            ))}

            <button onClick={() => setSearchOpen(true)} title="Search (Ctrl+K)" style={{
              display: "flex", alignItems: "center", gap: 6,
              background: dark ? "rgba(217,119,6,0.08)" : "rgba(217,119,6,0.06)",
              border: `1px solid ${S.primaryBdr}`, borderRadius: 20, padding: "6px 14px",
              cursor: "pointer", color: dark ? S.darkMuted : S.lightMuted,
              fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = S.primary; e.currentTarget.style.color = S.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = S.primaryBdr; e.currentTarget.style.color = dark ? S.darkMuted : S.lightMuted; }}
            >
              <span style={{ fontSize: 14 }}>🔍</span>
              <span style={{ fontSize: 12 }}>Search</span>
              <span style={{ background: "rgba(217,119,6,0.1)", borderRadius: 6, padding: "1px 6px", fontSize: 10, fontWeight: 700, color: dark ? S.darkMuted : S.lightMuted }}>⌘K</span>
            </button>

            <NotificationBell dark={dark} user={user} unread={unread || 0} notifications={notifications || []} onMarkRead={onMarkRead || (() => {})} />

            <button onClick={() => setDark(!dark)} style={{ background: dark ? "rgba(217,119,6,0.12)" : "rgba(217,119,6,0.08)", border: `1px solid ${S.primaryBdr}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 16 }}>
              {dark ? "☀️" : "🌙"}
            </button>

            {user ? (
              <>
                {isHost && (
                  <>
                    <span style={{ color: dark ? S.darkMuted : S.lightMuted, fontSize: 13, padding: "8px 14px", borderRadius: 18, border: `1px solid ${S.primaryBdr}`, fontFamily: "'Syne',sans-serif" }}>
                      Visitors: {visitorCount}
                    </span>
                    <button onClick={onShowVisitors} style={{ background: "transparent", border: `1px solid ${S.primaryBdr}`, color: dark ? S.darkText : S.lightText, padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
                      View Visitors
                    </button>
                  </>
                )}
                <button onClick={onGoToProfile} style={{ display: "flex", alignItems: "center", gap: 6, background: S.primarySoft, border: `1px solid ${S.primaryBdr}`, borderRadius: 20, padding: "7px 16px", cursor: "pointer", color: S.primary, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(217,119,6,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.background = S.primarySoft}
                >👤 Profile</button>
                <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${S.primaryBdr}`, color: dark ? S.darkText : S.lightText, padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
                  Logout
                </button>
              </>
            ) : (
              <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ background: "linear-gradient(135deg,#d97706,#b45309)", color: "#fff", padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "'Syne',sans-serif" }}>
                Login
              </a>
            )}
          </div>

          <div style={{ display: "none" }} className="mobile-right">
            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: dark ? S.darkMuted : S.lightMuted, marginRight: 8 }}>🔍</button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: dark ? S.darkText : S.lightText }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ background: dark ? "#1a0e00" : "#fffbeb", padding: "16px 2rem 24px", display: "flex", flexDirection: "column", gap: 16, borderTop: `1px solid ${S.primaryBdr}` }}>
            {NAV_LINKS.map(link => (
              <a key={link.key} href={link.href} onClick={() => setMenuOpen(false)} style={{ color: dark ? S.darkMuted : S.lightMuted, fontSize: 15, fontWeight: 500, textDecoration: "none", fontFamily: "'Syne',sans-serif" }}>
                {link.label}
              </a>
            ))}
            {user && (
              <button onClick={() => { setMenuOpen(false); onGoToProfile?.(); }} style={{ background: S.primarySoft, border: `1px solid ${S.primaryBdr}`, color: S.primary, padding: "10px 20px", borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", textAlign: "center" }}>
                👤 My Profile
              </button>
            )}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg,#d97706,#b45309)", color: "#fff", padding: "10px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600, textDecoration: "none", textAlign: "center", fontFamily: "'Syne',sans-serif" }}>
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
