// ─────────────────────────────────────────────────────────────
//  src/components/EngineeringRoadmap.jsx
//  Full Engineering Career Roadmap — multilingual support added
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import ShareButton from "../components/ShareButton.jsx";
import { FadeIn } from "../hooks/useInView.jsx";
import { useTranslation } from "../data/translations.js";

const BRANCHES = [
  {
    id: "cs", icon: "💻", title: "Computer Science", color: "#38bdf8",
    desc: "Software, apps, AI, and the digital world. The highest-demand branch globally.",
    skills: ["Programming (C++, Python, Java)", "Data Structures & Algorithms", "Web Development", "Problem Solving"],
    scope: ["Software Engineer", "Data Scientist", "Product Manager", "AI Engineer"],
    salary: "₹6L–₹50L+", colleges: ["IIT Bombay", "BITS Pilani", "NIT Trichy", "RVCE Bengaluru"],
    exams: ["JEE Main", "JEE Advanced", "CET", "BITSAT"],
  },
  {
    id: "ai", icon: "🤖", title: "AI & Data Science", color: "#818cf8",
    desc: "The fastest-growing field. Machine learning, AI, and data analytics powering the future.",
    skills: ["Python & Statistics", "Machine Learning", "Data Visualization", "Deep Learning basics"],
    scope: ["ML Engineer", "Data Scientist", "AI Researcher", "Business Analyst"],
    salary: "₹8L–₹60L+", colleges: ["IIT Madras", "IISc Bengaluru", "VIT", "Manipal"],
    exams: ["JEE Main", "CET", "CUET", "KCET"],
  },
  {
    id: "mech", icon: "⚙️", title: "Mechanical", color: "#f59e0b",
    desc: "Design, manufacture, and maintain machines. Core to every industry from auto to aerospace.",
    skills: ["CAD/CAM", "Thermodynamics", "Manufacturing", "Robotics basics"],
    scope: ["Design Engineer", "Automobile Engineer", "Production Manager", "ISRO/DRDO"],
    salary: "₹4L–₹20L+", colleges: ["IIT Delhi", "NIT Warangal", "BMS College", "MSRIT"],
    exams: ["JEE Main", "CET", "GATE (PG)"],
  },
  {
    id: "civil", icon: "🏗️", title: "Civil", color: "#34d399",
    desc: "Build the nation — roads, bridges, buildings, dams. Always in demand with govt projects.",
    skills: ["AutoCAD", "Structural Analysis", "Surveying", "Construction Management"],
    scope: ["Site Engineer", "Structural Designer", "Govt PWD/BBMP", "Urban Planner"],
    salary: "₹3.5L–₹18L+", colleges: ["IIT Roorkee", "NIT Calicut", "BMS College", "UVCE Bengaluru"],
    exams: ["JEE Main", "CET", "GATE"],
  },
  {
    id: "ece", icon: "📡", title: "Electronics & Communication", color: "#f472b6",
    desc: "Chips, circuits, communication systems, and embedded tech powering every smart device.",
    skills: ["Circuit Design", "Embedded Systems", "Signal Processing", "VLSI basics"],
    scope: ["VLSI Engineer", "Embedded Developer", "Telecom Engineer", "ISRO/DRDO"],
    salary: "₹4L–₹25L+", colleges: ["IIT Kharagpur", "NIT Surathkal", "PESIT", "RV College"],
    exams: ["JEE Main", "CET", "GATE"],
  },
  {
    id: "aero", icon: "✈️", title: "Aerospace", color: "#a855f7",
    desc: "Design aircraft, spacecraft, and rockets. One of the most prestigious and exciting fields.",
    skills: ["Aerodynamics", "Fluid Mechanics", "Propulsion", "CAD/MATLAB"],
    scope: ["Aerospace Engineer", "ISRO Scientist", "HAL Engineer", "Defence R&D"],
    salary: "₹5L–₹30L+", colleges: ["IIT Bombay", "IIT Madras", "PES University", "Amrita"],
    exams: ["JEE Advanced", "JEE Main", "IIST entrance"],
  },
  {
    id: "robotics", icon: "🦾", title: "Robotics", color: "#ef4444",
    desc: "The future of automation. Design intelligent machines that see, think, and act.",
    skills: ["Programming", "Mechanical Design", "AI/ML basics", "Sensor Systems"],
    scope: ["Robotics Engineer", "Automation Specialist", "Research Scientist", "Product Developer"],
    salary: "₹6L–₹35L+", colleges: ["IIT Kanpur", "IIIT Hyderabad", "Manipal", "SRM"],
    exams: ["JEE Main", "JEE Advanced", "KCET"],
  },
  {
    id: "biotech", icon: "🧬", title: "Biotechnology", color: "#10b981",
    desc: "Merge biology with engineering. Work on medicines, food tech, genetic research, and more.",
    skills: ["Molecular Biology", "Biochemistry", "Lab Techniques", "Bioinformatics"],
    scope: ["Research Scientist", "Biomedical Engineer", "Pharma R&D", "Food Tech"],
    salary: "₹3.5L–₹20L+", colleges: ["IIT Delhi", "VIT", "Manipal", "Amrita"],
    exams: ["JEE Main", "KCET", "CUET"],
  },
];

