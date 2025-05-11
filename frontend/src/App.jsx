import Sidebar from './components/Sidebar';
import CampaignsTable from './components/CampaignsTable';
import HomePage from './components/HomePage';
import AudienceTable from './components/AudienceTable';
import SegmentationPage from './components/SegmentationPage';
import AISuggestionPage from './components/AISuggestionPage';
import LoginPage from './components/LoginPage';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

const patternBg = `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="white"/><rect x="20" width="1" height="40" fill="%23e0e7ef"/><rect y="20" width="40" height="1" fill="%23e0e7ef"/></svg>')`;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
              <Sidebar />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box component="main" sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  p: 4,
                  background: `${patternBg}, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
                  minHeight: '100vh',
                  backgroundBlendMode: 'overlay',
                }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/campaigns" element={<CampaignsTable />} />
                    <Route path="/segmentation" element={<SegmentationPage />} />
                    <Route path="/audience" element={<AudienceTable />} />
                    <Route path="/ai-suggestion" element={<AISuggestionPage />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;