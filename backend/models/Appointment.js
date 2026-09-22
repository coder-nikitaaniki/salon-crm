const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  service: { type: String, required: true }, // Simplifying Service model to just a string for the assessment
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Using User for staff for simplicity
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true }, // HH:mm
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], default: 'PENDING' },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
