// ─────────────────────────────────────────────────────────────
//  src/config/firebase.js
//  Firebase configuration for DDD Community
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4ifYlzrOgNoxMclW8112dJ16cz6FXyTA",
  authDomain: "ddd-community.firebaseapp.com",
  projectId: "ddd-community",
  storageBucket: "ddd-community.firebasestorage.app",
  messagingSenderId: "431570026371",
  appId: "1:431570026371:web:121e057c34a5bc2081c0b6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
