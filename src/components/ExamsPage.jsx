// ─────────────────────────────────────────────────────────────
//  src/components/ExamsPage.jsx  — UI Improved
//  Fixes: typography hierarchy, mobile layout, spacing
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { FadeIn } from "../hooks/useInView.jsx";

/* ── Responsive CSS ── */
const CSS = `
  .ep-stats        { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }
  .ep-stat-val     { font-family: 'Playfair Display', serif; font-weight: 900;
                     font-size: clamp(1.4rem, 4vw, 1.8rem);
                     background: linear-gradient(135deg,#38bdf8,#818cf8);
                     -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .ep-stat-lbl     { font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 600;
                     text-transform: uppercase; letter-spacing: 0.09em; }
  .ep-cat-row      { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px; }
  .ep-tag-row      { display: flex; gap: 7px; flex-wrap: wrap; justify-content: center; margin-bottom: 36px; }
  .ep-grid         { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .ep-card         { display: flex; flex-direction: column; gap: 12px;
                     border-radius: 18px; padding: 22px 18px; transition: all 0.3s; height: 100%; box-sizing: border-box; }
  .ep-card:hover   { transform: translateY(-4px); }
  .ep-meta-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  @media (max-width: 640px) {
    .ep-grid        { grid-template-columns: 1fr; }
    .ep-meta-grid   { grid-template-columns: 1fr; }
    .ep-stats       { gap: 20px; }
  }
  @media (max-width: 400px) {
    .ep-cat-row button { font-size: 12px !important; padding: 8px 14px !important; }
    .ep-tag-row button { font-size: 10px !important; padding: 5px 10px !important; }
  }
`;

