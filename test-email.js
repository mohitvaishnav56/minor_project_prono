import "dotenv/config.js";
import "dotenv/config.js";
import sendEmail from "./src/utils/nodemailer.js";

const testEmail = async () => {
    // defaults to the FROM email if no argument provided, or you can hardcode a target for testing
    const targetEmail = process.argv[2] || process.env.SENDGRID_FROM_EMAIL;

    if (!targetEmail) {
        console.error("Please provide an email address as an argument or set SENDGRID_FROM_EMAIL");
        process.exit(1);
    }

    console.log(`Sending test email to: ${targetEmail}`);

    try {
        await sendEmail(
            targetEmail,
            "Test Email from Minor Project",
            "This is a test email to verify delivery.",
            "<strong>This is a test email</strong> to verify delivery."
        );
        console.log("Test email sequence completed. Check SendGrid dashboard and your inbox.");
    } catch (error) {
        console.error("Test failed:", error);
    }
};

testEmail();
