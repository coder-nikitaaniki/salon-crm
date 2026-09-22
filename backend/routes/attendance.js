const express = require('express');
const router = express.Router();
const { checkIn } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/auth');
const { checkSubscription } = require('../middlewares/subscription');

router.post('/check-in', protect, checkSubscription, authorize('SALON_OWNER', 'RECEPTIONIST'), checkIn);

module.exports = router;
