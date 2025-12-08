import transporter from "../utils/nodeMailer.js"
import messageStructure from "../prompts/messageStructure.js"
// You will pass the dynamic challenge data here
const email = async (userEmails, challengeTitle="sample", challengeDescription="xyz", challengeDate = new Date().getDate(), challengeLink = "https://www.youtube.com/watch?v=vZ0u6qw2rC8") => {
    
    // Generate the stylized HTML content
    const htmlContent = messageStructure(
        challengeTitle, 
        challengeDescription, 
        challengeDate, 
        challengeLink
    );

    const userEmailsMerged = userEmails.join(', ');
    
    const info = await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: userEmailsMerged,
        subject: `📢 New Challenge: ${challengeTitle} is Live!`,
        text: `Hey! A new challenge, "${challengeTitle}", is live. Check your app!`, // Plain-text fallback
        html: htmlContent, // The perfect HTML body
    });

    return info.messageId;
};

export default email;