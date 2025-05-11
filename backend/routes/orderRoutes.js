const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Add a single order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add multiple orders (bulk)
router.post('/bulk', async (req, res) => {
  try {
    const orders = await Order.insertMany(req.body);
    res.status(201).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 