const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Error:', err));
client.on('connect', () => console.log('Redis Connected!'));

client.connect();

module.exports = client;