import React from 'react';
import { Box, Paper, Typography, Stack, Button, Grid, Chip, Divider } from '@mui/material';
import { Megaphone, Users, Layers, Sparkles, Bell, Calendar, Plug, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Megaphone color="#1a73e8" size={36} />, // Campaigns
    title: 'Campaigns',
    desc: 'Create, manage, and track personalized marketing campaigns.',
    link: '#',
  },
  {
    icon: <Layers color="#f59e42" size={36} />, // Segmentation
    title: 'Segmentation',
    desc: 'Segment your customers with flexible, rule-based logic.',
    link: '#',
  },
  {
    icon: <Users color="#22c55e" size={36} />, // Audience
    title: 'Audience',
    desc: 'Manage and analyze your customer base in one place.',
    link: '#',
  },
  {
    icon: <Sparkles color="#a855f7" size={36} />, // AI Insights
    title: 'AI Insights',
    desc: 'Leverage AI for smart suggestions and campaign insights.',
    link: '#',
  },
  {
    icon: <Plug color="#06b6d4" size={36} />, // Integrations
    title: 'Integrations',
    desc: 'Connect with your favorite tools and platforms seamlessly.',
    link: '#',
  },
  {
    icon: <BarChart3 color="#f43f5e" size={36} />, // Reports & Analytics
    title: 'Reports & Analytics',
    desc: 'Visualize performance and gain actionable insights.',
    link: '#',
  },
];

const notifications = [
  {
    color: 'success',
    label: 'New high spender segment created',
    date: 'Today, 10:30 AM',
    lineColor: '#22c55e',
  },
  {
    color: 'warning',
    label: '10 inactive users re-engaged',
    date: 'Yesterday, 3:45 PM',
    lineColor: '#f59e42',
  },
  {
    color: 'info',
    label: 'Campaign "Summer Sale" completed',
    date: 'May 10, 2025',
    lineColor: '#3b82f6',
  },
];

const upcomingCampaigns = [
  {
    name: 'Summer Collection Launch',
    date: 'May 15, 2025',
    status: 'Scheduled',
    color: 'primary',
  },
  {
    name: 'VIP Member Exclusive',
    date: 'May 20, 2025',
    status: 'Ready',
    color: 'success',
  },
  {
    name: 'Re-engagement Campaign',
    date: 'May 25, 2025',
    status: 'Draft',
    color: 'warning',
  },
];

export default function HomePage() {
  return (
    <Box sx={{ background: '#f6fafd', minHeight: '100vh', py: 6, px: { xs: 2, md: 6 } }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" sx={{ color: '#1a73e8', letterSpacing: 1, mb: 1 }}>
          XCRM
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
          Customer Segmentation, Campaign Management, and AI Insights — all in one place.
        </Typography>
        <Typography variant="body1" sx={{ color: '#444', mb: 4, maxWidth: 700, mx: 'auto' }}>
          Welcome to your CRM! Easily segment your customers, launch personalized campaigns, and gain intelligent insights to grow your business.
        </Typography>
      </Box>
      <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center' }}>
        {features.map((f, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i} sx={{ display: 'flex' }}>
            <Paper sx={{ p: 3, borderRadius: 4, flex: 1, minWidth: 180, maxWidth: 320, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4, minHeight: 200 }}>
              <Box sx={{ mb: 2 }}>{f.icon}</Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, textAlign: 'center', width: '100%' }}>{f.title}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'center', width: '100%' }}>{f.desc}</Typography>
              <Button href={f.link} size="small" sx={{ mt: 'auto', textTransform: 'none', fontWeight: 600 }}>
                Learn more
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Stack spacing={4}>
        {/* Recent Notifications */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Bell color="#1a73e8" size={22} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Notifications
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {notifications.map((n, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box sx={{ width: 4, height: 36, borderRadius: 2, background: n.lineColor, mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{n.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{n.date}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
        {/* Upcoming Campaigns */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Calendar color="#1a73e8" size={22} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Upcoming Campaigns
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {upcomingCampaigns.map((c, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{c.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.date}</Typography>
                </Box>
                <Chip label={c.status} color={c.color} size="small" sx={{ fontWeight: 600, fontSize: 13 }} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
} 