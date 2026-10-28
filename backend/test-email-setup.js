require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    // Create a test account (only needed for development)
    let testAccount = await nodemailer.createTestAccount();

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'true' || true,
        auth: {
            user: process.env.SMTP_USER || testAccount.user, // generated ethereal user
            pass: process.env.SMTP_PASS || testAccount.pass  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false // Only for testing with self-signed certificates
        }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Movie Booking System" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Send to yourself for testing
        subject: "Test Email from Movie Booking System",
        text: `This is a test email sent at ${new Date().toLocaleString()}`,
        html: `
            <h1>Test Email from Movie Booking System</h1>
            <p>This is a test email sent at ${new Date().toLocaleString()}</p>
            <p>If you can see this, your email configuration is working correctly!</p>
        `
    });

    console.log("Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    
    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV === 'test') {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}

testEmail().catch(console.error);
