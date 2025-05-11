import React, { useState } from 'react';
import { Box, Paper, Typography, Stack, Button, IconButton, Divider } from '@mui/material';
import { TrendingUp, Users, MessageSquare, Gift, RefreshCw, Copy, ChevronRight } from 'lucide-react';

const promptOptions = [
  {
    key: 'highSpenders',
    icon: <TrendingUp color="#22c55e" size={24} />, // green
    label: 'Campaign for high spenders',
    color: '#e6f9f0',
    border: '#b6f0d3',
    textColor: '#15803d',
  },
  {
    key: 'inactiveUsers',
    icon: <Users color="#f59e42" size={24} />, // orange
    label: 'Re-engagement for inactive users',
    color: '#fff7e6',
    border: '#ffe0b2',
    textColor: '#b45309',
  },
  {
    key: 'frequentVisitors',
    icon: <MessageSquare color="#3b82f6" size={24} />, // blue
    label: 'Upsell to frequent visitors',
    color: '#e6f0fa',
    border: '#b3d4fc',
    textColor: '#1d4ed8',
  },
  {
    key: 'festiveOffer',
    icon: <Gift color="#a855f7" size={24} />, // purple
    label: 'Festive offer message',
    color: '#f3e8ff',
    border: '#d8b4fe',
    textColor: '#7c3aed',
  },
];

const ruleBasedSuggestions = {
  highSpenders: [
    'Unlock exclusive VIP rewards for our top customers! Enjoy a special 20% discount on your next premium purchase.',
    'Thank you for being our valued high-tier customer! Here\'s a VIP offer just for you: Free priority shipping on all orders this month.',
    'As one of our premium customers, you deserve the very best. Claim your complimentary luxury gift with your next order over $100!'
  ],
  inactiveUsers: [
    'We miss you! Come back and enjoy a special 15% welcome-back discount on your next purchase.',
    'It\'s been a while since your last visit! Here\'s an exclusive offer to make your return worthwhile: 20% off site-wide.',
    'Your account has been inactive recently. Reactivate now and get a surprise coupon worth up to $50!'
  ],
  frequentVisitors: [
    'We appreciate your loyalty! Earn double loyalty points on all purchases this week as our way of saying thanks.',
    'Thanks for being a regular! Enjoy an exclusive buy-one-get-one-free offer on select premium items.',
    'Frequent shoppers like you get early VIP access to our new arrivals. Check them out now before they\'re available to everyone else!'
  ],
  festiveOffer: [
    'Celebrate the holiday season with 25% off our entire festive collection! Use code HOLIDAY25 at checkout.',
    'Wishing you joy and incredible savings! Use code FESTIVE20 for a special 20% discount on all seasonal items.',
    'Spread the holiday cheer—gift your loved ones with our exclusive festive bundle deals! Buy 3, get 1 free on all gift sets.'
  ],
};

export default function AISuggestionPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handlePromptSelect = (key) => {
    setSelectedPrompt(key);
    setSuggestions(ruleBasedSuggestions[key]);
    setCopiedIndex(null);
  };

  const handleRegenerate = () => {
    if (selectedPrompt) {
      setSuggestions([...ruleBasedSuggestions[selectedPrompt]].sort(() => Math.random() - 0.5));
      setCopiedIndex(null);
    }
  };

  const handleCopy = (msg, idx) => {
    navigator.clipboard.writeText(msg);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Box sx={{ background: '#f6fafd', minHeight: '100vh', py: 6 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a73e8', textAlign: 'center' }}>
          AI Campaign Suggestions
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#5f6368', textAlign: 'center', mb: 4 }}>
          Get smart, AI-powered campaign ideas and messages tailored to your customer segments.
        </Typography>
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}>
            <ChevronRight size={20} style={{ marginRight: 8, color: '#facc15' }} />
            Campaign Ideas
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Select a campaign type below to get AI-generated suggestions tailored to your audience segments:
          </Typography>
          <Stack spacing={2}>
            {promptOptions.map((opt, idx) => (
              <Paper
                key={opt.key}
                elevation={selectedPrompt === opt.key ? 6 : 1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  border: selectedPrompt === opt.key ? `2px solid ${opt.border}` : '1px solid #e0e7ef',
                  background: selectedPrompt === opt.key ? opt.color : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => handlePromptSelect(opt.key)}
              >
                <Box sx={{ mr: 2 }}>{opt.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: selectedPrompt === opt.key ? opt.textColor : '#222' }}>
                  {opt.label}
                </Typography>
                {selectedPrompt === opt.key && <ChevronRight size={20} style={{ marginLeft: 'auto', color: opt.textColor }} />}
              </Paper>
            ))}
          </Stack>
        </Paper>

        {selectedPrompt && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                {promptOptions.find(p => p.key === selectedPrompt)?.icon}
                <span style={{ marginLeft: 8 }}>{promptOptions.find(p => p.key === selectedPrompt)?.label}</span>
              </Typography>
              <Button startIcon={<RefreshCw size={18} />} onClick={handleRegenerate} sx={{ textTransform: 'none' }}>
                Refresh
              </Button>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {suggestions.map((msg, idx) => (
                <Paper key={idx} sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: copiedIndex === idx ? '#e0f7fa' : '#f9fafb' }} elevation={1}>
                  <MessageSquare color="#1a73e8" size={20} style={{ marginRight: 12 }} />
                  <Typography variant="body1" sx={{ flex: 1 }}>{msg}</Typography>
                  <IconButton onClick={() => handleCopy(msg, idx)} color={copiedIndex === idx ? 'success' : 'default'}>
                    {copiedIndex === idx ? 'Copied!' : <Copy size={18} />}
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
