// ─────────────────────────────────────────────────────────────
//  src/components/AdminMentors.jsx
//  Full CRUD — Add / Approve / Delete mentors via Firestore
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { db } from "../config/firebase.js";
import {
  collection, getDocs, updateDoc, deleteDoc,
  doc, query, orderBy, addDoc, serverTimestamp
} from "firebase/firestore";

function ConfirmDialog({ message, onConfirm, onCancel, dark }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: dark ? "#0f172a" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 20, padding: "36px 32px", maxWidth: 400, width: "100%", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: dark ? "#e2e8f0" : "#1e293b", lineHeight: 1.7, margin: "0 0 28px" }}>{message}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{ padding: "11px 28px", borderRadius: 12, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, background: "transparent", color: dark ? "#94a3b8" : "#64748b", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

function AddMentorForm({ dark, onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", college: "", institution: "", interests: "", emoji: "🎓", gradientFrom: "#38bdf8", gradientTo: "#818cf8", email: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.name.trim() || !form.college.trim()) return;
    setSaving(true);
    try {
      await onAdd({ ...form, interests: form.interests.split(",").map(s => s.trim()).filter(Boolean), status: "approved", createdAt: serverTimestamp() });
      onClose();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, boxSizing: "border-box", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", color: dark ? "#f1f5f9" : "#0f172a", fontFamily: "'Lora',serif", fontSize: 13, outline: "none", marginBottom: 12 };
  const labelStyle = { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: dark ? "#94a3b8" : "#64748b", display: "block", marginBottom: 4 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: dark ? "#0f172a" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 24, padding: "32px", maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "1.4rem", color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>➕ Add New Mentor</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: dark ? "#94a3b8" : "#64748b" }}>×</button>
        </div>

        <label style={labelStyle}>Name *</label>
        <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" />

        <label style={labelStyle}>Course / Branch *</label>
        <input style={inputStyle} value={form.college} onChange={e => set("college", e.target.value)} placeholder="e.g. Information Science & Engineering" />

        <label style={labelStyle}>College / Institution</label>
        <input style={inputStyle} value={form.institution} onChange={e => set("institution", e.target.value)} placeholder="e.g. UVCE Bengaluru" />

        <label style={labelStyle}>Email</label>
        <input style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} placeholder="mentor@email.com" />

        <label style={labelStyle}>Interests (comma separated)</label>
        <input style={inputStyle} value={form.interests} onChange={e => set("interests", e.target.value)} placeholder="e.g. Yoga, Music, Travelling" />

        <label style={labelStyle}>Emoji Avatar</label>
        <input style={{ ...inputStyle, fontSize: 24, textAlign: "center" }} value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="🎓" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Gradient From</label>
            <input type="color" value={form.gradientFrom} onChange={e => set("gradientFrom", e.target.value)} style={{ width: "100%", height: 40, borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 12 }} />
          </div>
          <div>
            <label style={labelStyle}>Gradient To</label>
            <input type="color" value={form.gradientTo} onChange={e => set("gradientTo", e.target.value)} style={{ width: "100%", height: 40, borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 12 }} />
          </div>
        </div>

        <div style={{ height: 6, borderRadius: 4, background: `linear-gradient(90deg,${form.gradientFrom},${form.gradientTo})`, marginBottom: 20 }} />

        <label style={labelStyle}>Photo URL (optional)</label>
        <input style={inputStyle} value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://..." />

        <button onClick={handleAdd} disabled={saving || !form.name.trim() || !form.college.trim()} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: saving || !form.name.trim() ? "rgba(56,189,248,0.3)" : "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", marginTop: 4 }}>
          {saving ? "Adding..." : "✅ Add Mentor"}
        </button>
      </div>
    </div>
  );
}

