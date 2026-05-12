// ─────────────────────────────────────────────────────────────
//  src/components/AdminMentors.jsx
//  Admin panel — approve/reject mentor applications
//  Only visible to RECEIVER_EMAIL (site owner)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { db } from "../config/firebase.js";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function AdminMentors({ dark }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending | approved | all

  useEffect(() => { fetchMentors(); }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "mentors"), orderBy("createdAt", "desc")));
      setMentors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await updateDoc(doc(db, "mentors", id), { status: "approved" });
    setMentors(m => m.map(x => x.id === id ? { ...x, status: "approved" } : x));
  };

  const reject = async (id) => {
    await deleteDoc(doc(db, "mentors", id));
    setMentors(m => m.filter(x => x.id !== id));
  };

  const filtered = mentors.filter(m => filter === "all" ? true : m.status === filter);

  return (
    <div style={{ padding: "40px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>
        👑 Mentor Applications
      </h2>
      <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 14, marginBottom: 24 }}>
        Review and approve new mentor registrations.
      </p>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["pending", "approved", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? "linear-gradient(135deg,#38bdf8,#818cf8)" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
            color: filter === f ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
            border: "none", borderRadius: 10, padding: "8px 18px",
            cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12,
            textTransform: "capitalize",
          }}>
            {f} ({mentors.filter(m => f === "all" ? true : m.status === f).length})
          </button>
        ))}
        <button onClick={fetchMentors} style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12, color: dark ? "#94a3b8" : "#64748b" }}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: 40 }}>📭</p>
          <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8" }}>No {filter} applications.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(mentor => (
            <div key={mentor.id} style={{
              background: dark ? "rgba(255,255,255,0.03)" : "#fff",
              border: `1.5px solid ${mentor.status === "pending" ? "rgba(245,158,11,0.3)" : "rgba(52,211,153,0.3)"}`,
              borderLeft: `4px solid ${mentor.status === "pending" ? "#f59e0b" : "#34d399"}`,
              borderRadius: 16, padding: "20px 22px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 36 }}>{mentor.emoji || "🎓"}</span>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 2px" }}>{mentor.name}</h3>
                    <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", margin: "0 0 2px" }}>{mentor.email}</p>
                    <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#94a3b8" : "#64748b", margin: 0 }}>{mentor.stream} · {mentor.college === "Other" ? mentor.institution : mentor.college}</p>
                  </div>
                </div>
                <span style={{
                  background: mentor.status === "pending" ? "rgba(245,158,11,0.15)" : "rgba(52,211,153,0.15)",
                  color: mentor.status === "pending" ? "#f59e0b" : "#34d399",
                  border: `1px solid ${mentor.status === "pending" ? "rgba(245,158,11,0.3)" : "rgba(52,211,153,0.3)"}`,
                  padding: "4px 12px", borderRadius: 20, fontSize: 11,
                  fontFamily: "'Syne',sans-serif", fontWeight: 700,
                }}>
                  {mentor.status === "pending" ? "⏳ Pending" : "✅ Approved"}
                </span>
              </div>

              {mentor.bio && (
                <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: dark ? "#94a3b8" : "#64748b", margin: "12px 0", lineHeight: 1.6 }}>
                  {mentor.bio}
                </p>
              )}

              {mentor.interests?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {mentor.interests.map(i => (
                    <span key={i} style={{ background: "#38bdf812", color: "#38bdf8", border: "1px solid #38bdf822", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{i}</span>
                  ))}
                </div>
              )}

              {mentor.status === "pending" && (
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={() => approve(mentor.id)} style={{ flex: 1, background: "linear-gradient(135deg,#34d399,#10b981)", color: "#fff", border: "none", borderRadius: 10, padding: "10px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 }}>
                    ✅ Approve
                  </button>
                  <button onClick={() => reject(mentor.id)} style={{ flex: 1, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 }}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