const ROADMAP_STEPS = [
  {
    phase: "Now (10th)",
    color: "#38bdf8",
    icon: "🏫",
    steps: [
      "Focus on Maths and Science — score 90%+",
      "Start basic programming: Scratch, then Python",
      "Join your school science/math club",
      "Read about engineering fields — find your passion",
      "Start Olympiad preparation (Math/Science)",
    ],
  },
  {
    phase: "PUC / 11th–12th",
    color: "#818cf8",
    icon: "📖",
    steps: [
      "Choose PCM (Physics, Chemistry, Maths)",
      "Start JEE/CET coaching in 11th itself",
      "Learn C++ or Python basics alongside PUC",
      "Solve NCERT + reference books thoroughly",
      "Take mock tests regularly — track progress",
    ],
  },
  {
    phase: "Entrance Exam Year",
    color: "#f59e0b",
    icon: "📝",
    steps: [
      "Appear for JEE Main (Jan & April attempts)",
      "Appear for Karnataka CET / state CET",
      "Apply for BITSAT, VITEEE, MET if interested",
      "Prepare a college list based on rank & budget",
      "Don't panic — one exam doesn't define you",
    ],
  },
  {
    phase: "Engineering Degree (4 years)",
    color: "#34d399",
    icon: "🎓",
    steps: [
      "Pick a branch you're genuinely interested in",
      "Join coding clubs, robotics teams, hackathons",
      "Do internships from 2nd year onwards",
      "Build projects — GitHub profile matters",
      "Target placements OR higher studies (GATE/MS)",
    ],
  },
  {
    phase: "After Graduation",
    color: "#a855f7",
    icon: "🚀",
    steps: [
      "Campus placements at top tech companies",
      "GATE for M.Tech / PSU jobs",
      "GRE + IELTS for MS abroad (USA, Germany, Canada)",
      "MBA from IIM for management roles",
      "Startup / Entrepreneurship path",
    ],
  },
];

const JEE_TIMELINE = [
  { month: "June–July (11th start)", task: "Start NCERT thoroughly. Join coaching.", icon: "📚" },
  { month: "Aug–Dec (11th)", task: "Complete 11th syllabus. Solve DPPs daily.", icon: "✏️" },
  { month: "Jan–March (11th end)", task: "Revise 11th. Start 12th topics early.", icon: "🔄" },
  { month: "April–Sept (12th)", task: "Complete 12th syllabus. Mock tests weekly.", icon: "📝" },
  { month: "Oct–Dec (12th)", task: "Full syllabus revision. Past papers daily.", icon: "🎯" },
  { month: "Jan (JEE Main)", task: "First attempt. Stay calm, trust the prep.", icon: "⚡" },
  { month: "March–April", task: "Board exams + JEE Main 2nd attempt.", icon: "🏆" },
  { month: "May–June", task: "JEE Advanced (if qualified). State CET.", icon: "🌟" },
];

const RESOURCES = [
  { category: "📗 Books", items: ["NCERT (non-negotiable)", "HC Verma — Physics", "RD Sharma / Cengage — Maths", "OP Tandon — Chemistry", "Arihant Series"] },
  { category: "🖥️ Online Platforms", items: ["Khan Academy (concepts)", "Unacademy / PW (JEE)", "NPTEL (advanced)", "LeetCode (coding)", "Coursera (skills)"] },
  { category: "📱 Apps", items: ["Doubtnut (doubt solving)", "Vedantu", "Byju's", "GFG (coding)", "Brilliant.org (problem solving)"] },
  { category: "🏛️ YouTube Channels", items: ["Physics Wallah", "Vedantu JEE", "3Blue1Brown (Maths)", "MIT OpenCourseWare", "CS50 Harvard (coding)"] },
];

