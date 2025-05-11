const Customer = require('../models/Customer');
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

// Update campaign creation route to set status to 'active' and initialize counts
router.post('/', async (req, res) => {
  try {
    const { name, rules } = req.body;
    const query = buildQuery(Array.isArray(rules) ? rules[0] : rules);
    const customers = await Customer.find(query);
    const audienceSize = customers.length;
    const campaign = new Campaign({
      name,
      rules,
      audienceSize,
      status: 'active',
      sent: 0,
      failed: 0,
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update send campaign route to update status and counts
router.post('/:id/send', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    // Simulate sending messages and update counts
    const sentCount = Math.floor(Math.random() * 100); // Simulate sent count
    const failedCount = Math.floor(Math.random() * 20); // Simulate failed count
    campaign.status = 'completed'; // Update status to completed
    campaign.sent = sentCount; // Update sent count
    campaign.failed = failedCount; // Update failed count
    await campaign.save();
    res.json({ sent: sentCount, failed: failedCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}); 