// ─────────────────────────────────────────────────────────────
//  src/components/StudentProfile.jsx
//  Personalized student profile page
//  Data stored in Firebase Firestore users collection
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { db } from "../config/firebase.js";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const GRADE_OPTIONS = [
  "10th Student", "10th Passout", "PUC 1st Year",
  "PUC 2nd Year", "PUC Passout", "Degree 1st Year",
  "Degree 2nd Year", "Degree 3rd Year", "Other",
];

const STREAM_OPTIONS = [
  "Science (PCM)", "Science (PCB)", "Commerce", "Arts/Humanities",
  "Diploma", "ITI", "Vocational", "Not yet decided",
];

const INTEREST_OPTIONS = [
  "Engineering", "Medical", "Law", "Civil Services",
  "Business/CA", "Arts & Design", "Teaching", "Defence",
  "Sports", "Music", "Technology", "Research",
];

const GOAL_OPTIONS = [
  "Clear JEE/CET", "Clear NEET", "Get scholarship",
  "Choose right stream", "Career guidance", "Study abroad",
  "Government job", "Start a business",
];

const EMOJI_OPTIONS = ["🎓", "🌟", "🚀", "💡", "🏆", "🎯", "📚", "⚡", "🌱", "💪", "🔬", "🎨"];

export default function StudentProfile({ dark, user, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    grade: "",
    stream: "",
    interests: [],
    goals: [],
    emoji: "🎓",
    school: "",
    city: "",
    phone: "",
  });

  const docId = user?.contact?.replace(/\./g, "_");

  useEffect(() => {
    if (!docId) return;
    fetchProfile();
  }, [docId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const ref = doc(db, "users", docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setForm({
          displayName: data.displayName || "",
          bio: data.bio || "",
          grade: data.grade || "",
          stream: data.stream || "",
          interests: data.interests || [],
          goals: data.goals || [],
          emoji: data.emoji || "🎓",
          school: data.school || "",
          city: data.city || "",
          phone: data.phone || "",
        });
        // If no display name yet, start in editing mode
        if (!data.displayName) setEditing(true);
      } else {
        setEditing(true);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "users", docId);
      await setDoc(ref, {
        ...form,
        email: user.contact,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setProfile(prev => ({ ...prev, ...form }));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleArray = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter(x => x !== val)
        : f[key].length < 5 ? [...f[key], val] : f[key],
    }));
  };

  const inputStyle = {
    background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 12, padding: "11px 14px",
    width: "100%", color: dark ? "#f1f5f9" : "#0f172a",
    fontSize: 14, fontFamily: "'Lora',serif",
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 700,
    color: dark ? "#94a3b8" : "#64748b",
    marginBottom: 6, fontFamily: "'Syne',sans-serif",
    textTransform: "uppercase", letterSpacing: "0.06em",
  };

  const tagStyle = (active, color = "#38bdf8") => ({
    background: active ? color : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
    color: active ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
    border: `1.5px solid ${active ? color : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
    borderRadius: 20, padding: "6px 14px",
    cursor: "pointer", fontFamily: "'Syne',sans-serif",
    fontWeight: 600, fontSize: 12, transition: "all 0.2s",
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#040b1c" : "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <p style={{ fontFamily: "'Syne',sans-serif", color: dark ? "#64748b" : "#94a3b8" }}>Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#040b1c" : "#f8fafc", padding: "80px 1.5rem 100px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 10, padding: "8px 16px",
            cursor: "pointer", fontFamily: "'Syne',sans-serif",
            fontWeight: 600, fontSize: 13,
            color: dark ? "#94a3b8" : "#64748b",
            marginBottom: 28, display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back to Site
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          {/* Avatar */}
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: "linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.2))",
            border: "3px solid rgba(56,189,248,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 44, margin: "0 auto 16px",
          }}>
            {form.emoji || "🎓"}
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display',serif", fontWeight: 900,
            fontSize: "clamp(1.6rem,4vw,2.4rem)",
            color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 6px",
          }}>
            {profile?.displayName || "Your Profile"}
          </h1>
          <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 14, margin: "0 0 6px" }}>
            {user?.contact}
          </p>
          {profile?.grade && (
            <span style={{
              background: "rgba(56,189,248,0.15)", color: "#38bdf8",
              border: "1px solid rgba(56,189,248,0.3)",
              padding: "4px 14px", borderRadius: 20,
              fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 700,
            }}>
              {profile.grade}
            </span>
          )}
        </div>

        {/* View Mode */}
        {!editing && profile?.displayName && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>

            {/* Bio */}
            {profile.bio && (
              <div style={{
                background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                borderRadius: 16, padding: "20px 22px",
              }}>
                <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: dark ? "#cbd5e1" : "#334155", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
                  "{profile.bio}"
                </p>
              </div>
            )}

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
              {[
                { label: "📚 Stream", value: profile.stream },
                { label: "🏫 School/College", value: profile.school },
                { label: "📍 City", value: profile.city },
              ].filter(i => i.value).map(item => (
                <div key={item.label} style={{
                  background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                  borderRadius: 12, padding: "14px 16px",
                }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: dark ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "'Lora',serif", fontSize: 14, color: dark ? "#e2e8f0" : "#1e293b", fontWeight: 600 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Interests */}
            {profile.interests?.length > 0 && (
              <div style={{
                background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                borderRadius: 16, padding: "18px 20px",
              }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: dark ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  🎯 Interests
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {profile.interests.map(i => (
                    <span key={i} style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.25)", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Goals */}
            {profile.goals?.length > 0 && (
              <div style={{
                background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                borderRadius: 16, padding: "18px 20px",
              }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: dark ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  🚀 Goals
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {profile.goals.map(g => (
                    <span key={g} style={{ background: "rgba(129,140,248,0.12)", color: "#818cf8", border: "1px solid rgba(129,140,248,0.25)", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setEditing(true)}
              style={{
                background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                color: "#fff", border: "none", borderRadius: 14,
                padding: "13px 28px", cursor: "pointer",
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
                alignSelf: "flex-start",
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>
        )}

        {/* Edit Mode */}
        {editing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {!profile?.displayName && (
              <div style={{
                background: "linear-gradient(135deg,rgba(56,189,248,0.08),rgba(129,140,248,0.08))",
                border: "1px solid rgba(56,189,248,0.2)",
                borderRadius: 14, padding: "16px 20px",
              }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#38bdf8", margin: "0 0 4px" }}>
                  👋 Welcome to DDD Community!
                </p>
                <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: dark ? "#94a3b8" : "#64748b", margin: 0 }}>
                  Set up your profile so mentors can guide you better.
                </p>
              </div>
            )}

            {/* Emoji picker */}
            <div>
              <label style={labelStyle}>Choose Avatar</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => handle("emoji", e)}
                    style={{
                      fontSize: 28, width: 50, height: 50,
                      borderRadius: 12, cursor: "pointer",
                      background: form.emoji === e ? "rgba(56,189,248,0.2)" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                      border: `2px solid ${form.emoji === e ? "#38bdf8" : "transparent"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={form.displayName} onChange={e => handle("displayName", e.target.value)} placeholder="Your full name" style={inputStyle} />
            </div>

            {/* Bio */}
            <div>
              <label style={labelStyle}>Bio / About You</label>
              <textarea value={form.bio} onChange={e => handle("bio", e.target.value)} placeholder="Tell the community about yourself — your dreams, strengths, what you're looking for..." style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} />
            </div>

            {/* Grade + Stream */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Current Grade</label>
                <select value={form.grade} onChange={e => handle("grade", e.target.value)} style={inputStyle}>
                  <option value="">Select...</option>
                  {GRADE_OPTIONS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Stream</label>
                <select value={form.stream} onChange={e => handle("stream", e.target.value)} style={inputStyle}>
                  <option value="">Select...</option>
                  {STREAM_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* School + City */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>School / College</label>
                <input type="text" value={form.school} onChange={e => handle("school", e.target.value)} placeholder="Your school or college name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" value={form.city} onChange={e => handle("city", e.target.value)} placeholder="Your city" style={inputStyle} />
              </div>
            </div>

            {/* Interests */}
            <div>
              <label style={labelStyle}>Interests (pick up to 5)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {INTEREST_OPTIONS.map(i => (
                  <button key={i} onClick={() => toggleArray("interests", i)} style={tagStyle(form.interests.includes(i), "#38bdf8")}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label style={labelStyle}>Your Goals (pick up to 5)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {GOAL_OPTIONS.map(g => (
                  <button key={g} onClick={() => toggleArray("goals", g)} style={tagStyle(form.goals.includes(g), "#818cf8")}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              {profile?.displayName && (
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    flex: 1, background: "transparent",
                    border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    borderRadius: 12, padding: "13px",
                    cursor: "pointer", fontFamily: "'Syne',sans-serif",
                    fontWeight: 700, fontSize: 14,
                    color: dark ? "#94a3b8" : "#64748b",
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={saveProfile}
                disabled={saving || !form.displayName.trim()}
                style={{
                  flex: 2,
                  background: saved ? "#34d399" : saving ? "rgba(56,189,248,0.4)" : "linear-gradient(135deg,#38bdf8,#818cf8)",
                  color: "#fff", border: "none", borderRadius: 12,
                  padding: "13px", cursor: saving || !form.displayName.trim() ? "not-allowed" : "pointer",
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
                  transition: "all 0.3s",
                }}
              >
                {saved ? "✓ Profile Saved!" : saving ? "⏳ Saving..." : "Save Profile →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