const STORIES = [
  { name: "Sundar Pichai", role: "CEO, Google & Alphabet", college: "IIT Kharagpur → Stanford", quote: "Don't be afraid to dream big. Work hard, stay humble.", branch: "Metallurgy → CS" },
  { name: "Kiran Mazumdar Shaw", role: "Founder, Biocon", college: "Bengaluru University → Melbourne", quote: "Innovation distinguishes between a leader and a follower.", branch: "Biotechnology" },
  { name: "N. R. Narayana Murthy", role: "Co-Founder, Infosys", college: "NIT Mysore → IIT Kanpur", quote: "Growth and comfort do not coexist.", branch: "Electrical Engineering" },
];

export default function EngineeringRoadmap({ dark, lang }) {
  const t = useTranslation(lang);
  const e = t.engineering;

  const [activeBranch, setActiveBranch] = useState(null);
  const [activeTab, setActiveTab] = useState("roadmap");

  const tabs = [
    { key: "roadmap",   label: e.tabs.roadmap },
    { key: "branches",  label: e.tabs.branches },
    { key: "jee",       label: e.tabs.jee },
    { key: "resources", label: e.tabs.resources },
    { key: "stories",   label: e.tabs.stories },
  ];

  return (
    <section id="engineering" style={{ minHeight: "100vh", background: dark ? "#040b1c" : "#f8fafc", padding: "80px 2rem 120px" , position: "relative"}}>
        <ShareButton section="engineering" label="Engineering Roadmap" dark={dark} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Hero ── */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #38bdf822, #818cf822)",
              border: "1px solid #38bdf833",
              borderRadius: 40,
              padding: "6px 20px",
              fontSize: 11,
              fontWeight: 700,
              color: "#38bdf8",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 20,
            }}>
              {e.badge}
            </div>
            <h1 style={{
              fontSize: "clamp(2.2rem,5vw,3.8rem)",
              fontFamily: "'Playfair Display',serif",
              fontWeight: 900,
              color: dark ? "#f1f5f9" : "#0f172a",
              margin: "0 0 20px",
              lineHeight: 1.15,
            }}>
              {e.title1}{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {e.titleHighlight}
              </span>{" "}
              {e.title2}
            </h1>
            <p style={{
              fontSize: "clamp(1rem,2vw,1.15rem)",
              color: dark ? "#64748b" : "#64748b",
              fontFamily: "'Lora',serif",
              maxWidth: 560,
              margin: "0 auto 32px",
              lineHeight: 1.8,
            }}>
              {e.subtitle}
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
              {[
                { label: e.stat1Label, value: "8+" },
                { label: e.stat2Label, value: "₹6–12L" },
                { label: e.stat3Label, value: e.stat3Value },
                { label: e.stat4Label, value: "6–7" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, color: dark ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Why Engineering ── */}
        <FadeIn delay={0.1}>
          <div style={{
            background: dark ? "linear-gradient(135deg,rgba(56,189,248,0.07),rgba(129,140,248,0.07))" : "linear-gradient(135deg,rgba(56,189,248,0.06),rgba(129,140,248,0.04))",
            border: `1px solid ${dark ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.2)"}`,
            borderRadius: 24,
            padding: "36px",
            marginBottom: 56,
          }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 20px" }}>
              {e.whyTitle}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
              {e.why.map(r => (
                <div key={r.title} style={{
                  background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
                  borderRadius: 14,
                  padding: "18px 16px",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{r.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: dark ? "#f1f5f9" : "#0f172a", marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#64748b", lineHeight: 1.6 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Tab Navigation ── */}
        <FadeIn delay={0.15}>
          <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key
                    ? "linear-gradient(135deg,#38bdf8,#818cf8)"
                    : (dark ? "rgba(255,255,255,0.05)" : "#fff"),
                  border: `1.5px solid ${activeTab === tab.key ? "transparent" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
                  borderRadius: 12,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: activeTab === tab.key ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
                  transition: "all 0.25s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* ── Roadmap Tab ── */}
        {activeTab === "roadmap" && (
          <FadeIn>
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 32px" }}>
                {e.roadmapTitle}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {ROADMAP_STEPS.map((phase, i) => (
                  <div key={phase.phase} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                    {/* Timeline */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${phase.color}, ${phase.color}88)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20, flexShrink: 0,
                        boxShadow: `0 0 20px ${phase.color}44`,
                      }}>
                        {phase.icon}
                      </div>
                      {i < ROADMAP_STEPS.length - 1 && (
                        <div style={{ width: 2, flex: 1, minHeight: 40, background: `linear-gradient(${phase.color}, ${ROADMAP_STEPS[i+1].color})`, margin: "8px 0", opacity: 0.4 }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{
                      background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                      border: `1.5px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                      borderLeft: `3px solid ${phase.color}`,
                      borderRadius: 16,
                      padding: "20px 24px",
                      marginBottom: 16,
                      flex: 1,
                    }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: phase.color, marginBottom: 12 }}>
                        {phase.phase}
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                        {phase.steps.map((step, j) => (
                          <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ color: phase.color, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                            <span style={{ fontFamily: "'Lora',serif", fontSize: 14, color: dark ? "#cbd5e1" : "#334155", lineHeight: 1.6 }}>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div style={{
              background: dark ? "rgba(255,255,255,0.03)" : "#fff",
              border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              borderRadius: 20,
              padding: "32px",
              marginBottom: 48,
            }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 24px" }}>
                {e.skillsTitle}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
                {e.skills.map(s => (
                  <div key={s.skill} style={{
                    background: dark ? "rgba(56,189,248,0.06)" : "rgba(56,189,248,0.04)",
                    border: "1px solid rgba(56,189,248,0.15)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: dark ? "#e2e8f0" : "#1e293b" }}>{s.skill}</div>
                      <div style={{ fontFamily: "'Lora',serif", fontSize: 11, color: dark ? "#64748b" : "#94a3b8", marginTop: 2 }}>{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Management */}
            <div style={{
              background: dark ? "rgba(129,140,248,0.07)" : "rgba(129,140,248,0.05)",
              border: "1px solid rgba(129,140,248,0.2)",
              borderRadius: 20,
              padding: "32px",
            }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 20px" }}>
                ⏰ Time Management for Aspirants
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                {[
                  { time: "6:00 AM", task: "Wake up, revise notes (30 min)", color: "#f59e0b" },
                  { time: "7–9 AM", task: "School / College preparation", color: "#38bdf8" },
                  { time: "4–6 PM", task: "Coaching class or self-study", color: "#818cf8" },
                  { time: "7–9 PM", task: "Solve problems — DPPs, past papers", color: "#34d399" },
                  { time: "9–10 PM", task: "Weak topic revision", color: "#f472b6" },
                  { time: "10 PM", task: "Sleep! Rest is part of the prep", color: "#a855f7" },
                ].map(t => (
                  <div key={t.time} style={{
                    background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                    borderRadius: 12,
                    padding: "14px 16px",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                    borderLeft: `3px solid ${t.color}`,
                  }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: t.color }}>{t.time}</div>
                    <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#94a3b8" : "#64748b", marginTop: 4, lineHeight: 1.5 }}>{t.task}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Branches Tab ── */}
        {activeTab === "branches" && (
          <FadeIn>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 32px" }}>
              {e.branchesTitle}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {BRANCHES.map(branch => (
                <div
                  key={branch.id}
                  onClick={() => setActiveBranch(activeBranch?.id === branch.id ? null : branch)}
                  style={{
                    background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                    border: `1.5px solid ${activeBranch?.id === branch.id ? branch.color : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)")}`,
                    borderTop: `3px solid ${branch.color}`,
                    borderRadius: 18,
                    padding: "24px 20px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={e2 => { e2.currentTarget.style.transform = "translateY(-4px)"; e2.currentTarget.style.boxShadow = `0 16px 40px ${branch.color}22`; }}
                  onMouseLeave={e2 => { e2.currentTarget.style.transform = ""; e2.currentTarget.style.boxShadow = ""; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontSize: 36 }}>{branch.icon}</span>
                    <span style={{ background: branch.color + "18", color: branch.color, border: `1px solid ${branch.color}33`, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
                      {branch.salary}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>{branch.title}</h3>
                  <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: dark ? "#64748b" : "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>{branch.desc}</p>

                  {activeBranch?.id === branch.id && (
                    <div style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`, paddingTop: 16, marginTop: 4 }}>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: branch.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{e.branchExpanded.keySkills}</div>
                        {branch.skills.map(s => (
                          <div key={s} style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#94a3b8" : "#64748b", padding: "3px 0" }}>→ {s}</div>
                        ))}
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: branch.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{e.branchExpanded.careerRoles}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {branch.scope.map(s => (
                            <span key={s} style={{ background: branch.color + "15", color: branch.color, border: `1px solid ${branch.color}25`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: branch.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{e.branchExpanded.topColleges}</div>
                        {branch.colleges.map(c => (
                          <div key={c} style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#94a3b8" : "#64748b", padding: "2px 0" }}>🏛 {c}</div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: branch.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{e.branchExpanded.entranceExams}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {branch.exams.map(ex => (
                            <span key={ex} style={{ background: dark ? "rgba(255,255,255,0.07)" : "#f1f5f9", color: dark ? "#cbd5e1" : "#475569", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{ex}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 12, color: branch.color, fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
                    {activeBranch?.id === branch.id ? "▲ Show less" : "▼ Explore details"}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* ── JEE Prep Tab ── */}
        {activeTab === "jee" && (
          <FadeIn>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 12px" }}>
                {e.jeeTitle}
              </h2>
              <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", marginBottom: 36, fontSize: 14 }}>
                {e.jeeSubtitle}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
                {JEE_TIMELINE.map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: 20,
                    alignItems: "center",
                    background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                    borderRadius: 14,
                    padding: "18px 22px",
                  }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#38bdf8", marginBottom: 4 }}>{item.month}</div>
                      <div style={{ fontFamily: "'Lora',serif", fontSize: 14, color: dark ? "#cbd5e1" : "#334155", lineHeight: 1.5 }}>{item.task}</div>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                      color: "#fff",
                      width: 28, height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Study tips */}
              <div style={{
                background: dark ? "rgba(56,189,248,0.06)" : "rgba(56,189,248,0.04)",
                border: "1px solid rgba(56,189,248,0.2)",
                borderRadius: 20,
                padding: "32px",
              }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 20px" }}>
                  {e.jeeTipsTitle}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  {[
                    { tip: "NCERT first, always", detail: "All JEE questions are rooted in NCERT. Master it before any reference book." },
                    { tip: "Daily Problem Practice", detail: "Solve minimum 20 problems every single day — no exceptions." },
                    { tip: "Mock Tests Weekly", detail: "Simulate exam conditions. Time yourself. Analyze mistakes." },
                    { tip: "Avoid Burnout", detail: "Take one 2-hour break weekly. Sleep 7 hours. Mental health = performance." },
                    { tip: "Weak Topic Focus", detail: "Spend 60% time on weak topics, not comfort zones." },
                    { tip: "Revision Cycles", detail: "Revise completed chapters every 3 weeks or you'll forget them." },
                  ].map(tip => (
                    <div key={tip.tip} style={{
                      background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                      borderRadius: 12,
                      padding: "16px",
                      border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                    }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#38bdf8", marginBottom: 6 }}>✓ {tip.tip}</div>
                      <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", lineHeight: 1.6 }}>{tip.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Resources Tab ── */}
        {activeTab === "resources" && (
          <FadeIn>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 32px" }}>
              {e.resourcesTitle}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 48 }}>
              {RESOURCES.map(r => (
                <div key={r.category} style={{
                  background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                  border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                  borderRadius: 18,
                  padding: "24px 20px",
                }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 16px" }}>{r.category}</h3>
                  {r.items.map(item => (
                    <div key={item} style={{
                      fontFamily: "'Lora',serif",
                      fontSize: 13,
                      color: dark ? "#94a3b8" : "#64748b",
                      padding: "8px 0",
                      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                      lineHeight: 1.5,
                    }}>
                      → {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Scholarships */}
            <div style={{
              background: dark ? "rgba(52,211,153,0.07)" : "rgba(52,211,153,0.05)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: 20,
              padding: "32px",
            }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 20px" }}>
                {e.scholarshipsTitle}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
                {[
                  { name: "NSP Scholarship", desc: "Central Govt — SC/ST/OBC/Minority students", url: "https://scholarships.gov.in/" },
                  { name: "SSP Karnataka", desc: "State Govt — Post-matric scholarship", url: "https://ssp.karnataka.gov.in/ssp_post_home/" },
                  { name: "Vidyadhan", desc: "Merit-cum-need scholarship for engineering", url: "https://www.vidyadhan.org/" },
                  { name: "AICTE Pragati", desc: "For girl students in technical education", url: "https://www.aicte-india.org/bureaus/pgrsf" },
                ].map(s => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{
                      background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                      borderRadius: 12,
                      padding: "16px",
                      border: "1px solid rgba(52,211,153,0.15)",
                      cursor: "pointer",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={ev => { ev.currentTarget.style.borderColor = "#34d399"; ev.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={ev => { ev.currentTarget.style.borderColor = "rgba(52,211,153,0.15)"; ev.currentTarget.style.transform = ""; }}
                    >
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#34d399", marginBottom: 4 }}>{s.name} ↗</div>
                      <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8" }}>{s.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Inspiration Tab ── */}
        {activeTab === "stories" && (
          <FadeIn>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 32px" }}>
              {e.inspirationTitle}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 48 }}>
              {STORIES.map(s => (
                <div key={s.name} style={{
                  background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                  border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                  borderRadius: 20,
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "linear-gradient(135deg,#38bdf811,#818cf811)", borderRadius: "0 20px 0 80px" }} />
                  <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍💻</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 20, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>{s.name}</h3>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12, color: "#38bdf8", margin: "0 0 4px" }}>{s.role}</p>
                  <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#64748b" : "#94a3b8", margin: "0 0 16px" }}>{s.college}</p>
                  <div style={{ background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc", borderRadius: 12, padding: "14px 16px", borderLeft: "3px solid #818cf8" }}>
                    <p style={{ fontFamily: "'Lora',serif", fontStyle: "italic", fontSize: 13, color: dark ? "#cbd5e1" : "#334155", margin: 0, lineHeight: 1.7 }}>
                      "{s.quote}"
                    </p>
                  </div>
                  <span style={{ display: "inline-block", marginTop: 12, background: "#38bdf818", color: "#38bdf8", border: "1px solid #38bdf833", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
                    {s.branch}
                  </span>
                </div>
              ))}
            </div>

            {/* Day in the life */}
            <div style={{
              background: dark ? "rgba(129,140,248,0.07)" : "rgba(129,140,248,0.05)",
              border: "1px solid rgba(129,140,248,0.2)",
              borderRadius: 20,
              padding: "32px",
            }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 20px" }}>
                {e.dayTitle}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {e.day.map(item => (
                  <div key={item.time} style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                    borderRadius: 10,
                    padding: "12px 16px",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                  }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#818cf8", minWidth: 60, flexShrink: 0 }}>{item.time}</span>
                    <span style={{ fontFamily: "'Lora',serif", fontSize: 13, color: dark ? "#cbd5e1" : "#334155" }}>{item.act}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── CTA ── */}
        <FadeIn>
          <div style={{
            textAlign: "center",
            marginTop: 72,
            padding: "48px 32px",
            background: dark ? "linear-gradient(135deg,rgba(56,189,248,0.07),rgba(129,140,248,0.07))" : "linear-gradient(135deg,rgba(56,189,248,0.06),rgba(129,140,248,0.04))",
            borderRadius: 28,
            border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
          }}>
            <p style={{ fontSize: 44, marginBottom: 16 }}>🚀</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2.2rem)", color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 14px", lineHeight: 1.4 }}>
              {e.ctaTitle}
            </h2>
            <p style={{ fontFamily: "'Lora',serif", color: dark ? "#64748b" : "#94a3b8", fontSize: 15, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.8 }}>
              {e.ctaSubtitle}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#community" style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", color: "#fff", padding: "12px 28px", borderRadius: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                {e.ctaAskBtn}
              </a>
              <a href="#scholarships" style={{ background: dark ? "rgba(255,255,255,0.07)" : "#f1f5f9", color: dark ? "#f1f5f9" : "#0f172a", padding: "12px 28px", borderRadius: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}` }}>
                {e.ctaScholarBtn}
              </a>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
