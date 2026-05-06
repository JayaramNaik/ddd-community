// ─────────────────────────────────────────────────────────────
//  src/utils/sendEmail.js
//  Handles sending emails via EmailJS REST API.
//  No external SDK script needed — uses plain fetch().
// ─────────────────────────────────────────────────────────────

import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
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
