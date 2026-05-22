// ─────────────────────────────────────────────────────────────
//  src/config/emailjs.js
//  EmailJS credentials — ADMIN ONLY. Do not share publicly.
//  Get these from https://www.emailjs.com/
// ─────────────────────────────────────────────────────────────

export const EMAILJS_SERVICE_ID      = "service_qougple";
export const EMAILJS_TEMPLATE_ID     = "template_ak1yf8f";  // Contact Us / Visitor notifications → your Gmail
export const EMAILJS_OTP_TEMPLATE_ID = "template_uctaq7l";  // OTP Login → sends to user's email
export const EMAILJS_PUBLIC_KEY      = "Y-MYMd_AEqsMjbIQp";
export const RECEIVER_EMAIL          = "dddcommunity123@gmail.com";

// ── Announcement template ─────────────────────────────────────
// Create at emailjs.com → Email Templates → New Template
// Set To Email: {{to_email}}  |  Subject: {{subject}}  |  Body: {{message}}
// Then paste the template ID below:
export const EMAILJS_ANNOUNCEMENT_TEMPLATE_ID = "template_ak1yf8f";
