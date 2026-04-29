const db = require('../config/db');
const redis = require('../config/redis');
const { nanoid } = require('nanoid');

// POST /api/shorten
const shortenUrl = async (req, res) => {
    const { original_url, custom_alias } = req.body;

    if (!original_url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const short_code = custom_alias || nanoid(6);

        await db.execute(
            'INSERT INTO urls (original_url, short_code, custom_alias) VALUES (?, ?, ?)',
            [original_url, short_code, custom_alias || null]
        );

        // ✅ Redis mein cache karo — 24 hours ke liye
        await redis.setEx(short_code, 86400, original_url);

        return res.status(201).json({
            original_url,
            short_url: `http://localhost:8000/api/${short_code}`,
            short_code
        });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Alias already taken!' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/:shortCode
const redirectUrl = async (req, res) => {
    const { shortCode } = req.params;

    try {
        // ✅ Pehle Redis check karo
        const cachedUrl = await redis.get(shortCode);

        if (cachedUrl) {
            console.log('Cache HIT ✅');
            // click update karo background mein
            await db.execute(
                'UPDATE urls SET clicks = clicks + 1, last_accessed = NOW() WHERE short_code = ?',
                [shortCode]
            );
            return res.redirect(cachedUrl);
        }

        // ❌ Cache MISS — DB se fetch karo
        console.log('Cache MISS ❌ — fetching from DB');
        const [rows] = await db.execute(
            'SELECT * FROM urls WHERE short_code = ?',
            [shortCode]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // DB se mila toh Redis mein store karo
        await redis.setEx(shortCode, 86400, rows[0].original_url);

        await db.execute(
            'UPDATE urls SET clicks = clicks + 1, last_accessed = NOW() WHERE short_code = ?',
            [shortCode]
        );

        return res.redirect(rows[0].original_url);

    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/stats/:shortCode
const getStats = async (req, res) => {
    const { shortCode } = req.params;

    try {
        const [rows] = await db.execute(
            'SELECT short_code, original_url, clicks, created_at, last_accessed FROM urls WHERE short_code = ?',
            [shortCode]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.json(rows[0]);

    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { shortenUrl, redirectUrl, getStats };