/* ────────── DATA (unchanged) ────────── */
const EXAMS = {
  entrance: [
    { id: "neet", name: "NEET UG", full: "National Eligibility cum Entrance Test", icon: "🩺", color: "#ef4444", eligibility: "12th PCB", frequency: "Once a year (May)", conducted: "NTA", desc: "Gateway to MBBS, BDS, BAMS, BUMS and other medical UG courses across India.", url: "https://neet.nta.nic.in/", tags: ["Medical", "12th", "Biology"] },
    { id: "jee-main", name: "JEE Main", full: "Joint Entrance Examination Main", icon: "🔩", color: "#38bdf8", eligibility: "12th PCM", frequency: "Twice a year (Jan & Apr)", conducted: "NTA", desc: "Admission to NITs, IIITs, and other CFTIs. Also qualifies for JEE Advanced.", url: "https://jeemain.nta.nic.in/", tags: ["Engineering", "12th", "Maths"] },
    { id: "jee-advanced", name: "JEE Advanced", full: "Joint Entrance Examination Advanced", icon: "🏛️", color: "#818cf8", eligibility: "JEE Main qualified, top 2.5L", frequency: "Once a year (May/June)", conducted: "IITs (rotational)", desc: "Admission to all 23 IITs. The most prestigious engineering entrance in India.", url: "https://jeeadv.ac.in/", tags: ["Engineering", "IIT", "12th"] },
    { id: "kcet", name: "KCET", full: "Karnataka Common Entrance Test", icon: "🎓", color: "#34d399", eligibility: "12th PCM or PCB", frequency: "Once a year (April/May)", conducted: "KEA Karnataka", desc: "Admission to Engineering, Pharmacy, and Agriculture courses in Karnataka colleges.", url: "https://cetonline.karnataka.gov.in/kea/", tags: ["Engineering", "Karnataka", "12th"] },
    { id: "neet-pg", name: "NEET PG", full: "National Eligibility cum Entrance Test PG", icon: "🏥", color: "#f472b8", eligibility: "MBBS degree", frequency: "Once a year", conducted: "NBE", desc: "Admission to MD, MS, and PG Diploma medical courses across India.", url: "https://nbe.edu.in/", tags: ["Medical", "PG", "MBBS"] },
    { id: "gate", name: "GATE", full: "Graduate Aptitude Test in Engineering", icon: "⚙️", color: "#f59e0b", eligibility: "B.E/B.Tech or final year", frequency: "Once a year (Feb)", conducted: "IITs + IISc", desc: "Admission to M.Tech at IITs/NITs and PSU recruitment (BHEL, ONGC, NTPC etc.).", url: "https://gate2025.iitroorkee.ac.in/", tags: ["Engineering", "PG", "PSU"] },
    { id: "cuet", name: "CUET UG", full: "Common University Entrance Test", icon: "🎓", color: "#a855f7", eligibility: "12th any stream", frequency: "Once a year (May)", conducted: "NTA", desc: "Admission to central universities including DU, JNU, BHU, and 200+ universities.", url: "https://cuet.nta.nic.in/", tags: ["UG", "Central University", "12th"] },
    { id: "clat", name: "CLAT", full: "Common Law Admission Test", icon: "⚖️", color: "#10b981", eligibility: "12th any stream", frequency: "Once a year (Dec)", conducted: "Consortium of NLUs", desc: "Admission to BA LLB and LLB programs at 22 National Law Universities across India.", url: "https://consortiumofnlus.ac.in/", tags: ["Law", "12th", "NLU"] },
    { id: "nift", name: "NIFT Entrance", full: "National Institute of Fashion Technology", icon: "🎨", color: "#f472b8", eligibility: "12th any stream", frequency: "Once a year (Jan)", conducted: "NIFT", desc: "Admission to B.Des, B.FTech programs at NIFT campuses across India.", url: "https://nift.ac.in/admission", tags: ["Design", "Fashion", "12th"] },
    { id: "nid", name: "NID DAT", full: "National Institute of Design Design Aptitude Test", icon: "✏️", color: "#38bdf8", eligibility: "12th any stream", frequency: "Once a year", conducted: "NID", desc: "Admission to B.Des programs at NID campuses. Tests creative and design aptitude.", url: "https://admissions.nid.edu/", tags: ["Design", "Creative", "12th"] },
    { id: "bitsat", name: "BITSAT", full: "BITS Admission Test", icon: "🔬", color: "#34d399", eligibility: "12th PCM, 75%+", frequency: "Once a year (May/June)", conducted: "BITS Pilani", desc: "Admission to integrated first-degree programs at BITS Pilani, Goa, and Hyderabad.", url: "https://www.bitsadmission.com/", tags: ["Engineering", "BITS", "12th"] },
    { id: "iat", name: "IAT", full: "IISER Aptitude Test", icon: "🔭", color: "#a855f7", eligibility: "12th PCM/PCB, top 20 percentile or JEE/NEET qualified", frequency: "Once a year (June)", conducted: "IISERs", desc: "Admission to 5-year BS-MS dual degree at IISERs — premier science research institutes in India.", url: "https://iiseradmission.in/", tags: ["Science", "Research", "12th"] },
    { id: "pessat", name: "PESSAT", full: "PES Scholastic Aptitude Test", icon: "🎓", color: "#34d399", eligibility: "12th PCM / PCB", frequency: "Once a year", conducted: "PES University Bengaluru", desc: "Admission to Engineering, MBA, and other programs at PES University, one of Karnataka's top private universities.", url: "https://pes.edu/pessat/", tags: ["Engineering", "Karnataka", "12th"] },
    { id: "dcet", name: "DCET", full: "Diploma CET Karnataka", icon: "🛠️", color: "#f59e0b", eligibility: "Diploma holders", frequency: "Once a year", conducted: "KEA Karnataka", desc: "Lateral entry to 2nd year Engineering for Diploma holders in Karnataka colleges.", url: "https://cetonline.karnataka.gov.in/kea/", tags: ["Engineering", "Lateral Entry", "Diploma"] },
  ],
  competitive: [
    { id: "upsc-cse", name: "UPSC CSE", full: "Civil Services Examination", icon: "🏛️", color: "#38bdf8", eligibility: "Any graduation, 21–32 yrs", frequency: "Once a year", conducted: "UPSC", desc: "The most prestigious exam in India. Recruits IAS, IPS, IFS, and other Group A & B officers.", url: "https://upsc.gov.in/", tags: ["Civil Services", "Graduate", "IAS"] },
    { id: "kpsc", name: "KPSC KAS", full: "Karnataka Public Service Commission", icon: "🎖️", color: "#34d399", eligibility: "Any graduation", frequency: "Irregular", conducted: "KPSC", desc: "Recruits KAS officers and other Group A & B state government positions in Karnataka.", url: "https://kpsc.kar.nic.in/", tags: ["Karnataka", "State Govt", "Graduate"] },
    { id: "ssc-cgl", name: "SSC CGL", full: "Staff Selection Commission Combined Graduate Level", icon: "📋", color: "#818cf8", eligibility: "Any graduation", frequency: "Once a year", conducted: "SSC", desc: "Recruits for Group B and C posts in central government ministries and departments.", url: "https://ssc.nic.in/", tags: ["Central Govt", "Graduate", "Group B/C"] },
    { id: "ssc-chsl", name: "SSC CHSL", full: "Staff Selection Commission Combined Higher Secondary Level", icon: "📝", color: "#f59e0b", eligibility: "12th pass", frequency: "Once a year", conducted: "SSC", desc: "Recruits for LDC, DEO, PA/SA posts in central govt. Open to 12th pass candidates.", url: "https://ssc.nic.in/", tags: ["Central Govt", "12th", "Group C"] },
    { id: "ssc-mts", name: "SSC MTS", full: "Staff Selection Commission Multi-Tasking Staff", icon: "🗂️", color: "#ef4444", eligibility: "10th pass, 18–27 yrs", frequency: "Once a year", conducted: "SSC", desc: "Central govt Group C posts open to 10th pass students. Good entry-level govt job.", url: "https://ssc.nic.in/", tags: ["Central Govt", "10th", "Group C"] },
    { id: "ibps-po", name: "IBPS PO", full: "Institute of Banking Personnel Selection — Probationary Officer", icon: "🏦", color: "#10b981", eligibility: "Any graduation, 20–30 yrs", frequency: "Once a year", conducted: "IBPS", desc: "Recruitment of Probationary Officers in public sector banks across India.", url: "https://www.ibps.in/", tags: ["Banking", "Graduate", "PO"] },
    { id: "ibps-clerk", name: "IBPS Clerk", full: "Institute of Banking Personnel Selection — Clerk", icon: "🏧", color: "#38bdf8", eligibility: "Any graduation", frequency: "Once a year", conducted: "IBPS", desc: "Recruitment of Clerical cadre in public sector banks. Good entry-level banking job.", url: "https://www.ibps.in/", tags: ["Banking", "Graduate", "Clerk"] },
    { id: "sbi-po", name: "SBI PO", full: "State Bank of India Probationary Officer", icon: "🏦", color: "#f472b8", eligibility: "Any graduation, 21–30 yrs", frequency: "Once a year", conducted: "SBI", desc: "One of the most sought-after banking jobs. PO at India's largest public sector bank.", url: "https://sbi.co.in/careers", tags: ["Banking", "SBI", "Graduate"] },
    { id: "rbi-grade-b", name: "RBI Grade B", full: "Reserve Bank of India Grade B Officer", icon: "💰", color: "#a855f7", eligibility: "Any graduation, 21–30 yrs", frequency: "Once a year", conducted: "RBI", desc: "One of the most prestigious banking jobs. Work at India's central bank.", url: "https://www.rbi.org.in/Scripts/Careers.aspx", tags: ["Banking", "RBI", "Graduate"] },
    { id: "rrb-ntpc", name: "RRB NTPC", full: "Railway Recruitment Board Non-Technical Popular Categories", icon: "🚂", color: "#34d399", eligibility: "12th or Graduation", frequency: "Every few years", conducted: "Railway Recruitment Board", desc: "Recruitment for station master, goods guard, junior clerk and other railway posts.", url: "https://indianrailways.gov.in/", tags: ["Railways", "12th", "Graduate"] },
    { id: "rrb-group-d", name: "RRB Group D", full: "Railway Recruitment Board Group D", icon: "🛤️", color: "#f59e0b", eligibility: "10th pass + ITI", frequency: "Every few years", conducted: "Railway Recruitment Board", desc: "Track maintainer, helper, gateman roles in Indian Railways. Open to 10th + ITI.", url: "https://indianrailways.gov.in/", tags: ["Railways", "10th", "ITI"] },
    { id: "nda", name: "NDA", full: "National Defence Academy", icon: "🎖️", color: "#ef4444", eligibility: "12th PCM (Army/Air Force), any (Navy)", frequency: "Twice a year", conducted: "UPSC", desc: "Join Indian Army, Navy, or Air Force as an officer after 12th. Prestigious career.", url: "https://upsc.gov.in/", tags: ["Defence", "12th", "Officer"] },
    { id: "cds", name: "CDS", full: "Combined Defence Services", icon: "🪖", color: "#818cf8", eligibility: "Graduation required", frequency: "Twice a year", conducted: "UPSC", desc: "Entry to IMA, INA, AFA, and OTA for commissioned officer posts in defence forces.", url: "https://upsc.gov.in/", tags: ["Defence", "Graduate", "Officer"] },
    { id: "cat", name: "CAT", full: "Common Admission Test", icon: "💼", color: "#10b981", eligibility: "Any graduation, 50%+", frequency: "Once a year (Nov/Dec)", conducted: "IIMs (rotational)", desc: "Gateway to IIMs and 1000+ MBA colleges. The most competitive management entrance.", url: "https://iimcat.ac.in/", tags: ["MBA", "Management", "Graduate"] },
  ],
  scholarship: [
    { id: "nsp", name: "NSP Scholarships", full: "National Scholarship Portal", icon: "🏆", color: "#38bdf8", eligibility: "Various — see portal", frequency: "Annual (Aug–Nov)", conducted: "Ministry of Education", desc: "Central govt scholarships for SC/ST/OBC/Minority students. Multiple schemes available.", url: "https://scholarships.gov.in/", tags: ["Scholarship", "Central Govt", "All levels"] },
    { id: "ssp", name: "SSP Karnataka", full: "State Scholarship Portal Karnataka", icon: "🎓", color: "#34d399", eligibility: "Karnataka students", frequency: "Annual", conducted: "Govt of Karnataka", desc: "Karnataka state scholarships for SC/ST/OBC/Minority students at all levels.", url: "https://ssp.karnataka.gov.in/", tags: ["Scholarship", "Karnataka", "All levels"] },
    { id: "inspire", name: "INSPIRE", full: "Innovation in Science Pursuit for Inspired Research", icon: "🔬", color: "#818cf8", eligibility: "Top 1% in 12th PCB/PCM", frequency: "Annual", conducted: "DST", desc: "Scholarship for science students in top colleges. ₹80,000/year for BSc/BS programs.", url: "https://online-inspire.gov.in/", tags: ["Scholarship", "Science", "12th"] },
    { id: "kvpy", name: "KVPY / SHE", full: "Kishore Vaigyanik Protsahan Yojana", icon: "⭐", color: "#f59e0b", eligibility: "10th–12th PCM/PCB", frequency: "Annual", conducted: "IISc", desc: "Fellowship for students interested in research careers in basic sciences.", url: "https://kvpy.iisc.ac.in/", tags: ["Scholarship", "Science", "Research"] },
    { id: "ca-foundation", name: "CA Foundation", full: "Chartered Accountancy Foundation", icon: "📊", color: "#ef4444", eligibility: "After 12th (Commerce/Science)", frequency: "Twice a year (May & Nov)", conducted: "ICAI", desc: "First step to becoming a Chartered Accountant — one of India's most prestigious financial qualifications.", url: "https://icai.org/", tags: ["CA", "Finance", "12th"] },
    { id: "cs-foundation", name: "CS Foundation", full: "Company Secretary Foundation", icon: "🏢", color: "#a855f7", eligibility: "After 12th any stream", frequency: "Twice a year", conducted: "ICSI", desc: "First step to becoming a Company Secretary — key role in corporate legal compliance.", url: "https://icsi.edu/", tags: ["CS", "Finance", "12th"] },
    { id: "pm-scholarship", name: "PM Scholarship Scheme", full: "Prime Minister's Scholarship Scheme", icon: "🏅", color: "#ef4444", eligibility: "Wards of ex-servicemen", frequency: "Annual", conducted: "Kendriya Sainik Board", desc: "Scholarships for wards of ex-servicemen/coastguard pursuing professional courses.", url: "https://ksb.gov.in/pmss.htm", tags: ["Scholarship", "Defence", "Professional"] },
    { id: "vidyadhan", name: "Vidyadhan", full: "Sarojini Damodaran Foundation", icon: "✨", color: "#a855f7", eligibility: "Merit-cum-need, 10th onward", frequency: "Annual", conducted: "Sarojini Damodaran Foundation", desc: "Multi-year scholarship for meritorious students from economically weaker sections.", url: "https://www.vidyadhan.org/", tags: ["Scholarship", "Merit", "Need-based"] },
  ],
};

