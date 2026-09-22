const express = require('express');
const router = express.Router();
const { getSalons, assignPlan, getSubscriptionHistory, getMySalon } = require('../controllers/salonController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, authorize('SUPER_ADMIN'), getSalons);
router.post('/assign-plan', protect, authorize('SUPER_ADMIN'), assignPlan);
router.get('/subscription-history', protect, authorize('SUPER_ADMIN'), getSubscriptionHistory);
router.get('/my-salon', protect, authorize('SALON_OWNER', 'RECEPTIONIST'), getMySalon);

module.exports = router;
