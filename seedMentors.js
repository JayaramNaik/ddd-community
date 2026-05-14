// ─────────────────────────────────────────────────────────────
//  seedMentors.js  (run ONCE from project root)
//  Pushes your existing mentors from content.js into Firestore
//  Run: node seedMentors.js
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4ifYlzrOgNoxMclW8112dJ16cz6FXyTA",
  authDomain: "ddd-community.firebaseapp.com",
  projectId: "ddd-community",
  storageBucket: "ddd-community.firebasestorage.app",
  messagingSenderId: "431570026371",
  appId: "1:431570026371:web:121e057c34a5bc2081c0b6"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const MENTORS = [
  {
    name: "Jayaram L Naik",
    college: "Information Science & Engineering",
    institution: "UVCE Bengaluru",
    interests: ["Yoga", "Hindustani Music", "Travelling", "Mythology", "History", "Current Affairs"],
    emoji: "🎓",
    gradientFrom: "#3b82f6",
    gradientTo: "#22d3ee",
    status: "approved",
    email: "dddcommunity123@gmail.com",
  },
  {
    name: "Nagashree M Naik",
    college: "BCA",
    institution: "LBAS College, Sagar",
    interests: ["Drawing", "Singing", "Travelling", "Badminton 🏸", "Painting 🎨", "Cleaning"],
    emoji: "🌟",
    gradientFrom: "#a855f7",
    gradientTo: "#f472b6",
    status: "approved",
    email: "",
  },
  {
    name: "Naveen R Naik",
    college: "Mentor",
    institution: "",
    interests: ["Guidance", "Career Counselling", "Student Support"],
    emoji: "🚀",
    gradientFrom: "#10b981",
    gradientTo: "#2dd4bf",
    status: "approved",
    email: "",
  },
  {
    name: "Bhargav V Naik",
    college: "PUC (Science)",
    institution: "",
    interests: ["History", "Geography", "Travelling", "Volleyball"],
    emoji: "🌍",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    status: "approved",
    email: "",
  },
];

async function seed() {
  console.log("Seeding mentors to Firestore...");
  for (const mentor of MENTORS) {
    const ref = await addDoc(collection(db, "mentors"), {
      ...mentor,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Added: ${mentor.name} (${ref.id})`);
  }
  console.log("🎉 All mentors seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
