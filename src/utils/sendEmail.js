// ─────────────────────────────────────────────────────────────
//  src/utils/sendEmail.js
//  All emails via EmailJS REST API (browser safe, no CORS issues)
// ─────────────────────────────────────────────────────────────

import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_OTP_TEMPLATE_ID,
  EMAILJS_ANNOUNCEMENT_TEMPLATE_ID,
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
        subject:  "Your DDD Community OTP",
        title:    "Login OTP",
        subtitle: "Use the code below to sign in to DDD Community.",
        icon:     "🔐",
        message:  `Use ${code} to sign in. This code is valid for 5 minutes.`,
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
  const notificationTemplateId = EMAILJS_ANNOUNCEMENT_TEMPLATE_ID && EMAILJS_ANNOUNCEMENT_TEMPLATE_ID !== "your_template_id_here"
    ? EMAILJS_ANNOUNCEMENT_TEMPLATE_ID
    : EMAILJS_TEMPLATE_ID;

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: notificationTemplateId,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: {
        subject:  "New visitor notification",
        title:    "New visitor signed in",
        subtitle: "A visitor has signed in to DDD Community.",
        icon:      "👤",
        name:      visitor.displayName,
        message:   `New visitor signed in:\n\nName: ${visitor.displayName}\nContact: ${visitor.contact}\nMethod: ${visitor.method}\nTime: ${visitor.time}`,
        time:      visitor.time,
        email:     visitor.contact,
      },
    }),
  });
  if (!response.ok) throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
}

// ─────────────────────────────────────────────────────────────
//  Announcement email — sends to a single user via a dedicated announcement template
//  Falls back to the OTP template only when announcement template is not configured
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

  const announcementTemplateId = EMAILJS_ANNOUNCEMENT_TEMPLATE_ID && EMAILJS_ANNOUNCEMENT_TEMPLATE_ID !== "your_template_id_here"
    ? EMAILJS_ANNOUNCEMENT_TEMPLATE_ID
    : null;

  const templateId = announcementTemplateId || EMAILJS_TEMPLATE_ID;
  const messageContent = `
${typeEmoji} ${data.title}

${data.message}

${data.link ? `🔗 Link: ${data.link}` : `🌐 Visit: ${SITE_URL}`}

— DDD Community Team
Dream • Decide • Dominate
  `.trim();

  const templateParams = {
    to_email: data.to_email,
    subject:  `${typeEmoji} ${data.title}`,
    title:    data.title,
    subtitle: `You have a new ${data.type} from DDD Community.`,
    icon:     typeEmoji,
    message:  data.message,
    link:     data.link || SITE_URL,
    time:     new Date().toLocaleString("en-IN"),
  };

  if (!announcementTemplateId) {
    // Fallback to generic / OTP-style template fields when no dedicated announcement template is configured
    templateParams.otp_code = messageContent;
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  });

  if (!response.ok) throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
}
