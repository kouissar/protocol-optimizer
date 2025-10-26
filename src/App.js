import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, AppBar, Toolbar, Typography, Tabs, Tab, Paper, IconButton, Menu, MenuItem, Avatar, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AccountCircle, Logout } from '@mui/icons-material';
import axios from 'axios';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtocolLibrary from './components/ProtocolLibrary';
import UserWall from './components/UserWall';
import ProgressTracking from './components/ProgressTracking';
import AuthWrapper from './components/AuthWrapper';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

// Set up axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AppContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, loading, logout, updateUserProtocols } = useAuth();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const addProtocolToWall = async (protocol) => {
    try {
      const response = await axios.post('/api/user/protocols', {
        protocolId: protocol.id,
        title: protocol.title,
        description: protocol.description,
        category: protocol.category,
        difficulty: protocol.difficulty,
        timeRequired: protocol.timeRequired,
        frequency: protocol.frequency,
        benefits: protocol.benefits,
        instructions: protocol.instructions
      });
      
      // Update local state
      const updatedProtocols = [...user.protocols, response.data.protocol];
      updateUserProtocols(updatedProtocols);
    } catch (error) {
      console.error('Error adding protocol:', error);
    }
  };

  const removeProtocolFromWall = async (protocolId) => {
    try {
      await axios.delete(`/api/user/protocols/${protocolId}`);
      
      // Update local state
      const updatedProtocols = user.protocols.filter(p => p.protocolId !== protocolId);
      updateUserProtocols(updatedProtocols);
    } catch (error) {
      console.error('Error removing protocol:', error);
    }
  };

  const updateProtocolProgress = async (protocolId, progress) => {
    try {
      const response = await axios.put(`/api/user/protocols/${protocolId}/progress`, progress);
      
      // Update local state
      const updatedProtocols = user.protocols.map(p => 
        p.protocolId === protocolId ? response.data.protocol : p
      );
      updateUserProtocols(updatedProtocols);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                🧬 Multi-Expert Protocol Optimizer
              </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="inherit">
              Welcome, {user.name}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenuClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Paper elevation={1} sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ 
                '& .MuiTab-root': { 
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 2
                } 
              }}
            >
              <Tab label="📚 Protocol Library" />
              <Tab label="🏠 My Wall" />
              <Tab label="📊 Progress" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <ProtocolLibrary 
                onAddProtocol={addProtocolToWall}
                userProtocols={user.protocols}
              />
            )}
            {selectedTab === 1 && (
              <UserWall 
                protocols={user.protocols}
                onRemoveProtocol={removeProtocolFromWall}
                onUpdateProgress={updateProtocolProgress}
              />
            )}
            {selectedTab === 2 && (
              <ProgressTracking protocols={user.protocols} />
            )}
          </Box>
        </Paper>
        
        {/* Footer Disclaimer */}
        <Box sx={{ mt: 4, mb: 2, px: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', fontStyle: 'italic' }}>
            ⚠️ This app is for educational purposes only. Not medical advice. Consult healthcare professionals before making health changes.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;