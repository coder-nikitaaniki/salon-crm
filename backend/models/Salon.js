const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  allowedRadius: { type: Number, default: 100 }, // in meters
  currentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },
  subscriptionStatus: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Salon', salonSchema);
