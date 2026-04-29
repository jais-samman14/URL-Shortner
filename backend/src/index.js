const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const urlRoutes = require('./routes/url');
const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 60 * 1000,    // 1 minute
    max: 10,                 // 10 requests per minute
    message: { error: 'Too many requests, slow down!' }
});

app.use('/api/shorten', limiter);
app.use('/api', urlRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});