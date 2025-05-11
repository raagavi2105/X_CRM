import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Stack, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ContactsIcon from '@mui/icons-material/Contacts';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const navItems = [
  { label: 'Home', icon: <HomeIcon sx={{ mr: 1 }} />, to: '/' },
  { label: 'Campaigns', icon: <CampaignIcon sx={{ mr: 1 }} />, to: '/campaigns' },
  { label: 'Segmentation', icon: <GroupWorkIcon sx={{ mr: 1 }} />, to: '/segmentation' },
  { label: 'Audience', icon: <ContactsIcon sx={{ mr: 1 }} />, to: '/audience' },
  { label: 'AI Suggestion', icon: <LightbulbIcon sx={{ mr: 1 }} />, to: '/ai-suggestion' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    localStorage.removeItem('google_token');
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'linear-gradient(90deg, #e0f2fe 0%, #f6fafd 100%)',
        boxShadow: '0 4px 24px 0 rgba(26, 115, 232, 0.08)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e3eafc',
        color: '#1a237e',
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 6 } }}>
        {/* Logo / App Name */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            fontWeight: 900,
            letterSpacing: 1,
            color: '#1a73e8',
            textDecoration: 'none',
            mr: 4,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          XCRM
        </Typography>
        {/* Nav Links */}
        <Stack direction="row" spacing={2} sx={{ flex: 1, justifyContent: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.to}
              startIcon={item.icon}
              sx={{
                fontWeight: 700,
                color: location.pathname === item.to ? '#1976d2' : '#222',
                background: location.pathname === item.to ? 'rgba(26,115,232,0.08)' : 'transparent',
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontSize: 16,
                boxShadow: location.pathname === item.to ? '0 2px 8px 0 rgba(26,115,232,0.08)' : 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(26,115,232,0.12)',
                  color: '#1976d2',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
        {/* Logout */}
        <Box sx={{ ml: 2 }}>
          <Tooltip title="Logout">
            <IconButton color="primary" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 