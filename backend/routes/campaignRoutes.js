const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');

// Utility to build MongoDB query from rules
function buildQuery(rule) {
  if (!rule) return {};
  if (rule.logic && rule.conditions) {
    const subQueries = rule.conditions.map(buildQuery);
    if (rule.logic === 'AND') return { $and: subQueries };
    if (rule.logic === 'OR') return { $or: subQueries };
  } else {
    // Simple condition
    const { field, operator, value } = rule;
    switch (operator) {
      case '>': return { [field]: { $gt: value } };
      case '>=': return { [field]: { $gte: value } };
      case '<': return { [field]: { $lt: value } };
      case '<=': return { [field]: { $lte: value } };
      case '==': return { [field]: value };
      case '!=': return { [field]: { $ne: value } };
      default: return {};
    }
  }
}

// Preview audience size
router.post('/preview', async (req, res) => {
  try {
    const { rules } = req.body;
    const query = buildQuery(rules);
    const count = await Customer.countDocuments(query);
    res.json({ audienceSize: count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Helper to simulate sending message and vendor callback
async function simulateVendorAPI(logId, customerName, res) {
  // Simulate 90% success, 10% fail
  const isSuccess = Math.random() < 0.9;
  const status = isSuccess ? 'SENT' : 'FAILED';
  // Simulate vendor callback (in real world, this would be an HTTP call)
  setTimeout(async () => {
    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      deliveryTime: new Date(),
    });
  }, 500 + Math.random() * 1000); // Simulate network delay
}

// Create campaign
router.post('/', async (req, res) => {
  try {
    const { name, rules, createdBy } = req.body;
    const query = buildQuery(rules);
    const customers = await Customer.find(query);
    const audienceSize = customers.length;
    const campaign = new Campaign({ name, rules, audienceSize, createdBy });
    await campaign.save();

    // For each customer, create a communication log and simulate delivery
    for (const customer of customers) {
      const message = `Hi ${customer.name}, here's 10% off on your next order!`;
      const log = await CommunicationLog.create({
        campaign: campaign._id,
        customer: customer._id,
        status: 'SENT', // Will be updated by vendor simulation
        message,
      });
      simulateVendorAPI(log._id, customer.name, res);
    }

    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delivery receipt endpoint
router.post('/receipt', async (req, res) => {
  try {
    const { logId, status } = req.body;
    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      deliveryTime: new Date(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all campaigns
router.get('/', async (req, res) => {
    try {
      const campaigns = await Campaign.find().sort({ createdAt: -1 });
      res.json(campaigns);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a campaign
router.delete('/:id', async (req, res) => {
    try {
      await Campaign.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Get delivery stats for all campaigns
router.get('/stats', async (req, res) => {
  try {
    const stats = await CommunicationLog.aggregate([
      {
        $group: {
          _id: { campaign: '$campaign', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);
    // Format: { campaignId, sent, failed }
    const result = {};
    stats.forEach(s => {
      const cid = s._id.campaign.toString();
      if (!result[cid]) result[cid] = { campaignId: cid, sent: 0, failed: 0 };
      if (s._id.status === 'SENT') result[cid].sent = s.count;
      if (s._id.status === 'FAILED') result[cid].failed = s.count;
    });
    res.json(Object.values(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get failed customers for a campaign
router.get('/:id/failed-customers', async (req, res) => {
  try {
    const logs = await CommunicationLog.find({ campaign: req.params.id, status: 'FAILED' }).populate('customer');
    const customers = logs.map(log => ({
      name: log.customer.name,
      email: log.customer.email,
      phone: log.customer.phone
    }));
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 