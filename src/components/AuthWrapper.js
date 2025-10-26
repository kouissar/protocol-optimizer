import React, { useState } from 'react';
import { Box, Container, Typography, CircularProgress, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🧬 Multi-Expert Protocol Optimizer
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: 400,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Optimize your daily routine with protocols from top health and performance experts
          </Typography>
        </Box>

        {/* Legal Disclaimer */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            ⚠️ Important Disclaimer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Educational Purpose Only:</strong> This application is designed for educational and informational purposes only. The protocols and recommendations featured are based on publicly available information from health and wellness experts.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Not Medical Advice:</strong> This app does not provide medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals before making any significant changes to your health routine, especially if you have existing medical conditions.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Expert Attribution:</strong> Protocols are inspired by the work of Andrew Huberman, Peter Attia, Wim Hof, and other wellness experts. We do not claim ownership of their methodologies and recommend consulting their original sources for comprehensive information.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Use at Your Own Risk:</strong> Individual results may vary. The developers are not responsible for any adverse effects from following these protocols. Use this app responsibly and listen to your body.
          </Typography>
        </Paper>

        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </Container>
    </Box>
  );
};

export default AuthWrapper;
