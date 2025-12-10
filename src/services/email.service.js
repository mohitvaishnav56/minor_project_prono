import sendEmail from "../utils/nodemailer.js"; // Switched to Nodemailer
import messageStructure from "../prompts/messageStructure.js";

const email = async (userEmails, challengeTitle = "sample", challengeDescription = "xyz", challengeDate = new Date().getDate(), challengeLink = "https://www.youtube.com/watch?v=vZ0u6qw2rC8") => {

    // Generate the stylized HTML content
    const htmlContent = messageStructure(
        challengeTitle,
        challengeDescription,
        challengeDate,
        challengeLink
    );

    const textContent = `Hey! A new challenge, "${challengeTitle}", is live. Check your app!`;

    // Note: Nodemailer handles arrays automatically (comma separated in 'To')
    // If privacy is a major concern with many users, we should use 'bcc' or loop.
    // For now, keeping consistent with previous behavior.

    await sendEmail(
        userEmails,
        `📢 New Challenge: ${challengeTitle} is Live!`,
        textContent,
        htmlContent
    );
};

export default email;