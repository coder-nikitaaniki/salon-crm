const Salon = require('../models/Salon');

const checkSubscription = async (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN') {
    return next(); // Super admin bypasses
  }
  
  if (!req.user.salonId) {
    return res.status(403).json({ error: 'NO_SALON', message: 'User is not associated with any salon' });
  }

  const salon = await Salon.findById(req.user.salonId);
  if (!salon) {
    return res.status(404).json({ error: 'SALON_NOT_FOUND' });
  }

  const now = new Date();
  if (salon.subscriptionStatus !== 'ACTIVE' || (salon.subscriptionEndDate && salon.subscriptionEndDate < now)) {
    return res.status(403).json({ 
      error: 'SUBSCRIPTION_EXPIRED', 
      message: 'Your subscription has expired. Please contact the administrator to renew your plan.' 
    });
  }

  next();
};

module.exports = { checkSubscription };
