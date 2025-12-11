// services/email.service.js
import { sendViaSendGrid } from "../utils/sendgrid.js";
import { createGmailTransporter, sendViaNodemailer } from "../utils/nodemailer.js";
import messageStructure from "../prompts/messageStructure.js";

/**
 * email wrapper to match your previous usage:
 * email(userEmails, challengeTitle, challengeDescription, challengeDate, challengeLink)
 */
const email = async (userEmails, challengeTitle = "sample", challengeDescription = "xyz", challengeDate = new Date().toDateString(), challengeLink = "https://example.com") => {
  const recipients = Array.isArray(userEmails) ? userEmails : [userEmails];

  const htmlContent = messageStructure(
    challengeTitle,
    challengeDescription,
    challengeDate,
    challengeLink
  );

  const textContent = `Hey! A new challenge, "${challengeTitle}", is live. Check your app: ${challengeLink}`;

  const logError = (tag, err) => {
    console.error(`❌ [${tag}]`, err && err.message ? err.message : err);
    if (err && err.response && err.response.body) {
      console.error("   Response body:", err.response.body);
    } else if (err && err.stack) {
      console.error(err.stack);
    }
  };

  // Try SendGrid
  try {
    const resp = await sendViaSendGrid(recipients, `📢 New Challenge: ${challengeTitle} is Live!`, textContent, htmlContent);
    console.log("✅ Email sent via SendGrid:", resp?.[0]?.statusCode || "ok");
    return { provider: "sendgrid", result: resp };
  } catch (err) {
    logError("SendGrid Error", err);
  }

  // Fallback Nodemailer
  const transporter = createGmailTransporter();
  if (!transporter) {
    const errMsg = "No email provider available: SendGrid not configured or failed, and Nodemailer creds missing.";
    console.error("❌", errMsg);
    throw new Error(errMsg);
  }

  try {
    const info = await sendViaNodemailer(transporter, recipients, `📢 New Challenge: ${challengeTitle} is Live!`, textContent, htmlContent);
    console.log("✅ Email sent via Nodemailer (Gmail):", info?.messageId || info);
    return { provider: "nodemailer", result: info };
  } catch (err) {
    logError("Nodemailer Error", err);
    throw err;
  }
};

export default email;
