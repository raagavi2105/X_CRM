import * as React from 'react';
import { Drawer, Box, IconButton, Tooltip, Stack, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ContactsIcon from '@mui/icons-material/Contacts';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const sidebarWidth = 72;

const navItems = [
  { label: 'Home', icon: <HomeIcon />, to: '/' },
  { label: 'Campaigns', icon: <CampaignIcon />, to: '/campaigns' },
  { label: 'Segmentation', icon: <GroupWorkIcon />, to: '/segmentation' },
  { label: 'Audience', icon: <ContactsIcon />, to: '/audience' },
  { label: 'AI Suggestion', icon: <LightbulbIcon />, to: '/ai-suggestion' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('google_token');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          boxSizing: 'border-box',
          background: '#1976d2',
          color: '#fff',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        },
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* XCRM Logo/Name */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <Tooltip title="XCRM" placement="right">
            <Box sx={{ fontWeight: 900, fontSize: 22, letterSpacing: 1, color: '#fff', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
              XCRM
            </Box>
          </Tooltip>
        </Box>
        {/* Hamburger Button (for design/future expansion) */}
        
        <Divider sx={{ width: 32, bgcolor: 'rgba(255,255,255,0.15)', mb: 2 }} />
        {/* Nav Icons */}
        <Stack spacing={2} alignItems="center">
          {navItems.map((item) => (
            <Tooltip title={item.label} placement="right" key={item.label}>
              <IconButton
                component={Link}
                to={item.to}
                sx={{
                  color: location.pathname === item.to ? '#1976d2' : '#fff',
                  background: location.pathname === item.to ? '#fff' : 'transparent',
                  boxShadow: location.pathname === item.to ? '0 2px 8px 0 rgba(26,115,232,0.08)' : 'none',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.12)',
                    color: '#90caf9',
                  },
                  width: 44,
                  height: 44,
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Box>
      {/* Logout at the bottom */}
      <Box sx={{ mb: 1 }}>
        <Tooltip title="Logout" placement="right">
          <IconButton color="inherit" onClick={handleLogout} sx={{ color: '#fff' }}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
