require('dotenv').config({ path: './.env' });
const { sendMail } = require('./utils/mailer');

async function testEmail() {
    try {
        console.log('Sending test email...');
        const result = await sendMail({
            to: 'recipient@example.com',  // Replace with actual email
            subject: 'Test Email from Movie Booking System',
            text: 'This is a test email from the Movie Booking System.\n\nIf you received this, the email system is working correctly!',
            html: `
            <h1>Test Email from Movie Booking System</h1>
            <p>This is a test email from the Movie Booking System.</p>
            <p>If you received this, the email system is working correctly!</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
            `
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', result.messageId);
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
    } finally {
        // Close any open connections
        process.exit(0);
    }
}

// Run the test
testEmail();
