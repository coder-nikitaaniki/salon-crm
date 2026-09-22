const User = require('../models/User');
const Salon = require('../models/Salon');
const Plan = require('../models/Plan');

const seedDb = async (req, res) => {
  await User.deleteMany({});
  await Salon.deleteMany({});
  await Plan.deleteMany({});

  const plan = await Plan.create({
    name: 'Basic Plan',
    price: 50,
    durationInDays: 30,
    maxStaff: 5,
    maxAppointments: 100
  });

  const salon = await Salon.create({
    name: 'Demo Salon',
    address: '123 Main St',
    latitude: 37.7749, // Example SF coords
    longitude: -122.4194,
    allowedRadius: 100,
    currentPlan: plan._id,
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    subscriptionStatus: 'ACTIVE'
  });

  await User.create({
    name: 'Super Admin',
    email: 'admin@test.com',
    password: 'password',
    role: 'SUPER_ADMIN'
  });

  await User.create({
    name: 'Salon Owner',
    email: 'owner@test.com',
    password: 'password',
    role: 'SALON_OWNER',
    salonId: salon._id
  });

  await User.create({
    name: 'Receptionist',
    email: 'receptionist@test.com',
    password: 'password',
    role: 'RECEPTIONIST',
    salonId: salon._id
  });

  res.json({ message: 'Database seeded with test accounts: admin@test.com, owner@test.com, receptionist@test.com (password: password)' });
};

module.exports = { seedDb };
