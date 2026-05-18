// ─────────────────────────────────────────────────────────────
//  src/components/Notifications.jsx
//  In-app + Browser Push notification system
//  Admin and mentors can post, all users receive
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { sendAnnouncementEmail } from "../utils/sendEmail.js";
import { db } from "../config/firebase.js";
import {
  collection, addDoc, getDocs, query, orderBy,
  limit, serverTimestamp, onSnapshot
} from "firebase/firestore";

const NOTIFICATION_TYPES = {
  scholarship: { icon: "🏆", color: "#38bdf8", label: "Scholarship" },
  exam:        { icon: "📝", color: "#f59e0b", label: "Exam Deadline" },
  mentor:      { icon: "🎓", color: "#818cf8", label: "New Mentor" },
  announcement:{ icon: "📢", color: "#34d399", label: "Announcement" },
};

// ── Hook: useNotifications ────────────────────────────────────
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(items);

      // Count unread — compare with last seen timestamp in localStorage
      const lastSeen = parseInt(localStorage.getItem("ddd-notif-seen") || "0");
      const unreadCount = items.filter(n => {
        const ts = n.createdAt?.toMillis?.() || 0;
        return ts > lastSeen;
      }).length;
      setUnread(unreadCount);
    });

    return () => unsub();
  }, []);

  const markAllRead = () => {
    localStorage.setItem("ddd-notif-seen", Date.now().toString());
    setUnread(0);
  };

  return { notifications, unread, markAllRead };
}

