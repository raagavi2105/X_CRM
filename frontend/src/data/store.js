// Frontend-only data layer. Replaces the Render/MongoDB backend with
// localStorage-backed persistence so the CRM works as a static demo.
import { buildDemoCustomers } from './mockCustomers';

const CUSTOMERS_KEY = 'xcrm_customers_v1';
const CAMPAIGNS_KEY = 'xcrm_campaigns_v1';
const LOGS_KEY = 'xcrm_logs_v1';
const SEEDED_KEY = 'xcrm_seeded_v1';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (e.g. private mode) — demo still works in-memory for this session
  }
}

function evalRule(customer, rule) {
  if (!rule) return true;
  if (rule.logic && Array.isArray(rule.conditions)) {
    const results = rule.conditions.map((c) => evalRule(customer, c));
    return rule.logic === 'OR' ? results.some(Boolean) : results.every(Boolean);
  }
  const { field, operator, value } = rule;
  const cv = customer[field];
  const v = typeof value === 'string' && value !== '' && !isNaN(value) ? Number(value) : value;
  switch (operator) {
    case '>': return cv > v;
    case '>=': return cv >= v;
    case '<': return cv < v;
    case '<=': return cv <= v;
    case '==': return cv === v;
    case '!=': return cv !== v;
    default: return true;
  }
}

function matchCustomers(customers, rules) {
  const root = Array.isArray(rules) ? rules[0] : rules;
  return customers.filter((c) => evalRule(c, root));
}

function demoCampaignDefs() {
  return [
    { name: 'Summer Sale Blast', rules: { logic: 'AND', conditions: [{ field: 'totalSpend', operator: '>', value: 10000 }] }, daysAgo: 14 },
    { name: 'Win-back Inactive Users', rules: { logic: 'AND', conditions: [{ field: 'visits', operator: '<=', value: 2 }] }, daysAgo: 6 },
    { name: 'VIP Loyalty Rewards', rules: { logic: 'AND', conditions: [{ field: 'totalSpend', operator: '>', value: 15000 }, { field: 'visits', operator: '>', value: 5 }] }, daysAgo: 1 },
  ];
}

