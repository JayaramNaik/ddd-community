# Dream • Decide • Dominate 🎓

A student mentorship community website helping juniors make better academic, career, and life decisions.

---

## 📁 Project Structure

```
ddd-community/
├── src/
│   ├── components/         ← One file per section (each person can own one)
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Mentors.jsx
│   │   ├── Guidance.jsx
│   │   ├── Scholarships.jsx
│   │   ├── Community.jsx
│   │   ├── Guidelines.jsx
│   │   ├── FAQ.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── content.js      ← All text content (mentors, FAQs, scholarships etc.)
│   ├── hooks/
│   │   └── useInView.js    ← Scroll animation hook
│   ├── config/
│   │   └── emailjs.js      ← EmailJS keys (edit here only)
│   ├── utils/
│   │   └── sendEmail.js    ← Email sending logic
│   └── App.jsx             ← Root component, assembles everything
├── package.json
└── README.md
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## ✉️ Email Setup (EmailJS)

Open `src/config/emailjs.js` and fill in your keys:

```js
export const EMAILJS_SERVICE_ID  = "service_qougple";
export const EMAILJS_TEMPLATE_ID = "template_ak1yf8f";
export const EMAILJS_PUBLIC_KEY  = "Y-MYMd_AEqsMjbIQp";
```

---

## 👥 Who Owns What (Team Division)

| File | Owner |
|------|-------|
| `data/content.js` | Any team member — update text/data here |
| `components/Mentors.jsx` | Mentor profile updates |
| `components/Scholarships.jsx` | Scholarship info updates |
| `components/Community.jsx` | Community features |
| `components/Contact.jsx` | Form & email logic |
| `config/emailjs.js` | Admin only |

---

## 🛠 Tech Stack

- React 18
- Vite
- EmailJS (email sending)
- Artifact Storage API (community posts)
- Google Fonts (Playfair Display, Syne, Lora)

---

## 🌐 Deployment

Recommended: **Vercel** (free)
1. Push to GitHub
2. Connect repo on vercel.com
3. Deploy — done!
trigger
