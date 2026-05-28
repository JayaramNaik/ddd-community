import { useState, useEffect, useRef } from "react";
import { sendOtpEmail, sendVisitorNotification } from "../utils/sendEmail.js";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { RECEIVER_EMAIL } from "../config/emailjs.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_VALIDITY_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_S = 30;

export default function Login({ onLogin, dark }) {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [step, setStep] = useState("input");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpIntervalRef = useRef(null);
  const resendIntervalRef = useRef(null);

  useEffect(() => {
    if (step === "verify" && generatedOtp) {
      const expiresAt = generatedOtp.timestamp + OTP_VALIDITY_MS;
      const tick = () => { const r = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)); setOtpCountdown(r); if (r === 0) clearInterval(otpIntervalRef.current); };
      tick();
      otpIntervalRef.current = setInterval(tick, 1000);
      return () => clearInterval(otpIntervalRef.current);
    }
  }, [step, generatedOtp]);

  useEffect(() => {
    if (resendCooldown > 0) {
      resendIntervalRef.current = setInterval(() => { setResendCooldown(c => { if (c <= 1) { clearInterval(resendIntervalRef.current); return 0; } return c - 1; }); }, 1000);
      return () => clearInterval(resendIntervalRef.current);
    }
  }, [resendCooldown]);

  const sendOtp = async () => {
    setError("");
    if (!emailRegex.test(contact.trim())) { setError("Please enter a valid email address."); return; }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setIsSending(true);
    setStatus("Sending OTP to your inbox...");
    try {
      await sendOtpEmail(contact.trim(), code);
      setGeneratedOtp({ code, timestamp: Date.now() });
      setStep("verify");
      setOtpCountdown(Math.ceil(OTP_VALIDITY_MS / 1000));
      setResendCooldown(RESEND_COOLDOWN_S);
      setStatus(`OTP sent to ${contact.trim()}. Valid for 5 minutes.`);
    } catch (err) { setError("Unable to send OTP email right now. Please try again later."); }
    finally { setIsSending(false); }
  };

  const verifyOtp = async () => {
    setError("");
    if (!generatedOtp) { setError("No OTP sent. Please request a new one."); return; }
    if (otp.trim() !== generatedOtp.code) { setError("Incorrect OTP. Please try again."); return; }
    if (otpCountdown === 0) { setError("OTP has expired. Please request a new one."); return; }
    const email = contact.trim();
    const docId = email.replace(/\./g, "_");
    const isAdmin = email === RECEIVER_EMAIL;
    try {
      const ref = doc(db, "users", docId);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) { await setDoc(ref, { email, role: isAdmin ? "admin" : "user", banned: false, createdAt: serverTimestamp(), lastLogin: serverTimestamp() }); }
      else { if (snapshot.data().banned) { setError("Your account has been suspended."); return; } await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true }); }
    } catch (err) {}
    const visitor = { contact: email, method: "Email OTP", displayName: email.split("@")[0], time: new Date().toLocaleString("en-IN"), role: isAdmin ? "admin" : "user" };
    try { await sendVisitorNotification(visitor); } catch (err) {}
    onLogin(visitor);
  };

  const resetAll = () => { setStep("input"); setContact(""); setOtp(""); setGeneratedOtp(null); setStatus(""); setError(""); setOtpCountdown(0); setResendCooldown(0); clearInterval(otpIntervalRef.current); clearInterval(resendIntervalRef.current); };
  const formatTime = (s) => { const m = Math.floor(s / 60); const sec = s % 60; return m > 0 ? `${m}:${String(sec).padStart(2, "0")}` : `${sec}s`; };

  return (
    <main style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",background:dark?"#020818":"#f8fafc"}}>
      <div style={{width:"100%",maxWidth:480,background:dark?"rgba(7,14,35,0.96)":"#fff",borderRadius:24,border:dark?"1px solid rgba(56,189,248,0.15)":"1px solid rgba(15,23,42,0.08)",padding:"40px 32px",boxShadow:dark?"0 32px 90px rgba(0,0,0,0.35)":"0 24px 80px rgba(15,23,42,0.08)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:16}}>🎓</div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",color:"#38bdf8",marginBottom:10,fontFamily:"'Syne',sans-serif"}}>Dream • Decide • Dominate</div>
          <h1 style={{fontSize:"clamp(1.6rem,4vw,2.4rem)",margin:"0 0 12px",fontFamily:"'Playfair Display',serif",fontWeight:900,color:dark?"#f8fafc":"#0f172a",lineHeight:1.2}}>Welcome Back</h1>
          <p style={{color:dark?"#94a3b8":"#64748b",fontSize:14,lineHeight:1.7,margin:0,fontFamily:"'Lora',serif"}}>Enter your email address to receive a one-time password and sign in.</p>
        </div>
        <label style={{display:"block",marginBottom:8,color:dark?"#cbd5e1":"#475569",fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>📧 Email Address</label>
        <input type="email" value={contact} onChange={e=>setContact(e.target.value)} onKeyDown={e=>e.key==="Enter"&&step==="input"&&!isSending&&sendOtp()} placeholder="you@example.com" disabled={step==="verify"} style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${step==="verify"?"rgba(56,189,248,0.3)":(dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)")}`,background:dark?"rgba(255,255,255,0.04)":"#f8fafc",color:dark?"#f8fafc":"#0f172a",marginBottom:18,fontSize:14,fontFamily:"'Lora',serif",outline:"none",boxSizing:"border-box",opacity:step==="verify"?0.7:1}}/>
        {step==="verify"&&(<><label style={{display:"block",marginBottom:8,color:dark?"#cbd5e1":"#475569",fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>🔐 Enter OTP</label>
          <input type="text" value={otp} maxLength={6} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} onKeyDown={e=>e.key==="Enter"&&verifyOtp()} placeholder="6-digit code" autoFocus style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"1.5px solid rgba(56,189,248,0.4)",background:dark?"rgba(56,189,248,0.06)":"rgba(56,189,248,0.04)",color:dark?"#f8fafc":"#0f172a",marginBottom:18,fontSize:22,fontWeight:700,letterSpacing:8,textAlign:"center",outline:"none",boxSizing:"border-box",fontFamily:"'Syne',sans-serif"}}/>
          {otpCountdown>0&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:600,color:otpCountdown<=60?"#f59e0b":"#34d399"}}><span>⏱️</span><span>OTP expires in {formatTime(otpCountdown)}</span>{otpCountdown<=60&&<span style={{marginLeft:4,fontSize:11,color:"#ef4444"}}>⚠️ Expiring soon</span>}</div>}
          {otpCountdown===0&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:600,color:"#ef4444"}}><span>⚠️</span><span>OTP has expired. Request a new one.</span></div>}
        </>)}
        {error&&<div style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:10,padding:"10px 14px",color:"#f87171",marginBottom:14,fontSize:13,fontFamily:"'Lora',serif"}}>{error}</div>}
        {status&&<div style={{background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:10,padding:"10px 14px",color:"#34d399",marginBottom:14,fontSize:13,fontFamily:"'Lora',serif"}}>✅ {status}</div>}
        <button onClick={step==="input"?sendOtp:verifyOtp} disabled={step==="input"&&isSending} style={{width:"100%",padding:"14px 18px",borderRadius:14,border:"none",background:step==="input"&&isSending?"rgba(56,189,248,0.45)":"linear-gradient(135deg,#38bdf8,#818cf8)",color:"#fff",fontSize:15,fontWeight:700,cursor:step==="input"&&isSending?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif"}}>{step==="input"?(isSending?"⏳ Sending OTP...":"Send OTP →"):"✓ Verify & Sign In"}</button>
        {step==="verify"&&(<div style={{marginTop:12,textAlign:"center"}}>{resendCooldown>0?(<span style={{fontSize:12,color:dark?"#475569":"#94a3b8",fontFamily:"'Syne',sans-serif",fontWeight:600}}>Resend in {resendCooldown}s</span>):(<button onClick={sendOtp} style={{background:"none",border:"none",color:"#38bdf8",fontSize:13,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,textDecoration:"underline"}}>Resend OTP</button>)}</div>)}
        {step==="verify"&&<button onClick={resetAll} style={{width:"100%",marginTop:10,padding:"12px 18px",borderRadius:14,border:`1px solid ${dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.08)"}`,background:"transparent",color:dark?"#94a3b8":"#64748b",fontSize:13,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600}}>← Change Email</button>}
        <p style={{marginTop:24,fontSize:12,lineHeight:1.7,color:dark?"#475569":"#94a3b8",textAlign:"center",fontFamily:"'Lora',serif"}}>OTP sent via EmailJS. Valid 5 minutes.<br/>Your data is safe.</p>
      </div>
    </main>
  );
}