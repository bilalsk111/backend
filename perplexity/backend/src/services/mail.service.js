import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientSecret: process.env.CLIENT_SECRET,
        clientId: process.env.CLIENT_ID,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

transporter.verify()
    .then(() => { console.log("Email transporter is ready"); })
    .catch((err) => { console.error("Email verification failed:", err); });

export async function sendEmail({ to, subject, html, text }) {
    try {
        const mailoptions = {
            from: process.env.EMAIL_USER,
            to: to,  
            subject: subject,
            html: html,
            text: text
        };

        const details = await transporter.sendMail(mailoptions); 
        console.log("Email sent successfully:", details.messageId);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}