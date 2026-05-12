// ─────────────────────────────────────────────────────────────
//  src/utils/sendEmail.js
//  Handles sending emails via EmailJS REST API.
//  No external SDK script needed — uses plain fetch().
// ─────────────────────────────────────────────────────────────

import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_OTP_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "../config/emailjs.js";

/**
 * Send a join request email via EmailJS REST API.
 * @param {{ name: string, email: string, grade: string, msg: string }} formData
 * @returns {Promise<void>}
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
        grade:      formData.grade  || "Not specified",
        message:    formData.msg?.trim() || "No message provided",
        time:       new Date().toLocaleString("en-IN"),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS error ${response.status}: ${errorText}`);
  }
}

/**
 * Send a one-time password email via EmailJS.
 * @param {string} email
 * @param {string} code
 * @returns {Promise<void>}
 */
export async function sendOtpEmail(email, code) {
  // Uses a dedicated OTP template where "To Email" = {{to_email}}
  // This ensures the OTP goes to the USER, not the site owner
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_OTP_TEMPLATE_ID,   // dedicated OTP template
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email:  email,                       // goes TO the user
        otp_code:  code,
        time:      new Date().toLocaleString("en-IN"),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS error ${response.status}: ${errorText}`);
  }
}

/**
 * Notify the site owner about a visitor login event.
 * @param {{ contact: string, method: string, displayName: string, time: string }} visitor
 * @returns {Promise<void>}
 */
export async function sendVisitorNotification(visitor) {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        name:    visitor.displayName,
        message: `New visitor signed in:\n\nName: ${visitor.displayName}\nContact: ${visitor.contact}\nMethod: ${visitor.method}\nTime: ${visitor.time}`,
        time:    visitor.time,
        email:   visitor.contact,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS error ${response.status}: ${errorText}`);
  }
}
