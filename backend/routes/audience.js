const express = require('express');
const router = express.Router();
const Audience = require('../models/Audience'); // Assuming Audience is the model

// Get all audience data
router.get('/audience', async (req, res) => {
  try {
    const audiences = await Audience.find(); // Fetch all audience data
    res.status(200).json(audiences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audience data' });
  }
});

module.exports = router;