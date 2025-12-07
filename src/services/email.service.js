import transporter from "../utils/nodeMailer.js"

// You will pass the dynamic challenge data here
const email = async (userEmail, challengeTitle, challengeDescription, challengeDate, challengeLink) => {
    
    // Generate the stylized HTML content
    const htmlContent = createChallengeEmailHTML(
        challengeTitle, 
        challengeDescription, 
        challengeDate, 
        challengeLink
    );
    
    const info = await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: userEmail,
        subject: `📢 New Challenge: ${challengeTitle} is Live!`,
        text: `Hey! A new challenge, "${challengeTitle}", is live. Check your app!`, // Plain-text fallback
        html: htmlContent, // The perfect HTML body
    });

    return info.messageId;
};

export default email;