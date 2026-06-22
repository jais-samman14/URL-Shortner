const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const urlRoutes = require('./routes/url');
const { checkDbConnection } = require('./config/db');
const { connectRedis } = require('./config/redis');

const app = express();

let isReady = false; 

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 60 * 1000,    // 1 minute
    max: 10,                 // 10 requests per minute
    message: { error: 'Too many requests, slow down!' }
});

app.use('/api/shorten', limiter);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: isReady ? 'ok' : 'starting' });
});

// Middleware to reject requests if not ready
app.use((req, res, next) => {
    if (!isReady) {
        return res.status(503).json({ error: 'Service is starting, please retry in a few seconds' });
    }
    next();
});

app.use('/api', urlRoutes);


const PORT = process.env.PORT || 8000;

async function startServer() {
    try {
        await checkDbConnection();
        console.log('Database ready');
        await connectRedis();
        // Redis connected
        isReady = true;
        console.log('Server is ready to accept traffic');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to initialise dependencies:', err);
        process.exit(1);
    }
}

startServer();
