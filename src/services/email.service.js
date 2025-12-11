// services/email.service.js
import { createGmailTransporter, sendViaNodemailer } from "../utils/nodemailer.js";
import messageStructure from "../prompts/messageStructure.js";

/**
 * email(userEmails, challengeTitle, challengeDescription, challengeDate, challengeLink)
 * Uses only Nodemailer (Gmail). Sends individual emails to each recipient for privacy.
 */
const email = async (userEmails, challengeTitle = "sample", challengeDescription = "xyz", challengeDate = new Date().toDateString(), challengeLink = "https://example.com") => {
  const recipients = Array.isArray(userEmails) ? userEmails : [userEmails];

  const htmlContent = messageStructure(
    challengeTitle,
    challengeDescription,
    challengeDate,
    challengeLink
  );

  const textContent = `Hey! A new challenge, "${challengeTitle}", is live. Check: ${challengeLink}`;

  const transporter = createGmailTransporter();
  if (!transporter) {
    throw new Error("Nodemailer transporter not configured. Set NODEMAILER_EMAIL and NODEMAILER_PASSWORD (App Password).");
  }

  try {
    // Try to send. If 465 fails because of network, attempt 587 fallback.
    try {
      const result = await sendViaNodemailer(transporter, recipients, `📢 New Challenge: ${challengeTitle} is Live!`, textContent, htmlContent);
      console.log("✅ Emails sent via Nodemailer (primary transporter).", result);
      return { provider: "nodemailer", result };
    } catch (errPrimary) {
      console.warn("⚠️ Primary Nodemailer send failed, trying fallback (587).", errPrimary && errPrimary.message);
      // Create fallback transporter (STARTTLS on 587)
      const fallback = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD
        }
      });
      const result2 = await sendViaNodemailer(fallback, recipients, `📢 New Challenge: ${challengeTitle} is Live!`, textContent, htmlContent);
      console.log("✅ Emails sent via Nodemailer (fallback 587).", result2);
      return { provider: "nodemailer-fallback", result: result2 };
    }
  } catch (err) {
    console.error("❌ Nodemailer final error:", err && (err.message || err.toString()));
    throw err;
  }
};

export default email;
