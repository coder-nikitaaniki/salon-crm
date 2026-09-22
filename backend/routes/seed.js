const express = require('express');
const router = express.Router();
const { seedDb } = require('../controllers/seedController');

// In a real app this should be protected or disabled in production
router.post('/', seedDb);

module.exports = router;
