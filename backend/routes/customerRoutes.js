const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a single customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add multiple customers (bulk)
router.post('/bulk', async (req, res) => {
  try {
    const customers = await Customer.insertMany(req.body);
    res.status(201).json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 