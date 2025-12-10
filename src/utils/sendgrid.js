import sgMail from '@sendgrid/mail';

// Set API Key from Environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email using SendGrid
 * @param {string|Array} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        const msg = {
            to,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: "Voicy Challenge Bot" 
            },
            subject,
            text,
            html,
            isMultiple: Array.isArray(to) && to.length > 1, // Sends individually to each recipient if it's an array
        };

        const response = await sgMail.send(msg);
        console.log("✅ Email sent via SendGrid:", response[0].statusCode);
        return response;

    } catch (error) {
        console.error("❌ SendGrid Error:", error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
};

export default sendEmail;
