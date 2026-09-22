const Appointment = require('../models/Appointment');
const Salon = require('../models/Salon');
const { parse, isBefore, isAfter, isEqual } = require('date-fns');

const createAppointment = async (req, res) => {
  const { clientName, service, staffId, date, startTime, endTime } = req.body;
  const salonId = req.user.salonId;

  // 1. Working hours validation (09:00 - 20:00)
  const openTimeStr = '09:00';
  const closeTimeStr = '20:00';
  
  const refDate = new Date();
  const start = parse(startTime, 'HH:mm', refDate);
  const end = parse(endTime, 'HH:mm', refDate);
  const open = parse(openTimeStr, 'HH:mm', refDate);
  const close = parse(closeTimeStr, 'HH:mm', refDate);

  if (isBefore(start, open) || isAfter(end, close)) {
    return res.status(400).json({ error: 'OUTSIDE_WORKING_HOURS', message: 'Appointment must be between 09:00 and 20:00' });
  }

  // 2. Staff conflict validation
  const existingAppointments = await Appointment.find({
    staffId,
    date,
    status: { $ne: 'CANCELLED' }
  });

  let conflict = false;
  for (let appt of existingAppointments) {
    const existingStart = parse(appt.startTime, 'HH:mm', refDate);
    const existingEnd = parse(appt.endTime, 'HH:mm', refDate);

    // Conflict logic: overlap means (start < existingEnd && end > existingStart)
    if (isBefore(start, existingEnd) && isAfter(end, existingStart)) {
      conflict = true;
      break;
    }
  }

  if (conflict) {
    return res.status(400).json({ error: 'STAFF_CONFLICT', message: 'Staff member has a conflicting appointment.' });
  }

  const appointment = await Appointment.create({
    clientName, service, staffId, date, startTime, endTime, salonId
  });

  res.status(201).json(appointment);
};

const getAppointments = async (req, res) => {
  const salonId = req.user.salonId;
  const date = req.query.date;

  let query = { salonId };
  if (date) query.date = date;

  const appointments = await Appointment.find(query).populate('staffId', 'name');
  res.json(appointments);
};

module.exports = { createAppointment, getAppointments };
