const express = require('express');
const router = express.Router();
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');

// Get all segments
router.get('/', async (req, res) => {
  try {
    const segments = await Segment.find().sort({ createdAt: -1 });
    res.json(segments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new segment
router.post('/', async (req, res) => {
  try {
    const segment = new Segment(req.body);
    await segment.save();
    res.status(201).json(segment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a segment
router.put('/:id', async (req, res) => {
  try {
    const segment = await Segment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!segment) {
      return res.status(404).json({ error: 'Segment not found' });
    }
    res.json(segment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a segment
router.delete('/:id', async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    if (!segment) {
      return res.status(404).json({ error: 'Segment not found' });
    }
    res.json({ message: 'Segment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get customers in a segment
router.get('/:id/customers', async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ error: 'Segment not found' });
    }

    let query = {};
    const { field, operator, value } = segment.criteria;

    switch (operator) {
      case 'equals':
        query[field] = value;
        break;
      case 'not_equals':
        query[field] = { $ne: value };
        break;
      case 'contains':
        query[field] = { $regex: value, $options: 'i' };
        break;
      case 'greater_than':
        query[field] = { $gt: Number(value) };
        break;
      case 'less_than':
        query[field] = { $lt: Number(value) };
        break;
      case 'between':
        const [min, max] = value.split(',').map(Number);
        query[field] = { $gte: min, $lte: max };
        break;
    }

    const customers = await Customer.find(query);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enhanced automatic segmentation analytics with customer lists
router.get('/auto-groups', async (req, res) => {
  try {
    const customers = await Customer.find();
    const now = new Date();

    // Helper to map customers to minimal info
    const mapCustomer = c => ({ name: c.name, email: c.email, phone: c.phone });

    // Spend groups
    const spendGroups = {
      High: {
        count: customers.filter(c => c.totalSpend > 15000).length,
        customers: customers.filter(c => c.totalSpend > 15000).map(mapCustomer),
      },
      Medium: {
        count: customers.filter(c => c.totalSpend > 7000 && c.totalSpend <= 15000).length,
        customers: customers.filter(c => c.totalSpend > 7000 && c.totalSpend <= 15000).map(mapCustomer),
      },
      Low: {
        count: customers.filter(c => c.totalSpend <= 7000).length,
        customers: customers.filter(c => c.totalSpend <= 7000).map(mapCustomer),
      },
    };

    // Visits groups
    const visitGroups = {
      Frequent: {
        count: customers.filter(c => c.visits > 6).length,
        customers: customers.filter(c => c.visits > 6).map(mapCustomer),
      },
      Occasional: {
        count: customers.filter(c => c.visits > 2 && c.visits <= 6).length,
        customers: customers.filter(c => c.visits > 2 && c.visits <= 6).map(mapCustomer),
      },
      Rare: {
        count: customers.filter(c => c.visits <= 2).length,
        customers: customers.filter(c => c.visits <= 2).map(mapCustomer),
      },
    };

    // Last Active groups
    const activeThreshold = 1000 * 60 * 60 * 24 * 30; // 30 days
    const lastActiveGroups = {
      Active: {
        count: customers.filter(c => c.lastActive && (now - new Date(c.lastActive)) <= activeThreshold).length,
        customers: customers.filter(c => c.lastActive && (now - new Date(c.lastActive)) <= activeThreshold).map(mapCustomer),
      },
      Inactive: {
        count: customers.filter(c => !c.lastActive || (now - new Date(c.lastActive)) > activeThreshold).length,
        customers: customers.filter(c => !c.lastActive || (now - new Date(c.lastActive)) > activeThreshold).map(mapCustomer),
      },
    };

    res.json({ spendGroups, visitGroups, lastActiveGroups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getStats = arr => {
  if (!arr.length) return { mean: 0, median: 0, min: 0, max: 0, stddev: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = sorted.length % 2 === 0 ? (sorted[sorted.length/2-1] + sorted[sorted.length/2])/2 : sorted[Math.floor(sorted.length/2)];
  const min = sorted[0];
  const max = sorted[sorted.length-1];
  const stddev = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
  return { mean, median, min, max, stddev };
};

const getHistogram = (arr, bins) => {
  if (!arr.length) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const binSize = (max - min) / bins;
  const hist = Array(bins).fill(0);
  arr.forEach(val => {
    let idx = Math.floor((val - min) / binSize);
    if (idx === bins) idx = bins - 1;
    hist[idx]++;
  });
  return hist.map((count, i) => ({
    range: `${(min + i*binSize).toFixed(0)}-${(min + (i+1)*binSize).toFixed(0)}`,
    count
  }));
};

const getTopBottom = (arr, key, n = 5) => {
  const sorted = [...arr].sort((a, b) => b[key] - a[key]);
  return {
    top: sorted.slice(0, n).map(c => ({ name: c.name, email: c.email, phone: c.phone, value: c[key] })),
    bottom: sorted.slice(-n).map(c => ({ name: c.name, email: c.email, phone: c.phone, value: c[key] })),
  };
};

const getMonthlyTrend = (arr, key, months = 12) => {
  const now = new Date();
  const trend = Array(months).fill(0).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months-1-i), 1);
    return { month: `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}`, value: 0 };
  });
  arr.forEach(c => {
    if (c.lastActive) {
      const d = new Date(c.lastActive);
      const idx = months - 1 - ((now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth()));
      if (idx >= 0 && idx < months) trend[idx].value += c[key] || 0;
    }
  });
  return trend;
};

const getCorrelation = (arr, key1, key2) => {
  if (!arr.length) return 0;
  const mean1 = arr.reduce((a, b) => a + (b[key1] || 0), 0) / arr.length;
  const mean2 = arr.reduce((a, b) => a + (b[key2] || 0), 0) / arr.length;
  const numerator = arr.reduce((sum, c) => sum + ((c[key1]||0) - mean1) * ((c[key2]||0) - mean2), 0);
  const denom1 = Math.sqrt(arr.reduce((sum, c) => sum + Math.pow((c[key1]||0) - mean1, 2), 0));
  const denom2 = Math.sqrt(arr.reduce((sum, c) => sum + Math.pow((c[key2]||0) - mean2, 2), 0));
  return denom1 && denom2 ? numerator / (denom1 * denom2) : 0;
};

// Advanced analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const customers = await Customer.find();
    const now = new Date();
    // Recency in days
    const recencies = customers.map(c => c.lastActive ? Math.floor((now - new Date(c.lastActive)) / (1000*60*60*24)) : null).filter(x => x !== null);
    const spends = customers.map(c => c.totalSpend || 0);
    const visits = customers.map(c => c.visits || 0);

    // Stats
    const spendStats = getStats(spends);
    const visitStats = getStats(visits);
    const recencyStats = getStats(recencies);

    // Top/bottom
    const spendTopBottom = getTopBottom(customers, 'totalSpend');
    const visitTopBottom = getTopBottom(customers, 'visits');
    const recencyTopBottom = getTopBottom(customers.filter(c => c.lastActive), 'lastActive');

    // Histograms
    const spendHist = getHistogram(spends, 6);
    const visitHist = getHistogram(visits, 6);
    const recencyHist = getHistogram(recencies, 6);

    // Trends (sum per month)
    const spendTrend = getMonthlyTrend(customers, 'totalSpend');
    const visitTrend = getMonthlyTrend(customers, 'visits');

    // Correlations
    const spendVisitCorr = getCorrelation(customers, 'totalSpend', 'visits');
    const spendRecencyCorr = getCorrelation(customers, 'totalSpend', 'lastActive');
    const visitRecencyCorr = getCorrelation(customers, 'visits', 'lastActive');

    res.json({
      spend: { stats: spendStats, topBottom: spendTopBottom, hist: spendHist, trend: spendTrend },
      visits: { stats: visitStats, topBottom: visitTopBottom, hist: visitHist, trend: visitTrend },
      recency: { stats: recencyStats, topBottom: recencyTopBottom, hist: recencyHist },
      correlations: {
        spend_vs_visits: spendVisitCorr,
        spend_vs_recency: spendRecencyCorr,
        visits_vs_recency: visitRecencyCorr,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 