require('dotenv').config();
const { sendMail } = require('./utils/mailer');

async function testBookingEmail() {
    try {
        // Test booking data
        const bookingData = {
            to: 'user@example.com', // Replace with actual user email
            subject: '🎟️ Test Booking Confirmation #TEST123',
            bookingId: 'TEST123',
            movieName: 'Test Movie',
            theatreName: 'Test Theatre',
            showdate: '2025-08-28',
            showtime: '18:00',
            seats: ['A1', 'A2'],
            userName: 'Test User'
        };

        console.log('Sending test booking email to:', bookingData.to);
        
        await sendMail({
            to: bookingData.to,
            subject: bookingData.subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>🎬 Movie Ticket Booking Confirmation</h2>
                    <p>Hello ${bookingData.userName},</p>
                    <p>Your booking has been confirmed! Here are your booking details:</p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <h3>${bookingData.movieName}</h3>
                        <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
                        <p><strong>Theater:</strong> ${bookingData.theatreName}</p>
                        <p><strong>Date:</strong> ${bookingData.showdate}</p>
                        <p><strong>Time:</strong> ${bookingData.showtime}</p>
                        <p><strong>Seats:</strong> ${bookingData.seats.join(', ')}</p>
                    </div>
                    
                    <p>Thank you for choosing our service!</p>
                    <p>Best regards,<br>Movie Ticket Booking Team</p>
                </div>
            `,
            text: `
                MOVIE TICKET BOOKING CONFIRMATION
                
                Hello ${bookingData.userName},
                
                Your booking has been confirmed! Here are your booking details:
                
                Movie: ${bookingData.movieName}
                Booking ID: ${bookingData.bookingId}
                Theater: ${bookingData.theatreName}
                Date: ${bookingData.showdate}
                Time: ${bookingData.showtime}
                Seats: ${bookingData.seats.join(', ')}
                
                Thank you for choosing our service!
                
                Best regards,
                Movie Ticket Booking Team
            `
        });

        console.log('✅ Test booking email sent successfully!');
    } catch (error) {
        console.error('❌ Error sending test booking email:', error.message);
    } finally {
        process.exit(0);
    }
}

// Run the test
testBookingEmail();
