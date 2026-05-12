// ─────────────────────────────────────────────────────────────
//  src/components/MentorProfile.jsx
//  Allows new mentors to register and existing ones to edit
//  Data stored in Firebase Firestore
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { FadeIn } from "../hooks/useInView.jsx";
import { db } from "../config/firebase.js";
import {
  collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp
} from "firebase/firestore";

const INTERESTS_OPTIONS = [
  "Coding", "Mathematics", "Science", "Biology", "History", "Geography",
  "Travelling", "Music", "Drawing", "Painting", "Sports", "Yoga",
  "Reading", "Writing", "Photography", "Cooking", "Dancing", "Gaming",
  "Current Affairs", "Mythology", "Entrepreneurship", "Social Work"
];

const COLLEGE_OPTIONS = [
  "UVCE Bengaluru", "RVCE Bengaluru", "BMS College", "MSRIT Bengaluru",
  "PES University", "Manipal Institute of Technology", "NIT Surathkal",
  "LBAS College Sagar", "SDM College", "KLE College", "Other"
];

const STREAM_OPTIONS = [
  "Information Science & Engineering", "Computer Science & Engineering",
  "Electronics & Communication", "Mechanical Engineering", "Civil Engineering",
  "AI & Data Science", "Electrical Engineering", "Biotechnology",
  "BCA", "BSc", "BCom", "BBA", "BA", "MBBS", "BDS", "PUC (Science)",
  "PUC (Commerce)", "PUC (Arts)", "Other"
];

const EMOJI_OPTIONS = ["🎓", "🌟", "🚀", "🌍", "💡", "🏆", "⚡", "🎯", "🔬", "💻", "🎨", "🏅"];
const GRADIENT_OPTIONS = [
  { from: "#3b82f6", to: "#22d3ee" },
  { from: "#a855f7", to: "#f472b6" },
  { from: "#10b981", to: "#2dd4bf" },
  { from: "#f59e0b", to: "#ef4444" },
  { from: "#38bdf8", to: "#818cf8" },
  { from: "#34d399", to: "#06b6d4" },
];

