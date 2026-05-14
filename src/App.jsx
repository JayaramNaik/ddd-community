// ─────────────────────────────────────────────────────────────
//  src/App.jsx
//  Root component — with full Admin system wired in
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, lazy, Suspense } from "react";
import { RECEIVER_EMAIL } from "./config/emailjs.js";

import Navbar         from "./components/Navbar.jsx";
import Login          from "./components/Login.jsx";
import Hero           from "./components/Hero.jsx";
import About          from "./components/About.jsx";
import Mentors        from "./components/Mentors.jsx";
import Guidance       from "./components/Guidance.jsx";
import Scholarships   from "./components/Scholarships.jsx";
import Community      from "./components/Community.jsx";
import Guidelines     from "./components/Guidelines.jsx";
import FAQ            from "./components/FAQ.jsx";
import Contact        from "./components/Contact.jsx";
import Footer         from "./components/Footer.jsx";
import LanguageSelect from "./components/LanguageSelect.jsx";
import AdminBar       from "./components/AdminBar.jsx";

const WhatNext           = lazy(() => import("./components/WhatNext.jsx"));
const MentorProfile      = lazy(() => import("./components/MentorProfile.jsx"));
const AdminMentors       = lazy(() => import("./components/AdminMentors.jsx"));
const EngineeringRoadmap = lazy(() => import("./components/EngineeringRoadmap.jsx"));
const MedicalRoadmap     = lazy(() => import("./components/MedicalRoadmap.jsx"));
const ExamsPage          = lazy(() => import("./components/ExamsPage.jsx"));
const AdminDashboard     = lazy(() => import("./components/AdminDashboard.jsx"));

