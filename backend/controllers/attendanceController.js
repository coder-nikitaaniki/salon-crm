const Attendance = require('../models/Attendance');
const Salon = require('../models/Salon');

// Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
};

const checkIn = async (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'MISSING_COORDINATES', message: 'Latitude and longitude are required.' });
  }

  const salon = await Salon.findById(req.user.salonId);
  if (!salon || !salon.latitude || !salon.longitude) {
    return res.status(400).json({ error: 'SALON_CONFIG_ERROR', message: 'Salon location not configured.' });
  }

  const distance = getDistance(latitude, longitude, salon.latitude, salon.longitude);
  
  if (distance <= salon.allowedRadius) {
    const attendance = await Attendance.create({
      staffId: req.user._id,
      salonId: salon._id,
      latitude,
      longitude,
      status: 'CHECKED_IN'
    });
    res.json({ message: 'Check-in successful', distance, attendance });
  } else {
    res.status(403).json({ error: 'OUT_OF_RANGE', message: 'You are too far from the salon to check in.' });
  }
};

module.exports = { checkIn };
