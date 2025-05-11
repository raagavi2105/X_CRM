const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); 