export default function App() {
  const [dark, setDark]   = useState(true);
  const [lang, setLang]   = useState(null);
  const [page, setPage]   = useState("home"); // "home" | "admin-dashboard"

  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("ddd-user")); }
    catch { return null; }
  });

  const [visitorLog, setVisitorLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ddd-visitor-log")) || []; }
    catch { return []; }
  });

  const [showVisitors, setShowVisitors] = useState(false);

  const visitorCount = visitorLog.length;

  // ── Admin check — your email = admin ──────────────────────
  const isAdmin = user && (
    user.contact === RECEIVER_EMAIL ||
    user.role    === "admin"
  );
  const isHost = isAdmin; // backward compat

  const recordVisitor = visitor => {
    const next = [...visitorLog, visitor];
    setVisitorLog(next);
    localStorage.setItem("ddd-visitor-log", JSON.stringify(next));
  };

  // ── Body background ───────────────────────────────────────
  useEffect(() => {
    document.body.style.background = dark ? "#020818" : "#fff";
    document.body.style.margin     = "0";
    document.body.style.padding    = "0";
  }, [dark]);

  // ── Google Fonts ──────────────────────────────────────────
  useEffect(() => {
    const link  = document.createElement("link");
    link.rel    = "stylesheet";
    link.href   = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Syne:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap";
    document.head.appendChild(link);
  }, []);

  // ── Persist user ──────────────────────────────────────────
  useEffect(() => {
    if (user) sessionStorage.setItem("ddd-user", JSON.stringify(user));
    else       sessionStorage.removeItem("ddd-user");
  }, [user]);

  // ── Handle /admin-dashboard URL hash ─────────────────────
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#admin-dashboard") {
        if (isAdmin) setPage("admin-dashboard");
        else         window.location.hash = "";
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [isAdmin]);

  const goToDashboard = () => {
    if (!isAdmin) return;
    setPage("admin-dashboard");
    window.location.hash = "#admin-dashboard";
  };

  const goToHome = () => {
    setPage("home");
    window.location.hash = "";
  };

  const handleLogout = () => {
    setUser(null);
    setLang(null);
    setPage("home");
    window.location.hash = "";
  };

  // ── Not logged in ─────────────────────────────────────────
  if (!user) {
    return (
      <Login
        onLogin={visitor => { recordVisitor(visitor); setUser(visitor); }}
        dark={dark}
      />
    );
  }

  // ── Language not selected ─────────────────────────────────
  if (!lang) {
    return <LanguageSelect dark={dark} onSelect={setLang} />;
  }

  // ── Admin Dashboard page ──────────────────────────────────
  if (page === "admin-dashboard") {
    if (!isAdmin) { goToHome(); return null; }
    return (
      <Suspense fallback={
        <div style={{ minHeight: "100vh", background: "#020818", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
          Loading Dashboard...
        </div>
      }>
        {/* Admin bar on dashboard too */}
        <AdminBar onGoToDashboard={goToDashboard} />
        <div style={{ paddingTop: 36 }}>
          <AdminDashboard
            dark={dark}
            user={user}
            onBack={goToHome}
            visitorLog={visitorLog}
          />
        </div>
      </Suspense>
    );
  }

  // ── Main Site ─────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Syne', sans-serif", scrollBehavior: "smooth" }}>

      {/* Admin safety bar — only visible to admin */}
      {isAdmin && <AdminBar onGoToDashboard={goToDashboard} />}

      {/* Push content down so AdminBar doesn't cover Navbar */}
      <div style={{ paddingTop: isAdmin ? 36 : 0 }}>
        <Navbar
          dark={dark}
          setDark={setDark}
          user={user}
          visitorCount={visitorCount}
          isHost={isHost}
          onLogout={handleLogout}
          onShowVisitors={() => setShowVisitors(true)}
          lang={lang}
        />

        <Hero         dark={dark} lang={lang} />
        <About        dark={dark} lang={lang} />
        <Mentors      dark={dark} lang={lang} />

        <Suspense fallback={<div style={{ height: "50px" }} />}>
          <MentorProfile dark={dark} user={user} />
        </Suspense>

        {isHost && (
          <Suspense fallback={null}>
            <AdminMentors dark={dark} />
          </Suspense>
        )}

        <Guidance     dark={dark} lang={lang} />
        <Scholarships dark={dark} lang={lang} />

        <Suspense fallback={<div style={{ height: "100px" }} />}>
          <WhatNext dark={dark} lang={lang} />
        </Suspense>
        <Suspense fallback={<div style={{ height: "100px" }} />}>
          <EngineeringRoadmap dark={dark} lang={lang} />
        </Suspense>
        <Suspense fallback={<div style={{ height: "100px" }} />}>
          <MedicalRoadmap dark={dark} lang={lang} />
        </Suspense>
        <Suspense fallback={<div style={{ height: "100px" }} />}>
          <ExamsPage dark={dark} />
        </Suspense>

        <Community    dark={dark} lang={lang} />
        <Guidelines   dark={dark} />
        <FAQ          dark={dark} lang={lang} />
        <Contact      dark={dark} lang={lang} />
        <Footer       lang={lang} />
      </div>

      {/* ── Visitor Log Modal ── */}
      {showVisitors && (
        <div
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
          }}
          onClick={() => setShowVisitors(false)}
        >
          <div
            style={{
              backgroundColor: dark ? "#0f172a" : "white",
              color: dark ? "white" : "black",
              padding: "28px", borderRadius: "16px",
              maxWidth: "600px", maxHeight: "80vh",
              overflowY: "auto", width: "90%",
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "1.4rem" }}>
                Visitor Log
              </h2>
              <button
                onClick={() => setShowVisitors(false)}
                style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: dark ? "#fff" : "#000" }}
              >×</button>
            </div>

            {visitorLog.length === 0 ? (
              <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8" }}>No visitors yet.</p>
            ) : (
              [...visitorLog].reverse().map((visitor, index) => (
                <div key={index} style={{
                  border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                  padding: "12px 16px", marginBottom: "10px", borderRadius: "10px",
                  background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                }}>
                  <strong style={{ fontFamily: "'Syne',sans-serif" }}>{visitor.displayName}</strong>
                  <span style={{ color: dark ? "#64748b" : "#94a3b8", fontSize: 13 }}> ({visitor.contact})</span>
                  <br />
                  <small style={{ color: dark ? "#475569" : "#94a3b8", fontFamily: "'Lora',serif" }}>
                    Method: {visitor.method} · {visitor.time}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
