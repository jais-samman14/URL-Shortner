const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getStats } = require('../controllers/urlController');

router.post('/shorten', shortenUrl);
router.get('/:shortCode', redirectUrl);
router.get('/stats/:shortCode', getStats);

module.exports = router;