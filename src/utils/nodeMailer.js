import nodeMailer from "nodemailer";
// Create a test account or replace with real credentials.

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
})

export default transporter;