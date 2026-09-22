const express = require('express');
const router = express.Router();
const { getClients, createClient } = require('../controllers/clientController');
const { protect, authorize } = require('../middlewares/auth');
const { checkSubscription } = require('../middlewares/subscription');

router.route('/')
  .get(protect, checkSubscription, authorize('SALON_OWNER', 'RECEPTIONIST'), getClients)
  .post(protect, checkSubscription, authorize('SALON_OWNER', 'RECEPTIONIST'), createClient);

module.exports = router;
