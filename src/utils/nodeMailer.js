import nodeMailer from "nodemailer";
// Create a test account or replace with real credentials.

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
    },
    connectionTimeout: 60000, // 60 seconds
    family: 4, // Force IPv4 to avoid IPv6 timeout issues
})

export default transporter;