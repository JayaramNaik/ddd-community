import { useState } from "react";
import { sendOtpEmail, sendVisitorNotification } from "../utils/sendEmail.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10,15}$/;

export default function Login({ onLogin, dark }) {
  const [mode, setMode] = useState("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null); // { code: string, timestamp: number }
  const [step, setStep] = useState("input");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const validateContact = () => {
    if (mode === "email") {
      return emailRegex.test(contact.trim());
    }
    return phoneRegex.test(contact.trim());
  };

  const sendOtp = async () => {
    setError("");
    if (!validateContact()) {
      setError(mode === "email" ? "Please enter a valid email address." : "Please enter a valid mobile number.");
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));

    if (mode === "email") {
      setIsSending(true);
      setStatus("Sending OTP to your inbox...");
      try {
        await sendOtpEmail(contact.trim(), code);
        setGeneratedOtp({ code, timestamp: Date.now() });
        setStep("verify");
        setStatus(`OTP sent to ${contact.trim()}. Check your inbox and enter the 6-digit code within 5 minutes.`);
      } catch (err) {
        console.error("OTP email error:", err);
        setError("Unable to send OTP email right now. Please try again later.");
      } finally {
        setIsSending(false);
      }
      return;
    }

    setGeneratedOtp({ code, timestamp: Date.now() });
    setStep("verify");
    setStatus(`OTP sent to ${contact.trim()}. Please enter the 6-digit code within 5 minutes.`);
    console.log("Demo OTP:", code);
  };

  const verifyOtp = async () => {
    setError("");
    if (!generatedOtp) {
      setError("No OTP sent. Please request a new one.");
      return;
    }
    if (otp.trim() !== generatedOtp.code) {
      setError("Incorrect OTP. Please try again.");
      return;
    }
    const elapsed = Date.now() - generatedOtp.timestamp;
    if (elapsed > 5 * 60 * 1000) { // 5 minutes
      setError("OTP has expired. Please request a new one.");
      return;
    }

    const visitor = {
      contact: contact.trim(),
      method: mode === "email" ? "Email OTP" : "Mobile OTP (simulated)",
      displayName: mode === "email" ? contact.trim() : `+${contact.trim()}`,
      time: new Date().toLocaleString("en-IN"),
    };

    try {
      await sendVisitorNotification(visitor);
    } catch (err) {
      console.warn("Visitor notification failed:", err);
    }

    onLogin(visitor);
  };

  const handleModeChange = selectedMode => {
    setMode(selectedMode);
    setContact("");
    setOtp("");
    setGeneratedOtp(null);
    setStep("input");
    setStatus("");
    setError("");
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", background: dark ? "#020818" : "#f8fafc" }}>
      <div style={{ width: "100%", maxWidth: 520, background: dark ? "rgba(7,14,35,0.96)" : "#fff", borderRadius: 24, border: dark ? "1px solid rgba(56,189,248,0.15)" : "1px solid rgba(15,23,42,0.08)", padding: "38px 34px", boxShadow: dark ? "0 32px 90px rgba(0,0,0,0.35)" : "0 24px 80px rgba(15,23,42,0.08)" }}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#38bdf8", marginBottom: 12, fontFamily: "'Syne',sans-serif" }}>
            Welcome back
          </div>
          <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)", margin: 0, fontFamily: "'Playfair Display',serif", color: dark ? "#f8fafc" : "#0f172a" }}>
            Login with OTP
          </h1>
          <p style={{ color: dark ? "#cbd5e1" : "#475569", marginTop: 14, lineHeight: 1.7 }}>
            Use your email address or mobile number to sign in quickly. OTP delivery is simulated here for demo.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          {[
            { key: "email", label: "Email" },
            { key: "mobile", label: "Mobile" },
          ].map(option => (
            <button
              key={option.key}
              onClick={() => handleModeChange(option.key)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 14,
                border: option.key === mode ? "2px solid #38bdf8" : "1px solid rgba(148,163,184,0.35)",
                background: option.key === mode ? (dark ? "rgba(56,189,248,0.16)" : "rgba(56,189,248,0.12)") : "transparent",
                color: dark ? "#f8fafc" : "#0f172a",
                cursor: "pointer",
                fontWeight: 700,
                fontFamily: "'Syne',sans-serif",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label style={{ display: "block", marginBottom: 10, color: dark ? "#cbd5e1" : "#475569", fontSize: 13, fontWeight: 700 }}>
          {mode === "email" ? "Email address" : "Mobile number"}
        </label>
        <input
          type={mode === "email" ? "email" : "tel"}
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder={mode === "email" ? "you@example.com" : "1234567890"}
          style={{ width: "100%", padding: "14px 16px", borderRadius: 16, border: "1px solid rgba(148,163,184,0.35)", background: dark ? "rgba(255,255,255,0.04)" : "#fff", color: dark ? "#f8fafc" : "#0f172a", marginBottom: 18, fontSize: 14 }}
        />

        {step === "verify" && (
          <>
            <label style={{ display: "block", marginBottom: 10, color: dark ? "#cbd5e1" : "#475569", fontSize: 13, fontWeight: 700 }}>
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              maxLength={6}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 16, border: "1px solid rgba(148,163,184,0.35)", background: dark ? "rgba(255,255,255,0.04)" : "#fff", color: dark ? "#f8fafc" : "#0f172a", marginBottom: 18, fontSize: 14 }}
            />
          </>
        )}

        {error && <div style={{ color: "#f87171", marginBottom: 14, fontSize: 13 }}>{error}</div>}
        {status && <div style={{ color: "#34d399", marginBottom: 18, fontSize: 13 }}>{status}</div>}

        <button
          onClick={step === "input" ? sendOtp : verifyOtp}
          disabled={step === "input" && isSending}
          style={{ width: "100%", padding: "14px 18px", borderRadius: 16, border: "none", background: step === "input" && isSending ? "rgba(56,189,248,0.45)" : "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: step === "input" && isSending ? "not-allowed" : "pointer" }}
        >
          {step === "input" ? (isSending ? "Sending OTP..." : "Send OTP") : "Verify OTP"}
        </button>

        {step === "verify" && (
          <button
            onClick={() => { setStep("input"); setContact(""); setOtp(""); setGeneratedOtp(null); setStatus(""); setError(""); }}
            style={{ width: "100%", marginTop: 12, padding: "12px 18px", borderRadius: 16, border: "1px solid rgba(148,163,184,0.35)", background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", color: dark ? "#f8fafc" : "#0f172a", fontSize: 14, cursor: "pointer" }}
          >
            Change {mode === "email" ? "Email" : "Mobile"}
          </button>
        )}

        <p style={{ marginTop: 24, fontSize: 13, lineHeight: 1.7, color: dark ? "#94a3b8" : "#64748b" }}>
          {mode === "email"
            ? "Email OTP is sent through EmailJS and should arrive within 1 minute. Valid for 5 minutes."
            : "Mobile OTP remains simulated for now; email OTP is real and arrives within 1 minute, valid for 5 minutes."}
        </p>
      </div>
    </main>
  );
}