export default function AdminMentors({ dark }) {
  const [mentors, setMentors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("approved");
  const [confirmId, setConfirmId]     = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast]             = useState("");

  useEffect(() => { fetchMentors(); }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "mentors"), orderBy("createdAt", "desc")));
      setMentors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("❌ Failed to load mentors");
    } finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const approve = async (id) => {
    await updateDoc(doc(db, "mentors", id), { status: "approved" });
    setMentors(m => m.map(x => x.id === id ? { ...x, status: "approved" } : x));
    showToast("✅ Mentor approved!");
  };

  const deleteMentor = async (id) => {
    try {
      await deleteDoc(doc(db, "mentors", id));
      setMentors(m => m.filter(x => x.id !== id));
      showToast("🗑️ Mentor removed successfully!");
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to delete mentor");
    }
    setConfirmId(null);
  };

  const addMentor = async (data) => {
    const ref = await addDoc(collection(db, "mentors"), data);
    setMentors(m => [{ id: ref.id, ...data }, ...m]);
    showToast("🎉 Mentor added!");
  };

  const filtered = mentors.filter(m => filter === "all" ? true : m.status === filter);
  const confirmMentor = mentors.find(m => m.id === confirmId);

  return (
    <div style={{ padding: "40px 20px", maxWidth: 800, margin: "0 auto" }}>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#0f172a", color: "#fff", padding: "12px 28px", borderRadius: 40, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", zIndex: 9997, border: "1px solid rgba(56,189,248,0.3)" }}>{toast}</div>
      )}

      {confirmId && <ConfirmDialog dark={dark} message={`Permanently remove "${confirmMentor?.name}"? This cannot be undone.`} onConfirm={() => deleteMentor(confirmId)} onCancel={() => setConfirmId(null)} />}
      {showAddForm && <AddMentorForm dark={dark} onAdd={addMentor} onClose={() => setShowAddForm(false)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>👑 Mentor Management</h2>
          <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 14, margin: 0 }}>Add, approve, and remove mentors from the site.</p>
        </div>
        <button onClick={() => setShowAddForm(true)} style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>➕ Add Mentor</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["pending", "approved", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "linear-gradient(135deg,#38bdf8,#818cf8)" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"), color: filter === f ? "#fff" : (dark ? "#94a3b8" : "#64748b"), border: "none", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, textTransform: "capitalize" }}>
            {f} ({mentors.filter(m => f === "all" ? true : m.status === f).length})
          </button>
        ))}
        <button onClick={fetchMentors} style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12, color: dark ? "#94a3b8" : "#64748b" }}>🔄 Refresh</button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: 40 }}>📭</p>
          <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8" }}>No {filter} mentors. Click "➕ Add Mentor" to add one!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(mentor => (
            <div key={mentor.id} style={{ background: dark ? "rgba(255,255,255,0.03)" : "#fff", border: `1.5px solid ${mentor.status === "pending" ? "rgba(245,158,11,0.3)" : "rgba(52,211,153,0.3)"}`, borderLeft: `4px solid ${mentor.status === "pending" ? "#f59e0b" : "#34d399"}`, borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${mentor.gradientFrom || "#38bdf8"},${mentor.gradientTo || "#818cf8"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                    {mentor.imageUrl ? <img src={mentor.imageUrl} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : mentor.emoji || "🎓"}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 2px" }}>{mentor.name}</h3>
                    <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: "#38bdf8", margin: "0 0 2px" }}>{mentor.college}</p>
                    {mentor.institution && <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", margin: 0 }}>{mentor.institution}</p>}
                  </div>
                </div>
                <span style={{ background: mentor.status === "pending" ? "rgba(245,158,11,0.15)" : "rgba(52,211,153,0.15)", color: mentor.status === "pending" ? "#f59e0b" : "#34d399", border: `1px solid ${mentor.status === "pending" ? "rgba(245,158,11,0.3)" : "rgba(52,211,153,0.3)"}`, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
                  {mentor.status === "pending" ? "⏳ Pending" : "✅ Approved"}
                </span>
              </div>

              {mentor.interests?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "12px 0" }}>
                  {mentor.interests.map(i => (
                    <span key={i} style={{ background: "#38bdf812", color: "#38bdf8", border: "1px solid #38bdf822", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{i}</span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                {mentor.status === "pending" && (
                  <button onClick={() => approve(mentor.id)} style={{ padding: "7px 18px", background: "linear-gradient(135deg,#34d399,#10b981)", color: "#fff", border: "none", borderRadius: 20, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12 }}>✅ Approve</button>
                )}
                <button onClick={() => setConfirmId(mentor.id)} style={{ padding: "7px 18px", background: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 20, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12 }}>
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
