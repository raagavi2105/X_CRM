import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  Divider,
  useTheme,
  Paper,
} from '@mui/material';
import { TrendingUp, Users, Clock, BarChart2, ArrowUpRight, ArrowDownRight, Info, Link2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const statLabels = {
  mean: 'Average',
  median: 'Typical',
  min: 'Minimum',
  max: 'Maximum',
  stddev: 'Variation',
};

const metricMeta = {
  spend: {
    label: 'Customer Spend',
    icon: <TrendingUp color="#22c55e" size={32} />,
    color: '#22c55e',
    unit: '₹',
  },
  visits: {
    label: 'Customer Visits',
    icon: <Users color="#3b82f6" size={32} />,
    color: '#3b82f6',
    unit: '',
  },
  recency: {
    label: 'Recency (days since last active)',
    icon: <Clock color="#f59e42" size={32} />,
    color: '#f59e42',
    unit: '',
  },
};

const correlationMeta = {
  spend_vs_visits: {
    label: 'Spend vs Visits',
    icon: <Link2 color="#3b82f6" size={28} />,
    color: '#3b82f6',
  },
  spend_vs_recency: {
    label: 'Spend vs Recency',
    icon: <Link2 color="#8b5cf6" size={28} />,
    color: '#8b5cf6',
  },
  visits_vs_recency: {
    label: 'Visits vs Recency',
    icon: <Link2 color="#f59e42" size={28} />,
    color: '#f59e42',
  },
};

const interpretCorrelation = (value) => {
  if (Math.abs(value) > 0.7) return 'Strong';
  if (Math.abs(value) > 0.4) return 'Moderate';
  if (Math.abs(value) > 0.2) return 'Weak';
  return 'None';
};

const StatsBlock = ({ stats, unit }) => (
  <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ my: 1 }}>
    {Object.entries(stats).map(([key, value]) => (
      <Box key={key} sx={{ textAlign: 'center', minWidth: 80 }}>
        <Typography variant="caption" color="text.secondary">{statLabels[key]}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {unit}{typeof value === 'number' ? value.toFixed(2) : value}
        </Typography>
      </Box>
    ))}
  </Stack>
);

const TopBottomTable = ({ data, metric, unit }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Top 5</Typography>
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: '#f6fafd' }}>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>{unit ? metricMeta[metric].label : ''}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.top.map((row, idx) => (
            <TableRow key={idx} hover sx={{ '&:hover': { background: '#e3f0fc' } }}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell align="right">{unit}{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>Bottom 5</Typography>
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: '#f6fafd' }}>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>{unit ? metricMeta[metric].label : ''}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.bottom.map((row, idx) => (
            <TableRow key={idx} hover sx={{ '&:hover': { background: '#e3f0fc' } }}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell align="right">{unit}{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const Histogram = ({ data, title, color }) => (
  <Box sx={{ my: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <BarChart2 size={20} color={color} />
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title} Histogram</Typography>
    </Stack>
    <Box sx={{ height: 220, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <XAxis dataKey="range" angle={-30} textAnchor="end" interval={0} height={50} />
          <YAxis allowDecimals={false} />
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

const TrendChart = ({ data, title, color }) => (
  <Box sx={{ my: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <TrendingUp size={20} color={color} />
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title} Trend (last 12 months)</Typography>
    </Stack>
    <Box sx={{ height: 220, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <XAxis dataKey="month" interval={0} angle={-30} textAnchor="end" height={50} />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

const CorrelationCard = ({ value, meta }) => (
  <Card sx={{ 
    mb: 2, 
    background: `linear-gradient(135deg, ${meta.color}15 0%, ${meta.color}30 100%)`,
    borderRadius: 3,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    minHeight: 120,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    }
  }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        {meta.icon}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: meta.color }}>{meta.label}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: meta.color }}>{value.toFixed(2)} ({interpretCorrelation(value)})</Typography>
          <Typography variant="caption" color="text.secondary">
            {interpretCorrelation(value) === 'Strong' && 'There is a strong relationship.'}
            {interpretCorrelation(value) === 'Moderate' && 'There is a moderate relationship.'}
            {interpretCorrelation(value) === 'Weak' && 'There is a weak relationship.'}
            {interpretCorrelation(value) === 'None' && 'No significant relationship.'}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const MetricSection = ({ metric, data }) => {
  const meta = metricMeta[metric];
  return (
    <Card sx={{ 
      mb: 4, 
      p: 2, 
      borderRadius: 3,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      background: 'white',
    }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {meta.icon}
          <Typography variant="h5" sx={{ fontWeight: 700, color: meta.color }}>{meta.label}</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <StatsBlock stats={data.stats} unit={meta.unit} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Histogram data={data.hist} title={meta.label} color={meta.color} />
          </Grid>
          {data.trend && (
            <Grid item xs={12} md={6}>
              <TrendChart data={data.trend} title={meta.label} color={meta.color} />
            </Grid>
          )}
        </Grid>
        <TopBottomTable data={data.topBottom} metric={metric} unit={meta.unit} />
      </CardContent>
    </Card>
  );
};

const SegmentationPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/segments/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1200, 
      mx: 'auto', 
      p: 3,
      background: '#f6fafd',
      minHeight: '100vh',
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a73e8' }}>
          Segmentation Analytics
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#5f6368' }}>
          Analyze your customer base with automatic segmentation, stats, and trends for smarter targeting.
        </Typography>
      </Box>
      {analytics && (
        <>
          <MetricSection metric="spend" data={analytics.spend} />
          <MetricSection metric="visits" data={analytics.visits} />
          <MetricSection metric="recency" data={analytics.recency} />
          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Link2 size={24} color="#1a73e8" />
              <span>Correlations & Insights</span>
            </Stack>
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(analytics.correlations).map(([key, value]) => (
              <Grid item xs={12} md={4} key={key}>
                <CorrelationCard value={value} meta={correlationMeta[key]} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SegmentationPage; 