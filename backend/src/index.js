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

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}, but not ready yet`);
});

// Initialise DB and Redis
(async function init() {
    try {
        // Test DB connection with a simple query
        await promisePool.query('SELECT 1');
        console.log('Database ready');
        await connectRedis();
        console.log('Redis ready');
        isReady = true;
        console.log('🚀 Server is now fully ready to accept traffic');
    } catch (err) {
        console.error('Initialisation failed:', err);
        server.close(() => process.exit(1));
    }
})();