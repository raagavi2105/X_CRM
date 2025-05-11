const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: [{ type: Object, required: true }], // Store rule logic as objects
  audienceSize: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  
}, { timestamps: true });



module.exports = mongoose.model('Campaign', campaignSchema); 