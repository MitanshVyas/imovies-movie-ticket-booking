console.log('Node.js version check:');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

console.log('\nEnvironment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '*** (exists) ***' : 'Not set');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Not set');

// Try to load .env file
require('dotenv').config({ path: './.env' });

console.log('\nAfter loading .env:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Still not set');
