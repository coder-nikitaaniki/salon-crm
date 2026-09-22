const Plan = require('../models/Plan');

const createPlan = async (req, res) => {
  const plan = await Plan.create(req.body);
  res.status(201).json(plan);
};

const getPlans = async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
};

module.exports = { createPlan, getPlans };
