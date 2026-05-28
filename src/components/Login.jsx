// ─────────────────────────────────────────────────────────────
//  src/components/Login.jsx  —  Saffron & Earth Theme
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { sendOtpEmail, sendVisitorNotification } from "../utils/sendEmail.js";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RECEIVER_EMAIL } from "../config/emailjs.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLogin, dark }) {
  const [contact, setContact]           = useState("");
  const [otp, setOtp]                   = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [password, setPassword]         = useState("");
  const [step, setStep]                 = useState("input");
  const [status, setStatus]             = useState("");
  const [error, setError]               = useState("");
  const [isSending, setIsSending]       = useState(false);
  const isAdminEmail = contact.trim().toLowerCase() === RECEIVER_EMAIL.toLowerCase();

  const sendOtp = async () => {
    setError("");
    if (!emailRegex.test(contact.trim())) { setError("Please enter a valid email address."); return; }
    const email = contact.trim();
    const docId = email.replace(/\./g, "_");
    const isAdmin = isAdminEmail;

    if (isAdmin) {
      if (!password.trim()) { setError("Enter the admin password."); return; }
      setIsSending(true);
      setStatus("Signing in admin...");
      try {
        await signInWithEmailAndPassword(auth, email, password);
        const ref = doc(db, "users", docId);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) {
          await setDoc(ref, { email, role: "admin", banned: false, createdAt: serverTimestamp(), lastLogin: serverTimestamp() });
        } else {
          const data = snapshot.data();
          if (data.banned) { setError("Your account has been suspended. Please contact the admin."); return; }
          await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true });
        }
        const visitor = { contact: email, method: "Admin login", displayName: email, time: new Date().toLocaleString("en-IN"), role: "admin" };
        try { await sendVisitorNotification(visitor); } catch (err) { console.warn(err); }
        onLogin(visitor);
        return;
      } catch (err) {
        console.error("Admin sign-in failed:", err);
        setError("Admin sign-in failed. Check email/password.");
      } finally {
        setIsSending(false);
      }
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setIsSending(true); setStatus("Sending OTP to your inbox...");
    try {
      await sendOtpEmail(email, code);
      setGeneratedOtp({ code, timestamp: Date.now() });
      setStep("verify");
      setStatus(`OTP sent to ${email}. Check your inbox within 5 minutes.`);
    } catch (err) {
      console.error(err); setError("Unable to send OTP. Please try again later.");
    } finally { setIsSending(false); }
  };

  const verifyOtp = async () => {
    setError("");
    if (!generatedOtp) { setError("No OTP sent. Please request a new one."); return; }
    if (otp.trim() !== generatedOtp.code) { setError("Incorrect OTP. Please try again."); return; }
    if (Date.now() - generatedOtp.timestamp > 5 * 60 * 1000) { setError("OTP expired. Please request a new one."); return; }

    const email = contact.trim();
    const docId = email.replace(/\./g, "_");
    const isAdmin = email === RECEIVER_EMAIL;

    try {
      const ref = doc(db, "users", docId);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) {
        await setDoc(ref, { email, role: isAdmin ? "admin" : "user", banned: false, createdAt: serverTimestamp(), lastLogin: serverTimestamp() });
      } else {
        const data = snapshot.data();
        if (data.banned) { setError("Your account has been suspended. Please contact the admin."); return; }
        await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true });
      }
    } catch (err) { console.warn("Firestore user save failed:", err); }

    const visitor = { contact: email, method: "Email OTP", displayName: email, time: new Date().toLocaleString("en-IN"), role: isAdmin ? "admin" : "user" };
    try { await sendVisitorNotification(visitor); } catch (err) { console.warn(err); }
    onLogin(visitor);
  };

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      background: dark ? "linear-gradient(135deg,#1a0e00 0%,#2d1a00 100%)" : "linear-gradient(135deg,#fefce8 0%,#fef3c7 100%)",
    }}>
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(217,119,6,0.12) 0%,transparent 70%)", top: "-10%", left: "-10%", pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)", bottom: "0%", right: "-5%", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: 480, position: "relative", zIndex: 2,
        background: dark ? "rgba(26,14,0,0.95)" : "rgba(255,251,235,0.95)",
        borderRadius: 24, border: "1px solid rgba(217,119,6,0.25)",
        padding: "40px 32px",
        boxShadow: dark ? "0 32px 90px rgba(0,0,0,0.45)" : "0 24px 80px rgba(217,119,6,0.12)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#d97706", marginBottom: 10, fontFamily: "'Syne',sans-serif" }}>
            Dream • Decide • Dominate
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", margin: "0 0 12px", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: dark ? "#f5e6c8" : "#78350f", lineHeight: 1.2 }}>
            Welcome Back
          </h1>
          <p style={{ color: dark ? "#92683a" : "#92400e", fontSize: 14, lineHeight: 1.7, margin: 0, fontFamily: "'Lora',serif" }}>
            Enter your email to receive a one-time password and sign in.
          </p>
        </div>

        <label style={{ display: "block", marginBottom: 8, color: dark ? "#92683a" : "#92400e", fontSize: 13, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>📧 Email Address</label>
        <input type="email" value={contact} onChange={e => setContact(e.target.value)}
          onKeyDown={e => e.key === "Enter" && step === "input" && sendOtp()}
          placeholder="you@example.com" disabled={step === "verify"}
          style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${step === "verify" ? "rgba(217,119,6,0.4)" : "rgba(217,119,6,0.25)"}`, background: dark ? "rgba(217,119,6,0.05)" : "rgba(255,251,235,0.8)", color: dark ? "#f5e6c8" : "#78350f", marginBottom: 18, fontSize: 14, fontFamily: "'Lora',serif", outline: "none", boxSizing: "border-box", opacity: step === "verify" ? 0.7 : 1 }}
        />

        {isAdminEmail && step === "input" && (
          <>
            <label style={{ display: "block", marginBottom: 8, color: dark ? "#92683a" : "#92400e", fontSize: 13, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>🔒 Admin Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendOtp()}
              placeholder="Enter admin password"
              style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid rgba(217,119,6,0.25)", background: dark ? "rgba(217,119,6,0.05)" : "rgba(255,251,235,0.8)", color: dark ? "#f5e6c8" : "#78350f", marginBottom: 18, fontSize: 14, fontFamily: "'Lora',serif", outline: "none", boxSizing: "border-box" }}
            />
          </>
        )}

        {step === "verify" && (
          <>
            <label style={{ display: "block", marginBottom: 8, color: dark ? "#92683a" : "#92400e", fontSize: 13, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>🔐 Enter OTP</label>
            <input type="text" value={otp} maxLength={6}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && verifyOtp()}
              placeholder="6-digit code" autoFocus
              style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid rgba(217,119,6,0.5)", background: dark ? "rgba(217,119,6,0.08)" : "rgba(217,119,6,0.06)", color: dark ? "#f5e6c8" : "#78350f", marginBottom: 18, fontSize: 22, fontWeight: 700, letterSpacing: 8, textAlign: "center", outline: "none", boxSizing: "border-box", fontFamily: "'Syne',sans-serif" }}
            />
          </>
        )}

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#f87171", marginBottom: 14, fontSize: 13, fontFamily: "'Lora',serif" }}>⚠️ {error}</div>}
        {status && <div style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: 10, padding: "10px 14px", color: "#d97706", marginBottom: 14, fontSize: 13, fontFamily: "'Lora',serif" }}>✅ {status}</div>}

        <button onClick={step === "input" ? sendOtp : verifyOtp} disabled={step === "input" && isSending}
          style={{ width: "100%", padding: "14px 18px", borderRadius: 14, border: "none", background: step === "input" && isSending ? "rgba(217,119,6,0.4)" : "linear-gradient(135deg,#d97706,#b45309)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: step === "input" && isSending ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: "0.02em", transition: "opacity 0.2s", boxShadow: "0 4px 20px rgba(217,119,6,0.3)" }}
          onMouseEnter={e => { if (!(step === "input" && isSending)) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          {step === "input"
            ? (isAdminEmail ? (isSending ? "⏳ Signing in..." : "Admin Sign In") : (isSending ? "⏳ Sending OTP..." : "Send OTP →"))
            : "✓ Verify & Sign In"
          }
        </button>

        {step === "verify" && (
          <button onClick={() => { setStep("input"); setContact(""); setOtp(""); setGeneratedOtp(null); setStatus(""); setError(""); }}
            style={{ width: "100%", marginTop: 10, padding: "12px 18px", borderRadius: 14, border: "1px solid rgba(217,119,6,0.25)", background: "transparent", color: dark ? "#92683a" : "#92400e", fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600 }}
          >← Change Email</button>
        )}

        <p style={{ marginTop: 24, fontSize: 12, lineHeight: 1.7, color: dark ? "#4a3520" : "#c9a96a", textAlign: "center", fontFamily: "'Lora',serif" }}>
          OTP is sent via EmailJS. Valid for 5 minutes.<br />Your data is safe and never shared.
        </p>
      </div>
    </main>
  );
}