// ── Component: NotificationBell ───────────────────────────────
export function NotificationBell({ dark, user, unread, notifications, onMarkRead }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
    if (!open) onMarkRead();
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={toggle}
        style={{
          background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
          border: "none",
          borderRadius: 10,
          padding: "7px 10px",
          cursor: "pointer",
          fontSize: 18,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute",
            top: 2, right: 2,
            background: "#ef4444",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            fontFamily: "'Syne',sans-serif",
            borderRadius: "50%",
            width: 16, height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 199 }}
          />
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 320,
            maxHeight: 420,
            overflowY: "auto",
            background: dark ? "#0f172a" : "#fff",
            border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 16,
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            zIndex: 200,
          }}>
            <div style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: dark ? "#f1f5f9" : "#0f172a" }}>
                🔔 Notifications
              </span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, color: "#38bdf8", fontWeight: 600 }}>
                {notifications.length} total
              </span>
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: "32px 18px", textAlign: "center" }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>🔕</p>
                <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 13 }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map(n => {
                const type = NOTIFICATION_TYPES[n.type] || NOTIFICATION_TYPES.announcement;
                const time = n.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) || "";
                return (
                  <div key={n.id} style={{
                    padding: "14px 18px",
                    borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}>
                    <span style={{
                      fontSize: 20,
                      flexShrink: 0,
                      width: 36, height: 36,
                      borderRadius: 10,
                      background: type.color + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {type.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: type.color }}>
                          {type.label}
                        </span>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: dark ? "#475569" : "#94a3b8" }}>
                          {time}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, color: dark ? "#e2e8f0" : "#1e293b", margin: "0 0 3px" }}>
                        {n.title}
                      </p>
                      <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                        {n.message}
                      </p>
                      {n.link && (
                        <a href={n.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#38bdf8", fontFamily: "'Syne',sans-serif", fontWeight: 600, textDecoration: "none" }}>
                          Learn more →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Component: PostNotification (Admin + Mentor panel) ────────
export function PostNotification({ dark, user }) {
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState({ type: "announcement", title: "", message: "", link: "" });
  const [status, setStatus]       = useState("idle");
  const [sendEmail, setSendEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(""); // e.g. "Emailed 12/15 users"

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setStatus("sending");
    setEmailStatus("");

    try {
      // 1. Save to Firestore (in-app notification)
      await addDoc(collection(db, "notifications"), {
        ...form,
        postedBy:  user?.contact || "admin",
        createdAt: serverTimestamp(),
        emailSent: sendEmail,
      });

      // 2. Browser push notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(form.title, { body: form.message, icon: "/favicon.ico" });
      }

      // 3. Send emails to all users if checked
      if (sendEmail) {
        setEmailStatus("Fetching users...");
        try {
          const snap   = await getDocs(collection(db, "users"));
          const emails = snap.docs
            .map(d => d.data().email)
            .filter(Boolean);

          let sent = 0;
          let failed = 0;

          for (const email of emails) {
            try {
              await sendAnnouncementEmail({
                to_email: email,
                title:    form.title,
                message:  form.message,
                link:     form.link || "https://jayaramnaik.github.io/ddd-community/",
                type:     form.type,
              });
              sent++;
              setEmailStatus(`Emailing users... ${sent}/${emails.length}`);
              // Small delay to avoid rate limiting
              await new Promise(r => setTimeout(r, 300));
            } catch (err) {
              console.warn(`Failed to email ${email}:`, err);
              failed++;
            }
          }

          setEmailStatus(`✅ Emailed ${sent} users${failed > 0 ? ` (${failed} failed)` : ""}`);
        } catch (err) {
          console.error("Failed to fetch users for email:", err);
          setEmailStatus("⚠️ Could not fetch users for email");
        }
      }

      setStatus("success");
      setForm({ type: "announcement", title: "", message: "", link: "" });
      setSendEmail(false);
      setTimeout(() => { setStatus("idle"); setOpen(false); setEmailStatus(""); }, 2500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputStyle = {
    background:   dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    border:       `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 10, padding: "10px 14px", width: "100%",
    color:        dark ? "#f1f5f9" : "#0f172a",
    fontSize:     13, fontFamily: "'Lora',serif",
    outline:      "none", boxSizing: "border-box",
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "linear-gradient(135deg,#38bdf8,#818cf8)",
          color: "#fff", border: "none", borderRadius: 12,
          padding: "10px 20px", cursor: "pointer",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13,
        }}
      >
        📢 Post Notification
      </button>

      {open && (
        <div style={{
          marginTop: 16,
          background: dark ? "rgba(255,255,255,0.03)" : "#fff",
          border:     `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 16, padding: "24px",
        }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 18px" }}>
            New Notification
          </h3>

          {/* Type selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {Object.entries(NOTIFICATION_TYPES).map(([key, val]) => (
              <button key={key} onClick={() => handle("type", key)} style={{
                background:  form.type === key ? val.color : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                color:       form.type === key ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
                border:      "none", borderRadius: 20, padding: "6px 14px",
                cursor:      "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12,
              }}>
                {val.icon} {val.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="text" placeholder="Title *" value={form.title}
              onChange={e => handle("title", e.target.value)} style={inputStyle} />
            <textarea placeholder="Message *" value={form.message}
              onChange={e => handle("message", e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
            <input type="url" placeholder="Link (optional) — e.g. scholarship URL"
              value={form.link} onChange={e => handle("link", e.target.value)} style={inputStyle} />
          </div>

          {/* ── Email toggle ── */}
          <div
            onClick={() => setSendEmail(!sendEmail)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              marginTop: 16, padding: "14px 16px", borderRadius: 12, cursor: "pointer",
              background: sendEmail
                ? (dark ? "rgba(52,211,153,0.1)" : "rgba(52,211,153,0.08)")
                : (dark ? "rgba(255,255,255,0.03)" : "#f8fafc"),
              border: `1.5px solid ${sendEmail ? "rgba(52,211,153,0.4)" : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)")}`,
              transition: "all 0.2s",
            }}
          >
            {/* Toggle switch */}
            <div style={{
              width: 44, height: 24, borderRadius: 12, flexShrink: 0,
              background: sendEmail ? "#34d399" : (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"),
              position: "relative", transition: "background 0.3s",
            }}>
              <div style={{
                position: "absolute", top: 3,
                left: sendEmail ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%",
                background: "#fff", transition: "left 0.3s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: sendEmail ? "#34d399" : (dark ? "#94a3b8" : "#64748b") }}>
                📧 Also send email to all users
              </div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 11, color: dark ? "#475569" : "#94a3b8", marginTop: 2 }}>
                {sendEmail
                  ? "Will send this announcement to all registered emails"
                  : "Only posts in-app notification (no email)"}
              </div>
            </div>
          </div>

          {/* Email send status */}
          {emailStatus && (
            <div style={{
              marginTop: 10, padding: "10px 14px", borderRadius: 10,
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)",
              fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12, color: "#34d399",
            }}>
              {emailStatus}
            </div>
          )}

          {status === "error" && (
            <p style={{ color: "#ef4444", fontSize: 12, fontFamily: "'Lora',serif", marginTop: 10 }}>
              Failed to post. Try again.
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => setOpen(false)} style={{
              flex: 1, background: "transparent",
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 10, padding: "10px", cursor: "pointer",
              fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13,
              color: dark ? "#94a3b8" : "#64748b",
            }}>Cancel</button>
            <button onClick={submit} disabled={status === "sending"} style={{
              flex: 2,
              background: status === "success" ? "#34d399" : "linear-gradient(135deg,#38bdf8,#818cf8)",
              color: "#fff", border: "none", borderRadius: 10, padding: "10px",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13,
            }}>
              {status === "sending"
                ? (sendEmail ? "📧 Posting & emailing..." : "Posting...")
                : status === "success" ? "✓ Done!"
                : sendEmail ? "📢 Post + Email All" : "Post Notification"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ── Component: PushPermissionBanner ──────────────────────────
export function PushPermissionBanner({ dark }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      const dismissed = localStorage.getItem("ddd-push-dismissed");
      if (!dismissed) setShow(true);
    }
  }, []);

  const requestPermission = async () => {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      new Notification("DDD Community", {
        body: "You'll now receive updates on scholarships and exam deadlines!",
        icon: "/favicon.ico",
      });
    }
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem("ddd-push-dismissed", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(90vw, 460px)",
      background: dark ? "#0f172a" : "#fff",
      border: "1.5px solid rgba(56,189,248,0.3)",
      borderRadius: 16,
      padding: "16px 20px",
      boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>🔔</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 3px" }}>
          Stay updated!
        </p>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", margin: 0 }}>
          Get notified about new scholarships and exam deadlines.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={dismiss}
          style={{ background: "transparent", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12, color: dark ? "#64748b" : "#94a3b8" }}
        >
          Later
        </button>
        <button
          onClick={requestPermission}
          style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12 }}
        >
          Allow
        </button>
      </div>
    </div>
  );
}
