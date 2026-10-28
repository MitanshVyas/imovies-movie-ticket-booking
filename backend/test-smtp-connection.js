require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

async function testSMTP() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER || 'saisunny5434@gmail.com',
            pass: process.env.SMTP_PASS
        }
    });

    try {
        // Verify connection configuration
        await transporter.verify();
        console.log('✅ Server is ready to take our messages');
        
        // Send test email
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER || 'saisunny5434@gmail.com',
            to: 'recipient@example.com',
            subject: 'SMTP Test',
            text: 'This is a test email'
        });
        
        console.log('✅ Test email sent:', info.messageId);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSMTP();
