const Salon = require('../models/Salon');
const SubscriptionHistory = require('../models/SubscriptionHistory');
const Plan = require('../models/Plan');

const getSalons = async (req, res) => {
  const salons = await Salon.find().populate('currentPlan');
  res.json(salons);
};

const assignPlan = async (req, res) => {
  const { salonId, planId, action } = req.body; // action = ASSIGN | RENEW | UPGRADE

  const salon = await Salon.findById(salonId);
  const plan = await Plan.findById(planId);

  if (!salon || !plan) {
    return res.status(404).json({ error: 'Not found' });
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.durationInDays);

  salon.currentPlan = planId;
  salon.subscriptionStartDate = startDate;
  salon.subscriptionEndDate = endDate;
  salon.subscriptionStatus = 'ACTIVE';

  await salon.save();

  const history = await SubscriptionHistory.create({
    salonId, planId, startDate, endDate, price: plan.price, action
  });

  res.json({ salon, history });
};

const getSubscriptionHistory = async (req, res) => {
  const history = await SubscriptionHistory.find().populate('salonId', 'name').populate('planId', 'name');
  res.json(history);
};

const getMySalon = async (req, res) => {
  if (!req.user.salonId) {
    return res.status(404).json({ error: 'No salon associated' });
  }
  const salon = await Salon.findById(req.user.salonId).populate('currentPlan');
  res.json(salon);
};

module.exports = { getSalons, assignPlan, getSubscriptionHistory, getMySalon };
