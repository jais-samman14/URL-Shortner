const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Error:', err));

async function connectRedis() {
    await client.connect();
    console.log('Redis Connected!');
    return client;
}

module.exports = { client, connectRedis };