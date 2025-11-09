import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, AppBar, Toolbar, Typography, Tabs, Tab, Paper, IconButton, Menu, MenuItem, Avatar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AccountCircle, Logout, DeleteOutline } from '@mui/icons-material';
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
// In production (served from same server), use empty string for relative URLs
// In development, use the API URL from env or default to localhost
const apiUrl = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
axios.defaults.baseURL = apiUrl;

const AppContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { user, loading, logout, updateUser } = useAuth();

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

  const handleDeleteDataClick = () => {
    setDeleteDialogOpen(true);
    setDeleteError(null);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    if (!deleteLoading) {
      setDeleteDialogOpen(false);
      setDeleteError(null);
    }
  };

  const handleDeleteDataConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const response = await axios.delete('/api/user/data');
      
      // Refresh user data from server to ensure consistency
      const userResponse = await axios.get('/api/auth/me');
      updateUser(userResponse.data.user);
      
      setDeleteDialogOpen(false);
      setDeleteLoading(false);
      
      // Show success message
      alert('Your data has been deleted successfully. Your account is still active.');
    } catch (error) {
      console.error('Error deleting user data:', error);
      console.error('Error response:', error.response);
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to delete data. Please try again.';
      
      setDeleteError(errorMessage);
      setDeleteLoading(false);
    }
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
      
      const updatedProtocols = [...user.protocols, response.data.protocol];
      updateUser({ ...user, protocols: updatedProtocols });
    } catch (error) {
      console.error('Error adding protocol:', error);
    }
  };

  const removeProtocolFromWall = async (protocolId) => {
    try {
      await axios.delete(`/api/user/protocols/${protocolId}`);
      
      const updatedProtocols = user.protocols.filter(p => p.protocolId !== protocolId);
      updateUser({ ...user, protocols: updatedProtocols });
    } catch (error) {
      console.error('Error removing protocol:', error);
    }
  };

  const toggleProtocolCompletion = async (protocolId, date, notes) => {
    try {
      const normalizedDate = date instanceof Date ? date.toISOString() : date;
      const response = await axios.post(`/api/user/protocols/${protocolId}/completion`, { date: normalizedDate, notes });
      
      const updatedProtocols = user.protocols.map(p => 
        p.protocolId === protocolId ? response.data.protocol : p
      );
      updateUser({ ...user, protocols: updatedProtocols });
    } catch (error) {
      console.error('Error toggling protocol completion:', error);
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
              <MenuItem onClick={handleDeleteDataClick}>
                <DeleteOutline sx={{ mr: 1 }} />
                Delete My Data
              </MenuItem>
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
                onToggleProtocolCompletion={toggleProtocolCompletion}
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

      {/* Delete Data Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete My Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete all your data? This will permanently remove:
            <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
              <li>All protocols you've added to your wall</li>
              <li>All progress tracking data</li>
              <li>All completion history</li>
            </ul>
            <strong>Your account will remain active.</strong> You can continue using the app, but all your previous data will be gone. This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteDataConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : <DeleteOutline />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete My Data'}
          </Button>
        </DialogActions>
      </Dialog>
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