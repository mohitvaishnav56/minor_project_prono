// utils/sendgrid.util.js
import sgMail from "@sendgrid/mail";

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM = process.env.SENDGRID_FROM_EMAIL || process.env.SENDGRID_FROM;

if (SENDGRID_KEY) {
  sgMail.setApiKey(SENDGRID_KEY);
} else {
  console.warn("⚠️ SENDGRID_API_KEY not set — SendGrid disabled.");
}

/**
 * Send via SendGrid. Throws on error.
 * @param {string[]} toArray
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 */
export const sendViaSendGrid = async (toArray, subject, text, html) => {
  if (!SENDGRID_KEY || !SENDGRID_FROM) {
    throw new Error("SendGrid not configured (missing API key or from email).");
  }

  const msg = {
    to: toArray,
    from: {
      email: SENDGRID_FROM,
      name: process.env.SENDGRID_FROM_NAME || "Voicy Challenge Bot",
    },
    subject,
    text,
    html,
  };

  // sgMail.send returns promise; for multiple recipients it may behave slightly different
  return sgMail.send(msg);
};
