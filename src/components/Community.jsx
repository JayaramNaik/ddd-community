// ─────────────────────────────────────────────────────────────
//  src/components/Community.jsx
//  Interactive tabbed community board with persistent storage.
//  Posts are shared across all visitors (shared: true).
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { FadeIn } from "../hooks/useInView.jsx";
import { COMMUNITY_TABS } from "../data/content.js";

export default function Community({ dark }) {
  const [activeTab, setActiveTab]   = useState("intros");
  const [posts, setPosts]           = useState({});
  const [drafts, setDrafts]         = useState({ intros: "", discuss: "", doubts: "", opps: "" });
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const tab = COMMUNITY_TABS.find(t => t.key === activeTab);

  // ── Load all tabs from storage on mount ──
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const all = {};
      for (const t of COMMUNITY_TABS) {
        try {
          const res = await window.storage.get(`community_${t.key}`, true);
          all[t.key] = res ? JSON.parse(res.value) : [];
        } catch {
          all[t.key] = [];
        }
      }
      setPosts(all);
      setLoading(false);
    };
    loadPosts();
  }, []);

  // ── Submit a new post ──
  const handlePost = async () => {
    const text = drafts[activeTab].trim();
    if (!text) return;

    const author = authorName.trim() || "Anonymous";
    setSubmitting(true);

    const newPost = {
      id:     Date.now(),
      author,
      text,
      time:   new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [newPost, ...(posts[activeTab] || [])];

    try {
      await window.storage.set(`community_${activeTab}`, JSON.stringify(updated), true);
    } catch (e) {
      console.error("Storage error:", e);
    }

    setPosts(p => ({ ...p, [activeTab]: updated }));
    setDrafts(d => ({ ...d, [activeTab]: "" }));
    setSubmitting(false);
  };

  // ── Delete a post ──
  const handleDelete = async (id) => {
    const updated = (posts[activeTab] || []).filter(p => p.id !== id);
    try {
      await window.storage.set(`community_${activeTab}`, JSON.stringify(updated), true);
    } catch (e) {
      console.error("Storage error:", e);
    }
    setPosts(p => ({ ...p, [activeTab]: updated }));
  };

  const tabPosts = posts[activeTab] || [];

  // ── Shared styles ──
  const cardStyle = {
    background:   dark ? "rgba(255,255,255,0.04)" : "#fff",
    border:       `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
    borderRadius: 20,
  };
  const inputStyle = {
    background:   dark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
    border:       `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 10,
    padding:      "10px 14px",
    color:        dark ? "#e2e8f0" : "#0f172a",
    fontSize:     14,
    fontFamily:   "'Lora',serif",
    outline:      "none",
    width:        "100%",
    boxSizing:    "border-box",
  };

  return (
    <section id="community" style={{ padding: "100px 2rem", background: dark ? "#060d1f" : "#f8fafc" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>
              COMMUNITY HUB
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f1f5f9" : "#0f172a" }}>
              Where Students{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Connect</span>
            </h2>
            <p style={{ color: dark ? "#64748b" : "#64748b", marginTop: 10, fontFamily: "'Lora',serif", fontSize: 15 }}>
              Real posts from real students. Add your voice — every entry is visible to all.
            </p>
          </div>
        </FadeIn>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, justifyContent: "center" }}>
          {COMMUNITY_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "10px 20px", borderRadius: 50, border: "none", cursor: "pointer",
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13,
                background: activeTab === t.key ? `linear-gradient(135deg,${t.color},${t.color}99)` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                color:      activeTab === t.key ? "#fff" : dark ? "#94a3b8" : "#475569",
                boxShadow:  activeTab === t.key ? `0 4px 20px ${t.color}44` : "none",
                transition: "all 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Post input card */}
        <FadeIn>
          <div style={{ ...cardStyle, padding: "24px 26px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: tab.color, fontFamily: "'Syne',sans-serif", marginBottom: 14 }}>
              {tab.icon} {tab.label} — {tab.hint}
            </div>
            <input
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Your name (optional — defaults to Anonymous)"
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <textarea
              value={drafts[activeTab]}
              onChange={e => setDrafts(d => ({ ...d, [activeTab]: e.target.value }))}
              placeholder={tab.placeholder}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", marginBottom: 14 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handlePost}
                disabled={submitting || !drafts[activeTab].trim()}
                style={{
                  background:   drafts[activeTab].trim() ? `linear-gradient(135deg,${tab.color},#6366f1)` : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  color:        drafts[activeTab].trim() ? "#fff" : dark ? "#475569" : "#94a3b8",
                  border:       "none", borderRadius: 50, padding: "10px 26px",
                  fontSize:     14, fontWeight: 700,
                  cursor:       drafts[activeTab].trim() ? "pointer" : "default",
                  fontFamily:   "'Syne',sans-serif", transition: "all 0.2s",
                }}
              >
                {submitting ? "Posting..." : "Post ✨"}
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Posts list */}
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: dark ? "#475569" : "#94a3b8", fontFamily: "'Lora',serif" }}>
              Loading posts...
            </div>
          ) : tabPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: 16, color: dark ? "#475569" : "#94a3b8", fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 15 }}>
              {tab.emptyMsg}
            </div>
          ) : (
            tabPosts.map((post, i) => (
              <div
                key={post.id}
                style={{ ...cardStyle, padding: "18px 22px", marginBottom: 12, borderLeft: `3px solid ${tab.color}`, animation: i === 0 ? "slideIn 0.3s ease" : "none" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: tab.color, fontFamily: "'Syne',sans-serif" }}>{post.author}</span>
                      <span style={{ fontSize: 11, color: dark ? "#475569" : "#94a3b8", fontFamily: "'Syne',sans-serif" }}>{post.time}</span>
                    </div>
                    <p style={{ fontSize: 14, color: dark ? "#cbd5e1" : "#334155", lineHeight: 1.7, fontFamily: "'Lora',serif", margin: 0 }}>
                      {post.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    title="Remove post"
                    style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#334155" : "#cbd5e1", fontSize: 16, padding: "2px 6px", borderRadius: 6, transition: "color 0.2s", flexShrink: 0 }}
                    onMouseEnter={e => e.target.style.color = "#ef4444"}
                    onMouseLeave={e => e.target.style.color = dark ? "#334155" : "#cbd5e1"}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
      <style>{`@keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </section>
  );
}
