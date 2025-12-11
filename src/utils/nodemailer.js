// utils/nodemailer.util.js
import nodemailer from "nodemailer";

const GMAIL_USER = process.env.NODEMAILER_EMAIL || process.env.GMAIL_USER;
const GMAIL_PASS = process.env.NODEMAILER_PASSWORD || process.env.GMAIL_APP_PASSWORD;

/**
 * Create and return a Nodemailer transporter or null if not configured.
 */
export const createGmailTransporter = () => {
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.warn("⚠️ Nodemailer Gmail credentials not set (NODEMAILER_EMAIL / NODEMAILER_PASSWORD).");
    return null;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS, // App Password if account has 2FA
    },
    // optional: tls: { rejectUnauthorized: false } // not recommended globally
  });

  return transporter;
};

/**
 * Send using given transporter.
 * @param {import('nodemailer').Transporter} transporter
 * @param {string[]} toArray
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 */
export const sendViaNodemailer = async (transporter, toArray, subject, text, html) => {
  if (!transporter) throw new Error("Transporter not provided");

  const mailOptions = {
    from: `"Voicy Challenge Bot" <${GMAIL_USER}>`,
    to: toArray.join(", "),
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};