function seed() {
  const customers = buildDemoCustomers(genId);
  save(CUSTOMERS_KEY, customers);

  const campaigns = [];
  const logs = [];
  demoCampaignDefs().forEach((def) => {
    const matched = matchCustomers(customers, def.rules);
    const campaign = {
      _id: genId(),
      name: def.name,
      rules: [def.rules],
      audienceSize: matched.length,
      createdAt: new Date(Date.now() - def.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    };
    campaigns.push(campaign);
    matched.forEach((customer) => {
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
      logs.push({
        _id: genId(),
        campaign: campaign._id,
        customer: customer._id,
        status,
      });
    });
  });
  save(CAMPAIGNS_KEY, campaigns);
  save(LOGS_KEY, logs);
  save(SEEDED_KEY, true);
}

function ensureSeeded() {
  if (!load(SEEDED_KEY, false)) {
    seed();
  }
}

// ---- Customers ----

export function getCustomers() {
  ensureSeeded();
  return load(CUSTOMERS_KEY, []);
}

export function deleteCustomer(id) {
  const customers = getCustomers().filter((c) => c._id !== id);
  save(CUSTOMERS_KEY, customers);
  return customers;
}

// ---- Campaigns ----

export function getCampaigns() {
  ensureSeeded();
  const campaigns = load(CAMPAIGNS_KEY, []);
  return [...campaigns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function previewAudience(rules) {
  const customers = getCustomers();
  return matchCustomers(customers, rules).length;
}

export function createCampaign({ name, rules }) {
  const customers = getCustomers();
  const audienceSize = matchCustomers(customers, rules).length;
  const campaigns = load(CAMPAIGNS_KEY, []);
  const campaign = {
    _id: genId(),
    name,
    rules: Array.isArray(rules) ? rules : [rules],
    audienceSize,
    createdAt: new Date().toISOString(),
  };
  campaigns.push(campaign);
  save(CAMPAIGNS_KEY, campaigns);
  return campaign;
}

export function updateCampaign(id, { name, rules }) {
  const customers = getCustomers();
  const campaigns = load(CAMPAIGNS_KEY, []);
  const idx = campaigns.findIndex((c) => c._id === id);
  if (idx === -1) return null;
  const audienceSize = matchCustomers(customers, rules).length;
  campaigns[idx] = { ...campaigns[idx], name, rules: Array.isArray(rules) ? rules : [rules], audienceSize };
  save(CAMPAIGNS_KEY, campaigns);
  return campaigns[idx];
}

export function deleteCampaign(id) {
  const campaigns = load(CAMPAIGNS_KEY, []).filter((c) => c._id !== id);
  save(CAMPAIGNS_KEY, campaigns);
  const logs = load(LOGS_KEY, []).filter((l) => l.campaign !== id);
  save(LOGS_KEY, logs);
  return campaigns;
}

export function getCampaignStats() {
  ensureSeeded();
  const logs = load(LOGS_KEY, []);
  const result = {};
  logs.forEach((log) => {
    if (!result[log.campaign]) result[log.campaign] = { campaignId: log.campaign, sent: 0, failed: 0 };
    if (log.status === 'SENT') result[log.campaign].sent += 1;
    if (log.status === 'FAILED') result[log.campaign].failed += 1;
  });
  return Object.values(result);
}

export function sendCampaignMessage(campaignId) {
  const campaigns = load(CAMPAIGNS_KEY, []);
  const campaign = campaigns.find((c) => c._id === campaignId);
  if (!campaign) return { sent: 0, failed: 0 };
  const customers = getCustomers();
  const matched = matchCustomers(customers, campaign.rules);

  let logs = load(LOGS_KEY, []).filter((l) => l.campaign !== campaignId);
  let sent = 0;
  let failed = 0;
  matched.forEach((customer) => {
    const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
    if (status === 'SENT') sent += 1; else failed += 1;
    logs.push({ _id: genId(), campaign: campaignId, customer: customer._id, status });
  });
  save(LOGS_KEY, logs);
  return { sent, failed };
}

export function getFailedCustomers(campaignId) {
  const logs = load(LOGS_KEY, []).filter((l) => l.campaign === campaignId && l.status === 'FAILED');
  const customers = getCustomers();
  return logs
    .map((log) => customers.find((c) => c._id === log.customer))
    .filter(Boolean)
    .map((c) => ({ name: c.name, email: c.email, phone: c.phone }));
}

// Clears demo campaign data only (keeps the customer base) so the user can
// start fresh from an empty campaigns list.
export function resetCampaigns() {
  save(CAMPAIGNS_KEY, []);
  save(LOGS_KEY, []);
}

// ---- Segmentation analytics (mirrors the old backend's /segments/analytics) ----

const getStats = (arr) => {
  if (!arr.length) return { mean: 0, median: 0, min: 0, max: 0, stddev: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const stddev = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
  return { mean, median, min, max, stddev };
};

const getHistogram = (arr, bins) => {
  if (!arr.length) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const binSize = (max - min) / bins || 1;
  const hist = Array(bins).fill(0);
  arr.forEach((val) => {
    let idx = Math.floor((val - min) / binSize);
    if (idx === bins) idx = bins - 1;
    hist[idx]++;
  });
  return hist.map((count, i) => ({
    range: `${(min + i * binSize).toFixed(0)}-${(min + (i + 1) * binSize).toFixed(0)}`,
    count,
  }));
};

const getTopBottom = (arr, key, n = 5) => {
  const sorted = [...arr].sort((a, b) => b[key] - a[key]);
  return {
    top: sorted.slice(0, n).map((c) => ({ name: c.name, email: c.email, phone: c.phone, value: c[key] })),
    bottom: sorted.slice(-n).map((c) => ({ name: c.name, email: c.email, phone: c.phone, value: c[key] })),
  };
};

const getMonthlyTrend = (arr, key, months = 12) => {
  const now = new Date();
  const trend = Array(months).fill(0).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { month: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`, value: 0 };
  });
  arr.forEach((c) => {
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
  const numerator = arr.reduce((sum, c) => sum + ((c[key1] || 0) - mean1) * ((c[key2] || 0) - mean2), 0);
  const denom1 = Math.sqrt(arr.reduce((sum, c) => sum + Math.pow((c[key1] || 0) - mean1, 2), 0));
  const denom2 = Math.sqrt(arr.reduce((sum, c) => sum + Math.pow((c[key2] || 0) - mean2, 2), 0));
  return denom1 && denom2 ? numerator / (denom1 * denom2) : 0;
};

export function getSegmentAnalytics() {
  const customers = getCustomers();
  const now = new Date();
  const recencies = customers
    .map((c) => (c.lastActive ? Math.floor((now - new Date(c.lastActive)) / (1000 * 60 * 60 * 24)) : null))
    .filter((x) => x !== null);
  const spends = customers.map((c) => c.totalSpend || 0);
  const visits = customers.map((c) => c.visits || 0);

  const spendStats = getStats(spends);
  const visitStats = getStats(visits);
  const recencyStats = getStats(recencies);

  const spendTopBottom = getTopBottom(customers, 'totalSpend');
  const visitTopBottom = getTopBottom(customers, 'visits');

  const spendHist = getHistogram(spends, 6);
  const visitHist = getHistogram(visits, 6);
  const recencyHist = getHistogram(recencies, 6);

  const spendTrend = getMonthlyTrend(customers, 'totalSpend');
  const visitTrend = getMonthlyTrend(customers, 'visits');

  const spendVisitCorr = getCorrelation(customers, 'totalSpend', 'visits');
  const spendRecencyCorr = getCorrelation(
    customers.map((c) => ({ ...c, lastActive: c.lastActive ? Math.floor((now - new Date(c.lastActive)) / (1000 * 60 * 60 * 24)) : 0 })),
    'totalSpend',
    'lastActive'
  );
  const visitRecencyCorr = getCorrelation(
    customers.map((c) => ({ ...c, lastActive: c.lastActive ? Math.floor((now - new Date(c.lastActive)) / (1000 * 60 * 60 * 24)) : 0 })),
    'visits',
    'lastActive'
  );

  const customersWithRecency = customers
    .filter((c) => c.lastActive)
    .map((c) => ({ ...c, recency: Math.floor((now - new Date(c.lastActive)) / (1000 * 60 * 60 * 24)) }));

  return {
    spend: { stats: spendStats, topBottom: spendTopBottom, hist: spendHist, trend: spendTrend },
    visits: { stats: visitStats, topBottom: visitTopBottom, hist: visitHist, trend: visitTrend },
    recency: { stats: recencyStats, topBottom: getTopBottom(customersWithRecency, 'recency'), hist: recencyHist },
    correlations: {
      spend_vs_visits: spendVisitCorr,
      spend_vs_recency: spendRecencyCorr,
      visits_vs_recency: visitRecencyCorr,
    },
  };
}
