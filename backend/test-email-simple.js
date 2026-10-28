require('dotenv').config();
const { sendMail } = require('./utils/mailer');
const jwt = require('jsonwebtoken');

// Get the token from command line arguments or use a default test token
const token = process.argv[2] || 'your-test-jwt-token';

async function testEmail() {
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'SSC');
    const userEmail = decoded.userDetails.email;
    
    if (!userEmail) {
      throw new Error('No user email found in token');
    }

    console.log(`Sending test email to: ${userEmail}`);
    
    const result = await sendMail({
      to: userEmail, // Use the logged-in user's email
      subject: 'Test Email from Movie Booking',
      text: 'This is a test email to verify SMTP configuration',
      html: `
        <h1>Test Email</h1>
        <p>Hello ${decoded.userDetails.name || 'User'},</p>
        <p>This is a test email to verify SMTP configuration</p>
        <p>This email was sent to: ${userEmail}</p>
      `
    });
    
    console.log('✅ Email sent successfully!', result.messageId);
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    if (error.name === 'JsonWebTokenError') {
      console.error('Invalid token. Please provide a valid JWT token.');
      console.log('\nUsage: node test-email-simple.js "your-jwt-token"');
    }
  }
}

testEmail();
