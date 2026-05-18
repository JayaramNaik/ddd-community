// ─────────────────────────────────────────────────────────────
//  src/utils/sendEmail.js
//  EmailJS  → OTP, join requests, visitor notifications
//  Resend   → Announcement emails to all users (3000/mo free)
// ─────────────────────────────────────────────────────────────

import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_OTP_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "../config/emailjs.js";

// ── Resend config ─────────────────────────────────────────────
const RESEND_API_KEY  = "re_FA2J83zj_F5ZBzxBV3nEj7APKTPGsgSar";
const RESEND_FROM     = "DDD Community <onboarding@resend.dev>";
const SITE_URL        = "https://jayaramnaik.github.io/ddd-community/";

// ─────────────────────────────────────────────────────────────
//  EmailJS functions (OTP, join, visitor)
// ─────────────────────────────────────────────────────────────

/**
 * Send a join request email via EmailJS.
 */
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

/**
 * Send OTP email via EmailJS.
 */
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

/**
 * Notify admin about a visitor login.
 */
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
//  Resend function — Announcement emails
// ─────────────────────────────────────────────────────────────

/**
 * Send an announcement email to a single user via Resend.
 * Call this in a loop for all registered users.
 * @param {{ to_email: string, title: string, message: string, link?: string, type: string }} data
 */
export async function sendAnnouncementEmail(data) {
  const typeEmoji = {
    announcement: "📢",
    scholarship:  "🏆",
    event:        "📅",
    alert:        "🚨",
    mentor:       "🎓",
  }[data.type] || "📢";

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#fefce8;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:520px;margin:0 auto;padding:24px;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#d97706,#b45309);padding:24px;border-radius:16px;text-align:center;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;letter-spacing:1px;">D • D • D</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Dream • Decide • Dominate</p>
        </div>

        <!-- Badge -->
        <div style="text-align:center;margin-bottom:16px;">
          <span style="display:inline-block;background:rgba(217,119,6,0.12);border:1px solid rgba(217,119,6,0.3);color:#b45309;font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;letter-spacing:0.08em;text-transform:uppercase;">
            ${typeEmoji} ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}
          </span>
        </div>

        <!-- Content card -->
        <div style="background:#fff;border:1px solid rgba(217,119,6,0.2);border-radius:16px;padding:28px;margin-bottom:20px;">
          <h2 style="color:#78350f;margin:0 0 14px;font-size:20px;font-weight:800;line-height:1.3;">
            ${data.title}
          </h2>
          <p style="color:#92400e;line-height:1.8;margin:0 0 20px;font-size:15px;">
            ${data.message.replace(/\n/g, "<br>")}
          </p>

          ${data.link ? `
          <a href="${data.link}"
            style="display:inline-block;background:linear-gradient(135deg,#d97706,#b45309);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
            Learn More →
          </a>` : `
          <a href="${SITE_URL}"
            style="display:inline-block;background:linear-gradient(135deg,#d97706,#b45309);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
            Visit DDD Community →
          </a>`}
        </div>

        <!-- Footer -->
        <div style="text-align:center;padding-top:16px;border-top:1px solid rgba(217,119,6,0.15);">
          <p style="color:#c9a96a;font-size:12px;margin:0 0 6px;">
            Sent from DDD Community · ${new Date().toLocaleString("en-IN")}
          </p>
          <a href="${SITE_URL}" style="color:#d97706;font-size:12px;text-decoration:none;">
            jayaramnaik.github.io/ddd-community
          </a>
        </div>

      </div>
    </body>
    </html>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from:    RESEND_FROM,
      to:      [data.to_email],
      subject: `${typeEmoji} ${data.title} — DDD Community`,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error ${response.status}: ${errorText}`);
  }
}
