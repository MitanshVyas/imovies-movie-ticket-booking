require('dotenv').config({ path: './.env' });
const axios = require('axios');

async function testBooking() {
    try {
        // Replace with a valid user token from your system
        const authToken = 'YOUR_AUTH_TOKEN';
        
        // Sample booking data - adjust according to your schema
        const bookingData = {
            bookingId: 'TEST' + Date.now(),
            showId: 'SHOW123',  // Replace with valid show ID
            ticketsData: [
                {
                    seatNumber: 'A12',
                    price: 250,
                    section: 'A'
                }
            ]
        };

        console.log('Sending test booking...');
        console.log('Using port 3000...');
        const response = await axios.post('http://localhost:3000/api/bookings/add', bookingData, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            }
        });

        console.log('✅ Booking created successfully!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ Error creating booking:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                },
                response: {
                    status: error.response?.status,
                    data: error.response?.data
                }
            });
        }
    } finally {
        process.exit(0);
    }
}

testBooking();
