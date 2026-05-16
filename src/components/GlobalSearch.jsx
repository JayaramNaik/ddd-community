// ─────────────────────────────────────────────────────────────
//  src/components/GlobalSearch.jsx
//  Site-wide instant search — mentors, FAQs, scholarships,
//  exams, guidance areas. Triggered from Navbar search icon.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { FAQS, SCHOLARSHIPS, GUIDANCE_AREAS } from "../data/content.js";

// ── Static data to search through ────────────────────────────
const EXAMS_DATA = [
  { title: "JEE Main",     desc: "Joint Entrance Examination for engineering admissions",  section: "Engineering", href: "#engineering" },
  { title: "JEE Advanced", desc: "For IIT admissions — top engineering colleges in India", section: "Engineering", href: "#engineering" },
  { title: "NEET UG",      desc: "National Eligibility cum Entrance Test for medical",     section: "Medical",      href: "#medical" },
  { title: "KCET",         desc: "Karnataka Common Entrance Test for state colleges",      section: "Exams",        href: "#exams" },
  { title: "BITSAT",       desc: "BITS Pilani entrance examination",                       section: "Exams",        href: "#exams" },
  { title: "CUET",         desc: "Common University Entrance Test for central universities", section: "Exams",      href: "#exams" },
  { title: "UPSC",         desc: "Civil Services Examination for IAS, IPS, IFS",          section: "Exams",        href: "#exams" },
  { title: "GATE",         desc: "Graduate Aptitude Test for M.Tech and PSU jobs",        section: "Exams",        href: "#exams" },
  { title: "NDA",          desc: "National Defence Academy entrance exam",                section: "Exams",        href: "#exams" },
  { title: "SSC CGL",      desc: "Combined Graduate Level exam for central govt jobs",    section: "Exams",        href: "#exams" },
];

const SECTION_COLORS = {
  "Mentor":      "#38bdf8",
  "FAQ":         "#818cf8",
  "Scholarship": "#34d399",
  "Guidance":    "#f59e0b",
  "Engineering": "#a855f7",
  "Medical":     "#ef4444",
  "Exams":       "#f472b6",
};

const SECTION_ICONS = {
  "Mentor":      "🎓",
  "FAQ":         "❓",
  "Scholarship": "🏆",
  "Guidance":    "📚",
  "Engineering": "⚙️",
  "Medical":     "🩺",
  "Exams":       "📝",
};