export default function MentorProfile({ dark, user }) {
  const [mode, setMode] = useState("choice"); // choice | register | edit | success
  const [existingMentor, setExistingMentor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: user?.contact || "",
    college: "",
    institution: "",
    stream: "",
    bio: "",
    interests: [],
    emoji: "🎓",
    gradientFrom: "#3b82f6",
    gradientTo: "#22d3ee",
    whatsapp: "",
    linkedin: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // Check if user already has a mentor profile
  useEffect(() => {
    if (user?.contact) {
      checkExistingProfile(user.contact);
    }
  }, [user]);

  const checkExistingProfile = async (email) => {
    setCheckingEmail(true);
    try {
      const q = query(collection(db, "mentors"), where("email", "==", email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        const id = snap.docs[0].id;
        setExistingMentor({ id, ...data });
        setForm({ ...data, id });
        setMode("choice");
      }
    } catch (err) {
      console.error("Error checking profile:", err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handle = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const toggleInterest = (interest) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : f.interests.length < 6 ? [...f.interests, interest] : f.interests,
    }));
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.stream.trim()) {
      setError("Please fill in Name, Email, and Stream at minimum.");
      return;
    }
    setLoading(true);
    try {
      if (existingMentor) {
        // Update existing
        await updateDoc(doc(db, "mentors", existingMentor.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        setStatus("updated");
      } else {
        // New registration
        await addDoc(collection(db, "mentors"), {
          ...form,
          status: "pending", // needs admin approval
          createdAt: serverTimestamp(),
        });
        setStatus("pending");
      }
      setMode("success");
    } catch (err) {
      console.error("Submit error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 12,
    padding: "11px 14px",
    width: "100%",
    color: dark ? "#f1f5f9" : "#0f172a",
    fontSize: 14,
    fontFamily: "'Lora',serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: dark ? "#94a3b8" : "#64748b",
    marginBottom: 6,
    fontFamily: "'Syne',sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  if (checkingEmail) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <p style={{ fontFamily: "'Syne',sans-serif", color: dark ? "#64748b" : "#94a3b8" }}>Checking your profile...</p>
      </div>
    );
  }

  // ── Success Screen ──
  if (mode === "success") {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 12px" }}>
          {status === "updated" ? "Profile Updated!" : "Application Submitted!"}
        </h2>
        <p style={{ fontFamily: "'Lora',serif", color: dark ? "#94a3b8" : "#64748b", fontSize: 15, lineHeight: 1.8, maxWidth: 400, margin: "0 auto 28px" }}>
          {status === "updated"
            ? "Your mentor profile has been updated successfully."
            : "Your mentor application has been submitted. The DDD admin team will review and approve it shortly."}
        </p>
        <button
          onClick={() => setMode("choice")}
          style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // ── Choice Screen ──
  if (mode === "choice") {
    return (
      <FadeIn>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>👨‍🏫</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 12px" }}>
            Mentor Portal
          </h2>
          <p style={{ fontFamily: "'Lora',serif", color: dark ? "#94a3b8" : "#64748b", fontSize: 14, maxWidth: 400, margin: "0 auto 36px", lineHeight: 1.8 }}>
            {existingMentor
              ? `Welcome back, ${existingMentor.name}! Your profile is ${existingMentor.status === "approved" ? "live ✅" : "pending approval ⏳"}.`
              : "Join as a mentor and guide the next generation of students."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400, margin: "0 auto" }}>
            {existingMentor ? (
              <button
                onClick={() => setMode("edit")}
                style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 24px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}
              >
                ✏️ Edit My Profile
              </button>
            ) : (
              <button
                onClick={() => setMode("register")}
                style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 24px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}
              >
                🚀 Register as Mentor
              </button>
            )}
          </div>

          {existingMentor && (
            <div style={{
              marginTop: 32,
              background: dark ? "rgba(255,255,255,0.03)" : "#fff",
              border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              borderRadius: 18,
              padding: "24px",
              maxWidth: 400,
              margin: "32px auto 0",
              textAlign: "left",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{existingMentor.emoji}</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>{existingMentor.name}</h3>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: dark ? "#64748b" : "#94a3b8", margin: "0 0 8px" }}>{existingMentor.stream} · {existingMentor.institution}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(existingMentor.interests || []).map(i => (
                  <span key={i} style={{ background: "#38bdf818", color: "#38bdf8", border: "1px solid #38bdf833", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{i}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    );
  }

  // ── Register / Edit Form ──
  return (
    <FadeIn>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>
            {mode === "edit" ? "Edit Your Profile" : "Register as Mentor"}
          </h2>
          <p style={{ fontFamily: "'Lora',serif", color: dark ? "#94a3b8" : "#64748b", fontSize: 14 }}>
            {mode === "edit" ? "Update your mentor profile details below." : "Fill in your details to join as a DDD mentor."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" value={form.name} onChange={e => handle("name", e.target.value)} placeholder="Your full name" style={inputStyle} />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" value={form.email} onChange={e => handle("email", e.target.value)} placeholder="you@example.com" style={{ ...inputStyle, opacity: existingMentor ? 0.6 : 1 }} disabled={!!existingMentor} />
          </div>

          {/* Stream */}
          <div>
            <label style={labelStyle}>Stream / Course *</label>
            <select value={form.stream} onChange={e => handle("stream", e.target.value)} style={inputStyle}>
              <option value="">Select stream...</option>
              {STREAM_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* College */}
          <div>
            <label style={labelStyle}>College / Institution</label>
            <select value={form.college} onChange={e => handle("college", e.target.value)} style={inputStyle}>
              <option value="">Select college...</option>
              {COLLEGE_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
            {form.college === "Other" && (
              <input type="text" value={form.institution} onChange={e => handle("institution", e.target.value)} placeholder="Enter college name" style={{ ...inputStyle, marginTop: 8 }} />
            )}
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Short Bio</label>
            <textarea value={form.bio} onChange={e => handle("bio", e.target.value)} placeholder="Tell students about yourself, your journey, and how you can help them..." style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} />
          </div>

          {/* Interests */}
          <div>
            <label style={labelStyle}>Interests (pick up to 6)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS_OPTIONS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  style={{
                    background: form.interests.includes(interest) ? "#38bdf8" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                    color: form.interests.includes(interest) ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
                    border: `1.5px solid ${form.interests.includes(interest) ? "#38bdf8" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    transition: "all 0.2s",
                  }}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji picker */}
          <div>
            <label style={labelStyle}>Choose your avatar emoji</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => handle("emoji", e)}
                  style={{
                    fontSize: 28,
                    background: form.emoji === e ? "#38bdf822" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                    border: `2px solid ${form.emoji === e ? "#38bdf8" : "transparent"}`,
                    borderRadius: 12,
                    width: 48, height: 48,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient picker */}
          <div>
            <label style={labelStyle}>Profile card color</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {GRADIENT_OPTIONS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => { handle("gradientFrom", g.from); handle("gradientTo", g.to); }}
                  style={{
                    width: 40, height: 40,
                    borderRadius: 10,
                    background: `linear-gradient(135deg,${g.from},${g.to})`,
                    border: `3px solid ${form.gradientFrom === g.from ? "#fff" : "transparent"}`,
                    cursor: "pointer",
                    outline: form.gradientFrom === g.from ? "2px solid #38bdf8" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* WhatsApp / LinkedIn */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>WhatsApp (optional)</label>
              <input type="tel" value={form.whatsapp} onChange={e => handle("whatsapp", e.target.value)} placeholder="10-digit number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn (optional)</label>
              <input type="url" value={form.linkedin} onChange={e => handle("linkedin", e.target.value)} placeholder="linkedin.com/in/..." style={inputStyle} />
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13, fontFamily: "'Lora',serif" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setMode("choice")}
              style={{ flex: 1, background: "transparent", border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 12, padding: "13px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: dark ? "#94a3b8" : "#64748b" }}
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ flex: 2, background: loading ? "rgba(56,189,248,0.4)" : "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", border: "none", borderRadius: 12, padding: "13px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}
            >
              {loading ? "⏳ Saving..." : mode === "edit" ? "✅ Save Changes" : "🚀 Submit Application"}
            </button>
          </div>

          {mode === "register" && (
            <p style={{ textAlign: "center", fontSize: 12, color: dark ? "#475569" : "#94a3b8", fontFamily: "'Lora',serif" }}>
              Your application will be reviewed by the DDD admin team before going live.
            </p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
