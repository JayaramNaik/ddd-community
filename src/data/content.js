// ─────────────────────────────────────────────────────────────
//  src/data/content.js
//  All site content lives here.
//  To update text, mentors, scholarships, FAQs — edit THIS file.
// ─────────────────────────────────────────────────────────────

export const MENTORS = [
  {
    name: "Jayaram L Naik",
    college: "Information Science & Engineering",
    institution: "UVCE Bengaluru",
    interests: ["Yoga", "Hindustani Music", "Travelling", "Mythology", "History", "Current Affairs"],
    emoji: "🎓",
    gradientFrom: "#3b82f6",
    gradientTo: "#22d3ee",
  },
  {
    name: "Nagashree M Naik",
    college: "BCA",
    institution: "LBAS College, Sagar",
    interests: ["Drawing", "Singing", "Travelling", "Badminton 🏸", "Painting 🎨", "Cleaning"],
    emoji: "🌟",
    gradientFrom: "#a855f7",
    gradientTo: "#f472b6",
  },
  {
    name: "Naveen R Naik",
    college: "Mentor",
    institution: "",
    interests: ["Guidance", "Career Counselling", "Student Support"],
    emoji: "🚀",
    gradientFrom: "#10b981",
    gradientTo: "#2dd4bf",
  },
  {
    name: "Bhargav V Naik",
    college: "PUC (Science)",
    institution: "",
    interests: ["History", "Geography", "Travelling", "Volleyball"],
    emoji: "🌍",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
  },
];

export const GUIDANCE_AREAS = [
  { icon: "📚", title: "Academic Guidance",    desc: "Clear pathways for 10th, PUC, and degree students to excel academically." },
  { icon: "🏆", title: "Scholarship Awareness", desc: "Discover NSP, SSP, Vidyadhan, Vidyaposhak, and foundation scholarships tailored for you." },
  { icon: "💼", title: "Career Guidance",       desc: "Explore careers, streams, and opportunities aligned with your passion." },
  { icon: "📝", title: "Competitive Exams",     desc: "Preparation tips for NEET, JEE, CET, UPSC, and more." },
  { icon: "⚡", title: "Skill Development",     desc: "Build real-world skills that make you stand out in the crowd." },
  { icon: "🤝", title: "Mentorship & Support",  desc: "One-on-one guidance from seniors who've been in your shoes." },
];

export const SCHOLARSHIPS = [
  { name: "NSP Scholarship",        desc: "National Scholarship Portal — Central Govt scholarships for minority, OBC, SC/ST students.", badge: "Central Govt", url: "https://scholarships.gov.in/" },
  { name: "SSP Scholarship",        desc: "State Scholarship Portal — Karnataka state-level scholarships for eligible students.",        badge: "State Govt",   url: "https://sje.karnataka.gov.in/new/" },
  { name: "Vidyadhan",              desc: "Merit-cum-need based scholarship supporting students from economically weaker sections.",      badge: "Foundation",   url: "https://www.vidyadhan.org/" },
  { name: "Federal Bank Scholarship",desc: "Federal Bank scholarships supporting meritorious students across India.",        badge: "Bank",      url: "https://www.federalbank.co.in/personal/investments/scholarship" },
  { name: "Vidyaposhak",            desc: "Scholarship for students who have excelled in competitive exams, rewarding academic talent.", badge: "Competitive",  url: "https://vidyaposhak.rediffusion.com/" },
  { name: "More Coming Soon ✨",    desc: "We are constantly curating new scholarships. Stay tuned for regular updates!",               badge: "Soon",         url: null },
];

export const FAQS = [
  { q: "Who can join this community?",         a: "Any student after 10th, PUC, or pursuing a degree who needs academic or career guidance." },
  { q: "Is this community free to join?",      a: "Yes! Completely free. Our seniors volunteer their time to help juniors succeed." },
  { q: "How do I get mentorship?",             a: "Once you join, you can post your questions in discussion rooms or connect with a mentor directly." },
  { q: "What kind of scholarships are covered?",a: "We cover NSP, SSP, Vidyadhan, foundation scholarships, and the Vidyaposhak competitive scholarship." },
  { q: "Can I become a mentor too?",           a: "Absolutely! If you're a senior who wants to guide others, reach out and join our mentor team." },
];

export const COMMUNITY_TABS = [
  { key: "intros",  icon: "🙋", label: "Introductions", color: "#38bdf8", placeholder: "Your name, where you're from, what you're studying, your goals...", hint: "Tell the community who you are!", emptyMsg: "No introductions yet — be the first to say hello! 👋" },
  { key: "discuss", icon: "💬", label: "Discussions",   color: "#818cf8", placeholder: "Start a discussion — about stream selection, college life, study tips...", hint: "Ask or share anything academic or career related.", emptyMsg: "No discussions yet — kick things off! 💡" },
  { key: "doubts",  icon: "❓", label: "Ask Doubts",    color: "#f472b6", placeholder: "What's confusing you? Any question is valid here...", hint: "No question is too small. We all started somewhere.", emptyMsg: "No doubts posted yet. Ask away, we're here! 🤝" },
  { key: "opps",    icon: "📢", label: "Opportunities", color: "#34d399", placeholder: "Share a scholarship, internship, workshop, or any useful opportunity...", hint: "Help the community grow by sharing what you find!", emptyMsg: "No opportunities shared yet — share something useful! 🌟" },
];

export const WHATSAPP_LINK = "https://chat.whatsapp.com/LpUzYQdW7mhFR5kgxirpgE";

export const NAV_LINKS = ["About", "Mentors", "Guidance", "Scholarships", "Community", "FAQ"];
