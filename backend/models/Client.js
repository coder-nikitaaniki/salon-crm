const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
