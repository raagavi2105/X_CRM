const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['SENT', 'FAILED'], required: true },
  message: { type: String, required: true },
  deliveryTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('CommunicationLog', communicationLogSchema); 