export default function GlobalSearch({ dark, open, onClose }) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [mentors, setMentors]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef(null);

  // ── Load mentors from Firestore once ──
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const snap = await getDocs(collection(db, "mentors"));
        setMentors(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.status === "approved"));
      } catch (err) {
        console.warn("Could not load mentors for search:", err);
      }
    };
    fetchMentors();
  }, []);

  // ── Focus input when opened ──
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // ── Close on Escape ──
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ── Search logic ──
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const hits = [];

    // Mentors
    mentors.forEach(m => {
      if (
        m.name?.toLowerCase().includes(q) ||
        m.college?.toLowerCase().includes(q) ||
        m.institution?.toLowerCase().includes(q) ||
        m.interests?.some(i => i.toLowerCase().includes(q))
      ) {
        hits.push({
          section: "Mentor",
          title: m.name,
          desc: `${m.college}${m.institution ? " · " + m.institution : ""}`,
          tags: m.interests?.slice(0, 3) || [],
          href: "#mentors",
          emoji: m.emoji || "🎓",
        });
      }
    });

    // FAQs
    FAQS.forEach(f => {
      if (f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) {
        hits.push({
          section: "FAQ",
          title: f.q,
          desc: f.a,
          href: "#faq",
          emoji: "❓",
        });
      }
    });

    // Scholarships
    SCHOLARSHIPS.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.badge?.toLowerCase().includes(q)) {
        hits.push({
          section: "Scholarship",
          title: s.name,
          desc: s.desc,
          tags: [s.badge],
          href: s.url || "#scholarships",
          emoji: "🏆",
          external: !!s.url,
        });
      }
    });

    // Guidance
    GUIDANCE_AREAS.forEach(g => {
      if (g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)) {
        hits.push({
          section: "Guidance",
          title: g.title,
          desc: g.desc,
          href: "#guidance",
          emoji: g.icon,
        });
      }
    });

    // Exams
    EXAMS_DATA.forEach(ex => {
      if (ex.title.toLowerCase().includes(q) || ex.desc.toLowerCase().includes(q)) {
        hits.push({
          section: ex.section,
          title: ex.title,
          desc: ex.desc,
          href: ex.href,
          emoji: SECTION_ICONS[ex.section] || "📝",
        });
      }
    });

    setResults(hits.slice(0, 12)); // max 12 results
  }, [query, mentors]);

  // ── Highlight matching text ──
  const highlight = (text, q) => {
    if (!q || !text) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: "rgba(56,189,248,0.25)", color: "inherit", borderRadius: 3, padding: "0 2px" }}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "80px 20px 20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 640,
          background: dark ? "#0d1424" : "#fff",
          borderRadius: 20,
          border: `1px solid ${dark ? "rgba(56,189,248,0.2)" : "rgba(0,0,0,0.1)"}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          overflow: "hidden",
          maxHeight: "80vh",
          display: "flex", flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Search Input ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px",
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search mentors, FAQs, scholarships, exams..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 16,
              color: dark ? "#f1f5f9" : "#0f172a",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: dark ? "#64748b" : "#94a3b8", flexShrink: 0 }}>✕</button>
          )}
          <button onClick={onClose} style={{ background: dark ? "rgba(255,255,255,0.07)" : "#f1f5f9", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11, color: dark ? "#64748b" : "#94a3b8", flexShrink: 0 }}>ESC</button>
        </div>

        {/* ── Results ── */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {!query && (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
              <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
                Search across mentors, FAQs, scholarships,<br />guidance areas, and entrance exams.
              </p>
              {/* Quick shortcuts */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 20 }}>
                {["NEET", "JEE", "Scholarship", "Mentor", "Career"].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    style={{
                      padding: "6px 16px", borderRadius: 20, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      background: "transparent", cursor: "pointer",
                      fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12,
                      color: dark ? "#94a3b8" : "#64748b",
                    }}
                  >{term}</button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>😕</p>
              <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 14 }}>
                No results for "<strong>{query}</strong>"
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ padding: "8px 0" }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11, color: dark ? "#475569" : "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 20px 4px" }}>
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((r, i) => (
                <a
                  key={i}
                  href={r.href}
                  target={r.external ? "_blank" : "_self"}
                  rel={r.external ? "noopener noreferrer" : undefined}
                  onClick={onClose}
                  style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "12px 20px", textDecoration: "none",
                    borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(56,189,248,0.07)" : "rgba(56,189,248,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: `${SECTION_COLORS[r.section] || "#38bdf8"}18`,
                    border: `1px solid ${SECTION_COLORS[r.section] || "#38bdf8"}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>
                    {r.emoji}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: dark ? "#f1f5f9" : "#0f172a" }}>
                        {highlight(r.title, query)}
                      </span>
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700,
                        background: `${SECTION_COLORS[r.section] || "#38bdf8"}18`,
                        color: SECTION_COLORS[r.section] || "#38bdf8",
                        border: `1px solid ${SECTION_COLORS[r.section] || "#38bdf8"}30`,
                        fontFamily: "'Syne',sans-serif",
                      }}>
                        {r.section}
                      </span>
                      {r.external && <span style={{ fontSize: 10, color: dark ? "#475569" : "#94a3b8" }}>↗</span>}
                    </div>
                    <p style={{
                      fontFamily: "'Lora',serif", fontSize: 12,
                      color: dark ? "#64748b" : "#94a3b8",
                      margin: 0, lineHeight: 1.5,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {highlight(r.desc, query)}
                    </p>
                    {r.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                        {r.tags.filter(Boolean).map(tag => (
                          <span key={tag} style={{ fontSize: 10, padding: "1px 8px", borderRadius: 20, background: dark ? "rgba(255,255,255,0.06)" : "#f1f5f9", color: dark ? "#64748b" : "#94a3b8", fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <span style={{ color: dark ? "#334155" : "#cbd5e1", fontSize: 16, flexShrink: 0, marginTop: 8 }}>→</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "10px 20px",
          borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "flex", gap: 16, alignItems: "center",
        }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, color: dark ? "#334155" : "#cbd5e1", fontWeight: 600 }}>
            ↑↓ navigate &nbsp;·&nbsp; Enter to go &nbsp;·&nbsp; Esc to close
          </span>
        </div>
      </div>
    </div>
  );
}
