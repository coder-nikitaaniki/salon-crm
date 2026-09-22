const express = require('express');
const router = express.Router();
const { createPlan, getPlans } = require('../controllers/planController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(protect, authorize('SUPER_ADMIN'), createPlan)
  .get(protect, getPlans); // all authenticated users can get plans

module.exports = router;
