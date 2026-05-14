// ─────────────────────────────────────────────────────────────
//  src/components/AdminDashboard.jsx
//  Hidden admin panel — only accessible to admin role
//  Route: triggered by page === "admin-dashboard" in App.jsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../config/firebase.js";

const TABS = ["👥 Users", "📋 Visitors", "⚙️ Settings"];

// ── Confirm Dialog ────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel, dark }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: dark ? "#0f172a" : "#fff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 20, padding: "36px 32px",
        maxWidth: 420, width: "100%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
        <p style={{
          fontFamily: "'Lora',serif", fontSize: 16,
          color: dark ? "#e2e8f0" : "#1e293b",
          lineHeight: 1.7, margin: "0 0 28px",
        }}>{message}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "11px 28px", borderRadius: 12, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              background: "transparent", color: dark ? "#94a3b8" : "#64748b",
              fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              padding: "11px 28px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function AdminDashboard({ dark, user, onBack, visitorLog }) {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [confirm, setConfirm]     = useState(null); // { message, onConfirm }
  const [toast, setToast]         = useState("");
  const [siteSettings, setSiteSettings] = useState({
    maintenanceMode: false,
    allowNewUsers: true,
    siteTagline: "Dream • Decide • Dominate",
  });

  // ── Load users from Firestore ──
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err) {
      console.error("Error fetching users:", err);
      showToast("❌ Failed to load users");
    }
    setLoading(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const askConfirm = (message, onConfirm) => setConfirm({ message, onConfirm });

  // ── Ban / Unban ──
  const toggleBan = async (u) => {
    const action = u.banned ? "unban" : "ban";
    askConfirm(
      `Are you sure you want to ${action} ${u.email}?`,
      async () => {
        setConfirm(null);
        try {
          await updateDoc(doc(db, "users", u.id), { banned: !u.banned });
          setUsers(prev => prev.map(x => x.id === u.id ? { ...x, banned: !x.banned } : x));
          showToast(`✅ User ${action}ned successfully`);
        } catch (err) {
          showToast("❌ Failed to update user");
        }
      }
    );
  };

  // ── Delete user ──
  const deleteUser = async (u) => {
    askConfirm(
      `Permanently delete ${u.email}? This cannot be undone.`,
      async () => {
        setConfirm(null);
        try {
          await deleteDoc(doc(db, "users", u.id));
          setUsers(prev => prev.filter(x => x.id !== u.id));
          showToast("✅ User deleted");
        } catch (err) {
          showToast("❌ Failed to delete user");
        }
      }
    );
  };

  // ── Promote to admin ──
  const toggleAdmin = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    askConfirm(
      `Make ${u.email} a ${newRole}?`,
      async () => {
        setConfirm(null);
        try {
          await updateDoc(doc(db, "users", u.id), { role: newRole });
          setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
          showToast(`✅ Role updated to ${newRole}`);
        } catch (err) {
          showToast("❌ Failed to update role");
        }
      }
    );
  };

  const cardStyle = {
    background: dark ? "rgba(255,255,255,0.03)" : "#fff",
    border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
    borderRadius: 16, padding: "20px 22px",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: dark ? "#020818" : "#f8fafc",
      paddingTop: 48,
      fontFamily: "'Syne',sans-serif",
    }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: dark ? "#0f172a" : "#1e293b",
          color: "#fff", padding: "12px 28px", borderRadius: 40,
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", zIndex: 9998,
          border: "1px solid rgba(56,189,248,0.3)",
        }}>
          {toast}
        </div>
      )}

      {/* ── Confirm Dialog ── */}
      {confirm && (
        <ConfirmDialog
          dark={dark}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg,#38bdf822,#818cf822)",
              border: "1px solid #38bdf833", borderRadius: 40,
              padding: "5px 16px", fontSize: 11, fontWeight: 700,
              color: "#38bdf8", letterSpacing: "0.14em", textTransform: "uppercase",
              marginBottom: 12,
            }}>
              🔐 Admin Only
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display',serif", fontWeight: 900,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              color: dark ? "#f1f5f9" : "#0f172a", margin: 0,
            }}>
              Admin Dashboard
            </h1>
            <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", margin: "8px 0 0", fontSize: 14 }}>
              Logged in as <span style={{ color: "#38bdf8", fontWeight: 700 }}>{user.contact}</span>
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              padding: "10px 22px", borderRadius: 12,
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              background: "transparent", color: dark ? "#94a3b8" : "#64748b",
              fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            ← Back to Site
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 36 }}>
          {[
            { label: "Total Users", value: users.length, color: "#38bdf8", icon: "👥" },
            { label: "Banned", value: users.filter(u => u.banned).length, color: "#ef4444", icon: "🚫" },
            { label: "Admins", value: users.filter(u => u.role === "admin").length, color: "#818cf8", icon: "🔐" },
            { label: "Visitors (session)", value: visitorLog.length, color: "#34d399", icon: "👁️" },
          ].map(s => (
            <div key={s.label} style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "10px 22px", borderRadius: 12,
                border: `1.5px solid ${activeTab === i ? "transparent" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
                background: activeTab === i ? "linear-gradient(135deg,#38bdf8,#818cf8)" : (dark ? "rgba(255,255,255,0.04)" : "#fff"),
                color: activeTab === i ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13,
                cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >{tab}</button>
          ))}
        </div>

        {/* ══ TAB 0: USERS ══ */}
        {activeTab === 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "1.4rem", color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
                User Management
              </h2>
              <button
                onClick={fetchUsers}
                style={{
                  padding: "8px 18px", borderRadius: 10,
                  border: "1px solid rgba(56,189,248,0.3)",
                  background: "transparent", color: "#38bdf8",
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}
              >🔄 Refresh</button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: dark ? "#64748b" : "#94a3b8", fontFamily: "'Lora',serif" }}>
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8" }}>
                  No users found in Firestore yet.<br />
                  Users are saved when they log in.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {users.map(u => (
                  <div key={u.id} style={{
                    ...cardStyle,
                    display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                    opacity: u.banned ? 0.65 : 1,
                    borderLeft: `3px solid ${u.role === "admin" ? "#818cf8" : u.banned ? "#ef4444" : "transparent"}`,
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                      background: u.role === "admin"
                        ? "linear-gradient(135deg,#818cf8,#38bdf8)"
                        : "linear-gradient(135deg,#38bdf8,#34d399)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "'Syne',sans-serif",
                    }}>
                      {u.email?.[0]?.toUpperCase() || "?"}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: dark ? "#f1f5f9" : "#0f172a" }}>
                        {u.email}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 11, padding: "2px 10px", borderRadius: 20, fontWeight: 700,
                          background: u.role === "admin" ? "rgba(129,140,248,0.15)" : "rgba(56,189,248,0.1)",
                          color: u.role === "admin" ? "#818cf8" : "#38bdf8",
                          border: `1px solid ${u.role === "admin" ? "rgba(129,140,248,0.3)" : "rgba(56,189,248,0.2)"}`,
                        }}>
                          {u.role === "admin" ? "🔐 Admin" : "👤 User"}
                        </span>
                        {u.banned && (
                          <span style={{
                            fontSize: 11, padding: "2px 10px", borderRadius: 20, fontWeight: 700,
                            background: "rgba(239,68,68,0.15)", color: "#ef4444",
                            border: "1px solid rgba(239,68,68,0.3)",
                          }}>🚫 Banned</span>
                        )}
                        <span style={{ fontSize: 11, color: dark ? "#475569" : "#94a3b8", fontFamily: "'Lora',serif" }}>
                          {u.createdAt?.toDate?.()?.toLocaleDateString?.() || "Unknown date"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                      {u.role !== "admin" && (
                        <button
                          onClick={() => toggleBan(u)}
                          style={{
                            padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                            background: u.banned ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.12)",
                            color: u.banned ? "#34d399" : "#ef4444",
                            fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12,
                          }}
                        >{u.banned ? "✅ Unban" : "🚫 Ban"}</button>
                      )}
                      <button
                        onClick={() => toggleAdmin(u)}
                        style={{
                          padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                          background: "rgba(129,140,248,0.12)", color: "#818cf8",
                          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12,
                        }}
                      >{u.role === "admin" ? "⬇️ Demote" : "⬆️ Make Admin"}</button>
                      {u.email !== user.contact && (
                        <button
                          onClick={() => deleteUser(u)}
                          style={{
                            padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                            background: "rgba(239,68,68,0.1)", color: "#ef4444",
                            fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12,
                          }}
                        >🗑️ Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB 1: VISITORS ══ */}
        {activeTab === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "1.4rem", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 20px" }}>
              Visitor Log (This Session)
            </h2>
            {visitorLog.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👁️</div>
                <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8" }}>No visitors logged yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[...visitorLog].reverse().map((v, i) => (
                  <div key={i} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 900, color: "#fff",
                    }}>
                      {v.displayName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: dark ? "#f1f5f9" : "#0f172a" }}>
                        {v.contact}
                      </div>
                      <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", marginTop: 2 }}>
                        {v.method} · {v.time}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: "3px 12px", borderRadius: 20, fontWeight: 700,
                      background: "rgba(52,211,153,0.1)", color: "#34d399",
                      border: "1px solid rgba(52,211,153,0.2)",
                    }}>✅ Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB 2: SETTINGS ══ */}
        {activeTab === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "1.4rem", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 20px" }}>
              Site Settings
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Tagline */}
              <div style={cardStyle}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>
                  🏷️ Site Tagline
                </div>
                <input
                  value={siteSettings.siteTagline}
                  onChange={e => setSiteSettings(s => ({ ...s, siteTagline: e.target.value }))}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10,
                    border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                    color: dark ? "#f1f5f9" : "#0f172a",
                    fontFamily: "'Lora',serif", fontSize: 14, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Toggles */}
              {[
                { key: "maintenanceMode", label: "🔧 Maintenance Mode", desc: "Show maintenance notice to regular users", danger: true },
                { key: "allowNewUsers", label: "🚪 Allow New Signups", desc: "Let new users sign in to the platform" },
              ].map(setting => (
                <div key={setting.key} style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: setting.danger && siteSettings[setting.key] ? "#ef4444" : (dark ? "#f1f5f9" : "#0f172a") }}>
                      {setting.label}
                    </div>
                    <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", marginTop: 4 }}>
                      {setting.desc}
                    </div>
                  </div>
                  <div
                    onClick={() => setSiteSettings(s => ({ ...s, [setting.key]: !s[setting.key] }))}
                    style={{
                      width: 52, height: 28, borderRadius: 14, cursor: "pointer",
                      background: siteSettings[setting.key]
                        ? (setting.danger ? "#ef4444" : "#38bdf8")
                        : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
                      position: "relative", transition: "all 0.3s", flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 4,
                      left: siteSettings[setting.key] ? 28 : 4,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#fff", transition: "left 0.3s",
                    }} />
                  </div>
                </div>
              ))}

              {/* Save button */}
              <button
                onClick={() => showToast("✅ Settings saved (UI only — wire to Firestore if needed)")}
                style={{
                  padding: "13px 24px", borderRadius: 14, border: "none",
                  background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                  color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700,
                  fontSize: 14, cursor: "pointer",
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
