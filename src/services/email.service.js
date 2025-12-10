import sendEmail from "../utils/sendgrid.js";
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

    // SendGrid can handle array of emails in 'to' field automatically
    // or send individually if Bcc is needed. 
    // Usually for privacy, we might want to use 'bcc' or send individual emails.
    // But assuming the previous logic was sending to all in 'to', we keep it consistent or improve it.
    // SendGrid's 'to' accepts an array.

    // NOTE: If userEmails is huge, we should batch it. For minor project, it's fine.
    // Also, putting everyone in 'to' exposes emails. 
    // BETTER PRACTICE: Put them in `bcc` or send separately.
    // I will stick to the previous behavior (joined string) but adapted for SendGrid (array).

    await sendEmail(
        userEmails, // SendGrid accepts ["a@b.com", "c@d.com"]
        `📢 New Challenge: ${challengeTitle} is Live!`,
        textContent,
        htmlContent
    );
};

export default email;