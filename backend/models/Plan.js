const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationInDays: { type: Number, required: true },
  maxStaff: { type: Number, required: true },
  maxAppointments: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
