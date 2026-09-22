const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/auth');
const { checkSubscription } = require('../middlewares/subscription');

router.route('/')
  .post(protect, checkSubscription, authorize('SALON_OWNER', 'RECEPTIONIST'), createAppointment)
  .get(protect, checkSubscription, authorize('SALON_OWNER', 'RECEPTIONIST'), getAppointments);

module.exports = router;
