// ─────────────────────────────────────────────────────────────
//  src/utils/sendEmail.js
//  All emails via EmailJS REST API (browser safe, no CORS issues)
// ─────────────────────────────────────────────────────────────

import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_OTP_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "../config/emailjs.js";

const SITE_URL = "https://jayaramnaik.github.io/ddd-community/";

// ─────────────────────────────────────────────────────────────
//  Join request email
// ─────────────────────────────────────────────────────────────
export async function sendJoinEmail(formData) {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: {
        name:       formData.name.trim(),
        from_name:  formData.name.trim(),
        email:      formData.email.trim(),
        from_email: formData.email.trim(),
        reply_to:   formData.email.trim(),
        grade:      formData.grade || "Not specified",
        message:    formData.msg?.trim() || "No message provided",
        time:       new Date().toLocaleString("en-IN"),
      },
    }),
  });
  if (!response.ok) throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
}

// ─────────────────────────────────────────────────────────────
//  OTP email — sends to user directly
// ─────────────────────────────────────────────────────────────
export async function sendOtpEmail(email, code) {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: EMAILJS_OTP_TEMPLATE_ID,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: email,
        otp_code: code,
        time:     new Date().toLocaleString("en-IN"),
      },
    }),
  });
  if (!response.ok) throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
}

// ─────────────────────────────────────────────────────────────
//  Visitor notification — notifies admin
// ─────────────────────────────────────────────────────────────
export async function sendVisitorNotification(visitor) {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: {
        name:    visitor.displayName,
        message: `New visitor signed in:\n\nName: ${visitor.displayName}\nContact: ${visitor.contact}\nMethod: ${visitor.method}\nTime: ${visitor.time}`,
        time:    visitor.time,
        email:   visitor.contact,
      },
    }),
  });
  if (!response.ok) throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
}

// ─────────────────────────────────────────────────────────────
//  Announcement email — sends to a single user via OTP template
//  Uses OTP template with otp_code field for the message content
//  Call this in a loop for each registered user
// ─────────────────────────────────────────────────────────────
export async function sendAnnouncementEmail(data) {
  const typeEmoji = {
    announcement: "📢",
    scholarship:  "🏆",
    event:        "📅",
    alert:        "🚨",
    mentor:       "🎓",
  }[data.type] || "📢";

  // We reuse the OTP template but pass announcement content
  // Make sure your OTP template has {{to_email}} as recipient
  // and shows {{otp_code}} somewhere in the body
  // We put the full announcement in otp_code field
  const messageContent = `
${typeEmoji} ${data.title}

${data.message}

${data.link ? `🔗 Link: ${data.link}` : `🌐 Visit: ${SITE_URL}`}

— DDD Community Team
Dream • Decide • Dominate
  `.trim();

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: EMAILJS_OTP_TEMPLATE_ID,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: data.to_email,
        otp_code: messageContent,
        time:     new Date().toLocaleString("en-IN"),
      },
    }),
  });

  if (!response.ok) throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
}