const CATEGORIES = [
  { key: "all",         label: "All Exams",   icon: "📋", color: "#38bdf8" },
  { key: "entrance",    label: "Entrance",    icon: "🎓", color: "#818cf8" },
  { key: "competitive", label: "Competitive", icon: "🏆", color: "#f59e0b" },
  { key: "scholarship", label: "Scholarships",icon: "✨", color: "#34d399" },
];

const ALL_TAGS = ["All","10th","12th","Graduate","Engineering","Medical","Banking","Railways","Defence","Karnataka","CA","CS","Finance","Science","Scholarship","Research"];

export default function ExamsPage({ dark }) {
  const [category,  setCategory]  = useState("all");
  const [search,    setSearch]    = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const bg    = dark ? "#040b1c" : "#f8fafc";
  const text  = dark ? "#f1f5f9" : "#0f172a";
  const muted = dark ? "#64748b" : "#64748b";
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#fff";
  const cardBdr = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const metaBg  = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";

  const categoryColors = { entrance: "#818cf8", competitive: "#f59e0b", scholarship: "#34d399" };
  const categoryLabels = { entrance: "Entrance", competitive: "Competitive", scholarship: "Scholarship" };

  const allExams = [
    ...EXAMS.entrance.map(e => ({ ...e, category: "entrance" })),
    ...EXAMS.competitive.map(e => ({ ...e, category: "competitive" })),
    ...EXAMS.scholarship.map(e => ({ ...e, category: "scholarship" })),
  ];

  const filtered = allExams.filter(exam => {
    const matchCat    = category === "all" || exam.category === category;
    const matchTag    = activeTag === "All" || exam.tags.includes(activeTag);
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      exam.name.toLowerCase().includes(q) ||
      exam.full.toLowerCase().includes(q) ||
      exam.desc.toLowerCase().includes(q) ||
      exam.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchTag && matchSearch;
  });

  return (
    <section id="exams" style={{ minHeight: "100vh", background: bg, padding: "72px 1.25rem 100px" }}>
      <style>{CSS}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Hero ── */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            {/* Badge */}
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg,#38bdf822,#818cf822)",
              border: "1px solid #38bdf833",
              borderRadius: 40,
              padding: "5px 18px",
              fontSize: 11,
              fontWeight: 700,
              color: "#38bdf8",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 18,
            }}>
              📋 Exam Directory
            </div>

            <h1 style={{
              fontSize: "clamp(2.2rem,6vw,4rem)",
              fontFamily: "'Playfair Display',serif",
              fontWeight: 900,
              color: text,
              margin: "0 0 16px",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}>
              Find Your{" "}
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8,#f472b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Exam
              </span>
            </h1>

            <p style={{
              fontSize: "clamp(1rem,2.2vw,1.15rem)",
              color: muted,
              fontFamily: "'Lora',serif",
              maxWidth: 520,
              margin: "0 auto 28px",
              lineHeight: 1.85,
            }}>
              All entrance exams, competitive exams, and scholarships in one place — with direct links to official websites.
            </p>

            {/* Stats */}
            <div className="ep-stats">
              {[
                { label: "Entrance Exams",    value: EXAMS.entrance.length + "+" },
                { label: "Competitive Exams", value: EXAMS.competitive.length + "+" },
                { label: "Scholarships",      value: EXAMS.scholarship.length + "+" },
                { label: "Official Links",    value: "All ✓" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div className="ep-stat-val">{s.value}</div>
                  <div className="ep-stat-lbl" style={{ color: muted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Search ── */}
        <FadeIn delay={0.08}>
          <div style={{ position: "relative", maxWidth: 520, margin: "0 auto 36px" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 17, pointerEvents: "none" }}>🔍</span>
            <input
              type="text"
              placeholder="Search exams, subjects, eligibility..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                borderRadius: 14,
                padding: "13px 18px 13px 48px",
                color: text,
                fontFamily: "'Lora',serif",
                fontSize: "clamp(13px,2vw,15px)",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e  => e.target.style.borderColor = "#38bdf8"}
              onBlur={e   => e.target.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 16,
                color: muted, lineHeight: 1,
              }}>✕</button>
            )}
          </div>
        </FadeIn>

        {/* ── Category Filter ── */}
        <FadeIn delay={0.1}>
          <div className="ep-cat-row">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                style={{
                  background: category === cat.key
                    ? `linear-gradient(135deg,${cat.color},${cat.color}99)`
                    : (dark ? "rgba(255,255,255,0.05)" : "#fff"),
                  border: `1.5px solid ${category === cat.key ? "transparent" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
                  borderRadius: 12,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(12px,1.8vw,13px)",
                  color: category === cat.key ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
                  transition: "all 0.25s",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* ── Tag Filter ── */}
        <FadeIn delay={0.12}>
          <div className="ep-tag-row">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  background: activeTag === tag ? "#38bdf8" : (dark ? "rgba(255,255,255,0.05)" : "#fff"),
                  border: `1.5px solid ${activeTag === tag ? "#38bdf8" : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)")}`,
                  borderRadius: 20,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(10px,1.6vw,12px)",
                  color: activeTag === tag ? "#fff" : (dark ? "#64748b" : "#94a3b8"),
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* ── Result count ── */}
        <FadeIn>
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, color: muted, margin: 0 }}>
              Showing{" "}
              <span style={{ color: "#38bdf8", fontWeight: 800 }}>{filtered.length}</span>{" "}
              exam{filtered.length !== 1 ? "s" : ""}
              {search && <> for "<span style={{ color: text }}>{search}</span>"</>}
            </p>
            {(search || category !== "all" || activeTag !== "All") && (
              <button
                onClick={() => { setSearch(""); setCategory("all"); setActiveTag("All"); }}
                style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, padding: 0 }}
              >
                Clear ✕
              </button>
            )}
          </div>
        </FadeIn>

        {/* ── Exam Cards ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0" }}>
            <p style={{ fontSize: 44, marginBottom: 14 }}>🔍</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(1.1rem,2.5vw,1.3rem)", color: text, marginBottom: 8 }}>
              No exams found
            </p>
            <p style={{ fontFamily: "'Lora',serif", color: muted, fontSize: 14 }}>
              Try a different search term or clear the filters.
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); setActiveTag("All"); }}
              style={{ marginTop: 16, background: "#38bdf8", color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="ep-grid">
            {filtered.map((exam, i) => (
              <FadeIn key={exam.id} delay={i * 0.035}>
                <div
                  className="ep-card"
                  style={{
                    background: cardBg,
                    border: `1.5px solid ${cardBdr}`,
                    borderTop: `3px solid ${exam.color}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 40px ${exam.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 30 }}>{exam.icon}</span>
                    <span style={{
                      background: categoryColors[exam.category] + "18",
                      color: categoryColors[exam.category],
                      border: `1px solid ${categoryColors[exam.category]}30`,
                      fontSize: 10, padding: "3px 10px", borderRadius: 20,
                      fontFamily: "'Syne',sans-serif", fontWeight: 700, whiteSpace: "nowrap",
                    }}>
                      {categoryLabels[exam.category]}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(1rem,2.2vw,1.15rem)",
                      color: text,
                      margin: "0 0 3px",
                      lineHeight: 1.25,
                    }}>
                      {exam.name}
                    </h3>
                    <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: exam.color, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>
                      {exam.full}
                    </p>
                  </div>

                  {/* Description */}
                  <p style={{ fontFamily: "'Lora',serif", fontSize: "clamp(12px,1.8vw,13px)", color: dark ? "#94a3b8" : "#64748b", lineHeight: 1.75, margin: 0, flex: 1 }}>
                    {exam.desc}
                  </p>

                  {/* Meta */}
                  <div className="ep-meta-grid">
                    {[
                      { label: "Eligibility", value: exam.eligibility },
                      { label: "Frequency",   value: exam.frequency   },
                      { label: "Conducted by",value: exam.conducted,  full: true },
                    ].map(meta => (
                      <div key={meta.label} style={{
                        background: metaBg,
                        borderRadius: 8,
                        padding: "8px 10px",
                        gridColumn: meta.full ? "1 / -1" : "auto",
                      }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, color: dark ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                          {meta.label}
                        </div>
                        <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: dark ? "#cbd5e1" : "#334155", fontWeight: 500, lineHeight: 1.4 }}>
                          {meta.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {exam.tags.map(tag => (
                      <span
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        style={{
                          background: exam.color + "12",
                          color: exam.color,
                          border: `1px solid ${exam.color}25`,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 10,
                          fontFamily: "'Syne',sans-serif",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={exam.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      background: `linear-gradient(135deg,${exam.color},${exam.color}cc)`,
                      color: "#fff",
                      padding: "11px 20px",
                      borderRadius: 12,
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                      marginTop: "auto",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.87"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Visit Official Website ↗
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <FadeIn>
          <div style={{
            textAlign: "center",
            marginTop: 68,
            padding: "44px 24px",
            background: dark
              ? "linear-gradient(135deg,rgba(56,189,248,0.06),rgba(129,140,248,0.06))"
              : "linear-gradient(135deg,rgba(56,189,248,0.05),rgba(129,140,248,0.04))",
            borderRadius: 24,
            border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
          }}>
            <p style={{ fontSize: 38, marginBottom: 14 }}>🎯</p>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 900,
              fontSize: "clamp(1.3rem,3vw,1.9rem)",
              color: text,
              margin: "0 0 12px",
              lineHeight: 1.4,
            }}>
              Not sure which exam to target?
            </h2>
            <p style={{
              fontFamily: "'Lora',serif",
              color: muted,
              fontSize: "clamp(0.9rem,1.8vw,1rem)",
              maxWidth: 420,
              margin: "0 auto 22px",
              lineHeight: 1.85,
            }}>
              Ask our seniors — they've cleared these exams and can guide you personally.
            </p>
            <a href="#community" style={{
              background: "linear-gradient(135deg,#38bdf8,#818cf8)",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 14,
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-block",
            }}>
              Ask a Senior →
            </a>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
