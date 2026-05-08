// ─────────────────────────────────────────────────────────────
//  src/App.jsx
//  Root component — assembles all sections.
//  To reorder or add sections, edit here.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { RECEIVER_EMAIL } from "./config/emailjs.js";

import Navbar       from "./components/Navbar.jsx";
import Login        from "./components/Login.jsx";
import Hero         from "./components/Hero.jsx";
import About        from "./components/About.jsx";
import Mentors      from "./components/Mentors.jsx";
import Guidance     from "./components/Guidance.jsx";
import Scholarships from "./components/Scholarships.jsx";
import Community    from "./components/Community.jsx";
import Guidelines   from "./components/Guidelines.jsx";
import FAQ          from "./components/FAQ.jsx";
import Contact      from "./components/Contact.jsx";
import Footer       from "./components/Footer.jsx";

export default function App() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("ddd-user"));
    } catch {
      return null;
    }
  });
  const [visitorLog, setVisitorLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ddd-visitor-log")) || [];
    } catch {
      return [];
    }
  });
  const [showVisitors, setShowVisitors] = useState(false);

  const visitorCount = visitorLog.length;
  const isHost = user && user.contact === RECEIVER_EMAIL;

  const recordVisitor = visitor => {
    const next = [...visitorLog, visitor];
    setVisitorLog(next);
    localStorage.setItem("ddd-visitor-log", JSON.stringify(next));
  };

  // Apply dark/light background to body
  useEffect(() => {
    document.body.style.background = dark ? "#020818" : "#fff";
    document.body.style.margin     = "0";
    document.body.style.padding    = "0";
  }, [dark]);

  // Load Google Fonts once
  useEffect(() => {
    const link  = document.createElement("link");
    link.rel    = "stylesheet";
    link.href   = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Syne:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("ddd-user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("ddd-user");
    }
  }, [user]);

  if (!user) {
    return <Login onLogin={visitor => { recordVisitor(visitor); setUser(visitor); }} dark={dark} />;
  }

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", scrollBehavior: "smooth" }}>
      <Navbar dark={dark} setDark={setDark} user={user} visitorCount={visitorCount} isHost={isHost} onLogout={() => setUser(null)} onShowVisitors={() => setShowVisitors(true)} />
      <Hero         dark={dark} />
      <About        dark={dark} />
      <Mentors      dark={dark} />
      <Guidance     dark={dark} />
      <Scholarships dark={dark} />
      <Community    dark={dark} />
      <Guidelines   dark={dark} />
      <FAQ          dark={dark} />
      <Contact      dark={dark} />
      <Footer />
      {showVisitors && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowVisitors(false)}>
          <div style={{
            backgroundColor: dark ? '#1a1a1a' : 'white',
            color: dark ? 'white' : 'black',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '90%'
          }} onClick={e => e.stopPropagation()}>
            <h2>Visitor Log</h2>
            <button onClick={() => setShowVisitors(false)} style={{
              float: 'right',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}>×</button>
            <div style={{ clear: 'both', marginTop: '20px' }}>
              {visitorLog.length === 0 ? (
                <p>No visitors yet.</p>
              ) : (
                visitorLog.map((visitor, index) => (
                  <div key={index} style={{
                    border: `1px solid ${dark ? '#333' : '#ddd'}`,
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px'
                  }}>
                    <strong>{visitor.displayName}</strong> ({visitor.contact})<br />
                    <small>Method: {visitor.method} | Time: {new Date(visitor.time).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
