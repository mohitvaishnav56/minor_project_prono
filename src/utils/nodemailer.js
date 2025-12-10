import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

/**
 * Sends an email using Nodemailer (Gmail SMTP)
 * @param {string|Array} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        // If 'to' is an array, join it for the header, or send individually loop depending on preference.
        // Nodemailer accepts comma-separated string or array of strings.

        const mailOptions = {
            from: `"Voicy Challenge Bot" <${process.env.GMAIL_USER}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent via Nodemailer:", info.messageId);
        return info;

    } catch (error) {
        console.error("❌ Nodemailer Error:", error);
        throw error;
    }
};

export default sendEmail;
